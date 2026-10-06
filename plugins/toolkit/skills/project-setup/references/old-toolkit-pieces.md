# Old toolkit pieces

Purpose: what a project set up with the older claude-toolkit, or with the
retired `toolkit` program, holds; which part of the move-over list each
piece goes under; what Toolkit V2 has in its place; and how each old record
maps to the Toolkit V2 form. `move-over.md` in this folder uses it in steps
2, 3, and 6.

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
- Old memory to its Toolkit V2 home
- The retired toolkit program

## How to read the tables

Each row names a piece and the part of the list it goes under:

- **Delete**: the old toolkit wrote it and it holds nothing of the owner's.
- **Compare**: the old toolkit wrote it, and the owner may have edited it.
  Compare it with the old toolkit's own copy (below), then sort it as
  `move-over.md`, step 3, says.
- **Carry**: it holds the owner's words or facts. They go to the place the
  row names; the row goes under Update.
- **Kept**: it stays as it is.
- **Update**, **Your call**: the row goes under that part as written.

A file in `.claude/rules/`, `.claude/hooks/`, `.claude/tools/`, or
`.claude/skills/` that no table names and the setup copy does not hold: when
the old toolkit's own copy has a file of that name, treat it as a Compare
row with "nothing" in its place. Otherwise it is the owner's own: Kept.

## The old toolkit's own copy

Claude Code keeps the older claude-toolkit in the folder this prints (it
only reads):

```text
jq -r '."claude-toolkit".installLocation // empty' ~/.claude/plugins/known_marketplaces.json
```

This file calls that folder `<old>`. Its rules are in
`<old>/plugins/project-init/library/rules/`, its hook commands in
`<old>/plugins/*/hooks/` and `<old>/plugins/project-init/library/hooks/`,
its tools in `<old>/plugins/second-brain/tools/`, and its project skills in
`<old>/plugins/project-init/library/skills/`. Find a file's copy by name:

```text
find <old>/plugins -name '<file name>' -not -path '*/tests/*'
diff -u <old copy> <project file>
```

- No output from `diff`: the project's file is an unchanged copy.
- The command prints nothing for `<old>`, or the folder is gone: ask the
  owner whether this computer has a copy of the older toolkit, and where.
  With no copy, a Compare row cannot be compared.
- An earlier version of the same toolkit file also counts as the toolkit's
  copy. When `<old>` is a Git repository with history,
  `git -C <old> log --format=%h -- <path>` lists the versions of a file and
  `git -C <old> show <hash>:<path> | diff -q - <project file>` compares one.
- Never change anything in `<old>` or anywhere under `~/.claude`.

## Plugins

Every plugin whose name ends in `@claude-toolkit`, and every `@toolkit-v2`
plugin except `toolkit@toolkit-v2`, is turned off for this project only, as
`skills-hooks-settings.md` says ("The older plugins, off in this project").
List them on one Update line. Never uninstall one, and never change
`~/.claude` or `~/.codex`.

## Rules

Files in `.claude/rules/`. "Same name" means Toolkit V2 has a rule with
that file name; the setup copy holds it only for the choices it applies to.

| Old rule | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `parallel-agent-sessions.md` | Compare | `shared-repository-work.md` |
| `offer-context-handoff.md` | Compare | `session-handoff.md` |
| `knowledge-direct-commit.md` | Compare | `publish-project-documents.md` |
| `work-item-stages.md` | Compare | `keep-work-item-current.md` and the `running-work-item-lifecycle` skill |
| `work-item-folders.md` | Compare | `work-items/AGENTS.md`, only with local work items |
| `ai-external-knowledge.md` | Compare | `reference/AGENTS.md` |
| `plain-english-artifacts.md` | Compare | `write-for-the-reader.md` |
| `humanize-outbound-text.md` | Compare | Same name |
| `dependency-graph.md` | Compare | Same name in a Salesforce project; nothing otherwise |
| `component-tracker.md`, `permissions-source-control.md` | Compare | Same name (Salesforce) |
| `salesforce-safety-guardrails.md` | Compare | `salesforce-org-safety.md` |
| `salesforce-change-clarify.md` | Compare | `confirm-salesforce-changes.md` |
| `production-data.md`, `data-change-handoff.md` | Compare | `production-data-changes.md` and the `sf-data-change` skill |
| `deploy-hitchhiker-check.md` | Compare | `check-deployment-contents.md` |
| `deployment-runbook.md` | Compare | `record-deployment-steps.md` |
| `delivery-and-knowledge-boundary.md` | Compare | `project-file-locations.md` (Salesforce), and "Where information goes" in `AGENTS.md` |
| `capture-the-thinking.md`, `wrap-up-ritual.md`, `track-open-topics.md`, `spec-before-you-build.md` | Compare | `memory-review-and-save.md`, `keep-work-item-current.md`, and `running-work-item-lifecycle` |
| `writing-and-language.md`, `how-to-reply.md`, `treat-owner-as-non-technical.md`, `define-your-terms.md` | Compare | The output style named by `outputStyle` in `.claude/settings.json` |
| `.claude/RULES.md`, `.claude/rules/README.md` (indexes of the rules) | Delete | Nothing: `AGENTS.md` tells Codex to read the rule files |
| `.claude/toolkit-sync.md` (what the old sync skill recorded, with the owner's declines) | Carry | Each decision in it that the owner confirms is still true goes to its home in step 6: an instruction for the agent to `.claude/rules/owner-preferences.md`, a decision about the project to `DECISIONS.md`. The file is deleted only when every decision in it was saved or he said to drop it; otherwise it is Kept. |

## Hook commands and their settings entries

Files in `.claude/hooks/`. Each has an entry in `.claude/settings.json`,
in `.codex/hooks.json`, or in both: the entry is removed in the same step
as its file. The settings file's one Update line counts the entry; the
Delete line names only the file.

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
| `.claude/protected-orgs.json` | Carry | Same name: his org names and actions are kept, and a setting only the Toolkit V2 file has is added |
| `no-ai-attribution-guard.mjs` | Kept | Nothing in the project: it is a machine-wide hook |

- A guard that differs from the old toolkit's copy may block more than the
  Toolkit V2 guard. Put it under "Your call", and recommend keeping it
  running until the owner has seen what each guard blocks.
- Never leave a Salesforce project without a production guard: the new
  guard and its settings entry go in, and its check passes, before the old
  one comes out (`move-over.md`, step 5).

The other entries of `.claude/settings.json`. The file's one Update line
says which are removed, added, and kept:

| Entry | In the settings file | Toolkit V2 has in its place |
| --- | --- | --- |
| `env.CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Removed | Nothing: only the old `protocol-guard` plugin needed it |
| `outputStyle` | Kept | The owner's choice stays, whatever it names |
| `permissions.deny` and `permissions.ask` | Kept | The setup copy's missing entries are added; none is removed |
| Any other entry: `env` values, hooks the owner added, MCP servers | Kept | |

## Tools, skills, and other agent files

| Old piece | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `.claude/tools/build-knowledge-index.mjs`, `check-knowledge.mjs`, `frontmatter.mjs`, `inspect-knowledge-save.mjs` | Delete | Nothing: the session-start hook builds the memory index |
| The Git hook `pre-commit` in this copy's Git hooks folder, when its text names `check-knowledge` | Delete, in the same step as `.claude/tools/` | Nothing. Git does not track it, so each computer's copy of the project has its own: say so on its line |
| Any other Git hook of this copy (for example a `post-commit` that rebuilds a code graph) | Kept | Nothing |
| `.claude/skills/sf-component-tracker/`, `sf-data-change/`, `sf-deploy-check/` | Compare | Same names |
| `.agents/skills/` as a real folder of copies | Update | A link to `.claude/skills` (`placing-files.md`, step 4) |
| `.claude/output-styles/plain-english.md` | Compare | Same name |
| `.claude/output-styles/terse.md`, `plain-language.md` | Kept when `outputStyle` names it; otherwise Compare | Nothing |
| `tools/kb/`, `tools/permissions/` (Salesforce graph and permission set tools) | Compare | Same names |
| `.system-guide.json`, and the System Guide pages (usually `knowledge/system/`) | Your call | `system/` and `reference/current-system/`. The pages are his approved text: recommend moving each page to `reference/current-system/<area>.md` with `git mv`, so its text and its Git history stay, and carrying over into `system/` only the rules a work item he can name delivered (`one-home-layout.md`, "Where each old piece goes", the row for a verified description) |
| `.toolkit-memory.json` | Delete, after step 6 | "Toolkit settings" in `PROJECT.md` |
| A folder's own `AGENTS.md` with a `CLAUDE.md` beside it holding `@AGENTS.md` | Kept | Check it for old names (`move-over.md`, step 3) |
| Root `CLAUDE.md`, root `AGENTS.md`, `README.md`, `.gitignore`, `.mcp.json` | Update | `move-over.md`, step 3 |

## Knowledge files that hold no records

| Old file | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `knowledge/knowledge-manual.md`, `knowledge/toolkit-manual.md`, `docs/knowledge-manual.md`, `docs/toolkit-manual.md` | Compare | The skills' own files, `AGENTS.md`, and `PROJECT.md` |
| `knowledge/README.md` | Compare | The project map in `AGENTS.md`, and the folder guides |
| `knowledge/memory/memory-index.md`, `knowledge/prds/prd-index.md` (generated indexes) | Delete, after step 6 | Nothing: the records they list are in their Toolkit V2 homes |
| `ai-external-knowledge/README.md` (generated index) | Carry | `reference/outside-docs/INDEX.md`: one row per topic folder |
| `.work-items/README.md` | Update | Its text becomes the one line that says the folder is history (`move-over.md`, step 6, point 8) |
| `.work-items/DASHBOARD.md`, `.work-items/.work-tracker.yaml`, `.work-items/ACTIVE.json`, `.work-items/EVENTS.ndjson` | On the old work items' Update line: they stay with the old folder | Nothing |

## Old records

These are the owner's. Each kind gets one Update line (`move-over.md`,
steps 3 and 6), except where a row below says Kept or "Your call".

| Old record | Where | Count it with |
| --- | --- | --- |
| Work items | `.work-items/`, at any depth, `archive/` included. One item is one folder that holds `WORK-ITEM.md`, or the earlier `ITEM.yaml` or `ITEM.json`. | `find .work-items -type f \( -name WORK-ITEM.md -o -name ITEM.yaml -o -name ITEM.json \)` |
| Work items of an earlier tracker | `work-items/`, `delivery/work-items/`, or `engagement/work-items/`, in four status folders, each item with `ITEM.json` | The same `find`, on that folder |
| Memory | `knowledge/memory/memory-entries/`, one file per topic. `terminology-glossary.md` there is the glossary. | `find knowledge/memory/memory-entries -name '*.md'` |
| Working memory | `knowledge/memory/current.md` | |
| Saves waiting for his answer | `knowledge/memory-inbox.md` | |
| His notes on what to save | `knowledge/memory-self-improvement.md` | |
| Project facts | `knowledge/project.md`; with memory in a service, a root `PROJECT.md` | |
| Requirements | `knowledge/prds/`, or a root `prds/` | `find knowledge/prds prds -name '*.md' -not -name prd-index.md 2>/dev/null` |
| Memory in a service | `.toolkit-memory.json` says `"memory": "external"` and names the service | |
| Outside documentation | The topic folders of `ai-external-knowledge/` | `find ai-external-knowledge -maxdepth 1 -type d` |
| Delivery records and client files | `delivery/`, with the folders `deployment/`, `data/`, `meeting-notes/`, `references/`, `communications/`, `deliverables/`, and `archive/` | `ls delivery` |
| Other owner files the old toolkit made folders for | `brainstorms/`, `docs/designs/`, `engagement/`, `SOUL.md` | Kept; nothing to carry |

Read each work item's status from its `- Status:` line (`WORK-ITEM.md`), its
`status:` line (`ITEM.yaml`), or its `"status"` value (`ITEM.json`), and
each memory file's `status:` line from its header. The list gives the count
for each status.

The topic folders of `ai-external-knowledge/` and the old `delivery/`
folders are renamed, and the client files in them are filed in `sources/`:
`one-home-layout.md`, "Where each old piece goes", has the row for each.

A project that already has a root `work-items/` folder from an earlier
tracker, and whose owner chose local work items: Toolkit V2 uses that same
folder name. Put it under "Your call": recommend renaming the old folder to
`work-items-old/` after his yes, so the two never mix.

## Old work item to Toolkit V2 work item

Create each item with the project's `using-work-tracker` skill. The
earlier files of an item hold the same fields: `ITEM.yaml` or `ITEM.json`
(the fields), `REQUIREMENTS.md` or `SPEC.md` (the requirements),
`TASKS.yaml` (the tasks), `STATUS.md` and `HISTORY.ndjson` (the history).

| Old | Toolkit V2 |
| --- | --- |
| ID | Local folders: the same ID. Notion and GitHub Issues give their own IDs: write "Was <old ID> in the old tracker." as the first line of Notes, Context, and use the new ID wherever another carried-over item or memory names the old one. |
| Title, Type, Priority | The same fields. A type Toolkit V2 does not list becomes `task`. |
| Status and Stage | State and Status, from the table in `earlier-versions.md`, "Work items from Stage to State". An item no row fits goes under "Your call". |
| Purpose (`description`) | Goal |
| Current state, Next action (`next_step`), Blockers, Updated date | The Current state lines |
| Parent, children, and related items | `parent`, the parent's sub-items, and Related items. Create a parent before its sub-items. More than three levels: "Your call". |
| Requirements approval | `requirements_approved`, with its date and name; `no` when the old item has none |
| Completion approval | `result_approved`, the same way |
| Delivery choice | `delivery` |
| Open questions | Questions and Answers rows, Status Open |
| A recorded decision | An answered Questions and Answers row, with the owner's words and the date as the old item gives them. A decision more than one work item needs is also a `DECISIONS.md` entry, and the row ends "Filed as DEC-###." |
| Context and notes | Notes, Context |
| Roadmap (`STAGE-001`, ...) | A top-level item: its phases `P1`, `P2`, ... in the same order. A sub-item has no phases. |
| Tasks (`TASK-001`, ...) | A top-level item: tasks under their phase. A sub-item: one task list. Each task keeps its old status, objective, deliverable, and acceptance. |
| Recent History | The ten newest entries become Recent History rows. The rest stay in the old item. |
| Requirements | The Requirements section, in the layout the project's work item template gives, with the owner's request and each requirement in the old wording. A part the old text does not give is written "Not recorded." |
| `DESIGN.md` | The item's design |
| Every other file in the item's folder | An original: filed in `sources/` with an SRC number, and named by that ID on the item's Sources line (`one-home-layout.md`, "Where each old piece goes", the row for an original inside a work item) |
| No old field | The `**Moved up:**` line stays empty, and "Lessons not proven yet" holds "None.", in an item that is not Done or Cancelled |
| Git branch and pull request fields, completion evidence, the schema version | No Toolkit V2 field. Name them on the Update line as not carried over. |

The levels, the task IDs, and the project phase a top-level item goes under
are in `running-work-item-lifecycle`, "Levels". Add one Recent History row to each
new item: "Carried over from `<old path>` in the move to Toolkit V2."

## Old memory to its Toolkit V2 home

Toolkit V2 memory holds only what no other project file holds. So each
fact in an old memory record goes to the home that the root `AGENTS.md`,
"Where information goes", gives it, in the form that home gives. Only a
fact that fits no other file is saved as a memory record. The owner's yes to the Update line is his yes to write these
records. Each new record says "Carried over from `<old path>`".

| Old | Toolkit V2 |
| --- | --- |
| A topic file with `status: current` or no `status`, and `type: decision` | More than one work item needs it, or none is named: a `DECISIONS.md` entry, Decided, with the person and date the header gives; a header that gives neither: "Your call". One work item needs it: an answered Questions and Answers row in that item. |
| A topic file with `status: current` or no `status`, and another `type` | Each fact to its home: a fact about the project to `PROJECT.md`; a rule about the system to the matching `system/` document, marked Draft unless a decision that approved it can be found; a term to `system/glossary.md`; a fact about a person or the client, a way to reach something, or something that happened, that fits no other file: a memory record of the matching kind, written with `curating-project-memory` in the setup copy (Hindsight memory: "Your call"). |
| A topic file that holds the steps of a job | Not a record in Toolkit V2. "Your call": recommend a document or a project skill of his own. |
| A topic file with `status: superseded` or `retired` | Stays where it is |
| `terminology-glossary.md` | `system/glossary.md`, one row per term |
| Header: `summary`, `source`, `work_item`, `approved_by` with `approval_date` | The new record's own lines: in a `DECISIONS.md` entry, Decision, Sources, Affects, and Decided |
| Header: `supersedes`, `superseded_by` | "Replaces or replaced by" in the entry, when the other file was carried over too; otherwise left out |
| Header: `related_memories`, `confidence`, `context`, `source_quote`, `effective_from`, `effective_to`, `tags`, `group`, `project`, `auto_saved`, the dates | No Toolkit V2 line. Name them on the Update line as not carried over; the old file keeps them. |
| `knowledge/memory/current.md` | Current State, written new from what is true today (`finishing.md`, "Current State"). An "Active work" entry becomes a "Now" line when its work item was carried over and has left Backlog. Each "General project to-dos" entry goes under "Your call": recommend a project task when it is administrative work for the whole project, and otherwise a new Backlog work item (`running-work-item-lifecycle`, "Levels"). "Session handoffs" are not carried over. "Project goal" is the suggestion for the outcome question in `finishing.md`. |
| A save waiting in `knowledge/memory-inbox.md` | "Your call", one line each: he approves or declines it. Never file one without his answer. |
| `knowledge/memory-self-improvement.md` | His instructions go to `.claude/rules/owner-preferences.md`, under Memory, in his words |
| `knowledge/project.md`, or the old root `PROJECT.md` | The matching sections of the Toolkit V2 `PROJECT.md`. |
| A file in `knowledge/prds/` or `prds/` | "Your call": recommend moving the whole file to `sources/` with `git mv` and an SRC number, so its text and its Git history stay, and carrying its agreed requirements into the matching `system/` documents as rules whose Source names that SRC (`one-home-layout.md`, "Where each old piece goes", the row for an agreed requirement) |
| Memory in a service | Stays in the service. When it is Hindsight and he chose Hindsight memory: "Your call" whether this project uses that bank or a new one. |

## The retired toolkit program

| Old piece | Part | Toolkit V2 has in its place |
| --- | --- | --- |
| `.toolkit.json` | Delete | "Toolkit settings" in `PROJECT.md` |
| `.codex/rules/toolkit.rules`, `.toolkit-cache/` | Delete | Nothing |
| `DECISIONS.md` | Carry | The Toolkit V2 `DECISIONS.md` takes its path, so the old file is moved first: `git mv` it to `sources/` with an SRC number. Each decision in it that the owner confirms is still true becomes an entry in the new file, in step 6, with that SRC under Sources. |
| `.work-items/`, `.memory/` | Update | Old records: carried over as step 6 says, from the form the files have; the old folders stay as they are |
