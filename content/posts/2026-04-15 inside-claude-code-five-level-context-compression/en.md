---
title: "Inside Claude Code: Five-Level Context Compression"
slug: inside-claude-code-five-level-context-compression
lang: en
date: "2026-04-15"
updated: "2026-07-25"
categories:
  - ai
description: "Five compression strategies, applied lightest to heaviest, keep Claude Code's context window from overflowing."
keywords:
  - Claude Code
  - Compression
---

_Based on the source of Claude Code v2.1.88._

Context windows have limits. Long sessions with many tool results burn tokens fast, and eventually you hit either the ceiling or a serious bill.

Claude Code applies five strategies, lightest to heaviest, in a fixed pipeline that runs every turn in `query.ts` before the API call:

```
Snip -> Microcompact -> Context Collapse -> Autocompact -> [API call] -> Reactive Compact
```

## 1. Snip

The lightest touch. Gated on `HISTORY_SNIP`, it strips old tool result content while keeping the structure. Hollow out the payload, leave the envelope.

```typescript
// query.ts
const snipResult = snipModule!.snipCompactIfNeeded(messagesForQuery);
messagesForQuery = snipResult.messages;
snipTokensFreed = snipResult.tokensFreed;
```

One subtle detail: the freed-token estimate is tracked separately as `snipTokensFreed` and subtracted from the autocompact threshold check. Token counting reads cached usage from the surviving assistant message, which still reflects the pre-snip size, so without that correction autocompact's math would run on stale numbers.

## 2. Microcompact

Still operating on tool results, with two sub-modes. Both target the same compactable tools: Read, Bash/Shell, Grep, Glob, WebSearch, WebFetch, FileEdit, FileWrite.

**Cached Microcompact** (`CACHED_MICROCOMPACT`) is the sophisticated path. Instead of mutating message content, it queues `cache_edits` blocks that delete old tool results server-side. The local message array is untouched, preserving the cache hit. Deletions are deferred until after the API response so the boundary message can report the server's actual `cache_deleted_input_tokens` rather than a client-side estimate.

**Time-Based Microcompact** is the simple path. If the gap since the last assistant message exceeds a threshold, the server cache has expired anyway, so it clears old tool result content directly. It also resets cached MC state, since cache-editing tools whose server entries no longer exist would fail.

```typescript
// microCompact.ts
export const TIME_BASED_MC_CLEARED_MESSAGE = "[Old tool result content cleared]";
```

The branching makes sense: if the cache is cold there is nothing to preserve, so the cheaper mutation path is fine.

## 3. Context Collapse

Gated on `CONTEXT_COLLAPSE`, and ant-only. The module itself is compiled out of external builds, so what is visible from outside is the call sites and the comments around them. Internally `marble_origami` is the ctx-agent that runs it.

The key design choice is that collapse is non-destructive. Rather than collapsing in place, it builds a projected view. Summary messages live in a separate commit log, not the REPL array, so collapses persist across turns by replaying the log on each `projectView()` call.

It operates on headroom bands, committing collapses from around 90% context usage and switching to a blocking spawn at around 95%. When it is active it suppresses Autocompact entirely:

```typescript
// autoCompact.ts:201-219
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

The comment explains it well. Autocompact's threshold sits between Collapse's commit band and its blocking threshold, so without suppression the two would race and Autocompact would usually win by destroying exactly the granular context Collapse was preserving. The dynamic `require` is deliberate too: it breaks an init-time circular dependency between the modules.

On a real API 413, Context Collapse gets first crack. It drains all staged collapses via `recoverFromOverflow` before falling through to Reactive Compact.

## 4. Autocompact

Full summary compression, triggered when usage crosses `effectiveContextWindow - 13,000` tokens. The effective window is already reduced to reserve headroom for the summary output:

```
effectiveContextWindow = model_context_window - min(max_output_tokens, 20_000)
autocompactThreshold   = effectiveContextWindow - 13_000
blockingLimit          = effectiveContextWindow - 3_000   // hard cap for manual /compact
```

The 20,000 token reservation comes from p99.99 of compact output being 17,387 tokens. Planning for tail risk.

Before spinning up the expensive forked-agent summarization, Autocompact first tries **Session Memory Compaction** when both `tengu_session_memory` and `tengu_sm_compact` are on. If the session has a continuously maintained memory extract, that becomes the summary directly and the API call is skipped. It keeps messages after the last summarized message ID, expanding backwards to meet minimums of 10K tokens and 5 text-block messages, capped at 40K tokens, respecting tool-use and tool-result pair boundaries.

Otherwise it falls back to `compactConversation()`, which forks an agent to write a summary, strips images from the messages so the compact request itself does not hit prompt-too-long, and re-injects recently-read files, plan context, invoked skills, tool delta, and session-start hook results afterwards. CLAUDE.md is handled separately: `postCompactCleanup.ts` calls `resetGetMemoryFilesCache('compact')` so it gets re-read on the next system prompt construction rather than re-injected as an attachment.

There is also a circuit breaker:

```typescript
// services/compact/autoCompact.ts
// Stop trying autocompact after this many consecutive failures.
// BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272)
// in a single session, wasting ~250K API calls/day globally.
const MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3;
```

On 2026-03-10 they measured 1,279 sessions with 50+ consecutive compression failures, the worst single session failing 3,272 times and still retrying, wasting roughly 250,000 API calls per day globally. The fix: stop after 3 consecutive failures. Classic circuit breaker, and the comment carrying the query date and exact numbers leaves a useful paper trail.

## 5. Reactive Compact

Emergency fallback, triggered after the API returns a 413, or a media-size error for oversized images and PDFs. The streaming loop withholds the error rather than surfacing it, then recovery runs:

```typescript
// query.ts:1085-1125
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

1. Drain all staged Context Collapse commits. Cheap, keeps granular context. The `collapse_drain_retry` guard prevents re-draining when a drain already ran and still did not get under the limit, which would otherwise loop forever.
2. If that fails, or already ran, call `tryReactiveCompact` for full summarization on the already-failed messages.

A `hasAttemptedReactiveCompact` flag prevents spiraling. If the post-compact turn also 413s, because the oversized content sits in the preserved tail, the error surfaces instead of looping.

## The Takeaway

The five strategies are not strictly mutually exclusive:

- Snip and Microcompact can both run in the same turn.
- Context Collapse replaces Autocompact when active, but Reactive Compact still fires as the last-resort fallback for both.
- Session Memory Compaction is an optimization inside Autocompact, not a separate level. It just avoids the expensive summarization when session memory already has the content.

The pipeline reads as a careful layering of tradeoffs. Cheap and reversible first, expensive and destructive last. Context Collapse's non-destructive projected view is the most architecturally interesting piece, precisely because it defers irreversibility as long as it can. The circuit breaker is the most operationally important, given the numbers behind it.

The feature-flag-heavy design also says this is still evolving. Context management is genuinely hard, and the right answer depends on session shape, timing, and what the agent is doing.
