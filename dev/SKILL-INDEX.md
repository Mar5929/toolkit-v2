# Toolkit V2 skill index

Final index for the design pass, written 2026-09-26. `dev/GOAL.md` wins over
this file; `dev/ARCHITECTURE.md` section 8 says the final skill names and
descriptions live here. GOAL finish item 5 still needs an independent agent to
check this index for unclear or overlapping skills.

Base: the owner-words draft (`dev/research/skill-index-draft-owner-words.md`).
Ideas taken from the lifecycle draft (`skill-index-draft-lifecycle.md`) and the
minimal draft (`skill-index-draft-minimal.md`) are marked "(from lifecycle)" or
"(from minimal)". Section 6 gives the scores and the reasons.

## Summary

- **26 skills**: 22 in a project that is not Salesforce, plus 4 Salesforce
  skills that are enabled or installed only in Salesforce projects.
- **7 agents**, all on Opus.
- Every description is 300 characters or fewer (longest 300, shortest 256),
  written in the third person, "what it does, then Use when", with the owner's
  own words in quotes.
- No quoted owner phrase appears in two descriptions. This was checked with a
  script over the exact text in section 1 (method in section 5.5).
- The whole listing (names plus descriptions) is about 7,700 characters, or
  about 6,500 in a project that is not Salesforce. The drafts measured about
  8,700 (lifecycle), 8,000 (owner words), and 2,800 to 4,000 (minimal). Today's
  toolkit lists about 14,100 characters, and the listing on this Mac already
  drops descriptions (`session-skills.md` 8.1), so every name is chosen to say
  its job even when its description is dropped.
- The owner never has to name a stage. `work-on` is the first skill for any
  request to do work; it works out where the item stands and opens the skill
  that handles that stage.

---

## 1. Skill table

"Jobs and stages" uses the fourteen stages from `toolkit work lifecycle`
(ARCHITECTURE.md 4.1). In Claude Code a skill is started with `/<name>` (or
`/<plugin>:<name>`); in Codex with `$<name>`.

| # | Plugin | Skill | Exact description | Chars | Jobs and stages covered |
| --- | --- | --- | --- | --- | --- |
| 1 | work | `work-on` | Starts, continues, or logs project work: finds or creates the work item, works out where it stands, and runs its next step through to a built result. Use when the owner asks to build, add, fix, or change something, says "keep going" or "continue", names an item, or wants an idea logged for later. | 297 | First skill for any request to do work. Creates items at `01-discovery`; logs ideas for later; resumes an item. Runs `06-implementation-plan`, `07-tracking-setup`, `08-build`. Opens the stage skills below. |
| 2 | work | `work-status` | Answers "where are we", "what's next", and "catch me up": shows active work items, their progress and blockers, the recommended next step, and how many decisions wait on the owner. Use when the owner asks for project status, progress on one item, or what comes next. Changes nothing. | 283 | Status of the project or one item; what comes next. Read-only at every stage. |
| 3 | work | `work-decide` | Walks the owner through each decision waiting on him, one at a time with a recommendation, and records each answer. Use when the owner asks "what do you need from me" or "what's waiting on me", says "approved" or "go with option B", or states a decision for the whole project. | 276 | Every owner decision that arrives outside the skill that asked it: requirements approval (03), design approval (04), flagged tasks, result approval (11), open questions, an unanswered delivery offer. Project-wide decisions (`DECISIONS.md`). |
| 4 | work | `work-requirements` | Interviews the owner one question at a time, writes the answers into the work item's requirements and open questions, then asks for approval. Use when the owner says "grill me", "ask me questions", "what should it do", or "check the spec", changes a requirement, or requirements are missing. | 291 | `01-discovery`, `02-refinement`, asking for `03-requirements-approved`; requirement changes at any later stage; the spec check. |
| 5 | work | `solution-design` | Designs how a work item gets built: checks the requirements are ready, runs researcher, architect, and critic agents, and writes design options for the owner to approve. Use when the owner asks "how should we build this" or "give me design options", or signed-off requirements need a design. | 291 | `04-solution-design` and asking for design approval. Runs `sf-architect-solutioning` as the Salesforce specialist. |
| 6 | work | `work-organize` | Splits work items into sub-items, nests, groups, and moves them, and reconciles folders or cards the owner moved or renamed by hand. Use when the owner says "split this", "break it down", "it's too big", "put X under Y", "I moved some folders around", or the briefing reports moved or missing items. | 299 | `05-breakdown`; sub-items; nesting, grouping, moving, archiving; reconciling moves, renames, deletions, and copies the owner made by hand in `.work-items/` or Notion. |
| 7 | work | `work-check` | Checks a finished build against every requirement with an independent checker agent, fixes what fails, then shows the owner the result to approve. Use when the owner asks "is it ready", "does it work", "test it", or "check it against what I asked for", or when a build's last task is done. | 289 | `09-testing`, `10-bug-fixing`, asking for `11-user-approval`. |
| 8 | work | `work-finish` | Ships and closes a work item after the owner approves the result: pull request, merge, deployment, requirements baseline update, and Done; or cancels it with a reason. Use when the owner says "ship it", "deploy it", "close it out", "mark it done", "cancel it", or "drop it". | 274 | `12-pr-and-push`, `13-deployment`, `14-spec-update`, Done, Cancelled. |
| 9 | work | `work-delegate` | Hands a goal to agents with the owner as product owner: makes the agent-led delivery offer, asks how the team is arranged, records the choice, and runs the team. Use when the owner says "you drive", "run with it", "take it from here", or "use a team of agents", or work-on starts a big goal. | 291 | Delivery offer, team-arrangement question, archive question; running helper agents at any stage. |
| 10 | memory | `memory-save` | Saves, corrects, or forgets one lasting fact in project memory, and sends anything that belongs elsewhere to its home. Use when the owner says "remember this", "from now on", "always do X", "never do X", "forget that", or "remind me", corrects the agent, or a hook says to save. | 278 | Save, correct, forget one record; current focus and untracked to-dos; glossary terms; routing other information to its home. Holds the only written copy of the memory approval policy. |
| 11 | memory | `memory-find` | Finds what the project already knows in memory, decisions, work items, requirements, and the current focus, and cites the source of each answer. Use when the owner asks "what did we decide", "do you remember", "why did we", or "have we done this before", and before asking him to repeat anything. | 296 | Looking up past decisions, preferences, history, and references in every home. Read-only. |
| 12 | memory | `memory-tidy` | Reviews the whole project memory: merges duplicates, retires stale or contradicted facts, trims the current focus, and backs memory up. Use when the owner says "clean up memory" or "tidy memory", says memory seems wrong or out of date, or the toolkit doctor flags memory problems. | 280 | Whole-memory review; duplicates; stale records; focus trim; backup and restore. |
| 13 | toolkit | `project-setup` | Sets up Toolkit V2 in a project or repairs it: copies the model scaffold and applies your answers on tracker, memory, and Salesforce, checks this computer, and fixes Notion or Hindsight wiring. Use when the owner says "set up this project", "check the setup", "update the toolkit", or "new computer". | 300 | New project (GOAL finish item 3); repair of an existing project; a new computer; switching the memory backend; Notion and Hindsight wiring. |
| 14 | session-skills | `handoff` | Writes a checked prompt a fresh session can start from, after updating the active work item and current focus. Use when the owner says "write a handoff", "I'm going to clear context", "start a new session", "this chat is getting long", or "I'm stopping for today". "/handoff check" checks one. | 293 | Handoff between sessions at any stage; checking a pasted handoff prompt. |
| 15 | session-skills | `session-summary` | Shows a table of what the owner asked for in this chat and where each request landed, then what still needs him. Use when the owner says "recap this chat", "summarize the session", "what did I ask for", or "what did we do today". Covers this conversation only, not the whole project. | 283 | Recap of this conversation only. |
| 16 | session-skills | `braindump` | Plays back a loose brain dump in very simple words and waits for the owner to confirm before any work starts. Use when the owner types /braindump or says "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". | 268 | Confirming understanding before any work. No writes. |
| 17 | session-skills | `explain-simply` | Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path. Use when the owner types /explain-simply or says "explain it like I'm five", "simpler", "put that in plain bullets", or "I don't get it". | 256 | Re-explaining at a lower reading level. |
| 18 | session-skills | `unslop` | Rewrites text so it no longer reads as machine-written, keeping every fact, and shows the findings before saving. Use when the owner says "unslop this", "this reads like AI wrote it", or "make it sound human", or when the humanize-outbound-text rule applies to text going to another person. | 290 | Removing machine-written patterns on request, and for outbound text under the `humanize-outbound-text.md` rule. |
| 19 | git-workflows | `merge-and-clean-up` | Merges a GitHub pull request once merging is allowed, after its checks and the merge-safety check, updates the base checkout, and removes only that pull request's branches and worktree. Use when the owner or work-finish says "merge PR 12", "merge and clean up", or "land this pull request". | 290 | The merge inside `12-pr-and-push`. |
| 20 | git-workflows | `publish-docs` | Commits and pushes an agreed edit to Git-tracked project documents (requirements/, system-guide/, DECISIONS.md, PROJECT.md, PROJECT-ROADMAP.md, ai-external-knowledge/, delivery/) to the default branch from an isolated worktree. Use after such an edit. Not for code, rules, skills, or .memory/. | 293 | Saving committed documents: the requirements baseline and System Guide at `14-spec-update`, `DECISIONS.md` rows, `PROJECT.md`, `PROJECT-ROADMAP.md`. Agent use. |
| 21 | git-workflows | `pull-latest` | Brings the local repository up to date with its remote safely: fetch, fast-forward, or a merge pull when the two have diverged; never rebase, reset, or push. Use when the owner says "get the latest", "pull the latest changes", "update from origin", or "grab what others pushed". | 278 | Updating a checkout. |
| 22 | git-workflows | `reset-to-remote` | Makes the local repository an exact copy of its remote: shows a plan, then hard-resets tracking branches, deletes branches gone from the remote, and reinstalls dependencies. Use only when the owner says "wipe local", "match remote exactly", or "fresh start from remote". | 270 | Destructive resync, only on the owner's explicit words. |
| 23 | sf-architect-solutioning (Salesforce projects only) | `sf-architect-solutioning` | Acts as a certified Salesforce Technical Architect: checks platform facts against official Salesforce documentation and plans objects, Flows, Apex, and permissions. Use when solution-design needs a Salesforce specialist, or the owner says "architect this" or asks a Salesforce platform question. | 295 | Salesforce specialist inside `04-solution-design`; Salesforce platform questions at any stage. **Description needs Mike's yes (section 9.1, decision 1). Body unchanged.** |
| 24 | project-local, Salesforce overlay | `sf-deploy-check` | Runs the hitch-hiker check that finds components or pending edits that would ship with a Salesforce deploy before their feature is ready. Use before any deploy to a shared org (full copy, staging, or production) and before handing the owner a production deploy command. | 269 | `13-deployment`; any validate against a shared org. Agent use. |
| 25 | project-local, Salesforce overlay | `sf-component-tracker` | Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted, when a deploy result comes back, or when a deploy needs manual steps. | 286 | `07-tracking-setup`, `08-build`, `10-bug-fixing`, `13-deployment`. Agent use. |
| 26 | project-local, Salesforce overlay | `sf-data-change` | Builds the owner's package for a Salesforce production data change: load file, backup, numbered load steps, success check, and undo steps, filed under delivery/data/. Use when production records must be created, updated, upserted, or deleted, or a backup is needed first. | 271 | `08-build` and `13-deployment` of a `data-load` item. |

Notes on the table:

- **Plugin names** follow ARCHITECTURE.md section 2. Critiques B3
  (`critique-architecture.md`) and P14 (`critique-platform.md`) show that
  `session-skills`, `git-workflows`, and `sf-architect-solutioning` have the same
  plugin names as `claude-toolkit` plugins that are enabled for the whole
  machine. The skill names here do not depend on the plugin names. If the lead
  renames the plugins, only the Plugin column changes.
- **Salesforce skills home** (critique M12). Rows 24 to 26 follow the model
  project: `project-setup` copies them into `.claude/skills/<name>/` and
  `.agents/skills/<name>/` from the model copy in `plugins/toolkit/scaffold/model/`
  (the model keeps the two copies identical), and `toolkit doctor` checks that
  the two copies match. A per-project
  Salesforce plugin is the alternative the model review prefers; that is the
  lead's call and does not change any name or description.

---

## 2. Coverage

### 2.1 Stages

"Continue with" is the skill `work-on` opens for an item at that stage. The
`toolkit work lifecycle` command prints this column and `toolkit brief` prints
it next to each active item (from lifecycle), so the right skill is named even
when the skill listing has dropped descriptions.

| Stage | Status | Continue with | Other skills involved | Owner decision here |
| --- | --- | --- | --- | --- |
| `01-discovery` | Backlog | `work-requirements` | `work-on` creates the item | none |
| `02-refinement` | Backlog | `work-requirements` | `researcher` agent for facts the owner cannot answer | answers to questions |
| `03-requirements-approved` | Ready | `solution-design`, or `work-on` when design is skipped with a recorded reason | `work-requirements` asks; `work-decide` records a later answer | approve the requirements |
| `04-solution-design` | In Progress | `solution-design` | `sf-architect-solutioning` in Salesforce projects | choose and approve the design |
| `05-breakdown` | In Progress | `work-organize` | opened by `work-on` when an item is too big | agree the split |
| `06-implementation-plan` | In Progress | `work-on` | | none |
| `07-tracking-setup` | In Progress | `work-on` | `work-organize` (sub-items), `sf-component-tracker` (Salesforce manifest folder) | none |
| `08-build` | In Progress | `work-on` | `builder` agents when `work-delegate` set up a team; `sf-component-tracker`, `sf-data-change` | a task whose "Done when" names the owner |
| `09-testing` | In Progress | `work-check` | `acceptance-checker` agent | none |
| `10-bug-fixing` | In Progress | `work-check` | `builder` agent | only when a failure needs a choice |
| `11-user-approval` | In Progress | `work-check` | `work-decide` records a later answer | approve the result |
| `12-pr-and-push` | In Review | `work-finish` | `merge-and-clean-up` for the merge | the merge, or a standing merge instruction recorded in `DECISIONS.md` |
| `13-deployment` | In Review | `work-finish` | `sf-component-tracker`, `sf-deploy-check`, `sf-data-change` | production deploys and data loads are run by the owner |
| `14-spec-update` | In Review | `work-finish` | `publish-docs` | none |
| Done | Done | `work-finish` | | the recorded result approval |
| Cancelled | Cancelled | `work-finish` | `work-organize` for an item the owner removed by hand | the owner's reason |

An item with `waiting_on: owner` continues with `work-decide`, whatever its
stage.

### 2.2 Owner gates (from lifecycle, trimmed)

"What counts as approval" is printed by `toolkit work lifecycle` together with
the stages, so no skill repeats it: only the owner's explicit words count, and
they are quoted in the record; a question, a suggestion, a tentative answer, or
a saved draft does not count; approval never covers merge, deployment, spending,
or publishing.

| Gate | Asked by | Later answer recorded by | Recorded with | Enforced by |
| --- | --- | --- | --- | --- |
| Delivery offer, team arrangement, archive question | `work-delegate` | `work-decide` (opens `work-delegate`) | Notes > Decisions and context, plus a history row | skill |
| Requirements approval | `work-requirements` | `work-decide` | `toolkit work approve <id> --requirements --by <name>` | CLI; PostToolUse hook feeds back a `build` or `data-load` item past `03` without it |
| Design approval | `solution-design` | `work-decide` | `toolkit work approve <id> --design --by <name>` | CLI |
| Flagged task (its "Done when" names the owner) | `work-on` | `work-decide` | Open Questions row, then a history row | skill |
| Result approval (`11`) | `work-check` | `work-decide` | `toolkit work approve <id> --result --by <name>` | CLI |
| Merge | `work-finish` | none | `merge-and-clean-up`, after the owner's yes or a standing merge instruction recorded in `DECISIONS.md` | merge-safety check in `merge-and-clean-up` |
| Deploy, production data | `work-finish`, `sf-data-change` | none | the owner runs it; history row | Salesforce guard hooks |
| Done | `work-finish` | none | `toolkit work finish <id> --by <name> --evidence <text>` | CLI requires `--by` |
| Cancel | `work-finish`; `work-organize` for hand removals | none | `toolkit work cancel <id> --reason <text>` | CLI requires `--reason` |
| Project-wide decision | `work-decide` | none | `DECISIONS.md` row (`toolkit decision add`), saved with `publish-docs` | none |
| Memory save of an inferred fact (onboarding mode), deletes, anything about a person | `memory-save`, `memory-tidy` | none | `toolkit memory save --approved-by`, `toolkit memory delete --owner-approved` | CLI flag; Stop hook reminder |
| Split, move, restore | `work-organize` | none | `toolkit work new --parent`, `toolkit work move` | skill ("never on the agent's own initiative") |
| Setup choices; anything created outside the project | `project-setup` | none | `.toolkit.json` | Notion writes refused outside the AI Agent Second Brain root |

### 2.3 Other jobs

| Job | Skill |
| --- | --- |
| Status; what comes next | `work-status` |
| What is waiting on the owner | `work-decide` (a count also appears in `work-status` and the session briefing) |
| Log an idea or bug for later | `work-on` |
| Sub-items, nesting, moving | `work-organize` |
| Reconcile folders or Notion cards Mike moved by hand | `work-organize`; the SessionStart briefing and the PostToolUse `toolkit work sync` report moves and name it |
| Handoff between sessions | `handoff` (the briefing reads the focus section it writes) |
| Memory save, find, tidy | `memory-save`, `memory-find`, `memory-tidy` |
| Project init, project sync, computer setup | `project-setup` |
| Recap of this chat | `session-summary` |

---

## 3. Skill details

Each entry: the steps the first 40 lines of its `SKILL.md` carry (detail goes in
`references/`), the `toolkit` commands it uses (ARCHITECTURE.md section 5;
the commands first proposed in section 7.1 are now all listed there), agents,
what it replaces, and the hooks that back it.

### 3.0 Shared text

A plugin cannot read files in another plugin, so shared text lives in the work
plugin and short copies go where needed (from lifecycle, which split it by
topic; the owner-words draft had one file):

- `plugins/work/references/conventions.md`: how to open another skill (Claude
  Code: the Skill tool; Codex: read its `SKILL.md` from the path in the skill
  list); an answer to a question is recorded by the skill that asked it, and
  `work-decide` records answers that arrive later; save each settled answer
  before moving on and read it back; lead with "Not saved" or "Saved but not
  verified" when that is the result; show stages in plain words with the item
  id; the voice line (Claude Code: the Plain English output style; Codex: the
  "How to write replies" section of `AGENTS.md`, critique P12).
- `plugins/work/references/trackers.md`, `trackers/github.md`,
  `trackers/jira.md`: read `tracker.type` from `.toolkit.json`; `local` and
  `notion` go through `toolkit work ...`; GitHub Issues and Jira follow the
  written instructions (issue body = `WORK-ITEM.md` body, fields = labels or
  native fields, sub-items = sub-issues or sub-tasks, design = a comment titled
  "Solution design"). Never create a second tracker or a local mirror.
- `plugins/work/references/helpers.md`: how to brief an agent (item id, task
  id, the text it needs, the deliverable, "done when", the files it may write);
  one writer per path; a checker never edits what it checks; only the main
  agent updates the work item; the Codex fallback (read `agents/<name>.md` from
  this plugin and pass its full text to a native worker; with no worker, do the
  work and say no independent check ran).
- `plugins/work/references/team-roles.md`: ported from `solution-design`, every
  agent on Opus.
- `memory` and `session-skills` carry the voice line and, for `handoff`, the
  Codex fallback in their own `references/`.

Rules for every `SKILL.md` in both hosts (critique P21): `name` equals the
folder name; no `when_to_use`, `` !`command` ``, `$ARGUMENTS`,
`${CLAUDE_SKILL_DIR}`, or `${CLAUDE_PLUGIN_ROOT}` (Codex leaves them as
literal text); `toolkit` commands on their own line so Codex command rules
match them.

### 3.1 work plugin

#### `work-on`

- **Steps:**
  1. No briefing in context: run `toolkit brief`. No `.toolkit.json`: open
     `project-setup` and stop.
  2. Find the item: the id the owner named (`toolkit work show <id>`), or a
     title that matches the request in `toolkit work list`. Two possible
     matches: ask one question. No match: it is new.
  3. Size a new request. A quick edit (one sitting, no choice for the owner, no
     behavior recorded in `requirements/`): do it and report it; no item.
     "Later", "backlog", "park that": check `toolkit work list` for a
     duplicate, then `toolkit work new --stage 01-discovery` with the owner's
     words unchanged as the Starting request; reply "Logged as WI-014 (bug,
     backlog). Not started." and stop. Anything else: `toolkit work new`, then
     continue.
  4. A substantial goal with no recorded delivery choice: open `work-delegate`
     first.
  5. Route by where the item stands, using `toolkit work show` and the
     "Continue with" column of `toolkit work lifecycle`: requirements not
     approved and the type is `build` or `data-load` (or the risk calls for it):
     `work-requirements`; more than one reasonable way to build it and no
     approved design: `solution-design`; too big for one build: `work-organize`;
     stages 09 to 11: `work-check`; stages 12 to 14: `work-finish`;
     `waiting_on: owner`: ask that one question first (`work-decide`) and keep
     working on anything it does not block. Say the route in one line ("WI-012
     is waiting for your OK on the requirements; opening work-requirements.").
     Never ask the owner which stage it is in.
  6. Plan (`06-implementation-plan`): Roadmap phases `P1`, `P2` and tasks
     `P1-T01` (Work, Deliverable, Done when, Depends on) from the design's
     "Build and verification plan". Tracking setup (`07-tracking-setup`) only
     when needed: the item's branch and worktree; the item's folder in
     `delivery/deployment/` through `sf-component-tracker`.
  7. Build (`08-build`) on the item's own branch and worktree. With a team: one
     `builder` per independent task, one writer per path. Tests go with each
     task. Tick a task only with evidence. A task whose "Done when" names the
     owner: Open Questions row and `waiting_on: owner`. Salesforce:
     `sf-component-tracker` on each metadata change; production data through
     `sf-data-change`.
  8. When the owner is needed: an Open Questions row with "Decision needed
     from: owner", `toolkit work set <id> --waiting-on owner`, keep working on
     tasks that do not depend on the answer, and tell the owner in one line.
  9. Last task done: open `work-check`. This skill never records approvals,
     Done, merges, or deploys.
  10. Before stopping with work unfinished: Next action and Resume here are
      current and `toolkit work validate <id>` is clean.
- **CLI:** `toolkit brief`, `toolkit work list`, `toolkit work show <id>`,
  `toolkit work new --title <t> [--type] [--parent <id>] [--stage]`,
  `toolkit work set <id> --stage|--waiting-on|--priority|--type`,
  `toolkit work lifecycle`, `toolkit work next`,
  `toolkit work history <id> --note`, `toolkit work validate <id>`,
  `toolkit work edit <id> --section <name> --set-file <f>` (needed for Notion
  items).
- **Agents:** `builder` (one per independent task when a team was chosen),
  `researcher` (an unknown found while planning).
- **Replaces:** `work-tracker:work` (start, resume, capture, stage changes,
  roadmap and task commands); `session-skills:work-guide` (plan, tasks,
  parallel items); `project-init:work-item-lifecycle` (routing moves to the
  `AGENTS.md` "Where information goes" table); `work add` and `work next` usage.
- **Backed by:** SessionStart briefing; PostToolUse `toolkit work sync` and
  validation, including the `build` and `data-load` gate.

#### `work-status`

- **Steps:**
  1. Use the session briefing if this turn already has it and nothing changed
     since; otherwise run `toolkit brief`.
  2. The owner named an item or an area: `toolkit work show <id>`; answer about
     that item only: where it stands in plain words, what is done and left in
     its Roadmap, blockers, next action.
  3. The whole project: `toolkit work list --tree`, `toolkit work next`,
     `toolkit memory focus`.
  4. Answer in this order: how many decisions wait on the owner (one line
     each), in progress, the recommended next item and why, recently done,
     anything moved or broken.
  5. Show stages in plain words from `toolkit work lifecycle`, always with the
     item id.
  6. For each problem, name the skill that fixes it (moves: `work-organize`;
     setup warnings: `project-setup`) without running it. Local tracker "show
     the board": summarize `.work-items/DASHBOARD.md`; Notion: give the board
     link.
  7. Change nothing. End with one thing the owner can say next, for example
     "Say 'what do you need from me' to go through the 2 decisions."
- **CLI:** `toolkit brief`, `toolkit work list --tree`, `toolkit work next`,
  `toolkit work show <id>`, `toolkit work lifecycle`, `toolkit memory focus`.
- **Agents:** none.
- **Replaces:** `work status` and `work next` in `work-tracker:work`; the "where
  are we" trigger of `track-tasks`; the "where do things stand" trigger of
  `session-summary`.
- **Backed by:** the same data as the SessionStart briefing.

#### `work-decide`

- **Steps:**
  1. Build the queue: requirements waiting for approval; designs with
     `status: proposed`; items at `11-user-approval`; Open Questions rows with
     "Decision needed from: owner"; delivery offers not yet answered. Use
     `toolkit work decisions`, then `toolkit work show <id>` for each item.
  2. The owner gave an answer without being asked ("approved", "go with B"):
     match it to exactly one waiting decision. If two could match, ask which,
     naming both.
  3. Otherwise take decisions one at a time, the one blocking the most work
     first. For each: what is being decided, the choices, the recommendation
     and its main reason, what happens after each answer. One decision per
     message.
  4. Before recording a requirements approval, check that the Agreed goal is
     filled in and that no open question is linked to a requirement; if not,
     say what is missing and open `work-requirements`.
  5. Record each answer where it belongs: `toolkit work approve` for
     requirements, design, or result; the answer, date, and status in the Open
     Questions row; `toolkit work set <id> --waiting-on`; one
     `toolkit work history` note in the owner's words. An unanswered delivery
     offer: open `work-delegate`.
  6. A decision for the whole project: add a `DECISIONS.md` row
     (`toolkit decision add`) and save it with `publish-docs`.
  7. A "no" or a change: record it as the answer, move the item back (for
     example `--stage 02-refinement`), and open the skill that redoes the work.
  8. Lead with "Not saved" if any write failed. When the queue is empty, say so
     and offer to continue unblocked items with `work-on`.
- **CLI:** `toolkit work decisions`, `toolkit brief`,
  `toolkit work list --waiting-on owner`, `toolkit work show <id>`,
  `toolkit work approve <id> --requirements|--design --by <name>`,
  `toolkit work approve <id> --result --by <name>`,
  `toolkit work edit <id> --section "Open Questions" --set-file <f>`,
  `toolkit work set <id> --waiting-on|--stage`, `toolkit work history <id> --note`,
  `toolkit decision add`.
- **Agents:** none.
- **Replaces:** nothing directly. It fills the model review's first gap (no one
  list of what waits on the owner, `model-review-draft.md` section 2) and takes
  over the finalize and Done-approval questions scattered through
  `work-tracker:work`.
- **Backed by:** the briefing's waiting count names this skill.

#### `work-requirements`

- **Steps:**
  1. Find the item as `work-on` does; none: `toolkit work new`. Set
     `01-discovery` while the goal is being worked out, `02-refinement` once
     requirements are being written. Approved requirements and no change asked:
     stop and open the skill from "Continue with".
  2. Before asking anything, read the item (Starting request, Agreed goal,
     R-xx, Open Questions) and run `memory-find` on the topic, so no question
     repeats something already answered.
  3. Restate the goal in one sentence ("So the goal is X?"); write Agreed goal
     only after a yes (from lifecycle).
  4. Ask one question at a time, most basic first, each with a recommended
     answer. Push back when an answer works against the goal.
  5. Write each answer into the item before the next question: R-xx blocks
     (Status Refining, required behavior, boundaries, acceptance check,
     decision record) and the Acceptance list; Open Questions rows for anything
     unanswered, with who must answer, and `waiting_on: owner` while one is
     open. Build ideas go under Notes > Solution options and considerations,
     never into requirements. A fact the owner cannot answer: brief
     `researcher`.
  6. A change to an approved requirement: edit the R-xx, keep the old wording
     in its decision record, set it back to Refining, move the item to
     `02-refinement`, and say what the change affects when the item is past
     stage 03.
  7. Spec check, before asking for approval and whenever the owner says "check
     the spec": brief `requirements-analyst` with the requirements text; fix
     what it finds or turn it into questions; change nothing without a yes.
  8. Show a short summary and ask one line: "Do you approve these
     requirements?" Yes: `toolkit work approve <id> --requirements --by <owner>`.
     Not yet: `toolkit work set <id> --waiting-on owner`.
  9. Lead with "Not saved" on a failed write. Hand back to `work-on` unless the
     owner stops.
- **CLI:** `toolkit work show <id> [--section Requirements]`, `toolkit work new`,
  `toolkit work set <id> --stage 01-discovery|02-refinement --waiting-on`,
  `toolkit work edit <id> --section <name> --set-file <f>`,
  `toolkit work approve <id> --requirements --by <name>`,
  `toolkit work history <id> --note`, `toolkit work validate <id>`.
- **Agents:** `requirements-analyst`, `researcher`.
- **Replaces:** `session-skills:requirements-helper` (renamed and moved);
  `session-skills:grill-me` (merged; "grill me" stays a trigger);
  `session-skills:spec-check` (merged); `requirements --finalize` and
  `--reopen` in `work-tracker:work`.
- **Backed by:** PostToolUse validates each save of `WORK-ITEM.md`; the gate
  error for a `build` or `data-load` item past `03` names this skill.

#### `solution-design`

The name is kept from the current toolkit (from minimal). The ported
`sf-architect-solutioning` body says "When `solution-design` is coordinating the
conversation, return Salesforce design findings to that conversation". Keeping
this name lets that file ship byte for byte as GOAL.md asks.

- **Steps:**
  1. `toolkit work show <id>`. Requirements not approved: say so and open
     `work-requirements`, unless the owner asked for options first. Set
     `04-solution-design`.
  2. Brief `requirements-analyst`; tell the owner plainly whether the
     requirements are ready to design from. A missing requirement goes back to
     `work-requirements`; the design never fills a requirements gap.
  3. Agree the way of working in at most two questions, skipping anything
     already recorded: built-in mechanisms first or a specialized approach; one
     option or several; team size from `references/team-roles.md`.
  4. Start from the project's `DESIGN.md` template
     (`.work-items/work-item-template/DESIGN.md` when present, otherwise the
     model copy in the toolkit plugin's `scaffold/model/`), through
     `toolkit work design <id>`. One home only: `DESIGN.md` beside
     `WORK-ITEM.md` (local), the Solution Design child page (Notion), the
     "Solution design" comment (GitHub, Jira). Never a separate design folder.
     Fill the model's opening sections: What this design solves, Requirements
     and design readiness, What exists today, Constraints and assumptions.
  5. One `researcher` per open question, in parallel. Salesforce project: open
     `sf-architect-solutioning` as the specialist and pass its findings to the
     architect.
  6. One `design-architect` per option, writing a local draft file; one
     `design-critic` per draft; repeat the fix round until the critic's list is
     empty. A disagreement still open after two rounds goes to the owner as a
     decision.
  7. Save with `status: proposed` (`toolkit work design <id> --set-file <draft>`);
     set `waiting_on: owner`; project-wide decisions go to
     `work-decide`, lasting lessons to `memory-save`.
  8. Show the owner the options, the recommendation, what he will see when it
     is done, the risks, and the order of work; ask him to choose or approve.
     Yes: `toolkit work approve <id> --design --by <owner>`, then back to
     `work-on`.
  9. Codex: pass each role file's full text to a native worker; with no
     worker, say no independent research or critique ran.
- **CLI:** `toolkit work show <id> --section Requirements`,
  `toolkit work set <id> --stage 04-solution-design --waiting-on`,
  `toolkit work design <id> [--create|--set-file <f>|--status proposed|approved]`,
  `toolkit work approve <id> --design --by <name>`,
  `toolkit work history <id> --note`, `toolkit work validate <id>`.
- **Agents:** `requirements-analyst`, `researcher`, `design-architect`,
  `design-critic`; the `sf-architect-solutioning` skill in Salesforce projects.
- **Replaces:** `session-skills:solution-design` (moved to the work plugin; its
  readiness gate and critic loop unchanged; paths changed from `prds/` and
  `docs/designs/`); the design routing in `project-init:work-item-lifecycle`.
- **Backed by:** PostToolUse validates `DESIGN.md` frontmatter and that every
  R-xx it names exists in the item.

#### `work-organize`

- **Steps:**
  1. Run `toolkit work sync` and `toolkit work list --tree`. Read the report:
     moved, renamed, nested or un-nested, missing, duplicate id, record with no
     id, adopted template copies (critique B2).
  2. Say what the CLI already adapted (paths, parent from location, Status from
     a dragged Notion Stage) in one line each ("WI-7 is now a sub-item of
     WI-3"), and what needs the owner's intent.
  3. List side effects: a sub-item under a Done or Cancelled parent; a Roadmap
     phase listing a child that moved away; a `build` sub-item without
     approved requirements.
  4. A missing item: ask whether it was removed on purpose (then
     `toolkit work cancel <id> --reason "<owner's words>"`) or moved outside the
     tracker (ask where; move it back only after a yes). A copied folder with a
     duplicate id: the CLI renumbers the newer copy; confirm which is the
     original.
  5. Notion: a Stage the owner changed by dragging is kept. A card dragged to
     Done is not an approval: ask, and on a yes open `work-finish`.
  6. Split (`05-breakdown`): propose the sub-items (title, what each delivers,
     which R-xx it covers), ask once, then `toolkit work new --parent <id>` for
     each; each child links the parent's R-xx ids and copies none; list the
     child ids in the parent's Roadmap.
  7. Nest, group, move, or archive on request: `toolkit work move <id> --under
     <id|group|root|archive>`. Before moving a folder, say how many nested
     items move with it.
  8. Never move, regroup, cancel, archive, or restore on the agent's own
     initiative. Finish with `toolkit work validate`, a short tree of what
     changed, and a history row on each item whose parent changed.
- **CLI:** `toolkit work sync`, `toolkit work list --tree`,
  `toolkit work new --title <t> --parent <id>`,
  `toolkit work move <id> --under <id|group|root|archive>`,
  `toolkit work set <id> --parent`, `toolkit work cancel <id> --reason`,
  `toolkit work validate`, `toolkit work history <id> --note`.
- **Agents:** none.
- **Replaces:** the group, link-children, archive, and reconcile parts of
  `work-tracker:work`; the move procedure in the `work-item-folders.md` rule
  (the rule keeps file protection and points here).
- **Backed by:** SessionStart and PostToolUse move detection; PreToolUse refuses
  hand edits of `DASHBOARD.md` and `.toolkit-state.json`.

#### `work-check`

The name avoids "review": the built-in `/review`, `code-review`, and
`superpowers:requesting-code-review` already claim it, and the owner means "does
it do what I asked".

- **Steps:**
  1. Read the requirements, acceptance list, and tasks; set `09-testing`.
     When the item has a design (`toolkit work show` prints a "Design:" value
     other than `none`), also read the design's Acceptance checks (in "Build
     and verification plan") and the selected option's "How to check it"
     column.
  2. Run the project's tests and every acceptance check the item lists. A check
     with several scenarios or manual steps gets a test plan: a copy of
     `tests/TEST-PLAN-TEMPLATE.md` named for the item, with the results filled
     in. A check that could not run is reported as not run, never as passed.
  3. Brief `acceptance-checker` (never the agent that built it): one verdict per
     requirement (met, partly met, not met) with evidence, plus defects seen in
     the diff.
  4. Failures: set `10-bug-fixing`; a `builder` (or the main agent) fixes; the
     checker checks again. Repeat until clean, or until a failure needs an
     owner decision (Open Questions row and `waiting_on: owner`).
  5. Record the result in Recent History: what was checked, the evidence, the
     known gaps.
  6. Set `11-user-approval` and `waiting_on: owner`. Show what it does now, how
     to see it (a link, a command, or a screenshot), the evidence, and the
     gaps. Ask one line: "Do you approve this result?"
  7. Yes: `toolkit work approve <id> --result --by <owner>`, then
     open `work-finish`. Requirement changes go to `work-requirements`; fixes
     become tasks and continue here.
- **CLI:** `toolkit work show <id>`,
  `toolkit work set <id> --stage 09-testing|10-bug-fixing|11-user-approval --waiting-on`,
  `toolkit work history <id> --note`,
  `toolkit work approve <id> --result --by <name>`.
- **Agents:** `acceptance-checker`, `builder`.
- **Replaces:** the result-review mode of the `delivery-reviewer` agent; the
  test and owner-review steps spread through `work-tracker:work` and
  `work-guide`.
- **Backed by:** none specific.

#### `work-finish`

- **Steps:**
  1. Check the result approval is recorded. Not recorded: show the result,
     gaps, and evidence and ask. "Ship it" or "mark it done" from the owner
     after he has seen the result counts as the approval; record it.
  2. Repository work: push the branch, open the pull request (description
     through `unslop`, no AI credit), set `12-pr-and-push`. Merge through
     `merge-and-clean-up` when the owner approves the merge, or when
     `DECISIONS.md` records a standing merge instruction and
     `acceptance-checker` found no blocking issue on that exact head.
  3. Deployment, when the item needs one: set `13-deployment`. Salesforce:
     `sf-component-tracker` current and the item's folder in
     `delivery/deployment/` complete, then `sf-deploy-check`, then validate
     against the sandbox. Production deploys and production data loads are
     handed to the owner to run (`sf-data-change`).
  4. Requirements baseline: set `14-spec-update`; read `requirements/AGENTS.md`;
     copy only delivered and approved behavior into the area's file in
     `requirements/` (a new area starts from
     `requirements/system-area-template/`); update the area's file in
     `system-guide/` when the verified structure changed; save both with
     `publish-docs`.
  5. Sub-items: list open ones. A parent with open sub-items is not finished
     unless the owner says so. Finishing a sub-item never finishes its parent.
  6. Memory: at most one `event` record through `memory-save` when the episode
     will matter later.
  7. `toolkit work finish <id> --by <owner> --evidence "<what shows it works>"`;
     say whether the work reached the default branch. Take the item off the
     current focus "Now" list.
  8. Cancel: `toolkit work cancel <id> --reason "<owner's words>"`; ask what
     happens to its open sub-items.
  9. Do not move or archive the folder unless the owner asks (`work-organize`)
     (from lifecycle).
- **CLI:** `toolkit work set <id> --stage 12-pr-and-push|13-deployment|14-spec-update`,
  `toolkit work finish <id> --by <name> --evidence <text>`,
  `toolkit work cancel <id> --reason <text>`, `toolkit work list --tree`,
  `toolkit work history <id> --note`, `toolkit memory focus --set-file <f>`.
- **Agents:** `acceptance-checker` (independent check of the exact head before
  a merge under a standing merge instruction).
- **Replaces:** `work finish` and cancel in `work-tracker:work`; the "Closing a
  work item" checklist of `project-init:work-item-lifecycle`; the model's
  closeout rule in `requirements/AGENTS.md`.
- **Backed by:** Stop hook checks a changed item validates; Salesforce guard
  hooks on deploy commands; the machine-wide no-AI-credit guard on commits and
  pull requests.

#### `work-delegate`

- **Steps:**
  1. Look in the item's Notes > Decisions and context for a delivery choice
     that covers this goal. A quick question or small edit gets no offer.
  2. No choice recorded: ask exactly "Would you like agents to take
     responsibility for delivering this, with you acting as product owner?" If
     the owner already said it in his own words ("you drive"), that is the
     answer; do not ask again.
  3. Yes: ask about the team. Where this chat can list, read, and message other
     chats (today, the Claude Code desktop app): "Do you want one team inside
     this chat, or do you want me to rename this chat to Main Orchestrator and
     coordinate other chats that each have their own team?" On any other host:
     "Shall I run one team of helpers inside this chat?" After the Main
     Orchestrator choice only: "Do you want me to archive sessions after their
     task is fully complete, everything is merged and shipped, and you
     approved?"
  4. Record the choice, the goal it covers, who said it, the date, the team
     arrangement, the archive answer, and the limits (delegation never includes
     merge, deployment, spending, or publishing beyond what was given) in Notes
     > Decisions and context, plus one `toolkit work history` note. Read it back.
  5. No, or a later revoke: record it; do not offer again for this goal unless
     it grows a lot or the owner asks.
  6. Run the team through the skill that handles each stage: the main agent
     plans, briefs `builder`, `researcher`, and `acceptance-checker` with their
     role files, gives one writer per path, and is the only writer of the work
     item.
  7. Stop at every owner gate: `waiting_on: owner`, the question through the
     asking skill, and keep working on anything the answer does not block.
  8. Codex: pass each role file's full text to a native worker; with no worker,
     say no helpers ran and do the work directly.
  9. Archive a chat only when its task is complete, merged and shipped, the
     report is saved, and the owner approved. Never delete a chat.
- **CLI:** `toolkit work show <id>`, `toolkit work history <id> --note`,
  `toolkit work edit <id> --section Notes --set-file <f>`,
  `toolkit work set <id> --waiting-on owner|agent`, `toolkit work list --tree`.
- **Agents:** `builder`, `researcher`, `acceptance-checker`.
- **Replaces:** `references/agent-led-delivery.md` and
  `references/team-arrangements.md` of `work-tracker:work`; the helper and
  parallel-item parts of `work-guide`.
- **Backed by:** none specific.

### 3.2 memory plugin

#### `memory-save`

- **Steps:**
  1. Decide the home first. Memory: a lasting preference, correction, fact
     about the project or the owner, or hard-to-find reference. Elsewhere:
     project work goes to `work-on`; a decision for the whole project to
     `work-decide` (`DECISIONS.md`); a standing rule for how agents work in
     this repository is proposed as a rule-file change; a personal to-do with
     no work item goes to current focus "Untracked to-dos"; a project term to
     the glossary.
  2. Search first (`toolkit memory find`); update the existing record rather
     than add a duplicate.
  3. Approval, from `memory.approval` in `.toolkit.json`: the owner's own words
     ("remember", "from now on", "always", "never", "forget", a correction) are
     the approval, so save now. `onboarding`: something the agent inferred gets
     one yes-or-no line first. `trusted`: routine facts the agent is sure of are
     saved and reported. Always ask first for anything about a named person,
     personal details, a hard delete, more than five records at once, or a
     change to this policy.
  4. Save with `toolkit memory save`: type (`user`, `feedback`, `project`,
     `reference`, `event`), slug, one-line description, the source (`--source`,
     a person or document with an absolute date), and a body with the model
     topic template's labels: Remember, Why, How to apply, Evidence and limits
     (source and an absolute date), Related memories (relative Markdown links,
     Obsidian style), Authoritative records. A better name or type for the same
     record: `toolkit memory rename <key> --to <new-key>`. The CLI writes the
     model's frontmatter and repairs links on rename, merge, retire, and
     delete.
  5. "Forget that": `toolkit memory retire <key>` (can be undone); right after
     a save, retire that record with no question (from lifecycle). Delete only
     when the owner says delete: `toolkit memory delete <key> --owner-approved`.
  6. Focus and to-dos: `toolkit memory focus --set-file <f>`, four sections,
     under 50 lines, work item ids only, never their status. On a new project,
     remove the focus's fill-in guide and write "None." in each section that
     still holds only a template prompt. Glossary:
     `toolkit memory glossary --set-file <f>`.
  7. A preference a project setting can enforce (for example "I hate tabs" and
     `.editorconfig`): save it, then offer that change too.
  8. Tell the owner in one line: "Saved to memory: <title>. Say 'forget that'
     to undo." A failed save is reported first as "Not saved". Never store
     work-item status, secrets, or email addresses.
- **CLI:** `toolkit memory find <query>`, `toolkit memory get <key>`,
  `toolkit memory save --type <t> --name <slug> --description <d> --body-file <f> --source <text> [--approved-by <name>]`,
  `toolkit memory rename <key> --to <new-key>`,
  `toolkit memory retire <key>`, `toolkit memory restore <key>`,
  `toolkit memory delete <key> --owner-approved`,
  `toolkit memory focus --set-file <f>`, `toolkit memory glossary --set-file <f>`.
- **Agents:** none. The model's `memory-curator` is dropped (ARCHITECTURE.md
  section 7).
- **Replaces:** `second-brain:knowledge-save` and its aliases `remember` and
  `retire`; the model's `memory-curator` agent and the body of
  `memory-curator-dispatch.md`.
- **Backed by:** UserPromptSubmit adds the reminder line (section 7.2); Stop
  blocks once when the owner asked to remember and no save ran; PostToolUse
  reindexes `.memory/`.

#### `memory-find`

- **Steps:**
  1. Check the session briefing and the current focus.
  2. `toolkit memory find "<query>"`; open each hit with `toolkit memory get`.
     A hit is a pointer; read the record.
  3. Search the other homes: `DECISIONS.md`; work items (`toolkit work show`
     Recent History and Notes); the area files in `requirements/` and
     `system-guide/`; `PROJECT.md` and `PROJECT-ROADMAP.md`;
     `ai-external-knowledge/INDEX.md`; the glossary.
  4. Give a source for every fact: memory key, decision id, work item id and
     section, or file path, with its date.
  5. Sources disagree: show both, say which is newer, leave it open, and offer
     `memory-save` to correct the older one.
  6. Nothing found: say so plainly, then ask the owner once. Hindsight or
     Notion unreachable: say so in one line and use what is available.
  7. Change nothing.
- **CLI:** `toolkit memory focus`, `toolkit memory find <query>`,
  `toolkit memory get <key>`, `toolkit memory list`, `toolkit work list`,
  `toolkit work show <id>`.
- **Agents:** none.
- **Replaces:** `second-brain:knowledge-find` and its aliases `recall` and
  `session-search`; the System Guide lookup route (retired).
- **Backed by:** none.

#### `memory-tidy`

- **Steps:**
  1. Run `toolkit doctor` and `toolkit memory list`.
  2. Find duplicates, contradictions, stale records (replaced by a later
     decision, or not verified for a long time), records that copy work-item
     status, and a current focus over 50 lines.
  3. Show one numbered list of proposed changes (merge, retire, correct, trim),
     each with its reason.
  4. Ask once for the whole list. Anything about a person, any hard delete, or
     more than five changes needs the owner's yes; quote his words for a
     delete.
  5. Apply with `toolkit memory save`, `retire`, `restore`, and `rename` (a
     file name whose prefix does not match `metadata.type`); trim the focus
     with `toolkit memory focus --set-file`.
  6. Back up with `toolkit memory export --to <folder>`; restore with
     `toolkit memory import --from <folder>`; say when the last backup was made.
  7. Report what changed by key and how to undo it (`toolkit memory restore`).
- **CLI:** `toolkit doctor`, `toolkit memory list`, `toolkit memory get <key>`,
  `toolkit memory save`, `toolkit memory retire <key>`,
  `toolkit memory restore <key>`, `toolkit memory rename <key> --to <new-key>`,
  `toolkit memory delete <key> --owner-approved`,
  `toolkit memory focus --set-file <f>`, `toolkit memory export --to <dir>`,
  `toolkit memory import --from <dir>`.
- **Agents:** none.
- **Replaces:** `second-brain:knowledge-review` and its alias `reflect`; the
  model's `scripts/memory.py doctor` and `reindex` use; the tidy duties of the
  model's curator.
- **Backed by:** PreToolUse refuses hand edits of `.memory/MEMORY.md`.

### 3.3 toolkit plugin

#### `project-setup`

One skill for init and sync (from minimal). Both paths start with
`toolkit doctor` and end with it clean, and the branch between them is decided by
the CLI (is there a `.toolkit.json`), not by the owner's wording. The new name
also avoids the `project-init` and `project-sync` skill names that the current
toolkit's `project-init` plugin still loads on this Mac (critique B3).

- **Steps:**
  1. Run `toolkit doctor`. If `toolkit` is not found, or doctor reports a
     computer problem, run `toolkit machine-setup` first; name anything the
     owner must do himself (`ntn login` opens a browser; trusting hooks in
     Codex with `/hooks`).
  2. No `.toolkit.json`: new project. Look before asking: empty or existing
     repository; `sfdx-project.json` answers the Salesforce question in advance.
     Confirm the project name and id prefix in one line. Then ask one question
     at a time, each with a recommendation: tracker (local folders, Notion,
     GitHub Issues, Jira); memory (built-in `.memory/`, local Hindsight,
     Notion); Salesforce or not.
  3. Run `toolkit init` with the answers. Setup copies the model scaffold and
     applies your answers: the model project's folders and files, only the
     setup-marker blocks of `AGENTS.md`, `README.md`, and `PROJECT.md` that
     match the answers, the project name, the rules list, and `.toolkit.json`;
     the local tracker's template and rule, the built-in memory seeds, and the
     Salesforce parts only when chosen; never work items or memory records.
     It enables `sf-architect-solutioning` only for Salesforce and turns off
     every `*@claude-toolkit` plugin in the project's `.claude/settings.json`
     and `.codex/config.toml` (critiques B3 and P14). `.codex/` files are
     written from outside the Codex sandbox (critique P3).
  4. Wire the choices. Notion: check `ntn whoami`, then
     `toolkit notion ensure-root` and `ensure-project`. Hindsight:
     `toolkit hindsight service status` (install or start only after a yes),
     then `toolkit hindsight ensure-bank`. GitHub or Jira: show the written
     instructions and create nothing in that service without a yes.
  5. Fill the setup guides with facts the owner confirmed: the outcome
     sentence and the "Build, test, or deploy" row in `AGENTS.md`, then
     `PROJECT.md` and `README.md`, and `PROJECT-ROADMAP.md` and
     `requirements/SYSTEM-DATA-MODEL.md` when the facts are known; ask whether
     he wants `SOUL.md`; delete each fill-in guide once its file is filled;
     list every prompt left for a fact nobody knows yet.
  6. `.toolkit.json` present: repair. Run `toolkit sync --dry-run` and show one
     numbered table: missing, out of date, changed by the owner, broken wiring,
     each with its fix. Apply only the rows the owner approves with
     `toolkit sync`. A file the project changed on purpose is never
     overwritten; report it as "project ahead of the toolkit".
  7. Switching memory: `toolkit memory export --to <folder>`, change the choice
     (`toolkit config set memory.type`), wire the new backend,
     `toolkit memory import --from <folder>`. Switching tracker: no CLI support
     in this version; show a preview and move items only with the owner's yes.
  8. Run `toolkit doctor` until clean, then `toolkit brief` to show the first
     briefing. Report what was set up, what was skipped, and one next step
     ("Tell me the first thing you want built.").
  9. Never create a GitHub repository, a paid service, or Notion pages outside
     the "AI Agent Second Brain" root without a yes.
- **CLI:** `toolkit doctor`, `toolkit machine-setup`,
  `toolkit init --name <n> --key <k> --tracker <t> --memory <m> [--salesforce] [--dir <path>]`,
  `toolkit sync [--dry-run]`, `toolkit notion ensure-root`,
  `toolkit notion ensure-project`,
  `toolkit hindsight service install|status|start|stop`,
  `toolkit hindsight ensure-bank`, `toolkit memory export --to <dir>`,
  `toolkit memory import --from <dir>`, `toolkit config set <key> <value>`,
  `toolkit brief`.
- **Agents:** none.
- **Replaces:** `project-init:project-init` (six gates become three
  questions); `project-init:project-sync` (a 994-line audit becomes
  `toolkit doctor` and `toolkit sync`); the per-computer part of
  `project-init:machine-sync` (the machine-wide no-AI-credit rule and hook stay
  with the current toolkit; section 9.1, decision 4); `second-brain:knowledge-setup`;
  `hooks-library` (hooks ship in the toolkit plugin; Salesforce guards are
  installed by init).
- **Backed by:** installs the hook registrations and proves them with
  `toolkit brief`; the briefing's setup warnings name this skill.

### 3.4 session-skills plugin

#### `handoff`

- **Steps:**
  1. No `.toolkit.json`: skip steps 2 and 3.
  2. Active work item: Current position, Next action and who owns it, and
     Blockers in Overview; Resume here in Notes; true stage and `waiting_on`;
     then `toolkit work validate <id>` and read back.
  3. Review the current focus and the memory criteria (the model's
     `session-handoff.md` rule). Anything the owner asked to keep this session
     that is not saved yet: open `memory-save`. Write the current focus "Next
     session starts with" with `toolkit memory focus --set-file`: one entry,
     replaced each handoff, "Last updated" set, whole file under 50 lines. On
     a new project, remove the fill-in guide and write "None." in each section
     that still holds only a template prompt.
  4. Draft the prompt. First line exactly: "This handoff prompt is
     AI-generated and may contain hallucinations, skewed context, etc. Please
     evaluate accordingly." Then the goal, why it matters, where it is written
     down (ids, not paths), what to read first, decisions not yet saved, open
     questions, and one first action. Every fact carries its source kind (file,
     repository, owner, worked out).
  5. Run `handoff-verifier`; fix every Wrong, Unchecked, Missing, or Skipped
     finding. Codex: pass the role file's text to a native worker.
  6. Show what was saved (anything not saved first) and the prompt in one
     fenced block. A failed save never blocks the prompt.
  7. "/handoff check" (Codex: `$handoff check`): run only step 5 on a pasted
     prompt.
  8. Never commit `.memory/` or `.work-items/`; never stop the owner from
     clearing.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage|--waiting-on`,
  `toolkit work edit <id> --section <name> --set-file <f>`,
  `toolkit work history <id> --note`, `toolkit work validate <id>`,
  `toolkit memory focus --set-file <f>`.
- **Agents:** `handoff-verifier`.
- **Replaces:** `session-skills:handoff` (kept; steps 1, 2, 3, and 6 rewritten
  for V2 trackers and memory; the V1 "Session handoffs" list becomes the single
  focus section; description cut from 684 characters).
- **Backed by:** the model's `session-handoff.md` rule offers it; the next
  SessionStart briefing reads "Next session starts with".

#### `session-summary`

- **Steps:**
  1. Read this conversation only; list the real requests, not the steps.
  2. Table: #, What you asked, Status, Where it landed, with the eight fixed
     statuses kept from the current skill (Done, Done unverified, Partly done,
     Blocked, Waiting on you, Not started, Dropped, Answered).
  3. Then "Still open, and it needs you".
  4. For the whole project, point to `work-status` in one line. Offer once to
     turn surviving requests into work items (`work-on`) or focus to-dos
     (`memory-save`).
  5. Change nothing.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:session-summary` (kept; description cut from
  656 characters; "where do things stand" moves to `work-status`, "being handed
  off" to `handoff`); `session-skills:track-tasks` (retired, section 8).

#### `braindump`

- **Steps:**
  1. No work until the owner confirms.
  2. Play back the big idea in one or two sentences, then a numbered list of
     each separate ask.
  3. Say what is unclear ("I think you mean X, but you might mean Y"), then the
     questions, each with a recommended answer.
  4. A correction replays only the corrected part.
  5. After a yes, hand project work to `work-on`.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:braindump` (kept; description cut from 387
  characters; the settings-file voice lookup replaced by the shared voice
  line).

#### `explain-simply`

- **Steps:**
  1. Take the named thing, or the last substantial answer.
  2. Bullets only, one idea and one line each, in 4 to 6 bold-headed groups,
     about 25 bullets at most.
  3. Simplify the wording, never the facts: every number, name, and path stays.
  4. End with a numbered "What I need from you" only when there is an action.
  5. Do not research again.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:explain-simply` (kept; description cut from 377
  characters).

#### `unslop`

- **Steps:**
  1. Read the Plain English style first; the style wins on a conflict.
  2. Scan the 31 patterns in six groups.
  3. Rewrite; add a human voice back; ask "What still makes this read as
     machine written?" and fix that too. Outbound text under the owner's name
     is written in his first person.
  4. Show the findings list (about 25 lines at most) and the rewrite, then
     wait.
  5. Write to a file only after a yes. Never change numbers, paths, names, ids,
     quotes, or code.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:unslop` (kept; "Runs only when asked, never on
  its own" replaced by the rule case, so the rule and the skill agree). The
  model's `humanize-outbound-text.md` rule names the `humanizer` skill, which
  V2 does not ship, and falls back to `unslop`.

### 3.5 git-workflows plugin

#### `merge-and-clean-up`

- **Steps:**
  1. Resolve the exact pull request and map branches to worktrees; the local
     head must equal the pull request head.
  2. Check the merge is allowed: the owner's yes, or a standing merge
     instruction recorded in `DECISIONS.md`.
  3. Preflight: open, not a draft, mergeable, reviews, checks ("no checks
     reported" is not a failure).
  4. Merge-safety check: compare `git diff --name-only <default>...<branch>`
     with `git status` in the primary checkout. A file in both: stop and name
     it.
  5. `gh pr merge <n> --squash --delete-branch` (no admin flags); confirm the
     state is MERGED.
  6. Fast-forward the base checkout; remove only this pull request's worktree
     and branches.
  7. Add one history note to the linked work item. Stage moves and Done stay
     with `work-finish`. Report the link, merge commit, and cleanup result.
- **CLI:** `toolkit work history <id> --note`. Git and `gh` for the rest.
- **Agents:** none.
- **Replaces:** `git-workflows:merge-and-clean-up` (kept; adds the merge-safety
  check and the work-item note; drops the `CLAUDE.md` mention; description cut
  from 430 characters). Settles `session-skills.md` open question 11: the stage
  move after a merge belongs to `work-finish`.

#### `publish-docs`

- **Steps:**
  1. Confirm the change is documentation in an allowed path, not code, rules,
     skills, hooks, settings, `.memory/`, or `.work-items/`.
  2. `publish-docs.mjs start --branch <default> -- <files>` from this skill's
     `scripts/` folder (a separate sparse worktree).
  3. Make the edit there and stage the files by name.
  4. `publish-docs.mjs publish --message "<message>"`: refuses other staged
     paths, pushes without force, checks the remote has the commit.
  5. Report the commit and that it reached the remote.
- **CLI:** its own `scripts/publish-docs.mjs start|publish`.
- **Agents:** none.
- **Replaces:** `git-workflows:publish-docs` (kept; path lists rewritten for V2
  homes and `DECISIONS.md` added; the knowledge pre-commit check dropped because
  V2 has no `knowledge/`; `delivery/deployment/component-tracker.csv` accepted).

#### `pull-latest`

- **Steps:**
  1. Stop on a dirty tree or an unexpected branch in the shared checkout.
  2. `git fetch --prune origin`, then `git pull --ff-only`.
  3. Diverged: show `git log --oneline @{u}..HEAD` and `HEAD..@{u}`, then
     `git pull --no-rebase --no-edit`.
  4. Never push, rebase, or reset.
  5. Report the incoming commits and the final state.
- **CLI:** none. **Agents:** none.
- **Replaces:** `git-workflows:pull-latest` (kept; "sync with remote" removed
  because `reset-to-remote` also claimed it; description cut from 723
  characters).

#### `reset-to-remote`

- **Steps:**
  1. Run only when the owner asked for a destructive reset in his own words.
  2. Verify one remote; refuse on a dirty tree or stashes; refuse in a shared
     primary checkout where another session has work.
  3. `git fetch --all --prune`; find the default branch.
  4. Show the plan: branches to reset, branches to delete, local-only branches
     kept. Wait for a yes.
  5. Reset and delete as planned; run the lockfile's installer (ask when there
     are several lockfiles).
- **CLI:** none. **Agents:** none.
- **Replaces:** `git-workflows:reset-to-remote` (kept; "sync with remote"
  removed; description cut from 741 characters).

### 3.6 Salesforce

#### `sf-architect-solutioning`

- **Steps (body ported byte for byte):** five phases with gates: Intake,
  Project context, Verify, Design, Plan. "No code without a plan. No plan
  without clear requirements. No platform claim without a source." Phase 2
  reads `AGENTS.md`, which in V2 says designs live with the work item. When
  `solution-design` is coordinating, it returns findings and starts no second
  interview.
- **CLI:** none. **Agents:** none.
- **Replaces:** nothing; ported as is (GOAL.md).
- **Description:** the ported text is 616 characters and claims "design this
  feature", "solution this requirement", and "architect this". The proposed
  description in section 1 changes the frontmatter only; the body stays byte
  for byte, and because `solution-design` keeps its name, the body's
  coordination line still works. This needs Mike's yes (section 9.1, decision 1).

#### `sf-deploy-check`

- **Steps:** find the work items in the deploy; compare each per-item
  `package.xml` with `_master/package.xml` and the component tracker; an item
  counts as ready only when `toolkit work show` reports its result approval;
  run `python tools/kb/query_graph.py <Object.Field>` when `tools/kb/` exists;
  narrow the deploy set; end with a read-only org check; production commands go
  to the owner.
- **CLI:** `toolkit work show <id>`.
- **Agents:** none.
- **Replaces:** the model's `sf-deploy-check` (description only).

#### `sf-component-tracker`

- **Steps:** one CSV row per component with the fixed nine columns; Change Type
  New, Modified, or Destructive; update `_master/package.xml`,
  `<work-item-id>/package.xml`, `destructiveChanges.xml`, and
  `manual-steps.md`; set the Sandbox and Production flags when a deploy result
  comes back; keep profiles and the other listed types out of manifests. The
  per-item folder under `delivery/deployment/` is named by the item id.
- **CLI:** `toolkit work show <id>`.
- **Agents:** none.
- **Replaces:** the model's `sf-component-tracker` (description only).

#### `sf-data-change`

- **Steps:** first confirm a `data-load` work item with approved requirements
  exists (open `work-on` if not; the CLI refuses to move a `data-load` item past
  stage 03 without approval); build the load file and the backup; write
  numbered load steps, the success check, and the undo steps; file them under
  `delivery/data/` with the `.gitignore` that keeps data files out of Git;
  record the details in the work item and set `waiting_on: owner`; hand the
  package to the owner, who runs it. Agents never write production data.
- **CLI:** `toolkit work show <id>`, `toolkit work history <id> --note`,
  `toolkit work set <id> --waiting-on owner`.
- **Agents:** none.
- **Replaces:** the model's `sf-data-change` (description only).

---

## 4. Agents

All seven run on `model: opus` and carry their own Plain English writing rules,
because subagents and Codex never receive the output style. None starts other
agents, talks to the owner, changes the work item, merges, deploys, or adds AI
credit. Skills pass the text an agent needs (requirements, the design draft) in
the brief, so agents work the same for local and Notion trackers without Notion
access of their own.

Codex plugins do not load `agents/` (critique P13). Each calling skill uses the
fallback in `references/helpers.md`: read the role file and pass its full text
to a native Codex worker; with no worker, do the work and say no independent
check ran. The current `work-guide` and `solution-design` skills already work
this way (`session-skills.md` section 9). Generating
`.codex/agents/<name>.toml` at init is a later option, not required here.

| Agent | Plugin | Job | Tools | Writes | Used by | Replaces |
| --- | --- | --- | --- | --- | --- | --- |
| `requirements-analyst` | work | Checks requirements: missing pieces, places not explicit end to end, wording a builder could misread, build details in requirements, drift from the Agreed goal. Returns ready or not ready with a fix per finding. | Read, Glob, Grep | nothing | `work-requirements`, `solution-design` | `design-product-analyst` (renamed), the requirements mode of `delivery-reviewer`, the checks of `spec-check` |
| `researcher` | work | Answers one bounded question from project evidence, official documentation, and community sources, each finding labeled by source type. | Read, Glob, Grep, WebSearch, WebFetch | nothing | `work-requirements`, `solution-design`, `work-on`, `work-delegate` | `design-researcher` and `delivery-researcher` (merged; the Sonnet default removed) |
| `design-architect` | work | Writes or fixes one design option as a local draft file; the main agent saves it through `toolkit work design`. | Read, Glob, Grep, WebSearch, WebFetch, Write, Edit | only its named draft file | `solution-design` | `design-architect` (kept) |
| `design-critic` | work | Gives one verdict per requirement for a draft design (satisfied, partly, not), with evidence and a fix list. | Read, Glob, Grep, WebSearch, WebFetch | nothing | `solution-design` | `design-critic` (kept); the design mode of `delivery-reviewer` |
| `builder` | work | Implements one planned task, runs its checks, and returns what changed, the tests run and their result, and anything it could not do. | Read, Glob, Grep, Edit, Write, Bash; `isolation: worktree` (from lifecycle and minimal) | only the files in its brief | `work-on`, `work-check`, `work-delegate` | new; replaces the unnamed general agents `work-guide` briefed by hand |
| `acceptance-checker` | work | Checks a finished result against each R-xx acceptance check and the design's acceptance checks; runs tests; returns a verdict per requirement with evidence, defects in the diff, and checks that could not run. Never the agent that built it. | Read, Glob, Grep, Bash (tests and read-only commands) | nothing | `work-check`, `work-finish` | the result and plan modes of `delivery-reviewer` |
| `handoff-verifier` | session-skills | Checks that a drafted handoff prompt states the goal and that every fact holds up. Returns a goal verdict, a claims table, and what it skipped. | Read, Glob, Grep, Bash (read-only, including `toolkit work show`, `toolkit memory get`, `gh issue view`) | nothing | `handoff` | `handoff-verifier` (kept; `model: inherit` becomes `opus`) |

`builder` and `isolation: worktree`: the captured docs say an isolated worktree
branches from the default branch unless the setting `worktree.baseRef` is
`"head"` (`worktrees.md`, "Choose the base branch"; `plugins-reference.md` lists
`isolation` as a supported plugin-agent field). The project settings fragment
must set `"worktree": { "baseRef": "head" }` so a builder starts from the item's
branch, not from `main`.

Retired: `delivery-researcher` (merged into `researcher`), `delivery-reviewer`
(split across `requirements-analyst`, `design-critic`, and `acceptance-checker`),
the model's `memory-curator` (ARCHITECTURE.md section 7). The minimal draft's
single `reviewer` agent with five modes was not taken: each checker has a
different checklist and success condition, and one file would carry all five.

---

## 5. Trigger-collision check

### 5.1 Owner messages and the one skill each starts

Checked against the exact descriptions in section 1. "Nearest other" includes
skills from other plugins installed on this Mac.

| # | Owner message | Skill | Nearest other skill, and why it does not start |
| --- | --- | --- | --- |
| 1 | "Where are we?" | `work-status` | `session-summary` covers this chat only and does not claim "where are we". |
| 2 | "What's next?" | `work-status` | `work-on` claims "keep going" (do it); this asks to be told. |
| 3 | "Keep going." | `work-on` | `work-delegate` claims "take it from here" (hand the goal to agents); "keep going" continues without changing who delivers. |
| 4 | "Let's build the login page." | `work-on` | `solution-design` claims "how should we build this", a question about approach. Outside: `superpowers:brainstorming`, handled by the `AGENTS.md` routing line (5.4). |
| 5 | "Add dark mode to the backlog for later." | `work-on` | `memory-save` claims "remind me" for personal to-dos, not project work. |
| 6 | "Log a bug: the export button does nothing. Not now." | `work-on` | Outside: `superpowers:systematic-debugging`. "Not now" means log only (step 3). |
| 7 | "Pick up WI-12 where we left off." | `work-on` | `handoff` writes a prompt for a new session; it does not resume work. |
| 8 | "What do you need from me?" | `work-decide` | `work-status` only counts waiting decisions and names `work-decide`. |
| 9 | "Approved, go with option B." | `work-decide` | `solution-design` asked for the choice. If it asked in this exchange, it is still loaded and records the answer itself with the same `toolkit work approve` command; either path ends in the same record. |
| 10 | "We've decided to use Postgres everywhere." | `work-decide` | `memory-save`: a decision for the whole project belongs in `DECISIONS.md`. If the owner says "remember we decided ...", `memory-save` starts and its step 1 sends it to `work-decide`. |
| 11 | "Grill me on the checkout flow." | `work-requirements` | `braindump` plays back without asking questions. Outside: `llm-council` claims "stress-test this", not "grill me". |
| 12 | "Check the spec before you build." | `work-requirements` | `work-check` checks a finished build, not the requirements. |
| 13 | "Change R-02 so only admins can export." | `work-requirements` | `work-decide` records answers; a change of meaning is rewritten and approved again here. |
| 14 | "How should we build the CSV export?" | `solution-design` | `work-on` does the work; this asks about approach. In a Salesforce project `sf-architect-solutioning` is the specialist `solution-design` opens (proposed description). |
| 15 | "Split this into smaller pieces." | `work-organize` | `work-on` opens `work-organize` itself when an item is too big; the phrase is only here. |
| 16 | "Make WI-7 a sub-item of WI-3." | `work-organize` | `work-on` sets a parent only when it creates a new item. |
| 17 | "I moved some folders around." | `work-organize` | `project-setup` repairs the toolkit setup, not work items; `work-status` only reports moves. |
| 18 | "I dragged a card to Done in Notion." | `work-organize` | `work-finish` records Done; `work-organize` keeps the Stage change, says a card in Done is not an approval, and opens `work-finish` only after the owner's yes. |
| 19 | "Is this ready to ship?" | `work-check` | `work-finish` claims "ship it", an instruction; this is a question about readiness. |
| 20 | "Test it against what I asked for." | `work-check` | Outside: `code-review` and `superpowers:requesting-code-review` review a diff, not requirements. |
| 21 | "Ship it." | `work-finish` | `merge-and-clean-up` is the merge step `work-finish` opens. Outside: `superpowers:finishing-a-development-branch`, handled by the routing line. |
| 22 | "Cancel the dark mode item, we don't need it." | `work-finish` | `work-organize` cancels only items the owner removed by hand. |
| 23 | "Merge PR 14 and clean up." | `merge-and-clean-up` | `work-finish` keeps the stage move and Done; the merge itself is here. |
| 24 | "You drive, I'll just approve things." | `work-delegate` | `work-decide` claims "approved" as an answer to a waiting decision; "you drive" hands over the goal. |
| 25 | "Remember I hate tabs." | `memory-save` | `memory-find` claims "do you remember", a question. The UserPromptSubmit hook also adds the `memory-save` line. |
| 26 | "Forget what I said about tabs." | `memory-save` | `memory-tidy` reviews the whole memory; one record is `memory-save`. |
| 27 | "Remind me to email the client." | `memory-save` | `work-on` is for project work. Outside: `schedule` when a time is given ("at 9 tomorrow"). |
| 28 | "What did we decide about the payment provider?" | `memory-find` | `work-decide` records decisions; it does not look them up. |
| 29 | "Memory feels cluttered, clean it up." | `memory-tidy` | `merge-and-clean-up` shares only the word "clean". Outside: `anthropic-skills:consolidate-memory` works on Claude's own memory files, which V2 projects turn off. |
| 30 | "Set up this new repo." | `project-setup` | Built-in `/init` runs only when typed and writes its own `CLAUDE.md`; V2 projects get the model's root `CLAUDE.md`, which holds only `@AGENTS.md`. |
| 31 | "I got a new laptop, check the setup." | `project-setup` | `pull-latest` updates Git, not the toolkit or the computer. |
| 32 | "Update the toolkit in this project." | `project-setup` | `pull-latest` claims "update from origin" (Git). |
| 33 | "I'm going to clear context." | `handoff` | `session-summary` recaps but saves nothing and writes no prompt. |
| 34 | "Recap this chat." | `session-summary` | `work-status` covers the whole project; built-in `/recap` runs only when typed. |
| 35 | "What did we do today?" | `session-summary` | `handoff` claims "I'm stopping for today"; the shared word is "today", the phrases differ. |
| 36 | "Here's a brain dump: ..." | `braindump` | `work-requirements` interviews only after the owner confirms the playback. |
| 37 | "Explain that like I'm five." | `explain-simply` | `unslop` changes voice, not reading level. |
| 38 | "This email reads like AI wrote it." | `unslop` | `explain-simply` simplifies meaning, not voice. |
| 39 | "Get the latest from origin." | `pull-latest` | `reset-to-remote` claims only "wipe local", "match remote exactly", "fresh start from remote". |
| 40 | "Wipe local and match remote exactly." | `reset-to-remote` | `pull-latest` never resets. |
| 41 | "Deploy it to the UAT sandbox." (Salesforce) | `work-finish` | `sf-deploy-check` has no owner phrase; `work-finish` step 3 runs it first. |
| 42 | "Load these 500 contacts into production." (Salesforce) | `sf-data-change` | `work-on`: `sf-data-change` step 1 checks for a `data-load` item with approved requirements and opens `work-on` if there is none, so the gate still holds. |
| 43 | "Which Flow type fits this?" (Salesforce) | `sf-architect-solutioning` | `solution-design` claims design options for a work item, not platform questions. |

Messages no skill claims: "yes", "ok", "looks good", "thanks". The skill that
asked the question records the answer; if nothing was asked, the agent asks what
the owner is approving.

### 5.2 Word-level overlaps that remain

No quoted phrase repeats. These single words appear in more than one
description; the quoted phrase decides:

| Word | Skills | Rule that settles it |
| --- | --- | --- |
| remember | `memory-save` ("remember this"), `memory-find` ("do you remember") | Statement saves; question finds. |
| ship | `work-finish` ("ship it"), `sf-deploy-check` (describes components that "would ship") | `sf-deploy-check` has no owner phrase. |
| deploy | `work-finish` ("deploy it"), `sf-deploy-check`, `sf-component-tracker` | The two `sf-*` skills are agent use, run by `work-finish` and `work-on`. |
| build | `work-on` (a request), `solution-design` ("how should we build this", a question), `work-check` (a finished build) | Request, question, finished result. |
| check | `work-requirements` ("check the spec"), `work-check` ("check it against what I asked for"), `project-setup` ("check the setup") | The object named: spec, result, setup. |
| update | `project-setup` ("update the toolkit"), `pull-latest` ("update from origin") | Toolkit versus Git. |
| clean | `memory-tidy` ("clean up memory"), `merge-and-clean-up` ("merge and clean up") | Memory versus branches. |
| today | `session-summary` ("what did we do today"), `handoff` ("I'm stopping for today") | Recap versus leaving. |
| next | `work-status` ("what's next"), `work-on` (runs the next step) | Question versus doing. |
| fix | `work-on` (fix something new), `work-check` (fixes what testing found) | `work-on` routes an item at stages 09 to 11 to `work-check`. |

### 5.3 Skills from other plugins that compete for the same words

These cannot be removed by V2's own descriptions.

| Outside skill or command | Words | Which should run | Handling |
| --- | --- | --- | --- |
| `superpowers:brainstorming` ("You MUST use this before any creative work") | "let's build X", "add a feature" | `work-on` | `AGENTS.md` routing lines; brainstorming may run inside `work-requirements` as a method, never instead of the work item. |
| `superpowers:writing-plans`, `executing-plans`, `subagent-driven-development` | "plan it", "build it with agents" | `work-on`, `work-delegate` | Plans live in the item's Roadmap and Tasks. |
| `superpowers:systematic-debugging`, `test-driven-development` | "it's broken", "add tests" | `work-on` | Both may run: `work-on` tracks the work, the other is the method. |
| `superpowers:finishing-a-development-branch` | "finish this branch" | `work-finish` | Routing lines. |
| `code-review`, `superpowers:requesting-code-review`, built-in `/review` | "review it" | `work-check` for "does it do what I asked"; `code-review` for a diff | V2 names avoid "review". |
| `feature-dev:feature-dev` | "build a feature" | `work-on` | Routing lines. |
| `anthropic-skills:consolidate-memory` | "clean up memory" | `memory-tidy` | It works on the host's own memory, which V2 turns off (`autoMemoryEnabled: false`). |
| `schedule`, `anthropic-skills:schedule` | "remind me" | `schedule` when a time is given; `memory-save` otherwise | A time versus no time. |
| `llm-council` | "stress-test this" | `llm-council` | `work-requirements` claims "grill me", not "stress-test". |
| Built-in `/init`, `/status`, `/memory`, `/recap`, `/review`, `/plan`, `/tasks`, `/resume` | typed commands | not skills | No V2 skill uses a built-in command name (checked against `platform-best-practices.md` 2.12). |
| `claude-toolkit` plugins (`work-tracker`, `second-brain`, `session-skills`, `git-workflows`, `project-init`, `system-guide`, `hooks-library`, `sf-architect-solutioning`) | every job here; `handoff`, `solution-design`, `pull-latest` and others have the same names | the V2 skill | `project-setup` turns them off per project in both hosts; `toolkit doctor` reports any that are on (critiques B3, P14). Before init, in a folder with no project settings, both sets load: Mike starts setup with `/project-setup` (Codex `$project-setup`), a name no current plugin uses. |
| Hindsight MCP tools (retain, recall) | "remember" | `memory-save` | Expose only recall to agents; saves go through the CLI (`hindsight.md` 11). |

### 5.4 What this check depends on

1. **`AGENTS.md` routing lines** (from owner words), in the template's "Every
   session" block, because `AGENTS.md` is always loaded and descriptions may be
   dropped:

   ```markdown
   - Anything to build, add, fix, or change, and "keep going": the `work-on` skill.
   - "Where are we": `work-status`. "What do you need from me" and approvals: `work-decide`.
   - "Remember", "from now on", "forget that": `memory-save`. "What did we decide": `memory-find`.
   - Method skills from other plugins (brainstorming, plans, debugging) may run inside these, never instead of them.
   ```

   Salesforce projects add one line: "Design work goes through
   `solution-design`; it opens `sf-architect-solutioning` as its specialist."
2. **The CLI names the skill** (from lifecycle): `toolkit work lifecycle` prints
   the "Continue with" column; `toolkit brief` prints it next to each active
   item, names `work-decide` next to the waiting count and `work-organize` next
   to detected moves; the PostToolUse gate message names `work-requirements`.
3. **Entry checks.** Step 1 of each stage skill checks its entry condition and
   opens the right skill when it was chosen wrongly (`solution-design`,
   `work-check`, `work-finish`, `sf-data-change`).
4. **Hook wording** (from lifecycle): the UserPromptSubmit line reads "The owner
   stated something to keep; save it with memory-save, or use work-on if it is
   a task." Its pattern must not match "do you remember".
5. **Per-project plugin enablement** (critiques B3, P14): V1 plugins off in V2
   projects; `sf-architect-solutioning` on only in Salesforce projects.
6. **Tests** (critique I20; `platform-best-practices.md` 3.2): a
   should-start and a should-not-start prompt for every skill in both hosts,
   run with the V1 plugins off and then on. The 43 messages in 5.1 are the
   starting set.

### 5.5 How the descriptions were checked

A Node script (scratchpad copy, not shipped) read the 26 names and descriptions
in section 1 and checked: every name matches `^[a-z0-9]+(-[a-z0-9]+)*$`, is at
most 64 characters, and is not a Claude Code built-in command name; every
description is at most 300 characters, starts with a third-person verb, has a
"Use when", "Use before", "Use after", or "Use only when" clause, and has no em
or en dashes; no quoted phrase from one description appears anywhere in another
description. Result: 0 problems. The first pass found five, fixed here:
`work-requirements` and `sf-architect-solutioning` were over 300 characters,
and "approved" (quoted in `work-decide`) also appeared in `work-requirements`,
`solution-design`, `merge-and-clean-up`, and `publish-docs`.

---

## 6. Why this shape, and the scores

### 6.1 Why this shape

- **One skill per job the owner names, and a separate skill wherever a
  different owner approval ends the work** (the second half from minimal).
  Requirements, design, and result are three approvals, so
  `work-requirements`, `solution-design`, and `work-check` are three skills.
  Codex's guidance says the same: "Split workflows when they have different
  triggers, inputs, or success criteria" (`platform-best-practices.md` 3.2).
- **The owner does not need to know the stages.** `work-on` takes any request
  to do work and opens the stage skill. A normal item passes through about five
  skills (`work-on`, `work-requirements`, `solution-design`, `work-check`,
  `work-finish`) instead of about nine handovers in the lifecycle draft. Each
  handover is a point where Codex, which has no Skill tool, must read another
  `SKILL.md` by path.
- **Everything waiting on Mike is in one place.** `work-decide` answers "what
  do you need from me" and takes approvals that arrive late. This is the one
  job the model project has no answer for today, and it is the most frequent
  job for an owner who only decides and steers.
- **Names work alone.** The listing on this Mac already drops descriptions.
  `work-on`, `work-status`, `work-decide`, `memory-save`, and `project-setup`
  say their job without a description, and the CLI and `AGENTS.md` name the
  right skill as a second route.
- **Mike keeps the commands he types.** `/braindump`, `/explain-simply`,
  `/unslop`, `/handoff`, and `/session-summary` stay. Only skills whose jobs
  moved into the work plugin lose their names (section 9.1, decision 2).
- **Merges taken:** `project-init` and `project-sync` into `project-setup`
  (one entry through `toolkit doctor`; avoids the V1 names). **Merges not
  taken, with the reason:** braindump, explain-simply, and unslop into one
  skill (three different jobs, and Mike types their names); pull-latest and
  reset-to-remote (a safe update and a destructive reset should never share a
  skill); merge-and-clean-up and publish-docs (two different mechanisms);
  sf-component-tracker and sf-deploy-check (changes model scaffold names that
  the Salesforce rules reference); stages 05 to 14 in one skill (ten stages do
  not fit in the first 40 lines of one `SKILL.md`).

### 6.2 Scores

Each criterion scored 1 to 5.

| Criterion | Lifecycle (31 skills) | Owner words (27) | Minimal (13) |
| --- | --- | --- | --- |
| Coverage of every job and stage | 5: every stage has one owning skill; a 15-row gate table ties each gate to its recorder and to CLI or hook enforcement. | 5: stage table, decision table, and other jobs; adds the missing "waiting on the owner" job. | 4: every stage mapped, but `work-deliver` packs stages 05 to 14 and Done into one `SKILL.md`, flagged-task approval is dropped, and `work-board` mixes this chat's recap with project status. |
| Zero trigger collisions | 3: phrases unique by script, but several pairs split near-synonyms ("let's build X" `work-start` versus "start building" `work-build`; "what's next" versus "do the next thing"; "is this ready to ship" versus "ship it" across two skills); the draft relies on step-1 hand-backs when the wrong one is chosen. | 4: quoted phrases unique; remaining word overlaps listed and settled; "approved" can reach the asking skill or `work-decide`, but both end in the same record; its Salesforce fix needs a body edit, not "as is". | 4: fewest pairs by construction and 25 checks pass; keeps `sf-architect-solutioning`'s 616-character description, which claims "design this feature" against `solution-design`; "let's build X" goes to `work-requirements` even for approved items. |
| Description quality for a truncated list | 3: good descriptions, but 31 entries (about 8,700 characters) overflow first, and `work-new`, `work-start`, `work-build`, `work-plan` are hard to tell apart by name alone. | 5: names say the job; owner phrases in quotes; the most used skills keep their descriptions longest. | 3: small listing, but merged names do not carry their jobs (`restate-plainly` for unslop, `work-board` for a chat recap, `git-land` for publish-docs, `git-sync` holding a hard reset); Mike loses `/braindump`, `/explain-simply`, `/unslop`, `/session-summary`. |
| Fewest skills without losing clarity | 2: 13 work skills; about nine handovers per item. | 4: 9 work skills; about five skills per item; init and sync could be one. | 3: the fewest skills, but four merges lose clarity (see the row above). |
| Fit with the CLI and hooks | 5: the CLI prints the owning skill; gate enforcement mapped to CLI and hooks; precise list of missing commands. | 4: clear list of missing commands; did not use the CLI or briefing to name skills. | 4: `project-setup` built on `toolkit doctor`; good gap list; its `sf-deploy-prep` merge renames model scaffold folders, and one five-mode `reviewer` agent holds five checklists. |
| **Total (of 25)** | **18** | **22** | **18** |

Owner words is the base. Taken from minimal: the `solution-design` name,
the `project-setup` merge, and the "separate skill per owner approval" rule.
Taken from lifecycle: the "Continue with" column printed by the CLI and the
briefing, the gate table, the `builder` agent's `isolation: worktree`, the
split shared references, and the UserPromptSubmit wording.

---

## 7. What this index needs elsewhere

### 7.1 CLI additions this index asked for (now in ARCHITECTURE.md section 5)

| Command or field | Needed by | Why |
| --- | --- | --- |
| `toolkit work lifecycle` prints a plain label and a "Continue with" skill per stage, and the approval rules | every work skill, `toolkit brief` | No skill repeats the stage table; the right skill is named even when descriptions are dropped. |
| `toolkit brief` names the skill next to each active item, the waiting count, and detected moves | SessionStart hook | Same. |
| `toolkit work show <id> --section <heading>` | `work-requirements`, `solution-design`, `work-decide` | Read one section in any tracker; Notion bodies are not local files. |
| `toolkit work edit <id> --section <heading> --set-file <f>` | `work-on`, `work-requirements`, `work-decide`, `work-delegate`, `handoff` | ARCHITECTURE has no body-edit command. Without it each work skill needs a separate Notion branch (all three drafts found this). |
| `toolkit work design <id> [--create|--set-file <f>|--status proposed|approved]` | `solution-design` | Read and write the design in any tracker: `DESIGN.md` locally, the Solution Design child page in Notion. The work plugin cannot read the toolkit plugin's template. |
| `toolkit work approve <id> --result --by <name>` | `work-check`, `work-decide`, `work-finish`, `sf-deploy-check` | Stage 11 approval has no record today. |
| `toolkit work decisions` | `work-decide`, `work-status` | `work list --waiting-on owner` sees only the frontmatter; the queue also needs owner Open Questions rows, proposed designs, and items at stage 11. |
| `toolkit decision add --decision <t> --why <t> --by <name> [--replaces D-n]` | `work-decide` | `DECISIONS.md` ids are sequential; parallel sessions picking the next id by hand collide. |
| `toolkit memory glossary [--set-file <f>]` | `memory-save`, `memory-find` | The glossary exists in every backend; section 5 has no command. |
| `toolkit config set <key> <value>` | `project-setup` | Switching the memory backend after init. |
| `toolkit work move <id> --under archive`, with `archive` hidden from the briefing and `work next` | `work-organize` | ARCHITECTURE has no archive rule. |
| Frontmatter `delivery: agent-led | owner-led | not-offered` (from lifecycle) | `work-on`, `work-decide`, briefing | Read the delivery choice without parsing Notes. The detail stays in Notes > Decisions and context. |

Adopting a record with no id and renumbering a copied folder are handled by
`toolkit work sync` as critique B2 proposes; no separate command is needed.

### 7.2 Hooks, rules, templates, and settings that must use these names

- **UserPromptSubmit** line: "The owner stated something to keep; save it with
  memory-save, or use work-on if it is a task." Pattern must not match "do you
  remember".
- **Stop** hook names `memory-save`; the **PostToolUse** gate message names
  `work-requirements`; the **SessionStart** briefing names `work-decide`,
  `work-organize`, and `project-setup` as in 5.4.
- **Rules** (the model's names, all applied on branch
  `toolkit-v2/approved-changes`): `keep-work-item-current.md` (`work-on`,
  `work-decide`, `work-delegate`, `handoff`, `toolkit work lifecycle`);
  `session-handoff.md` (`handoff`, memory through `memory-save`);
  `memory-review-and-save.md` (`memory-save`, `toolkit memory` commands);
  `humanize-outbound-text.md` (`humanizer`, falling back to `unslop`);
  `work-item-folders.md`, local tracker only (moves handled by
  `work-organize`); `publish-project-documents.md` (`publish-docs`, with
  `DECISIONS.md` in its paths); `component-tracker.md`,
  `check-deployment-contents.md`, and `production-data-changes.md` keep their
  `sf-*` skill names.
- **`AGENTS.md`:** the model's own `AGENTS.md` carries the routing lines in
  5.4 and names `work-on`, `work-status`, `work-decide`, `memory-save`,
  `memory-find`, `memory-tidy`, `project-setup`, and `solution-design`.
- **Settings fragment:** `"worktree": { "baseRef": "head" }` for `builder`
  (section 4); `enabledPlugins` off for every `*@claude-toolkit` plugin, and the
  matching `.codex/config.toml` entries.
- **Plugin names:** the lead decides whether to rename `session-skills`,
  `git-workflows`, and `sf-architect-solutioning`, and whether each V2 plugin
  ships with `defaultEnabled: false` (critiques B3, P14). Skill names do not
  change either way.

---

## 8. What happens to every current skill

Current skills not listed as "kept" in section 3:

| Current skill | Decision | V2 home |
| --- | --- | --- |
| `work-tracker:work` | Split | `work-on`, `work-status`, `work-decide`, `work-organize`, `work-finish`, `work-delegate`; its rules move into the CLI and hooks |
| `session-skills:requirements-helper` | Renamed and moved | `work-requirements` |
| `session-skills:grill-me` | Merged | `work-requirements` (its `brainstorms/` folder does not exist in V2) |
| `session-skills:spec-check` | Merged | `work-requirements` step 7 and the `requirements-analyst` agent |
| `session-skills:solution-design` | Moved, name kept | `solution-design` in the work plugin |
| `session-skills:track-tasks` | Retired | Uses Claude Code's `TaskCreate`, which Codex lacks; its triggers collided with `work-status` and `session-summary`; lasting to-dos go to work items or focus to-dos |
| `session-skills:work-guide` | Retired | Plan and tasks into `work-on`; helpers and teams into `work-delegate`; Notes discipline into `references/conventions.md` |
| `project-init:project-init`, `project-sync` | Merged | `project-setup` |
| `project-init:machine-sync` | Retired | `toolkit machine-setup`, run by `project-setup` |
| `project-init:work-item-lifecycle` | Merged | `work-finish` (closing checklist); `AGENTS.md` "Where information goes" table |
| `second-brain:knowledge-save`, `knowledge-find`, `knowledge-review` | Replaced | `memory-save`, `memory-find`, `memory-tidy` |
| `second-brain:knowledge-setup` | Replaced | `project-setup` |
| `system-guide:system-guide` | Retired | Not in the port list (ARCHITECTURE.md section 12, item 10) |
| `hooks-library:hooks-library` | Retired | Hooks ship in the toolkit plugin |

---

## 9. Decisions for Mike, and what to change first if the check fails

### 9.1 Decisions that are Mike's

1. **`sf-architect-solutioning` description.** GOAL.md says port it as is.
   Recommended: allow a frontmatter-only change to the description in
   section 1 and keep the body byte for byte. Reason: the current 616-character
   description claims "design this feature" and "solution this requirement",
   so in a Salesforce project "design this" could start a second design process
   outside the work item. Fallback if Mike says no: ship it unchanged, accept
   that one known overlap, and rely on the `AGENTS.md` Salesforce line and the
   body's own "return findings to `solution-design`" rule.
2. **Slash commands that change.** Gone: `/grill-me`, `/requirements-helper`,
   `/spec-check`, `/track-tasks`, `/work-guide`, `/project-init`,
   `/project-sync`, `/work`. New: `/work-requirements` (says "grill me" to it),
   `/project-setup`. Recommended: no stand-ins; plain words reach the right
   skill. A missed one can come back as a manual-only stand-in
   (`disable-model-invocation: true` in Claude Code and
   `allow_implicit_invocation: false` in Codex), which costs no listing space.
3. **`superpowers` in V2 projects.** Recommended: the `AGENTS.md` routing line
   first; turn the plugin off per project only if the tests in 5.4 show misses.
4. **Machine-wide no-AI-credit rule and hook.** Today `machine-sync` installs
   them. They stay from the current toolkit on this Mac; decide whether V2 needs
   its own copy.

### 9.2 If the independent check finds problems, change these first

1. `work-decide` claiming "approved": if tests show it starting when the asking
   skill is already active, drop "approved" and "go with option B" from its
   description and keep only "what do you need from me" and "what's waiting on
   me".
2. `project-setup`: if the two paths confuse it, split back into two skills
   with names no current plugin uses (for example `project-setup` and
   `project-repair`).
3. `memory-save` claiming "remind me": if project to-dos land in the focus
   file instead of the tracker, move "remind me" to `work-on`.
4. Listing still over budget: the next merge is `work-delegate` into `work-on`
   (the offer is already `work-on` step 4), at the cost of a less specific
   name.
