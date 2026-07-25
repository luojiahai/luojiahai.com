---
title: "Inside Claude Code: The Agent Loop"
slug: inside-claude-code-the-agent-loop
lang: en
date: "2026-04-03"
updated: "2026-07-25"
categories:
  - ai
description: "The autonomous agent at the heart of Claude Code is, underneath, a single while(true) loop."
keywords:
  - Claude Code
  - Agent Loop
---

_Based on the source of Claude Code v2.1.88._

Modern AI coding tools are autonomous agents that plan and execute across many steps. You might expect a multi-agent orchestration framework underneath.

Open `query.ts` and you find a `while(true)` loop.

The public entry point `query()` is a thin wrapper that delegates to `queryLoop()`, where the work happens:

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
    // 1. Compress context
    // 2. Call the model, stream the response
    // 3. Parse tool calls
    // 4. Execute tools, collect results
    // 5. Append results to history
    // 6. No new tool calls? exit. Otherwise continue
  }
}
```

Each iteration compresses context, calls the model, and checks the response for `tool_use` blocks. If there are any, it runs them, appends the results, and loops. When there are none, the task is done.

This is the ReAct pattern: think, act, observe, think again. Claude Code is one of the most grounded production implementations of it.

But "simple while loop" undersells it. The loop holds most of what you would otherwise build a framework for: state machines, error recovery, context management, concurrency, hooks, and streaming. All inline.

## The State Machine

Each iteration is driven by a `State` object:

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

The key field is `transition`. It records *why* the previous iteration continued, not just that it did. Each continue site writes `state = { ... }` instead of mutating nine separate variables, so transitions are explicit and atomic. Tests can assert which recovery path fired without reading message contents.

## How It Exits

Ten exit conditions:

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

Everything except `completed` is an error or an interruption. `completed` itself is returned from two places: the normal path deep in the `!needsFollowUp` branch after stop hooks pass, and an early return when the last message is an API error. That second one skips stop hooks on purpose, because hooks evaluating an error response create a death spiral of error, block, retry, error.

## The Recovery Paths

Seven continue paths, each recorded in `transition.reason`. One is normal, six are recovery:

- `next_turn`: tool results collected, loop again
- `max_output_tokens_escalate`: the model hit the capped 8k default, so retry the same request at 64k. Gated behind `tengu_otk_slot_v1`, which defaults to off and is not validated on Bedrock or Vertex
- `max_output_tokens_recovery`: 64k also hit the cap, so inject a meta message and retry, up to 3 times
- `collapse_drain_retry`: context too long, drain staged context-collapses and retry
- `reactive_compact_retry`: still too long after the drain, run full reactive compaction
- `stop_hook_blocking`: a stop hook returned errors, inject them as user messages and continue
- `token_budget_continuation`: token budget exceeded, inject a nudge and continue

`max_output_tokens_recovery` is the interesting one. When Claude runs out of output tokens mid-response, the loop does not surface the error. It injects an `isMeta: true` user message telling the model to resume directly, with no apology and no recap, picking up mid-thought if that is where the cut happened, and breaking the remaining work into smaller pieces. Then it loops again, up to three times. All of this is invisible to whatever is consuming the generator.

## The Compaction Pipeline

Before every API call, messages flow through up to five stages:

1. `applyToolResultBudget`: enforces a per-message budget on tool result size and replaces oversized content
2. `snipCompact` (gated on `HISTORY_SNIP`): snips old history sections
3. `microcompact`: clears old tool-result content for compactable tools. A cached variant (`CACHED_MICROCOMPACT`) defers the deletes server-side
4. `contextCollapse` (gated on `CONTEXT_COLLAPSE`): collapses old context into summaries
5. `autocompact`: full-conversation summarization, triggered by token threshold

The order matters. Context-collapse runs before autocompact deliberately: if collapse brings the count below the autocompact threshold, autocompact becomes a no-op and you keep granular context instead of a summary.

## Parallel Tool Execution

`runTools` in `toolOrchestration.ts` partitions tool calls into batches by concurrency safety. Concurrency-safe tools in a batch run together, up to 10 at a time by default (`CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY`). Everything else runs serially.

There is also a newer `StreamingToolExecutor`, gated on `streamingToolExecution`, that dispatches `tool_use` blocks as they arrive from the SSE stream rather than waiting for the response to finish. Completed results drain back into the conversation before the loop continues.

## Stop Hooks

When the model responds with no tool calls, the loop does not exit immediately. It runs stop hooks, user-configured shell commands that can inspect the response and either allow continuation, block with errors injected as user messages, or prevent continuation entirely.

The hook feedback path is a second continue mechanism, separate from tool execution. A death-spiral guard stops the reactive compact logic resetting across stop-hook retries. Someone thought about this enough to put a guard on it.

## The Wizard's Code

Above the type definitions that make up the query loop sits a comment block the engineers apparently call the Wizard's Code:

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
const MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3
```

Three constraints on handling thinking blocks. Rule 1 covers both `thinking` and `redacted_thinking`, the latter being the encrypted form used when extended thinking runs with streaming. The constant defined immediately after it, `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3`, is its only neighbor.

The stated penalty for ignoring the rules is a full day of debugging and hair pulling. Hard to tell whether that is programmer humor or a warning written in the aftermath of experience.

## The Takeaway

The simple `while(true)` loop turns out to contain most of what you would otherwise build a framework for. State machines, error recovery, context management, concurrency, hooks, streaming, all inline.

Sometimes the right abstraction is no abstraction.
