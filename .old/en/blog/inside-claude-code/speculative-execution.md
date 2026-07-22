---
description: "Claude Code speculatively runs your predicted next turn while you're idle, then commits it if you accept."
date: "2026-05-03"
tags: ["Claude Code", "Performance"]
---

# Inside Claude Code: Speculative Execution

CPUs have done this for decades. When a branch is pending, guess which way it goes and start executing down that path. If the guess was right, the work is already done. If it was wrong, throw it away. Claude Code does the same thing — at the granularity of an entire agent turn.

The mechanism lives in `services/PromptSuggestion/speculation.ts`, and it's gated to Anthropic-internal builds, so this is a look at an unreleased optimization rather than something running on your machine today:

```typescript
// speculation.ts
export function isSpeculationEnabled(): boolean {
  return process.env.USER_TYPE === "ant" && (getGlobalConfig().speculationEnabled ?? true);
}
```

## Guessing the next prompt

The branch predictor here is the prompt-suggestion system — the ghosted autocomplete that proposes your likely next message. The moment it produces a suggestion, speculation fires on it:

```typescript
// promptSuggestion.ts
if (isSpeculationEnabled() && result.suggestion) {
  void startSpeculation(result.suggestion, context, ...);
}
```

`startSpeculation` forks an agent (`runForkedAgent`) that runs the _suggested_ prompt as if you'd already sent it. The fork reuses the parent conversation's cached prompt prefix via `cacheSafeParams`, so it doesn't pay a cold start, and it runs with `skipTranscript: true` so a guess that gets discarded never pollutes your session log.

Each guess is tagged with the **completion boundary** it started from — a discriminated union of the four moments where the agent goes quiet and you're most likely to type next:

```typescript
type CompletionBoundary =
  | { type: "complete"; completedAt: number; outputTokens: number }
  | { type: "bash"; command: string; completedAt: number }
  | { type: "edit"; toolName: string; filePath: string; completedAt: number }
  | { type: "denied_tool"; toolName: string; detail: string; completedAt: number };
```

## The overlay sandbox

Here's the part that makes speculative _side effects_ safe. A speculated turn might call `Edit` or `Write` — but touching your actual files based on a guess would be reckless. So every write is redirected into a per-process, per-speculation overlay directory:

```typescript
// speculation.ts
function getOverlayPath(id: string): string {
  return join(getClaudeTempDir(), "speculation", String(process.pid), id);
}
```

The fork's `canUseTool` hook does the gating. Read-only tools run freely; write tools only proceed if the current permission mode would auto-accept them anyway (acceptEdits, bypass, or plan-with-bypass). If a write would otherwise need your approval, speculation simply _stops there_ — it won't guess past a decision that's yours to make.

```typescript
const WRITE_TOOLS = new Set(["Edit", "Write", "NotebookEdit"]);
const SAFE_READ_ONLY_TOOLS = new Set(["Read", "Glob", "Grep", "ToolSearch", "LSP", "TaskGet", "TaskList"]);
```

Two more guards bound the blast radius: a speculation runs at most `MAX_SPECULATION_TURNS = 20` turns and `MAX_SPECULATION_MESSAGES = 100` messages before it stops on its own.

## Commit on accept, discard on divergence

This is the branch-resolution step. While you sit looking at the suggestion, one of two things happens.

**You type something else.** The instant your input diverges from the guess, the speculation is killed and its overlay deleted:

```typescript
// PromptInput.tsx — on any keystroke
abortPromptSuggestion();
abortSpeculation(setAppState);
```

**You accept the suggestion and submit.** The guess was right. `acceptSpeculation` injects the already-computed messages into the real conversation, copies the overlay's written files into your working directory, then removes the overlay:

```typescript
// speculation.ts — acceptSpeculation
if (cleanMessageCount > 0) {
  await copyOverlayToMain(overlayPath, writtenPathsRef.current, getCwdState());
}
safeRemoveOverlay(overlayPath);
```

`copyOverlayToMain` walks only the paths the speculation actually touched (`writtenPathsRef`) and copies them out of the overlay — so a correct guess materializes its edits, and a wrong one leaves nothing behind.

## Counting the winnings

Because the whole point is latency, the system measures exactly how much it saved. On accept, it computes the wall-clock gap between when speculation started and when the work completed:

```typescript
timeSavedMs = Math.min(acceptedAt, boundary?.completedAt ?? Infinity) - startTime;
```

That number is accumulated into a per-session `speculationSessionTimeSavedMs`, surfaced in the UI as a quiet `+1.4s saved`, and written to the transcript as a `speculation-accept` event. There's even a _pipelined_ mode that speculates the prompt _after_ the one it's already speculating — guessing two turns ahead.

## The Takeaway

Speculative execution is one of the oldest tricks in computer architecture, and it transfers cleanly to agents because the shape of the problem is identical: a high-latency operation, a predictable-enough next step, and a cheap way to undo a wrong guess. The cleverness isn't the idea — it's the _undo_. An overlay filesystem for tentative writes, a permission gate that refuses to speculate past your decisions, `skipTranscript` so discarded guesses leave no trace, and child abort controllers that tear the whole thing down on a single keystroke.

Get the rollback right and speculation is free latency. Get it wrong and you've corrupted a working tree on a hunch. Most of the code here is spent on the rollback.
