---
description: "How Claude Code's 40+ built-in tools are registered, deferred, and locked down with fail-closed defaults."
date: "2026-04-05"
tags: ["Claude Code", "Tools"]
---

# Inside Claude Code: Tool Design

The Claude Code tool system is where a lot of the interesting safety and performance thinking lives. Every default, every sort order, every conditional import is a decision with a reason behind it.

## The registry problem nobody talks about

There are 40+ built-in tools registered in `tools.ts` via `getAllBaseTools()`. The comment at the top of that function is interesting:

```typescript
/**
 * NOTE: This MUST stay in sync with https://console.statsig.com/...
 * in order to cache the system prompt across users.
 */
```

Tool registration isn't a feature concern. It's a cost and performance concern. The system prompt is cached globally across users, and if the tool list drifts from what Statsig expects, that cache breaks. Every user pays the token cost. It's the kind of constraint that only shows up when you're operating at scale, and the comment is there because someone learned it the hard way.

## Ant-native builds

There's a conditional in the list:

```typescript
...(hasEmbeddedSearchTools() ? [] : [GlobTool, GrepTool]),
```

Anthropic's internal builds embed `bfs` and `ugrep` directly into the Bun binary using an `argv0` aliasing trick. The same binary runs as different programs depending on how it's invoked. When those faster native tools are present, the shell already has `find` and `grep` aliased to them, making the dedicated `GlobTool` and `GrepTool` redundant. They're dropped from the registry entirely.

There's also `process.env.USER_TYPE === 'ant'` which gates a `ConfigTool` for Anthropic employees. "ant" is the internal code name. The `BashTool` also has an `ANT_ONLY_COMMAND_ALLOWLIST` that includes `gh` for GitHub API access and `aki`, Anthropic's internal knowledge-base CLI. Anthropic uses Claude Code to build Claude Code. That explains a lot about the codebase's feel.

## Compile-time dead code elimination

Many tools don't just get disabled at runtime. They're not present in the distributed binary at all:

```typescript
const SleepTool =
  feature("PROACTIVE") || feature("KAIROS") ? require("./tools/SleepTool/SleepTool.js").SleepTool : null;

const WebBrowserTool = feature("WEB_BROWSER_TOOL")
  ? require("./tools/WebBrowserTool/WebBrowserTool.js").WebBrowserTool
  : null;
```

The `feature()` function comes from `bun:bundle`. It's a compile-time define that the bundler evaluates statically, eliminating dead branches from the output. An external build sees the null branch. Clean.

## ToolSearch: deferred schema loading

When a user has many MCP plugins connected, Claude Code doesn't dump every tool's full schema into the system prompt. Instead it gives the model a compact list of tool names with one-line descriptions, lets the model pick what it needs, then loads the full definitions on demand via `tool_reference` blocks — a beta content type the API expands server-side. Significant token savings.

The auto mode activates tool deferral only when the deferred tools exceed 10% of the context window. It tries an exact token count via the token-counting API first, then falls back to a character-count heuristic (2.5 chars/token). Haiku models don't support `tool_reference` blocks at all, so tool search is disabled for them regardless.

The search itself supports two modes. `select:tool_name` does a direct lookup. Everything else goes through keyword matching with a weighted scoring system:

| Signal                                | Score (MCP) | Score (built-in) |
| ------------------------------------- | ----------- | ---------------- |
| Exact part match in name              | 12          | 10               |
| Partial part match in name            | 6           | 5                |
| `searchHint` field match              | 4           | 4                |
| Description word boundary match       | 2           | 2                |
| Full name fallback (no parts matched) | 3           | 3                |

Each tool can declare a `searchHint`: a 3–10 word curated capability phrase specifically designed for keyword matching. `NotebookEditTool` might hint `jupyter` since that word doesn't appear in the tool name. Smart.

## Cache stability through partition sorting

The full tool pool (built-ins + MCP) is assembled with a specific sort order:

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

Built-ins are sorted within their partition, MCP tools within theirs, then concatenated. The server places a cache breakpoint after the last built-in tool. If MCP tools were interleaved alphabetically, every new MCP server connection would shift that breakpoint and bust all downstream cache keys. This is why you see two-partition sorting instead of one flat alphabetical sort.

## Fail-closed defaults

Each tool is created through a `buildTool` factory with deliberate defaults:

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

The comment in the source says "fail-closed where it matters." Both `isConcurrencySafe` and `isReadOnly` default to `false`. If a tool author forgets to declare "this is read-only," the system treats it as a write operation and blocks concurrent execution.

Fail-closed is like a badge-access door: no badge, no entry. Fail-open is a lobby where anyone can walk in. For AI tools that have full access to your codebase, defaulting to deny is the only sensible choice.

`toAutoClassifierInput` also defaults to an empty string, which skips the auto-classifier check entirely. The comment explicitly calls out that security-sensitive tools must override this. Same philosophy, same discipline.

## Concurrency as a first-class concern

`isConcurrencySafe` isn't just a hint. It drives actual parallel execution. `toolOrchestration.ts` partitions each turn's tool calls into batches:

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

Consecutive safe calls are batched and run concurrently, up to `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` (default 10). A single unsafe call breaks the chain, forms its own serial batch, the system waits for it to finish, then re-evaluates.

So a model issuing `[Read A, Read B, Write C, Read D]` gets: reads A and B in parallel → waits for write C → reads D. The partitioning handles this automatically from tool declarations alone. No extra orchestration logic required.

## BashTool's allowlist: security through exhaustion

`BashTool`'s `isReadOnly` classification depends on a multi-layer command validation system in `readOnlyValidation.ts`. It's an allowlist of 30+ commands with explicit safe-flag declarations, and the comments are where it gets interesting:

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

`tree -R` is blocked because when combined with `-H` (HTML mode) and `-L` (depth limit), it silently writes `00Tree.html` files to every subdirectory at the depth boundary. `ps e` (BSD-style) is blocked because it dumps environment variables for all processes. `fd -l/--list-details` is excluded because it shells out to `ls` internally, creating a PATH hijacking risk.

There's also a blanket `$` rejection: any token containing `$` in the command arguments is treated as unsafe. The reason is parser differentials. The validator sees `git diff "$Z--output=/tmp/pwned"` as a positional argument starting with `$`. Bash sees `--output=/tmp/pwned` after expansion. The allowlist cannot validate what it can't see, so the only safe answer is rejection.

## The Takeaway

The theme across all of this is consistent. The tool system is designed so the safe path is the easy path, the unsafe path requires explicit work, and the catastrophic path is architecturally blocked rather than policy-blocked. That distinction matters more than it might seem. Policy blocks get bypassed. Architecture doesn't.
