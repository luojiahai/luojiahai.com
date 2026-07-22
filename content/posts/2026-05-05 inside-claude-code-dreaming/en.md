---
title: "Inside Claude Code: Dreaming"
slug: inside-claude-code-dreaming
lang: en
date: "2026-05-05"
categories:
  - ai
description: "Once a day, Claude Code forks a background agent to consolidate its memories — the source calls it dreaming."
keywords:
  - Claude Code
  - Memory
---

The [three-tier memory system](/en/posts/inside-claude-code-three-tier-memory-architecture) has a slow-motion problem. Memories accumulate across sessions. They drift — a note that said "the build uses webpack" outlives the migration to Vite. Near-duplicates pile up because each session writes in isolation. Left alone, the memory directory degrades into exactly the kind of stale, contradictory mess the system was built to avoid.

Biology solved this a long time ago. During sleep, the brain replays the day and consolidates short-term experience into durable memory. Claude Code does the same thing, and the source doesn't bother with a euphemism — the feature is called **dreaming**, and it lives in `services/autoDream/`.

It's gated behind an experimental GrowthBook flag (`tengu_onyx_plover`), so it's off for most users today. But the mechanism is worth a look.

## When it fires

A dream is expensive — it's a whole forked agent — so it sits behind three gates, checked cheapest-first from the stop hook that runs after each turn (the per-turn cost when idle is "one GrowthBook cache read and one stat"):

```typescript
// autoDream.ts
const DEFAULTS: AutoDreamConfig = {
  minHours: 24,
  minSessions: 5,
};
```

1. **Time** — at least `minHours` (default 24) since the last consolidation. Just a stat of a lock file.
2. **Sessions** — at least `minSessions` (default 5) _other_ sessions touched since then. The current session is excluded, since its mtime is always fresh.
3. **Lock** — `tryAcquireConsolidationLock()` returns the prior mtime, or `null` if another process is already mid-dream. Two terminals won't consolidate the same memories at once.

There's a nice detail wedged between gates 1 and 2: a 10-minute **scan throttle**. If the time gate passes but the session gate doesn't, the lock's mtime never advances — so the time gate would keep passing on every single turn, rescanning the session directory each time. The throttle caps that at once per ten minutes. The thresholds themselves come from the flag, so Anthropic can retune "how often Claude Code dreams" without shipping a build.

## The dream itself

When the gates open, it forks an agent and hands it a prompt that opens like this:

> You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly.

The prompt (`buildConsolidationPrompt`) walks the agent through four phases:

1. **Orient** — `ls` the memory directory, read `MEMORY.md` to understand the current index, skim topic files so it _improves_ them instead of creating duplicates.
2. **Gather recent signal** — daily logs first, then memories that have drifted out of sync with the current codebase, then narrow `grep` over the session transcripts (never whole-file reads — the JSONL logs are large).
3. **Consolidate** — merge new signal into existing topic files rather than spawning near-duplicates, convert relative dates ("yesterday") to absolute ones, and _delete_ facts the day's work has contradicted.
4. **Prune and index** — keep `MEMORY.md` under its 200-line / 25KB caps; it's an index, not a dump.

If that reads like the garbage-collection pass for the memory architecture, that's exactly what it is. Everything the [memory post](/en/posts/inside-claude-code-three-tier-memory-architecture) describes as a design invariant — the lean index, the topic files, absolute dates, deleting stale claims — is something the dream actively enforces over time.

## Sandboxed like a background extraction

The dream reuses the same safety envelope as the end-of-turn [memory extractor](/en/posts/inside-claude-code-three-tier-memory-architecture). It's a forked agent that shares the parent's cached prompt prefix, runs with `skipTranscript: true`, and gets the same asymmetric permissions — reads anywhere, writes only inside the memory directory:

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

Its Bash access is further clamped to read-only commands, and the prompt says so explicitly: _"Anything that writes, redirects to a file, or modifies state will be denied. Plan your exploration with this in mind."_

It runs as a real, visible background task. A progress watcher streams the agent's reasoning and the files it touches into a `DreamTask` you can open — or kill — from the background-tasks dialog. On success it appends an "Improved" message listing the files it rewrote, the mirror of the extractor's "Saved N memories." And if the fork fails, it calls `rollbackConsolidationLock` to rewind the lock's mtime, so the time gate opens again and the next idle window retries.

## The Takeaway

The whole feature is a small amount of code wrapped around a forked agent and a four-phase prompt. What makes it interesting is the framing. Memory consolidation is a real, recurring maintenance cost in any long-lived memory system, and the usual engineering answer is a scheduled cron job running deterministic cleanup rules. Claude Code instead points the _agent_ at its own memory and asks it to reflect — merge, prune, reconcile — because judging which memories matter, which have gone stale, and which are duplicates is exactly the kind of fuzzy work a model is good at and a rules engine is bad at.

It's the same shift that runs through the rest of the codebase: where the system used to encode the logic, it now writes a careful prompt and lets the model do the judging. Here it just happens to wear the metaphor on its sleeve.
