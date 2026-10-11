# TKV-64 workflow review and content changes

## Scope and evidence
Reviewed chosen-memory and work-tracker workflows after onboarding. The live toolkit wiki, reference/how-the-owner-works-with-agents.md, and reference/davis-memory-system.md supplied owner evidence. Official Claude Code skills, Codex build-skills, and Anthropic skill best practices were opened on 2026-10-10. The shared clarity standard and writing-harness-files procedure govern these edits.

## Changes and reasons
- The memory entry now names its local/Notion scope and selects procedures directly. Two focused references hold event/run/shared-file guidance and standing-owner-instruction guidance. Old section headings in saving.md remain as routing stubs, preserving external citations.
- Qualification now uses the wiki owner three-part criteria rather than an agent-authored five-part test. Authoritative-record routing remains: shared decisions, system truths, work status, sources, and owner instructions keep their own records.
- Active memory status no longer establishes truth. Sources, uncertainty, and current verification remain required.
- Current State no longer loses an unfinished commitment simply because its due date passed. Completed/cancelled/moved deadlines may be removed after checking the work record.
- Saving and tidying reports no longer force an unnecessary keep-going request. Pending decisions are still reported; authorized work continues.
- Notion tracker content is relocated intact into focused page-update, API-call, and recovery files. Entry retains store layout, live owner schema/template precedence, fresh reads, readback, archive/no-delete safeguards, and neighboring routes.

## Preserved or pending owner decisions
Preserved all editorial numeric caps (Current State lines, record/filename sizes, summary length), six-month and 30-day thresholds, repeated-lesson two-observation promotion threshold, email prohibition, metadata formats, broad-cleanup approval, and deletion approval pending owner clarification. Hindsight rule and package semantics are unchanged. No external schema writes and no commits.

## Exact changed files
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-criteria.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/tidying.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/finding.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/current-state.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-process.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/events-and-recurring-jobs.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/owner-instructions.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-page-updates.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-commands.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-known-problems.md

## Reviewed without changes
- Hindsight hindsight-memory.md (coherent chosen-store behavior, metadata fallback, source verification, correction/deletion distinction).
- Local and GitHub tracker entries (backend-specific safety and identity rules preserved; no rewrite required in this batch).
- Local and Notion memory storage adapters and format references (held to avoid schema/metadata changes before owner answer).

## Verification
Original shared-memory files and Notion tracker are copied under /tmp/tkv64-workflow-before, with inventory.json listing source paths. An attempted node dev/tools/check-skills.mjs cannot run because dev/tools is absent in this checkout; root coordinates current validation. Reference existence and relocation-preservation checks below were performed locally.

## Before/after inventories and exact diffs

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md
Before headings: Managing project memory, References
After headings: Managing project memory, Choose the procedure, Route other project records
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -1,24 +1,29 @@
 ---
 name: managing-project-memory
-description: 'Finds, saves, corrects, and retires project memory and keeps the project’s Current State accurate. Use when the owner asks to remember, find, change, or forget something; reports a fact, date, or recurring job run; or a turn leaves information that no other project record holds and a later session needs. For a work item, use managing-work-items; for a shared decision or source, use filing-project-records.'
+description: 'Keeps project memory and Current State useful across sessions. Use to find, save, correct, retire, or forget lasting project knowledge, record a recurring job, or update current priorities and commitments. Work-item records belong to managing-work-items; shared decisions and sources belong to filing-project-records.'
 ---

 # Managing project memory

-Use this skill to keep project memory accurate and useful to a later session. A memory record holds one subject that no other project record holds. The project's Current State is the short page of what is true now. A session is one chat with the agent.
+Keep lasting context available to later sessions and keep the project's Current State accurate. A memory record covers one subject. Current State is a short view of current priorities, commitments, and where the next session should begin.

-Open [references/memory-process.md](references/memory-process.md) whenever a turn might need a memory read, save, correction, or update to the project's Current State. It gives the rules for what to keep, what to file elsewhere, and when to ask the owner. For every memory read or write, also open [references/memory-store.md](references/memory-store.md). Setup places only this project's local or Notion storage instructions at that path.
+This skill serves projects that chose local or Notion memory. Setup installs that store's instructions in [references/memory-store.md](references/memory-store.md). Hindsight projects use their Hindsight rule and tools instead.

-A work item and its project tasks belong to `managing-work-items`. A decision or question that several work items need, a source, a project term, or a fact about the system belongs to `filing-project-records`.
+## Choose the procedure

-## References
+Read [the memory process](references/memory-process.md) for retention, authorization, and maintenance rules. Choose the procedure below for the current job. Read the installed storage instructions before accessing or changing records, and read each change back before reporting it as saved.

 | File | Open it when |
 | --- | --- |
-| [references/memory-process.md](references/memory-process.md) | Every turn that might involve memory or the project's Current State. It gives the process, and says when to ask the owner. |
-| [references/memory-criteria.md](references/memory-criteria.md) | You decide whether information belongs in memory, which record type it needs, or which other file holds it. |
-| [references/saving.md](references/saving.md) | You save, correct, retire, or delete information, including a lesson, event, recurring run, or project rule. |
-| [references/current-state.md](references/current-state.md) | You read or change the project's Current State or remove a line that is no longer true. |
-| [references/finding.md](references/finding.md) | You find memory, answer what was recorded, or need a remembered fact. |
-| [references/tidying.md](references/tidying.md) | You review or clean up all of memory. |
-| [references/memory-store.md](references/memory-store.md) | You read or write memory. Setup installs this project's storage instructions and its linked files. |
+| [references/memory-criteria.md](references/memory-criteria.md) | You decide whether information qualifies for memory, which type it needs, or which project record owns it. |
+| [references/finding.md](references/finding.md) | You find remembered context or answer what was recorded. |
+| [references/saving.md](references/saving.md) | You save, correct, retire, or delete memory. |
+| [references/events-and-recurring-jobs.md](references/events-and-recurring-jobs.md) | You record an event, recurring run, or shared file. |
+| [references/owner-instructions.md](references/owner-instructions.md) | The owner gives a standing instruction, or approves turning a lesson into a rule. |
+| [references/current-state.md](references/current-state.md) | You read or update priorities, commitments, or next-session context. |
+| [references/tidying.md](references/tidying.md) | You review or clean up memory as a whole. |
+| [references/memory-store.md](references/memory-store.md) | You access local or Notion records; it routes to storage formats, search, and write procedures. |
+
+## Route other project records
+
+Use `managing-work-items` for a work item or project task. Use `filing-project-records` for a shared decision or open question, a source, a project term, or an authoritative fact about the system. Memory can point to those records when the pointer helps retrieval; it does not duplicate their content or replace them.

```

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-criteria.md
Before headings: Memory criteria, First find the place where the fact is kept, Default test for a memory record, The four types of memory record, user, project, reference, event, A fact that is true only for a while, Never save in a memory record
After headings: Memory criteria, First find the place where the fact is kept, Default test for a memory record, The four types of memory record, user, project, reference, event, A fact that is true only for a while, Never save in a memory record
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -25,13 +25,13 @@

 ## Default test for a memory record

-Save a subject in a memory record when all five of these are true:
+Save information when all three of the owner's criteria hold:

-- it concerns this project;
-- it has a credible source;
-- it would matter in a future session;
-- it would be costly or unreliable to reconstruct;
-- no other file is the place for it.
+- It contains lasting project-specific facts, people, terminology, decisions, lessons, events, or constraints that another memory record does not already explain.
+- Losing it would cost a later agent real time or understanding.
+- It comes from the owner, or from work done together with the owner.
+
+Apply these criteria after identifying the authoritative record. A qualifying decision still belongs in `DECISIONS.md`; memory may preserve a useful pointer rather than repeat the decision.

 Prefer to update a memory record that exists. A new fact goes under a heading in the memory record for the subject it belongs to. Make a new memory record only for a new subject.


```

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/tidying.md
Before headings: Cleaning up memory, Contents, A helper reads memory in the background, Plan first, then ask, The project's Current State, Duplicates and merges, Links to work items, Links between memory records, Stale records, The wrong place, the wrong type, or a memory record changed by hand, Too many memory records, Lessons that should become rules or skills, Writing a project skill, The owner's rules, The report
After headings: Cleaning up memory, Contents, A helper reads memory in the background, Plan first, then ask, The project's Current State, Duplicates and merges, Links to work items, Links between memory records, Stale records, The wrong place, the wrong type, or a memory record changed by hand, Too many memory records, Lessons that should become rules or skills, Writing a project skill, The owner's rules, The report
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -152,4 +152,4 @@

 When the owner asks how to undo a change, give the owner the words to say, for example "bring back Old dashboard".

-End the report with the questions that are still open. When no question is open, end with the exact words that continue the work: "Say 'keep going' and I'll <next action>."
+Report any questions that remain open and what they affect. Continue the authorized work when no owner decision is needed.

```

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/finding.md
Before headings: Finding what memory holds, Where to look, in order, What happened, and when, Reading what you found, Answering
After headings: Finding what memory holds, Where to look, in order, What happened, and when, Reading what you found, Answering
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -31,9 +31,9 @@

 ## Reading what you found

-Read each hit whole, in this turn, and check its status:
+Read each relevant record whole, in this turn, and check its source, evidence, uncertainty, and status. Use memory as context, and verify changeable claims against the current authoritative record or system before acting:

-- Current: it is a fact.
+- Current: the record remains in use. Its status does not establish that every claim in it is true.
 - Replaced: answer from the memory record that replaces it.
 - Retired: it is history. Leave it out unless the owner asks for history.
 - Past its "check or remove by" date: say so, and check it before you act on it.

```

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md
Before headings: Saving to memory, Contents, Decide where the fact is kept, Find the subject's memory record first, Write the change, An unchecked claim, A lesson, An event, A recurring job and its runs, A shared file, Correcting a fact, "Forget that", retiring, and deleting, The owner's instructions, Reply lines
After headings: Saving to memory, Contents, Decide where the fact is kept, Find the subject's memory record first, Write the change, An unchecked claim, A lesson, An event, A recurring job and its runs, A shared file, Correcting a fact, "Forget that", retiring, and deleting, The owner's instructions, Reply lines
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -81,44 +81,15 @@

 ## An event

-An event is one of two things:
-
-- work done for the owner that no work item, project task, commit, or filed record shows;
-- anything else that happened and that a later session must know, such as a meeting, a call, or an outage.
-
-Make one event record for it. The event record holds four things:
-
-- the date, and who took part;
-- what was done or what happened;
-- the result, in a few lines;
-- where the output is: an SRC ID, a file path, a work item or project task ID, or "said in chat only".
-
-Name the event record for what happened and its date.
-
-One kind of result gets no event record. When the root `AGENTS.md`, section "Where information goes", names a place for the result, write the result in that place. An analysis of how the system works today is an example.
+Use [events-and-recurring-jobs.md](events-and-recurring-jobs.md), section "An event", to record something that happened and that no other record already covers.

 ## A recurring job and its runs

-A recurring job is a job that the team runs again and again, such as a weekly data load, a monthly release, or the update of a shared sheet after each meeting. A recurring job has one event record. That event record holds two things:
-
-- a first section that says what the job is, when it runs, who runs it, and the exact steps or the file that holds the steps;
-- a section "Runs" with one row per run. `references/memory-store.md` gives the form of the table.
-
-Add a row for each run. The owner may report a run in words such as "the weekly load ran fine" or "the nightly job broke again".
-
-- A failed run gets a row too, with the error and the fix.
-- When the owner reports a run without its detail, write the row with the date and the owner's words, and write "not known yet" in each cell that the owner did not give. Complete the row when the detail is known.
-- When the job has no event record yet, make one with what is known. Add the job's line under "Standing jobs and shared files" in the project's Current State, as `references/current-state.md` says.
-- When another record, such as a work item, already shows an earlier run, the row for that run holds only the date and that record's ID.
-
-Before you run the job again, and before you answer how the last run went, read the Runs table.
+Use [events-and-recurring-jobs.md](events-and-recurring-jobs.md), section "A recurring job and its runs", to maintain one event record with a row per run.

 ## A shared file

-A shared file is a file kept outside the project's records that people keep up to date, such as an open-items spreadsheet that the client shares. A shared file has one memory record of the type reference. That memory record says where the file is, who shares it, what it is for, and how and when it is updated.
-
-- The shared file gets a line under "Standing jobs and shared files" in the project's Current State.
-- The updates of the shared file are a recurring job, as the section above describes. The job's event record names the shared file's memory record under "Related memories".
+Use [events-and-recurring-jobs.md](events-and-recurring-jobs.md), section "A shared file", to record where the file is and how it is kept up to date.

 ## Correcting a fact

@@ -148,25 +119,13 @@

 ## The owner's instructions

-An instruction from the owner for how the agent works is a rule, and never memory. So is a preference of the owner, and a correction of how the agent works. The owner's own words are the owner's yes.
-
-Write a line that the owner dictates with the steps below alone. Every other change to a rule file follows `.claude/rules/document-clarity-standard.md` and needs the owner's yes first, as the Project map in the root `AGENTS.md` says.
-
-1. Read `.claude/rules/owner-preferences.md` again, right before you change it. Then do the one of these that fits:
-   - When a bullet already says the same, add nothing, and tell the owner so.
-   - When a bullet says the opposite, replace it with the owner's new words, and name the old line in your reply.
-   - Otherwise, add one bullet in the owner's words under the `## ` area that the instruction is about: Replies, Questions, Testing, Git, Work items, Memory, or General. End the bullet with `(<YYYY-MM-DD>, <owner name>, in chat)`. Write one instruction per bullet.
-   - When the owner asks to change or remove an instruction, change or remove that bullet.
-2. When the owner's words say that the instruction is for every project, add the bullet to the files that the root `AGENTS.md` names for every project, in place of this project's file. The root `AGENTS.md` names those files in the section "Where information goes", in the row for the owner's preference. Ask "This project or all projects?" only when the owner's words leave it unclear.
-3. A request that a problem never happens again, such as "don't let that happen again", is an instruction. Write the bullet as the check or the step that prevents the problem. In the bullet, name the record that explains the problem by its ID: a DEC, a work item, or a memory record. Show the owner the bullet in your reply.
-4. When you inferred an instruction that the owner did not give, ask first: "Add to the project rules: <one line>?". A rule file changes only with the owner's yes.
-5. When `managing-work-items` closes a work item and the owner agreed to keep a lesson from it as a rule, write that rule in the same way. Its bullet ends with the work item's ID in place of "in chat".
+Use [owner-instructions.md](owner-instructions.md) to record the owner's standing instructions, preferences, and corrections in the applicable rule file. That reference preserves the distinction between an instruction the owner gave and one the agent inferred.

 ## Reply lines

 Give the owner one short line for each record you changed, in the form below, and add nothing else about the save. The line names the record by its title and says where the record is kept. `references/memory-store.md` gives the path or the link. The line for a change that removes or replaces text in a memory record or in the project rules also gives what the section for that change asks for: the old text, and the words that undo or restore it. A correction, a removed section, and a retire are such changes. No other line gives undo words.

-After the lines, give the next step. The next step is the question that still waits for the owner. When no question waits, it is the exact words that continue the work: "Say 'keep going' and I'll <next action>."
+After reporting the saves, continue the authorized work. When progress needs an owner decision, name the pending question and what it affects.

 The line for each kind of save:


```

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/current-state.md
Before headings: The project's Current State, Contents, What it holds, A line under "Now", A line under "Coming up", A line under "Waiting on", A line under "Standing jobs and shared files", A line under "Next session starts with", Who decides each line, When to change it, Removing what is no longer true, Steps for removing lines that are no longer true
After headings: The project's Current State, Contents, What it holds, A line under "Now", A line under "Coming up", A line under "Waiting on", A line under "Standing jobs and shared files", A line under "Next session starts with", Who decides each line, When to change it, Removing what is no longer true, Steps for removing lines that are no longer true
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -80,7 +80,9 @@
 Two skills remove lines:

 - `managing-work-items` removes a work item's line under "Now" when the work item finishes.
-- This skill removes every other line: a piece of work that ended, a date that passed, a thing owed that was delivered or answered, a job that stopped, and a file that is no longer shared.
+- This skill removes every other line: a piece of work that ended, an event that ended or a deadline whose outcome is recorded, a thing owed that was delivered or answered, a job that stopped, and a file that is no longer shared.
+
+A passed deadline can still represent unfinished work. Check the work record, preserve the unresolved commitment, and update its date or follow-up when known.

 Before you remove a line for something that happened and that a later session must know, check that a record holds it. That record is a work item, a project task, a filed source, or an event record. `references/saving.md`, section "An event", says how to make an event record.

@@ -91,7 +93,7 @@
 1. Read the project's Current State. Read the status of every work item that it names, with `managing-work-items`. Read each project task that it names.
 2. Remove every line that is no longer true. These removals do not go on the plan that `references/tidying.md` describes. Tell the owner what you removed, in the one line that `references/saving.md`, section "Reply lines", gives for the project's Current State. Remove each of these:
    - under "Now", a finished or cancelled work item, or a piece of work that ended;
-   - a line under "Coming up" whose date has passed;
+   - a line under "Coming up" whose event ended or whose deadline was met, cancelled, or moved;
    - a line under "Waiting on" that was answered or delivered, or whose project task is done, or whose decision is no longer Open;
    - a job that no longer runs, or a file that is no longer shared;
    - a line under "Next session starts with" that names a closed work item.

```

### plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-process.md
Before headings: Managing project memory, Contents, The goal, and what it means for memory, How memory is kept, When to search memory, When to ask the owner, When to clean up all of memory, A memory record that is out of date or no longer needed, Every time you change a memory record, Work that another skill or reference does
After headings: Managing project memory, Contents, The goal, and what it means for memory, How memory is kept, When to search memory, When to ask the owner, When to clean up all of memory, A memory record that is out of date or no longer needed, Every time you change a memory record, Work that another skill or reference does
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -1,6 +1,6 @@
 # Managing project memory

-Use this reference to decide what goes into project memory, when to ask the owner, and when something in memory is corrected, retired, or deleted. The goal is that project memory stays true, so that a later session can rely on it. A session is one chat with the agent.
+Use this reference to decide what goes into project memory, when to ask the owner, and when something in memory is corrected, retired, or deleted. The goal is that later sessions can retrieve useful context, understand its evidence, and check what remains true. A session is one chat with the agent.

 Project memory has two parts:

@@ -9,7 +9,7 @@

 For every read and every write of memory, use `references/memory-store.md`. That reference gives the instructions for the memory store chosen during project setup.

-Two neighbouring jobs belong to other skills. A decision or an open question that more than one work item needs is saved with `filing-project-records`. A to-do is saved with `managing-work-items`.
+Use the entry skill's routing for authoritative records and work items. Memory supports those records rather than replacing them.

 ## Contents


```

### plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md
Before headings: Work items kept in Notion, Contents, Where the work items are kept, The owner's Notion describes a work item, Steps for every read and every save, Create a work item, Fill and change a work item's page, The Solution Design page, Phases, tasks, and sub-items, Exact names and values, Commands, Related work, Known problems
After headings: Work items kept in Notion, Where the work items are kept, The owner's Notion describes a work item, Steps for every read and every save, Procedures and API calls, Related work
Numeric and exact-text inventory remains in the preserved original; relocation files retain its case procedures and commands.
```diff
--- before
+++ after
@@ -3,20 +3,6 @@
 Use this reference to read, create, change, and find work items in a project that keeps its work items in Notion. The goal is to read and write each work item consistently with the lifecycle rules.

 This reference says where a work item is kept in Notion and how to save to it. The lifecycle rules decide what happens next: what to save and when, a work item's State, and each approval. A work item's State is the step the work is in, and its Status is the short summary of the State. `using-notion-cli` says how to run each Notion call.
-
-## Contents
-
-- Where the work items are kept
-- The owner's Notion describes a work item
-- Steps for every read and every save
-- Create a work item
-- Fill and change a work item's page
-- The Solution Design page
-- Phases, tasks, and sub-items
-- Exact names and values
-- Commands
-- Related work
-- Known problems

 ## Where the work items are kept

@@ -40,7 +26,7 @@
 The owner built the databases, their views, the work item template, and the Solution Design page inside that template in the Notion app. The owner changes them there. This skill does not describe them, so read them from Notion.

 - To learn what a work item's page holds, read the page. A work item's page can have other sections than `assets/work-item-template.md`, and then the page is right.
-- To learn the properties of a database and their options, read the database. "Commands" gives the call.
+- To learn the properties of a database and their options, read the database. [work-tracker-commands.md](work-tracker-commands.md) gives the call.
 - Never build or rebuild a template, a database, a view, or a property through a Notion call. When one is missing, tell the owner. The owner makes it or restores it in the Notion app.
 - Never rename or remove a property, a view, or a section of a template.
 - Never add work to a template. The templates are the "Project" template in the owner's Projects database, and the work item template. Every copy that Notion makes from a template takes along what the template holds.
@@ -49,7 +35,7 @@

 1. Read the ids from `PROJECT.md`. Before your first Notion read or write in a session, open `using-notion-cli`, whatever tool you use. That skill says how to sign in, how to run a call, and what to do when a call fails.
 2. In this turn, read again what you will look at or change. Never answer from an earlier read, because the owner edits in Notion, and the owner's edit is the one to keep.
-3. Make the change as the sections below say.
+3. Open [work-tracker-page-updates.md](work-tracker-page-updates.md) for creation, page updates, designs, phases, tasks, and sub-items. Use [work-tracker-commands.md](work-tracker-commands.md) for the matching API call.
 4. Read the changed page or row back, and check that it says what you wrote. When a save failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.

 Two rules apply to every read and every save:
@@ -57,215 +43,13 @@
 - Never delete a page, a row, a phase, or a task. Take it out of view instead: set a phase or a task to Cancelled, or tick a work item's Archived box. When the owner wants it deleted, ask the owner to delete it in Notion.
 - Leave out archived work items unless the owner asks for them.

-## Create a work item
+## Procedures and API calls

-1. Count the levels by following "Parent item" up from the parent. When the parent is already at the third level, stop. The work becomes a task, as `managing-work-items` says.
-2. Create the row with the default template and the properties that `managing-work-items` gave you. "Commands" gives the call. Notion builds the page from the work item template. Write none of the template's sections yourself.
-3. Wait until the template's content is on the page. `using-notion-cli`, section "Waiting for a template", says how to check.
-4. Put the work item's ID in the title of its Solution Design page, as "The Solution Design page" says.
-5. Fill the page, as the next section says.
-6. When the work item has a parent, add a Recent History row on the parent's page: "Sub-item WI-32 created: <title>."
-
-## Fill and change a work item's page
-
-The lifecycle decides what is saved. The page decides where it goes and what form it takes. So follow the page that you read.
-
-- **Prompts.** Text in angle brackets is a prompt that says what to write in that place. The page text shows a prompt as `\<…\>`. `references/lifecycle-rules.md`, section "Text in angle brackets", says what to do with a prompt.
-  - Fill a new work item with one change that leaves no prompt on the work item's page. Delete the note at the top of the page in the same change, because the note only says what a prompt is.
-  - Then read the page text, and check that no line holds `\<`. Real content may hold it, for example code such as `Map\<Id, Account\>`.
-  - A card that the owner made by hand holds the same note and the same prompts. The first time you change such a card, do the same, and keep everything that the owner wrote.
-- **The owner's guide lines.** A line under a heading that says how the section is kept, such as the order of its rows, is the owner's guide for that section. Follow it, and keep it on the page.
-- **Lines that are not text.** A `<database …>` line is a view, which shows the rows of a database. To change what a view shows, change the rows. A `<page …>` line is a child page. An `<unknown …>` line is a block that only the Notion app can change. Never change or remove one of these lines.
-- **A line that the page does not have.** When a step of the lifecycle needs a line or a heading that the page does not have, add it where the lifecycle says, in the form of the lines around it. For example, `references/closing.md` fills a "Moved up" line in the Overview. Match a heading by its words, at the level the page uses.
-- **Small, exact changes.** Change the text with exact replacements, built from a read that you just made. `using-notion-cli`, section "Reading and changing page text", gives the calls. Never replace the whole text of a page. A new row, a new requirement, or a new line takes the form of the ones already in its section.
-- **The work item's Current state.** Rewrite its five lines in place, with one replacement of the whole block as you read it.
-- **Lines that also have a property.** Next action and Summary each have a property with the same name, which a view of Work Items shows on the card. When you write one of these lines, write the same text in its property.
-- **Questions.** A new question gets the highest Q-ID on the page plus one. Set the Waiting on property to who the open questions wait on.
-- **Recent History.** Add a new row as the first row under the header row, so that the newest row is first.
-- **Links to other work items.** Set the link in its property, and also write the linked work item's ID in the Overview's "Related items" line, so that the page text lists every link. Never link a work item to itself.
-- **Pull requests.** Record a pull request under the heading "Linked Github PRs", as a plain link on its own line: `[<repository>#<number>: <title>](<pull request address>)`. Write `<repository>` as the GitHub account and the repository name, for example `acme/expenses`. When the page has no such heading, put the link under "Related items". The "Embed Github" block under that heading belongs to the owner, because only the Notion app can fill it.
-- **Comments.** Start each comment with "Agent:". Every comment that the agent writes shows the owner's name, because the agent signs in as the owner.
-
-## The Solution Design page
-
-Each work item has one Solution Design page. The work item template holds the page, so Notion makes it with the work item. The page already has the design's sections and prompts.
-
-- When you create a work item, put its ID in the page's title in place of the prompt, for example "Solution Design - WI-31". "Commands" gives the call. The `<page …>` line in the work item's page text holds the page's address, and the last 32 characters of the address are its id.
-- When `references/designing.md` says to create the design, write the design on this page. Never make a second design page.
-- Fill this page as you fill a work item's page: the lifecycle decides what is saved, and the page decides where it goes and what form it takes. The note at its top says when its prompts are removed.
-- A work item has no Solution Design page when the project's work item template is older and has none. Then do these three things:
-  1. Make the page as a child page of the work item's page, with the text of `assets/design-template.md` written as Notion markdown. Leave out the template's front matter and its `<!-- … -->` guide comments. "Commands" gives the call.
-  2. Read the page back, and check its title and its text.
-  3. Tell the owner that the project's work item template has no Solution Design page, so that the owner can add one in the Notion app.
-- The design page may have its own subpages. They stay under it.
-- When the owner approves the design, also set the Design approved property to `YYYY-MM-DD by <name>`.
-
-## Phases, tasks, and sub-items
-
-Phases and tasks are rows, so a change to the plan is a change to rows. The work item's page shows them in views, and nothing is copied into its text. `references/lifecycle-rules.md`, section "Levels", says which level has phases and what each ID looks like.
-
-- **Order.** The Order property is a phase's place in the plan, or a task's place in its phase or its plain list. To reorder, change only Order.
-- **IDs.** A Phase ID or a Task ID never changes, also when the phase or the task moves. A new Phase ID is one more than the highest that the work item, or the project, ever used, cancelled ones included. A new Task ID takes the next unused number in its phase or its plain list.
-- **Which "Phase" a row gets.**
-  - A top-level item's "Phase" is its project phase. Leave it out until the owner has named one. Write the project phase in the item's "Related items" line too: "Project phase P01."
-  - A level-2 sub-item's "Phase" is one of its parent's phases: the one that `managing-work-items` gives, or the one that the owner names when you ask. First check that the phase's "Work item" is the parent.
-  - A level-3 sub-item has no "Phase". A sub-item's task has none either.
-- **Dropping or merging a phase.** First move or cancel its sub-items and its tasks. Then set its Status to Cancelled, and write what happened in its Exit result: "Merged into P1", or "Dropped: <reason>".
-- **Cancelling a task.** Set its Status to Cancelled, and start its title with "Cancelled: ".
-- **Moving a work item under another parent.** Count the levels first, as step 1 of "Create a work item" says, for the work item and for every level under it. Set "Parent item" to the new parent, or empty it to make the work item top-level. Then set "Phase" as the list above says, and never keep a phase of the old parent. Add Recent History rows on the work item, on the old parent, and on the new parent. When the owner changed "Parent item" by hand, add the same rows at your next change.
-- **A work item that is now a sub-item.** A sub-item has no phases. Give its tasks the Orders 1, 2, 3, and so on, in plan order, and empty each task's "Phase". Empty "Phase" on each of its sub-items. Set each of its phases to Cancelled, with the Exit result "Removed: a sub-item has no phases. Its tasks are now one plain list." Add one Recent History row that names each phase removed.
-- **A work item that is now top-level.** Add phase `P1`, named as the owner approves, and set it as "Phase" on each of the work item's tasks and sub-items. Set the work item's own "Phase" to the project phase that the owner names. Add a Recent History row.
-- **After a change to the plan.** List the work item's phases, and check their order.
-
-## Exact names and values
-
-Notion holds the full list of properties, with their types and options. This table gives the names and the values that the lifecycle writes. The last column gives the type that a call names for the property, and its values.
-
-| Field in the lifecycle | Property in Work Items | Type and values |
-| --- | --- | --- |
-| `title` | Work item | `title` |
-| `id` | ID | Notion sets it. It shows the prefix and the number without padding: `WI-31`, not `WI-031`. |
-| `state` | State | `select`: Backlog, Refining Requirements, Designing, Building, Testing Loop, Reflecting, Deploying, Blocked, Done, Cancelled |
-| `status` | Status | `status`: Not Started, Preparing, In Progress, Blocked, Done, Cancelled |
-| `waiting_on` | Waiting on | `select`: owner, agent, external, none. For `external`, the "Waiting on" line of the work item's Current state says who. |
-| `type`, `priority`, `delivery`, `design` | Type, Priority, Delivery, Design | `select`, with the values that `assets/work-item-template.md` lists for the field |
-| `requirements_approved`, the design approval, `result_approved` | Requirements approved, Design approved, Result approved | `rich_text`: `YYYY-MM-DD by <name>`, or `no` |
-| `parent` | Parent item | `relation`, to one work item |
-| The work item's phase | Phase | `relation`, to one row of Phases |
-| The Next action line of the work item's Current state | Next action | `rich_text`, a copy of the line |
-| The Summary line of the Overview | Summary | `rich_text`, a copy of the line |
-| `updated` | none | The "Last updated" line of the work item's Current state holds it. |
-| none | Archived | `checkbox`. It hides the work item from the views of Work Items. |
-| none | Tags | `multi_select`. Reuse the exact spelling of an option that exists. A new name becomes a new option, and a name cannot hold a comma. |
-
-- Set State and Status in one call. The State table of `managing-work-items` gives the Status for each State.
-- The "Blocked by" relation fills "Blocking" on the other work item. The "Related" relation is one-way.
-- The Files property holds files that the owner attached. The agent adds none.
-- In Phases, Status is a `select`. In Work Items and in Tasks, Status is a `status`. In Phases and in Tasks, the options are Not Started, In Progress, Done, and Cancelled.
-- In Tasks, "Who does it" is `agent` or `owner`. A project task may hold the name of another person who owes the task, with the party, such as `Sarah Chen (client)`. Write that name as the option, and Notion adds it.
-
-## Commands
-
-`using-notion-cli` gives the form of a call, a query, and a change to page text. The calls below are the ones that are particular to work items. Replace each `<…-data-source-id>` with the data source id in `PROJECT.md`.
-
-Every query on Work Items needs `{"property":"Work item","title":{"is_not_empty":true}}` in its filter, so that the work item template is never reported. The one exception is the query for cards with no title, under "Known problems". A query that lists work items also needs `{"property":"Archived","checkbox":{"equals":false}}`, unless the owner asks for archived work items. Put these conditions inside `"and"` with the other conditions.
-
-**The properties of a database, with each one's type and options:**
-
-```bash
-ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.type)\t\((.value.select // .value.status // .value.multi_select // {}).options // [] | map(.name) | join(", "))"'
-```
-
-**Create a work item.** Send this body with `ntn api v1/pages -d @new.json < /dev/null`. The answer holds the page `id`, its `url`, and the new ID (`.properties.ID.unique_id`: prefix and number).
-
-```json
-{"parent": {"type": "data_source_id", "data_source_id": "<work-items-data-source-id>"},
- "properties": {
-   "Work item": {"title": [{"text": {"content": "<Title>"}}]},
-   "Status": {"status": {"name": "<status>"}},
-   "State": {"select": {"name": "<state>"}},
-   "Type": {"select": {"name": "<type>"}},
-   "Priority": {"select": {"name": "medium"}},
-   "Waiting on": {"select": {"name": "none"}},
-   "Requirements approved": {"rich_text": [{"text": {"content": "no"}}]},
-   "Design": {"select": {"name": "none"}},
-   "Design approved": {"rich_text": [{"text": {"content": "no"}}]},
-   "Result approved": {"rich_text": [{"text": {"content": "no"}}]},
-   "Delivery": {"select": {"name": "not-offered"}},
-   "Parent item": {"relation": [{"id": "<parent-page-id>"}]},
-   "Phase": {"relation": [{"id": "<phase-page-id>"}]}},
- "template": {"type": "default"}}
-```
-
-The values shown are the defaults for a new work item. Use another value only when `managing-work-items` says so. Leave out "Parent item" for a top-level item, and set "Phase" as "Phases, tasks, and sub-items" says.
-
-**Set State and Status, or another property:**
-
-```bash
-ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"State":{"select":{"name":"Building"}},"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
-```
-
-**Set the title of the Solution Design page:**
-
-```bash
-ntn api v1/pages/<design-page-id> -X PATCH -d '{"properties":{"title":{"title":[{"text":{"content":"Solution Design - WI-31"}}]}}}' < /dev/null
-```
-
-**Make a Solution Design page for a work item that has none.** Send `ntn api v1/pages -d @design.json < /dev/null`. The body `design.json` has three parts: `"parent": {"type": "page_id", "page_id": "<item-page-id>"}`, the title in `"properties"` as in the call above, and the text in `"markdown"`.
-
-**Give the default template to a work item's page that has no sections.** `using-notion-cli`, section "Database templates", gives the call that prints the id of the default template.
-
-```bash
-ntn api v1/pages/<page-id> -X PATCH -d '{"template":{"type":"template_id","template_id":"<default-template-id>"}}' < /dev/null
-```
-
-**Add a phase.** For a project phase, leave out "Work item", and give it a Phase ID with two digits, such as `P01`.
-
-```bash
-ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<phases-data-source-id>"},
-  "properties":{"Phase":{"title":[{"text":{"content":"Build the form"}}]},
-  "Phase ID":{"rich_text":[{"text":{"content":"P2"}}]},
-  "Order":{"number":2},
-  "Status":{"select":{"name":"Not Started"}},
-  "Outcome":{"rich_text":[{"text":{"content":"The form saves new sign-ups."}}]},
-  "Exit result":{"rich_text":[{"text":{"content":"A test sign-up is saved."}}]},
-  "Work item":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null | jq -r .id
-```
-
-**Add a task.** For a sub-item's task, leave out "Phase". For a project task, leave out "Work item" and "Phase". "Depends on" takes the page ids of the tasks that the new task waits for.
-
-```bash
-ntn api v1/pages -d '{"parent":{"type":"data_source_id","data_source_id":"<tasks-data-source-id>"},
-  "properties":{"Task":{"title":[{"text":{"content":"List the required fields"}}]},
-  "Task ID":{"rich_text":[{"text":{"content":"P1-T01"}}]},
-  "Order":{"number":1},
-  "Status":{"status":{"name":"Not Started"}},
-  "Work":{"rich_text":[{"text":{"content":"List the fields with the owner."}}]},
-  "Deliverable":{"rich_text":[{"text":{"content":"The field list."}}]},
-  "Done when":{"rich_text":[{"text":{"content":"The owner approves the list."}}]},
-  "Who does it":{"select":{"name":"agent"}},
-  "Work item":{"relation":[{"id":"<item-page-id>"}]},
-  "Phase":{"relation":[{"id":"<phase-page-id>"}]}}}' < /dev/null | jq -r .id
-```
-
-To start a task, set its Status to In Progress. To finish it, set its Status to Done. `managing-work-items` calls this ticking the task.
-
-**Find one work item by its number.** Find a work item by its number, never by its title. For `WI-31`, the number is 31.
-
-```bash
-ntn api v1/data_sources/<work-items-data-source-id>/query -d '{"filter":{"and":[{"property":"ID","unique_id":{"equals":31}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
-```
-
-**The board.** Send this body to `v1/data_sources/<work-items-data-source-id>/query`. It lists the open work items, sorted by Priority and then by ID. Report the Status, State, Waiting on, and Next action of each. Add the work items that are Done or Cancelled only when asked. Then list the cards with no title, as "Known problems" says, and report each one.
-
-```json
-{"filter": {"and": [
-   {"property": "Archived", "checkbox": {"equals": false}},
-   {"property": "Work item", "title": {"is_not_empty": true}},
-   {"property": "Status", "status": {"does_not_equal": "Done"}},
-   {"property": "Status", "status": {"does_not_equal": "Cancelled"}}]},
- "sorts": [{"property": "Priority", "direction": "ascending"}, {"property": "ID", "direction": "ascending"}],
- "page_size": 100}
-```
-
-**What waits on the owner.** Read the page text of each open work item, or of the work items that the owner named. Take the Questions and Answers rows whose Status is Open and whose "Decision needed from" is owner. Report first what waits on the owner, with the work item's ID, the Q-ID, and what the question blocks. Then report what is in progress, and then your next step.
-
-**A work item's sub-items, phases, and open tasks.** Each line is the filter of one query: on Work Items, on Phases, and on Tasks. Sort the sub-items by "Phase order" and then by ID, and sort the phases and the tasks by Order. Repeat the first query for each sub-item to reach the third level.
-
-```json
-{"property": "Parent item", "relation": {"contains": "<page-id>"}}
-{"property": "Work item", "relation": {"contains": "<page-id>"}}
-{"and": [{"property": "Work item", "relation": {"contains": "<page-id>"}}, {"property": "Status", "status": {"does_not_equal": "Done"}}, {"property": "Status", "status": {"does_not_equal": "Cancelled"}}]}
-```
-
-**The project's phases and tasks.** A project phase and a project task have an empty "Work item". The filter on Phases and on Tasks is `{"property": "Work item", "relation": {"is_empty": true}}`. For the top-level items, the filter on Work Items is `{"property": "Parent item", "relation": {"is_empty": true}}`, and the "Phase column" property shows each item's project phase.
-
-**Comments.** The first call adds a comment, and the second call reads a work item's comments, oldest first, including the owner's.
-
-```bash
-ntn api v1/comments -d '{"parent":{"page_id":"<page-id>"},"markdown":"Agent: a helper started on **P1-T02**."}' < /dev/null | jq -r .id
-ntn api v1/comments block_id==<page-id> < /dev/null | jq -r '.results[] | "\(.created_time)\t\(.display_name.resolved_name // "")\t\(.rich_text | map(.plain_text) | join(""))"'
-```
+| File | Open it when |
+| --- | --- |
+| [work-tracker-page-updates.md](work-tracker-page-updates.md) | You create or update work-item content, a design, phases, tasks, or sub-items; it gives their procedures and exact field values. |
+| [work-tracker-commands.md](work-tracker-commands.md) | You need the API call for creation, updates, queries, or comments. |
+| [work-tracker-known-problems.md](work-tracker-known-problems.md) | A call fails, a record is missing or malformed, or the owner changed the record by hand. |

 ## Related work

@@ -276,21 +60,3 @@
 | A source that the work item was given. A source is anything the project was given by someone else, such as a transcript or a client document. | `filing-project-records`, step "file a source" |
 | Moving the work items to another place where work items can be kept, such as local files or GitHub Issues | `project-setup` |

-## Known problems
-
-Each line names something that went wrong, and what to do.
-
-- **The work item template showed up as a work item.** Notion lists the template as a row of Work Items, with an empty title. Put `{"property":"Work item","title":{"is_not_empty":true}}` in the filter of every Work Items query.
-- **A card had no title.** A card that the owner made and gave no title is hidden from the Work Items views. To list such cards, query Work Items for an empty title with Archived false. Then drop the ids that `ntn api v1/data_sources/<work-items-data-source-id>/templates < /dev/null | jq -r '.templates[].id'` prints, because the work item template is one of them. Report each card that remains, in the form "A card with no title, IML-6: <link>", and ask the owner to name it or archive it.
-- **A card that the owner made by hand had an empty State.** A card made with "New" gets the template's sections, and its properties are empty. Give it State Backlog, Status Not Started, and the other defaults in the call that creates a work item, under "Commands". Add the Recent History row "Made in Notion by hand."
-- **A work item's page had no sections.** The owner made it with "Empty" in the New menu, or it was made before the project had a default template. Tell the owner, and offer to add the sections. To add them, give the page the default template once, with the call under "Commands", and wait for the content. `using-notion-cli`, section "Waiting for a template", says how to wait. The page's properties are kept. Its Recent History row is "Made in Notion by hand; the template was filled in."
-- **Notion refused to create a work item because the Work Items database has no default template.** Tell the owner. Only the Notion app can set the default template.
-- **A work item could not be found by its number.** The work item may be in the trash or outside this project. Tell the owner, and never make a second work item with the same title.
-- **A change that deleted lines also removed a line next to them.** To delete lines, send them in `old_str` together with one neighbouring line that stays, and send only that neighbouring line as `new_str`. After the call, read the page again and compare it with the text that you read before. Write a lost heading or paragraph again from the earlier text. When a `<database …>`, `<page …>`, or `<unknown …>` line is lost, stop and tell the owner which line, because such a line cannot be put back as text.
-- **A read or a write of the page text answered `truncated: true`.** The "Embed Github" block causes this answer, and the answer names the block's id in `unknown_block_ids`. When `unknown_block_ids` holds only that block's id, the answer needs no action.
-- **A work item's State and Status did not match.** When the owner drags a card to another column in a view, only the Status changes. `references/lifecycle-rules.md`, section "Read the work item before you act", says what to ask the owner.
-- **A search found nothing for words that are in a page's text.** `v1/search` matches page titles only. First narrow the work items by title, tag, type, parent, or status. Then read the page text of each candidate.
-- **A call to Phases failed on Status.** In Phases, Status is a `select`, and the call sent a `status`. Send Status as a `select`.
-- **A task had an empty Status.** The task was made by hand. Set its Status to Not Started.
-- **A phase or a task had an empty "Work item" and an ID that is not a project ID.** The row was made by hand. Ask the owner whether the row belongs to the project or to a work item.
-- **A work item was at a fourth level.** Tell the owner which work item is at level 4.

```
## Full workflow read coverage and protected behavior

Read the following adapter, format, search, maintenance, guide, and template files as a whole. This expanded list distinguishes reviewed coverage from proposed edits. All unedited files preserve their content; most are focused references that serve concrete backend behavior.
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/folders-and-files.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/record-format.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/searching.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/memory/AGENTS.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/memory/CLAUDE.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/memory/CURRENT_STATE.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/memory/MEMORY.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/memory/project_topic_template.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/assets/concept-record.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/assets/current-state.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/current-state-page.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/database-layout.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/searching.md
- plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/writing-pages.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/current-state.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/events-and-recurring-jobs.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/finding.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-criteria.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-process.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/owner-instructions.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md
- plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/tidying.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-issue-layout.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-labels.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker-field-mapping.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker-folders-and-files.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/PROJECT-ROADMAP.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/AGENTS.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/CLAUDE.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/PROJECT-TASKS.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/work-item-template/DESIGN.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/work-item-template/WORK-ITEM.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-commands.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-known-problems.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-page-updates.md
- plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md

Protected behavior by store:

- Local memory: main-checkout-only private files; ignored records and generated index; whole-record fresh reads; YAML quoting of GitHub IDs; prefix/status indexing and template exclusion; source dates, section evidence, uncertainty, expiry, and supersession; ID links unaffected by folder moves; no duplicate topic saves; owner edits and readback preserved.
- Notion memory: project IDs rather than workspace-wide lookup; Record Key plus Keywords; current/accepted, replaced/superseded, retired/deprecated mapping; Concepts/Events/Runs formats; source and authorization columns; live work-item links; independent local/GitHub tracker support; review dates; supersession and trash distinction; relation union rather than dropping existing links; all schema and field conventions left unchanged.
- Local tracker: identity by id rather than path; duplicate-number collision handling; owner-made/owner-moved record reconciliation; stable nested IDs, phase/task history, and checks against parent lists; linked requirements and questions; no record copies in worktree; roadmap on default branch and ignored project tasks in main checkout; no sources hidden in item folders; completed cross-item knowledge promoted to living records.
- Notion tracker: live owner schema and template precedence; no template/schema/view rebuild; default template wait; blocks and embed preservation; property/body synchronization; phase/task relations and IDs; comments attributed Agent; archive/cancel without delete; numbered queries rather than titles; all 11 command examples unchanged through relocation.
- GitHub tracker: explicit repository on every command; REST numeric IDs for sub-issues; owner login and credential boundary; read-modify-write body files; atomic label changes; issue-state versus label-state mapping; automatic-closing prevention; history/approval and owner comments; no-delete rule; paginated results and technical service limits; one design comment with overflow parts; milestones and project-tasks marker independent of work-item body.

## Additional changes after full coverage

- GitHub permission guidance now follows active session permissions rather than prescribing unsupported escalation. Two search/roadmap routes follow that single instruction. Local memory and tracker blocked-write instructions also respect permitted approval capabilities, retain the main-checkout storage location, and report a blocked save when no permitted route exists.
- Local work-items/AGENTS.md now keeps cross-item guidance in living project records while allowing closed work-item history to supply evidence; the prior blanket closed-record ban contradicted memory retrieval.
- GitHub date-range lookup retains the owner's date and local/Notion Current State fallback; Hindsight projects use a recorded tracker handoff/progress baseline and state the date. A question is needed only if no record establishes the requested period.

Additional exact changed files:
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md
- plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md
- plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/AGENTS.md

## Questions preserved for owner review

- Should editorial memory caps, filename/slug word limits, summary limits, and fixed review intervals remain?
- Should repeated lessons become promotion candidates based on evidence rather than an automatic two-occurrence proof threshold?
- Does every email address belong under the memory prohibition, or only sensitive personal information?
- How should the wiki's required metadata map into existing local and Notion formats without changing owner schemas blindly?
- Is the absolute prohibition on adding local header fields intended to prevent extensions, or should it preserve required fields while allowing project extras?
- Should the exact search-tool/gh-only restrictions remain where supported connectors can satisfy the same ownership and verification outcomes?
- Does the GitHub no-milestone-due-date rule protect a confirmed owner workflow? No evidence found in the read owner material; preserved pending clarification.

These pending questions did not justify removing working safeguards, schema conventions, technical limits, or approval requirements.

### Additional inventory: plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md
```diff
--- before
+++ after
@@ -41,12 +41,11 @@

 ## In Codex

-The Codex sandbox is the closed area where Codex runs commands. It blocks the network, and it blocks the keychain where `gh` keeps the sign-in. So a `gh` call inside the sandbox fails with a network error or a sign-in error.
+Follow the active session's filesystem, network, keychain, and approval settings. A `gh` call may be allowed, require approval, or be blocked. Use a supported approval mechanism only when those settings require and permit it. Never request escalation when the session forbids it, or loosen the sandbox for the whole session.

-- Run each `gh` command on its own. Never join it to another command with `&&`, `;`, or a pipe. Writing its output to a file with `>` is fine.
-- Ask for escalated permissions (`sandbox_permissions` set to `require_escalated`) with a one-line reason, for example "Read issue #12 from GitHub." Codex then asks the owner, unless the project's Codex command rules already let `gh` run outside the sandbox.
-- Never loosen the sandbox for the whole session.
-- With approvals turned off (`codex exec`), Codex refuses the escalation. Then show the owner the exact command, ask the owner to run it in a terminal, and wait for its output.
+Run each `gh` command on its own. Never join it to another command with `&&`, `;`, or a pipe. Writing its output to a file with `>` is fine.
+
+When a required call is blocked and no permitted route is available, show the owner the exact command to run in a terminal. Wait for the result before doing dependent work. Preserve the repository, sign-in, and write-verification rules in this reference.

 ## Names used in the commands

```

### Additional inventory: plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md
```diff
--- before
+++ after
@@ -2,7 +2,7 @@

 This file says where the project's own phases and its project tasks are saved on GitHub, and it gives the `gh` commands that read and change them. `references/lifecycle-rules.md`, section "Levels", says what a project phase and a project task are.

-Run each command on its own. In Codex, run each command with escalated permissions, as `work-tracker-gh-commands.md`, section "In Codex", says.
+Run each command on its own. In Codex, follow the active session permissions as `work-tracker-gh-commands.md`, section "In Codex", says.

 ## Contents

```

### Additional inventory: plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md
```diff
--- before
+++ after
@@ -2,7 +2,7 @@

 This file gives the calls that read work items from the project's issues. The calls only read. Open it when you find work items.

-Run each command on its own. In Codex, run each command with escalated permissions, as `work-tracker-gh-commands.md`, section "In Codex", says.
+Run each command on its own. In Codex, follow the active session permissions as `work-tracker-gh-commands.md`, section "In Codex", says.

 ## Contents

@@ -87,7 +87,7 @@

 ## Recently finished, and changes since a date

-`<date>` is the date that the owner names. When the owner names no date, it is the date on which the project's Current State was last changed.
+`<date>` is the date that the owner names. When the owner names no date, use the date on which the project's Current State was last changed. In a Hindsight project, which has no Current State, use a recorded handoff or progress date in the work tracker that defines the period being reviewed. State that date in the answer. When no record establishes the period, ask the owner which dates to cover.

 ```text
 gh issue list -R <repo> --state closed --limit 200 --search 'closed:>=<date>' --json number,title,stateReason,closedAt
```

### Additional inventory: plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md
```diff
--- before
+++ after
@@ -65,7 +65,7 @@
 - Skip every file with `status: template`. That file is the template, and not a memory record. The commands in `references/searching.md` skip it.
 - Never `git add` anything under `memory/`, not even with `-f`.
 - Memory is kept only in the main checkout. When this session runs in a worktree, change memory in the main checkout. Never copy memory into the worktree.
-  - In Codex, the sandbox limits where a session may write. It can block a session that runs in a worktree from writing outside that worktree. The write then asks for approval, or fails with a sandbox error. Ask the owner to approve the write. Never write the memory record into the worktree instead.
+  - When the active session blocks a write to the main checkout, use its supported approval mechanism only when approval is required and permitted. When no permitted route is available, tell the owner which save is blocked and what action is needed. Never write the memory record into the worktree instead.
 - In zsh, a `*` pattern that matches nothing stops the whole command. Use the commands in `references/searching.md` as written.

 ## Work that another skill does
```

### Additional inventory: plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md
```diff
--- before
+++ after
@@ -41,7 +41,7 @@

 ## Mistakes to avoid

-- When Claude Code or Codex blocks a write outside the session's worktree, ask the owner to approve the write. For example, the Codex sandbox, which is the closed area where Codex runs commands, asks for approval or fails with a sandbox error.
+- When the active session blocks a write to the main checkout, use its supported approval mechanism only when approval is required and permitted. When no permitted route is available, tell the owner which save is blocked and what action is needed. Keep the work item in the main checkout.
 - Every lookup command except the search by words skips `DESIGN.md` files and `work-item-template/`. Never remove the flags that make a command skip them. The commands are in `references/work-tracker-searching.md`.
 - Leave out `archive/` unless the owner asks for archived work items.
 - An edit must match the old text exactly, including the spacing of a table. When an edit fails, read the file again, because the owner may have changed the file.
```

### Additional inventory: plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/AGENTS.md
```diff
--- before
+++ after
@@ -4,7 +4,7 @@

 This guide says what each file and folder here is, the form of a work item's ID, which header fields say where a work item stands, and what must stay true in this folder.

-A work item stays in this folder after it is closed. Later work does not read a closed work item. What later work needs is in `DECISIONS.md`, `system/`, and `sources/`.
+A work item stays in this folder after it is closed. Keep knowledge that later work needs in `DECISIONS.md`, `system/`, and `sources/`, so later work can find the current project guidance. Read a closed work item when its history or evidence is needed.

 ## Files

```
