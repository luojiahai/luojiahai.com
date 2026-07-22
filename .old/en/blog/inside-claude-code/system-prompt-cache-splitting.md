---
description: "Claude Code splits its system prompt at a sentinel boundary to keep the cacheable prefix stable."
date: "2026-04-09"
tags: ["Claude Code", "Caching"]
---

# Inside Claude Code: System Prompt Cache Splitting

If you've looked at the Anthropic API docs, you know prompt caching exists. Pass the same prefix on every request, tag it with `cache_control`, and the API skips reprocessing it. Simple in principle.

In practice, there's a subtlety that trips people up: anything that varies between requests breaks the cache for that request. Your cache hit rate is a function of how stable your prefix actually is.

Claude Code solves this with a clean architectural pattern worth stealing.

## The Boundary Marker

In `src/constants/prompts.ts`, the system prompt is assembled as an ordered array of strings, split at a sentinel:

```typescript
export const SYSTEM_PROMPT_DYNAMIC_BOUNDARY = "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__";

return [
  // --- Static content (cacheable) ---
  getSimpleIntroSection(outputStyleConfig),
  getSimpleSystemSection(),
  // included only when outputStyleConfig is null or keepCodingInstructions is true
  ...(outputStyleConfig?.keepCodingInstructions !== false ? [getSimpleDoingTasksSection()] : []),
  getActionsSection(),
  getUsingYourToolsSection(enabledTools),
  getSimpleToneAndStyleSection(),
  getOutputEfficiencySection(),
  // === BOUNDARY MARKER - DO NOT MOVE OR REMOVE ===
  ...(shouldUseGlobalCacheScope() ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY] : []),
  // --- Dynamic content (registry-managed) ---
  ...resolvedDynamicSections,
];
```

Everything above the marker is static: role definition, behaviour rules, tool descriptions, tone requirements. Identical across every user, every session.

Everything below is dynamic: current working directory, session date, git repo state, CLAUDE.md rules, MCP server instructions, language preferences. Different per user, loaded fresh on each request.

The static block gets tagged with `cache_control: { type: 'ephemeral', scope: 'global' }`. The dynamic block is left unmarked and flows through every time. But it's typically much smaller than the ~20K-token static prefix it follows, so the cost is manageable.

## Three Cache Scopes

Each block carries one of three cache scopes: `null` (never cached), `'org'` (cached per-organisation), or `'global'` (cached across all Claude Code users). When the boundary marker is found, `splitSysPromptPrefix()` in `src/utils/api.ts` cuts the array into up to four blocks — using `null` and `'global'` here, and falling back to `'org'` when global caching is off (see the MCP exception below):

| Block                | Scope      | What it is                          |
| -------------------- | ---------- | ----------------------------------- |
| Attribution header   | `null`     | Billing metadata, never cached      |
| System prompt prefix | `null`     | Short preamble, not globally cached |
| Static content       | `'global'` | Role + rules + tool descriptions    |
| Dynamic content      | `null`     | Per-user context, not cached        |

The `'global'` scope maps to `cache_control: { type: 'ephemeral', scope: 'global' }` in the API request. This is the interesting one. It lets the API serve this block from a shared cache across all Claude Code users, not just within a single organisation.

For eligible users (Anthropic employees or Claude.ai subscribers within rate limits), the TTL is bumped from the default 5 minutes to 1 hour:

```typescript
export function getCacheControl({ scope, querySource }) {
  return {
    type: "ephemeral",
    ...(should1hCacheTTL(querySource) && { ttl: "1h" }),
    ...(scope === "global" && { scope }),
  };
}
```

That `1h` TTL matters for long sessions. Without it, a conversation that spans more than 5 minutes would incur repeated cache write costs every few turns.

## The 2^N Problem

Here's the thing that makes this pattern genuinely tricky to maintain. The server hashes the static prefix to look up the cache entry. Any runtime bit that varies between users — even a single boolean flag — creates a distinct hash. With N conditional flags placed before the boundary, you get 2^N possible prefix variants, each with its own cache entry that rarely gets reused.

The codebase comments are explicit about this:

```typescript
/**
 * Session-variant guidance that would fragment the cacheScope:'global'
 * prefix if placed before SYSTEM_PROMPT_DYNAMIC_BOUNDARY. Each conditional
 * here is a runtime bit that would otherwise multiply the Blake2b prefix
 * hash variants (2^N). See PR #24490, #24171 for the same bug class.
 */
function getSessionSpecificGuidanceSection(...): string | null {
```

The fix is structural: anything conditional goes after the boundary, even if it feels conceptually like a "rule" rather than "dynamic context". The distinction that matters isn't semantic, it's whether the content is the same for every user.

## The MCP Tool Exception

MCP (Model Context Protocol) tools are per-user by definition. Their names, schemas, and descriptions depend on what the individual user has configured. Caching the system prompt globally when MCP tools are active would be wrong.

Claude Code detects this and disables global caching for the system prompt:

```typescript
const needsToolBasedCacheMarker = useGlobalCacheFeature && filteredTools.some((t) => t.isMcp === true && !willDefer(t));

const system = buildSystemPromptBlocks(systemPrompt, enablePromptCaching, {
  skipGlobalCacheForSystemPrompt: needsToolBasedCacheMarker,
});
```

When `skipGlobalCacheForSystemPrompt` is true, the boundary marker is stripped entirely and the system falls back to org-level caching. Same behaviour as Bedrock and other third-party providers that don't support the global scope beta.

## Cache Break Detection

There's a monitoring subsystem in `src/services/api/promptCacheBreakDetection.ts` that watches for unexpected drops in `cache_read_input_tokens`. If the read tokens drop more than 5% and exceed 2,000 tokens, it fires a `tengu_prompt_cache_break` telemetry event with a root cause explanation:

- System prompt changed (+N chars)
- Tools changed (+N/-N tools)
- Model switched
- Beta headers added/removed
- Fast mode toggled
- Possible TTL expiry (>5min or >1h since last message)

A code change that accidentally moves dynamic content before the boundary would immediately show up as a spike in cache breaks across all users. The monitoring makes the invariant enforced rather than just documented.

## What It Looks Like in the API Request

The assembled system prompt in the API call ends up looking like this:

```json
{
  "system": [
    {
      "type": "text",
      "text": "x-anthropic-billing-header: ..."
    },
    {
      "type": "text",
      "text": "You are Claude Code, Anthropic's official CLI for Claude..."
    },
    {
      "type": "text",
      "text": "## Core behaviour\n## Tool guidance\n...",
      "cache_control": { "type": "ephemeral", "scope": "global", "ttl": "1h" }
    },
    {
      "type": "text",
      "text": "CWD: /home/user/project\nDate: 2026-04-29\n..."
    }
  ]
}
```

Four blocks in a typical CLI session. The attribution header and system prompt prefix (`"You are Claude Code..."`) both have no cache marker. The large static content block — intro, rules, tool guidance — gets the global cache marker. The dynamic block is unmarked and small.

## The Takeaway

The core idea is straightforward:

1. Identify what's truly invariant across all users.
2. Separate it from what varies.
3. Put the boundary between them, and keep it there.

The hard part is discipline. There's always temptation to sneak a conditional into the static section because it feels more like a "rule" than "data". The 2^N problem is why that's a trap.

If you're building AI apps at any real call volume, this pattern can make a meaningful dent in your API costs. And the monitoring layer is what makes it maintainable: you want to know immediately when something breaks it, not when the bill comes in.
