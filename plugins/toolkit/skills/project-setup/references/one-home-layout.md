# Bringing a project to the one-home layout

Purpose: one part of "update the toolkit", for a project set up before the
one-home layout. How to find the old layout, the plan the owner approves,
where each old piece goes, and the order of the moves. `update.md` runs
this file from its section 6.

The one-home layout is the project layout in which what lasts longer than
one work item is kept in five places, as files in the repository:
`DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/`. Memory
holds where work stopped, and pointers. A project set up before it holds
the same facts in other places. This file moves them. Two results must
hold:

- Nothing is lost. Every old file and record has a row in the plan, and an
  old file is removed only after what it held was read back in its new
  place.
- Nothing changes before the owner's yes to the plan.

The form of each new record is in its home: the comment at the top of
`<copy>/DECISIONS.md`, and `AGENTS.md` in `<copy>/system/`,
`<copy>/sources/`, `<copy>/delivery/`, `<copy>/reference/`,
`<copy>/work-items/`, and `<copy>/memory/`. Read each one you will write to
before you build the plan. `<copy>` is the fresh setup copy that
`update.md`, section 1, builds. `<main>` is the main checkout.

## Contents

- Find the old layout
- The plan
- Where each old piece goes
  - Old memory kinds and statuses
  - Toolkit files
- After his yes

## Find the old layout

Each command only reads. Run each alone. One hit means the project has the
old layout.

| Old piece | Find it with |
| --- | --- |
| Shared questions, people, domain maps, intake receipts, target direction | `find project-wide-records -type f -not -name .gitkeep` |
| Agreed requirements | `find requirements -type f`, when `requirements/AGENTS.md` or `requirements/system-area-template/` is there. A `requirements/` folder with neither is the project's own: leave it. |
| The verified description of the system | `find system-guide -type f` |
| Outside documentation | `find ai-external-knowledge -maxdepth 2` |
| Old delivery folders | `ls -d delivery/deployment delivery/data delivery/meeting-notes delivery/references delivery/communications delivery/deliverables delivery/archive 2>/dev/null` |
| Data files Git ignores (Salesforce) | `find <main>/delivery/data/data-loads <main>/delivery/data/production-backups -type f -not -name .gitignore 2>/dev/null` |
| Local memory records, and the generated index | `find <main>/memory -maxdepth 1 -type f` lists a file other than `AGENTS.md`, `CLAUDE.md`, `CURRENT_STATE.md`, and `MEMORY.md`; or `command grep -n '^## User' <main>/memory/MEMORY.md` prints a line. That `MEMORY.md` is the index the session-start hook used to write. The hook no longer writes it: `MEMORY.md` is now the table of pointers, written only by `using-memory-store`. |
| Notion memory records | With `using-memory-store` in the setup copy: the query under "Every pointer" in its `references/searching.md` prints a line with `(no key)`; or the "Terminology glossary" page beside the Memory page holds a row (read its text as `using-notion-cli` says) |
| Originals inside local work items | `find <main>/work-items -type d -name references` |
| Originals inside GitHub issues | `gh issue list --state all --search '"## Source:" in:comments' --json number,title` |
| Originals inside Notion work items | `ntn api v1/data_sources/<Work Items data source id>/query -d '{"filter":{"property":"Files","files":{"is_not_empty":true}}}' < /dev/null` returns each work item whose Files property holds a file. Run it as `using-notion-cli` in the setup copy says. The id is under "Notion work items" in `PROJECT.md`. |
| Work items in the earlier form | Local: `command grep -rL '^\*\*Moved up:\*\*' <main>/work-items --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=PROJECT-TASKS.md` lists each file with no Moved up line; a listed file named `<ID>.md` is a work item in the earlier form. Notion or GitHub: with `using-work-tracker` in the setup copy, read one item that is not Done or Cancelled; it has no "Moved up" label. |
| A `DECISIONS.md` in another form | `head -3 DECISIONS.md` and `head -3 <copy>/DECISIONS.md` print different lines |
| "Toolkit settings" in the earlier form | The count command in `setup-copy.md`, "Check the setup copy", prints fewer than 10 for `PROJECT.md`; or `command grep -n -e '<!-- if ' -e '<!-- endif' PROJECT.md README.md AGENTS.md .claude/rules/*.md` prints a line |
| A rules list in `AGENTS.md` | `grep -n 'toolkit:rules' AGENTS.md` |
| The two removed rules | `ls .claude/rules/work-item-folders.md .claude/rules/ai-external-knowledge.md 2>/dev/null` |
| The renamed skills | `ls .claude/skills` shows a name from the "Old folder" column in `update.md`, section 4 |

The last four rows are changed by `update.md`, sections 3 and 4, and are
left out of the plan below. Each one shows that the other rows must be
looked for.

## The plan

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

## Where each old piece goes

Write each new record in the form its home gives. Each new record names
where it came from: add "Carried over from `<old path>`" to the entry's Why
line, the rule's Source line, the Changelog row, or the "What it is" cell.
Before you write a record, search its new home for that line: a record
that is already there is not written again.

| Old piece | New home | How |
| --- | --- | --- |
| A shared question (`project-wide-records/questions/`) | A `DECISIONS.md` entry | Open when it has no answer. Decided when the record holds the answer, who gave it, and the date. Affects names the work items the record named. |
| A memory decision record (`memory/decision_*.md`; in Notion, a Memories page with the decision tag) | More than one work item needs it, or none is named: a `DECISIONS.md` entry. One work item needs it: a Questions and Answers row in that item, when the item does not hold it yet. | Status follows the record's status: current is Decided, superseded is Superseded with the entry that replaced it, retired is Withdrawn. Decided takes the date and the person from the record. A record that names neither: "Your call". Memory keeps one pointer to each `DECISIONS.md` entry made from a memory record: the DEC ID and the link. |
| A memory topic record (any other record file in `memory/`; in Notion, any other Memories page with no Record Key) | Each fact goes to the home that the root `AGENTS.md`, "Where information goes", gives it | A fact about the project: the matching section of `PROJECT.md`; a stable fact about how the client's business or the project team works, such as the month the fiscal year starts, goes under "Operating conventions". A rule about the system: the matching `system/` document, as an agreed requirement below. A term: `system/glossary.md`. A lesson: the Notes of the work item it came from, under "Lessons not proven yet"; with no such item, "Your call". An instruction for the agent: `.claude/rules/owner-preferences.md`. Where work stands: nothing, because the work item holds it. A fact with no home: "Your call". "Old memory kinds and statuses" below covers a record that is out of date, and the kinds `user_`, `reference_`, and `event_`. |
| The glossary (`memory/terminology-glossary.md`; in Notion, the "Terminology glossary" page) | `system/glossary.md` | One row per term, with the old row's source and date. A term with no source: write "Old glossary, not confirmed" as its Source, and list those terms for him. |
| An agreed requirement (`requirements/`, `SYSTEM-DATA-MODEL.md` included) | A numbered rule in the matching `system/` document | The data model goes to `data-model.md`, access to `security-model.md`, what runs by itself to `automation.md`, a connection to another system to `integrations/<system-name>.md`, the main parts to `architecture.md`, and a rule that covers several areas to `constraints.md`. Mark it Approved, with the DEC, when a decision that approved it can be found: a Decided entry, an answered Questions and Answers row, or a work item's requirements approval. Record that decision as a `DECISIONS.md` entry first when it is not one. Mark it Draft when no decision can be found, and add one Open entry per document that asks whether its Draft rules are approved. Text that is not a rule goes in the document's Overview. |
| A verified description (`system-guide/`) | The matching `system/` document, and `reference/current-system/<area>.md` | A statement of how the system must work, delivered by a work item you can name: a rule marked Built with that work item's ID. Its Source is the decision that approved it, found or recorded as the row above says; when no decision can be found, the rule is Draft, as the row above says. Everything else is the record of the system as it was observed on the date the old page gives under "Last verified": it goes in the area's file in `reference/current-system/`, in the form `reference/AGENTS.md` gives, with that date and environment. Under "What this area does today", name each part this project built, with its work item where the old page gives one. |
| A person and authority record (`project-wide-records/people/`) | `PROJECT.md`, "People and ownership" | One row per person. "May decide" holds the decisions the record says the person may make. Detail the row has no cell for: "Your call", recommend dropping it. |
| A target direction record (`project-wide-records/target-architecture/`) | "Your call" | It has no home of its own. Recommend rules in `system/architecture.md` or the area's document: Approved when the record says who approved it and when, Draft otherwise. The other choices: one `DECISIONS.md` entry, or keep the file as a source. |
| An intake receipt (`project-wide-records/intake/`) | "Your call" | It has no home of its own. Recommend: file the original it links to in `sources/`, and write the records the receipt lists into that row's "Used by". A finding it holds that no other record holds becomes a `DECISIONS.md` entry or a rule. The other choice: keep the receipt itself as a source. |
| A domain map (`project-wide-records/domains/`) | "Your call" | It has no home of its own. Recommend moving what it says about the area into the Overview of the matching `system/` document. The other choices: one `DECISIONS.md` entry, or keep the file as a source. |
| An original inside a work item (a file in a local item's `references/` folder; a GitHub comment that starts `## Source:`; a file in a Notion item's Files property) | `sources/`, with an SRC number and a row in `sources/README.md` | Copy the file unchanged; save a comment's text exactly as it is. "Used by" names the item. The item's Sources line becomes `SRC-###: <what it is>. Taken from it: <IDs>.` A file over 10 MB, a file with personal data beyond names and work roles, or a file type that is not text: ask before it is committed, as `sources/AGENTS.md`, "An original kept outside Git", says. A GitHub comment and a Notion file stay where they are. |
| A client file in `delivery/meeting-notes/` or `delivery/references/` | `sources/`, with an SRC number and a row | `git mv` it to the name `sources/AGENTS.md` gives. |
| `delivery/communications/` and `delivery/deliverables/` | `delivery/client-handoffs/` | What the project sent goes in one folder per handoff, as `delivery/AGENTS.md` gives it; write "Not recorded" in a `HANDOFF.md` field the old files do not give. What the project received is an original: it goes to `sources/`. |
| `delivery/deployment/` | `delivery/deployments/`; a release folder goes to `delivery/releases/` | `git mv` each file and folder that is not a toolkit file ("Toolkit files" below), `component-tracker.csv` included. The setup copy already put a file at the new path: `git mv -f`, so his file replaces it. |
| `delivery/data/` | `delivery/migrations/` | `git mv` each area folder that is not a toolkit file. The data files Git ignores in `data-loads/` and `production-backups/` exist only in the main checkout: move them there with `mv`, in step 8 of "After his yes". |
| `delivery/archive/` | "Your call" for each record in it | Recommend the folder of its kind: a deployment record goes to `delivery/deployments/`. |
| `ai-external-knowledge/` | `reference/outside-docs/` | `git mv` each topic folder. Copy the rows of its `INDEX.md` into `reference/outside-docs/INDEX.md`. The old `INDEX.md` is removed with `git rm` in step 6, after its rows are read back in the new one. |
| A `DECISIONS.md` in another form | `sources/`, then entries in the new `DECISIONS.md` | `git mv` the old file to `sources/` with an SRC number, so the setup copy's `DECISIONS.md` can take its place. Each decision in it that the owner confirms is still true becomes an entry whose Sources names that SRC. |
| `PROJECT.md` | The same file | "Toolkit settings" as `update.md`, section 3, says. "People and ownership" gets the "May decide" column. Text on the "Constraints" line becomes rules in `system/constraints.md`, as an agreed requirement above, and the line becomes the setup copy's link. "Work and project records" becomes the setup copy's section. Under "Resources and project paths", the "Tests and checks" line becomes the setup copy's "Tests" line: a location he wrote stays, and a command he wrote moves to the "Build, test, or deploy" row of `AGENTS.md`, "Commands". He sees each change before it is made. |
| A work item that is not Done or Cancelled | The same item | With `using-work-tracker` in the setup copy: add the `**Moved up:**` line after Related items, empty; add the Notes heading "Lessons not proven yet" with "None." after Sources; write each Sources line in the SRC form. Add one Recent History row: "Toolkit update: the one-home layout." |
| A work item that is Done or Cancelled | The same item | In step 7 of "After his yes": add the `**Moved up:**` line after Related items, with the text `Nothing: the item was closed before the closing step existed.`, and the same Recent History row. In step 8: when a `DECISIONS.md` entry or a `system/` rule that this update wrote names the item, put those IDs on the line in place of that text. Change nothing else in the item, except a Sources line whose original moved and a pointer to a new `DECISIONS.md` entry that names the item. |
| The Notion work item template | The same template | `notion-build/work-setup.md`, "Bringing a project up to the current template", step 4. Follow every rule of "Where the templates live" there: never restore a template through the API, and never move the project's own work item template to the trash. |

### Old memory kinds and statuses

- A topic record whose status is `superseded` or `retired` holds nothing
  current, so nothing in it is carried over. "Your call": recommend
  removing the file, and give the other choice, keeping it as a source in
  `sources/`.
- A `user_` record (a fact about the owner): his role and what he may
  decide go in `PROJECT.md`, "People and ownership"; an instruction for how
  the agent works with him goes in `.claude/rules/owner-preferences.md`.
- A `reference_` record (a way to reach a system, a source, or a dashboard
  outside the project): a row in `PROJECT.md`, "Systems and environments".
  Captured documentation it points to: `reference/outside-docs/`.
- An `event_` record (one episode): each lesson, rule, or fact it holds
  goes where the topic record row says. The account of what was done goes
  in the Recent History of the work item it names. With no such work item:
  "Your call", recommend dropping the account.

### Toolkit files

Toolkit files hold nothing of his and need no new home. Give them one row.

- `AGENTS.md`, every template, and every `.gitkeep` in
  `project-wide-records/`, `requirements/`, and `system-guide/`.
- `memory/decision_template.md` and `memory/project_topic_template.md`.
- The generated `memory/MEMORY.md` that holds `## User`.
- The template folders and `.gitkeep` files in the old `delivery/` folders,
  and the two `.gitignore` files `delivery/data/data-loads/.gitignore` and
  `delivery/data/production-backups/.gitignore`. The setup copy holds both
  `.gitignore` files at their new paths under `delivery/migrations/`.
- `work-items/work-item-template/references/`.

A template file in the old `delivery/` folders may hold his facts, for
example a filled `package.xml` or `component-tracker.csv`. Decide by its
Git history, as `update.md`, "Whose edit a difference is", says. A
template with no commit of his is a toolkit file, also when it differs from
the file of the same name in `<copy>/delivery/`: the toolkit changed some
templates. A template with a commit of his: `git mv -f` it to the new path,
in place of the file the setup copy put there. Any other toolkit file with
a commit of his is "Your call".

Memory in Notion or Hindsight: what those two store has not changed. Moving
a decision or a term out of them into `DECISIONS.md` and `system/` is "Your
call"; recommend it for each record that more than one work item needs.
Nothing is removed from a Hindsight bank.

## After his yes

`update.md`, sections 3 to 5, come first: they add `DECISIONS.md`,
`system/`, `sources/`, `delivery/`, `reference/`, and the new skills, which
the moves need.

Change the files Git tracks in your worktree. Change `memory/`,
`work-items/`, and the data files Git ignores in the main checkout, and
only in step 8, after the branch landed: a work item or a pointer must
never name a record that is not on the default branch. The one change made
there earlier is a fix for a finding of the record check (step 7).

1. **Originals first**, so later records can name their SRC IDs. Take the
   next SRC number for each, in the order of the plan.
2. **Decisions**: each `DECISIONS.md` entry, at the end of the file.
3. **System documents**: the glossary, then the rules. Set each document's
   Status, "Last changed via", and Changelog as `system/AGENTS.md` says.
4. **`reference/current-system/`**, then **`PROJECT.md`**, then each
   instruction for the agent that the plan carries to
   `.claude/rules/owner-preferences.md`, as one list line in the form that
   file's layout comment gives.
5. **Renames**: `ai-external-knowledge/` and the old `delivery/` folders.
6. **Read back** every new record against the old file it came from. Then
   remove each tracked old file that an approved row names, with `git rm`.
   A file that changed since you listed it stays: ask again. Then list
   every mention of an old path that is left in a tracked file:
   `command grep -rnE 'ai-external-knowledge/|delivery/(deployment|data|meeting-notes|references|communications|deliverables|archive)/|project-wide-records/|system-guide/|requirements/' . --exclude-dir=.git --exclude-dir=.claude`.
   A line that says "Carried over from" stays, and so does an original in
   `sources/`. Change each other line after his yes.
7. **Check, commit, and land** as `update.md`, section 7, says. Its record
   check runs here, before the commit. Two findings are usual in a project
   on the old layout. A closed work item with no filled Moved up line: the
   row for a Done or Cancelled work item above gives the line to write. A
   `memory/` folder with an `AGENTS.md` and no `CLAUDE.md`: copy
   `<copy>/memory/CLAUDE.md` into it. Before the branch lands, fetch, and
   compare `DECISIONS.md` and `sources/README.md` with the default branch.
   An ID another session took in the meantime: renumber your own record and
   every mention of it.
8. **In the main checkout, after the branch landed:**
   - Salesforce: move each data file Git ignores, for example
     `mv <main>/delivery/data/data-loads/<file> <main>/delivery/migrations/data-loads/`,
     and the same for `production-backups/`. Then `git status --short`
     lists no data file; a data file it lists is not ignored: stop and tell
     the owner. `rmdir` the old folders once they are empty.
   - the work items: each Sources line, the Moved up line, the lessons
     heading, each Questions and Answers row and each lesson the plan
     carries from a memory record, and a pointer to each new `DECISIONS.md`
     entry in each item it affects, in the place
     `<copy>/work-items/AGENTS.md` and the work item template give;
   - local memory: replace `memory/MEMORY.md` with the setup copy's file,
     then add each pointer the plan named, in the form `memory/AGENTS.md`
     gives; rewrite a Current State line that names an old path, keeping
     its meaning;
   - list every mention of an old path in the work items and in memory,
     and change each after his yes:
     `command grep -rnE 'ai-external-knowledge/|delivery/(deployment|data|meeting-notes|references|communications|deliverables|archive)/|project-wide-records/|system-guide/|requirements/' <main>/work-items <main>/memory`;
   - read back each item and each memory file;
   - remove each old file in `memory/` and each item `references/` folder
     that an approved row names, with `rm` and the exact path. `rmdir` an
     empty folder; never `rm -r` a folder that still holds a file.
9. **Last check.** Run every command of "Find the old layout" again. Each
   hit is a row he turned down, a "Your call" row he has not answered, or a
   failure: name each in the report. Then run
   `node .claude/hooks/validate-records.mjs --all < /dev/null` in the main
   checkout: it prints nothing. Fix what it prints, as `update.md`, "The
   record check and the pre-commit file", says.
