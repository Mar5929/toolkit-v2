# Toolkit V2 skill index (draft: owner words first)

Draft for the design-pass judge, written 2026-09-26. It proposes every skill
the Toolkit V2 plugins ship, plus the three Salesforce project-local skills.
Inputs: `dev/GOAL.md` (wins), `dev/ARCHITECTURE.md`, and the research briefs
`session-skills.md`, `work-process.md`, `memory-system.md`,
`platform-best-practices.md`, `project-init-library.md`, `model-review-draft.md`,
`notion-design.md`, `model-inventory.md`.

This draft starts from what a solo developer types, not from the lifecycle.
Each common owner message maps to exactly one skill. The owner never has to
name a stage, a skill, or a command.

Totals: 27 skills (23 in a project that is not Salesforce), 7 agents. Every
description is 300 characters or fewer; the 27 names and descriptions together
come to about 8,000 characters.

---

## 1. Rules this index follows

1. **One skill per job the owner would name.** "Where are we", "let's build
   X", "what do you need from me", "remember this", "ship it" are five jobs and
   five skills.
2. **One skill per owner phrase.** No quoted trigger phrase appears in two
   descriptions (checked by script; section 11 shows the word-level overlaps
   that remain and why each resolves to one skill).
3. **The owner does not need to know the stages.** `work-on` is the first skill
   for any request to do work. It works out the stage itself and opens the
   stage skill it needs (`work-requirements`, `work-design`, `work-organize`,
   `work-check`). Stage skills also have their own owner phrases ("grill me",
   "how should we build this") for when the owner asks for that step directly.
4. **Everything waiting on the owner is in one place.** `work-decide` collects
   requirements approvals, design choices, result approvals, open questions,
   and unanswered delivery offers, and takes them one at a time.
5. **Names work without their descriptions.** Claude Code drops the
   descriptions of the least-used skills when the listing is over budget
   (1% of the context window), and Codex shortens descriptions first
   (platform-best-practices.md, 2.6 and 3.2). About 95 skills are listed in
   a session on this Mac today. So each name says its job: `work-status`,
   `memory-save`, `project-init`.
6. **Descriptions:** third person; what it does, then "Use when ..."; the
   owner's own words in quotes; at most 300 characters.
7. **Names avoid built-in commands.** No bare `status`, `memory`, `init`,
   `recap`, `review`, `plan`, `tasks`, or `resume` (platform-best-practices.md,
   2.12).
8. **Skills call the `toolkit` CLI for anything deterministic** and do not
   restate what the CLI or a hook enforces (ARCHITECTURE.md, section 8).
   Commands the skills need that section 5 does not list are marked
   "(proposed)" and collected in section 9.

---

## 2. Owner phrases and the one skill each starts

Grouped by the job the owner has in mind. A phrase in this table appears in
only one skill's description or is covered by that skill's wording.

| Owner says | Skill |
| --- | --- |
| **Asking where things stand** | |
| "where are we", "what's the status", "catch me up", "what's next", "what should we work on", "how far along is the login page", "what's the plan for WI-4" | `work-status` |
| "recap this chat", "what did I ask for", "what did we do today", "summarize the session" | `session-summary` |
| **Deciding** | |
| "what do you need from me", "what's waiting on me", "anything for me to decide?" | `work-decide` |
| "approved", "I approve the requirements", "go with option B", "no, not that one" (when a decision is waiting and no other skill just asked it) | `work-decide` |
| "we've decided to use Postgres everywhere" (a decision for the whole project) | `work-decide` |
| **Getting work done** | |
| "let's build the login page", "add a CSV export", "fix the footer", "change the button to blue", "keep going", "continue", "work on WI-12" | `work-on` |
| "add dark mode to the backlog", "log this for later", "park that", "make a ticket for X" | `work-on` |
| "run with it", "take it from here", "I'll just be product owner", "use a team of agents" | `work-delegate` |
| "grill me", "ask me questions about it", "what should it do", "the export should also include totals", "check the spec" | `work-requirements` |
| "how should we build this", "what are my options", "give me options" | `work-design` |
| "is it ready", "is this ready to ship", "does it work", "test it", "check it against what I asked for" | `work-check` |
| "ship it", "deploy it", "close it", "mark it done", "we're done with X", "cancel it", "drop it" | `work-finish` |
| **Organizing the work** | |
| "split this into smaller pieces", "break it down", "it's too big", "put WI-5 under WI-2", "group these under billing" | `work-organize` |
| "I moved some folders around", "I renamed the folder", "I dragged cards around in Notion", "WI-9 disappeared" | `work-organize` |
| **Memory** | |
| "remember I hate tabs", "from now on use pnpm", "always ask before deleting", "never touch prod", "forget that", "that's wrong, the client is Acme", "remind me to email the client" | `memory-save` |
| "what did we decide about payments", "do you remember why", "why did we pick Stripe", "have we done this before", "what do you know about me" | `memory-find` |
| "clean up memory", "tidy memory", "memory seems out of date", "back up memory" | `memory-tidy` |
| **Between sessions** | |
| "write a handoff", "I'm going to clear context", "start a new session", "this chat is getting long", "I'm stopping for today" | `handoff` |
| **Setup** | |
| "set up this project", "initialize", "start a new repo" | `project-init` |
| "update the toolkit", "check the setup", "the toolkit is broken", "Hindsight isn't running", "switch memory to Notion", "I got a new computer" | `project-sync` |
| **Talking and writing** | |
| "here's a brain dump", "play that back", "tell me what you heard" | `braindump` |
| "explain it like I'm five", "simpler", "I don't get it" | `explain-simply` |
| "unslop this", "this reads like AI wrote it", "make it sound human" | `unslop` |
| **Git** | |
| "get the latest", "pull", "grab what others pushed" | `pull-latest` |
| "wipe local and match remote", "fresh start from remote" | `reset-to-remote` |
| "merge PR 12 and clean up", "land this pull request" | `merge-and-clean-up` |
| (agent use after editing a Git-tracked document) | `publish-docs` |
| **Salesforce projects only** | |
| "architect this", "how do I build this in Salesforce" | `sf-architect-solutioning` |
| "load these 500 contacts into production", "back up the accounts before we change them" | `sf-data-change` |
| (agent use before a shared-org deploy) | `sf-deploy-check` |
| (agent use after changing metadata under `force-app/`, or "the deploy to UAT worked") | `sf-component-tracker` |

Phrases no skill claims: "yes", "ok", "looks good", "thanks". An answer to a
question the agent just asked belongs to the skill that asked it (section 8).

---

## 3. All skills at a glance

| # | Plugin | Skill | Job in the owner's words | Description length |
| --- | --- | --- | --- | --- |
| 1 | work | `work-status` | "Where are we?" | 288 |
| 2 | work | `work-decide` | "What do you need from me?" | 276 |
| 3 | work | `work-on` | "Let's build X." / "Keep going." / "Log this for later." | 297 |
| 4 | work | `work-requirements` | "Grill me." / "What should it do?" | 295 |
| 5 | work | `work-design` | "How should we build this?" | 300 |
| 6 | work | `work-organize` | "Split this up." / "I moved some folders." | 299 |
| 7 | work | `work-check` | "Is it ready?" | 289 |
| 8 | work | `work-finish` | "Ship it." / "Cancel it." | 270 |
| 9 | work | `work-delegate` | "Run with it." | 289 |
| 10 | memory | `memory-save` | "Remember this." / "Forget that." | 283 |
| 11 | memory | `memory-find` | "What did we decide about X?" | 292 |
| 12 | memory | `memory-tidy` | "Clean up memory." | 280 |
| 13 | toolkit | `project-init` | "Set up this project." | 291 |
| 14 | toolkit | `project-sync` | "Update the toolkit." / "Check the setup." | 300 |
| 15 | session-skills | `handoff` | "I'm going to clear context." | 293 |
| 16 | session-skills | `session-summary` | "Recap this chat." | 283 |
| 17 | session-skills | `braindump` | "Here's a brain dump." | 268 |
| 18 | session-skills | `explain-simply` | "Explain it like I'm five." | 256 |
| 19 | session-skills | `unslop` | "This reads like AI wrote it." | 290 |
| 20 | git-workflows | `merge-and-clean-up` | "Merge PR 12 and clean up." | 275 |
| 21 | git-workflows | `publish-docs` | (agent use) save a Git-tracked document edit | 296 |
| 22 | git-workflows | `pull-latest` | "Get the latest." | 259 |
| 23 | git-workflows | `reset-to-remote` | "Wipe local and match remote." | 270 |
| 24 | sf-architect-solutioning | `sf-architect-solutioning` | "Architect this in Salesforce." | 291 |
| 25 | project-local (Salesforce) | `sf-deploy-check` | (agent use) before a shared-org deploy | 269 |
| 26 | project-local (Salesforce) | `sf-component-tracker` | (agent use) after a metadata change | 286 |
| 27 | project-local (Salesforce) | `sf-data-change` | "Load this data into production." | 279 |

Plugin skills are listed as `<plugin>:<skill>` (for example `work:work-on`).
The Salesforce project-local skills are copied by `project-init` into
`.claude/skills/` and `.agents/skills/` (byte-identical) only when
`salesforce.enabled` is true, and `sf-architect-solutioning` is enabled in the
project's `enabledPlugins` only then. In a project that is not Salesforce the
list is 23 skills.

---

## 4. Skill details

Each entry gives: plugin, exact description, stages or jobs covered, CLI
commands (ARCHITECTURE.md section 5 names; "(proposed)" marks a command section
5 does not have), agents, what it replaces, and the steps the first 40 lines of
its `SKILL.md` must carry. Detail beyond the steps goes in `references/`.

### 4.1 work plugin

#### `work-status`

- **Plugin:** work
- **Description:** Answers "where are we", "what's next", and "catch me up": shows active work items, progress, blockers, the recommended next step, and how many decisions wait on the owner. Use when the owner asks for project status, the plan, progress on an item, or what to work on next. Changes nothing.
- **Stages or jobs:** status of the project or one item; "what's next"; the
  plan of one item. Read-only at every stage.
- **CLI:** `toolkit brief`, `toolkit work list --tree`, `toolkit work next`,
  `toolkit work show <id>`, `toolkit work lifecycle` (plain stage words),
  `toolkit memory focus`.
- **Agents:** none.
- **Replaces:** the status and next parts of `work-tracker:work`
  (`work status`, `work next`); the "where are we" trigger of `track-tasks`;
  the "where do things stand" trigger of `session-summary`.
- **SKILL.md steps:**
  1. Use the session-start briefing if this turn already has it and nothing
     changed since; otherwise run `toolkit brief`.
  2. The owner named an item or an area: run `toolkit work show <id>` and answer
     about that item only: where it stands in plain words, what is done and
     left in its Roadmap, blockers, next action.
  3. The whole project: run `toolkit work list --tree` and `toolkit work next`.
  4. Answer in this order: decisions waiting on the owner (count, one line
     each), in progress, the recommended next item and why, recently done,
     anything moved or broken.
  5. Say stages in plain words from `toolkit work lifecycle` ("waiting for your
     OK on the requirements"), always with the item id. Never ask the owner to
     learn stage numbers.
  6. For each problem, name the skill that fixes it (moved items:
     `work-organize`; setup warnings: `project-sync`) without running it.
  7. Change nothing. End with one thing the owner can say next, for example
     "Say 'what do you need from me' to go through the 2 decisions."

#### `work-decide`

- **Plugin:** work
- **Description:** Walks the owner through each decision waiting on him, one at a time with a recommendation, and records each answer. Use when the owner asks "what do you need from me" or "what's waiting on me", says "approved" or "go with option B", or states a decision for the whole project.
- **Stages or jobs:** every owner decision that arrives outside the skill that
  asked it: requirements approval (03), design choice and approval (04),
  result approval (11), answers to open questions, an unanswered delivery
  offer; decisions for the whole project (`DECISIONS.md`).
- **CLI:** `toolkit work decisions` (proposed; until then `toolkit brief` plus
  `toolkit work list --waiting-on owner` and `toolkit work show <id>`),
  `toolkit work approve <id> --requirements|--design --by <name>`,
  `toolkit work approve <id> --result --by <name>` (proposed),
  `toolkit work edit <id> --section "Open Questions" --set-file <f>` (proposed),
  `toolkit work set <id> --waiting-on <owner|agent|none>`,
  `toolkit work set <id> --stage <stage>`, `toolkit work history <id> --note <text>`,
  `toolkit decision add` (proposed).
- **Agents:** none.
- **Replaces:** nothing directly. It fills the model review's first finding
  (no single list of what is waiting on the owner) and takes over the
  requirements-finalize and Done-approval questions scattered through
  `work-tracker:work`.
- **SKILL.md steps:**
  1. Build the queue. A decision is: requirements waiting for approval, a
     design with status proposed, a result at `11-user-approval`, an Open
     Questions row with "Decision needed from: owner", a delivery offer not yet
     answered. Use `toolkit work decisions` (proposed); until it exists, use
     `toolkit brief`, `toolkit work list --waiting-on owner`, and
     `toolkit work show <id>` for each item.
  2. The owner gave an answer without being asked ("approved", "go with B"):
     match it to exactly one waiting decision. If two could match, ask which,
     naming both.
  3. Otherwise take the decisions one at a time, the one blocking the most
     work first. For each: what is being decided, the choices, the
     recommendation and its main reason, and what happens after each answer.
     One decision per message.
  4. Before recording a requirements approval, check that the Agreed goal is
     filled in and that no open question is linked to a requirement. If not,
     say what is missing and open `work-requirements`.
  5. Record each answer where it belongs: `toolkit work approve` for
     requirements, design, or result; the answer, date, and status in the Open
     Questions row; `toolkit work set <id> --waiting-on`; one
     `toolkit work history` note in the owner's words.
  6. A decision for the whole project: add a row to `DECISIONS.md`
     (`toolkit decision add`, proposed) and save it with `publish-docs`.
  7. A "no" or a change: record it as the answer, move the item back (for
     example `--stage 02-refinement`), and open the skill that redoes the work.
  8. Lead with "Not saved" if any write failed.
  9. When the queue is empty, say so and offer to continue the unblocked items
     with `work-on`.

#### `work-on`

- **Plugin:** work
- **Description:** Starts, continues, or logs project work: finds or creates the work item, works out where it stands, and runs its next step through to a built result. Use when the owner asks to build, add, fix, or change something, says "keep going" or "continue", names an item, or wants an idea logged for later.
- **Stages or jobs:** the first skill for any request to do work; new item
  creation at `01-discovery`; logging for later; `06-implementation-plan`;
  `07-tracking-setup` (Roadmap and Tasks); `08-build`; resuming an item. Opens
  `work-requirements` (01-03), `work-design` (04), `work-organize` (05),
  `work-delegate` (delivery offer), and `work-check` (09-11).
- **CLI:** `toolkit brief`, `toolkit work list`, `toolkit work show <id>`,
  `toolkit work new --title <t> [--type] [--parent <id>] [--stage]`,
  `toolkit work set <id> --stage|--waiting-on|--priority|--type`,
  `toolkit work lifecycle`, `toolkit work history <id> --note`,
  `toolkit work next`, `toolkit work validate <id>`,
  `toolkit work edit <id> --section <name> --set-file <f>` (proposed, for
  trackers other than local).
- **Agents:** `builder` (one per independent task when a team was chosen),
  `researcher` (an unknown found while planning).
- **Replaces:** `work-tracker:work` (start, resume, capture, stage changes);
  `session-skills:work-guide` (plan, tasks, parallel items, helpers);
  `project-init:work-item-lifecycle` (where information goes; now the AGENTS.md
  "Where information goes" table); the "park that" trigger of `track-tasks`.
- **SKILL.md steps:**
  1. No briefing in context: run `toolkit brief`. No `.toolkit.json`: offer
     `project-init` and stop.
  2. Find the item: the id the owner named (`toolkit work show <id>`), or a
     title that matches the request in `toolkit work list`. Two possible
     matches: ask one question. No match: it is new.
  3. Size a new request. A quick edit (one sitting, no choice for the owner, no
     behavior recorded in `requirements/`): do it and report it; no item.
     "Later", "backlog", "park that": `toolkit work new` with the owner's words
     as the Starting request, then stop and say the id. Anything else:
     `toolkit work new` and continue.
  4. A substantial goal with no recorded delivery choice: open `work-delegate`
     before starting.
  5. Pick the next step from `toolkit work show` and `toolkit work lifecycle`:
     requirements not approved and the type is `build` or `data-load` (or the
     risk calls for it): open `work-requirements`. Approved, more than one
     reasonable way to build it, no approved design: open `work-design`. Too big
     for one build: open `work-organize` to split it. Otherwise continue.
     Never ask the owner which stage it is in.
  6. Plan: write Roadmap phases and Tasks (`P1-T01` with Work, Done when,
     Depends on) in the item; `toolkit work set <id> --stage 06-implementation-plan`.
  7. Build (`--stage 08-build`) on the item's own branch and worktree. With a
     team: one `builder` per independent task, one writer per path. Tests go
     with each task. Tick tasks as they finish; add a history note only for
     meaningful events.
  8. When the owner is needed: add an Open Questions row with "Decision needed
     from: owner", run `toolkit work set <id> --waiting-on owner`, keep working
     on tasks that do not depend on the answer, and tell the owner in one line.
  9. Last task done: open `work-check`. This skill never records Done, merges,
     or deploys.
  10. Before stopping with work unfinished: Next action and Resume here are
      current, and `toolkit work validate <id>` is clean.

#### `work-requirements`

- **Plugin:** work
- **Description:** Interviews the owner one question at a time and writes the answers into the work item's requirements and open questions, then asks for approval. Use when the owner says "grill me", "ask me questions", "what should it do", changes or checks a requirement, or an item has no approved requirements.
- **Stages or jobs:** `01-discovery`, `02-refinement`, asking for
  `03-requirements-approved`; requirement changes at any later stage; the
  requirements check before approval (the old `spec-check`).
- **CLI:** `toolkit work show <id> [--section Requirements]` (the `--section`
  flag is proposed), `toolkit work new`, `toolkit work set <id> --stage 01-discovery|02-refinement`,
  `toolkit work edit <id> --section <name> --set-file <f>` (proposed),
  `toolkit work approve <id> --requirements --by <name>`,
  `toolkit work set <id> --waiting-on owner`, `toolkit work validate <id>`.
- **Agents:** `requirements-analyst` (before asking for approval, and on
  "check the spec"); `researcher` (a fact question the owner cannot answer).
- **Replaces:** `session-skills:requirements-helper` (renamed and moved);
  `session-skills:grill-me` (merged); `session-skills:spec-check` (merged);
  `requirements --finalize` in `work-tracker:work`.
- **SKILL.md steps:**
  1. Find the item as `work-on` does; none: `toolkit work new`. Set stage
     `01-discovery` while working out what the owner wants, `02-refinement`
     once requirements are being written.
  2. Before asking anything, read the item (Starting request, Agreed goal,
     R-xx, Open Questions) and run `memory-find` on the topic, so no question
     repeats something already answered.
  3. Ask one question at a time, the most basic first, each with a
     recommended answer. Push back when an answer works against the goal.
  4. Write each answer into the item before asking the next question: Agreed
     goal; R-xx blocks with status Refining, required behavior, boundaries,
     and acceptance check; Open Questions rows for anything unanswered, with
     who must answer. Build ideas go under "Solution options and
     considerations", never into requirements.
  5. A change to an approved requirement: edit the R-xx, keep the old wording
     in its decision record, set it back to Refining, and say what the change
     affects when the item is past stage 03.
  6. Before asking for approval, and whenever the owner says "check the spec":
     brief `requirements-analyst` with the requirements text; fix what it
     finds or turn it into questions.
  7. Show a short summary and ask one line: "Do you approve these
     requirements?"
  8. Yes: `toolkit work approve <id> --requirements --by <owner>`. Not yet:
     `toolkit work set <id> --waiting-on owner`.
  9. Report "Not saved" first on a failed write. Hand back to `work-on` unless
     the owner stops.

#### `work-design`

- **Plugin:** work
- **Description:** Designs how a work item gets built: checks the requirements are ready, runs researcher, architect, and critic agents, and writes the design and options for the owner to approve. Use when the owner asks "how should we build this" or wants options, or an item with approved requirements needs a design.
- **Stages or jobs:** `04-solution-design` and asking for design approval.
- **CLI:** `toolkit work show <id> --section Requirements` (flag proposed),
  `toolkit work set <id> --stage 04-solution-design`,
  `toolkit work design <id> --set-file <f>` (proposed; writes `DESIGN.md` or the
  Notion "Solution Design" child page), `toolkit work approve <id> --design --by <name>`,
  `toolkit work set <id> --waiting-on owner`, `toolkit work history <id> --note`.
- **Agents:** `requirements-analyst`, `researcher` (one per question, in
  parallel), `design-architect` (one per option), `design-critic` (one per
  draft). In Salesforce projects it also opens the `sf-architect-solutioning`
  skill as the domain specialist.
- **Replaces:** `session-skills:solution-design` (renamed and moved; its
  readiness gate and critic loop are kept unchanged).
- **SKILL.md steps:**
  1. Read the requirements. Not approved: say so and open `work-requirements`,
     unless the owner asked for design options first. Set stage
     `04-solution-design`.
  2. Brief `requirements-analyst`; tell the owner plainly whether the
     requirements are ready to design from.
  3. Choose the way of working without asking unless the item is large:
     built-in mechanisms first; one option unless there is a real tradeoff;
     team size from `references/team-roles.md`.
  4. One `researcher` per open question, in parallel.
  5. One `design-architect` per option, writing a draft from the `DESIGN.md`
     template with status proposed. Salesforce project: open
     `sf-architect-solutioning` and pass its findings to the architect.
  6. One `design-critic` per draft; the architect fixes; repeat until the
     critic's list is empty. A disagreement still open after two rounds goes to
     the owner as a decision.
  7. Save the design with the item: `DESIGN.md` beside `WORK-ITEM.md`, or
     `toolkit work design <id> --set-file <draft>` (proposed) for other
     trackers. Never `docs/designs/`.
  8. Show the owner the options, the recommendation, what he will see when it
     is done, the risks, and the order of work; ask him to choose or approve.
  9. Yes: `toolkit work approve <id> --design --by <owner>` and hand back to
     `work-on`. Not yet: `--waiting-on owner`.
  10. Codex: pass each role file's full text to a native worker; with no
      worker, say that no independent research or critique ran.

#### `work-organize`

- **Plugin:** work
- **Description:** Splits work items into sub-items, nests, groups, and moves them, and reconciles folders or cards the owner moved or renamed by hand. Use when the owner says "split this", "break it down", "it's too big", "put X under Y", "I moved some folders around", or the briefing reports moved or missing items.
- **Stages or jobs:** `05-breakdown` (sub-items); sub-items for
  `07-tracking-setup`; nesting, grouping, and moving; reconciling moves,
  renames, deletions, and copies the owner made by hand in `.work-items/` or in
  Notion.
- **CLI:** `toolkit work sync`, `toolkit work list --tree`,
  `toolkit work new --title <t> --parent <id>`, `toolkit work move <id> --under <id|group|root>`,
  `toolkit work cancel <id> --reason <text>`, `toolkit work validate`,
  `toolkit work history <id> --note`.
- **Agents:** none.
- **Replaces:** the group, link-children, archive, and reconcile parts of
  `work-tracker:work`; the move guidance in the `work-item-folders.md` rule
  (the rule stays for file protection and points here).
- **SKILL.md steps:**
  1. Run `toolkit work sync` and `toolkit work list --tree`. Read the report:
     moved, renamed, missing, duplicate id, record without an id.
  2. Moves the owner made by hand mean what they show: an item folder inside
     another item is its sub-item; a plain folder is a group. Tell the owner
     what each move changed, one line each ("WI-7 is now a sub-item of WI-3").
  3. List side effects: a sub-item under a Done or Cancelled parent; a Roadmap
     phase that listed a child that moved away; a `build` sub-item without
     approved requirements.
  4. A missing item: ask whether it was removed on purpose (then
     `toolkit work cancel <id> --reason "<owner's words>"`) or moved outside the
     tracker (then ask where; move it back only after a yes). A duplicate id
     from a copied folder: ask which is the original; the copy gets a new id
     through `toolkit work new`. A record without an id: ask whether it is a new
     item.
  5. Notion: a stage the owner changed by dragging a card is kept (Status is
     recomputed). A card dragged to Done is not an approval: ask for it.
  6. Split (`05-breakdown`): propose the sub-items (title, what each delivers,
     which requirements move), ask once, then `toolkit work new --parent <id>`
     for each; move the requirements with a link back; list the child ids in
     the parent's Roadmap.
  7. Nest, group, or move on request: `toolkit work move <id> --under ...`.
     Before moving a folder, say how many nested items move with it.
  8. Never move, cancel, or restore anything on the agent's own initiative.
  9. Finish with `toolkit work validate` and a short tree of what changed.

#### `work-check`

- **Plugin:** work
- **Description:** Checks a finished build against every requirement with an independent checker agent, fixes what fails, then shows the owner the result to approve. Use when the owner asks "is it ready", "does it work", "test it", or "check it against what I asked for", or when a build's last task is done.
- **Stages or jobs:** `09-testing`, `10-bug-fixing`, asking for
  `11-user-approval`.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage 09-testing|10-bug-fixing|11-user-approval`,
  `toolkit work set <id> --waiting-on owner`, `toolkit work history <id> --note`,
  `toolkit work approve <id> --result --by <name>` (proposed).
- **Agents:** `acceptance-checker` (did not build the change); `builder` (fixes).
- **Replaces:** the result-review mode of the `delivery-reviewer` agent; the
  test and owner-review steps spread through `work-tracker:work` and
  `work-guide`.
- **SKILL.md steps:**
  1. Read requirements, acceptance, and tasks; set stage `09-testing`.
  2. Run the project's tests and every acceptance check the item lists. A
     check that could not run is reported as not run, never as passed.
  3. Brief `acceptance-checker`: one verdict per requirement (met, partly met,
     not met) with evidence, plus defects it saw in the diff.
  4. Failures: set stage `10-bug-fixing`; a `builder` (or the main agent)
     fixes; the checker checks again. Repeat until clean, or until a failure
     needs an owner decision (Open Questions row and `--waiting-on owner`).
  5. Record the result in Recent History: what was checked, the evidence, the
     known gaps.
  6. Set stage `11-user-approval` and `--waiting-on owner`. Show the owner what
     it does now, how to see it himself (a link, a command, or a screenshot),
     the evidence, and the gaps. Ask one line: "Do you approve this result?"
  7. Yes: `toolkit work approve <id> --result --by <owner>` (proposed), then
     open `work-finish`. Changes: requirement changes go through
     `work-requirements`; fixes become tasks and continue in `work-on`.

#### `work-finish`

- **Plugin:** work
- **Description:** Ships and closes a work item after the owner approves the result: pull request, merge, deployment, requirements baseline update, and Done; or cancels it with a reason. Use when the owner says "ship it", "deploy it", "close it", "mark it done", "cancel it", or "drop it".
- **Stages or jobs:** `12-pr-and-push`, `13-deployment`, `14-spec-update`,
  Done, Cancelled; the closing checklist.
- **CLI:** `toolkit work set <id> --stage 12-pr-and-push|13-deployment|14-spec-update`,
  `toolkit work finish <id> --by <name> --evidence <text>`,
  `toolkit work cancel <id> --reason <text>`, `toolkit work list --tree`,
  `toolkit work history <id> --note`, `toolkit memory focus --set-file <f>`.
- **Agents:** `acceptance-checker` (independent check on the exact head before
  a merge, as the standing-merge rule requires where a project has one).
- **Replaces:** `work finish` and cancel in `work-tracker:work`; the "Closing a
  work item" checklist of `project-init:work-item-lifecycle`; the protocol-guard
  checks that refused a finish without the right skill open (now the CLI and
  hooks).
- **SKILL.md steps:**
  1. Check the result approval is recorded. Not recorded: show the result,
     gaps, and evidence and ask. "Ship it" or "mark it done" from the owner
     after he has seen the result counts as approval.
  2. Repository work: push the branch, open the pull request, set stage
     `12-pr-and-push`. Merge through `merge-and-clean-up` when the owner
     approves the merge, or the project has a standing merge instruction and
     `acceptance-checker` found no blocking issue on that exact head.
  3. Deployment, when the item needs one: set stage `13-deployment`.
     Salesforce: `sf-component-tracker` up to date, then `sf-deploy-check`,
     then validate against the sandbox. Production deploys and production
     data loads are handed to the owner to run (`sf-data-change`).
  4. Requirements baseline: set stage `14-spec-update`; copy only the
     delivered behavior into `requirements/<area>.md` (from `AREA-TEMPLATE.md`);
     save it with `publish-docs`.
  5. Sub-items: list open ones. A parent with open sub-items is not finished
     unless the owner says so. Finishing a sub-item never finishes its parent.
  6. Memory: at most one `event` record through `memory-save` when the episode
     will matter later (for example, a costly fix).
  7. `toolkit work finish <id> --by <owner> --evidence "<what shows it works>"`;
     say whether the work reached the default branch.
  8. Cancel: `toolkit work cancel <id> --reason "<owner's words>"`; ask what
     happens to its open sub-items.
  9. Take the item off the current focus "Now" list
     (`toolkit memory focus --set-file`).

#### `work-delegate`

- **Plugin:** work
- **Description:** Hands a goal to agents with the owner as product owner: makes the agent-led delivery offer, asks how the team is arranged, records the choice, and runs the team. Use when the owner says "run with it", "take it from here", "use a team" or "use agents", or work-on starts a substantial goal.
- **Stages or jobs:** the agent-led delivery offer, the team-arrangement
  question, the archive question, recording the choice, and running the team
  of helper agents. Any stage.
- **CLI:** `toolkit work show <id>`, `toolkit work history <id> --note`,
  `toolkit work edit <id> --section Notes --set-file <f>` (proposed),
  `toolkit work set <id> --waiting-on owner|agent`.
- **Agents:** `builder`, `researcher`, `acceptance-checker` (briefed with their
  role files).
- **Replaces:** `references/agent-led-delivery.md` and
  `references/team-arrangements.md` of `work-tracker:work`; the helper
  coordination part of `work-guide`.
- **SKILL.md steps:**
  1. Look in the item's Notes > Decisions and context for a delivery choice
     that covers this goal. A simple question or a quick edit gets no offer.
  2. No choice recorded: ask exactly "Would you like agents to take
     responsibility for delivering this, with you acting as product owner?"
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
     merge, deployment, spending, or publication beyond what was given) in Notes
     > Decisions and context, plus one `toolkit work history` note.
  5. No, or a later revoke: record it; do not offer again for this goal unless
     it grows a lot or the owner asks.
  6. Run the team: the main agent plans and briefs `builder`, `researcher`, and
     `acceptance-checker` agents with their role files, gives one writer per
     path, and never lets a reviewer edit what it reviews. Only the main agent
     updates the work item.
  7. Codex: pass each role file's full text to a native worker; with no worker,
     say no helpers ran and do the work directly.
  8. Tell the owner only state changes; decisions go through Open Questions and
     `--waiting-on owner`.
  9. Archive a chat only when the task is complete, merged and shipped, the
     report is saved, and the owner approved. Never delete a chat.

### 4.2 memory plugin

#### `memory-save`

- **Plugin:** memory
- **Description:** Saves, corrects, or forgets one lasting fact in project memory, and sends anything that belongs elsewhere to its home. Use when the owner says "remember", "from now on", "always", "never", "forget that", or "remind me", corrects something the agent got wrong, or a hook says to save.
- **Stages or jobs:** saving, correcting, and forgetting one record; current
  focus and to-dos; glossary terms; sending other information to its home. The
  approval policy is written here and nowhere else (ARCHITECTURE.md section 7).
- **CLI:** `toolkit memory find <query>`, `toolkit memory get <key>`,
  `toolkit memory save --type <t> --name <slug> --description <d> --body-file - --approved-by <name>`,
  `toolkit memory retire <key>`, `toolkit memory restore <key>`,
  `toolkit memory delete <key> --owner-approved`, `toolkit memory focus --set-file <f>`,
  `toolkit memory glossary --set-file <f>` (proposed).
- **Agents:** none (the model's `memory-curator` agent is dropped,
  ARCHITECTURE.md section 7).
- **Replaces:** `second-brain:knowledge-save` and its aliases `remember` and
  `retire`; the model's `memory-curator` agent and `memory-curator-dispatch.md`
  rule.
- **SKILL.md steps:**
  1. Decide the home first. Memory: a lasting preference, correction, fact
     about the project or the owner, or hard-to-find reference. Somewhere else:
     project work goes to `work-on`; a decision for the whole project goes to
     `work-decide` (`DECISIONS.md`); a standing rule for how agents work in this
     repository is proposed as a rule-file change; a reminder or to-do with no
     work item goes to the current focus "Untracked to-dos"; a project term
     goes to the glossary.
  2. Search first (`toolkit memory find`); update the existing record rather
     than add a duplicate.
  3. Approval, from `.toolkit.json` `memory.approval`: the owner's own words
     (remember, from now on, always, never, forget, a correction) are the
     approval, so save now. `onboarding`: something the agent inferred gets one
     yes/no line first. `trusted`: routine facts the agent is sure of are saved
     and reported. Always ask first for anything about a named person, personal
     details, a hard delete, more than five records at once, or a change to
     this policy.
  4. Save with `toolkit memory save`: type (`user`, `feedback`, `project`,
     `reference`, `event`), slug, one-line description, and the body sections
     Remember, Why, How to apply, Evidence and limits, Related, with a source
     line and an absolute date.
  5. Forget: `toolkit memory retire <key>` (can be undone). Delete only when the
     owner says delete: `toolkit memory delete <key> --owner-approved`.
  6. Focus and to-dos: `toolkit memory focus --set-file <f>`, four sections,
     under 50 lines. Glossary: `toolkit memory glossary --set-file <f>`
     (proposed).
  7. A preference a project setting can enforce (for example "I hate tabs" and
     `.editorconfig` or the formatter config): save it, then offer that change
     too.
  8. Tell the owner in one line: "Saved to memory: <title>. Say 'forget that'
     to undo." A failed save is reported first as "Not saved".
  9. Never store work-item status, secrets, email addresses, or anything
     already in a work item.

#### `memory-find`

- **Plugin:** memory
- **Description:** Finds what the project already knows in memory, decisions, work items, requirements, and past handoffs, and cites the source of each answer. Use when the owner asks "what did we decide", "do you remember", "why did we", or "have we done this before", and before asking him to repeat anything.
- **Stages or jobs:** looking up past decisions, preferences, history, and
  references in every home, before asking the owner to repeat himself.
- **CLI:** `toolkit memory focus`, `toolkit memory find <query>`,
  `toolkit memory get <key>`, `toolkit memory list`, `toolkit work list`,
  `toolkit work show <id>`. Hindsight projects may also use the bank's recall
  tool through the project's MCP entry.
- **Agents:** none.
- **Replaces:** `second-brain:knowledge-find` and its aliases `recall` and
  `session-search`.
- **SKILL.md steps:**
  1. Check the session briefing and the current focus.
  2. `toolkit memory find "<query>"`; open each hit with `toolkit memory get`.
  3. Search the other homes: `DECISIONS.md`; work items (`toolkit work show`
     Recent History and Notes); `requirements/<area>.md`;
     `ai-external-knowledge/INDEX.md`.
  4. Give a source for every fact: memory key, decision id, work item id and
     section, or file path, with its date.
  5. Sources disagree: show both, say which is newer, leave it open, and offer
     `memory-save` to correct the older one.
  6. Nothing found: say so plainly, then ask the owner.
  7. Change nothing.

#### `memory-tidy`

- **Plugin:** memory
- **Description:** Reviews the whole project memory: merges duplicates, retires stale or contradicted facts, trims the current focus, and backs memory up. Use when the owner says "clean up memory" or "tidy memory", says memory seems wrong or out of date, or the toolkit doctor flags memory problems.
- **Stages or jobs:** merging duplicates, retiring stale or contradicted
  records, trimming the current focus, backups.
- **CLI:** `toolkit doctor`, `toolkit memory list`, `toolkit memory get <key>`,
  `toolkit memory save`, `toolkit memory retire <key>`,
  `toolkit memory restore <key>`, `toolkit memory delete <key> --owner-approved`,
  `toolkit memory focus --set-file <f>`, `toolkit memory export --to <dir>`.
- **Agents:** none.
- **Replaces:** `second-brain:knowledge-review` and its alias `reflect`; the
  consolidate, merge, and deduplicate duties of the model's curator.
- **SKILL.md steps:**
  1. Run `toolkit doctor` and `toolkit memory list`.
  2. Find duplicates, contradictions, stale records (replaced by a later
     decision, or not verified for a long time), records that copy work-item
     status, and a current focus over 50 lines.
  3. Show one numbered list of proposed changes (merge, retire, correct, trim),
     each with its reason.
  4. Ask once for the whole list. Anything about a person, any hard delete, or
     more than five changes needs the owner's yes.
  5. Apply with `toolkit memory save`, `retire`, and `restore`; trim the focus
     with `toolkit memory focus --set-file`.
  6. Back up with `toolkit memory export --to <folder>`; say when the last
     backup was made.
  7. Report what changed by key and how to undo it (`toolkit memory restore`).

### 4.3 toolkit plugin

#### `project-init`

- **Plugin:** toolkit
- **Description:** Sets up a project with Toolkit V2: copies the scaffold, asks three questions (tracker, memory, Salesforce or not), writes AGENTS.md and the rules, and checks this computer. Use when a project has no .toolkit.json and the owner says "set up this project", "initialize", or "start a new repo".
- **Stages or jobs:** first setup of a project; first setup of a computer.
- **CLI:** `toolkit machine-setup`,
  `toolkit init --name <n> --key <k> --tracker <t> --memory <m> [--salesforce] [--dir <path>]`,
  `toolkit notion ensure-root`, `toolkit notion ensure-project`,
  `toolkit hindsight service install|status|start`, `toolkit hindsight ensure-bank`,
  `toolkit doctor`, `toolkit brief`.
- **Agents:** none.
- **Replaces:** `project-init:project-init` (the six-gate interview becomes
  three questions); the setup part of `second-brain:knowledge-setup`; the first
  run of `project-init:machine-sync`; the `hooks-library` skill (hooks now ship
  in the toolkit plugin, and Salesforce guards are installed by init).
- **SKILL.md steps:**
  1. `.toolkit.json` already present: stop and open `project-sync`.
  2. Run `toolkit machine-setup` (once per computer). Anything the owner must
     do himself, such as `ntn login`, is named as his step.
  3. Look before asking: empty or existing repository; `sfdx-project.json`
     answers the Salesforce question in advance.
  4. Ask one question at a time, each with a recommendation: project name and
     id prefix; tracker (local folders, Notion, GitHub Issues, Jira); memory
     (built-in `.memory/`, local Hindsight, Notion); Salesforce or not.
  5. Run `toolkit init` with the answers.
  6. Wire the choices: Notion `toolkit notion ensure-root` and
     `ensure-project`; Hindsight `toolkit hindsight service status` (install or
     start when needed) and `toolkit hindsight ensure-bank`.
  7. Tell the owner which older claude-toolkit plugins do the same jobs, and
     turn them off for this project in `.claude/settings.json` `enabledPlugins`
     (section 10).
  8. Run `toolkit doctor` until it is clean, then `toolkit brief` to show the
     first briefing.
  9. Report what was set up in a short list and one next step ("Tell me the
     first thing you want built.").
  10. Never create a GitHub repository, a paid service, or Notion pages outside
      the "AI Agent Second Brain" root without a yes.

#### `project-sync`

- **Plugin:** toolkit
- **Description:** Checks and repairs Toolkit V2 in an existing project and on this computer: adds missing scaffold files, updates rules, and fixes tracker, memory, Notion, or Hindsight wiring. Use when the owner says "update the toolkit", "check the setup", "the toolkit is broken", "switch memory", or "new computer".
- **Stages or jobs:** bringing an existing V2 project up to the current
  toolkit; repairing setup; a new computer; switching the memory backend.
- **CLI:** `toolkit doctor`, `toolkit sync --dry-run`, `toolkit sync`,
  `toolkit machine-setup`, `toolkit notion ensure-project`,
  `toolkit hindsight ensure-bank`, `toolkit hindsight service status|start`,
  `toolkit memory export --to <dir>`, `toolkit memory import --from <dir>`.
- **Agents:** none.
- **Replaces:** `project-init:project-sync` (994 lines, V1 layout);
  `project-init:machine-sync`; the repair and migrate parts of
  `second-brain:knowledge-setup` and its alias `second-brain`.
- **SKILL.md steps:**
  1. No `.toolkit.json`: open `project-init`.
  2. Run `toolkit doctor` and `toolkit sync --dry-run`; on a new computer also
     `toolkit machine-setup`.
  3. Show one table: missing, outdated, changed by the owner, broken wiring,
     each with its fix.
  4. Ask once; apply the approved fixes: `toolkit sync` (adds missing files,
     never overwrites changed ones), `toolkit notion ensure-project`,
     `toolkit hindsight ensure-bank` or `service start`.
  5. A rule the project changed on purpose is reported for porting back to the
     toolkit, never overwritten.
  6. Switching memory: `toolkit memory export --to <folder>`, change
     `.toolkit.json`, wire the new backend, `toolkit memory import --from <folder>`,
     then `toolkit doctor`. Switching tracker: no CLI support yet; show a
     preview and move items by hand only with the owner's yes.
  7. Finish with `toolkit doctor` clean and a short report.

### 4.4 session-skills plugin

#### `handoff`

- **Plugin:** session-skills
- **Description:** Writes a checked prompt a fresh session can start from, after updating the active work item and current focus. Use when the owner says "write a handoff", "I'm going to clear context", "start a new session", "this chat is getting long", or "I'm stopping for today". "/handoff check" checks one.
- **Stages or jobs:** handoff between sessions at any stage; checking a pasted
  handoff prompt.
- **CLI:** `toolkit work show <id>`, `toolkit work set <id> --stage|--waiting-on`,
  `toolkit work edit <id> --section <name> --set-file <f>` (proposed),
  `toolkit work validate <id>`, `toolkit memory focus --set-file <f>`.
- **Agents:** `handoff-verifier`.
- **Replaces:** `session-skills:handoff` (kept; steps 1, 2, 3, and 6 rewritten
  for V2 trackers and memory; the V1 "Session handoffs" list becomes the focus
  section "Next session starts with").
- **SKILL.md steps:**
  1. No `.toolkit.json`: skip steps 2 and 3.
  2. Active work item: Current position, Next action, and Blockers in
     Overview; Resume here in Notes; true stage and `waiting_on`; then
     `toolkit work validate <id>`.
  3. Anything the owner asked to keep this session that is not saved yet: open
     `memory-save`. Write the current focus "Next session starts with" with
     `toolkit memory focus --set-file`.
  4. Draft the prompt. First line exactly: "This handoff prompt is
     AI-generated and may contain hallucinations, skewed context, etc. Please
     evaluate accordingly." Then the goal, why it matters, where it is written
     down (ids, not paths), what to read first, decisions not yet saved, open
     questions, and one first action. Every fact carries its source kind
     (file, repository, owner, worked out).
  5. Run `handoff-verifier`; fix every Wrong, Unchecked, Missing, or Skipped
     finding.
  6. Show what was saved (anything not saved comes first) and the prompt in one
     fenced block.
  7. "/handoff check": run only step 5 on a pasted prompt.
  8. Never commit `.memory/` or `.work-items/`; never stop the owner from
     clearing.

#### `session-summary`

- **Plugin:** session-skills
- **Description:** Shows a table of what the owner asked for in this chat and where each request landed, then what still needs him. Use when the owner says "recap this chat", "summarize the session", "what did I ask for", or "what did we do today". Covers this conversation only, not the whole project.
- **Stages or jobs:** recap of this conversation only.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:session-summary` (kept, description trimmed
  from 656 characters; "where do things stand" moves to `work-status`, "being
  handed off" to `handoff`); `session-skills:track-tasks` (retired, section 6).
- **SKILL.md steps:**
  1. Read this conversation only; list the real requests, not the steps.
  2. Table: #, What you asked, Status, Where it landed, with the eight fixed
     statuses kept from the current skill.
  3. Then "Still open, and it needs you".
  4. For the state of the whole project, point to `work-status` in one line.
  5. Change nothing.

#### `braindump`

- **Plugin:** session-skills
- **Description:** Plays back a loose brain dump in very simple words and waits for the owner to confirm before any work starts. Use when the owner types /braindump or says "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start".
- **Stages or jobs:** confirming understanding before any work. No writes.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:braindump` (kept; description trimmed from 387
  characters; the settings-file voice lookup replaced by the shared voice line).
- **SKILL.md steps:**
  1. No work until the owner confirms.
  2. Play back the big idea in one or two sentences, then a numbered list of
     each separate ask.
  3. Say what is unclear ("I think you mean X, but you might mean Y"), then the
     questions, each with a recommended answer.
  4. A correction replays only the corrected part.
  5. After a yes, hand project work to `work-on`.

#### `explain-simply`

- **Plugin:** session-skills
- **Description:** Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path. Use when the owner types /explain-simply or says "explain it like I'm five", "simpler", "put that in plain bullets", or "I don't get it".
- **Stages or jobs:** re-explaining at a lower reading level.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:explain-simply` (kept; description trimmed from
  377 characters).
- **SKILL.md steps:**
  1. Take the named thing, or the last substantial answer.
  2. Bullets only, one idea and one line each, in 4 to 6 bold-headed groups,
     about 25 bullets at most.
  3. Simplify the wording, never the facts: every number, name, and path stays.
  4. End with a numbered "What I need from you" only when there is an action.
  5. Do not research again.

#### `unslop`

- **Plugin:** session-skills
- **Description:** Rewrites text so it no longer reads as machine-written, keeping every fact, and shows the findings before saving. Use when the owner says "unslop this", "this reads like AI wrote it", or "make it sound human", or when the humanize-outbound-text rule applies to text going to another person.
- **Stages or jobs:** removing machine-written patterns from text on request,
  and for outbound text under the `humanize-outbound-text.md` rule.
- **CLI:** none. **Agents:** none.
- **Replaces:** `session-skills:unslop` (kept; "Runs only when asked, never on
  its own" replaced by the rule case, so the rule and the skill agree; the rule
  names only `unslop`, not the missing `humanizer`).
- **SKILL.md steps:**
  1. Read the Plain English style first; the style wins on conflict.
  2. Scan the 31 patterns in six groups.
  3. Rewrite; add a human voice back; ask "What still makes this read as
     machine written?" and fix that too.
  4. Show the findings list (about 25 lines at most) and the rewrite, then wait.
  5. Write to a file only after a yes. Never change numbers, paths, names, ids,
     quotes, or code.

### 4.5 git-workflows plugin

#### `merge-and-clean-up`

- **Plugin:** git-workflows
- **Description:** Merges an approved GitHub pull request after its checks and the merge-safety check, updates the base checkout, and removes only that pull request's branches and worktree. Use when the owner or work-finish says "merge PR 12", "merge and clean up", or "land this pull request".
- **Stages or jobs:** the merge inside `12-pr-and-push`.
- **CLI:** `toolkit work history <id> --note` (records the merge). Git and `gh`
  for the rest.
- **Agents:** none.
- **Replaces:** `git-workflows:merge-and-clean-up` (kept; adds the merge-safety
  check and the work-item note; drops the `CLAUDE.md` mention; trimmed from 430
  characters).
- **SKILL.md steps:**
  1. Resolve the exact pull request and map branches to worktrees; the local
     head must equal the pull request head.
  2. Preflight: open, not a draft, mergeable, reviews, checks ("no checks
     reported" is not a failure).
  3. Merge-safety check: compare `git diff --name-only <default>...<branch>` with
     `git status` in the primary checkout. A file in both: stop and name it.
  4. `gh pr merge <n> --squash --delete-branch` (no admin flags); confirm the
     state is MERGED.
  5. Fast-forward the base checkout; remove only this pull request's worktree
     and branches.
  6. Add one history note to the linked work item. Stage moves and Done stay
     with `work-finish`.
  7. Report the pull request link, merge commit, and cleanup result.

#### `publish-docs`

- **Plugin:** git-workflows
- **Description:** Commits and pushes an approved edit to Git-tracked project documents (requirements/, docs/, DECISIONS.md, PROJECT.md, PROJECT-ROADMAP.md, ai-external-knowledge/, delivery/) straight to the default branch from an isolated worktree. Use after such an edit. Not for code, rules, skills, or .memory/.
- **Stages or jobs:** saving Git-tracked documents: `DECISIONS.md` rows
  (`work-decide`), the requirements baseline at `14-spec-update`
  (`work-finish`), `PROJECT.md`, `PROJECT-ROADMAP.md`, `docs/`,
  `ai-external-knowledge/`, `delivery/`.
- **CLI:** its own `scripts/publish-docs.mjs start|publish`.
- **Agents:** none.
- **Replaces:** `git-workflows:publish-docs` (kept; path lists rewritten for V2;
  the knowledge pre-commit requirement dropped, since V2 has no `knowledge/`;
  `delivery/deployment/component-tracker.csv` accepted).
- **SKILL.md steps:**
  1. Confirm the change is documentation in an allowed path, not code, rules,
     skills, hooks, settings, `.memory/`, or `.work-items/`.
  2. `node <skill-dir>/scripts/publish-docs.mjs start --branch <default> -- <files>`
     (a separate sparse worktree).
  3. Make the edit there and stage the files by name.
  4. `publish-docs.mjs publish --message "<message>"`: refuses other staged
     paths, pushes without force, checks the remote has the commit.
  5. Report the commit and that it reached the remote.

#### `pull-latest`

- **Plugin:** git-workflows
- **Description:** Brings the local repository up to date with its remote safely: fetch, fast-forward, or a merge pull when the two have diverged; never rebase, reset, or push. Use when the owner says "get the latest", "pull", "update from origin", or "grab what others pushed".
- **Stages or jobs:** updating a checkout.
- **CLI:** none. **Agents:** none.
- **Replaces:** `git-workflows:pull-latest` (kept; "sync with remote" removed
  because `reset-to-remote` also claimed it; trimmed from 723 characters; no em
  dashes).
- **SKILL.md steps:**
  1. Stop on a dirty tree or an unexpected branch in the shared checkout.
  2. `git fetch --prune origin`, then `git pull --ff-only`.
  3. Diverged: show `git log --oneline @{u}..HEAD` and `HEAD..@{u}`, then
     `git pull --no-rebase --no-edit`.
  4. Never push, rebase, or reset.
  5. Report the incoming commits and the final state.

#### `reset-to-remote`

- **Plugin:** git-workflows
- **Description:** Makes the local repository an exact copy of its remote: shows a plan, then hard-resets tracking branches, deletes branches gone from the remote, and reinstalls dependencies. Use only when the owner says "wipe local", "match remote exactly", or "fresh start from remote".
- **Stages or jobs:** destructive resync, only on the owner's explicit words.
- **CLI:** none. **Agents:** none.
- **Replaces:** `git-workflows:reset-to-remote` (kept; "sync with remote"
  removed; trimmed from 741 characters).
- **SKILL.md steps:**
  1. Run only when the owner asked for a destructive reset in his own words.
  2. Verify one remote; refuse on a dirty tree or stashes; refuse in a shared
     primary checkout where another session has work.
  3. `git fetch --all --prune`; find the default branch.
  4. Show the plan: branches to reset, branches to delete, local-only branches
     kept. Wait for a yes.
  5. Reset and delete as planned; run the lockfile's installer (ask when there
     are several lockfiles).

### 4.6 sf-architect-solutioning plugin

#### `sf-architect-solutioning`

- **Plugin:** sf-architect-solutioning
- **Description (proposed, needs Mike's yes):** Acts as a Salesforce technical architect: clarifies requirements, checks platform facts against official Salesforce documentation, and writes a solution plan before any build. Use when the owner says "architect this" or asks how to build something in Salesforce. Not for non-Salesforce work.
- **Stages or jobs:** Salesforce design specialist inside `04-solution-design`;
  direct Salesforce architecture questions.
- **CLI:** none. **Agents:** none (it is opened by `work-design` as the domain
  specialist).
- **Replaces:** nothing; ported as is (GOAL.md).
- **Why the description changes:** the current description is 616
  characters, over this index's 300 limit, and it claims "design this feature"
  and "solution this requirement", which a Salesforce project's `work-design`
  must own. GOAL.md says "as is", so this is Mike's call. The body also names
  `solution-design` as the coordinator; with the rename it must say
  `work-design` (one word) or it will run its own interview beside
  `work-design`.
- **SKILL.md steps (unchanged body):** the five phases Intake, Project context,
  Verify, Design, Plan, with their gates; "No code without a plan. No plan
  without clear requirements. No platform claim without a source."; when
  `work-design` coordinates, return findings to it and start no second
  interview.

### 4.7 Salesforce project-local skills

Copied by `project-init` into `.claude/skills/<name>/` and
`.agents/skills/<name>/` for Salesforce projects only. The bodies are the
model's versions (`sf-data-change` uses the model's shorter version). Only the
descriptions are rewritten, to the "what it does, then Use when" shape and 300
characters.

#### `sf-deploy-check`

- **Description:** Runs the hitch-hiker check that finds components or pending edits that would ship with a Salesforce deploy before their feature is ready. Use before any deploy to a shared org (full copy, staging, or production) and before handing the owner a production deploy command.
- **Stages or jobs:** `13-deployment` (before any shared-org deploy).
- **CLI:** `toolkit work show <id>` (which items are in the deploy).
- **Agents:** none.
- **Replaces:** the library `sf-deploy-check` (description only).
- **SKILL.md steps:** find the work items in the deploy; compare the
  per-item `package.xml` with `_master/package.xml` and the component tracker;
  run `python tools/kb/query_graph.py <Object.Field>` when `tools/kb/` exists;
  narrow the deploy set; end with a read-only org check; production commands go
  to the owner.

#### `sf-component-tracker`

- **Description:** Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted, when a deploy result comes back, or when a deploy needs manual steps.
- **Stages or jobs:** `07-tracking-setup` (the per-item manifest folder),
  `08-build` (each metadata change), `13-deployment` (deploy results).
- **CLI:** `toolkit work show <id>` (the item id for the Work Item column and the
  folder name).
- **Agents:** none.
- **Replaces:** the library `sf-component-tracker` (description only).
- **SKILL.md steps:** one CSV row per component with the fixed nine columns;
  Change Type New, Modified, or Destructive; update `_master/package.xml` and
  `<work-item-id>/package.xml`, `destructiveChanges.xml`, and `manual-steps.md`;
  set the Sandbox and Production flags when a deploy result comes back; keep
  profiles and the other listed types out of manifests.

#### `sf-data-change`

- **Description:** Builds the owner's handoff package for a Salesforce production data change: load file, backup, numbered load steps, success check, and undo steps, filed under delivery/data/. Use when production records must be created, updated, upserted, or deleted, or a backup is needed first.
- **Stages or jobs:** `08-build` and `13-deployment` of a `data-load` item.
- **CLI:** `toolkit work show <id>`, `toolkit work history <id> --note`.
- **Agents:** none.
- **Replaces:** the model `sf-data-change` (description only).
- **SKILL.md steps:** first confirm a `data-load` work item with approved
  requirements exists (open `work-on` if not; the CLI refuses to move a
  `data-load` item past stage 03 without approval); build the load file and the
  backup; write numbered load steps, the success check, and the undo steps;
  file them under `delivery/data/` with the `.gitignore` that keeps CSV and
  Excel files out of Git; record the details in the work item; hand the package
  to the owner, who runs it.

---

## 5. Coverage

### 5.1 The 14 stages, Done, and Cancelled

The "Owner sees" column is what `work-status` and the briefing print. The owner
never has to use the stage names.

| Stage | Owner sees | Skill that runs it | Owner decision at this point |
| --- | --- | --- | --- |
| `01-discovery` | Working out what you want | `work-on` creates the item; `work-requirements` interviews | none |
| `02-refinement` | Writing down what it must do | `work-requirements` | answers to questions |
| `03-requirements-approved` | Requirements approved | `work-requirements` asks; `work-decide` takes a later answer | approve the requirements |
| `04-solution-design` | Deciding how to build it | `work-design` (plus `sf-architect-solutioning` in Salesforce projects) | choose and approve the design |
| `05-breakdown` | Splitting it into smaller pieces | `work-organize` (opened by `work-on`, or asked directly) | approve the split |
| `06-implementation-plan` | Planning the build steps | `work-on` | none |
| `07-tracking-setup` | Setting up tracking for the build | `work-on` (Roadmap and Tasks), `work-organize` (sub-items), `sf-component-tracker` (Salesforce manifest folder) | none |
| `08-build` | Building it | `work-on`, with `work-delegate`'s team when chosen | none |
| `09-testing` | Checking it against what you asked for | `work-check` | none |
| `10-bug-fixing` | Fixing what the check found | `work-check` | only when a failure needs a choice |
| `11-user-approval` | Waiting for you to approve the result | `work-check` asks; `work-decide` takes a later answer | approve the result |
| `12-pr-and-push` | In a pull request | `work-finish`, with `merge-and-clean-up` for the merge | the merge (or a standing merge instruction) |
| `13-deployment` | Being deployed | `work-finish`, with `sf-deploy-check`, `sf-component-tracker`, `sf-data-change` in Salesforce projects | production deploys and data loads are run by the owner |
| `14-spec-update` | Updating the requirements baseline | `work-finish`, with `publish-docs` | none |
| Done | Done | `work-finish` | the recorded result approval |
| Cancelled | Cancelled | `work-finish`; `work-organize` for an item the owner removed by hand | the owner's reason |

### 5.2 Approvals and owner decisions

| Decision | Asked by | Recorded with | Later answer taken by |
| --- | --- | --- | --- |
| Requirements approval | `work-requirements` | `toolkit work approve <id> --requirements --by` | `work-decide` |
| `build` and `data-load` gate | enforced by the CLI and the PostToolUse hook; its message names `work-requirements` | none | none |
| Design choice and approval | `work-design` | `toolkit work approve <id> --design --by` | `work-decide` |
| Result approval (stage 11) | `work-check` | `toolkit work approve <id> --result --by` (proposed) | `work-decide` |
| Done | `work-finish` | `toolkit work finish <id> --by --evidence` | none |
| Cancel | `work-finish`, `work-organize` | `toolkit work cancel <id> --reason` | none |
| Merge | `work-finish` | `merge-and-clean-up` plus a history note | none |
| Production deploy or data change | `work-finish`, `sf-data-change` | the owner runs it; history note | none |
| Delivery offer, team arrangement, archive question | `work-delegate` | Notes > Decisions and context, history note | `work-decide` (an unanswered offer) |
| Answers to open questions | the skill that asked | the Open Questions row | `work-decide` |
| Decisions for the whole project | `work-decide` | `DECISIONS.md` (`toolkit decision add`, proposed) | none |
| Saving an inferred memory (onboarding mode) | `memory-save` | `toolkit memory save --approved-by` | none |
| A split, a move, restoring a missing item | `work-organize` | `toolkit work new --parent`, `toolkit work move`, `toolkit work cancel` | none |
| Setup choices | `project-init`, `project-sync` | `.toolkit.json` | none |

### 5.3 Other jobs the brief requires

| Job | Skill |
| --- | --- |
| Status | `work-status` |
| What's waiting on me | `work-decide` (and a count in `work-status` and the briefing) |
| Sub-items | `work-organize` |
| Reorganizing, and reconciling moves Mike made by hand | `work-organize`; the SessionStart briefing and the PostToolUse `toolkit work sync` report moves and name it |
| Handoff between sessions | `handoff` (the SessionStart briefing reads the focus section it writes) |
| Memory save, find, tidy | `memory-save`, `memory-find`, `memory-tidy` |
| Project init and sync | `project-init`, `project-sync` |
| Logging an idea for later | `work-on` |
| This chat's recap | `session-summary` |

---

## 6. What happens to every current skill

### 6.1 The eleven current session skills

| Current skill | Decision | V2 skill | Reason |
| --- | --- | --- | --- |
| `braindump` | Keep | `braindump` | One-time playback with no writes; no other skill does it. Description trimmed; after a yes it hands work to `work-on`. |
| `explain-simply` | Keep | `explain-simply` | Different job from everything else (reading level). Description trimmed. |
| `grill-me` | Merge | `work-requirements` | Its only output folder, `brainstorms/`, does not exist in V2 (issue 419 decision D1). Writing each answer into the work item before the next question is exactly `work-requirements`' step 4. "Grill me" stays as a trigger. |
| `handoff` | Keep, rewritten | `handoff` | Still a distinct job. Steps 1, 2, 3, and 6 change for V2 trackers and memory; the verifier and the fixed first line stay. |
| `requirements-helper` | Rename and move to the work plugin | `work-requirements` | "PRD" no longer exists; requirements live in the work item. The name must say "requirements", and it is a lifecycle stage, so it sits with the other `work-` skills. |
| `session-summary` | Keep, trimmed | `session-summary` | Only skill for this conversation's recap. Loses "where do things stand" (to `work-status`) and "being handed off" (to `handoff`). Name kept because `/recap` is a built-in command. |
| `solution-design` | Rename and move to the work plugin | `work-design` | Stage 04 of the work lifecycle; name follows the `work-` pattern. The readiness gate and critic loop are unchanged. |
| `spec-check` | Merge | `work-requirements` (step 6) and the `requirements-analyst` agent | The check runs before every approval without the owner asking; "check the spec" moves to `work-requirements`. Its V1 paths (`knowledge/prds/`) are gone. |
| `track-tasks` | Retire | none | It uses Claude Code's `TaskCreate` tools, which Codex does not have; its triggers ("where are we", "what is still open") collide with `work-status` and `session-summary`; anything that must outlive the chat belongs in a work item (`work-on`) or the focus to-dos (`memory-save`). |
| `unslop` | Keep | `unslop` | Distinct job. The description now covers the `humanize-outbound-text.md` rule case so the rule and the skill agree. |
| `work-guide` | Retire; content moves | `work-on`, `work-delegate`, `plugins/work/references/conventions.md` | Its description overlapped `work` and a picker could not tell them apart. Plan and tasks go to `work-on`; helpers and teams to `work-delegate`; Notes discipline and "not saved" wording to the shared reference. |

### 6.2 Other current toolkit skills

| Current skill | Decision | V2 skill | Reason |
| --- | --- | --- | --- |
| `work-tracker:work` | Split | `work-on`, `work-status`, `work-decide`, `work-organize`, `work-finish`, `work-delegate` | One skill held every job and its description was dropped from the listing in practice (session-skills.md 8.1). |
| `project-init:work-item-lifecycle` | Merge | `work-finish` (closing checklist); AGENTS.md "Where information goes" table | It routed designs to `docs/designs/`, which V2 forbids (D9). |
| `project-init:project-init` | Keep, rewritten | `project-init` | Three questions instead of six gates. |
| `project-init:project-sync` | Keep, rewritten | `project-sync` | Uses `toolkit doctor` and `toolkit sync` instead of 994 lines of prose. |
| `project-init:machine-sync` | Merge | `project-init`, `project-sync` via `toolkit machine-setup` | One command covers the computer. |
| `second-brain:knowledge-save`, `remember`, `retire` | Replace | `memory-save` | New memory contract, three backends. |
| `second-brain:knowledge-find`, `recall`, `session-search` | Replace | `memory-find` | Same. |
| `second-brain:knowledge-review`, `reflect` | Replace | `memory-tidy` | Same. |
| `second-brain:knowledge-setup`, `second-brain` | Replace | `project-init`, `project-sync` | Setup is one of the three init questions. |
| `git-workflows:*` (4) | Keep | same names | Section 4.5. |
| `system-guide:system-guide` | Retire | none | Not in the port list (ARCHITECTURE.md section 12, item 10). |
| `hooks-library:hooks-library` | Retire as a skill | none | Hooks ship in the toolkit plugin; Salesforce guards are installed by `project-init`. |
| `sf-architect-solutioning` | Keep | same | Section 4.6. |
| Salesforce `sf-deploy-check`, `sf-component-tracker`, `sf-data-change` | Keep, descriptions rewritten | same | Section 4.7. |

---

## 7. Agents to ship

All run on `model: opus`. Each file carries its own plain-English writing
rules, because subagents and Codex do not receive the output style. None starts
other agents, talks to the owner, changes the work item, merges, deploys, or
adds AI credit. In Codex the skill reads the role file and passes its full text
to a native worker.

| Agent | File | Tools | Used by | Returns | Replaces |
| --- | --- | --- | --- | --- | --- |
| `requirements-analyst` | `plugins/work/agents/requirements-analyst.md` | Read, Glob, Grep, WebFetch | `work-requirements`, `work-design` | Ready or not ready; missing pieces; places not explicit end to end; wording a builder could misread; drift from the Agreed goal; each with a fix | `design-product-analyst` (renamed), the requirements mode of `delivery-reviewer`, the checks of `spec-check` |
| `researcher` | `plugins/work/agents/researcher.md` | Read, Glob, Grep, WebSearch, WebFetch | `work-design`, `work-requirements`, `work-on`, `work-delegate` | Answer; findings labeled official documentation, project evidence, or community claim; open points | `design-researcher` and `delivery-researcher` (merged; they differed only in community sources) |
| `design-architect` | `plugins/work/agents/design-architect.md` | Read, Glob, Grep, WebSearch, WebFetch, Write, Edit (only the named draft file) | `work-design` | One design option as a draft file; a list of changes per fix round | `design-architect` (for Notion the draft is a local file the main agent saves with `toolkit work design`) |
| `design-critic` | `plugins/work/agents/design-critic.md` | Read, Glob, Grep, WebSearch, WebFetch | `work-design` | Verdict per requirement (satisfied, partly, not); findings for the architect | `design-critic`; the design mode of `delivery-reviewer` |
| `builder` | `plugins/work/agents/builder.md` | Read, Glob, Grep, Edit, Write, Bash | `work-on`, `work-check` (fixes), `work-delegate` | What changed (files), tests run and their result, anything it could not do | new; replaces the general task agents `work-guide` briefed by hand |
| `acceptance-checker` | `plugins/work/agents/acceptance-checker.md` | Read, Glob, Grep, Bash (tests and `git diff` only; no edits) | `work-check`, `work-finish` | Verdict per requirement and acceptance check with evidence; defects in the diff; checks that could not run | the result and plan mode of `delivery-reviewer` |
| `handoff-verifier` | `plugins/session-skills/agents/handoff-verifier.md` | Read, Glob, Grep, Bash (read-only commands, including `toolkit work show`, `toolkit memory get`, `gh issue view`) | `handoff` | Goal verdict; claims table; skipped items | `handoff-verifier` (`model: inherit` becomes `opus`) |

Retired agents: `delivery-researcher` (merged into `researcher`),
`delivery-reviewer` (split across `requirements-analyst`, `design-critic`, and
`acceptance-checker`), the model's `memory-curator` (dropped,
ARCHITECTURE.md section 7).

The skills pass the text an agent needs (requirements, the design draft) in
the brief, so the agents work the same for local and Notion trackers without
Notion access of their own.

---

## 8. Shared text the skills need

**One reference file per plugin, linked from each skill** (a plugin cannot
reach files outside its folder): `plugins/work/references/conventions.md`,
with short copies in the memory and session-skills plugins where needed. It
holds, once:

- Opening another skill: "Open the `<name>` skill" (Claude Code: the Skill
  tool; Codex: read its `SKILL.md` from the skill list path).
- An answer to a question a skill just asked is recorded by that skill;
  `work-decide` handles answers that arrive later or without a question.
- The Codex helper fallback: pass the role file's full text to a native
  worker; with no worker, say that no independent helper ran.
- "Not saved" and "saved but not verified" wording; the CLI reads back every
  write.
- Stage names are shown to the owner in plain words (`toolkit work lifecycle`)
  with the item id.
- The voice line: follow the Plain English style in
  `.claude/output-styles/plain-english.md` when present; in Codex, the voice
  rules in `AGENTS.md`.

**Rule and hook text that must use these names:**

- `work-item-stages.md`: "open the `work` skill" becomes "use `work-on`";
  "the `work` skill's `references/lifecycle.md`" becomes
  `toolkit work lifecycle`; approvals point to `work-decide`.
- `offer-context-handoff.md`: `handoff`, with the memory wording for the
  project's backend.
- `humanize-outbound-text.md`: `unslop` only (drop `humanizer`, which does not
  ship).
- `work-item-folders.md` (local tracker only): moves and renames are handled
  by `work-organize`.
- `knowledge-direct-commit.md`: `publish-docs`, and add `DECISIONS.md` to its
  paths.
- Hooks: UserPromptSubmit says "save it with memory-save" (as in
  ARCHITECTURE.md section 6); the SessionStart briefing names `work-decide`
  next to the waiting count and `work-organize` next to detected moves; the
  PostToolUse gate message names `work-requirements`; the Stop hook names
  `memory-save`.

---

## 9. CLI commands the skills need that ARCHITECTURE.md section 5 does not list

| Proposed command | Needed by | Why |
| --- | --- | --- |
| `toolkit work show <id> --section <heading>` | `work-requirements`, `work-design`, `work-decide` | Read one section in any tracker; Notion bodies are not local files. |
| `toolkit work edit <id> --section <heading> --set-file <f>` | `work-on`, `work-requirements`, `work-decide`, `work-delegate`, `handoff` | Section 5 has no body-edit command. The local tracker can use file edits plus the PostToolUse hook, but a Notion item can only be edited through the CLI (`update_content`, notion-design.md 10.1). Without it the skill steps differ per tracker. |
| `toolkit work design <id> [--set-file <f>]` | `work-design`, `design-architect` handoff | Read or write the design in any tracker: `DESIGN.md` locally, the "Solution Design" child page in Notion. |
| `toolkit work approve <id> --result --by <name>` | `work-check`, `work-decide`, `work-finish` | Stage 11 approval has no record today; without it `work-finish` asks again. |
| `toolkit work decisions` (or `toolkit brief --decisions`) | `work-decide`, `work-status` | `work list --waiting-on owner` sees only the frontmatter field; the queue also needs owner-addressed Open Questions rows, proposed designs, and items at stage 11 (model-review-draft.md section 2). |
| `toolkit decision add --decision <t> --why <t> --by <name> [--replaces D-n]` | `work-decide` | `DECISIONS.md` ids are sequential; parallel sessions choosing the next id by hand collide (parallel-agent-sessions rule, section 5). |
| `toolkit memory glossary [--set-file <f>]` | `memory-save`, `memory-find` | The glossary lives in every backend (memory-system.md 13.4 has it; section 5 does not). |
| `toolkit work lifecycle` prints a plain label per stage | `work-status`, briefing | So no skill repeats the stage table and the owner never sees raw stage names. |

---

## 10. Skills outside Toolkit V2 that compete for the same words

| Outside skill or command | Words it competes for | Which should run | How this index handles it |
| --- | --- | --- | --- |
| `superpowers:brainstorming` ("You MUST use this before any creative work") | "let's build X", "add a feature" | `work-on` | AGENTS.md routing lines below; brainstorming may be used inside `work-requirements` as a method, never instead of the work item. |
| `superpowers:writing-plans`, `executing-plans`, `subagent-driven-development` | "plan it", "build it with agents" | `work-on`, `work-delegate` | Plans live in the work item's Roadmap and Tasks, not in separate plan files. |
| `superpowers:systematic-debugging` | "it's broken", "there's a bug" | `work-on` | Both may run: `work-on` tracks the fix, debugging is the method. |
| `superpowers:finishing-a-development-branch` | "finish this branch" | `work-finish` | Routing lines. |
| `superpowers:requesting-code-review`, built-in `code-review` | "review it" | `work-check` for "does it do what I asked"; `code-review` for a diff | V2 names avoid "review" (so `work-check`, not `work-review`). |
| `feature-dev:feature-dev` | "build a feature" | `work-on` | Routing lines. |
| `anthropic-skills:consolidate-memory` | "clean up memory" | `memory-tidy` | Its description is about the host's own memory files; V2 projects set `autoMemoryEnabled: false`. |
| `anthropic-skills:schedule`, `schedule` | "remind me" | `schedule` for a timed reminder ("at 9 tomorrow"); `memory-save` for an untimed to-do | Different words: a time versus no time. |
| `anthropic-skills:deep-research` | "research X" | `deep-research` for a one-off question; `work-on` when the owner wants it tracked | V2 descriptions do not claim "research". |
| `llm-council` | "stress-test this" | `llm-council` | `work-requirements` claims "grill me", not "stress-test". |
| Built-in `/init` | owner typing `/init` | `project-init` | `/init` writes a `CLAUDE.md`, which turns off native `AGENTS.md` reading. `toolkit doctor` should warn when a `CLAUDE.md` appears. Mike types `/project-init`. |
| Built-in `/status`, `/memory`, `/recap`, `/review`, `/plan`, `/tasks`, `/resume` | typed commands | not skills | No V2 skill uses these bare names. |
| claude-toolkit plugins: `work-tracker`, `second-brain`, `session-skills@claude-toolkit`, `git-workflows@claude-toolkit`, `project-init@claude-toolkit`, `system-guide`, `hooks-library` | every job in this index, and identical names (`session-skills:handoff`, `git-workflows:pull-latest`) | the V2 skill | `project-init` turns them off in the project's `.claude/settings.json` `enabledPlugins` (project settings beat user settings); `toolkit doctor` checks. Codex has no per-project plugin switch that the briefs found: open point 5. |
| Hindsight MCP tools (retain, recall) | "remember" | `memory-save` | Expose only the recall tool to agents (hindsight.md section 11, "Limiting the tools"); saves go through the CLI. |

**Routing lines for the AGENTS.md template** (4 lines, under "Every session"):

```markdown
- Anything to build, add, fix, or change, and "keep going": the `work-on` skill.
- "Where are we": `work-status`. "What do you need from me" and approvals: `work-decide`.
- "Remember", "from now on", "forget that": `memory-save`. "What did we decide": `memory-find`.
- Method skills from other plugins (brainstorming, plans, debugging) may run inside these, never instead of them.
```

---

## 11. Trigger-collision check

For each message: the one skill that should fire, and the nearest other skill
with the reason it does not. Checked against the exact descriptions in
section 4.

| # | Owner message | Skill | Nearest other skill, and why it loses |
| --- | --- | --- | --- |
| 1 | "where are we" | `work-status` | `session-summary`: covers "this chat", and does not claim "where are we". |
| 2 | "let's build the login page" | `work-on` | `work-design` claims "how should we build this", a question about approach, not a request to do it. `superpowers:brainstorming`: routing lines. |
| 3 | "remember I hate tabs" | `memory-save` | `memory-find` claims "do you remember" (a question); this is a statement. |
| 4 | "I moved some folders around" | `work-organize` | `project-sync` repairs toolkit setup, not work items. |
| 5 | "is this ready to ship" | `work-check` | `work-finish` claims "ship it", an instruction; this is a question about readiness, and `work-check` claims "is it ready". |
| 6 | "split this into smaller pieces" | `work-organize` | `work-on` does work; it opens `work-organize` itself when an item is too big. |
| 7 | "what do you need from me" | `work-decide` | `work-status` only counts waiting decisions and points here. |
| 8 | "what's next?" | `work-status` | `work-on` claims "keep going" (do the next thing), not "what's next" (tell me). |
| 9 | "keep going" | `work-on` | `work-delegate` claims "take it from here" (hand the goal to agents). |
| 10 | "grill me on the checkout flow" | `work-requirements` | `llm-council` claims "stress-test this"; `braindump` plays back without asking. |
| 11 | "how should we build the CSV export?" | `work-design` | `work-on`: approach question, not a request to build. In a Salesforce project `sf-architect-solutioning` claims "how to build something in Salesforce"; whichever fires, `work-design` coordinates and `sf-architect-solutioning` returns its findings to it (needs the one-word body edit, section 4.6). |
| 12 | "approved, go with option B" | `work-decide` | `work-design` asks for the choice; when it asked in this same exchange, it records the answer itself (section 8), using the same CLI command. |
| 13 | "ship it" | `work-finish` | `merge-and-clean-up` claims "merge PR 12"; `work-finish` opens it for the merge step. |
| 14 | "cancel the dark mode item, we don't need it" | `work-finish` | `work-organize` cancels only items the owner removed by hand. |
| 15 | "run with it, I'll just be product owner" | `work-delegate` | `work-on` claims "keep going", which continues without changing who delivers. |
| 16 | "I'm going to clear context" | `handoff` | `session-summary` recaps but saves nothing and writes no prompt. |
| 17 | "what did we decide about the payment provider?" | `memory-find` | `work-decide` records decisions; it does not look them up. |
| 18 | "forget what I said about tabs" | `memory-save` | `memory-tidy` reviews the whole memory; one record is `memory-save`. |
| 19 | "memory feels cluttered, clean it up" | `memory-tidy` | `anthropic-skills:consolidate-memory`: host memory files, which V2 turns off. `merge-and-clean-up` shares only the word "clean". |
| 20 | "set up this new repo" | `project-init` | `project-sync` needs an existing `.toolkit.json` and claims "check the setup", not "set up this project". |
| 21 | "update the toolkit in this project" | `project-sync` | `pull-latest` claims "update from origin" (Git), not the toolkit. |
| 22 | "recap this chat" | `session-summary` | `work-status` is the whole project; `/recap` is a typed command. |
| 23 | "explain that like I'm five" | `explain-simply` | `unslop` changes voice, not reading level. |
| 24 | "get the latest from origin" | `pull-latest` | `reset-to-remote` claims only "wipe local", "match remote exactly", "fresh start from remote". |
| 25 | "add dark mode to the backlog for later" | `work-on` | `memory-save` claims "remind me" (an untimed personal to-do), not project work. |

**Hard cases, with the rule that settles each:**

- "the login page is broken": `work-on` (a fix is work). `superpowers:systematic-debugging` may also run as the method inside it.
- "we've decided to use Postgres everywhere": `work-decide` (a decision for the whole project goes to `DECISIONS.md`). If the owner says "remember we decided ...", `memory-save` fires, and its step 1 sends it to `work-decide`.
- "here's a brain dump: ...": `braindump`. After the owner confirms, project work goes to `work-on`.
- "merge PR 14 and clean up": `merge-and-clean-up`. The work item's stage and Done stay with `work-finish`.
- "deploy to UAT" in a Salesforce project: `work-finish` claims "deploy it"; its step 3 runs `sf-component-tracker` and `sf-deploy-check` first. `sf-deploy-check` is written for the agent's own action ("use before any deploy"), not an owner phrase.
- "load these 500 contacts into production": `sf-data-change`. Its first step checks for a `data-load` work item with approved requirements and opens `work-on` if there is none, so the approval gate still holds.
- "I dragged some cards to Done in Notion": `work-organize`. Stage changes are kept, but a card in Done is not an approval; it asks.
- "what did we do today" versus "I'm stopping for today": `session-summary` versus `handoff`. The shared word is "today"; the quoted phrases differ.
- "remind me at 9 tomorrow to call the client": `schedule` (a time is given). "remind me to call the client": `memory-save` (focus to-do).
- "looks good": no skill. The skill that asked the question records it; if nothing was asked, the agent asks what the owner is approving.

**Word-level overlaps that remain** (no quoted phrase repeats; checked by
script): "remember" (`memory-save` statement, `memory-find` question); "ship"
(`work-finish` "ship it", `work-check` avoids the word and claims "is it
ready"); "deploy" (`work-finish` owner phrase, `sf-deploy-check` agent use);
"build" (`work-on` request, `work-design` and `sf-architect-solutioning`
questions about how); "latest" and "update" (`pull-latest` Git, `project-sync`
toolkit); "clean" (`memory-tidy` memory, `merge-and-clean-up` branches);
"today" (see above).

---

## 12. Differences from ARCHITECTURE.md, and open points

1. **`work-check` instead of `work-review`** (ARCHITECTURE.md section 12, item
   11). "Review" is claimed by the built-in `/review`, `code-review`, and
   `superpowers:requesting-code-review`, and the owner means "does it do what I
   asked". `spec-check` is folded into `work-requirements`, where its check
   runs before every approval.
2. **Five work skills the architecture did not name yet:** `work-status`,
   `work-decide`, `work-organize`, `work-finish`, `work-delegate`. Each is a job
   the owner names, and each replaces a part of the one `work` skill that
   carried everything.
3. **Stage skills are opened by `work-on`**, so the owner never chooses a
   stage. This needs the "open another skill" line in the shared reference
   (section 8) to work in Codex, which has no Skill tool.
4. **`sf-architect-solutioning` "as is"** conflicts with the 300-character
   limit and with the `solution-design` rename. Recommendation: allow a
   description-only change and the one-word body change `solution-design` to
   `work-design`. This is Mike's call.
5. **Old claude-toolkit plugins in V2 projects.** Identical plugin and skill
   names exist in both marketplaces (`session-skills:handoff`,
   `git-workflows:pull-latest`). Claude Code: turn the old ones off per
   project. Codex: skills are switched off per user (`[[skills.config]]` in
   `~/.codex/config.toml`), so a Codex session in a V2 project may list both.
   Needs a test, and possibly a V2 plugin rename.
6. **Memory type `feedback` against the AGENTS.md routing row "How the agent
   should work: a rule, never memory"** (model-review-draft.md section 6.2).
   Recommendation: the owner's preference is saved to memory at once (his
   words are the approval); a rule-file change is offered only when it should
   bind every agent in the repository. `memory-save` step 1 says this.
7. **The CLI commands in section 9** are needed for the same skill steps to
   work in the local and Notion trackers. Without `toolkit work edit` and
   `toolkit work design`, each work skill needs a Notion branch in its steps.
8. **Listing size:** about 8,000 characters for 27 names and descriptions
   (about 6,800 in a project that is not Salesforce). On Mike's machine, with
   about 95 skills listed today, Claude Code will drop some descriptions; the names
   were chosen to work alone. `work-on`, `work-status`, and `memory-save` will
   be the most used, so their descriptions are the last to be dropped.
