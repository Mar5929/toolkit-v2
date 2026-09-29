Always execute work with the context in mind that the user will likely
continue work across multiple AI coding sessions where the session context is
cleared and picked up again. You must assist the user in helping establish
that continuity across sessions while not adding context that might pollute
future agents and skew them. Information must be curated and intentional.

# <Project name>: agent guide

<!-- Project setup fill-in guide: toolkit init replaces <Project name>, keeps only the blocks for the tracker, memory system, and Salesforce choice made at setup, and writes the rules list. Then replace the one-sentence outcome below and the "Build, test, or deploy" row under Commands with this project's confirmed values. Change paths only when the installed folder differs. Remove this guide and every angle-bracket prompt before handing the guide to a new project agent. -->

<One sentence describing this project and its outcome.> The owner named in `PROJECT.md` makes this project's decisions. The agent runs the project: it keeps the work tracker, memory, and project records current, and it does the technical work.

## Every session

- The session-start hook adds a "Project briefing" to your context: this worktree's work item, active items with the skill that continues each one, what waits on the owner, the current focus, moved items, and setup warnings. If there is no briefing, run `toolkit brief` and read it.
- Read `SOUL.md` (when the project has one) and `PROJECT.md`; read them again after resume, clear, or compaction.
- Anything to build, add, fix, or change, and "keep going": the `work-on` skill. It opens the work item; also read the item's phase in `PROJECT-ROADMAP.md`.
- A change to a requirement, such as R-01, at any stage: `work-requirements`.
- "You drive", "take it from here", "run with it", even about a named item: `work-delegate`.
- "Where are we": `work-status`. "What do you need from me" and approvals: `work-decide`.
- "Remember", "from now on", "always", "never", "forget that": `memory-save`. It puts an instruction for how the agent works in the rules and a fact in memory. "What did we decide": `memory-find`.
- Open the matching skill or rule when the task needs its procedure. Method skills from other plugins (brainstorming, plans, debugging) may run inside these skills, never instead of them.
<!-- if salesforce -->
- Design work goes through `solution-design`; it opens `sf-architect-solutioning` as its specialist.
- A Salesforce platform question, even about a work item: `sf-architect-solutioning`.
- Salesforce org aliases are in `.toolkit.json` under `salesforce.orgs`. Agents never deploy to, validate against, or write data in production; hand the owner the command or the file.
<!-- endif -->
- Before editing files in a folder that has its own `AGENTS.md` (for example `requirements/`), read that file.
- Codex: at session start, read the always-on rules listed under "Rules".

## What the owner decides

Ask the owner and record the answer before you:
- approve requirements (build and data-load work cannot pass stage `03` without it; requirements count as approved only when the item records the owner's approval with a date; a saved draft is not approved);
- choose or approve a design, approve a finished result, or mark work Done or Cancelled;
- merge to the default branch (unless `DECISIONS.md` records a standing merge instruction), deploy, or do anything that cannot be undone;
- spend money, sign in, or change an account.

Do everything else yourself, record it, and report it. When you need a decision, add it to the work item's Open Questions with "Decision needed from: owner" and set the item's `waiting_on` to `owner` ("Work tracking" says how).

## Where information goes

| Information | Home |
| --- | --- |
| New request, idea, or bug | A new work item at stage `01-discovery` (`work-on`) |
| Requirements, questions, tasks, progress, and history of one change | That work item |
<!-- if tracker=local -->
| How a change is built | `DESIGN.md` beside the item's `WORK-ITEM.md` (`toolkit work design`) |
<!-- endif -->
<!-- if tracker=notion -->
| How a change is built | The item's "Solution Design" subpage (`toolkit work design`) |
<!-- endif -->
<!-- if tracker=github -->
| How a change is built | A comment titled "Solution design" on the item's issue |
<!-- endif -->
<!-- if tracker=jira -->
| How a change is built | A comment titled "Solution design" on the item's Jira issue |
<!-- endif -->
| A decision for the whole project | `DECISIONS.md` (`work-decide`) |
| Phases and deliverable-sized work units | `PROJECT-ROADMAP.md`, naming each unit's work item ID |
| A work item's test plan | `tests/`, a copy of `TEST-PLAN-TEMPLATE.md` named for the item, committed on the item's branch; never in the tracker |
| Agreed behavior, after delivery | The area's file in `requirements/`, at stage `14-spec-update` |
| Verified structure of the current system | The area's file in `system-guide/` |
| What is in progress, owner to-dos with no work item, where the next session starts | The current focus (`memory-save`) |
| The owner's preference or correction for how the agent works ("from now on", "always", "never") | `.claude/rules/owner-preferences.md` (`memory-save` runs `toolkit rule add`); for every project, `~/.claude/rules/` |
| A lasting fact, an unproven lesson, or a hard-to-find reference | Memory (`memory-save`) |
| Project terms | The glossary (`memory-save`) |
| Outside documentation you capture | `ai-external-knowledge/`, one folder per topic |
| How agents should work in this project, or a procedure that proved itself | A rule in `.claude/rules/` or a skill in `.claude/skills/`, with the owner's yes; never memory |
<!-- if salesforce -->
| Client brief, source file, message, or meeting note | `delivery/`, in the folder for that kind of file |
| Production data load and backup files | `delivery/data/` (never committed) |
| Deploy manifests and manual deploy steps | `delivery/deployment/` (`sf-component-tracker`); ordinary metadata changes use the work item's own package |
<!-- endif -->

Authorized edits to committed project documents are saved with `.claude/rules/publish-project-documents.md` and the `publish-docs` skill. Local work items and local memory are Git-ignored and never committed.

## Work tracking

<!-- if tracker=local -->
- Tracker: local folders in `.work-items/`, Git-ignored, in the main checkout, shared by every worktree. `.claude/rules/work-item-folders.md` covers folders, moves, and generated files. A sub-item is an item folder nested inside its parent item's folder. It is the only tracker; never copy items into a second tracker or a local list.
- IDs look like `WI-001` (the prefix is `tracker.idPrefix` in `.toolkit.json`). Refer to work items by ID, never by folder path. The owner may move or rename item folders; find them by ID and continue. Change `waiting_on`, the stage, and other fields with `toolkit work` commands.
<!-- endif -->
<!-- if tracker=notion -->
- Tracker: the Work Items database on this project's page in Notion (ids in `.toolkit.json` under `notion`). Read and write it only with `toolkit work` commands. The owner may edit cards in Notion; the owner's edits win. Sub-items are Notion sub-items. It is the only tracker; never copy items into a second tracker or a local list.
- IDs look like `WI-001` (the card's ID property; the prefix is `tracker.idPrefix` in `.toolkit.json`). Refer to work items by ID, never by link. The owner may move or rename cards; find them by ID and continue. Change `waiting_on`, the stage, and other fields with `toolkit work` commands.
<!-- endif -->
<!-- if tracker=github -->
- Tracker: GitHub Issues. `toolkit work` commands do not write to GitHub; any of them prints the path to the written GitHub instructions. Follow those. Sub-items are GitHub sub-issues. It is the only tracker; never copy items into a second tracker or a local list.
- An item's ID is its issue number, written `#12`. Refer to work items by ID, never by link. Set `waiting_on`, the stage, and other fields with the labels the GitHub instructions name.
<!-- endif -->
<!-- if tracker=jira -->
- Tracker: Jira. `toolkit work` commands do not write to Jira; any of them prints the path to the written Jira instructions. Follow those. Sub-items are Jira sub-tasks. It is the only tracker; never copy items into a second tracker or a local list.
- An item's ID is its Jira key, for example `ACME-42`. Refer to work items by ID, never by link. Set `waiting_on`, the stage, and other fields as the Jira instructions say.
<!-- endif -->
- Keep each design with its item after delivery. The roadmap names items by ID; item detail stays in the tracker.
- Stages `01-discovery` to `14-spec-update`, statuses, and approval gates: `toolkit work lifecycle`.

## Memory

<!-- if memory=builtin -->
- System: built-in memory in `.memory/`, Git-ignored, in the main checkout, shared by every worktree. It can be opened as an Obsidian vault. Read `.memory/AGENTS.md` before working there. What is worth saving: `.memory/memory-criteria.md`.
<!-- endif -->
<!-- if memory=hindsight -->
- System: the local Hindsight server on this computer, with this project's memory bank (`.toolkit.json` under `hindsight`). Never call Hindsight directly.
<!-- endif -->
<!-- if memory=notion -->
- System: the Memory database on this project's page in Notion (ids in `.toolkit.json` under `notion`).
<!-- endif -->
- Read and write memory only through the `memory-save`, `memory-find`, and `memory-tidy` skills, which run `toolkit memory` commands. Search memory before asking the owner to repeat something. When a save needs the owner's yes: the `memory-save` skill. Never store secrets, email addresses, or work-item status.

## Rules

The toolkit writes the list between the two markers from the files in `.claude/rules/` and rebuilds it on every `toolkit sync`. Do not edit it by hand.

<!-- toolkit:rules:start -->
Always on. Claude Code loads these at session start. Codex: read each one at session start.
- `.claude/rules/check-deployment-contents.md`: Check What a Deployment Includes
- `.claude/rules/component-tracker.md`: Keep the Component Tracker Current
- `.claude/rules/confirm-salesforce-changes.md`: Confirm Salesforce Changes
- `.claude/rules/humanize-outbound-text.md`: Humanize Anything Sent to Another Person
- `.claude/rules/keep-work-item-current.md`: Keep the Active Work Item Accurate
- `.claude/rules/memory-review-and-save.md`: Review and Save Project Memory
- `.claude/rules/plain-english-artifacts.md`: Write Artifacts in Plain English
- `.claude/rules/production-data-changes.md`: Production Data Changes
- `.claude/rules/project-file-locations.md`: Client-Work Folder: delivery/ or engagement/
- `.claude/rules/salesforce-org-safety.md`: Salesforce Org Safety
- `.claude/rules/session-handoff.md`: Prepare a Session Handoff
- `.claude/rules/shared-repository-work.md`: Work Safely in a Shared Repository
- `.claude/rules/work-item-folders.md`: Local Work-Item Folders

Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.

| Paths | Rule |
| --- | --- |
| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |
| `force-app/**`, `tools/kb/**` | `.claude/rules/dependency-graph.md` |
| `force-app/**/permissionsets/**`, `force-app/**/permissionsetgroups/**`, `force-app/**/profiles/**` | `.claude/rules/permissions-source-control.md` |
| `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md`, `DECISIONS.md`, `system-guide/**`, `tools/permissions/PERMISSIONS-RUNBOOK.md`, `ai-external-knowledge/**`, `delivery/**`, `**/README.md` | `.claude/rules/publish-project-documents.md` |
| `delivery/deployment/**`, `engagement/deployment/**` | `.claude/rules/record-deployment-steps.md` |
<!-- toolkit:rules:end -->

## Project map

| Path | What is there, and when to open it |
| --- | --- |
| `PROJECT.md` | Purpose, scope, owners, systems, and tracker; open for project context. |
| `PROJECT-ROADMAP.md` | Phases (`P01`) and work units, each naming its work item ID; open for sequencing. |
| `DECISIONS.md` | Decisions for the whole project; open before changing direction. |
| `requirements/` | Delivered functional behavior by area; read its `AGENTS.md` before editing. |
| `system-guide/` | Guide to the current system, one file per area; open for questions about existing structure, purpose, connections, or impact. |
| `ai-external-knowledge/` | Captured outside sources by topic; `INDEX.md` lists them. Open when needed. |
| `tests/` | Test plans (`TEST-PLAN-TEMPLATE.md`) and checks; open before changing behavior. |
| `.toolkit.json` | Setup choices: tracker, memory system, Salesforce. Written by toolkit init; change it with `toolkit config set`. |
<!-- if tracker=local -->
| `.work-items/` | Work items; each item's `DESIGN.md` sits beside its `WORK-ITEM.md`. `work-item-template/` is the form. `DASHBOARD.md` there is a generated status board. |
<!-- endif -->
<!-- if memory=builtin -->
| `.memory/` | Current focus, index, glossary, and linked topic notes; open the folder as an Obsidian vault if wanted. Read its `AGENTS.md` before editing. |
<!-- endif -->
<!-- if salesforce -->
| `delivery/` | Client briefs, references, communications, meetings, data, deployment records, deliverables, and archive; open the relevant category. `delivery/data/` holds record data work. `delivery/deployment/` holds the project-wide package, narrow work-item packages, and release cutovers. |
| `force-app/` | Salesforce source (`sfdx-project.json`); open before changing behavior. |
| `tools/permissions/`, `tools/kb/` | Permission and impact tools; open for those tasks. |
<!-- endif -->

## Commands

| Need | Command |
| --- | --- |
| Check the toolkit setup, tracker, and memory | `toolkit doctor`; the `project-setup` skill fixes what it reports. |
| Build, test, or deploy | `<Verified project commands and target environment; do not infer from this template.>` |
<!-- if salesforce -->
| Check Salesforce impact | `python3 tools/kb/build_edges.py`, then `query_graph.py`; `tools/kb/README.md`. |
| Check permission sets | `python3 tools/permissions/permsets.py`; `tools/permissions/PERMISSIONS-RUNBOOK.md`. |
| Check a shared-org deploy | `sf-deploy-check` skill. |
| Validate against the sandbox | `sf project deploy validate` with `-x` the item's manifest and `-o` the sandbox alias from `.toolkit.json`. |
<!-- endif -->

## How to write replies

Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly, without a "not this, but that" setup.
- Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
- When asking for a decision, name the choice and the difference that matters, and recommend one.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration of process and helper activity. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.
