# What the old toolkit left in a project

This file lists what a project holds when it was set up with the older claude-toolkit, or with the retired `toolkit` program. For each old file, folder, and record it says which part of the move-over list it goes under, what Toolkit V2 has in its place, and how each old record is written in the Toolkit V2 form. Open it when `move-over.md` in this folder sends you here, which it does in its steps 2, 3, and 6. With this file, every old file, folder, and record gets one part of the list, and every record that is carried over gets its place in Toolkit V2.

## Contents

- How to read the tables
- The old toolkit's own copy
- Plugins
- Rules
- Hook commands and their settings entries
- Tools, skills, and other agent files
- Knowledge files that hold no records
- Old records
- Old work item to Toolkit V2 work item
- Old memory to its place in Toolkit V2
- The retired toolkit program

## How to read the tables

Each row names an old file, folder, or record, and the part of the move-over list that it goes under. The parts are:

- **Delete**: the old toolkit wrote it, and it holds nothing of the owner's.
- **Compare**: the old toolkit wrote it, and the owner may have edited it. Compare it with the old toolkit's own copy, which the next section says how to find. Then sort it with the table in `move-over.md`, step 3, which has a row for each result of the comparison.
- **Carry**: it holds the owner's words or facts. Those words or facts go to the place that the row names, and the row goes under Update.
- **Kept**: it stays as it is.
- **Update**, **Your call**: the row goes under that part as written.

A file in `.claude/rules/`, `.claude/hooks/`, `.claude/tools/`, or `.claude/skills/` can be one that no table names and that the setup copy does not hold. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project.

- When the old toolkit's own copy has a file of that name, treat the file as a Compare row with "nothing" in its place.
- Otherwise the file is the owner's own, and it is Kept.

## The old toolkit's own copy

Claude Code keeps the older claude-toolkit in the folder that this command prints. The command only reads.

```text
jq -r '."claude-toolkit".installLocation // empty' ~/.claude/plugins/known_marketplaces.json
```

This file calls that folder `<old>`. In `<old>`, the rules are in `<old>/plugins/project-init/library/rules/`, the hook commands are in `<old>/plugins/*/hooks/` and `<old>/plugins/project-init/library/hooks/`, the tools are in `<old>/plugins/second-brain/tools/`, and the project skills are in `<old>/plugins/project-init/library/skills/`. Find the old toolkit's copy of a file by the file's name, and compare the two:

```text
find <old>/plugins -name '<file name>' -not -path '*/tests/*'
diff -u <old copy> <project file>
```

- When `diff` prints nothing, the project's file is an unchanged copy.
- When the first command prints nothing for `<old>`, or the folder is gone, ask the owner whether this computer has a copy of the older toolkit, and where. With no copy, a Compare row cannot be compared.
- An earlier version of the same toolkit file also counts as the toolkit's copy. When `<old>` is a Git repository with history, `git -C <old> log --format=%h -- <path>` lists the versions of a file, and `git -C <old> show <hash>:<path> | diff -q - <project file>` compares one version with the project's file.
- Never change anything in `<old>` or anywhere under `~/.claude`.

## Plugins

Turn off, for this project only, every plugin whose name ends in `@claude-toolkit`, and every `@toolkit-v2` plugin except `toolkit@toolkit-v2`, which is the toolkit's own plugin. `skills-hooks-settings.md`, "The older plugins, off in this project", gives the commands that list the plugins and the settings entries that turn one off. List the plugins on one Update line. Never uninstall a plugin, and never change `~/.claude` or `~/.codex`.

## Rules

This table is for files in `.claude/rules/`. "Same name" means that Toolkit V2 has a rule with that file name. The setup copy holds such a rule only for the choices that the rule applies to.

| Old rule | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `parallel-agent-sessions.md` | Compare | `shared-repository-work.md` |
| `offer-context-handoff.md` | Compare | `session-handoff.md` |
| `knowledge-direct-commit.md` | Compare | `publish-project-documents.md` |
| `work-item-stages.md` | Compare | `keep-work-item-current.md` and the `managing-work-items` skill |
| `work-item-folders.md` | Compare | `work-items/AGENTS.md`, only with local work items |
| `ai-external-knowledge.md` | Compare | `reference/AGENTS.md` |
| `plain-english-artifacts.md` | Compare | `document-clarity-standard.md` |
| `humanize-outbound-text.md` | Compare | Same name |
| `dependency-graph.md` | Compare | Same name in a Salesforce project; nothing otherwise |
| `component-tracker.md`, `permissions-source-control.md` | Compare | Same name (Salesforce) |
| `salesforce-safety-guardrails.md` | Compare | `salesforce-org-safety.md` for the limits that are the same in every project, and `salesforce-agent-permissions.md` for a line that only this project needs |
| `salesforce-change-clarify.md` | Compare | `salesforce-agent-permissions.md`, "Confirm with the owner first" |
| `production-data.md`, `data-change-handoff.md` | Compare | The `sf-data-change` skill, and `salesforce-agent-permissions.md` for who may change data in which org |
| `deploy-hitchhiker-check.md` | Compare | `check-deployment-contents.md` |
| `deployment-runbook.md` | Compare | `record-deployment-steps.md` |
| `delivery-and-knowledge-boundary.md` | Compare | `project-file-locations.md` (Salesforce), and "Where information goes" in `AGENTS.md` |
| `capture-the-thinking.md`, `wrap-up-ritual.md`, `track-open-topics.md`, `spec-before-you-build.md` | Compare | `memory-review-and-save.md`, `keep-work-item-current.md`, and `managing-work-items` |
| `writing-and-language.md`, `how-to-reply.md`, `treat-owner-as-non-technical.md`, `define-your-terms.md` | Compare | The output style named by `outputStyle` in `.claude/settings.json` |
| `.claude/RULES.md`, `.claude/rules/README.md` (indexes of the rules) | Delete | Nothing: `AGENTS.md` tells Codex to read the rule files |
| `.claude/toolkit-sync.md` (what the old sync skill recorded, with the owner's declines) | Carry | In step 6 of `move-over.md`, each decision in it that the owner confirms is still true goes to its new place: an instruction for the agent goes to `.claude/rules/owner-preferences.md`, and a decision about the project goes to `DECISIONS.md`. |

For the row `.claude/toolkit-sync.md`: delete the file only when every decision in it was saved, or the owner said to drop it. Otherwise the file is Kept.

## Hook commands and their settings entries

This table is for files in `.claude/hooks/`. Each file has an entry in `.claude/settings.json`, in `.codex/hooks.json`, or in both. Remove the entry in the same step as its file. On the list, the settings file's one Update line counts the entry, and the Delete line names only the file.

| Old hook command | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `toolkit-session-start.mjs`, `knowledge-session-start.mjs`, `system-guide-session-start.mjs` | Delete | `session-start.mjs` |
| `memory-reminder.mjs` | Delete | `prompt-reminder.mjs` |
| `save-reminder.mjs`, `work-item-close.mjs` | Delete | `codex-after-commit.mjs` |
| `knowledge-manual.mjs`, `command-parsing.mjs` (helpers of the hooks above) | Delete | Nothing |
| `knowledge-completion.mjs`, `spec-check-reminder.mjs`, `style-handshake.mjs`, and any `style-reminder`, `writing-guard`, `explain-simply-reminder`, `work-item-stage-reminder`, or `memory-pr-hook` file | Delete | Nothing: Toolkit V2 adds no end-of-reply check and no per-message style check |
| A `.test.mjs` or `.test.js` file for a hook above, and `.claude/hooks/README.md` | Delete | Nothing |
| `.claude/style-reminder.json`, `.claude/writing-guard.json` | Delete | Nothing |
| `guard-protected-orgs.js`, `guard-permission-set-deploy.js` (Salesforce guards) | Compare | `guard-protected-orgs.cjs`, `guard-permission-set-deploy.cjs` |
| `.claude/protected-orgs.json` | Carry | Same name: the owner's org names and actions are kept, and a setting that only the Toolkit V2 file has is added, except as `update.md`, "The questions before a sandbox change", says |
| `no-ai-attribution-guard.mjs` | Kept | Nothing in the project: it is a machine-wide hook |

- A guard that differs from the old toolkit's copy may block more than the Toolkit V2 guard. Put it under "Your call", and recommend keeping it running until the owner has seen what each guard blocks.
- Never leave a Salesforce project without a production guard. The new guard and its settings entry go in, and the new guard's check passes, before the old guard comes out. `move-over.md`, step 5, gives this order under "Delete".

This table is for the other entries of `.claude/settings.json`. The file's one Update line says which entries are removed, added, and kept.

| Entry | In the settings file | Toolkit V2 has in its place |
| --- | --- | --- |
| `env.CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Removed | Nothing: only the old `protocol-guard` plugin needed it |
| `outputStyle` | Kept | The owner's choice stays, whatever it names |
| `permissions.deny` and `permissions.ask` | Kept | The setup copy's missing entries are added, and none is removed, except as `update.md`, "The questions before a sandbox change", says |
| Any other entry: `env` values, hooks the owner added, MCP servers | Kept | |

## Tools, skills, and other agent files

| Old file or folder | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `.claude/tools/build-knowledge-index.mjs`, `check-knowledge.mjs`, `frontmatter.mjs`, `inspect-knowledge-save.mjs` | Delete | Nothing: the session-start hook builds the memory index |
| The Git hook `pre-commit` in this copy's Git hooks folder, when its text names `check-knowledge` | Delete, in the same step as `.claude/tools/` | Nothing. Git does not track it, so each computer's copy of the project has its own. Say so on its line of the list. |
| Any other Git hook of this copy (for example a `post-commit` that rebuilds a code graph) | Kept | Nothing |
| `.claude/skills/sf-component-tracker/`, `sf-data-change/`, `sf-deploy-check/` | Compare | Same names |
| `.agents/skills/` as a real folder of copies | Update | A link to `.claude/skills` (`placing-files.md`, step 4, says how to make it) |
| `.claude/output-styles/plain-english.md` | Compare | Same name |
| `.claude/output-styles/terse.md`, `plain-language.md` | Kept when `outputStyle` names it; otherwise Compare | Nothing |
| `tools/kb/`, `tools/permissions/` (Salesforce graph and permission set tools) | Compare | Same names |
| `.system-guide.json`, and the System Guide pages (usually `knowledge/system/`) | Your call | `system/` and `reference/current-system/`. The list under this table gives the recommendation. |
| `.toolkit-memory.json` | Delete, after step 6 of `move-over.md` | "Toolkit settings" in `PROJECT.md` |
| A folder's own `AGENTS.md` with a `CLAUDE.md` beside it holding `@AGENTS.md` | Kept | Check it for old names, as the row for the owner's own files in `move-over.md`, step 3, says |
| Root `CLAUDE.md`, root `AGENTS.md`, `README.md`, `.gitignore`, `.mcp.json` | Update | The table in `move-over.md`, step 3, says how each is updated |

For the row `.system-guide.json` and the System Guide pages: the pages are the owner's approved text.

- Recommend moving each page to `reference/current-system/<area>.md` with `git mv`, so that its text and its Git history stay.
- Recommend carrying over into `system/` only the rules that a work item the owner can name built. `one-home-layout.md`, "Where each old file or record goes", has the row for a verified description, which says how such a rule is written and marked.

## Knowledge files that hold no records

| Old file | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `knowledge/knowledge-manual.md`, `knowledge/toolkit-manual.md`, `docs/knowledge-manual.md`, `docs/toolkit-manual.md` | Compare | The skills' own files, `AGENTS.md`, and `PROJECT.md` |
| `knowledge/README.md` | Compare | The project map in `AGENTS.md`, and the `AGENTS.md` of each folder |
| `knowledge/memory/memory-index.md`, `knowledge/prds/prd-index.md` (generated indexes) | Delete, after step 6 of `move-over.md` | Nothing: the records they list are in the places where Toolkit V2 keeps them |
| `ai-external-knowledge/README.md` (generated index) | Carry | `reference/outside-docs/INDEX.md`: one row per topic folder |
| `.work-items/README.md` | Update | Its text becomes the one line that says the folder is history (`move-over.md`, step 6, point 8) |
| `.work-items/DASHBOARD.md`, `.work-items/.work-tracker.yaml`, `.work-items/ACTIVE.json`, `.work-items/EVENTS.ndjson` | On the old work items' Update line: they stay with the old folder | Nothing |

## Old records

The old records are the owner's. Each kind of old record gets one Update line, except where a row below says Kept or "Your call". `move-over.md`, step 3, says what the Update line holds, and step 6 says which records are carried over.

| Old record | Where | Count it with |
| --- | --- | --- |
| Work items | `.work-items/`, at any depth, `archive/` included. One work item is one folder that holds `WORK-ITEM.md`, or the earlier `ITEM.yaml` or `ITEM.json`. | `find .work-items -type f \( -name WORK-ITEM.md -o -name ITEM.yaml -o -name ITEM.json \)` |
| Work items of an earlier tracker | `work-items/`, `delivery/work-items/`, or `engagement/work-items/`, in four status folders, each work item with `ITEM.json` | The same `find`, on that folder |
| Memory | `knowledge/memory/memory-entries/`, one file per topic. `terminology-glossary.md` there is the glossary. | `find knowledge/memory/memory-entries -name '*.md'` |
| Working memory | `knowledge/memory/current.md` | |
| Saves waiting for the owner's answer | `knowledge/memory-inbox.md` | |
| The owner's notes on what to save | `knowledge/memory-self-improvement.md` | |
| Project facts | `knowledge/project.md`; with memory in a service, a root `PROJECT.md` | |
| Requirements | `knowledge/prds/`, or a root `prds/` | `find knowledge/prds prds -name '*.md' -not -name prd-index.md 2>/dev/null` |
| Memory in a service | `.toolkit-memory.json` says `"memory": "external"` and names the service | |
| Outside documentation | The topic folders of `ai-external-knowledge/` | `find ai-external-knowledge -maxdepth 1 -type d` |
| Delivery records and client files | `delivery/`, with the folders `deployment/`, `data/`, `meeting-notes/`, `references/`, `communications/`, `deliverables/`, and `archive/` | `ls delivery` |
| Other owner files the old toolkit made folders for | `brainstorms/`, `docs/designs/`, `engagement/`, `SOUL.md` | Kept; nothing to carry |

Read each work item's status from its `- Status:` line (`WORK-ITEM.md`), its `status:` line (`ITEM.yaml`), or its `"status"` value (`ITEM.json`). Read each memory file's status from the `status:` line in its header. The list gives the count for each status.

The topic folders of `ai-external-knowledge/` and the old `delivery/` folders are renamed, and the client files in them are filed in `sources/`. `one-home-layout.md`, "Where each old file or record goes", has a row for each of these folders that gives its new place and how to move it.

When a project already has a root `work-items/` folder from an earlier tracker, and its owner chose local work items, Toolkit V2 uses that same folder name. Put the old folder under "Your call". Recommend renaming the old folder to `work-items-old/` after the owner's yes, so that the two never mix.

## Old work item to Toolkit V2 work item

Create each new work item with the project's `managing-work-items` skill and its selected `references/work-tracker.md`. A work item in the earlier form holds the same fields in these files: `ITEM.yaml` or `ITEM.json` (the fields), `REQUIREMENTS.md` or `SPEC.md` (the requirements), `TASKS.yaml` (the tasks), `STATUS.md` and `HISTORY.ndjson` (the history).

The table uses two words for the level of a work item: a top-level item is a work item with no parent, and a sub-item is a work item inside another work item.

| Old | Toolkit V2 |
| --- | --- |
| ID | With work items in local folders, the work item keeps the same ID. Notion and GitHub Issues give their own IDs. With either, write "Was <old ID> in the old tracker." as the first line of Notes, Context, and use the new ID wherever another carried-over work item or memory names the old ID. |
| Title, Type, Priority | The same fields. A type that Toolkit V2 does not list becomes `task`. |
| Status and Stage | State and Status, from the table in `earlier-versions.md`, "Work items from Stage to State". A work item that no row fits goes under "Your call". |
| Purpose (`description`) | Goal |
| Current state, Next action (`next_step`), Blockers, Updated date | The lines of the work item's Current state |
| Parent, children, and related items | `parent`, the parent's sub-items, and Related items. Create a parent before its sub-items. When the old work items have more than three levels, put them under "Your call". |
| Requirements approval | `requirements_approved`, with its date and name. Write `no` when the old work item has none. |
| Completion approval | `result_approved`, the same way |
| Delivery choice | `delivery` |
| Open questions | Questions and Answers rows, Status Open |
| A recorded decision | An answered Questions and Answers row, with the owner's words and the date as the old work item gives them. A decision that more than one work item needs is also a `DECISIONS.md` entry, and the row ends "Filed as DEC-###." |
| Context and notes | Notes, Context |
| Roadmap (`STAGE-001`, ...) | In a top-level item, the roadmap becomes the work item's phases `P1`, `P2`, ... in the same order. A sub-item has no phases. |
| Tasks (`TASK-001`, ...) | In a top-level item, the tasks go under their phase. In a sub-item, the tasks are one task list. Each task keeps its old status, objective, deliverable, and acceptance. |
| Recent History | The ten newest entries become Recent History rows. The rest stay in the old work item. |
| Requirements | The Requirements section, in the layout that the project's work item template gives, with the owner's request and each requirement in the old wording. A part that the old text does not give is written "Not recorded." |
| `DESIGN.md` | The work item's design |
| Every other file in the work item's folder | A source: file it in `sources/` with an SRC number, and name it by that ID on the work item's Sources line. `one-home-layout.md`, "Where each old file or record goes", has the row for a source inside a work item, which says how. |
| No old field | In a work item that is not Done or Cancelled, the `**Moved up:**` line stays empty, and "Lessons not proven yet" holds "None." |
| Git branch and pull request fields, completion evidence, the schema version | No Toolkit V2 field. Name them on the Update line as not carried over. |

`managing-work-items/references/lifecycle-rules.md`, "Levels", gives the levels, the task IDs, and the project phase that a top-level item goes under. Add one Recent History row to each new work item: "Carried over from `<old path>` in the move to Toolkit V2."

## Old memory to its place in Toolkit V2

Toolkit V2 memory holds only what no other project file holds. So each fact in an old memory record goes to the place that the root `AGENTS.md`, "Where information goes", gives for it, in the form that this place gives. Save a fact as a memory record only when it fits no other file. The owner's yes to the Update line is also the owner's yes to write these records. Each new record says "Carried over from `<old path>`".

| Old | Toolkit V2 |
| --- | --- |
| A topic file with `status: current` or no `status`, and `type: decision` | When more than one work item needs the decision, or none is named, it becomes a `DECISIONS.md` entry, Decided, with the person and date that the header gives. When one work item needs it, it becomes an answered Questions and Answers row in that work item. The line under this table gives one exception. |
| A topic file with `status: current` or no `status`, and another `type` | Each fact goes to the place where it is kept. The list under this table gives the place for each kind of fact. |
| A topic file that holds the steps of a job | It is not a record in Toolkit V2. Put it under "Your call", and recommend a document or a project skill of the owner's own. |
| A topic file with `status: superseded` or `retired` | It stays where it is. |
| `terminology-glossary.md` | `system/glossary.md`, one row per term |
| Header: `summary`, `source`, `work_item`, `approved_by` with `approval_date` | The new record's own lines. In a `DECISIONS.md` entry, these are Decision, Sources, Affects, and Decided. |
| Header: `supersedes`, `superseded_by` | "Replaces or replaced by" in the entry, when the other file was carried over too; otherwise left out |
| Header: `related_memories`, `confidence`, `context`, `source_quote`, `effective_from`, `effective_to`, `tags`, `group`, `project`, `auto_saved`, the dates | No Toolkit V2 line. Name them on the Update line as not carried over. The old file keeps them. |
| `knowledge/memory/current.md` | The project's Current State, written new from what is true today, as `finishing.md`, "The project's Current State", says. The list under this table says what happens to each part of the old file. |
| A save waiting in `knowledge/memory-inbox.md` | "Your call", one line for each save: the owner approves or declines it. Never file a waiting save without the owner's answer. |
| `knowledge/memory-self-improvement.md` | The owner's instructions go to `.claude/rules/owner-preferences.md`, under Memory, in the owner's words |
| `knowledge/project.md`, or the old root `PROJECT.md` | The matching sections of the Toolkit V2 `PROJECT.md`. |
| A file in `knowledge/prds/` or `prds/` | "Your call". The list under this table gives the recommendation. |
| Memory in a service | It stays in the service. When the service is Hindsight and the owner chose Hindsight memory, it is "Your call" whether this project uses that bank or a new one. A bank is one project's store on the Hindsight server. |

For the row of a topic file with `type: decision`: when the decision would become a `DECISIONS.md` entry and the header gives neither the person nor the date, put the file under "Your call".

For the row of a topic file with another `type`, each fact goes to one of these places:

- A fact about the project goes to `PROJECT.md`.
- A rule about the system goes to the matching `system/` document. Mark the rule Draft unless a decision that approved it can be found.
- A term goes to `system/glossary.md`.
- A fact about a person or the client, a way to reach something, or something that happened, when it fits no other file, becomes a memory record of the matching type. Write it with `managing-project-memory` in the setup copy. With Hindsight memory, put it under "Your call".

For the row `knowledge/memory/current.md`: the project's Current State is the project's one short page of what is true now.

- An "Active work" entry becomes a "Now" line when its work item was carried over and has left Backlog.
- Each "General project to-dos" entry goes under "Your call". Recommend a project task when the entry is administrative work for the whole project, and otherwise a new Backlog work item. A project task is a task that belongs to no work item. `managing-work-items/references/lifecycle-rules.md`, "Levels", describes both.
- "Session handoffs" are not carried over.
- "Project goal" is the suggestion for the outcome question in `finishing.md`.

For the row of a file in `knowledge/prds/` or `prds/`:

- Recommend moving the whole file to `sources/` with `git mv` and an SRC number, so that its text and its Git history stay.
- Recommend carrying its agreed requirements into the matching `system/` documents, as rules whose Source names that SRC. `one-home-layout.md`, "Where each old file or record goes", has the row for an agreed requirement, which says which document each rule goes in and how it is marked.

## The retired toolkit program

| Old file or folder | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `.toolkit.json` | Delete | "Toolkit settings" in `PROJECT.md` |
| `.codex/rules/toolkit.rules`, `.toolkit-cache/` | Delete | Nothing |
| `DECISIONS.md` | Carry | The Toolkit V2 `DECISIONS.md` takes its path, so move the old file first: `git mv` it to `sources/` with an SRC number. In step 6 of `move-over.md`, each decision in it that the owner confirms is still true becomes an entry in the new file, with that SRC under Sources. |
| `.work-items/`, `.memory/` | Update | These are old records. Carry them over as step 6 of `move-over.md` says, from the form that the files have. The old folders stay as they are. |
