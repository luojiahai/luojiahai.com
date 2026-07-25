---
title: "Inside Claude Code: Speculative Execution"
slug: inside-claude-code-speculative-execution
lang: en
date: "2026-05-03"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code speculatively runs your predicted next turn while you're idle, then commits it if you accept."
keywords:
  - Claude Code
  - Performance
---

_Based on the source of Claude Code v2.1.88._

CPUs have done this for decades. When a branch is pending, guess which way it goes and start executing down that path. Right guess, the work is already done. Wrong guess, throw it away. Claude Code does the same thing at the granularity of an entire agent turn.

The mechanism lives in `services/PromptSuggestion/speculation.ts` and is gated to Anthropic-internal builds, so this is an unreleased optimization rather than something running on your machine today:

```typescript
// speculation.ts
export function isSpeculationEnabled(): boolean {
  return process.env.USER_TYPE === "ant" && (getGlobalConfig().speculationEnabled ?? true);
}
```

## Guessing the next prompt

The branch predictor is the prompt-suggestion system, the ghosted autocomplete that proposes your likely next message. The moment it produces a suggestion, speculation fires:

```typescript
// promptSuggestion.ts
if (isSpeculationEnabled() && result.suggestion) {
  void startSpeculation(result.suggestion, context, ...);
}
```

`startSpeculation` forks an agent via `runForkedAgent` that runs the *suggested* prompt as if you had sent it. The fork reuses the parent conversation's cached prompt prefix through `cacheSafeParams`, so it does not pay a cold start, and it runs with `skipTranscript: true` so a discarded guess never pollutes your session log.

Each guess is tagged with the completion boundary it started from, a discriminated union of the four moments where the agent goes quiet and you are most likely to type:

```typescript
type CompletionBoundary =
  | { type: "complete"; completedAt: number; outputTokens: number }
  | { type: "bash"; command: string; completedAt: number }
  | { type: "edit"; toolName: string; filePath: string; completedAt: number }
  | { type: "denied_tool"; toolName: string; detail: string; completedAt: number };
```

## The overlay sandbox

Here is the part that makes speculative *side effects* safe. A speculated turn might call `Edit` or `Write`, and touching your real files on a guess would be reckless. So every write is redirected into a per-process, per-speculation overlay directory:

```typescript
// speculation.ts
function getOverlayPath(id: string): string {
  return join(getClaudeTempDir(), "speculation", String(process.pid), id);
}
```

The fork's `canUseTool` hook does the gating. Read-only tools run freely. Write tools only proceed if the current permission mode would auto-accept them anyway, meaning acceptEdits, bypass, or plan-with-bypass. If a write would need your approval, speculation stops there. It will not guess past a decision that is yours to make.

```typescript
const WRITE_TOOLS = new Set(["Edit", "Write", "NotebookEdit"]);
const SAFE_READ_ONLY_TOOLS = new Set(["Read", "Glob", "Grep", "ToolSearch", "LSP", "TaskGet", "TaskList"]);
```

Two more guards bound the blast radius: a speculation runs at most `MAX_SPECULATION_TURNS = 20` turns and `MAX_SPECULATION_MESSAGES = 100` messages before stopping on its own.

## Commit on accept, discard on divergence

This is branch resolution. While you look at the suggestion, one of two things happens.

**You type something else.** The instant your input diverges, the speculation is killed and its overlay deleted:

```typescript
// PromptInput.tsx, on any keystroke
abortPromptSuggestion();
abortSpeculation(setAppState);
```

**You accept the suggestion and submit.** The guess was right. `acceptSpeculation` injects the already-computed messages into the real conversation, copies the overlay's written files into your working directory, then removes the overlay:

```typescript
// speculation.ts, acceptSpeculation
if (cleanMessageCount > 0) {
  await copyOverlayToMain(overlayPath, writtenPathsRef.current, getCwdState());
}
safeRemoveOverlay(overlayPath);
```

`copyOverlayToMain` walks only the paths the speculation actually touched, tracked in `writtenPathsRef`. A correct guess materializes its edits. A wrong one leaves nothing behind.

## Counting the winnings

Because the point is latency, the system measures what it saved. On accept it computes the wall-clock gap between when speculation started and when the work finished:

```typescript
timeSavedMs = Math.min(acceptedAt, boundary?.completedAt ?? Infinity) - startTime;
```

That accumulates into a per-session `speculationSessionTimeSavedMs`, surfaces in the UI as a quiet `+1.4s saved`, and is written to the transcript as a `speculation-accept` event. There is even a pipelined mode that speculates the prompt after the one it is already speculating, guessing two turns ahead.

## The Takeaway

Speculative execution is one of the oldest tricks in computer architecture, and it transfers cleanly to agents because the problem has the same shape: a high-latency operation, a predictable-enough next step, and a cheap way to undo a wrong guess.

The cleverness is not the idea. It is the undo. An overlay filesystem for tentative writes, a permission gate that refuses to speculate past your decisions, `skipTranscript` so discarded guesses leave no trace, and child abort controllers that tear it all down on a single keystroke.

Get the rollback right and speculation is free latency. Get it wrong and you have corrupted a working tree on a hunch. Most of the code here is spent on the rollback.
