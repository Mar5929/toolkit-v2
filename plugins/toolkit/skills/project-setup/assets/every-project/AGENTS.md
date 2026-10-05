# AGENTS.md

## <Project name>: agent guide

<!-- Project setup fill-in guide: the `project-setup` skill replaces <Project name> in the heading. Replace the outcome sentence below, and the "Build, test, or deploy" row under Commands, with this project's confirmed values. Keep text such as `<ID>` in the tables, and change nothing else. Remove this guide when both prompts are filled. -->

<One sentence describing this project and its outcome.> The owner named in `PROJECT.md` makes this project's decisions. The agent runs the project: it keeps the work items, the project's records, and memory current, and it does the technical work.

The owner dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the owner means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

## Every session

- The session-start hook adds Current State to your context. If it is missing, read it yourself. With local or Hindsight memory it is `memory/CURRENT_STATE.md` in the main checkout. With Notion memory it is the "Current state" page; read it with `using-memory-store`.
- Read `PROJECT.md`, and `SOUL.md` when the project has one. Read them again after resume, clear, or compaction.
- Before you change a file in a folder that has its own `AGENTS.md`, read that file.
- Codex: at session start, and again after compaction, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names.
- The next two lines are for the main conversation. A helper agent follows its brief.
- When a message continues a work item, find the item (the one the owner names; else the one this branch or chat is working on; else the one Current State names), read its Current state, and do its Next action with `running-work-item-lifecycle`. If two items fit, ask the owner which.
- When the owner asks a question, answer it. Do not take the next step of a work item in place of an answer.

## Project map

- A row marked "local work items", "local memory", "Hindsight memory", "Salesforce", or "optional" is present only in a project set up that way.
- Git does not track `work-items/` and `memory/`. They exist only in the main checkout, the first path `git worktree list` prints. Every worktree shares them.
- Work items are kept in one tracker: local files, Notion, or GitHub Issues. Never copy an item into a second tracker or a list of your own. Name a work item by its ID, never by a folder path.

| Location | What it holds | When you change it |
| --- | --- | --- |
| `PROJECT.md` | The stable facts about the project: what it is for, what is in and out of scope, who the people are and what each may decide, and which systems it uses or changes. Its "Toolkit settings" section says how this project was set up: where work items and memory are kept, the work item ID prefix, and links. | Ask the owner first. Save with `publish-docs`. |
| `PROJECT-ROADMAP.md` (local work items) | The plan at project level: the project's phases in order, and the top-level work items that belong to each phase. | `running-work-item-lifecycle` decides the change. |
| `README.md` | A short introduction for a person who opens the repository: what the project is and where things are. It holds no instructions for agents. | Save with `publish-docs`. |
| `AGENTS.md`, `CLAUDE.md` | This guide: the instructions every agent session reads first. `CLAUDE.md` holds the one line that makes Claude Code read `AGENTS.md`. Each folder guide named below is the same pair of files inside its folder. | Only with the owner's yes, on a branch with a pull request. Never edit the guides in `work-items/` and `memory/`: they come from the toolkit, and `project-setup` ("check the setup") puts back a missing one. |
| `DECISIONS.md` | Every decision and open question that more than one work item needs, so no later work item has to find it out again. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
| `SOUL.md` (optional) | The owner's own description of how the agent should work with the owner and the project team. | Only the owner changes it. |
| `.gitignore` | The list of files and folders Git does not track, such as `work-items/` and `memory/`. | Only with the owner's yes. |
| `work-items/` (local work items) | The work tracker, when work items are kept as local files: one folder per work item. A work item is one piece of work, such as a feature, a fix, or a change, from idea to Done. An item is kept after it closes, but later work does not read it: what later work needs moves to `system/` and `DECISIONS.md` when the item closes. | Read `work-items/AGENTS.md`. Use `using-work-tracker` for every read and save. |
| `work-items/<ID>-<short-slug>/<ID>.md` (local work items) | One work item's record: its goal, requirements, questions and answers, tasks, current state, and history. | `running-work-item-lifecycle`. |
| `work-items/<ID>-<short-slug>/DESIGN.md` (local work items) | The solution design for that one work item: the options considered and the approach the owner approved. | `running-work-item-lifecycle`. |
| `work-items/PROJECT-TASKS.md` (local work items) | Administrative tasks for the project that belong to no work item, such as giving a person access. | `running-work-item-lifecycle`. |
| `work-items/work-item-template/` (local work items) | The blank forms that are copied to start a new work item and its design. | Never edit; they come from the toolkit. |
| `memory/` (local memory, Hindsight memory) | What a new session needs to continue where the last one stopped. Local memory: Current State, and pointers (an ID and a link to a record). It never holds a second copy of a fact. Hindsight memory: only `CURRENT_STATE.md`. | Local memory: read `memory/AGENTS.md` and use `curating-project-memory`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| `memory/CURRENT_STATE.md` (local memory, Hindsight memory) | One short page: which work items are in progress, what waits on the owner, and where the next session starts. | Local memory: `using-memory-store` makes the write. Hindsight memory: as for `memory/`. |
| `memory/MEMORY.md` (local memory) | The table of pointers: one row per record a later session may need to find again, with its ID, a link, and the dates it was created and last changed. The session-start hook prints it. | `using-memory-store` makes the write. |
| `system/` | The approved description of how the system must work, written as numbered rules, one document per area. Work items, decisions, and tests point to these rules by ID. Each rule shows whether it is a draft, approved, built, or retired. | Read `system/AGENTS.md`. Use `filing-project-records`, step "update a system document". |
| `system/glossary.md` | The words that have a special meaning in this project, such as business terms, system names, and abbreviations. Each has its meaning here, where that meaning came from, and any word it is often confused with. Read it before you use or define a project term. | As for `system/`. |
| `system/constraints.md` | Rules that apply across several areas of the system, such as a naming standard or a limit every feature must respect (CON-##). | As for `system/`. |
| `system/architecture.md` | The main parts of the system, what each part is responsible for, and how the parts connect (ARC-##). | As for `system/`. |
| `system/data-model.md` | The data the system keeps: each object or table, its important fields, and how records relate to each other (DAT-##). | As for `system/`. |
| `system/security-model.md` | Who can see, create, change, and delete each kind of record, who can use each function, and how that access is given (SEC-##). | As for `system/`. |
| `system/automation.md` | Everything that runs without a person starting it, such as a flow, a trigger, or a scheduled job: what starts it, what it does, and what it changes (AUT-##). | As for `system/`. |
| `system/integrations/` | One document per connection between this system and another one: what data is sent, in which direction, when, and which system holds the true value (INT-##). `README.md` lists them; `INTEGRATION-TEMPLATE.md` is the blank form. | As for `system/`. |
| `system/diagrams/` | Diagrams that explain the system, such as a data model diagram, a process flow, or a map of the integrations. Each is linked from the `system/` document it explains. | As for `system/`. |
| `sources/` | Every original the project received and keeps, unchanged, each with an ID (SRC-###): for example meeting notes, transcripts, emails, and client documents. Other records point to a source by its ID. An original is never stored inside a work item. | Read `sources/AGENTS.md`. Use `filing-project-records`, step "file a source". |
| `sources/README.md` | The list of all sources, one row each: its ID, the date received, who it came from, what it is, where it is kept, and which work items used it. | As for `sources/`. |
| `delivery/` | The records of putting the work into use: releases, deployments to an environment, data migrations, and what was handed to the client or the next team. It does not hold the work itself, or its requirements and tasks: those are in the work item. | Read `delivery/AGENTS.md`, which also says how a record is committed. |
| `delivery/releases/` | One folder per release: what the release contains, its release notes, and the plan for the release. | As for `delivery/`. |
| `delivery/deployments/` | One folder per deployment of a work item to an environment: what was deployed, where, when, the result, and any manual steps. Salesforce: also the component tracker and the package files. | As for `delivery/`. |
| `delivery/migrations/` | Work that moves, loads, changes, or corrects data in bulk: the mapping, the transformation rules, and the record of each run. Data files and backups are never committed. | As for `delivery/`. |
| `delivery/client-handoffs/` | What was handed to the client or to the next team, and when: for example documents, messages, and training material. | As for `delivery/`. |
| `reference/` | Material the project reads but did not decide: documentation from vendors and products, and the record of how the existing system works today. The project's own decisions are in `system/` and `DECISIONS.md`. | Read `reference/AGENTS.md`. Save with `publish-docs`. |
| `reference/outside-docs/` | Documentation captured from outside the project, such as vendor and product documentation, one folder per topic. `INDEX.md` lists the topics. | As for `reference/`. |
| `reference/current-system/` | The record of how the system works today: what was observed, in which environment, and on which date. | As for `reference/`. |
| `tests/` | Test plans: what will be tested, how, and the results. One file per work item or release: `<ID>-test-plan.md` or `<release>-test-plan.md`. `TEST-PLAN-TEMPLATE.md` is the blank form. | `running-work-item-lifecycle` writes them here, never in the work tracker. |
| `force-app/`, `sfdx-project.json`, `.forceignore` (Salesforce) | The Salesforce metadata this project builds and deploys, in `force-app/`, and the two files that tell Salesforce tools how to treat this repository. `force-app/` is made when the first metadata is added. | The Salesforce rules in `.claude/rules/`; `sf-component-tracker` before building. An official Salesforce plugin with skills and tools for designing and building in Salesforce is installed: use them, as `.claude/rules/salesforce-project.md` says. |
| `tools/` (Salesforce) | Scripts for Salesforce work. `tools/kb/` lists which parts of the org read and write each other, to show what a change affects. `tools/permissions/` holds the tool that keeps permission sets in Git. | `.claude/rules/salesforce-project.md` says where each command is. |
| `.claude/rules/` | Short rules the agent follows in every session, or whenever it works on certain files. `owner-preferences.md` holds the owner's own standing instructions. | Only with the owner's yes. |
| `.claude/skills/` | Step-by-step procedures the agent opens when a task calls for one. "Which skill" below names the one skill for each situation. | Only with the owner's yes. |
| `.claude/hooks/`, `.claude/settings.json` | Small commands the agent's app runs by itself at set moments, such as the start of a session, and the settings file that turns them on. Salesforce: also the two org guards and `.claude/protected-orgs.json`, the orgs they protect. | Only with the owner's yes. |
| `.githooks/pre-commit` | The command Git runs before each commit. It runs `.claude/hooks/validate-records.mjs`, which checks the form of the records in `DECISIONS.md`, `system/`, and `sources/`. | Only with the owner's yes. |
| `.claude/output-styles/` | The Plain English style that Claude Code applies to chat replies. | Only with the owner's yes. |
| `.agents/skills`, `.codex/` | What Codex reads: a link to `.claude/skills`, so Codex uses the same skills, and Codex's own hooks and settings. | Only with the owner's yes. |

## Where information goes

File at the narrowest scope that covers everyone affected. The test: would an agent working on a different work item need to know this? If yes, file it in the wider home and leave a one-line pointer with its ID in the item.

| Information | Home |
| --- | --- |
| A stable fact about the project: its purpose, scope, people, or systems | `PROJECT.md` |
| A stable fact about how the client's business or the project team works that is not a rule of the system, such as the month the fiscal year starts | `PROJECT.md`, "Operating conventions" |
| A new request, idea, or bug | A new work item |
| An administrative task for the project that belongs to no work item | The project's tasks |
| The requirements, questions, tasks, design, and history of one change | That work item and its design |
| Where one work item stands and its next action | The Current state block at the top of that item |
| A decision only one work item needs | A row in that item's Questions and Answers |
| A decision or open question more than one work item needs | `DECISIONS.md` (DEC-###) |
| A rule for one area of the system that several items rely on | That area's document in `system/` |
| A rule that covers several areas | `system/constraints.md` (CON-##) |
| A project term | `system/glossary.md` |
| An original the project received and keeps | `sources/` (SRC-###); the item holds the ID |
| Outside documentation, or a record of the system as it is today | `reference/` |
| A release, deployment, data migration, or client handoff | `delivery/` |
| A test plan | `tests/` |
| A lesson that is not proven yet | The work item's Notes; the closing step decides whether it moves up |
| Where work stopped and where the next session starts | Current State, as IDs and links only |
| A pointer a later session needs to find a record again | Local or Notion memory: `curating-project-memory`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| The owner's preference for how the agent works ("from now on", "always", "never") | `.claude/rules/owner-preferences.md`. For every project: `~/.claude/rules/owner-preferences.md` and `~/.codex/AGENTS.md`. Never a host setting or a hook. |
| How agents should work here, or a procedure that proved itself | A rule or a skill, with the owner's yes |

To find what was decided before, read `DECISIONS.md`, then `system/`, then the work item.

## Ask the owner first

Ask the owner, and record the answer, before you:

- take a work item approval step (`running-work-item-lifecycle`, "The owner's OK");
- do anything that cannot be undone, spend money, sign in, or change an account.

## Which skill

A method skill from another plugin (brainstorming, plans, debugging) may run inside one of these skills, never in place of it.

| When this happens | Use |
| --- | --- |
| Anything about one work item, from a new idea to Done, including closing or cancelling it; the project's phases and project tasks | `running-work-item-lifecycle` |
| Reading or saving a work item's record; moving, nesting, or archiving items | `using-work-tracker` |
| A decision or question reaches past one work item; an original arrives; an approved fact about the system changes | `filing-project-records` |
| The owner asks to keep, correct, or forget something, gives a standing instruction for how the agent works, or asks to tidy memory, such as "remember this" | `curating-project-memory`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| Reading or writing Current State or a pointer | `using-memory-store`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| The owner ends the session or clears context, or pastes a handoff to check | `handoff` |
| The owner asks what happened in this chat, such as "recap this chat" | `session-summary` |
| A brain dump the owner wants played back before any work starts | `braindump` |
| The owner finds an answer too technical or hard to follow, such as "explain that simply" | `explain-simply` |
| Saving an approved document edit to the default branch | `publish-docs` |
| Merging a pull request and removing its branch and worktree | `merge-and-clean-up` |
| The owner asks to bring the local repository up to date with its remote, such as "get the latest" | `pull-latest` |
| The owner asks, in the owner's own words, to make the local repository an exact copy of its remote and discard local work, such as "wipe local" | `reset-to-remote` |
| Salesforce metadata changes, a production data change, or a deploy to a shared org (Salesforce) | `sf-component-tracker`, `sf-data-change`, `sf-deploy-check`. The Salesforce rules say when to open each. |
| The owner asks where the project stands, what waits on the owner, or what comes next, such as "where are we" | No skill: read Current State, the open work items, and the Open entries in `DECISIONS.md`. Ask one decision at a time, with your recommendation. The next item to start: started work first, then the earliest project phase that is not Done, then the highest-priority Backlog item. |

Never save project memory in Claude Code's or Codex's own memory feature, or in another plugin's, other than the memory system named under "Toolkit settings" in `PROJECT.md`.

## Commands

| Need | Command |
| --- | --- |
| Check, update, or repair the toolkit setup | The `project-setup` skill ("check the setup", "update the toolkit"). |
| Build, test, or deploy | `<Verified project commands and target environment; do not infer from this template.>` |
| Check Salesforce impact or permission sets, or validate against the sandbox (Salesforce) | `.claude/rules/salesforce-project.md` |

## How to write replies

Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly.
- Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
- When asking for a decision, name the choice and the difference that matters, and recommend one.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.
