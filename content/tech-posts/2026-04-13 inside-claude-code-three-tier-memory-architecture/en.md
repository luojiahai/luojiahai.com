---
title: "Inside Claude Code: Three-Tier Memory Architecture"
slug: inside-claude-code-three-tier-memory-architecture
lang: en
date: "2026-04-13"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code fights long-session context drift with a hot-warm-cold, three-tier memory architecture."
keywords:
  - Claude Code
  - Memory
---

_Based on the source of Claude Code v2.1.88._

Anyone who has spent serious time with an AI coding tool knows the feeling. Thirty tool calls into a session, the model starts contradicting itself. It forgets the architectural decision you made an hour ago. It suggests the approach you already ruled out.

Claude Code's answer is tiered memory. Not a bigger context window, not a smarter model, but a data architecture. Hot data stays resident, warm data loads on demand, cold data is searched. The same pattern you would apply to any storage problem, applied to the model's own memory.

## Tier 1: MEMORY.md (always loaded)

`MEMORY.md` is the index. It loads into context on every conversation, no exceptions.

```typescript
// memdir/memdir.ts
export const ENTRYPOINT_NAME = "MEMORY.md";
export const MAX_ENTRYPOINT_LINES = 200;
export const MAX_ENTRYPOINT_BYTES = 25_000;
```

Hard capped at 200 lines and 25KB. It stores pointers, not content: a table of contents for what the model knows about your project.

The caps matter because this file permanently occupies context. Every byte in `MEMORY.md` is a byte unavailable to your conversation.

The byte cap was added after the fact. Someone found a way to stay under 200 lines while writing so much per line that the file hit 197KB. The source comment records it as the observed p100.

When either limit is hit, truncation kicks in:

```typescript
// abbreviated: declarations of wasLineTruncated, contentLines, trimmed, and reason omitted
export function truncateEntrypointContent(raw: string): EntrypointTruncation {
  let truncated = wasLineTruncated ? contentLines.slice(0, MAX_ENTRYPOINT_LINES).join("\n") : trimmed;

  if (truncated.length > MAX_ENTRYPOINT_BYTES) {
    const cutAt = truncated.lastIndexOf("\n", MAX_ENTRYPOINT_BYTES);
    truncated = truncated.slice(0, cutAt > 0 ? cutAt : MAX_ENTRYPOINT_BYTES);
  }

  return {
    content:
      truncated +
      `\n\n> WARNING: ${ENTRYPOINT_NAME} is ${reason}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
  };
}
```

Line cap first, then byte cap, cutting at a natural line boundary. The important part is the last bit: telling the model the index was truncated. Without that, the model works from partial information and does not know it. Silent failure is the worst kind.

The memory directory is git-aware. The base path defaults to `~/.claude`, overridable via `CLAUDE_CODE_REMOTE_MEMORY_DIR`, resolving to `<memoryBase>/projects/<sanitized-git-root>/memory/`. It uses the canonical git root, so every worktree of a repo shares one memory directory, falling back to the project root when there is no git root. You do not lose context when you branch.

## Tier 2: Topic files (loaded on demand)

Coding preferences, architectural decisions, and known pitfalls live in individual topic files. Things like `user_role.md` ("senior backend engineer, new to the React side") or `feedback_testing.md` ("integration tests must hit real database").

Once per user turn, a Sonnet call scans the topic files and picks up to five relevant to your query. It does not read `MEMORY.md`, which is excluded from the scan entirely. It reads a manifest built from the YAML frontmatter of the topic files:

```typescript
const SELECT_MEMORIES_SYSTEM_PROMPT = `You are selecting memories that will be
useful to Claude Code as it processes a user's query.
Return a list of filenames for the memories that will clearly be useful (up to 5).
Be selective and discerning. If you are unsure if a memory will be useful in
processing the user's query, then do not include it.
- If there are no memories in the list that would clearly be useful, feel free
  to return an empty list.
- If a list of recently-used tools is provided, do not select memories that are
  usage reference or API documentation for those tools.
- DO still select memories containing warnings, gotchas, or known issues about
  those tools.`;
```

The prompt closes that last rule by noting that active use is exactly when gotchas matter.

Two things stand out. First, the selectivity guidance: when in doubt, leave it out, and an empty list is explicitly valid. The five slots are a ceiling, not a target. Second, the tool rule: if you are actively using something, skip its documentation but always load its gotchas. You clearly know how to invoke it. What you need is the list of ways it goes wrong.

The selector call is minimal, `max_tokens: 256`, because it only returns filenames. Output is shape-constrained by a JSON schema, and every returned filename is checked against the real file list, so invented names get filtered out before they reach the main model.

The scan reads only the first 30 lines of each file, enough for the frontmatter. Full content is never read during selection. The manifest looks like:

```
- [feedback] feedback_testing.md (2026-04-15T10:32:00Z): integration tests must hit real database
- [user] user_role.md (2026-04-28T09:15:00Z): senior backend engineer, new to React side of repo
- [project] project_deadline.md (2026-04-20T14:00:00Z): merge freeze begins 2026-05-03 for mobile release
```

The scan is capped at 200 files, sorted newest first, so recent memories surface where the selector sees them. A deduplication pass drops files already loaded earlier in the conversation, so the five slots are not spent re-selecting what the model already has.

### Making staleness visceral

Raw ISO timestamps do not trigger staleness reasoning in models. `2025-11-14T09:32:00Z` does not feel old. `47 days ago` does.

So `memoryAge.ts` converts modification times to human language:

```typescript
export function memoryAge(mtimeMs: number): string {
  const d = memoryAgeDays(mtimeMs);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}
```

Memories older than a day get a staleness caveat injected in a `<system-reminder>` tag alongside the content. It tells the model how old the memory is, that memories are point-in-time observations rather than live state, that file and line citations may be outdated, and that it should verify against current code before asserting anything as fact. These tags are stripped from the terminal UI, so they are instructions to the model, not visible output.

The motivating bug is recorded in the source: users reported stale code-state memories being asserted as fact, and the file:line citation made the stale claim sound more authoritative, not less.

This feeds a system prompt section titled "Before recommending from memory", not "Trusting what you recall". The heading is an action cue placed at the decision point. Same body text under the more abstract header tested 0/3 in evals. The action-cue version tested 3/3.

### Memory never stores code

This is the most important constraint in the tier.

Code changes. Memory does not auto-update. If a memory says "function X is on line 30" and you have since refactored, that memory is now actively misleading. So memory tracks preferences and judgments, and code facts are read from source in real time. Cache-consistency problems, eliminated at the design level.

## Tier 3: Conversation history (grep search)

Older conversations are stored as `.jsonl` files and searched by keyword when needed. In embedded and REPL mode this is a shell command like `grep -rn "<search term>" ${projectDir}/ --include="*.jsonl"`. Otherwise it uses the `${GREP_TOOL_NAME}` tool invocation format.

Either way the instructions say to use narrow search terms, meaning error messages, file paths, function names, rather than broad keywords. Transcripts are large and slow. This tier is the last resort, not the first.

## The background extraction agent

The three tiers explain how memory is read. The fourth piece is how it gets written.

At the end of each complete query loop a background extraction agent fires, when enabled. It sits behind a feature flag (`tengu_passport_quail` via GrowthBook) and only runs when auto-memory is on, so it is not universally active. When it does run it is a forked agent that shares the parent conversation's prompt cache prefix rather than starting cold, so it does not pay for context re-ingestion. Mutable execution state is isolated in a separate `ToolUseContext`.

The fork's permissions are asymmetric. Read, grep, and glob are unrestricted, so it can read any project file. Writes are locked to the memory directory. It cannot touch your project files.

The main agent and the background agent are mutually exclusive. If the main agent already wrote a memory during the conversation, the extractor detects that and skips. When the main agent writes, extraction skips. When it does not, extraction catches what was missed. A cursor advances each run so the extractor only processes messages added since last time.

## The memory taxonomy

Four types, each with explicit guidance:

**user.** Role, goals, expertise. Used to calibrate explanations. A ten-year Go veteran and a React newcomer need different answers to the same question.

**feedback.** Corrections and confirmed approaches both. The source makes a point of this: save only corrections and you will avoid past mistakes but drift away from approaches the user already validated, ending up overly cautious. Saving successes matters as much as saving failures.

**project.** Goals, deadlines, incidents, decisions and their rationale. Things not derivable from code or git. Relative dates convert to absolute on save, so "Thursday" becomes "2026-03-05" and stays interpretable later.

**reference.** Pointers to external systems. "Pipeline bugs are tracked in Linear project INGEST." Keeps the model from guessing where to look.

Explicitly excluded: code patterns, architecture, file paths, git history, debugging recipes, anything already in `CLAUDE.md`, ephemeral task details. The exclusions hold even when you ask to save them. Ask it to save this week's PR list and it is supposed to ask what was surprising about it instead. The surprising part is what is worth keeping.

## The Takeaway

The whole system is a context engineering problem solved with storage engineering principles: tiered access by temperature, aggressive caching, explicit staleness signaling, write isolation. None of it is novel in database design. Applied to a model's working memory, it is elegant.

The detail that sticks with me is the warning appended on truncation. Not "here is what I loaded" but "here is what I did not load, and why". The model knows the shape of what it is missing. That separates a system someone thought through from one that happened to work.
