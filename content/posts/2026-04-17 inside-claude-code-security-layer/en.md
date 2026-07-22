---
title: "Inside Claude Code: Security Layer"
slug: inside-claude-code-security-layer
lang: en
date: "2026-04-17"
categories:
  - ai
description: "How Claude Code guards a tool call: an auto-mode AI classifier, fail-closed gates, and 23 Bash security rules."
keywords:
  - Claude Code
  - Security
---

Claude Code has a `--dangerously-skip-permissions` flag, also known as YOLO mode. The name is honest: it skips the interactive permission prompts _and_ the AI classifier alike, and lets the model execute freely. That really is the nuclear option.

The interesting mechanism lives one mode over. In `--permission-mode auto`, Claude Code stops prompting you for approval and instead routes every action to a shadow AI running quietly in the background — one that most people don't know about.

## The YOLO Classifier

`utils/permissions/yoloClassifier.ts` — despite the name, it gates auto mode, not the bypass flag — runs an independent classifier on every action the main model wants to take. The classifier result is binary: block or allow. And crucially, it uses `sideQuery`, a separate API call that never touches the main conversation, so the main agent can't see or influence its reasoning.

```typescript
const yoloClassifierResponseSchema = z.object({
  thinking: z.string(),
  shouldBlock: z.boolean(),
  reason: z.string(),
});
```

That's the structural defense. The classifier is blind to the main model's output on purpose. Assistant text is deliberately excluded from its context, because model-authored text could be crafted to influence the classifier's decision. What the classifier _does_ see is a compact serialization of the entire session: all user messages and all assistant tool calls. Your whole conversation history, just stripped of assistant prose.

The session's `CLAUDE.md` is also injected, so actions that align with your stated project intent are judged accordingly.

## Two Stages, Not One

When `tengu_auto_mode_config.twoStageClassifier` is enabled, the classifier runs in two passes.

Stage 1 is fast. It runs with `max_tokens=64` and stop sequences targeting an immediate `<block>yes/no</block>` response. The prompt tells it to err on the side of blocking. If it allows, the pipeline exits there. If it blocks, it escalates.

Stage 2 runs with `max_tokens=4096` and chain-of-thought reasoning. Its whole purpose is reducing false positives from Stage 1's intentional conservatism. Both stages share the same system prompt and transcript, so Stage 2 gets a cache hit on the full prefix. Total latency budget: two API calls.

## What Skips the Classifier

Not everything goes through it. Two fast paths exist.

Read-only tools like `FileRead`, `Grep`, and `Glob` are on an allowlist and bypass the classifier entirely. They're safe by construction.

The second path is an `acceptEdits` mode check. Before hitting the classifier, the system re-evaluates whether the action would already be permitted just by accepting file edits within the project directory. If yes, it skips the API call. `AgentTool` and `REPLTool` are explicitly excluded from this path because REPL code can contain VM escapes between inner tool calls and the classifier needs to see the glue JavaScript.

## Fail Closed, Always

When the classifier API errors:

```typescript
// tengu_iron_gate_closed gate defaults to true
if (getFeatureValue_CACHED_WITH_REFRESH('tengu_iron_gate_closed', true, ...)) {
  // Block with retry guidance
} else {
  // Fail open: fall back to normal permission handling
}
```

The iron gate defaults closed. Classifier unavailability means deny. Unparseable response means deny. The gate only opens via remote feature flag. There's no default-open path.

When a transcript grows too large for the classifier's context window, the behavior is different: it falls back to manual prompting. In headless mode, it throws `AbortError` immediately, because the transcript only grows and retrying would never recover.

## The Denial Circuit Breaker

The classifier tracks consecutive and total blocks:

```typescript
export const DENIAL_LIMITS = {
  maxConsecutive: 3,
  maxTotal: 20,
} as const;
```

Three blocked actions in a row, or twenty total, escalates to manual prompting with a warning. In headless mode it aborts the agent entirely.

## Dangerous Allow-Rules Are Stripped

Before entering auto mode, the permission setup strips allow rules that would let the model bypass the classifier. For all users, `Bash(python:*)`, `Bash(node:*)`, and `Bash(eval:*)` allow-rules are removed on entry. Those prefixes grant arbitrary code execution, which is exactly what the classifier exists to guard against.

For Anthropic-internal users the list is significantly longer. On top of the base set, `curl`, `wget`, `git`, `gh`, `gh api`, `kubectl`, `aws`, `gcloud`, `gsutil`, and a few internal tools are also stripped. The comment explains the threat model: "Network/exfil: `gh gist create --public`, `gh api` arbitrary HTTP, `curl`/`wget` POST." External users don't get `curl` or `git` stripped, because that threat surface is scoped to internal infrastructure.

## Bypass-Immune Paths

Two tiers of path sensitivity exist, and the blog post I based this on got them backwards, so let me be precise.

The first tier is `DANGEROUS_FILES`: `.gitconfig`, `.gitmodules`, `.bashrc`, `.bash_profile`, `.zshrc`, `.zprofile`, `.profile`, `.ripgreprc`, `.mcp.json`, `.claude.json`, plus `.git/` directories and IDE configs like `.vscode/` and `.idea/`. These are marked `classifierApprovable: true`. The classifier can still approve edits to these files. They're sensitive but not unconditionally blocked.

The second tier is the truly bypass-immune set: suspicious Windows path patterns. NTFS Alternate Data Streams, 8.3 short names like `GIT~1`, long path prefixes (`\\?\`), trailing dots or spaces (`.git.`), DOS device names (`.git.CON`), and UNC paths. These are `classifierApprovable: false`. The classifier cannot approve them. They always require manual review.

The distinction matters. Sensitive config files get a human-readable flag and classifier review. Obfuscated Windows paths get a hard no regardless of what the classifier thinks.

## The Bash Security Checks

`tools/BashTool/bashSecurity.ts` has 23 distinct rules:

```typescript
const BASH_SECURITY_CHECK_IDS = {
  INCOMPLETE_COMMANDS: 1, // Commands starting with tab or dash
  JQ_SYSTEM_FUNCTION: 2, // jq system() function calls
  OBFUSCATED_FLAGS: 4, // Obfuscated CLI flags
  SHELL_METACHARACTERS: 5, // Dangerous shell metacharacters
  DANGEROUS_VARIABLES: 6, // Dangerous environment variable injection
  IFS_INJECTION: 11, // IFS variable injection
  PROC_ENVIRON_ACCESS: 13, // /proc/environ access
  CONTROL_CHARACTERS: 17, // Control characters
  UNICODE_WHITESPACE: 18, // Unicode whitespace spoofing
  ZSH_DANGEROUS_COMMANDS: 20, // Zsh dangerous commands (zmodload, etc.)
  COMMENT_QUOTE_DESYNC: 22, // Comment/quote state desync
  QUOTED_NEWLINE: 23, // Newlines inside quotes
  // ... 23 total
};
```

Rule 18 (`UNICODE_WHITESPACE`) covers attacks using zero-width Unicode characters to make what the security checker sees differ from what the shell actually executes. Classic prompt injection dressed up in invisible clothing.

Rule 20 covers `zmodload` in Zsh. That's the gateway to module-based attacks: `ztcp` for TCP exfiltration, `zpty` for executing commands via pseudo-terminals, `sysopen`/`syswrite`/`sysread` for low-level file I/O, `zf_rm`/`zf_mv` for file operations that bypass binary checks.

The path validator also blocks TOCTOU vulnerabilities. Tilde variants like `~username`, `~+` (expands to `$PWD`), `~-` (expands to `$OLDPWD`) are rejected because the validator resolves them to `./~username` but the shell expands them to `/home/username`. That gap is exploitable. Shell expansion syntax in file paths, `$VAR`, `$(cmd)`, `%VAR%`, is blocked for the same reason. UNC network paths like `\\server\share` are blocked to prevent credential leaking via SMB.

## The Takeaway

A single tool call in auto mode passes through at least five checkpoints:

1. Current run mode (Plan / Auto / Bypass)
2. User-defined rules in hooks
3. YOLO classifier model analysis
4. Bash command danger classification
5. Rules engine from config files

Multiple permission sources are evaluated and the most restrictive result wins. The naming runs counter to intuition: `--dangerously-skip-permissions` really does skip everything, classifier included — it earns the "dangerously." The independent AI security review is what you opt into with `--permission-mode auto` instead, where every action runs through the classifier rather than an interactive prompt.

The threat modeling here is serious. It just lives in auto mode, not behind the scary flag name.
