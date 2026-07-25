---
title: "Inside Claude Code: Coordinators and Swarms"
slug: inside-claude-code-multi-agent-swarm
lang: en
date: "2026-05-07"
updated: "2026-07-25"
categories:
  - ai
description: "Claude Code's two multi-agent modes: a coordinator with disposable workers, and a swarm of teammates in terminal panes."
keywords:
  - Claude Code
  - Multi-Agent
---

_Based on the source of Claude Code v2.1.88._

A single agent has a hard ceiling. Its context fills up and it does one thing at a time. The obvious escape is more agents, which is where most multi-agent frameworks turn into a tangle of message buses and orchestration DSLs.

Claude Code has two multi-agent modes in the source, and both are refreshingly low-ceremony. One is a **coordinator** that fans work out to ephemeral workers. The other is a **swarm** of persistent teammates, each living in its own terminal pane. Both are gated behind experimental flags, so neither is on by default, but they are a clear window into where the harness is heading.

## Coordinator mode

Flip on `COORDINATOR_MODE` and set `CLAUDE_CODE_COORDINATOR_MODE=1`, and the main agent's personality changes. It stops doing the work and starts directing it:

```typescript
// coordinatorMode.ts
export function isCoordinatorMode(): boolean {
  if (feature("COORDINATOR_MODE")) {
    return isEnvTruthy(process.env.CLAUDE_CODE_COORDINATOR_MODE);
  }
  return false;
}
```

The system prompt is blunt about the new role: *"You are a **coordinator**. Direct workers to research, implement and verify code changes. Synthesize results and communicate with the user."*

It gets three orchestration tools: `Agent` to spawn a worker, `SendMessage` to continue an existing worker by its agent ID, and `TaskStop` to stop one going the wrong way. The allowlist actually holds four names, but the fourth is `SyntheticOutput`, an internal tool rather than something the coordinator directs work with.

The interaction model is fully **asynchronous**. The coordinator launches workers, tells the user what it launched, and ends its turn. It never blocks. Results come back later as user-role messages wrapped in a `<task-notification>` envelope:

```xml
<task-notification>
  <task-id>agent-a1b</task-id>
  <status>completed</status>
  <summary>Agent "Investigate auth bug" completed</summary>
  <result>Found null pointer in src/auth/validate.ts:42...</result>
</task-notification>
```

The prompt is sharp about how to treat these. Worker results and system notifications are internal signals, not conversation partners, and the coordinator is told never to thank or acknowledge them.

The work runs in phases, and the only one the coordinator does itself is the thinking:

| Phase          | Who                | Purpose                                         |
| -------------- | ------------------ | ----------------------------------------------- |
| Research       | Workers (parallel) | Investigate, find files, understand the problem |
| Synthesis      | **Coordinator**    | Read findings, craft implementation specs       |
| Implementation | Workers            | Make targeted changes, commit                   |
| Verification   | Workers            | Prove the changes work                          |

Concurrency is the same read/write discipline from the [tool execution layer](/en/posts/inside-claude-code-read-write-concurrency-separation), lifted to the agent level: *"Parallelism is your superpower. Workers are async."* Read-only research fans out freely. Write-heavy implementation runs one worker at a time per set of files. `SendMessage` lets the coordinator continue a worker whose task is done, reusing its warm context instead of paying to spin up a fresh one.

## The rule against handing off understanding

The most interesting line in the coordinator prompt is not about mechanics. It is about responsibility:

> Never write "based on your findings" or "based on the research." These phrases delegate understanding to the worker instead of doing it yourself. You never hand off understanding to another worker.

Workers cannot see the coordinator's conversation, so every worker prompt has to be self-contained: specific file paths, line numbers, exactly what to change. That forces the coordinator to digest each research result before directing the next step, instead of playing telephone.

Verification carries the same skepticism: *"Verification means proving the code works, not confirming it exists. A verifier that rubber-stamps weak work undermines everything."*

It is a design that spends its prompt budget guarding against the classic failure mode, a swarm of agents each assuming someone else understood the problem.

## Swarms: teammates in panes

The second mode is heavier and more literal. Instead of ephemeral workers reporting back through notifications, a **swarm** is a set of persistent, named teammates, each running in its own terminal pane. `utils/swarm/backends/` has interchangeable pane backends for **tmux**, **iTerm**, and an in-process variant, with a leader pane coordinating the rest.

Teammates talk through a file-based mailbox:

```
// teammateMailbox.ts
// Each teammate has an inbox at:
//   {teamsDir}/{team_name}/inboxes/{agent_name}.json
// Other teammates write messages to it; the recipient sees them as attachments.
```

`getTeamsDir()` resolves against the Claude config home, so in practice that is `~/.claude/teams/`, not a directory inside your project.

No broker, no socket protocol for the messages themselves. Just JSON files in a known directory, with the same `SendMessage` tool driving delivery. `TeamCreate` and `TeamDelete` manage the lifecycle. The kind of design that sounds too simple until you remember that a file in a shared directory is one of the most robust IPC mechanisms ever invented.

## The Takeaway

These are two genuinely different shapes of multi-agent system. The coordinator is **hub-and-spoke**: one brain, disposable hands, async notifications, and a hard rule that the brain never delegates its understanding. The swarm is a **peer team**: durable agents with names and inboxes, parked in real terminal panes you can watch.

What they share is the refusal to build a framework. The coordinator is a system prompt plus three tools. The swarm's messaging is JSON files on disk. The hard parts, meaning parallelism rules, self-contained prompts, real verification, and not thanking the robots, live in prose the model is told to follow rather than in orchestration machinery.

It is the same bet the rest of the codebase makes: give the model a clear contract and a few sharp tools, and let it coordinate.
