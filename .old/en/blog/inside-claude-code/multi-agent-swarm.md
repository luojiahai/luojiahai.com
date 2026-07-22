---
description: "Claude Code's two multi-agent modes: a coordinator with disposable workers, and a swarm of teammates in terminal panes."
date: "2026-05-07"
tags: ["Claude Code", "Multi-Agent"]
---

# Inside Claude Code: Coordinators and Swarms

A single agent has a hard ceiling. Its context fills up, and it does one thing at a time. The obvious escape is more agents — but "more agents" is where most multi-agent frameworks turn into a tangle of message buses and orchestration DSLs.

Claude Code has two multi-agent modes in the source, and both are refreshingly low-ceremony. One is a **coordinator** that fans work out to ephemeral workers; the other is a **swarm** of persistent teammates that each live in their own terminal pane. Both are gated behind experimental flags (`COORDINATOR_MODE` and the swarm feature gates), so neither is on by default — but they're a clear window into where the harness is heading.

## Coordinator mode

Flip on `COORDINATOR_MODE` and set `CLAUDE_CODE_COORDINATOR_MODE=1`, and the main agent's whole personality changes. It stops doing the work and starts directing it:

```typescript
// coordinatorMode.ts
export function isCoordinatorMode(): boolean {
  if (feature("COORDINATOR_MODE")) {
    return isEnvTruthy(process.env.CLAUDE_CODE_COORDINATOR_MODE);
  }
  return false;
}
```

The coordinator's system prompt is blunt about the new role: _"You are a **coordinator**. Direct workers to research, implement and verify code changes. Synthesize results and communicate with the user."_ It gets exactly three orchestration tools — `Agent` (spawn a worker), `SendMessage` (continue an existing worker by its agent ID), and `TaskStop` (stop one going the wrong way).

The interaction model is fully **asynchronous**. The coordinator launches workers, tells the user what it launched, and _ends its turn_. It never blocks waiting. Worker results come back later as user-role messages wrapped in a `<task-notification>` envelope:

```xml
<task-notification>
  <task-id>agent-a1b</task-id>
  <status>completed|failed|killed</status>
  <summary>Agent "Investigate auth bug" completed</summary>
  <result>Found null pointer in src/auth/validate.ts:42...</result>
</task-notification>
```

There's a sharp instruction about how to treat these:

> Worker results and system notifications are internal signals, not conversation partners — never thank or acknowledge them.

The work is organized into phases, and the only one the coordinator does itself is the thinking:

| Phase          | Who                | Purpose                                         |
| -------------- | ------------------ | ----------------------------------------------- |
| Research       | Workers (parallel) | Investigate, find files, understand the problem |
| Synthesis      | **Coordinator**    | Read findings, craft implementation specs       |
| Implementation | Workers            | Make targeted changes, commit                   |
| Verification   | Workers            | Prove the changes work                          |

Concurrency here is the same read/write discipline from the [tool execution layer](./read-write-concurrency-separation), lifted up to the agent level: _"Parallelism is your superpower. Workers are async."_ Read-only research fans out freely; write-heavy implementation runs one worker at a time per set of files. And `SendMessage` lets the coordinator continue a worker whose task is done to reuse its already-warm context, rather than paying to spin up a fresh one.

## The rule against handing off understanding

The most interesting line in the coordinator prompt isn't about mechanics — it's about responsibility:

> Never write "based on your findings" or "based on the research." These phrases delegate understanding to the worker instead of doing it yourself. You never hand off understanding to another worker.

Because workers can't see the coordinator's conversation, every worker prompt has to be self-contained — specific file paths, line numbers, exactly what to change. That forces the coordinator to actually digest each research result before directing the next step, instead of playing telephone. The verification phase carries the same skepticism: _"Verification means proving the code works, not confirming it exists. A verifier that rubber-stamps weak work undermines everything."_

It's a multi-agent design that spends its prompt budget guarding against the classic failure mode — a swarm of agents that each assume someone else understood the problem.

## Swarms: teammates in panes

The second mode is heavier and more literal. Instead of ephemeral workers reporting back through notifications, a **swarm** is a set of persistent, named teammates — and each one runs in its own terminal pane. The `utils/swarm/backends/` directory has interchangeable pane backends for **tmux**, **iTerm**, and an in-process variant, with a leader pane coordinating the rest.

Teammates talk to each other through a dead-simple, file-based mailbox:

```
// teammateMailbox.ts
// Each teammate has an inbox at:
//   .claude/teams/{team_name}/inboxes/{agent_name}.json
// Other teammates write messages to it; the recipient sees them as attachments.
```

No broker, no socket protocol for the messages themselves — just JSON files in a known directory, with the same `SendMessage` tool driving delivery. `TeamCreate` and `TeamDelete` manage the lifecycle. It's the kind of design that sounds too simple until you remember that "a file in a shared directory" is one of the most robust IPC mechanisms ever invented.

## The Takeaway

These are two genuinely different shapes of multi-agent system. The coordinator is **hub-and-spoke**: one brain, disposable hands, async notifications, and a hard rule that the brain never delegates its understanding. The swarm is a **peer team**: durable agents with names and inboxes, parked in real terminal panes you can watch.

What they share is the refusal to build a framework. The coordinator is a system prompt plus three tools. The swarm's messaging is JSON files in `.claude/teams/`. The hard parts — parallelism rules, self-contained prompts, real verification, not thanking the robots — live in prose the model is told to follow, not in orchestration machinery. It's the same bet the rest of the codebase makes: give the model a clear contract and a few sharp tools, and let it coordinate.
