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

_Distilled from [Mastering Claude Code in 30 minutes](https://www.youtube.com/watch?v=6eBSHbLKuN0), a talk by Boris Cherny — a member of technical staff at Anthropic who created Claude Code. Learn advanced features, shortcuts, and workflows to get the most from Claude Code._

## What Claude Code actually is

It’s not a fancy autocomplete. Earlier coding assistants completed a line — or a few lines — at a time; Claude Code is built for the other end of the spectrum. It’s fully agentic, meant for building whole features, writing entire functions and files, and fixing entire bugs in one go. Boris framed it as five things: terminal-based (not an IDE itself), works with all your tools, fits into your existing workflows, general purpose, and infinitely hackable. In practice that means it runs alongside whatever editor you live in — VS Code, Xcode, JetBrains, Vim, Emacs — in any terminal, locally or over remote SSH and tmux. You don’t swap out your workflow. You just add Claude Code to whatever you’re already doing.

Under the hood it ships with a small, sharp set of built-in tools — about a dozen: bash execution, file search, file listing, file read and write, web fetch and search, a TODO tracker, and sub-agents. That’s it. The magic is in how the model strings them together autonomously. You don’t say “use this tool, then that one” — you describe the outcome and it decides how to explore, brainstorm, and execute.

## Setting up properly

Before diving into real work, run these once:

- `/terminal-setup`: enables Shift+Enter for newlines so you’re not fighting the prompt
- `/theme`: set light or dark mode
- `/install-github-app`: lets you `@claude` on any GitHub issue or PR
- `/allowed-tools`: customise which tools auto-approve so you’re not clicking through confirmations constantly
- `/config`: turn on notifications

One underrated tip Boris mentioned: enable macOS Dictation (System Settings → Accessibility → Dictation), then double-tap the dictation key and just talk to Claude Code. He does this for a lot of his prompts — speaking to it like you would another engineer. Your prompts come out more natural, more detailed, and faster to produce than typing.

## Start with codebase Q&A

This is the single best way to onboard yourself or your team to Claude Code. Don’t start by asking it to write code. Start by asking it questions.

At Anthropic, new technical hires used to take 2–3 weeks to get up to speed. With Claude Code, it’s down to 2–3 days. They just point it at the codebase and ask questions.

Some example prompts from Boris’s slides:

```
How is @RoutingController.py used?
How do I make a new @app/services/ValidationTemplateFactory?
Why does recoverFromException take so many arguments? Look through git history to answer
Why did we fix issue #18363 by adding the if/else in @src/login.ts API?
In which version did we release the new @api/ext/PreHooks.php API?
Look at PR #9383, then carefully verify which app versions were impacted
What did I ship last week?
```

Notice what these actually ask for. Claude doesn’t just grep for a string and call it done — it goes a level deeper, finding real examples of how a class is instantiated and used, the kind of answer you’d get from documentation rather than from Cmd-F. Several of them lean on git history (“why does this function have 15 arguments, and why are they named so weirdly?”) or pull a GitHub issue or PR via web fetch and cross-check it. The striking part, as Boris pointed out: nobody prompted Claude to do any of this. There’s nothing in the system prompt about reading git history — the model just knows how to use git. As he put it, “we’re lucky to be building on such a good model.”

That `What did I ship last week?` prompt is something Boris runs every Monday in his weekly standup. Claude looks through the git log, knows your username, and gives you a clean summary you can copy-paste into a doc. Zero effort.

The Q&A phase also teaches you where the boundaries are: what Claude gets immediately versus what needs more hand-holding — what can be one-shotted, two-shotted, or three-shotted, and what’s better done interactively in the REPL. That mental model is worth building before you hand it a 3,000-line feature request.

One thing worth noting: there’s no indexing, no remote database, no code upload. Everything stays local. You just start it and it works.

## Tools and workflows

Once you’re comfortable with Q&A, move to code editing. Claude will explore the codebase, brainstorm, and then make edits, all by chaining its tools together without you having to orchestrate any of it. You steer it with plain prompts. A few Boris showed:

```
Propose a few fixes for issue #8732, then implement the one I pick
Identify edge cases that are not covered in @app/tests/signupTest.ts, then update the tests to cover these. think hard
Use 3 parallel agents to brainstorm ideas for how to clean up @services/aggregator/feed_service.cpp
```

Notice the range: let Claude propose a few options and you pick one; tell it to `think hard` (one of several thinking triggers — `ultrathink` is the strongest); or fan out parallel sub-agents on a gnarly cleanup. Same small handful of tools, very different jobs. (The fourth prompt on that slide, `commit, push, pr`, gets its own treatment below.)

**Teach Claude your tools.** The moment you plug in your team’s tools is when Claude Code really starts to shine. For bash tools, just tell it about them in the prompt. Even tell it to use `-h` to figure out usage (Boris’s `barley` CLI is a made-up example, but the pattern is real):

```
Use the barley CLI to check for error logs in the last training run. Use -h to check how to use it.
```

For MCP tools, register them once — `claude mcp add barley_server -- node myserver` — and then reference them in your prompts. If you’re adding the same tool repeatedly, dump it in your `CLAUDE.md` so it persists across sessions.

**Pick the right workflow for the task.** Boris highlighted three patterns:

**Explore → plan → confirm → code → commit.** Ask Claude to propose a few fixes, pick one, then have it implement and commit. Good for non-trivial bugs where you want to understand what’s being changed before it happens.

```
Figure out the root cause for issue #983, then propose a few fixes. Let me choose an approach before you code. ultrathink
```

**Write tests → commit → code → iterate → commit.** TDD-style. Write failing tests first, commit them, then implement until they pass.

```
Write tests for @utils/markdown.ts to make sure links render properly (note the tests won't pass yet, since links aren't yet implemented). Then commit. Then update the code to make the tests pass.
```

**Write code → screenshot → iterate.** This one’s powerful. Give Claude a mock image and a tool to screenshot the result (like Puppeteer or an iOS simulator), and let it iterate. Two or three loops and it usually gets very close to the mock. Claude Code has been fully multimodal from the start — even in a terminal, you can drag-and-drop the mock, give it a file path, or paste the image straight in.

```
Implement [mock.png]. Then screenshot it with Puppeteer and iterate till it looks like the mock.
```

The key insight is: give Claude a way to check its own work. With a feedback loop it can iterate. Without one, you get one shot.

One more incantation Boris uses constantly:

```
commit, push, pr
```

That’s the whole prompt. Claude looks through the git log to figure out the commit format, makes the commit, pushes to a branch, and opens a PR on GitHub. No hand-holding needed.

## Context is everything

The more context Claude has, the smarter its decisions will be. This is where the `CLAUDE.md` file comes in.

`CLAUDE.md` is a special file that gets automatically read into context at the start of every session. Think of it as the first message in every conversation. Put it in your project root, check it into source control, and share it with your team.

What goes in it: common bash commands, style guides, architectural decisions, important files, MCP tools your team uses. Keep it short. If it gets too long it just burns context without adding much value.

The file hierarchy looks like this:

```
/<enterprise root>/CLAUDE.md     → shared across all projects (managed)
~/.claude/CLAUDE.md              → your global config
project-root/
  CLAUDE.md                      → checked in, shared with team
  CLAUDE.local.md                → not checked in, just for you
```

Beyond auto-loaded context, you can pull things in on demand:

- Slash commands live in `.claude/commands/`. Type `/project:foo` or `/user:foo` to invoke them.
- `@filename` mentions pull specific files into context.
- Nested `CLAUDE.md` files in subdirectories get pulled in automatically when Claude works in those directories.

The slash commands are more powerful than they look. At Anthropic, they have a `label-github-issues.md` command that runs automatically via GitHub Actions to label issues. Write it once, run it everywhere.

Boris’s advice: take time to actually tune your context. Run your `CLAUDE.md` through a prompt improver. Ask yourself whether it’s for you or your whole team, and whether it should load automatically or on demand. Getting this right has a dramatic effect on output quality.

## Share with your team

This is the leverage play. Build once, use everywhere. Configure your setup, check it into the repo, and every engineer who clones it gets the whole thing automatically: the right tools, the right memory, the right permissions.

Almost everything about Claude Code can be shared at four levels — enterprise policy, your global config, project (checked in), or project (just you):

|                    | Enterprise policy (shared)                              | Global (just me)          | Project (shared)        | Project (just me)             |
| ------------------ | ------------------------------------------------------- | ------------------------- | ----------------------- | ----------------------------- |
| **Memory**         | `/Library/Application Support/ClaudeCode/CLAUDE.md`     | `~/.claude/CLAUDE.md`     | `CLAUDE.md`             | `CLAUDE.local.md`             |
| **Slash commands** | —                                                       | `~/.claude/commands/`     | `.claude/commands/`     | —                             |
| **Permissions**    | `/Library/Application Support/ClaudeCode/policies.json` | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **MCP servers**    | —                                                       | `claude mcp`              | `.mcp.json`             | `claude mcp`                  |

Boris called this “kind of an insane matrix” — Claude Code supports this many configurations because engineering workflows differ at every company. If you’re not sure where to start, his advice was: **start with shared project context.** One person does a little work, checks it in, and the whole team gets the network effect.

You can also use the enterprise level to enforce guardrails. Need a test command to always auto-approve? Add it to the enterprise policy and it’s approved for every employee. Need to block a URL from ever being fetched? Add it there and no individual can override it. Same for MCP servers: check a `.mcp.json` into the repo and anyone who runs Claude Code in it is prompted to install them. At Anthropic, the apps repo ships a Puppeteer MCP server this way, so every engineer can drive a browser and screenshot UIs without setting anything up themselves.

Run `/memory` to see exactly which memory files are active in your current session and to edit any of them directly. Type `#` followed by anything to save a note mid-session — Claude will ask _which_ memory file it should go into, so you stay in control of what lands where.

## Interlude: Keybindings

These aren’t well-advertised, so here’s a quick reference:

| Key                       | What it does                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `Shift+Tab`               | Toggle auto-accept edits mode (edits apply automatically; bash commands still ask) |
| `#`                       | Create a memory (you choose which file it goes into)                               |
| `!`                       | Drop into bash mode (command runs locally and goes into context)                   |
| `@`                       | Add a file or folder to context                                                    |
| `Esc`                     | Cancel what Claude is doing — safe to hit anytime, mid-edit or mid-command         |
| `Esc Esc`                 | Jump back in history                                                               |
| `Ctrl+R`                  | Show verbose output (what Claude sees in its context window)                       |
| `--resume` / `--continue` | Resume a specific past session, or continue the most recent one                    |
| `/vibe`                   | Boris’s easter egg on the slide — go find out                                      |

The `Esc` key deserves a callout. You can hit it at any point, mid file edit or mid bash command, and it won’t corrupt anything. Boris uses it to interrupt a 20-line diff, tell Claude to change one line, and then have it redo the edit. Very handy.

## Claude Code SDK

For automation and CI, the SDK is what you want. It’s the _exact_ same engine Claude Code itself runs on, exposed as a CLI utility — and it can talk to the Anthropic API, Amazon Bedrock, or Google Vertex.

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

Boris uses this in CI pipelines, incident response, and all sorts of automation. You can pipe in log files from GCP, Sentry output, anything, and have Claude do something useful with it. The combinations are, as he put it, endless.

## Running Claude Code in parallel

Power users don’t run one Claude session. They run many — what Boris called “multi-Claude.” He cheerfully admitted he’s “sort of a Claude normie” himself, usually one session with a few terminal tabs for different repos. But the power users he sees, inside and outside Anthropic, almost always run several at once.

A few patterns Boris called out:

- Multiple checkouts of the same repo in separate terminal tabs, one Claude per tab
- Git worktrees for isolation across parallel sessions
- SSH + Tmux tunnels for remote sessions
- GitHub Actions jobs running in parallel

This is still a bit rough to set up, and Anthropic is actively working on making it easier — but the throughput gains are real. If you have independent tasks, there’s no reason to run them sequentially.

## From the Q&A

A few things from the audience questions worth knowing:

- **Adoption.** Roughly 80% of technical staff at Anthropic — engineers _and_ researchers — use Claude Code every day. Researchers lean on tools like the notebook tool to edit and run notebooks.
- **Why a CLI, not an IDE?** Two reasons. Anthropic engineers use a huge spread of editors (VS Code, Xcode, Vim, Emacs…) and the terminal is the one common denominator. And Boris expects models to keep improving so fast that heavy editor UI may matter less before long — so they’re deliberately not over-investing in it.
- **The hardest part to build** was making bash safe. Bash can change system state in surprising ways, but approving every command by hand kills productivity. The answer is a tiered permission system: detect read-only commands, statically analyze which commands can be safely combined, and let you allow-list and block-list at different levels.

## TL;DR

Boris laid out 7 tips, and they build on each other in a clear progression:

1. Use codebase Q&A to get started and build intuition
1. Practice prompting to learn what Claude gets immediately vs. what needs guidance
1. Teach Claude your tools (bash CLIs, MCP servers)
1. Match the workflow to the task (explore+plan, TDD, screenshot iteration)
1. More context = smarter output, so set up your `CLAUDE.md`
1. Take time to tune context, it compounds
1. Check everything into git and share with your team

If you’ve been using Claude Code as a smarter autocomplete, you’re leaving a lot on the table. The agentic loop with proper tools and context is a different experience entirely.
