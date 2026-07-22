---
description: "Five compression strategies, applied lightest to heaviest, keep Claude Code's context window from overflowing."
date: "2026-04-15"
tags: ["Claude Code", "Compression"]
---

# Inside Claude Code: Five-Level Context Compression

Context windows have limits. Long sessions with lots of tool call results will burn through tokens fast, and at some point you'll either hit the window ceiling or run up a serious bill.

Claude Code handles this with five compression strategies, applied lightest-to-heaviest. They run in a fixed pipeline on every turn in `query.ts`, before the API call is made:

```
Snip → Microcompact → Context Collapse → Autocompact → [API call] → Reactive Compact
```

Here's what each level actually does.

## 1. Snip

The lightest touch. Feature-flagged via `HISTORY_SNIP`, it strips old tool call result content while keeping the structure intact. Think of it as hollowing out the payload but leaving the envelope.

```typescript
// query.ts
const snipResult = snipModule!.snipCompactIfNeeded(messagesForQuery);
messagesForQuery = snipResult.messages;
snipTokensFreed = snipResult.tokensFreed;
```

One subtle implementation detail: the freed-token estimate is tracked separately (`snipTokensFreed`) and subtracted from the autocompact threshold check. That's because token counting reads cached usage from the surviving assistant message, which still reflects the pre-snip size. Without that correction, autocompact's threshold math would be working off stale numbers.

---

## 2. Microcompact

Still operating on tool results, but with two distinct sub-modes. Both target the same set of compactable tools: Read, Bash/Shell, Grep, Glob, WebSearch, WebFetch, FileEdit, FileWrite.

**Cached Microcompact** (`CACHED_MICROCOMPACT`) is the more sophisticated path. Rather than mutating message content directly, it queues `cache_edits` blocks for the API layer that delete old tool results server-side. The local message array is left untouched, preserving cache hit. Tool deletions are deferred until after the API response so the actual `cache_deleted_input_tokens` from the server can be reported in the boundary message instead of a client-side estimate.

**Time-Based Microcompact** is the simpler path. If the gap since the last assistant message exceeds a configured threshold, the server cache has expired anyway, so it content-clears old tool results directly (mutating messages in place). It also resets cached MC state, since trying to cache-edit tools whose server entries no longer exist would fail.

```typescript
// microCompact.ts
export const TIME_BASED_MC_CLEARED_MESSAGE = "[Old tool result content cleared]";
```

The branching logic makes sense: if the cache is cold, there's nothing to preserve, so the cheaper mutation path is fine.

## 3. Context Collapse

Feature-flagged via `CONTEXT_COLLAPSE`. Internally, `marble_origami` is the ctx-agent that runs this, and the feature is excluded from external builds via feature gating and `excluded-strings.txt`. The key design choice here is non-destructive: rather than collapsing the conversation in place, it builds a projected view. Summary messages live in a separate commit log, not the REPL array, so collapses persist across turns by replaying the log on each `projectView()` call.

It operates on headroom bands. At ~90% context usage it starts committing collapses. At ~95% it switches to a blocking-spawn mechanism.

When Context Collapse is active, it suppresses Autocompact entirely:

```typescript
// autoCompact.ts:215–222
// Autocompact firing at effective-13k (~93%) sits right between collapse's
// commit-start (90%) and blocking (95%), so it would race collapse and
// usually win, nuking granular context that collapse was about to save.
if (feature("CONTEXT_COLLAPSE")) {
  const { isContextCollapseEnabled } =
    require("../contextCollapse/index.js") as typeof import("../contextCollapse/index.js");
  if (isContextCollapseEnabled()) {
    return false;
  }
}
```

The comment explains the reasoning well. Autocompact's threshold (~93%) sits right between Context Collapse's commit band and its blocking threshold. Without suppression, the two systems would race, and Autocompact would usually win by destroying exactly the granular context Collapse was trying to preserve. The dynamic `require` is also deliberate: it breaks an init-time circular dependency between the two modules. Suppression is the right call.

On a real API 413, Context Collapse gets first crack: it drains all staged collapses (`recoverFromOverflow`) before falling through to Reactive Compact.

## 4. Autocompact

Full summary compression, triggered when context usage crosses `effectiveContextWindow − 13,000` tokens. The effective window is already reduced to reserve headroom for summary output:

```
effectiveContextWindow = model_context_window − min(max_output_tokens, 20_000)
autocompactThreshold   = effectiveContextWindow − 13_000
blockingLimit          = effectiveContextWindow − 3_000   // hard cap for manual /compact
```

The 20,000 token reservation is based on p99.99 of compact output being ~17,387 tokens. Planning for tail risk.

Before spinning up the expensive forked-agent summarization, Autocompact first tries **Session Memory Compaction** when both `tengu_session_memory` and `tengu_sm_compact` are on (`sessionMemoryCompact.ts:412–420`). If the session has a continuously-maintained memory extract, that gets used as the summary directly, skipping the API call entirely. It keeps messages after the last summarized message ID, expanding backwards to meet minimums (10K tokens, 5 text-block messages, capped at 40K tokens), respecting tool-use/tool-result pair boundaries.

If session memory isn't available, it falls back to `compactConversation()`, which forks an agent to generate a summary, strips images from the messages (to avoid the compact request itself hitting prompt-too-long), and re-injects recently-read files, plan context, invoked skills, tool delta, and session-start hook results post-compaction. CLAUDE.md is handled separately: `postCompactCleanup.ts` calls `resetGetMemoryFilesCache('compact')`, clearing the cache so CLAUDE.md gets re-read on the next API call's system prompt construction rather than being re-injected as an explicit attachment.

There's also a circuit breaker:

```typescript
// services/compact/autoCompact.ts
// Stop trying autocompact after this many consecutive failures.
// BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272)
// in a single session, wasting ~250K API calls/day globally.
const MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3;
```

On March 10, 2026, they measured 1,279 sessions with 50+ consecutive compression failures, the worst single session failing 3,272 times and still retrying. 250,000 wasted API calls per day globally. The fix: stop after 3 consecutive failures. Classic circuit breaker. The comment with the BQ query date and exact numbers is a nice touch, those kinds of data-backed decisions leave a useful paper trail in source.

## 5. Reactive Compact

Emergency fallback, triggered after the API returns a 413 "prompt too long" error (or a media-size error for oversized images/PDFs). The streaming loop withholds the error message rather than surfacing it immediately, then recovery kicks in:

```typescript
// query.ts:1088–1115
if (
  feature('CONTEXT_COLLAPSE') &&
  contextCollapse &&
  state.transition?.reason !== 'collapse_drain_retry'  // don't re-drain after a failed drain
) {
  // First: drain staged collapses
  const drained = contextCollapse.recoverFromOverflow(messagesForQuery, querySource)
  if (drained.committed > 0) { continue } // retry with drained view
}
if ((isWithheld413 || isWithheldMedia) && reactiveCompact) {
  const compacted = await reactiveCompact.tryReactiveCompact({ ... })
  // ...
}
```

The sequence:

1. Drain all staged Context Collapse commits (`recoverFromOverflow`). Cheap, keeps granular context. The `collapse_drain_retry` guard is key here: it prevents re-draining if a drain already ran and still didn't bring the context under the limit, which would otherwise loop forever.
2. If that doesn't work (or if it already tried), call `tryReactiveCompact` for full summarization on the already-failed messages.

A `hasAttemptedReactiveCompact` flag prevents spiraling. If the post-compact turn also 413s (because the oversized content is in the preserved tail), the error surfaces rather than looping.

## The Takeaway

The five strategies are not strictly mutually exclusive:

- Snip and Microcompact can both run in the same turn.
- Context Collapse replaces Autocompact when active, but Reactive Compact still fires as the last-resort fallback for both.
- Session Memory Compaction is an optimization within Autocompact, not a separate level. It just avoids the expensive summarization call when the session memory already has the content.

The pipeline reads as a well-considered layering of tradeoffs. Cheap and reversible first, expensive and destructive last. Context Collapse's non-destructive projected-view design is the most architecturally interesting piece, specifically because it defers irreversibility as long as possible. The circuit breaker on Autocompact is the most operationally important fix, given the numbers behind it.

The feature-flag-heavy design also suggests this is still actively evolving. The strategies exist because context management is genuinely hard, and the right answer depends on session shape, timing, and what the agent is doing. There's no single right answer.
