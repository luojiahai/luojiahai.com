---
title: "Inside Claude Code: Read/Write Concurrency Separation"
slug: inside-claude-code-read-write-concurrency-separation
lang: en
date: "2026-04-07"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code runs tools concurrently using the read/write-lock pattern straight out of databases."
keywords:
  - Claude Code
  - Concurrency
---

_Based on the source of Claude Code v2.1.88._

When Claude Code needs to read three files and edit one, does it wait on each in turn, or run them in parallel?

It depends on what the tools declare about themselves. The way it works that out is clean.

## The Core Idea

`toolOrchestration.ts` treats safe and unsafe operations differently, much like a database with read/write locks. Safe tools run together. The moment an unsafe one enters, everything waits.

The concurrency cap defaults to 10 and applies to this batch executor:

```typescript
function getMaxToolUseConcurrency(): number {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10;
}
```

Simple, predictable, overridable if you know what you are doing.

## How It Decides What's Safe

Before any tools run, `partitionToolCalls` groups the requested calls into batches:

```typescript
function partitionToolCalls(toolUseMessages, toolUseContext): Batch[] {
  return toolUseMessages.reduce((acc, toolUse) => {
    const tool = findToolByName(toolUseContext.options.tools, toolUse.name);
    const parsedInput = tool?.inputSchema.safeParse(toolUse.input);
    const isConcurrencySafe = parsedInput?.success
      ? (() => {
          try {
            return Boolean(tool?.isConcurrencySafe(parsedInput.data));
          } catch {
            return false; // exceptions treated as unsafe
          }
        })()
      : false; // parse failures treated as unsafe

    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {
      acc[acc.length - 1].blocks.push(toolUse); // merge into concurrent batch
    } else {
      acc.push({ isConcurrencySafe, blocks: [toolUse] }); // new batch
    }
    return acc;
  }, []);
}
```

Two things stand out.

First, the check is **per-call, not per-tool-type**. `isConcurrencySafe` receives the parsed input, so a tool can be safe for some inputs and unsafe for others. `BashTool` uses this: its `isConcurrencySafe` delegates to `isReadOnly`, so read-only shell commands run concurrently while everything else serializes.

Second, the default is conservative. From `Tool.ts`:

```typescript
const TOOL_DEFAULTS = {
  isConcurrencySafe: (_input?: unknown) => false, // assume not safe
  isReadOnly: (_input?: unknown) => false, // assume writes
};
```

Any tool that does not explicitly opt in runs serially. `FileEdit`, `FileWrite`, and `NotebookEdit` all fall through to this default.

## Concurrency-safe is not the same as read-only

It is tempting to read the opt-in list as "things that cannot corrupt state", but the source does not support that. `isConcurrencySafe` and `isReadOnly` are independent properties, and several tools declare one without the other.

`AgentTool` is the sharpest example. It declares `isConcurrencySafe: true` and never declares itself read-only, so subagents that edit files fan out in parallel. `TaskCreate`, `TaskUpdate`, and `TaskStop` are the same shape: concurrency-safe, not read-only.

The tools that declare both are the ones you would expect: `FileRead`, `Grep`, `Glob`, `WebSearch`, `WebFetch`, `LSP`, `ToolSearch`, `TaskGet`, `TaskList`, `Brief`.

So the contract is narrower than "this cannot cause damage". It is "running two of these at once will not corrupt anything". Parallelism is governed by `isConcurrencySafe` alone.

If the safety check itself throws, that counts as unsafe. Fail-closed, all the way down.

## MCP Tools Follow the Spec

For MCP tools, Claude Code defers to the spec's own annotation:

```typescript
isConcurrencySafe() {
  return tool.annotations?.readOnlyHint ?? false
}
```

If a server declares `readOnlyHint: true`, its tools batch concurrently. No special-casing needed on Claude Code's side.

## Two Executors, Same Contract

There are two implementations of this pattern, selected by a feature gate:

```typescript
const useStreamingToolExecution = config.gates.streamingToolExecution
let streamingToolExecutor = useStreamingToolExecution
  ? new StreamingToolExecutor(...)
  : null
```

`toolOrchestration.ts` is batch-based. It collects all tool calls from a response, partitions them upfront, then runs each batch. The cap of 10 applies here.

`StreamingToolExecutor.ts` is event-driven. It starts executing tools as `tool_use` blocks stream in, before the response finishes. Lower latency, same safety classification, but no numeric cap. Its concurrency is governed purely by the safe/unsafe split.

The streaming executor has one acknowledged gap: it does not support context modifiers for concurrent tools. If a concurrent tool emits one, it is dropped rather than deferred, and a code comment says so.

## The Concurrency Pool

Parallel execution uses a `Promise.race` generator pool in `utils/generators.ts`:

```typescript
export async function* all<A>(
  generators: AsyncGenerator<A, void>[],
  concurrencyCap = Infinity,
): AsyncGenerator<A, void> {
  const waiting = [...generators];
  const promises = new Set<Promise<QueuedGenerator<A>>>();

  while (promises.size < concurrencyCap && waiting.length > 0) {
    promises.add(next(waiting.shift()!));
  }

  while (promises.size > 0) {
    const { done, value, generator, promise } = await Promise.race(promises);
    promises.delete(promise);
    if (!done) {
      promises.add(next(generator));
      if (value !== undefined) yield value;
    } else if (waiting.length > 0) {
      promises.add(next(waiting.shift()!));
    }
  }
}
```

A classic semaphore pool. Keep N slots active, refill whenever one completes. Results arrive in completion order, not submission order.

## Context Modifications Are Ordered

Context modifications from concurrent tools do not apply immediately. They queue, then apply in original call order once the batch completes:

```typescript
if (isConcurrencySafe) {
  const queuedContextModifiers: Record<string, ...[]> = {}
  for await (const update of runToolsConcurrently(blocks, ...)) {
    if (update.contextModifier) {
      const { toolUseID, modifyContext } = update.contextModifier
      queuedContextModifiers[toolUseID] ??= []
      queuedContextModifiers[toolUseID].push(modifyContext)
    }
    yield { message: update.message, newContext: currentContext }
  }
  // Apply in original call order, not completion order
  for (const block of blocks) {
    for (const modifier of queuedContextModifiers[block.id] ?? []) {
      currentContext = modifier(currentContext)
    }
  }
}
```

Even if tool B finishes before tool A, A's modification still applies first. Deterministic regardless of execution order.

## The Takeaway

Anyone who has worked with databases will recognise the pattern: safe operations in parallel, unsafe ones exclusive. The implementation is straightforward, but the design decisions are sharp.

The safety contract is per-call, not per-tool. The default is conservative. Both executors enforce the same invariants at different points in the response lifecycle.

And the contract is narrower than it first looks. Concurrency-safe does not mean harmless, only that running two at once will not corrupt anything.
