# Skill index draft: lifecycle-first

Draft for the design pass, written 2026-09-26. It proposes every skill and
agent Toolkit V2 ships, organized around the fourteen work-item stages and the
owner's approval gates. The lead turns the chosen draft into `dev/SKILL-INDEX.md`;
an independent agent then checks it (GOAL.md finish item 5).

Sources: `dev/GOAL.md`, `dev/ARCHITECTURE.md` (sections 4 to 8), and the briefs
`session-skills.md`, `work-process.md`, `platform-best-practices.md`,
`memory-system.md`, `project-init-library.md`, `model-review-draft.md`,
`notion-design.md`. Where this draft goes beyond them, it says "Proposal".

---

## 1. The design in short

- **Every stage has exactly one owning skill.** The work plugin's skill names
  follow the lifecycle in order: `work-requirements` (01-02), `work-approve`
  (the gates), `work-design` (04), `work-plan` (05-07), `work-build` (08, 10),
  `work-review` (09, 11), `work-release` (12-13), `work-finish` (14, Done,
  Cancelled). Section 2 is the map.
- **Every owner gate has exactly one recording skill.** `work-approve` records
  requirements, design, flagged-task, and result approvals. `work-finish`
  records Done and Cancelled. `work-delegate` records the delivery offer and
  team arrangement. Merge goes through `merge-and-clean-up`. Section 3 lists
  every gate.
- **Four front doors** for everything the owner says that is not stage work:
  `work-new` (capture for later), `work-start` (start or resume now),
  `work-status` (where things stand), `work-delegate` (hand the goal to agents).
  `work-organize` handles structure, including moves the owner made by hand.
- **The stage-to-skill map lives in code, not in skill text.** Proposal:
  `toolkit work lifecycle` prints an "Owning skill" column, the session briefing
  names the owning skill next to each active item (`WI-004 · 08-build · skill:
  work-build`), and the PostToolUse gate error names the skill to use. No
  skill repeats the stage table (ARCHITECTURE.md section 8).
- **Counts.** 28 plugin skills, 3 Salesforce project-local skills, 7 agents.
  A general (non-Salesforce) project lists 27 skills, because
  `sf-architect-solutioning` is enabled only in Salesforce projects and the
  three `sf-*` skills are installed only there.
- **Names carry the meaning on their own.** On Mike's machine the skill listing
  already overflows and drops descriptions (session-skills.md section 8.1).
  Toolkit skill names read as a menu: `work-*`, `memory-*`, `project-*`.
- **Checks run on this draft** (section 9): every name matches
  `^[a-z0-9]+(-[a-z0-9]+)*$` and is at most 24 characters; every description is
  at most 291 characters, third person, "what it does, then Use when"; no trigger
  phrase from one description appears in any other description.

---

## 2. Stage ownership map

Status is derived from stage by the CLI (ARCHITECTURE.md 4.1). "Entry" means
which skill usually moves the item into the stage.

| Stage | Status | Owning skill | What the skill produces | Gate at exit | Agents |
| --- | --- | --- | --- | --- | --- |
| (no stage) | Backlog | `work-new` creates; `work-start` routes | Item with Starting request | none | none |
| `01-discovery` | Backlog | `work-requirements` | Starting request, Agreed goal | none | `researcher` (optional) |
| `02-refinement` | Backlog | `work-requirements` | R-xx requirements, Acceptance, Q-xx open questions | Requirements approval (`work-approve`) | `requirements-analyst`, `researcher` |
| `03-requirements-approved` | Ready | `work-approve` records it; `work-start` then routes to `work-design` (or to `work-plan` when design is skipped with a recorded reason) | `requirements_approved: <date> by <name>` | none | none |
| `04-solution-design` | In Progress | `work-design` | `DESIGN.md` or the Notion Solution Design page, `status: proposed` | Design approval (`work-approve`) | `requirements-analyst`, `researcher`, `design-architect`, `design-critic`; skill `sf-architect-solutioning` for Salesforce |
| `05-breakdown` | In Progress | `work-plan` | Sub-items | none | `researcher` (optional) |
| `06-implementation-plan` | In Progress | `work-plan` | Roadmap phases `P1...`, tasks `P1-T01...` | Flagged-task approval only when a task names the owner | none |
| `07-tracking-setup` | In Progress | `work-plan` | Branch and worktree names; Salesforce component tracker rows | none | none |
| `08-build` | In Progress | `work-build` | The change | Hard entry gate: `build` and `data-load` need requirements approval | `builder` |
| `09-testing` | In Progress | `work-review` | Acceptance report per R-xx | none | `acceptance-checker` |
| `10-bug-fixing` | In Progress | `work-build` | Fixes, then back to `09` | none | `builder` |
| `11-user-approval` | In Progress | `work-review` shows the result; `work-approve` records the answer | Result approval | Result approval (`work-approve`) | none |
| `12-pr-and-push` | In Review | `work-release` | Pull request | Merge permission (`merge-and-clean-up`) | `acceptance-checker` when the merge rule needs an independent review |
| `13-deployment` | In Review | `work-release` (Salesforce: `sf-deploy-check` first) | Deploy result, or the command handed to the owner | Owner's yes to deploy | none |
| `14-spec-update` | In Review | `work-finish` | `requirements/<area>.md`, `DECISIONS.md` rows | Done approval (`work-finish`) | none |
| Done | Done | `work-finish` | Evidence | Owner's approval | none |
| Cancelled | Cancelled | `work-finish` | Reason | Owner's word | none |

Rules every owning skill follows (from lifecycle.md, printed by
`toolkit work lifecycle`, not restated in skills): stages may be skipped,
repeated, or revisited with one short reason; `Done` and `Cancelled` come only
from `work-finish`; approval survives later stages; a stage label alone does
not prove approval.

---

## 3. Owner gates

| # | Gate | When it comes | Asked and recorded by | How it is recorded | What enforces it | What does not count |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Delivery offer | First substantial start of a goal with no recorded choice | `work-delegate` (called by `work-start`) | Notes > Decisions and context, plus a Recent History row (`toolkit work history --note`) | Skill only | A quick question or one small edit gets no offer |
| 2 | Team arrangement | Right after the offer is accepted | `work-delegate` | Same place | Skill only | A no means no helpers |
| 3 | Archive finished chats | Only after the Main Orchestrator choice | `work-delegate` | Same place | Skill only | Archive only; never delete a chat |
| 4 | Requirements approval | End of `02-refinement` | `work-approve` (called by `work-requirements`) | `toolkit work approve <id> --requirements --by <name>` | CLI; PostToolUse hook feeds back a `build` or `data-load` item past `03` without it | A question, a suggestion, a tentative answer, a saved draft, an Agreed goal still holding the placeholder |
| 5 | Design approval | End of `04-solution-design` | `work-approve` (called by `work-design`) | `toolkit work approve <id> --design --by <name>` | CLI | Saving the draft |
| 6 | Flagged-task approval | A task whose "Done when" names the owner | `work-approve` (called by `work-build`) | Recent History row | Skill only | Completing the task |
| 7 | Result approval | `11-user-approval` | `work-approve` (called by `work-review`) | Recent History row today. Proposal: `toolkit work approve <id> --result --by <name>` (section 10) | Skill only today | Passing tests |
| 8 | Merge | `12-pr-and-push` | `merge-and-clean-up` (called by `work-release`) | PR state `MERGED`, history row | Owner's yes or a standing merge instruction recorded in the project; the merge-safety check | Delegation; an approved result |
| 9 | Deploy | `13-deployment` | `work-release` | History row with the result | Salesforce: `guard-protected-orgs` hook (production deny), `sf-deploy-check` | Delegation |
| 10 | Done | End of the item | `work-finish` | `toolkit work finish <id> --by <name> --evidence <text>` | CLI requires `--by` | Finished children; a merged PR |
| 11 | Cancel | Any time | `work-finish` | `toolkit work cancel <id> --reason <text>` | CLI requires `--reason` | Silence |
| 12 | Memory save of an inferred fact | Onboarding mode | `memory-save` | `toolkit memory save ... --approved-by <name>` | Stop hook nudge only | The agent's own inference |
| 13 | Memory delete | Owner asks | `memory-tidy` | `toolkit memory delete <key> --owner-approved` | CLI flag | Retire is not delete |
| 14 | Moves, re-parenting, archive | Owner asks | `work-organize` | `toolkit work move`, history rows | Skill only ("never on the agent's own initiative") | Agent tidiness |
| 15 | Creating tracker or memory structures outside the project | Project setup | `project-init` | `.toolkit.json` | Notion scripts refuse writes outside the AI Agent Second Brain root | A default answer |

An explicit owner instruction to remember something ("remember X", "from now
on Y") is itself the memory approval (ARCHITECTURE.md section 7).

---

## 4. Jobs outside the stages

| Job the owner would name | Skill |
| --- | --- |
| Log an idea or bug for later | `work-new` |
| Add a sub-item under an existing item | `work-new` (with `--parent`) |
| Start or resume something now | `work-start` |
| Hand the whole goal to agents | `work-delegate` |
| Where are we, what is waiting on me, what is next | `work-status` |
| Split an item into sub-items | `work-plan` (stage `05`) |
| Move, re-parent, regroup, archive; reconcile moves the owner made by hand | `work-organize` |
| Change a requirement after approval | `work-requirements`, which calls `work-approve` to reopen |
| Hand off to a fresh session | `handoff` |
| Resume from a handoff | `work-start` (reads the briefing and "Resume here") |
| Save, find, tidy memory | `memory-save`, `memory-find`, `memory-tidy` |
| Set up a project; check or repair setup; new computer | `project-init`, `project-sync` |
| What did I ask for in this chat; park a topic | `session-summary` |
| Play back a brain dump; explain simply; make text sound human | `braindump`, `explain-simply`, `unslop` |
| Git: get the latest, reset to remote, merge, publish a doc | `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `publish-docs` |
| Salesforce specialist, deploy check, component tracker, data change | `sf-architect-solutioning`, `sf-deploy-check`, `sf-component-tracker`, `sf-data-change` |

---

## 5. Skill entries

Each entry: plugin, exact description, stages or jobs, `toolkit` commands
(ARCHITECTURE.md section 5), agents, what it replaces, the hooks that back it,
and the steps the first 40 lines of its `SKILL.md` must carry.

**Shared references in the work plugin** (Proposal), so no step is written
twice. A plugin cannot reach files in another plugin, so these live in
`plugins/work/references/`:

- `trackers.md`: read `tracker.type` from `.toolkit.json`; `local` and `notion`
  use the CLI; `github` and `jira` follow the written instructions in the same
  file (issue body = `WORK-ITEM.md` body, fields = labels or native fields,
  sub-items = sub-issues or sub-tasks, design = a comment titled "Solution
  design"). Never create a second tracker or a local mirror.
- `capture.md`: the capture table (lifecycle.md "Capture during the
  conversation"), "save before moving past the topic", read back after every
  save, lead with "Not saved" or "Saved but not verified" when that is the
  result, never log routine commands.
- `helpers.md`: how to brief an agent (item id, task id, inputs, deliverable,
  done when, the files it may write), one writer per path, a reviewer never
  edits what it reviews, only the main agent updates the work item, and the
  Codex fallback: read `agents/<name>.md` from this plugin and pass its full
  text to a native worker; if no worker exists, do the work and say no
  independent check ran.
- `team-roles.md`: ported from `solution-design/references/team-roles.md`, with
  every agent on Opus.

Every skill that writes words the owner reads follows the Plain English style
(Claude Code output style) and the voice lines in `AGENTS.md` (Codex has no
output styles). One line in each skill says so; the V1 settings-file voice
lookup is dropped.

### 5.1 Front doors (work plugin)

#### `work-new`

- **Plugin:** work
- **Description:** "Captures a new idea, request, or bug as a work item at stage 01-discovery without starting it. Use when the owner says add this to the backlog, log this bug, save this idea for later, remind me to do X later, or add a sub-item under an existing item." (250)
- **Stages and jobs:** creates items at `01-discovery`; sub-item capture.
- **CLI:** `toolkit work list`, `toolkit work new --title --type [--parent] --stage 01-discovery`, `toolkit work validate <id>`.
- **Agents:** none.
- **Replaces:** V1 `work add` and the capture part of `work-tracker:work`.
- **Hooks:** PostToolUse validates the new record; the briefing lists it.
- **Steps:**
  1. Check for a duplicate with `toolkit work list`; if one matches, add the
     owner's words to it instead of creating a new item (ask only when unclear).
  2. Pick the type (`bug`, `build`, `research`, `task`, ...) and priority from
     the owner's words; set a parent only when the owner named one or the fit
     is plain.
  3. Run `toolkit work new --title <t> --type <type> [--parent <id>] --stage 01-discovery`.
  4. Write the owner's words, unchanged, into Requirements > Starting request.
     Add nothing the owner did not say.
  5. Set Next action (for example "Discovery interview with the owner") and
     leave `waiting_on: none`.
  6. Run `toolkit work validate <id>` and read the result.
  7. Reply in one line: "Logged as WI-014 (bug, backlog). Not started." Do not
     start the interview and do not make the delivery offer.

#### `work-start`

- **Plugin:** work
- **Description:** "Starts or resumes substantial work now: finds or creates its work item, reads where it stands, and hands over to the skill that owns its stage. Use when the owner says let's build or make X, work on X, pick up WI-12, continue where we left off, or do the next thing." (266)
- **Stages and jobs:** entry point for every stage; resume after a handoff.
- **CLI:** `toolkit brief`, `toolkit work list`, `toolkit work next`, `toolkit work show <id>`, `toolkit work lifecycle`, `toolkit work set <id> --stage --waiting-on`, `toolkit work history <id> --note`.
- **Agents:** none directly.
- **Replaces:** "Orient first" in `work-tracker:work`; "orient once and refresh on switch" in `work-guide`; the `work` skill line in the model's `AGENTS.md` and `work-item-stages.md`.
- **Hooks:** SessionStart briefing (active items, owning skill, moves detected).
- **Steps:**
  1. Small requests (one question, one small edit) get no work item and no
     offer: do them and stop here.
  2. Find the item: an id or title the owner named, the briefing, or
     `toolkit work next` for "do the next thing". If none exists and the work is
     substantial, create it the way `work-new` does, then continue.
  3. Read it with `toolkit work show <id>`: stage, status, `waiting_on`,
     `requirements_approved`, design status, Next action, Resume here, parent
     and sub-items, open questions addressed to the owner.
  4. If moves or validation errors were reported, send them to `work-organize`
     first.
  5. Apply the recorded delivery choice. If none is recorded and the item is
     substantial, follow `work-delegate` for the offer (once per goal).
  6. If the item is waiting on the owner, ask that one open question first,
     then continue with any work that does not depend on the answer.
  7. Look up the owning skill for the stage in `toolkit work lifecycle` and say
     it in one line: "WI-012 is at 02-refinement; continuing with
     work-requirements."
  8. Hand over to that skill. Change the stage only when the work really
     moves, with a history row when the move skips or revisits a stage.

#### `work-status`

- **Plugin:** work
- **Description:** "Reports where the project stands from the tracker and current focus: what is waiting on the owner, active items and their stages, blockers, and what comes next. Use when the owner asks where are we, what's waiting on me, what do you need from me, what's next, or show the board." (278)
- **Stages and jobs:** read-only, all stages.
- **CLI:** `toolkit brief`, `toolkit work list --waiting-on owner`, `toolkit work list --tree`, `toolkit work next`, `toolkit memory focus`.
- **Agents:** none.
- **Replaces:** `work status` and `work next` in `work-tracker:work`; the "where are we" trigger of `track-tasks`; the V1 orientation hook's on-demand use.
- **Hooks:** same data as the SessionStart briefing.
- **Steps:**
  1. Run `toolkit brief`; for detail run `toolkit work list --waiting-on owner`
     and `toolkit work list --tree`.
  2. Read current focus with `toolkit memory focus` (Waiting on the owner and
     Untracked to-dos hold things with no work item).
  3. Answer in this order: what is waiting on the owner (each with the exact
     question and the item id), active items with stage and next action,
     blockers, then what comes next (`toolkit work next`).
  4. Count as waiting on the owner: `waiting_on: owner`, Open Questions rows
     for the owner, designs with `status: proposed`, items at
     `11-user-approval`.
  5. For "show the board": local tracker, summarize `.work-items/DASHBOARD.md`;
     Notion, give the board link.
  6. Report moves the briefing detected and point to `work-organize`. Change
     nothing.

#### `work-delegate`

- **Plugin:** work
- **Description:** "Hands a goal to agents with the owner as product owner: makes the delivery offer, asks how the team is arranged, and runs helper agents through the stages. Use when the owner says you drive, take it from here, run it end to end, or use a team of agents." (253)
- **Stages and jobs:** gates 1 to 3; runs any stage through its owning skill with helpers.
- **CLI:** `toolkit work show <id>`, `toolkit work history <id> --note`, `toolkit work set <id> --waiting-on`, `toolkit work list --tree`.
- **Agents:** any, briefed per `references/helpers.md`; mostly `builder`, `researcher`, `acceptance-checker`.
- **Replaces:** `work-tracker/skills/work/references/agent-led-delivery.md` and `team-arrangements.md`; the helper and parallel-item parts of `work-guide`.
- **Hooks:** none specific.
- **Steps:**
  1. Read the goal's recorded delivery choice (Notes > Decisions and context).
     Quick questions and small edits get no offer.
  2. If no choice is recorded, ask exactly: "Would you like agents to take
     responsibility for delivering this, with you acting as product owner?" If
     the owner already said it in his own words ("you drive"), that is the
     acceptance; do not ask again.
  3. Record the answer: choice, goal scope, date, owner, and authority limits
     (no merge, deploy, spending, or publishing beyond what he gave). Reread it.
  4. After acceptance, ask the team question. In the Claude Code desktop app:
     "Do you want one team inside this chat, or do you want me to rename this
     chat to Main Orchestrator and coordinate other chats that each have their
     own team?" Anywhere else: "Shall I run one team of helpers inside this
     chat?" A no means no helpers.
  5. After the Main Orchestrator choice only, ask: "Do you want me to archive
     sessions after their task is fully complete, everything is merged and
     shipped, and you approved?" Archive only when all four hold.
  6. Run the goal stage by stage through the owning skills. The main agent
     plans, briefs, checks results, and is the only writer of the work item;
     helpers get written briefs; one writer per path.
  7. Stop at every owner gate: set `waiting_on: owner`, ask through
     `work-approve`, and keep working on anything that does not depend on the
     answer.
  8. Decline: normal help continues; offer again only if the goal grows a lot
     or the owner asks. Revoke: record it and treat it as a decline.
  9. Codex: plugin agents do not load; use the fallback in `helpers.md`.

### 5.2 Stage owners (work plugin)

#### `work-requirements`

- **Plugin:** work
- **Description:** "Interviews the owner one question at a time and writes the answers into a work item's requirements and open questions (stages 01-02). Use when the owner says grill me, brainstorm this, what should it do, or change a requirement, or when requirements are missing or unclear." (273)
- **Stages and jobs:** `01-discovery`, `02-refinement`; requirement changes after approval.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage 01-discovery|02-refinement --waiting-on owner|agent`, `toolkit work history <id> --note`, `toolkit work validate <id>`.
- **Agents:** `requirements-analyst` (before asking for approval), `researcher` (facts the owner cannot answer).
- **Replaces:** `session-skills:requirements-helper` (renamed and moved), `session-skills:grill-me` (merged), the pre-approval part of `spec-check`.
- **Hooks:** PostToolUse validates each save of `WORK-ITEM.md`.
- **Steps:**
  1. Read the item; set `01-discovery` (goal not agreed yet) or
     `02-refinement` (writing requirements).
  2. Restate the goal in one sentence and confirm it ("So the goal is X?").
     Write Agreed goal only after a yes.
  3. Ask one question at a time, in dependency order, each with a recommended
     answer. Push back when an answer works against the goal.
  4. Save each settled answer before the next question: R-xx blocks (Status,
     Applies to, Required behavior, Boundaries and exceptions, Acceptance
     check, Decision record) and the Acceptance list. Unanswered questions go in
     Open Questions as Q-xx rows with "Decision needed from: owner"; set
     `waiting_on: owner` while one is open.
  5. Build ideas go under Notes > Solution options and considerations, never in
     requirements. No file paths, tools, or versions in requirements.
  6. Facts the owner cannot answer: brief the `researcher` agent; do not guess.
  7. A change after approval: update the text, set that R-xx to Refining, and
     use `work-approve` to reopen (stage back to `02-refinement`).
  8. When no question is left, run `requirements-analyst`; fix or list each
     finding.
  9. Show the requirements in plain words and hand over to `work-approve`.
     This skill never records approval.

#### `work-approve`

- **Plugin:** work
- **Description:** "Records the owner's approval or rejection at a work item gate: requirements (stage 03), design, a flagged task, or the finished result (stage 11). Use when the owner says I approve, approved, sign off, go with option B, reject that, or reopen the requirements." (260)
- **Stages and jobs:** gates 4 to 7 (section 3); reopen and rejection.
- **CLI:** `toolkit work show <id>`, `toolkit work approve <id> --requirements|--design --by <name>`, `toolkit work set <id> --stage --waiting-on`, `toolkit work history <id> --note`.
- **Agents:** none (it reads the reports the analyst, critic, and checker produced).
- **Replaces:** "Apply the approval gate" in `work-tracker:work`; `work requirements --finalize/--reopen`; the approval rules in lifecycle.md.
- **Hooks:** PostToolUse feeds back gate violations; the briefing lists what is waiting.
- **Steps:**
  1. Name the gate: requirements, design, a flagged task, the result, or a
     reopen.
  2. Check the gate is ready. Requirements: Agreed goal written, no open Q-xx
     blocking an R-xx, analyst findings handled. Design: `status: proposed`,
     critic list empty, every R-xx covered. Result: the
     `acceptance-checker` report, every check passed or each gap named.
  3. Show the owner exactly what is being approved, in plain words, with known
     gaps and a link to the full text. Ask one yes-or-no question.
  4. Only the owner's explicit words count. A question, suggestion, tentative
     answer, or saved draft is not approval. Quote his words in the record.
  5. Record: `toolkit work approve <id> --requirements --by <name>` (moves to
     `03`, status Ready) or `--design --by <name>`; result and flagged-task
     approvals as history rows until the CLI has `--result`.
  6. Rejection or change: record the reason, then move back: requirements to
     `02-refinement`, design to `04-solution-design`, result to
     `10-bug-fixing`.
  7. Set `waiting_on: agent` and hand back to the owning skill.
  8. Approval never covers merge, deploy, spending, or publishing. Those stay
     separate yeses.

#### `work-design`

- **Plugin:** work
- **Description:** "Designs how a work item will be built (stage 04, after the requirements gate): checks readiness, runs researcher, architect, and critic agents, and writes the design with options. Use when the owner says design this, how should we build it, or show me options." (260)
- **Stages and jobs:** `04-solution-design`.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage 04-solution-design --waiting-on`, `toolkit work history <id> --note`, `toolkit work validate <id>`. Needs a design command (section 10, gap 3).
- **Agents:** `requirements-analyst`, `researcher` (one per question, in parallel), `design-architect` (one per option), `design-critic` (one per draft); the `sf-architect-solutioning` skill as the Salesforce specialist.
- **Replaces:** `session-skills:solution-design` (renamed and moved, with its template and `team-roles.md`); the design routing in `project-init:work-item-lifecycle`.
- **Hooks:** PostToolUse validates `DESIGN.md` (every R-xx heading exists in the item).
- **Steps:**
  1. Check `requirements_approved` is set. If not, stop and hand to
     `work-requirements` or `work-approve`.
  2. Set `04-solution-design`.
  3. Run `requirements-analyst`; say plainly "ready" or "not ready"; send gaps
     back to `work-requirements`.
  4. Agree the way of working in at most two questions, skipping any already
     recorded: built-in first or a specialized approach; one option or
     several; team size from `team-roles.md`.
  5. Create the design in its one home: `DESIGN.md` beside `WORK-ITEM.md`
     (local), the Solution Design child page (Notion), the "Solution design"
     comment (GitHub, Jira). Never `docs/designs/`.
  6. Run `researcher` agents for open questions, then one `design-architect`
     per option. For Salesforce work, add `sf-architect-solutioning` as the
     specialist; it returns findings and does not start its own interview.
  7. Run `design-critic` on each draft; repeat the fix round until its list is
     empty. A disagreement left after two rounds goes to the owner.
  8. Save with `status: proposed`; update Next action and `waiting_on: owner`;
     send project-wide decisions to `DECISIONS.md` and lasting lessons to
     `memory-save`.
  9. Hand over to `work-approve`. Saving the draft does not approve it.

#### `work-plan`

- **Plugin:** work
- **Description:** "Breaks a designed work item into phases, tasks, and sub-items and sets the build order (stages 05-07). Use when the owner says split this into smaller pieces, break it down, what order should we do this in, or plan the build." (225)
- **Stages and jobs:** `05-breakdown`, `06-implementation-plan`, `07-tracking-setup`; splitting into sub-items.
- **CLI:** `toolkit work new --parent <id> --title --type`, `toolkit work set <id> --stage 05|06|07`, `toolkit work list --tree`, `toolkit work validate`, `toolkit work history`.
- **Agents:** `researcher` (optional, for ordering or dependency questions).
- **Replaces:** the roadmap and task method in `work-guide`; `roadmap` and `task` commands in `work-tracker:work`.
- **Hooks:** PostToolUse validates task ids, dependencies, and phase status.
- **Steps:**
  1. Check requirements approval, and design approval or a recorded reason for
     skipping design.
  2. Decide what is too large: a piece becomes a sub-item when it needs its
     own requirements, design, or owner decision; otherwise it is a phase or a
     task.
  3. Create sub-items with `toolkit work new --parent <id>`; each child links
     the parent's R-xx ids and copies none of them. Set the parent to
     `05-breakdown`.
  4. Write the Roadmap (`P1`, `P2`: Outcome, Status, Exit result) and Tasks
     (`P1-T01`: Work, Deliverable, Done when, Depends on) from the design's
     Order of work. Set `06-implementation-plan`.
  5. Tracking setup only when needed (`07-tracking-setup`): branch and
     worktree names; Salesforce component tracker rows through
     `sf-component-tracker`.
  6. Run `toolkit work validate` and `toolkit work list --tree`.
  7. Show the plan in a few lines. No approval is needed unless a task names
     the owner in its Done when. Hand over to `work-build`.

#### `work-build`

- **Plugin:** work
- **Description:** "Implements a work item's planned tasks (stage 08) and fixes what testing found (stage 10). Refuses build or data-load work until the owner's requirements approval is recorded. Use when the owner says start building, implement the plan, or fix what failed." (255)
- **Stages and jobs:** `08-build`, `10-bug-fixing`.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage 08-build|10-bug-fixing`, `toolkit work history <id> --note`, `toolkit work validate <id>`.
- **Agents:** `builder` (one per task, in its own worktree), `researcher` for unknowns.
- **Replaces:** nothing directly (V1 used general task agents); the build gate from `work-tracker:work`; the before-build drift check from `spec-check`.
- **Hooks:** PostToolUse gate check (a `build` or `data-load` item past `03` without approval is fed back as an error).
- **Steps:**
  1. Gate: `toolkit work show` must show `requirements_approved` for `build`
     and `data-load` items. If not, stop and hand to `work-approve`.
  2. Reread the approved requirements, the approved design, and the current
     task. If the requirements changed after approval or hold build details,
     stop and raise it.
  3. Set `08-build`. Work in a worktree on a branch named for the item.
  4. Work task by task. With an accepted team, brief one `builder` per task
     with its task record and write scope; check each result yourself.
  5. Mark a task done only with evidence (tests run, files changed). Add a
     history row for meaningful steps, not routine commands.
  6. Salesforce: keep `sf-component-tracker` current as metadata changes;
     production data goes through `sf-data-change`; agents never write
     production data.
  7. When the phase's tasks are done, hand over to `work-review`.
  8. Findings from `work-review`: set `10-bug-fixing`, fix each one, then hand
     back to `work-review`.

#### `work-review`

- **Plugin:** work
- **Description:** "Checks a work item against its requirements: the spec before design or build, or the finished result against each acceptance check (stage 09), then shows it to the owner (stage 11). Use when the owner says check the spec, test it, or is this ready to ship." (256)
- **Stages and jobs:** `09-testing`, `11-user-approval` (presentation); spec check at any stage.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage 09-testing|11-user-approval --waiting-on owner`, `toolkit work history <id> --note`.
- **Agents:** `requirements-analyst` (spec check), `acceptance-checker` (result).
- **Replaces:** `session-skills:spec-check` (merged); the result and plan modes of `delivery-reviewer`.
- **Hooks:** none specific.
- **Steps:**
  1. Say what is being checked: the spec or the result.
  2. Spec check: run `requirements-analyst`. Flag text that works against the
     goal, build details in requirements, sentences with two readings, and
     requirements with no reason. Propose one fix per flag; change nothing
     without the owner's yes; a clean spec gets one line.
  3. Result check: set `09-testing`. Run `acceptance-checker` (never the agent
     that built it) against each R-xx Acceptance check and the design's "How
     to check it"; run the project's tests.
  4. Any failure: write the findings into the item and hand over to
     `work-build` (stage `10`).
  5. All passed: set `11-user-approval` with `waiting_on: owner`. Show what
     was built, how to see it, evidence per requirement, and known gaps.
  6. Ask for approval through `work-approve`.

#### `work-release`

- **Plugin:** work
- **Description:** "Releases a finished result the owner accepted: pushes the branch, opens the pull request (stage 12), hands any merge to merge-and-clean-up, and deploys (stage 13). Use when the owner says ship it, open a PR, push it, deploy it, or release it." (242)
- **Stages and jobs:** `12-pr-and-push`, `13-deployment`.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage 12-pr-and-push|13-deployment`, `toolkit work history <id> --note`.
- **Agents:** `acceptance-checker` when the project's merge rule requires an independent review of the exact head.
- **Replaces:** nothing directly; the "move the linked ticket" line in `merge-and-clean-up`.
- **Hooks:** Salesforce guard hooks on deploy commands; the machine-wide no-AI-credit guard on `gh pr create`.
- **Steps:**
  1. Check that the result approval is recorded. If not, hand over to
     `work-review`.
  2. Repository work: push the branch and open the pull request. Run the
     description through `unslop`; no AI credit. Set `12-pr-and-push`.
  3. Merge only with the owner's yes or a standing merge instruction recorded
     in the project, and only through `merge-and-clean-up`.
  4. Deployment: follow the project's deploy route. Salesforce: run
     `sf-deploy-check` first; agents never deploy to production, they hand the
     owner the command. Set `13-deployment`.
  5. Work with no repository or no deploy skips that stage, with a one-line
     reason.
  6. Record evidence (PR link, merge commit, deploy result) and hand over to
     `work-finish`.

#### `work-finish`

- **Plugin:** work
- **Description:** "Closes a work item: updates the lasting specs (stage 14), records evidence, marks it Done only with the owner's approval, or cancels it with a reason. Use when the owner says we're done, close it out, mark it done, cancel this, or drop it." (239)
- **Stages and jobs:** `14-spec-update`, Done, Cancelled.
- **CLI:** `toolkit work set <id> --stage 14-spec-update`, `toolkit work list --tree`, `toolkit work finish <id> --by <name> --evidence <text>`, `toolkit work cancel <id> --reason <text>`, `toolkit memory focus --set-file`, `toolkit memory save --type event`.
- **Agents:** none.
- **Replaces:** `work finish` in `work-tracker:work`; the closing checklist in `project-init:work-item-lifecycle`; the model's closeout rule in `requirements/AGENTS.md`.
- **Hooks:** Stop hook checks the changed item validates.
- **Steps:**
  1. Set `14-spec-update`. Merge only delivered and approved behavior into
     `requirements/<area>.md`; add project-wide decisions to `DECISIONS.md`;
     save both through `publish-docs`. Behavior that was approved but not
     delivered is not written as shipped.
  2. Check sub-items: each is Done or Cancelled, or the owner agrees to finish
     anyway. Finishing children never finishes the parent by itself.
  3. Give the owner a short result, known gaps, and evidence. An earlier clear
     approval of this result counts; otherwise ask.
  4. Run `toolkit work finish <id> --by <name> --evidence <text>`.
  5. Offer one `event` memory record only when the episode will matter later
     (through `memory-save`).
  6. Cancel only on the owner's word: `toolkit work cancel <id> --reason <text>`.
  7. Remove the item from current focus "Now". Do not move or archive the
     folder unless the owner asks (`work-organize`).

### 5.3 Structure (work plugin)

#### `work-organize`

- **Plugin:** work
- **Description:** "Reorganizes work items and reconciles changes the owner made by hand: moved, renamed, nested, or deleted item folders or Notion cards, sub-item links, groups, and archiving. Use when the owner says I moved some folders, make X a sub-item of Y, regroup these, or archive that." (275)
- **Stages and jobs:** any stage; sub-item links; hand moves.
- **CLI:** `toolkit work sync`, `toolkit work move <id> --under <id|group|root>`, `toolkit work set <id> --parent`, `toolkit work list --tree`, `toolkit work validate`, `toolkit work history <id> --note`. Needs adopt and renumber commands (section 10, gap 4).
- **Agents:** none.
- **Replaces:** folders, archive, and link parts of `work-tracker:work`; the procedure parts of the `work-item-folders.md` rule.
- **Hooks:** SessionStart and UserPromptSubmit move detection; PreToolUse refuses hand edits of `DASHBOARD.md` and `.toolkit-state.json`.
- **Steps:**
  1. Run `toolkit work sync` and read its report: moved, renamed, nested or
     un-nested, missing, duplicate id, record without an id.
  2. Say what the CLI already adapted (paths, parents from location, status
     from a dragged Notion Stage) and what needs the owner's intent.
  3. A folder moved into or out of another item changed its parent. When that
     changes the tree in a way the owner may not have meant, ask one batched
     question; moves between plain group folders need nothing.
  4. A missing item (folder deleted or moved out of `.work-items/`, Notion page
     moved out of the database or trashed): tell the owner and ask. Never
     recreate or restore without a yes.
  5. A copied folder with a duplicate id: renumber the newer copy. A record
     with no id, or a Notion card with an empty body: adopt it (fill from the
     template, stage `01-discovery`).
  6. Owner-requested changes: `toolkit work move <id> --under ...` or
     `--parent`; before moving a folder, say how many nested items move with it.
     Never move, regroup, or archive on the agent's own initiative.
  7. Run `toolkit work validate`, show the new tree with `toolkit work list
     --tree`, and add a history row on each item whose parent changed.

### 5.4 Memory plugin

#### `memory-save`

- **Plugin:** memory
- **Description:** "Saves what should outlast this session to the project's memory: a preference, correction, lesson, reference, glossary term, or current-focus note, under the approval policy. Use when the owner says remember this, from now on, always do X, never do X, or corrects a saved fact. Not for tasks." (291)
- **Stages and jobs:** any; the only writer of memory.
- **CLI:** `toolkit memory find`, `toolkit memory save --type --name --description --body-file|--body [--approved-by]`, `toolkit memory focus --set-file`.
- **Agents:** none (the model's curator is dropped).
- **Replaces:** `second-brain:knowledge-save`, the model's `memory-curator` agent and `memory-curator-dispatch.md` rule.
- **Hooks:** UserPromptSubmit adds the reminder line; Stop blocks once when the owner asked to remember and no save ran; PostToolUse reindexes `.memory/`.
- **Steps:**
  1. Choose the home first: a task goes to `work-new`; a decision about one
     item goes to that item; a project-wide decision goes to `DECISIONS.md`;
     a standing way of working is proposed as a rule change; only facts that
     outlive one item go to memory.
  2. Look for an existing record with `toolkit memory find` and update it
     rather than add a duplicate.
  3. Apply `memory.approval` from `.toolkit.json`. An explicit owner
     instruction is the approval: save now. Onboarding: a one-line card, save
     after yes. Trusted: save routine facts and report them. People, personal
     details, deletes, and bulk changes always ask.
  4. Write the record (type `user`, `feedback`, `project`, `reference`, or
     `event`; slug; one-line description; body Remember, Why, How to apply,
     Evidence and limits, Related) with `toolkit memory save`.
  5. Current focus: `toolkit memory focus --set-file`, keeping the four
     sections and under 50 lines, with no work-item status in it.
  6. Read the CLI result and lead with any failure ("Not saved", "Saved but
     not verified").
  7. Tell the owner in one line: "Saved to memory: <title>. Say 'forget that'
     to undo."

#### `memory-find`

- **Plugin:** memory
- **Description:** "Searches the project's memory, decision log, and records for what is already known, before asking the owner again. Use when the owner asks what did we decide, why did we, did we already, or what does a term mean, or when an earlier session may have settled the question." (270)
- **Stages and jobs:** any; read-only.
- **CLI:** `toolkit memory find <query>`, `toolkit memory get <key>`, `toolkit memory list`, `toolkit memory focus`, `toolkit work list`, `toolkit work show <id>`.
- **Agents:** none.
- **Replaces:** `second-brain:knowledge-find`; the System Guide lookup route (retired).
- **Hooks:** none.
- **Steps:**
  1. Run `toolkit memory find <query>`, then `toolkit memory get <key>` for each
     likely hit. A hit is a pointer; read the record.
  2. For decisions and behavior, also search `DECISIONS.md`,
     `requirements/`, and the work items (`toolkit work list`, `show`).
  3. Cite each answer with its source (record key, file, or item id) and date.
  4. Sources disagree: show both, keep the question open, and ask which holds;
     fix the wrong one afterwards with `memory-tidy`.
  5. Nothing found: say so, then ask the owner once.
  6. Hindsight or Notion unreachable: say so in one line and use what is
     available.

#### `memory-tidy`

- **Plugin:** memory
- **Description:** "Maintains the project's memory: retires stale or wrong records, restores them, merges duplicates, deletes only on the owner's word, and exports a backup. Use when the owner says forget that, that's outdated, clean up memory, or back up memory." (243)
- **Stages and jobs:** any; gate 13.
- **CLI:** `toolkit memory list`, `get`, `retire`, `restore`, `save` (merge), `delete <key> --owner-approved`, `export --to`, `import --from`; `toolkit doctor`.
- **Agents:** none.
- **Replaces:** `second-brain:knowledge-review`; `scripts/memory.py doctor` and `reindex`; the tidy role of the model curator.
- **Hooks:** PreToolUse refuses hand edits of `.memory/MEMORY.md`.
- **Steps:**
  1. "Forget that" right after a save: retire that record with
     `toolkit memory retire <key>`; no question.
  2. Stale or replaced records: retire with the replacing key; `restore` puts
     one back as `needs-review`.
  3. Duplicates: merge into one record with `toolkit memory save`, retire the
     rest.
  4. Delete only on the owner's explicit words, with `--owner-approved`, and
     quote the words.
  5. More than five changes, or anything about a named person: show the list
     and ask once.
  6. Backup: `toolkit memory export --to <folder>`; restore with `import`.
  7. Run `toolkit doctor` and report counts.

### 5.5 Toolkit plugin (project setup)

#### `project-init`

- **Plugin:** toolkit
- **Description:** "Sets up a new project with the toolkit: copies the scaffold, asks where to track work, which memory to use, and whether it is Salesforce, then writes AGENTS.md and rules to match. Use when the owner says set up this project, start a new project, or initialize the toolkit here." (277)
- **Stages and jobs:** project setup; gate 15.
- **CLI:** `toolkit machine-setup`, `toolkit init --name --key --tracker --memory [--salesforce] [--dir]`, `toolkit notion ensure-root`, `toolkit notion ensure-project`, `toolkit hindsight service install|status|start`, `toolkit hindsight ensure-bank`, `toolkit doctor`, `toolkit brief`.
- **Agents:** none.
- **Replaces:** `project-init:project-init` (751 lines, 6 gates), `second-brain:knowledge-setup`, the install parts of `hooks-library`, the PATH part of `machine-sync`.
- **Hooks:** installs the hook registrations; proves them with `toolkit brief`.
- **Steps:**
  1. Look first, silently: is the folder empty or existing; does
     `sfdx-project.json` exist (pre-answers Salesforce).
  2. Run `toolkit machine-setup` once per computer; report only what the
     chosen options need (Node always; `ntn` for Notion; Ollama and the
     Hindsight service for Hindsight).
  3. Ask one question at a time, each with a recommendation: tracker (local
     folders, Notion, GitHub Issues, Jira); memory (built-in, local Hindsight,
     Notion); Salesforce (yes or no, confirm when detected).
  4. Ask the project name and one sentence of purpose; propose the key and id
     prefix.
  5. Run `toolkit init ...`: scaffold without `.work-items/` and `.memory/`,
     `.toolkit.json`, `AGENTS.md` from the template, rules, settings, output
     style, hook registrations, plugin enablement (`sf-architect-solutioning`
     only for Salesforce).
  6. Backend setup: Notion, `ensure-root` and `ensure-project` (Mike has run
     `ntn login`); Hindsight, `hindsight service status` then `ensure-bank`;
     GitHub or Jira, show the written instructions and create nothing without
     a yes.
  7. Run `toolkit doctor` and `toolkit brief`; show both.
  8. Tell the owner the next steps: trust the hooks once in Codex (`/hooks`),
     start a new session, and use `work-start` for the first item.

#### `project-sync`

- **Plugin:** toolkit
- **Description:** "Checks and repairs the toolkit setup of an existing project and this computer: runs the doctor, adds missing scaffold files without overwriting changed ones, and fixes Notion or Hindsight links. Use when the owner says sync the toolkit, check my setup, or I have a new computer." (278)
- **Stages and jobs:** setup upkeep; new computer.
- **CLI:** `toolkit doctor`, `toolkit sync --dry-run`, `toolkit sync`, `toolkit machine-setup`, `toolkit notion ensure-project`, `toolkit hindsight service status|start`, `toolkit hindsight ensure-bank`.
- **Agents:** none.
- **Replaces:** `project-init:project-sync` (994 lines), `project-init:machine-sync`.
- **Hooks:** the briefing's setup warnings point here.
- **Steps:**
  1. Run `toolkit doctor` and `toolkit sync --dry-run`.
  2. Show one numbered table: problem, fix, and whether the fix changes a file
     the owner edited. Files the project changed are never overwritten; list
     them as "project ahead of the toolkit".
  3. Wait for a yes (all, or by number).
  4. Apply: `toolkit sync`; `toolkit machine-setup` for a new computer;
     `notion ensure-project` or the Hindsight service and bank commands for a
     broken backend link.
  5. Never change the tracker or memory choice in `.toolkit.json` here; that is
     a new decision for the owner.
  6. Run `toolkit doctor` again and report before and after.

### 5.6 Session skills plugin

#### `handoff`

- **Plugin:** session-skills
- **Description:** "Writes a checked prompt a fresh session can start from, after updating the active work item and saving memory. Use when the owner says write a handoff, I'm going to clear context, this session is getting long, or start a new session. /handoff check only verifies a prompt." (272)
- **Stages and jobs:** any stage; handoff between sessions.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --waiting-on`, `toolkit work history <id> --note`, `toolkit work validate`, `toolkit memory save`, `toolkit memory focus --set-file`.
- **Agents:** `handoff-verifier`.
- **Replaces:** `session-skills:handoff` (kept, steps 1, 2, 3, and 6 rewritten; 684-character description cut to 272).
- **Hooks:** the `offer-context-handoff.md` rule offers it; the briefing reads "Next session starts with" on the next start.
- **Steps:**
  1. Update the active work item: Current position, Next action and who owns
     it, Blockers, Resume here, true stage and `waiting_on`; validate and read
     back.
  2. Save memory through `memory-save` for anything the owner said this session
     that is not saved yet.
  3. Write "Next session starts with" in current focus
     (`toolkit memory focus --set-file`): one entry, replaced each handoff,
     whole file under 50 lines.
  4. Draft the prompt: the fixed first line ("This handoff prompt is
     AI-generated and may contain hallucinations, skewed context, etc. Please
     evaluate accordingly."), the goal, why it matters, where it is written
     down (item ids, not paths), the task, what to read first, unsaved
     decisions, open questions, one first action, and a source kind for every
     fact.
  5. Run `handoff-verifier` and fix every Wrong, Unchecked, Missing, or Skipped
     finding. Codex: pass the role file text to a native worker.
  6. Show what was saved (lead with anything not saved) and the prompt in one
     fenced block.
  7. "/handoff check": run only step 5 on a pasted prompt.

#### `session-summary`

- **Plugin:** session-skills
- **Description:** "Lists what the owner asked for in this chat and where each request stands, and keeps parked topics on that list. Use when the owner says recap this chat, what did I ask for, what did we do today, park that, add that to the list, or what's still open in this chat." (263)
- **Stages and jobs:** chat-level list; no tracker writes.
- **CLI:** none.
- **Agents:** none.
- **Replaces:** `session-skills:session-summary` and `session-skills:track-tasks` (merged).
- **Hooks:** none.
- **Steps:**
  1. Rescan the chat for real requests (not steps), parked topics, unanswered
     questions, blocked work, and background agent work.
  2. Claude Code: keep the list in the built-in task list (`TaskCreate`,
     `TaskUpdate`, `TaskList`). Codex: rebuild it from the chat each time.
  3. "Park that" adds a parked entry; "close that" marks it done or dropped.
  4. Print the table: `#`, What you asked, Status (the eight fixed statuses),
     Where it landed (item id, file, or commit).
  5. Then "Still open, and it needs you".
  6. Say the list ends with the chat; offer once to turn surviving entries into
     work items (`work-new`) or current-focus to-dos (`memory-save`).

#### `braindump`

- **Plugin:** session-skills
- **Description:** "Plays back a loose brain dump in very simple words and confirms the understanding before any work starts. Use when the owner types /braindump, pastes a long spoken-style dump, or says here's a brain dump, play that back, or tell me what you heard." (247)
- **Stages and jobs:** before any stage.
- **CLI:** none.
- **Agents:** none.
- **Replaces:** `session-skills:braindump` (kept; voice lookup replaced by the shared line).
- **Steps:**
  1. No work before the owner confirms.
  2. Play back the big idea in one or two sentences.
  3. Number each separate ask.
  4. Say what is unclear ("I think you mean X, but you might mean Y").
  5. Ask the questions, each with a recommended answer.
  6. A correction replays only the corrected part.
  7. After the yes, route each project ask to `work-new` (later) or
     `work-start` (now).

#### `explain-simply`

- **Plugin:** session-skills
- **Description:** "Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and file path. Use when the owner types /explain-simply or says explain that like I'm five, simpler, or put that in plain bullets." (239)
- **Stages and jobs:** any.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:explain-simply` (kept as is).
- **Steps:**
  1. Take the named thing, or the last substantial answer.
  2. Bullets only: one idea per bullet, one line each, 4 to 6 bold-headed
     groups, about 25 bullets at most.
  3. Simplify the words, never the facts: every number, name, and path stays.
  4. Do not research again.
  5. End with a numbered "What I need from you" only when there is an action.

#### `unslop`

- **Plugin:** session-skills
- **Description:** "Removes the patterns that make writing read as machine-written and returns a human-sounding version with every fact kept. Use when the owner says unslop this, this reads like AI, or make this sound human, and before text goes to another person (email, PR description, client file)." (281)
- **Stages and jobs:** any; outbound text (`work-release` PR descriptions).
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:unslop`; the `humanizer` name in the model's `humanize-outbound-text.md` rule (the rule is rewritten to name `unslop`, and "Runs only when asked, never on its own" is removed so the rule and the description agree).
- **Steps:**
  1. Read the style first; the style wins on a conflict.
  2. Scan the 31 patterns in six groups.
  3. Rewrite; add a human voice back; ask "What still makes this read as
     machine written?"
  4. Never change numbers, paths, names, ids, quotes, or code.
  5. Show a findings list (about 25 lines at most) and the rewrite; write to a
     file only after a yes.

### 5.7 Git workflows plugin

#### `merge-and-clean-up`

- **Plugin:** git-workflows
- **Description:** "Merges a reviewed GitHub pull request once the merge is allowed, updates the base checkout, removes only that PR's branches and worktree, and moves its work item to the next stage. Use when the owner says merge it, merge and clean up, land this PR, or remove the worktree after merging." (286)
- **Stages and jobs:** gate 8; end of `12-pr-and-push`.
- **CLI:** `toolkit work set <id> --stage 13-deployment|14-spec-update`, `toolkit work history <id> --note`.
- **Agents:** none.
- **Replaces:** kept from V1; `CLAUDE.md` mention dropped; lifecycle step and merge-safety check added.
- **Hooks:** machine-wide no-AI-credit guard.
- **Steps:**
  1. Resolve the exact PR and its worktree; the local head must equal the PR
     head.
  2. Check the merge is allowed: the owner's yes or a recorded standing merge
     instruction.
  3. Merge-safety check: compare `git diff --name-only <default>...<branch>`
     with `git status` in the primary checkout; a file in both stops the merge
     and is named to the owner.
  4. Preflight (open, not draft, mergeable, checks), then
     `gh pr merge --squash --delete-branch` (no admin flags); confirm `MERGED`.
  5. Fetch, prune, and fast-forward the clean base checkout.
  6. Remove only that PR's worktree and branches after the V1 proofs.
  7. Move the item to `13-deployment`, or `14-spec-update` when nothing
     deploys, with a history row holding the merge commit. Never Done.

#### `publish-docs`

- **Plugin:** git-workflows
- **Description:** "Commits and pushes a documentation-only change the owner agreed to (requirements/, docs/, PROJECT.md, PROJECT-ROADMAP.md, DECISIONS.md, delivery/, ai-external-knowledge/) to the default branch from an isolated worktree. Use when saving such a document; not for code, rules, or .memory/." (286)
- **Stages and jobs:** `14-spec-update`; any documentation save the `knowledge-direct-commit.md` rule routes here.
- **CLI:** none (its own `scripts/publish-docs.mjs`).
- **Agents:** none.
- **Replaces:** kept from V1; the script's path lists are rewritten for V2 homes, the `knowledge/` generated-index list is dropped, and the knowledge pre-commit hook check is removed (it would refuse every `PROJECT.md` save).
- **Steps:** V1's steps unchanged: decide it is documentation only; `start`
  a sparse detached worktree; edit; check; stage by name; `publish`, which
  refuses other staged paths and a moved remote, pushes without force, and
  verifies the remote. `.memory/` and `.work-items/` never use it.

#### `pull-latest`

- **Plugin:** git-workflows
- **Description:** "Brings a shared local checkout up to date with its remote safely: fetch, then fast-forward or a merge pull; never rebase, reset, or push. Use when the owner says get the latest, pull the latest changes, update from origin, or grab what others pushed." (250)
- **Replaces:** kept from V1; "sync with remote" removed (it was also a `reset-to-remote` trigger); em dashes removed; 723 characters cut to 250.
- **CLI:** none. **Agents:** none.
- **Steps:** V1's steps unchanged: stop on a dirty tree or an unexpected
  branch in the shared checkout; `git fetch --prune origin`;
  `git pull --ff-only`; when diverged, show both sides and
  `git pull --no-rebase --no-edit`; never push; report incoming commits.

#### `reset-to-remote`

- **Plugin:** git-workflows
- **Description:** "Resets a local repository to exactly match its remote after showing the plan and waiting for a yes: hard-resets tracking branches, deletes branches whose remote is gone, and reinstalls dependencies. Use only when the owner says wipe local, match remote exactly, or fresh start from remote." (289)
- **Replaces:** kept from V1; "sync with remote" removed; 741 characters cut to 289.
- **CLI:** none. **Agents:** none.
- **Steps:** V1's steps, plus one line: in the shared primary checkout, run
  only when the owner asked for this reset in his own words.

### 5.8 Salesforce

#### `sf-architect-solutioning`

- **Plugin:** sf-architect-solutioning (enabled only in Salesforce projects)
- **Description (proposed, needs Mike's yes):** "Acts as a certified Salesforce Technical Architect: verifies platform facts against official Salesforce documentation and plans objects, Flows, Apex, and permissions. Use when work-design needs a Salesforce specialist, or the owner asks a Salesforce platform question such as Flow or Apex." (289)
- **Why a change is proposed:** GOAL.md says port it "as is". Its current
  description (about 600 characters) triggers on "architect this", "solution
  this requirement", "design this feature", and "how to build something in
  Salesforce", which are `work-design`'s triggers. Firing it first starts its
  own five-phase interview and plan template instead of `DESIGN.md`. The body
  already says to return findings when `solution-design` coordinates. The
  proposal changes only the description and the one skill name inside the body
  (`solution-design` to `work-design`). If Mike keeps it fully as is, the
  fallback is the `AGENTS.md` Salesforce line "Design goes through work-design"
  and accepting one known collision.
- **Stages and jobs:** `04-solution-design` (specialist inside `work-design`); Salesforce platform questions at any stage.
- **CLI:** none. **Agents:** none.
- **Steps:** unchanged five phases (Intake, Project context, Verify, Design,
  Plan). "No code without a plan. No plan without clear requirements. No
  platform claim without a source."

#### `sf-deploy-check` (project-local, `.claude/skills/` and `.agents/skills/`)

- **Description:** "Runs the hitch-hiker check that finds components or pending edits that a Salesforce deploy would include before their feature is ready. Use before any deploy or validate to a shared sandbox or production, and before handing the owner a production deploy command." (262)
- **Stages and jobs:** `13-deployment` (required step inside `work-release`); also any validate to a shared org.
- **CLI:** `toolkit work show <id>` for each work item named in the component tracker rows.
- **Agents:** none.
- **Replaces:** the model copy (identical to V1), description shortened.
- **Steps:** the model's five check steps, with one V2 change: an item counts
  as ready only when `toolkit work show` reports its result approval (stage
  `11` passed). Then narrow the deploy set and finish with the read-only org
  check. Never deploy to production; hand the owner the command.

#### `sf-component-tracker` (project-local)

- **Description:** "Updates the Salesforce component tracker CSV, the master and per-work-item package.xml, destructiveChanges.xml, and manual steps to match metadata changes. Use when metadata under force-app/ is added, changed, renamed, or deleted, or when a deploy landed or failed." (265)
- **Stages and jobs:** `07-tracking-setup`, `08-build`, `10-bug-fixing`, `13-deployment` (landed or failed).
- **CLI:** `toolkit work show <id>` (the Work Item column holds the item id).
- **Agents:** none.
- **Replaces:** the model copy, description shortened.
- **Steps:** the model's four steps; rows keep the fixed nine columns; the
  per-item folder under `delivery/deployment/` is named by the item id.

#### `sf-data-change` (project-local)

- **Description:** "Prepares the owner's handoff package for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, filed under delivery/data/. Use when production records must be created, updated, upserted, or deleted, or a backup is needed first." (276)
- **Stages and jobs:** `08-build` for `data-load` items; `13-deployment` when the owner runs the load.
- **CLI:** `toolkit work history <id> --note`, `toolkit work set <id> --waiting-on owner`.
- **Agents:** none.
- **Replaces:** the model version (no per-event README; details go in the work item).
- **Steps:** the model's four steps (build the package, write the steps, file
  it, hand over), plus: record the event in the work item and set
  `waiting_on: owner`. Agents never write production data.

---

## 6. Agents

All agents run on Opus (`model: opus`), carry their own Plain English rules
(subagents never receive the output style), never spawn other agents, never
interview the owner, and never add AI credit. Claude Code loads them from the
plugin's `agents/` folder. Codex does not load plugin agents
(platform-best-practices.md 3.5), so each calling skill uses the fallback in
`references/helpers.md`. Proposal for later: `project-init` could generate
`.codex/agents/<name>.toml` from these files; this draft does not require it.

| Agent | Plugin | Job | Tools | Writes | Used by | Replaces |
| --- | --- | --- | --- | --- | --- | --- |
| `requirements-analyst` | work | Checks a work item's requirements: gaps, sentences with two readings, build details, drift from the goal, misreading risks. Returns ready or not ready with a fix per finding. | Read, Glob, Grep, Bash (read-only: `toolkit work show`, `list`) | Nothing | `work-requirements`, `work-design`, `work-review` | `design-product-analyst`; requirements mode of `delivery-reviewer`; the `spec-check` checklist |
| `researcher` | work | Answers one bounded question from project evidence, official docs, and community sources, each finding labeled by source type. | Read, Glob, Grep, WebSearch, WebFetch, Bash (read-only) | Nothing | `work-requirements`, `work-design`, `work-plan`, `work-build` | `delivery-researcher` and `design-researcher` (merged; Sonnet default removed) |
| `design-architect` | work | Writes or fixes one design option from the requirements, research, and existing build. | Read, Glob, Grep, WebSearch, WebFetch, Write, Edit | Only its named option in `DESIGN.md` (local); returns text for Notion, which the main agent saves | `work-design` | `design-architect` (kept) |
| `design-critic` | work | Gives one verdict per requirement for a draft design, with evidence and a fix list. | Read, Glob, Grep, WebSearch, WebFetch | Nothing | `work-design` | `design-critic` (kept) |
| `builder` | work | Implements one planned task in its own worktree, runs its checks, and returns what changed with evidence. | Read, Glob, Grep, Edit, Write, Bash; `isolation: worktree` | Only the files in its brief | `work-build`, `work-delegate` | New (V1 used general task agents) |
| `acceptance-checker` | work | Checks a finished result against each R-xx Acceptance check and the design's "How to check it"; runs tests; returns pass or fail per requirement. Never the agent that built it. | Read, Glob, Grep, Bash (tests and read-only commands) | Nothing | `work-review`, `work-release` | Result and plan modes of `delivery-reviewer` |
| `handoff-verifier` | session-skills | Checks a drafted handoff prompt states the goal and that every fact holds up. | Read, Glob, Grep, Bash (read-only, including `toolkit work show`, `toolkit memory get`, `gh ... view`) | Nothing | `handoff` | `handoff-verifier` (kept; `inherit` changed to Opus) |

The three checkers map to the three artifacts in the lifecycle: requirements
(`requirements-analyst`, stage 02), design (`design-critic`, stage 04), result
(`acceptance-checker`, stage 09).

Dropped: the model's `memory-curator` (ARCHITECTURE.md call 6).

---

## 7. Current toolkit skills: disposition

### 7.1 Session skills (the eleven the task asks about)

| Current skill | Decision | V2 name and plugin | Reason |
| --- | --- | --- | --- |
| `braindump` | Keep | `braindump`, session-skills | One-shot playback with no writes; no overlap once `grill-me` is merged. After the yes it routes to `work-new` or `work-start`. |
| `explain-simply` | Keep | `explain-simply`, session-skills | Reading-level rewrite; no other skill does it. Unchanged. |
| `grill-me` | Merge | into `work-requirements`, work | Same job (one question at a time, save each answer before the next). Its output folder `brainstorms/` does not exist in V2. "Grill me" stays a trigger. |
| `handoff` | Keep, rewrite | `handoff`, session-skills | Unique job. Steps 1, 2, 3, 6 rewritten for V2 work items, `memory-save`, and current focus; description cut from 684 to 272 characters; Codex fallback added for the verifier. The name stays because the model's `offer-context-handoff.md` rule uses it. |
| `requirements-helper` | Rename and move | `work-requirements`, work | It owns stages 01-02. "PRD" no longer exists in V2; the requirements live in the work item. The `work-` prefix puts it in the lifecycle menu. |
| `session-summary` | Keep, absorb `track-tasks` | `session-summary`, session-skills | Chat-level recap. Description cut from 656 to 263 characters; "being handed off" removed (that is `handoff`). |
| `solution-design` | Rename and move | `work-design`, work | It owns stage 04. Paths change (no `docs/designs/`, no `prds/`); researcher runs on Opus. The readiness gate and critic loop are kept unchanged. |
| `spec-check` | Merge | into `work-review` (spec check), called by `work-requirements` and `work-build` | Its V1 paths are gone; one reviewer skill checks all three artifacts. The owner phrase "check the spec" stays with `work-review`. |
| `track-tasks` | Merge | into `session-summary` | Its triggers overlapped `session-summary` ("where are we", "what is still open"); Codex has no `TaskCreate`; both describe the same thing, this chat's requests. "Where are we" moves to `work-status`. |
| `unslop` | Keep, align | `unslop`, session-skills | The `humanize-outbound-text.md` rule named a `humanizer` skill that does not exist. The rule now names `unslop`, and the description allows use for outbound text. |
| `work-guide` | Retire | content moves to `work-start` (orient, resume), `work-delegate` (helpers, parallel items, Codex fallback), `work-plan` (task fields), and `references/capture.md` (Notes discipline, "Not saved" wording) | Its job was the same as `work` and `work-item-lifecycle`; the picker could not tell them apart. |

### 7.2 Other current skills

| Current skill | Decision | V2 home | Reason |
| --- | --- | --- | --- |
| `work-tracker:work` | Split | the 13 `work-*` skills; tracker mechanics move into the `toolkit` CLI | One 231-line skill with 1,100 lines of references covered every stage; V2 gives each stage and gate one owner. |
| `project-init:project-init` | Keep, rewrite | `project-init`, toolkit | Three questions instead of six gates (GOAL.md). |
| `project-init:project-sync` | Keep, rewrite | `project-sync`, toolkit | Built on `toolkit doctor` and `toolkit sync` instead of a 994-line audit. |
| `project-init:machine-sync` | Retire | `toolkit machine-setup`, run by `project-init` and `project-sync` | The V2 machine needs are the command link and backend checks. |
| `project-init:work-item-lifecycle` | Merge | closing checklist into `work-finish`; routing into the `AGENTS.md` "Where information goes" table | Overlapped the work skills; its `docs/designs/` route is forbidden in V2. |
| `second-brain:knowledge-save` | Replace | `memory-save` | One writer through the CLI; three backends. |
| `second-brain:knowledge-find` | Replace | `memory-find` | Same job, V2 homes. |
| `second-brain:knowledge-review` | Replace | `memory-tidy` | Same job, V2 record states. |
| `second-brain:knowledge-setup` | Replace | `project-init` memory question and `toolkit init --memory` | Setup is a CLI step. |
| `system-guide:system-guide` | Retire | none | Not in the port list (ARCHITECTURE.md call 10). |
| `hooks-library:hooks-library` | Retire | hooks registered by `toolkit init` | V2 hooks ship in the toolkit plugin; Salesforce guards are project hooks. |
| `git-workflows:*` (4) | Keep | section 5.7 | Descriptions trimmed and V2 lines added. |
| `sf-architect-solutioning` | Keep | section 5.8 | Body as is; description change proposed for Mike. |
| `sf-deploy-check`, `sf-component-tracker`, `sf-data-change` | Keep | project-local, section 5.8 | Model versions; descriptions shortened to under 300 characters. |

### 7.3 Current agents

| Current agent | Decision |
| --- | --- |
| `delivery-researcher`, `design-researcher` | Merged into `researcher` |
| `delivery-reviewer` | Split into `requirements-analyst` (requirements and plan) and `acceptance-checker` (result) |
| `design-product-analyst` | Renamed `requirements-analyst`, widened to the spec check |
| `design-architect`, `design-critic` | Kept |
| `handoff-verifier` | Kept, Opus |
| `memory-curator` (model) | Dropped |

---

## 8. Trigger-collision check

Each message is something the owner would plausibly type. "Fires" is the one
skill that should run. "Nearest competitor" includes skills from other plugins
installed on Mike's machine.

| # | Owner message | Fires | Nearest competitor | Why the right one wins |
| --- | --- | --- | --- | --- |
| 1 | "Where are we?" | `work-status` | `session-summary`, `work-start` | "where are we" is only in `work-status`; `session-summary` is limited to "this chat". |
| 2 | "Let's build the login page." | `work-start` | `work-build` (name), `work-new`, `superpowers:brainstorming`, `feature-dev` | "let's build or make X" is in `work-start` only. `work-build` lists "start building" and its step 1 hands back when no approved item exists. `AGENTS.md` names `work-start` as the front door (section 8.3). |
| 3 | "Remember I hate tabs." | `memory-save` | `work-new` | A preference, not a task; the UserPromptSubmit hook adds the `memory-save` line. |
| 4 | "I moved some folders around." | `work-organize` | `work-status` | Exact phrase in `work-organize`; `work-status` only reports moves. |
| 5 | "Is this ready to ship?" | `work-review` | `work-release`, `code-review` | Exact phrase in `work-review`; it is a question about readiness. `work-release` step 1 hands back when no result approval exists. |
| 6 | "Split this into smaller pieces." | `work-plan` | `work-new`, `work-organize` | Exact phrase; breakdown is stage 05. |
| 7 | "What do you need from me?" | `work-status` | `session-summary`, `work-approve` | Exact phrase; answered from `waiting_on: owner` and open questions. |
| 8 | "Log a bug: the export button does nothing. Not now." | `work-new` | `work-start`, `superpowers:systematic-debugging` | "log this bug"; "not now" rules out starting. |
| 9 | "Pick up WI-12 where we left off." | `work-start` | `handoff`, `work-status` | "pick up" and "continue where we left off" are `work-start` phrases. |
| 10 | "You drive, I'll just approve things." | `work-delegate` | `work-approve` | "you drive" names the job; `work-approve` triggers are acts of approving, not handing over. |
| 11 | "Grill me on the checkout flow." | `work-requirements` | `superpowers:brainstorming`, `braindump` | "grill me" is only in `work-requirements`. |
| 12 | "The requirements look good. Approved." | `work-approve` | `work-requirements` | "approved" appears only in `work-approve` (other descriptions were reworded to avoid it). |
| 13 | "How should we build this?" | `work-design` | `sf-architect-solutioning`, `work-plan`, `superpowers:writing-plans` | Exact phrase; with the proposed description the Salesforce skill is only a specialist inside `work-design`. |
| 14 | "Go with option B." | `work-approve` | `work-design` | "go with option B" is a design approval. |
| 15 | "OK, start building." | `work-build` | `work-start` | "start building" is only in `work-build`. |
| 16 | "Ship it." | `work-release` | `merge-and-clean-up`, `work-review`, `superpowers:finishing-a-development-branch` | Exact phrase; merging is handed to `merge-and-clean-up` inside the skill. |
| 17 | "Merge it and clean up." | `merge-and-clean-up` | `work-release` | "merge" appears only in `merge-and-clean-up`'s triggers. |
| 18 | "We're done with this one, close it out." | `work-finish` | `work-release`, `superpowers:finishing-a-development-branch` | "we're done" and "close it out" are `work-finish` phrases. |
| 19 | "Make WI-7 a sub-item of WI-3." | `work-organize` | `work-plan`, `work-new` | Re-parenting an existing item; `work-new` adds a new sub-item, `work-plan` splits. |
| 20 | "What did we decide about the pricing tiers?" | `memory-find` | `work-status` | "what did we decide" is only in `memory-find`. |
| 21 | "Forget that, it's wrong." | `memory-tidy` | `memory-save` | "forget that" is only in `memory-tidy` (`memory-save` only mentions it in its reply text, not its description). |
| 22 | "I'm going to clear context. Write a handoff." | `handoff` | `session-summary`, built-in `/compact` | Exact phrases. |
| 23 | "Recap what I asked for in this chat." | `session-summary` | built-in `/recap`, `work-status` | "recap this chat" and "what did I ask for". |
| 24 | "Remind me to add tests to the importer later." | `work-new` | `memory-save` | "remind me to do X later"; project work belongs in the tracker. The hook's regex matches "remember", not "remind". |
| 25 | "Deploy it to the sandbox." (Salesforce project) | `work-release` | `sf-deploy-check` | "deploy it" is `work-release`'s phrase; `sf-deploy-check` has no owner phrase and runs as `work-release`'s required step and under the `deploy-hitchhiker-check.md` rule. |

### 8.1 Further pairs to test (not part of the 25)

| Owner message | Fires | Competitor |
| --- | --- | --- |
| "Explain that like I'm five." | `explain-simply` | none |
| "This email reads like AI." | `unslop` | `explain-simply` |
| "Check my setup." | `project-sync` | `work-status` |
| "Set up this project." | `project-init` | built-in `/init` |
| "Here's a brain dump: ..." | `braindump` | `work-requirements` |
| "Get the latest." | `pull-latest` | `reset-to-remote` |
| "Wipe local and match remote." | `reset-to-remote` | `pull-latest` |
| "Park that." | `session-summary` | `work-new` ("save this idea for later") |
| "Change R-02 so only admins can export." | `work-requirements` | `work-approve` |
| "The tests are failing, fix it." (item at 09 or 10) | `work-build` | `superpowers:systematic-debugging` |
| "Check the spec." | `work-review` | `work-requirements` |
| "Back up memory." | `memory-tidy` | none |
| "Do you remember what we decided about pricing?" | `memory-find` | `memory-save` (the hook must not fire on "do you remember"; section 10) |
| "What's next?" / "Do the next thing." | `work-status` / `work-start` | each other |
| "Which Flow type fits this?" (Salesforce) | `sf-architect-solutioning` | `work-design` |
| "Brainstorm the onboarding flow." | `work-requirements` | `superpowers:brainstorming` |

### 8.2 Collisions with skills from other plugins

These cannot be removed by Toolkit V2's own descriptions.

| Outside skill | Competes with | Handling |
| --- | --- | --- |
| `superpowers:brainstorming` ("You MUST use this before any creative work") | `work-start`, `work-requirements` | `AGENTS.md` front-door line; V2 descriptions name the work item. |
| `feature-dev:feature-dev` | `work-start` | Same. |
| `superpowers:writing-plans` | `work-plan`, `work-design` | V2 descriptions name the stages. |
| `superpowers:finishing-a-development-branch` | `work-release`, `work-finish`, `merge-and-clean-up` | Same. |
| `code-review`, `superpowers:requesting-code-review`, built-in `/review` | `work-review` | `work-review` checks against requirements, not a diff. The two can run together. |
| `superpowers:systematic-debugging`, `superpowers:test-driven-development` | `work-build` | Complementary; `work-build` may use them but does not depend on them. |
| `anthropic-skills:consolidate-memory` | `memory-tidy` | That skill works on Claude's auto memory, which V2 projects turn off (`autoMemoryEnabled: false`). |
| built-in `/recap`, `/memory`, `/init` | `session-summary`, `memory-*`, `project-init` | No V2 name equals a built-in command name (checked against platform-best-practices.md 2.12). |

### 8.3 Mitigations this check depends on

1. `AGENTS.md` "Every session" block names the front doors, because it is
   always loaded and descriptions may be dropped. Proposed text: "Before
   creating or changing anything substantial, use the `work-start` skill; it
   finds the work item and hands over to the skill that owns its stage. For
   status and what is waiting on the owner, use `work-status`. To keep
   something for later sessions, use `memory-save`; to look something up,
   `memory-find`."
2. Step 1 of each stage skill checks its entry condition and hands back to
   `work-start` or the right skill when the picker chose wrong
   (`work-build`, `work-release`, `work-design`).
3. The UserPromptSubmit hook's line changes to "The owner stated something to
   keep; save it with memory-save, or use work-new if it is a task." Its
   pattern must not match "do you remember".
4. `sf-architect-solutioning` enabled only in Salesforce projects.

---

## 9. Checks run on this draft

Run with a small Node script over the 31 names and descriptions (scratchpad
copy, not shipped):

- Names: all match `^[a-z0-9]+(-[a-z0-9]+)*$`; the longest is
  `sf-architect-solutioning` (24 characters).
- Descriptions: shortest 225 (`work-plan`), longest 291 (`memory-save`);
  none over 300; every one starts with a third-person verb.
- Trigger overlap: for every trigger phrase in a "Use when" clause, the script
  searched every other description. The final draft has no hits. The first
  pass found four, which this draft fixes: "work on" (inside `work-new`),
  "approved" (used as a state word in six descriptions), "remember" (inside
  `memory-find`'s "do you remember"), and "never" (inside `pull-latest`).
- Listing size: about 8,700 characters for all 31 names and descriptions,
  about 2,200 tokens. Claude Code's listing budget is 1% of the context window
  (2,000 tokens at 200,000; 10,000 at 1,000,000) and is shared with every other
  installed plugin; Codex's is 2% of the context window, or 8,000 characters
  when the window is unknown. On Mike's machine some descriptions will be
  dropped. That is why names must work alone and why mitigation 1 in 8.3
  matters. Mike could also raise `skillListingBudgetFraction` in project
  settings (his call; not assumed here).

Fallback if the independent checker finds the list too long: merge `work-new`
into `work-start` (a "log it, do not start" branch) and `work-delegate` into
`work-start` (the offer is already its step 5). That gives 11 work skills and
26 in total, at the cost of less specific names.

---

## 10. Gaps found in ARCHITECTURE.md, and calls made

### 10.1 Command and hook gaps the skills above depend on

1. **Result approval has no command.** Stage 11 needs
   `toolkit work approve <id> --result --by <name>` so the briefing,
   `work-release`, and `sf-deploy-check` can read it instead of a history row.
2. **Notion items have no body-edit command.** Local items are edited as files
   and checked by the PostToolUse hook. Notion items need
   `toolkit work edit <id> --section "<heading>" --body-file -`, plus setters for
   the most frequent writes: `toolkit work set <id> --next-action <text>
   --blockers <text> --position <text>`. Handoff, every stage move, and the
   delivery choice write these fields.
3. **Designs have no command.** The work plugin cannot read the toolkit
   plugin's `templates/DESIGN.md`. Needed:
   `toolkit work design <id> --create | --body-file - | --status proposed|approved`
   (local `DESIGN.md`, or the Notion Solution Design page).
4. **Adopt and renumber are missing.** `work-organize` needs
   `toolkit work adopt <path|notion-page>` (a record with no id, or a Notion
   card with an empty body) and `toolkit work renumber <path>` (a copied folder
   with a duplicate id). Either can be options of `toolkit work sync`.
5. **Archive is not defined.** ARCHITECTURE.md 4.3 has no archive rule; V1
   hid anything under `archive/`. Decide whether an `archive` group hides items
   from the briefing and `work next`.
6. **Stage-to-skill map in code.** `toolkit work lifecycle` prints the
   "Owning skill" column from section 2; `toolkit brief` shows it for each
   active item; the PostToolUse gate error names `work-approve`.
7. **Delivery choice field.** Proposal: frontmatter
   `delivery: agent-led | owner-led | not-offered` so `work-start` and the
   briefing read it without parsing Notes. The detail stays in Notes >
   Decisions and context.
8. **UserPromptSubmit wording and pattern** (section 8.3, item 3).

### 10.2 Calls made in this draft (reversible)

1. The work plugin has 13 skills named for the lifecycle, with one owner per
   stage and one recorder per gate.
2. The stage-08 skill keeps the name `work-build` to match `08-build`, despite
   the pull of "let's build X". Alternative: `work-implement`.
3. The stage 12-13 skill is `work-release`, not `work-ship`, so "is this ready
   to ship" does not match its name.
4. `work-delegate` holds the delivery offer, team arrangement, and archive
   question; `work-start` only calls it.
5. `track-tasks` merged into `session-summary`; `grill-me` merged into
   `work-requirements`; `spec-check` merged into `work-review`; `work-guide`,
   `machine-sync`, `work-item-lifecycle`, `system-guide`, and `hooks-library`
   retired.
6. `delivery-reviewer` split into `requirements-analyst` and
   `acceptance-checker`; new `builder` agent with `isolation: worktree`.
7. The `humanize-outbound-text.md` rule names `unslop`, and `unslop` may run
   for outbound text without being asked.
8. `handoff` writes one "Next session starts with" entry in current focus,
   replaced each time (the model's single-section shape, not V1's list).

### 10.3 Decision for Mike

1. **`sf-architect-solutioning` description.** GOAL.md says port it as is.
   This draft proposes changing only its description and one skill name in its
   body, to remove the collision with `work-design` (section 5.8). Recommended:
   yes, because otherwise "design this feature" in a Salesforce project may
   start a second design process outside the work item.
