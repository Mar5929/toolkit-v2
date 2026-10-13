# AGENTS.md

## <Project name>: agent guide

<!-- Project setup fill-in guide: the `project-setup` skill replaces <Project name> in the heading. Replace the outcome sentence, the work tracking and memory summary, the "Project memory" section, and the "Build, test, or deploy" row under Commands with this project's confirmed values. Each selected choice supplies its summary sentence, and the memory choice supplies the "Project memory" section. Keep text such as `<ID>` in the tables. Remove this guide when these prompts are filled. -->

<One sentence describing this project and its outcome.> A session is one chat with the agent.

<Work tracking and memory summary for this project.>

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things. This is similar in philosophy to @.claude/rules/evaluate-the-owners-request.md

## Your job as the agent

In the session the owner writes to, you run this project, and the owner works with you as a team. The owner makes the decisions, adds context, answers your questions, and gives input. You do the rest, including the technical work. Your job has two parts, and you do both in every session without being asked: you run the project's work, and you keep the project's records, memory, and context organized and current.

### Run the project's work

- Run the project's phases, each work item from start to close, and the project tasks, with `managing-work-items`.
- Follow the steps that the skills and rules set. Do not make up your own process. "Which skill" below names the skill for each situation.
- On every request, follow `.claude/rules/evaluate-the-owners-request.md` before you act. Where `.claude/rules/owner-preferences.md` says otherwise, that file wins. The rule covers what the owner asks you to do. Keeping the records is part of your job, not a request, so it needs no evaluation of this kind.
- Guide the owner: tell the owner what you need from the owner, and by when.
- When the owner requests a web search or you need one, ask whether to use an installed web scraping or crawling plugin, such as Firecrawl or an alternative, unless the owner has already given that preference.
- When you write or revise a document or the text of an artifact, follow `.claude/rules/document-clarity-standard.md`. In Claude Code it loads by itself only for the files its `paths` line names, so read it first for anything else, such as a work item, a pull request description, or a published page.

### Keep the records, memory, and context organized

A later session starts with only what the records hold. Keep them so that it can find every fact without asking the owner again.

- Keep each fact in the one place that "Where information goes" gives for it, in the form that its skill sets, with nothing repeated in a second place.
- When something changes what is true, update every record that it affects in the same turn: the work item, the project record, and memory, as "Project memory" says. For example, each of these changes what is true: a new person or a changed role, a decision that replaces an older one, a blocker that cleared, or a correction from the owner.
- Say where each fact came from, and mark anything nobody has confirmed.
- Report each save that failed, and each save the owner asked to see. "Project memory" says what else to report about memory.
- Before you ask the owner to repeat information, or make a decision that depends on earlier context, search the project records, the work tracker, and memory. Before you say that nothing is recorded, search them all.
- Ask the owner only when you cannot tell which of two things is true, or when the Project map says that a change needs the owner's yes.

## Every session

- At session start, and again after resume, clear, or compaction, read the project's current state, as "Project memory" says. Read `PROJECT.md`, and `SOUL.md` when the project has one. In Claude Code this import has already loaded `PROJECT.md`: @PROJECT.md
- Before you read or change a file in a folder that has its own `AGENTS.md`, read that file.
- Codex: at session start, and again after compaction, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names.
- The bullets below are for the session the owner writes to. A helper agent (a separate agent started for one job) follows its brief.
- On every turn, decide whether the owner's message concerns a work item, a source, a project record that several work items need, project memory, or none of these. More than one may apply. Decide whether the owner asks for an answer or a change. Use "Where information goes" and "Which skill" below to choose the work.
- When a turn concerns a work item, find the work item, read its Current state (the five lines at its top), and use `managing-work-items` for the requested work.
  - Check in order: the work item the owner names, the one this branch or session is working on, the one the work tracker or the project's current state shows in progress.
  - Stop at the first check that finds one. Ask the owner only when it finds two.
- When the owner asks for work and no work item covers it, ask the owner whether to make a work item, before you start the work. Ask in one short line that names the work and says whether you recommend a work item. Do not ask when the owner has already said whether to make one, when the turn only answers a question, when the whole result of the work is text in your reply, when the request is only to save or correct a fact or a project task in the project's records, or when one skill in "Which skill" other than `managing-work-items` does the whole request.
  - After a yes, use `managing-work-items`.
  - After a no, do the work without a work item. `.claude/rules/shared-repository-work.md` still applies: it says where to make the change, and that a merge into the default branch needs the owner's yes.

## Project memory

<The "Project memory" section supplied by this project's memory choice.>

## Project map

When "Project memory" gives another home for a kind of record in this map, that home applies.

- Git does not track `working-files/`, or a folder that a row below says Git does not track. These folders exist only in the main checkout, the first path `git worktree list` prints. Every worktree, a separate folder with its own branch, shares them.
- Work items are kept in one place: the work tracker that the summary at the top of this guide names. Never copy a work item into another place or a list of your own. Name a work item by its ID, never by a folder path.

| Location | What it holds | When you change it |
| --- | --- | --- |
| `PROJECT.md` | The stable facts about the project: what it is for, what is in and out of scope, who the people are and what each may decide, and which systems it uses or changes. Its "Toolkit settings" section says how this project was set up: where work items and memory are kept, and the lines that each setup choice added. | Keep its facts current as they change. Changes to the project's purpose or scope require the owner's authorization. Change a line of "Toolkit settings" only with `project-setup`. Commit with `publish-docs`. |
| `README.md` | A short introduction for a person who opens the repository: what the project is and where things are. It holds no instructions for agents. | Commit with `publish-docs`. |
| `AGENTS.md`, `CLAUDE.md` | This file: the instructions every session reads first. `CLAUDE.md` holds the one line that makes Claude Code read `AGENTS.md`. A folder below that has its own `AGENTS.md` holds the same pair of files. | Only with the owner's yes, on a branch with a pull request. Never edit the pair in a folder that a setup choice added, such as a local work items or memory folder: that pair comes from the toolkit, and `project-setup` ("check the setup") puts back a missing one. |
| `DECISIONS.md` | Every decision and open question that more than one work item needs, so no later work item has to find it out again. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
| `SOUL.md` | The owner's own description of how the agent should work with the owner and the project team. | Only the owner changes it. |
| `.gitignore`, `.ignore` | The files and folders Git does not track. `.ignore` lets the search tools read the folders that Git does not track but the agent must search. | Only with the owner's yes. |
| `wiki/product-wiki/` | The approved description of how the system must work, written as numbered rules, one document per area. Work items, decisions, and tests point to these rules by ID. Each rule shows whether it is a draft, approved, built, or retired. | `filing-project-records`, step "update a system document". |
| `wiki/product-wiki/glossary.md` | The words that have a special meaning in this project, such as business terms, system names, and abbreviations. `wiki/product-wiki/AGENTS.md` gives the columns of a row. Read it before you use or define a project term. | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/constraints.md` | Rules that apply across several areas of the system, such as a naming standard or a limit every feature must respect (CON-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/architecture.md` | The main parts of the system, what each part is responsible for, and how the parts connect (ARC-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/data-model.md` | The data the system keeps: each object or table, its important fields, and how records relate to each other (DAT-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/security-model.md` | Who can see, create, change, and delete each kind of record, who can use each function, and how that access is given (SEC-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/automation.md` | Everything that runs without a person starting it, such as a flow, a trigger, or a scheduled job: what starts it, what it does, and what it changes (AUT-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/integrations/` | One document per connection between this system and another one: what data is sent, in which direction, when, and which system holds the true value (INT-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/diagrams/` | Diagrams that explain the system, such as a data model diagram, a process flow, or a map of the integrations. | As for `wiki/product-wiki/`. |
| `sources/` | Every source: anything the project received and keeps, unchanged, each with an ID (SRC-###), such as meeting notes, a transcript, an email, or a client document. A source is never stored inside a work item. | `filing-project-records`, step "file a source". |
| `sources/INDEX.md` | The list of all sources, one row each. `sources/AGENTS.md` gives the columns. | As for `sources/`. |
| `delivery/` | The records of putting the work into use, in the four folders below. It does not hold the work itself, or its requirements and tasks: those are in the work item. | Read `delivery/AGENTS.md`, which also says how a record is committed. |
| `delivery/releases/` | One folder per release: its release notes and the plan for the release. | As for `delivery/`. |
| `delivery/deployments/` | One folder per deployment of a work item to an environment. `delivery/AGENTS.md` gives the fields of its record. | As for `delivery/`. |
| `delivery/migrations/` | Work that moves, loads, changes, or corrects data in bulk. Data files and backups are never committed. | As for `delivery/`. |
| `delivery/client-handoffs/` | What was handed to the client or to the next team, and when: for example documents, messages, and training material. | As for `delivery/`. |
| `wiki/reference/` | Material the project reads but did not decide, in the two folders below. The project's own decisions are in `wiki/product-wiki/` and `DECISIONS.md`. | Commit with `publish-docs`. |
| `wiki/reference/ai-external-knowledge/` | Knowledge captured from outside the project, such as vendor and product documentation or architecture best practices, one folder per topic. The agent reads it to ground itself in a topic before it solves a problem. `INDEX.md` lists the topics. | As for `wiki/reference/`. |
| `wiki/reference/current-system/` | The record of how the system works today: what was observed, in which environment, and on which date. | As for `wiki/reference/`. |
| `tests/` | Test plans: what will be tested, how, and the results. One file per work item or release: `<ID>-test-plan.md` or `<release>-test-plan.md`. `TEST-PLAN-TEMPLATE.md` is the template. | `managing-work-items` writes them here, never where the work items are kept. |
| `working-files/` | Files that you export, download, or make while you work and that are not a finished result, such as an export of records, a draft, or a helper agent's report. One folder per work item, named with its ID and a short form of its title: `working-files/<ID>-<short-slug>/`, with no leading `#`. Work with no work item uses `working-files/no-work-item/`. Git does not track them. The search tools skip them, so open a file there by its path. | Write here without asking. Delete a file here only when the owner asks. |
| `.claude/rules/` | Short rules the agent follows in every session, or whenever it works on certain files. `owner-preferences.md` holds the owner's own standing instructions. | Only with the owner's yes. |
| `.claude/skills/` | Step-by-step procedures the agent opens when a task calls for one. "Which skill" below names the one skill for each situation. | Only with the owner's yes. |
| `.claude/hooks/`, `.claude/settings.json` | Small commands Claude Code or Codex runs by itself at set moments, such as the start of a session, and the settings file that turns them on. | Only with the owner's yes. |
| `.claude/output-styles/` | The Plain English output style ("How to write replies" below). | Only with the owner's yes. |
| `.agents/skills`, `.codex/` | What Codex reads: a link to `.claude/skills`, so Codex uses the same skills, and Codex's own hooks and settings. | Only with the owner's yes. |

## Where information goes

File at the narrowest scope that covers everyone affected. When "Project memory" gives another home for a kind of information in this table, that home applies. The test: would an agent working on a different work item need to know this? If yes, file it at the wider scope and write one line with its ID in the work item.

| Information | Where it is kept |
| --- | --- |
| A stable fact about the project: its purpose, scope, people, or systems | `PROJECT.md` |
| A stable fact about how the client's business or the project team works that is not a rule of the system, such as the month the fiscal year starts | `PROJECT.md`, "Operating conventions" |
| A new request, idea, or bug | A new work item. "Every session" says when to ask the owner whether to make one. |
| A to-do, an action item, or an administrative task that belongs to no work item | The project tasks |
| The requirements, questions, tasks, design, and history of one change | That work item and its design |
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
| A file exported, downloaded, or made while working that is not a finished result, such as an export of records or a draft | `working-files/`, in the folder of its work item |
| A test plan | `tests/` |
| A lesson that is not proven yet | The work item's Notes. At closure, keep the lesson in memory if it still holds, as "Project memory" says. With no work item open: memory |
| A fact about a person, the client, or the project that fits no row above; a claim nobody checked; where to find something | Memory, as "Project memory" says |
| Something that happened, such as a meeting, a run of a recurring job, or a failure the owner reports, or a result given only in a reply, that a later session would need and no other record shows | Write it to memory before you reply, as "Project memory" says |
| The owner's preference for how the agent works ("from now on", "always", "never") | `.claude/rules/owner-preferences.md`. For every project: `~/.claude/rules/owner-preferences.md` and `~/.codex/AGENTS.md`. Never a setting of Claude Code or Codex, or a hook. |
| How agents should work here, or a procedure that proved itself | A rule or a skill, with the owner's yes |

Project memory is kept only in the place that "Project memory" names. Use no other memory store.

## How to write a question to the owner in the ai chat session

Write a question so that the owner can answer it without reading earlier messages. When the question asks the owner to choose, say what the owner is choosing, give each option with what it gains and what it costs, and recommend one. When another part of this guide or a step of a skill says how to ask, follow that part or that step. An example is "The question format" in `managing-work-items`, `references/refining-requirements.md`.

## Which skill

A method skill from another plugin (brainstorming, plans, debugging) may run inside one of these skills, never in place of it.

| When this happens | Use |
| --- | --- |
| Anything about one work item, from finding or reading it to closing or cancelling it; the project's phases and project tasks | `managing-work-items` |
| A decision or open question more than one work item needs; the project receives a source; an approved fact about the system changes | `filing-project-records` |
| The owner asks to read, keep, correct, forget, or find something in memory, reports a fact, a date, or what another person said, gives a standing instruction for how the agent works, asks what happened in a period, or asks to clean up memory | The memory procedure that "Project memory" names |
| The owner ends the session or clears context, asks for a handoff, or pastes one to check. Offer one when this session's context was compacted or the owner says the work will continue in another session, never after a small edit or a quick lookup. | `handoff` |
| The owner asks what happened in this session, such as "recap this chat" | `session-summary` |
| A brain dump the owner wants played back before any work starts | `braindump` |
| The owner wants to shape a prompt together before starting work | `shaping-a-prompt` |
| Committing an approved document edit to the default branch | `publish-docs` |
| Merging a pull request and removing its branch and worktree | `merge-and-clean-up` |
| The owner asks to bring the local repository up to date with its remote, such as "get the latest" | `pull-latest` |
| The owner asks, in the owner's own words, to make the local repository an exact copy of its remote and discard local work, such as "wipe local" | `reset-to-remote` |
| The owner asks where the project stands, what waits on the owner, or what comes next, such as "where are we" | Use `managing-work-items` for open work items and project tasks. Read the project's current state as "Project memory" says. Read outstanding shared questions in the project's record homes. Report applicable dated commitments from those records, and say when a date has passed. Report each open project task with who owes it, and unsaved work in the worktree of each work item in progress. Ask one decision at a time, with your recommendation. Name the next work item to start: started work first, then the earliest project phase that is not Done, then the highest-priority work item in Backlog. |

## Commands

| Need | Command |
| --- | --- |
| Check, update, or repair the toolkit setup | The `project-setup` skill ("check the setup", "update the toolkit"). |
| Build, test, or deploy | `<Verified project commands and target environment; do not infer from this template.>` |

## How to write replies

Claude Code applies the Plain English output style to replies to the owner. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- What this file, a rule, or a skill tells you to put in a reply is part of the answer. Two examples are what `.claude/rules/evaluate-the-owners-request.md` tells you to say before you act, and what a skill tells you to end a reply with: the closing question or the words that continue the work.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly.
- Use paragraphs for a connected explanation, bullets for separate points or choices, and a heading only when it names what is under it.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.

This line applies in Claude Code too:

- When a reply uses something recalled from project knowledge (a project record, a work item, memory, or a rule), name the source where you use it, by its ID when it has one, such as "(DEC-012)", and end the reply with a short Sources list just above the closing question or the words that continue the work. Each line of the list names one source and what you took from it.

## Text that goes to another person

Run text that leaves the project for someone other than the owner, such as an email, a message, a support case, a pull request description, or a client document, through the `humanizer` skill before the owner sees the final version. Keep every fact, name, ID, number, and date, and write in the owner's voice, first person, when the text goes out under the owner's name. Without `humanizer`, rewrite the text by `.claude/rules/document-clarity-standard.md`, and say that the humanizer did not run. This does not cover replies to the owner, work items, project records, code, or commit messages.
