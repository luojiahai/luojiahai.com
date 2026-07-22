---
description: "Claude Code's two hidden defenses — one against model distillation, one against leaking internal codenames."
date: "2026-04-19"
tags: ["Claude Code", "Security"]
---

# Inside Claude Code: Anti-Distillation and Undercover Mode

Claude Code ships two mechanisms that have nothing to do with helping you write code. They're not documented, not user-facing, and invisible at runtime. Both exist purely to defend against adversaries, and both only activate in specific build configurations.

They reveal something about the threat model Anthropic is actually engineering against.

## Anti-Distillation

The threat model here is straightforward. If you're a competitor, you could run a man-in-the-middle on Claude Code's API traffic, record thousands of real request-response pairs, and use them as training data to distill a smaller model that behaves similarly. You'd essentially be free-riding on Anthropic's RLHF investment.

The typical response to this kind of thing is rate limiting, or detecting unusual traffic patterns, or just ignoring it. Anthropic went a different direction.

```typescript
// src/services/api/claude.ts
if (
  feature("ANTI_DISTILLATION_CC")
    ? process.env.CLAUDE_CODE_ENTRYPOINT === "cli" &&
      shouldIncludeFirstPartyOnlyBetas() &&
      getFeatureValue_CACHED_MAY_BE_STALE("tengu_anti_distill_fake_tool_injection", false)
    : false
) {
  result.anti_distillation = ["fake_tools"];
}
```

When active, Claude Code sets an `anti_distillation` field in the API request body, signalling the server to inject fake tool definitions into the response. The intent, at least from the client side, is to corrupt the training signal of anyone capturing the traffic. It's counterintelligence, not just defense.

The activation is doubly gated. There's a build-time Bun flag (`feature('ANTI_DISTILLATION_CC')`) that can compile the whole thing out entirely. But even when compiled in, it still checks a server-side feature flag via GrowthBook. Anthropic can flip it remotely without shipping a new build. It only fires in the official first-party CLI, not through the SDK.

One thing worth noting: `tengu` is not a unique leak. It's a pervasive internal prefix that appears across dozens of unrelated event names in the same file: `tengu_streaming_error`, `tengu_api_before_normalize`, `tengu_max_tokens_reached`, and more. It's the internal codename for Claude Code (or the API system broadly), not a secret unreleased model accidentally surfaced through one flag name.

## Undercover Mode

This one is more interesting.

When Anthropic employees use Claude Code to contribute to open-source projects, the tool automatically strips all model attribution from commits and PRs. The model isn't told what model it is. No `Co-Authored-By` lines. No internal codenames in commit messages.

```typescript
// src/utils/undercover.ts
/**
 * Undercover mode — safety utilities for contributing to public repos.
 * When active, Claude Code strips all attribution to avoid leaking internal
 * model codenames, project names, or other Anthropic-internal information.
 * The model is not told what model it is.
 *
 * There is NO force-OFF. This guards against model codename leaks.
 */

export function isUndercover(): boolean {
  if (process.env.USER_TYPE === "ant") {
    if (isEnvTruthy(process.env.CLAUDE_CODE_UNDERCOVER)) return true;
    // Auto: active unless we've positively confirmed we're in an allowlisted
    // internal repo. 'external', 'none', and null (check not yet run) all
    // resolve to ON. The check is primed in setup.ts; only 'internal' → OFF.
    return getRepoClassCached() !== "internal";
  }
  return false;
}
```

"There is NO force-OFF." That comment says a lot.

The mode activates automatically for any Anthropic employee pushing to any repo that isn't on an explicit internal allowlist. That list lives in `commitAttribution.ts` and contains 22 private repos. The public `anthropics/claude-code` repo is not on it. Undercover stays on there.

What "undercover" actually suppresses goes deeper than just stripping `Co-Authored-By` lines:

1. **Model identity.** Normally, Claude Code injects "You are powered by the model named X. The exact model ID is Y." into the system prompt. Undercover suppresses this entirely. The model genuinely doesn't know what it is during those sessions.
2. **Known model list.** The list of current Opus/Sonnet/Haiku IDs normally included for AI development guidance? Gone.
3. **Ant-specific model config.** Any internal model override configs are stripped from the system prompt.
4. **Commit prompt.** The BashTool prompt prepends explicit instructions about what not to write, even when the user has disabled git instructions globally.

That last part has the most interesting design note in the source: _"Defense-in-depth: undercover instructions must survive even if the user has disabled git instructions entirely."_ The mechanical suppression handles most cases, but the explicit "don't blow your cover" instructions are the last line of defense against the model volunteering a codename in a commit message.

The injected instructions list exactly what the model must never write:

> Internal model codenames (animal names like Capybara, Tengu, etc.), unreleased model version numbers (e.g., opus-4-7, sonnet-4-8), internal repo or project names, Slack channels or short links (e.g., go/cc, #claude-code-…)

These aren't necessarily confirmed internal model IDs. Capybara and Tengu appear as codename examples, and `opus-4-7` and `sonnet-4-8` follow a plausible pattern given current IDs are at 4-6, but the source lists them as examples of what not to write rather than verified unreleased versions. What's clear is that the undercover system considers them realistic enough to explicitly guard against.

## The Safe-Default Design

Both mechanisms share a design philosophy: default to the more restrictive state.

For undercover mode, repo classification runs async at startup. If it hasn't resolved yet, the state is ON. The first prompt in any session always runs undercover. Only after the async check completes and confirms an internal repo does the restriction lift, for that session only.

For anti-distillation, the whole subsystem is compiled out of external builds entirely. Every `isUndercover()` callsite is gated with `process.env.USER_TYPE === 'ant'`, which is a Bun `--define` constant set at build time. In external builds it becomes `"external" === 'ant'` (always false), and the bundler eliminates every ant-only branch. The undercover subsystem is literally absent from the binary shipped to public users.

It's a clean separation. The code ships in one form for Anthropic employees and a fundamentally different form for everyone else. Not a feature flag at runtime, but a different binary.

## The Takeaway

Both mechanisms are invisible in normal use. Anti-distillation only affects adversaries capturing API traffic. Undercover mode only activates for Anthropic employees working on public repos. For the rest of us, neither exists.

But they're a useful window into the threat model Anthropic is actually engineering against: capability theft through traffic capture, and internal information leakage through AI-assisted commits. Mundane threats for a company shipping AI tools at scale, handled in unusually creative ways.
