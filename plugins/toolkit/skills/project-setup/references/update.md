# Updating a project ("update the toolkit")

Purpose: bring a Toolkit V2 project up to the toolkit installed on this
computer: newer skills and hook commands, merged settings, newer project
files after the owner's yes, the record check turned on, and Notion brought
up to the current template. Also how to change a setup choice. Two parts of
an update are in their own files: `earlier-versions.md` (changes from
toolkit 0.6.0, 0.8.0, and 0.8.1) and `one-home-layout.md` (a project set up
before the one-home layout).

The one-home layout is the project layout in which what lasts longer than
one work item is kept in five places, as files in the repository:
`DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/`.

## Contents

- Before you start
- 1. Build a fresh setup copy
- 2. See what differs
- 3. What to do with each kind of file
  - Whose edit a difference is
  - Updating AGENTS.md
  - The record check and the pre-commit file
- 4. What the toolkit no longer ships
- 5. Services
- 6. A project set up before the one-home layout
- 7. Checks and report
- Changing a setup choice

## Before you start

- Read `PROJECT.md`, section "Toolkit settings": Tracker, Memory, the ID
  prefix, the links, and the Hindsight bank. These are the choices; never
  change one unless the owner asks ("Changing a setup choice" below).
  - Salesforce: the "Salesforce org aliases" line holds a value other than
    `not used`. In a project set up before the one-home layout the section
    holds only the lines of its own choices: there, the project is a
    Salesforce project when the line is present.
  - `SOUL.md`: kept when the file is present.
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
  in place of `./`. Run the service steps (step 5) from your worktree too,
  so a file they change, such as `.mcp.json`, `.codex/config.toml`, or
  `PROJECT.md`, is committed on your branch. Checking the setup changes
  nothing and needs no worktree.
- Git ignores `memory/` and `work-items/`, so they are not in the worktree.
  Compare them in the main checkout (step 2). Change them in the main
  checkout, and only after the branch landed (section 7, step 5): a work
  item or a pointer must never name a record that is not on the default
  branch. The one change made there earlier is a fix for a finding of the
  record check (section 3, "The record check and the pre-commit file").

## 1. Build a fresh setup copy

Build it exactly as for a new project, for the recorded choices, in a new
scratch folder: `setup-copy.md`, then `skills-hooks-settings.md`. Fill the
name and "Toolkit settings" from the project's own `PROJECT.md`. With
memory in Notion, also replace `{{CURRENT_STATE_PAGE_ID}}` in the copy's
`.claude/settings.json` and `.codex/hooks.json` with the id on the
"Current state page" bullet under "Notion memory" in `PROJECT.md` (under a
`### Notion` heading in a project set up earlier).

## 2. See what differs

```text
rsync -rcni --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/
rsync -rcni <copy>/memory/ <main checkout>/memory/
rsync -rcni <copy>/work-items/ <main checkout>/work-items/
```

Run the second and third only when the setup copy has that folder. Each
writes nothing. `>f+++++++` is a file the project lacks; any other `>f`
line is a file that differs. Read each difference with
`diff -u <file> <copy>/<file>`.

Then run "Find the old layout" in `one-home-layout.md`. What it finds is
handled only by that file, and is left out of sections 3 and 4. Its table
says which four rows are the exception.

## 3. What to do with each kind of file

| Kind | Files | What to do |
| --- | --- | --- |
| Toolkit skills | each folder in `<copy>/.claude/skills/` | Replace the project's folder with the new one. First list any file inside it that the new copy lacks (it would be deleted) and ask about those. Then, per skill: `rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/` |
| Hook commands | `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, `validate-records.mjs` | Replace: `cp <copy>/.claude/hooks/<file> .claude/hooks/<file>`. Codex trusts the hook entry in `.codex/hooks.json`, not the file it runs, so a replaced command file is not reviewed again: put each replaced `.mjs` file in the numbered table below, with one plain line on what its diff changes, and copy it only after his yes. A project that lacks `validate-records.mjs` gets it through the missing files row; its settings entries wait for "The record check and the pre-commit file" below. |
| Settings | `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge with the rules in `skills-hooks-settings.md`: add what is missing, ask before changing a value, replace the toolkit's own hook handlers instead of adding a second copy, and delete no other entry. Leave out the entries that run `validate-records.mjs` until "The record check and the pre-commit file" below says to add them. A changed Codex hook must be trusted again in `/hooks`: tell the owner. |
| Missing files | every `>f+++++++` line | List them. Into the worktree: `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/` (not `-a`: it would give the project folder the scratch folder's private permissions). Into the main checkout, after the branch landed (section 7, step 5), only when the setup copy has the folder: `rsync -rlt --ignore-existing <copy>/memory/ <main checkout>/memory/` and `rsync -rlt --ignore-existing <copy>/work-items/ <main checkout>/work-items/`. |
| `AGENTS.md` | the root file | Follow "Updating AGENTS.md" below. |
| `PROJECT.md`, "Toolkit settings" | | The section holds the 11 lines of the setup copy's section, with the same labels, in the same order. Add each line the project's section lacks, with the value `not used`. Keep every value the section has. A `### Notion` heading with ids under it: move them under the two fixed Notion lines, as `notion-build/work-setup.md`, "Recording the links in PROJECT.md", says. Show him the section before and after. |
| Files that hold his facts | the rest of `PROJECT.md`; `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, each document in `system/`, `sources/README.md`, `reference/outside-docs/INDEX.md` | Never overwrite. Name only the toolkit's changes (a new section, a changed heading, a changed guide comment) and make them after his yes. |
| Rules in `.claude/rules/` | | Show what differs. "Whose edit a difference is" below says whether a rule holds an edit of his. A rule with none: recommend the toolkit's version. His edit stays unless he says to take the toolkit's. A project with no `owner-preferences.md` gets the setup copy's through the missing files row; one that has it follows the "His own records" row. |
| Other toolkit files | the folder guides (`system/AGENTS.md`, `sources/AGENTS.md`, `delivery/AGENTS.md`, `reference/AGENTS.md`, `work-items/AGENTS.md`, `memory/AGENTS.md`), the templates, the output style, `.githooks/pre-commit`, the Salesforce guards and `tools/` | Say in one line what changed, and whether the file holds an edit of his ("Whose edit a difference is" below). A file with none: recommend the toolkit's version. Take the toolkit's after his yes. |
| His own records | work items and `work-items/PROJECT-TASKS.md`; the entries of `DECISIONS.md`; the rules and terms in `system/`; the originals in `sources/`; the records in `delivery/` and `reference/`; `memory/CURRENT_STATE.md` and `memory/MEMORY.md`; `.claude/rules/owner-preferences.md`; his own skills and rules | Never compare or change. |

Show every file that needs his answer in one numbered table, one line per
file with its reason, and ask once. Carry out what he says yes to. When
"Find the old layout" found the old layout, show the plan of
`one-home-layout.md` in the same message, above this table, and ask once
for both.

### Whose edit a difference is

A file that differs from the setup copy differs because the owner edited
it, because the toolkit changed it since the project got it, or both. Git
history tells them apart. For a file Git tracks:

```text
git log --format='%h %ad %s' --date=short -- <file>
git show --stat --format= <commit>
git status --short -- <file>
```

- The first command lists the commits that changed the file.
- A commit is the toolkit's when the second command also lists a file
  under `.claude/skills/` for it, and its message names the setup, a
  move-over, or a toolkit update: each of those commits skills together
  with the other toolkit files. The owner may also change a rule and a
  skill in one commit of his own. When the message does not tell which it
  is, ask him.
- A file whose commits are all the toolkit's, and that the third command
  does not list, holds no edit of his. Say so in its table line, and
  recommend the toolkit's version.
- A file with any other commit, or one the third command lists, holds an
  edit of his. Show the difference; his edit stays unless he says to take
  the toolkit's.
- A file Git does not track (in `work-items/` or `memory/`) has no history:
  show the difference and ask.

### Updating AGENTS.md

The root `AGENTS.md` reads the same in every project, except two prompts
the owner filled: the outcome sentence and the "Build, test, or deploy"
row. He may also have added lines. List the `## ` headings of both files:

```text
grep -n '^## ' AGENTS.md
grep -n '^## ' <copy>/AGENTS.md
```

- **Every heading of the setup copy's file is in the project's file, in the
  same order** (sections he added himself do not matter). Name each toolkit
  change in plain words (for example "a changed row in the Project map")
  and, after his yes, add, change, or remove only those lines, keeping his.
- **A heading of the setup copy's file is missing from the project's file,
  or the order differs** (the toolkit moved, renamed, or added a section;
  every project set up before the one-home layout is this case).
  Changing named lines cannot give the project the new layout, so
  build a new file:
  1. Start from `<copy>/AGENTS.md`: it already has the project's name.
  2. Replace its outcome prompt and its "Build, test, or deploy" row with
     the project's current ones, and delete its fill-in guide comment.
  3. Find the lines he added or changed: `diff -u AGENTS.md <copy>/AGENTS.md`.
     Drop a line that only repeats what the
     new file already says about the toolkit (a skill line, a line of a
     rules list between two `toolkit:rules` marker lines, a line about a
     setup choice). Carry over a line that holds a fact, command, or
     instruction of his own, in the section where it fits; a whole section
     he added goes in right after "Commands". When you cannot tell, carry
     the line over and mark it in the list in step 5.
  4. Run `wc -lc <copy>/AGENTS.md`. The limits are at most 200 lines and
     at most 20,480 bytes. When his added lines put the file over either
     limit, say so in the list in step 5 and recommend which of those lines
     to move, and where. Cut no line of his without his yes.
  5. Show him the whole new file, and under it one short list: each line
     you carried over, and each of his lines you dropped, with the reason.
     Write nothing until he says yes. After his yes, write the new file as
     `AGENTS.md` in your worktree.

### The record check and the pre-commit file

`validate-records.mjs` checks the form of the project's records: after each
file edit in both hosts, when the agent stops in Claude Code, and, through
`.githooks/pre-commit`, before each commit. A finding that nobody fixes is
reported again at the end of every Claude Code turn. So in a project whose
`.claude/settings.json` holds no entry that runs `validate-records.mjs`,
the records pass the check first, and its entries go in last:

1. Make every other change of sections 3 to 6 in the worktree. The "Missing
   files" row copied `.claude/hooks/validate-records.mjs` and
   `.githooks/pre-commit`.
2. Run the check from the worktree:

   ```text
   node .claude/hooks/validate-records.mjs --all < /dev/null
   ```

   It reads the records Git tracks (`DECISIONS.md`, `system/`, `sources/`,
   and the folder guides) in the worktree, and `work-items/` and `memory/`
   in the main checkout. An ID that a work item names is looked up in the
   main checkout's records, not in the worktree's. It only reads. It
   prints one line per finding: the file, what is wrong, and what to do.
3. Fix each finding, then run the check again, until it prints nothing.
   - A finding in a file Git tracks: fix it in the worktree.
   - A finding in `work-items/` or `memory/`: fix it in the main checkout
     now, with `using-work-tracker` or `using-memory-store` in the setup
     copy. Write nothing there that names a record made on your branch.
   - A folder guide with no `CLAUDE.md` beside it in `memory/` or
     `work-items/`: copy that one file from the setup copy.
   - A finding whose fix is the owner's decision, for example two work
     items with one ID: ask him.
4. Only then add the entries that run `validate-records.mjs`, from the
   settings snippets, to the worktree's `.claude/settings.json` (a
   `PostToolUse` group and a `Stop` group) and `.codex/hooks.json` (a
   `PostToolUse` group), with the merge rules in
   `skills-hooks-settings.md`.
5. Set up the pre-commit file as `placing-files.md`, "5. The pre-commit
   check", says. Remove an old `pre-commit` Git hook that section 4 lists
   first, after his yes. Every other hook in that folder stays: when one is
   left, that section changes nothing and tells the owner.

A project whose settings already hold the entries: run step 2 and report
what it prints with the final checks, and do step 5.

The entry in `.codex/hooks.json` is new, and the `description` there
changed, so Codex asks the owner to trust the project's hooks again in
`/hooks`: say so in the report.

## 4. What the toolkit no longer ships

- A folder in `.claude/skills/` that is not in the setup copy: when an
  earlier Toolkit V2 setup put it there (a retired skill), list it and
  remove it only after his yes. When it is his own project skill, or you
  are not sure, leave it and ask. Toolkit 0.6.0 retired `work-refine`,
  `solution-design`, `work-delegate`, `work-check`, `work-finish`,
  `local-work-track`, `notion-work-track`, and `github-work-track`:
  `running-work-item-lifecycle` and `using-work-tracker` replace them. Toolkit
  0.7.0 retired `local-memory-save`, `local-memory-find`,
  `local-memory-refine`, `notion-memory-save`, `notion-memory-find`, and
  `notion-memory-refine`: `curating-project-memory` and
  `using-memory-store` replace them, and a project with work items or
  memory in Notion also gets `using-notion-cli`.
- Five skills were renamed. A project set up earlier holds the old folder
  in `.claude/skills/`, and the "Toolkit skills" row in section 3 would add
  the new folder beside it. A project never holds both: install the new
  folder and remove the old one in the same change, after his yes, and list
  both in the numbered table.

  | Old folder | New folder |
  | --- | --- |
  | `managing-work-items` | `running-work-item-lifecycle` |
  | `tracking-work-items` | `using-work-tracker` |
  | `managing-project-wide-records` | `filing-project-records` |
  | `managing-project-memory` | `curating-project-memory` |
  | `storing-project-memory` | `using-memory-store` |

  A project holds only the skills for its own choices, so it renames only
  the ones it has. A rule or a skill of his own that names an old skill:
  list it, and change the name after his yes. The rename changed the text
  of one Codex hook entry in `.codex/hooks.json`, so Codex asks the owner
  to trust the project's hooks again in `/hooks`: say so in the report.
- Toolkit 0.8.6 dropped `agents/openai.yaml` from `merge-and-clean-up`: it
  held only what the Codex app showed for the skill (a display name, a short
  description, and a starter prompt). The "Toolkit skills" row in section 3
  lists it with the files the new copy lacks; give this as its reason.
- The one-home layout dropped `assets/terminology-glossary.md` from the
  Notion `using-memory-store`: setup no longer builds a glossary page from
  it, and a project term is a row of `system/glossary.md`. The "Toolkit
  skills" row in section 3 lists it with the files the new copy lacks; give
  this as its reason, and remove it with the rest of the old folder.
- A rule in `.claude/rules/` that the fresh setup copy lacks and that an
  earlier Toolkit V2 setup put there: list it, and remove it only after his
  yes. The one-home layout removed two: `work-item-folders.md`
  (`work-items/AGENTS.md` holds what it said) and `ai-external-knowledge.md`
  (`reference/AGENTS.md` holds what it said). `hindsight-memory.md` is such
  a rule in a project whose memory is not Hindsight. A line in the rule
  that he wrote himself goes where `move-over.md`, step 3, "Where his lines
  from an old toolkit file go", says, before the file is removed.
- An old end-of-reply check (a `Stop` hook of type `prompt` in
  `.claude/settings.json`), or an older Codex helper-reminder handler with
  the matcher `^(spawn_agent|wait_agent)$`: list it. After his yes, remove
  it and any group or event it leaves empty; the snippet's handler replaces
  the Codex one. The `Stop` hook that runs `tools/kb/graph_freshness_hook.py`
  comes from the `salesforce` setup folder: leave it.
- A `hindsight` entry in `.mcp.json` or a `[mcp_servers.hindsight]` table
  in `.codex/config.toml`: the project was set up for the old Hindsight
  server on the Mac. List it, and follow "A project on the old Mac server"
  in `hindsight-on-vps.md`.
- Files from the retired `toolkit` program (`.toolkit.json`,
  `.codex/rules/toolkit.rules`, `.toolkit-cache/`): list them; delete only
  after his yes. A `DECISIONS.md` that the retired program wrote is his
  record: `one-home-layout.md` carries it over. Records in old `.work-items/` or
  `.memory/` folders are his: never delete them. A folder that `PROJECT.md`
  names as old records kept as history is left alone. For any other, ask
  whether to carry its records over, as `move-over.md` says ("6. Carry
  over the old records").
- A `pre-commit` Git hook of this copy whose text names `check-knowledge`
  (`ls "$(git rev-parse --git-path hooks)"`): the older claude-toolkit
  installed it, and it stops commits once its tools are gone. List it;
  remove it only after his yes.

## 5. Services

- Notion projects: `notion.md`, "Updating a Notion project".
- Hindsight projects: "Check a Hindsight project" in `hindsight-on-vps.md`;
  fix each failure only after his yes. Name the server the project uses in
  the report.
- GitHub Issues projects: `github.md`, "Bringing a project up to date";
  add missing labels only after his yes.
- Local work items set up before toolkit 0.6.0 (a `stage:` line in the
  items): `earlier-versions.md`, "Work items from Stage to State".
- Every project set up before toolkit 0.8.0: `earlier-versions.md`, "The
  levels structure (toolkit 0.8.0)", after the service step for its
  tracker.
- Every project set up before toolkit 0.8.1: `earlier-versions.md`, "The
  Requirements layout (toolkit 0.8.1)".

## 6. A project set up before the one-home layout

Every project where "Find the old layout" (step 2) found anything:
`one-home-layout.md`, after sections 3 to 5. It holds the plan the owner
approves, where each old piece goes, and the order of the moves.

## 7. Checks and report

Do these in order.

1. **The record check.** Section 3, "The record check and the pre-commit
   file".
2. **The final checks** in `finishing.md`, from your worktree. The checks
   on `memory/` and `work-items/` wait for step 5, and the scratch folder
   stays until step 6. Also run the two
   settings checks in `skills-hooks-settings.md`, "Check", on the
   worktree's own settings files: each of the toolkit's hook handlers is
   there once, and the `description` in `.codex/hooks.json` contains the
   snippet's text.
3. **Report** what was replaced, merged, added, moved, and left as his, and
   the owner's steps: trust the hooks again in Codex `/hooks`, only when an
   entry or the `description` in `.codex/hooks.json` changed; start a new
   session.
4. **Commit and land.** End with the commit offer in `finishing.md`, made
   in your worktree. After the commit, land the branch only after his yes:
   by pull request, or with no remote by `git merge --ff-only <branch>`
   from the main checkout, after the merge safety check in the project's
   `.claude/rules/shared-repository-work.md`.
5. **In the main checkout, after the branch landed**, make every change to
   `memory/` and `work-items/`: the missing files (section 3), each
   difference there he said yes to, the changes of `earlier-versions.md`,
   and step 8 of `one-home-layout.md` when that file ran. Then run the
   final checks on these two folders, and the record check again
   (`node .claude/hooks/validate-records.mjs --all < /dev/null`): it prints
   nothing.
6. Remove the worktree and branch, then the scratch folder.

## Changing a setup choice

Only when the owner asks, for example "move memory to Notion".

A choice decides which files a project has, never which lines inside a
file. So a changed choice adds the files of the new choice's setup folders,
removes the files of the old choice's setup folders, and changes lines of
"Toolkit settings". No other line of `AGENTS.md`, `README.md`, `PROJECT.md`,
or a rule changes.

1. Say what changes and what cannot move (for example Notion page history
   and comments), and get his yes.
2. Make your own worktree and branch, as "Before you start" says. In
   `PROJECT.md`, "Toolkit settings", there: change the Tracker or Memory
   line, write `not used` on each line that only the old choice used, and
   write the new choice's lines as `setup-copy.md`, "The project name and
   'Toolkit settings'", says.
3. Build a fresh setup copy for the new choices and compare, as sections 1
   and 2 say.
   - Add each file the project lacks, as the "Missing files" row says.
   - The new choice's storage skill (`using-work-tracker` or
     `using-memory-store`) has the old one's name and replaces it. Read the
     old one first, because step 5 reads the old records its way.
   - A new memory choice also replaces the toolkit's hook handlers in
     `.claude/settings.json` and `.codex/hooks.json` with the new choice's
     snippets (`skills-hooks-settings.md`, "Merge rules"); he trusts the
     changed Codex hooks again in `/hooks`.
4. Run the service step for the new choice (`notion.md`, `github.md`, or
   `hindsight-on-vps.md`). When the project already has work items or
   memory in Notion and adds the other one, make no second project page:
   follow `notion-build/work-setup.md`, "Adding work items or memory
   later". Memory moved out of Hindsight: after his yes,
   also remove the project folder from `mapPathToBank` and `optInPaths` in
   `~/.hindsight/coding-agent.json`, so the add-on stops saving there.
5. Move the records one at a time, with a preview of each and his yes, and
   read each one back in its new place. Nothing is deleted from the old
   tracker or memory system. Into Hindsight: the add-on's tools load only in
   the next session, so write each record with one `POST .../memories`, as
   `hindsight-on-vps.md` "5. Save and search" shows, with `document_id` set
   to the record's ID and `async` `true`. Read it back with that file's
   search command after its operation is `completed`.
6. Remove the old choice's files, only after the records are moved and he
   says yes to the list. The list is every file of the old choice's setup
   folders that no setup folder of the new choices holds
   (`(cd <skill folder>/assets/<folder> && find . -type f)` prints a
   folder's files; `setup-copy.md`, "Folders the choices add", names the
   folders). Memory moved to Hindsight keeps `memory/CURRENT_STATE.md`. A
   file in `work-items/` or `memory/` that is not in a setup folder is his
   record: it stays until he says what to do with it.
