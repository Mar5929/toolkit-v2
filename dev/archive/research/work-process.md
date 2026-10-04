# Research brief: the work-item process Toolkit V2 must preserve

Researcher brief for the Toolkit V2 architect and builders. Written 2026-09-26.
Read-only research. Nothing in `claude-toolkit` or the model project was changed.

This brief stands alone. Every claim names its source file. Where a point is
my inference or proposal, not a fact from a source, it says "Inferred" or
"Proposal".

---

## 0. The short version

- The current process has **fourteen lifecycle stages** (`01-discovery` to
  `14-spec-update`), **six item statuses** (`Backlog`, `Ready`,
  `In Progress`, `In Review`, `Done`, `Cancelled`), and a fixed rule that maps
  each known stage to a status. Stages are flexible: skip, repeat, go back.
- **Owner approval gates:** requirements approval (stage `03`), the hard
  `build` / `data-load` gate (no implementation before approved requirements),
  design approval, task approval when a task is flagged, and `Done` (only after
  the owner approves the result). Also the one-time **agent-led delivery offer**
  and the **team-arrangement question**, both with exact wording.
- Each item has an **owner-shaped roadmap** (phases), **detailed tasks** under
  each phase, and optional **child work items** that can fulfil a phase. Roadmap
  phases are separate from the fourteen lifecycle stages.
- The local tracker is one dependency-free **Node.js CLI** (`work.mjs`, about
  5,000 lines across 4 files) with 21 commands (plus `help` and `version`), a strict Markdown parser,
  validation, a generated `DASHBOARD.md`, and **78 passing tests**
  (`node --test`, run 2026-09-26).
- The **model project's `WORK-ITEM.md` (approved by Mike) is a different file
  format** from what the current parser reads: YAML frontmatter, seven H2
  sections, `P1` / `P1-T01` / `R-01` / `Q-01` IDs, tables and bold labels.
  The current parser needs a format marker, five H1 sections, `STAGE-001` /
  `TASK-001` blocks and `- Label: value` lines. V2 needs a new parser.
- **Conflicts to settle:** the model's status hint lists
  `Backlog | In Progress | Blocked | Done` (four values, `Blocked` included)
  while the lifecycle derives `Ready` and `In Review` from stages and has
  `Cancelled`; the model says external designs live "in the item's own record
  or attachments" and "never create `docs/designs/`", while the current
  toolkit puts external designs in `docs/designs/<id>-<slug>.md`.
- **Sub-items today:** folder nesting is organization only; the parent/child
  link is a separate, bidirectional relationship field. A folder move inside
  `.work-items/` is picked up automatically, but a rename that drops the ID
  prefix, or a renamed `WORK-ITEM.md`, makes the item silently disappear
  (tested; section 15).

---

## 1. Sources read

claude-toolkit (read-only):

- `plugins/work-tracker/README.md`
- `plugins/work-tracker/.claude-plugin/plugin.json`, `.codex-plugin/plugin.json` (version `2.10.2`)
- `plugins/work-tracker/skills/work/SKILL.md`
- `plugins/work-tracker/skills/work/agents/openai.yaml`
- `plugins/work-tracker/skills/work/references/lifecycle.md`
- `plugins/work-tracker/skills/work/references/record-format.md`
- `plugins/work-tracker/skills/work/references/command-reference.md`
- `plugins/work-tracker/skills/work/references/agent-led-delivery.md`
- `plugins/work-tracker/skills/work/references/team-arrangements.md`
- `plugins/work-tracker/skills/work/scripts/work.mjs` (504 lines)
- `plugins/work-tracker/skills/work/scripts/lib/tracker.mjs` (3,468 lines)
- `plugins/work-tracker/skills/work/scripts/lib/work-item-document.mjs` (458 lines)
- `plugins/work-tracker/skills/work/scripts/lib/common.mjs` (566 lines)
- `plugins/work-tracker/tests/work-tracker.test.mjs`, `consolidated-record.test.mjs`, `delivery-scenarios.md`
- `plugins/project-init/skills/work-item-lifecycle/SKILL.md`
- `plugins/project-init/skills/project-init/SKILL.md` (Gate 1, Gate 6), `references/work-tracking-choice.md`, `references/work-items-structure.md`
- `plugins/project-init/library/rules/general/work-item-stages.md`, `work-item-folders.md`, `README.md`
- `plugins/session-skills/skills/work-guide/SKILL.md`, `track-tasks/SKILL.md`, `handoff/SKILL.md`, `requirements-helper/SKILL.md`, `solution-design/SKILL.md` (+ `references/design-document-template.md`)
- `plugins/protocol-guard/README.md`, `protocols.default.json`, `hooks/shell-reader.mjs`
- `.claude/rules/work-item-stages.md` (identical to the shipped library copy)
- `knowledge/prds/toolkit-operating-system/work-item-upkeep.md`, `guided-work-management.md`
- `docs/toolkit-map.md`, root `AGENTS.md` ("Where work is tracked")
- `ai-external-knowledge/claude-code/hooks.md` (event list, `FileChanged`)

Model project (read-only):

- `.work-items/work-item-template/WORK-ITEM.md`, `.work-items/work-item-template/DESIGN.md`
- `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`, `README.md`, `docs/AGENTS.md`, `docs/toolkit-manual.md`, `requirements/AGENTS.md`
- `.claude/rules/work-item-stages.md`, `.claude/RULES.md`, `.claude/settings.json`, `.claude/hooks/toolkit-session-start.mjs`, `.codex/hooks.json`, `.gitignore`

Model context notes: `toolkit-v2-model-context/TEMPLATE-SOURCE-REVIEW.md` and
`codex-second-brain-v2-handoff/toolkit-installed-project-file-map.md`.

Key context fact from `TEMPLATE-SOURCE-REVIEW.md` (row for the template folder):
"Mike finalized the folder. WORK-ITEM.md uses his approved human-readable
target, which the current tracker must learn to support; DESIGN.md follows the
live solution-design template."

I also ran the current CLI in a throwaway Git repository in the scratchpad (not
in any project) to capture real output and to test moves and renames.

---

## 2. Who owns what today

| Piece | File | What it owns |
| --- | --- | --- |
| Always-loaded rule (6 bullets) | `.claude/rules/work-item-stages.md` (shipped from `project-init/library/rules/general/`) | Open the `work` skill before substantial work; save owner decisions; `build`/`data-load` gate; ask team arrangement after acceptance; Done only with owner approval; record exact next step before stopping |
| Local folder rule | `project-init/library/rules/general/work-item-folders.md` | Only when local tracking is chosen: grouping folders, archive, file protection, "use `work add` so parallel sessions cannot choose the same ID" |
| `work` skill (work-tracker plugin) | `skills/work/SKILL.md` + `references/` | Tracker detection, delivery offer, capture, approval gate, CLI use, stages, handoff, finish. `references/lifecycle.md` is the full tracker-neutral policy |
| `work-guide` skill (session-skills) | `skills/work-guide/SKILL.md` | Main-conversation planning method: roadmap and tasks, document Notes, helpers, parallel items |
| `work-item-lifecycle` skill (project-init) | `skills/work-item-lifecycle/SKILL.md` | Where files go: one lasting home per kind of information; design routing; closing checklist |
| `track-tasks` skill (session-skills) | `skills/track-tasks/SKILL.md` | Session-only open-topic list on Claude Code's built-in `TaskCreate`/`TaskUpdate`/`TaskList`. Explicitly **not** a work tracker |
| `handoff` skill (session-skills) | `skills/handoff/SKILL.md` | Step 1 updates the active work item before the memory save review |
| `requirements-helper`, `solution-design`, `spec-check` (session-skills) | their `SKILL.md` | Requirements interview; design from approved requirements (stage `04`); spec check |
| protocol-guard (Claude Code function hooks only) | `plugins/protocol-guard/` | P2: refuse `work finish` / `gh issue close` until the `work` skill was opened this turn. K7: refuse PR create, close, merge, `work finish` until `knowledge-save` opened this turn. CW: hold the final reply once after a work-item change until working memory is written |
| project-init Gate 1 | `references/work-tracking-choice.md`, `work-items-structure.md` | The tracker question and GitHub board setup |

Overlap worth knowing for the V2 skill index (Inferred): `work`, `work-guide`,
`work-item-lifecycle`, and `handoff` step 1 all describe parts of the same
process, and `track-tasks` shares vocabulary ("tasks") with the work item's
Tasks section. `docs/toolkit-map.md` spends a paragraph explaining that
`track-tasks`, `session-summary`, and the tracker are "three views of what is
outstanding, at three different lifespans".

---

## 3. The fourteen lifecycle stages (exact)

Source: `skills/work/references/lifecycle.md` section "Stages"; the same list is
the `STAGES` constant in `scripts/lib/tracker.mjs` and the help text of
`work.mjs`.

| Stage | What it covers (exact text) | Active status |
| --- | --- | --- |
| `01-discovery` | Working out what the owner wants. | Backlog |
| `02-refinement` | Turning that into requirements. | Backlog |
| `03-requirements-approved` | The owner approved the requirements. | Ready |
| `04-solution-design` | Deciding how it gets built. | In Progress |
| `05-breakdown` | Splitting work that is too large. | In Progress |
| `06-implementation-plan` | Ordering the build steps. | In Progress |
| `07-tracking-setup` | Creating build tracking when needed. | In Progress |
| `08-build` | Producing the requested change. | In Progress |
| `09-testing` | Checking it against the requirements. | In Progress |
| `10-bug-fixing` | Fixing what testing found. | In Progress |
| `11-user-approval` | The owner reviews the result. | In Progress |
| `12-pr-and-push` | Repository work is in a pushed pull request. | In Review |
| `13-deployment` | The result is put where it belongs. | In Review |
| `14-spec-update` | Lasting specifications match the result. | In Review |

Rules (lifecycle.md, exact meaning):

- "An item may carry one current stage." An external tracker "can keep its own
  terms: map the meaning, and keep its native fields."
- "Use the stage the work is actually in. Skip, repeat, or revisit stages when
  that fits." "Record one short reason when a move is not obvious."
- "Pull-request stages apply only to repository work."
- "A legacy item with no stage is valid. Never backfill history."
- "`Done` and `Cancelled` are set only by an intentional completion or
  cancellation, never by a stage."
- "Preserve and report an unknown stage. Do not change it silently."
- "Approval survives later stages. A later stage shows position and does not
  revoke recorded approval. A stage label alone does not establish approval:
  check the approval record when resuming."

Code behavior (`tracker.mjs`):

- `normalizeStage(value)` accepts a number (`8`, `08`), a bare name (`build`),
  or the full name (`08-build`). Anything unrecognized "is stored exactly as it
  was typed". The code comment says: "no code refuses a stage, a skip, or a move
  backwards."
- `statusForStage(stage)`: `01`-`02` -> `Backlog`, `03` -> `Ready`, `04`-`11`
  -> `In Progress`, `12`-`14` -> `In Review`, unknown -> `null` (status left
  alone).
- `work update ID --stage X` writes the stage and the derived status in one call.
  A conflicting `--status` is refused with `stage_status_mismatch`.
- `work requirements ID --finalize` sets stage `03-requirements-approved` only
  when the item already has a known stage and becomes `Ready`.
  `--reopen` sets `02-refinement` only when a known stage exists.
- `work start ID` (requires status `Ready`): if a known stage does not already
  map to `In Progress`, it sets `08-build` for `build`/`data-load`,
  `04-solution-design` for `solution-design`, and clears the stage (`null`) for
  every other type ("stage not set until its real phase is known").
- `validate` errors when a known stage and a non-terminal status disagree, and
  warns (does not error) on an unknown stage.
- New items start with `stage: null`. An item with no stage is normal.

Where each stage is described as mapping to other artifacts (Inferred from the
sources, not stated as a table anywhere):

| Stage | Main artifact | Skill that usually drives it |
| --- | --- | --- |
| 01, 02 | `WORK-ITEM.md` Requirements (model: Starting request, Agreed goal, R-xx) | `requirements-helper`, `grill-me`, `spec-check` |
| 03 | Requirements approval record | `work` (finalize) |
| 04 | `DESIGN.md` | `solution-design` (its text: "Ordinarily the lifecycle stage is `04-solution-design`") |
| 05 | Child work items | `work-guide` |
| 06 | Roadmap and Tasks; DESIGN.md "Order of work" | `work-guide` |
| 07 | Tracking setup (child items, sub-issues, component trackers) | `work` |
| 08-10 | Code or configuration | builder agents |
| 11 | Owner review of the result | main agent |
| 12 | Pull request | `merge-and-clean-up` (merge) |
| 13 | Deployment | project-specific (Salesforce: `sf-deploy-check`) |
| 14 | Area baseline `requirements/<area>.md` (model) | closeout, see section 13 |

---

## 4. Item statuses and transitions

Source: `STATUSES` in `tracker.mjs`; lifecycle.md; command-reference.md.

`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`, `Cancelled`.

| Status | Meaning (sources) | How it is entered (code) |
| --- | --- | --- |
| `Backlog` | Logged, requirements still refining | `work add` always creates `Backlog` + requirements `refining`. `requirements --reopen` returns here. Stage `01`/`02` derives it |
| `Ready` | Requirements approved; can start | `requirements --finalize` moves `Backlog` -> `Ready`. Stage `03` derives it. `update --status Ready` (blocked for `build`/`data-load` without finalized requirements) |
| `In Progress` | "means the item is active. It does not mean implementation started." (lifecycle.md) | `work start` (from `Ready` only). Stages `04`-`11` |
| `In Review` | Result in review, PR, deployment, spec update | Stages `12`-`14`, or `update --status "In Review"` |
| `Done` | "the outcome was accepted" | Only `work finish` (with evidence). `update --status Done` is refused with `finish_required` |
| `Cancelled` | "work stopped without it" | `update --status Cancelled`. Clears every branch mapping. Emits no event |

Other status facts:

- `work next` never recommends a `Backlog` item. It ranks non-archived,
  unblocked `Ready`, `In Progress`, `In Review` items by status
  (`In Progress` 0, `In Review` 1, `Ready` 2), then priority (`urgent`,
  `high`, `medium`, `low`), then `created_date`, then ID.
- "Blocked" is **not** a status. It is derived: an item is blocked when its
  `blockers` list is non-empty or any `depends_on` item is not `Done`.
- Requirements have their own two-value status: `refining` or `finalized`.
- Tasks have their own five-value status: `Pending`, `In Progress`,
  `Blocked`, `Complete`, `Cancelled`.

GitHub board statuses are different (project-init `work-tracking-choice.md`,
step 7, "Type them exactly as written"): `Backlog`, `Refining`, `Ready`,
`In progress`, `In review`, `Done`, `Cancelled`. `Refining` exists only on the
board. Note the lower-case second words.

The model template's status hint is `<Backlog | In Progress | Blocked | Done>`.
See section 18.

---

## 5. Stage entry and exit conditions

No source defines formal entry and exit conditions per stage. The sources give
meanings (section 3), a few automatic transitions, and approval rules. The
table below separates what the sources state from what I infer.

| Stage | Entry (stated or code) | Exit evidence (Inferred unless marked) | Owner approval needed? |
| --- | --- | --- | --- |
| `01-discovery` | Judgment | Owner's want is written as a Starting request | No |
| `02-refinement` | Judgment; code sets it on `requirements --reopen` | Requirements written; Agreed goal stated; open questions answered or parked | No (but it ends in one) |
| `03-requirements-approved` | Code sets it on `--finalize` (needs `approved_by`) | Stated: "`03-requirements-approved` records the owner's approval" | **Yes: requirements approval** |
| `04-solution-design` | Code sets it on `start` for `solution-design` type | Stated (solution-design skill): design "is not approved until the owner says so. Record approval in the tracker when it comes." | **Yes: design approval** |
| `05-breakdown` | Judgment | Child items created and linked | No (creating child items is agent work under delivery acceptance) |
| `06-implementation-plan` | Judgment | Roadmap phases and tasks exist for the build | No |
| `07-tracking-setup` | Judgment ("when needed") | Build tracking exists | No |
| `08-build` | Code sets it on `start` for `build`/`data-load`; **hard gate**: requirements must be finalized | Change produced | Gate: requirements approval already recorded |
| `09-testing` | Judgment | Checked "against the requirements" | No |
| `10-bug-fixing` | Judgment | Test findings fixed | No |
| `11-user-approval` | Judgment | Owner reviewed the result | **Yes: owner reviews the result** |
| `12-pr-and-push` | Judgment; "Pull-request stages apply only to repository work" | PR pushed; merge follows the project's merge rule | Merge needs owner approval or a standing merge instruction (claude-toolkit rule `standing-merge-instruction.md`) |
| `13-deployment` | Judgment | Result put where it belongs | Stated: delegation "does not grant build, deployment, merge, spending ... authority beyond what was given" |
| `14-spec-update` | Judgment | "Lasting specifications match the result" (model: `requirements/<area>.md` updated) | Depends on the project's knowledge/doc approval rules |
| `Done` | Only `work finish` | Evidence recorded | **Yes: "Never mark `Done` without approval."** |

---

## 6. Every owner decision and approval point

From lifecycle.md, SKILL.md, agent-led-delivery.md, team-arrangements.md,
work-guide, solution-design, work-item-folders.md, project-init:

1. **Requirements approval.** "Show the result before running
   `requirements ID --finalize --approved-by NAME`." "Never finalize while the
   Requirements `Goal` still reads `_Not agreed yet._`." (This check is in the
   skill text only; decision D15 in `guided-work-management.md`: "no code check
   is added". I confirmed the CLI finalizes an item whose Goal still reads
   `_Not agreed yet._`.)
2. **Build / data-load gate.** "`build` and `data-load` need approved
   requirements before that work starts." Enforced in code (section 7).
3. **Other types.** "judge the approval needed from real risk and scope. Do not
   add ceremony to small maintenance. Do not use a broad type to avoid approval
   for implementation."
4. **Design approval.** Solution-design: "Save the design at the agreed path,
   marked proposed. It is not approved until the owner says so."
5. **Task approval.** A task created with `--approval-required` cannot be
   completed without `--approved-by` (code, `approval_required`).
6. **Owner reviews the result** (stage `11-user-approval`).
7. **Done.** "Before marking `Done`, give the owner a short result, known gaps,
   and evidence. Ask for approval. A clear earlier approval of that result
   counts."
8. **Agent-led delivery offer** (once per goal; section 8).
9. **Team arrangement** (after acceptance; section 8). "Choosing an arrangement
   authorizes bounded helpers for that goal only."
10. **Archive-chats question** (only after the Main Orchestrator choice).
11. **Folder moves and archiving.** "Never move items, invent a group, or
    archive work without the owner's request." "State how many nested items will
    move before archiving a folder."
12. **Merge, deployment, spending, publication.** Never implied by delegation.
13. **Tracker setup.** GitHub board: "Nothing gets created on GitHub before that
    yes: no board, no statuses, no labels, no issues." Old-tracker migration:
    preview first, `--apply` only after approval, removal of the old tracker is a
    separate approval.

Rule on capture (lifecycle.md): "A question, suggestion, or tentative answer is
not approval." "A saved draft is not approval to build."

---

## 7. Work types and the approval gate

Types (SKILL.md, lifecycle.md, `TYPES` in code): `discovery`,
`solution-design`, `build`, `data-load`, `repository-maintenance`,
`research`, `task`. Legacy `bug` and `enhancement` stay valid. Any other
"clear" lower-case kebab-case type is valid. Code check:
`/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/`. Default on `add` is `task`.

The hard gate in code (`typeNeedsRequirements(type)` returns true only for
`build` and `data-load`):

- `start` refuses unless requirements are `finalized`
  (`requirements_not_finalized`).
- `update --status Ready|In Progress|In Review` refuses for those types.
- `update --stage X` refuses when the derived status is `Ready`,
  `In Progress`, or `In Review`.
- `update --type build` combined with an active stage applies the new type's
  gate.
- `finish` refuses for those types without finalized requirements.
- `validate` errors: "status X requires finalized requirements".

Finalized requirements need `finalized_date` and `approved_by` (validation).
Code does **not** check requirement length or headings (code comment: "What
makes them real is `approved_by`").

Requirements content rule (record-format.md): "This file contains no
implementation plan, file path choices, tool or version choices, or
unapproved agent assumptions." A chore may keep "the one line the owner asked
for".

---

## 8. Agent-led delivery offer and team arrangement (exact wording)

Source: `references/agent-led-delivery.md`, `references/team-arrangements.md`,
lifecycle.md.

- Read the goal's recorded choice first. "A simple question or quick edit gets
  no offer." With no recorded choice, ask exactly:

  > Would you like agents to take responsibility for delivering this, with you acting as product owner?

- Acceptance applies to that goal across sessions. Decline: normal help
  continues; do not offer again for that goal "unless it grows substantially or
  the owner asks". Revoke: recorded, then treated like a decline. "Missing
  access is not a missing decision."
- After acceptance, ask, in substance:

  > Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?

  Offer the multi-chat choice only where the host lets this chat list, read,
  and message other chats ("Today that is the Claude Code desktop app"). On any
  other host ask:

  > Shall I run one team of helpers inside this chat?

  A no means the main agent does the work itself and authorizes no helpers.
- After the Main Orchestrator choice, ask:

  > Do you want me to archive sessions after their task is fully complete, everything is merged and shipped, and you approved?

  Archive only when all four hold: task complete; merged and shipped; report
  saved to a file; owner approved. "Archive only. Never delete a chat."
- **Where the choice is recorded:** local: Overview `Context and notes` in
  `WORK-ITEM.md` (via `work edit`); external: item description or native
  fields. Record: choice, goal scope, source, person, date, authority limits,
  coordinating session, next-action references, team arrangement, archive
  answer. "Reread after saving. A failed write is `not saved`. A successful
  write with a failed readback is `saved but not verified`."
- Authority: agents drive "discovery, interviews, requirements, research,
  design, authorized build, checks, and delivery". The owner "supplies product
  direction, resolves meaningful tradeoffs, and approves results".
- Team roles (team-arrangements.md): the lead plans, briefs, judges, verifies,
  keeps the work item current, reports; helpers do the token-heavy work; "One
  writer per path at a time. A reviewer never edits what it reviews." "Live
  status, meaning chat ids, chat states, and next actions, belongs in the work
  item, not in a plan or design file."
- "Helpers may do delegated work. Only the main agent updates or completes the
  canonical item." (lifecycle.md, Orient)

In the model template, the natural home for the delivery choice is
`## Notes` > `### Decisions and context` (Inferred).

---

## 9. Plan structure: project roadmap, item roadmap, tasks, children

### 9.1 Project level (model project only)

`PROJECT-ROADMAP.md` in the model:

```text
PROJECT-ROADMAP.md
└── Phase
    └── Deliverable-sized work unit
        └── Linked work item
```

- Phase IDs `P01`, units `P01-U01` (two-digit). Phase fields: Outcome, Exit
  condition, Dependencies. Unit fields: Deliverable, Done when, Depends on,
  Linked work item.
- "The linked work item owns its active requirements, open questions, detailed
  tasks, approvals, and execution history. Summarize only project-level
  sequencing here."
- Model `AGENTS.md` Startup: "Before substantial work, open the chosen item, the
  `work` skill, and the relevant `PROJECT-ROADMAP.md` phase."

The current toolkit has no project-level roadmap file.

### 9.2 Item level (current toolkit)

lifecycle.md "Plan":

- "Keep an ordered roadmap from the current position to the outcome. Name its
  stages to fit the work. They need not match the stage table."
- "Each applicable roadmap stage has one or more tasks, linked child items, or
  both."
- Each task records: "objective; instructions and constraints; linked
  requirements, design, decisions, and inputs; deliverable; acceptance
  condition; status; dependencies; current position; next action."
- "Link canonical sources. Do not copy them. Keep detail proportionate."
- "A child item keeps its own requirements, design, roadmap, tasks, status, and
  approvals. ... Folder nesting alone is not that relationship."
- "Completing a task or a child does not complete or approve its parent."
- "Legacy work without these details stays valid. On resume, reconcile missing
  detail from accepted evidence. Never invent tasks, history, or approval."

Code fields (`tracker.mjs`):

- Roadmap stage: `id` (`STAGE-001`), `title`, `outcome`,
  `acceptance_condition`, `lifecycle_stage` (optional link to one of the 14, or
  null), `child_work_items` (array of IDs), `planning_status` (`planned` or
  `draft`).
- A `planned` stage must have at least one task or one child
  (`empty_roadmap_stage`). A `draft` stage may be empty; validation warns.
- A child listed on a stage must already have the bidirectional
  `parent`/`children` link (`missing_child_relationship`).
- Task: `id` (`TASK-001`), `roadmap_stage`, `title`, `objective`,
  `instructions`, `constraints[]`, `inputs[]`, `deliverable`,
  `acceptance_condition`, `status`, `dependencies[]` (tasks in the same item;
  no cycles), `current_position` (default `Not started.`), `next_action`,
  `approval_required` (bool), `completion` (`evidence`, `completed_date`,
  `approved_by`, `approved_date`), `created_date`, `updated_date`.
- Task rules: `task complete` needs evidence; checks dependencies are
  `Complete`; sets position `Completed.` and next action `None.`; never changes
  the parent. A `Complete` or `Cancelled` task cannot be updated
  ("revise the roadmap with a new task instead"). Stage/task blocks cannot be
  deleted ("cancel them instead").
- The branch's **current task** lives in `ACTIVE.json` (`task_id`).
  `work active --json` returns the full task record so a fresh session can
  resume.

Terminology collision (Inferred, worth fixing in V2): the code calls roadmap
entries "stages" (`STAGE-001`) while the lifecycle also has "stages"
(`01`-`14`). The visible label for a task's roadmap link is already
"Roadmap phase". The model uses **Phase** for roadmap entries and **stage** for
the lifecycle. Recommend V2 use "phase" and "stage" that way everywhere.

---

## 10. Capture table and progress conventions

### 10.1 Capture table (exact, lifecycle.md "Capture during the conversation")

"Save meaningful information in its existing home before moving past the topic.
An unanswered question is information to save. Open decisions do not delay
saving settled answers."

| Information | Home | What to record |
| --- | --- | --- |
| Requirement or correction | Requirements document or designated workbook | Updated meaning and approval state |
| Design choice | Working design | Approach, approved or proposed, and decision context |
| Open question | Requirements or design Notes; otherwise the item's notes | Question, who must answer (or unknown), open status, what it affects |
| Answer or decision | The existing question and affected document; otherwise the item | Answer, person, source and date when known, approval state |
| Outstanding task | Document Notes for document work; otherwise the item's tasks | Action, responsible person when known, status, next step, blocker |
| Useful general note | Document Notes; otherwise the item's notes | Only the context needed to continue |

Plus: "Check current records and cited sources before asking a question again."
"Sources conflict: keep the conflict open." "A progress entry does not update
requirements or design." "After saving, reread the changed section or query the
record. A successful command is not proof."

### 10.2 When to record progress (lifecycle.md "Record meaningful progress")

Update the item when: "a stage, status, type, blocker, or exact next step
changes; the owner gives a material choice, answer, requirement, constraint,
approval, or rejection; an outside approval is reported (record who approved
and any conditions; do not claim you verified it); a discovery or decision
changes the plan; a substantial requested outcome finishes."

"Record the owner's meaning briefly. Do not add rationale, scope, conditions,
or certainty the owner did not give." "Do not log routine commands, files
opened, ordinary tests, tiny edits, or discarded ideas."

### 10.3 Progress record formats

- **Legacy local** (`STATUS.md` "Progress log", between HTML comment markers):
  one line per event, format
  `2026-08-29 | 04 solution-design | Chose a rule file so there is one copy of the stage list.`
  (`--` when no stage).
- **Current local** (`WORK-ITEM.md` `# Recent History`): one
  `## ENTRY-<n>: <action>` block per tracker mutation with `- At:` (ISO
  timestamp), `- Action:`, `- Note:`. "Old history is never truncated; a
  surrounding details block may collapse it."
  Observed problem (tested): every command writes an entry, including routine
  ones (`linked`, `task_added`, `roadmap_stage_added`). And when `--note` is
  given with `--stage`, the entry holds only the note; the stage change itself
  is not written into history (code: `note = input.note ? input.note :
  changes.join("; ")`). The legacy progress line carried the stage label; the
  new format lost it.
- **GitHub** (claude-toolkit root `AGENTS.md` and lifecycle.md): the issue body
  holds current state; "One comment titled 'Progress log', edited in place,
  holds concise progress" for existing items; new items "add a short dated event
  to Recent History" in the body. "Treat body, comment, label, and board field
  as one update. Read them back. Repair or report a partial failure."
- **Model template**: a table `| Date | Change or decision | Effect on the work |`.

### 10.4 PRD and design continuity (lifecycle.md, work-guide)

- "While refining a PRD or design, update its actual text as answers settle."
- Keep concise `Notes` at the very bottom: "useful discussion, decisions with
  approval state, open questions, remaining document tasks, and the exact resume
  point." work-guide: "**Decisions**, **Still open**, and **Resume here** are
  enough."
- "Build ideas kept for later go under a 'Potential paths to explore' heading
  inside those Notes. They are not requirements." (decision D18)
- The item keeps overall status, stage, approvals, other tasks, blockers, and
  links. For a document task, the item's position and next action point to the
  document's Notes. "No separate interview or continuation files."

---

## 11. Handoff steps

lifecycle.md "Leave a usable handoff": "Before ending substantial unfinished
work, record in the active task: exact position, next action, blockers or none,
open decisions, linked sources, and true status. Keep the parent item and
roadmap accurate. Read the result back or run the tracker's validation."

SKILL.md "Leave the handoff current": update "the exact next step, blockers or
none, open decisions, and current stage and status. Then run `validate` and
read the result. Run `reconcile` when repository evidence is relevant. Do not
claim a check passed when it could not run."

The `handoff` skill's seven steps, in order (`session-skills/skills/handoff/SKILL.md`):

1. Update the active work item when one exists (next step, blockers, open
   decisions, true stage and status; read back or validate; preserve the
   delivery choice; for PRD/design work first save the document text and bottom
   Notes).
2. Run the installed knowledge save review.
3. Wait for the save decision.
4. Draft a prompt a fresh session can start from (first line a fixed
   AI-generated notice; goal right after).
5. Check the draft before the owner sees it.
6. Preserve the checked continuation in Session handoffs when working memory is
   configured.
7. Show what changed and the finished prompt.

The always-loaded rule: "Before ending unfinished work, record the exact next
step in the item." The project rule `offer-context-handoff.md` offers the
`handoff` skill before heavy work in a long session.

---

## 12. Finish and cancel

- `work finish ID --evidence TEXT [--approved-by NAME] [--approved-date DATE] [--commit SHA] [--pr NUMBER_OR_URL]`.
- "Done means the intended outcome was accepted; it does not universally mean a
  commit landed." Commit and PR evidence are optional (non-repository work).
  Commits are checked against local Git; PRs are recorded, not verified.
- Without `--approved-by`, the CLI still writes `Done`, reports
  `completed_unapproved`, validation warns, and no `work_completed` event is
  written. Late approval: `work finish ID --approved-by NAME` (no item may be
  active on the branch).
- Approved Done appends one `work_completed:<ID>` event to `EVENTS.ndjson`.
  Identical replays are no-ops.
- Repository work: "say whether the completion commit reached the default
  branch." (`work landed ID` checks Git ancestry.)
- GitHub: "closing the approved issue is the completion event. Close as not
  planned for cancellation."

## 13. Closing a work item (file lifecycle)

`work-item-lifecycle` skill, "Closing a work item":

1. Confirm the item links to the current architecture, specifications, lasting
   decisions, and implementation that actually exist.
2. Keep those current files in their authoritative homes.
3. Archive only retired or replaced working material.
4. Close or archive the item through the declared tracker's normal process.

"Do not create missing architecture, decisions, or specifications merely to make
the checklist look complete."

Model project closeout (from `toolkit-installed-project-file-map.md` section 5,
and model `requirements/AGENTS.md`): while a change is in progress the work
item owns the proposed requirements; after delivery and approval, merge the
agreed delivered rules into `requirements/<area>.md`, keep the design with the
item, update the System Guide if enabled, send lessons to memory, then close.
"Approved-but-undelivered behavior must not be relabeled as shipped." This is
what stage `14-spec-update` means in a model-shaped project (Inferred).

---

## 14. Local versus external trackers

| Aspect | Local `.work-items/` | GitHub (current toolkit practice) | Linear / Jira / Notion / other (current) |
| --- | --- | --- | --- |
| Setup | project-init Gate 1 answer 4: install `work-tracker`, `work init`, `work validate`, name `.work-items/` in AGENTS.md | Gate 1 answer 1: 9-step board setup, each creation only after a yes | Gate 1 answers 2-3: "Create nothing and change nothing inside that tracker" |
| Storage | Git-ignored; one clone only; shared by linked worktrees | Issue body + one Progress log comment + one stage label + board status | Native item |
| Record body | `WORK-ITEM.md` (five H1 sections) | New items: same five sections in the body | Same five sections in the description |
| Authority for status | Overview `Status` field | Native fields (board status, labels, close state) | Native fields |
| Stage | Overview `Stage` field | One label `01-discovery`..`14-spec-update` (no `refined` label) | "map the meaning, and keep its native fields" |
| Children | `parent`/`children` relationship; folder nesting is separate | "Use child issues or sub-issues when they own real scope" | Native relationship |
| Design home | `DESIGN.md` beside `WORK-ITEM.md` | `docs/designs/<id>-<slug>.md` (work-item-lifecycle, solution-design) | same as GitHub |
| Completion | `work finish` + event | Close the issue; not planned = cancel | Native close |
| Tooling | `work.mjs` CLI | `gh` | Service tools |
| Rule | "never create a second tracker or local mirror"; "Never run `init` or create `.work-items/` when the project uses an external tracker" | same | same |

What the model project changes (model `AGENTS.md`, `docs/AGENTS.md`,
`README.md`, `PROJECT.md`): the design for an external item lives "in the
external item's own record or attachments. Do not create a separate
`docs/designs/` copy." Model `AGENTS.md` project map: "Never create
`docs/designs/`." This contradicts the current `work-item-lifecycle` and
`solution-design` defaults. GOAL.md's Notion decision ("a templated Solution
Design subpage") matches the model.

GOAL.md scope for V2: local folders and Notion fully built and tested; GitHub
Issues and Jira get "the template and written instructions only".

---

## 15. Sub-items and nesting today

Two separate mechanisms (README, record-format.md, `work-item-folders.md`):

1. **Folder nesting = organization.** Any folder under `.work-items/` may hold
   work items: a plain group folder (for example `security-and-permissions/`)
   or a work-item folder holding child work-item folders. The scan walks every
   folder, depth limit 10 (`FOLDER_MAX_DEPTH`, "a stop for a runaway walk").
   Dot-folders are skipped. A folder is a work item only when its name matches
   `^([A-Za-z][A-Za-z0-9]*-\d+)(?:-|$)` **and** it holds one of
   `WORK-ITEM.md`, `ITEM.yaml`, `ITEM.json`, `REQUIREMENTS.md`, `SPEC.md`,
   `TASKS.yaml`, `STATUS.md`, `HISTORY.ndjson`. So `phase-1` or `epic-2` stays a
   plain folder. Each item reports `group` (its folder path relative to
   `.work-items/`). `work add --group NAME` creates an item inside a folder
   (refuses paths that leave the tracker, start with `archive`, or have a
   dot-prefixed part).
2. **Parent/child = relationship.** `work link A --type children --target B`
   writes `children: [B]` on A and `parent: [A]` on B. One parent maximum.
   Validation checks inverses. "Nesting an item inside another writes no
   `parent` link, and linking moves no folder."

Relationship types: `depends_on`/`blocks`, `related_to`/`related_to`,
`parent`/`children`, `supersedes`/`superseded_by`. `depends_on` cycles are
rejected. Unlinking a child that still fulfils a roadmap stage is refused
(`roadmap_child_in_use`).

There is no epic type and no rollup: "Completing a task or child never
completes or approves its parent."

Archive: anything under `.work-items/archive/` at any depth is archived.
"Sitting in that folder ... is the only record." Hidden from `status`, `next`,
dashboard; still validated and linkable; IDs never reused. `work archive` /
`unarchive` move the folder and keep its group path.

**What happens when the owner moves or renames things (tested 2026-09-26 in a
scratch repo):**

| Owner action | Result |
| --- | --- |
| Drag an item folder into another group folder inside `.work-items/` | Found at its new place; `group` updates. No command needed |
| Rename the folder so it no longer starts with the ID (`WI-002-child-piece` -> `child-piece`) | Item vanishes from the scan. Only noticed because WI-001 linked to it: `children references missing WI-002` |
| Rename `WORK-ITEM.md` to `notes.md` | Item vanishes the same way |
| Rename the folder's ID (`WI-099-renamed`) | `record id WI-002 does not match folder id WI-099` |
| Rename only the slug (`WI-002-renamed-slug`) | Works |
| Move the folder outside `.work-items/` | Not scanned (Inferred from code; not run) |

An item with no relationships that is renamed away disappears with no error
at all. ID allocation (`allocateId`) uses the highest ID among items it can
see, so a vanished item's number could be handed out again.

---

## 16. The local tracker implementation (current)

### 16.1 Language, size, packaging

- Node.js ES modules, no dependencies. Invoked as
  `node <skill-root>/scripts/work.mjs <command>`. `VERSION = "2.8.0"` inside
  `work.mjs`; plugin version `2.10.2`.
- `work.mjs` (504 lines): argument parsing, command switch, help text.
- `lib/tracker.mjs` (3,468): all behavior.
- `lib/work-item-document.mjs` (458): `WORK-ITEM.md` parse, create, patch.
- `lib/common.mjs` (566): `WorkError`, git runner, dates, tiny YAML reader and
  writer (flow-form only), atomic writes, batch writes with recovery journal,
  lock, slugify, arg parsing, output.
- Codex packaging: `.codex-plugin/plugin.json` (`"skills": "./skills/"`) and
  `skills/work/agents/openai.yaml` (`display_name: "Work Tracker"`,
  `default_prompt: "Use $work to orient to my tracked work and guide its delivery."`).

### 16.2 Files under `.work-items/`

| Path | Purpose | Created by |
| --- | --- | --- |
| `.work-tracker.yaml` | Config: `schema_version: 2`, `id_prefix: "WI"`, `id_width: 3`, `default_branch: "main"`. A `github` key is an error | `init` |
| `README.md` | Human explanation of the folder | `init` |
| `DASHBOARD.md` | Generated view | `init`, rebuilt after every mutation |
| `ACTIVE.json` | `{"schema_version":1,"branches":{"<branch>":{"item_id","task_id?","set_at"}}}` | first `active set` / `start` |
| `EVENTS.ndjson` | One `work_completed` event per approved Done | `finish` |
| `.work-tracker.lock` | Exclusive lock file holding the PID; stale locks from dead PIDs are taken over | every mutation |
| `.recovery/transactions/` | Journal for interrupted multi-file writes | multi-file saves |
| `archive/` | Archived items | `init` |
| `<ID>-<slug>/WORK-ITEM.md` | The item record | `add` |
| `<ID>-<slug>/DESIGN.md` | Optional design | the agent (no command) |

`init` appends `/.work-items/` to `.gitignore`. `validate` errors if the ignore
line is missing or Git tracks any file in the folder. Linked worktrees resolve
to the **primary** worktree's `.work-items/` (`git worktree list` first entry).

### 16.3 `WORK-ITEM.md` format 1 (current parser contract)

Real output of `work add` + a few commands (trimmed):

```markdown
<!-- work-item-format: 1 -->
**WI-001: Parent area**

# Overview

- Schema version: 2
- Purpose: Owner wants a parent area
- Type: build
- Priority: medium
- Status: In Progress
- Stage: "08-build"
- Created date: "2026-09-26"
- Updated date: "2026-09-26"
- Next action: Interview owner
- Blockers: []
- Relationships: {"depends_on":[],"blocks":[],"related_to":[],"parent":[],"children":["WI-002"],"supersedes":[],"superseded_by":[]}
- Git: {"branch":"main","pull_request":null,"completion_commit":null,"work_complete_date":null,"landed_commit":null,"landed_date":null,"default_branch":null}

## Requirements approval

- Status: finalized
- Created date: "2026-09-26"
- Updated date: "2026-09-26"
- Finalized date: "2026-09-26"
- Approved by: Mike Rihm

## Open questions

None.

## Context and notes


# Roadmap

- Schema version: 1
- Updated date: "2026-09-26"

## STAGE-001: Discovery
- Outcome: Know the need
- Acceptance condition: Owner agrees
- Lifecycle stage: null
- Child work items: []
- Planning status: planned

# Tasks

## TASK-001: Interview
- Roadmap phase: STAGE-001
- Objective: Learn need
- Instructions: Ask one question at a time
- Constraints: []
- Inputs: []
- Deliverable: Requirements text
- Acceptance condition: Owner approves
- Status: Pending
- Dependencies: []
- Current position: Not started.
- Next action: Ask Q1
- Approval required: false
- Completion: null
- Created date: "2026-09-26"
- Updated date: "2026-09-26"

# Recent History

## ENTRY-1: created
- At: "2026-09-26T18:07:14Z"
- Action: created
- Note: Created in Backlog with requirements still refining.

# Requirements

## Starting request

Owner wants a parent area

## Goal

_Not agreed yet._
```

Parser rules (`work-item-document.mjs`, record-format.md):

- First line must be exactly `<!-- work-item-format: 1 -->`.
- Exactly one bold title line `**<ID>: <Title>**` before Overview; ID regex
  `[A-Z][A-Z0-9]*-\d+`.
- Exactly five H1 headings in this order: `# Overview`, `# Roadmap`,
  `# Tasks`, `# Recent History`, `# Requirements`. Fenced code and HTML
  comments do not count as headings.
- Overview needs exactly one `## Requirements approval` subsection.
- Fields are visible lines `- Label: value` (the `- ` is optional). Label to
  key: lower-case, spaces to underscores, with three aliases:
  `Purpose` = `description`, `Next action` = `next_step` (and task
  `next_action`), `Roadmap phase` = task `roadmap_stage`.
- Values: `null`, `true`/`false`, numbers, and anything starting with `[`, `{`
  or `"` are JSON; other text is a plain string. Multiline text is
  `Label: |` followed by lines indented four spaces. Duplicate labels fail.
- `## STAGE-<n>: Title` blocks in Roadmap, `## TASK-<n>: Title` in Tasks,
  `## ENTRY-<n>: Action` in Recent History. ID and title live only in headings.
- Required Overview text fields: Purpose, Type, Priority, Status, Created date,
  Updated date, Next action. `Schema version` must be `2`; Blockers an array;
  Relationships and Git objects.
- Writes are **patches**: only changed field lines are replaced, new history
  entries appended (before a trailing `</details>` if the owner collapsed
  history), owner prose kept. Every patch is re-parsed and must round-trip.
- `work edit ID --input FILE --expected-hash SHA256` is the only way to change
  free prose (Open questions, Context and notes, Requirements body). It refuses
  if the SHA-256 changed (`stale_document`), if any structured field, roadmap,
  history, or approval metadata changed (`guarded_document_fields`), or if
  finalized requirements text changed (`requirements_finalized`).
- A folder with `WORK-ITEM.md` plus any legacy file fails with
  `mixed_item_formats`.

### 16.4 Commands (all 21, plus `help` and `version`)

From `work.mjs` and command-reference.md. All accept `--cwd PATH` and `--json`.

```text
work init [--default-branch main]
work migrate [--from work-items] [--apply]
work add --title T --description D [--priority medium] [--type task] --next-step S
         [--created-date YYYY-MM-DD] [--group FOLDER] [--id WI-014]
work edit ID --input FILE --expected-hash SHA256
work recover
work requirements ID [--finalize --approved-by NAME | --reopen]
work roadmap show ID
work roadmap add ID --title T --outcome O --acceptance C [--child-item WI-x] [--lifecycle-stage 04] [--draft]
work roadmap update ID STAGE-001 [--title] [--outcome] [--acceptance] [--child-item] [--clear-child-items] [--draft|--planned] [--lifecycle-stage]
work task show ID [TASK-001]
work task add ID (--stage-title T --stage-outcome O --stage-acceptance C [--lifecycle-stage 04] | --roadmap-stage STAGE-001)
         --title T --objective O --instructions I [--constraint X]... [--input X]...
         --deliverable D --acceptance C [--depends-on TASK-x]... [--position P] --next-action A [--approval-required] [--id TASK-x]
work task update ID TASK-001 [any task field] [--status S] [--clear-constraints|--clear-inputs|--clear-dependencies] [--approval-required|--no-approval-required]
work task select ID TASK-001
work task complete ID TASK-001 --evidence E [--approved-by N] [--approved-date D]
work active [set ID [--replace] | clear]
work status [--all] [--archived]
work next
work start ID [--branch B] [--next-step S] [--allow-shared-branch]
work update ID [--stage S] [--type T] [--status S] [--next-step S] [--branch B]
         [--blocker REASON [--blocker-item WI-x]] [--clear-blocker B-001|all] [--note N] [--allow-shared-branch]
work link ID --type depends_on|blocks|related_to|parent|children|supersedes|superseded_by --target ID [--remove]
work finish ID --evidence E [--approved-by N] [--approved-date D] [--commit SHA] [--pr N_OR_URL]
work finish ID --approved-by N [--approved-date D]          (late approval)
work landed ID
work archive ID | work unarchive ID
work reconcile
work validate
work dashboard
```

Plus `help` and `version`.

Guards every mutation shares: a tracker lock; reload under the lock; the
**active-item guard** (every named mutation refuses an item other than the
current branch's active item: `no_active_item`, `wrong_active_item`); an
active item cannot be `Done`/`Cancelled`; one branch may be claimed by only
one active item unless `--allow-shared-branch`; `pending_recovery` blocks all
commands until `work recover`.

Exit codes: `0` success, `1` command or input failure, `2` `validate` found
invalid records. JSON errors go to stderr as `{outcome, error, message, details?}`.

### 16.5 Validation (`work validate`)

Errors:

- config: `schema_version` 2, `id_prefix` uppercase, `id_width` 1-12,
  `default_branch` set, no `github` key;
- `.gitignore` lacks `/.work-items/`; Git tracks work-item files;
- duplicate IDs; `ACTIVE.json` malformed, pointing at missing or terminal items
  or tasks; `EVENTS.ndjson` malformed, duplicate, or not matching its item;
- per item: record id differs from folder id; missing title/description;
  invalid type/priority/status; malformed dates; missing next step while not
  terminal; relationships not arrays or with duplicates; requirements status
  not `refining`/`finalized`; finalized without date and approver;
  `build`/`data-load` active without finalized requirements; known stage vs
  status mismatch;
- roadmap: invalid or duplicate `STAGE-`/`TASK-` IDs; missing stage title,
  outcome, acceptance; missing task required fields; invalid task status;
  `approval_required` not boolean; dangling task dependencies; completed task
  without evidence; approval-required completion without approver and date;
  planned stage with no task and no child; child not linked; task dependency
  cycles;
- relationships: self-reference; missing target; missing inverse; more than
  one parent; blocker pointing at a missing item; `depends_on` cycles;
- completion: Done without evidence; malformed `recorded_at`/approval date;
  false landing evidence;
- two active items claiming the same branch.

Warnings: unknown stage kept; roadmap has no stages ("reconcile the plan before
continuing managed work"); draft stage empty; Done without completion approval;
completion commit or default branch not in this clone; legacy items missing
`TASKS.yaml` or `HISTORY.ndjson`.

`work reconcile` = validate + stale branch names + "merged but still active"
(completion commit already on the default branch) + stale dashboard.

### 16.6 Generated view: `DASHBOARD.md`

Rebuilt after every mutation and by `work dashboard`. Header: "Generated from
each work item's canonical record. Rebuild with `work dashboard`. Do not edit
this file as a source of truth." Sections, each a table
`| ID | Status | Priority | Type | Next step | Git / PR |` (Blocked work uses
"Blocked by") or `_None._`:

1. Requirements still refining
2. Active work (`In Progress`, `In Review`)
3. Next candidates (top 10 by the `next` ranking)
4. Blocked work
5. Review and landing (`In Review`)
6. Recently completed (last 10 Done by updated date)

Archived items are excluded. `work status` prints a text view: Active, Blocked,
Next, Counts, and with `--all` Backlog / Completed / Cancelled / Archived.

### 16.7 Tests

- `plugins/work-tracker/tests/work-tracker.test.mjs` and
  `consolidated-record.test.mjs`, Node's built-in `node:test`. Each test builds
  a temporary Git repository. **78 tests, all pass** (run 2026-09-26, about
  55 seconds).
- Coverage areas (from test names): init with spaces and linked worktrees;
  gitignore; requirements gate; one-line requirements; reopen; branch sharing;
  inverse relationships and cycles; `next` ranking; Git landing proof;
  validation errors; dashboard stability; interrupted atomic writes; migration
  preview and copy; archive (by command, by hand, nested, ID never reused,
  links); grouping folders (made by owner, nested, moved by hand, archived as a
  whole, named like a work item); items holding items; active identity per
  branch; every mutator refuses a non-active target; custom types; stage and
  status derivation; finish, late approval, idempotent replay, one event;
  rollback of all files on write failure; roadmap tasks and continuation;
  roadmap stage fulfilled by a nested child; task dependency validation;
  consolidated record: exact sections, prose preservation (Unicode, CRLF, code
  fences, collapsed history), guarded edit with stale hash, recovery journal.
- `tests/delivery-scenarios.md`: fresh-process behavior checks with
  `codex exec` (Codex CLI 0.154.0). Seven delivery-offer scenarios (undecided,
  simple request, accepted, declined and revoked, writable acceptance, failed
  write and recovery, external GitHub) were run and passed on 2026-09-19. The team-arrangement scenarios and the "re-offer when a
  goal grows" scenario are written but "not yet run". Claude was not tested.

### 16.8 Legacy support carried today

Multi-file items (`ITEM.yaml`, `REQUIREMENTS.md`, `TASKS.yaml`, `STATUS.md`,
`HISTORY.ndjson`) and conversion from the older staged tracker
(`work-items/`, `delivery/work-items/`, `engagement/work-items/` with
`01-backlog` .. `04-archived` folders, `ITEM.json`, `SPEC.md`). A large part of
`tracker.mjs` exists only for these. V2 starts fresh projects (GOAL.md), so
this can be dropped (Proposal).

---

## 17. Deterministic enforcement that exists today, outside the CLI

- **Rules** (always loaded): `work-item-stages.md` (6 bullets),
  `work-item-folders.md` (local only). These are instructions, not checks.
- **protocol-guard** (Claude Code function hooks, needs
  `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`; "Claude Code only; no Codex entry"):
  - P2 refuses `gh issue close`, `work finish`, and GitHub `issue_write` with
    state `closed` until the `work` skill was opened this turn. "The check
    proves only that the skill was opened."
  - K7 refuses `gh pr create`, `gh issue close`, `gh pr merge`, `work finish`
    until `knowledge-save` was opened this turn.
  - CW/CWX hold the final reply once after a work-item change until working
    memory is written. A "work-item change" (`changesWorkItem` in
    `hooks/shell-reader.mjs`) is: `gh issue create|new|close|reopen|delete|transfer`;
    `gh issue edit` adding or removing a label matching `^\d{2}-`;
    `gh project item-edit`; `work add|finish|archive|unarchive|start`;
    `work update` with `--stage` or `--status`;
    `work requirements --finalize|--reopen`.
- work-item-upkeep PRD: "The late stage-reminder hook is retired without a
  replacement hook."
- Model project hooks (`.claude/settings.json`, `.codex/hooks.json`): no
  work-item hook at all. The SessionStart hook
  (`toolkit-session-start.mjs`) only prints the toolkit manual summary and
  setup gaps. The Codex file uses the same `hooks.SessionStart` shape with
  `matcher: "startup|resume|clear|compact"`, `commandWindows`, `timeout`,
  `additionalContextLimit`, `statusMessage`.

Hook facts relevant to V2 (`ai-external-knowledge/claude-code/hooks.md`):
Claude Code has `SessionStart` (matchers `startup`, `resume`, `clear`,
`compact`, `fork`), `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`,
`PreCompact`/`PostCompact`, `SessionEnd`, `TaskCreated`, `TaskCompleted`,
`FileChanged`, and others. `FileChanged` watches **literal filenames in the
working directory** ("each segment is registered as a literal filename"), so
it cannot watch a folder tree for moves. The Codex hook event list is not in
the captured Codex docs (only `codex/agents-md.md` is captured); confirm it
with the hooks researcher before relying on any event other than
`SessionStart`.

---

## 18. The model `WORK-ITEM.md`: every field and section, mapped

File: `toolkit-v2-model-project/.work-items/work-item-template/WORK-ITEM.md`
(128 lines). Mike approved it.

### 18.1 Frontmatter (YAML, lines 1-10)

| Model field | Model value / hint | Current equivalent | Process meaning and notes |
| --- | --- | --- | --- |
| `id` | `WI-001` | Title-line ID; `record.id` | Identity. **Proposal:** make this the identity (not the folder name) so renames do not lose items |
| `title` | `<Work item title>` | `record.title` | Also repeated in the H1 `# WI-001: <Work item title>`. Two copies; a check must keep them equal or drop one |
| `type` | `<Work item type>` | `record.type` | Drives the `build`/`data-load` gate |
| `status` | `<Backlog \| In Progress \| Blocked \| Done>` | `record.status` (6 values) | **Conflict.** No `Ready`, `In Review`, `Cancelled`; adds `Blocked`. The stage-to-status table needs `Ready` and `In Review` |
| `stage` | `<Current lifecycle stage>` | `record.stage` | One of the 14 or empty |
| `active_phase` | `P1` | None (the current code tracks a branch-scoped current task in `ACTIVE.json`) | New. The phase being worked. Should match the Roadmap row whose Status is In Progress |
| `requirements_status` | `refining` | Requirements approval `Status` (`refining`/`finalized`) | **Duplicated** by the body line `**Overall status:** Refining`. One must be the authority |
| `design` | `<Link to design, if one exists>` | None (design linked in prose) | New. Local default `DESIGN.md` |

Fields the current process needs that the model has no field for:
`priority` (used by `next` ranking), `created_date`, `updated_date`,
structured `blockers`, `relationships` (parent, children, depends_on, blocks,
related_to, supersedes), `git` (branch, PR, completion and landed commit),
`completion` (evidence, approver, date), requirements `approved_by` and
`finalized_date` (the model's Finalization rule says "Record who approved them
and when" but gives no field), and the delivery choice (natural home: Notes >
Decisions and context).

### 18.2 Body sections (seven H2, in this order)

| # | Model section | Content in the model | Current equivalent | Process role |
| --- | --- | --- | --- | --- |
| - | `# WI-001: <Work item title>` (H1) | Title | `**WI-001: Title**` bold line | Identity |
| 1 | `## Overview` | `**Goal:**` outcome; `**Current position:**`; `**Next action:**` "and its owner"; `**Blockers:**` or "None."; `**Related items:**` roadmap, parent, design, external links | `Purpose` (= starting request, not the goal), `Next action`, `Blockers[]`, `Relationships`; no item-level "current position" (tasks have one) | Orientation and handoff. Next action is the "exact next step" the rule requires |
| 2 | `## Roadmap` | Rule sentence "A phase is complete when its tasks are complete and its exit result has been checked." Table `\| Phase \| Outcome \| Status \| Exit result \|`, rows `P1 — <Phase 1 name>` with Status `In Progress` / `Not Started` | Roadmap stages: title, outcome, acceptance_condition (= Exit result); no progress status (current has `planned`/`draft`); `lifecycle_stage` and `child_work_items` not in the model table | Owner-shaped plan. Phases are separate from lifecycle stages |
| 3 | `## Tasks` | `### P1 — <Phase 1 name>` headings; each task a checkbox bullet `- [ ] **P1-T01 — <Task 1 name>** · In Progress` with `**Work:**`, `**Deliverable:**`, `**Done when:**`, `**Depends on:**` (task ID, "None.", or "P1 completion.") | Task: objective + instructions (= Work), deliverable, acceptance_condition (= Done when), dependencies (task IDs only), status | Execution. Model lacks per-task `constraints`, `inputs`, `current_position`, `next_action`, `approval_required`, completion evidence, dates. Model allows a phase-level dependency ("P1 completion") |
| 4 | `## Recent History` | Table `\| Date \| Change or decision \| Effect on the work \|` | `ENTRY-n` blocks (At, Action, Note) | Progress log. Model is date-level and adds "effect" |
| 5 | `## Open Questions` | Table `\| ID \| Question \| Affects \| Status \| Decision needed from \|`, row `Q-01 ... R-01, P1-T02 ... Open ...` | Overview `## Open questions` free prose | Capture-table row "Open question": question, who must answer, status, what it affects. The model makes it structured with IDs |
| 6 | `## Requirements` | `**Overall status:** Refining`; `**Finalization rule:**` (exact: "Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when."); `### Starting request`; `### Agreed goal`; `### Active requirements` with `#### R-01 — <Required outcome>` blocks; `### Acceptance` numbered list | Requirements approval subsection + body with `## Starting request` and `## Goal` (`_Not agreed yet._`) | Stages 01-03. Per-requirement status is new |
| 6a | R-xx block fields | `**Status:** <Refining \| Finalized \| Superseded>`, `**Applies to:**`, `**Required behavior:**`, `**Boundaries and exceptions:**`, `**Acceptance check:**`, `**Decision record:**` (source; approver and date if Finalized; replacement link if Superseded), `**Open questions:**` (Q-IDs or "None.") | None (free text) | Matches requirements-helper's "who is affected, when the rule applies, the expected result, and relevant exceptions" |
| 7 | `## Notes` | `### Decisions and context`; `### Resume here`; `### Solution options and considerations` ("These are possibilities to evaluate, **not approved requirements or design decisions**." with `**For R-01:**` bullets) | Overview `## Context and notes`; lifecycle "Notes at the very bottom" with "Potential paths to explore" | Continuity. "Resume here" is the exact resume point the lifecycle requires. "Solution options" is the renamed "Potential paths to explore" |

### 18.3 Structural differences the V2 parser must handle

- YAML frontmatter instead of a format-marker comment.
- H2 sections (seven) instead of H1 sections (five). Open Questions and Notes
  are top-level sections, not Overview subsections.
- Bold-label lines (`**Goal:** text`, with two trailing spaces as Markdown line
  breaks) instead of `- Label: value`.
- Tables for Roadmap, Recent History, Open Questions.
- Task lines are checkbox bullets with the ID, an em dash, the name, a middle
  dot, and a status, followed by indented bold-label lines.
- IDs: phases `P1`, tasks `P1-T01`, requirements `R-01`, questions `Q-01`.
  The model's `PROJECT-ROADMAP.md` uses `P01` and `P01-U01` (two-digit), so
  project phases and item phases use different ID widths.
- Task status words in the model: `In Progress`, `Not Started` (plus the
  checkbox). Current: `Pending`, `In Progress`, `Blocked`, `Complete`,
  `Cancelled`.
- The template folder is named `work-item-template`. Under the current scan it
  is not a work item (no `<PREFIX>-<number>` name). GOAL.md: project init
  copies the scaffold "except `.work-items/`", so the template ships from the
  plugin, not the project.

### 18.4 Same body in every tracker (GOAL.md)

"Work items: the same stages, lifecycle, `WORK-ITEM.md` body and `DESIGN.md`
everywhere." For Notion, frontmatter fields become database properties
(Inferred: `Status`, `Stage`, `Type`, `Active phase`, `Requirements status`,
`Design`, plus a parent/sub-item relation) and the seven H2 sections become the
page body; DESIGN.md becomes the "Solution Design subpage". For GitHub and Jira,
frontmatter fields map to native fields and labels, and the body goes in the
description.

---

## 19. The model `DESIGN.md`: every section, mapped

File: `.work-items/work-item-template/DESIGN.md` (104 lines). It follows
`session-skills/skills/solution-design/references/design-document-template.md`
closely (diffed: same sections, shorter prompts, and a fixed
`Requirements: [WORK-ITEM.md](WORK-ITEM.md)` link).

| Section / field | Content | Process role |
| --- | --- | --- |
| Title `# WI-001: <Work item title> — solution design` | | Ties design to item |
| `Status: proposed` | Header line | Design approval state. Changes to approved only on the owner's word (solution-design) |
| `Requirements: [WORK-ITEM.md](WORK-ITEM.md)` | Link | Design reads approved requirements; never fills a requirements gap |
| `Date:` | | |
| `## What this solves` | Who, what, what must be true; link to Agreed goal | Stage 04 intent |
| `## What exists today` | Verified current behavior, or "nothing exists yet" | Existing build vs greenfield |
| `## Design philosophy` | Built-in first, or the chosen specialized approach | Owner's choice |
| `## Preparation` | `**Requirements readiness:**`, `**Way of working:**`, `**Team:**`, `**Constraints:**` | Solution-design checklist steps; team choice |
| `## Option A: <Short name>` | `### Summary`; `### How each requirement is met` with `#### R-01 — ...` and bullets `**Build or reuse:**`, `**Why this satisfies it:**`, `**How to check it:**`; `### What the person experiences, start to finish`; `### Components and files touched` table (`Component or file \| New, changed, or reused \| What changes`); `### Order of work`; `### Risks and tradeoffs`; `### Sources` table (`Claim \| Source \| Date \| Label \| Verified how`) | Per-R-ID traceability. "How to check it" feeds `09-testing`; "Order of work" feeds `06-implementation-plan` and the item's Tasks |
| HTML comment: more options as Option B, C in the same file | | |
| `## Where a builder could misread the requirements` | Table `Requirement \| Wrong reading \| Intended reading` | Guards the build |
| `## Recommendation` | Only when more than one option | Owner chooses |
| `## Should the existing build be replaced?` | Only for an existing build | |
| `## Notes` | `**Decisions:**`, `**Still open:**`, `**Resume here:**`; closing line "Saving this draft does not approve the design or authorize implementation." | Document continuity (section 10.4) |

Deterministic hooks into DESIGN.md (Proposal): every `R-xx` heading in the
design must exist in `WORK-ITEM.md`; every non-Superseded `R-xx` should have a
"How each requirement is met" entry before the design can be marked approved;
`Status:` must be `proposed` or `approved`.

---

## 20. Conflicts and gaps V2 must settle

1. **Status set.** Model hint `Backlog | In Progress | Blocked | Done` versus
   lifecycle `Backlog, Ready, In Progress, In Review, Done, Cancelled` (and the
   GitHub board's seven with `Refining`). Recommendation: keep the lifecycle's
   six, derive "blocked" from a non-"None." Blockers line (and show it as a
   flag or board filter), and report the template hint as a model-review
   finding for Mike.
2. **External design home.** Model: with the item, never `docs/designs/`.
   Current toolkit: `docs/designs/<id>-<slug>.md`. GOAL.md's Notion subpage
   matches the model. V2 skills (solution-design, work-item-lifecycle) must be
   ported with the model's rule.
3. **Requirements status duplicated** (frontmatter `requirements_status` and
   body `**Overall status:**`).
4. **Title duplicated** (frontmatter `title` and H1).
5. **No approval fields** for requirements (who and when), design, or Done.
6. **Missing process fields**: priority, dates, relationships, blockers
   structure, Git evidence, completion evidence, per-task next action and
   position, constraints, inputs, task approval flag.
7. **History granularity.** Current logs every command; policy says log only
   meaningful events; the new format also drops stage changes when a note is
   given.
8. **"Stage" means two things** in current code (roadmap `STAGE-001` and
   lifecycle `08-build`).
9. **Parent/child vs nesting.** Current: separate. GOAL.md: "Nesting and
   sub-items are allowed." Notion has native sub-items. Whether nesting a
   work-item folder inside another work-item folder should *be* the parent link
   in V2 is an open decision.
10. **Moved and renamed items** can vanish silently (section 15).
11. **Goal placeholder** can be finalized by the CLI (skill-only rule D15).
12. **Heavy machinery for a solo developer**: branch-scoped `ACTIVE.json`
    with a refuse-other-items guard, `EVENTS.ndjson` outbox, recovery journal,
    Git landing proof, `--allow-shared-branch`, legacy formats, `migrate`.

---

## 21. Proposal: deterministic parts versus judgment parts

Principle (from protocol-guard's README and the sources): a script can prove a
record is well formed and a step happened; it cannot prove the owner approved
anything or that a stage is the right one. Put structure, derivation, and
bookkeeping in scripts and hooks. Put meaning, approval, and choice in skills.

### 21.1 Deterministic: one small script (`workitem`), Node.js, no dependencies

Proposal. Same language as today (runs on both Claude Code and Codex, no install).

| Duty | Detail |
| --- | --- |
| Parse and validate the model `WORK-ITEM.md` | Frontmatter keys and allowed values; exactly the seven H2 sections in order; ID formats `P<n>`, `P<n>-T<nn>`, `R-<nn>`, `Q-<nn>`; unique IDs; every `Depends on`, `Affects`, and `Open questions` reference exists; no task dependency cycles; frontmatter `id` equals the H1 ID; `active_phase` exists in the Roadmap table |
| Stage list and stage-to-status table | The 14 stage names and the mapping `01-02 Backlog`, `03 Ready`, `04-11 In Progress`, `12-14 In Review`. A stage change writes the derived status. Unknown stage kept, reported |
| Approval gate (`build`, `data-load`) | Refuse status `Ready`/`In Progress`/`In Review`/`Done` and stages `03`+ unless requirements are Finalized with approver and date. Proposal: also refuse Finalized while `### Agreed goal` still holds the template placeholder, or while any non-Superseded R-xx is Refining, or while an R-xx lists an Open question (this turns decision D15 into code; needs Mike's yes) |
| Done and Cancelled only through one command | `finish` needs evidence and approver; writes a Recent History row. `cancel` needs a reason |
| Consistency checks | Phase `Done` only when all its tasks are checked; checkbox `[x]` equals task status Done; `requirements_status` equals `**Overall status:**` (or drop one) |
| ID allocation | Next `WI-<nnn>` under a lock, scanning every item at any depth including `archive/`, plus a generated index of every ID ever seen so a vanished item's number is never reused |
| Discovery and move detection | Find items by the `id:` in `WORK-ITEM.md` frontmatter at any depth under `.work-items/`, not by folder name. Keep a generated `.work-items/INDEX.json` (id -> path, title, status, stage, parent). On each run, compare and report: moved, renamed, missing, duplicate ID, new file without an ID |
| Parent/child | If Mike decides nesting means parent: derive `parent` from the nearest enclosing work-item folder and rewrite `Related items`; plain folders stay groups. Otherwise validate the explicit link both ways |
| History rows | Append `\| Date \| Change or decision \| Effect \|` on every status or stage change, always naming the stage |
| Generated dashboard | Rebuild `DASHBOARD.md` (sections as today, plus a tree of parents and sub-items) |
| Archive | Items under `archive/` are archived; hidden from status and next; still validated |
| `.gitignore` | `init` adds `/.work-items/`; validate checks it |

Commands (Proposal, minimal): `init`, `new`, `validate`, `status`, `next`,
`stage`, `requirements finalize|reopen`, `task done`, `finish`, `cancel`,
`index` (rebuild and report moves), `dashboard`. Prose edits are made by the
agent with ordinary file edits, then `validate` checks them, instead of the
current hash-guarded `edit` round trip (Proposal; simpler for agents).

What to drop for a solo developer (Proposal, architect to confirm): the
branch-scoped active map and its refuse-other-items guard (replace with
`active_phase` plus the work item named in the session), `EVENTS.ndjson`,
recovery journals, Git landing proof, legacy formats, `migrate`.

### 21.2 Deterministic: hooks (documented Claude Code shape; Codex per the hooks researcher)

| Hook | Event | Does |
| --- | --- | --- |
| Orientation | `SessionStart` (`startup\|resume\|clear\|compact`) | Run `workitem index` + `validate`; print the chosen tracker, the active item(s) with stage, status, next action, blockers, open-question count, and any move/rename findings. Bounded output |
| Move detection on demand | `UserPromptSubmit` (cheap path only) | Compare the index with a fresh scan; if something moved or vanished, add one line of context so the agent adapts in the same turn |
| Record check after edits | `PostToolUse` on `Edit\|Write\|MultiEdit` when the path ends in `WORK-ITEM.md` or `DESIGN.md` | Run `validate` on that item; return errors to the agent |
| Turn-end check | `Stop` | If any work-item file changed this turn and validation fails, block the stop once with the errors. If a stage or status changed with no Recent History row, say so |
| Close guard | `PreToolUse` on the finish/cancel command (and Notion/GitHub close calls where they can be matched) | Refuse unless the command carries an approver. Cannot prove the approval is real |
| Session task list (optional) | `TaskCreated` / `TaskCompleted` | None needed; `track-tasks` stays session-only |

`FileChanged` is not usable for folder moves (literal filenames only).

### 21.3 Judgment: what the skills instruct

- Which tracker the project uses; never run the local script for an external
  tracker; never create a mirror.
- The delivery offer, team arrangement, and archive question, with the exact
  wording in section 8, and where to record the answers.
- Which lifecycle stage the work is really in; when to skip or go back; the
  one-line reason.
- Interviewing for requirements; what "agreed" means; faithful wording; never
  finalizing without the owner's words.
- Risk-based approval for types other than `build` and `data-load`.
- The capture table: what is meaningful, where it goes, reading back.
- Shaping the roadmap phases and tasks; when a phase needs a sub-item instead
  of tasks.
- Design work (solution-design) and design approval.
- Asking before Done; what evidence fits.
- Handoff content; closeout into `requirements/<area>.md` at `14-spec-update`.
- Adapting after a reported move: confirm the owner's intent before relinking
  or restoring anything; never move or archive on the agent's own initiative.
- External trackers (Notion, GitHub, Jira): mapping frontmatter to native
  properties, reading back every write, reporting partial saves.

Suggested skill boundaries for the V2 index (Proposal, to reduce the overlap
noted in section 2): one skill for the item lifecycle and tracker operations
(today's `work` + `work-item-lifecycle` closing rules), one for planning and
coordination of a goal (today's `work-guide` + team arrangements), and keep
`requirements-helper`, `solution-design`, `handoff`, `track-tasks` as they
are, each pointing to the lifecycle skill instead of restating it.

---

## 22. Open questions for Mike or the architect

1. Status set: keep the lifecycle's six statuses (and fix the template hint), or
   adopt the model's four with `Blocked` as a status? If four, how do `Ready`
   (stage 03), `In Review` (12-14), and `Cancelled` map?
2. Should nesting a work-item folder inside another work-item folder
   automatically make it a sub-item (parent link), matching Notion sub-items?
   Or stay separate as today?
3. Where do requirements approval (who, when), design approval, and Done
   approval live in the model format? New frontmatter keys, bold lines in the
   Requirements section, or Recent History rows?
4. Which of `requirements_status` (frontmatter) and `**Overall status:**`
   (body) is the authority? Same for `title` versus the H1.
5. Should the CLI refuse to finalize requirements while the Agreed goal is a
   placeholder, a requirement is still Refining, or an open question is linked
   (reverses decision D15)?
6. Do the dropped current fields come back: priority (drives `next`), per-task
   next action and current position, constraints, inputs, task approval flag,
   relationships beyond parent (depends_on, blocks, supersedes), Git evidence?
7. Is a branch-scoped "active item" still wanted for a solo developer, or is
   `active_phase` plus the item named in chat enough?
8. Recent History: record only meaningful events (policy) or every command
   (current code)?
9. Project roadmap IDs `P01`/`P01-U01` versus item IDs `P1`/`P1-T01`: align
   the widths?
10. Must V2 read existing claude-toolkit `.work-items/` (format 1 and legacy),
    or only new projects? GOAL.md implies new projects only.
11. Codex hook support: which events besides `SessionStart` can V2 rely on in
    Codex for the validation and move-detection hooks?
