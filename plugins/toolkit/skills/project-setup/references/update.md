# Updating a project ("update the toolkit")

Purpose: bring a Toolkit V2 project up to the toolkit installed on this
computer: newer skills and hook commands, merged settings, newer model files
after the owner's yes, and Notion brought up to the current template. Also
how to change a setup choice.

## Contents

- Before you start
- 1. Build a fresh setup copy
- 2. See what differs
- 3. What to do with each kind of file
  - Updating AGENTS.md
- 4. What the toolkit no longer ships
- 5. Services
  - Work items from Stage to State
- 6. Checks and report
- Changing a setup choice

## Before you start

- Read `PROJECT.md`, section "Toolkit settings": Tracker, Memory, the ID
  prefix, the links, the Hindsight bank, and whether it names Salesforce org
  aliases. `SOUL.md` present or not. These are the choices; never change one
  unless the owner asks ("Changing a setup choice" below).
- The new files come from this skill's `assets/` folder, in the toolkit
  plugin installed on this computer. When the owner says the toolkit itself
  changed but this skill's `assets/` folder does not have the change he
  names, updating the plugin changes his computer: ask first. Claude Code:
  `claude plugin marketplace update toolkit-v2`, then
  `claude plugin update toolkit@toolkit-v2`. Codex:
  `codex plugin add toolkit@toolkit-v2`. Then he starts a new session.
- Before you change any file, make your own worktree and branch, as the
  project's `.claude/rules/shared-repository-work.md` says: other sessions
  may be working in the main checkout:
  `git -C <main checkout> worktree add .claude/worktrees/toolkit-update-<YYYY-MM-DD> -b claude/toolkit-update-<YYYY-MM-DD>`,
  where `<main checkout>` is the first path `git worktree list` prints.
  Run steps 2 to 4 there, with `rsync` and `diff` pointed at the worktree
  in place of `./`. Git ignores `memory/` and `work-items/`, so they are
  not in the worktree: leave them out of its `rsync`
  (`--exclude /memory/ --exclude /work-items/`), and compare and change
  them in the main checkout. Run the service steps (step 5) from your
  worktree too, so a file they change, such as `.mcp.json`,
  `.codex/config.toml`, or `PROJECT.md`, is committed on your branch.
  Checking the setup changes nothing and needs no worktree.

## 1. Build a fresh setup copy

Build it exactly as for a new project, for the recorded choices, in a new
scratch folder: `setup-copy.md`, then `skills-hooks-settings.md`. Fill the
name and "Toolkit settings" from the project's own `PROJECT.md`. With
memory in Notion, also replace `{{CURRENT_STATE_PAGE_ID}}` in the copy's
`.claude/settings.json` and `.codex/hooks.json` with the id on the
"Current state page" line of the Notion block in `PROJECT.md`.

## 2. See what differs

```text
rsync -rcni <copy>/ ./
```

`>f+++++++` is a file the project lacks; any other `>f` line is a file that
differs. Read each difference with `diff -u <file> <copy>/<file>`.

## 3. What to do with each kind of file

| Kind | Files | What to do |
| --- | --- | --- |
| Toolkit skills | each folder in `<copy>/.claude/skills/` | Replace the project's folder with the new one. First list any file inside it that the new copy lacks (it would be deleted) and ask about those. Then, per skill: `rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/` |
| Hook commands | `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs` | Replace: `cp <copy>/.claude/hooks/<file> .claude/hooks/<file>`. Codex trusts the hook entry in `.codex/hooks.json`, not the file it runs, so a replaced command file is not reviewed again: put each replaced `.mjs` file in the numbered table below, with one plain line on what its diff changes, and copy it only after his yes. |
| Settings | `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge with the rules in `skills-hooks-settings.md`: add what is missing, ask before changing a value, replace the toolkit's own hook handlers instead of adding a second copy, and delete no other entry. A changed Codex hook must be trusted again in `/hooks`: tell the owner. |
| Missing files | every `>f+++++++` line | List them, then `rsync -rlt --ignore-existing <copy>/ ./` (not `-a`: it would give the project folder the scratch folder's private permissions) |
| `AGENTS.md` | | Rebuild the rules list between its two marker lines from the project's own `.claude/rules/` (`setup-copy.md`, "The rules list in AGENTS.md"). For the rest, follow "Updating AGENTS.md" below. |
| `PROJECT.md`, `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md` | | Never overwrite: they hold his facts. Name only the toolkit's changes (a new section, a new "Toolkit settings" label) and add them after his yes. |
| Rules in `.claude/rules/` | | Show what differs. His edit stays unless he says to take the toolkit's. A project with no `owner-preferences.md` gets the setup copy's through the missing files row; one that has it follows the "His own records" row. |
| Other model files | templates, `memory/AGENTS.md`, `requirements/AGENTS.md`, the Salesforce guards | Say in one line what changed; take the toolkit's after his yes. |
| His own records | work items, memory records, `memory/CURRENT_STATE.md`, `memory/terminology-glossary.md`, `memory/MEMORY.md` (generated by the session-start hook), `.claude/rules/owner-preferences.md`, his own skills and rules | Never compare or change. |

Show every file that needs his answer in one numbered table, one line per
file with its reason, and ask once. Carry out what he says yes to.

### Updating AGENTS.md

The owner filled the outcome and the "Build, test, or deploy" row, and he
may have added lines. List the `## ` headings of both files:

```text
grep -n '^## ' AGENTS.md
grep -n '^## ' <copy>/AGENTS.md
```

- **Every heading of the setup copy's file is in the project's file, in the
  same order** (sections he added himself do not matter). Name each toolkit
  change in plain words (for example "a changed line in the Skills
  section") and, after his yes, add, change, or remove only those lines,
  keeping his.
- **A heading of the setup copy's file is missing from the project's file,
  or the order differs** (the toolkit moved, renamed, or added a section).
  Changing named lines cannot give the project the new layout, so
  build a new file:
  1. Start from `<copy>/AGENTS.md`: it already has the project's choices and
     name.
  2. Replace its outcome prompt and its "Build, test, or deploy" row with
     the project's current ones, delete its fill-in guide comment, and
     rebuild its rules list from the project's own `.claude/rules/`
     (`setup-copy.md`, "The rules list in AGENTS.md").
  3. Find the lines he added or changed: `diff -u AGENTS.md <copy>/AGENTS.md`.
     Use your judgment on each one. Drop a line that only repeats what the
     new file already says about the toolkit (a skill line, a rules list
     line). Carry over a line that holds a fact, command, or instruction of
     his own, in the section where it fits; a whole section he added goes
     in right after "Commands". When you cannot tell, carry the line over
     and mark it in the list in step 5.
  4. Run `wc -lc <copy>/AGENTS.md`. The limits are at most 200 lines and
     at most 20,480 bytes. When his added lines put the file over either
     limit, say so in the list in step 5 and recommend which of those lines
     to move, and where. Cut no line of his without his yes.
  5. Show him the whole new file, and under it one short list: each line
     you carried over, and each of his lines you dropped, with the reason.
     Write nothing until he says yes. After his yes, write the new file as
     `AGENTS.md` in your worktree.

## 4. What the toolkit no longer ships

- A folder in `.claude/skills/` that is not in the setup copy: when an
  earlier Toolkit V2 setup put it there (a retired skill), list it and
  remove it only after his yes. When it is his own project skill, or you
  are not sure, leave it and ask. Toolkit 0.6.0 retired `work-refine`,
  `solution-design`, `work-delegate`, `work-check`, `work-finish`,
  `local-work-track`, `notion-work-track`, and `github-work-track`:
  `managing-work-items` and `tracking-work-items` replace them. Toolkit
  0.7.0 retired `local-memory-save`, `local-memory-find`,
  `local-memory-refine`, `notion-memory-save`, `notion-memory-find`, and
  `notion-memory-refine`: `managing-project-memory` and
  `storing-project-memory` replace them, and a project with work items or
  memory in Notion also gets `using-notion-cli`. The memory records stay
  as they are.
- Toolkit 0.7.0 changed the prompt reminder's entry for local and Notion
  memory, so the owner trusts the hooks again in Codex `/hooks`. The
  session-start hook keeps the header of `memory/MEMORY.md` (the text above
  `## User`), so in a local memory project it may still name
  `local-memory-save`: change only that name to `managing-project-memory`,
  in the main checkout.
- A rule in `.claude/rules/` that the model no longer has (for example
  `hindsight-memory.md`): list it, remove it only after his yes, then
  rebuild the rules list.
- An old end-of-reply check (a `Stop` hook of type `prompt` in
  `.claude/settings.json`), or an older Codex helper-reminder handler with
  the matcher `^(spawn_agent|wait_agent)$`: list it. After his yes, remove
  it and any group or event it leaves empty; the snippet's handler replaces
  the Codex one. The `Stop` hook that runs `tools/kb/graph_freshness_hook.py`
  is the model's Salesforce hook: leave it.
- A `hindsight` entry in `.mcp.json` or a `[mcp_servers.hindsight]` table
  in `.codex/config.toml`: the project was set up for the old Hindsight
  server on the Mac. List it, and follow "A project on the old Mac server"
  in `hindsight-on-vps.md`.
- Files from the retired `toolkit` program (`.toolkit.json`, `DECISIONS.md`,
  `.codex/rules/toolkit.rules`, `.toolkit-cache/`): list them; delete only
  after his yes. Records in old `.work-items/` or `.memory/` folders are
  his: never delete them; ask him how to move them.

## 5. Services

- Notion projects: `notion.md`, "Updating a Notion project".
- Hindsight projects: "Check a Hindsight project" in `hindsight-on-vps.md`;
  fix each failure only after his yes. Name the server the project uses in
  the report.
- GitHub Issues projects: `github.md`, "Bringing a project up to date";
  add missing labels only after his yes.
- Local work items set up before toolkit 0.6.0 (a `stage:` line in the
  items): "Work items from Stage to State" below, in the main checkout.

### Work items from Stage to State

Before toolkit 0.6.0, each work item had a stage (`01-discovery` to
`14-spec-update`) and the statuses Backlog, Ready, In Progress, In Review,
Done, and Cancelled. The stage is now the State. After his yes, give each
work item its State, using the first row that matches:

| Old value | New State |
| --- | --- |
| Status Done or Cancelled | Done or Cancelled, the same |
| Status Backlog | Backlog |
| Stage 01 or 02 | Refining Requirements |
| Stage 03 or 04 | Designing |
| Stage 05 to 08 | Building |
| Stage 09 to 11 | Testing Loop |
| Stage 12 or 13 | Deploying |
| Stage 14 | Reflecting |

- Set the Status that goes with the new State (the Status and State table
  in `managing-work-items`' `SKILL.md`) in the same change.
- Local: every item in `work-items/`, sub-items and `archive/` included.
  Replace the `stage:` line with a `state:` line, and set `status:` and
  `updated:` in the same edit.
- Notion: every row of Work Items, archived ones included, after "From
  Stage to State" in `notion-build/work-setup.md` has added the State
  property and the Status options.
- GitHub: open issues only, after the `state:` labels exist (`github.md`,
  "Bringing a project up to date", step 3). A closed issue's labels are
  ignored.
- A Next action that ends ", with <skill>." (one of the retired skills
  above): remove that ending, so it matches a form in
  `.claude/rules/keep-work-item-current.md`. In Notion, change the page's
  Current state and the Next action property together.
- Add a Recent History row to each changed item: "Toolkit update: stage
  <old> is now State <new>." Change nothing else in the item.
- Tell the owner in one short list how many items moved to each State.

## 6. Checks and report

Run the final checks in `finishing.md` from your worktree, except the
checks on `memory/` and `work-items/`, which run in the main checkout. Also
run the two settings checks in `skills-hooks-settings.md`, "Check", on the
worktree's own settings files: each of the toolkit's hook handlers is there
once, and the `description` in `.codex/hooks.json` contains the snippet's
text. Report what was replaced, merged, added, and left as his, and the
owner's steps (trust the hooks again in Codex `/hooks` only when an entry
in `.codex/hooks.json` changed; start a new session). End with the commit
offer in `finishing.md`, made in your worktree. After the commit, land the
branch only after his yes: by pull request, or with no remote by
`git merge --ff-only <branch>` from the main checkout, after the merge
safety check in the project's `.claude/rules/shared-repository-work.md`.
Then remove the worktree and branch.

## Changing a setup choice

Only when the owner asks.

The Memory approval line (`onboarding` or `trusted`, local or Notion
memory) changes only on the owner's own words. Edit that line in
`PROJECT.md`, "Toolkit settings", and save it with the publish-docs skill.
Nothing else changes.

Where work items or memory live, for example "move memory to Notion":

1. Say what changes and what cannot move (for example Notion page history
   and comments), and get his yes.
2. Make your own worktree and branch, as "Before you start" says, and
   change the line in `PROJECT.md`, "Toolkit settings", there.
3. Build a fresh setup copy for the new choices and compare, as above. The
   blocks in `AGENTS.md`, `README.md`, `PROJECT.md`, and
   `.claude/rules/memory-review-and-save.md` for the old choice are replaced
   with the new choice's blocks, after he sees them. The new choice's
   skills are added. Its storage skill (`tracking-work-items` or
   `storing-project-memory`) has the old one's name and replaces it: read
   the old one first, because step 5 reads the old records its way (this
   skill's `assets/.skill-sets/` also holds it). A new memory choice also
   replaces the toolkit's hook handlers
   in `.claude/settings.json` and `.codex/hooks.json` with the new choice's
   snippets (`skills-hooks-settings.md`, "Merge rules"); he trusts the
   changed Codex hooks again in `/hooks`.
4. Run the service step for the new choice (`notion.md`, `github.md`, or
   `hindsight-on-vps.md`). Memory moved out of Hindsight: after his yes,
   also remove the project folder from `mapPathToBank` and `optInPaths` in
   `~/.hindsight/coding-agent.json`, so the add-on stops saving there.
5. Move the records one at a time, with a preview of each and his yes, and
   read each one back in its new place. Nothing is deleted from the old
   tracker or memory system. Into Hindsight: the add-on's tools load only in
   the next session, so write each record with one `POST .../memories`, as
   `hindsight-on-vps.md` "5. Save and search" shows, with `document_id` set
   to the record's ID and `async` `true`. Read it back with that file's
   search command after its operation is `completed`.
6. Remove the skills the new choices no longer need (for example
   `using-notion-cli` when nothing is left in Notion, or
   `managing-project-memory` and `storing-project-memory` when memory moved
   to Hindsight) only after the records are moved and he says yes.
