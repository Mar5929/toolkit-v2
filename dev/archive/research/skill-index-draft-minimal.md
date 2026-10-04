# Skill index draft: fewest skills

Draft for `dev/SKILL-INDEX.md`, written 2026-09-26 from `dev/GOAL.md`,
`dev/ARCHITECTURE.md`, and the research briefs in `dev/research/`. The angle of
this draft is the smallest set of skills that still covers every job with no
two skills sharing a trigger. Other drafts may take other angles; the lead
picks.

## 1. Answer

- **10 skills** in a project that is not Salesforce, **13** in a Salesforce
  project (10 plus `sf-architect-solutioning` and two project-local skills).
  Today Mike's machine lists **30** toolkit skills whose names and descriptions
  add up to about 14,100 characters. This set adds up to about 2,800 characters
  (not Salesforce) or about 4,000 characters (Salesforce), so the whole V2 set fits
  in the listing budget with room left for other plugins.
- **4 agents** instead of today's 8 (7 in session-skills plus the model's
  `memory-curator`).
- Every description is under 300 characters (measured, section 3).
- The work lifecycle uses **one skill per owner approval gate**:
  `work-requirements` ends in requirements approval, `solution-design` ends in
  design approval, `work-deliver` ends in the owner's approval of the result
  and Done. `work-board` holds everything about the tracker as a whole (status,
  what waits on the owner, parking, splitting, moving, cancelling, and folders
  Mike moved by hand). `handoff` carries work to a new session.

| # | Skill | Plugin | One-line job |
| --- | --- | --- | --- |
| 1 | `project-setup` | toolkit | Set up a new project, repair an existing one, check this computer |
| 2 | `project-memory` | memory | Save, find, forget, and tidy lasting memory and the current focus |
| 3 | `work-board` | work | Where things stand, what waits on the owner, and reorganizing items |
| 4 | `work-requirements` | work | Stages 01-03: capture, interview, spec check, requirements approval |
| 5 | `solution-design` | work | Stage 04: design with agents, design approval |
| 6 | `work-deliver` | work | Stages 05-14 and Done: delivery team, build, test, review, ship |
| 7 | `handoff` | work | Update records and write a checked prompt for a fresh session |
| 8 | `restate-plainly` | session-skills | Brain dump playback, simpler explanation, remove AI-sounding text |
| 9 | `git-sync` | git-workflows | Bring the local repository up to date (safe pull, or reset on request) |
| 10 | `git-land` | git-workflows | Merge an approved PR and clean up, or publish a docs-only change |
| 11 | `sf-architect-solutioning` | sf-architect-solutioning | Salesforce architect (ported as is) |
| 12 | `sf-deploy-prep` | project-local (Salesforce) | Component tracker, manifests, manual steps, hitch-hiker check |
| 13 | `sf-data-change` | project-local (Salesforce) | Owner's package for a production data change |

## 2. Rules this draft followed

1. **Merge when two skills share the owner's words or end in the same place.**
   Example: `session-summary`, `track-tasks`, and the old `work` status all
   answer "where are we", so they are one skill.
2. **Keep separate when the end state is a different owner approval.**
   Requirements, design, and result are three approvals, so they are three
   skills. Codex guidance says to split workflows with different success
   criteria (platform-best-practices.md, Part 3.2).
3. **No two descriptions share a trigger phrase.** Section 9 checks 25 owner
   messages.
4. **Names are lowercase with hyphens, never a built-in command.** `memory`,
   `status`, `recap`, `tasks`, `init`, and `review` are Claude Code built-in
   commands (platform-best-practices.md, Part 2.12), so no skill uses them.
5. **Descriptions:** third person, what it does, then "Use when" with the
   owner's own words, key words first, under 300 characters.
6. **The CLI holds the rules; skills hold judgment.** Stages, statuses, the
   `build`/`data-load` gate, status derivation, move detection, and the
   dashboard are enforced by `toolkit` and the hooks (ARCHITECTURE.md sections
   5 and 6). No skill repeats the stage table; each runs
   `toolkit work lifecycle` when it needs it.
7. **The first 40 lines of each `SKILL.md` carry the steps** listed below;
   longer procedures go in `references/`.

## 3. Descriptions (exact text) and measured length

Measured with `node` on 2026-09-26. Length is characters.

| Skill | Length | Description |
| --- | --- | --- |
| `project-setup` | 280 | Sets up a new project for Toolkit V2 or repairs an existing one: asks tracker, memory, and Salesforce, installs the scaffold, rules, and hooks, and checks this computer. Use when the owner says set up this project, initialize, sync with the toolkit, check my setup, or new laptop. |
| `project-memory` | 272 | Saves, finds, and tidies the project's lasting memory: owner preferences, corrections, lessons, references, and current focus. Use when the owner says remember, from now on, always, never, forget that, or what did we decide, and before asking the owner to repeat anything. |
| `work-board` | 283 | Shows where work stands and reshapes it: this chat's requests, tracker items, what waits on the owner, what is next; parks, splits, nests, moves, or cancels items and adapts to folders the owner moved. Use for where are we, what do you need from me, recap, park that, I moved things. |
| `work-requirements` | 256 | Turns a request into a work item and interviews the owner one question at a time until its requirements are clean and approved (stages 01-03). Use when the owner says let's build, I want, new idea, grill me, check the spec, or changes what an item must do. |
| `solution-design` | 267 | Designs how a work item with approved requirements gets built: runs researcher, architect, and reviewer agents and writes DESIGN.md options for the owner to approve (stage 04). Use when the owner says design this, how should we build this, or asks for design options. |
| `work-deliver` | 277 | Delivers an approved work item: offers agent-led delivery and a team, splits and plans, builds, tests, fixes, gets the owner's review, then PR, deploy, spec update, and Done (stages 05-14). Use when the owner says go ahead, take it from here, is this ready to ship, or ship it. |
| `handoff` | 267 | Updates the active work item and current focus, then writes a checked prompt a fresh session can start from. Use when the owner says write a handoff, I'm going to clear context, this session is getting long, or start a new chat; /handoff check only verifies a prompt. |
| `restate-plainly` | 267 | Restates text in plain words: plays back the owner's brain dump and waits for a yes, re-explains the last answer as short bullets, or strips AI-sounding patterns from a draft. Use for brain dump, play that back, simpler, explain like I'm five, unslop, sounds like AI. |
| `git-sync` | 268 | Brings the local repository up to date with its remote: fetch, then fast-forward or merge pull, never rebase or push; resets to mirror the remote only when the owner asks to wipe local work. Use for get the latest, pull, update from origin, or fresh start from remote. |
| `git-land` | 248 | Puts finished work on the default branch: merges an approved pull request and removes its branch and worktree, or publishes a docs-only change straight from an isolated worktree. Use for merge and clean up, land this PR, or publish this doc change. |
| `sf-architect-solutioning` | 616 | Ported as is (GOAL.md). Text unchanged from the current plugin: "Triggers when the user provides requirements to architect and solution for Salesforce. Acts as a certified Salesforce Technical Architect. Pushes back on vague requirements, clarifies, interviews for more info, verifies platform facts against official Salesforce documentation, and builds a solution plan before any code. Use when user says "architect this", "solution this requirement", "design this feature", feeds requirements, or asks how to build something in Salesforce. Do NOT use for implementation or building; hand off to the project's available implementation workflow. Do NOT use for non-Salesforce work." |
| `sf-deploy-prep` | 270 | Keeps Salesforce deploy records current and checks deploys: updates the component tracker, manifests, and manual steps on every force-app change, and runs the hitch-hiker check before a deploy to a shared org or production. Use when metadata changes or a deploy is near. |
| `sf-data-change` | 267 | Prepares the owner's package for a Salesforce production data change: load file, backup file, numbered load steps, success check, and undo steps, filed under delivery/data/. Use when records must be created, updated, upserted, or deleted, or a backup is needed first. |

`sf-architect-solutioning` is the only description over 300 characters. GOAL.md
says to port it as is, so this draft leaves it. Section 11 asks Mike whether a
description-only trim is allowed.

## 4. Skills in detail

Each entry gives: plugin, stages or jobs covered, `toolkit` commands used
(ARCHITECTURE.md section 5), agents used, what it replaces, and the steps its
`SKILL.md` must carry.

Every work skill (`work-board`, `work-requirements`, `solution-design`,
`work-deliver`, `handoff`) shares three rules, written once in the work
plugin's shared `references/` folder and linked from each `SKILL.md`:

- **Tracker choice.** Read `tracker.type` from `.toolkit.json`. Local and
  Notion go through `toolkit work ...`. GitHub Issues and Jira have no CLI
  driver in this version: follow `references/trackers/github.md` or
  `references/trackers/jira.md` and the service's own tools.
- **Saving.** Save each settled answer in its home before moving on (the
  "Where information goes" table in the project's `AGENTS.md`). Read it back.
  Lead with "Not saved" when a save fails and "Saved but not verified" when the
  read-back fails. Never copy tracker status into memory or a design.
- **Helpers.** Brief each agent with the item ID, the files to read, and the
  one question it answers. Pass `model: opus`. In Codex, which does not load
  plugin agents, read the role file and pass its full text to a native worker;
  if there is no worker, say that no independent check ran.

### 4.1 `project-setup`

- **Plugin:** toolkit.
- **Jobs:** set up a new project (GOAL.md "Project init": copy the scaffold
  except `.work-items/` and `.memory/`, then ask tracker, memory, Salesforce);
  audit and repair an existing project; per-computer setup; Notion and
  Hindsight setup for the project; switching tracker or memory later.
- **`toolkit` commands:** `doctor`, `machine-setup`,
  `init --name --key --tracker --memory [--salesforce] [--dir]`,
  `sync [--dry-run]`, `notion ensure-root`, `notion ensure-project`,
  `hindsight ensure-bank`, `hindsight service install|status|start|stop`,
  `memory export --to`, `memory import --from`.
- **Agents:** none.
- **Replaces:** `project-init`, `project-sync`, `machine-sync` (the per-computer
  checks), `second-brain:knowledge-setup`, `hooks-library`, and the local
  tracker `init` step of `work`.
- **Steps:**
  1. Run `toolkit doctor`. No `.toolkit.json` means a new project; one present
     means repair. If `toolkit` is not found, or doctor reports a computer
     problem, run `toolkit machine-setup` first.
  2. New project: look at the folder without asking (an `sfdx-project.json`
     answers the Salesforce question). Confirm the project name and key in one
     line. Then ask three questions, one at a time, each with a recommendation:
     tracker (local folders, Notion, GitHub Issues, Jira), memory (built-in
     `.memory/`, local Hindsight, Notion), Salesforce yes or no.
  3. Run `toolkit init` with the answers. It writes `.toolkit.json`,
     `AGENTS.md`, the rules, settings, hooks, and the Plain English style, and
     turns off the current `claude-toolkit` plugins in this project's settings.
  4. Notion tracker or memory: check `ntn whoami`; if it fails, ask Mike to run
     `ntn login` himself (it opens a browser). Then run
     `toolkit notion ensure-root` and `toolkit notion ensure-project`.
     GitHub or Jira tracker: show the written setup instructions and create
     nothing in that service without a yes.
  5. Hindsight memory: run `toolkit hindsight service status`; install or start
     the service only after a yes; then `toolkit hindsight ensure-bank`.
  6. Existing project: run `toolkit sync --dry-run` and show one table of gaps
     (missing, out of date, changed by the owner). Apply only approved rows with
     `toolkit sync`. Never overwrite a file the owner changed.
  7. Switching memory later: `toolkit memory export --to <folder>`, change the
     choice, then `toolkit memory import --from <folder>` (see gap 3 in
     section 10).
  8. Run `toolkit doctor` again. Report what was installed, what was skipped,
     and what Mike must do himself (for example, trust the Codex hooks in
     `/hooks`, approve the project's Hindsight MCP server).

### 4.2 `project-memory`

- **Plugin:** memory.
- **Jobs:** save (create, update, supersede), find and read, forget (retire,
  restore, delete), current focus, tidy (duplicates, stale records), backup.
  Also holds the single written copy of the approval policy (ARCHITECTURE.md
  section 7: "The policy is written once").
- **`toolkit` commands:** `memory save --type --name --description
  [--body-file|--body] [--approved-by]`, `memory find`, `memory get`,
  `memory list`, `memory retire`, `memory restore`,
  `memory delete --owner-approved`, `memory focus [--set-file]`,
  `memory export --to`, `doctor`.
- **Agents:** none. The model's `memory-curator` agent is dropped
  (ARCHITECTURE.md section 7).
- **Replaces:** `knowledge-save`, `knowledge-find`, `knowledge-review`, the
  hidden `remember`, `recall`, `reflect`, `retire`, `session-search`, and the
  model's `memory-curator` agent and `memory-curator-dispatch.md` rule body.
- **Steps:**
  1. Read `memory.type` and `memory.approval` in `.toolkit.json`. Read and
     write memory only through `toolkit memory`, never by editing `.memory/`
     files or Notion pages directly.
  2. Find before asking: `toolkit memory find "<words>"`, then
     `toolkit memory get <key>` for each hit. Cite the key in the answer. With
     Hindsight in Claude Code, the `recall` MCP tool may be used for free-text
     questions; still cite what it returned.
  3. Choose the home before saving. A fact about one work item goes in that
     item. A project-wide decision goes in `DECISIONS.md`. A rule for how
     agents work goes in `.claude/rules/`. Only what is left goes to memory.
     Example: "remember I hate tabs" is a lasting preference, so it is saved;
     also offer a formatter setting if it is a code-style rule.
  4. Apply the approval policy. The owner's own "remember", "from now on",
     "always", "never", or a correction is the approval: save now and say
     "Saved to memory: <title>. Say 'forget that' to undo." In `onboarding`
     mode, a fact the agent inferred gets one yes-or-no line, batched at the
     end of the turn. In `trusted` mode, save routine facts and report them.
     Always ask first for anything about a named person, a permanent delete,
     more than 5 records at once, or a change to the policy.
  5. Save: search for an existing record first, so an update replaces it
     rather than duplicating it. Then run `toolkit memory save`. Report the
     CLI's read-back result.
  6. "Forget that": `toolkit memory retire <key>` (reversible).
     `toolkit memory delete <key> --owner-approved` only when the owner asks
     for a permanent delete.
  7. Current focus: read with `toolkit memory focus`; write the four sections
     (Now, Waiting on the owner, Untracked to-dos, Next session starts with)
     with `--set-file`. Under 50 lines. Work item IDs only, never their status.
  8. Tidy, when asked or when `toolkit doctor` flags duplicates or size: list
     records, show one table of proposed merges, retirements, and fixes, apply
     only approved rows, then offer `toolkit memory export --to <folder>` as a
     backup.

### 4.3 `work-board`

- **Plugin:** work.
- **Jobs:** status of the whole project and of this chat ("where are we",
  "recap"); what waits on the owner; what is next; parking an idea or bug for
  later; sub-items and splitting on the owner's request; nesting, un-nesting,
  and moving items; cancelling; priority and "waiting on" changes; adapting to
  folders or Notion cards Mike moved by hand.
- **`toolkit` commands:** `work sync`, `brief`,
  `work list [--status] [--waiting-on] [--tree]`, `work next`, `work show`,
  `work new --title [--type] [--parent] [--stage]`,
  `work move <id> --under <id|group|root>`,
  `work set <id> [--priority] [--waiting-on] [--parent]`,
  `work cancel <id> --reason`, `work history <id> --note`, `work validate`,
  `memory focus [--set-file]`.
- **Agents:** none.
- **Replaces:** `session-summary`, `track-tasks`, and these parts of the
  current `work` skill and others: `status`, `next`, grouping, archiving,
  `validate`, `reconcile`, `link --type children`; the organizing half of
  `work-item-lifecycle`; the "what should happen next" part of `work-guide`.
- **Steps:**
  1. Run `toolkit work sync` first, so any folder Mike moved is picked up (the
     CLI writes `parent` from the folder location and regenerates
     `DASHBOARD.md`). Then run `toolkit brief` and `toolkit memory focus`.
  2. Report what Mike moved or renamed in one line each. For a missing item, a
     duplicate ID, or a Notion page moved out of its Work Items database, ask
     one question per case. Never move an item back, relink it, or restore it
     without his answer.
  3. For "where are we" and "what do you need from me", answer in this order:
     (a) **Waiting on you**: items with `waiting_on: owner`, open questions
     addressed to the owner, designs with `status: proposed`, items at stage
     `11-user-approval`, and focus "Waiting on the owner", each with the one
     decision needed; (b) **This chat**: a table
     `# | What you asked | Status | Where it landed`, one row per request,
     using the eight statuses from today's `session-summary` (Done, Done
     unverified, Partly done, Blocked, Waiting on you, Not started, Dropped,
     Answered); (c) **The project**: in progress, next (`toolkit work next`),
     recently done. This step changes nothing.
  4. "Park that", "add to the backlog", "log this bug": project work becomes a
     new item with `toolkit work new` at `01-discovery`, with the owner's words
     as the Starting request and no interview now. A personal to-do with no
     project work goes to focus "Untracked to-dos".
  5. "Split this": agree the pieces in one short list first. Create each with
     `toolkit work new --parent <id>`. Each sub-item keeps its own
     requirements, stage, and approvals. List the sub-items in the parent's
     Roadmap. Finishing a sub-item never finishes the parent.
  6. "Move this under that", "take it out": `toolkit work move <id> --under
     <id|group|root>`. Say how many nested items move with it.
  7. "Cancel": only on the owner's word, `toolkit work cancel <id> --reason
     "<his words>"`. "Archive": only on the owner's word, through the archive
     command (gap 4, section 10). Priority or "waiting on" changes:
     `toolkit work set`.
  8. After any change: `toolkit work validate`, read the item back, and report
     one line per changed item. Never edit `DASHBOARD.md` or
     `.toolkit-state.json` (the PreToolUse hook refuses it).

### 4.4 `work-requirements`

- **Plugin:** work.
- **Stages:** `01-discovery`, `02-refinement`, `03-requirements-approved`.
- **Jobs:** capture a new request as a work item; the delivery offer and team
  question at the start of substantial work; the discovery interview ("grill
  me"); writing and changing requirements; the spec check; requirements
  approval; changes after approval.
- **`toolkit` commands:** `work list`, `work show`,
  `work new --title --type [--parent]`,
  `work set <id> --stage --waiting-on --type`,
  `work approve <id> --requirements --by <name>`, `work history <id> --note`,
  `work validate`, `work lifecycle`, `memory find`.
- **Agents:** `reviewer` (requirements mode) for the spec check on substantial
  items; `researcher` when a fact question blocks an answer.
- **Replaces:** `requirements-helper`, `grill-me`, `spec-check`; the capture,
  approval-gate, and `requirements --finalize` parts of `work`; the delivery
  offer from `work`'s `agent-led-delivery.md` (asked here first).
- **Steps:**
  1. Find the item (`toolkit work list`, `toolkit work show`), or create it
     with `toolkit work new` at `01-discovery`, recording the owner's words as
     the Starting request. If the item already has approved requirements, stop
     and open `solution-design` (no design yet and one is needed) or
     `work-deliver`.
  2. Substantial new goal with no recorded delivery choice: ask the delivery
     offer, and after a yes the team question, word for word (section 6).
     Record both under Notes, "Decisions and context". A small fix or a quick
     question gets no offer.
  3. Before asking anything, read what is already known: the item,
     `toolkit memory find`, `DECISIONS.md`, and `requirements/<area>.md`.
  4. Interview one question at a time, each with a recommended answer, in the
     order answers depend on each other. Push back when an answer works against
     the goal. Write each answer into the item before the next question
     (Starting request, Agreed goal, `R-xx` blocks, Acceptance). Set
     `02-refinement` when drafting starts.
  5. Unanswered questions go in Open Questions with "Decision needed from:
     owner", and `waiting_on: owner` is set. Build ideas go in Notes,
     "Solution options and considerations", never in requirements. A small
     `bug` or `task` may keep the one line the owner asked for.
  6. Spec check before asking for approval, and whenever the owner says
     "check the spec": flag text that works against the goal, build details
     inside requirements, sentences with two readings, and requirements with no
     reason, each with a proposed fix. Run the `reviewer` agent in requirements
     mode for substantial items. Change nothing without a yes.
  7. Show the Agreed goal, every `R-xx`, and Acceptance in plain words and ask
     for approval. Only on the owner's own words, run
     `toolkit work approve <id> --requirements --by <name>` (stage 03, status
     Ready). Never approve while the goal is still a placeholder or an open
     question is linked to a requirement.
  8. Changes after approval: a wording fix needs no new approval. A change of
     meaning marks the old `R-xx` Superseded, sets stage `02-refinement`, and
     asks for approval again.
  9. End by naming the next step: `solution-design` when the item needs a
     design, otherwise `work-deliver`.

### 4.5 `solution-design`

- **Plugin:** work (moved from session-skills; the name is kept because
  `sf-architect-solutioning`, ported as is, says "When `solution-design` is
  coordinating the conversation, return Salesforce design findings to that
  conversation").
- **Stage:** `04-solution-design`, and design approval.
- **`toolkit` commands:** `work show`,
  `work set <id> --stage 04-solution-design --waiting-on`,
  `work approve <id> --design --by <name>`, `work history <id> --note`,
  `work validate`, `memory find`, `memory save`.
- **Agents:** `reviewer` (requirements readiness, then design critique),
  `researcher` (one per open question), `design-architect` (one per option).
  Salesforce projects: the `sf-architect-solutioning` skill as the domain
  specialist.
- **Replaces:** session-skills `solution-design` and its agents
  `design-product-analyst`, `design-researcher`, `design-architect`,
  `design-critic`; the design-routing part of `work-item-lifecycle`.
- **Steps:**
  1. `toolkit work show <id>`. If `requirements_approved` is `no`, stop and
     open `work-requirements`. Set stage `04-solution-design`.
  2. Write one paragraph on what the design is for. Run the `reviewer` agent
     in requirements mode. A missing requirement goes back to
     `work-requirements`; the design never fills a requirements gap.
  3. Agree the way of working, one question at a time, skipping anything the
     delivery choice already answered: interview or scan first, design
     philosophy (built-in first), one option or several, and the team size
     (recommend one).
  4. Start from the project's `DESIGN.md` template
     (`.work-items/work-item-template/DESIGN.md` when present, else the
     plugin's). Local tracker: beside `WORK-ITEM.md`. Notion: the item's
     Solution Design child page, written through the CLI (gap 2, section 10).
     GitHub or Jira: as their written instructions say. Never `docs/designs/`.
  5. Research: one `researcher` per open question, in parallel. Salesforce
     project: invoke `sf-architect-solutioning` as the domain specialist and
     bring its findings into this design.
  6. Draft: one `design-architect` per option. Review: one `reviewer` in
     design mode per draft. Repeat fixes until the reviewer reports no
     findings. A disagreement that survives two rounds goes to the owner.
  7. Save the design with `status: proposed`, set `waiting_on: owner`, and
     show the recommendation in plain words.
  8. On the owner's approval: `toolkit work approve <id> --design --by
     <name>`. Project-wide decisions go to `DECISIONS.md`; lasting lessons go
     through `project-memory`. Name the next step: `work-deliver`.

### 4.6 `work-deliver`

- **Plugin:** work.
- **Stages:** `05-breakdown` through `14-spec-update`, owner review at
  `11-user-approval`, and Done.
- **Jobs:** the delivery offer and team question when not yet asked; the
  agent team; breakdown into sub-items during delivery; plan; build; test;
  fix; owner review; pull request; deploy; spec update; closing the item.
- **`toolkit` commands:** `work show`, `work lifecycle`,
  `work set <id> --stage --waiting-on`, `work new --title --parent`,
  `work history <id> --note`, `work finish <id> --by --evidence`,
  `work validate`, `work next`, `memory save`, `memory focus --set-file`.
- **Agents:** `builder` (08-10), `reviewer` (plan, result, and the pull
  request head), `researcher` (delivery questions).
- **Replaces:** `work-guide`; the lifecycle, handoff-current, and `finish`
  parts of `work` (with `agent-led-delivery.md` and `team-arrangements.md`);
  the closing checklist of `work-item-lifecycle`; the before-build use of
  `spec-check`; agents `delivery-researcher` and `delivery-reviewer`.
- **Steps:**
  1. `toolkit work show <id>`. Confirm requirements are approved (the CLI and
     the PostToolUse hook refuse `build` and `data-load` past stage 03 without
     it) and the design is approved when there is one. Reread the requirements
     for drift before building.
  2. No recorded delivery choice and the work is substantial: ask the offer,
     then the team question, word for word (section 6), and record them. A no
     to helpers means the main agent does the work itself.
  3. Breakdown (05) only when the item is too large: `toolkit work new
     --parent <id>` per piece. Plan (06): fill the Roadmap phases and Tasks
     from the design's "Order of work". Tracking (07) only when needed
     (Salesforce: the item's `delivery/deployment/<id>/` folder through
     `sf-deploy-prep`). Record each move with `toolkit work set --stage`.
  4. Build (08): one `builder` per task, each in its own worktree, one writer
     per path. Only the main agent edits the work item. Salesforce metadata:
     `sf-deploy-prep` on every change. `data-load` items: `sf-data-change`.
  5. Test (09) and fix (10): a `reviewer` in result mode runs each `R-xx`
     "How to check it". Fix until clean. Record evidence with
     `toolkit work history`.
  6. Owner review (11): show the result, known gaps, and evidence in plain
     words; set `waiting_on: owner`. Record his answer. A clear approval here
     also counts for Done.
  7. Pull request (12, repository work only): write the description through
     `restate-plainly` (humanize mode); a `reviewer` checks the exact head;
     merge through `git-land`, with the owner's yes or a recorded standing
     merge instruction.
  8. Deploy (13) only as authorized. Salesforce: the hitch-hiker check in
     `sf-deploy-prep`; production deploys and data loads are handed to the
     owner, never run by an agent.
  9. Spec update (14): write the delivered behavior into
     `requirements/<area>.md` (and the `docs/system-guide/` area page when one
     exists), published through `git-land`. Project-wide decisions to
     `DECISIONS.md`. At most one `event` memory through `project-memory`.
  10. Done only with the owner's approval: `toolkit work finish <id> --by
      <name> --evidence "<text>"`. Update focus. Say whether the change reached
      the default branch.

### 4.7 `handoff`

- **Plugin:** work (moved from session-skills, because it updates the work
  item and uses the work plugin's `reviewer` agent).
- **Jobs:** carrying work to a new session; checking a handoff prompt that
  came from elsewhere (`/handoff check`).
- **`toolkit` commands:** `brief`, `work show`, `work set <id> --waiting-on`,
  `work history <id> --note`, `work validate`, `memory focus --set-file`,
  `memory save`.
- **Agents:** `reviewer` (handoff mode).
- **Replaces:** session-skills `handoff` and the `handoff-verifier` agent.
  The `offer-context-handoff.md` rule keeps pointing at it.
- **Steps:**
  1. For each item touched this session: update Overview (Current position,
     Next action, Blockers), Notes "Resume here", and `waiting_on`; add a
     history note when something meaningful changed; run
     `toolkit work validate`. Skip this step when the project has no
     `.toolkit.json`.
  2. Save anything the owner asked to keep (the `project-memory` policy).
     Write "Next session starts with" in focus with
     `toolkit memory focus --set-file`.
  3. Draft the prompt. First line, fixed: "This handoff prompt is
     AI-generated and may contain hallucinations, skewed context, etc. Please
     evaluate accordingly." Then: the goal, why it matters, where it is
     written down (work item IDs, not paths), the task, what to read first,
     unsaved decisions, open questions, and one first action. Mark each fact
     with its source: file, repository, owner, or worked out.
  4. Run the `reviewer` agent in handoff mode in the foreground. Fix every
     claim it marks Wrong, Unchecked, or Missing. Say what it skipped.
  5. Show a short list of what was saved and what could not be confirmed,
     then the prompt in one fenced block. A failed save never blocks the
     prompt: say "Not saved" and still give it.
  6. `/handoff check`: run step 4 only on the pasted prompt and report.

### 4.8 `restate-plainly`

- **Plugin:** session-skills.
- **Jobs:** play back a brain dump and wait for a yes; re-explain the last
  answer or a named document simply; remove AI-sounding patterns from a draft,
  including outbound text under the `humanize-outbound-text.md` rule.
- **`toolkit` commands:** none.
- **Agents:** none.
- **Replaces:** `braindump`, `explain-simply`, `unslop`. The rule
  `humanize-outbound-text.md` names this skill instead of the missing
  `humanizer`.
- **Steps:**
  1. Pick the mode from the request: playback (the owner's dump), simplify
     (the agent's last answer or a named document), or humanize (a draft or
     file that another person will read).
  2. Playback: the big idea in one or two sentences; a numbered list of each
     separate ask; "I think you mean X, but you might mean Y" for each unsure
     point; questions with recommended answers. Do no work until the owner
     confirms. A correction replays only the corrected part. After a yes,
     project work goes to `work-requirements` or `work-board`.
  3. Simplify: bullets only, one idea per bullet, 4 to 6 bold-headed groups,
     about 25 bullets at most. Keep every number, name, and path. End with
     "What I need from you" only when there is an action. Do not research
     again.
  4. Humanize: check the 31 patterns in `references/ai-patterns.md`, rewrite,
     and write in the owner's first person when it goes out under his name.
     Show the findings list and the rewrite; write to a file only after a yes.
     Never change numbers, paths, names, IDs, quotes, or code.
  5. Follow `.claude/output-styles/plain-english.md` when present (Codex: the
     same rules from `AGENTS.md`). The style wins on a conflict.

### 4.9 `git-sync`

- **Plugin:** git-workflows.
- **Jobs:** safe update from the remote; a full reset to mirror the remote,
  only on request.
- **`toolkit` commands:** none.
- **Agents:** none.
- **Replaces:** `pull-latest`, `reset-to-remote` (both claimed "sync with
  remote"; merging them removes that collision).
- **Steps:**
  1. Check: one remote, the current branch, a clean working tree, no stashes.
     In the shared primary checkout, stop on a dirty tree or an unexpected
     branch and tell the owner.
  2. Default path: `git fetch --prune origin`, then `git pull --ff-only`. If
     the branches diverged, show both sides (`git log --oneline @{u}..HEAD`
     and `HEAD..@{u}`), then `git pull --no-rebase --no-edit`. Never rebase,
     reset, or push on this path.
  3. Reset path, only when the owner asks to wipe local work or mirror the
     remote: `git fetch --all --prune`; show a plan (branches to hard-reset,
     branches whose remote is gone, local-only branches kept); wait for a yes;
     reset; reinstall from the lockfile (ask when there are several).
  4. Report the incoming commits and the final state.

### 4.10 `git-land`

- **Plugin:** git-workflows.
- **Jobs:** merge an approved pull request and remove its branch and
  worktree; publish a documentation-only change straight to the default
  branch.
- **`toolkit` commands:** none. The work item stage move after a merge stays
  with `work-deliver`.
- **Agents:** none (the independent review of the head is done by
  `work-deliver` before this skill runs).
- **Replaces:** `merge-and-clean-up`, `publish-docs` (with its
  `publish-docs.mjs` script, rewritten for V2 paths).
- **Steps:**
  1. Pick the path. An open pull request: merge path. A documentation-only
     change (`requirements/`, `docs/`, `delivery/` documents, `PROJECT.md`,
     `PROJECT-ROADMAP.md`, `DECISIONS.md`, `ai-external-knowledge/`, README
     files) with no pull request: publish path. Code, rules, skills, hooks,
     or settings: stop, they need a pull request. `.memory/` and
     `.work-items/` are never committed.
  2. Merge path: resolve the exact pull request (`gh pr view --json
     number,url,state,headRefName,headRefOid,baseRefName,isCrossRepository`)
     and map branches to worktrees. Check: open, not draft, mergeable, checks,
     an independent review of that exact head, and the owner's yes or a
     recorded standing merge instruction.
  3. Merge-safety check: compare `git diff --name-only <default>...<branch>`
     with `git status` in the primary checkout. A file in both: stop, name it,
     ask the owner.
  4. `gh pr merge <n> --squash --delete-branch`; confirm the state is
     `MERGED`; fetch and fast-forward the base checkout; remove only the merged
     pull request's worktree and branches.
  5. Publish path: `publish-docs.mjs start --branch <default> -- <files>`,
     edit, stage files by name, `publish-docs.mjs publish --message "<msg>"`,
     and confirm the remote has the commit.
  6. Report the link or commit, the base branch state, and what was cleaned
     up.

### 4.11 `sf-architect-solutioning`

- **Plugin:** sf-architect-solutioning (installed only for Salesforce
  projects).
- **Jobs:** Salesforce architecture and solution plans. In V2 it is normally
  run by `solution-design` as the domain specialist.
- **`toolkit` commands:** none. **Agents:** none.
- **Replaces:** nothing; ported as is.
- **Steps (already in the ported file):** its five phases with gates: Intake,
  Project context, Verify, Design, Plan. "No code without a plan. No plan
  without clear requirements. No platform claim without a source." It reads
  `AGENTS.md` to find where designs live, which V2 routes to `DESIGN.md` or
  the Notion Solution Design page.

### 4.12 `sf-deploy-prep` (Salesforce, project-local)

- **Location:** `.claude/skills/sf-deploy-prep/` and
  `.agents/skills/sf-deploy-prep/`, byte-identical, installed only for
  Salesforce projects.
- **Stages:** `07-tracking-setup`, `08-build` (metadata changes),
  `13-deployment`.
- **`toolkit` commands:** none. Uses `git`, `sf` read-only commands, and
  `python tools/kb/query_graph.py` when `tools/kb/` exists.
- **Agents:** none.
- **Replaces:** `sf-component-tracker` and `sf-deploy-check`. Both work on
  `delivery/deployment/`, and the check reads the tracker the other keeps.
  This changes two folder names in the model scaffold, so the change must be
  listed in `dev/archive/model/model-review.md`.
- **Steps:**
  1. On any create, change, rename, or delete under `force-app/`, in the same
     response: edit the component's one row in `component-tracker.csv`, its
     member in `_master/package.xml`, and the work item's `package.xml`.
  2. A component staged for deletion: Change Type `Destructive`, and the work
     item's `destructiveChanges.xml`. The master manifest is add-only.
  3. Types kept out of manifests (profiles, duplicate rules, matching rules,
     compact-layout assignments): a tracker row plus a step in
     `manual-steps.md`.
  4. Add a manual step when the trigger list says so (for example, a new
     permission set needs assigning). When unsure, add the step.
  5. When the owner reports a deploy result, set that org's flag for every
     component in the deploy.
  6. Before any deploy to a shared or higher org, and before handing the owner
     any production deploy command: list the exact deploy set; decide for each
     component whether its feature is live in the target; diff each file for
     extra edits; query `tools/kb` when present; confirm with a read-only org
     check.
  7. A confirmed hitch-hiker: stop, do not deploy or hand over the command,
     and tell the owner which component would ship and why. Prefer the work
     item's `package.xml` over `_master/package.xml`.

### 4.13 `sf-data-change` (Salesforce, project-local)

- **Location:** `.claude/skills/sf-data-change/` and
  `.agents/skills/sf-data-change/`, installed only for Salesforce projects.
- **Stages:** `08-build` for `data-load` items; `13-deployment` when data
  moves with a release.
- **`toolkit` commands:** `work history <id> --note` to record the event in
  the work item.
- **Agents:** none.
- **Replaces:** the model's `sf-data-change`; only the description is trimmed
  under 300 characters.
- **Steps:**
  1. No agent writes production data. In a sandbox, a write or anonymous Apex
     needs the owner's yes in the same chat, for that one change.
  2. Build the package: the full load file, the backup file when anything is
     overwritten, numbered load steps (tool, operation, object, each field
     mapping, Insert-Null-Values setting, full file path), the success check,
     and the undo steps.
  3. File it under `delivery/data/production-backups/` and
     `delivery/data/data-loads/`, one folder per event; data files stay
     ignored by Git.
  4. Record the event details in the work item (work item, date, org,
     objects, file paths, row counts, operation, success check, undo).
  5. Give the owner the whole package in the reply.

## 5. Agents to ship

All four live in `plugins/work/agents/`, carry `model: opus`, state the Plain
English rules in their own text (subagents and Codex never receive the output
style), never start other agents, never interview the owner, and never add AI
credit.

| Agent | Tools | What it returns | Used by | Replaces |
| --- | --- | --- | --- | --- |
| `researcher` | Read, Glob, Grep, WebSearch, WebFetch | Answer, findings labeled official documentation / project evidence / community claim, claims still to verify, open points | `solution-design` (one per open question), `work-requirements` (a fact that blocks an answer), `work-deliver` (delivery questions) | `design-researcher`, `delivery-researcher` (the same job; one also read community sources) |
| `design-architect` | Read, Glob, Grep, WebSearch, WebFetch, Write, Edit | A draft design option in the named file, and a list of changes after each fix round | `solution-design` | `design-architect` (for Notion, it writes a local draft file and the main agent saves it through the CLI) |
| `builder` | Read, Glob, Grep, Write, Edit, Bash; `isolation: worktree` | The change for one task in its own worktree, the checks it ran and their results, anything left open | `work-deliver` (stages 08-10) | New. V1 used unnamed general agents with no written rules for worktrees, staging by name, or leaving the work item to the lead |
| `reviewer` | Read, Glob, Grep, Bash (read-only commands only: `git log`, `git diff`, `git show`, `gh pr view`, `toolkit work show`, `toolkit memory get`, `ntn` reads), WebSearch, WebFetch | One mode per call. **requirements**: ready or not, missing pieces, not explicit end to end, readings a builder could get wrong, spec-check flags, each with a fix. **design**: a verdict per `R-xx` (satisfied, partly, not) and findings. **plan**: whether the tasks cover every requirement and design step. **result**: each `R-xx` check run and its outcome. **handoff**: goal verdict (Confirmed, Wrong, Unchecked, Missing), a claims table, what was skipped | `work-requirements`, `solution-design`, `work-deliver`, `handoff` | `design-product-analyst`, `design-critic`, `delivery-reviewer`, `handoff-verifier` (all four check a record against sources without changing it) |

Dropped: `memory-curator` (ARCHITECTURE.md section 7: the main agent saves
through the CLI).

Codex does not load plugin agents (platform-best-practices.md, Part 3.5). The
shared helpers reference tells each skill to pass the role file's full text to
a native Codex worker.

## 6. Delivery offer and team arrangement (text the skills must carry)

`work-requirements` asks at the start of substantial work; `work-deliver` asks
only if nothing is recorded yet. The wording is fixed (work-process.md,
section 8). Recommendation: have `toolkit work lifecycle` print these three
questions with the stages, so one copy serves every skill and both hosts.

1. Offer: "Would you like agents to take responsibility for delivering this,
   with you acting as product owner?"
2. After a yes, on the Claude Code desktop app (the host that can list, read,
   and message other chats): "Do you want one team inside this chat, or do you
   want me to rename this chat to Main Orchestrator and coordinate other chats
   that each have their own team?" On any other host: "Shall I run one team of
   helpers inside this chat?"
3. After the Main Orchestrator choice: "Do you want me to archive sessions
   after their task is fully complete, everything is merged and shipped, and
   you approved?"

Record the answers in the item's Notes, "Decisions and context": choice, goal
scope, person, date, authority limits, team arrangement, archive answer. A
decline is not asked again for that goal unless it grows or the owner asks.
Delegation never grants merge, deploy, spending, or publishing authority.

## 7. Coverage

### 7.1 The fourteen stages

| Stage | Skill | Notes |
| --- | --- | --- |
| `01-discovery` | `work-requirements` | Parked items are created at 01 by `work-board` |
| `02-refinement` | `work-requirements` | |
| `03-requirements-approved` | `work-requirements` | `toolkit work approve --requirements` |
| `04-solution-design` | `solution-design` | Salesforce: `sf-architect-solutioning` as the specialist |
| `05-breakdown` | `work-deliver` | Splits the owner asks for go through `work-board` |
| `06-implementation-plan` | `work-deliver` | Roadmap and Tasks from the design's Order of work |
| `07-tracking-setup` | `work-deliver` | Salesforce: `sf-deploy-prep` |
| `08-build` | `work-deliver` | `builder` agents; Salesforce: `sf-deploy-prep`, `sf-data-change` |
| `09-testing` | `work-deliver` | `reviewer` in result mode |
| `10-bug-fixing` | `work-deliver` | |
| `11-user-approval` | `work-deliver` | Owner reviews the result |
| `12-pr-and-push` | `work-deliver` | Merge through `git-land` |
| `13-deployment` | `work-deliver` | Salesforce: `sf-deploy-prep` hitch-hiker check |
| `14-spec-update` | `work-deliver` | `requirements/<area>.md` published through `git-land` |
| Done | `work-deliver` | `toolkit work finish` with the owner's approval |
| Cancelled | `work-board` | `toolkit work cancel` on the owner's word |

### 7.2 Approvals and owner decisions

| Decision | Skill | Record |
| --- | --- | --- |
| Delivery offer and team arrangement | `work-requirements` (first), `work-deliver` (if missing) | Notes, "Decisions and context" |
| Requirements approval | `work-requirements` | `toolkit work approve <id> --requirements --by` |
| Design approval, choice between options | `solution-design` | `toolkit work approve <id> --design --by` |
| Owner review of the result (stage 11) | `work-deliver` | `toolkit work history` note |
| Done | `work-deliver` | `toolkit work finish <id> --by --evidence` |
| Merge | `git-land` (called by `work-deliver`) | Owner's yes or a standing instruction in `DECISIONS.md` |
| Deploy, production data | `sf-deploy-prep`, `sf-data-change` | Handed to the owner |
| Cancel, move, split | `work-board` | CLI command with the owner's words |
| Memory saves that need approval, deletes | `project-memory` | CLI `--approved-by`, `--owner-approved` |
| Tracker and memory choice, Notion or Hindsight setup, creating things in GitHub or Jira | `project-setup` | `.toolkit.json` |

Task-level approval (V1 `--approval-required`) has no V2 home: the model's
Tasks format has no such field and the V2 CLI has no flag. This draft drops it.

### 7.3 Other jobs from the task

| Job | Skill |
| --- | --- |
| Sub-items, splitting, nesting, moving, un-nesting | `work-board` (owner's request); `work-deliver` (breakdown during delivery) |
| Reconciling folders or Notion cards Mike moved by hand | `work-board` (the SessionStart and PostToolUse hooks run `toolkit work sync` on their own; the skill handles the cases that need a question) |
| Handoff between sessions | `handoff` |
| Status, what's waiting on me, what's next, recap of this chat | `work-board` |
| Memory save, find, forget, tidy, current focus | `project-memory` |
| Project init, project sync, computer setup | `project-setup` |

## 8. What happens to every current skill and agent

### 8.1 Session skills (the eleven the task names)

| Current skill | Decision | V2 home | Reason |
| --- | --- | --- | --- |
| `braindump` | Merge | `restate-plainly` (playback mode) | Same job as `explain-simply`, the other direction: restate in plain words before anyone acts |
| `explain-simply` | Merge | `restate-plainly` (simplify mode) | See above |
| `unslop` | Merge | `restate-plainly` (humanize mode) | Also a plain-words rewrite. Merging fixes the conflict with `humanize-outbound-text.md`, which names a `humanizer` skill no plugin ships. Riskiest merge in this draft (section 12) |
| `grill-me` | Merge | `work-requirements` | V2 has no `brainstorms/` folder; its rule of writing each answer before the next question is the requirements interview's rule (ARCHITECTURE.md 12.11) |
| `requirements-helper` | Rename and merge | `work-requirements` | "PRD" does not exist in V2; requirements live in the work item |
| `spec-check` | Merge | `work-requirements` (owner's "check the spec"); `reviewer` requirements mode (used by `solution-design` and `work-deliver`) | Four V1 pieces checked requirements quality; V2 keeps one skill step and one agent mode |
| `solution-design` | Keep, move to the work plugin | `solution-design` | Its name is what `sf-architect-solutioning` refers to; the design approval is its own gate |
| `handoff` | Keep, rewrite, move to the work plugin | `handoff` | Needs the work item, the focus, and the `reviewer` agent; V1 internals removed from the description |
| `session-summary` | Merge | `work-board` ("This chat" table) | Its trigger words ("where do things stand", "status of my requests") collided with `track-tasks` and with project status |
| `track-tasks` | Retire | `work-board` (session list), `project-memory` focus (lasting to-dos), `work-board` parking (backlog) | Codex has no `TaskCreate`; "where are we" is now one skill; ARCHITECTURE.md 12.11 retires it |
| `work-guide` | Retire | `work-deliver` and the work plugin's shared references | Its description was nearly the same as `work` (ARCHITECTURE.md 12.11) |

### 8.2 Other current skills

| Current skill | Decision | V2 home |
| --- | --- | --- |
| `work-tracker:work` | Split | `work-board`, `work-requirements`, `work-deliver`; the CLI and hooks hold its rules |
| `project-init:work-item-lifecycle` | Merge | `work-deliver` step 9 and the "Where information goes" table in `AGENTS.md` |
| `project-init:project-init`, `project-sync`, `machine-sync` | Merge | `project-setup` (the machine-wide no-AI-credit rule and hook are not in V2 scope; section 11) |
| `second-brain:knowledge-save`, `knowledge-find`, `knowledge-review` (and hidden aliases) | Merge | `project-memory` |
| `second-brain:knowledge-setup` | Merge | `project-setup` |
| `system-guide:system-guide` | Retire | Not in the port list (ARCHITECTURE.md 12.10). `work-deliver` step 9 keeps a `docs/system-guide/` area page current when one exists |
| `hooks-library:hooks-library` | Retire | Hooks ship in the toolkit plugin; Salesforce guards are installed by `project-setup` |
| `git-workflows:pull-latest`, `reset-to-remote` | Merge | `git-sync` |
| `git-workflows:merge-and-clean-up`, `publish-docs` | Merge | `git-land` |
| `sf-architect-solutioning` | Keep as is | `sf-architect-solutioning` |
| `sf-component-tracker`, `sf-deploy-check` | Merge | `sf-deploy-prep` |
| `sf-data-change` | Keep, trim description | `sf-data-change` |

### 8.3 Current agents

| Current agent | V2 agent |
| --- | --- |
| `design-researcher`, `delivery-researcher` | `researcher` |
| `design-architect` | `design-architect` |
| `design-product-analyst`, `design-critic`, `delivery-reviewer`, `handoff-verifier` | `reviewer` |
| model `memory-curator` | Dropped |
| (none) | `builder` (new) |

## 9. Trigger-collision check

For each message: the one skill that should fire, and why the nearest other
skill does not. "Outside" marks a skill from another plugin on Mike's machine
that could also match.

| # | Owner message | Skill | Why not the nearest other |
| --- | --- | --- | --- |
| 1 | "Where are we?" | `work-board` | `handoff` writes a prompt for a new session; this only reports. Built-in `/status` runs only when typed |
| 2 | "What do you need from me?" | `work-board` | Its "Waiting on you" list comes first in every status answer |
| 3 | "Let's build the login page." | `work-requirements` | New work starts with requirements (the `build` gate). If the login page item already has approved requirements, step 1 hands to `work-deliver`. Outside: `superpowers:brainstorming` ("MUST use ... before creating features") |
| 4 | "Remember I hate tabs." | `project-memory` | "Remember" is its trigger; the UserPromptSubmit hook also adds a reminder line |
| 5 | "I moved some folders around." | `work-board` | "I moved things" is its trigger; it runs `toolkit work sync` and asks only about missing or duplicate items |
| 6 | "Is this ready to ship?" | `work-deliver` | Stage 11 review; `git-land` runs later, only after the owner's yes. Outside: `superpowers:verification-before-completion` |
| 7 | "Split this into smaller pieces." | `work-board` | Owner-requested splits are board changes; `work-deliver` splits on its own only during delivery |
| 8 | "Grill me on this idea before we commit." | `work-requirements` | "Grill me" appears only here. Outside: `llm-council` ("stress-test this"); the V2 description avoids "stress-test" |
| 9 | "Here's a brain dump: ... Play it back before you start." | `restate-plainly` | "Play that back" appears only here; `work-requirements` starts after the owner confirms |
| 10 | "Explain that like I'm five." | `restate-plainly` | Simplify mode |
| 11 | "This PR description reads like AI wrote it." | `restate-plainly` | Humanize mode; `git-land` does not write descriptions |
| 12 | "How should we build this?" | `solution-design` | Needs approved requirements, else it hands back. In a Salesforce project, `sf-architect-solutioning` also matches "how to build something in Salesforce"; `solution-design` runs it as the specialist, and either entry ends in the same `DESIGN.md` |
| 13 | "Those requirements look right. Approved." (just after they were shown) | `work-requirements` | Already in context; records `toolkit work approve --requirements` |
| 14 | "Go with option B." (just after a design was shown) | `solution-design` | Already in context; records `toolkit work approve --design` |
| 15 | "Take it from here. I'll just approve things." | `work-deliver` | Accepts the delivery offer; asks the team question next |
| 16 | "I'm going to clear context. Write a handoff." | `handoff` | `work-board` recaps but does not write a checked prompt |
| 17 | "What did we decide about the Notion IDs?" | `project-memory` | Find mode; its routing step also reads `DECISIONS.md` |
| 18 | "Forget what I said about tabs." | `project-memory` | Retire mode ("forget that") |
| 19 | "Clean up the memory, there are duplicates." | `project-memory` | Tidy mode. Outside: `anthropic-skills:consolidate-memory`, which works on Claude's own memory files, not the project backend |
| 20 | "Set up this new project." | `project-setup` | Outside: `claude-code-setup:claude-automation-recommender` ("how to first set up Claude Code for a project"); built-in `/init` runs only when typed |
| 21 | "Make sure this project has everything from the toolkit." | `project-setup` | Repair path (`toolkit sync --dry-run`) |
| 22 | "Get the latest from GitHub." | `git-sync` | Safe path; the reset path needs "wipe" or "mirror" wording |
| 23 | "Merge and clean up." | `git-land` | Outside: `superpowers:finishing-a-development-branch` |
| 24 | "Park that idea for later." | `work-board` | Creates an item at `01-discovery` with no interview; `work-requirements` interviews now. Outside: `todoist-cli` only when Mike names Todoist |
| 25 | "Deploy this to the staging sandbox." (Salesforce) | `sf-deploy-prep` | Hitch-hiker check before any shared-org deploy; `work-deliver` stage 13 calls it too |

Also checked, same answers as above: "What did I ask for in this chat?"
(`work-board`); "Cancel WI-7, we're not doing it" (`work-board`); "What's
next?" (`work-board`); "Looks good, close it out" (`work-deliver`, Done);
"Check the spec before you build" (`work-requirements`); "We need to update
400 Account records in production" (`sf-data-change`); "I have a new laptop"
(`project-setup`).

**Result:** no message maps to two V2 skills. The remaining overlaps are with
other plugins (`superpowers`, `llm-council`, `consolidate-memory`,
`claude-automation-recommender`) and with `sf-architect-solutioning`, whose
description is ported as is. Section 11 lists the mitigation.

## 10. What this set requires elsewhere

1. **Hook and rule wording.** The UserPromptSubmit and Stop hook messages
   (ARCHITECTURE.md section 6) name `memory-save`; they must name
   `project-memory`. Rules to update: `work-item-stages.md` (names `work`; use
   `work-requirements`, `work-deliver`, `work-board`), `humanize-outbound-text.md`
   (`restate-plainly`), `knowledge-direct-commit.md` (`git-land`),
   `offer-context-handoff.md` (`handoff`, memory through `project-memory`),
   `component-tracker.md` and `deploy-hitchhiker-check.md`
   (`sf-deploy-prep`). The `AGENTS.md` template placeholders
   `<tracker skill>` and `<memory skill>` become `work-board` and
   `project-memory`.
2. **CLI gap: work item body and design for Notion.** Agents edit local
   `WORK-ITEM.md` and `DESIGN.md` with ordinary file edits, but a Notion page
   body cannot be edited that way. Section 5 of ARCHITECTURE.md has no command
   to read or write a body section or the Solution Design page. Suggested:
   `toolkit work body <id> [--section <name>] [--set-file <f>]` and
   `toolkit work design <id> [--set-file <f>]`.
3. **CLI gap: changing a choice after init.** No command changes
   `tracker.type` or `memory.type` in an existing project. Suggested:
   `toolkit config set memory.type <t>` used with `memory export` and
   `memory import`.
4. **CLI gap: archive.** V1 had `work archive`; section 5 has none. Either
   treat `toolkit work move <id> --under archive` as archiving, or add
   `toolkit work archive`. `work-board` step 7 needs one of them.
5. **Delivery questions in the CLI.** Suggested: `toolkit work lifecycle`
   prints the three questions in section 6, so no skill repeats them.
6. **Shared references in the work plugin:** tracker choice with
   `trackers/github.md` and `trackers/jira.md`, saving rules, and helper
   briefing with the Codex fallback. Skills link to them by relative path,
   which works when the whole plugin is installed.
7. **Scaffold change.** `sf-deploy-prep` replaces two model skill folders
   (`sf-component-tracker`, `sf-deploy-check`); list it in
   `dev/archive/model/model-review.md` so the scaffold still matches the reviewed model.
8. **Older plugins in V2 projects.** `handoff` and `solution-design` also
   exist in the current `claude-toolkit` session-skills plugin. `toolkit init`
   should set every current `claude-toolkit` plugin to `false` in the
   project's `.claude/settings.json` (the model already does this for
   `second-brain`). Codex has no documented per-project plugin switch; verify
   before relying on it.

## 11. Open decisions for Mike

1. **Slash commands you type today.** Merged skills lose their own commands
   (`/braindump`, `/explain-simply`, `/unslop`, `/grill-me`, `/spec-check`,
   `/session-summary`, `/track-tasks`, `/project-init`, `/project-sync`).
   Recommendation: no stand-ins at first, because plain words ("play that
   back", "grill me") still reach the right skill. If you miss one, a
   manual-only stand-in can be added: Claude Code's
   `disable-model-invocation: true` keeps it out of the agent's list entirely,
   so it costs no list space (Codex: `allow_implicit_invocation: false`;
   whether Codex also hides it from the list needs a test).
2. **`sf-architect-solutioning` description.** It is 616 characters, over the
   300 guideline. Recommendation: keep it as is, as GOAL.md says, unless you
   allow a description-only trim.
3. **Other plugins that compete for the same words.** `superpowers`
   (brainstorming, writing-plans, executing-plans, finishing a branch) will
   compete with the work skills in every V2 project. Recommendation: one line
   in the generated `AGENTS.md`: "For tracked work, use `work-requirements`,
   `solution-design`, and `work-deliver`, not the superpowers planning
   skills." Turning `superpowers` off in V2 projects is the stronger option
   and is your call.
4. **Machine-wide no-AI-credit rule and hook.** Today `machine-sync` installs
   them. V2 has no machine-wide skill in this draft; the current toolkit's
   copies stay on this Mac. Decide whether V2 needs its own.

## 12. Risks of the fewest-skills angle, and what to split back first

When the listing overflows, Claude Code keeps names and drops the
descriptions of the least-used skills (platform-best-practices.md, Part 2.6).
A merged skill's name can carry only its main job. With about 2,800 to 4,000
characters in total, overflow is less likely than today's 14,100, but these
merges are the first to undo if the independent check finds a problem:

1. **`restate-plainly` holding `unslop`.** Humanize mode is also started by
   the `humanize-outbound-text.md` rule, while the other two modes run only
   when asked. Split back to `unslop` if the reviewer finds the three modes
   confusing.
2. **`work-board` holding the chat recap.** The name says "board"; "what did I
   ask for in this chat" relies on the description. Split back to
   `session-summary` if tests show misses.
3. **`git-land` holding `publish-docs`.** Two different mechanisms (a pull
   request merge and a direct push script) behind one name.
4. **`sf-deploy-prep`.** Changes the model scaffold's file names.

Merges considered and not taken, with the reason:

- `work-requirements` with `work-deliver` into one work item skill: different
  owner approvals and success criteria, and one 300-character description
  cannot carry both sets of trigger words.
- `solution-design` into `work-deliver`: design approval is its own gate, and
  `sf-architect-solutioning` names `solution-design`.
- `handoff` into `work-board`: the product is a checked prompt, not a status
  answer.
- `sf-data-change` into `sf-deploy-prep`: production data safety has
  different triggers and different limits.
- `git-sync` with `git-land`: one reads from the remote, the other writes to
  the default branch; keeping them apart keeps a pull from ever becoming a
  push.
