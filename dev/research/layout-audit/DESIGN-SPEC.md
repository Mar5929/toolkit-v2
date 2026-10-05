# One-home layout: the design the owner approved

Work item: TKV-24. Branch: `claude/one-home-layout`. Date: 2026-10-05.

This file is the single source for every builder and reviewer on this branch.
Where it and an audit report differ, this file wins. The audit reports hold the
detail: `audit-1-rules-agents-hooks.md` (rule files, instruction files,
templates, hooks; rows A-###, checks V-##, conflicts C-## and X-##) and
`audit-2-skills-templates.md` (skills; rows B-###, overlaps O-##). In audit 2,
section 12 was written before the owner chose to keep the filing skill, so
read sections 8.3 to 8.5 for the skill map, with the names below.

## 1. Goal

Every Toolkit V2 project gets one clear folder layout and one set of skills
where each fact and each job has exactly one home, in files the owner can
read and edit himself.

## 2. The owner's decisions (Mike, 2026-10-05, on the review page)

1. No if-then blocks inside files. A setup choice decides which files a
   project gets, never which lines inside a file.
2. No new skills. Closing a work item is a step inside the work item skill.
   Recording a decision, filing a source, and updating a system document are
   three steps inside one filing skill.
3. Keep one small filing skill, rewritten, named `filing-project-records`
   (today `managing-project-wide-records`).
4. New names: `managing-work-items` -> `running-work-item-lifecycle`;
   `tracking-work-items` -> `using-work-tracker`; `managing-project-memory`
   -> `curating-project-memory`; `storing-project-memory` ->
   `using-memory-store`.
5. `DECISIONS.md`, `sources/`, and `system/` are files in every project in
   this branch. Notion databases for decisions and sources are a later,
   separate work item. Do not build them here.
6. The root `AGENTS.md` is the outline: one or two sentences per location,
   and the filing table. Each main folder has its own `AGENTS.md`, the
   detailed guide for that folder, under 200 lines: what each file is, how
   to maintain it, its fields, its statuses, the steps. Each folder
   `AGENTS.md` has a `CLAUDE.md` beside it holding the one line `@AGENTS.md`
   (tested: `folder-instructions-load-test.md`).
7. `system/README.md` is not created. `system/AGENTS.md` lists the
   documents.
8. Every numbered rule in a `system/` document carries one mark: Draft,
   Approved (with the DEC), Built (with the work item that delivered it), or
   Retired. The document's Status line is Not started, Draft, or Approved.
9. A decision's status is Open, Decided, Superseded, or Withdrawn. Each
   entry holds: ID, short title, Status, Raised (date, who), Decided (date,
   who), the decision, why, what it affects (work items and rule IDs), what
   it replaces or is replaced by, and its sources (SRC IDs).
10. ID prefixes: DEC-### decisions, SRC-### sources, CON-## constraints,
    ARC-## architecture, DAT-## data model, SEC-## security, AUT-##
    automation, INT-## integrations.
11. Closing a work item asks one required question: did this change
    `system/` or `DECISIONS.md`? The item cannot close until the answer is
    recorded in it. Done, Cancelled, and closed-by-hand all pass through
    this step.
12. A lesson that is not proven yet stays in the work item's Notes. The
    closing step asks whether it moves up or is dropped.
13. Memory holds where work stopped plus pointers (an ID and a link), never
    a restated fact. The decision template, the topic template, and the
    glossary leave `memory/`.
13a. Every memory entry, in local files or in Notion, carries the date it
    was created and the date it was last changed (the owner, comment on
    the review page).
14. A work item has no `references/` folder. Every original goes to
    `sources/`; the item holds the SRC ID. An original that should not be
    in Git (large, personal data, a refused file type) still gets its SRC
    number and a line in the list saying where it is kept.
15. `delivery/` is in every project: `releases/`, `deployments/`,
    `migrations/`, `client-handoffs/`. The old `meeting-notes/` and
    `references/` go to `sources/`; `communications/` and `deliverables/`
    go to `client-handoffs/`; `archive/` is removed.
16. `ai-external-knowledge/` becomes `reference/outside-docs/`.
    `reference/current-system/` holds the record of the system as it is
    today.
17. Removed from the starter: `project-wide-records/`, `requirements/`,
    `system-guide/`.
18. Test every written rule: template field, check, or delete. Keep a
    sentence only when none of those can carry it.

19. Every agent that edits a skill, a rule, a template, or an `AGENTS.md`
    file reads these first and keeps to them: the repository `AGENTS.md`
    rules "Skills", "Rule files", "Plain English", and "Wording and overlap
    review"; `dev/research/skill-writing-guide.md`;
    `dev/research/rules-best-practices.md`; the captured official pages in
    `ai-external-knowledge/` on Agent Skills and Claude Code skills; and the
    `skill-creator` skill where the agent has it. Wording is plain, clear,
    ordinary English: terse, technical, no figurative language, one meaning
    per instruction.

Still waiting for the owner's yes: the checking script (new code under the
"Code limit" rule). Do not write it, and do not write text that depends on
it existing.

## 3. The project layout

```
PROJECT.md
PROJECT-ROADMAP.md            local work items only
README.md
AGENTS.md  CLAUDE.md          the outline and the filing table; CLAUDE.md holds @AGENTS.md
DECISIONS.md                  rules for an entry in a kept comment at the top
SOUL.md                       when the owner chose one
work-items/                   local work items only
  AGENTS.md  CLAUDE.md
  PROJECT-TASKS.md
  work-item-template/  WORK-ITEM.md  DESIGN.md
memory/                       local memory; Hindsight keeps only CURRENT_STATE.md
  AGENTS.md  CLAUDE.md
  CURRENT_STATE.md
  MEMORY.md
system/
  AGENTS.md  CLAUDE.md
  glossary.md  constraints.md  architecture.md  data-model.md
  security-model.md  automation.md
  integrations/  README.md  INTEGRATION-TEMPLATE.md
  diagrams/
sources/
  AGENTS.md  CLAUDE.md
  README.md                   the list: ID, date, from whom, what, where kept, used by
delivery/
  AGENTS.md  CLAUDE.md
  releases/  deployments/  migrations/  client-handoffs/
reference/
  AGENTS.md  CLAUDE.md
  outside-docs/  current-system/
tests/
  TEST-PLAN-TEMPLATE.md
.claude/  rules/  skills/  hooks/  settings.json  output-styles/
.agents/skills   .codex/
```

Salesforce adds: `sfdx-project.json`, `.forceignore`, `tools/`, the
Salesforce templates inside `delivery/` (component tracker, deployment and
release-cutover templates, migration area template, `data-loads/`,
`production-backups/`), `.claude/protected-orgs.json`, the two guards, the
Salesforce rules, the three `sf-*` skills.

Every `system/` document is created from its template with Status
"Not started" and no invented facts. Each has: Status, Last changed via
DEC-###, Governs; Overview; Content with numbered rules and their marks;
Open questions (DEC links only); Changelog (date | change | DEC | WI).

## 4. The filing rule

File at the narrowest scope that covers everyone affected.
- One work item: the requirement and the decision go in the work item.
- Several items, one system area: the requirement goes in that area's
  `system/` document; the decision goes in `DECISIONS.md`.
- Several areas: the requirement goes in `system/constraints.md`; the
  decision goes in `DECISIONS.md`.
- The test: would an agent working on a different item need to know this?
  If yes, file it in the wider home and leave a one-line pointer with its ID
  in the item.

## 5. The skills

| Skill | One job | Never does |
| --- | --- | --- |
| `running-work-item-lifecycle` | Runs one work item from idea to Done; its `references/closing.md` asks the closing question | Writes `DECISIONS.md`, `sources/`, or `system/`; says where an item is stored; runs the merge |
| `using-work-tracker` (local, Notion, GitHub versions) | Stores and finds work items | Decides what to save; approves; files an original |
| `filing-project-records` | Files what more than one item needs, through `references/record-decision.md`, `file-source.md`, `update-system-doc.md`, each with its template in `assets/` | Records one item's own decision; writes memory; commits (that is `publish-docs`) |
| `curating-project-memory` | Keeps memory to where work stopped plus pointers; writes the owner's standing instructions to the rules | Holds a fact, a decision, or a term |
| `using-memory-store` (local, Notion versions) | Stores Current State and pointer lines | Decides what a line says |
| `using-notion-cli`, `handoff`, `session-summary`, `braindump`, `explain-simply`, `publish-docs`, `merge-and-clean-up`, `pull-latest`, `reset-to-remote`, the three `sf-*` | As audit 2, section 8.3 | As audit 2, section 8.3 |

One owner per event: audit 2, section 8.4, with the names above.

## 6. No if-then blocks

Audit 1, section 12.1 lists all 53 blocks and where each goes: a file that
exists only for that choice, one sentence true for every choice, or deleted.
New choice-only rule files hold what remains: one for Hindsight memory, one
for Notion, and the Salesforce rule files. The settings files
(`.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`) are
machine settings; setup still combines them. The fill-ins in `PROJECT.md`
(project name, "Toolkit settings" values) stay: they fill a blank.

The Salesforce rows stay in the root map, marked "Salesforce", so the map is
complete in one file that reads the same in every project.

## 7. Not in this branch

- Notion databases for decisions and sources (decision 5).
- The checking script, until the owner says yes.
- Notion memory's database layout and Hindsight's own saving: they keep
  their storage as it is. Pointer-only memory is applied to the process
  skill and to local memory. What Notion memory and Hindsight store is a
  separate decision for the owner.
- Whether a sub-item copies its parent's requirements or points to them.

## 8. Order of the build

1. One folder per setup choice (a move; no project file's words change).
2. Rename the skills and every mention.
3. The starter files: the root and folder instruction files, `DECISIONS.md`,
   `system/`, `sources/`, `delivery/`, `reference/`, the removals, the marker
   blocks out of `PROJECT.md` and `README.md`, the choice-only rule files,
   and the rule files trimmed per audit 1.
4. The skills' content per audit 2, and the templates inside them.
5. The hooks, the setup instructions (new projects, "update the toolkit",
   and the move-over for a project on the old layout), and the tests.
6. Reviews by separate agents (wording, overlap, best practices), fixes, and
   the reviewer's re-read.
7. All checks, the routing test in both hosts, the version number, and
   `dev/PROGRESS.md`.
8. HarborDesk is created from the branch with the real setup steps for the
   owner to look at.

## 9. Settled during the build (2026-10-05)

- Built and on the branch: one folder per setup choice; the five skill
  renames; the root `AGENTS.md`, `DECISIONS.md`, `system/`, `sources/`,
  `delivery/`, `reference/`, the folder guides, and the three choice-only
  rule files `hindsight-memory.md`, `notion-records.md`,
  `salesforce-project.md`.
- The official pages were captured again on 2026-10-05. What changed and
  matters here: a folder's `CLAUDE.md` and a path-scoped rule now load when
  the agent reads or changes a file in scope (Claude Code 2.1.288);
  `UserPromptSubmit` also runs on turns the app starts itself; Codex has a
  newer plugin manifest form (a root `plugin.json`), and the older
  `.codex-plugin/plugin.json` still works. No change to skill frontmatter,
  the description limit, `paths`, `claudeMdExcludes`, or how Codex reads
  `AGENTS.md`.
- The builder of the starter files chose these, and they stand unless the
  owner changes them in his review: new `DECISIONS.md` entries go at the
  end; a source file is named `SRC-###-<short-name>` and has no status; a
  rule in `system/` has the form Mark, Rule, Conditions and exceptions,
  Source; IDs have two digits (three for DEC and SRC).
- Each instruction lives in one file. A skill never repeats what the root
  `AGENTS.md` or a folder guide says: it points to it.
