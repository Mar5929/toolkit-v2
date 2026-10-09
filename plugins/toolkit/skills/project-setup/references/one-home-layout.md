# Bringing a project to the current folder layout

Use this file when a project was set up before the current folder layout. `SKILL.md`, "Which setup job to do", sends an update or a check of such a project here, and the move-over from the older toolkit uses the tables of this file. This file says how to find the old layout, which plan the owner approves, where each old file or record goes, and the order of the moves.

The current folder layout is the layout in which information the whole project needs is kept in five places, as files in the repository: `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/`. A project that was set up before this layout holds the same facts in other places, and this file moves them. Memory keeps its records. Only the decision records and the glossary move out of memory, because each of them is now kept in the repository.

When the job is done, two things must be true:

- Nothing is lost. Every old file and every old record has a row in the plan, and you remove an old file only after you have read back, in its new place, what the old file held.
- Nothing changes before the owner's yes to the plan.

This file uses these names:

- The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. `<copy>` is the new setup copy that `update.md`, "1. Build a new setup copy", builds.
- `<main>` is the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints.
- A worktree is a separate folder with its own branch. `update.md`, "Before you start", has you make one for the update.
- A source is anything the project was given by someone else, such as a client document. The current folder layout keeps every source, unchanged, in `sources/`.
- The project's Current State is the project's one short page of what is true now.

Before you build the plan, read how each new record must be written. The place where a record is kept gives its form: the comment at the top of `<copy>/DECISIONS.md`, and the `AGENTS.md` in `<copy>/system/`, `<copy>/sources/`, `<copy>/delivery/`, `<copy>/reference/`, `<copy>/work-items/`, and `<copy>/memory/`. Read each one that you will write to.

## Contents

- Find the old layout
- The plan
- Where each old file or record goes
  - The project's Current State in the earlier form
  - Toolkit files
- After the owner's yes

## Find the old layout

Use the table to find out whether the project has the old layout. Each command only reads. Run each command alone. One hit means the project has the old layout.

| What to look for | How to find it |
| --- | --- |
| Shared questions, people, domain maps, intake receipts, and target direction | Run `find project-wide-records -type f -not -name .gitkeep`. |
| Agreed requirements | When `requirements/AGENTS.md` or `requirements/system-area-template/` is there, run `find requirements -type f`. When the `requirements/` folder has neither, the folder is the project's own: leave it. |
| The verified description of the system | Run `find system-guide -type f`. |
| Outside documentation | Run `find ai-external-knowledge -maxdepth 2`. |
| Old delivery folders | Run `ls -d delivery/deployment delivery/data delivery/meeting-notes delivery/references delivery/communications delivery/deliverables delivery/archive 2>/dev/null`. |
| Data files that Git ignores, in a Salesforce project | Run `find <main>/delivery/data/data-loads <main>/delivery/data/production-backups -type f -not -name .gitignore 2>/dev/null`. |
| Local memory: decision records | Run `find <main>/memory -maxdepth 1 -name 'decision_*.md' -exec grep -LE '^description: *"?Moved on ' {} +`. The project has the old layout when the command lists a file. The command does not list a decision record that an earlier update marked as moved. |
| Local memory: the glossary | Run `ls <main>/memory/terminology-glossary.md 2>/dev/null`. The project has the old layout when the command lists the file. |
| Local memory: decision records or the glossary named in the index | Run `command grep -n -e '^## Decision' -e 'terminology-glossary' <main>/memory/MEMORY.md`. The project has the old layout when the command prints a line. |
| Local memory: the project's Current State in the earlier form | Run `command grep -n '^## Waiting on the owner' <main>/memory/CURRENT_STATE.md`. The project has the old layout when the command prints a line. |
| Notion memory: decision pages and the glossary | Use the selected `references/memory-store.md` inside `managing-project-memory` in the setup copy, and make the three checks that are listed under this table. |
| Sources inside local work items | Run `find <main>/work-items -type d -name references`. |
| Sources inside GitHub issues | Run `gh issue list --state all --search '"## Source:" in:comments' --json number,title`. |
| Sources inside Notion work items | Run `ntn api v1/data_sources/<Work Items data source id>/query -d '{"filter":{"property":"Files","files":{"is_not_empty":true}}}' < /dev/null`, as `using-notion-cli` in the setup copy says. The command returns each work item whose Files property holds a file. The id is under "Notion work items" in `PROJECT.md`. |
| Work items in the earlier form, in local files | Run `command grep -rL '^\*\*Moved up:\*\*' <main>/work-items --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=PROJECT-TASKS.md`. The command lists each file with no Moved up line. A listed file named `<ID>.md` is a work item in the earlier form. |
| Work items in the earlier form, in Notion or GitHub | With the selected `references/work-tracker.md` inside `managing-work-items` in the setup copy, read one work item that is not Done or Cancelled. The work items are in the earlier form when that work item has no "Moved up" label. |
| A `DECISIONS.md` in another form | Run `head -3 DECISIONS.md` and `head -3 <copy>/DECISIONS.md`. The project's file is in another form when the two commands print different lines. |
| "Toolkit settings" in the earlier form | Run the count command in `setup-copy.md`, "Check the setup copy". The section is in the earlier form when that command prints fewer than 10 for `PROJECT.md`, or when `command grep -n -e '<!-- if ' -e '<!-- endif' PROJECT.md README.md AGENTS.md .claude/rules/*.md` prints a line. |
| A rules list in `AGENTS.md` | Run `grep -n 'toolkit:rules' AGENTS.md`. |
| The two removed rules | Run `ls .claude/rules/work-item-folders.md .claude/rules/ai-external-knowledge.md 2>/dev/null`. |
| Skills under a retired name | Run `ls .claude/skills`. This row applies when the list shows `running-work-item-lifecycle`, `using-work-tracker`, `curating-project-memory`, `using-memory-store`, `tracking-work-items`, `storing-project-memory`, or `managing-project-wide-records`. `managing-work-items` and `managing-project-memory` are current names, so their names alone do not show an old layout. |

For Notion memory, the project has the old layout when one of these three things is true:

- The query under "Every page" in `references/searching.md` of the selected `managing-project-memory` store prints a line whose key starts `decision_` and whose status is accepted or proposed.
- The "Terminology glossary" page beside the Memory page holds a row. Read the page's text as `using-notion-cli` says.
- The "Current state" page holds the heading "Waiting on the owner".

`update.md`, "3. What to do with each kind of file" and "4. What the toolkit no longer ships", make the changes for the last four rows of the table, so leave those four rows out of the plan below. A hit in one of those four rows shows that the other rows must be looked for.

## The plan

Read every file that the commands found. Then show the owner one table that has one row for each old location. When one folder holds several files of one kind, give those files one row that states their count.

Show the plan in this form:

```text
Moving <project name> to the current folder layout

Nothing changes until you say yes. Nothing is removed before what it held is read back in its new place.

| # | Old location | What is in it | Where it goes | Removed afterwards |
| 1 | `project-wide-records/questions/` | 3 shared questions: 2 open, 1 answered | `DECISIONS.md`: 2 Open entries and 1 Decided entry, each with its ID in the work items it names | The 3 files |
| 2 | `memory/decision_pricing-model.md` | 1 decision, current | `DECISIONS.md`: 1 Decided entry | Nothing: the memory file stays, marked as moved, with the DEC ID |
| 3 | `memory/` | 14 other memory records | They stay where they are | Nothing |

Your call: I will not guess these
| # | Old location | What is in it | Question | Recommended |

Not moved: <each old file that stays where it is, with the reason, or "nothing">.
Could not check: <what, and why, or "nothing">.

Shall I make these moves?
```

- The rows in the block show the form. Write the project's real rows in their place.
- "Where it goes" names the file and the kind of record. It never holds a guess at an ID, because an ID is taken when the record is written.
- "Removed afterwards" names the exact files, or says "nothing: it is renamed" or "nothing: it stays". For a file that Git does not track, end the cell with "Git does not track it, so it cannot be brought back."
- Put a row under "Your call" in three cases: when "Where each old file or record goes" says so, when two places fit, and when no place fits.
- The owner's yes covers the rows as they were shown.
  - A "Your call" row stays untouched until the owner answers that row.
  - A row that the owner turns down stays as it is, and the report names it.

## Where each old file or record goes

Write each new record in the form that its new place gives. The opening of this file names the file that gives each form.

Each new record names where it came from. Add "Carried over from `<old path>`" to the entry's Why line, the rule's Source line, the Changelog row, or the "What it is" cell.

Before you write a record, search its new place for that line. When the record is already there, do not write it again.

The table says where each old file or record goes. The rules for each row are in the list under the table, in the order of the rows.

| What the old layout holds | Where it goes now |
| --- | --- |
| A shared question (`project-wide-records/questions/`) | It becomes a `DECISIONS.md` entry. |
| A memory decision record (`memory/decision_*.md`; in Notion, a Memories page whose key starts `decision_`) | It becomes a `DECISIONS.md` entry, or a Questions and Answers row in the one work item that needs it. |
| Every other memory record (the `user_`, `project_`, `reference_`, and `event_` files in `memory/`; in Notion, every other Memories page) | It stays where it is. |
| The glossary (`memory/terminology-glossary.md`; in Notion, the "Terminology glossary" page) | Its terms go to `system/glossary.md`. |
| An agreed requirement (`requirements/`, `SYSTEM-DATA-MODEL.md` included) | It becomes a numbered rule in the matching `system/` document. |
| A verified description (`system-guide/`) | It goes to the matching `system/` document, and to `reference/current-system/<area>.md`. |
| A person and authority record (`project-wide-records/people/`) | It goes to `PROJECT.md`, "People and ownership". |
| A target direction record (`project-wide-records/target-architecture/`) | Put it under "Your call". |
| An intake receipt (`project-wide-records/intake/`) | Put it under "Your call". |
| A domain map (`project-wide-records/domains/`) | Put it under "Your call". |
| A source inside a work item (a file in the `references/` folder of a local work item; a GitHub comment that starts `## Source:`; a file in the Files property of a Notion work item) | It goes to `sources/`, with an SRC number and a row in `sources/README.md`. |
| A client file in `delivery/meeting-notes/` or `delivery/references/` | It goes to `sources/`, with an SRC number and a row. |
| `delivery/communications/` and `delivery/deliverables/` | They go to `delivery/client-handoffs/`. |
| `delivery/deployment/` | It goes to `delivery/deployments/`, and a release folder goes to `delivery/releases/`. |
| `delivery/data/` | It goes to `delivery/migrations/`. |
| `delivery/archive/` | Put each record in it under "Your call". |
| `ai-external-knowledge/` | It goes to `reference/outside-docs/`. |
| A `DECISIONS.md` in another form | The old file goes to `sources/`, and its decisions become entries in the new `DECISIONS.md`. |
| `PROJECT.md` | It stays the same file, and parts of it change. |
| A work item that is not Done or Cancelled | It stays the same work item, and gets new lines. |
| A work item that is Done or Cancelled | It stays the same work item, and gets the Moved up line. |
| The Notion work item template | It stays the same template, and is brought up to the current template. |

**A shared question**

- When the question has no answer, write the entry as Open.
- When the record holds the answer, who gave it, and the date, write the entry as Decided.
- On the entry's Affects line, name the work items that the record named.

**A memory decision record**

- When more than one work item needs the decision, or the record names no work item, write a `DECISIONS.md` entry.
- When one work item needs the decision, write a Questions and Answers row in that work item, unless the work item holds the decision already.
- The Status follows the status of the memory record:
  - current becomes Decided;
  - superseded becomes Superseded, with the entry that replaced it;
  - retired or withdrawn becomes Withdrawn.
- With the Status Decided, take the date and the person from the memory record. When the memory record names neither, put the row under "Your call".
- Do not remove the memory record. In step 8 of "After the owner's yes", mark the memory record as moved, with the DEC ID, or with the work item and the Q-ID. A link to the memory record from another memory record then still leads to the decision. The selected `references/memory-store.md` inside `managing-project-memory` in the setup copy says how to mark it:
  - for local memory, in `references/record-format.md`, "Marks for what is not current";
  - for Notion memory, in `references/writing-pages.md`, "Replacing a page", with the DEC ID as the text of Superseded by.

**Every other memory record**

- Move nothing and rewrite nothing.
- A local file gets the header fields `created` and `check_by` at its next change, as `managing-project-memory` says.
- When a memory record holds a term, a rule of the system, or a decision inside its text, this update does not move it. "clean up memory" with `managing-project-memory` finds such a record later and asks the owner.

**The glossary**

- Write one row per term in `system/glossary.md`, with the source and the date of the old row.
- When a term has no source, write "Old glossary, not confirmed" as its Source, and list those terms for the owner.
- Remove the old glossary in step 8 of "After the owner's yes", after you have read its rows back in `system/glossary.md`.
  - Remove the local file with `rm`.
  - Ask the owner before the Notion page goes to Notion's trash (`PATCH v1/pages/<id>` with `{"in_trash":true}`). The page stays until the owner says yes. Then remove the "Terminology glossary page" line from "Toolkit settings" in `PROJECT.md`.
- A glossary that holds only the example row that the toolkit's glossary file came with is a toolkit file ("Toolkit files" below).

**An agreed requirement**

- Write each requirement as a numbered rule in the `system/` document that matches its subject:
  - the data model goes to `data-model.md`;
  - access goes to `security-model.md`;
  - what runs by itself goes to `automation.md`;
  - a connection to another system goes to `integrations/<system-name>.md`;
  - the main parts go to `architecture.md`;
  - a rule that covers several areas goes to `constraints.md`.
- When you can find a decision that approved the requirement, mark the rule Approved, with the DEC ID. Such a decision is a Decided entry, an answered Questions and Answers row, or a work item's requirements approval. When that decision is not a `DECISIONS.md` entry yet, record it as one first.
- When you can find no decision, mark the rule Draft, and add one Open entry per document that asks whether the document's Draft rules are approved.
- Put text that is not a rule in the document's Overview.

**A verified description**

- When the old page states how the system must work, and you can name the work item that built what the statement says, write the statement as a rule marked Built with that work item's ID.
  - The rule's Source is the decision that approved it. Find or record that decision as the rules for an agreed requirement say.
  - When you can find no decision, the rule is Draft, as the rules for an agreed requirement say.
- Everything else on the old page is the record of the system as it was observed on the date that the old page gives under "Last verified". Put it in the area's file in `reference/current-system/`, in the form that `reference/AGENTS.md` gives, with that date and environment.
- Under "What this area does today", name each part that this project built, with its work item where the old page gives one.

**A person and authority record**

- Write one row per person.
- In "May decide", write the decisions that the record says the person may make.
- When the record holds a detail that the row has no cell for, put the detail under "Your call", and recommend dropping it.

**A target direction record**

- The current folder layout has no place of its own for a target direction record.
- Recommend writing it as rules in `system/architecture.md` or in the area's document. The rules are Approved when the record says who approved it and when, and Draft otherwise.
- Give the other choices: one `DECISIONS.md` entry, or keeping the file as a source.

**An intake receipt**

- The current folder layout has no place of its own for an intake receipt.
- Recommend filing the source that the receipt links to in `sources/`, and writing the records that the receipt lists into the "Used by" cell of that source's row.
- A finding that the receipt holds and no other record holds becomes a `DECISIONS.md` entry or a rule.
- Give the other choice: keeping the receipt itself as a source.

**A domain map**

- The current folder layout has no place of its own for a domain map.
- Recommend moving what the map says about the area into the Overview of the matching `system/` document.
- Give the other choices: one `DECISIONS.md` entry, or keeping the file as a source.

**A source inside a work item**

- Copy a file unchanged. Save the text of a comment exactly as it is.
- In "Used by", name the work item.
- Change the work item's Sources line to `SRC-###: <what it is>. Taken from it: <IDs>.`
- Ask the owner before the source is committed when it is a file over 10 MB, a file with personal data beyond names and work roles, or a file type that is not text. `sources/AGENTS.md`, "A source kept outside Git", gives the question to ask.
- A GitHub comment and a Notion file stay where they are.

**A client file in `delivery/meeting-notes/` or `delivery/references/`**

- Move the file with `git mv` to the name that `sources/AGENTS.md` gives.

**`delivery/communications/` and `delivery/deliverables/`**

- Put what the project sent in one folder per handoff, as `delivery/AGENTS.md` gives it. When the old files do not give a field of `HANDOFF.md`, write "Not recorded" in that field.
- What the project received is a source: it goes to `sources/`.

**`delivery/deployment/`**

- Move each file and folder that is not a toolkit file with `git mv`, `component-tracker.csv` included. "Toolkit files" below says which files are toolkit files.
- When the setup copy already put a file at the new path, use `git mv -f`, so that the owner's file replaces it.

**`delivery/data/`**

- Move each area folder that is not a toolkit file with `git mv`.
- The data files that Git ignores in `data-loads/` and `production-backups/` exist only in the main checkout. Move them there with `mv`, in step 8 of "After the owner's yes".

**`delivery/archive/`**

- For each record, recommend the folder of its kind. For example, a deployment record goes to `delivery/deployments/`.

**`ai-external-knowledge/`**

- Move each topic folder with `git mv`.
- Copy the rows of its `INDEX.md` into `reference/outside-docs/INDEX.md`.
- Remove the old `INDEX.md` with `git rm` in step 6 of "After the owner's yes", after you have read its rows back in the new one.

**A `DECISIONS.md` in another form**

- Move the old file to `sources/` with `git mv`, with an SRC number, so that the setup copy's `DECISIONS.md` can take its place.
- Each decision in the old file that the owner confirms is still true becomes an entry whose Sources names that SRC number.

**`PROJECT.md`**

- Change "Toolkit settings" as `update.md`, "3. What to do with each kind of file", says in its row for that section.
- Add the "May decide" column to "People and ownership".
- Write the text on the "Constraints" line as rules in `system/constraints.md`, as the rules for an agreed requirement say. The line then becomes the setup copy's link.
- "Work and project records" becomes the setup copy's section.
- Under "Resources and project paths", the "Tests and checks" line becomes the setup copy's "Tests" line.
  - A location that the owner wrote stays.
  - A command that the owner wrote moves to the "Build, test, or deploy" row of `AGENTS.md`, "Commands".
- Show the owner each change before you make it.

**A work item that is not Done or Cancelled**

Make these changes with the selected `references/work-tracker.md` inside `managing-work-items` in the setup copy:

- Add the `**Moved up:**` line after Related items, and leave it empty.
- Add the Notes heading "Lessons not proven yet" after Sources, with "None." under it.
- Write each Sources line in the SRC form, which the rules for a source inside a work item give.
- Add one Recent History row: "Toolkit update: the current folder layout."

**A work item that is Done or Cancelled**

- In step 7 of "After the owner's yes", add the `**Moved up:**` line after Related items, with the text `Nothing: the item was closed before the closing step existed.` Add the same Recent History row as for a work item that is not Done or Cancelled.
- In step 8, when a `DECISIONS.md` entry or a `system/` rule that this update wrote names the work item, put those IDs on the Moved up line in place of that text.
- Change nothing else in the work item, with two exceptions: a Sources line whose source moved, and the ID of a new `DECISIONS.md` entry that names the work item.

**The Notion work item template**

- The project's work item template in Notion is the owner's. Tell the owner which sections differ from the sections that `references/work-tracker-page-layout.md` of `managing-work-items` lists, and change the template only as the owner says.
- Follow every rule of "Where the templates are kept" in `notion-build/work-setup.md`, for example the rule never to restore a template through the API.
- Never move the project's own work item template to the trash.

### The project's Current State in the earlier form

The project's Current State has five parts now: Now, Coming up, Waiting on, Standing jobs and shared files, and Next session starts with. In step 8 of "After the owner's yes", bring the project's Current State to the headings of `<copy>/memory/CURRENT_STATE.md`, and keep every line that the owner has. With memory in Notion, the project's Current State is the "Current state" page.

- "Waiting on the owner" becomes "Waiting on", and each of its lines starts with "Owner:".
- Add "Coming up" after "Now", and "Standing jobs and shared files" after "Waiting on". Under each of the two, write "None."
- Remove no line and reword no line.

In a project with memory in Hindsight, what the bank stores has not changed, and nothing is removed from a Hindsight bank. A bank is one project's store in Hindsight. Bring that project's Current State file to the five parts in the same way.

### Toolkit files

Toolkit files hold nothing of the owner's and need no new place. Give them one row in the plan. These are the toolkit files:

- `AGENTS.md`, every template, and every `.gitkeep` in `project-wide-records/`, `requirements/`, and `system-guide/`.
- `memory/decision_template.md`, which is removed.
- `memory/project_topic_template.md`, the template for a memory file. Git does not track it. So show the owner how it differs from the setup copy's file, as `update.md`, "Whether a difference is the owner's edit", says for a file that Git does not track, and replace it after the owner's yes.
- The generated `memory/MEMORY.md`. The setup copy's file replaces it, and the session-start hook fills it again at the next session start.
- The template folders and `.gitkeep` files in the old `delivery/` folders, and the two `.gitignore` files `delivery/data/data-loads/.gitignore` and `delivery/data/production-backups/.gitignore`. The setup copy holds both `.gitignore` files at their new paths under `delivery/migrations/`.
- `work-items/work-item-template/references/`.

A template file in the old `delivery/` folders may hold the owner's facts, for example a filled `package.xml` or `component-tracker.csv`. Decide by the file's Git history. `update.md`, "Whether a difference is the owner's edit", says how to tell a commit of the owner's from a commit of the toolkit's.

- When a template has no commit of the owner's, it is a toolkit file. It is a toolkit file also when it differs from the file of the same name in `<copy>/delivery/`, because the toolkit changed some templates.
- When a template has a commit of the owner's, move it with `git mv -f` to the new path, in place of the file that the setup copy put there.
- Any other toolkit file with a commit of the owner's is "Your call".

## After the owner's yes

Do `update.md`, "3. What to do with each kind of file", "4. What the toolkit no longer ships", and "5. Services", first. Those sections add `DECISIONS.md`, `system/`, `sources/`, `delivery/`, `reference/`, and the new skills, which the moves need.

Each change has one place where you make it:

- Change the files that Git tracks in your worktree.
- Change `memory/`, `work-items/`, and the data files that Git ignores in the main checkout, and only in step 8, after the branch was merged. A work item or a memory record must never name a record that is not on the default branch.

Do the nine steps in this order.

1. **Sources first.** File every source that the plan moves before you write any other record, so that later records can name their SRC IDs. Take the next SRC number for each source, in the order of the plan.
2. **Decisions.** Write each `DECISIONS.md` entry at the end of the file.
3. **System documents.** Write the glossary, then the rules. Set each document's Status, "Last changed via", and Changelog as `system/AGENTS.md` says.
4. **`reference/current-system/`**, then **`PROJECT.md`**, then each instruction for the agent that the plan carries to `.claude/rules/owner-preferences.md`. Write each such instruction as one list line, in the form that the layout comment of that file gives.
5. **Renames.** Move `ai-external-knowledge/` and the old `delivery/` folders, as the rules for their rows say.
6. **Read back** every new record against the old file it came from. Then do these two things, in this order:
   - First, remove each tracked old file that an approved row names, with `git rm`. When a file changed since you listed it, leave the file and ask again.
   - Then list every mention of an old path that is left in a tracked file: `command grep -rnE 'ai-external-knowledge/|delivery/(deployment|data|meeting-notes|references|communications|deliverables|archive)/|project-wide-records/|system-guide/|requirements/' . --exclude-dir=.git --exclude-dir=.claude`.
     In that list, a line that says "Carried over from" stays, and so does a source in `sources/`. Change each other line after the owner's yes.
7. **Check, commit, and merge** as `update.md`, "6. Checks and report", says.
   - Before the commit, look for these two things in a project on the old layout, and fix them:
     - A closed work item has no filled Moved up line. The rules for a work item that is Done or Cancelled, above, give the line to write.
     - A `memory/` folder has an `AGENTS.md` and no `CLAUDE.md`. Copy `<copy>/memory/CLAUDE.md` into it.
   - Before the branch is merged, fetch, and compare `DECISIONS.md` and `sources/README.md` with the default branch. When another session took an ID in the meantime, renumber your own record and every mention of it.
8. **In the main checkout, after the branch was merged:**
   - In a Salesforce project, move each data file that Git ignores, for example with `mv <main>/delivery/data/data-loads/<file> <main>/delivery/migrations/data-loads/`, and do the same for `production-backups/`. Then run `git status --short`, which must list no data file. When it lists a data file, that file is not ignored: stop and tell the owner. Remove the old folders with `rmdir` once they are empty.
   - In the work items, write each Sources line, the Moved up line, the heading "Lessons not proven yet", each Questions and Answers row that the plan carries from a memory decision record, and the ID of each new `DECISIONS.md` entry in each work item that the entry affects. Write each one in the place that `<copy>/work-items/AGENTS.md` and the work item template give.
   - In memory, mark each decision record whose decision was moved, as the rules for a memory decision record say. Every other memory record stays as it is. With local memory, also do the following:
     - Remove `memory/decision_template.md`.
     - Remove `memory/terminology-glossary.md` after you have read its rows back in `system/glossary.md`.
     - Replace `memory/MEMORY.md` with the setup copy's file.
     - Replace `memory/project_topic_template.md` when the owner said yes to its row.
   - Bring the project's Current State to the five parts, as "The project's Current State in the earlier form" says. Rewrite a line that names an old path, and keep its meaning.
   - List every mention of an old path in the work items and in memory, and change each one after the owner's yes: `command grep -rnE 'ai-external-knowledge/|delivery/(deployment|data|meeting-notes|references|communications|deliverables|archive)/|project-wide-records/|system-guide/|requirements/' <main>/work-items <main>/memory`.
   - Read back each work item and each memory file.
   - Remove each `references/` folder of a work item that an approved row names, with `rm` and the exact path. Remove an empty folder with `rmdir`. Never run `rm -r` on a folder that still holds a file.
9. **Last check.** Run every command of "Find the old layout" again. Each hit is a row the owner turned down, a "Your call" row the owner has not answered, or a failure. Name each one in the report.
