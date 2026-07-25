---
title: "Inside Claude Code: Overview"
slug: inside-claude-code-overview
lang: en
date: "2026-04-01"
updated: "2026-07-25"
categories:
  - ai
description: "An end-to-end tour of Claude Code's architecture, and why it's all fundamentals rather than secret sauce."
keywords:
  - Claude Code
  - Architecture
---

_Based on the source of Claude Code v2.1.88._

Claude Code is 512,664 lines of TypeScript. The client covers the agent loop, 40+ built-in tools, system prompt assembly, a three-tier memory system, context compression, and a permission layer, plus a handful of unreleased features.

It runs on React Ink, which renders terminal UIs with React. That is a large part of why the CLI feels smoother than most terminal tools.

Six layers:

1. **CLI and UI**: everything you see in the terminal
2. **Agent loop**: where decisions originate
3. **Tool system**: 40+ built-in tools plus MCP extensions
4. **Memory**: solving "the AI forgets everything"
5. **Context compression**: keeping token costs down
6. **Permission and security**: holding the rest accountable

## The Agent Loop

Modern AI coding tools are autonomous agents that plan and execute across many steps. You might expect an orchestration framework underneath.

Open `query.ts` and you find a `while(true)` loop.

```typescript
// query.ts
while (true) {
  // 1. Compress context
  // 2. Call the model, stream the response
  // 3. Parse tool calls
  // 4. Execute tools, collect results
  // 5. Append results to history
  // 6. No new tool calls? exit. Otherwise continue
}
```

Each iteration compresses context, calls the model, and checks the response for tool calls. If there are any, it runs them, appends the results, and loops. When there are none, the task is done.

This is the ReAct pattern: think, act, observe, think again.

## Tool Design

The 40+ built-in tools are registered in `tools.ts`. Registration is a cost concern, not just a feature concern. The list must stay in sync with the Statsig config, or the globally cached system prompt breaks for everyone.

When a user has many MCP plugins connected, Claude Code does not put every tool's full schema in the API `tools` parameter. It sends a compact list of names and one-line descriptions, lets the model pick, then loads full definitions on demand.

Every tool is built with fail-closed defaults. `isConcurrencySafe` and `isReadOnly` both default to `false`. Forget to declare a tool read-only and the system treats it as a write and blocks concurrent execution. No badge, no entry.

```typescript
// Tool.ts
const TOOL_DEFAULTS = {
  isEnabled: () => true,
  isConcurrencySafe: () => false, // assume not safe
  isReadOnly: () => false, // assume writes
  isDestructive: () => false,
  toAutoClassifierInput: () => "", // skip classifier; security-relevant tools must override
};
```

## Read/Write Concurrency Separation

When the model wants to read three files and edit one, `toolOrchestration.ts` separates them. Consecutive concurrency-safe tools run in parallel. The first unsafe operation waits for everything before it to finish.

`isConcurrencySafe` and `isReadOnly` are independent. A tool can be one without the other, and parallelism is controlled by `isConcurrencySafe` alone. `AgentTool` is the clearest case: it declares itself concurrency-safe and never declares itself read-only, so subagents that write files still fan out in parallel. `TaskCreate`, `TaskUpdate`, and `TaskStop` have the same shape.

Fail-closed shows up again here. If the safety check throws, that counts as unsafe. If input parsing fails, also unsafe. The concurrency cap defaults to 10 and is configurable by env var.

## System Prompt Cache Splitting

Anthropic's API caches prompt prefixes. Keep the start of your system prompt constant across requests and it gets reused, skipping reprocessing and cutting costs.

Claude Code splits the system prompt at a `DYNAMIC_BOUNDARY` marker. Above it is static: role, behavior rules, tool instructions. Below it is dynamic: timestamp, git state, CLAUDE.md.

```typescript
// constants/prompts.ts
sections = [
  // Static (shared cache across all users)
  getSimpleIntroSection(),
  getUsingYourToolsSection(enabledTools),
  // ...
  SYSTEM_PROMPT_DYNAMIC_BOUNDARY, // === do not move or remove ===
  // Dynamic (per-user, not cached)
  ...resolvedDynamicSections, // current time, git state, CLAUDE.md, MCP tools
];
```

Mix dynamic content into the static section and you invalidate the cache for everyone. The codebase carries cross-file warnings to keep the boundary coordinated. At real call volume, this pattern makes a measurable dent in API costs.

## Retrieval: Grep Over RAG

The model has no native memory of your codebase. The standard fix is RAG: embed the project, retrieve similar chunks, feed them in.

Claude Code does not use RAG. For memory search and conversation history search, it uses `grep`.

```typescript
// memdir/memdir.ts
const memSearch = `grep -rn "<search term>" ${autoMemDir} --include="*.md"`;
const transcriptSearch = `grep -rn "<search term>" ${projectDir}/ --include="*.jsonl"`;
```

The bet is that letting the agent decide what to search for beats a pre-packaged bundle, and that the gap widens as models improve. Grep also has no index to expire, no vector database to run, and an order of magnitude less complexity.

## Three-Tier Memory

Anyone who has used an AI coding tool long enough has hit the wall where the model starts contradicting itself. Claude Code answers with tiered memory.

**Tier 1: MEMORY.md (hot)** loads into context every turn. Hard capped at 200 lines and 25KB. It stores pointers, not content. On truncation the model is told the index is incomplete, so it does not silently work from partial information.

```typescript
// memdir/memdir.ts
export const MAX_ENTRYPOINT_LINES = 200;
export const MAX_ENTRYPOINT_BYTES = 25_000;
```

**Tier 2: Topic files (warm)** hold coding preferences, architectural decisions, and known pitfalls. Once per user turn, a Sonnet sidecar call picks up to 5 files relevant to the query. Documentation for a tool already in use is skipped, but its known issues are always loaded.

```typescript
// memdir/findRelevantMemories.ts
const SELECT_MEMORIES_SYSTEM_PROMPT = `You are selecting memories that will be
useful to Claude Code as it processes a user's query.
Return a list of filenames for the memories that will clearly be useful (up to 5).
- If a list of recently-used tools is provided, do not select memories that are
  usage reference or API documentation for those tools.
- DO still select memories containing warnings, gotchas, or known issues about
  those tools.`;
```

Memory never stores code. Code changes and memory does not auto-update, so memory tracks preferences and judgments while code facts are read from source in real time.

**Tier 3: Conversation history (cold)** lives in `.jsonl` files, searched by grep when needed.

Hot stays resident. Warm is selected per turn. Cold is searched.

## Five-Level Context Compression

Long sessions with many tool results burn tokens fast. Claude Code applies five strategies, lightest to heaviest:

1. **Snip**: strip old tool results down to structure
2. **Microcompact**: offload large tool results to a cache
3. **Context Collapse**: summarize intermediate conversation
4. **Autocompact**: full summary compression at a token threshold
5. **Reactive Compact**: emergency fallback on an API 413

There is also a circuit breaker. On 2026-03-10 they measured 1,279 sessions with 50+ consecutive compression failures, the worst hitting 3,272 retries in one session, wasting roughly 250,000 API calls per day globally. The fix: stop after 3 consecutive failures.

## Security Layer

`--dangerously-skip-permissions` (YOLO mode) bypasses every permission check, the AI classifier included. The classifier runs in `--permission-mode auto`, a separate mode where a second model reviews each action.

```typescript
// utils/permissions/yoloClassifier.ts, runs in auto mode, not bypass mode
export async function classifyYoloAction(
  messages: Message[], // full conversation history
  action: TranscriptEntry, // the action being evaluated
  tools: Tools,
  context: ToolPermissionContext,
  signal: AbortSignal,
): Promise<YoloClassifierResult>;
// YoloClassifierResult: { shouldBlock: boolean; reason: string }
```

That is one checkpoint. Before a tool call runs it passes Zod schema validation, custom input validation, pre-tool hooks, and permission resolution, which for Bash means the 23 bash security rules. The most restrictive result wins.

```typescript
// tools/BashTool/bashSecurity.ts
const BASH_SECURITY_CHECK_IDS = {
  INCOMPLETE_COMMANDS: 1, // commands starting with tab or dash
  JQ_SYSTEM_FUNCTION: 2, // jq system() calls
  SHELL_METACHARACTERS: 5,
  IFS_INJECTION: 11,
  UNICODE_WHITESPACE: 18, // parser differential
  ZSH_DANGEROUS_COMMANDS: 20, // zmodload and similar
  // ... 23 total
};
```

## Anti-Distillation and Undercover Mode

Two defenses against capability theft and internal information leakage.

**Anti-distillation.** A competitor could record Claude Code's API traffic and distill a smaller model from the input-output pairs. Anthropic's answer is to opt into fake tool definitions on the request, corrupting the training signal in any captured traffic. It only fires in the official first-party CLI.

**Undercover mode.** When Anthropic employees use Claude Code on open-source projects, this activates automatically and strips all attribution to avoid leaking internal model codenames or project names. There is no force-off. It defaults on for employees and only lifts once the repo is confirmed internal.

```typescript
// utils/undercover.ts
export function isUndercover(): boolean {
  if (process.env.USER_TYPE === "ant") {
    if (isEnvTruthy(process.env.CLAUDE_CODE_UNDERCOVER)) return true;
    // Auto: active unless we've confirmed we're in an internal repo.
    return getRepoClassCached() !== "internal";
  }
  return false;
}
```

## The Takeaway

Read end to end, there is no secret sauce and no novel algorithm. Claude Code is built from things working engineers already know: concurrency control, read/write separation, layered caching, circuit breakers, feature flags.

What is impressive is how carefully those fundamentals are applied to an agent with full access to your codebase. Every decision has a reason. Every default is conservative. Every edge case is handled explicitly.

The fundamentals matter. They always did.
