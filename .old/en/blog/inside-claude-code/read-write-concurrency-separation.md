---
description: "Claude Code runs tools concurrently using the read/write-lock pattern straight out of databases."
date: "2026-04-07"
tags: ["Claude Code", "Concurrency"]
---

# Inside Claude Code: Read/Write Concurrency Separation

When Claude Code needs to read three files and edit one simultaneously, does it wait on each operation one by one, or does it run them in parallel?

The answer is: it depends on what the tools are doing. And the way it figures that out is surprisingly clean.

## The Core Idea

The execution layer in `toolOrchestration.ts` treats reads and writes differently, much like a database with read/write locks. Multiple read-only tools can run in parallel. The moment a write operation enters the mix, everything waits.

The concurrency cap defaults to 10, tunable via env var — this applies to the batch executor in `toolOrchestration.ts`:

```typescript
function getMaxToolUseConcurrency(): number {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10;
}
```

Simple. Predictable. You can override it if you know what you're doing.

## How It Decides What's Safe

Before any tools run, `partitionToolCalls` walks through all the requested tool calls and groups them into batches:

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

Two things stand out here.

First, the safety check is **per-call, not per-tool type**. `isConcurrencySafe` receives the parsed input, which means a tool can declare itself safe for some inputs and unsafe for others. The same tool could be concurrent-safe when reading a config file and unsafe when patching it.

Second, the default is conservative. From `Tool.ts`:

```typescript
const TOOL_DEFAULTS = {
  isConcurrencySafe: (_input?: unknown) => false, // assume not safe
  isReadOnly: (_input?: unknown) => false, // assume writes
};
```

Any tool that doesn't explicitly opt in runs serially. FileEdit, FileWrite, and NotebookEdit all fall through to this default. Bash is a notable exception: it has a custom `isConcurrencySafe` that delegates to `isReadOnly`, so read-only shell commands (those passing `checkReadOnlyConstraints`) can still run concurrently. The opt-in list reads like "things that genuinely can't corrupt state": FileRead, Grep, Glob, WebSearch, WebFetch, LSP diagnostics.

If the safety check itself throws an exception, that's treated as unsafe too. Fail-closed, all the way down.

## MCP Tools Follow the Spec

For MCP tools, Claude Code defers to the MCP spec's own annotation:

```typescript
isConcurrencySafe() {
  return tool.annotations?.readOnlyHint ?? false
}
```

If an MCP server declares `readOnlyHint: true`, those tools get bundled into concurrent batches automatically. No special-casing needed on Claude Code's side.

## Two Executors, Same Contract

There are actually two independent implementations of this pattern, selected by a feature gate:

```typescript
const useStreamingToolExecution = config.gates.streamingToolExecution
let streamingToolExecutor = useStreamingToolExecution
  ? new StreamingToolExecutor(...)
  : null
```

`toolOrchestration.ts` is batch-based: it collects all tool calls from a response, partitions them upfront, then runs each batch. The concurrency cap of 10 applies here.

`StreamingToolExecutor.ts` is event-driven: it starts executing tools as `tool_use` blocks stream in, before the response even finishes. Lower latency, same safety guarantees, but no numeric concurrency cap — its concurrency is governed purely by the safe/unsafe classification. There is one acknowledged limitation: the streaming executor doesn't support context modifiers for concurrent tools at all. If a concurrent tool emits one, it's silently dropped, not deferred. A code comment acknowledges this is a known gap.

## The Concurrency Pool

The actual parallel execution uses a `Promise.race`-based generator pool in `utils/generators.ts`:

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

Classic semaphore pool. Keep N slots active, fill a new one whenever one completes. Results arrive in completion order, not submission order.

## Context Modifications Are Ordered

One more wrinkle: context modifications from concurrent tools don't apply immediately. They queue up and are applied in original call order only after the entire batch completes:

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

Even if tool B finishes before tool A, tool A's context modification still applies first. Deterministic, regardless of execution order.

## The Takeaway

Anyone who's worked with databases will recognise this pattern immediately: reads in parallel, read-write exclusive. The implementation is straightforward, but the design decisions are sharp.

The safety contract is per-call, not per-tool. The default is conservative. Both executor variants enforce the same invariants, just at different points in the response lifecycle.

For a system where tools can touch the filesystem, run shell commands, and modify in-memory context, getting this right matters. And it's satisfying to see classic concurrency control show up intact in an AI tool execution layer.
