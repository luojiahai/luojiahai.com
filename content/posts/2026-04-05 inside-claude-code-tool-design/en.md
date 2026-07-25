---
title: "Inside Claude Code: Tool Design"
slug: inside-claude-code-tool-design
lang: en
date: "2026-04-05"
updated: "2026-07-25"
categories:
  - ai
description: "How Claude Code's 40+ built-in tools are registered, deferred, and locked down with fail-closed defaults."
keywords:
  - Claude Code
  - Tools
---

_Based on the source of Claude Code v2.1.88._

The tool system is where a lot of Claude Code's safety and performance thinking lives. Every default, every sort order, every conditional import is a decision with a reason behind it.

## The registry problem nobody talks about

There are 40+ built-in tools registered in `tools.ts` via `getAllBaseTools()`. The comment above that function:

```typescript
/**
 * NOTE: This MUST stay in sync with https://console.statsig.com/...
 * in order to cache the system prompt across users.
 */
```

Tool registration is a cost concern, not a feature concern. The system prompt is cached globally across users, and if the tool list drifts from what Statsig expects, that cache breaks and every user pays the token bill. That constraint only shows up at scale, and the comment is there because someone learned it the hard way.

## Ant-native builds

There is a conditional in the list:

```typescript
...(hasEmbeddedSearchTools() ? [] : [GlobTool, GrepTool]),
```

Anthropic's internal builds embed `bfs` and `ugrep` into the Bun binary using an argv0 aliasing trick, so the same binary runs as different programs depending on how it is invoked. When those native tools are present, the shell already aliases `find` and `grep` to them, which makes the dedicated `GlobTool` and `GrepTool` redundant. They are dropped from the registry entirely.

`process.env.USER_TYPE === 'ant'` gates a `ConfigTool` and a `TungstenTool` for Anthropic employees. The `BashTool` also carries an `ANT_ONLY_COMMAND_ALLOWLIST` covering `gh` for GitHub API access and `aki`, Anthropic's internal knowledge-base CLI. Anthropic uses Claude Code to build Claude Code, which explains a lot about how the codebase feels.

## Compile-time dead code elimination

Many tools are not merely disabled at runtime. They are absent from the distributed binary:

```typescript
const SleepTool =
  feature("PROACTIVE") || feature("KAIROS") ? require("./tools/SleepTool/SleepTool.js").SleepTool : null;

const WebBrowserTool = feature("WEB_BROWSER_TOOL")
  ? require("./tools/WebBrowserTool/WebBrowserTool.js").WebBrowserTool
  : null;
```

`feature()` comes from `bun:bundle`. It is a compile-time define the bundler evaluates statically, eliminating dead branches from the output. An external build sees the null branch.

## ToolSearch: deferred schema loading

When a user has many MCP plugins connected, Claude Code does not put every tool's full schema in the API `tools` parameter. It sends a compact list of names and one-line descriptions, lets the model pick what it needs, then loads full definitions on demand via `tool_reference` blocks, a beta content type the API expands server-side.

Auto mode only defers when the deferred tools exceed 10% of the context window. It tries an exact count through the token-counting API first, then falls back to a character heuristic of 2.5 chars per token. Haiku models do not support `tool_reference` blocks, so tool search is disabled for them regardless.

The search itself has four paths. `select:tool_name` does a direct lookup. A query starting with `mcp__` does a server-prefix match. Terms prefixed with `+` become required and pre-filter the candidate set. Everything else goes through weighted keyword scoring:

| Signal                                | Score (MCP) | Score (built-in) |
| ------------------------------------- | ----------- | ---------------- |
| Exact part match in name              | 12          | 10               |
| Partial part match in name            | 6           | 5                |
| `searchHint` field match              | 4           | 4                |
| Description word boundary match       | 2           | 2                |
| Full name fallback (no parts matched) | 3           | 3                |

Each tool can declare a `searchHint`, which `Tool.ts` documents as a 3 to 10 word capability phrase that should "prefer terms not already in the tool name". `NotebookEditTool` hints `edit Jupyter notebook cells (.ipynb)`, catching "jupyter" and "ipynb", neither of which appears in the tool name. `GrepTool` hints `search file contents with regex (ripgrep)`. `AgentTool` hints `delegate work to a subagent`.

## Cache stability through partition sorting

The full tool pool is assembled with a specific sort order:

```typescript
export function assembleToolPool(permissionContext, mcpTools): Tools {
  const builtInTools = getTools(permissionContext);
  const allowedMcpTools = filterToolsByDenyRules(mcpTools, permissionContext);

  // Sort each partition separately to keep built-ins as a contiguous prefix.
  // The server places a global cache breakpoint after the last built-in tool.
  // Interleaving MCP tools would invalidate all downstream cache keys
  // whenever an MCP tool sorts between existing built-ins.
  const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name);
  return uniqBy([...builtInTools].sort(byName).concat(allowedMcpTools.sort(byName)), "name");
}
```

Built-ins sort within their partition, MCP tools within theirs, then they are concatenated. The server places a cache breakpoint after the last built-in. A flat alphabetical sort would let every new MCP server connection shift that breakpoint and bust all downstream cache keys.

## Fail-closed defaults

Each tool is created through a `buildTool` factory:

```typescript
const TOOL_DEFAULTS = {
  isEnabled: () => true,
  isConcurrencySafe: (_input?: unknown) => false,
  isReadOnly: (_input?: unknown) => false,
  isDestructive: (_input?: unknown) => false,
  checkPermissions: (input, _ctx) => Promise.resolve({ behavior: "allow", updatedInput: input }),
  toAutoClassifierInput: () => "",
  userFacingName: (_input?: unknown) => "",
};
```

The source comment says "fail-closed where it matters". Both `isConcurrencySafe` and `isReadOnly` default to `false`. Forget to declare a tool read-only and the system treats it as a write and blocks concurrent execution.

Fail-closed is a badge-access door: no badge, no entry. Fail-open is a lobby anyone can walk into. For tools with full access to your codebase, defaulting to deny is the only sensible choice.

`toAutoClassifierInput` also defaults to an empty string, which skips the auto-classifier entirely. The comment calls out that security-sensitive tools must override it.

## Concurrency as a first-class concern

`isConcurrencySafe` is not a hint. It drives execution. `toolOrchestration.ts` partitions each turn's tool calls into batches:

```typescript
function partitionToolCalls(toolUseMessages, toolUseContext): Batch[] {
  return toolUseMessages.reduce((acc, toolUse) => {
    const isConcurrencySafe = tool?.isConcurrencySafe(parsedInput);
    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {
      acc[acc.length - 1].blocks.push(toolUse); // extend current safe batch
    } else {
      acc.push({ isConcurrencySafe, blocks: [toolUse] }); // new batch
    }
    return acc;
  }, []);
}
```

Consecutive safe calls batch and run together, up to `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` (default 10). A single unsafe call breaks the chain, forms its own serial batch, and the system waits for it before re-evaluating.

So `[Read A, Read B, Write C, Read D]` becomes: A and B in parallel, wait for C, then D. The partitioning falls out of tool declarations alone.

## BashTool's allowlist: security through exhaustion

`BashTool`'s `isReadOnly` classification runs through `readOnlyValidation.ts`, an allowlist of 30+ commands with explicit safe-flag declarations. The comments are where it gets interesting:

```typescript
tree: {
  safeFlags: { '-L': 'number', '-a': 'none', /* ... */ },
  // SECURITY: -R REMOVED. tree -R writes 00Tree.html to every subdirectory.
},
ps: {
  // Block BSD-style 'e' which shows environment variables
  additionalCommandIsDangerousCallback: (_rawCmd, args) =>
    args.some(a => !a.startsWith('-') && /^[a-zA-Z]*e[a-zA-Z]*$/.test(a)),
},
```

`tree -R` is blocked because combined with `-H` and `-L` it silently writes `00Tree.html` into every subdirectory at the depth boundary. `ps e` is blocked because it dumps environment variables for all processes. `fd -l/--list-details` is excluded because it shells out to `ls` internally, which is a PATH hijacking risk.

There is also a blanket `$` rejection: any argument token containing `$` is unsafe. The reason is parser differentials. The validator reads `git diff "$Z--output=/tmp/pwned"` as a positional argument starting with `$`. Bash reads `--output=/tmp/pwned` after expansion. The allowlist cannot validate what it cannot see, so the only safe answer is rejection.

## The Takeaway

The theme is consistent. The safe path is the easy path, the unsafe path takes explicit work, and the catastrophic path is blocked architecturally rather than by policy.

That distinction matters more than it looks. Policy blocks get bypassed. Architecture does not.
