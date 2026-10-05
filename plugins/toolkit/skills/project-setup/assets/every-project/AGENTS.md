Always execute work with the context in mind that the user will likely
continue work across multiple AI coding sessions where the session context is
cleared and picked up again. You must assist the user in helping establish
that continuity across sessions while not adding context that might pollute
future agents and skew them. Information must be curated and intentional.

# <Project name>: agent guide

<!-- Project setup fill-in guide: the `project-setup` skill replaces <Project name> in the heading. Then replace the one-sentence outcome below, and the "Build, test, or deploy" row under Commands, with this project's confirmed values. Those are the only two prompts. Text such as `<ID>` in the tables is the form of a name: keep it. Change nothing else: this file reads the same in every project. Remove this guide when both prompts are filled. -->

<One sentence describing this project and its outcome.> The owner named in `PROJECT.md` makes this project's decisions. The agent runs the project: it keeps the work items, the project's records, and memory current, and it does the technical work.

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

## Every session

- The session-start hook adds Current State to your context: what is in progress, what waits on the owner, and where the next session starts. If it is missing, read it yourself. With local or Hindsight memory it is `memory/CURRENT_STATE.md` in the main checkout. With Notion memory it is the "Current state" page; read it with `using-memory-store`.
- Read `PROJECT.md`, and `SOUL.md` when the project has one. Read them again after resume, clear, or compaction.
- Before you change a file in a folder that has its own `AGENTS.md`, read that file.
- Codex: at session start, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names.
- The next line is for the main conversation. A helper agent follows its brief.
- When a message continues a work item, find the item (the one the owner names; else the one this branch or chat is working on; else the one Current State names), read its Current state, and do its Next action with `running-work-item-lifecycle`. If two items fit, ask the owner which.
- When the owner asks a question, answer it. Do not take the next step of a work item in place of an answer.

## Project map

Every folder and file, what it holds, and what to follow when you change it.

- A row marked "local work items", "local memory", "Hindsight memory", "Salesforce", or "optional" is present only in a project set up that way. "Toolkit settings" in `PROJECT.md` lists this project's choices.
- Git does not track `work-items/` and `memory/`. They exist only in the main checkout, the first path `git worktree list` prints. Every worktree shares them.
- Work items live in one tracker: local files, Notion, or GitHub Issues. Never copy an item into a second tracker or a list of your own. Name a work item by its ID, never by a folder path.
- `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/` are files in this repository in every project.

| Location | What it holds | When you change it |
| --- | --- | --- |
| `PROJECT.md` | What the project is for, its scope, its people, its systems, and "Toolkit settings": the setup choices, the work item ID prefix, and links. | Ask the owner first. Save with `publish-docs`. |
| `PROJECT-ROADMAP.md` (local work items) | The project's phases and the top-level work items in each. | `running-work-item-lifecycle` decides the change. |
| `README.md` | A short introduction for a person who opens the folder. | Save with `publish-docs`. |
| `AGENTS.md`, `CLAUDE.md` | This guide, and the one line that makes Claude Code read it. Each folder guide named below is the same pair of files inside its folder. | Only with the owner's yes, on a branch with a pull request. Never save one with `publish-docs`. |
| `DECISIONS.md` | Every decision and open question that more than one work item needs. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
| `SOUL.md` (optional) | How the owner wants the agent to work. | Only the owner changes it. |
| `.gitignore` | The paths Git does not track. | Only with the owner's yes. |
| `work-items/` (local work items) | Temporary work: one folder per work item. | Read `work-items/AGENTS.md`. Use `using-work-tracker` for every read and save. |
| `work-items/<ID>-<short-slug>/<ID>.md` (local work items) | One work item: its requirements, its own decisions, its tasks, and its history. | `running-work-item-lifecycle`. |
| `work-items/<ID>-<short-slug>/DESIGN.md` (local work items) | The design for that one work item. | `running-work-item-lifecycle`. |
| `work-items/PROJECT-TASKS.md` (local work items) | Chores for the project that belong to no work item. | `running-work-item-lifecycle`. |
| `work-items/work-item-template/` (local work items) | The forms copied to start a new work item or design. | Never edit; they come from the toolkit. |
| `memory/` (local memory, Hindsight memory) | Local memory: where work stopped, and pointers: an ID and a link. Never a second copy of a fact. Hindsight memory: only `CURRENT_STATE.md`. | Local memory: read `memory/AGENTS.md` and use `curating-project-memory`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| `memory/CURRENT_STATE.md` (local memory, Hindsight memory) | What is in progress, what waits on the owner, and where the next session starts. | Local memory: `using-memory-store` makes the write. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| `memory/MEMORY.md` (local memory) | The pointers: one table, one row per pointer. The session-start hook prints it. | `using-memory-store` makes the write. |
| `system/` | The approved description of the system. Every document has a Status line, numbered rules, open questions that link to `DECISIONS.md`, and a changelog. | Read `system/AGENTS.md`. Use `filing-project-records`, step "update a system document". |
| `system/glossary.md` | The project's terms and what each means. | As for `system/`. Never infer a definition. |
| `system/constraints.md` | Rules that cover several areas of the system (CON-##). | As for `system/`. |
| `system/architecture.md` | The main parts of the system and how they connect (ARC-##). | As for `system/`. |
| `system/data-model.md` | The objects, the fields, and how records relate (DAT-##). | As for `system/`. |
| `system/security-model.md` | Who can see and change what (SEC-##). | As for `system/`. |
| `system/automation.md` | What runs by itself: flows, triggers, scheduled jobs (AUT-##). | As for `system/`. |
| `system/integrations/` | One document per connection to another system (INT-##). `README.md` lists them; `INTEGRATION-TEMPLATE.md` is the form. | As for `system/`. |
| `system/diagrams/` | Pictures of the system. | As for `system/`. |
| `sources/` | Every original the project keeps (SRC-###): meeting notes, transcripts, emails, client documents. Never stored inside a work item. | Read `sources/AGENTS.md`. Use `filing-project-records`, step "file a source". Never edit a filed original. |
| `sources/README.md` | The list of sources: ID, date, from whom, what it is, where it is kept, and what used it. | The same step, in the same edit as the original. |
| `delivery/` | What goes out of the project. | Read `delivery/AGENTS.md`. Save with `publish-docs`. |
| `delivery/releases/` | One folder per release: its notes and its go-live plan. | As for `delivery/`. |
| `delivery/deployments/` | One folder per work item that is deployed. Salesforce: also the component tracker and the package files. | As for `delivery/`. Salesforce: `sf-component-tracker`. |
| `delivery/migrations/` | Moving data from an old system into the new one. Load files and backups are never committed. | As for `delivery/`. Salesforce production data: `sf-data-change`. |
| `delivery/client-handoffs/` | What was given to the client or the next team. | As for `delivery/`. |
| `reference/` | Material that is not the project's own decision. | Read `reference/AGENTS.md`. Save with `publish-docs`. |
| `reference/outside-docs/` | Vendor and product documentation captured from outside. `INDEX.md` lists the topics. | As for `reference/`. Never edit a captured page. |
| `reference/current-system/` | What exists today, before this project's changes, with the date it was observed. | As for `reference/`. |
| `tests/` | Test plans, one file per work item or release: `<ID>-test-plan.md` or `<release>-test-plan.md`. `TEST-PLAN-TEMPLATE.md` is the form. | `running-work-item-lifecycle` writes them here, never in the work tracker. |
| `force-app/`, `sfdx-project.json`, `.forceignore` (Salesforce) | The Salesforce source and its project settings. `force-app/` is made when the first metadata is added. | The Salesforce rules in `.claude/rules/`; `sf-component-tracker` before building. |
| `tools/` (Salesforce) | `tools/kb/` lists what reads and writes each part of the org. `tools/permissions/` holds the permission set tool. | `.claude/rules/salesforce-project.md` gives the commands. |
| `.claude/rules/` | The project's rules. `owner-preferences.md` holds the owner's own instructions. | Only with the owner's yes. |
| `.claude/skills/` | The procedures named in "Which skill" below. | Only with the owner's yes. |
| `.claude/hooks/`, `.claude/settings.json` | The small commands that run by themselves, and the settings that turn them on. Salesforce: also the two org guards and `.claude/protected-orgs.json`, the orgs they protect. | Only with the owner's yes. |
| `.claude/output-styles/` | The Plain English style Claude Code applies to chat replies. | Only with the owner's yes. |
| `.agents/skills`, `.codex/` | The link that lets Codex read the same skills, and Codex's hooks and settings. | Only with the owner's yes. |

## Where information goes

File at the narrowest scope that covers everyone affected. The test: would an agent working on a different work item need to know this? If yes, file it in the wider home and leave a one-line pointer with its ID in the item.

| Information | Home |
| --- | --- |
| A stable fact about the project: its purpose, scope, people, or systems | `PROJECT.md` |
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
| A pointer a later session needs to find a record again | Memory, as an ID and a link, never a restated fact |
| The owner's preference for how the agent works ("from now on", "always", "never") | `.claude/rules/owner-preferences.md`. For every project: `~/.claude/rules/owner-preferences.md` and `~/.codex/AGENTS.md`. Never a host setting or a hook. |
| How agents should work here, or a procedure that proved itself | A rule or a skill, with the owner's yes |

To find what was decided before, read `DECISIONS.md`, then `system/`, then the work item.

## What the owner decides

Ask the owner and record the answer before you:

- take a work item approval step (`running-work-item-lifecycle`, "The owner's OK");
- do anything that cannot be undone, spend money, sign in, or change an account.

Do everything else yourself, record it, and report it. When you need a decision, add a row to the work item's Questions and Answers with "Decision needed from: owner", mark the item as waiting on the owner, and record the owner's answer in that row as soon as it is given. Give every choice or recommendation you show the owner a one-line reason.

## Which skill

One skill owns each moment. This list stays in your context after compaction. A method skill from another plugin (brainstorming, plans, debugging) may run inside one of these skills, never in place of it.

| When this happens | Use |
| --- | --- |
| Anything about one work item, from a new idea to Done, including closing or cancelling it; the project's phases and project tasks | `running-work-item-lifecycle` |
| Reading or saving a work item's record; moving, nesting, or archiving items | `using-work-tracker` |
| A decision or question reaches past one work item; an original arrives; an approved fact about the system changes | `filing-project-records` |
| "Remember this", "forget that", "from now on", "clean up memory" | `curating-project-memory`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| Reading or writing Current State or a pointer | `using-memory-store`. Hindsight memory: `.claude/rules/hindsight-memory.md`. |
| The owner ends the session or clears context, or pastes a handoff to check | `handoff` |
| "Recap this chat", "what did I ask for" | `session-summary` |
| A brain dump the owner wants played back before any work starts | `braindump` |
| "Simpler", "explain that simply" | `explain-simply` |
| Saving an approved document edit to the default branch | `publish-docs` |
| Merging a pull request and removing its branch and worktree | `merge-and-clean-up` |
| "Get the latest" | `pull-latest` |
| The owner's own words: "wipe local", "match the remote exactly" | `reset-to-remote` |
| Salesforce metadata changes, a production data change, or a deploy to a shared org (Salesforce) | `sf-component-tracker`, `sf-data-change`, `sf-deploy-check`. The Salesforce rules say when to open each. |
| "Where are we", "what do you need from me", "what's next" | No skill: read Current State, the open work items, and the Open entries in `DECISIONS.md`. Ask one decision at a time, with your recommendation. The next item to start: started work first, then the earliest project phase that is not Done, then the highest-priority Backlog item. |

Never save project memory in Claude Code's or Codex's own memory feature, or another plugin's.

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
