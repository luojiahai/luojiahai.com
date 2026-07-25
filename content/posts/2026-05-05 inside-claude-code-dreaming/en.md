---
title: "Inside Claude Code: Dreaming"
slug: inside-claude-code-dreaming
lang: en
date: "2026-05-05"
updated: "2026-07-25"
categories:
  - ai
description: "Once a day, Claude Code forks a background agent to consolidate its memories. The source calls it dreaming."
keywords:
  - Claude Code
  - Memory
---

_Based on the source of Claude Code v2.1.88._

The [three-tier memory system](/en/posts/inside-claude-code-three-tier-memory-architecture) has a slow-motion problem. Memories accumulate across sessions and drift. A note saying "the build uses webpack" outlives the migration to Vite. Near-duplicates pile up because each session writes in isolation. Left alone, the memory directory degrades into exactly the stale, contradictory mess the system was built to avoid.

Biology solved this long ago. During sleep the brain replays the day and consolidates short-term experience into durable memory. Claude Code does the same, and the source does not bother with a euphemism. The feature is called **dreaming** and it lives in `services/autoDream/`.

It is gated behind an experimental GrowthBook flag, `tengu_onyx_plover`, so it is off for most users today.

## When it fires

A dream is expensive, a whole forked agent, so it sits behind three gates checked cheapest first from the stop hook that runs after each turn. When idle the per-turn cost is one GrowthBook cache read and one stat.

```typescript
// autoDream.ts
const DEFAULTS: AutoDreamConfig = {
  minHours: 24,
  minSessions: 5,
};
```

1. **Time.** At least `minHours` (default 24) since the last consolidation. Just a stat of a lock file.
2. **Sessions.** At least `minSessions` (default 5) *other* sessions touched since then. The current session is excluded, since its mtime is always fresh.
3. **Lock.** `tryAcquireConsolidationLock()` returns the prior mtime, or `null` if another process is mid-dream. Two terminals will not consolidate the same memories at once.

There is a nice detail wedged between gates 1 and 2: a ten-minute scan throttle. If the time gate passes but the session gate does not, the lock's mtime never advances, so the time gate would keep passing on every turn and rescan the session directory each time. The throttle caps that at once per ten minutes. The thresholds come from the flag, so Anthropic can retune how often Claude Code dreams without shipping a build.

## The dream itself

When the gates open, it forks an agent and hands it a prompt that opens by telling it it is performing a dream, a reflective pass over its memory files, and asking it to synthesize what it has learned recently into durable, well-organized memories so future sessions can orient quickly.

`buildConsolidationPrompt` then walks it through four phases:

1. **Orient.** `ls` the memory directory, read `MEMORY.md` to understand the current index, skim topic files so it *improves* them instead of creating duplicates.
2. **Gather recent signal.** Daily logs first, then memories that have drifted out of sync with the codebase, then narrow `grep` over the session transcripts. Never whole-file reads, because the JSONL logs are large.
3. **Consolidate.** Merge new signal into existing topic files rather than spawning near-duplicates, convert relative dates to absolute ones, and *delete* facts the day's work has contradicted.
4. **Prune and index.** Keep `MEMORY.md` under its 200-line and 25KB caps. It is an index, not a dump.

If that reads like a garbage-collection pass for the memory architecture, that is exactly what it is. Everything the [memory post](/en/posts/inside-claude-code-three-tier-memory-architecture) describes as a design invariant, the lean index, the topic files, absolute dates, deleting stale claims, is something the dream actively enforces over time.

## Sandboxed like a background extraction

The dream reuses the safety envelope of the end-of-turn [memory extractor](/en/posts/inside-claude-code-three-tier-memory-architecture). It is a forked agent sharing the parent's cached prompt prefix, running with `skipTranscript: true`, with the same asymmetric permissions: reads anywhere, writes only inside the memory directory.

```typescript
// autoDream.ts
const result = await runForkedAgent({
  promptMessages: [createUserMessage({ content: prompt })],
  cacheSafeParams: createCacheSafeParams(context),
  canUseTool: createAutoMemCanUseTool(memoryRoot), // writes restricted to the memory dir
  querySource: "auto_dream",
  skipTranscript: true,
  overrides: { abortController },
  onMessage: makeDreamProgressWatcher(taskId, setAppState),
});
```

Its Bash access is clamped further to read-only commands, and the prompt says so: *"Anything that writes, redirects to a file, or modifies state will be denied. Plan your exploration with this in mind."*

It runs as a real, visible background task. A progress watcher streams the agent's reasoning and the files it touches into a `DreamTask` you can open or kill from the background-tasks dialog. On success it appends an "Improved" message listing the files it rewrote, mirroring the extractor's "Saved N memories". If the fork fails it calls `rollbackConsolidationLock` to rewind the lock's mtime, so the time gate opens again and the next idle window retries.

## The Takeaway

The whole feature is a small amount of code wrapped around a forked agent and a four-phase prompt. What makes it interesting is the framing.

Memory consolidation is a real, recurring maintenance cost in any long-lived memory system, and the usual answer is a cron job running deterministic cleanup rules. Claude Code instead points the *agent* at its own memory and asks it to reflect, merge, prune, and reconcile. Judging which memories matter, which have gone stale, and which are duplicates is exactly the fuzzy work a model is good at and a rules engine is bad at.

It is the same shift running through the rest of the codebase. Where the system used to encode the logic, it now writes a careful prompt and lets the model do the judging. Here it just happens to wear the metaphor on its sleeve.
