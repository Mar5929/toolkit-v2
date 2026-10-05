# The checking script: what the owner approved and what it checks

Work item: TKV-24. Date: 2026-10-05.

The owner said yes to a checking script on 2026-10-05, after being told its
size: a first version with 15 checks, about 220 lines, plus about 220 lines
of tests. That size is the limit. If the 15 checks do not fit in 280 lines
of script, drop checks from the end of the list below and report which;
never go over without the owner's yes.

## What it is

One file, `validate-records.mjs`, beside the other hook commands in
`every-project/.claude/hooks/`. Node 20 or newer, ES modules, no
dependencies. It only reads. It runs no program except `git`, and only to
list staged files.

## When it runs

| Trigger | Where it is set | What it checks |
| --- | --- | --- |
| After an edit in Claude Code (`PostToolUse`, matcher `Edit|Write`, the two edit tools the captured hooks page names) | the Claude Code settings snippets | the group of records the edited file belongs to |
| When the agent stops in Claude Code (`Stop`) | the Claude Code settings snippets | every record; exits 0 when `stop_hook_active` is true |
| After an edit in Codex (`PostToolUse`, matcher `apply_patch`) | the Codex hooks snippets | the group of records the edited file belongs to |
| Before a commit (`.githooks/pre-commit`, six lines, with `git config core.hooksPath .githooks` set once per clone by `project-setup`) | a tracked file in the project | every tracked record, plus check 8 |

A finding goes to the agent as text on stderr with exit code 2, in both
products. One line per finding: the file, the line when known, what is
wrong, and what to do. At most about 2,000 characters. In Codex, exit code
2 after `apply_patch` replaces the result of the edit with this text
(`ai-external-knowledge/codex/hooks.md`, "PostToolUse"), so after an edit
the first line says "The edit was not undone."

Which records it reads:

- The records Git tracks (`DECISIONS.md`, `system/`, `sources/`, the folder
  guides) are read in the checkout the session works in.
- `work-items/` and `memory/` are read in the main checkout, the only place
  they are. In a session that works in its own worktree, an ID written in a
  work item is looked up in the main checkout's records, not in the
  worktree's branch: a record that `publish-docs` just saved is on the
  default branch, which the main checkout holds and the session's branch
  may not (second review, blocker 1).
- After an edit of a file that is outside the session's repository and its
  main checkout, it checks nothing and exits 0.

## What it must never do

- Fail because of its own error. On a crash, an unreadable file, or input
  it does not understand, it prints one line and exits 0.
- Write, move, or delete a file, or use the network.
- Check a template (`work-item-template/`, `INTEGRATION-TEMPLATE.md`), the
  text inside a kept comment, or a Git-ignored folder at commit time.
- Report a folder or file that a project does not have because of its setup
  choices (`work-items/` and `memory/` exist only with local work items and
  local memory).
- Take more than about a second.

## The 15 checks

Records every project has (after an edit, at stop, and before a commit):

1. In `DECISIONS.md`, each `DEC-###` heading appears once, and the numbers
   rise in file order.
2. Each entry's Status is Open, Decided, Superseded, or Withdrawn. A Decided
   entry has a date and a name on its Decided line. An Open entry says "not
   yet". A Superseded entry names an existing DEC under "Replaces or
   replaced by".
3. Each `system/` document has its three top lines in order (Status, Last
   changed via, Governs), with Status Not started, Draft, or Approved, and
   the sections Overview, Content, Open questions, Changelog in that order.
4. Each rule in `system/` uses the prefix of its document, has an ID that
   appears once across `system/`, and has a Mark that is Draft, Approved
   with a DEC, Built with a work item ID, or Retired.
5. A rule marked Approved or Built names a DEC that exists and is Decided.
   The document's Status agrees with its rules' marks, as `system/AGENTS.md`
   defines.
6. "Last changed via" is "none" or a DEC that exists. "Open questions" holds
   only DEC IDs that exist and are Open.
7. In `sources/README.md`, each `SRC-###` appears once; each row kept in the
   repository names a file that exists; each file under `sources/`, other
   than the guide files, belongs to one row. A row is kept in the
   repository only when its "Where kept" cell holds a Markdown link.
8. Before a commit only: no file already under `sources/` is changed or
   deleted, other than `README.md`.
9. Every DEC, SRC, and rule ID written in `DECISIONS.md`, `system/`,
   `sources/README.md`, or a local work item is defined.
10. No angle-bracket prompt is left in a `DECISIONS.md` entry, a `system/`
    document, or a `sources/README.md` row. Text in backticks is never a
    prompt.
11. The project folder, and each folder directly inside it, that has an
    `AGENTS.md` has a `CLAUDE.md` that holds exactly `@AGENTS.md`.
12. `system/integrations/README.md` lists every integration document, and
    each row's document exists.

Records only a project with local work items has (after an edit and at
stop):

13. A work item's file is named `<ID>.md`, its folder name starts with
    `<ID>-`, and no two items share an ID.
14. A work item whose status is Done or Cancelled has its Moved up line
    filled.
15. Every work item ID written in `DECISIONS.md`, a `system/` Changelog, or
    Current State exists. With work items in Notion or GitHub, and before a
    commit, the ID only has to be well formed.

## Known limits of this version

The script is at its size limit, so these stay as they are (second review,
note 24):

- Check 11 does not look at a folder two levels down, such as
  `system/integrations/`.
- Check 11 reports a top-level folder that came from somewhere else, has
  its own `AGENTS.md`, and has a `CLAUDE.md` with other text. It is
  reported each time the agent stops, until the owner removes the folder or
  makes its `CLAUDE.md` hold `@AGENTS.md`.
- Check 9 reads an ID of another system that has a prefix and two digits
  like a rule ID, such as a Jira key "SEC-45", as a rule ID, and reports it
  when `system/` has no such rule.
- A prompt after one unpaired backtick on the same line is not seen.

## Not checked in this version

The other 29 checks in audit 1, section 6 (for example the form of Current
state, the question table, tasks, memory, `delivery/`, `PROJECT.md`). Work
items kept in Notion or GitHub cannot be read by the script.

## What changes with it

- The six settings snippets get the new entries, so a Codex project asks the
  owner to trust its hooks again.
- `project-setup` sets `core.hooksPath` at onboarding, in "check the setup",
  and in "update the toolkit". When a project already has another hooks
  folder set, it tells the owner and changes nothing.
- The repository `AGENTS.md` "Code limit" rule names the fourth command, the
  owner's yes, and its size.
- A sentence in a rule, guide, or skill that only states a fact one of the
  15 checks now tests is removed. The builders listed such sentences in
  their test records. A sentence that tells the agent the form to write
  stays.
