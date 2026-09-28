# Conventions for the session-skills plugin

Short shared text for the skills in this plugin. The work plugin keeps the full
version in its `references/conventions.md` and `references/helpers.md`; a
plugin cannot read files in another plugin, so this is the copy for this
plugin. Keep the wording the same as the work plugin's.

## Voice

Every skill carries this line near its top:

> Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Agents do not receive the output style. `agents/handoff-verifier.md` carries
its own writing rules.

## Opening another skill

- Claude Code: use the Skill tool with the skill's name, for example
  `memory-save`.
- Codex: read that skill's `SKILL.md` from the path shown in the skill list,
  then follow it.
- When the skill is not installed, say so in one line and carry on without it.

## Running an agent from this plugin

This plugin ships one agent, `agents/handoff-verifier.md`, used by `handoff`.

- Claude Code: start it with the Agent tool. It is listed with the plugin name
  in front, for example `session-skills:handoff-verifier`. Pass `model: opus`. Run it in
  the foreground and wait for its report.
- Codex: this plugin's agents do not load there. Read the agent's file in this
  plugin's `agents/` folder and give its full text, with the brief, to a
  native Codex worker. With no worker, do the work yourself and say that no
  independent check ran.

## Running `toolkit` commands

- Put each `toolkit` command on its own line and run it alone, as a plain
  command, in both hosts. Do not join it to another command with `&&`, `;`, or
  a pipe, and do not wrap it in `$(...)`, a loop, or a script. In Codex such a
  command runs inside the sandbox, which blocks Notion, Hindsight, and the
  main checkout's `.work-items/` and `.memory/` from a worktree.
- Exit codes: `0` done; `1` error; `2` validation failure (fix what it names
  and run it again); `3` not supported for this tracker or memory backend;
  `4` not a Toolkit V2 project.
- Text in a command. Inside double quotes the shell runs backticks and
  `$(...)` as commands and drops that part of the text, and the command still
  says "Saved". So:
  - One-line values (`--note`, `--effect`, `--title`, `--description`): single
    quotes, with an apostrophe written `'\''`.
  - Section or focus text in Claude Code: standard input, with `--set-file -`
    followed by a quoted heredoc (`<<'EOF'`, the text, then a line holding only
    `EOF`). Claude Code refuses `rm` outside the project, so a temporary file
    there could never be deleted.
  - The same text in Codex: `--text '<text>'`, or a file written with the file
    edit tool in a new folder made with `mktemp -d`, the `toolkit` command run
    alone with that file, and the file and the folder deleted right after. A
    heredoc in Codex runs the command inside the sandbox.
  - Never use a fixed name such as `/tmp/focus.md`, and never leave draft
    files inside `.work-items/` or `.memory/`.
- Work items and memory change only through `toolkit` commands. Never edit
  `.work-items/` or `.memory/` files by hand, and never commit them: both
  folders are Git-ignored and live in the main checkout.

## Tracker types

Read `tracker.type` from `.toolkit.json` at the project root.

- `local` and `notion`: use `toolkit work ...` commands.
- `github` and `jira`: `toolkit work` commands exit with code 3 and print the
  path of the written instructions for that tracker. Follow those
  instructions to make the same change on the issue.
- No `.toolkit.json`, or no `"toolkit": "toolkit-v2"` key in it: the project is
  not set up with Toolkit V2. Skip every work-item and memory step and say so in
  one line.

## Asking the owner

- Ask in the reply text. Never ask through a question tool (such as Codex's
  `request_user_input`): he may never see it.
- End every reply with the one question he must answer, or the exact words
  that continue the work.

## Reporting a save

- Save each settled answer before moving on, then read it back. A command that
  exits `0` is not proof by itself.
- A write failed: lead with "Not saved", name what was not saved and where it
  should go, and keep the text so it can be saved later.
- The write worked and the read-back failed: lead with "Saved but not
  verified".
