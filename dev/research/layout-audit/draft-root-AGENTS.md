Always execute work with the context in mind that the user will likely continue work across multiple AI coding sessions where the session context is cleared and picked up again. You must assist the user in helping establish that continuity across sessions while not adding context that might pollute future agents and skew them. Information must be curated and intentional.

# <Project name>: agent guide

<One sentence describing this project and its outcome.> The owner named in `PROJECT.md` makes this project's decisions. The agent runs the project: it keeps the work items, the project's records, and memory current, and it does the technical work.

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

## Every session

- The session-start hook adds Current State to your context: what is in progress, what waits on the owner, and where the next session starts. If it is missing, read it: "Toolkit settings" in `PROJECT.md` says where memory is kept.
- Read `PROJECT.md`, and `SOUL.md` when the project has one. Read them again after resume, clear, or compaction.
- Before you change a file in a folder that has its own `AGENTS.md`, read that file.
- Codex: at session start, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names.
- When a message continues a work item, find the item (the one the owner names; else the one this branch or chat is working on; else the one Current State names), read its Current state, and do its Next action with `running-work-item-lifecycle`.
- When the owner asks a question, answer it. Do not take the next step of a work item in place of an answer.

## Project map

Every folder and file, what it holds, and what to follow when you change it. A row marked "local work items", "local memory", or "Salesforce" is present only in a project set up that way; "Toolkit settings" in `PROJECT.md` lists this project's choices.

| Location | What it holds | When you change it |
| --- | --- | --- |
| `PROJECT.md` | What the project is for, its scope, its people, its systems, and "Toolkit settings": the setup choices, the ID prefix, and links. | Ask the owner first. Save with `publish-docs`. |
| `PROJECT-ROADMAP.md` (local work items) | The project's phases and the top-level work items in each. | `running-work-item-lifecycle` decides the change. |
| `README.md` | A short introduction for a person who opens the folder. | Save with `publish-docs`. |
| `AGENTS.md`, `CLAUDE.md` | This guide, and the one line that makes Claude Code read it. | Only with the owner's yes. |
| `DECISIONS.md` | Every decision and open question that affects more than one work item. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
| `SOUL.md` (when the owner chose one) | How the owner wants the agent to work with him. | Only the owner changes it. |
| `work-items/` (local work items) | Temporary work: one folder per work item. Git does not track it. | Read `work-items/AGENTS.md`. Use `using-work-tracker` for every read and save. |
| `work-items/<ID>-<name>/<ID>.md` | One work item: its requirements, its own decisions, its tasks, and its history. | `running-work-item-lifecycle`. |
| `work-items/<ID>-<name>/DESIGN.md` | The design for that one work item. | `running-work-item-lifecycle`. |
| `work-items/PROJECT-TASKS.md` | Chores for the project that belong to no work item. | `running-work-item-lifecycle`. |
| `work-items/work-item-template/` | The forms copied to start a new work item. | Never edit; they come from the toolkit. |
| `memory/` (local memory) | Where work stopped, and pointers: an ID and a link. Never a second copy of a fact. Git does not track it. | Read `memory/AGENTS.md`. Use `curating-project-memory`. |
| `memory/CURRENT_STATE.md` | What is in progress, what waits on the owner, and where the next session starts. | `using-memory-store` makes the write. |
| `memory/MEMORY.md` | The list of pointers. The session-start hook writes it. | Never edit it. |
| `system/` | The approved description of the system. Every document has a Status line, numbered rules, open questions that link to `DECISIONS.md`, and a changelog. | Read `system/AGENTS.md`. Use `filing-project-records`, step "update a system document". |
| `system/glossary.md` | The project's terms and what each means. | Same. Never infer a definition. |
| `system/constraints.md` | Rules that cover several areas of the system (CON-##). | Same. |
| `system/architecture.md` | The main parts of the system and how they connect (ARC-##). | Same. |
| `system/data-model.md` | The objects, the fields, and how records relate (DAT-##). | Same. |
| `system/security-model.md` | Who can see and change what (SEC-##). | Same. |
| `system/automation.md` | What runs by itself: flows, triggers, scheduled jobs (AUT-##). | Same. |
| `system/integrations/` | One document per connection to another system (INT-##). | Same. |
| `system/diagrams/` | Pictures of the system. | Same. |
| `sources/` | Every original the project keeps (SRC-###): meeting notes, transcripts, emails, client documents. Never stored inside a work item. | Read `sources/AGENTS.md`. Use `filing-project-records`, step "file a source". Never edit a filed original. |
| `delivery/` | What goes out of the project. | Read `delivery/AGENTS.md`. |
| `delivery/releases/` | Release notes and go-live plans. | Start from the template folder when there is one. |
| `delivery/deployments/` | One record per deployment. In a Salesforce project also the component tracker and the package files. | Salesforce: `sf-component-tracker`. |
| `delivery/migrations/` | Moving data from an old system into the new one. Load files and backups are never committed. | Salesforce production data: `sf-data-change`. |
| `delivery/client-handoffs/` | What was given to the client or the next team. | |
| `reference/outside-docs/` | Vendor and product documentation captured from outside. | Read `reference/AGENTS.md`. Never edit a captured page. |
| `reference/current-system/` | What exists today, before this project's changes, with the date it was observed. | Read `reference/AGENTS.md`. |
| `tests/` | Test plans, one file per work item or release. | `running-work-item-lifecycle` writes them. |
| `force-app/`, `sfdx-project.json`, `.forceignore` (Salesforce) | The Salesforce source and its project settings. | The Salesforce rules in `.claude/rules/`; `sf-component-tracker` before building. |
| `tools/` (Salesforce) | Scripts that list what connects to what in the org, and permission set tools. | See "Commands". |
| `.claude/rules/` | Short rules the agent always follows. | Only with the owner's yes. |
| `.claude/skills/` | The procedures named in "Which skill" below. | Only with the owner's yes. |
| `.claude/hooks/`, `.claude/settings.json` | The small commands that run by themselves, and the settings that turn them on. | Only with the owner's yes. |
| `.agents/skills`, `.codex/` | The link that lets Codex read the same skills, and Codex's hooks and settings. | Only with the owner's yes. |

## Where information goes

File at the narrowest scope that covers everyone affected. The test: would an agent working on a different work item need to know this? If yes, file it in the wider home and leave a one-line pointer with its ID in the item.

| Information | Home |
| --- | --- |
| A new request, idea, or bug | A new work item |
| A chore for the project that belongs to no work item | The project's tasks |
| The requirements, questions, tasks, design, and history of one change | That work item and its design |
| Where one work item stands and its next action | The Current state block at the top of that item |
| A decision only one work item needs | A row in that item's Questions and Answers |
| A decision or open question more than one work item needs | `DECISIONS.md` (DEC-###), with a pointer in each item |
| A rule for one area of the system that several items rely on | That area's document in `system/` |
| A rule that covers several areas | `system/constraints.md` (CON-##) |
| A project term | `system/glossary.md` |
| An original the project received and keeps | `sources/` (SRC-###); the item holds the ID |
| Outside documentation, or a record of the system as it is today | `reference/` |
| A release, deployment, data migration, or client handoff | `delivery/` |
| A test plan | `tests/` |
| A lesson that is not proven yet | The work item's Notes; the closing step decides whether it moves up |
| Where work stopped and where the next session starts | Current State, as IDs and links only |
| The owner's preference for how the agent works ("from now on", "always", "never") | `.claude/rules/owner-preferences.md` |
| How agents should work here, or a procedure that proved itself | A rule or a skill, with the owner's yes |

To find what was decided before, read `DECISIONS.md`, then `system/`, then the work item.

## What the owner decides

Ask the owner and record the answer before you:

- take a work item approval step (`running-work-item-lifecycle`, "The owner's OK");
- do anything that cannot be undone, spend money, sign in, or change an account.

Do everything else yourself, record it, and report it. When you need a decision, add a row to the work item's Questions and Answers with "Decision needed from: owner", mark the item as waiting on the owner, and record his answer in that row as soon as he gives it. Give every choice or recommendation you show the owner a one-line reason.

## Which skill

One skill owns each moment. This list stays in your context after compaction.

| When this happens | Use |
| --- | --- |
| Anything about one work item, from a new idea to Done, including closing or cancelling it; the project's phases and project tasks | `running-work-item-lifecycle` |
| Reading or saving a work item's record; moving, nesting, or archiving items | `using-work-tracker` |
| A decision or question reaches past one work item; an original arrives; an approved fact about the system changes | `filing-project-records` |
| "Remember this", "forget that", "from now on", "clean up memory" | `curating-project-memory` |
| Reading or writing Current State or a pointer | `using-memory-store` |
| The owner ends the session or clears context, or pastes a handoff to check | `handoff` |
| "Recap this chat", "what did I ask for" | `session-summary` |
| A brain dump the owner wants played back before any work starts | `braindump` |
| "Simpler", "explain that simply" | `explain-simply` |
| Saving an approved document edit to the default branch | `publish-docs` |
| Merging a pull request and removing its branch and worktree | `merge-and-clean-up` |
| "Get the latest" | `pull-latest` |
| The owner's own words: "wipe local", "match the remote exactly" | `reset-to-remote` |
| "Where are we", "what do you need from me", "what's next" | No skill: read Current State, the open work items, and the Open entries in `DECISIONS.md`. Ask one decision at a time, with your recommendation. |

Never save project memory in Claude Code's or Codex's own memory feature, or another plugin's.

## Commands

| Need | Command |
| --- | --- |
| Check, update, or repair the toolkit setup | The `project-setup` skill ("check the setup", "update the toolkit"). |
| Build, test, or deploy | `<Verified project commands and target environment.>` |

## How to write replies

Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly.
- Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
- When asking for a decision, name the choice and the difference that matters, and recommend one.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.
- When you use something recalled from project knowledge, name the source where you use it and end with a short Sources list.
