---
title: "Inside Claude Code: Security Layer"
slug: inside-claude-code-security-layer
lang: en
date: "2026-04-17"
updated: "2026-07-25"
categories:
  - ai
description: "How Claude Code guards a tool call: an auto-mode AI classifier, fail-closed gates, and 23 Bash security rules."
keywords:
  - Claude Code
  - Security
---

_Based on the source of Claude Code v2.1.88._

Claude Code has a `--dangerously-skip-permissions` flag, also known as YOLO mode. The name is honest. It skips the interactive prompts *and* the AI classifier, and lets the model execute freely. That really is the nuclear option.

The interesting mechanism lives one mode over. In `--permission-mode auto`, Claude Code stops prompting you and routes every action to a second model running in the background.

## The YOLO Classifier

`utils/permissions/yoloClassifier.ts` gates auto mode, not the bypass flag, despite the name. It runs an independent classifier on every action the main model wants to take. The result is binary: block or allow. It uses `sideQuery`, a separate API call that never touches the main conversation, so the main agent cannot see or influence its reasoning.

```typescript
const yoloClassifierResponseSchema = z.object({
  thinking: z.string(),
  shouldBlock: z.boolean(),
  reason: z.string(),
});
```

That is the structural defense. The classifier is blind to the main model's prose on purpose. `buildTranscriptEntries` includes only `tool_use` blocks from assistant messages, with the comment explaining why: assistant text is model-authored and could be crafted to influence the decision. What the classifier does see is every user message and every assistant tool call, the whole session stripped of assistant prose.

The session's `CLAUDE.md` is injected too, so actions aligned with your stated project intent are judged accordingly.

## Two Stages, Not One

When `tengu_auto_mode_config.twoStageClassifier` is enabled, the classifier supports three modes. The default, `'both'`, runs two passes.

Stage 1 is fast. `max_tokens=64` with a `</block>` stop sequence for an immediate yes or no, and a prompt suffix that tells it to err on the side of blocking. If it allows, the pipeline exits there. If it blocks, it escalates.

Stage 2 runs at `max_tokens=4096` with chain-of-thought reasoning. Its whole purpose is cutting false positives from Stage 1's intentional conservatism. Both stages share the same system prompt and transcript, so Stage 2 hits the cache on the full prefix.

The other two modes trade one call for accuracy in either direction. `'fast'` runs Stage 1 only, bumping `max_tokens` to 256 and dropping the stop sequence so the response can carry a reason. `'thinking'` skips Stage 1 and runs Stage 2 alone.

## What Skips the Classifier

Not everything reaches it. Two fast paths run first, in this order.

The first is an acceptEdits check. Before hitting the classifier, the system re-evaluates whether the action would already be permitted by accepting file edits within the project directory. If yes, it skips the API call. `AgentTool` and `REPLTool` are excluded from this path because REPL code can contain VM escapes between inner tool calls, and the classifier needs to see the glue JavaScript.

The second is a safe-tool allowlist. It is broader than read-only tools: `FileRead`, `Grep`, `Glob`, `LSP`, and `ToolSearch`, plus MCP resource readers, all the task-management tools (`TodoWrite`, `TaskCreate`, `TaskGet`, `TaskUpdate`, `TaskList`, `TaskStop`, `TaskOutput`), plan-mode and UI tools (`AskUserQuestion`, `EnterPlanMode`, `ExitPlanMode`), swarm coordination (`TeamCreate`, `TeamDelete`, `SendMessage`), plus `Workflow` and `Sleep`.

The source comment is precise about why write and edit tools are absent: they are not unsafe by definition, they are just handled by the acceptEdits path, allowed inside the working directory and classified outside it.

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

The iron gate defaults closed. Classifier unavailable means deny. Unparseable response means deny. The gate only opens via remote feature flag. There is no default-open path.

A transcript that grows past the classifier's context window is handled differently, because it is a deterministic error that will not recover on retry. It falls back to manual prompting. In headless mode it throws `AbortError` immediately, since the transcript only grows and retrying never recovers.

## The Denial Circuit Breaker

The classifier tracks consecutive and total blocks:

```typescript
export const DENIAL_LIMITS = {
  maxConsecutive: 3,
  maxTotal: 20,
} as const;
```

Three blocked actions in a row, or twenty total, escalates to manual prompting with a warning. In headless mode it aborts the agent.

## Dangerous Allow-Rules Are Stripped

Before entering auto mode, the permission setup removes allow rules that would let the model bypass the classifier. Any of these as a `Bash(x:*)` prefix rule grants arbitrary code execution, which is exactly what the classifier exists to guard.

For all users, `DANGEROUS_BASH_PATTERNS` covers roughly two dozen entries: the interpreters (`python`, `python3`, `python2`, `node`, `deno`, `tsx`, `ruby`, `perl`, `php`, `lua`), the package runners (`npx`, `bunx`, `npm run`, `yarn run`, `pnpm run`, `bun run`), the shells (`bash`, `sh`, `zsh`, `fish`), `ssh`, and `eval`, `exec`, `env`, `xargs`, `sudo`.

For Anthropic-internal users the list grows: `curl`, `wget`, `git`, `gh`, `gh api`, `kubectl`, `aws`, `gcloud`, `gsutil`, and a few internal tools. The comment gives the threat model: "Network/exfil: `gh gist create --public`, `gh api` arbitrary HTTP, `curl`/`wget` POST." External users do not get `curl` or `git` stripped, because that surface is scoped to internal infrastructure.

`gh api` needs its own entry because the matcher is exact-shape rather than prefix, so the pattern `gh` alone would not catch the rule `gh api:*`. Same reason `npm run` is listed separately from `npm`.

## Bypass-Immune Paths

Two tiers of path sensitivity exist, and the difference between them matters.

The first tier is `DANGEROUS_FILES`: `.gitconfig`, `.gitmodules`, `.bashrc`, `.bash_profile`, `.zshrc`, `.zprofile`, `.profile`, `.ripgreprc`, `.mcp.json`, `.claude.json`, plus the `DANGEROUS_DIRECTORIES` set of `.git`, `.vscode`, `.idea`, and `.claude`. These are marked `classifierApprovable: true`. The classifier can still approve edits here. They are sensitive, not unconditionally blocked.

The second tier is genuinely bypass-immune: suspicious Windows path patterns. NTFS Alternate Data Streams, 8.3 short names like `GIT~1`, long path prefixes (`\\?\`), trailing dots or spaces (`.git.`), DOS device names (`.git.CON`), and UNC paths. These are `classifierApprovable: false`. The classifier cannot approve them, and they always require manual review.

Sensitive config files get a flag and classifier review. Obfuscated Windows paths get a hard no regardless of what the classifier thinks.

## The Bash Security Checks

`tools/BashTool/bashSecurity.ts` has 23 rules:

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

Rule 18 covers zero-width Unicode characters used to make what the checker sees differ from what the shell executes. Prompt injection in invisible clothing.

Rule 20 covers `zmodload` in Zsh, the gateway to module-based attacks: `ztcp` for TCP exfiltration, `zpty` for executing commands through pseudo-terminals, `sysopen`/`syswrite`/`sysread` for low-level file I/O, `zf_rm`/`zf_mv` for file operations that bypass binary checks.

The path validator also blocks TOCTOU gaps. Tilde variants like `~username`, `~+` (expands to `$PWD`), and `~-` (expands to `$OLDPWD`) are rejected because the validator resolves them to `./~username` while the shell expands them to `/home/username`. Shell expansion syntax in paths (`$VAR`, `$(cmd)`, `%VAR%`) is blocked for the same reason. UNC network paths like `\\server\share` are blocked to prevent credential leaking over SMB.

## The Takeaway

A single tool call in auto mode passes at least five checkpoints:

1. Current run mode (Plan / Auto / Bypass)
2. User-defined rules in hooks
3. YOLO classifier model analysis
4. Bash command danger classification
5. Rules engine from config files

Multiple permission sources are evaluated and the most restrictive wins.

The naming runs counter to intuition. `--dangerously-skip-permissions` really does skip everything, classifier included, which is how it earns the "dangerously". The independent AI security review is what you opt into with `--permission-mode auto`, where every action runs through the classifier instead of an interactive prompt.

The threat modeling here is serious. It just lives in auto mode, not behind the scary flag name.
