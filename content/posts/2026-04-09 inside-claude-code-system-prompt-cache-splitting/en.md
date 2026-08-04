---
title: "Inside Claude Code: System Prompt Cache Splitting"
slug: inside-claude-code-system-prompt-cache-splitting
lang: en
date: "2026-04-09"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code splits its system prompt at a sentinel boundary to keep the cacheable prefix stable."
keywords:
  - Claude Code
  - Caching
---

_Based on the source of Claude Code v2.1.88._

Prompt caching is simple in principle. Pass the same prefix on every request, tag it with `cache_control`, and the API skips reprocessing it.

In practice there is a subtlety: anything that varies between requests breaks the cache for that request. Your hit rate is a function of how stable your prefix actually is.

Claude Code solves this with a pattern worth stealing.

## The Boundary Marker

In `src/constants/prompts.ts` the system prompt is an ordered array of strings, split at a sentinel:

```typescript
export const SYSTEM_PROMPT_DYNAMIC_BOUNDARY = "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__";

return [
  // --- Static content (cacheable) ---
  getSimpleIntroSection(outputStyleConfig),
  getSimpleSystemSection(),
  outputStyleConfig === null || outputStyleConfig.keepCodingInstructions === true
    ? getSimpleDoingTasksSection()
    : null,
  getActionsSection(),
  getUsingYourToolsSection(enabledTools),
  getSimpleToneAndStyleSection(),
  getOutputEfficiencySection(),
  // === BOUNDARY MARKER - DO NOT MOVE OR REMOVE ===
  ...(shouldUseGlobalCacheScope() ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY] : []),
  // --- Dynamic content (registry-managed) ---
  ...resolvedDynamicSections,
].filter(s => s !== null);
```

Above the marker is static: role definition, behaviour rules, tool descriptions, tone requirements. Identical for every user, every session.

Below it is dynamic: working directory, session date, git state, CLAUDE.md rules, MCP server instructions, language preferences. Different per user, loaded fresh each request.

The static block is tagged `cache_control: { type: 'ephemeral', scope: 'global' }`. The dynamic block is unmarked and flows through every time, but it is typically much smaller than the roughly 20K-token static prefix it follows, so the cost is manageable.

## Three Cache Scopes

Each block carries one of three scopes: `null` (never cached), `'org'` (cached per organisation), or `'global'` (cached across all Claude Code users). When the boundary is found, `splitSysPromptPrefix()` in `src/utils/api.ts` cuts the array into up to four blocks:

| Block                | Scope      | What it is                          |
| -------------------- | ---------- | ----------------------------------- |
| Attribution header   | `null`     | Billing metadata, never cached      |
| System prompt prefix | `null`     | Short preamble, not globally cached |
| Static content       | `'global'` | Role + rules + tool descriptions    |
| Dynamic content      | `null`     | Per-user context, not cached        |

When global caching is off, or the boundary is missing, the same function falls back to three blocks at `'org'` scope instead.

The `'global'` scope is the interesting one. It maps to `cache_control: { type: 'ephemeral', scope: 'global' }` in the request, letting the API serve that block from a cache shared across all Claude Code users rather than one organisation.

The TTL is bumped from the default 5 minutes to 1 hour when two conditions hold: the user is eligible (Anthropic employee, or a subscriber within rate limits) and the query source matches a GrowthBook allowlist.

```typescript
export function getCacheControl({ scope, querySource }) {
  return {
    type: "ephemeral",
    ...(should1hCacheTTL(querySource) && { ttl: "1h" }),
    ...(scope === "global" && { scope }),
  };
}
```

That hour matters for long sessions. Without it, any conversation spanning more than 5 minutes pays repeated cache write costs.

## The 2^N Problem

Here is what makes the pattern tricky to maintain. The server hashes the static prefix to look up the cache entry. Any runtime bit that varies between users, even a single boolean, produces a distinct hash. With N conditional flags before the boundary you get 2^N prefix variants, each with its own rarely-reused cache entry.

The codebase is explicit about it:

```typescript
/**
 * Session-variant guidance that would fragment the cacheScope:'global'
 * prefix if placed before SYSTEM_PROMPT_DYNAMIC_BOUNDARY. Each conditional
 * here is a runtime bit that would otherwise multiply the Blake2b prefix
 * hash variants (2^N). See PR #24490, #24171 for the same bug class.
 */
function getSessionSpecificGuidanceSection(...): string | null {
```

The fix is structural. Anything conditional goes after the boundary, even if it reads like a rule rather than dynamic context. The distinction that matters is not semantic. It is whether the content is identical for every user.

## The MCP Tool Exception

MCP tools are per-user by definition. Their names, schemas, and descriptions depend on what each user has configured, so caching the system prompt globally while they are active would be wrong.

Claude Code detects this and disables global caching:

```typescript
const needsToolBasedCacheMarker = useGlobalCacheFeature && filteredTools.some((t) => t.isMcp === true && !willDefer(t));

const system = buildSystemPromptBlocks(systemPrompt, enablePromptCaching, {
  skipGlobalCacheForSystemPrompt: needsToolBasedCacheMarker,
});
```

When `skipGlobalCacheForSystemPrompt` is true, the boundary marker is stripped and the system falls back to org-level caching. Same behaviour as Bedrock and other third-party providers that do not support the global scope beta.

## Cache Break Detection

`src/services/api/promptCacheBreakDetection.ts` watches for unexpected drops in `cache_read_input_tokens`. If reads drop more than 5% and the absolute drop exceeds 2,000 tokens, it fires a `tengu_prompt_cache_break` event with a root cause:

- System prompt changed (+N chars)
- Tools changed (+N/-N tools)
- Model switched
- Beta headers added or removed
- Fast mode toggled
- Possible TTL expiry (over 5min or over 1h since last message)

A change that accidentally moves dynamic content above the boundary shows up immediately as a spike in cache breaks across all users. The monitoring is what makes the invariant enforced rather than merely documented.

## What It Looks Like in the API Request

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

Four blocks in a typical CLI session. The attribution header and the prefix carry no cache marker. The large static block of intro, rules, and tool guidance gets the global marker. The dynamic block is unmarked and small.

## The Takeaway

The core idea is straightforward:

1. Identify what is truly invariant across all users.
2. Separate it from what varies.
3. Put the boundary between them and keep it there.

The hard part is discipline. There is always a temptation to sneak a conditional into the static section because it feels like a rule rather than data. The 2^N problem is why that is a trap.

At real call volume this makes a meaningful dent in API costs, and the monitoring layer is what keeps it maintainable. You want to know when something breaks it, not when the bill arrives.
