---
description: "Claude Code skips RAG entirely, letting the agent grep and a small metadata index handle retrieval."
date: "2026-04-11"
tags: ["Claude Code", "Retrieval"]
---

# Inside Claude Code: Retrieval Strategy

The model has no memory of your codebase. Every time it runs, it starts from zero. So it needs a way to "see" the right code and context before it can do anything useful.

The standard industry answer to this is RAG: embed your project data into a vector database, retrieve semantically similar chunks at query time, inject them into the prompt, done.

Claude Code doesn't do this.

## What it does instead

The retrieval architecture has three layers.

**Layer 1: Metadata scan.** When the model needs to recall a memory, `memoryScan.ts` reads only the frontmatter header of every `.md` file in the memory directory, the first 30 lines, just the name, description, type, and timestamp. It assembles a compact manifest that looks something like this:

```
- [feedback] feedback_testing.md (2025-04-10T...): integration tests must hit a real db, not mocks
- [user] user_role.md (2025-04-08T...): user is a senior Go engineer, new to the React side
```

Fast, cheap, no inference needed.

**Layer 2: LLM sidecar call.** `findRelevantMemories.ts` sends this manifest to a lightweight Claude Sonnet call made outside the main conversation context. Sonnet reads the manifest and returns a JSON list of at most five filenames worth reading in full. The selection prompt is deliberately conservative: "If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning." Only those files get surfaced to the main model.

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

No embeddings. No cosine similarity. It's more like a card catalog: scan the index cards, let a smart librarian decide which books to pull, then read those books in full.

**Layer 3: Self-directed grep.** For deeper searches through transcript history, the model is handed grep instructions directly and runs the search itself:

```typescript
const memSearch = `grep -rn "<search term>" ${autoMemDir} --include="*.md"`;
const transcriptSearch = `grep -rn "<search term>" ${projectDir}/ --include="*.jsonl"`;
```

The "last resort" comment in the code is telling. Transcript files are large, full `.jsonl` conversation logs, slow to scan. They're only reached when the memory layer doesn't have what's needed. Under the hood "grep" is actually ripgrep, a Rust-based tool that ships bundled with Claude Code in three fallback modes: system `rg` binary if one exists, a vendored platform-specific binary, or embedded directly into the Bun executable. The timeout handling is worth noting: in the embedded (spawn) path, SIGTERM fires at the timeout with SIGKILL escalating 5 seconds later; in the non-embedded (execFile) path, SIGKILL fires directly. Either way, this is load-bearing infrastructure, not a prototype.

It's also worth noting that the grep command strings above are specific to embedded/REPL mode. In non-embedded mode, the model is given a structured `${GREP_TOOL_NAME}` tool call with `pattern=...` format instead. Same idea, different interface.

## Why this beats RAG

Claude Code's bet is that agentic search beats RAG: when the agent decides what to search for and how to narrow it, the results are far more relevant than pre-packaged chunks.

The analogy that makes sense to me: RAG is like pre-packaging all the relevant material for an intern before they start work. Agentic search is giving them direct access to the entire document library and letting them dig. The stronger the model, the bigger the advantage for the latter, because the model knows better than you do what information it actually needs.

There's also a more subtle design insight here. In RAG, index quality depends on the embedding model at write time and vector similarity at read time. You have limited control over what gets retrieved, and index staleness is a constant maintenance problem.

In Claude Code's approach, index quality depends on how well the model wrote the memory description at save time. That's a compression problem models are already good at. As models improve at writing concise, accurate descriptions, retrieval quality improves for free, no reindexing required.

The engineering payoff: no embedding pipeline to maintain, no vector database to operate, no index staleness to manage. The cost is one small sidecar API call per context switch. Given the accuracy difference and the maintenance burden avoided, that's a good trade.

## The Takeaway

What this really illustrates is how the boundary between "what the engineering system handles" and "what the model handles" keeps shifting as models get stronger.

A lot of things that used to require complex retrieval pipelines, semantic indexing, chunking strategies, similarity tuning, are increasingly just better left to the agent. The model can read an index card manifest and pick the right five files to read. It can write its own grep queries against a transcript store. It can do these things more accurately than a static pipeline can.

The engineering complexity that used to live in your RAG stack gets replaced by a cheap inference call and some well-structured metadata. That's a pretty good deal.
