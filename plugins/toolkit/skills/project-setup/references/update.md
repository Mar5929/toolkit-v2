# Updating a project ("update the toolkit")

Purpose: bring a Toolkit V2 project up to the toolkit installed on this
computer: newer skills and hook commands, merged settings, newer project
files after the owner's yes, Notion brought up to the current template, and
a project set up before the one-home layout brought to it. Also how to
change a setup choice.

## Contents

- Before you start
- 1. Build a fresh setup copy
- 2. See what differs
- 3. What to do with each kind of file
  - Updating AGENTS.md
- 4. What the toolkit no longer ships
- 5. Services
  - Work items from Stage to State
  - The levels structure (toolkit 0.8.0)
  - The Requirements layout (toolkit 0.8.1)
- 6. The one-home layout
  - Find the old layout
  - The plan
  - Where each old piece goes
  - After his yes
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
"Current state page" bullet under "Notion memory" in `PROJECT.md` (under a
`### Notion` heading in a project set up earlier).

## 2. See what differs

```text
rsync -rcni <copy>/ ./
```

`>f+++++++` is a file the project lacks; any other `>f` line is a file that
differs. Read each difference with `diff -u <file> <copy>/<file>`.

Then run "Find the old layout" in section 6. What it finds is handled only
by section 6, except the last four rows of its table: leave the rest out
of sections 3 and 4.

## 3. What to do with each kind of file

| Kind | Files | What to do |
| --- | --- | --- |
| Toolkit skills | each folder in `<copy>/.claude/skills/` | Replace the project's folder with the new one. First list any file inside it that the new copy lacks (it would be deleted) and ask about those. Then, per skill: `rsync -a --delete <copy>/.claude/skills/<name>/ .claude/skills/<name>/` |
| Hook commands | `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs` | Replace: `cp <copy>/.claude/hooks/<file> .claude/hooks/<file>`. Codex trusts the hook entry in `.codex/hooks.json`, not the file it runs, so a replaced command file is not reviewed again: put each replaced `.mjs` file in the numbered table below, with one plain line on what its diff changes, and copy it only after his yes. |
| Settings | `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge with the rules in `skills-hooks-settings.md`: add what is missing, ask before changing a value, replace the toolkit's own hook handlers instead of adding a second copy, and delete no other entry. A changed Codex hook must be trusted again in `/hooks`: tell the owner. |
| Missing files | every `>f+++++++` line | List them, then `rsync -rlt --ignore-existing <copy>/ ./` (not `-a`: it would give the project folder the scratch folder's private permissions) |
| `AGENTS.md` | the root file | Follow "Updating AGENTS.md" below. |
| `PROJECT.md`, "Toolkit settings" | | The section holds the 11 lines of the setup copy's section, with the same labels, in the same order. Add each line the project's section lacks, with the value `not used`. Keep every value the section has. A `### Notion` heading with ids under it: move them under the two fixed Notion lines, as `notion-build/work-setup.md`, "Recording the links in PROJECT.md", says. Show him the section before and after. |
| Files that hold his facts | the rest of `PROJECT.md`; `README.md`, `SOUL.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, each document in `system/`, `sources/README.md`, `reference/outside-docs/INDEX.md` | Never overwrite. Name only the toolkit's changes (a new section, a changed heading, a changed guide comment) and make them after his yes. |
| Rules in `.claude/rules/` | | Show what differs. His edit stays unless he says to take the toolkit's. A project with no `owner-preferences.md` gets the setup copy's through the missing files row; one that has it follows the "His own records" row. |
| Other toolkit files | the folder guides (`system/AGENTS.md`, `sources/AGENTS.md`, `delivery/AGENTS.md`, `reference/AGENTS.md`, `work-items/AGENTS.md`, `memory/AGENTS.md`), the templates, the output style, the Salesforce guards and `tools/` | Say in one line what changed; take the toolkit's after his yes. |
| His own records | work items; the entries of `DECISIONS.md`; the rules and terms in `system/`; the originals in `sources/`; the records in `delivery/` and `reference/`; `memory/CURRENT_STATE.md` and `memory/MEMORY.md`; `.claude/rules/owner-preferences.md`; his own skills and rules | Never compare or change. |

Show every file that needs his answer in one numbered table, one line per
file with its reason, and ask once. Carry out what he says yes to. When
section 6 found the old layout, show its plan in the same message, above
this table, and ask once for both.

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
     Use your judgment on each one. Drop a line that only repeats what the
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
  record: section 6 carries it over. Records in old `.work-items/` or
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
  items): "Work items from Stage to State" below, in the main checkout.
- Every project set up before toolkit 0.8.0: "The levels structure
  (toolkit 0.8.0)" below, after the service step for its tracker.
- Every project set up before toolkit 0.8.1: "The Requirements layout
  (toolkit 0.8.1)" below.
- Every project where "Find the old layout" found anything: section 6,
  after the steps above.

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
  in `running-work-item-lifecycle`' `SKILL.md`) in the same change.
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

### The levels structure (toolkit 0.8.0)

Since toolkit 0.8.0, only the project and its top-level items have phases:
a sub-item's tasks are one plain list, and the project has its own phases
(`P01`) and its own tasks (`running-work-item-lifecycle`, "Levels"). The storage
files named here are in each tracker's `using-work-tracker` skill, in this
skill's `assets/work-local/`, `assets/work-notion/`, and
`assets/work-github/` (under `.claude/skills/`). The same release gives a
Notion task one status field (step 5) and removes "Untracked to-dos" from
Current State (step 6). Show the owner every change below in one numbered
list, and make each only after his yes. Nothing is deleted except
what a step names, and each item keeps its task IDs.

1. **Sub-items that have phases.** List every level-2 and level-3 item that
   still has a phase that is not Cancelled, or a task under a phase. Convert each one with "An item that
   changes level", "Phases to a plain list": local, `field-mapping.md`;
   Notion, `database-layout.md`; GitHub, `issue-layout.md`. A level-3 item
   that sits under a phase of its level-2 parent leaves that phase.
2. **Top-level items with no phase.** List each one that has left Backlog
   and has no phase. Give it one phase, as "A plain list to phases" says,
   named as the owner approves.
3. **The project's roadmap.**
   - Local: `PROJECT-ROADMAP.md` stays. When it still has work units
     (`### P01-U01` headings), show him the new version: each phase lists
     the top-level items its units named (`project-roadmap-and-tasks.md`),
     and a unit with no item is listed for him to keep as a new Backlog
     item or drop. Save it with `publish-docs` after his yes.
   - Notion or GitHub: the phases move into the tracker. When the project
     folder has a `PROJECT-ROADMAP.md`, add each of its phases as a project
     phase, with the items its units named (Notion: `database-layout.md`,
     "The project's phases and tasks"; GitHub:
     `project-roadmap-and-tasks.md`). Then ask whether to remove the file
     in your worktree; it stays until he says yes.
   - A project with no phases yet gets none now: `running-work-item-lifecycle`
     proposes them when the next item leaves Backlog.
4. **Project tasks.** Local: `work-items/PROJECT-TASKS.md` comes in with
   the missing files, in the main checkout. Notion: the "Project tasks"
   view comes with the views (`notion-build/work-setup.md`). GitHub:
   nothing now; the "Project tasks" issue is made with the first project
   task.
   Notion: add Phase type and Task type, and make "By project phase",
   "Project phases", and "Project tasks" the first tabs, in the project and in the shared
   "Project" template (`notion-build/work-setup.md`, "Bringing a project
   up to the current template", steps 2, 3, and 5). Then give the owner
   the page-layout clicks to pin Phase type and Task type
   (`notion-build/work-layout.md`, "Property order and page layout").
5. **Task status in Notion.** A task has one status field, Status, and no
   "Done" checkbox: `notion-build/work-setup.md`, "From the Done checkbox
   to Status", in the project and in the shared "Project" template.
6. **Untracked to-dos.** Current State no longer has an "Untracked to-dos"
   section. For each line under it, propose where it goes: the work item
   it concerns, a project task for administrative work, or a new Backlog
   item for other project work (`running-work-item-lifecycle`). Move each line
   where he approves, then remove the heading (local or Hindsight memory:
   `memory/CURRENT_STATE.md` in the main checkout; Notion memory: the
   "Current state" page, and the same page of the shared "Project"
   template, `notion-build/setup.md`, "Bringing memory up to the current
   layout", step 5). A section that says "None." needs no question:
   remove the heading.
7. Add a Recent History row to each changed item ("Toolkit update: the
   levels structure of toolkit 0.8.0.", and what changed), and tell the
   owner in one short list what changed.

### The Requirements layout (toolkit 0.8.1)

Since toolkit 0.8.1, the Requirements section of a work item holds one
block for each requirement, headed "Requirement <number>: <short name>":
the original requirement word for word, its goal, its numbered Functional
Requirements, and its numbered Acceptance Criteria
(`running-work-item-lifecycle`, `references/refining-requirements.md`). Text in
angle brackets in a template is an instruction, and an item an agent
creates or changes keeps none.

- **New items get the new layout** through the work item template. Local:
  the template files in `work-items/work-item-template/` are "Other toolkit
  files" in section 3; take the toolkit's after his yes. Notion:
  `notion-build/work-setup.md`, "Bringing a project up to the current
  template", step 4. GitHub: nothing to do; the template comes with the
  skills.
- **Existing work items stay as they are.** Never rewrite the
  Requirements section of an existing item in an update, in any tracker.
  The skills read the older layout as it is. An item moves to the new
  layout only when the owner asks for that item, and an item that holds
  the older label of its Functional Requirements (from before toolkit
  0.8.4) keeps it (`running-work-item-lifecycle`,
  `references/refining-requirements.md`, "The Requirements layout").
- Tell the owner in one line that new items get the new layout and
  existing items keep theirs.

## 6. The one-home layout

Since the one-home layout, a project keeps what lasts longer than one work
item in five places, as files in the repository: `DECISIONS.md`, `system/`,
`sources/`, `delivery/`, and `reference/`. Memory holds where work stopped,
and pointers. A project set up before it holds the same facts in other
places. This section moves them. Two results must hold:

- Nothing is lost. Every old file and record has a row in the plan, and an
  old file is removed only after what it held was read back in its new
  place.
- Nothing changes before the owner's yes to the plan.

The form of each new record is in its home: the comment at the top of
`<copy>/DECISIONS.md`, and `AGENTS.md` in `<copy>/system/`,
`<copy>/sources/`, `<copy>/delivery/`, `<copy>/reference/`,
`<copy>/work-items/`, and `<copy>/memory/`. Read each one you will write to
before you build the plan.

### Find the old layout

Each command only reads. Run each alone. `<main>` is the main checkout.
One hit means the project has the old layout.

| Old piece | Find it with |
| --- | --- |
| Shared questions, people, domain maps, intake receipts, target direction | `find project-wide-records -type f -not -name .gitkeep` |
| Agreed requirements | `find requirements -type f`, when `requirements/AGENTS.md` or `requirements/system-area-template/` is there. A `requirements/` folder with neither is the project's own: leave it. |
| The verified description of the system | `find system-guide -type f` |
| Outside documentation | `find ai-external-knowledge -maxdepth 2` |
| Old delivery folders | `ls -d delivery/deployment delivery/data delivery/meeting-notes delivery/references delivery/communications delivery/deliverables delivery/archive 2>/dev/null` |
| Local memory records, and the generated index | `find <main>/memory -maxdepth 1 -type f` lists a file other than `AGENTS.md`, `CLAUDE.md`, `CURRENT_STATE.md`, and `MEMORY.md`; or `<main>/memory/MEMORY.md` holds the line `## User`. That `MEMORY.md` is the index the session-start hook used to write. The hook no longer writes it: `MEMORY.md` is now the table of pointers, written only by `using-memory-store`. |
| Notion memory records | With `using-memory-store` in the setup copy (`references/searching.md`): a page of Memories with no Record Key, or a row in the "Terminology glossary" page |
| Originals inside local work items | `find <main>/work-items -type d -name references` |
| Originals inside GitHub issues | `gh issue list --state all --search '"## Source:" in:comments' --json number,title` |
| Originals inside Notion work items | With `using-work-tracker` in the setup copy (`references/searching.md`): each work item whose Files property is not empty |
| Work items in the earlier form | An item that is not Done or Cancelled and has no `**Moved up:**` line |
| A `DECISIONS.md` in another form | `DECISIONS.md` exists and its first lines are not the guide comment of `<copy>/DECISIONS.md` |
| "Toolkit settings" in the earlier form | The count command in `setup-copy.md`, "Check the setup copy", prints fewer than 11 for `PROJECT.md`; or `command grep -n -e '<!-- if ' -e '<!-- endif' PROJECT.md README.md AGENTS.md .claude/rules/*.md` prints a line |
| A rules list in `AGENTS.md` | `grep -n 'toolkit:rules' AGENTS.md` |
| The two removed rules | `ls .claude/rules/work-item-folders.md .claude/rules/ai-external-knowledge.md 2>/dev/null` |
| The renamed skills | `ls .claude/skills` shows a name from the "Old folder" column in section 4 |

The last four rows are changed by sections 3 and 4. They are listed here
only because each one shows that the other rows must be looked for.

### The plan

Read every file the commands found. Then show the owner one table, with one
row for each old location. Files of one kind in one folder share a row that
gives their count.

```text
Moving <project name> to the one-home layout

Nothing changes until you say yes. Nothing is removed before what it held is read back in its new place.

| # | Old location | What is in it | Where it goes | Removed afterwards |
| 1 | `project-wide-records/questions/` | 3 shared questions: 2 open, 1 answered | `DECISIONS.md`: 2 Open entries and 1 Decided entry, each with a pointer in the work items it names | The 3 files |
| 2 | `memory/decision_pricing-model.md` | 1 decision, current | `DECISIONS.md`: 1 Decided entry. `memory/MEMORY.md`: 1 pointer to it | The file. Git does not track it, so it cannot be brought back. |

Your call: I will not guess these
| # | Old location | What is in it | Question | Recommended |

Not moved: <each old file that stays where it is, with the reason, or "nothing">.
Could not check: <what, and why, or "nothing">.

Shall I make these moves?
```

- The rows show the form. Write the real rows.
- "Where it goes" names the file and the kind of record, never a guess at
  an ID. IDs are taken when the record is written.
- "Removed afterwards" names the exact files, or says "nothing: it is
  renamed" or "nothing: it stays". For a file Git does not track, it ends
  "Git does not track it, so it cannot be brought back."
- Put a row under "Your call" when "Where each old piece goes" says so,
  when two homes fit, or when no home fits.
- His yes covers the rows as shown. A "Your call" row stays untouched until
  he answers that row. A row he turns down stays as it is, and the report
  names it.

### Where each old piece goes

Write each new record in the form its home gives. Each new record names
where it came from: add "Carried over from `<old path>`" to the entry's Why
line, the rule's Source line, the Changelog row, or the "What it is" cell.
Before you write a record, search its new home for that line: a record
that is already there is not written again.

| Old piece | New home | How |
| --- | --- | --- |
| A shared question (`project-wide-records/questions/`) | A `DECISIONS.md` entry | Open when it has no answer. Decided when the record holds the answer, who gave it, and the date. Affects names the work items the record named. |
| A memory decision record (`memory/decision_*.md`; in Notion, a Memories page with the decision tag) | More than one work item needs it, or none is named: a `DECISIONS.md` entry. One work item needs it: a Questions and Answers row in that item, when the item does not hold it yet. | Status follows the record's status: current is Decided, superseded is Superseded with the entry that replaced it, retired is Withdrawn. Decided takes the date and the person from the record. A record that names neither: "Your call". Memory keeps one pointer to each `DECISIONS.md` entry made from a memory record: the DEC ID and the link. |
| A memory topic record (any other record file in `memory/`; in Notion, any other Memories page with no Record Key) | Each fact goes to the home that the root `AGENTS.md`, "Where information goes", gives it | A fact about the project: `PROJECT.md`. A rule about the system: the matching `system/` document, as an agreed requirement below. A term: `system/glossary.md`. A lesson: the Notes of the work item it came from, under "Lessons not proven yet"; with no such item, "Your call". An instruction for the agent: `.claude/rules/owner-preferences.md`. Where work stands: nothing, because the work item holds it. A fact with no home: "Your call". |
| The glossary (`memory/terminology-glossary.md`; in Notion, the "Terminology glossary" page) | `system/glossary.md` | One row per term, with the old row's source and date. A term with no source: write "Old glossary, not confirmed" as its Source, and list those terms for him. |
| An agreed requirement (`requirements/`, `SYSTEM-DATA-MODEL.md` included) | A numbered rule in the matching `system/` document | The data model goes to `data-model.md`, access to `security-model.md`, what runs by itself to `automation.md`, a connection to another system to `integrations/<system-name>.md`, the main parts to `architecture.md`, and a rule that covers several areas to `constraints.md`. Mark it Approved, with the DEC, when a decision that approved it can be found: a Decided entry, an answered Questions and Answers row, or a work item's requirements approval. Record that decision as a `DECISIONS.md` entry first when it is not one. Mark it Draft when no decision can be found, and add one Open entry per document that asks whether its Draft rules are approved. Text that is not a rule goes in the document's Overview. |
| A verified description (`system-guide/`) | The matching `system/` document, and `reference/current-system/<area>.md` | A statement of how the system must work, delivered by a work item you can name: a rule marked Built with that work item's ID. Everything else: the area's file in `reference/current-system/`, in the form `reference/AGENTS.md` gives, with the date and environment the old page gives under "Last verified". |
| A person and authority record (`project-wide-records/people/`) | `PROJECT.md`, "People and ownership" | One row per person. "May decide" holds the decisions the record says the person may make. Detail the row has no cell for: "Your call", recommend dropping it. |
| A target direction record (`project-wide-records/target-architecture/`) | "Your call" | It has no home of its own. Recommend rules in `system/architecture.md` or the area's document: Approved when the record says who approved it and when, Draft otherwise. The other choices: one `DECISIONS.md` entry, or keep the file as a source. |
| An intake receipt (`project-wide-records/intake/`) | "Your call" | It has no home of its own. Recommend: file the original it links to in `sources/`, and write the records the receipt lists into that row's "Used by". A finding it holds that no other record holds becomes a `DECISIONS.md` entry or a rule. The other choice: keep the receipt itself as a source. |
| A domain map (`project-wide-records/domains/`) | "Your call" | It has no home of its own. Recommend moving what it says about the area into the Overview of the matching `system/` document. The other choices: one `DECISIONS.md` entry, or keep the file as a source. |
| An original inside a work item (a file in a local item's `references/` folder; a GitHub comment that starts `## Source:`; a file in a Notion item's Files property) | `sources/`, with an SRC number and a row in `sources/README.md` | Copy the file unchanged; save a comment's text exactly as it is. "Used by" names the item. The item's Sources line becomes `SRC-###: <what it is>. Taken from it: <IDs>.` A file over 10 MB, a file with personal data beyond names and work roles, or a file type that is not text: ask before it is committed, as `sources/AGENTS.md`, "An original kept outside Git", says. A GitHub comment and a Notion file stay where they are. |
| A client file in `delivery/meeting-notes/` or `delivery/references/` | `sources/`, with an SRC number and a row | `git mv` it to the name `sources/AGENTS.md` gives. |
| `delivery/communications/` and `delivery/deliverables/` | `delivery/client-handoffs/` | What the project sent goes in one folder per handoff, as `delivery/AGENTS.md` gives it; write "Not recorded" in a `HANDOFF.md` field the old files do not give. What the project received is an original: it goes to `sources/`. |
| `delivery/deployment/` | `delivery/deployments/`; a release folder goes to `delivery/releases/` | `git mv` each file and folder that is not a toolkit template, `component-tracker.csv` included. A file the setup copy already put at the new path is replaced by his. |
| `delivery/data/` | `delivery/migrations/` | `git mv` each area folder. Move what Git ignores in `data-loads/` and `production-backups/` with `mv`, in the main checkout. |
| `delivery/archive/` | "Your call" for each record in it | Recommend the folder of its kind: a deployment record goes to `delivery/deployments/`. |
| `ai-external-knowledge/` | `reference/outside-docs/` | `git mv` each topic folder. Copy the rows of its `INDEX.md` into `reference/outside-docs/INDEX.md`. |
| A `DECISIONS.md` in another form | `sources/`, then entries in the new `DECISIONS.md` | `git mv` the old file to `sources/` with an SRC number, so the setup copy's `DECISIONS.md` can take its place. Each decision in it that the owner confirms is still true becomes an entry whose Sources names that SRC. |
| `PROJECT.md` | The same file | "Toolkit settings" as section 3 says. "People and ownership" gets the "May decide" column. Text on the "Constraints" line becomes rules in `system/constraints.md`, as an agreed requirement above, and the line becomes the setup copy's link. "Work and project records" becomes the setup copy's section. He sees each change before it is made. |
| A work item that is not Done or Cancelled | The same item | With `using-work-tracker`: add the `**Moved up:**` line after Related items, empty; add the Notes heading "Lessons not proven yet" with "None." after Sources; write each Sources line in the SRC form. Add one Recent History row: "Toolkit update: the one-home layout." A Done or Cancelled item changes only where one of its originals moved or a new `DECISIONS.md` entry names it. |
| The Notion work item template | The same template | `notion-build/work-setup.md`, "Bringing a project up to the current template", step 4. Follow every rule of "Where the templates live" there: never restore a template through the API, and never move the project's own work item template to the trash. |

Toolkit files hold nothing of his and need no new home: `AGENTS.md`, every
template, and every `.gitkeep` in `project-wide-records/`, `requirements/`,
and `system-guide/`; `memory/decision_template.md` and
`memory/project_topic_template.md`; the generated `memory/MEMORY.md` that
holds `## User`; the template folders and `.gitkeep` files in the old
`delivery/` folders; and `work-items/work-item-template/references/`. Give
them one row.

Compare each template file in the old `delivery/` folders with the file of
the same name in `<copy>/delivery/`. A file that differs holds his facts,
for example a filled `package.xml` or `component-tracker.csv`: `git mv` it
to the new path, in place of the file the setup copy put there. Any other
toolkit file he changed is "Your call".

Memory in Notion or Hindsight: what those two store has not changed. Moving
a decision or a term out of them into `DECISIONS.md` and `system/` is "Your
call"; recommend it for each record that more than one work item needs.
Nothing is removed from a Hindsight bank.

### After his yes

Sections 3 to 5 come first: they add `DECISIONS.md`, `system/`, `sources/`,
`delivery/`, `reference/`, and the new skills, which the moves need.

Change the files Git tracks in your worktree. Change `memory/` and
`work-items/` in the main checkout, and only in step 8, after the branch
landed: a work item or a pointer must never name a record that is not on
the default branch.

1. **Originals first**, so later records can name their SRC IDs. Take the
   next SRC number for each, in the order of the plan.
2. **Decisions**: each `DECISIONS.md` entry, at the end of the file.
3. **System documents**: the glossary, then the rules. Set each document's
   Status, "Last changed via", and Changelog as `system/AGENTS.md` says.
4. **`reference/current-system/`**, then **`PROJECT.md`**.
5. **Renames**: `ai-external-knowledge/` and the old `delivery/` folders.
   Then list every mention of an old path in a file that is not a toolkit
   file, and change each after his yes:
   `command grep -rnE 'ai-external-knowledge/|delivery/(deployment|data|meeting-notes|references|communications|deliverables|archive)/|project-wide-records/|system-guide/|requirements/' . --exclude-dir=.git --exclude-dir=.claude`.
6. **Read back** every new record against the old file it came from. Then
   remove each tracked old file that an approved row names, with `git rm`.
   A file that changed since you listed it stays: ask again.
7. **Check, commit, and land** as section 7 says. Before the branch lands,
   fetch, and compare `DECISIONS.md` and `sources/README.md` with the
   default branch. An ID another session took in the meantime: renumber
   your own record and every mention of it.
8. **In the main checkout, after the branch landed:**
   - the work items: each Sources line, the Moved up line, the lessons
     heading, and a pointer to each new `DECISIONS.md` entry in each item
     it affects, in the place `<copy>/work-items/AGENTS.md` and the work
     item template give;
   - local memory: replace `memory/MEMORY.md` with the setup copy's file,
     then add each pointer the plan named, in the form `memory/AGENTS.md`
     gives; rewrite a Current State line that names an old path, keeping
     its meaning;
   - read back each item and each memory file;
   - remove each old file in `memory/` and each item `references/` folder
     that an approved row names, with `rm` and the exact path. `rmdir` an
     empty folder; never `rm -r` a folder that still holds a file.
9. **Last check.** Run every command of "Find the old layout" again. Each
   hit is a row he turned down, a "Your call" row he has not answered, or a
   failure: name each in the report.

## 7. Checks and report

Run the final checks in `finishing.md` from your worktree, except the
checks on `memory/` and `work-items/`, which run in the main checkout,
after step 8 of section 6 when that step ran. Also
run the two settings checks in `skills-hooks-settings.md`, "Check", on the
worktree's own settings files: each of the toolkit's hook handlers is there
once, and the `description` in `.codex/hooks.json` contains the snippet's
text. Report what was replaced, merged, added, moved, and left as his, and
the owner's steps (trust the hooks again in Codex `/hooks` only when an
entry in `.codex/hooks.json` changed; start a new session). End with the
commit offer in `finishing.md`, made in your worktree. After the commit,
land the branch only after his yes: by pull request, or with no remote by
`git merge --ff-only <branch>` from the main checkout, after the merge
safety check in the project's `.claude/rules/shared-repository-work.md`.
Then remove the worktree and branch.

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
