---
title: "Inside Claude Code: The Agent Loop"
slug: inside-claude-code-the-agent-loop
lang: en
date: "2026-04-03"
categories:
  - ai
description: "The autonomous agent at the heart of Claude Code is, underneath, a single while(true) loop."
keywords:
  - Claude Code
  - Agent Loop
---

Modern AI coding tools aren't simple Q&A anymore. They're autonomous agents that plan and execute across multiple steps. You'd expect that kind of capability to require some sophisticated multi-agent orchestration framework under the hood.

Open `query.ts`, and what you find is a `while(true)` loop.

The public entry point is `query()`, a thin wrapper that delegates immediately to `queryLoop()`. That's where the actual work happens:

```typescript
// query.ts
async function* queryLoop(params: QueryParams, consumedCommandUuids: string[]) {
  let state: State = {
    messages: params.messages,
    toolUseContext: params.toolUseContext,
    autoCompactTracking: undefined,
    maxOutputTokensRecoveryCount: 0,
    hasAttemptedReactiveCompact: false,
    turnCount: 1,
    // ...
  };

  while (true) {
    // 1. Compress context (prevent token explosion)
    // 2. Call the model, stream response
    // 3. Parse tool calls from the response
    // 4. Execute tools, collect results
    // 5. Append results to conversation history
    // 6. If no new tool calls, exit; otherwise continue
  }
}
```

Each iteration: compress context, call the model, check if the response contains `tool_use` blocks. If it does, execute those tools, append the results, loop again. When there are no more tool calls, the task is done.

This is the ReAct pattern (Reasoning + Acting): a tight "think → act → observe → think again" loop. Claude Code is one of the most grounded production implementations of this idea.

But calling it a "simple while loop" undersells it. The loop contains most of what you'd otherwise build a framework for: state machines, error recovery, context management, concurrency, hook systems, and streaming. All inline.

## The State Machine

The loop is actually a state machine. Each iteration is driven by a `State` object:

```typescript
type State = {
  messages: Message[];
  toolUseContext: ToolUseContext;
  autoCompactTracking: AutoCompactTrackingState | undefined;
  maxOutputTokensRecoveryCount: number;
  hasAttemptedReactiveCompact: boolean;
  maxOutputTokensOverride: number | undefined;
  pendingToolUseSummary: Promise<ToolUseSummaryMessage | null> | undefined;
  stopHookActive: boolean | undefined;
  turnCount: number;
  // Why the previous iteration continued. Undefined on first iteration.
  transition: Continue | undefined;
};
```

The key field is `transition`. It records _why_ the previous iteration continued, not just that it did. The loop updates `state = { ... }` at each continue site rather than mutating nine separate variables. State transitions are explicit, atomic, and auditable. Tests can assert which recovery path fired without digging through message contents.

## How It Exits

There are ten distinct exit conditions:

| Reason                | Trigger                                                 |
| --------------------- | ------------------------------------------------------- |
| `completed`           | No tool calls in response, stop hooks passed            |
| `blocking_limit`      | Token count at hard limit                               |
| `prompt_too_long`     | Context too large even after recovery                   |
| `image_error`         | Image size/resize error                                 |
| `model_error`         | API/runtime error                                       |
| `aborted_streaming`   | User interrupted during model streaming                 |
| `aborted_tools`       | User interrupted during tool execution                  |
| `hook_stopped`        | PreToolUse/PostToolUse tool hook prevented continuation |
| `stop_hook_prevented` | Stop hook flagged preventContinuation                   |
| `max_turns`           | Hit configured turn limit                               |

Normal completion (`completed`) is reached only deep in the `!needsFollowUp` branch, after stop hooks pass. Everything else is either an error state or an interruption.

## The Recovery Paths

There are seven distinct continue paths, each tracked in `transition.reason`. Six are recovery or retry mechanisms; one is the normal path:

- `next_turn`: the normal path: tool results collected, loop again
- `max_output_tokens_escalate`: model hit the default 8k output cap; retry the same request at 64k
- `max_output_tokens_recovery`: escalation also hit the cap; inject a meta-message and try again (up to 3 times)
- `collapse_drain_retry`: context too long; drain staged context-collapses and retry
- `reactive_compact_retry`: context too long even after drain; full reactive compaction and retry
- `stop_hook_blocking`: a stop hook returned errors; inject them as user messages and continue
- `token_budget_continuation`: token budget exceeded; inject a nudge message and continue

The `max_output_tokens_recovery` path is particularly interesting. When Claude runs out of output tokens mid-response, the loop doesn't surface the error to the caller. It silently injects a `isMeta: true` user message:

> "Output token limit hit. Resume directly — no apology, no recap of what you were doing. Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces."

Then it loops again. Up to three times. This is entirely transparent to whatever's consuming the generator.

## The Compaction Pipeline

Before every API call, messages flow through up to five compaction stages in sequence:

1. `applyToolResultBudget`: enforces per-message budget on tool result size; replaces oversized content
2. `snipCompact` (feature-gated: `HISTORY_SNIP`): snips old history sections
3. `microcompact`: clears old tool-result content for compactable tools; a cached variant (`CACHED_MICROCOMPACT`) defers the deletes server-side
4. `contextCollapse` (feature-gated: `CONTEXT_COLLAPSE`): collapses old context into summaries
5. `autocompact`: the main full-conversation summarization, triggered by token threshold

The ordering matters. Context-collapse runs before autocompact deliberately: if collapse brings the token count below the autocompact threshold, autocompact becomes a no-op. You preserve granular context instead of summaries whenever possible.

## Parallel Tool Execution

`runTools` in `toolOrchestration.ts` partitions tool calls into batches by concurrency safety. Read-only tools in the same batch run concurrently, up to 10 at a time by default (configurable via `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY`). State-modifying tools run sequentially.

There's also a newer `StreamingToolExecutor` (feature-gated: `streamingToolExecution`) that starts executing tool calls while the model is still streaming. As `tool_use` blocks arrive from the SSE stream, they're dispatched immediately. Completed results are drained back into the conversation before the loop continues. Latency savings for free, basically.

## Stop Hooks

When the model produces a response with no tool calls, the loop doesn't exit immediately. It runs stop hooks, user-configured shell commands that can inspect the response and either:

- Allow continuation
- Block with errors (injected as user messages for another iteration)
- Prevent continuation entirely

The hook feedback path is a second continue mechanism, completely separate from tool execution. A death-spiral guard prevents the reactive compact logic from resetting across stop-hook retries. Someone thought about this enough to put a guard on it.

## The Wizard's Code

Near the top of the file's implementation section, above the type definitions and function bodies that make up the query loop, sits a comment block the engineers apparently call the "Wizard's Code":

```typescript
/**
 * The rules of thinking are lengthy and fortuitous. They require plenty of thinking
 * of most long duration and deep meditation for a wizard to wrap one's noggin around.
 *
 * The rules follow:
 * 1. A message that contains a thinking or redacted_thinking block must be part
 *    of a query whose max_thinking_length > 0
 * 2. A thinking block may not be the last message in a block
 * 3. Thinking blocks must be preserved for the duration of an assistant trajectory
 *    (a single turn, or if that turn includes a tool_use block then also its
 *    subsequent tool_result and the following assistant message)
 *
 * Heed these rules well, young wizard. For they are the rules of thinking,
 * and the rules of thinking are the rules of the universe. If ye does not heed
 * these rules, ye will be punished with an entire day of debugging and hair pulling.
 */
const MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3;
```

Three constraints on how thinking blocks must be handled. Rule 1 covers both `thinking` and `redacted_thinking` blocks; the latter is the encrypted form used when extended thinking is enabled with streaming. The constant defined immediately after, `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3`, is its only neighbor. Whether that proximity is intentional humor or coincidence, no comment was left.

The penalty for ignoring the rules: a full day of debugging and hair pulling. Genuinely can't tell if that's programmer humor or a warning written in the aftermath of experience.

## The Takeaway

The "simple while(true) loop" turns out to contain most of what you'd otherwise build a framework for. State machines, error recovery, context management, concurrency, hook systems, streaming. It's all inline. Sometimes the right abstraction is no abstraction.
