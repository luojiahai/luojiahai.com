---
title: "Mastering Claude Code in 30 minutes"
slug: mastering-claude-code-in-30-minutes
lang: en
date: "2026-01-01"
categories:
  - ai
description: "Learn advanced features, shortcuts, and workflows to get the most from Claude Code."
keywords:
  - Claude Code
  - Productivity
---

_Distilled from [Mastering Claude Code in 30 minutes](https://www.youtube.com/watch?v=6eBSHbLKuN0), a talk by Boris Cherny, a member of technical staff at Anthropic who created Claude Code._

## What Claude Code is

Earlier coding assistants completed a line, or a few lines, at a time. Claude Code sits at the other end of the spectrum. It is fully agentic, meant for building whole features, writing entire functions and files, and fixing entire bugs in one go.

Boris framed it as five things: terminal-based rather than an IDE, works with all your tools, fits into existing workflows, general purpose, and infinitely hackable. It runs alongside whatever editor you already use, in any terminal, locally or over SSH and tmux. You add it to your workflow instead of replacing your workflow.

It ships with about a dozen built-in tools: bash, file search, file listing, file read and write, web fetch and search, a TODO tracker, and sub-agents. The model strings them together on its own. You describe the outcome, not the sequence.

## Set up first

Run these once:

- `/terminal-setup`: enable Shift+Enter for newlines
- `/theme`: set light or dark mode
- `/install-github-app`: tag `@claude` on any GitHub issue or PR
- `/allowed-tools`: customise which tools auto-approve
- `/config`: turn on notifications

Boris also suggested enabling macOS Dictation (System Settings, Accessibility, Dictation). Double-tap the dictation key and speak your prompt. He does this for most of his prompts. Spoken prompts come out longer and more specific than typed ones.

## Start with codebase Q&A

Do not start by asking Claude to write code. Start by asking it questions about the codebase. This is what Anthropic teaches new technical hires on day one. Onboarding used to take two or three weeks. It now takes two or three days.

Example prompts from the talk:

```
How is @RoutingController.py used?
How do I make a new @app/services/ValidationTemplateFactory?
Why does recoverFromException take so many arguments? Look through git history to answer
Why did we fix issue #18363 by adding the if/else in @src/login.ts API?
In which version did we release the new @api/ext/PreHooks.php API?
Look at PR #9383, then carefully verify which app versions were impacted
What did I ship last week?
```

These go a level deeper than a text search. Ask how a class is used and Claude finds real examples of how it is instantiated, closer to documentation than to Cmd-F. Several of the prompts lean on git history: why a function takes fifteen arguments, when those arguments were introduced, which commits and issues they trace back to. Others fetch a GitHub issue or PR and cross-check it.

Nothing in the system prompt tells Claude to read git history. It knows how to use git because the model knows how to use git.

`What did I ship last week?` is a prompt Boris runs every Monday before standup. Claude reads the git log, knows his username, and returns a summary he can paste into a doc.

Q&A also teaches you the boundaries: what Claude gets in one shot, what takes two or three, and what is better done interactively. That is worth knowing before you hand it a large feature.

There is no indexing, no remote database, and no code upload. Your code stays local, and there is no setup step to wait through.

## Editing code

Once you are comfortable with Q&A, move to editing. Claude explores, brainstorms, and makes edits by chaining its tools together. You steer with plain prompts:

```
Propose a few fixes for issue #8732, then implement the one I pick
Identify edge cases that are not covered in @app/tests/signupTest.ts, then update the tests to cover these. think hard
Use 3 parallel agents to brainstorm ideas for how to clean up @services/aggregator/feed_service.cpp
```

Same small set of tools, very different jobs: propose options and let you pick, add `think hard` to buy more reasoning, or fan out parallel sub-agents on a messy cleanup.

For a large feature, ask Claude to plan before it writes. You do not need plan mode or any special tool. Tell it to make a plan and run it by you first, and it will.

**Teach Claude your tools.** For bash tools, describe them in the prompt and tell Claude to check `-h` for usage:

```
Use the barley CLI to check for error logs in the last training run. Use -h to check how to use it.
```

`barley` is a made-up CLI from the slides, but the pattern is real. For MCP tools, register once with `claude mcp add barley_server -- node myserver`, then reference them by name. If you find yourself adding the same tool repeatedly, put it in `CLAUDE.md` so it persists across sessions.

**Match the workflow to the task.** Boris showed three.

Explore, plan, confirm, code, commit. Good for non-trivial bugs where you want to see the approach before it lands.

```
Figure out the root cause for issue #983, then propose a few fixes. Let me choose an approach before you code. ultrathink
```

Write tests, commit, code, iterate, commit. Write failing tests first, commit them, then implement until they pass.

```
Write tests for @utils/markdown.ts to make sure links render properly (note the tests won't pass yet, since links aren't yet implemented). Then commit. Then update the code to make the tests pass.
```

Write code, screenshot, iterate. Give Claude a mock and a way to screenshot the result, such as Puppeteer or the iOS simulator. Two or three loops usually gets it close to the mock. Claude Code has been multimodal from the start: drag and drop the mock, paste it, or give it a file path.

```
Implement [mock.png]. Then screenshot it with Puppeteer and iterate till it looks like the mock.
```

The pattern behind all three is the same. Give Claude a way to check its own work. With a feedback loop it iterates. Without one, you get a single shot.

One more prompt Boris uses constantly:

```
commit, push, pr
```

Claude reads the git log to work out the commit format, makes the commit, pushes a branch, and opens a PR.

## Context is everything

The more context Claude has, the better its decisions. `CLAUDE.md` is the simplest way to give it some.

`CLAUDE.md` is read into context at the start of every session, effectively as part of the first message. Put it in your project root, check it into source control, and share it with your team.

Put in common bash commands, style conventions, architectural decisions, important files, and the MCP tools your team uses. Keep it short. A long `CLAUDE.md` burns context without adding much.

The hierarchy:

```
/<enterprise root>/CLAUDE.md     shared across all projects
~/.claude/CLAUDE.md              your global config
project-root/
  CLAUDE.md                      checked in, shared with the team
  CLAUDE.local.md                not checked in
```

You can also pull context in on demand:

- Slash commands in `.claude/commands/`, invoked as `/project:foo`, or in `~/.claude/commands/` as `/user:foo`
- `@filename` to pull a specific file into context
- Nested `CLAUDE.md` files, pulled in when Claude works in that directory

Slash commands go further than they look. The Claude Code repo has a `label-github-issues.md` command that runs from GitHub Actions to label issues, so nobody has to do it by hand.

Boris's advice is to take the time to tune your context. Run `CLAUDE.md` through a prompt improver. Decide whether it is for you or the whole team, and whether it should load automatically or on demand. Getting this right has a large effect on output quality.

## Share with your team

Configure once, check it in, and everyone who clones the repo gets the same tools, memory, and permissions.

Almost everything can be set at four levels: enterprise policy, your global config, project (checked in), and project (just you).

|                    | Enterprise policy (shared)                              | Global (just me)          | Project (shared)        | Project (just me)             |
| ------------------ | ------------------------------------------------------- | ------------------------- | ----------------------- | ----------------------------- |
| **Memory**         | `/Library/Application Support/ClaudeCode/CLAUDE.md`     | `~/.claude/CLAUDE.md`     | `CLAUDE.md`             | `CLAUDE.local.md`             |
| **Slash commands** |                                                         | `~/.claude/commands/`     | `.claude/commands/`     |                               |
| **Permissions**    | `/Library/Application Support/ClaudeCode/policies.json` | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **MCP servers**    |                                                         | `claude mcp`              | `.mcp.json`             | `claude mcp`                  |

Boris called this "kind of an insane matrix". Claude Code supports it because engineering workflows differ at every company. If you are not sure where to start, start with shared project context. One person does the work once and the whole team benefits.

The enterprise level is also where guardrails go. Auto-approve a test command for every employee, or block a URL so no individual can fetch it. The same applies to MCP servers: check a `.mcp.json` into the repo and anyone who runs Claude Code there is prompted to install them. Anthropic's apps repo ships a Puppeteer MCP server this way, so every engineer can drive a browser and screenshot UIs without setting it up.

Run `/memory` to see which memory files are active and to edit any of them. Type `#` followed by a note to save it mid-session, and Claude will ask which memory file it should go into.

## Interlude: keybindings

These are hard to discover in a terminal, so here is a quick reference:

| Key                       | What it does                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `Shift+Tab`               | Toggle auto-accept edits mode (edits apply automatically; bash commands still ask) |
| `#`                       | Create a memory (you choose which file it goes into)                               |
| `!`                       | Drop into bash mode (the command runs locally and goes into context)               |
| `@`                       | Add a file or folder to context                                                    |
| `Esc`                     | Cancel what Claude is doing                                                        |
| `Esc Esc`                 | Jump back in history                                                               |
| `Ctrl+R`                  | Show verbose output, the same thing Claude sees in its context window              |
| `--resume` / `--continue` | Resume a specific past session, or continue the most recent one                    |
| `/vibe`                   | An easter egg on the slide, left unexplained                                       |

`Esc` is worth calling out. It is safe at any point, mid-edit or mid-command, and will not corrupt the session. Boris uses it to interrupt a 20-line diff, correct the one line that is wrong, and have Claude redo the edit.

## Claude Code SDK

For automation and CI, use the SDK. It is the same engine Claude Code runs on, exposed as a CLI, and it can talk to the Anthropic API, Amazon Bedrock, or Google Vertex.

```bash
claude -p "what did I do this week?" \
  --allowedTools Bash(git log:*) \
  --output-format json
```

Treat it like a Unix utility. Pipe in, pipe out:

```bash
git status | \
  claude -p "what are my changes?" \
  --output-format=json | \
  jq '.result'
```

Boris uses it in CI, incident response, and other pipelines. Pipe in a log file from GCP or output from Sentry and have Claude make sense of it.

## Running Claude Code in parallel

Boris described himself as "sort of a Claude normie": usually one session, plus a few terminal tabs for different repos. The power users he sees, inside and outside Anthropic, almost always run several at once.

- Multiple checkouts of the same repo in separate terminal tabs
- One checkout with git worktrees for isolation
- SSH and tmux for remote sessions
- GitHub Actions jobs launched in parallel

This is still rough to set up, and Anthropic is working on making it easier. If your tasks are independent, there is no reason to run them one at a time.

## From the Q&A

**Adoption.** About 80% of technical staff at Anthropic, engineers and researchers alike, use Claude Code every day. Researchers lean on tools like the notebook tool to edit and run notebooks.

**Why a CLI and not an IDE?** Anthropic engineers use a wide spread of editors, and the terminal is the one common denominator. Boris also expects models to keep improving fast enough that heavy editor UI may not be worth the investment.

**The hardest part to build** was making bash safe. Bash can change system state in surprising ways, but approving every command by hand kills productivity. The answer was a tiered permission system: detect read-only commands, statically analyse which commands can be combined safely, and allow-list or block-list at different levels.

## The seven tips

1. Start with codebase Q&A
1. Practise prompting to learn what Claude gets on its own and what needs guidance
1. Teach Claude to use your tools
1. Tailor the workflow to the task
1. The more context you give Claude, the smarter it will be
1. Take time to tune context
1. Configure `CLAUDE.md`, MCP servers, permissions, and slash commands for your team, and check them into git

If you have been using Claude Code as a smarter autocomplete, you are leaving a lot on the table.
