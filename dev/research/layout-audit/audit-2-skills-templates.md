# Audit 2: skills and templates against the new project layout

Read-only audit of every skill folder under `.shared-skills/` and `.skill-sets/` in the clean copy of Toolkit V2 (117 files; 6,310 lines of Markdown, all read; the 43 Notion schema files were checked for instructions). The three `sf-*` skills, the three hook commands, and the starter project's root `AGENTS.md`, settings, and rules were read for the skill map and the overlap checks only.

How to read a source reference: `MWI/ref/reflecting.md:18-26` means lines 18 to 26 of that file.

| Short name | Folder (under `plugins/toolkit/skills/project-setup/assets/`) |
| --- | --- |
| MWI | `.shared-skills/managing-work-items/` |
| PWR | `.shared-skills/managing-project-wide-records/` |
| HO | `.shared-skills/handoff/` |
| PD | `.shared-skills/publish-docs/` |
| TWL, TWG, TWN | `.skill-sets/local-work/`, `github-work/`, `notion-work/` + `tracking-work-items/` |
| MPM | `.skill-sets/memory-process/managing-project-memory/` |
| SML, SMN | `.skill-sets/local-memory/`, `notion-memory/` + `storing-project-memory/` |
| `ref/`, `as/` | `references/`, `assets/` |

Codes used in the tables: `D-` a duplicate (section 3), `C-` a conflict between today's rules (section 4), `N-` a conflict with the new layout (section 4), `O-` an overlap between two skills today (section 8.2), `V-` a proposed check (section 6).

Every statement about what a file says was read in that file. A statement about where a rule should go, or what a new template should hold, is my recommendation.

## 1. Summary

### Counts

The inventory has **236 rows**, one per instruction about project files and folders. A row can sit in two buckets, so the bucket marks add up to 286.

| Bucket | Rows marked | Of those, in this bucket alone |
| --- | --- | --- |
| Skill (a multi-step procedure) | 92 | 69 |
| Validator (must always be true; a script can test it) | 68 | 26 |
| Template field (the template carries the rule) | 67 | 38 |
| Delete (not needed in the new layout) | 39 | 39 |
| Routing (where things go; root `AGENTS.md`) | 13 | 11 |
| Folder (how a folder works; that folder's `AGENTS.md`) | 7 | 3 |

- 21 rows are both Template field and Validator.
- 69 of 236 rows (29%) stay as skill prose alone. The other 71% are deleted, carried by a template, tested by a check, or moved to a routing table or a folder file.
- Section 3 lists 32 duplicated rules. Section 4 lists 13 conflicts between today's rules and 20 conflicts with the new layout. Section 6 lists 33 checks.

### The five findings that matter most

1. **Closing a work item has no gate.** Today the update of project documents is point 4 of a checklist that "needs no new approval" (MWI/ref/reflecting.md:3, 18-26). Nothing records an answer to "did this change the system?". The cancel path and the "Done by hand" path skip the update (MWI/ref/deploying.md:69, 74). Three files also disagree on whether documents are updated before or after delivery (C-03). Fix: one closing reference, a "Moved up" line in the work item that must be filled, and check V-23, which refuses a closed item with an empty line.
2. **One decision is stored in up to three records, and ten places tell the agent to offer it to memory.** A decision later items must follow gets a row in the item, a memory record, and sometimes a shared question (O-01, C-04, D-01). `DECISIONS.md` replaces all three: the entry holds the decision and its reason, and the item holds only the `DEC-###` ID. Today's rule "the reasoning stays in the work item" (MPM/ref/saving.md:55) must be reversed, because the item is now temporary (N-10).
3. **An original has four homes today, and one rule forbids the new one.** A local `references/` folder, a GitHub comment, a Notion Files property, or `delivery/` (C-11). The GitHub skill says "Never copy it into the repository" (TWG/ref/issue-layout.md:175). In the new layout every original goes to `sources/` and the item holds one line with the `SRC-###` ID, the same in all three trackers. Section 10 gives the steps and three points the owner must settle.
4. **The memory skills are built on restated facts.** Concept records with a "Remember" label, decision records, a glossary, and lessons fill 1,328 lines across the process skill and its two storage versions (376, 322, and 630, counted). Almost all of it conflicts with memory that holds only where work stopped and pointers (N-07, N-08). The skills stay, much smaller. Two things have no home in the new layout and need the owner's call: lessons that are not proven yet, and whether Notion memory still uses Lore's five databases.
5. **The same record form is written three to five times, and the proposed check has three hard limits.** The requirement block, the question row, the history row, and the "no prompt left" rule are each stated in the template, in the process skill, and again in each tracker version (D-02 to D-08). Templates and checks can replace most of it. But: the toolkit's own "Code limit" rule means a checking script needs the owner's yes first; Git ignores `work-items/` and `memory/`, so nothing in them can be tested before a commit; and no script can read items kept in Notion or GitHub. Section 6 marks each check with where it can run. Section 8.6 lists where a check would repeat a test that a hook or a skill runs today.

### The skill map (sections 8 and 12)

- **No new skill, one skill removed, four renamed.** Section 12 holds the final map, after the owner's later decisions. `managing-project-wide-records` is removed. All four events in the guidance become reference files inside `running-work-item-lifecycle` (today's `managing-work-items`): `closing.md`, `record-decision.md`, `file-source.md`, and `update-system-doc.md`. That skill owns each of those events today, and it is in every project. The other renames: `using-work-tracker`, `curating-project-memory`, `using-memory-store`.
- A project gets 12 skills (13 with Notion), one fewer than today, and every chat reads one description fewer. Four new skills would have added three.
- Section 8.1 maps all 17 skills a project can get today. Section 8.2 lists 16 overlaps with files and lines. Section 8.4 lists 28 events with exactly one owning skill each; it found two events with more than one owner and fixed both. Section 8.6 lists where a check would repeat a test that exists today.
- Sections 8.3 to 8.5 show the earlier proposal, which renamed the removed skill to `filing-project-records`. Section 12 replaces it.

### Earlier owner decisions this proposal touches

- Removing one skill and renaming four (section 12.1) changes each folder, `dev/SKILL-INDEX.md`, the setup references, `README.md`, and the routing lines in the starter `AGENTS.md`, and needs the owner's yes (toolkit `AGENTS.md`, "Adding, renaming, or removing a skill").
- Every renamed skill gets a new description, and so does each skill whose description names one (`publish-docs`, `braindump`, `merge-and-clean-up`, `sf-deploy-check`). The `handoff` description changes too, because it says what the skill offers to memory. Each change means the routing test runs again in both hosts.
- The split of memory into a process skill and a storage skill (the owner, 2026-10-01) is kept.
- The rule "Notion memory uses Lore's layout" is kept, and questioned in finding 4.
- A checking script is a new command under the "Code limit" rule.

### Could not determine

1. Whether `system/` describes what is decided or what is built. The brief says "approved source of truth" and "Last changed via DEC-###", which points to the decision; the closing question points to delivery. Today's skills keep these apart (C-03). One sentence in `system/AGENTS.md` must settle it.
2. Where a lesson that is not proven yet goes, and where facts about the owner and records of one-time events go. Section 8.4 proposes the work item's Notes until the owner decides.
3. The ID prefixes for `architecture.md`, `data-model.md`, and `automation.md`. The brief names only `CON`, `SEC`, `INT`, `DEC`, and `SRC`.
4. Whether every original may be committed to Git, given file types, size, and privacy (section 10).
5. Whether Notion memory keeps Lore's five databases when it holds pointers only, and what to do about Hindsight's add-on, which saves each session by itself (N-15).
6. What "handoffs" under `delivery/` means. Today a session handoff prompt is shown in the chat and saved nowhere (N-17).
7. Whether a sub-item keeps a word-for-word copy of its parent's requirements, or a pointer (C-10).
8. The size of the checking script. I did not design or size it.
9. `dev/SKILL-INDEX.md`:212 names the starter file `memory/memory-criteria.md` as the source of a skill file. That file is not in the clean copy's starter `memory/` folder. I could not tell whether it is missing or hidden from the copy by the starter's own `.gitignore`.

## 2. Inventory

One row per instruction about project files and folders. "Where it goes" uses the skill names of section 8.3, written before the owner's later decisions. Read them with section 12.1: `filing-project-records` now means `running-work-item-lifecycle`, which holds `references/closing.md`, `record-decision.md`, `file-source.md`, and `update-system-doc.md`; `managing-work-items`, `tracking-work-items`, `managing-project-memory`, and `storing-project-memory` have new names.

### 2.1 `managing-work-items`: SKILL.md

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-001 | MWI/SKILL.md:8 | The process skill never says where items are saved; every read and save goes through `tracking-work-items`. | Skill | `managing-work-items/SKILL.md`, unchanged | It is the boundary between the two skills. One line. |
| B-002 | MWI/SKILL.md:12-25 | Every item has a State and a Status, and the Status follows from the State (10 pairs). | Template field + Validator | Work item template header; check "status matches state" | The template already lists both value sets (MWI/as/work-item-template.md:5-6). The pairing can be tested. |
| B-003 | MWI/SKILL.md:27 | An item moves to the next State only when the "Move on when" test for its State is true. | Skill + Validator | `managing-work-items/SKILL.md`; approval-before-State checks | The approval part is testable: Designing or later needs `requirements_approved`; Reflecting or later needs `result_approved`. |
| B-004 | MWI/SKILL.md:29 | A parent stays in Building until every sub-item is Done or Cancelled. | Validator | Check on parent and sub-item States | Always true. Testable for local items. |
| B-005 | MWI/SKILL.md:30; MWI/ref/reflecting.md:30-31 | An item with nothing to merge or deploy skips Deploying, with a Recent History row that says so. | Skill | `managing-work-items/references/closing.md` | A step at close. |
| B-006 | MWI/SKILL.md:31 | A Backlog item holds the idea in the owner's words as Requirement 1, and a Next action in the Working form. | Template field | Work item template (Original verbatim requirement; Next action) | Both fields exist. The sentence can shrink to one line. |
| B-007 | MWI/SKILL.md:32 | A Blocked item names what it waits on, who can clear it, and the State it left, in the Blockers line. | Template field + Validator | Blockers prompt in the template; check "a Blocked item has a filled Blockers line and `waiting_on` set" | The template's Blockers prompt (line 37) does not ask for the State it left. Add it and drop the prose. |
| B-008 | MWI/SKILL.md:33; MWI/ref/deploying.md:64, 74 | Done and Cancelled happen only on the owner's word; cancelling keeps every record. | Skill + Validator | `closing.md`; check "a closed item has an answered close row or a 'by hand' history row" | The approval is a step. The trace it leaves is testable. |
| B-009 | MWI/SKILL.md:37-46 | Work sits in four levels; only a top-level item has phases; a phase is never a work item. | Skill + Validator | `managing-work-items/SKILL.md` (the table only); depth and Roadmap checks | The table is needed to plan. The limits are testable. |
| B-010 | MWI/SKILL.md:47 | A task belongs to the project or to one item; work the goal does not need is a new Backlog item. | Routing | Root `AGENTS.md` filing table | Where things go. The starter `AGENTS.md` already has these rows (lines 99-100). |
| B-011 | MWI/SKILL.md:48 | Task IDs are `P1-T01`, `T01`, and `PT-01`, and are never reused. | Template field + Validator | Template task form; ID pattern and uniqueness check | The template shows the form. Reuse is testable. |
| B-012 | MWI/SKILL.md:49 | A project task is set In Progress before work and ticked only when its Done-when check is met; an open owner task is reported as waiting. | Skill | `managing-work-items/SKILL.md` | Procedure. |
| B-013 | MWI/SKILL.md:50 | Never add a fourth level. | Validator | Depth check | Always true. Stated in 8 places (D-12). |
| B-014 | MWI/SKILL.md:52 | A top-level item goes under a project phase at the latest when it leaves Backlog; until then Related items says "No project phase yet." | Template field + Validator | Related items line; check "a top-level item that left Backlog has a project phase" | Testable. |
| B-015 | MWI/SKILL.md:53-54 | Project phases change only with the owner's yes; a phase goes In Progress when its first item leaves Backlog; the owner is asked when its last item closes. | Skill | `managing-work-items/SKILL.md` and `closing.md` | Approval step. |
| B-016 | MWI/SKILL.md:58-65 | Six points need the owner's OK, each recorded only when he answers that question. | Skill + Validator | `managing-work-items/SKILL.md`; approval-before-State checks | The list is process. The recorded approvals are testable. |
| B-017 | MWI/SKILL.md:69-70 | Read the item fresh before acting; save after each step and read it back; a failed save starts the reply with "Not saved". | Skill | `managing-work-items/SKILL.md`, once | Stated in 9 places (D-08). Keep one. |
| B-018 | MWI/SKILL.md:71 | After each step, rewrite the item's Current state in place. | Template field | Template comment (line 29) | The template already says it. Delete the prose here. |
| B-019 | MWI/SKILL.md:72 | The project's Current State lists under Now every item that left Backlog and is not Done or Cancelled. | Validator | Check Now lines against item States | Always true. Stated in 6 places (D-17). |
| B-020 | MWI/SKILL.md:73 | Every new item gets a `type` from the template's list. | Template field + Validator | `type` field; value check | The template lists the nine values. |
| B-021 | MWI/SKILL.md:74 | Never delete a requirement, a question row, or a phase; mark it dropped, superseded, or cancelled. | Validator | Check "requirement, question, and phase numbers have no gaps" | Testable. One line stays in the skill. |
| B-022 | MWI/SKILL.md:75 | Text in angle brackets is a prompt; no item an agent touched may hold one. | Validator | Check "no template prompt is left in an item, a design, or a system document" | A 190-word paragraph becomes one check. Stated in 12 places (D-02). |
| B-023 | MWI/SKILL.md:3, 90 | A source, question, person, domain map, or target direction shared by several items goes to `managing-project-wide-records`. | Routing | Root `AGENTS.md`; the hand-off row names `filing-project-records` | The folder is removed (N-04). |
| B-024 | MWI/SKILL.md:91-92 | Search for, and save, decisions that matter beyond the item through `managing-project-memory`. | Routing | Root `AGENTS.md`: such decisions are read from and saved to `DECISIONS.md` | Conflicts with memory that holds pointers only (N-07). |
| B-025 | MWI/SKILL.md:93 | Update the project's Current State by editing `memory/CURRENT_STATE.md`, or through `managing-project-memory`. | Skill | Hand-off row stays; `managing-project-memory` owns the rules of that record | Three skills write this record today (O-02). |

### 2.2 `managing-work-items`: the work item template

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-026 | MWI/as/work-item-template.md:1-15 | An item has 13 header fields, each with a fixed value list or format. | Template field + Validator | Work item template; value checks | Already a template. |
| B-027 | same:19 | Find an item by its `id`, never by its path. | Validator | Check "one file per id; the file name equals the id" | Stated in 8 places (D-18). |
| B-028 | same:19, 141-145 | Source files are saved with the item and listed under Notes, Sources; a Salesforce client file stays in `delivery/`. | Template field | Sources line becomes "`SRC-###`: what it is. Taken from it: IDs." | Conflicts with `sources/` (N-01, N-02). |
| B-029 | same:27-39 | Current state is five labelled lines, rewritten in place, one or two sentences each, never a log. | Template field + Validator | Template; check "exactly five labelled lines" | Testable. |
| B-030 | same:33 | Next action has three forms: Working, Waiting, and Finished or cancelled. | Template field + Validator | Template; pattern check | Stated in 6 places (D-07). |
| B-031 | same:35 | The "Waiting on" line matches the `waiting_on` field. | Validator | Agreement check | One fact in two places. |
| B-032 | same:41 | Related items holds the project phase or parent ID, related item IDs (never paths), and how to find the memories that name the item. | Template field | Template; drop the memory sentence; add a "Moved up" line (section 9) | Memory no longer holds facts about an item (N-18). |
| B-033 | same:45-54 | Only a top-level item has a Roadmap, with at least one phase and five columns. | Template field + Validator | Template; check "Roadmap rows equal Tasks headings" | Testable. |
| B-034 | same:58-93 | A task is a checkbox block with an ID, a status, and the lines Work, Deliverable, Done when, Who does it, Depends on. | Template field + Validator | Template; check "each task has the five lines; a ticked task says Done" | Testable. |
| B-035 | same:97-101 | Recent History gets one row, newest first, for a listed set of changes, and names a decision by its Q-ID. | Template field | Template comment | Stated in 4 places (D-05). |
| B-036 | same:105-122 | Each requirement is one numbered block: Original verbatim requirement, Goal, Functional Requirements, Acceptance Criteria; a dropped one keeps its block. | Template field + Validator | Template; check "an approved item has no requirement without a Goal, one functional line, and one acceptance line" | Stated in 5 places (D-03). |
| B-037 | same:126-131 | Every question is a row with a stable Q-ID; an answer is saved at once with his words and the date; a bulk yes is one row per thing. | Template field | Template | Stated in 6 places (D-04). |
| B-038 | same:126 | A decision that matters beyond the item is also offered for project memory, with a link back that names the Q-ID. | Skill | `filing-project-records/references/record-decision.md`; the row keeps only the `DEC-###` ID | Conflicts with the new layout (N-07, N-09). Stated in 10 places (D-01). |
| B-039 | same:135-152 | Notes holds Context, Sources, and Solution options; an open question is never kept only in Notes. | Template field | Template | Already a template. |

### 2.3 `managing-work-items`: the design template

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-040 | MWI/as/design-template.md:1-5, 11-15 | The design records its status and approval in the header (`status`, `approved`) and again in "Design status" and "Design approval". | Template field + Validator | Keep one status line; check it agrees with the item's `design` field | One approval is written in up to 7 places today (D-21). |
| B-041 | same:9, 17 | The design sits beside the item's main file; the main file holds the goal, requirements, questions, and history. | Folder | `work-items/AGENTS.md` | How the folder works. |
| B-042 | same:23-29 | The design never fills a missing requirement; a gap goes back to the item's Questions and Answers. | Template field | Template prompt | Already there. MWI/ref/designing.md:29 repeats it. |
| B-043 | same:35-39 | Constraints and assumptions are listed with their source and status. | Template field | Add a column for the `CON-##` or `DEC-###` ID | A constraint that several areas share now lives in `system/constraints.md`. |
| B-044 | same:92-96 | The owner's choice names who decided, when, and the Q-ID of the row that records it. | Template field + Validator | Template; check "an approved design names an answered Q-ID" | Testable. |
| B-045 | same:100-128 | The selected design describes components, data, access, integrations, and operations. | Template field | Add a table "System documents this design changes" (document, rule ID, change) | This is the content that must move up at close. Nothing lists it today. |
| B-046 | same:159-165 | Every claim the design depends on has a source row with a date, the kind of evidence, and how it was checked. | Template field | The Source column takes `SRC-###`, `DEC-###`, or a link | IDs replace free text. |
| B-047 | same:173-185 | Open design questions live in the item's Questions and Answers; the design lists them by Q-ID. | Template field | Template | Already there. |

### 2.4 `managing-work-items`: Refining Requirements

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-048 | MWI/ref/refining-requirements.md:16-26 | The requirement block has four parts with set contents, numbered in order, named `R-01` elsewhere. | Delete | The template carries it | A copy of the template (D-03). |
| B-049 | same:27 | Approval is written only in `requirements_approved` and in the row that holds his yes; a requirement with an open approval row is not approved. | Validator | Check "`requirements_approved` has a date and no approval row is open" | Testable. |
| B-050 | same:28-29 | Items made before toolkit 0.8.1 or 0.8.4 keep their older layout. | Delete | Nowhere, once items are moved to the new layout | A note for older items. Repeated in TWL, TWG, and TWN. |
| B-051 | same:34 | New work becomes an item in Refining Requirements, titled in his words, with one requirement per thing asked. | Skill | `managing-work-items/references/refining-requirements.md` | Procedure. |
| B-052 | same:36-39 | Before refining, read memory, related items, `requirements/`, `system-guide/`, and `project-wide-records/`. | Skill | Same file; read `DECISIONS.md`, `system/README.md`, the area's `system/` document, and `system/constraints.md` | All three folders are removed (N-04, N-05). |
| B-053 | same:42 | Each question gets its row before the reply ends, with `waiting_on` set to the owner and the Q-ID in Current state. | Skill + Validator | Same file; check "an open row that needs the owner means `waiting_on` is owner" | Procedure with a testable trace. |
| B-054 | same:43-49 | Each answer is saved in one save and applied to the goal, requirement, roadmap, Notes, or options it settles. | Skill | Same file | Procedure. |
| B-055 | same:51 | An answer that a later item must follow is offered to memory. | Skill | `record-decision.md`; one line here applies the filing test | D-01, N-07. |
| B-056 | same:52-54, 59-61 | An answer that affects several items updates a shared question and its incorporation checks. | Delete | The `DECISIONS.md` entry lists the affected items; a check tests the pointers | Shared questions are removed (N-04). |
| B-057 | same:55-64 | A changed answer gets a new row; the old row is marked superseded; the old wording is kept in Recent History; a changed approved requirement needs its own approval row. | Skill + Validator | Same file; check "a superseded row names an existing Q-ID" | Procedure with a testable trace. |
| B-058 | same:62, 71, 105 | A sub-item copies its parent's requirement lines word for word, and the copy is changed when the parent's changes. | Template field | Sub-item requirement holds "Covers <parent ID> R-xx" | One fact is kept in two items by hand (C-10). The owner must choose: a pointer only, or a copy. |
| B-059 | same:66 | Stop asking when every requirement has a Goal, one functional line, and one acceptance line, no question is open, one phase exists, and the split is settled. | Validator | "Ready for approval" check | A testable list. |
| B-060 | same:68-71 | Approval adds the row "Do you approve these requirements?", saves his words, sets `requirements_approved`, and moves the State. | Skill | Same file | Procedure. |
| B-061 | same:72 | On a pause, Current state names what is settled and the first open Q-ID. | Template field | Next action, Waiting form | The template's form covers it. Delete the prose. |
| B-062 | same:84 | The row holds the question and the "Recommended:" line. | Template field | Question cell prompt | Put it in the template's prompt. |
| B-063 | same:89 | Save a transcript or document with `tracking-work-items` before use; pasted text is saved exactly, named `YYYY-MM-DD-<short-name>.md`; never edit a saved source. | Skill + Validator | `filing-project-records/references/file-source.md`; check "a committed file in `sources/` is never changed" | N-01. Git can test that a file did not change. |
| B-064 | same:90 | In a Salesforce project a client file stays in `delivery/`. | Delete | `sources/` holds every original | N-02. Stated in 10 places (D-10). |
| B-065 | same:91 | One Sources line per source: where it is, what it is, and the IDs taken from it. | Template field | Sources line | Already a template field. |
| B-066 | same:92-94 | A source that affects several items is kept once and linked through an intake receipt. | Delete | Not needed: `sources/` is outside every item | The problem the receipt solved is gone. |
| B-067 | same:95 | From a source: a stated behavior becomes a requirement in the source's words; another person's decision becomes a question; a gap becomes a question. | Skill | `refining-requirements.md` | Procedure. Also in PWR/ref/source-intake.md:26-29. |
| B-068 | same:101-105 | Phases and splits are proposed as one question; a sub-item is created with the parent's ID and listed under its phase. | Skill + Validator | Same file; check "the parent's list equals the sub-items' `parent`" | Procedure. The link is testable. |
| B-069 | same:110 | Only the owner's words answer a question; a source or another person stays a candidate. | Skill | Same file, once | Also in PWR (D-20). |
| B-070 | same:113 | A sub-item has its own Questions and Answers. | Delete | The template gives every item the table | Not needed as prose. |

### 2.5 `managing-work-items`: Designing

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-071 | MWI/ref/designing.md:3, 30 | One design per item, saved from the template; the owner's choice is a Questions and Answers row that the design names. | Validator | Check "one design per item" | Testable for local items. |
| B-072 | same:10 | Before designing, search memory, `requirements/`, and `system-guide/`. | Skill | Same file; read `DECISIONS.md`, `system/constraints.md`, and the area's `system/` document | N-05, N-07. |
| B-073 | same:12 | Starting a design sets State Designing and `design: proposed`; "Design status" moves through Draft, In review, Approved, Superseded. | Template field + Validator | One status vocabulary in the template | Two vocabularies for one status today (C-05). |
| B-074 | same:16 | A proposed design adds the choice question as a row, sets `waiting_on`, and adds a history row. | Skill | Same file | Procedure. |
| B-075 | same:18-21 | Recording the choice: the row first; then approve, or treat it as a requirement change; approval fills five named places and turns the build order into tasks. | Skill + Validator | Same file; check "every acceptance line has a check in the design" | Procedure. Coverage is testable. |
| B-076 | same:22 | A design choice that later items must follow is offered to memory. | Skill | `record-decision.md` | D-01, N-07. |
| B-077 | same:25 | A change after approval moves the item back to Designing; the old choice row is superseded; the replaced option is marked. | Skill | Same file | Procedure. |
| B-078 | same:31 | When no independent critique ran, say so in the design's Notes. | Template field | Add an "Independent critique:" line to the design template | A field is more reliable than a sentence. |
| B-079 | same:33; TWL/ref/field-mapping.md:183 | A sub-item built from its parent's design has no design; its Related items says so. | Template field | Related items prompt | Field. |

### 2.6 `managing-work-items`: Building and the Testing Loop

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-080 | MWI/ref/building.md:20-22 | A task is set In Progress before work and ticked only with proof, and the proof is saved in Recent History. | Skill | `building.md`; the proof goes in one place | TWL says the proof goes on the Done-when line (C-01). |
| B-081 | same:27-37, 41-46 | `delivery` records who builds; each offer, answer, and team arrangement is its own Questions and Answers row; a changed answer supersedes the old row. | Skill | Same file | Procedure. |
| B-082 | same:54, 165; MWI/ref/builder-brief.md:53; MWI/ref/acceptance-checker-brief.md:10 | Only the lead chat changes a work item, memory, or the tracker; helpers report. | Skill | The helper briefs | It must be in the brief, because a helper sees nothing else. Stated 4 times (D-30). |
| B-083 | same:75-77 | A missing sub-item or task is created with set fields on the lowest-level item it belongs to. | Template field | Template | The fields exist. |
| B-084 | same:81-87 | The parent's Notes, Context holds one team list, one line per running helper. | Template field | Add a "Team" block to the template | The prose describes a field the template lacks. |
| B-085 | same:91-103 | An item's branch and worktree are named from its ID. | Skill | Same file | A link between a branch and an item. `merge-and-clean-up` reads it. |
| B-086 | same:121, 131-137 | Starting and returning helpers update the task, the sub-item, the phase, the team list, and Recent History on the sub-item and the parent. | Skill | Same file | Procedure. |
| B-087 | same:144-150 | Plan changes are recorded in the parent's Recent History; phase and task IDs never change. | Skill + Validator | Same file; ID checks | Procedure with a testable part. |
| B-088 | MWI/ref/testing-loop.md:12 | A test plan is `tests/<ID>-test-plan.md`, copied from `tests/TEST-PLAN-TEMPLATE.md`, committed on the item's branch, never saved in the tracker. | Routing + Validator | Root `AGENTS.md` row for `tests/`; file name check | Where things go. |
| B-089 | same:13, 15-17 | A defect outside the requirements becomes a new Backlog item; a failure becomes a task or a question row. | Skill | `testing-loop.md` | Procedure. |
| B-090 | same:13, 18 | Each check is one Recent History row in a set form; with no helper, the row says "Independent check: none". | Template field | Row form in the template comment | A form. |
| B-091 | same:19-20 | Result approval adds a row naming the commit, saves his words, sets `result_approved`, and moves the item to Reflecting. | Skill + Validator | Same file; check "`result_approved` has an answered row" | Procedure with a testable trace. |

### 2.7 `managing-work-items`: Reflecting and Deploying

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-092 | MWI/ref/reflecting.md:3 | Reflecting needs no new approval. | Delete | Replaced by the closing question | Conflicts with the guidance (N-14). |
| B-093 | same:7-11 | Before close: every task ticked or cancelled, phases Done, no Open row, sub-items closed, Current state matches the fields. | Validator | "Ready to close" check | Five testable facts. |
| B-094 | same:12 | Compare each approved requirement with the checker's verdicts; a requirement the build changed is a requirement change. | Skill | `closing.md` | Judgment. |
| B-095 | same:13-17 | Decisions and lessons are offered to memory once, one row per decision. | Skill | `closing.md` asks the closing question; each yes goes to `record-decision.md` | N-07. Lessons have no home in the new layout (section 1, "Could not determine"). |
| B-096 | same:18-20 | Write into `requirements/` only the approved requirements the checker marked Met, each naming the item and Q-ID; update `system-guide/` only when verified structure changed. | Skill + Template field | `closing.md` hands to `update-system-doc.md`; Changelog row (date, change, DEC, WI) | N-05. "Only what was marked Met" stays as a step. |
| B-097 | same:21-24 | Update a domain map's links; a proposed target stays labeled proposed. | Delete | The `system/` document's Status field | Records removed. |
| B-098 | same:25 | Update `PROJECT.md` or a README only when the item made it out of date. | Skill | `closing.md` | Procedure. |
| B-099 | same:26 | Save each document with `publish-docs`, and name each file and commit in Recent History. | Template field | The item's "Moved up" line names the IDs and the commit | A field replaces the sentence. See C-03 on timing. |
| B-100 | MWI/ref/deploying.md:23; TWG/SKILL.md:29; `merge-and-clean-up/SKILL.md`:103 | Pull request text and commit messages never close the item. | Validator | Commit message check for a closing word before an item number | Testable at commit. Stated in 3 skills (D-15). |
| B-101 | same:24; TWN/ref/page-layout.md:131-133 | The pull request is recorded on the item. | Template field | Add a "Pull requests" line to the template | Its home differs by tracker today (C-02). |
| B-102 | same:32-33, 37, 39 | Each merge is recorded as a Recent History row in a set form. | Skill | `deploying.md` | Procedure. |
| B-103 | same:46-48 | Each deploy's result is a Recent History row; a failed deploy fills Blockers. | Skill + Template field | `deploying.md`; a deployment record in `delivery/` for every project type | Only Salesforce projects have a deployment record file today (N-16). |
| B-104 | same:52-55 | Before asking to mark Done: every change merged, each deploy recorded, every finished phase Done. | Validator | "Ready to close" check, plus "the Moved up line is filled" | Testable. |
| B-105 | same:56-57 | Done sets State, `waiting_on`, and four Current state lines to set wordings. | Template field + Validator | Template; check a Done item's fields | Fixed values. |
| B-106 | same:58 | At Done, remove the item's lines from the project's Current State and check its project phase. | Validator | The same check as B-019 | Testable. |
| B-107 | same:64-70 | Cancelling records his reason, settles open sub-items, sets the fields, and offers decisions to memory. | Skill | `closing.md`, with the same closing question | The cancel path skips the document update today (C-12). |
| B-108 | same:74 | Done or Cancelled by hand counts; add a history row, say what had not happened, and offer decisions to memory. | Skill | `closing.md`, with the same closing question | The same gap (C-12). |
| B-109 | same:85 | One message may answer several questions: one row each. | Delete | Template line 126 says it | Duplicate. |
| B-110 | MWI/ref/salesforce-deploying.md:7, 22 | The item's deployment folder and the release folder have set names and files. | Folder | `delivery/AGENTS.md` | Also stated in `sf-component-tracker` (O-13). |
| B-111 | same:26-28 | After a deploy, fill "Execution and outcome" in `DEPLOYMENT-RECORD.md`, update the tracker, and add a history row. | Template field + Skill | Deployment record template; `deploying.md` | A template field plus one step. |
| B-112 | MWI/ref/requirements-analyst-brief.md:20; HO/ref/handoff-verifier.md:60; HO/as/handoff-prompt-template.md:5 | Helpers and the handoff prompt are pointed to `requirements/` and `system-guide/` files. | Skill | Same files; the paths become `system/` | N-05. |
| B-113 | MWI/ref/researcher-brief.md:9 | Research findings the item needs are recorded in Notes, Context, or the design's sources table. | Delete | Both fields exist in the templates | Not needed as prose. |

### 2.8 `managing-project-wide-records`

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-114 | PWR/SKILL.md:8-11 | `project-wide-records/` holds five kinds of records that link to, and never replace, the authoritative record. | Delete | Folder removed; "point, do not copy" becomes one line in root `AGENTS.md` | N-04. |
| B-115 | PWR/SKILL.md:15-19; PWR/ref/record-lifecycle.md:5-8 | Search for an existing record before creating one; update it instead of adding a file. | Skill | `filing-project-records/SKILL.md`, once for all three events | A step that decisions, sources, and system documents share. |
| B-116 | PWR/SKILL.md:20-23; PWR/ref/source-intake.md:7-21 | A source is saved once in one home: an anchor work item, or `delivery/` in a Salesforce project; raw client material never goes in `project-wide-records/`. | Routing | Root `AGENTS.md`: every original goes to `sources/` | N-01, N-02. |
| B-117 | PWR/SKILL.md:24-26; PWR/ref/questions-and-change-impact.md:3-6 | A question one item needs stays in that item; one that several need becomes a shared question with a `PQ-` ID. | Routing | Root `AGENTS.md` filing rule; the shared one is a `DEC-###` entry with Status Open | Where things go. |
| B-118 | PWR/SKILL.md:27-29; PWR/ref/record-lifecycle.md:34-40 | A domain map, person record, or target architecture record is created only at a threshold and kept current. | Delete | `system/README.md` and each document's Status and Governs lines | Records removed. |
| B-119 | PWR/SKILL.md:30-32; PWR/ref/questions-and-change-impact.md:31-40; PWR/ref/source-intake.md:30-38 | After an answer, list every affected record, change each, read each back, and never mark it complete while one is unchecked. | Validator + Template field | Decision entry "Affects" line; check "each listed item holds the DEC ID" | The incorporation table becomes a pointer check. |
| B-120 | PWR/SKILL.md:33-36 | A document change is saved with `publish-docs` when it can stand alone; otherwise it goes in the code's pull request. | Delete | PD/SKILL.md:130-133 already says it | Duplicate (D-32). |
| B-121 | PWR/as/DOMAIN-MAP.md:1-19 | A domain map lists links to system records, requirements, targets, questions, sources, decisions, and items. | Delete | `system/README.md` | Record removed. |
| B-122 | PWR/as/INTAKE-RECEIPT.md:1-27 | An intake receipt lists the original, its dates, each finding with its destination, and a read-back result. | Template field | Source entry: "Used by" IDs | The receipt is removed. One field survives. |
| B-123 | PWR/as/PERSON.md:1-12; PWR/ref/record-lifecycle.md:38, 45-46 | A person record holds role, decision authority, areas of knowledge, source, and date. | Delete | `PROJECT.md` role table | People records are removed (N-13). |
| B-124 | PWR/as/PROJECT-QUESTION.md:1-24 | A shared question holds an ID, the question, who answers, the source, a status (open, answered, incorporated), the answer's home, the affected records, an answer history, and checks. | Template field | Decision entry template | Most fields carry over. "Incorporated" becomes a check. |
| B-125 | PWR/as/TARGET-ARCHITECTURE.md:1-14 | A target record holds a status (proposed, owner-approved, superseded), the approving decision, the affected items, and a link to the verified structure. | Template field | `system/` document header: Status, Last changed via | N-12. See "Could not determine" on approved versus built. |
| B-126 | PWR/ref/placement-and-authority.md:7-21 | Eight kinds of information each have one authoritative home. | Routing | Root `AGENTS.md` filing table | The third copy of the placement table (D-19). |
| B-127 | same:23-26 | In an existing project, do not move records only to fill the new folder. | Delete | The setup skill's move-over steps | A note for moving a project over. |
| B-128 | PWR/ref/questions-and-change-impact.md:10-22 | A shared question records the exact question, who can answer, the source, and every affected record, and is linked from each affected item. | Template field + Validator | Decision entry; pointer check | Fields. |
| B-129 | same:15-20 | Ask an expert to verify a fact and the owner to decide; never infer authority from a job title. | Skill | `record-decision.md`, one line | Judgment. |
| B-130 | same:26-30; PWR/ref/placement-and-authority.md:18 | The item's row holds the full answer; the shared question only links to it. | Delete | Reversed: `DECISIONS.md` holds the answer and the item holds the DEC ID | N-09. |
| B-131 | same:44-55 | A changed answer gets a new row, supersedes the old one, reopens the checks, and sets a dependent target record back to proposed. | Skill | `record-decision.md`, "Replacing a decision" | Procedure. |
| B-132 | PWR/ref/record-lifecycle.md:12-24 | Record file names are lowercase words joined by hyphens, with one pattern per folder. | Validator | File name check for `sources/` and `system/integrations/` | Testable. The old folder table is deleted. |
| B-133 | same:26-32 | A new `PQ-` ID is the highest plus one, three digits, never reused, with no second list of IDs. | Skill + Validator | `filing-project-records/SKILL.md`, "Taking the next ID", for DEC, SRC, CON, SEC, and INT; uniqueness check | The same rule with new prefixes. |
| B-134 | PWR/ref/source-intake.md:19-20 | A temporary Notion download address is not a source anchor. | Delete | The `SRC-###` ID is the anchor | Not needed. |
| B-135 | same:40-41 | A corrected source keeps the original, and the affected records are reopened. | Template field | Source entry: "Corrects SRC-###" | Field. |
| B-136 | PWR/examples/accounts-org-merge.md:1-25 | The example files a client transcript in `delivery/` and links it through a receipt, a shared question, and a domain map. | Delete | A new example in `filing-project-records/examples/` | It shows removed records. |

### 2.9 `handoff`, `publish-docs`, `session-summary`, and the other shared skills

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-137 | HO/SKILL.md:15-21 | A handoff updates only the items this session worked on. | Skill | `handoff/SKILL.md` | Procedure. |
| B-138 | HO/SKILL.md:22-32 | Each of those items is made true, gets rows for unsaved answers, a rewritten Current state, and one row "Handoff: <where work stopped>". | Skill | Same | It restates `managing-work-items` rules (O-03). Keep the list short. |
| B-139 | HO/SKILL.md:33-38 | At a handoff, offer what is worth keeping to memory, and save only on his yes. | Skill | Same; each unsaved decision goes to its item or to `record-decision.md`; memory gets a pointer | N-07. |
| B-140 | HO/SKILL.md:39-42, 56-57, 119 | Check `project-wide-records/` for intake receipts and shared questions this session touched. | Skill | Same; check the Open entries in `DECISIONS.md` this session touched | N-04. |
| B-141 | HO/SKILL.md:43-55 | Rewrite "Next session starts with" as one pointer per item, remove untrue lines, and set "Last updated". | Skill + Validator | Same; Current State checks | Procedure with a testable result. |
| B-142 | HO/SKILL.md:101-105 | Saves come before the prompt; a failed save is named and its content goes in the prompt. | Skill | Same | Procedure. |
| B-143 | HO/SKILL.md:106-108; TWL/SKILL.md:28-29; SML/SKILL.md:30-31 | `memory/` and `work-items/` live only in the main checkout and are never committed. | Folder + Validator | `memory/AGENTS.md`, `work-items/AGENTS.md`; a commit check refuses those paths | Stated in 7 places (D-16). |
| B-144 | HO/as/handoff-prompt-template.md:1-31 | The prompt has a fixed first line and seven headings. | Template field | Same template | Already a template. The prompt is shown in chat and not saved (N-17). |
| B-145 | PD/SKILL.md:3, 18-26 | A save may hold only project documents under the rule's paths, of listed file types, not ignored by Git, and approved by the owner. | Validator | Path and type check at commit. The path list becomes `system/`, `DECISIONS.md`, `sources/`, `reference/`, `delivery/`, `tests/`, `PROJECT.md`, `PROJECT-ROADMAP.md`, and READMEs | N-05, N-06. The approval stays a step. |
| B-146 | PD/SKILL.md:60-62 | A new topic folder under `ai-external-knowledge/` gets its row in `INDEX.md` in the same save. | Validator | Check "every folder in `reference/outside-docs/` has an index row" | N-06. |
| B-147 | PD/SKILL.md:110-111 | Never edit a captured outside page. | Validator | The same "never changed" check as `sources/` | Testable. |
| B-148 | PD/SKILL.md:118-128 | Data files, code, `.json`, spreadsheets, hidden files, and instruction files are refused. | Validator | Commit check, with `sources/` allowed to hold an original of any type | Conflicts with `sources/` (N-11). |
| B-149 | PD/SKILL.md:130-133 | A document edit that would be wrong without its code change goes in that code's pull request. | Skill | `publish-docs` and `closing.md` | It decides when `system/` is updated (C-03). |
| B-150 | PD/ref/recovery.md:54-57 | A save that cannot finish writes the exact next action into the item's Current state. | Skill | Same | Procedure. |
| B-151 | `session-summary/SKILL.md`:17-19, 24-30 | The recap names where each result is kept, and offers once to turn open requests into work items. | Skill | Same; the words "saved to memory" are updated | It only reads. |
| B-152 | `braindump/SKILL.md`:37-38, 45 | Nothing is saved before his yes; something worth keeping goes to `managing-project-memory`. | Routing | Root `AGENTS.md` filing table | The hand-off line follows the table. |
| B-153 | `merge-and-clean-up/SKILL.md`:27, 166-170 | The item is found from the branch name; when the owner asked directly, add one merge row; never change the State. | Skill | Same | Procedure. `deploying.md` adds the same row (D-31). |
| B-154 | `reset-to-remote/SKILL.md`:104 | A reset leaves `work-items/`, `memory/`, and `.obsidian/` as they are, because Git ignores them. | Skill | Same; add: edits to `system/`, `sources/`, and `DECISIONS.md` that were not published are discarded | The new folders are in Git, so the risk changes. |

### 2.10 `tracking-work-items` (local files)

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-155 | TWL/SKILL.md:12-16 | Each item is a folder under `work-items/` with a file named by its ID; the template folder is a form, never an item. | Folder + Validator | `work-items/AGENTS.md`; structure check | How a folder works. Also in the starter rule `work-item-folders.md`. |
| B-156 | TWL/SKILL.md:21-24 | Read the whole file now and again before a change; change only the lines that change; set `updated`; read it back. | Skill + Validator | `tracking-work-items/SKILL.md`; check "`updated` is a date" | D-08. |
| B-157 | TWL/SKILL.md:22; TWL/ref/folders-and-files.md:98-119; TWL/ref/searching.md:63-70 | Run the hand-change check: every item's file, ID, and parent; IDs that two files share; template copies made by hand. | Validator | Local item checks; the skill keeps only the repair steps | The three commands already are a check. |
| B-158 | TWL/SKILL.md:23 | Name other items as `[[WI-031]]`; `parent:` stays a plain ID. | Validator | Format check | Testable. |
| B-159 | TWL/SKILL.md:30 | Look-ups skip `references/` folders, `DESIGN.md`, and the template. | Delete | The `references/` part goes with the folder | N-01. |
| B-160 | TWL/ref/folders-and-files.md:19-58 | The item folder is `<ID>-<slug>` with `<ID>.md`, `DESIGN.md`, and `references/`; a sub-item's folder sits inside its parent's; groups and `archive/` are plain folders. | Folder + Validator | `work-items/AGENTS.md`, without `references/` | N-01, N-20. |
| B-161 | same:57; TWL/ref/field-mapping.md:58 | Folder nesting, the `parent:` line, and the parent's sub-item list say the same thing. | Validator | Three-way agreement check | One fact in three places (D-22). |
| B-162 | same:64-96 | A new ID is the highest under `work-items/` plus one; make the folder first; check for a duplicate; renumber only your own. | Skill + Validator | `tracking-work-items`; duplicate ID check | The steps that claim an ID. Also in the starter rule (O-16). |
| B-163 | same:88-92 | A new item gets a `references/` folder. | Delete | Removed | N-01. |
| B-164 | same:108-129 | Each hand-change finding has a set repair, a history row, or a question for the owner. | Skill | `tracking-work-items/references/folders-and-files.md` | Repair steps. |
| B-165 | same:133-159 | Moves, groups, archiving, and renames happen only when the owner asks, with a history row on each item touched; the item file keeps the name `<ID>.md`. | Skill | Same | Procedure. |
| B-166 | same:173-175; SML/ref/record-format.md:91-101 | Memories link to items as `work_items: ["[[WI-031]]"]`, or the ID plus a link for Notion and GitHub. | Template field | Memory pointer line: an ID plus a link | The pointer form survives. The memory record does not. |
| B-167 | TWL/ref/field-mapping.md:19-34 | Each header field has a set format; keep every field; add none. | Template field + Validator | Template; format checks | Testable. |
| B-168 | same:43-59, 61-82 | Phases are Roadmap rows with matching Tasks headings; adding, merging, and dropping follow set forms; only the template's examples are deleted. | Skill + Validator | Same file; "rows equal headings" check (the file's own command, lines 80-82) | Procedure with a test. |
| B-169 | same:84-87; TWG/ref/issue-layout.md:120-123; TWN/ref/database-layout.md:228-233 | When an item changes level, its phases become a plain list or the reverse, with one history row. | Skill | Each `tracking-work-items` version | Storage steps, stated three times by design (D-23). |
| B-170 | same:89-93 | Ticking writes "Met <date>: <evidence>" at the end of the Done-when line. | Template field | Task form | C-01. |
| B-171 | same:95-150; TWG/ref/issue-layout.md:48-105; TWN/ref/page-layout.md:76-129 | How a history row, a requirement block, and a question row are written in this tracker. | Skill | Each `tracking-work-items` version, the write steps only | The format is the template's. These copies restate it (D-03, D-04, D-05). |
| B-172 | same:152-157 | Each source file is copied into the item's `references/` folder and never edited. | Delete | `file-source.md` | N-01. |
| B-173 | same:159-171 | Approvals, Done, Cancelled, Blocked, and reopened each set named fields. | Validator | Field agreement checks | Testable. |
| B-174 | same:173-184 | One `DESIGN.md` beside the item, copied from the template, with set starting values. | Folder + Template field | `work-items/AGENTS.md`; the design template with the values filled | Starting values belong in the template. |
| B-175 | same:186-202 | A new item starts with named default values, and every other prompt is deleted. | Template field + Validator | The template ships with the defaults; prompt check | 17 lines of prose become filled fields and one check. |
| B-176 | TWL/ref/project-roadmap-and-tasks.md:7-14 | Project phases are rows and headings in `PROJECT-ROADMAP.md`, changed only with `publish-docs`; each top-level item is in exactly one phase; approved changes are logged under "Planning changes". | Template field + Validator | Roadmap template; check "the item's phase equals the roadmap's list" | One fact in two places. |
| B-177 | same:23-25 | Project tasks are `PT-##` blocks in `work-items/PROJECT-TASKS.md`. | Template field | Project tasks template | A form. |

### 2.11 `tracking-work-items` (GitHub Issues)

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-178 | TWG/SKILL.md:12-19; TWG/ref/labels.md:14-28 | One issue per item; header fields are labels; Done is "closed as completed"; phases are milestones; the design is one comment. | Skill | `tracking-work-items` (GitHub) | Where each field is stored. |
| B-179 | TWG/SKILL.md:18; TWG/ref/issue-layout.md:146-170 | Source text is posted as a `## Source:` comment on the issue, and the Sources line names the comment's address. | Delete | `file-source.md`; the Sources line names the `SRC-###` ID | N-01. |
| B-180 | TWG/ref/issue-layout.md:172-176 | Any other source file is attached by the owner in the browser and is never copied into the repository. | Delete | `file-source.md` | The opposite of `sources/` (N-03). |
| B-181 | TWG/SKILL.md:31-32 | Create nothing but issues and comments without his yes; never delete an issue, a comment, or a label. | Skill | Same | Storage rule. |
| B-182 | TWG/ref/issue-layout.md:43-46, 178-185 | A new issue body is the template from Overview on, with no prompt left; an issue made by hand gets the layout after his yes. | Skill | Same | Storage steps. |
| B-183 | TWG/ref/issue-layout.md:79-80 | The `waiting-on` label follows the open question rows. | Skill | Same | A script cannot test it without the network. |
| B-184 | TWG/ref/issue-layout.md:125-138 | One design comment, first line `## Solution design`, changed in place, never a second. | Skill | Same | Storage rule. |
| B-185 | TWG/ref/issue-layout.md:144-145; TWN/ref/page-layout.md:137 | An agent's note starts "Agent:"; an answer the owner wrote in a comment becomes a Questions and Answers row. | Skill | Same | Storage rule. |
| B-186 | TWG/ref/labels.md:34-67 | A project has 30 labels with set names. | Template field | The label list is the template | Already a list. |
| B-187 | TWG/ref/labels.md:93-100; TWG/ref/searching.md:87-97 | A label the owner changed wins; two labels of one group, or a missing state label, are settled with him; issues without the layout are reported. | Skill | Same | An online check. The proposed script cannot do it. |
| B-188 | TWG/ref/project-roadmap-and-tasks.md:13-16, 43-51, 55-87 | Project phases are milestones with three description lines; project tasks are one pinned issue marked by its first line. | Skill + Template field | Same; milestone and task forms | Where each part is stored. |

### 2.12 `tracking-work-items` (Notion)

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-189 | TWN/SKILL.md:12-19; TWN/ref/database-layout.md:38-53 | Items, phases, and tasks are rows of three databases; the design is a child page; each field maps to a property or a page section. | Skill | `tracking-work-items` (Notion) | Where each field is stored. |
| B-190 | TWN/ref/database-layout.md:53, 274-296; TWN/ref/searching.md:97-111; TWN/as/schema/01-work-items-database.json:260-263 | A source file is uploaded to the item's Files property and named in Notes, Sources. | Delete | `file-source.md`; the property stays and holds no originals | N-01. A listed property may not be removed (TWN/ref/database-layout.md:3). |
| B-191 | TWN/SKILL.md:34; TWN/ref/page-layout.md:74 | Next action is written in the page text and copied to the Next action property. | Skill | Same | One fact in two places. The board card needs the copy. |
| B-192 | TWN/SKILL.md:44 | Never delete a page, row, phase, or task; cancel or archive it. | Skill | Same | Storage rule. |
| B-193 | TWN/ref/database-layout.md:57-114; TWN/as/schema/*.json | The three databases have named properties, options, views, and relations. | Template field | The schema files | Already templates. |
| B-194 | TWN/ref/database-layout.md:116-142, 307-321 | A new item is created with named default property values; a card made by hand gets the defaults and a history row. | Template field + Skill | Defaults in the request body; repair steps in the skill | Defaults are data. |
| B-195 | TWN/ref/database-layout.md:257-265 | A link between items is set as a relation and also written in the Related items line. | Skill | Same | One fact in two places (D-22). |
| B-196 | TWN/ref/page-layout.md:21-36, 59-69 | The page has ten sections in order; a new page keeps its headings and loses every prompt. | Template field | The Notion page template | The layout is the template's. |
| B-197 | TWN/ref/page-layout.md:149-163 | One design page per item, titled "<ID>: <title> — solution design"; approval sets three places. | Skill | Same | Storage steps. |
| B-198 | TWN/SKILL.md:17; TWN/as/schema/23-item-view-linked-memory.json | The item page shows a "Linked memory" view of the memory records that link to it. | Delete | The view shows pointers only, or goes | N-07, N-18. The owner must choose. |

### 2.13 `managing-project-memory`

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-199 | MPM/SKILL.md:12 | Memory is stored by concept, like a wiki; a record grows as facts are added. | Delete | Facts go to `system/`, `DECISIONS.md`, or the item | Restated facts (N-07). |
| B-200 | MPM/SKILL.md:14, 18-20 | A memory is current, proposed, replaced, retired, or withdrawn; out-of-date memory is retired, not deleted. | Delete | Decision Status (Open, Decided, Superseded) and document Status | N-12. |
| B-201 | MPM/SKILL.md:24-38 | Saves follow an approval mode (`onboarding` or `trusted`), with a list of things that always need a question. | Delete | A pointer needs no approval; a decision is the owner's by definition | Only "ask before adding a glossary term you inferred" survives, in `update-system-doc.md`. |
| B-202 | MPM/ref/current-state.md:7-15 | Current State starts with "Last updated", has three sections limited to 5, 5, and 3 lines, stays under 40 lines, and a Now line is an ID plus a few words. | Template field + Validator | Current State template; limit checks | Testable. The session-start hook already tests 40 lines and 7 days. |
| B-203 | same:19-24 | Replace a changed line; remove a line the moment it is untrue; three skills each remove their own lines. | Skill | `managing-project-memory`, the one owner of these rules | O-02. |
| B-204 | same:22-23 | A to-do never goes in Current State; a to-do with a set time needs a reminder. | Routing | Root `AGENTS.md` (the row exists, starter `AGENTS.md`:175) | Where things go. |
| B-205 | same:26-35 | Pruning removes finished items, answered questions, and copied status. | Validator | The same checks as B-019 and B-202 | Finding the lines is testable. Removing them is one step. |
| B-206 | MPM/ref/finding.md:7-9 | To find what was decided, look in memory first, then the work item, then Current State. | Routing | Root `AGENTS.md`: `DECISIONS.md`, then `system/`, then the item | The order changes (N-09). |
| B-207 | same:13-20 | A proposed, replaced, or retired memory is not a fact; say when a fact was last verified more than six months ago. | Delete | Status fields on decisions and documents | Not needed for pointers. |
| B-208 | MPM/ref/memory-criteria.md:7-15 | Five kinds of memory (user, project, reference, event, decision) are worth keeping when they pass a five-part test. | Routing | Root `AGENTS.md`: owner facts to `PROJECT.md`; project facts to `system/`; references to `reference/`; events to `delivery/` or the item; decisions to `DECISIONS.md` | N-07. |
| B-209 | same:19 | A decision is also saved beyond its item only when a later item, or an agent working on something else, must follow it. | Routing | Root `AGENTS.md` filing test | The same test the new layout uses. Stated in 6 places (D-01). |
| B-210 | same:23-26 | Never save secrets, personal data, transcripts, live status, or a fact its authoritative file already holds. | Validator + Routing | Secret and email scan of tracked documents and memory; one line in root `AGENTS.md` | Partly testable. |
| B-211 | MPM/ref/saving.md:25-40 | Search before saving; add a section to the right concept or make a new record; each section says what, why, how to apply, and where from. | Delete | No concept records | N-07. |
| B-212 | same:44-46; SML/ref/record-format.md:103-118 | A lesson not yet proven is kept under its concept with a Seen line, and is offered as a rule after two sessions. | Skill | Open: no home in the new layout | See "Could not determine". |
| B-213 | same:48-58 | A decision later items must follow becomes a decision record with three parts and a link to the item and Q-ID; the reasoning stays in the item. | Skill + Template field | `record-decision.md`; decision entry | N-09, N-10. |
| B-214 | same:60-73 | A correction replaces the text; a changed decision gets a new record that replaces the old one; "forget that" removes or retires. | Skill | `record-decision.md`, "Replacing a decision"; a pointer is simply removed | Most of it goes. |
| B-215 | same:75-82 | A save question he has not answered is kept as a proposal and listed under "Waiting on the owner". | Delete | A decision not yet made is a `DEC` entry with Status Open | The Open status replaces proposals. |
| B-216 | same:84-90 | An owner instruction is one dated bullet in `.claude/rules/owner-preferences.md`, or in the two home-folder files when it is for every project. | Skill | `managing-project-memory`, kept | Not memory, but this skill owns the event today and no other skill does. |
| B-217 | same:92-98 | A term gets one glossary entry from an authoritative source; a rename adds an alias line; an unused term is retired. | Skill + Template field | `update-system-doc.md`; `system/glossary.md` | N-08. |
| B-218 | same:100-113 | Each save is reported with a set reply line. | Delete | Not a record rule | Chat wording. |
| B-219 | MPM/ref/tidying.md:22-32 | Tidying writes a numbered plan and changes nothing before his yes, except untrue Current State lines and secrets. | Skill | `managing-project-memory`, a few lines | Little is left to tidy. |
| B-220 | same:34-45, 57-75 | Duplicates merge; links between memories are repaired; stale and misplaced records are moved; old feedback records are converted. | Delete | No records to merge | N-07. |
| B-221 | same:51-55 | Each work item a memory names must exist, in the right link form. | Validator | Pointer check | Testable for local items. |
| B-222 | same:83-98 | A proven lesson becomes a rule bullet or a project skill in `.claude/skills/<name>/`, listed in `AGENTS.md`; the owner's rules are reviewed for repeats. | Skill | `managing-project-memory`, kept short | A procedure about rules, not records. |

### 2.14 `storing-project-memory` (local files and Notion)

| ID | Source | The rule in one plain sentence | Bucket | Where it goes in the new layout | Why |
| --- | --- | --- | --- | --- | --- |
| B-223 | SML/SKILL.md:12-16; SML/ref/folders-and-files.md:13-43 | `memory/` holds one file per concept with one of five prefixes, an index the hook rebuilds, Current State, a glossary, and two blank forms. | Folder | `memory/AGENTS.md`: Current State and one pointer file | N-07, N-08. |
| B-224 | SML/ref/folders-and-files.md:47-61 | A concept file holds about 20 sections or 300 lines at most; files are made from a blank form; a deleted file cannot be brought back. | Delete | No concept files | N-07. |
| B-225 | SML/ref/record-format.md:20-63 | A memory file has ten header fields, six statuses, and three marks for what is not current. | Delete | Pointer line | N-07. One fact is marked in three places. |
| B-226 | same:67-79; SMN/as/concept-record.md:1-4 | Each section has six labels: Remember, Why, How to apply, Evidence and limits, Related memories, Authoritative records. | Delete | Only "Authoritative records" survives, as the pointer | "Remember" restates the fact (N-07). |
| B-227 | same:120-126; SMN/as/decision-record.md:1-9 | A decision file holds the decision in one sentence, how to apply it, and where it was decided. | Template field | Decision entry in `DECISIONS.md` | N-09. |
| B-228 | same:128-135; SMN/as/terminology-glossary.md:1-7 | The glossary is one table with six columns, and a list of naming changes. | Template field | `system/glossary.md` | The columns carry over (N-08). |
| B-229 | same:137-144 | "A file is right when": six checks of name, header, prompts, links, last section, and marks. | Validator | Replaced by pointer checks | Already written as checks. |
| B-230 | SMN/SKILL.md:12-19; SMN/ref/database-layout.md:36-57 | Memory is one Memories page per concept in Lore's five databases, found by its Record Key, with a Current state page and a glossary page beside it. | Skill | `storing-project-memory` (Notion), cut to the Current state page and pointer rows | N-07, N-08. The owner must decide on Lore's layout. |
| B-231 | SMN/SKILL.md:30-31, 35-37 | Never rename or remove a Lore database, column, or option; fill Keywords with the key. | Skill | Same | Storage rule. It stays while Lore's layout stays. |
| B-232 | SMN/ref/database-layout.md:59-69 | Five memory statuses map to four Notion options; withdrawn and retired both become "deprecated". | Delete | No statuses on pointers | Two statuses cannot be told apart today (C-07). |
| B-233 | same:81-87 | A page names its work items as text and, with Notion work items, also as a relation; the two must agree. | Skill | Same | One fact in two places. |
| B-234 | SMN/ref/writing-pages.md:20-154 | How to create, add to, correct, replace, propose, retire, delete, link, and merge memory pages, and add a glossary row. | Delete | Only "add or remove a pointer row" stays | N-07. |
| B-235 | SMN/ref/current-state-page.md:9; SMN/as/current-state.md:1-7 | The Current state page's first line is "Last updated: YYYY-MM-DD", which the session-start hook reads. | Template field | Current State template | Already a template. |
| B-236 | SMN/ref/views-and-layout.md:13-18; SMN/as/schema/*.json | Memories has four views (Index, Decisions, By work item, Retired) and set columns. | Template field | Schema files; the Decisions view goes | Decisions leave memory. |

## 3. Duplicates

The same rule stated in more than one skill or file. Starter-project files are named only where a skill copies them; the other audit covers those files.

| ID | The rule | Every place it is stated |
| --- | --- | --- |
| D-01 | A decision that a later item must follow is also saved to memory, after asking "This looks project-wide. Save it to memory too?" | MWI/as/work-item-template.md:126; MWI/ref/refining-requirements.md:51, 58; MWI/ref/designing.md:22; MWI/ref/reflecting.md:13-17; MWI/ref/deploying.md:69, 74; MPM/SKILL.md:31; MPM/ref/memory-criteria.md:15, 19; MPM/ref/saving.md:48-58; HO/SKILL.md:33-38; starter `AGENTS.md`:109-110 |
| D-02 | Text in angle brackets is a prompt; leave none in a record | MWI/SKILL.md:75; MWI/as/work-item-template.md:19; MWI/as/design-template.md:9; TWL/SKILL.md:35; TWL/ref/field-mapping.md:194-201; TWL/ref/folders-and-files.md:163; TWG/ref/issue-layout.md:43; TWN/ref/page-layout.md:35, 59-69; TWN/ref/database-layout.md:312; SML/ref/folders-and-files.md:55; SML/ref/record-format.md:141; PWR/ref/record-lifecycle.md:3-4; MPM/ref/current-state.md:34 |
| D-03 | The layout of a requirement block and its numbering | MWI/as/work-item-template.md:105-122; MWI/ref/refining-requirements.md:16-29; TWL/ref/field-mapping.md:103-127; TWG/ref/issue-layout.md:48-73; TWN/ref/page-layout.md:88-112 |
| D-04 | How a question row is added, answered, and superseded | MWI/as/work-item-template.md:126; MWI/ref/refining-requirements.md:42-43, 56; TWL/ref/field-mapping.md:129-150; TWG/ref/issue-layout.md:75-97; TWN/ref/page-layout.md:114-129; PWR/ref/questions-and-change-impact.md:44-47 |
| D-05 | Recent History: newest first, name a decision by its Q-ID | MWI/as/work-item-template.md:97; TWL/ref/field-mapping.md:95-101; TWG/ref/issue-layout.md:99-105; TWN/ref/page-layout.md:76-86 |
| D-06 | Current state is five lines rewritten in place after each step | MWI/as/work-item-template.md:29; MWI/SKILL.md:71; TWL/ref/field-mapping.md:39; TWN/ref/page-layout.md:40-48, 71-74; HO/SKILL.md:26-27; starter rule `keep-work-item-current.md`:9-13 |
| D-07 | The three forms of Next action | MWI/as/work-item-template.md:33; MWI/SKILL.md:31; MWI/ref/deploying.md:56-57, 68; TWL/ref/field-mapping.md:191; PD/ref/recovery.md:54-56; starter rule `keep-work-item-current.md`:14-17 |
| D-08 | Read fresh before a change, read back after it, and say "Not saved" or "Saved but not verified" | MWI/SKILL.md:69-70; TWL/SKILL.md:21, 24; TWG/SKILL.md:23; TWN/SKILL.md:24, 26; MPM/SKILL.md:42; SML/SKILL.md:21-23; SMN/SKILL.md:24-26; HO/SKILL.md:103-105; PWR/ref/source-intake.md:35-38 |
| D-09 | A source is saved with its work item, exactly as given, and never edited | MWI/as/work-item-template.md:19, 143; MWI/ref/refining-requirements.md:89-91; TWL/ref/field-mapping.md:152-157; TWL/ref/folders-and-files.md:30, 88-92; TWG/SKILL.md:18; TWG/ref/issue-layout.md:146-176; TWN/ref/database-layout.md:53, 274-296; TWN/ref/searching.md:97-111; PWR/SKILL.md:20-23; PWR/ref/source-intake.md:7-21; PWR/ref/placement-and-authority.md:9 |
| D-10 | A Salesforce client file stays in `delivery/` | MWI/as/work-item-template.md:19, 143; MWI/ref/refining-requirements.md:90; TWL/ref/field-mapping.md:155; TWN/ref/searching.md:111; PWR/ref/source-intake.md:9-10, 18-19; PWR/as/INTAKE-RECEIPT.md:3; PWR/examples/accounts-org-merge.md:4-6; starter `AGENTS.md`:70, 105; starter rule `work-item-folders.md`:9 |
| D-11 | An ID is never reused | MWI/SKILL.md:48; MWI/as/work-item-template.md:105; MWI/ref/refining-requirements.md:64; MWI/ref/building.md:144; TWL/ref/folders-and-files.md:78; TWL/ref/field-mapping.md:59; TWL/ref/project-roadmap-and-tasks.md:9; TWG/ref/project-roadmap-and-tasks.md:13; TWN/ref/database-layout.md:90, 104, 158; PWR/ref/record-lifecycle.md:28 |
| D-12 | Three levels of items at most | MWI/SKILL.md:37-50; TWL/ref/folders-and-files.md:64, 135; TWG/ref/gh-commands.md:160; TWG/ref/issue-layout.md:116; TWG/ref/searching.md:68; TWN/SKILL.md:30; TWN/ref/searching.md:68 |
| D-13 | Set State and Status together | MWI/SKILL.md:12; MWI/as/work-item-template.md:19; TWL/ref/field-mapping.md:27; TWN/ref/database-layout.md:146; TWG/ref/labels.md:19 |
| D-14 | Done and Cancelled only on the owner's word; his own hand change counts | MWI/SKILL.md:33; MWI/ref/deploying.md:64, 74; TWG/ref/labels.md:30; `merge-and-clean-up/SKILL.md`:170-171 |
| D-15 | Pull request text never closes the item | MWI/ref/deploying.md:23; TWG/SKILL.md:29; `merge-and-clean-up/SKILL.md`:103 |
| D-16 | `work-items/` and `memory/` are only in the main checkout and are never added to Git | TWL/SKILL.md:20, 28-29; TWL/ref/project-roadmap-and-tasks.md:23; SML/SKILL.md:20, 30-31; HO/SKILL.md:44-45, 106-108; `reset-to-remote/SKILL.md`:104; starter rule `publish-project-documents.md`:22 |
| D-17 | An open item that left Backlog has one line under Now in the project's Current State | MWI/SKILL.md:72; MWI/ref/refining-requirements.md:72; MWI/ref/deploying.md:58; HO/SKILL.md:51-53; MPM/ref/current-state.md:11, 21; SMN/as/current-state.md:3 |
| D-18 | Find an item by its ID, never by a path or link | MWI/as/work-item-template.md:19, 41; TWL/SKILL.md:13; TWG/SKILL.md:12; TWN/ref/searching.md:21; `explain-simply/SKILL.md`:14-15; HO/ref/handoff-verifier.md:50; starter `AGENTS.md`:138; starter rule `work-item-folders.md`:11 |
| D-19 | The table of which information goes where | PWR/ref/placement-and-authority.md:7-16; MPM/ref/memory-criteria.md:9-15; starter `AGENTS.md`:97-119 |
| D-20 | Only the owner's words answer a question; another person's statement stays a candidate | MWI/ref/refining-requirements.md:110; PWR/ref/questions-and-change-impact.md:18-20; PWR/ref/source-intake.md:28-29 |
| D-21 | The design's approval is written in several places | MWI/as/design-template.md:3-4, 12, 15, 95; TWL/ref/field-mapping.md:163; TWG/ref/labels.md:25; TWN/ref/page-layout.md:163; TWN/ref/database-layout.md:47; MWI/ref/designing.md:21 |
| D-22 | The link between a parent and its sub-item is written in two or three places that must agree | TWL/ref/folders-and-files.md:57; TWL/ref/field-mapping.md:58; TWG/ref/issue-layout.md:110-118; TWN/ref/database-layout.md:265 |
| D-23 | The steps for an item that changes level | TWL/ref/field-mapping.md:84-87; TWG/ref/issue-layout.md:120-123; TWN/ref/database-layout.md:228-233 |
| D-24 | The glossary's columns and alias line | MPM/ref/saving.md:92-98; SML/ref/record-format.md:128-135; SMN/as/terminology-glossary.md:1-7; SMN/ref/writing-pages.md:152-154 |
| D-25 | The six labels of a memory section | MPM/ref/saving.md:37; SML/ref/record-format.md:67-79; SMN/as/concept-record.md:1-4 |
| D-26 | The three parts of a decision record | MPM/ref/saving.md:55; MPM/ref/memory-criteria.md:15; SML/ref/record-format.md:120-126; SMN/as/decision-record.md:1-9; SMN/ref/database-layout.md:76; SMN/ref/writing-pages.md:81-88 |
| D-27 | How a proposal is marked and approved | MPM/ref/saving.md:75-82; SML/ref/record-format.md:48-62; SMN/ref/writing-pages.md:105-112 |
| D-28 | The form of a lesson and its Seen line | MPM/ref/saving.md:44-46; MPM/ref/memory-criteria.md:7; SML/ref/record-format.md:103-118; SMN/ref/database-layout.md:77; SMN/ref/writing-pages.md:70-79 |
| D-29 | A concept holds about 20 sections or 300 lines at most | SML/ref/folders-and-files.md:47; SMN/ref/database-layout.md:79 |
| D-30 | Helpers never change a work item | MWI/ref/building.md:54, 165; MWI/ref/builder-brief.md:53; MWI/ref/acceptance-checker-brief.md:10 |
| D-31 | The Recent History row for a merge | MWI/ref/deploying.md:39; `merge-and-clean-up/SKILL.md`:166-170 |
| D-32 | A document change is published alone only when it can stand alone | PWR/SKILL.md:33-36; PD/SKILL.md:130-133 |

## 4. Conflicts

### 4.1 Rules that disagree with each other today

| ID | The conflict | Where |
| --- | --- | --- |
| C-01 | Where a task's proof is written. One file says Recent History. The other says the end of the task's Done-when line. | MWI/ref/building.md:22 against TWL/ref/field-mapping.md:92 |
| C-02 | Where a pull request is recorded. The process skill says under Related items "unless that skill names another place". Notion says a "Linked Github PRs" section and "not under Related items". The work item template has no field for it. | MWI/ref/deploying.md:24 against TWN/ref/page-layout.md:133 |
| C-03 | When project documents are updated. Reflecting updates `requirements/` and `system-guide/` before the merge and the deploy. The project-wide records skill says verified structure goes to `system-guide/` "after the build is tested and delivered". `publish-docs` says a document that would be wrong without its code goes in the code's pull request. | MWI/ref/reflecting.md:18-26 against PWR/as/TARGET-ARCHITECTURE.md:10, 14, PWR/examples/accounts-org-merge.md:22-24, and PD/SKILL.md:130-133 |
| C-04 | Which record holds a decision that several items need. One skill says the item's row holds the full answer and a shared question links to it. Another makes a memory record that later items follow and says the reasoning stays in the item. The result is three records for one decision. | PWR/ref/questions-and-change-impact.md:26-30 and PWR/ref/placement-and-authority.md:18 against MPM/ref/saving.md:48-58 |
| C-05 | Two word lists for one status. The item says `design: proposed, approved, superseded, none`. The design says "Draft, In review, Approved, Superseded" and also `status: proposed`. | MWI/as/work-item-template.md:12 against MWI/as/design-template.md:3, 12; mapped in MWI/ref/designing.md:12 |
| C-06 | The trackers hold different fields. Notion has Blocked by, Related, Tags, Archived, and Design approved, which the shared template lacks. Local files have `updated`, which Notion lacks. | TWN/ref/database-layout.md:47-48, 57-79 against MWI/as/work-item-template.md:1-15 |
| C-07 | "Withdrawn" and "retired" are two statuses in the process skill and in local files, and one status ("deprecated") in Notion. | MPM/SKILL.md:14 and SML/ref/record-format.md:37-46 against SMN/ref/database-layout.md:66-67 |
| C-08 | Reflecting says "No new approval is needed", and its step 3 asks the owner a question. | MWI/ref/reflecting.md:3 against MWI/ref/reflecting.md:16 |
| C-09 | Whether a lesson needs a question. The memory skill says a lesson is saved with no question. Reflecting adds lessons to the list it asks the owner about. | MPM/SKILL.md:36 against MWI/ref/reflecting.md:15-16 |
| C-10 | A sub-item holds a word-for-word copy of its parent's requirement lines, kept the same by hand. Every other rule in these skills keeps one home for a fact. | MWI/ref/refining-requirements.md:62, 71, 105 |
| C-11 | An original has four homes, chosen by tracker and project type: a `references/` folder, an issue comment, a Notion Files property, or `delivery/`. The project-wide skill asks for "one stable source home". | TWL/ref/field-mapping.md:154; TWG/ref/issue-layout.md:146; TWN/ref/database-layout.md:274; MWI/ref/refining-requirements.md:90; PWR/ref/source-intake.md:7 |
| C-12 | The cancel path and the "Done by hand" path offer decisions to memory but never update `requirements/` or `system-guide/`. Only the normal path does. | MWI/ref/deploying.md:69, 74 against MWI/ref/reflecting.md:18-26 |
| C-13 | The word "requirements" means two things: an item's Requirements section and the `requirements/` folder. `publish-docs` saves the folder and says it is "not for a work item's requirements". | PD/SKILL.md:3 against MWI/as/work-item-template.md:103 |

### 4.2 Rules that disagree with the new layout

| ID | The conflict | Where |
| --- | --- | --- |
| N-01 | Originals are filed inside the work item. The new layout files every original in `sources/` and the item holds the `SRC-###` ID. | Every place in D-09 |
| N-02 | Salesforce client files (briefs, transcripts, meeting notes) are kept in `delivery/`. In the new layout `delivery/` holds releases, migrations, deployments, and handoffs, and originals go to `sources/`. | Every place in D-10 |
| N-03 | "Never copy it into the repository: it would be committed." The new layout puts originals in the repository. | TWG/ref/issue-layout.md:175 |
| N-04 | `project-wide-records/` and its five record kinds are removed. | All of PWR (11 files); MWI/SKILL.md:3, 90; MWI/ref/refining-requirements.md:37-39, 52-54, 59-61, 92-94; MWI/ref/reflecting.md:21-24; HO/SKILL.md:39-42, 56-57, 119; PD/SKILL.md:3, 157 |
| N-05 | `requirements/` and `system-guide/` are removed; `system/` replaces them. | MWI/ref/refining-requirements.md:36; MWI/ref/designing.md:10; MWI/ref/reflecting.md:19-20; MWI/ref/requirements-analyst-brief.md:20; HO/SKILL.md:121; HO/as/handoff-prompt-template.md:5; HO/ref/handoff-verifier.md:60; PD/SKILL.md:3; MPM/ref/memory-criteria.md:25; PWR/ref/placement-and-authority.md:11-12; PWR/as/DOMAIN-MAP.md:9-10; PWR/as/TARGET-ARCHITECTURE.md:10, 14 |
| N-06 | `ai-external-knowledge/` becomes `reference/outside-docs/`. | PD/SKILL.md:60-62, 110-111; PD/ref/recovery.md:20 |
| N-07 | Memory restates facts. The new layout allows only where work stopped, and pointers. | MPM/SKILL.md:12; MPM/ref/saving.md:35-37, 44, 55; MPM/ref/memory-criteria.md:7-15; SML/ref/record-format.md:67-79, 120-126; SMN/as/concept-record.md; SMN/as/decision-record.md; SMN/ref/database-layout.md:40-57; MWI/as/work-item-template.md:126; MWI/ref/refining-requirements.md:51; MWI/ref/designing.md:22; MWI/ref/reflecting.md:13-17; HO/SKILL.md:33-38 |
| N-08 | The glossary is a memory file or a Notion page. The new layout has `system/glossary.md`, always a file in the repository. | SML/ref/folders-and-files.md:18; SML/ref/record-format.md:128-135; SMN/SKILL.md:16; SMN/as/terminology-glossary.md; MPM/ref/saving.md:92-98 |
| N-09 | A decision several items need lives in an item row, a memory record, and sometimes a shared question. The new layout has one home, `DECISIONS.md`, and the item holds a pointer. | C-04 places; MPM/ref/finding.md:7-8 |
| N-10 | "Never copy the reasoning; it stays in the work item." In the new layout the work item is temporary, so the reason a decision was made must be in `DECISIONS.md`. | MPM/ref/saving.md:55; SMN/as/decision-record.md:6; MPM/ref/memory-criteria.md:15 |
| N-11 | `publish-docs` refuses `.json`, spreadsheets, and every type outside a short list. An original may be any type (a Word document, a spreadsheet, a data export). | PD/SKILL.md:18-21, 118-128 |
| N-12 | Status word lists differ from the new ones. Today: shared question open, answered, incorporated; target proposed, owner-approved, superseded; memory current, proposed, replaced, retired, withdrawn. New: decision Open, Decided, Superseded; system document Not started, Draft, Approved. | PWR/as/PROJECT-QUESTION.md:7; PWR/as/TARGET-ARCHITECTURE.md:4; MPM/SKILL.md:14 |
| N-13 | People records are removed. Who may decide is still needed for "Decision needed from". | PWR/as/PERSON.md; PWR/ref/record-lifecycle.md:38 |
| N-14 | The close has no gate. The document update is the fourth point of a checklist that "needs no new approval", and nothing records an answer to "did this change the system?". | MWI/ref/reflecting.md:3, 18-26; MWI/ref/deploying.md:52-55 |
| N-15 | Hindsight's add-on "saves each session" by itself. The toolkit cannot make it save pointers only. (Read in the starter `AGENTS.md`:18 and the starter rule `memory-review-and-save.md`:27; the effect is my inference.) | Starter project files; no skill covers Hindsight |
| N-16 | Only a Salesforce project writes a deployment record file. Other projects record a deploy only in the item's Recent History. The new layout gives every project type a `delivery/` folder for deployments. | MWI/ref/salesforce-deploying.md:7, 26 against MWI/ref/deploying.md:46-48 |
| N-17 | A handoff prompt is shown in the chat and saved nowhere. The new layout lists "handoffs" under `delivery/`. | HO/SKILL.md:77-83, 93-94 |
| N-18 | A work item points to "memories that name this item", and the Notion item page has a "Linked memory" view. | MWI/as/work-item-template.md:41; TWL/ref/folders-and-files.md:174; TWN/SKILL.md:17 |
| N-19 | The prompt-reminder hook tells the agent that `managing-project-memory` decides what is kept and that a decision goes in the item's Questions and Answers first. | `assets/hooks/prompt-reminder.mjs`:36-37, 54 (the other audit covers hooks) |
| N-20 | The work item form ships an empty `references/` folder, and a new item gets one. | TWL/ref/folders-and-files.md:27, 88-92 |

## 5. Rules that become template fields

| Template | Field | The prose it replaces |
| --- | --- | --- |
| Work item | Header fields with their default values already filled (`priority: medium`, `delivery: not-offered`, `waiting_on: "none"`, approvals `no`, `design: none`) | TWL/ref/field-mapping.md:186-194; TWN/ref/database-layout.md:116-136; TWG/ref/issue-layout.md:45 |
| Work item | Blockers: "<What it waits on, who can clear it, and the State it left; or None.>" | MWI/SKILL.md:32 |
| Work item | Sources: "`SRC-###`: <what it is>. Taken from it: <IDs>." | MWI/as/work-item-template.md:143; MWI/ref/refining-requirements.md:89-91; TWL/ref/field-mapping.md:152-157; TWG/ref/issue-layout.md:146-176; TWN/ref/database-layout.md:274-296 |
| Work item | New line "Moved up": "<IDs of each decision, constraint, or system rule this item added or changed, with the commit; or 'Nothing moved up: reason'>" | MWI/ref/reflecting.md:13-26; MWI/ref/deploying.md:69, 74 |
| Work item | Questions and Answers, Answer cell: for a decision other items need, the cell holds only "`DEC-###`" | MWI/as/work-item-template.md:126 (the memory offer); MWI/ref/refining-requirements.md:51-54 |
| Work item | New line "Pull requests" | MWI/ref/deploying.md:24; TWN/ref/page-layout.md:131-133 |
| Work item | New "Team" block under Notes, Context | MWI/ref/building.md:81-87 |
| Work item | Question cell prompt: "<One question. Recommended: answer, because reason.>" | MWI/ref/refining-requirements.md:84 |
| Work item | Recent History row forms listed in the template comment (check, merge, deploy, handoff, hand change) | MWI/ref/testing-loop.md:18; MWI/ref/deploying.md:33, 37, 39; HO/SKILL.md:28-29; TWL/ref/folders-and-files.md:110-117 |
| Work item | Sub-item requirement: "Covers <parent ID> R-xx" | MWI/ref/refining-requirements.md:62, 71, 105 |
| Work item | Done and Cancelled wordings of the four Current state lines, given in the template comment | MWI/ref/deploying.md:57, 68 |
| Design | One "Design status" line; the header `status` and `approved` lines go | MWI/as/design-template.md:3-4, 12, 15; TWL/ref/field-mapping.md:163 |
| Design | New table "System documents this design changes" | MWI/ref/reflecting.md:18-20 (deciding at close what changed) |
| Design | New line "Independent critique: <ran, or none and why>" | MWI/ref/designing.md:31 |
| Design | Constraints table: a column for the `CON-##` or `DEC-###` ID | MWI/as/design-template.md:37-39 |
| Decision entry | Status, Question, Decision, Reason, Decided by and date, Raised in, Affects, Changes, Replaces | PWR/as/PROJECT-QUESTION.md:1-24; PWR/ref/questions-and-change-impact.md:10-40; MPM/ref/saving.md:52-56; SML/ref/record-format.md:120-126; SMN/as/decision-record.md |
| Source entry | ID, title, date, kind, from whom, file, Used by, Corrects | PWR/as/INTAKE-RECEIPT.md:1-27; PWR/ref/source-intake.md:17-25, 40-41 |
| `system/` document | Status, Last changed via, Governs, Open questions, Changelog | PWR/as/TARGET-ARCHITECTURE.md:1-14; PWR/as/DOMAIN-MAP.md:1-19; MWI/ref/reflecting.md:19 ("each Source naming the item ID and Q-ID") |
| `system/glossary.md` | Term, System or context, Meaning here, Distinction or alias, Source, Status and last checked; "Naming changes and aliases" list | MPM/ref/saving.md:92-98; SML/ref/record-format.md:128-135; SMN/ref/writing-pages.md:152-154 |
| Current State | "Last updated" line; three sections with their limits written in the headings ("Now (5 lines at most)") | MPM/ref/current-state.md:7-15 |
| Memory pointer | "<ID>: <a few words>. <link>" | SML/ref/record-format.md:91-101; SMN/ref/database-layout.md:81-87 |
| Deployment record | "Execution and outcome": target, result, job or run ID, checks after the deploy | MWI/ref/salesforce-deploying.md:26; MWI/ref/deploying.md:47 |

## 6. Rules that become checks

Each check is one sentence that a script can test. "Where it can run" matters:

- **Git**: the files are in Git (`system/`, `sources/`, `DECISIONS.md`, `reference/`, `delivery/`, `tests/`). A check can run at session start and before each commit.
- **Local**: local work items and local memory. Git ignores both folders, so a commit never includes them. A check can run at session start or after an edit, never as a commit check.
- **Online**: work items in Notion or GitHub, memory in Notion or Hindsight. A script without the network and the owner's sign-in cannot read them. These checks stay in the tracker's own skill (for example TWG/ref/searching.md:89-97 and TWN/ref/searching.md:113-132).

| ID | The check | Where it can run | Rows it replaces |
| --- | --- | --- | --- |
| V-01 | Every `DEC-###`, `SRC-###`, `CON-##`, `SEC-##`, and `INT-##` ID appears once as a definition, and no number is used twice. | Git | B-133 |
| V-02 | Every decision entry has a Status of Open, Decided, or Superseded; a Decided entry names who decided and the date. | Git | B-124 |
| V-03 | A Superseded entry names the entry that replaced it, and that entry exists. | Git | B-131, B-214 |
| V-04 | Every `system/` document has the Status, "Last changed via", and Governs lines, and the sections Overview, Content, Open questions, and Changelog. | Git | B-125 |
| V-05 | The decision named in "Last changed via" exists, is Decided, and is the decision in the newest Changelog row. | Git | B-096 |
| V-06 | Every `system/` document has one row in `system/README.md`, and the row's status and last decision equal the document's. | Git | B-118, B-121 |
| V-07 | A document's "Open questions" section holds only links to `DECISIONS.md` entries whose Status is Open. | Git | B-128 |
| V-08 | A Decided entry whose "Changes" line names a `system/` document appears in that document's Changelog. | Git | B-119 |
| V-09 | Every file in `sources/` has one index row, and every index row has a file or a "kept outside Git" note. | Git | B-122 |
| V-10 | A commit never changes or deletes a file already in `sources/` or `reference/outside-docs/`. | Git, before a commit | B-063, B-147 |
| V-11 | A commit never includes a path under `work-items/` or `memory/`. | Git, before a commit | B-143 |
| V-12 | No item, design, decision entry, source entry, or `system/` document holds a template prompt in angle brackets. | Git and Local | B-022, B-175 |
| V-13 | No tracked document and no memory file holds a line that looks like a secret or an email address. | Git and Local | B-210 |
| V-14 | A commit message holds no closing word ("closes", "fixes", "resolves") before an item number. | Git, before a commit | B-100 |
| V-15 | Every item has one file; its name equals its `id`; no two files share an `id`. | Local | B-027, B-155, B-157, B-162 |
| V-16 | Each header field holds a value from its list; each date is a date; `status` matches `state`. | Local | B-002, B-020, B-026, B-156, B-167, B-173 |
| V-17 | Folder nesting, `parent:`, and the parent's sub-item list agree; no item is deeper than level 3; only a top-level item has a Roadmap. | Local | B-004, B-009, B-013, B-068, B-158, B-161 |
| V-18 | Roadmap rows and Tasks headings list the same phase IDs in the same order; task IDs are unique; each task has its five lines; a ticked task says Done. | Local | B-011, B-033, B-034, B-087, B-168 |
| V-19 | Current state has exactly five labelled lines; Next action matches one of the three forms; "Waiting on" agrees with `waiting_on`. | Local | B-029, B-030, B-031 |
| V-20 | An item past Refining Requirements has a date in `requirements_approved`, no open approval row, and, for each requirement not dropped, a Goal, one functional line, and one acceptance line; an item past the Testing Loop has `result_approved`. | Local | B-003, B-016, B-036, B-049, B-059, B-091 |
| V-21 | An item folder has at most one design; an approved design names an answered Q-ID and has a check for every acceptance line; the design's status agrees with the item's `design`. | Local | B-040, B-044, B-071, B-073, B-075 |
| V-22 | A Blocked item has a filled Blockers line; an open row that needs the owner means `waiting_on` is owner. | Local | B-007, B-053 |
| V-23 | A Done or Cancelled item has no open task, no Open row, no open sub-item, the set Current state wordings, and a filled "Moved up" line. | Local | B-008, B-093, B-104, B-105, B-173 |
| V-24 | Every ID in an item's Sources line and "Moved up" line exists in `sources/`, `DECISIONS.md`, or `system/`. | Local and Git | B-099 |
| V-25 | Every local work item that a decision entry or a source row lists exists and holds that ID. | Local and Git | B-119, B-128 |
| V-26 | Current State has "Last updated" and three sections of at most 5, 5, and 3 lines; each Now line names an open item that left Backlog, and each such item has a Now line. | Local | B-019, B-106, B-141, B-202, B-205 |
| V-27 | Every memory pointer is an ID plus a link, and the ID exists. | Local | B-221, B-229 |
| V-28 | Each top-level item that left Backlog is listed under exactly one phase in `PROJECT-ROADMAP.md`, and its Related items names the same phase. | Local and Git | B-014, B-176 |
| V-29 | A test plan is named `tests/<ID>-test-plan.md`. | Git | B-088 |
| V-30 | Every folder in `reference/outside-docs/` has one row in its index. | Git | B-146 |
| V-31 | In an item, requirement numbers, Q-IDs, and phase IDs have no gap; a superseded row names an existing Q-ID. | Local | B-021, B-057 |
| V-32 | A commit made only of documents holds only allowed paths and file types. | Git, before a commit | B-145, B-148 |
| V-33 | A file under `sources/` or `system/integrations/` is named in lowercase words joined by hyphens, after its ID. | Git | B-132 |

Three limits apply to every check above:

1. The toolkit's own rule (`AGENTS.md`, "Code limit") allows a project to run only the three hook commands and the Salesforce code. A checking script is a new command. It needs the owner's yes first, with its size. I did not size it.
2. Checks marked Local never run before a commit, because Git ignores those folders. They run at session start, when the script reads the main checkout.
3. No check reaches Notion, GitHub Issues, or Hindsight. In a project that keeps work items there, V-15 to V-23 and V-31 do not run, and V-24, V-25, and V-28 run only on the file side.

Section 8.6 says where each check would repeat something a skill or a hook already tests today.

## 7. Rules to delete

| Rows | What goes | Reason |
| --- | --- | --- |
| B-114, B-118, B-121, B-123, B-127, B-134, B-136 | The five `project-wide-records/` record kinds, their thresholds, name tables, and example | The folder is removed. `DECISIONS.md`, `sources/`, and `system/README.md` replace four kinds; people move to `PROJECT.md`. |
| B-056, B-066, B-097, B-130 | Shared questions that link to an item's row; intake receipts; domain map upkeep | The new layout stores the decision or the original once, outside every item, so nothing needs a second record to link them. |
| B-064, B-159, B-163, B-172, B-179, B-180, B-190 | Every rule that files an original inside a work item or in `delivery/` | `sources/` is the one home. |
| B-199, B-200, B-207, B-211, B-220, B-224, B-225, B-226, B-232, B-234 | Concept records, their statuses and marks, merges, and size limits | Memory holds pointers only. |
| B-201, B-215 | Approval modes and proposal records for memory | A pointer needs no approval. A decision not yet made is an Open entry in `DECISIONS.md`. |
| B-048, B-070, B-109, B-113 | Prose copies of the work item template's layout | The template already has the field. |
| B-050 | Notes about items made before toolkit 0.8.1 and 0.8.4 (also TWL/ref/field-mapping.md:127; TWG/ref/issue-layout.md:73; TWN/ref/page-layout.md:34-36) | Moving items to the new layout is one job for the setup skill. After it, the notes describe nothing. |
| B-092 | "No new approval is needed" for Reflecting | The close now asks one question and records the answer. |
| B-120 | The second statement of "publish alone only when it can stand alone" | `publish-docs` says it. |
| B-198 | The "Linked memory" view on a Notion item page | Memory no longer holds facts about an item. The owner must confirm. |
| B-218 | The eleven set reply lines for memory saves | Chat wording, not a record rule. Most of the saves they report no longer exist. |

## 8. The skill map

The answer in short: **no new skill, one rename, the same number of skills.** Every one of the four events in the guidance already has an owner among today's skills. The steps go inside those skills, as reference files named after the events. Sections 8.1 to 8.6 show why.

### 8.1 Today's map: every skill a project can get

Seventeen skills exist for projects (two of them come in more than one version), plus two that stay in the `toolkit` plugin. "Through" means the skill tells another skill to do the write.

| Skill | The one job it does | The event or request that triggers it | Reads | Writes | Hands to | What it must not do (the skill that does it instead) |
| --- | --- | --- | --- | --- | --- | --- |
| `managing-work-items` | Runs one work item from idea to Done through ten States and asks for each approval | The owner asks to plan, change, build, test, or ship an item; a message continues an item; a to-do or decision belongs to an item | The item; memory; `requirements/`, `system-guide/`, `project-wide-records/`; `.claude/rules/owner-preferences.md` | Through `tracking-work-items`: every field of the item, phases, project tasks. Itself: `tests/<ID>-test-plan.md`, `memory/CURRENT_STATE.md` (SKILL.md:93), branches and pull requests. Through `publish-docs`: `requirements/`, `system-guide/` | `tracking-work-items`, `managing-project-wide-records`, `managing-project-memory`, `merge-and-clean-up`, `publish-docs`, the `sf-*` skills | Say where an item is saved (`tracking-work-items`). Run the merge of a pull request (`merge-and-clean-up`). Keep records that several items share (`managing-project-wide-records`) |
| `tracking-work-items` (local) | Stores and finds work items as local files | Called for every read and save of an item; a look-up, move, or nesting the owner asks for | `work-items/`, `PROJECT.md` (ID prefix), `PROJECT-ROADMAP.md` | `work-items/**`, the item's `references/` folder, `work-items/PROJECT-TASKS.md`; `PROJECT-ROADMAP.md` through `publish-docs` | `managing-work-items`, `project-setup`, `publish-docs` | Decide what to save, a State, or an approval (`managing-work-items`). Edit memory (`managing-project-memory`) |
| `tracking-work-items` (GitHub) | Stores and finds work items as GitHub issues | The same | Issues, labels, milestones, comments | Issues, labels, milestones, design and source comments, the "Project tasks" issue | `managing-work-items`, `project-setup` | The same |
| `tracking-work-items` (Notion) | Stores and finds work items in three Notion databases | The same | Work Items, Phases, Tasks databases; page text | Rows, page text, the Files property, the Solution Design page, comments | `managing-work-items`, `using-notion-cli`, `project-setup` | The same |
| `managing-project-wide-records` | Keeps five kinds of records that link sources, questions, people, domains, and target direction across items | Evidence, an answer, or a proposed design affects more than one item; those links need review | Root `AGENTS.md`, `PROJECT.md`, items, `requirements/`, `system-guide/`, memory | `project-wide-records/` (domains, questions, people, target-architecture, intake) | `tracking-work-items`, `managing-work-items`, `managing-project-memory`, `publish-docs` | Handle one item alone, or give an approval (`managing-work-items`). Hold the original source (`tracking-work-items`, or `delivery/`) |
| `managing-project-memory` | Decides what memory keeps, corrects, or forgets; writes the owner's standing instructions to the rules; finds what was recorded; tidies memory | "Remember this", "forget that", "from now on", "what did we decide", "clean up memory"; a hook reminder | Memory, work items, the "Memory approval" line in `PROJECT.md` | Through `storing-project-memory`: concept records, decision records, the glossary, Current State. Itself: `.claude/rules/owner-preferences.md`, and a new project skill for a proven lesson | `storing-project-memory`, `tracking-work-items`, `managing-work-items`, `handoff`, `project-setup` | Say where memory is kept (`storing-project-memory`). Write a handoff (`handoff`). Record an item's own decision (`managing-work-items`) |
| `storing-project-memory` (local) | Stores and finds memory as files in `memory/` | Called for every read and write of memory; a look-up such as "which memory files link to WI-031" | `memory/*.md` | `memory/*.md` except `MEMORY.md`, which the session-start hook writes | `managing-project-memory` | Decide what to keep or when to ask (`managing-project-memory`) |
| `storing-project-memory` (Notion) | Stores and finds memory in Lore's five Notion databases and two pages | The same | Memories, Entities, Facts; the Current state and glossary pages | The same pages and rows | `managing-project-memory`, `using-notion-cli`, `tracking-work-items` (an item's page id) | The same |
| `using-notion-cli` | Says how to run `ntn`: sign-in, Codex, the shape of each call, errors | Before the first Notion call of a session; a Notion call failed | Nothing of its own | Nothing of its own | `tracking-work-items`, `storing-project-memory` | Say what to read or save (the two storage skills) |
| `handoff` | Makes this session's records true, then writes a checked prompt for the next session; or checks a pasted prompt | The owner ends the session, clears context, or says "write a handoff" or "check this handoff" | The conversation, this session's items, Current State, `project-wide-records/` | Through `tracking-work-items`: the items' Current state, question rows, one history row. Itself: `memory/CURRENT_STATE.md` (SKILL.md:43-45). The prompt goes to the chat and is not saved | `tracking-work-items`, `managing-project-memory`, `managing-project-wide-records`, `publish-docs`, `session-summary` | Give a recap alone (`session-summary`). Decide what is worth keeping (`managing-project-memory`) |
| `session-summary` | Recaps the chat as a table of requests and results | "Recap this chat", "what did I ask for" | The conversation only | Nothing | `managing-work-items`, `handoff` | Write a handoff (`handoff`). Change any record |
| `braindump` | Plays back a loose brain dump and waits for a yes | "Here's a brain dump", "play that back" | The message | Nothing | `managing-work-items`, `managing-project-memory` | Plan the work (`managing-work-items`). Save anything (`managing-project-memory`) |
| `explain-simply` | Explains the last answer, a plan, or a document again in plain bullets | "Simpler", "I don't get it" | The last answer, a file, or an item through `tracking-work-items` | Nothing | `tracking-work-items` | Change any record |
| `publish-docs` | Commits an approved document edit straight to the default branch from its own temporary worktree | The owner approved a document edit; "publish the docs"; another skill sends a save | Git state; the files to save | Commits to `requirements/`, `system-guide/`, `project-wide-records/`, `PROJECT-ROADMAP.md`, `PROJECT.md`, READMEs, `ai-external-knowledge/`, `delivery/` | `managing-work-items`, `managing-project-wide-records`, `tracking-work-items`, `handoff` | Decide what a document says (the skill that sent the save). Save code, rules, or skills, or an item's own requirements (`managing-work-items`) |
| `pull-latest` | Brings the local repository up to date by fetching and merging | "Get the latest", "sync with remote" | Git | Git (merge only) | `reset-to-remote`, `project-setup` | Discard local work (`reset-to-remote`). Update the toolkit (`project-setup`) |
| `reset-to-remote` | Makes the local repository an exact copy of its remote | Only the owner's own words: "wipe local", "match remote exactly" | Git | Git (reset) | `pull-latest` | Do a routine update (`pull-latest`) |
| `merge-and-clean-up` | Merges one approved pull request and removes its branch and worktree | `managing-work-items` asks, or the owner names a pull request | The pull request; the item ID in the branch name | The merge; one Recent History row, only when the owner asked directly | `tracking-work-items`, `managing-work-items` | Change a State or mark an item Done; apply the standing merge permission; merge with no remote (all `managing-work-items`) |
| `sf-component-tracker` | Keeps the component tracker, the manifests, and the manual steps in step with the Salesforce source | Metadata under `force-app/` changes; a deploy result comes back; a deploy needs manual steps | `force-app/`, `delivery/deployment/` | `component-tracker.csv`, `package.xml` files, `destructiveChanges.xml`, `manual-steps.md` | None named | Hold an item's status or deploy dates (the work item; SKILL.md:33, 159, 179) |
| `sf-deploy-check` | Finds what a Salesforce deploy would ship beyond the intended change | A deploy to a shared org is about to run; before the owner gets a deploy command | The manifest, the tracker, the target org (read only) | Nothing | `sf-component-tracker`, `managing-work-items` | Test whether an item is ready, or run the deploy (`managing-work-items`) |
| `sf-data-change` | Builds the owner's handoff for a production data change | The owner asks to load, import, update, or delete production records | The records to change | `delivery/data/` files (ignored by Git); the record of the change in the work item | `sf-component-tracker` | Write production data (the owner runs it) |

Two more skills are on every computer and are never copied into a project: `project-setup` (sets up, checks, updates, or moves a project) and `choosing-outside-tools` (the owner's tool list). Every chat reads their descriptions too.

### 8.2 Overlaps today

Each row is a pair or group of skills that cover the same event, write the same record, or state the same procedure.

| ID | The event or record | The skills | Files and lines |
| --- | --- | --- | --- |
| O-01 | A decision that later items must follow is made | `managing-work-items`, `managing-project-memory`, `managing-project-wide-records` | MWI/as/work-item-template.md:126 and MWI/ref/refining-requirements.md:43-54 (the item's row, then the offers); MPM/ref/saving.md:48-58 (a memory record); PWR/ref/questions-and-change-impact.md:24-40 (a shared question). Three records for one decision |
| O-02 | The project's Current State is written | `managing-work-items`, `handoff`, `managing-project-memory` | MWI/SKILL.md:72, 93 and MWI/ref/deploying.md:58; HO/SKILL.md:43-57; MPM/ref/current-state.md:17-35. The first two edit the file themselves and repeat parts of the third's rules |
| O-03 | An item's Current state, question rows, and history are brought up to date | `handoff`, `managing-work-items` | HO/SKILL.md:22-32 restates MWI/SKILL.md:69-71 and the starter rule `keep-work-item-current.md`:5-13 |
| O-04 | An original arrives | `managing-work-items`, `tracking-work-items` (three versions), `managing-project-wide-records` | MWI/ref/refining-requirements.md:87-95; TWL/ref/field-mapping.md:152-157; TWG/ref/issue-layout.md:140-176; TWN/ref/database-layout.md:274-296; PWR/ref/source-intake.md:1-41. Which skill owns it depends on how many items the source affects, which is often unknown when it arrives |
| O-05 | Project documents are updated after delivery | `managing-work-items`, `publish-docs`, `managing-project-wide-records` | MWI/ref/reflecting.md:18-26 (what to write); PD/SKILL.md:18-26 (which files may be saved); PWR/ref/record-lifecycle.md:39 and PWR/SKILL.md:33-36 (target records and when to publish) |
| O-06 | A pull request is merged | `managing-work-items`, `merge-and-clean-up` | MWI/ref/deploying.md:26-39 and `merge-and-clean-up/SKILL.md`:32-45, 166-170. Both state when a merge is allowed, and both describe the history row. A merge with no remote is only in `deploying.md`:37 |
| O-07 | The form of a memory record | `managing-project-memory`, `storing-project-memory` (two versions) | Lessons: MPM/ref/saving.md:44-46, SML/ref/record-format.md:103-118, SMN/ref/database-layout.md:77. Decision parts: MPM/ref/saving.md:55, SML/ref/record-format.md:120-126, SMN/as/decision-record.md. Proposals: MPM/ref/saving.md:75-82, SML/ref/record-format.md:48-62, SMN/ref/writing-pages.md:105-112 |
| O-08 | The form of a work item record | `managing-work-items`, `tracking-work-items` (three versions) | The duplicates D-03, D-04, D-05, D-23. Also TWL/ref/field-mapping.md:186-194, where the storage skill sets a new item's default values, which is a decision about content |
| O-09 | Where information goes | `managing-project-wide-records`, `managing-project-memory` | PWR/ref/placement-and-authority.md:7-16; MPM/ref/memory-criteria.md:9-15. Both repeat the table in the starter `AGENTS.md`:97-119 |
| O-10 | The project's phases change | `managing-work-items`, `tracking-work-items` (local), `publish-docs` | MWI/SKILL.md:53; TWL/ref/project-roadmap-and-tasks.md:7-8; the `publish-docs` description names `PROJECT-ROADMAP.md`. The toolkit's own index lists this pair as one to watch (`dev/SKILL-INDEX.md`:268-272) |
| O-11 | What is worth keeping when a session ends | `handoff`, `managing-project-memory` | HO/SKILL.md:33-38; MPM/SKILL.md:22-38 |
| O-12 | The word "requirements" | `publish-docs`, `managing-work-items` | C-13 |
| O-13 | A Salesforce item's deployment folder and record | `sf-component-tracker`, `managing-work-items` | `sf-component-tracker/SKILL.md`:14-33; MWI/ref/salesforce-deploying.md:7, 22, 26. Both list the folder's files and the release folder |
| O-14 | "Is this item ready for UAT?" | `sf-deploy-check`, `managing-work-items` | Both descriptions; `dev/SKILL-INDEX.md`:261-263 |
| O-15 | The same rule stated in a hook and in a skill | The three hook commands, with `managing-work-items` and `managing-project-memory` | `prompt-reminder.mjs`:36-42 (a decision goes in the item first; an instruction goes in the rules) repeats MPM/ref/saving.md:84-90. `codex-after-commit.mjs`:8-10 repeats MWI/SKILL.md:70-72. `session-start.mjs`:36-43 tests the 40-line limit of MPM/ref/current-state.md:15 |
| O-16 | Creating a local item's folder and ID | `tracking-work-items` (local), and the starter rule `work-item-folders.md` | TWL/ref/folders-and-files.md:72-87 and the rule's lines 15-17 state the same steps |

Checked and found clean: `handoff` and `session-summary` (each names the other for the other's job); `braindump` and `managing-work-items`; `pull-latest` and `reset-to-remote`; `using-notion-cli` and the two Notion storage skills; `explain-simply` and `tracking-work-items`; `sf-data-change` and `sf-component-tracker`.

### 8.3 The proposed map

> Read section 12 first. The owner has since removed `managing-project-wide-records` and chosen new skill names. Section 12 moves the three filing references from `filing-project-records` into `running-work-item-lifecycle`. The reasoning below about one owner per event still holds.

It starts from today's skills. The four event names in the guidance become reference files inside the skills that already own those events.

**The four events, one verdict each**

| Name in the guidance | Is the event owned by a skill today? | Verdict | Reason in one sentence |
| --- | --- | --- | --- |
| `close-work-item` | Yes: `managing-work-items`, in MWI/ref/reflecting.md:1-31 and MWI/ref/deploying.md:50-74 | A step inside `managing-work-items`: a new `references/closing.md` made from those lines | Closing is the last three States of the lifecycle this skill already runs, and a second skill would compete with it and with `merge-and-clean-up` for "ship it", "mark it Done", and "finish WI-007". |
| `record-decision` | Yes, by three skills (O-01): the item's row in `managing-work-items`; a shared question in `managing-project-wide-records` (PWR/ref/questions-and-change-impact.md:1-55); a memory record in `managing-project-memory` (MPM/ref/saving.md:48-58) | A step inside the renamed `managing-project-wide-records`: `references/record-decision.md` | The existing skill for "what more than one item needs" already owns the cross-item question, so the decision joins it and the other two skills drop their copies. |
| `file-source` | Yes, by three skills (O-04): `tracking-work-items` (TWL/ref/field-mapping.md:152-157; TWG/ref/issue-layout.md:140-176; TWN/ref/database-layout.md:274-296), `managing-project-wide-records` (PWR/ref/source-intake.md:1-41), and `managing-work-items` (MWI/ref/refining-requirements.md:87-95) | A step inside the renamed `managing-project-wide-records`: `references/file-source.md` | `sources/` is always files in the repository, so storing an original no longer depends on the tracker, and the three tracker versions drop it. |
| `update-system-doc` | Yes: `managing-work-items` decides what to write (MWI/ref/reflecting.md:18-26); `publish-docs` saves it (PD/SKILL.md:18-26); `managing-project-wide-records` keeps target records (PWR/ref/record-lifecycle.md:39) | A step inside the renamed `managing-project-wide-records`: `references/update-system-doc.md`, called from `closing.md` | A `system/` document changes only together with a decision entry, so keeping both steps in one skill removes a hand-off that an agent can skip. |
| `managing-project-wide-records` itself | It is the existing skill | A rename, to `filing-project-records`, with its body rewritten | Its job stays "what more than one work item needs"; four of its five record kinds map to `DECISIONS.md`, `sources/`, and `system/`, and the fifth (people) moves to `PROJECT.md`. |

This differs from the guidance's list of four separate skills. Three reasons: the events already have owners; the three filing events share the same steps (apply the filing test, search first, take the next ID, leave the pointer in each item, save with `publish-docs`), which three skills would each have to repeat; and every chat reads every description. The event names stay visible as the reference file names, and each reference bundles its own template. If the routing test shows that the one description misses an event, split `record-decision` out first, because it is the event the owner starts most often in his own words.

A draft description for the renamed skill (448 characters; it must match `dev/SKILL-INDEX.md`, and the routing test must run in both hosts after it changes):

> Files what more than one work item needs: records a decision or open question in DECISIONS.md, files an original in sources/, and applies an approved change to a system/ document, each with its ID and a pointer in the work item. Use when the owner decides something ("we decided", "let's go with"), hands over a transcript or document, or a closing item changed the system. Not for one item's own requirements or decisions; use managing-work-items.

**The proposed map**

| Skill | Change | The one job it does | The event or request that triggers it | Reads | Writes | Hands to | What it must not do (the skill that does it instead) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `managing-work-items` | Kept. `reflecting.md` and the "Marking Done", "Cancelling", and "by hand" parts of `deploying.md` merge into `references/closing.md`. The source, memory-offer, and shared-record steps go | Runs one work item from idea to Done, and asks the closing question before it closes | As today, plus "mark it Done", "cancel it", and an item the owner closed by hand | The item; `DECISIONS.md`; the area's `system/` document; `system/constraints.md`; `sources/` entries by ID | Through `tracking-work-items`: every field of the item, including the "Moved up" line. Itself: `tests/<ID>-test-plan.md`; a deployment record in `delivery/`; branches and pull requests. Through `storing-project-memory`: the item's line in Current State | `tracking-work-items`, `filing-project-records`, `storing-project-memory`, `merge-and-clean-up`, `publish-docs`, the `sf-*` skills | Write `DECISIONS.md`, `sources/`, or `system/` (`filing-project-records`). Say where an item is saved (`tracking-work-items`). Run the merge (`merge-and-clean-up`) |
| `tracking-work-items` (local, GitHub, Notion) | Kept. Source storage goes. The Sources line holds `SRC-###` IDs. Finding hand changes moves to the check; the repairs stay | Stores and finds work items in the project's tracker | Called for every read and save of an item; a look-up, move, or nesting the owner asks for | The tracker | The tracker only | `managing-work-items`, `using-notion-cli`, `project-setup`, `publish-docs` (local roadmap) | File an original (`filing-project-records`). Decide what to save, a State, or an approval (`managing-work-items`) |
| `filing-project-records` | Renamed from `managing-project-wide-records`; rewritten | Files what more than one work item needs: a decision or open question, an original, or an approved change to a system document, each with its ID and a pointer in each item | The owner decides something that reaches beyond one item; an original arrives; a closing item's answer says the system changed; the owner asks to change a `system/` document or a glossary term | `DECISIONS.md`, the `sources/` index, `system/README.md`, the target document | `DECISIONS.md`, `sources/`, `system/**` | `publish-docs` (the save), `tracking-work-items` (the pointer in the item), `managing-work-items` (anything about one item) | Record one item's own decision or requirement (`managing-work-items`). Commit (`publish-docs`). Write memory (`managing-project-memory`) |
| `managing-project-memory` | Kept, cut down. Concept records, decision records, the glossary, approval modes, and merges go | Keeps memory to where work stopped and pointers, and writes the owner's standing instructions to the rules | "Remember this" and "forget that" (it applies the filing table: the fact goes to its home through the owning skill, and memory gets at most a pointer); "from now on"; "clean up memory"; the hook says Current State is too long or too old | Memory | Through `storing-project-memory`: pointer lines, pruned Current State lines. Itself: `.claude/rules/owner-preferences.md` | `storing-project-memory`, `filing-project-records`, `managing-work-items` | Hold a fact, a decision, or a glossary term (`filing-project-records`). Say where memory is kept (`storing-project-memory`). Write a handoff (`handoff`) |
| `storing-project-memory` (local, Notion) | Kept, cut down | Stores Current State and pointer lines | Called for every read and write of memory, by `managing-project-memory`, `managing-work-items`, and `handoff` | Memory | Current State; pointer lines or rows | `managing-project-memory`, `using-notion-cli` | Decide what a line says (the calling skill) |
| `using-notion-cli` | Unchanged | Says how to run `ntn` | As today | Nothing of its own | Nothing of its own | The two Notion storage skills | Say what to read or save |
| `handoff` | Kept. The memory offer and the `project-wide-records/` check change | Makes this session's records true, then writes a checked prompt for the next session; or checks a pasted prompt | The owner ends the session, clears context, or pastes a prompt to check | The conversation; this session's items; Current State; the Open entries in `DECISIONS.md` this session touched | Through `tracking-work-items`: the items. Through `storing-project-memory`: "Next session starts with". The prompt goes to the chat | `tracking-work-items`, `storing-project-memory`, `filing-project-records` (a decision not yet filed), `publish-docs`, `session-summary` | File a decision or an original itself (`filing-project-records`). Give a recap alone (`session-summary`) |
| `publish-docs` | Kept. Only the list of paths changes | Commits an approved document edit straight to the default branch | A skill sends a save; the owner approved a document edit | Git state | Commits to `system/`, `DECISIONS.md`, `sources/`, `reference/`, `delivery/`, `PROJECT.md`, `PROJECT-ROADMAP.md`, READMEs | `managing-work-items`, `tracking-work-items`, `handoff` | Decide what a document says (`filing-project-records` for `system/`, `sources/`, and `DECISIONS.md`; `managing-work-items` for the roadmap) |
| `session-summary`, `braindump`, `explain-simply` | Unchanged, except one hand-off line each that names the memory skill | As today | As today | As today | Nothing | As today | As today |
| `pull-latest`, `reset-to-remote`, `merge-and-clean-up` | Unchanged. `reset-to-remote` gains one warning line (B-154) | As today | As today | Git | Git | As today | As today |
| `sf-component-tracker` | Unchanged. It becomes the only place that lists the deployment folder's files (O-13) | As today | As today | As today | As today | As today | As today |
| `sf-deploy-check`, `sf-data-change` | Unchanged | As today | As today | As today | As today | As today | As today |

How this removes each overlap of 8.2: O-01 and O-04 get one owner, `filing-project-records`. O-02 gets one writer, `storing-project-memory`, and one place for the rules (the Current State template and check V-26). O-03 shrinks to "make the item true" with the checks naming what is untrue. O-05 splits cleanly into content (`filing-project-records`) and the commit (`publish-docs`). O-06: `merge-and-clean-up` keeps the merge and its row; `deploying.md` keeps only when a merge is allowed. O-07 and O-08 shrink because the record forms live in templates. O-09: both placement tables go; the root `AGENTS.md` keeps the only one. O-13: `salesforce-deploying.md` points to `sf-component-tracker` for the folder. O-15 and O-16 belong to the other audit (hooks and rules); section 8.6 covers the part that touches the checks.

### 8.4 Overlap check on the proposed map: one owner per event

| Event | The one owning skill | The reference file | Storage it uses |
| --- | --- | --- | --- |
| A new request, idea, or bug arrives (a work item starts) | `managing-work-items` | `SKILL.md`, Backlog; `refining-requirements.md` | `tracking-work-items` |
| A work item changes stage | `managing-work-items` | The reference for that State | `tracking-work-items` |
| A decision is made that only one work item needs | `managing-work-items` | `refining-requirements.md`, step 6 | `tracking-work-items` |
| A decision is made, or a question is raised, that more than one item needs | `filing-project-records` | `record-decision.md` | Files; `publish-docs` |
| An original arrives (a transcript, document, export, image) | `filing-project-records` | `file-source.md` | Files; `publish-docs` |
| An approved system fact changes (including a glossary term) | `filing-project-records` | `update-system-doc.md` | Files; `publish-docs`, or the item's pull request when the change describes code |
| A work item closes: Done, Cancelled, or closed by hand | `managing-work-items` | `closing.md`, which calls `filing-project-records` for each thing that moves up | `tracking-work-items` |
| A test plan is written | `managing-work-items` | `testing-loop.md` | Files in `tests/` |
| A deploy runs and its result is recorded | `managing-work-items` | `deploying.md` (Salesforce: `salesforce-deploying.md`) | `delivery/` |
| The project's phases or project tasks change | `managing-work-items` | `SKILL.md`, "Levels" | `tracking-work-items` |
| The owner moves, nests, groups, or archives items; or changed one by hand | `tracking-work-items` | Its `folders-and-files.md` or the tracker's equal | The tracker |
| A chat ends, or context is cleared | `handoff` | `SKILL.md` | `tracking-work-items`, `storing-project-memory` |
| A pasted handoff prompt needs checking | `handoff` | `handoff-verifier.md` | None |
| Memory is saved: a pointer, or "remember this" and "forget that" | `managing-project-memory` | `SKILL.md` | `storing-project-memory` |
| The owner gives a standing instruction ("from now on") | `managing-project-memory` | `SKILL.md` | `.claude/rules/owner-preferences.md` |
| Memory is tidied | `managing-project-memory` | `SKILL.md` | `storing-project-memory` |
| Documents are published to the default branch | `publish-docs` | `SKILL.md` | Git |
| A pull request is merged | `merge-and-clean-up` | `SKILL.md` | Git |
| The local repository is updated from the remote | `pull-latest` | `SKILL.md` | Git |
| The local repository is reset to the remote | `reset-to-remote` | `SKILL.md` | Git |
| The owner wants a recap | `session-summary` | `SKILL.md` | None |
| The owner wants a brain dump played back | `braindump` | `SKILL.md` | None |
| The owner wants a simpler explanation | `explain-simply` | `SKILL.md` | None |
| Any Notion call | `using-notion-cli` | `SKILL.md` | None |
| Salesforce metadata changes, a deploy result comes back, or manual steps are needed | `sf-component-tracker` | `SKILL.md` | `delivery/deployment/` |
| A Salesforce deploy to a shared org is about to run | `sf-deploy-check` | `SKILL.md` | None |
| A Salesforce production data change is asked for | `sf-data-change` | `SKILL.md` | `delivery/data/` |
| A project is set up, checked, updated, or moved to another tracker | `project-setup` | Its own references | The project |

Findings of the check:

- **Two owners, fixed.** "The project's Current State changes" would have three writers, as today. Fixed in the map: `managing-work-items` and `handoff` decide their own line and `storing-project-memory` makes the write; the section limits live in the template and in check V-26, not in a third skill's prose.
- **Two owners, fixed.** "A decision is made" is split into two events by the filing test ("would an agent working a different item need to know this?"). The test is stated once, in the root `AGENTS.md`. `managing-work-items` keeps one line that applies it at the moment an answer is saved.
- **No skill, on purpose.** "The owner asks what was decided before" is a read. The root `AGENTS.md` gives the order: `DECISIONS.md`, then `system/`, then the item. The words "finds what was recorded before" leave the `managing-project-memory` description.
- **No skill, on purpose.** "An outside document is captured" is covered by the folder's own `AGENTS.md` in `reference/` and by `publish-docs` for the save. The other audit covers that rule.
- **No owner in the new layout.** "A lesson is learned that is not proven yet" has no home (see "Could not determine"). Until the owner decides, the proposed map keeps it in the work item's Notes and asks about it in the closing question.
- **Hindsight projects** have no memory skill today and none in the proposal. The root `AGENTS.md` section "Project memory" owns those events there.

### 8.5 The count

| Project setup | Skills today | Skills proposed | Descriptions every chat reads (project skills plus `project-setup` and `choosing-outside-tools`) |
| --- | --- | --- | --- |
| Local or GitHub work items, with local memory | 13 | 13 | 15 today, 15 proposed |
| Work items or memory in Notion | 14 | 14 | 16 today, 16 proposed |
| Hindsight memory, local or GitHub work items | 11 | 11 | 13 today, 13 proposed |
| Hindsight memory, Notion work items | 12 | 12 | 14 today, 14 proposed |
| Any of the above with Salesforce | 3 more | 3 more | 3 more |

Today's numbers are stated in `dev/SKILL-INDEX.md`:37-39. The proposal adds no skill, removes none, and renames one. Had the four events become four new skills with `managing-project-wide-records` retired, a project would have 3 more skills and every chat would read 3 more descriptions. The count leaves out skills from other plugins on the owner's computer. The starter project caps the room the skill list gets (`skillListingBudgetFraction: 0.03`, starter `.claude/settings.json`:83), so each added description makes it more likely that a host shortens the list.

What shrinks is the text inside the skills. Line counts today, counted in the clean copy: `managing-project-wide-records` 350 lines in 11 files; `managing-project-memory` 376 lines in 6 files; `storing-project-memory` 322 lines (local) and 630 lines of Markdown (Notion). Most of those lines describe records that the new layout removes. How many lines remain is my estimate, not a count: a few hundred across the four.

### 8.6 Where the proposed checks would repeat a test that exists today

A fact should be tested in one place. Each row names the test that exists and says which side keeps it.

| The fact | Tested today by | Proposed check | Keep it in one place by |
| --- | --- | --- | --- |
| Current State is under 40 lines and was updated in the last 7 days | `assets/hooks/session-start.mjs`:36-43 | V-26 | Keeping the size and age test in the hook, which already prints it at session start. V-26 tests only what the hook does not: the three section limits and the Now lines against the items |
| The memory index lists each current memory file | `session-start.mjs`:44-64 rebuilds `memory/MEMORY.md` from each file's header | V-27 | Dropping the rebuild when memory holds pointers only. The hook and the check must not both read the memory files |
| Every local item has one file, one ID, and a parent that agrees with its folder | TWL/SKILL.md:22 with the three commands in TWL/ref/searching.md:63-70 | V-15, V-17 | Moving the three commands into the check. The skill reads the check's findings and keeps only the repairs (TWL/ref/folders-and-files.md:108-129) |
| A new item's ID is not already taken | TWL/ref/folders-and-files.md:80-87, 96 | V-15 | Having that step run the check in place of its own two commands |
| An item's Roadmap rows and Tasks headings match | TWL/ref/field-mapping.md:78-82 | V-18 | The same: the step runs the check |
| No template prompt is left | TWL/ref/field-mapping.md:195-201; TWN/ref/page-layout.md:67; SML/ref/record-format.md:141 | V-12 | The check for local files. The Notion version keeps its own read-back, because the check cannot reach Notion |
| A memory file is well formed | SML/ref/record-format.md:137-144 ("A file is right when") | V-27 | Deleting the list with the records it describes |
| An item is ready to close | MWI/ref/reflecting.md:7-11; MWI/ref/deploying.md:52-55 | V-23 | Replacing both lists with "run the check; fix what it names". The judgment step (requirements against the checker's verdicts, `reflecting.md`:12) stays in the skill |
| Requirements are complete enough to approve | MWI/ref/refining-requirements.md:66; the requirements analyst helper | V-20 | The check tests the form (each requirement has its parts). The helper keeps the meaning (gaps, two readings). Remove the form test from `refining-requirements.md`:66 |
| A document save holds only allowed paths and file types | PD/SKILL.md:18-26, 118-128 | V-32 | Moving the lists into the check, so a commit made outside `publish-docs` is tested too. `publish-docs` step 1 keeps only "the owner approved this edit" |
| Each work item a memory names exists | MPM/ref/tidying.md:51-55 | V-27 | The check. Tidying keeps only the questions for the owner |
| Current State has no line that is no longer true | MPM/ref/current-state.md:26-35; HO/SKILL.md:51-52 | V-26 | The check finds the lines. One skill step removes them |
| Pull request and commit text does not close an item | MWI/ref/deploying.md:23; TWG/SKILL.md:29; `merge-and-clean-up/SKILL.md`:103 (prose only, no test) | V-14 | The check for commit messages. Pull request text is written on GitHub and stays a rule in `tracking-work-items` (GitHub) |
| A commit does not add everything, skip its checks, or force a push | Starter `.claude/settings.json`:44-66 (refused commands) | None | Nothing to add. Because `git commit --no-verify` is refused there, a check that runs before a commit cannot be skipped in Claude Code |
| The facts in a handoff prompt match the records | HO/ref/handoff-verifier.md:58-70 (a helper agent) | None | No repeat: the helper tests the prompt's text, not the records |
| The build meets each requirement | MWI/ref/acceptance-checker-brief.md (a helper agent) | None | No repeat |
| A GitHub issue has the layout and one state label; a Notion card has a title and the template | TWG/ref/searching.md:89-97; TWG/ref/labels.md:93-100; TWN/ref/searching.md:113-132 | None | These stay in the tracker skills. The check cannot reach them |
| Salesforce org safety, permission sets, and the dependency graph | The two guards and the graph Stop hook (starter `.claude/settings.json`:11-39) | None | No repeat. The checks never test a deploy |
| After a commit, the item and Current State are updated | `codex-after-commit.mjs`:8-10 (a reminder, not a test) | V-19, V-26 at the next session start | Keeping the reminder for projects whose items are in Notion or GitHub, where no check can run |

## 9. Proposed templates

Every template the new layout needs, the skill that bundles it, and its fields. A skill reads only files in its own folder, so each template sits in the `assets/` folder of the skill that uses it. Where the starter project also ships the file (for example the `system/` documents with Status "Not started"), the toolkit's rule applies: the skill's copy must equal the starter's file, and `dev/SKILL-INDEX.md` section 8 lists the pair.

| Template | Bundled in | Fields |
| --- | --- | --- |
| Decision entry (one entry in `DECISIONS.md`) | `filing-project-records/assets/decision-entry.md`; the same form in a comment at the top of `DECISIONS.md` | Heading "DEC-### — <the decision or question in one line>". Status (Open, Decided, or Superseded). Question. Decision ("Not decided yet." while Open). Reason (the owner's words, or "None given."). Decided by, and the date. Raised in (work item and Q-ID, `SRC-###`, or "conversation" with its date). Affects (work item IDs, or "the whole project"). Changes (`system/` document and rule IDs, or "No system document."). Replaces, and Replaced by (a DEC ID, or "none"). Next step (while Open: who does what) |
| `DECISIONS.md` (the file) | Starter project; form held by `filing-project-records` | Title. One comment: the filing test, the three statuses, "add a new entry at the end; never delete or renumber an entry". Then the entries |
| Source entry (one row in `sources/README.md`, and the file's name) | `filing-project-records/assets/source-entry.md` | `SRC-###`. Title. Date of the source. Kind (transcript, document, message, export, image, other). From whom. Received on. File (its name in `sources/`, written `SRC-###-<short-name>.<type>`; or "kept outside Git: <where>, <size>"). Used by (work item, DEC, and system rule IDs). Corrects, and Corrected by (an SRC ID, or "none") |
| `system/` document (the shared frame) | `filing-project-records/assets/system-doc.md` | Status (Not started, Draft, or Approved). Last changed via `DEC-###`. Governs (what this document decides for). Overview. Content, as rules that each have an ID. Open questions (links to `DECISIONS.md` only). Changelog (date, change, DEC, WI) |
| `system/README.md` | `filing-project-records/assets/system-index.md` | One row per document: Document, Status, Last decision applied, Governs |
| `system/glossary.md` | `filing-project-records/assets/glossary.md` | The shared frame. Content: one table (Term; System or context; Meaning here; Distinction or alias; Source; Status and last checked), then "Naming changes and aliases" (old term, new term, reason, source, date). These are today's columns (SML/ref/record-format.md:128-135) |
| `system/constraints.md` | `filing-project-records/assets/constraints.md` | The shared frame. Content: one row per constraint: `CON-##`; the constraint in one sentence; the areas it applies to; its source (a DEC or SRC ID); the date it began |
| `system/architecture.md` | `filing-project-records/assets/architecture.md` | The shared frame. Content: the main parts, what each is responsible for, and how they connect, as rules with IDs. The layout names no ID prefix for this document |
| `system/data-model.md` | `filing-project-records/assets/data-model.md` | The shared frame. Content: each record type, its fields, who owns it, and its life from creation to removal, as rules with IDs. No ID prefix is named |
| `system/security-model.md` | `filing-project-records/assets/security-model.md` | The shared frame. Content: one row per rule: `SEC-##`; who; may do what; where it is enforced; source |
| `system/automation.md` | `filing-project-records/assets/automation.md` | The shared frame. Content: one block per automation: what starts it; what it does; what it changes; what happens when it fails. No ID prefix is named |
| Integration document (`system/integrations/<name>.md`) | `filing-project-records/assets/integration.md` | The shared frame, with the ID `INT-##`. Content: the other system; the direction; what moves; what starts it and how often; how it signs in (never the secret itself); what happens when it fails; who owns it |
| `system/integrations/README.md` | `filing-project-records/assets/integrations-index.md` | One row per integration: `INT-##`, system, document, Status |
| Work item | `managing-work-items/assets/work-item-template.md`; the tracker's own form in each `tracking-work-items` version | Today's fields (MWI/as/work-item-template.md:1-152), with these changes. Header: default values filled in. Blockers prompt asks for the State it left. Related items: no memory sentence. New line "Pull requests". New line "Moved up". Questions and Answers: the Answer cell of a decision other items need holds only the DEC ID. Notes: a "Team" block; Sources lines hold `SRC-###`. Template comment: the set row forms and the Done and Cancelled wordings |
| Design | `managing-work-items/assets/design-template.md` | Today's sections (MWI/as/design-template.md:1-185), with these changes. One "Design status" line; the header `status` and `approved` lines go. Constraints table gains an ID column. New table "System documents this design changes" (document, rule ID, change). New line "Independent critique". Sources table takes SRC and DEC IDs |
| Current State | `storing-project-memory/assets/current-state.md` (it exists in the Notion version today) | "Last updated: <date, source, who>". Now (5 lines at most): one open item per line, its ID and a few words. Waiting on the owner (5 at most). Next session starts with (3 at most) |
| Memory pointer | A comment at the top of the pointer file or page | One line: "<ID>: <a few words>. <link>". Nothing that restates the fact |
| Handoff prompt | `handoff/assets/handoff-prompt-template.md` | Today's first line and seven headings. "Written down in" names an item, a `system/` rule ID, or a DEC ID |
| Deployment record | Starter project, `delivery/`; `managing-work-items/references/deploying.md` names it | Item ID. Target. What was deployed. The commit deployed. Execution and outcome (result, job or run ID). Checks after the deploy. Today only the Salesforce starter has this file |
| Test plan | Starter project, `tests/TEST-PLAN-TEMPLATE.md` | Unchanged; the other audit covers it |
| Project roadmap and project tasks | Starter project; forms in `tracking-work-items` | Unchanged |

## 10. Originals when work items are in Notion or GitHub

> Section 12.3 answers the owner's later question: whether decisions and sources should be Notion databases in a Notion project.

**The answer: an original always goes to `sources/` in the repository, whatever the tracker. The item points to it with one line that holds the `SRC-###` ID.** There is no item folder to miss, because no tracker keeps originals any more.

How it works, step by step:

1. The agent takes the next `SRC-###` number, saves the original unchanged as `sources/SRC-012-kickoff-transcript.md`, and adds its row to `sources/README.md`. Text the owner pasted is saved exactly as pasted.
2. The agent publishes that save to the default branch at once, with `publish-docs`. Two reasons: publishing claims the number, so a second session cannot take it; and a link from Notion or GitHub works only once the file is on the default branch.
3. In the work item, the Sources line reads: "SRC-012: kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02." The line is the same in all three trackers. It sits in the Notes, Sources part of a local file, of a GitHub issue body, and of a Notion page.
4. In GitHub and Notion the line may add the web address of the file on the default branch, so the owner can open it with one click. The ID is the pointer; the address is a convenience.
5. The source's row in `sources/README.md` lists the items that used it (`WI-31`, `#12`). So the link can be followed in both directions, and an original that several items use is stored once.

What changes in the skills:

- GitHub: the `## Source:` comments stop (TWG/ref/issue-layout.md:146-170). The rule "Never copy it into the repository" (line 175) is removed; it is the opposite of the new layout.
- Notion: nothing is uploaded to the Files property (TWN/ref/database-layout.md:274-296). The property stays, because a listed property may not be removed (line 3). The step that downloads a source from Notion (TWN/ref/searching.md:97-111) goes.
- Local: the item's `references/` folder goes (TWL/ref/folders-and-files.md:88-92).
- Salesforce: client files go to `sources/`, not `delivery/` (D-10).

Three points the owner must settle before this is built. None of them could be determined from the files:

1. **File types.** `publish-docs` accepts ten file types and refuses spreadsheets and `.json` (PD/SKILL.md:18-21, 122-123). A Word document is not on its list. An original can be any type. Either the list is widened for `sources/` only, or such a file gets a row that says "kept outside Git" with where it is.
2. **Size and privacy.** An original committed to Git stays in the history. A large recording, or a client file with personal data, may not belong there. The row form above allows "kept outside Git: <where>, <size>" for those.
3. **Old sources.** Items that already hold sources in a `references/` folder, an issue comment, the Files property, or `delivery/` need a one-time move. That is a job for the setup skill's update steps.

## 11. Out of scope

Skills and sections with no instruction about maintaining project files and folders.

| Skill or section | What it holds | Why it is out of scope |
| --- | --- | --- |
| `pull-latest` (97 lines) | Fetching and merging from the remote | Git steps only |
| `reset-to-remote` (121 lines), except line 104 (B-154) | Resetting to the remote | Git steps only |
| `merge-and-clean-up` (204 lines), except lines 27, 103, 166-171 (B-100, B-153) | Merging a pull request and removing its branch | Git steps only |
| `explain-simply` (75 lines) | Explaining an answer again | It writes nothing |
| `braindump` (45 lines), except lines 37-38, 45 (B-152) | Playing back a brain dump | It writes nothing |
| `session-summary` (97 lines), except lines 17-19, 24-30 (B-151) | The recap table | It writes nothing |
| `publish-docs`, steps 2 to 8, and `references/recovery.md` except lines 54-57 | Worktree, staging, commit, push, and recovery commands | Git steps; the file rules are B-145 to B-150 |
| `using-notion-cli` (212 lines in 2 files) | Sign-in, Codex, call shapes, errors | How to call Notion, not what to file |
| TWG/ref/gh-commands.md (180 lines) | Sign-in, Codex, `gh` call shapes, errors, limits | How to call GitHub |
| The search files: TWL/ref/searching.md, TWG/ref/searching.md, TWN/ref/searching.md, SML/ref/searching.md, SMN/ref/searching.md | Read-only commands | They only read. The parts that are checks are B-157 and B-187 |
| MWI/ref/building.md: "Who builds", "The team arrangement", "Git writes in Codex", "Resume in a new session" (lines 25-68, 108-114, 152-161), beyond B-081 to B-086 | Team set-up and Git | How work is done, not how records are kept |
| The six helper briefs in MWI/ref/ and HO/ref/handoff-verifier.md, beyond B-082, B-112, B-113 | What each helper agent checks and returns | Helpers change no record |
| MWI/ref/testing-loop.md, "Showing the result" (lines 22-31) | The order of the reply | Chat wording |
| MPM/ref/saving.md, "Reply lines" (lines 100-113) | Set reply lines | Chat wording (B-218) |
| The 43 Notion schema files | The request bodies that create databases, relations, and views | They are data. They appear as templates in B-193 and B-236. One field description files sources (B-190) |
| SMN/ref/views-and-layout.md, lines 20-36 | Column order and page layout in the Notion app | Display only |
| The three `sf-*` skills | Salesforce deploy records, checks, and data changes | The brief gives them to the skill map only (sections 8.1 to 8.4) |

## 12. Addendum: the owner's decisions after this report was written

The owner set one goal for this work: every Toolkit V2 project gets one clear folder layout and one set of skills in which each fact and each job has exactly one home, in files he can read and edit himself. He then made two decisions and raised one question. This section applies them. **Where it differs from sections 8.3, 8.4, 8.5, and 10, this section wins.** Sections 1 to 7, 8.1, 8.2, 8.6, 9, and 11 stand, with one reading rule: wherever they say `filing-project-records`, read `running-work-item-lifecycle`.

### 12.1 The skill names, old and new

| Old name | New name | What happens to it |
| --- | --- | --- |
| `managing-work-items` | `running-work-item-lifecycle` | Kept and renamed. It gains four reference files (12.2) |
| `tracking-work-items` (local, GitHub, Notion) | `using-work-tracker` | Kept and renamed. It stops storing originals |
| `managing-project-memory` | `curating-project-memory` | Kept and renamed. Cut down to pointers, Current State, and the owner's standing instructions |
| `storing-project-memory` (local, Notion) | `using-memory-store` | Kept and renamed. Cut down to Current State and pointer lines |
| `managing-project-wide-records` | (none) | **Removed**, with all five of its record kinds. Section 8.3 proposed renaming it to `filing-project-records`; that proposal is withdrawn |
| `using-notion-cli`, `handoff`, `publish-docs`, `session-summary`, `braindump`, `explain-simply`, `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `sf-component-tracker`, `sf-deploy-check`, `sf-data-change` | The same names | As section 8.3 says |

What the four renames touch, counted in the clean copy: the old name `managing-work-items` is in 25 skill files, `tracking-work-items` in 27, `managing-project-memory` in 12, and `storing-project-memory` in 8. All three hook commands name an old skill (`session-start.mjs`:10, 34, 40, 67; `prompt-reminder.mjs`:37, 41, 54; `codex-after-commit.mjs`:10). The starter project names each old name in one to three files (counted). Each rename also changes `dev/SKILL-INDEX.md` and every description that says "use managing-work-items", and the routing test runs again in both hosts. A project that already has the toolkit keeps its old skill folders until "update the toolkit" removes them.

### 12.2 Who owns the three filing events now

With `managing-project-wide-records` removed, the question from section 8.3 is asked again: does an existing skill own each event?

| Event | The existing owner that remains | Verdict | Reason in one sentence |
| --- | --- | --- | --- |
| A decision is made (`record-decision`) | `managing-work-items`: MWI/ref/refining-requirements.md:43-54 saves every answer and applies the "does a later item need this?" test; the starter `AGENTS.md`:174 and `prompt-reminder.mjs`:36-37 already send "we decided" to this skill | A step inside `running-work-item-lifecycle`: `references/record-decision.md` | The skill that saves the answer applies the filing test and writes the entry in the same step, so nothing is handed to a second skill. |
| An original arrives (`file-source`) | `managing-work-items`: MWI/ref/refining-requirements.md:87-95; `prompt-reminder.mjs`:40-42 already calls a pasted transcript "source material for managing-work-items" | A step inside `running-work-item-lifecycle`: `references/file-source.md` | The same skill turns the source into requirements and questions, and `sources/` no longer depends on the tracker. |
| An approved system fact changes (`update-system-doc`) | `managing-work-items`: MWI/ref/reflecting.md:18-26 | A step inside `running-work-item-lifecycle`: `references/update-system-doc.md`, called from `references/closing.md` | The change happens at close, inside the skill that asks the closing question, so the most important hand-off disappears. |
| A work item closes (`close-work-item`) | `managing-work-items` (unchanged from 8.3) | A step inside `running-work-item-lifecycle`: `references/closing.md` | Unchanged. |

So: **no new skill, one skill removed, four renamed.** `curating-project-memory` cannot own these events, because a project with Hindsight memory has no memory skills, and `DECISIONS.md`, `sources/`, and `system/` are in every project. `running-work-item-lifecycle` is in every project.

Two costs of this choice, stated plainly:

1. The skill grows. Today it has 16 files and 1,284 lines (counted). It gains three references and about twelve templates (section 9, every row that names `filing-project-records`), and loses the memory offers, the shared-record steps, and the source rules.
2. Its name says "work item lifecycle", and two of its events can happen with no item open: a decision that belongs to no item, and an original that arrives before any item exists. The root `AGENTS.md` filing table must name this skill for both. If the routing test in either host shows the skill is not picked for "we decided" or "here is the transcript", split the three filing references out into one new skill. That would bring the count back to today's.

A draft description for `running-work-item-lifecycle` (454 characters; the limit is 500):

> Runs a work item from idea to Done through requirements, design, build, testing, and closing, keeping its tracker current and asking for the owner's approval at each gate. Also files what outlasts the item: a decision other work must follow in DECISIONS.md, an original in sources/, and an approved change in system/. Use when the owner asks to plan, change, build, test, ship, or close an item, decides something, or hands over a transcript or document.

**Changes to the event table in 8.4.** Three rows change owner: "a decision that more than one item needs", "an original arrives", and "an approved system fact changes" are owned by `running-work-item-lifecycle`, in the three reference files above. Every other row keeps its owner under the new name. The check still finds exactly one owner per event: `curating-project-memory` hears "remember this", applies the filing table, and hands a decision or a system fact to `running-work-item-lifecycle`; it never writes `DECISIONS.md` or `system/` itself. `handoff` does the same for a decision nobody filed.

**The count, replacing 8.5.**

| Project setup | Skills today | Skills proposed | Descriptions every chat reads (with `project-setup` and `choosing-outside-tools`) |
| --- | --- | --- | --- |
| Local or GitHub work items, with local memory | 13 | 12 | 15 today, 14 proposed |
| Work items or memory in Notion | 14 | 13 | 16 today, 15 proposed |
| Hindsight memory, local or GitHub work items | 11 | 10 | 13 today, 12 proposed |
| Hindsight memory, Notion work items | 12 | 11 | 14 today, 13 proposed |
| Any of the above with Salesforce | 3 more | 3 more | 3 more |

### 12.3 The owner's question: in a Notion project, should decisions and sources be Notion databases?

His words: "what is the point of having Notion track work that just references local files?"

**What exists today.** The Notion memory layout has no separate decisions database. A decision is a page of the Memories database with Kind "decision", shown by a view named "Decisions" (SMN/ref/views-and-layout.md:16; SMN/as/schema/11-view-decisions.json; SMN/ref/database-layout.md:57, 76). Those pages are Lore's, so their status options are Lore's (proposed, accepted, superseded, deprecated, rejected), and the toolkit may add options but never rename or remove one (SMN/SKILL.md:30). Sources in Notion today are files uploaded to a work item's Files property, limited to 20 MB, with a download address that lasts one hour (TWN/ref/database-layout.md:276; TWN/ref/searching.md:105).

**The options.**

| Option | What it means | For | Against |
| --- | --- | --- | --- |
| A. Files in every project | `DECISIONS.md` and `sources/` are in the repository. The Notion item holds the ID and a link the owner can click | One home, the same in every project. The `system/` documents cite decisions by ID, and a check can test those links without the network. A decision and the `system/` change it causes land in one commit. Helper agents can read them; the handoff checker "cannot read Notion" (HO/ref/handoff-verifier.md:16) | The owner opens a file, not a Notion page, to read a decision |
| B. Notion is the home in a Notion project | Decisions are rows of a database (the Memories pages with Kind "decision", or a new database). Originals are uploaded to Notion | Everything the owner reads is in one app. Decisions can be related to work items and shown on boards | Two layouts and two versions of each filing step, one for files and one for Notion. No check can reach them, so "Last changed via DEC-###" in a `system/` document can never be tested. The decision and the document change live in two systems. Lore's status words do not match Open, Decided, Superseded. Uploads have the size and time limits above. Memory would hold decisions again, which the new layout rules out |
| C. Files are the home, and Notion keeps a row per decision or source | A Notion database holds one row per ID with its title and a link, related to work items | The owner can browse and filter in Notion | The title and status would be written twice and must be kept the same by hand. That is a second home for one fact |
| D. Split: one in Notion, one in files | For example decisions in Notion and originals in files | Little | The costs of B for whichever part moves |

**Recommendation: option A, files in every project.** The reason: his goal is one home for each fact, in files he can read and edit himself, and A is the only option where the decision, the original, and the `system/` document that depends on them sit in one place that Git records and a check can test.

The answer to his question: Notion is worth having for what changes every day and what he looks at on a board. That is each item's State, what waits on him, the phases, and the tasks. A Notion item already points at files today: the code, the branch, the pull request, and the test plan, which "never" goes in the tracker (MWI/ref/testing-loop.md:12). The new layout names the same split: work items are temporary work, and the repository holds what lasts.

What he sees in Notion under option A: on each item page, the Sources lines and the "Moved up" line, each with an ID and a link that opens the file on GitHub. If he later finds he wants to browse decisions inside Notion, add option C's rows then, holding only the ID and the link, never the title or the status.

Two things follow from option A in a Notion project:

- The "Decisions" view of the Memories database, and the decision pages, are no longer written (B-236, B-227). Whether Notion memory keeps Lore's five databases at all is still open ("Could not determine", point 5).
- The Files property on a work item stays, because a listed property is never removed, and holds no originals (B-190).
