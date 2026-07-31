---
title: "Inside Claude Code: Anti-Distillation and Undercover Mode"
slug: inside-claude-code-anti-distillation-and-undercover-mode
lang: en
date: "2026-04-19"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code's two hidden defenses: one against model distillation, one against leaking internal codenames."
keywords:
  - Claude Code
  - Security
---

_Based on the source of Claude Code v2.1.88._

Claude Code ships two mechanisms that have nothing to do with helping you write code. They are undocumented, not user-facing, and invisible at runtime. Both exist to defend against adversaries, and both only activate in specific build configurations.

They say something about the threat model Anthropic is actually engineering against.

## Anti-Distillation

The threat is straightforward. A competitor could run a man-in-the-middle on Claude Code's API traffic, record thousands of real request-response pairs, and use them as training data to distill a smaller model with similar behavior. Free-riding on Anthropic's RLHF investment.

The usual responses are rate limiting, traffic anomaly detection, or nothing. Anthropic went a different way.

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

When active, Claude Code sets an `anti_distillation` field on the request body, opting into fake tool definitions. From the client side the intent is to corrupt the training signal of anyone capturing the traffic. Counterintelligence, not just defense.

The activation is doubly gated. A build-time Bun flag (`feature('ANTI_DISTILLATION_CC')`) can compile the whole thing out. Even when compiled in, it checks a GrowthBook flag that defaults to false, so Anthropic can flip it remotely without shipping a build. It only fires in the official first-party CLI, not through the SDK.

Worth noting: `tengu` is not a leak. It is a pervasive internal prefix appearing across dozens of unrelated event names in the same file, including `tengu_streaming_error`, `tengu_api_before_normalize`, and `tengu_max_tokens_reached`. It is the internal name for Claude Code, not a secret model surfaced by accident.

## Undercover Mode

This one is more interesting.

When Anthropic employees use Claude Code to contribute to open-source projects, the tool automatically strips all model attribution from commits and PRs. No `Co-Authored-By` lines. No internal codenames. The model is not told what model it is.

```typescript
// src/utils/undercover.ts
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

The file's docblock describes it as safety utilities for contributing to public and open-source repos, notes that the model is not told what model it is, and states plainly that there is no force-off, because the mechanism guards against model codename leaks. If Claude Code is not confident it is in an internal repo, it stays undercover.

That last part says a lot. The mode activates for any Anthropic employee pushing to any repo not on an explicit internal allowlist. That list lives in `commitAttribution.ts` and holds 22 private repos. The public `anthropics/claude-code` repo is not among them, so undercover stays on there.

What it suppresses goes deeper than stripping attribution lines:

1. **Model identity.** Normally Claude Code injects "You are powered by the model named X. The exact model ID is Y." into the system prompt. Undercover removes it. The model genuinely does not know what it is.
2. **Known model list.** The list of current Opus, Sonnet, and Haiku IDs normally included for AI development guidance is gone.
3. **Ant-specific model config.** Internal model override configs are stripped from the system prompt.
4. **Commit prompt.** The BashTool prompt prepends explicit instructions about what not to write, even when the user has disabled git instructions globally.

That last item carries the most interesting note in the source: undercover instructions must survive even if the user has disabled git instructions entirely. Defense in depth. Mechanical suppression handles most cases, but the explicit "do not blow your cover" text is the last line against the model volunteering a codename in a commit message.

The injected instructions enumerate what must never appear. Among them: internal model codenames (animal names like Capybara and Tengu), unreleased model version numbers (the examples given are `opus-4-7` and `sonnet-4-8`), internal repo or project names, internal tooling, Slack channels and short links (`go/cc`, `#claude-code-…`), the phrase "Claude Code" or any mention of being an AI, any hint of which model or version is running, and `Co-Authored-By` lines.

Those examples are not confirmed internal identifiers. Capybara and Tengu appear as codename examples, and `opus-4-7` and `sonnet-4-8` follow a plausible pattern given the source's own examples sit at 4-6, but the file lists them as things not to write rather than as verified releases. What is clear is that the system considers them realistic enough to guard against explicitly.

## The Safe-Default Design

Both mechanisms default to the more restrictive state.

For undercover mode, repo classification runs async at startup. If it has not resolved yet the state is ON, so the first prompt in any session runs undercover. Only after the check confirms an internal repo does the restriction lift, for that session only.

The subsystem is also absent from external builds entirely. Every `isUndercover()` callsite is gated on `process.env.USER_TYPE === 'ant'`, a Bun `--define` constant set at build time. In external builds that folds to `"external" === 'ant'`, always false, and the bundler eliminates every ant-only branch. The file's own docblock says as much: in external builds every function in it reduces to a trivial return.

Anti-distillation gets the same treatment through `feature()`, which is a compile-time define from `bun:bundle`, plus the runtime GrowthBook flag on top.

So the code ships in one form for Anthropic employees and a fundamentally different form for everyone else. Not a runtime feature flag, a different binary.

## The Takeaway

Both mechanisms are invisible in normal use. Anti-distillation only affects adversaries capturing API traffic. Undercover mode only activates for Anthropic employees working on public repos. For the rest of us, neither exists.

But they are a useful window into what Anthropic is actually engineering against: capability theft through traffic capture, and internal information leakage through AI-assisted commits. Mundane threats for a company shipping AI tools at scale, handled in unusually creative ways.
