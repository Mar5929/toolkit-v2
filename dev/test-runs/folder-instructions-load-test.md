# How a folder's own instruction file reaches the agent in Claude Code

Date: 2026-10-05. Claude Code 2.1.289, run with `claude -p` in the test sign-in
(`CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`), in a scratch project.
Work item: TKV-24.

## Question

The layout audit could not tell whether Claude Code follows an `@AGENTS.md`
import inside a `CLAUDE.md` that sits in a sub-folder and loads later in a
session.

## Set-up

A scratch Git project with a root `CLAUDE.md` holding `@AGENTS.md`, a root
`AGENTS.md`, and a folder `system/` holding `data-model.md` and an `AGENTS.md`
with one line that names a code word. The prompt asked the agent to read
`system/data-model.md` with the Read tool and then give the code word.

The test read the session's record file afterwards and looked for the code
word in an entry of type `attachment` / `nested_memory`. That shows whether
Claude Code put the folder's text in front of the agent, whatever the model
then answered.

## Result

| What `system/` holds besides `AGENTS.md` | Folder text put in front of the agent |
| --- | --- |
| `CLAUDE.md` with the one line `@AGENTS.md` | Yes |
| `CLAUDE.md` as a link to `AGENTS.md` | Yes |
| `CLAUDE.md` holding the text itself | Yes |
| Nothing; a rule in `.claude/rules/` with `paths: system/**` holding the text | Yes |
| Nothing (only `AGENTS.md`) | No |

## What the model did with it

Sonnet gave the code word in every run where the text was loaded. Haiku gave
it in 1 of 8 such runs. The text was in its context in each of those runs.
So loading is reliable; a small model acting on a loaded line is not. A fact
that must always be true needs a check, not only a loaded sentence.

## Not tested

- A session that runs in a Git worktree and reads a file in the main
  checkout's `work-items/` or `memory/`.
- Codex. The captured documentation says Codex loads a nested `AGENTS.md`
  only when it is started in or below that folder.
