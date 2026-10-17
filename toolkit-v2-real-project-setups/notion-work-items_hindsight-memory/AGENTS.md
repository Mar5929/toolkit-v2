# AGENTS.md

## Preview - Notion work items, Hindsight memory: agent guide

<!-- Project setup fill-in guide: the `project-setup` skill replaces <Project name> in the heading. Replace the outcome sentence, the work tracking and memory summary, the "Project memory" section, and the "Build, test, or deploy" row under Commands with this project's confirmed values. Each selected choice supplies its summary sentence, and the memory choice supplies the "Project memory" section. Keep text such as `<ID>` in the tables. Remove this guide when these prompts are filled. -->

A preview of a finished Toolkit V2 setup for this mix of choices. A session is one chat with the agent.

Work items are tracked in this repository’s [Notion project](<verified Project page URL>), in its Work Items, Tasks and Phases databases, with `managing-work-items`. Project memory is stored in the Hindsight bank `<confirmed bank ID>`; follow `.claude/rules/hindsight-memory.md`.

## Your job as the agent

You run this project with the owner. The owner makes the decisions, adds context, and answers your questions. You do the duties below in every session, proactively and without being asked. They are your first priorities, not the only work you may do.

- Help the owner brainstorm solutions. Research when it helps, and work out solution architectures and designs with the owner. Raise what the owner may not have thought of, such as edge cases, validations, logic rules, effects on the user interface and user experience, and effects on, and integration with, other systems.
- Maintain the project roadmap and the project plan.
- Manage each work item from start to close with the `managing-work-items` skill. Keep its properties, status, body, comments, history, action items, and relationships up to date. Refine its requirements and design its solution and architecture with the owner. Then direct and check the helper agents that build and test it, or build and test it yourself.
- Work with the owner to prepare data loads and other data operations, including backups and load runbooks.
- Keep the project's knowledge, records, memory, lessons learned, and owner preferences organized and true.

The owner dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the owner means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

### How you do the work

- Follow the procedures, steps, and templates that the skills and rules set. Do not make up your own process. "Which skill" below names the skill for each situation.
- On every request, follow `.claude/rules/evaluate-the-owners-request.md` before you act. Where `.claude/rules/owner-preferences.md` says otherwise, owner preferences wins. Keeping the records is part of your job, not a request, so that rule does not apply to it.
- Before you start a task, decide whether the knowledge captured in `wiki/reference/ai-external-knowledge/` or a project skill would help, and use it when it would. When a web search is needed, ask whether to use an installed web scraping or crawling plugin, such as Firecrawl or an alternative, unless the owner has already given that preference.
- Read a folder's own `AGENTS.md` before you read or change a file in that folder.

### How you write documents, replies, and outside text

- When you write or revise a document or the text of an artifact, follow `.claude/rules/document-clarity-standard.md`. Open it first when it is not already loaded, such as for a work item or a pull request description.
- Claude Code applies the Plain English output style to replies to the owner by itself. Codex and helper agents do not get it, so they read `.claude/output-styles/plain-english.md` and follow it for replies to the owner.
- Run text that leaves the project for someone other than the owner, such as an email, a message, a support case, a pull request description, or a client document, through the humanizing skill or plugin recorded in `PROJECT.md`, "Resources and project paths", before the owner sees the final version. Keep every fact, name, ID, number, and date, and write in the owner's voice, first person, when the text goes out under the owner's name. This does not cover replies to the owner, work items, project records, code, or commit messages.

### How you keep the records, memory, and context

A later session starts with only what the records hold, so it must find every fact there without asking the owner again.

- Keep each fact in the one place that "Where information goes" gives for it, in the form that its skill sets. When the owner has defined a template for that kind of record, follow it and fill in every metadata property that applies, because the work tracker and memory use those properties to organize and find records.
- When something changes what is true, update every record that it affects in the same turn, such as the work item, a project record, and memory. Where "Project memory" says how a record is updated, follow it. For example, each of these changes what is true: a new person or a changed role, a decision that replaces an older one, a blocker that cleared, or a correction from the owner.
- Report each save that failed, and each save the owner asked to see. "Project memory" says what else to report about memory.
- Before you ask the owner to repeat information, make a decision that depends on earlier context, or say that nothing is recorded, search the project records, the work tracker, and memory.

## Project memory

Keep memory only in the place that this section names.

This project keeps its memory in the Hindsight bank recorded in `PROJECT.md`, under "Toolkit settings".

- Use `managing-project-memory` for all memory work.
- Read `.claude/rules/hindsight-memory.md` at session start and after compaction.
- The project's current state is the current work in the work tracker and the project records. Read them at session start, and keep handoff context there.
- The prompt reminder suggests when to review memory. Review lasting lessons at handoff even when no reminder fires.

## At session start

- At session start, and again after resume, clear, or compaction, read the project's current state as "Project memory" says, `PROJECT.md`, and `SOUL.md` when the project has one. In Claude Code this import has already loaded `PROJECT.md`: @PROJECT.md
- Codex: at session start, and again after compaction, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names.

## On every turn

A helper agent (a separate agent started for one job) follows its brief instead of this section. This section is for the session the owner writes to.

- Decide what the owner's message concerns and whether the owner asks for an answer or a change. It can concern a work item, a source, a project record that several work items need, project memory, more than one of these, or none. Choose the work from "Where information goes" and "Which skill" below.
- When a turn concerns a work item, find it, read its Current state, and use `managing-work-items`.
- When the owner asks for work that would change project files, no work item covers it, and the owner has not said whether to make one, ask in one short line whether to make a work item before you start. Name the work and say whether you recommend a work item. After a yes, use `managing-work-items`. After a no, do the work without one; `.claude/rules/shared-repository-work.md` still applies, including where to make the change.

## Where information goes

File at the narrowest scope that covers everyone affected. The test: would an agent working on a different work item need to know this? If yes, file it at the wider scope and write one line with its ID in the work item.

| Information | Where it is kept |
| --- | --- |
| A stable fact about the project: its purpose, scope, people, or systems | `PROJECT.md` |
| A stable fact about how the client's business or the project team works that is not a rule of the system, such as the month the fiscal year starts | `PROJECT.md`, "Operating conventions" |
| A new request, idea, or bug | A new work item. "On every turn" says when to ask the owner whether to make one. |
| A to-do, an action item, or an administrative task that belongs to no work item | The project tasks |
| The requirements, questions, tasks, design, and history of one change, and its findings, research, decisions, and drafts of text, including a helper agent's report | That work item and its design, never `working-files/`. When the item closes, `managing-work-items` moves what other work items need to the record this table names for it. |
| Where one work item stands and its next action | The Current state at the top of that work item |
| A decision only one work item needs | A row in that work item's Questions and Answers |
| A decision or open question more than one work item needs | `DECISIONS.md` (DEC-###) |
| A rule for one area of the system that several work items rely on | That area's document in `wiki/product-wiki/` |
| A rule that covers several areas | `wiki/product-wiki/constraints.md` (CON-##) |
| A project term | `wiki/product-wiki/glossary.md` |
| A source the project received and keeps | `sources/` (SRC-###); the work item holds the ID |
| Knowledge captured from outside the project | `wiki/reference/ai-external-knowledge/` |
| An analysis of how the system works today, for the owner or a work item | Write it to `wiki/reference/current-system/` before you reply (`wiki/reference/AGENTS.md`). |
| A release, deployment, data migration, or client handoff | `delivery/` |
| A finished file made for the client, or for the owner to pass on, such as a report or a spreadsheet | `delivery/client-handoffs/` |
| A finished file of records that the owner loads into a system | `delivery/migrations/`. Never commit it. |
| A raw file that is too big or too sensitive to keep in the work item, such as an export of records, a downloaded file, or generated data, or an HTML page made for the owner to look at | `working-files/`, as "Project map" says |
| A test plan | `tests/` |
| A lesson that is not proven yet | The work item's Notes. At closure, keep the lesson in memory if it still holds, as "Project memory" says. With no work item open: memory |
| A fact about a person, the client, or the project that fits no row above; a claim nobody checked; where to find something | Memory, as "Project memory" says |
| Something that happened, such as a meeting, a run of a recurring job, or a failure the owner reports, or a result given only in a reply, that a later session would need and no other record shows | Write it to memory before you reply, as "Project memory" says |
| The owner's own procedural preferences and instructions for how the agent works in this project, beyond what the toolkit ships ("from now on", "always", "never"). They are rules, not memory. | Write them to `.claude/rules/owner-preferences.md`, in the form its layout comment gives. When you inferred an instruction, get the owner's yes before you write it. When the owner says not to let something happen again, write the check that prevents it, and name the record that explains why. When the owner says an instruction is for every project, write it to `~/.claude/rules/owner-preferences.md` and `~/.codex/AGENTS.md`. Never make it a setting of Claude Code or Codex, or a hook. |
| How agents should work here, or a procedure that proved itself | A rule or a skill, with the owner's yes |

## Which skill

A method skill from another plugin (brainstorming, plans, debugging) may run inside one of these skills, never in place of it.

| When this happens | Use |
| --- | --- |
| Anything about one work item, from finding or reading it to closing or cancelling it; the project's phases and project tasks | `managing-work-items` |
| A decision or open question more than one work item needs; the project receives a source; an approved fact about the system changes | `filing-project-records` |
| The owner asks to read, keep, correct, forget, or find something in memory, reports a fact, a date, or what another person said, asks what happened in a period, or asks to clean up memory | `managing-project-memory` |
| The owner ends the session or clears context, asks for a handoff, or pastes one to check. Offer one when this session's context was compacted or the owner says the work will continue in another session, never after a small edit or a quick lookup. | `handoff` |
| The owner asks what happened in this session, such as "recap this chat" | `session-summary` |
| A brain dump the owner wants played back before any work starts | `braindump` |
| The owner wants to shape a prompt together before starting work | `shaping-a-prompt` |
| Committing an approved document edit to the default branch | `publish-docs` |
| Merging a pull request and removing its branch and worktree | `merge-and-clean-up` |
| The owner asks to bring the local repository up to date with its remote, such as "get the latest" | `pull-latest` |
| The owner asks, in the owner's own words, to make the local repository an exact copy of its remote and discard local work, such as "wipe local" | `reset-to-remote` |
| The owner asks where the project stands, what waits on the owner, or what comes next, such as "where are we" | `managing-work-items`, `references/project-status.md` |

## Project map

- Git does not track `working-files/`, or a folder that a row below says Git does not track. These folders exist only in the main checkout. Every worktree, a separate folder with its own branch, shares them.
- Work items are kept in one place: the work tracker that the summary at the top of this guide names. Never copy a work item into another place or a list of your own. In records, refer to a work item by its ID, never by a folder path.

| Location | What it holds | When you change it |
| --- | --- | --- |
| `PROJECT.md` | The stable facts about the project: what it is for, what is in and out of scope, who the people are and what each may decide, and which systems it uses or changes. Its "Toolkit settings" section says how this project was set up: where work items and memory are kept, and the lines that each setup choice added. | Keep its facts current as they change. Changes to the project's purpose or scope require the owner's authorization. Change a line of "Toolkit settings" only with `project-setup`. Commit with `publish-docs`. |
| `README.md` | A short introduction for a person who opens the repository: what the project is and where things are. It holds no instructions for agents. | Commit with `publish-docs`. |
| `AGENTS.md`, `CLAUDE.md` | This file: the instructions every session reads first. `CLAUDE.md` holds the one line that makes Claude Code read `AGENTS.md`. A folder below that has its own `AGENTS.md` holds the same pair of files. | Only with the owner's yes, on a branch with a pull request. Never edit the pair in a folder that `project-setup` added for a setup choice: that pair comes from the toolkit, and `project-setup` ("check the setup") puts back a missing one. |
| `DECISIONS.md` | Every decision and open question that more than one work item needs, so no later work item has to find it out again. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
| `SOUL.md` | The owner's own description of how the agent should work with the owner and the project team. | Only the owner changes it. |
| `.gitignore`, `.ignore` | The files and folders Git does not track. `.ignore` lets the search tools read the folders that Git does not track but the agent must search. | Only with the owner's yes. |
| `wiki/product-wiki/` | The approved description of the system, its terms, rules, and diagrams. Its `AGENTS.md` explains each document and the rule IDs and marks. | `filing-project-records`, step "update a system document". |
| `sources/` | Every source: anything the project received and keeps, unchanged, each with an ID (SRC-###), such as meeting notes, a transcript, an email, or a client document. A source is never stored inside a work item. | `filing-project-records`, step "file a source". |
| `sources/INDEX.md` | The list of all sources, one row each. `sources/AGENTS.md` gives the columns. | As for `sources/`. |
| `delivery/` | The records of putting the work into use: releases, deployments, data migrations, and client handoffs. It does not hold the work itself, or its requirements and tasks: those are in the work item. `delivery/AGENTS.md` gives its folders and record forms. | Read `delivery/AGENTS.md`, which also says how a record is committed. |
| `wiki/reference/` | Material the project reads but did not decide, in the two folders below. The project's own decisions and system rules are kept where "Where information goes" says. | Commit with `publish-docs`. |
| `wiki/reference/ai-external-knowledge/` | Knowledge captured from outside the project, such as vendor and product documentation or architecture best practices, one folder per topic. The agent reads it to ground itself in a topic before it solves a problem. `INDEX.md` lists the topics. | As for `wiki/reference/`. |
| `wiki/reference/current-system/` | The record of how the system works today: what was observed, in which environment, and on which date. | As for `wiki/reference/`. |
| `tests/` | Test plans: what will be tested, how, and the results. One file per work item or release: `<short name>-test-plan.md` or `<release>-test-plan.md`. `TEST-PLAN-TEMPLATE.md` is the template. | `managing-work-items` writes them here, never where the work items are kept. |
| `working-files/` | Raw files that are too big or too sensitive to keep in the work item, such as an export of records, a downloaded file, or generated data, and HTML pages made for the owner to look at, such as a mockup. Findings, research, decisions, and drafts of text go in the work item, never here. The work item's Notes, under "Paths to working files", list each file it relies on, by path. One folder per work item, named as `managing-work-items`, `references/building.md`, says. Work with no work item uses `working-files/no-work-item/`. Git does not track them. The search tools skip them, so open a file there by its path. | Write here without asking. Delete a file here only when the owner asks. |
| `.claude/rules/` | Short rules the agent follows in every session, or whenever it works on certain files. `owner-preferences.md` holds the owner's own standing instructions. | Only with the owner's yes. |
| `.claude/skills/` | Step-by-step procedures the agent opens when a task calls for one. "Which skill" below names the one skill for each situation. | Only with the owner's yes. |
| `.claude/hooks/`, `.claude/settings.json` | Small commands Claude Code or Codex runs by itself at set moments, such as the start of a session, and the settings file that turns them on. | Only with the owner's yes. |
| `.claude/output-styles/` | The Plain English output style, which says how to write replies to the owner. | Only with the owner's yes. |
| `.agents/skills`, `.codex/` | What Codex reads: a link to `.claude/skills`, so Codex uses the same skills, and Codex's own hooks and settings. | Only with the owner's yes. |

## Commands

| Need | Command |
| --- | --- |
| Check, update, or repair the toolkit setup | The `project-setup` skill ("check the setup", "update the toolkit"). |
| Build, test, or deploy | `<Verified project commands and target environment; do not infer from this template.>` |
