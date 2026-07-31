---
title: "Inside Claude Code: Retrieval Strategy"
slug: inside-claude-code-retrieval-strategy
lang: en
date: "2026-04-11"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code skips RAG entirely, letting the agent grep and a small metadata index handle retrieval."
keywords:
  - Claude Code
  - Retrieval
---

_Based on the source of Claude Code v2.1.88._

The model has no memory of your codebase. Every run starts from zero, so it needs a way to see the right context before it can do anything useful.

The industry answer is RAG: embed your project into a vector database, retrieve semantically similar chunks at query time, inject them into the prompt.

Claude Code does not do this.

## What it does instead

Retrieval has three layers.

**Layer 1: Metadata scan.** `memoryScan.ts` reads only the frontmatter of every `.md` file in the memory directory, the first 30 lines, capturing name, description, type, and timestamp. It assembles a manifest:

```
- [feedback] feedback_testing.md (2025-04-10T...): integration tests must hit a real db, not mocks
- [user] user_role.md (2025-04-08T...): user is a senior Go engineer, new to the React side
```

Fast, cheap, no inference.

**Layer 2: LLM sidecar call.** `findRelevantMemories.ts` sends the manifest to a Sonnet call made outside the main conversation. Sonnet returns a JSON list of at most five filenames worth reading in full. The prompt is deliberately conservative: "If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning."

```typescript
const result = await sideQuery({
  model: getDefaultSonnetModel(),
  system: SELECT_MEMORIES_SYSTEM_PROMPT,
  messages: [{ role: 'user', content: `Query: ${query}\n\nAvailable memories:\n${manifest}` }],
  max_tokens: 256,
  output_format: { type: 'json_schema', ... },
  skipSystemPromptPrefix: true,
})
```

No embeddings, no cosine similarity. It works like a card catalog: scan the index cards, let a librarian pick which books to pull, read those in full.

**Layer 3: Self-directed grep.** For deeper searches through transcript history, the model gets grep instructions and runs the search itself:

```typescript
const memSearch = `grep -rn "<search term>" ${autoMemDir} --include="*.md"`;
const transcriptSearch = `grep -rn "<search term>" ${projectDir}/ --include="*.jsonl"`;
```

This layer is gated behind a GrowthBook flag, `tengu_coral_fern`, which defaults to off. When it is off, the whole "Searching past context" section is absent from the system prompt.

The "last resort" comment in the code is telling. Transcripts are full `.jsonl` conversation logs, large and slow to scan, so they are only reached when the memory layer comes up short.

Under the hood "grep" is ripgrep, which ships in three modes. A system `rg` binary wins if the user has one and has not opted out. In bundled builds it falls to the copy compiled into the Bun executable, spawned with `argv0='rg'`. Otherwise it uses a vendored platform-specific binary. Timeout handling differs by path: the embedded spawn path sends SIGTERM at the timeout and escalates to SIGKILL five seconds later, while the execFile path sends SIGKILL directly. Either way this is load-bearing infrastructure, not a prototype.

The grep command strings above are specific to embedded and REPL mode. Otherwise the model gets a structured `${GREP_TOOL_NAME}` tool call with `pattern=...` instead. Same idea, different interface.

## Why this beats RAG

The bet is that agentic search beats RAG. When the agent decides what to search for and how to narrow it, the results are more relevant than pre-packaged chunks.

The analogy that works for me: RAG is pre-packaging all the material for an intern before they start. Agentic search hands them the whole library and lets them dig. The stronger the model, the bigger the advantage of the second approach, because the model knows better than you what it actually needs.

There is a subtler point too. In RAG, index quality depends on the embedding model at write time and vector similarity at read time. You have limited control over what gets retrieved, and staleness is a permanent maintenance problem.

Here, index quality depends on how well the model wrote the memory description at save time. That is a compression problem models are already good at. As they improve at writing concise, accurate descriptions, retrieval improves for free, with no reindexing.

The engineering payoff: no embedding pipeline, no vector database, no index staleness. The cost is one small sidecar call per context switch.

## The Takeaway

What this illustrates is how the line between what the engineering system handles and what the model handles keeps moving as models get stronger.

Semantic indexing, chunking strategies, similarity tuning: a lot of that is increasingly better left to the agent. The model can read a manifest and pick the right five files. It can write its own grep queries against a transcript store. It does both more accurately than a static pipeline.

The complexity that used to live in your RAG stack gets replaced by a cheap inference call and some well-structured metadata.
