# Audit 1: rules, AGENTS.md files, templates, and hooks

Read-only audit of the starter project in Toolkit V2, measured against the new folder layout. Date: 2026-10-05.

How to read this report:

- Every path is relative to the starter project, `plugins/toolkit/skills/project-setup/assets/model/`, unless it starts with `assets/hooks/`, `assets/settings/`, or `ai-external-knowledge/`.
- `rules/<name>.md` means `.claude/rules/<name>.md`. `AGENTS.md` with no folder means the starter project's root `AGENTS.md`.
- A number after a colon is a line number in that file.
- "Verified" means I read it in a file. "Inference" means I concluded it and no file says it directly.
- `record-decision`, `file-source`, `update-system-doc`, and `close-work-item` are the proposed new skills. They do not exist yet. Another audit covers the skills folders.
- `V-01` to `V-44` are the proposed validator checks, listed in section 6.

## 1. Summary

The audit found 272 in-scope rules: 69 in the root `AGENTS.md`, 22 in the three folder `AGENTS.md` files, 65 in the 19 rule files, 112 in the templates, and 4 in hook text.

**Counts per bucket.** A rule can sit in more than one bucket, and 78 do, so the numbers add up to more than 272.

| Bucket | Rules |
|---|---|
| Routing (a row in the root table) | 44 |
| Folder (a folder-level instruction file) | 23 |
| Skill (a procedure) | 58 |
| Validator (a script check) | 95 |
| Template field | 94 |
| Delete | 37 |

- 153 of the 272 rules (56 percent) need no sentence at all once their template field or check exists, or because they are deleted: 37 deleted, 44 template field only, 29 validator only, 43 both.
- 50 rules disagree with the new layout in some way (section 4.2).
- 29 rules are stated in more than one place (section 3).
- The 95 validator rules reduce to 44 checks (section 6), 15 of them in a suggested first version.
- Setup markers: 53 blocks today, 0 under the proposal in section 12.

**The five findings that matter most.**

1. **Closing a work item has no field and no check.** Three places say in prose that the lasting record is updated after delivery (root `AGENTS.md`:55, `requirements/AGENTS.md`:3, `TARGET-ARCHITECTURE.md`:14), each in different words. The work item template has no field that records it was done, and no hook looks. Verified. The fix proposed here: a `promoted:` field, a "Promoted to" column in Questions and Answers, check V-13, and the `close-work-item` skill (rows A-090, A-268).
2. **Folder-level `AGENTS.md` files do not load by themselves today, in either product.** The starter project has a root `CLAUDE.md`, so Claude Code reads "`CLAUDE.md` files only", and Codex reads a nested file only when it is started in that folder. The three folder files are read only because one line in the root says to (`AGENTS.md`:38). Verified in the captured documentation; see answer A.
3. **No hook checks any record today, with one exception.** The three hook commands and the helper-agent entry only remind. The exception is the size and age of Current State, and a missing date passes that check. Verified (section 2.6). Every "must always be true" rule is prose.
4. **The same rule is written many times, and the new layout changes most of the copies.** "A decision goes in the item first, then to memory" is stated in 12 places. "`work-items/` and `memory/` are Git-ignored and only in the main checkout" is stated in 14. The Current state rule is stated in 8 places. Each change to the layout is 7 to 14 edits unless the copies are collapsed first (section 3).
5. **The new layout leaves six questions the current rules answer.** It has no status for "approved and verified as built" (X-07), no value for a withdrawn decision (X-06), no home for unproven lessons, `delivery/archive/`, or the four client-work folders (X-08), no ID prefix for rules in `data-model.md`, `architecture.md`, and `automation.md` (X-10), it reverses which record is the authority and which is the pointer (X-11), and setup removes `delivery/` from a project that is not Salesforce while the layout keeps it for all (section 12.2). These need the owner's call before the rules are rewritten.

**What I could not determine.** Whether Claude Code expands an `@AGENTS.md` import inside a nested `CLAUDE.md` that loads later; whether either Claude Code mechanism loads for a file in the main checkout when the session runs in a worktree; whether Codex blocks `git commit --no-verify`; and the state-to-status table, which lives in a skill outside this audit. The validator sizes are estimates.

## 2. Inventory

One row per in-scope rule. A rule is in scope when it says where something is filed, what a record must contain, when a record is updated, or how IDs, statuses, and links work.

Buckets: **Routing** (a row in the root `AGENTS.md` table), **Folder** (a folder-level instruction file), **Skill** (a procedure), **Validator** (a script check), **Template field** (the template already has, or should have, the field, so the sentence can go), **Delete**.

### 2.1 Root `AGENTS.md`

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
|---|---|---|---|---|---|
| A-001 | AGENTS.md:1-5 | Keep work continuous across sessions and record only curated, intentional information. | Delete | Nowhere | It names no file and no moment to act. The specific rows below do the work. |
| A-002 | AGENTS.md:11 | The agent keeps the work tracker, memory, and project records current. | Delete | Nowhere | A general duty. Each record's own check replaces it. |
| A-003 | AGENTS.md:27 | The session-start hook adds Current State to the agent's context. | Delete | Nowhere | A fact about a hook. The hook's output already starts with "Current State:" (`assets/hooks/session-start.mjs`:32). |
| A-004 | AGENTS.md:29, 32, 35 | When Current State is missing, read `memory/CURRENT_STATE.md` in the main checkout, or the Notion page. | Delete | Nowhere | The hook prints this same instruction at the moment it fails (`session-start.mjs`:33-35 and 67-70). |
| A-005 | AGENTS.md:38 | Before editing files in a folder that has its own `AGENTS.md`, read that file. | Routing | Root `AGENTS.md`: a "Read first" column in the routing table | Today this one line is the only thing that puts a folder file in front of either product (see answer A). Keep it. |
| A-006 | AGENTS.md:41 | When a message continues a work item, find the item: the one named, else the branch's or chat's item, else the one Current State names. | Skill | `managing-work-items` | An ordered procedure. |
| A-007 | AGENTS.md:42 | Read the item's Current state before acting and again after resume, clear, or compaction, then do its Next action. | Skill | `managing-work-items` | A procedure. The compaction half is already printed by the hook (`session-start.mjs`:9-12). |
| A-008 | AGENTS.md:43 | When the item's fields disagree with its Next action, follow the fields and rewrite the Next action. | Validator + Skill | V-06, V-07; `managing-work-items` | A script can find the disagreement. The skill says how to fix it. |
| A-009 | AGENTS.md:44 | When the owner's plan changes, rewrite the item's Next action. | Skill | `managing-work-items` | A step in a procedure. |
| A-010 | AGENTS.md:50 | `PROJECT.md` holds purpose, scope, owners, systems, and "Toolkit settings". | Routing | Routing table row | Always relevant. |
| A-011 | AGENTS.md:52 | `PROJECT-ROADMAP.md` holds the project's phases and the top-level work items in each. | Routing | Routing table row | Always relevant. |
| A-012 | AGENTS.md:55 | `requirements/` holds agreed behavior by area and is updated when an item reaches Reflecting. | Routing + Skill | Routing: the area's doc in `system/`. Skill: `close-work-item` calls `update-system-doc` | The folder is removed. "Updated at Reflecting" is the promotion step. |
| A-013 | AGENTS.md:56 | `system-guide/` holds the verified structure of the current system, one file per area. | Routing | `system/` for the approved description; `reference/` for the as-is inventory | The folder is removed. See conflict X-07 for the missing "verified" status. |
| A-014 | AGENTS.md:57 | `project-wide-records/` holds domain maps, shared questions, people, target direction, and intake receipts. | Delete | Nowhere | The folder is removed. Rows A-074 to A-077 give each kind's new home. |
| A-015 | AGENTS.md:58 | `tests/` holds test plans, and an item's test plan is written there, never in the tracker. | Routing + Validator | Routing table row; V-34 | Always relevant, and the file name can be checked. |
| A-016 | AGENTS.md:59 | `ai-external-knowledge/` holds captured outside documentation, one folder per topic, listed in `INDEX.md`. | Routing + Validator | `reference/outside-docs/`; V-33 | The folder is renamed. The index can be checked. |
| A-017 | AGENTS.md:61 | `work-items/` holds one folder per item (`<ID>.md`, `DESIGN.md`, `references/`), `PROJECT-TASKS.md`, and the template; Git ignores it and it is only in the main checkout. | Routing + Folder | Routing table row; `work-items/AGENTS.md` | The `references/` part conflicts with the new layout: sources go in `sources/`. |
| A-018 | AGENTS.md:64 | `memory/` holds Current State, the index, the glossary, decision records, and topic notes; Git ignores it. | Routing + Folder | Routing table row; `memory/AGENTS.md` | Conflicts with the new layout: the glossary moves to `system/glossary.md`, decisions to `DECISIONS.md`, and notes become pointers. |
| A-019 | AGENTS.md:64 | Never edit `memory/MEMORY.md`; the session-start hook writes it. | Delete | Nowhere | The hook rewrites the file at every session start (`session-start.mjs`:59-63), and the file's first line says so (`memory/MEMORY.md`:1). |
| A-020 | AGENTS.md:67 | In a Hindsight project, `memory/CURRENT_STATE.md` is the only memory file in the folder. | Routing | Routing table row, kept by the setup marker | Always relevant in that project. |
| A-021 | AGENTS.md:70 | In a Salesforce project, client files (briefs, messages, meeting notes, transcripts) go in `delivery/` by kind, never in an item's `references/` folder. | Routing | `sources/` (SRC-###) for every project type | Conflicts with the new layout. |
| A-022 | AGENTS.md:71 | `delivery/data/` holds production data loads and backups, which are never committed. | Routing + Validator | Routing table row; V-36 | The two `.gitignore` files there already stop it (`delivery/data/data-loads/.gitignore`:1-5). |
| A-023 | AGENTS.md:72 | `delivery/deployment/` holds the project-wide package, work-item packages, release cutovers, and manual deploy steps. | Routing | Routing table row | Always relevant. |
| A-024 | AGENTS.md:73 | `force-app/` holds Salesforce source and `tools/` holds the impact and permission tools. | Routing | Routing table row (Salesforce projects) | Always relevant there. |
| A-025 | AGENTS.md:75 | `.claude/` holds rules, skills, hooks, and settings, and a rule or skill changes only with the owner's yes. | Routing | Routing table row | Always relevant. It also covers folder-level instruction files. |
| A-026 | AGENTS.md:89 | When a decision is needed, add a Questions and Answers row with "Decision needed from: owner". | Template field | `WORK-ITEM.md` Questions and Answers, column "Decision needed from" (it exists, line 128) | The column already asks for it. |
| A-027 | AGENTS.md:90 | Set the item's `waiting_on` to `owner` and write its Next action in the waiting form. | Template field + Validator | Front matter `waiting_on`; V-06 | The field exists. A script can check the two agree. |
| A-028 | AGENTS.md:91 | When the owner answers, record it in the row at once, update `waiting_on`, and rewrite the Next action. | Skill + Validator | `managing-work-items`; V-08 | The step is a procedure. The result can be checked. |
| A-029 | AGENTS.md:99 | A new request, idea, or bug becomes a new work item. | Routing | Routing table row | Always relevant. |
| A-030 | AGENTS.md:100 | An administrative task that belongs to no work item goes in the project's tasks. | Routing | Routing table row | Always relevant. |
| A-031 | AGENTS.md:102, 105 | The requirements, questions, tasks, progress, history, design, and source files of one change go in that work item (a Salesforce client file stays in `delivery/`). | Routing | Routing table row: the work item file and its `DESIGN.md`; sources go to `sources/` | The source-file part conflicts with the new layout. |
| A-032 | AGENTS.md:107 | Where one item stands now goes in its Current state block, rewritten in place after each step. | Routing + Template field | Routing table row; `WORK-ITEM.md`:27-39 | The block exists in the template. |
| A-033 | AGENTS.md:108 | A decision made while working an item goes in that item's Questions and Answers as a row marked Decision? yes, with the owner's words and the date. | Routing + Template field | Routing table row (decision for one item); the columns exist (`WORK-ITEM.md`:128) | This is the narrowest-scope case of the new filing rule. |
| A-034 | AGENTS.md:109 | A decision a later item will need also gets a memory record, after the owner's yes, that links back to the item and its Q-ID. | Routing + Skill | `DECISIONS.md` (DEC-###) with a one-line pointer in the item; `record-decision` | Conflicts with the new layout: memory never restates a fact. |
| A-035 | AGENTS.md:110 | A project-wide decision that belongs to no work item goes straight to a memory record. | Routing + Skill | `DECISIONS.md`; `record-decision` | Conflicts with the new layout. |
| A-036 | AGENTS.md:111 | A question that affects several items goes in `project-wide-records/questions/`, and its answer is kept in the owning item or the decision source. | Routing | `DECISIONS.md`, status Open | Conflicts with the new layout. One home ends the two-record split. |
| A-037 | AGENTS.md:112 | A route through one domain, a shared target direction, or detailed decision authority goes in `domains/`, `target-architecture/`, or `people/`. | Delete | `system/README.md` (the index), `system/architecture.md` (status Draft), and the people table in `PROJECT.md` | The folder is removed. |
| A-038 | AGENTS.md:113 | A source that affects several items stays in its existing source home, and only a receipt goes in `project-wide-records/intake/`. | Routing + Skill | `sources/` (SRC-###); `file-source` | Conflicts with the new layout. The receipt becomes the "Used by" field of the SRC entry. |
| A-039 | AGENTS.md:114 | A decision about something that is not a work item yet becomes a new work item with the decision as its first row. | Skill | `record-decision`, as one branch | An edge case. It overlaps A-035 (see conflict C-08). |
| A-040 | AGENTS.md:115 | What is in progress and where the next session starts go in Current State; a shared question is linked there only while it blocks active work. | Routing | Routing table row | Always relevant. |
| A-041 | AGENTS.md:116 | The owner's preference for how the agent works goes in `.claude/rules/owner-preferences.md`, never in a host setting or hook. | Routing | Routing table row | Always relevant. |
| A-042 | AGENTS.md:117 | A lasting fact, an unproven lesson, or a hard-to-find reference goes in memory. | Routing | A fact goes to `system/` or `DECISIONS.md` and memory keeps a pointer. An unproven lesson has no home in the new layout | Conflicts with the new layout. Needs the owner's call (X-08). |
| A-043 | AGENTS.md:118 | Project terms go in the glossary, through the memory skill. | Routing | `system/glossary.md` | Conflicts with the new layout. |
| A-044 | AGENTS.md:119 | How agents should work, or a proven procedure, becomes a rule or a skill with the owner's yes, never memory. | Routing | Routing table row | Always relevant. |
| A-045 | AGENTS.md:124 | Local work item IDs look like `WI-001`, with the prefix set in `PROJECT.md`. | Template field + Validator | `PROJECT.md` "Work item ID prefix" (line 89); V-02 | The field exists. The format can be checked. |
| A-046 | AGENTS.md:127-128 | In a Notion project the tracker is the Work Items database, the owner's edits win, IDs look like `WI-31`, and a card is found by its ID. | Skill | `tracking-work-items` (Notion) | A storage fact for one tracker. The root keeps one line naming the tracker. |
| A-047 | AGENTS.md:131-132 | In a GitHub project the tracker is Issues, an ID is written `#12`, and file names use the number without `#`. | Skill + Validator | `tracking-work-items` (GitHub); V-34 | A storage fact. The file-name form can be checked. |
| A-048 | AGENTS.md:135-136 | In a Jira project the tracker is Jira and an ID is the Jira key. | Delete | Nowhere until Jira skills exist | The text itself says the skills are not built and setup does not offer Jira. |
| A-049 | AGENTS.md:138 | The project has one tracker, and items are never copied into a second tracker or a local list. | Folder | `work-items/AGENTS.md`, or the tracker line in the root for Notion and GitHub projects | A script cannot see a second tracker. |
| A-050 | AGENTS.md:138 | Refer to items by ID, never by path or link. | Validator | V-41 | Checkable for paths. The "never by link" half disagrees with six templates (conflict C-02). |
| A-051 | AGENTS.md:139 | Keep each design with its item after delivery. | Folder | `work-items/AGENTS.md` | In the new layout the lasting parts are promoted at close and the design stays with the item. |
| A-052 | AGENTS.md:139 | The roadmap names items by ID, and item detail stays with the item. | Template field + Validator | `PROJECT-ROADMAP.md`:30; V-12 | The line format exists. The IDs can be checked. |
| A-053 | AGENTS.md:141, 144 | Change memory only through `managing-project-memory`; `managing-work-items` and `handoff` also edit Current State. | Folder | `memory/AGENTS.md` | How one folder works. |
| A-054 | AGENTS.md:150 | When you create or update something in Notion, fill every field you have information for. | Skill | `tracking-work-items` and `storing-project-memory` (Notion) | A step in a storage procedure. |
| A-055 | AGENTS.md:152 | Every memory names the work items it concerns by ID, with a link when there is one. | Template field + Validator | The pointer line of a memory note; V-18 | In the new layout this is all a memory note holds. |
| A-056 | AGENTS.md:152 | Search memory before asking the owner to repeat something. | Skill | `managing-project-memory` | A behavior, not a record rule. |
| A-057 | AGENTS.md:152 | Never store secrets, email addresses, or work-item status in memory. | Validator | V-43 for email addresses | The status half follows from "pointers only". Secrets need a separate scanner, which is out of scope. |
| A-058 | AGENTS.md:159 | A source, question, person, or target direction that spans several items goes to `managing-project-wide-records`. | Delete | Replaced by `record-decision`, `file-source`, and `update-system-doc` | The folder and its skill are removed. |
| A-059 | AGENTS.md:161 | To start the next item, take started work first, then the earliest phase that is not Done, then the highest-priority Backlog item. | Skill | `managing-work-items` | An ordered procedure. |
| A-060 | AGENTS.md:162 | To report where the project stands, read Current State, the open items and questions, and memory records marked `needs-review` or `proposed`. | Skill | `managing-work-items`; in the new layout also the Open rows of `DECISIONS.md` | A procedure. |
| A-061 | AGENTS.md:170 | Save an agreed edit to a committed project document with `publish-docs`; a change to the phases goes to `managing-work-items` first. | Skill | `publish-docs`; its path list becomes `system/`, `sources/`, `DECISIONS.md`, `delivery/`, `reference/`, `tests/` | The list names three removed folders. |
| A-062 | AGENTS.md:172 | In a Notion project, read and change work items only through the two work-item skills, whatever Notion tool is at hand. | Routing | The tracker line in the root | Always relevant in that project. |
| A-063 | AGENTS.md:174 | A decision that answers no open question becomes a row marked Decision? yes in its work item. | Delete | Nowhere | The same rule as A-033. |
| A-064 | AGENTS.md:175 | A project to-do goes in the item it concerns, the project's tasks, or a new Backlog item; a personal errand goes to Todoist. | Delete | Nowhere | The same rules as A-029 and A-030. The Todoist half is one owner's preference. |
| A-065 | AGENTS.md:177-183 | Keeping, correcting, forgetting, and looking up memory go to `managing-project-memory`, which uses `storing-project-memory`. | Routing | One routing table row | Always relevant. |
| A-066 | AGENTS.md:186 | In a Hindsight project, edit `memory/CURRENT_STATE.md` directly, within its line limits. | Folder + Validator | `memory/AGENTS.md`; V-17 | How the folder works. The limits can be checked. |
| A-067 | AGENTS.md:188 | Never save project memory in a host's own memory feature or another plugin's. | Folder | One line in `memory/AGENTS.md` | Claude Code already has it turned off (`.claude/settings.json`:7 and 9). The line is for Codex. |
| A-068 | AGENTS.md:191 | When Salesforce metadata changes, or a deploy result or manual step arrives, use `sf-component-tracker` before building. | Routing | The skills list | Always relevant in a Salesforce project. |
| A-069 | AGENTS.md:210 | Keep the rules list matching `.claude/rules/` in the same edit. | Validator | V-40 | Fully checkable. |

### 2.2 Folder `AGENTS.md` files

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
|---|---|---|---|---|---|
| A-070 | memory/AGENTS.md:3 | This folder is local memory; Git ignores it and it exists only in the main checkout. | Folder | `memory/AGENTS.md` | How the folder works. |
| A-071 | memory/AGENTS.md:5 | Change and search this folder only through `managing-project-memory`. | Folder | `memory/AGENTS.md` | The same rule as A-053. Keep this copy. |
| A-072 | project-wide-records/AGENTS.md:3 | The folder holds five kinds of records, one record per subject, each copied from a template when it meets its threshold. | Delete | "One record per subject" becomes one DEC row per decision and one SRC entry per original (V-20, V-30) | The folder is removed. |
| A-073 | project-wide-records/AGENTS.md:7 | Make a domain map when an area has enough records to need a route through them. | Delete | `system/README.md` is always present as the index | No threshold is needed. |
| A-074 | project-wide-records/AGENTS.md:8 | Make a shared question when an unresolved issue affects several items. | Routing | `DECISIONS.md`, status Open | The same threshold as the new filing rule. |
| A-075 | project-wide-records/AGENTS.md:9 | Make a person record when the people table in `PROJECT.md` cannot hold the detail. | Delete | The people table in `PROJECT.md` | The folder is removed. |
| A-076 | project-wide-records/AGENTS.md:10 | Make a target architecture record when several items depend on the same intended structure. | Routing | `system/architecture.md`, status Draft until decided | The folder is removed. |
| A-077 | project-wide-records/AGENTS.md:11 | Make an intake receipt when one source affects several items. | Delete | Every retained original gets an SRC entry, always | No threshold is needed. |
| A-078 | project-wide-records/AGENTS.md:13 | Name each record file by its kind's pattern, with lowercase hyphenated slugs, and search for an existing record first. | Validator + Skill | V-20 and V-30 replace the name patterns; the "search first" step goes in `record-decision` and `file-source` | IDs replace file names. |
| A-079 | project-wide-records/AGENTS.md:14 | A shared question's `PQ-` number is one more than the highest, is never reused, and stays the same when its answer changes. | Template field + Validator | The ID column of `DECISIONS.md`; V-20 | The same rule, for DEC-###. |
| A-080 | project-wide-records/AGENTS.md:15 | Keep an item-only question, requirement, design, task, status, and decision in its work item. | Routing | The filing rule under the routing table | This is the new filing rule's first case. |
| A-081 | project-wide-records/AGENTS.md:16 | Accepted behavior goes in `requirements/` and verified structure in `system-guide/`; a target states its approval status, and delivery alone does not verify structure. | Template field | The Status field of each `system/` doc | Conflict X-07: the new status list has no "verified as built". |
| A-082 | project-wide-records/AGENTS.md:17 | Keep each original source once in its source home; a receipt links to it and never copies it. | Folder + Validator | `sources/AGENTS.md`; V-30, V-31 | "Resolve the source home first" disappears: there is one home. |
| A-083 | project-wide-records/AGENTS.md:18 | The answer lives in the owning item or the decision source, and a shared question stays open until every affected record is checked. | Template field + Validator | An "Applied in" column in `DECISIONS.md`; V-24 | The check closes the loop that prose asks for today. |
| A-084 | project-wide-records/AGENTS.md:19 | Link records by stable ID and a usable path or link, and never keep copied statuses, counts, designs, or temporary Notion file addresses. | Validator | V-22, V-41 | Broken pointers can be found. "No copies" is carried by pointer-only templates. |
| A-085 | project-wide-records/AGENTS.md:20 | Keep the people table short and leave out unnecessary personal information. | Delete | Nowhere | `PROJECT.md`:33 says it at the table. |
| A-086 | project-wide-records/AGENTS.md:21 | Records here are saved with `publish-docs`, and this `AGENTS.md` is an instruction file that needs the reviewed route. | Skill | `publish-docs`; A-025 covers instruction files | The folder is removed. |
| A-087 | requirements/AGENTS.md:3 | Keep one folder per business area with one file, made by copying the template folder, and leave the template unchanged. | Delete | `system/` has a fixed list of docs, and the doc template lives inside `update-system-doc` | The folder is removed. |
| A-088 | requirements/AGENTS.md:3 | Record agreed behavior with its conditions, exceptions, and source. | Template field | The rule block in a `system/` doc's Content | The template carries the labels. |
| A-089 | requirements/AGENTS.md:3 | The active work item owns proposed changes, questions, tasks, and history. | Routing | The filing rule | The same rule as A-080. |
| A-090 | requirements/AGENTS.md:3 | Update the area file at the agreed lifecycle point, after confirming what was delivered. | Skill + Validator | `close-work-item`, which calls `update-system-doc`; V-13 | The critical moment. Today no field and no check covers it (A-268). |
| A-091 | requirements/AGENTS.md:3 | Link a design or work item that explains a requirement, and do not copy task history. | Template field | The Changelog of a `system/` doc (date, change, DEC, WI) | The columns carry the links. |

### 2.3 Rule files in `.claude/rules/`

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
|---|---|---|---|---|---|
| A-092 | rules/ai-external-knowledge.md:12 | Save outside documentation as Markdown in `ai-external-knowledge/`, its only home. | Routing | `reference/outside-docs/` | The folder is renamed. |
| A-093 | rules/ai-external-knowledge.md:13-14 | Keep one folder per topic, and list each in the root `INDEX.md`. | Validator | V-33 | Fully checkable. |
| A-094 | rules/ai-external-knowledge.md:18-20 | A captured file is somebody else's writing; what the project concluded goes in the project's own records, linked back. | Folder | `reference/AGENTS.md` | How the folder works. |
| A-095 | rules/ai-external-knowledge.md:21 | When a captured document and the project's truth disagree, the project's truth wins, and the agent says so. | Folder | `reference/AGENTS.md` | How the folder works. |
| A-096 | rules/ai-external-knowledge.md:22 | Never edit a captured document. | Validator + Folder | V-33 (a commit may add a captured page, not change one); `reference/AGENTS.md` | Checkable at commit time. |
| A-097 | rules/component-tracker.md:3 | When Salesforce metadata changes, update `component-tracker.csv`, the full-project `package.xml`, and the item's deployment folder in the same response. | Skill + Validator | `sf-component-tracker`; V-37 | A procedure. A commit-time check can warn when the tracker was not touched. |
| A-098 | rules/component-tracker.md:4-5 | Update the org flags when the owner reports a successful deploy, and never for a failed one. | Skill | `sf-component-tracker` | A step in a procedure. |
| A-099 | rules/confirm-salesforce-changes.md:8 | Record a data-source priority decision in the item's Questions and Answers, and offer a project-wide one to memory. | Delete | Nowhere | The same rule as A-033 and A-034. |
| A-100 | rules/dependency-graph.md:18 | When `tools/kb/_drift_pending.md` exists, correct the affected project notes this session, then delete the file. | Skill | `update-system-doc` (`system/automation.md`, `system/data-model.md`) | Conflict X-09: the written explanation of metadata is a system fact, not memory. |
| A-101 | rules/dependency-graph.md:19 | After a meaningful `force-app/` change, update the written explanation of that metadata in the same session. | Skill | `update-system-doc` | The same conflict. |
| A-102 | rules/dependency-graph.md:21 | Never commit `tools/kb/out/`, the freshness stamp, or the drift file. | Delete | Nowhere | `.gitignore`:11-14 already ignores them. |
| A-103 | rules/keep-work-item-current.md:3 | The work tracker is the source of truth for current work. | Routing | One line in the root | Always relevant. |
| A-104 | rules/keep-work-item-current.md:5 | Keep the item's whole record true: each task's status and who does it, each phase's status, and every field. | Validator + Skill | V-09, V-10; `managing-work-items` | Most of it is checkable. |
| A-105 | rules/keep-work-item-current.md:9 | Current state is five lines: Where it stands, Next action, Waiting on, Blockers, Last updated. | Template field + Validator | `WORK-ITEM.md`:31-39; V-05 | The template has the five labels. |
| A-106 | rules/keep-work-item-current.md:10 | Read the item's Current state first when you open the item. | Skill | `managing-work-items` | The same rule as A-007. |
| A-107 | rules/keep-work-item-current.md:11 | Rewrite the five lines in place after each step. | Skill + Validator | `managing-work-items`; V-05 | The two reminder hooks already prompt for it. A script can check the date. |
| A-108 | rules/keep-work-item-current.md:12 | Never add a line or a dated entry to Current state; what happened is a new Recent History row. | Template field + Validator | The comment at `WORK-ITEM.md`:29; V-05 | The block's shape can be checked. |
| A-109 | rules/keep-work-item-current.md:13 | Keep each Current state line to one or two sentences. | Validator | V-05, as a length limit | Checkable as a length. |
| A-110 | rules/keep-work-item-current.md:14-17 | Write Next action in one of three forms: working, waiting, or finished. | Template field + Validator | `WORK-ITEM.md`:33; V-06 | The template prompt holds the three forms. |
| A-111 | rules/keep-work-item-current.md:18 | When the item waits on the owner, use the waiting form with the first open question. | Validator | V-06 | Fully checkable. |
| A-112 | rules/keep-work-item-current.md:19 | The item's fields win when they disagree with Next action. | Delete | Nowhere | The same rule as A-008. |
| A-113 | rules/keep-work-item-current.md:23 | Save a bulk "yes to all" as one row for each thing it approved, each with the reason shown. | Skill | `managing-work-items` | A step taken when an answer arrives. |
| A-114 | rules/keep-work-item-current.md:24 | Save the owner's requirements and corrections in the item before moving on. | Skill | `managing-work-items` | A step in a procedure. |
| A-115 | rules/keep-work-item-current.md:28 | Moving an item to a later State does not revoke its requirements approval. | Skill | `managing-work-items`, with the states and approvals | A fact about the state list. |
| A-116 | rules/keep-work-item-current.md:32 | Before ending unfinished work, rewrite Current state so Next action names the exact next step. | Validator + Skill | V-05 and V-06 run when the agent stops; `handoff` | The end of a turn is a hook event in both products. |
| A-117 | rules/memory-review-and-save.md:3 | The project's one memory store is the system named under "Memory" in `PROJECT.md`. | Template field | `PROJECT.md`:81 | The field exists. |
| A-118 | rules/memory-review-and-save.md:5 | "The memory save skill" and "the memory find skill" mean `managing-project-memory`. | Delete | Nowhere | Name the skill directly. An alias is one more thing to look up. |
| A-119 | rules/memory-review-and-save.md:9 | Review memory after a remember or forget request, a correction, a decision, a fix, a change of people or tools, a focus shift, a finished item, and a handoff. | Skill | `managing-project-memory` | With pointer-only memory the list shrinks: decisions and facts go to `record-decision` and `update-system-doc`. |
| A-120 | rules/memory-review-and-save.md:10 | A hook reminder is not a save decision. | Delete | Nowhere | The reminder's own text says the skill decides (`assets/hooks/prompt-reminder.mjs`:54-56). |
| A-121 | rules/memory-review-and-save.md:14 | The owner's instructions for how the agent works go to `owner-preferences.md`, never to memory. | Delete | Nowhere | The same rule as A-041. |
| A-122 | rules/memory-review-and-save.md:15 | A save the owner said no to is kept nowhere else. | Skill | `managing-project-memory` | A step in the approval procedure. |
| A-123 | rules/memory-review-and-save.md:19 | Save, correct, forget, and tidy memory only through the memory skill. | Delete | Nowhere | The same rule as A-053 and A-071. |
| A-124 | rules/memory-review-and-save.md:20 | The approval mode is the "Memory approval" line in `PROJECT.md`, and only the owner changes it. | Template field | `PROJECT.md`:84 and 87 | The field exists. |
| A-125 | rules/memory-review-and-save.md:21-22 | A yes approves only what was shown, silence approves nothing, and an unanswered save stays a proposal. | Skill | `managing-project-memory` | The approval procedure. |
| A-126 | rules/memory-review-and-save.md:32 | In a Hindsight project, prune `memory/CURRENT_STATE.md` at each handoff and keep it within Now 5, Waiting 5, Next 3, and under 40 lines. | Validator + Template field | V-17; the comment at `memory/CURRENT_STATE.md`:3 | Fully checkable. |
| A-127 | rules/production-data-changes.md:8 | Backups go in `delivery/data/production-backups/prod-backup-<MMDDYYYY>-<slug>/` and load files in `delivery/data/data-loads/<change-slug>-<MMDDYYYY>/`. | Skill + Validator | `sf-data-change`; V-34 | The date form differs from every other record (conflict C-03). |
| A-128 | rules/production-data-changes.md:9 | Never commit load or backup files. | Validator | V-36 | The two `.gitignore` files already do most of it. The check also catches a forced add. |
| A-129 | rules/project-file-locations.md:5-7 | New projects use `delivery/`; a project that already uses `engagement/` keeps it and reads every `delivery/` path as `engagement/`. | Folder + Validator | One line in `delivery/AGENTS.md`; V-42 | It applies only to older projects, yet it is an always-on rule in every new one. |
| A-130 | rules/project-file-locations.md:8 | Never create `delivery/knowledge-base/`. | Validator | V-42 | Fully checkable. |
| A-131 | rules/publish-project-documents.md:3-11 | These paths are committed project documents: `requirements/**`, `system-guide/**`, `project-wide-records/**`, `ai-external-knowledge/**`, `delivery/**`, and four more. | Skill | `publish-docs`, with the new path list | The list names four removed folders. |
| A-132 | rules/publish-project-documents.md:19 | Saving a document does not approve its requirements or its build. | Template field | The Status field of each `system/` doc | The status says what is approved. |
| A-133 | rules/publish-project-documents.md:22 | `memory/` and `work-items/` are Git-ignored, and their saves do not use the publication route. | Folder | One line each in `work-items/AGENTS.md` and `memory/AGENTS.md` | How those folders work. |
| A-134 | rules/publish-project-documents.md:23 | `project-wide-records/AGENTS.md` is an instruction file. | Delete | Nowhere | The folder is removed. A-025 covers instruction files. |
| A-135 | rules/record-deployment-steps.md:9 | When metadata needs an action the deploy cannot perform, add a step to `manual-steps.md` in the same response. | Skill + Template field | `sf-component-tracker`; the step block in `manual-steps.md` | A procedure with a template. |
| A-136 | rules/record-deployment-steps.md:11 | When unsure, add the step. | Skill | `sf-component-tracker` | A step in a procedure. |
| A-137 | rules/session-handoff.md:3 | Use the `handoff` skill when the owner clears context, ends the session, or asks for a handoff; offer one when the session is long and the next step is complex. | Routing | The skills list | Always relevant. |
| A-138 | rules/session-handoff.md:3 | Before the handoff, rewrite the Current state of each item worked on, review Current State and memory, then write the prompt. | Delete | Nowhere | The `handoff` skill holds its own steps. This restates them. |
| A-139 | rules/shared-repository-work.md:22 | A work item's branch is named `claude/<prefix>-<number>-<slug>`. | Skill | `managing-work-items` | A naming step when work starts. |
| A-140 | rules/shared-repository-work.md:30 | Never hand-edit a generated file. | Delete | Nowhere | The same rule as A-019. |
| A-141 | rules/shared-repository-work.md:31 | Before taking a sequential number, check every tracker folder, worktree, and the remote, and on a collision renumber only your own. | Skill + Validator | `tracking-work-items`, `record-decision`, `file-source`; V-02, V-20, V-30 | The step is a procedure. A duplicate can be found by a script. |
| A-142 | rules/work-item-folders.md:3 | `work-items/` is Git-ignored, sits in the main checkout, and is shared by every worktree. | Folder | `work-items/AGENTS.md` | How the folder works. |
| A-143 | rules/work-item-folders.md:5, 27 | Find, create, change, and move items and their fields with `tracking-work-items`. | Folder | `work-items/AGENTS.md` | The folder's one door. |
| A-144 | rules/work-item-folders.md:9 | An item is a folder `work-items/<ID>-<short-slug>/` holding `<ID>.md`, `DESIGN.md` when a design exists, and `references/` for source files. | Validator | V-02; V-15 for the `references/` part | The shape is checkable. `references/` conflicts with the new layout. |
| A-145 | rules/work-item-folders.md:10 | Only an item's main file is named by the bare ID; a test plan is `<ID>-test-plan.md`. | Validator | V-03, V-34 | Fully checkable. |
| A-146 | rules/work-item-folders.md:11 | The front matter `id:` is the item's identity; find an item by it, never by its path. | Folder | `work-items/AGENTS.md` | How the folder works. |
| A-147 | rules/work-item-folders.md:12 | Keep the file name `<ID>.md` when you create or move an item. | Validator | V-02 | Fully checkable. |
| A-148 | rules/work-item-folders.md:13 | `work-item-template/` is the form, not an item, and only the template is named `WORK-ITEM.md`. | Validator | V-03 | Fully checkable. |
| A-149 | rules/work-item-folders.md:14 | `work-items/PROJECT-TASKS.md` holds the project's own tasks and is not an item. | Routing | Routing table row | The same rule as A-030. |
| A-150 | rules/work-item-folders.md:15 | The next ID is the highest `id:` anywhere under `work-items/` plus one, the first is the prefix plus `-001`, and IDs are never reused. | Skill + Validator | `tracking-work-items`; V-02 | The step is a procedure. Duplicates and the format can be checked. |
| A-151 | rules/work-item-folders.md:16 | Create the new item's folder first, then check every folder for the same ID. | Skill | `tracking-work-items` | A step in a procedure. |
| A-152 | rules/work-item-folders.md:17 | On a duplicate, your own new item takes the next free number, and you never renumber another item. | Skill | `tracking-work-items` | A step in a procedure. |
| A-153 | rules/work-item-folders.md:21 | The owner may move, rename, nest, or group item folders; find each item again by its `id:`, report what moved, and continue. | Folder | `work-items/AGENTS.md` | How the folder works. |
| A-154 | rules/work-item-folders.md:22 | When two items share an `id:`, or a named item cannot be found, tell the owner and fix it with the skill. | Validator | V-02, V-12 | A script finds both cases. |
| A-155 | rules/work-item-folders.md:23 | Never move, group, archive, or rename items on your own initiative. | Folder | `work-items/AGENTS.md` | How the folder works. |
| A-156 | rules/work-item-folders.md:28 | Keep any other files the owner put in an item folder. | Folder | `work-items/AGENTS.md` | Conflict X-03: the new layout says sources never sit in item folders. V-15 only warns. |

### 2.4 Templates

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
|---|---|---|---|---|---|
| A-157 | PROJECT.md:3 | Keep stable project facts here and active tasks in the tracker. | Routing | The `PROJECT.md` row of the routing table | The comment is deleted after setup, so the sentence is lost today. |
| A-158 | PROJECT.md:19 | List approved security, delivery, or operating constraints with their sources. | Template field | `system/constraints.md` (CON-##); `PROJECT.md` keeps a one-line pointer | Otherwise constraints have two homes. |
| A-159 | PROJECT.md:23-25 | Each system or org has a row with its purpose, environment, source of truth, and access notes. | Template field | The same table in `PROJECT.md` | The columns carry it. |
| A-160 | PROJECT.md:29-33 | Each role has a row with the person, responsibility, and source or last-confirmed date; keep the table short and link a person record when needed. | Template field | The same table; drop the link sentence | The linked folder is removed. |
| A-161 | PROJECT.md:47 | Every decision is saved in the item's Questions and Answers first, and a project-wide one also gets a memory record. | Delete | Replace with one pointer line: "Decisions: `DECISIONS.md`" | The same rule as A-033 and A-034. |
| A-162 | PROJECT.md:48-51 | Requirements are in `requirements/`, project-wide records in `project-wide-records/`, the design with its item, and the system guide in `system-guide/` or not used. | Routing | Pointer lines to `system/`, `DECISIONS.md`, and `sources/` | Three of the four folders are removed. |
| A-163 | PROJECT.md:66-68 | The full-project `package.xml` is the component inventory, and a work item's manifest is at `delivery/deployment/<work-item-id>-<short-name>/package.xml`. | Template field + Validator | The same lines; V-34 | The folder name can be checked. |
| A-164 | PROJECT.md:70 | Outside references are in a source register or approved location. | Template field | Fixed values: `reference/outside-docs/INDEX.md` and `sources/` | It is no longer a choice. |
| A-165 | PROJECT.md:74 | Write only stable project-specific conventions here, each with its source. | Template field | The same section, or `system/constraints.md` | The two overlap. Needs the owner's call. |
| A-166 | PROJECT.md:78-112 | Keep each "Toolkit settings" label exactly as written, with one of the allowed values. | Template field + Validator | The same section; V-38 | The hooks and skills read these labels. |
| A-167 | PROJECT-ROADMAP.md:3 | Keep one table row and one matching heading per phase, with the same ID and name. | Validator | V-39 | Fully checkable. |
| A-168 | PROJECT-ROADMAP.md:5 | The roadmap holds the phases in order and the top-level items in each; each item holds its own detail. | Template field | The same intro line | The file says it in place. |
| A-169 | PROJECT-ROADMAP.md:21-28 | Each phase has an outcome, an exit condition, dependencies, and a status. | Template field + Validator | The same table; V-39 | The template never lists the allowed status values (conflict C-07). |
| A-170 | PROJECT-ROADMAP.md:30 | List each top-level item as `[[WI-031]]` and its title, one per line, or "None yet." | Template field + Validator | The same list; V-12 | The IDs can be checked. |
| A-171 | PROJECT-ROADMAP.md:34 | Put only questions about phase scope, order, or milestones here; work-item questions go in the item. | Template field | The section becomes a list of DEC-### links with status Open | Otherwise open questions have a third home. |
| A-172 | PROJECT-ROADMAP.md:40 | Record each approved planning change with its date and source. | Template field | The same list, with the DEC-### | The decision is the source. |
| A-173 | README.md:24-31 | The project records list names `requirements/` and `project-wide-records/`. | Template field | The same list, rewritten for the new folders | Two removed folders. |
| A-174 | README.md:42 | Each work item is a folder holding its ID file, a design, and `references/`; the owner may move folders. | Delete | One line for people is enough | The same rules as A-144 and A-153. |
| A-175 | README.md:50 | A memory names each work item by ID, and the hook rebuilds `MEMORY.md`. | Delete | Nowhere | The same rules as A-055 and A-019. |
| A-176 | memory/CURRENT_STATE.md:3 | Under Now, keep one line per active item with its ID and a few words, and never copy the item's own Current state. | Template field + Validator | The Now prompt (line 9); V-17 | The prompt carries it. The line shape can be checked. |
| A-177 | memory/CURRENT_STATE.md:3 | Write "None" in an empty section. | Template field + Validator | V-17 | Fully checkable. |
| A-178 | memory/CURRENT_STATE.md:3 | Keep Now to 5 lines, Waiting on the owner to 5, Next session starts with to 3, and the file under 40 lines. | Validator | V-17 | The hook checks only the total and the age today. |
| A-179 | memory/CURRENT_STATE.md:3 | Remove a line the moment it stops being true; each skill removes its own kind of line. | Skill | `managing-work-items`, `handoff`, `managing-project-memory` | A step in three procedures. |
| A-180 | memory/CURRENT_STATE.md:5 | Give Last updated as a date, a source, and the person or agent. | Template field + Validator | Line 5; V-17 | Today a missing date passes as fresh (`session-start.mjs`:38-39). |
| A-181 | memory/CURRENT_STATE.md:13 | Under Waiting on the owner, list only a decision that has no work item or an unanswered memory question. | Template field | The same prompt; an Open DEC is named by its ID | The prompt carries it. |
| A-182 | memory/CURRENT_STATE.md:17 | Under Next session starts with, give the item's ID, what to read, and the next action. | Template field | The same prompt | The prompt carries it. |
| A-183 | memory/MEMORY.md:1, 5 | The index is generated: one line per active memory file, leaving out templates and retired, superseded, or withdrawn files. | Delete | Nowhere | Code does it (`session-start.mjs`:45-64). |
| A-184 | memory/decision_template.md:1-13 | A decision record has a name, description, updated date, status, decided-on date, decided-by, work items, and what it supersedes. | Template field | Columns of `DECISIONS.md`: ID, decision or question, Status, Decided on, Decided by, Work items, Supersedes, Applied in | The file per decision is removed; the fields move to one table. |
| A-185 | memory/decision_template.md:17 | A decision record is for a decision a later work item, or an agent working on something else, must follow. | Routing | The filing test under the routing table | The same test as the new layout's. |
| A-186 | memory/decision_template.md:17 | Save the decision in the item's Questions and Answers first; the record does not copy the full reasoning. | Skill | `record-decision` | The direction reverses in the new layout: the DEC row holds the decision and the item holds a one-line pointer. |
| A-187 | memory/decision_template.md:17 | Name the file `decision_<short-name>.md` and set `name` to that stem. | Delete | Nowhere | There is no file per decision. |
| A-188 | memory/decision_template.md:17 | Write each `work_items` entry as `"[[WI-031]]"` for a local item, or the ID and web address in double quotes otherwise. | Template field + Validator | The Work items cell of `DECISIONS.md`; V-12 | The YAML quoting problem goes away in a table. |
| A-189 | memory/decision_template.md:17, 25 | A decision's status is current, superseded, or withdrawn. | Template field + Validator | Status Open, Decided, or Superseded; V-20, V-21 | Conflict X-06: "withdrawn" has no value in the new list. |
| A-190 | memory/decision_template.md:19-23 | The body gives the decision, how to apply it, and where it was decided. | Template field | Columns of `DECISIONS.md` | The fields move. |
| A-191 | memory/project_topic_template.md:1-14 | A topic file has a name, description, updated date, type, status, source, last-verified date, authorization, work items, and what it supersedes. | Template field + Validator | A pointer-only note: title, updated date, and pointers; V-19 | Source, last-verified, and authorization describe facts, and facts leave memory. |
| A-192 | memory/project_topic_template.md:18 | Name a memory file `<type>_<topic>.md`, with the type one of user, project, reference, or event and equal to `metadata.type`. | Validator | V-19 | The hook depends on the prefix (`session-start.mjs`:48). |
| A-193 | memory/project_topic_template.md:18 | A new fact about a concept gets a new section in its topic file, not a new file. | Delete | Nowhere | Memory no longer holds facts. |
| A-194 | memory/project_topic_template.md:22-32 | Each sub-topic gives Remember, Why, How to apply, Evidence and limits, Related memories, and Authoritative records. | Template field | Keep only "Authoritative records", which is the pointer | The other five labels restate a fact. |
| A-195 | memory/project_topic_template.md:18, 34 | Keep "Gotchas and lessons" as the last section, each unproven lesson with a Seen line. | Delete | No home in the new layout | Needs the owner's call (X-08). |
| A-196 | memory/terminology-glossary.md:5 | Record terms whose meanings affect the work, verify each from the owner or an authoritative source, and never infer one. | Template field + Folder | Columns of `system/glossary.md`; one line in `system/AGENTS.md` | The glossary moves to `system/`. |
| A-197 | memory/terminology-glossary.md:7-9 | Each term has its context, meaning, distinction or alias, source, and status or last-checked date. | Template field + Validator | `system/glossary.md`; V-23 | The columns carry it. |
| A-198 | memory/terminology-glossary.md:11-13 | List each naming change as old term, preferred term, reason, source, and date. | Template field | `system/glossary.md` | The list carries it. |
| A-199 | project-wide-records/templates/DOMAIN-MAP.md:3-19 | A domain map links the area's system, requirement, target, question, source, decision, and item records, and copies none of them. | Delete | One row per doc in `system/README.md` | The folder is removed. |
| A-200 | project-wide-records/templates/INTAKE-RECEIPT.md:3-8 | A receipt gives the original source, its date, the intake date, the source owner, a status, and the next action. | Template field | The SRC entry: ID, received date, from whom, what it is, Used by | The receipt and the source record become one entry. |
| A-201 | project-wide-records/templates/INTAKE-RECEIPT.md:12-17 | Sort each finding as an observation, a claim to verify, a proposal, or a question, and give it a destination. | Skill | `file-source` | A procedure. The SRC entry lists the destination IDs. |
| A-202 | project-wide-records/templates/INTAKE-RECEIPT.md:21-27 | Mark the receipt complete only after every finding has a destination and each saved destination was read back. | Skill + Validator | `file-source`; V-32 | The step is a procedure. An empty "Used by" can be found. |
| A-203 | project-wide-records/templates/PERSON.md:3-12 | A person record gives role, decision authority, areas of knowledge, source, and last-confirmed date, and no biography or contact details. | Template field | The people table in `PROJECT.md` | The folder is removed. |
| A-204 | project-wide-records/templates/PROJECT-QUESTION.md:3-10 | A shared question gives its ID, the exact question, the answer owner, the source, a status, the answer's home, the affected records, and the next action. | Template field + Validator | One row in `DECISIONS.md`; V-20, V-21 | The fields move. |
| A-205 | project-wide-records/templates/PROJECT-QUESTION.md:14-22 | Keep an answer history and a check for each affected record. | Template field | The "Applied in" column of `DECISIONS.md` and each `system/` doc's Changelog | The two tables become two fields. |
| A-206 | project-wide-records/templates/PROJECT-QUESTION.md:24 | Mark a question answered when the answer is saved, and incorporated only after every affected record is checked. | Validator | V-24 | A script can check that each doc named in "Applied in" names the DEC back. |
| A-207 | project-wide-records/templates/TARGET-ARCHITECTURE.md:3-10 | A target record gives its scope, a status, the direction, the source, the approving decision, the affected items, and the gaps. | Template field | The header of `system/architecture.md`: Status, Last changed via DEC-###, Governs | The fields move. |
| A-208 | project-wide-records/templates/TARGET-ARCHITECTURE.md:14 | An approved target is not verified current structure; after delivery is checked, update the system guide. | Skill | `close-work-item` | Conflict X-07: the new status list cannot say "verified as built". |
| A-209 | requirements/SYSTEM-DATA-MODEL.md:3 | Hold only accepted data model requirements, each linked to its approving work item and date, and no unapproved design. | Template field + Validator | Status and "Last changed via" in `system/data-model.md`; V-24 | The header fields carry it. |
| A-210 | requirements/SYSTEM-DATA-MODEL.md:7-28 | Each entity gives its business meaning, required fields or links, rules and exceptions, and source and approval; the file ends with a change history. | Template field | Content and Changelog of `system/data-model.md` | The labels carry it. |
| A-211 | requirements/system-area-template/AREA-TEMPLATE.md:3 | Give each behavior one rule block with a stable rule ID, use the same ID in related evidence, and link the approving work item. | Template field + Validator | The rule block of a `system/` doc; V-27 | IDs can be checked for duplicates. |
| A-212 | requirements/system-area-template/AREA-TEMPLATE.md:11-18 | Each rule gives its trigger, required behavior, conditions and exceptions, outcome, source, and delivery status with evidence. | Template field | Content of a `system/` doc | The labels carry it. |
| A-213 | requirements/system-area-template/AREA-TEMPLATE.md:20-34 | Each area also gives data and access rules, integrations and dependencies, acceptance evidence, and a change history. | Template field | `system/security-model.md`, `system/integrations/`, and each doc's Changelog | The sections split across the new docs. |
| A-214 | system-guide/AREA-TEMPLATE.md:3 | Record observed facts only, with the source and last-verified evidence beside each claim, and mark uncertainty under Known gaps. | Template field | The as-is inventory template in `reference/` | The labels carry it. |
| A-215 | system-guide/AREA-TEMPLATE.md:5-31 | Each area gives what it does today, a components table with evidence, data and flow, operational behavior, known gaps, and a last-verified block. | Template field | The as-is inventory in `reference/`, or the Overview of a `system/` doc | Needs the owner's call on which (X-07). |
| A-216 | tests/TEST-PLAN-TEMPLATE.md:3 | Name a test plan `<ID>-test-plan.md` for a work item, or `<release>-test-plan.md` for a release. | Validator | V-34 | Fully checkable. |
| A-217 | tests/TEST-PLAN-TEMPLATE.md:5-23 | A test plan gives scope, environment and data, a checks table, and results with date, tester, outcome, and remaining issues. | Template field | The same template | The labels carry it. |
| A-218 | ai-external-knowledge/INDEX.md:5 | Each topic folder holds the captured pages and a `SOURCE-RECORD.md` with publisher, address, capture date, and coverage; add an index row only for a real topic. | Template field + Validator | `reference/outside-docs/INDEX.md`; V-33 | Fully checkable. |
| A-219 | ai-external-knowledge/INDEX.md:11 | Do not place client files, meeting notes, project decisions, or agent instructions in this folder. | Folder | `reference/AGENTS.md` | How the folder works. |
| A-220 | delivery/archive/item-template/ARCHIVE-RECORD-TEMPLATE.md:5-12 | An archive record gives the former location, date, reason, replacement, scope and owner, and contents; archived material is not current. | Template field | The same template | The new layout does not say whether `delivery/archive/` stays (X-08). |
| A-221 | delivery/data/area-template/DATA-AREA-TEMPLATE.md:5-14 | A data area gives its objects and sources, related requirements and items, a mapping status, a last-checked line, and its files. | Template field + Validator | The same template under `delivery/`; V-35 | The status value can be checked. |
| A-222 | delivery/data/area-template/FIELD-MAPPING-TEMPLATE.md:5-15 | Each mapping row gives source, target, meaning, transformation, required, and evidence; open mapping questions are listed in the file. | Template field | The same table; the questions become Q-ID or DEC-### pointers | It disagrees with A-223 (conflict C-05). |
| A-223 | delivery/data/area-template/TRANSFORMATION-RULES-TEMPLATE.md:3, 11-21 | Each transformation rule has a stable rule ID and its approval names a Q-ID; an unresolved rule stays a question in the work item. | Template field | The same template | The labels carry it. |
| A-224 | delivery/deployment/component-tracker.csv:1 | Each component row gives its type, parent, API name, label, work item, change type, sandbox flag, production flag, and notes. | Template field + Validator | The same header; V-12 for the Work Item column | The header carries it. |
| A-225 | delivery/deployment/full-project-deployment-template/manual-steps.md:5 | Use the full-project file only for full cutover steps; a work item's steps sit beside that item's `package.xml`. | Skill | `sf-component-tracker` | A choice made inside a procedure. |
| A-226 | delivery/deployment/*/manual-steps.md:9-20 | Each manual step gives its order, owner, status, related work item, purpose, actions, and a verify line. | Template field + Validator | The same block; V-35 | The status value can be checked. |
| A-227 | delivery/deployment/release-cutover-template/CUTOVER-PLAN.md:3-9 | Name the release folder `<YYYY-MM-DD>-<release-name>` and give its owner, target org, window, and status. | Template field + Validator | The same header; V-34, V-35 | Fully checkable. |
| A-228 | delivery/deployment/release-cutover-template/CUTOVER-PLAN.md:11-39 | A cutover plan lists the included items, entry conditions, sequence, go or no-go decisions, rollback, and communications. | Template field | The same template | The tables carry it. |
| A-229 | delivery/deployment/release-cutover-template/RELEASE-NOTES.md:5-26 | Release notes give the date, environment, status, a link to the cutover plan, and one row per work item delivered. | Template field + Validator | The same template; V-35 | The status value can be checked. |
| A-230 | delivery/deployment/work-item-deployment-template/DEPLOYMENT-RECORD.md:5-6 | Name the work item by its ID, never a folder path, and name the folder `<work-item-id>-<short-name>`. | Template field + Validator | The same header; V-34, V-41 | Fully checkable. |
| A-231 | delivery/deployment/work-item-deployment-template/DEPLOYMENT-RECORD.md:8, 13-33 | A deployment record gives a status, scope links, a preflight table with the owner's decision and its Q-ID, the execution result, and the component tracker update. | Template field + Validator | The same template; V-35 | The status value can be checked. |
| A-232 | delivery/deployment/work-item-deployment-template/DEPLOYMENT-RECORD.md:37 | Keep detailed work-item history in the tracker. | Delete | Nowhere | The record's header already points to the item by ID. |
| A-233 | delivery/deployment/work-item-deployment-template/destructiveChanges.xml:3 and manual-steps.md:5 | Keep each of these files only when the item removes metadata or has manual steps. | Skill | `sf-component-tracker` | A choice made inside a procedure. |
| A-234 | work-items/PROJECT-TASKS.md:3 | Project tasks sit in one list, each with the ID PT-01 and up, never reused, new ones at the end, and the box ticked only when the done check is met. | Template field + Validator | The same file (its comment stays: "Keep this guide"); V-16 | The comment is read at the moment of the edit. |
| A-235 | work-items/work-item-template/WORK-ITEM.md:2-14 | An item's front matter has thirteen named fields, each with one value from its list. | Template field + Validator | The same front matter; V-01 | Fully checkable. |
| A-236 | work-items/work-item-template/WORK-ITEM.md:19 | Create an item with `tracking-work-items`; `WORK-ITEM.md` is the template's name only; find an item by its `id:`. | Delete | Nowhere | The same rules as A-143, A-146, and A-148. |
| A-237 | work-items/work-item-template/WORK-ITEM.md:19 | Save source files with `tracking-work-items` and list each under Notes, Sources. | Skill + Template field | `file-source`; the Sources list names SRC-### | Conflicts with the new layout. |
| A-238 | work-items/work-item-template/WORK-ITEM.md:19 | A sub-item's `parent` names the item above it. | Validator | V-12 | Fully checkable. |
| A-239 | work-items/work-item-template/WORK-ITEM.md:19 | Use stable phase, task, requirement, and question IDs within the item. | Validator | V-08, V-09, V-10, V-11 | Duplicates can be found. |
| A-240 | work-items/work-item-template/WORK-ITEM.md:19 | Keep one value from each list, and let the status follow from the state. | Validator | V-01, V-07 | The state-to-status table lives in `managing-work-items`, which I did not audit. |
| A-241 | work-items/work-item-template/WORK-ITEM.md:19 | A blocked item has state and status Blocked, `waiting_on` set, and its Waiting on and Blockers lines filled. | Validator | V-07 | Fully checkable. |
| A-242 | work-items/work-item-template/WORK-ITEM.md:19 | Replace or delete every angle-bracket prompt, keep the headings and labels, and delete the guide. | Validator | V-04 | Fully checkable. |
| A-243 | work-items/work-item-template/WORK-ITEM.md:23 | Tasks go in Tasks, decisions in Questions and Answers, and what happened in Recent History. | Template field | The section headings | The headings carry it. |
| A-244 | work-items/work-item-template/WORK-ITEM.md:35 | The Waiting on line matches `waiting_on`. | Validator | V-06 | Fully checkable. |
| A-245 | work-items/work-item-template/WORK-ITEM.md:41 | Related items names the project phase for a top-level item or the parent's ID for a sub-item, and uses IDs, never folder paths. | Template field + Validator | The same line; V-12, V-41 | Fully checkable. |
| A-246 | work-items/work-item-template/WORK-ITEM.md:45 | Only a top-level item has a Roadmap, with at least one phase. | Validator | V-10 | Fully checkable. |
| A-247 | work-items/work-item-template/WORK-ITEM.md:47 | A phase is complete when its tasks are complete, its sub-items are Done or Cancelled, and its exit result was checked. | Validator + Skill | V-10; `managing-work-items` | The first two parts can be checked. |
| A-248 | work-items/work-item-template/WORK-ITEM.md:49 | Each phase ID is identical to its Tasks heading, and each phase lists its sub-item IDs or "None." | Validator | V-10 | Fully checkable. |
| A-249 | work-items/work-item-template/WORK-ITEM.md:58 | Each task gives Work, Deliverable, Done when, Who does it (agent or owner), and Depends on, and its box changes only when the done check is met. | Template field + Validator | The same block; V-09 | The labels carry it. |
| A-250 | work-items/work-item-template/WORK-ITEM.md:84-86 | A sub-item lists its tasks as T01 and up, after a line naming its own sub-items. | Template field | The same form | The form carries it. |
| A-251 | work-items/work-item-template/WORK-ITEM.md:97 | Add one Recent History row, newest first, for each listed kind of change, and name a decision by its Q-ID. | Template field + Validator | The same table; V-44 | The order and the date can be checked. |
| A-252 | work-items/work-item-template/WORK-ITEM.md:105 | Each requirement has its own numbered block with the original words, a goal, functional requirements, and acceptance criteria; a dropped one keeps its block and its number. | Template field + Validator | The same block; V-11 | Fully checkable. |
| A-253 | work-items/work-item-template/WORK-ITEM.md:126 | Each question gets a row with a stable Q-ID, the exact question, the IDs it affects, and who can answer. | Template field + Validator | The same table; V-08 | The columns carry it. |
| A-254 | work-items/work-item-template/WORK-ITEM.md:126 | When the owner answers, put his words and the date in the row, set Status to Answered, and update what the answer affects. | Skill + Validator | `managing-work-items`; V-08 | The step is a procedure. The row can be checked. |
| A-255 | work-items/work-item-template/WORK-ITEM.md:126 | Set Decision? to yes when the answer decides something, and add a row for a decision made without being asked. | Template field | The Decision? column | The column carries it. |
| A-256 | work-items/work-item-template/WORK-ITEM.md:126 | Offer a decision that matters beyond the item for project memory, and save it with a link back that names the Q-ID. | Skill + Template field | `record-decision`; a new "Promoted to" column holding the DEC-### | Conflicts with the new layout. This column is the promotion pointer. |
| A-257 | work-items/work-item-template/WORK-ITEM.md:126 | Keep unanswered rows first, and never leave an open question only in Notes. | Validator | V-08 | The order can be checked. |
| A-258 | work-items/work-item-template/WORK-ITEM.md:135, 149 | Notes do not repeat other sections, and solution options come last and are proposals only. | Template field | The same section | The headings carry it. |
| A-259 | work-items/work-item-template/WORK-ITEM.md:143 | List each source on one line with what it is and what was taken from it, or write "None." | Template field + Validator | The same list, naming SRC-###; V-22 | The pointers can be checked. |
| A-260 | work-items/work-item-template/DESIGN.md:2-4, 11-15 | A design names its work item and gives a status, an approval, the requirements it checked, and a last-updated date. | Template field + Validator | The same header; V-14 | Three different status lists describe one thing (conflict C-01). |
| A-261 | work-items/work-item-template/DESIGN.md:9 | Keep the design beside the item's main file, and when the owner answers, update the design section, the Questions and Answers row, and Current state. | Skill | `managing-work-items` | A procedure. |
| A-262 | work-items/work-item-template/DESIGN.md:17, 25 | The item file holds the goal, state, requirements, questions, tasks, and history; the design says how, never fills a missing requirement, and a recommendation is not approval. | Template field | The same comment and section | The file says it in place. |
| A-263 | work-items/work-item-template/DESIGN.md:27-29, 57-61, 153-157 | Each coverage and acceptance table names the requirement it covers by R-ID. | Template field + Validator | The same tables; V-14 | The R-IDs can be checked against the item. |
| A-264 | work-items/work-item-template/DESIGN.md:94-96 | The owner's decision line names who decided, when, and the Q-ID of the row that records it. | Template field + Validator | The same line; V-14 | Fully checkable. |
| A-265 | work-items/work-item-template/DESIGN.md:102 | Keep the option sections after a choice, and mark a replaced option "Superseded by Option <letter>". | Template field | The same section | The prompt carries it. |
| A-266 | work-items/work-item-template/DESIGN.md:159-165 | Each claim or decision that affects the build names its source, date, evidence type, and how it was checked. | Template field | The same table; the Source cell takes SRC-###, DEC-###, or a Q-ID | The columns carry it. |
| A-267 | work-items/work-item-template/DESIGN.md:175-185 | Open design questions point to their Q-ID in the work item, and design changes are listed with their source. | Template field | The same tables | Already pointer-only, as the new layout asks. |
| A-268 | No file today | Gap: nothing says which parts of a finished item's design and decisions move to the lasting records, and nothing records that it was done. | Skill + Template field + Validator | `close-work-item`; a `promoted:` front matter field and the "Promoted to" column; V-13 | The moment the owner calls critical has no field and no check. |

### 2.5 Rules stated in hook text

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
|---|---|---|---|---|---|
| A-269 | assets/hooks/codex-after-commit.mjs:8-10 | After a commit, update the work item's Recent History and status, and Current State when it changed. | Skill | `managing-work-items`; the reminder stays | A reminder at the right moment. The validator can later check the result. |
| A-270 | assets/settings/claude-settings-hooks.*.json:57 and codex-hooks.*.json:45 | After a helper agent worked on a work item, update that item's status, Recent History, and Current state. | Skill | `managing-work-items`; the reminder stays | The same. |
| A-271 | assets/hooks/prompt-reminder.mjs:36-37 | A decision goes in the work item's Questions and Answers first. | Routing | The hook text must name `DECISIONS.md` for a decision that affects more than one item | Conflicts with the new layout. |
| A-272 | assets/hooks/session-start.mjs:36-43 | Prune Current State when it reaches 40 lines or is more than 7 days old. | Validator | V-17 | It is already a check. It is the only record check any hook makes today. |

### 2.6 What each hook and settings snippet does today

All verified by reading the files.

| File | Runs when | What it does | What it checks |
|---|---|---|---|
| `assets/hooks/session-start.mjs` (76 lines) | Session start, resume, clear, compaction, in both products | Prints Current State from `memory/CURRENT_STATE.md` or the Notion page. After compaction it tells the agent what to read again. With local memory it rebuilds `memory/MEMORY.md` from the memory files and prints it. | Only two things: Current State has 40 lines or more, or its "Last updated" date is more than 7 days old. It does not check the three section limits. A missing date counts as zero days old, so it passes. |
| `assets/hooks/prompt-reminder.mjs` (60 lines) | Every message from the owner, in both products | Prints "check this project's skills". When the message holds one of 12 phrase groups, it adds a hint that `managing-project-memory` decides, that a decision goes in the item's Questions and Answers first, and that a standing instruction goes in `owner-preferences.md`. | Nothing. It only reminds. |
| `assets/hooks/codex-after-commit.mjs` (19 lines) | After a shell command that holds `git commit`, in both products, for the main agent only | Adds the reminder in A-269. | Nothing. It does not look at whether the commit worked. |
| The `echo` entry in each snippet | After a helper agent starts or reports | Adds the reminder in A-270. | Nothing. |
| `assets/settings/claude-settings-hooks.{local,notion,hindsight}.json` | Merged into `.claude/settings.json` at setup | The three files differ only in the `--memory` value, the Notion page ID, and `--skill hindsight`. | Nothing. |
| `assets/settings/codex-hooks.{local,notion,hindsight}.json` | Merged into `.codex/hooks.json` at setup | The same four entries for Codex, with a 4000-token limit on the session-start text. | Nothing. |
| `assets/settings/codex-plugins-off.toml`, `enabled-plugins-off.json` | Merged at setup | Turn off nine older plugins; raise the Codex skill list limit. | Nothing. |
| `.claude/settings.json` in the starter project | Every Claude Code session | Turns off Claude Code's own memory. Denies `git add -A`, `git commit -a`, `git commit --no-verify`, `git commit -n`, and force pushes. Runs the two Salesforce guards before shell commands and the dependency graph check when the agent stops. | The deny list already stops Claude Code from skipping a Git pre-commit hook (lines 53-58). No pre-commit hook is shipped. |
| `.claude/hooks/guard-protected-orgs.cjs` (995 lines), `guard-permission-set-deploy.cjs` (237 lines) | Before each shell command, in both products | Salesforce org safety. Out of scope. | Salesforce commands only. |
| `tools/kb/graph_freshness_hook.py` (248 lines) | When Claude Code stops | Rebuilds the dependency list when `force-app/` changed and writes `tools/kb/_drift_pending.md`. Always exits 0. | Salesforce metadata only. |
| `.codex/hooks.json` in the starter project | Before each shell command in Codex | Runs the two Salesforce guards. | Salesforce commands only. |

## 3. Duplicates

The same rule stated in more than one place. Every place is listed. All verified.

| # | The rule | Every place it is stated | Count |
|---|---|---|---|
| D-01 | A decision made while working an item is saved in its Questions and Answers first; a project-wide one also gets a memory record. | AGENTS.md:108, 109, 110, 174; PROJECT.md:47; README.md:31; WORK-ITEM.md:126, 139; DESIGN.md:17; memory/decision_template.md:17; rules/confirm-salesforce-changes.md:8; assets/hooks/prompt-reminder.mjs:36-37 | 12 |
| D-02 | `work-items/` and `memory/` are Git-ignored and exist only in the main checkout (the first path `git worktree list` prints). | AGENTS.md:29, 32, 61, 64, 67; memory/AGENTS.md:3; rules/work-item-folders.md:3; rules/publish-project-documents.md:22; README.md:42, 48; PROJECT.md:53; assets/hooks/session-start.mjs:25, 35, 68 | 14 |
| D-03 | Find an item by its ID, never by its path; the owner may move or rename folders. | AGENTS.md:128, 138; rules/work-item-folders.md:11, 12, 21; WORK-ITEM.md:19, 41; README.md:42; DEPLOYMENT-RECORD.md:5 | 9 |
| D-04 | Current state is five lines, rewritten in place after each step; history goes to Recent History. | rules/keep-work-item-current.md:9-13; WORK-ITEM.md:23, 29, 97; AGENTS.md:107; rules/session-handoff.md:3; memory/CURRENT_STATE.md:3; DESIGN.md:17 | 8 |
| D-05 | Next action has three forms. | rules/keep-work-item-current.md:14-18; WORK-ITEM.md:33; AGENTS.md:90 (a pointer) | 3 |
| D-06 | The item's fields win over its Next action. | AGENTS.md:43; rules/keep-work-item-current.md:19 | 2 |
| D-07 | A bulk "yes to all" is saved as one row per thing, each with the reason shown. | rules/keep-work-item-current.md:23; WORK-ITEM.md:126 | 2 |
| D-08 | Change memory only through `managing-project-memory`; two other skills also edit Current State. | AGENTS.md:141, 144, 177, 181, 183; memory/AGENTS.md:5; rules/memory-review-and-save.md:19; memory/MEMORY.md:5; memory/CURRENT_STATE.md:3 | 9 |
| D-09 | Never save project memory in a host's own memory feature. | AGENTS.md:188; rules/memory-review-and-save.md:3; `.claude/settings.json`:7, 9 (the setting that enforces it in Claude Code) | 3 |
| D-10 | `memory/MEMORY.md` is generated; never edit it by hand. | AGENTS.md:64; memory/MEMORY.md:1; README.md:50; assets/hooks/session-start.mjs:13-15; rules/shared-repository-work.md:30 (any generated file) | 5 |
| D-11 | Current State limits: Now 5, Waiting 5, Next 3, under 40 lines. | memory/CURRENT_STATE.md:3; rules/memory-review-and-save.md:32; AGENTS.md:186 ("within its line limits"); assets/hooks/session-start.mjs:36-43 (total and age only) | 4 |
| D-12 | The owner's working instruction goes in `owner-preferences.md`, never in memory. | AGENTS.md:116, 119; rules/memory-review-and-save.md:14; memory/project_topic_template.md:18; assets/hooks/prompt-reminder.mjs:34-35, 38-39 | 6 |
| D-13 | Every memory names its work items by ID, with a link. | AGENTS.md:152; README.md:50; memory/decision_template.md:10-11, 17; memory/project_topic_template.md:11-12, 18; WORK-ITEM.md:41 | 7 |
| D-14 | In a Salesforce project a client file stays in `delivery/`, and the item's Sources list names its path. | AGENTS.md:70, 105; rules/work-item-folders.md:9; WORK-ITEM.md:19, 143; project-wide-records/AGENTS.md:17; INTAKE-RECEIPT.md:3 | 7 |
| D-15 | A test plan lives in `tests/` and is named `<ID>-test-plan.md`. | AGENTS.md:58, 132; rules/work-item-folders.md:10; tests/TEST-PLAN-TEMPLATE.md:3 | 4 |
| D-16 | Outside documentation is raw source; the project's conclusions go elsewhere, linked back. | rules/ai-external-knowledge.md:18-22; ai-external-knowledge/INDEX.md:11; AGENTS.md:59 | 3 |
| D-17 | A design stays with its work item. | AGENTS.md:139; PROJECT.md:50; DESIGN.md:9, 17; README.md:31 | 5 |
| D-18 | Never commit data load or backup files. | rules/production-data-changes.md:9; AGENTS.md:71; the two `.gitignore` files under `delivery/data/` (the mechanism) | 4 |
| D-19 | Use the `handoff` skill when the owner clears context. | AGENTS.md:163; rules/session-handoff.md:3 (stated twice in the same paragraph) | 3 |
| D-20 | When metadata changes, open `sf-component-tracker` and update the tracker. | rules/component-tracker.md:3; AGENTS.md:72, 191; rules/record-deployment-steps.md:10; DEPLOYMENT-RECORD.md:33 | 5 |
| D-21 | The next ID is the highest plus one; an ID is never reused; check for a collision. | rules/work-item-folders.md:15-17; rules/shared-repository-work.md:31; project-wide-records/AGENTS.md:14; work-items/PROJECT-TASKS.md:3; WORK-ITEM.md:105 | 5 |
| D-22 | Save committed project documents with `publish-docs`. | AGENTS.md:170; rules/publish-project-documents.md:16-23; project-wide-records/AGENTS.md:21; rules/shared-repository-work.md:23 | 4 |
| D-23 | `project-wide-records/AGENTS.md` is an instruction file. | AGENTS.md:170; rules/publish-project-documents.md:23; project-wide-records/AGENTS.md:21 | 3 |
| D-24 | Keep the people table in `PROJECT.md` short. | PROJECT.md:33; project-wide-records/AGENTS.md:20; PERSON.md:12 | 3 |
| D-25 | Update the requirement or system record after delivery is confirmed. | AGENTS.md:55; requirements/AGENTS.md:3; TARGET-ARCHITECTURE.md:10, 14; project-wide-records/AGENTS.md:16 | 5 |
| D-26 | Link to a record; do not copy its status, design, or source text. | project-wide-records/AGENTS.md:19; DOMAIN-MAP.md:19; INTAKE-RECEIPT.md:27; memory/CURRENT_STATE.md:3; requirements/AGENTS.md:3; memory/decision_template.md:17; ai-external-knowledge/INDEX.md:11 | 7 |
| D-27 | Read a folder's `AGENTS.md` before editing in that folder. | AGENTS.md:38, 55, 57, 64 | 4 |
| D-28 | The roadmap names items by ID; detail stays with the item. | AGENTS.md:139; PROJECT-ROADMAP.md:5 | 2 |
| D-29 | Saving or recommending something is not approval. | rules/publish-project-documents.md:19; DESIGN.md:17, 94; TARGET-ARCHITECTURE.md:14; WORK-ITEM.md:149 | 5 |

## 4. Conflicts

### 4.1 Rules that disagree with each other today

All verified in the files named.

| # | The disagreement | Places |
|---|---|---|
| C-01 | One design has three status lists. The item's front matter says `design: proposed, approved, superseded, none`. The design's front matter says `status: proposed` and `approved: "no"`. The design's body says "Design status: Draft, In review, Approved, Superseded". | WORK-ITEM.md:12; DESIGN.md:3-4; DESIGN.md:12 |
| C-02 | "Refer to items by ID, never by path or link" disagrees with templates that ask for the ID and a link. | AGENTS.md:138 against AGENTS.md:152; DEPLOYMENT-RECORD.md:5; CUTOVER-PLAN.md:15; memory/decision_template.md:17; memory/project_topic_template.md:18; project-wide-records/AGENTS.md:19 |
| C-03 | Two date forms. Data folders use `MMDDYYYY`. Every other record uses `YYYY-MM-DD`. | rules/production-data-changes.md:8 against CUTOVER-PLAN.md:5, project-wide-records/AGENTS.md:13, WORK-ITEM.md:14 |
| C-04 | One item's source file has three homes, chosen by project type: the item's `references/` folder, `delivery/` in a Salesforce project, or "an anchor work item and its tracker-specific source location". | rules/work-item-folders.md:9; AGENTS.md:70; project-wide-records/AGENTS.md:17 |
| C-05 | Open questions about a data mapping are kept in the mapping file, but an unresolved transformation rule "remains a question in the work item". | FIELD-MAPPING-TEMPLATE.md:13-15 against TRANSFORMATION-RULES-TEMPLATE.md:3 |
| C-06 | Memory status values are never listed in one place. The decision template allows current, superseded, withdrawn. The hook also skips `retired`. The root file mentions `needs-review` and `proposed`. The topic template says "the real lifecycle state" and lists none. | memory/decision_template.md:25; assets/hooks/session-start.mjs:52; AGENTS.md:162; memory/project_topic_template.md:18 |
| C-07 | The roadmap's phase Status column has no list of allowed values. Only the example "Not Started" appears. | PROJECT-ROADMAP.md:19-21 |
| C-08 | Two rows are hard to tell apart: "a project-wide decision that belongs to no work item" goes straight to memory, but "a decision about something that is not a work item yet" becomes a new work item. | AGENTS.md:110 against AGENTS.md:114 |
| C-09 | The waiting form names "Mike" in a starter project meant for any owner named in `PROJECT.md`. | rules/keep-work-item-current.md:16; WORK-ITEM.md:33 |
| C-10 | `project-file-locations.md` is listed as always on, yet its own text says it is about "a Salesforce project's client-work files". I could not see whether setup removes it from a project that is not Salesforce. | AGENTS.md:223; rules/project-file-locations.md:3 |
| C-11 | The after-commit reminder says "a commit that worked", but the hook does not look at the result. In Codex the event also runs after a command that failed (`ai-external-knowledge/codex/hooks.md`, "PostToolUse": "it also runs after commands that exit with a non-zero status"). | assets/hooks/codex-after-commit.mjs:8-16 |

### 4.2 Rules that disagree with the new layout

50 inventory rows carry at least one of these. The four removed folder names appear 48 times in the starter project outside the skills folders: `project-wide-records` 17 times in 5 files, `requirements/` 13 times in 8 files, `system-guide` 9 times in 6 files, `ai-external-knowledge` 9 times in 3 files (verified by search).

| # | Today | New layout | Rows |
|---|---|---|---|
| X-01 | A wider decision is written in the item first, then copied to a memory record after the owner's yes. | `DECISIONS.md` holds it (DEC-###). The item keeps a one-line pointer. Memory never restates it. | A-034, A-035, A-099, A-161, A-184 to A-190, A-256, A-271 |
| X-02 | A question that spans items has its own file in `project-wide-records/questions/` and its answer somewhere else. | One row in `DECISIONS.md`, status Open, then Decided. | A-036, A-074, A-171, A-204 to A-206 |
| X-03 | A source sits in the item's `references/` folder, in `delivery/`, or in a tracker location, and "any other files the owner put in an item folder" are kept. | `sources/`, always, as SRC-###, never inside an item folder. | A-017, A-021, A-031, A-038, A-082, A-144, A-156, A-237, A-259 |
| X-04 | Memory holds facts, lessons, terms, and decision records. | Memory holds where work stopped and pointers only. | A-018, A-042, A-043, A-055, A-119, A-191 to A-196 |
| X-05 | Four folders are named as homes: `project-wide-records/`, `requirements/`, `system-guide/`, `ai-external-knowledge/`. | Removed or renamed. | A-012 to A-016, A-037, A-058, A-061, A-072 to A-077, A-086, A-087, A-092, A-131, A-134, A-162, A-173, A-199 to A-215 |
| X-06 | Status lists: a decision is current, superseded, or withdrawn; a shared question is open, answered, or incorporated; a target is proposed, owner-approved, or superseded. | A DEC is Open, Decided, or Superseded. A system doc is Not started, Draft, or Approved. There is no value for a withdrawn decision. | A-189, A-204, A-207 |
| X-07 | Three kinds of truth are kept apart: accepted behavior (`requirements/`), intended structure (`target-architecture/`), and structure verified as built (`system-guide/`). "Delivery alone does not verify current structure." | `system/` is "approved source of truth" with one status list. It cannot say whether an approved rule has been built and checked. `reference/` holds the as-is inventory. | A-013, A-081, A-208, A-214, A-215 |
| X-08 | These have a home today and none in the new layout: unproven lessons ("Gotchas and lessons"), `delivery/archive/`, and the four empty client-work folders `delivery/communications/`, `delivery/deliverables/`, `delivery/meeting-notes/`, `delivery/references/`. | Not stated. | A-042, A-195, A-220 |
| X-09 | The written explanation of Salesforce metadata is corrected "in project memory". | It is a system fact: `system/automation.md` or `system/data-model.md`. | A-100, A-101 |
| X-10 | Area rules have a "stable rule ID" with no set form (the citing rule's example is `BIL-03`). | Only CON-##, SEC-##, INT-##, DEC-###, and SRC-### are defined. Rules in `data-model.md`, `architecture.md`, and `automation.md` have no prefix. | A-211, A-212 |
| X-11 | The direction of the pointer: the item's row is the authority and the wider record points back to it. | "Move it up and leave a one-line ID pointer in the item." | A-186, A-256 |
| X-12 | The session-start hook groups memory files by a `decision_` prefix and links `terminology-glossary.md`. The prompt reminder sends every decision to the item's Questions and Answers. | Decisions are in `DECISIONS.md`; the glossary is `system/glossary.md`. | A-183, A-271 |
| X-13 | A system doc's Changelog and a DEC row name work items by ID, but local work items are Git-ignored. | A commit-time check on another computer cannot confirm that a named work item exists. The check must accept any well-formed ID there. | V-12 |
| X-14 | `rules/cite-recalled-knowledge.md` (out of scope) gives `requirements/billing/BILLING.md` and a memory decision file as its examples. | Both go away. | rules/cite-recalled-knowledge.md:5, 7 |

## 5. Rules that become template fields

Each row names the template, the field, and the prose the field replaces. "Exists" means the field is already in the template today, so the prose can go with no template change. "New" means the template needs the field.

| Template | Field | Status | Prose it replaces |
|---|---|---|---|
| `WORK-ITEM.md` front matter | `id`, `state`, `status`, `parent`, `waiting_on`, `requirements_approved`, `design`, `result_approved`, `updated` | Exists | A-027, A-235, A-240, A-241 |
| `WORK-ITEM.md` front matter | `promoted:` (the DEC and system doc IDs this item changed, or "none needed") | New | A-012, A-090, A-208, A-268 |
| `WORK-ITEM.md` Current state | The five labelled lines | Exists | A-032, A-105, A-108 (this rule is stated in 8 places: D-04) |
| `WORK-ITEM.md` Next action prompt | The three forms | Exists | A-110 (rules/keep-work-item-current.md:14-18 repeats the prompt word for word) |
| `WORK-ITEM.md` Questions and Answers | ID, Question, Answer, Date answered, Decision?, Affects, Status, Decision needed from | Exists | A-026, A-033, A-253, A-255 |
| `WORK-ITEM.md` Questions and Answers | "Promoted to" (DEC-###, CON-##, or "item only") | New | A-034, A-256 |
| `WORK-ITEM.md` task block | Work, Deliverable, Done when, Who does it, Depends on | Exists | A-249, A-250 |
| `WORK-ITEM.md` requirement block | Original verbatim requirement, Goal, Functional Requirements, Acceptance Criteria | Exists | A-252 |
| `WORK-ITEM.md` Recent History | Date, Change or decision, Effect on the work | Exists | A-251 |
| `WORK-ITEM.md` Sources | One line per source, naming its SRC-### | Changed | A-237, A-259 |
| `DESIGN.md` header | One status field with one list, the approval, the Q-ID | Exists, but three lists (C-01) | A-260, A-264 |
| `DESIGN.md` tables | Requirement IDs, Source, Evidence type | Exists | A-262, A-263, A-265 to A-267 |
| `DECISIONS.md` (new) | ID, Decision or question, Status, Decision needed from, Decided on, Decided by, Work items, Supersedes, Applied in | New | A-079, A-083, A-184, A-188 to A-190, A-204, A-205 |
| Each `system/` doc (new) | Status; Last changed via DEC-###; Governs; Overview; Content; Open questions; Changelog (date, change, DEC, WI) | New | A-081, A-088, A-091, A-132, A-207, A-209 to A-213 |
| `system/` doc rule block | Rule ID, Trigger, Required behavior, Conditions and exceptions, Outcome, Source | Exists in `requirements/system-area-template/AREA-TEMPLATE.md`:11-18 | A-211, A-212 |
| `system/glossary.md` | Term, System or context, Meaning here, Distinction or alias, Source, Status or last checked | Exists in `memory/terminology-glossary.md`:7-9 | A-196 to A-198 |
| `system/constraints.md` | CON-## rows with a source | New | A-158 |
| `sources/` index (new) | SRC-###, Received, From, What it is, Used by | New | A-200, A-202 |
| `reference/outside-docs/INDEX.md` | Topic folder, Source and subject, Captured, When to consult it | Exists | A-218 |
| `reference/` as-is inventory | Components table with Evidence; Known gaps; Last verified | Exists in `system-guide/AREA-TEMPLATE.md` | A-214, A-215 |
| `PROJECT.md` | Systems table; people table; "Toolkit settings" labels | Exists | A-045, A-117, A-124, A-159, A-160, A-163 to A-166, A-203 |
| `PROJECT-ROADMAP.md` | Phase table; phase heading block; work item lines; planning questions as DEC links; planning changes | Exists (questions section changes) | A-052, A-168 to A-172 |
| `memory/CURRENT_STATE.md` | Last updated; Now; Waiting on the owner; Next session starts with | Exists | A-126, A-176, A-177, A-180 to A-182 |
| Memory pointer note | Title, updated date, pointers (ID and link) | Changed | A-055, A-191, A-194 |
| `PROJECT-TASKS.md` | PT task block, with its kept comment | Exists | A-234 |
| `delivery/` templates | Status lines, work item by ID, step blocks, tables | Exists | A-135, A-220 to A-224, A-226 to A-231 |
| `tests/TEST-PLAN-TEMPLATE.md` | Scope, Environment and data, Checks, Results | Exists | A-217 |
| `README.md` | Project records list | Changed | A-173 |

One caution. A fill-in comment that the agent is told to delete after filling ("Delete this guide when you create the item", `WORK-ITEM.md`:19) stops carrying its rule from that moment. A rule that must hold for the whole life of the record needs a field, a kept comment (as `PROJECT-TASKS.md`:3 does with "Keep this guide"), or a check.

## 6. Rules that become validator checks

Each check is one testable sentence. "Where" says when it can run: **E** after an edit, **S** when the agent stops, **C** in the Git pre-commit hook. `work-items/` and `memory/` are Git-ignored, so their checks can never run at commit time. "Level" is my suggestion: **fail** sends the text back to the agent and, at commit time, stops the commit; **warn** only reports.

Checks marked with * are in the suggested first version (15 checks).

| ID | The check | Where | Level | Rows |
|---|---|---|---|---|
| V-01 | Every work item file has the thirteen front matter fields, and each list field holds one value from its list. | E, S | fail | A-235, A-240 |
| V-02* | An item's file is named `<id>.md`, its folder name starts with `<id>-`, the ID has the project's prefix, and no two items share an ID. | E, S | fail | A-045, A-141, A-144, A-147, A-150, A-154 |
| V-03 | No other file is named `<ID>.md`, and no file outside `work-item-template/` is named `WORK-ITEM.md`. | E, S | fail | A-145, A-148 |
| V-04* | No angle-bracket prompt and no "Fill-in guide" comment is left in a record that is not a template, except where the comment says to keep it. | E, S, C | fail | A-242 |
| V-05* | The Current state block has exactly its five labels, each with text of at most 400 characters, no list or table, and a Last updated date equal to the front matter `updated`. | E, S | fail | A-105, A-107 to A-109, A-116 |
| V-06* | Next action matches one of the three forms; a Done item says "None. Finished."; a Cancelled item says "None. Cancelled."; when `waiting_on` is `owner` it starts "Waiting on" and names an Open Q-ID, and the Waiting on line agrees. | E, S | fail | A-008, A-027, A-110, A-111, A-116, A-244 |
| V-07 | State Blocked and status Blocked always appear together, and then `waiting_on` is not `none` and Blockers is not "None." | E, S | fail | A-008, A-240, A-241 |
| V-08* | In Questions and Answers, Q-IDs are unique, Status is Open or Answered, an Answered row has an answer and a date, an Open row has neither, and Open rows come first. | E, S | fail | A-028, A-239, A-253, A-254, A-257 |
| V-09 | Each task has its five labels, "Who does it" is agent or owner, task IDs are unique, and a ticked box has status Done and an unticked one does not. | E, S | fail | A-104, A-239, A-249 |
| V-10 | An item with no parent has a Roadmap with at least one phase and a matching Tasks heading per phase; an item with a parent has no Roadmap; a phase marked Done has no unticked task. | E, S | fail | A-104, A-239, A-246 to A-248 |
| V-11 | Requirement numbers are unique, each block has the original words, a goal, at least one functional requirement and one acceptance criterion, and a dropped one names an existing Q-ID. | E, S | warn | A-239, A-252 |
| V-12* | Every work item ID written in a `parent` field, Current State, the roadmap, `DECISIONS.md`, a system doc Changelog, `delivery/`, or the component tracker exists (local tracker), or is well formed (any other tracker, and at commit time). | E, S, C | fail | A-052, A-154, A-170, A-188, A-224, A-238, A-245 |
| V-13* | A work item with status Done has `promoted:` filled, and every row marked Decision? yes has "Promoted to" filled with an existing ID or "item only". | E, S | fail | A-090, A-268 |
| V-14 | A design's `work_item` equals its folder's item ID, its status agrees with the item's `design` field, each R-ID it names exists in the item, and an approved design names an existing Q-ID. | E, S | warn | A-260, A-263, A-264 |
| V-15 | An item folder holds only its ID file and `DESIGN.md`. | S | warn | A-144, A-156 |
| V-16 | In `PROJECT-TASKS.md`, PT IDs are unique and rising, each task has its five labels, and a ticked box has status Done. | E, S | warn | A-234 |
| V-17* | `memory/CURRENT_STATE.md` has a Last updated date and its three sections, with at most 5, 5, and 3 lines and under 40 lines in all, and each Now line starts with a work item ID. | E, S | fail | A-066, A-126, A-176 to A-178, A-180, A-272 |
| V-18 | Every entry in a memory note names at least one ID or link. | E, S | warn | A-055 |
| V-19 | A memory file's name starts with an allowed type that equals its `metadata.type`, and its status is not `template`. | E, S | warn | A-191, A-192 |
| V-20* | In `DECISIONS.md` each DEC-### appears once, numbers only rise, and Status is Open, Decided, or Superseded. | E, S, C | fail | A-072, A-078, A-079, A-141, A-189, A-204 |
| V-21 | A Decided row has a date, a decider, and the decision; an Open row names who must decide; a Superseded row names an existing DEC that replaces it. | E, S, C | fail | A-189, A-204 |
| V-22* | Every DEC-###, SRC-###, CON-##, SEC-##, and INT-## written in a tracked file, or in a work item, is defined somewhere. | E, S, C | fail | A-084, A-259 |
| V-23* | Each `system/` doc has, in this order, Status (Not started, Draft, or Approved), "Last changed via DEC-###", Governs, Overview, Content, Open questions, and Changelog; each glossary row has a source. | E, S, C | fail | A-197, new layout |
| V-24* | A doc with Status Approved names an existing Decided DEC in "Last changed via", its newest Changelog row names the same DEC, and every doc a Decided DEC lists under "Applied in" names that DEC back. | E, S, C | fail | A-083, A-206, A-209 |
| V-25 | A doc's Open questions section holds only DEC-### links, each to an existing Open row. | E, S, C | fail | New layout |
| V-26 | Each Changelog row has four cells (date as YYYY-MM-DD, change, DEC, WI), newest first. | E, S, C | fail | New layout |
| V-27 | Each CON-##, SEC-##, and INT-## is defined once, in `constraints.md`, `security-model.md`, or `integrations/`. | E, S, C | fail | A-211 |
| V-28* | `system/README.md` lists every doc under `system/` with the same Status and the same last DEC the doc states, and `system/integrations/README.md` lists every integration doc. | E, S, C | fail | New layout |
| V-29 | A commit that changes a system doc's Content also adds a Changelog row to that doc. | C | fail | New layout |
| V-30* | Each SRC-### appears once in the sources index, every file under `sources/` belongs to one entry, and every entry's file exists. | E, S, C | fail | A-072, A-078, A-082, A-141 |
| V-31* | A commit never changes or deletes a file already under `sources/`, other than the index. | C | fail | A-082 |
| V-32 | Each SRC entry has a received date, who it came from, what it is, and a "Used by" value. | E, S, C | warn | A-202 |
| V-33 | Each topic folder under `reference/outside-docs/` has a `SOURCE-RECORD.md` and an `INDEX.md` row, each row's folder exists, and a commit never changes a captured page. | E, S, C | warn | A-016, A-093, A-096, A-218 |
| V-34 | A deployment folder name starts with a work item ID, a release folder name starts with a date as YYYY-MM-DD, and a test plan is named `<ID>-test-plan.md` or `<release>-test-plan.md`. | E, S, C | warn | A-015, A-047, A-127, A-145, A-163, A-216, A-227, A-230 |
| V-35 | Each Status line in a `delivery/` record holds one value from that template's list. | E, S, C | warn | A-221, A-226, A-227, A-229, A-231 |
| V-36 | No `.csv`, `.xlsx`, or `.xls` file under `delivery/data/` is staged. | C | fail | A-022, A-128 |
| V-37 | A commit that changes a file under `force-app/` also changes `delivery/deployment/component-tracker.csv`. | C | warn | A-097 |
| V-38 | `PROJECT.md` "Toolkit settings" has the labels Tracker and Memory with allowed values, and the labels those values require. | E, S, C | fail | A-166 |
| V-39 | `PROJECT-ROADMAP.md` has one table row and one heading per phase with the same ID and name, and each Status is from the list. | E, S, C | warn | A-167, A-169 |
| V-40 | The rules list in the root `AGENTS.md` names every file in `.claude/rules/` and no file that is missing. | E, S, C | warn | A-069 |
| V-41 | No tracked file holds a path or link into `work-items/` or `memory/`. | E, S, C | fail | A-050, A-084, A-230, A-245 |
| V-42 | None of `project-wide-records/`, `requirements/`, `system-guide/`, `ai-external-knowledge/`, or `delivery/knowledge-base/` exists, and `delivery/` and `engagement/` do not both exist. | S, C | warn | A-129, A-130 |
| V-43 | No memory file holds an email address. | E, S | warn | A-057 |
| V-44 | Each Recent History row starts with a date as YYYY-MM-DD, newest first. | E, S | warn | A-251 |

Three things the validator cannot check, so they stay with a skill: whether a decision "affects more than one item" (the agent or owner must say so in the "Promoted to" cell), whether a memory note restates a fact, and whether an approved rule has been built.

## 7. Rules to delete

37 rows. Grouped by reason.

| Reason | Rows |
|---|---|
| Names no file and no moment to act | A-001, A-002 |
| A hook, a setting, or `.gitignore` already does it, and says so at the moment it matters | A-003, A-004, A-019, A-102, A-120, A-140, A-183 |
| The same rule is kept in one other place (section 3) | A-063, A-064, A-099, A-112, A-121, A-123, A-161, A-174, A-175, A-232, A-236 |
| The folder or file it describes is removed in the new layout | A-014, A-037, A-058, A-072, A-073, A-075, A-077, A-087, A-134, A-187, A-193, A-199 |
| A template says it in place | A-085 |
| It restates the steps of a skill that holds its own steps | A-138 |
| An alias that only adds a lookup | A-118 |
| It describes a tracker whose skills are not built | A-048 |
| No home in the new layout; needs the owner's call before it is deleted | A-195 |

Beyond these 37, another 116 rows need no prose once their template field or check exists (44 template field only, 29 validator only, 43 both). That is 153 of 272 rows, 56 percent, with no sentence left to read.

## 8. Proposed root `AGENTS.md` routing table

A draft of the actual rows, written with no setup markers: every row is true for every tracker, every memory choice, and every project type. Section 12.2 names the two places where a difference between choices remains and why. The table and the filing test below it are the whole "where things go" section. The Skills list, the owner's approvals, the commands, and the reply style are out of scope here; another audit covers whether they stay in the root.

File at the narrowest scope that covers everyone affected. The test: would an agent working a different item need to know this? If yes, move it up and leave a one-line ID pointer in the item.

| Information | Home | Before you write there |
|---|---|---|
| Purpose, scope, people, systems, and the toolkit's settings | `PROJECT.md` | |
| The project's phases and the top-level work items in each | The work tracker's roadmap (`tracking-work-items` says where it is) | `managing-work-items` |
| A new request, idea, or bug | A new work item | `managing-work-items` |
| An administrative task that belongs to no work item | The project's tasks | `managing-work-items` |
| The requirements, questions, tasks, design, and history of one change | That work item: its file and its `DESIGN.md` | `managing-work-items` |
| Where one item stands and its next action | The Current state block at the top of that item | |
| A decision that affects only one item | A row in that item's Questions and Answers | |
| A decision or an open question that affects more than one item | `DECISIONS.md` (DEC-###), with a one-line pointer in the item | `record-decision` |
| A requirement or rule for one area of the system that several items rely on | That area's doc in `system/` | `update-system-doc`; read `system/AGENTS.md` |
| A rule that spans several areas | `system/constraints.md` (CON-##) | `update-system-doc` |
| A security rule | `system/security-model.md` (SEC-##) | `update-system-doc` |
| An integration with another system | `system/integrations/<name>.md` (INT-##) | `update-system-doc` |
| A project term | `system/glossary.md` | `update-system-doc` |
| A diagram of the system | `system/diagrams/` | |
| An original the project received and keeps (a transcript, brief, message, or file) | `sources/` (SRC-###), never inside a work item folder | `file-source`; read `sources/AGENTS.md` |
| Outside documentation, or a record of the system as it is today | `reference/outside-docs/` or `reference/` | Read `reference/AGENTS.md` |
| A release, migration, deployment, or handoff | `delivery/` | Read `delivery/AGENTS.md` |
| A test plan for a release | `tests/<release>-test-plan.md` | |
| A test plan | `tests/<ID>-test-plan.md` | |
| Where work stopped and where the next session starts | Current State, as IDs and links only | `managing-project-memory` |
| A pointer worth keeping that fits no row above | Memory, as an ID and a link, never a restated fact, and never Claude Code's or Codex's own memory feature | `managing-project-memory` |
| The owner's preference for how the agent works | `.claude/rules/owner-preferences.md` | |
| How agents should work, or a procedure that proved itself | A rule or a skill, with the owner's yes | |
| Finishing a work item | Move what other items need to `system/` and `DECISIONS.md`, then mark it Done | `close-work-item` |

Two lines sit under the table:

- Before you edit a file in a folder that has its own `AGENTS.md`, read that file.
- Work items and memory may live in Notion, GitHub, or Hindsight (see "Toolkit settings" in `PROJECT.md`). `system/`, `sources/`, and `DECISIONS.md` are always files in this repository.
- Codex: at session start, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names. (This sentence replaces the generated rules list; see section 12.2.)

## 9. Proposed folder-level instruction files

Six folders. No file below holds a setup marker. A folder file exists only when its folder exists, so setup decides whether a project gets the file and never changes its words. `tests/` needs none: its one rule is a routing row and check V-34. `DECISIONS.md` is a root file, so a folder file cannot cover it; its rules sit in a kept comment at the top of the file, which the agent reads every time it edits the file.

### `system/AGENTS.md`

- This folder is the approved description of the system. Change a doc only with `update-system-doc`.
- A doc changes only because of a decision. Write the DEC-### in "Last changed via" and add a Changelog row: date, change, DEC, WI.
- Status is Not started, Draft, or Approved. Only the owner's decision makes a doc Approved.
- Give each rule an ID and never reuse one: CON-## in `constraints.md`, SEC-## in `security-model.md`, INT-## in `integrations/`.
- "Open questions" holds DEC-### links only. The question's text lives in `DECISIONS.md`.
- Update `README.md`, the index, in the same edit: the doc's status and its last DEC.
- A proposal that is not approved stays in the work item's `DESIGN.md`.
- Never infer a glossary definition. Take it from the owner or a named source.

### `sources/AGENTS.md`

- Every original the project keeps goes here, one SRC-### each. Use `file-source`.
- Never edit, rename, or delete a file once it is filed. A corrected version is a new SRC that names the old one.
- Add the entry to the index in the same edit: ID, date received, who it came from, what it is, and "Used by".
- Other records point here by SRC-###. Never copy a source's text into a work item or a system doc.
- A source is somebody's words, not the project's truth. What the project decided from it goes in `DECISIONS.md` or `system/`.

### `work-items/AGENTS.md` (exists only when work items are local files)

- Temporary work lives here: one folder per item, `<ID>-<slug>/`, holding `<ID>.md` and `DESIGN.md`.
- Git ignores this folder. It exists only in the main checkout, the first path `git worktree list` prints.
- Read and change items only through `tracking-work-items`. Find an item by its `id:`, never by its path.
- The owner may move or rename folders. Never move, archive, or rename one yourself.
- Nothing here is the lasting record. At close, `close-work-item` moves what other items need to `system/` and `DECISIONS.md`.
- Sources go in `sources/`; the item names them by SRC-###. Leave any other file the owner put here and tell him.

### `memory/AGENTS.md` (exists only when memory is local files)

- Memory holds where work stopped, and pointers: an ID and a link. It never restates a fact. The fact lives in the record the pointer names.
- Change this folder only through `managing-project-memory`. `managing-work-items` and `handoff` also edit `CURRENT_STATE.md`.
- The session-start hook writes `MEMORY.md`. Never edit it.
- Git ignores this folder. It exists only in the main checkout.

Note, not a line of the file: in a Hindsight project this folder holds only `CURRENT_STATE.md` and gets no `AGENTS.md`. Its rules are in the Hindsight-only rule file (section 12.1).

### `delivery/AGENTS.md`

- Releases, migrations, deployments, and handoffs. Start each from the matching template folder.
- Name a work item's folder `<ID>-<short-name>` and a release folder `<YYYY-MM-DD>-<release-name>`.
- Name work items by ID, never by path.
- Data loads and backups under `data/` are never committed.
- An original received from someone else goes in `sources/`, not here.
- A project that already uses `engagement/` keeps that folder in place of this one.

### `reference/AGENTS.md`

- Outside documentation goes in `outside-docs/`, one folder per topic with a `SOURCE-RECORD.md`. Add its row to `INDEX.md` in the same edit.
- The as-is inventory records what was observed, with the date and the environment.
- Nothing here is the project's truth. What the project decided goes in `system/` or `DECISIONS.md`, with a link back.
- Never edit a captured page. When it disagrees with `system/`, `system/` wins; say so.

## 10. Answers to questions A and B

### A. How a folder-level instruction file reaches the agent

**Claude Code.** Verified in `ai-external-knowledge/claude-code/memory.md`.

- The starter project has a root `CLAUDE.md` that holds only `@AGENTS.md` (verified: `CLAUDE.md`:1). With a `CLAUDE.md` at the root, Claude Code does not load a nested `AGENTS.md`. Line 352: "An `AGENTS.md` and a `CLAUDE.md` or `CLAUDE.local.md` in your working directory or above it" gives "Your `CLAUDE.md` files only". Line 363: "By default, Claude reads `AGENTS.md` only when you have no `CLAUDE.md` in your working directory or above it."
- A nested `AGENTS.md` loads by itself only in a project with no `CLAUDE.md`. Line 371, under "When none count": "a subdirectory's `AGENTS.md`, when Claude opens a file there with the Read tool and that subdirectory has none of the three `CLAUDE.md` files of its own".
- A nested `CLAUDE.md` loads when Claude reads a file in that folder. Line 144: "Claude also discovers `CLAUDE.md` and `CLAUDE.local.md` files in subdirectories under your current working directory. Instead of loading them at launch, they are included when Claude reads files in those subdirectories."
- A path-scoped rule loads when Claude reads a matching file. Line 207: "Path-scoped rules trigger when Claude reads files matching the pattern, not on every tool use."
- The setting that makes Claude Code read both file names cannot be shipped in a project. Line 390: "Claude Code ignores it in project and local settings files."
- After compaction, both kinds come back the same way. Line 607: "Nested CLAUDE.md files in subdirectories and rules with `paths:` frontmatter reload as Claude reads files they apply to."

So today `memory/AGENTS.md`, `project-wide-records/AGENTS.md`, and `requirements/AGENTS.md` are not loaded by Claude Code. They are read only because root `AGENTS.md`:38 tells the agent to read them. Earlier research reached the same conclusion (`dev/research/rules-best-practices.md`:1042-1049).

**Codex.** Verified in `ai-external-knowledge/codex/agents-md.md`.

- Codex loads instruction files once, at the start. Line 16: "Codex builds an instruction chain when it starts (once per run; in the TUI this usually means once per launched session)."
- It reads only the folders between the project root and the folder it was started in. Line 19: "Starting at the project root (typically the Git root), Codex walks down to your current working directory." Line 90: "Codex stops searching once it reaches your current directory".
- So a nested `AGENTS.md` loads in Codex only when the session was started in that folder or below it. A session started at the project root never loads it by itself.
- Codex never reads `.claude/rules/`. Line 166: "Filenames not on this list are ignored for instruction discovery."
- The whole chain is capped. Line 22: Codex "stops adding files once the combined size reaches the limit defined by `project_doc_max_bytes` (32 KiB by default)". The starter project's root `AGENTS.md` is 24,185 bytes before setup removes the unused blocks (verified by count).

**Recommendation.** One `AGENTS.md` in each folder that needs folder rules, and beside it a one-line `CLAUDE.md` that holds only `@AGENTS.md`. Keep root `AGENTS.md`:38.

- This is the only arrangement in which each product can load the same folder text by itself: Codex by the name `AGENTS.md` when it starts in or below the folder, and Claude Code through the nested `CLAUDE.md` when it reads a file there. The captured page names this pair for a project that has a `CLAUDE.md` (line 435: "putting an `@AGENTS.md` import in a `CLAUDE.md` next to it. Do this when your project also has a `CLAUDE.md`").
- It is the same pair the root already uses, so setup copies plain files and nothing new is learned.
- For a Codex session started at the root, nothing folder-level loads by itself in any arrangement. There the text arrives two ways: the line at root `AGENTS.md`:38, and the validator's failure text, which should end by naming the folder's `AGENTS.md`.
- What a project would contain: the root `AGENTS.md` and `CLAUDE.md` as now; `AGENTS.md` and `CLAUDE.md` in `system/`, `sources/`, `delivery/`, and `reference/` (8 committed files); and in a project with local work items or local memory, the same pair in `work-items/` and `memory/` (4 files that Git ignores, made by setup in the main checkout, as `memory/AGENTS.md` is today).

The runner-up, with half the files: one path-scoped rule per folder in `.claude/rules/`, as the starter project already does for `ai-external-knowledge/**` and `delivery/deployment/**`. It loads in Claude Code exactly as well, and it can also cover a root file such as `DECISIONS.md`. I do not recommend it as the main arrangement because Codex has no way to load it by itself, and the text sits away from the folder. It remains the right tool for rules about a file type rather than a folder.

Not recommended: deleting the root `CLAUDE.md` so that Claude Code reads every `AGENTS.md` directly. It would need one file per folder, but any `CLAUDE.md` or `CLAUDE.local.md` at or above the project then silently turns off the root `AGENTS.md` too (line 376), and some sessions cannot read `AGENTS.md` at all (lines 404-412).

Three limits, all inference, to test before relying on the arrangement:

- Whether an `@AGENTS.md` import inside a nested `CLAUDE.md` is expanded when that file loads later. The page says imports are "expanded and loaded into context at launch alongside the CLAUDE.md that references them" (line 106) and does not mention nested files.
- Both Claude Code mechanisms trigger on reading a file. Writing a brand-new file into a folder without reading one first may load nothing.
- A Claude Code session in a worktree reads `work-items/` and `memory/` in the main checkout, which is outside its working folder. The nested file there may not load. For those two folders the skill and the template must carry the rules.

### B. How a validator could run

**After a file edit, with the failure text sent back to the agent.**

- Claude Code: the `PostToolUse` event with the matcher `Edit|Write`. Verified in `ai-external-knowledge/claude-code/hooks.md`, "PostToolUse": "Runs immediately after a tool completes successfully." The edited file's path arrives as `tool_input.file_path`. To send text back, the command exits with code 2 and writes to stderr ("Exit code 2 behavior per event": "`PostToolUse` ... Shows stderr to Claude; the tool already ran"), or prints JSON with `decision: "block"` and a `reason` ("adds the `reason` next to the tool result"), or with `additionalContext`.
- One gap, same section: "Claude Code doesn't run a `PostToolUse` hook matching `Edit|Write` when a `Bash` command or a process outside Claude Code rewrites the same file." So the same command should also run on the `Stop` event, where exit code 2 "Prevents Claude from stopping, continues the conversation". Claude Code limits this to 8 continuations in a row and passes `stop_hook_active`.
- Codex: the `PostToolUse` event with the matcher `apply_patch` (the names `Edit` and `Write` also match). Verified in `ai-external-knowledge/codex/hooks.md`, "PostToolUse": "`PostToolUse` runs after supported tools produce output, including Bash, `apply_patch`, MCP tool calls, and other local function tools." The patch text arrives as `tool_input.command`, so the command must read the file names out of the patch. To send text back: "You can also use exit code `2` and write the feedback reason to `stderr`", or JSON with `decision: "block"`, after which "Codex records the feedback, replaces the tool result with that feedback, and continues the model from the hook-provided message." Plain text on stdout is ignored there.
- Codex also has a `Stop` event that continues the turn with the reason as a new prompt. It needs JSON on stdout: "Plain text output is invalid for this event."
- Exit code 2 with the text on stderr works for `PostToolUse` in both products, so one command can serve both.
- Each new Codex hook entry must be trusted by the owner in Codex `/hooks` before it runs: "new or changed hooks are marked for review and skipped until trusted."
- Codex's own page warns: "Treat tool hooks as a useful guardrail, not a complete enforcement boundary." It also recommends the next mechanism (`ai-external-knowledge/codex/customization-overview.md`:48): "Pair `AGENTS.md` with infrastructure that enforces those rules: pre-commit hooks, linters, and type checkers".

**The Git pre-commit hook.** The captured pages do not describe Git's own hooks. This part is general Git knowledge, not verified in a captured page.

- Git runs an executable file named `pre-commit` from its hooks folder before each commit, and a non-zero exit stops the commit. The default hooks folder is inside `.git/`, which is not part of what Git copies, so a clone never brings a hook with it.
- The usual answer: commit the hook in a tracked folder such as `.githooks/pre-commit` (three lines that run the validator with a "staged files" option), and run `git config core.hooksPath .githooks` once in each clone. That setting is also local to the clone.
- Who installs it: the `project-setup` skill, at onboarding and again in "check the setup" and "update the toolkit", on each computer. The session-start hook could also print one line when the setting is missing; that is a new job for that hook and needs the owner's yes.
- What it cannot see: `work-items/` and `memory/` are Git-ignored, so they are never in a commit. Their checks run only from the two agent hooks. A commit or merge made on GitHub's website also skips it.
- Skipping it: Claude Code is already denied `git commit --no-verify` and `-n` (verified: `.claude/settings.json`:53-58). I saw no matching block for Codex in the files I read.
- An older toolkit version had a pre-commit hook, and the setup notes record the same limit: "Git does not track it, so each computer's copy of the project has its own" (verified: `references/old-toolkit-pieces.md`:147).

**Size, in plain numbers.** An estimate, not a measurement.

- The three hook commands a project runs today total 155 lines (verified: 19, 60, and 76).
- A first version with the 15 starred checks in section 6: about 220 lines of Node, plus about 220 lines of tests.
- All 44 checks: about 450 lines of Node, plus about 450 lines of tests. About 120 of those lines are shared plumbing: reading the hook input from both products, a small front matter reader, a Markdown table reader, the ID index, and the output.
- Also: a 3-line `pre-commit` file, and two new entries (after-edit and stop) in each of the six settings snippets.
- Node 20, ES modules, no npm dependencies. One file, `validate-records.mjs`, beside the other hook commands.

**What it must never do.**

- Never fail because of its own error. On a crash, an unreadable file, or input it does not understand, it prints one line and exits 0. It exits 2 only when it has a finding to report.
- Never write, move, or delete a file. It only reads.
- Never contact the network or run `ntn`, `gh`, `sf`, or any other program except `git` to list staged files. When work items are in Notion or GitHub, it checks only that an ID is well formed.
- Never keep the agent from stopping more than once in a row. When `stop_hook_active` is true it exits 0.
- Never print more than about 2,000 characters. Codex cuts hook text at about 2,500 tokens by default, and the existing hook already trims its own output.
- Never check template folders, and never check Git-ignored folders at commit time.
- Never take more than a second or two. It checks the edited file and the records that file points to, not the whole project, except at stop and at commit.
- Never stop a commit on a "warn" check.

## 11. Out of scope

Rules that are not about maintaining project files and folders.

| File | Subject |
|---|---|
| `AGENTS.md`, sections "What the owner decides" (lines 79-85, 93), "Skills" (the routing lines not listed in section 2), "Commands", "How to write replies" | Approvals, skill routing, commands, writing style |
| `AGENTS.md`:13, 37, 39 | Voice-to-text, which files to read at session start |
| `SOUL.md` | The owner's working style |
| `rules/check-deployment-contents.md` | Salesforce deploy safety |
| `rules/cite-recalled-knowledge.md` | Writing style (its examples name removed folders: X-14) |
| `rules/confirm-salesforce-changes.md` (all but line 8) | Salesforce approvals |
| `rules/dependency-graph.md` (all but lines 18, 19, 21) | Salesforce impact tool |
| `rules/humanize-outbound-text.md` | Writing style |
| `rules/memory-review-and-save.md`:29-31 | Hindsight key file and tools |
| `rules/permissions-source-control.md` | Salesforce permission sets |
| `rules/plain-english-artifacts.md` | Writing style |
| `rules/production-data-changes.md`:5-7 | Salesforce org safety |
| `rules/publish-project-documents.md`:18, 20, 21 | Git safety |
| `rules/salesforce-org-safety.md` | Salesforce org safety |
| `rules/shared-repository-work.md` (all but lines 22, 30, 31) | Git safety |
| `.claude/output-styles/plain-english.md` | Writing style |
| `.claude/hooks/guard-protected-orgs.cjs`, `.claude/hooks/guard-permission-set-deploy.cjs`, `.claude/protected-orgs.json` | Salesforce org safety |
| `tools/kb/**`, `tools/permissions/**` | Salesforce tools |
| `delivery/deployment/**/package.xml`, `destructiveChanges.xml` (the "do not deploy the seed" notes) | Salesforce deploy safety |
| `README.md`:36 | Obsidian settings for people |
| `.claude/settings.json` (the deny and ask lists) | Git and Salesforce safety |

## 12. Files with no setup markers

Added at the owner's request. The direction measured against: a setup choice decides which files a project gets and never changes the words inside a file. Tool-specific text lives only in a file that exists for that choice.

Verified count: the starter project holds 53 marker blocks in four files: root `AGENTS.md` 26, `PROJECT.md` 18, `README.md` 8, `rules/memory-review-and-save.md` 1.

Setup already works this way for whole files. `references/setup-copy.md`:60-84 removes `work-items/`, `rules/work-item-folders.md`, and `PROJECT-ROADMAP.md` when work items are not local, removes `memory/` files by memory choice, and removes nine Salesforce rules and the Salesforce skills from a project that is not Salesforce. So "a rule file that exists only for one choice" is an existing mechanism, not a new one.

### 12.1 All 53 marker blocks

"Where it goes" uses three answers: **Choice file** (a file that exists only for that choice), **One sentence** (a sentence that is true for every choice), **Delete**.

Three choice files below do not exist yet. Each is a new rule file and needs the owner's yes:

- `.claude/rules/hindsight-memory.md`, only in a Hindsight project, always on.
- `.claude/rules/notion-records.md`, only in a project with work items or memory in Notion, always on.
- `.claude/rules/salesforce-project.md`, only in a Salesforce project, always on.

| # | File and lines | Condition | What the block says | Answer | Where it goes |
|---|---|---|---|---|---|
| 1 | AGENTS.md:15-23 | memory=hindsight | Memory is Hindsight in the bank named in `PROJECT.md`; what counts as project memory; what never goes in it; how to open the dashboard. | Choice file | `.claude/rules/hindsight-memory.md` |
| 2 | AGENTS.md:28-30 | memory=local | When Current State is missing, read `memory/CURRENT_STATE.md` in the main checkout. | Delete | The hook prints this when it fails (`session-start.mjs`:35, 67-70) |
| 3 | AGENTS.md:31-33 | memory=hindsight | The same sentence as block 2. | Delete | The same |
| 4 | AGENTS.md:34-36 | memory=notion | When Current State is missing, read the "Current state" page with `storing-project-memory`. | Delete | The hook prints this when it fails (`session-start.mjs`:33-34) |
| 5 | AGENTS.md:51-53 | tracker=local | `PROJECT-ROADMAP.md` holds the phases and the top-level items in each. | One sentence | Routing row: "the work tracker's roadmap (`tracking-work-items` says where it is)". The file itself exists only for a local tracker |
| 6 | AGENTS.md:60-62 | tracker=local | `work-items/` is the tracker: one folder per item, Git-ignored, only in the main checkout. | Choice file | `work-items/AGENTS.md`, which exists only with the folder |
| 7 | AGENTS.md:63-65 | memory=local | `memory/` holds Current State, the index, the glossary, decision records, and topic notes. | Choice file | `memory/AGENTS.md`, which exists only with local memory |
| 8 | AGENTS.md:66-68 | memory=hindsight | `memory/CURRENT_STATE.md` is the only memory file in the folder. | Choice file | `.claude/rules/hindsight-memory.md` |
| 9 | AGENTS.md:69-74 | salesforce | `delivery/` holds client files, data loads, and deployment packages; `force-app/` holds Salesforce source; `tools/` holds the impact and permission tools. | One sentence + Choice file | The `delivery/` routing row is true for every project type in the new layout. The Salesforce lines go in `.claude/rules/salesforce-project.md` |
| 10 | AGENTS.md:82-85 | salesforce | Agents never deploy to, validate against, or write data in production. | Delete | `rules/salesforce-org-safety.md`:18-19 already says it, and that file exists only in a Salesforce project |
| 11 | AGENTS.md:101-103 | not salesforce | The requirements, questions, tasks, design, and source files of one change go in that work item. | One sentence | One routing row for every project; sources go to `sources/` |
| 12 | AGENTS.md:104-106 | salesforce | The same row, plus "a client file stays in `delivery/`". | One sentence | The same row. The exception disappears: every original goes to `sources/` |
| 13 | AGENTS.md:123-125 | tracker=local | IDs look like `WI-001`; the prefix is in `PROJECT.md`. | Choice file | `tracking-work-items` (the local version) |
| 14 | AGENTS.md:126-129 | tracker=notion | The tracker is the Work Items database in Notion; the owner's edits win; IDs look like `WI-31`. | Choice file | `tracking-work-items` (the Notion version) |
| 15 | AGENTS.md:130-133 | tracker=github | The tracker is GitHub Issues; an ID is the issue number, written `#12`. | Choice file | `tracking-work-items` (the GitHub version) |
| 16 | AGENTS.md:134-137 | tracker=jira | The tracker is Jira; an ID is the Jira key. | Delete | Jira is deferred. When its skills are built, the text goes in that `tracking-work-items` |
| 17 | AGENTS.md:140-142 | memory=local | Change memory only through `managing-project-memory`; two other skills also edit Current State. | Choice file | `memory/AGENTS.md` |
| 18 | AGENTS.md:143-145 | memory=notion | Memory is in the Notion databases in Lore's layout; change it only through `managing-project-memory`. | Choice file | `storing-project-memory` (the Notion version) for where it is; `.claude/rules/notion-records.md` for "only through the skill" |
| 19 | AGENTS.md:146-148 | memory=hindsight | Memory is Hindsight: see "Project memory" at the top. | Delete | A pointer to block 1 |
| 20 | AGENTS.md:149-151 | tracker=notion or memory=notion | When you create or update something in Notion, fill every field you have information for. | Choice file | `using-notion-cli`, which only a Notion project gets |
| 21 | AGENTS.md:171-173 | tracker=notion | Read and change work items only through the two skills, whatever Notion tool is at hand; one Notion command can mark an item Done without the owner's yes. | Choice file | `.claude/rules/notion-records.md` |
| 22 | AGENTS.md:176-179 | memory=local | Keeping, correcting, forgetting, and looking up memory go to `managing-project-memory`, which uses `storing-project-memory`. | One sentence | The memory rows of the routing table. See 12.2 for the Hindsight difference |
| 23 | AGENTS.md:180-184 | memory=notion | The same two lines as block 22, plus "only through the skill, whatever Notion tool is at hand". | One sentence + Choice file | The same rows; the third line goes in `.claude/rules/notion-records.md` |
| 24 | AGENTS.md:185-187 | memory=hindsight | Memory is the Hindsight add-on and its tools; edit `memory/CURRENT_STATE.md` directly, within its limits. | Choice file | `.claude/rules/hindsight-memory.md` |
| 25 | AGENTS.md:189-194 | salesforce | Four lines that send Salesforce work to the Salesforce skills. | Choice file | `.claude/rules/salesforce-project.md` |
| 26 | AGENTS.md:202-206 | salesforce | Three commands: check impact, check permission sets, validate against the sandbox. | Choice file | `.claude/rules/salesforce-project.md` |
| 27 | PROJECT.md:7-9 | salesforce | Purpose prompt: "Why this Salesforce project exists." | One sentence | "Why this project exists." |
| 28 | PROJECT.md:10-12 | not salesforce | Purpose prompt: "Why this project exists." | One sentence | The same |
| 29 | PROJECT.md:38-40 | tracker=local | The roadmap is `PROJECT-ROADMAP.md`; project tasks are in `work-items/PROJECT-TASKS.md`. | One sentence | "Project roadmap and project tasks: in the work tracker set under Toolkit settings." The tracker's `tracking-work-items` says where |
| 30 | PROJECT.md:41-43 | tracker=notion | The roadmap and tasks are the Phases and Tasks databases in Notion. | One sentence | The same |
| 31 | PROJECT.md:44-46 | tracker=github | The roadmap is the milestones; tasks are in the pinned issue. | One sentence | The same |
| 32 | PROJECT.md:52-54 | memory=local | Local memory is `memory/`, flat and Git-ignored. | One sentence | "Memory: set under Toolkit settings below", as line 37 already does for the tracker |
| 33 | PROJECT.md:55-57 | memory=hindsight | The memory store is the Hindsight bank, with Current State in a local file. | One sentence | The same |
| 34 | PROJECT.md:58-60 | memory=notion | The memory store is the Notion databases in Lore's layout. | One sentence | The same |
| 35 | PROJECT.md:64-68 | salesforce | The Salesforce source path, the project-wide manifest, and the work-item manifests. | Choice file | `.claude/rules/salesforce-project.md` |
| 36 | PROJECT.md:82-84 | memory=local | The "Memory approval" setting. | One sentence | The label stays in every project; the value is "not used" where it does not apply |
| 37 | PROJECT.md:85-87 | memory=notion | The same line as block 36, word for word. | One sentence | The same |
| 38 | PROJECT.md:88-90 | tracker=local | The "Work item ID prefix" setting. | One sentence | The label stays in every project; "not used" for GitHub |
| 39 | PROJECT.md:91-94 | tracker=notion | The ID prefix, and the links to the Notion page and database. | One sentence | Two fixed labels: "Work item ID prefix" and "Tracker location" |
| 40 | PROJECT.md:95-97 | tracker=github | The GitHub repository. | One sentence | The fixed label "Tracker location" |
| 41 | PROJECT.md:98-101 | tracker=jira | The Jira project and its status list. | Delete | Jira is deferred |
| 42 | PROJECT.md:102-104 | memory=notion | The links to the Notion memory page, databases, and "Current state" page. | One sentence | The fixed label "Memory location" |
| 43 | PROJECT.md:105-109 | memory=hindsight | The Hindsight bank, server address, and dashboard link. | One sentence | The fixed label "Memory location", with the three values |
| 44 | PROJECT.md:110-112 | salesforce | The Salesforce org aliases. | One sentence | Rows in the "Systems and environments" table at `PROJECT.md`:21-25, which every project has |
| 45 | README.md:14-16 | salesforce | Start step 2: how to identify the correct Salesforce org or environment. | One sentence | "How to identify the correct environment." |
| 46 | README.md:17-19 | not salesforce | Start step 2: how to identify the correct environment. | One sentence | The same |
| 47 | README.md:25-27 | tracker=local | A link to `PROJECT-ROADMAP.md`. | One sentence | Line 31 already says active work is in the tracker; add "and the project's phases" there |
| 48 | README.md:33-38 | tracker=local or memory=local | How to open the project folder in Obsidian. | One sentence | Keep it in every project. In the new layout every project has `system/`, `sources/`, and `DECISIONS.md` as files, so the paragraph is always true |
| 49 | README.md:39-44 | tracker=local | What a work item folder holds. | Delete | `work-items/AGENTS.md` says it (A-174) |
| 50 | README.md:45-52 | memory=local | What `memory/` holds and that the index is generated. | Delete | `memory/AGENTS.md` says it (A-175) |
| 51 | README.md:57-59 | salesforce | Environments: verified orgs and aliases. | One sentence | "Environments: the verified environments; never infer a target from a template." |
| 52 | README.md:60-62 | not salesforce | Environments: verified environments. | One sentence | The same |
| 53 | rules/memory-review-and-save.md:23-33 | memory=hindsight | The Hindsight section: use the add-on's tools, never show the key file, how to forget a memory, and the Current State limits. | Choice file | `.claude/rules/hindsight-memory.md` |

Totals: 16 blocks go to a choice file, 26 become one sentence, 2 are split between the two, and 9 are deleted.

### 12.2 Where a difference between choices remains, and why

The proposed root routing table (section 8) and the six folder files (section 9) hold no marker. Two lines in the root still touch a difference. Neither needs a marker.

1. **The memory rows, "Before you write there" cell: `managing-project-memory`.** A Hindsight project has no skill of that name. I keep the one name in the row for every project, and the Hindsight-only rule file redirects it. The starter project already works this way: `rules/memory-review-and-save.md`:29 says "Where a rule, `AGENTS.md`, or a skill names the memory save or find skill ... use the add-on's tools". The line cannot be made literally true for all three memory choices unless the Hindsight set also gets a skill called `managing-project-memory`, which the toolkit's own `AGENTS.md` rules out today.
2. **The rules list.** Today setup writes a list of the project's rule files between `<!-- toolkit:rules:start -->` and `<!-- toolkit:rules:end -->` (root `AGENTS.md`:212-238). It is not an if-then block, but it is text inside the file that differs from project to project. I replace it with one sentence that is true for every project (the last line under the table in section 8). The cost, which is inference: Codex must list the folder and open each file instead of reading names from a list. If the owner prefers to keep the generated list, it is the one place in the root where the words differ between projects.

Three more things differ between projects without being markers. They are data, not instructions:

- The values in `PROJECT.md` "Toolkit settings". Under 12.1 the labels are the same in every project and only the values differ.
- The project's name, its one-sentence description, and its build command in the root `AGENTS.md` (lines 7, 11, and 201). Moving these three to `PROJECT.md`, which already has a purpose and a "Tests and checks" line, would make the root `AGENTS.md` word for word the same in every project. Then the owner's edit to it in any project can be copied straight back to the toolkit. This is my suggestion, not something a file says.
- Setup also edits three shared files for a project that is not Salesforce: it deletes entries from `.claude/settings.json`, lines from `.gitignore`, and two paths from `rules/publish-project-documents.md` (verified: `references/setup-copy.md`:163-193). These are outside the 53 blocks but are the same kind of change. The `.gitignore` lines and the two paths are harmless in every project and can stay. The settings entries belong in a Salesforce-only snippet file in `assets/settings/`, merged like the other snippets.

One conflict with the new layout to settle: setup removes `delivery/` from a project that is not Salesforce (`references/setup-copy.md`:74), but the new layout keeps `delivery/` for all project types.

### 12.3 Count

Marker blocks that remain under this proposal: **0 of 53**.

- Root `AGENTS.md`: 26 to 0.
- `PROJECT.md`: 18 to 0.
- `README.md`: 8 to 0.
- `rules/memory-review-and-save.md`: 1 to 0.
- Folder-level files in section 9: 0.

What it costs: three new rule files that each exist only for one choice (Hindsight, Notion, Salesforce), a fixed set of labels in "Toolkit settings" with "not used" as a value, and text moved into the three `tracking-work-items` versions, `storing-project-memory` (Notion), and `using-notion-cli`. Skills read some of the labels that would change (for example "Salesforce org aliases", named at root `AGENTS.md`:205), so those skills change in the same step. I did not audit the skills.
