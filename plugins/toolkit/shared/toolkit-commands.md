# Running `toolkit` commands

Purpose: how to run a `toolkit` command in Claude Code and in Codex, how to
pass text in one, and what each exit code means. Every skill that runs a
`toolkit` command follows this file.

## Contents

- Running toolkit commands
- Text in a command
- Exit codes
- Reporting a save
- Reading output and updating what you read
- Right and wrong examples

## Running toolkit commands

- Put each `toolkit` command on its own line and run it as a plain command,
  in both hosts. Do not join it to another command with `&&`, `;`, or a pipe,
  and do not wrap it in `$(...)`, a loop, or a script. This holds for read
  commands too: `toolkit work decisions && toolkit work show WI-001` is two
  commands, run one after the other.
- Why, in Codex: the project's command rule (`.codex/rules/toolkit.rules`)
  runs a `toolkit` command outside the sandbox only when it is the whole
  command. A `toolkit` command joined to anything else (`&&`, `;`, a pipe, a
  heredoc, `cd ... &&`) or run from a script (for example Python's
  `subprocess`) runs inside the Codex sandbox. The sandbox blocks Notion, the
  local Hindsight server, and the main checkout's `.work-items/` and
  `.memory/` from a worktree, so the command fails or reports the wrong
  cause.
- The one thing a Claude Code command may carry is its own text on standard
  input (`--set-file -` with a quoted heredoc; "Text in a command", below).
- Five commands ask the owner first in Codex, because they are hard or
  impossible to undo: `toolkit machine-setup`, `toolkit memory delete`,
  `toolkit memory import`, `toolkit import`, and
  `toolkit hindsight service install` or `start`. Get his yes in the reply
  before you run one, in both hosts.
- Never change a work item or a memory record with a script or a shell write
  (Python, Node, `sed -i`, `cat >`, `tee`, `cp`). Use the `toolkit` command
  that owns it. The hooks refuse the shell write, so it only wastes a step.
- `toolkit help <command>` prints every option of one command.

## Text in a command

The shell changes text before the command sees it. Inside double quotes it
runs anything between backticks and anything in `$(...)` as a command, and
puts that command's output in the text. The command then saves the text with
those parts missing and still reports success. So:

- **One-line values** (`--note`, `--effect`, `--append-row`, `--title`,
  `--reason`, `--quote`, `--evidence`, `--description`, `--source`): put them
  in single quotes, in both hosts. Inside single quotes the shell changes
  nothing. Never use double quotes for text.
- **An apostrophe inside single quotes:**
  - Claude Code: write it as `'\''`, for example
    `--note 'Owner'\''s words: "ship it"'`.
  - Codex: write it as ’ (the curly apostrophe, U+2019), or reword the text.
    Never `'\''` in Codex: the command rule does not match that form, so the
    command runs inside the sandbox, and the tool call can drop the
    backslash, which leaves a quote that is never closed.
- **Section, design, focus, glossary, and memory text in Claude Code:** pass
  it on standard input with `--set-file -` (or `--body-file -` for a memory
  save) and a quoted heredoc. The quotes around `EOF` in `<<'EOF'` stop the
  shell from changing anything in the text, and no file is left anywhere.
  Claude Code refuses `rm` outside the project, so a temporary file there
  could never be deleted. Write the command, then the text, then a line
  holding only `EOF`:

  ```text
  toolkit work edit <id> --section 'Overview' --set-file - <<'EOF'
  <the whole section text>
  EOF
  ```

- **The same text in Codex:** a heredoc runs the command inside the sandbox,
  so do not use one. Give short or medium text in single quotes
  (`--text '<text>'`; newlines inside the quotes are kept). For longer text:
  1. Make a new folder for this one save with `mktemp -d`. Its name is
     unique, so two sessions or two projects never share a file.
  2. Write the file in it with the file edit tool (`apply_patch`).
  3. Run the `toolkit` command alone, with the file's full path.
  4. Delete the file and the folder right after the command succeeds
     (`rm <file>`, then `rmdir <folder>`), before you ask the owner anything.

  Never write the file and run the `toolkit` command in one shell command.

  ```text
  toolkit work edit <id> --section 'Overview' --text '<text>'
  toolkit work design <id> --text '<text>' --status proposed
  toolkit memory focus --text '<text>' --expect <version>
  ```

- Never use a fixed file name such as `/tmp/wi001-requirements.md`. Every
  project starts at `WI-001`, so another session's save could land in this
  item.
- Never leave a draft file inside `.work-items/` or `.memory/`. A second
  `DESIGN.md`-shaped file there confuses the design lookup, and a stray note
  in `.memory/` is read as a memory.

## Exit codes

`toolkit help work` prints them as: "0 ok, 1 error, 2 validation failure or a
refused gate, 3 not supported for this tracker, 4 not a toolkit project."
`toolkit help memory` uses the same numbers: "1 error or not found, 2 refused
(a rule or a stale --expect), 3 not supported by this backend".

| Code | Meaning | What to do |
| --- | --- | --- |
| `0` | Done. | Read back what you wrote before you report it as saved ("Reporting a save", below). A "Note:" line in the output still needs action: report it to the owner, or do what it says. |
| `1` | Error, or the record was not found. | Read the message. It names the cause and usually the fix. Do not run the same command again unchanged. |
| `2` | Validation failure, a refused gate, or a stale `--expect`. | Fix what the message names and run the command again. A refused gate means an approval is missing: ask the owner for it. Never work around a refusal. |
| `3` | Not supported for this tracker or memory backend. | For a GitHub or Jira tracker, the message prints the path of the written instructions for that tracker. Follow them to make the same change on the issue. |
| `4` | Not a Toolkit V2 project. | Skip every work item and memory step and say so in one line. To set the project up, open the `project-setup` skill. |

`toolkit: command not found` means this computer cannot reach the command.
The `project-setup` skill fixes that.

## Reporting a save

- Save each settled answer before moving on, then read it back. A command
  that exits `0` is not proof by itself.
- A write failed: lead the reply with "Not saved". Name what was not saved
  and where it should go, and keep the text so it can be saved later.
- "Saved but not verified" in the output means the write happened and the
  read-back failed. The message names the first part that differs. Lead the
  reply with "Saved but not verified", say which part, and read the record
  back to judge it.

## Reading output and updating what you read

- Add `--json` when you need to read the output field by field, for example
  a record's `version`.
- `--expect <version>` tells the command which version of a record you read.
  The command refuses the save (exit `2`) when the record changed since then,
  so you never overwrite a newer edit. Read it again, merge, and save with the
  new version. `toolkit memory focus`, `toolkit memory glossary`, and
  `toolkit memory save` take it. `--expect absent` says it must not exist
  yet: a new record, or a project with no focus yet.

## Right and wrong examples

1. Two reads.
   - Wrong: `toolkit work list && toolkit work show WI-004`
   - Right: `toolkit work list`, then, as a second command,
     `toolkit work show WI-004`.
2. A history note with an apostrophe.
   - Wrong: ``toolkit work history WI-004 --note "Owner's words: `ship it`"``
     (double quotes: the shell runs the words between the backticks as a
     command and saves its output in their place).
   - Right in Claude Code:
     `toolkit work history WI-004 --note 'Owner'\''s words: "ship it"'`
   - Right in Codex:
     `toolkit work history WI-004 --note 'Owner’s words: "ship it"'`
3. Section text in Codex.
   - Wrong: `cat > /tmp/overview.md <<'EOF' ... EOF && toolkit work edit WI-004 --section 'Overview' --set-file /tmp/overview.md`
     (one shell command, a heredoc, and a fixed file name).
   - Right: `toolkit work edit WI-004 --section 'Overview' --text '<text>'`
4. A change to a work item's header.
   - Wrong: `sed -i '' 's/^stage: .*/stage: 04-solution-design/' .work-items/WI-004/WORK-ITEM.md`
   - Right: `toolkit work set WI-004 --stage 04-solution-design --note '<why>'`
5. Toolkit commands from a script.
   - Wrong: `for id in WI-001 WI-002; do toolkit work show $id; done`
   - Right: `toolkit work show WI-001`, then `toolkit work show WI-002`, each
     as its own command.
