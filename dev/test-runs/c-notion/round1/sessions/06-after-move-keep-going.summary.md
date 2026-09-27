# Session 06-after-move-keep-going
thread: 01a0e353-2f8e-7dd1-84bf-9f3ac5f70e4c
start: 2026-09-27T14:44:34Z
end: 2026-09-27T14:51:13Z

## Prompt

Approved. Keep going.

rollout: /Users/michaelrihm/.codex/sessions/2026/09/27/rollout-2026-09-27T10-44-34-01a0e353-2f8e-7dd1-84bf-9f3ac5f70e4c.jsonl

## Hook context injected

- 2026-09-27T14:44:36.458Z: Voice commands: voice on | voice off | voice status | voice read. Each is a standalone chat message. Current chat voice: OFF.
- 2026-09-27T14:44:36.458Z: Project briefing: Toolkit V2 sample run c (safe to delete) (toolkit-v2-sample-run-c), owner Mike Rihm. Work items: the Notion Work Items database (ids like TVSRC-001). Memory: the Notion Memory database. Salesforce: no. Hosts: Claude Code and Codex.
    Project manual: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1/AGENTS.md. Stages, statuses, and approval gates: toolkit work lifecycle.
    
    This worktree is on branch main, which names no work item.
    
    Active items:
    - TVSRC-001 Write a short quote script project brief in README.md: 06 Implementation plan, In Progress. Next action: Agent: write and check the Purpose and Start here bullets in README.md, coordinating the shared file with TVSRC-002. Continues with work-on.
    
    Waiting on the owner:
    - TVSRC-002 Add a quote section to README.md: TVSRC-002 is waiting on the owner (02 Refinement). (work-decide)
    
    Items: 1 in progress, 1 in the backlog. (Local copy of the Notion board from 2026-09-27T14:43:20.518Z.)
    
    Current focus:
    Last updated: 2026-09-27, Mike Rihm's Option A and split instruction
    ## Now
    - TVSRC-001.
    - TVSRC-002.
    ## Waiting on the owner
    - TVSRC-002.
    ## Untracked to-dos
    - None.
    ## Next session starts with
    - Read `PROJECT.md`, then open TVSRC-001 and TVSRC-002 through `toolkit work`. Follow their recorded next actions.
    
    Project memory (notion): 1 record, from the local copy. toolkit memory find searches it; toolkit memory get <key> reads one record.
    
    Memory records:
    - user_readme_bullet_sections: Prefers README sections as short bullet lists, not long paragraphs
    
    Setup warnings (toolkit doctor lists every check; the project-setup skill fixes them):
    - Codex does not trust this folder (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1). Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off. Fix: The owner opens Codex in this folder and trusts it when Codex asks.
    - The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards). Fix: The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.
    
    Always-on rules. Claude Code loads them by itself; in Codex, each one is read at session start:
    - .claude/rules/humanize-outbound-text.md: Humanize Anything Sent to Another Person
    - .claude/rules/keep-work-item-current.md: Keep the Active Work Item Accurate
    - .claude/rules/memory-review-and-save.md: Review and Save Project Memory
    - .claude/rules/plain-english-artifacts.md: Write Artifacts in Plain English
    - .claude/rules/session-handoff.md: Prepare a Session Handoff
    - .claude/rules/shared-repository-work.md: Work Safely in a Shared Repository
    
    How to write replies (from AGENTS.md):
    Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.
    
    - Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
    - Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
    - Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly, without a "not this, but that" setup.
    - Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
    - When asking for a decision, name the choice and the difference that matters, and recommend one.
    - Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
    - Leave out routine narration of process and helper activity. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.

## Skills opened (SKILL.md read)

work-on, work-decide, publish-docs, work-requirements, work-check, memory-save

## Commands

### 2026-09-27T14:44:43.482Z exit=0
```
$ cat PROJECT.md PROJECT-ROADMAP.md
# Toolkit V2 sample run c (safe to delete)

## Purpose and intended outcome

- Purpose: a small sample Node project that prints a short quote.
- Intended outcome: `node quote.js` prints one short quote. The quote varies by calendar day.

## Scope and boundaries

- In scope: `quote.js` and the Toolkit V2 project setup.
- Outside scope: no other features were requested.
- Constraints: no `SOUL.md`; Notion is the work tracker and memory home; this is not a Salesforce project (Mike Rihm, 2026-09-27).

## Systems and environments

| System or org | Purpose | Environment | Source of truth | Access notes |
| --- | --- | --- | --- | --- |
| Local Node script | Prints the quote | Local command line | `quote.js` | Run with Node.js. |
| Notion project page | Work items and memory | Personal Notion workspace | `.toolkit.json` | Toolkit V2 uses the signed-in `ntn` CLI. |

## People and ownership

| Role | Person or team | Responsibility | Source / last confirmed |
| --- | --- | --- | --- |
| Owner | Mike Rihm | Project decisions | Owner's setup request, 2026-09-27 |

## Work and project records

- Work tracker: the Notion Work Items database linked from the project page in `.toolkit.json`.
- Project roadmap: [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md)
- Project decisions: [DECISIONS.md](DECISIONS.md)
- Functional requirements: [requirements/](requirements/)
- Design home: the Notion work item's Solution Design subpage, when an item has a design.
- System Guide: no populated guide yet; `system-guide/` holds its template.
- Memory: the Memory database on this project's Notion page (the setup choice is in `.toolkit.json`)
- Memory backup or sync: Notion is the live store. No separate backup procedure has been specified.

## Resources and project paths

- Tests and checks: `node quote.js` is the available manual check; there are no tests yet.
- Outside references: `ai-external-knowledge/` is available when outside documentation is captured.

## Operating conventions

The script has no package manifest or test runner. Its quote is selected from a fixed array using the current day of the month.
# Project roadmap

The current sample already contains `quote.js`. No further feature phases or work items have been requested.

## Project outcome

Running `node quote.js` prints one short quote selected by the day of the month.

## Phase overview

No future phases are planned. Add a phase and link its Notion work item when Mike Rihm requests a change.

## Open project-level planning questions

None open.

## Planning changes

- 2026-09-27, Mike Rihm: set up Toolkit V2 for the existing quote script with Notion work tracking and memory.

```
### 2026-09-27T14:44:43.483Z exit=0 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-on/SKILL.md
---
name: work-on
description: 'Starts, continues, or logs project work: finds or creates the work item, works out where it stands, and runs its next step through to a built result. Use when the owner asks to build, add, fix, or change something, says "keep going" or "continue", names an item, or wants an idea logged for later.'
---

# Work on

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md` (saving, section edits, history) and `../../references/trackers.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. No session briefing in this conversation: run the command below. Exit code 4 (no `.toolkit.json`): open `project-setup` and stop.
   `toolkit brief`
2. Find the item: the id the owner named, or a title in the list that matches the request. Two possible matches: ask one question naming both. No match: it is new. When `PROJECT-ROADMAP.md` names the item, read its phase there too.
   `toolkit work show <id>`
   `toolkit work list`
3. Size a new request. A quick edit (one sitting, no choice for the owner, no behavior recorded in `requirements/`): do it and report it, with no item. "Later", "backlog", "park that": check the list for a duplicate, create the item, write the owner's words unchanged into Starting request, reply "Logged as WI-014 (bug, backlog). Not started." and stop. Anything else: create it the same way and continue.
   `toolkit work new --title "<title>" --type <type> --stage 01-discovery`
   `toolkit work edit <id> --section "Starting request" --set-file <file>`
4. A substantial goal whose item shows `delivery: not-offered`: open `work-delegate` first. Quick questions and small edits get no offer.
5. Route by where the item stands, using the item and the "Continue with" column of the lifecycle. Requirements not approved and type `build` or `data-load` (or the risk calls for it): `work-requirements`. More than one reasonable way to build it and no approved design: `solution-design`. Too big for one build: `work-organize`. Stages 09 to 11: `work-check`. Stages 12 to 14: `work-finish`. `waiting_on: owner`: ask that one question first (`work-decide`) and keep working on anything it does not block. Say the route in one line ("WI-012 is waiting for your OK on the requirements; opening work-requirements."). Never ask the owner which stage it is in.
   `toolkit work lifecycle`
6. Plan (stage 06): Roadmap phases `P1`, `P2` and tasks `P1-T01` (Work, Deliverable, Done when, Depends on) from the design's "Build and verification plan", in the format in `references/planning.md`. Tracking setup (stage 07) only when needed: the item's branch and worktree `wi-<number>-<slug>`; in a Salesforce project, the item's folder in `delivery/deployment/` through `sf-component-tracker`.
   `toolkit work set <id> --stage 06-implementation-plan`
   `toolkit work edit <id> --section Roadmap --set-file <file>`
   `toolkit work edit <id> --section Tasks --set-file <file>`
7. Build (stage 08) on the item's own branch and worktree. With a team recorded by `work-delegate`: one `builder` agent per independent task, one writer per path. Tests go with each task. Tick a task only with evidence. A task whose "Done when" names the owner is a question for him (step 8). Salesforce: `sf-component-tracker` on each metadata change; production data only through `sf-data-change`.
   `toolkit work set <id> --stage 08-build`
8. When the owner is needed: add an Open Questions row (next free `Q-` number) with "owner" as who decides, set the item waiting on the owner, keep working on tasks that do not depend on the answer, and tell him in one line. After his last answer, set it back to the agent (`../../references/conventions.md`, "Waiting on the owner").
   `toolkit work edit <id> --section "Open Questions" --append-row "| <next Q-id> | <q
...[truncated]
```
### 2026-09-27T14:44:43.483Z exit=0
```
$ cat .claude/rules/{humanize-outbound-text,keep-work-item-current,memory-review-and-save,plain-english-artifacts,session-handoff,shared-repository-work,publish-project-documents}.md
# Humanize Anything Sent to Another Person

Any text that will leave the project and be read by someone other than the owner
is run through the `humanizer` skill before the owner sees the final version.
Use the `unslop` skill when `humanizer` is not installed. That covers emails,
chat messages, support case text and comments, GitHub issues, pull request
descriptions, client documents, and any file made to hand to someone else.

Keep every fact, name, id, number, and date exactly as it was. Write it in the
owner's voice, first person, when it goes out under their name.

It does not apply to chat replies to the owner, work items, project knowledge,
code, or commit messages.
# Keep the Active Work Item Accurate

The work tracker is the source of truth for current work.

- Before substantial work, use the `work-on` skill. Read the active item's requirements, state, next step, and blockers.
- Save the owner's decisions, requirements, and corrections in the item or its linked document before moving on.
- When the work needs the owner's decision, add it to the item's Open Questions with "Decision needed from: owner" and set the item's `waiting_on` to `owner`. The `work-decide` skill records the answer.
- `build` and `data-load` work needs approved requirements before it starts. A later stage does not revoke that approval.
- After the owner accepts agent-led delivery, ask how the team is arranged. That choice authorizes helpers for that goal only.
- Mark an item Done only after the owner approves the result.
- Before ending unfinished work, record the exact next step in the item.

`toolkit work lifecycle` prints the stages, statuses, and approval gates. "Where information goes" in `AGENTS.md` is the routing table; the `work-delegate` skill holds the delivery offer and team questions, and the `handoff` skill holds the handoff steps.
# Review and Save Project Memory

This rule applies to the main agent. The project memory system is chosen at setup and recorded in `.toolkit.json`; with built-in memory it is the local `.memory/` folder. It is the single project memory store. Claude's native auto-memory and the `claude-toolkit` Second Brain plugin are disabled for this project. The session-start briefing shows the current focus in Claude Code and Codex. Do not treat a hook reminder as a save decision.

## Decide the destination first

Read the memory criteria (`.memory/memory-criteria.md` with built-in memory) and the likely owning record. Send current focuses, owner to-dos, and handoff context to the current focus; sourced terminology to the glossary; qualifying otherwise-unowned durable context to a topic; active work to the chosen tracker; decisions for the whole project to `DECISIONS.md`; accepted delivered behavior to requirements; the technical approach to the design kept with its work item; verified current structure to the System Guide; and repeatable procedure to instructions or a skill. Raw external documentation stays in its source folder. A small memory pointer can route future sessions to a hard-to-find authority without copying its body.

Review on explicit remember/forget requests, corrections, standing preferences, meaningful decisions or discoveries, significant fixes or episodes, people/tool/reference changes, focus shifts, work-item completion, and handoffs. The toolkit's `UserPromptSubmit` hook flags only explicit keep phrases, and its Stop hook checks once per turn that such a phrase was handled. Do not save on every hook reminder or every turn. A review can end with no memory.

## Approval

The `memory-save` skill holds the approval policy: what the owner's own words authorize, what needs a yes in onboarding mode, what trusted mode allows, and what always needs the owner. The mode is `memory.approval` in `.toolkit.json`; only an explicit owner instruction changes it. A yes authorizes the shown operation and meaning only. Silence does not. There is no proposal inbox; hold an unanswered question in the conversation and 
...[truncated]
```
### 2026-09-27T14:44:43.505Z exit=0
```
$ git status --short --branch && rg --files -g 'AGENTS.md' -g 'README.md' -g 'quote.js' -g 'DECISIONS.md' .
## main
./DECISIONS.md
./AGENTS.md
./README.md
./requirements/AGENTS.md
./quote.js

```
### 2026-09-27T14:44:50.115Z exit=0
```
$ cat README.md quote.js DECISIONS.md
# Toolkit V2 sample run c (safe to delete)

This sample project contains a tiny Node script that prints a short quote.

## Purpose

Run `node quote.js` to print one of three short quotes. The selected quote varies with the day of the month. Running the command more than once on the same day prints the same quote.

## Start here

1. Install Node.js if it is not already available.
2. Run the script locally with `node quote.js`.
3. Use `toolkit doctor` to check Toolkit V2 wiring. Work items and memory are on the Notion project page recorded in `.toolkit.json`.

## Project records

- [PROJECT.md](PROJECT.md): purpose, scope, systems, and owners.
- [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md): phases and deliverable-sized work units.
- [DECISIONS.md](DECISIONS.md): decisions for the whole project.
- [requirements/](requirements/): accepted functional behavior by area.
- [AGENTS.md](AGENTS.md): how the agent works in this project, where each kind of information goes, and the full project map.
- Active work and each item's design: the work tracker chosen at setup, recorded in `.toolkit.json`.

## Project checks and release

- Local validation: `node quote.js`. No automated tests are configured.
- Deployment process: none specified.
- Environments: local Node.js execution only.
// Prints one short quote. Run: node quote.js
const quotes = [
  'Small steps every day.',
  'Done is better than perfect.',
  'Write it down before you forget it.',
];
const pick = quotes[new Date().getDate() % quotes.length];
console.log(pick);
# Decisions

Decisions for the whole project. A decision about one work item stays in that
item's Recent History. Add rows only with `toolkit decision add`, which gives
each row the next ID. Never rewrite an old row. To change a decision, add a new
row that names the ID it replaces.

| ID | Date | Decision | Why | Decided by | Replaces |
| --- | --- | --- | --- | --- | --- |

```
### 2026-09-27T14:44:50.121Z exit=1 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/references/{conventions,trackers,planning}.md
cat: /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/references/conventions.md: No such file or directory
cat: /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/references/trackers.md: No such file or directory
cat: /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/references/planning.md: No such file or directory

```
### 2026-09-27T14:44:50.123Z exit=0 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-decide/SKILL.md
---
name: work-decide
description: 'Walks the owner through each decision waiting on him, one at a time with a recommendation, and records each answer. Use when the owner asks "what do you need from me" or "what''s waiting on me", says "approved" or "go with option B", or states a decision for the whole project.'
---

# Work decide

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Build the queue: requirements waiting for approval, designs marked proposed, items at stage 11 waiting for result approval, Open Questions rows where the owner decides, and delivery offers not yet answered.
   `toolkit work decisions`
2. The owner gave an answer without being asked ("approved", "go with B"): match it to exactly one waiting decision. If two could match, ask which one, naming both.
3. Otherwise take the decisions one at a time, the one blocking the most work first. For each: what is being decided, the choices, your recommendation and its main reason, and what happens after each answer. One decision per message.
4. Before recording a requirements approval, check that the Agreed goal is filled in and that no open question is linked to a requirement. If not, say what is missing and open `work-requirements`.
   `toolkit work show <id> --section Requirements`
5. Record each answer where it belongs. Approvals (for requirements, first mark each approved `R-xx` Finalized, as `work-requirements` step 8 does):
   `toolkit work approve <id> --requirements --by <owner>`
   `toolkit work approve <id> --design --by <owner>`
   `toolkit work approve <id> --result --by <owner>`
   An Open Questions answer: rewrite that row with the answer, the date, and status Answered.
   `toolkit work edit <id> --section "Open Questions" --set-file <file>`
   Then, for an approval or an answer: one history note in the owner's words, and `waiting_on` back to `agent` (or `none` when nothing waits), unless another question for him on that item is still open. The approve command does not change `waiting_on`.
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`
   An unanswered delivery offer: open `work-delegate`.
6. A decision for the whole project: add a `DECISIONS.md` row and save it with `publish-docs`. Run the command inside the worktree `publish-docs` opens, then let it commit and push.
   `toolkit decision add --decision "<decision>" --why "<why>" --by <owner>`
7. A "no" or a change: record it as the answer, move the item back (for example to refinement), and open the skill that redoes the work.
   `toolkit work set <id> --stage 02-refinement`
8. Lead with "Not saved" if any write failed. When the queue is empty, say so and offer to continue unblocked items with `work-on`.

## What counts as an answer

- Only the owner's explicit words count. Quote them in the history note. The lifecycle command prints the full approval rules:
  `toolkit work lifecycle`
- A question, a suggestion, a tentative answer ("probably B"), or silence is not an answer. Ask again in one line.
- An approval covers only what was shown. It never covers merge, deployment, spending, or publishing.
- "Yes", "ok", or "looks good" with nothing waiting: ask what he is approving.
- Set `waiting_on` to `agent` when the agent can continue, to `none` when nothing waits, or keep `owner` when another owner question is still open on that item.

## After a result approval

The item continues with `work-finish` (pull request, deployment, requirements baseline, Done). Open it when the owner wants it shipped now.

## Project-wide decisions

- A decision for the whole project goes in `DECISIONS.md`, not in memory and not in one item. Examples: "use Postgres everywhere", and a standi
...[truncated]
```
### 2026-09-27T14:44:53.108Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002
Tracker changes found (work-organize handles moves, copies, and missing items; work-decide handles questions for the owner):
  Re-parented: TVSRC-002. Its parent is now none (top level).

TVSRC-002: Add a quote section to README.md
Location: https://app.notion.com/p/Add-a-quote-section-to-README-md-3e8b381da1768168a7b6d445f61cf862
Stage: 02 Refinement (Backlog) | Waiting on: owner | Continue with: work-decide
Parent: none | Sub-items: none | Design: none

---
id: TVSRC-002
title: Add a quote section to README.md
type: task
stage: 02-refinement
status: Backlog
parent: none
waiting_on: "owner"
priority: medium
delivery: not-offered
requirements_approved: "no"
design: none
result_approved: "no"
updated: 2026-09-27
---
# TVSRC-002: Add a quote section to README.md

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Add a short Add a quote section to README.md under the Option A layout.

**Current position:** Created under TVSRC-001 at Mike Rihm's request on 2026-09-27. Draft child requirements cover an accurate quote edit instruction and short bullets.

**Next action:** Owner: approve or revise the child requirements. Agent: then write and check Add a quote in coordination with TVSRC-001.

**Blockers:** Child requirements need separate owner approval before the child build.

**Related items:** Parent TVSRC-001; covers its R-01 and R-02 for the Add a quote section.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Add a quote instructions | The README explains how to add a string to the `quotes` array. | Not Started | Instructions match quote.js and use short bullets. | None. |

## Tasks

### P1 — Add a quote instructions

- [ ] **P1-T01 — Write Add a quote bullets** · Not Started  
  **Work:** Add a short Add a quote section to README.md under the Option A layout.  
  **Deliverable:** Add a quote bullets in README.md.  
  **Done when:** The instructions identify the `quotes` array in quote.js, show how to add a JavaScript string, and explain that the selected quote depends on the day of the month.  
  **Depends on:** Child requirements finalized.
- [ ] **P1-T02 — Check the instructions** · Not Started  
  **Work:** Compare the new section with quote.js and check its bullet format.  
  **Deliverable:** Check evidence for TVSRC-002.  
  **Done when:** The steps are accurate and use short bullets.  
  **Depends on:** P1-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog); waiting on agent. | Child scope and draft requirements are recorded for separate review. |
| 2026-09-27 | Owner said: "make the new "Add a quote" section its own sub-item under the README brief item"; TVSRC-002 was
...[truncated]
```
### 2026-09-27T14:44:53.342Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-001
Tracker changes found (work-organize handles moves, copies, and missing items; work-decide handles questions for the owner):
  Re-parented: TVSRC-002. Its parent is now none (top level).

TVSRC-001: Write a short quote script project brief in README.md
Location: https://app.notion.com/p/Write-a-short-quote-script-project-brief-in-README-md-3e8b381da1768106a024d7cb6aa8840f
Stage: 06 Implementation plan (In Progress) | Waiting on: agent | Continue with: work-on
Parent: none | Sub-items: none | Design: approved (https://app.notion.com/p/TVSRC-001-Write-a-short-quote-script-project-brief-in-README-md-solution-design-3e8b381da176811cb3c5ccd0c2584d90)

---
id: TVSRC-001
title: Write a short quote script project brief in README.md
type: task
stage: 06-implementation-plan
status: In Progress
parent: none
waiting_on: "agent"
priority: medium
delivery: not-offered
requirements_approved: 2026-09-27 by Mike Rihm
design: approved
result_approved: "no"
updated: 2026-09-27
---
# TVSRC-001: Write a short quote script project brief in README.md

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Write the Purpose and Start here bullets for the short README brief. The Add a quote section is assigned to sub-item TVSRC-002.

**Current position:** Mike Rihm chose and approved Option A on 2026-09-27. TVSRC-002 owns the Add a quote section. The parent requirements and selected design are approved, and the parent tasks are planned.

**Next action:** Agent: write and check the Purpose and Start here bullets in README.md, coordinating the shared file with TVSRC-002.

**Blockers:** None for the main item. TVSRC-002 has its own requirements and review.

**Related items:** TVSRC-002.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Purpose and Start here | The README has short bullets for the script, audience, and run command. | Not Started | Bullets match quote.js and the approved parent requirements. | TVSRC-002 |

## Tasks

### P1 — Purpose and Start here

- [ ] **P1-T01 — Write the main brief bullets** · Not Started  
  **Work:** Revise Purpose and Start here in README.md with short bullets covering the script, audience, and run command.  
  **Deliverable:** Purpose and Start here bullets in README.md.  
  **Done when:** The bullets match quote.js, serve the agreed readers, and use the Option A layout.  
  **Depends on:** Selected design recorded.
- [ ] **P1-T02 — Check the main brief** · Not Started  
  **Work:** Check the two sections against the approved requirements and run `node quote.js`.  
  **Deliverable:** Check evidence for TVSRC-001.  
  **Done when:** The text is accurate and the script runs.  
  **Depends on:** P1-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-require
...[truncated]
```
### 2026-09-27T14:45:02.349Z exit=1 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/references/{conventions,trackers,planning}.md
# Conventions every work skill follows

Every skill in the work plugin follows these rules. A skill's own `SKILL.md`
names the file when a rule matters for a step.

## Voice

Every skill carries this line near its top:

> Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Agents do not receive the output style. Each agent file in `agents/` carries
its own writing rules.

## Opening another skill

- Claude Code: use the Skill tool with the skill's name, for example
  `work-requirements`.
- Codex: read that skill's `SKILL.md` from the path shown in the skill list,
  then follow it.
- Say the handover in one line, for example "WI-012 needs a design; opening
  solution-design."
- The skill that asked a question records the answer. An answer that arrives
  later, after that skill has finished, is recorded by `work-decide`.

## Running `toolkit` commands

- Put each `toolkit` command on its own line and run it as a plain command.
  Do not wrap it in `$(...)`, a pipe, or a redirect. Codex matches its
  command rule against the plain command.
- Add `--json` when you need to read the output field by field.
- Exit codes: `0` done; `1` error; `2` validation failure (fix what it names
  and run it again); `3` not supported for this tracker or memory backend
  (follow [trackers.md](trackers.md)); `4` not a Toolkit V2 project (open
  `project-setup`).
- "saved but not verified" in the output means the write happened and the
  read-back failed. Report it that way.

## Changing a work item

- Change a work item only through `toolkit work` commands. This keeps the
  local tracker and Notion the same, and it keeps the CLI's record of what it
  wrote. A value the agent changes by hand looks like an owner edit to the
  CLI.
- Find a file only with the command below. Never build a path by hand: the
  owner may have moved or renamed the folder.

  ```text
  toolkit work show <id> --path
  ```

- To change one section of the body, read it, change only what needs to
  change, and write the whole section back. The file holds the same text the
  read printed for that heading, with your changes.

  ```text
  toolkit work show <id> --section "<heading>"
  toolkit work edit <id> --section "<heading>" --set-file <file>
  ```

- To add one row to a table section (Open Questions, Recent History), use
  `--append-row` with the full Markdown table row. A new question takes the
  next free `Q-` number: read the Open Questions section first and add one to
  the highest number there (`Q-01` when there is none).

  ```text
  toolkit work edit <id> --section "Open Questions" --append-row "| <next Q-id> | <question> | R-02 | Open | owner |"
  ```

- Frontmatter values change only through `toolkit work set`, `approve`,
  `design`, `move`, `finish`, and `cancel`. Never edit frontmatter by hand.
- Never hand-edit `.work-items/DASHBOARD.md` or
  `.work-items/.toolkit-state.json`. The hooks refuse it.
- Files for `--set-file` and `--body-file`: write the full new text to a file
  in a temporary folder outside the repository (make one with `mktemp -d`).
  Never leave draft files inside `.work-items/`: a second `DESIGN.md`-shaped
  file there confuses the design lookup.

## Section names in `WORK-ITEM.md`

These are the headings `--section` uses. Every tracker uses the same body: the
project's `.work-items/work-item-template/WORK-ITEM.md`, copied from the model
project.

| Heading | What it holds |
| --- | --- |
| `Overview` | Goal, Current position, Next action (and who owns it), Blockers, Related items (ids, never paths) |
| `Roadmap` | Phases `P1`, `P2` with Outcome, Status, Exit result, Sub-items |
| `Tasks` | Tasks `P1-T01` with Work, Deliverable, Done when, Depends on |
| `Recent History` | Dated rows: change or decision, effect on the work |
| `Open Questions` | `Q-01` rows: question, affects, status, decision needed from (`owner` for the owner) |
...[truncated]
```
### 2026-09-27T14:45:02.350Z exit=0 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/git-workflows/0.2.0/skills/publish-docs/SKILL.md
---
name: publish-docs
description: "Commits and pushes an agreed edit to Git-tracked project documents (requirements/, system-guide/, DECISIONS.md, PROJECT.md, PROJECT-ROADMAP.md, ai-external-knowledge/, delivery/) to the default branch from an isolated worktree. Use after such an edit. Not for code, rules, skills, or .memory/."
---

# Publish a documentation save

Save an agreed change to Git-tracked project documents from its own temporary
worktree, and push it straight to the default branch with no pull request.
The project's rule for this is `.claude/rules/publish-project-documents.md`;
its `paths` list names the documents this skill saves.

1. **Confirm it is documentation in an allowed path**, not code, rules, skills,
   hooks, settings, `.memory/`, or `.work-items/` (list below).
2. **Start a save workspace** from the project, with the script in the
   `scripts/` folder beside this `SKILL.md`:

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs start --branch <default-branch> -- <file> [more files]
   ```

   It fetches the remote, creates a separate sparse worktree beside the project,
   and prints its path. Work only in that path for this save.
3. **Make the edit there and stage the files by name.** Read the full staged
   diff. Add `DECISIONS.md` rows only with `toolkit decision add`, run there.
   After a change under `ai-external-knowledge/`, regenerate its index there
   ("Step 3 in detail") and stage `ai-external-knowledge/INDEX.md` too.
4. **Publish** from the save workspace:

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs publish --message "<plain commit message>"
   ```

   It refuses other staged paths, unstaged or untracked files, and conflict
   markers (trailing spaces are fine: two make a Markdown line break); commits;
   pushes without force; and checks the remote has the commit.
5. **Report** the commit id and that it reached the remote. After the task's
   last publish, remove the clean save workspace (`git worktree remove <path>`).

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

## What counts as documentation

The project documents are the paths in the project's
`publish-project-documents.md` rule. The script accepts only these:

- Files under `requirements/`, `system-guide/`, `ai-external-knowledge/`, and
  `delivery/` of these document types: `.md`, `.txt`, `.csv`, `.xml`, `.png`,
  `.jpg`, `.jpeg`, `.gif`, `.svg`, `.pdf` (for example
  `delivery/deployment/component-tracker.csv` and a `package.xml`). A
  `.gitignore` file under `delivery/` is also accepted. `delivery/` exists
  only in Salesforce projects.
- `DECISIONS.md`, `PROJECT.md`, and `PROJECT-ROADMAP.md` at the project root,
  and `tools/permissions/PERMISSIONS-RUNBOOK.md` in a Salesforce project.
- `README.md` files.

It refuses:

- Every file under `delivery/data/` except `.md` notes and `.gitignore`,
  whatever `.gitignore` says. Load files and backups there can hold production
  records and personal data, and `.gitignore` there lists only some file types.
- Any other file type: code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`),
  settings, `.json`, spreadsheets.
- Hidden files and folders, such as `.env` or `.github/`.
- `.memory/` and `.work-items/`. They are local and Git-ignored; change them
  only through `toolkit memory` and `toolkit work` commands.
- Instruction files (`AGENTS.md`, `CLAUDE.md`, `SKILL.md`) anywhere, in any
  letter case.
- Any path Git ignores.

A folder or a `.md` extension alone does not make a file documentation. Rules,
skills, prompts, hooks, settings, and code change behavior: they use a worktree
and a pull request. Documentation that cannot be separated from a code change
stays with that change and its review. Do not split dependent changes to avoid
review, and do not describe an unshipped feature as shipped.

This skill changes how a save is pu
...[truncated]
```
### 2026-09-27T14:45:02.359Z exit=0 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-requirements/SKILL.md
---
name: work-requirements
description: 'Interviews the owner one question at a time, writes the answers into the work item''s requirements and open questions, then asks for approval. Use when the owner says "grill me", "ask me questions", "what should it do", or "check the spec", changes a requirement, or requirements are missing.'
---

# Work requirements

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. Interview and writing rules: `references/writing-requirements.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Find the item as `work-on` does; none exists, create it. Use discovery while the goal is being worked out, refinement once requirements are being written. Requirements already approved and no change asked: stop and open the skill the lifecycle's "Continue with" column names.
   `toolkit work show <id> --section Requirements`
   `toolkit work new --title "<title>" --type <type> --stage 01-discovery`
   `toolkit work set <id> --stage 02-refinement`
2. Before asking anything, read the item (Starting request, Agreed goal, `R-xx`, Open Questions) and look up what the project already knows, so no question repeats an answer.
   `toolkit work show <id>`
   `toolkit memory find "<topic>"`
3. Restate the goal in one sentence ("So the goal is X?"). Write the Agreed goal only after a yes.
   `toolkit work edit <id> --section "Agreed goal" --set-file <file>`
4. Ask one question at a time, most basic first, each with a recommended answer and a short reason. Push back when an answer works against the goal.
5. Write each answer into the item before the next question: `R-xx` blocks (Status Refining, required behavior, boundaries, acceptance check, decision record) and the Acceptance list. Anything unanswered becomes an Open Questions row (next free `Q-` number) with who must answer; the item waits on the owner while one of his is open, and goes back to the agent when he answers the last one. Build ideas go under Notes > Solution options and considerations, never into requirements. A fact the owner cannot answer: brief a `researcher` agent.
   `toolkit work edit <id> --section "Active requirements" --set-file <file>`
   `toolkit work edit <id> --section "Open Questions" --append-row "| <next Q-id> | <question> | R-02 | Open | owner |"`
   `toolkit work set <id> --waiting-on owner`
   `toolkit work set <id> --waiting-on agent`
6. A change to an approved requirement: edit the `R-xx`, keep the old wording in its decision record, set it back to Refining, move the item to refinement, and say what the change affects when the item is past stage 03.
   `toolkit work set <id> --stage 02-refinement`
7. Spec check, before asking for approval and whenever the owner says "check the spec": brief the `requirements-analyst` agent with the requirements text. Fix what it finds or turn it into questions. Change nothing without a yes.
8. Show a short summary and ask one line: "Do you approve these requirements?" and set the item waiting on the owner. Yes: first mark each approved `R-xx` Finalized with who approved it and when, then record the approval (the command adds its own history row), quote his words in one note, and hand the item back to the agent unless another question for him is still open. Not yet: it stays waiting on him.
   `toolkit work edit <id> --section "Active requirements" --set-file <file>`
   `toolkit work approve <id> --requirements --by <owner>`
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`
9. Lead with "Not saved" on a failed write. Check the item, then hand back to `work-on` unless the owner stops.
   `toolkit work validate <id>`

## Agents

- `requirements-analyst`: the spec check in step 7. Paste in the Starting request, Agreed goal, 
...[truncated]
```
### 2026-09-27T14:45:02.382Z exit=0
```
$ git log --oneline -10 && git remote -v && ls -ld .git && ls -la .git | head
65ccb48 Set up Toolkit V2 (Notion tracker, Notion memory)
ae840d0 Initial commit: quote script
drwxr-xr-x  13 michaelrihm  wheel  416 Sep 27 10:44 .git
total 40
drwxr-xr-x  13 michaelrihm  wheel   416 Sep 27 10:44 .
drwxr-xr-x  18 michaelrihm  wheel   576 Sep 27 10:23 ..
-rw-r--r--   1 michaelrihm  wheel    50 Sep 27 10:23 COMMIT_EDITMSG
-rw-r--r--   1 michaelrihm  wheel    21 Sep 26 20:48 HEAD
-rw-r--r--   1 michaelrihm  wheel   137 Sep 26 20:48 config
-rw-r--r--   1 michaelrihm  wheel    73 Sep 26 20:48 description
drwxr-xr-x  16 michaelrihm  wheel   512 Sep 26 20:48 hooks
-rw-r--r--   1 michaelrihm  wheel  2919 Sep 27 10:23 index
drwxr-xr-x   3 michaelrihm  wheel    96 Sep 26 20:48 info

```
### 2026-09-27T14:45:04.784Z exit=0 [toolkit]
```
$ toolkit work decisions
1 decision waits on the owner:

TVSRC-002 Add a quote section to README.md
  - TVSRC-002 is waiting on the owner (02 Refinement). Next action: Owner: approve or revise the child requirements. Agent: then write and check Add a quote in coordination with TVSRC-001. (work-decide)

```
### 2026-09-27T14:45:16.150Z exit=0
```
$ git config --local --list && git config --global user.name && git config --global user.email
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
core.ignorecase=true
core.precomposeunicode=true
Mike Rihm
michael@rihm.com

```
### 2026-09-27T14:45:16.175Z exit=0 [toolkit]
```
$ toolkit work lifecycle
Stages (the status follows the stage):
  01-discovery              Backlog      Working out what the owner wants.                                    Continue with: work-requirements
  02-refinement             Backlog      Turning that into requirements.                                      Continue with: work-requirements
  03-requirements-approved  Ready        The owner approved the requirements.                                 Continue with: solution-design or work-on
  04-solution-design        In Progress  Deciding how it gets built.                                          Continue with: solution-design
  05-breakdown              In Progress  Splitting work that is too large.                                    Continue with: work-organize
  06-implementation-plan    In Progress  Ordering the build steps.                                            Continue with: work-on
  07-tracking-setup         In Progress  Creating build tracking when needed.                                 Continue with: work-on
  08-build                  In Progress  Producing the requested change.                                      Continue with: work-on
  09-testing                In Progress  Checking it against the requirements.                                Continue with: work-check
  10-bug-fixing             In Progress  Fixing what testing found.                                           Continue with: work-check
  11-user-approval          In Progress  The owner reviews the result.                                        Continue with: work-check
  12-pr-and-push            In Review    Repository work is in a pushed pull request.                         Continue with: work-finish
  13-deployment             In Review    The result is put where it belongs.                                  Continue with: work-finish
  14-spec-update            In Review    Lasting specifications match the result.                             Continue with: work-finish
  (Done)                    Done         Set only by toolkit work finish <id> --by <name> --evidence <text>.  Continue with: work-finish
  (Cancelled)               Cancelled    Set only by toolkit work cancel <id> --reason <text>.                Continue with: work-finish
  An item with waiting_on: owner continues with work-decide, whatever its stage.

Statuses:
  Backlog      Logged; requirements are still being worked out (stages 01-02).
  Ready        Requirements approved; work can start (stage 03).
  In Progress  The item is active (stages 04-11). It does not mean building has started.
  In Review    The result is in a pull request, being deployed, or being written into the specifications (stages 12-14).
  Done         The owner accepted the result. Set only by toolkit work finish.
  Cancelled    Work stopped without the result. Set only by toolkit work cancel.

Types:
  discovery               Finding out what is needed.
  solution-design         Designing how something gets built.
  build                   Producing a change. Needs approved requirements before stage 03.
  data-load               Loading or changing data. Needs approved requirements before stage 03.
  repository-maintenance  Keeping the repository in order.
  research                Answering a question with sources.
  task                    A small piece of work.
  bug                     Something that does not work as it should.
  enhancement             An improvement to something that works.
  Other lower-case words are allowed as types.

Priorities: urgent, high, medium, low. Waiting on: owner, agent, external: <who>, none. Delivery: agent-led, owner-led, not-offered.

Approval gates:
  Requirements approval: asked by work-requirements; recorded with toolkit work approve <id> --requirements --by <name>. build and data-load items cannot reach stage 03 or later without it. Sets stage 03 when the item is earlier.
  Design approval: asked by solution-design; recorded with toolkit work approve <id> --design --by <n
...[truncated]
```
### 2026-09-27T14:45:18.846Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002 --section Requirements
## Requirements

**Overall status:** Refining  
**Finalization rule:** The child scope is drawn from the approved parent requirements and Mike Rihm's split instruction. Record separate approval before treating these child requirements as Finalized.

### Starting request

Owner: make the new "Add a quote" section its own sub-item under the README brief item.

### Agreed goal

Add the Add a quote section in the Option A README layout. TVSRC-001 retains Purpose and Start here.

### Active requirements

#### R-01 — Explain how to add a quote

**Status:** Refining  
**Applies to:** People new to Node who clone the project, and Mike Rihm when he returns later.  
**Required behavior:** The README's Add a quote section explains how to add a JavaScript string to the `quotes` array in quote.js and says the printed quote depends on the day of the month.  
**Boundaries and exceptions:** The new quote may not print on the same day it is added. Do not change quote.js.  
**Acceptance check:** A reader can locate the `quotes` array and follow the instructions without expecting the new string to print immediately.  
**Decision record:** Derived from TVSRC-001 R-01, approved by Mike Rihm on 2026-09-27, and his 2026-09-27 split instruction. Separate child approval pending.  
**Open questions:** None.

#### R-02 — Use short bullets

**Status:** Refining  
**Applies to:** The Add a quote section.  
**Required behavior:** Write the section as short bullets.  
**Boundaries and exceptions:** Avoid long explanatory paragraphs.  
**Acceptance check:** The section uses short bullets and no long paragraph.  
**Decision record:** Derived from TVSRC-001 R-02, approved by Mike Rihm on 2026-09-27. Separate child approval pending.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The Add a quote section is present under the Option A layout.
2. Its instructions match quote.js and its bullets are short.
3. Mike Rihm reviews the child result.

```
### 2026-09-27T14:45:18.847Z exit=0 [toolkit]
```
$ toolkit work design TVSRC-001
Design of TVSRC-001 (approved) at https://app.notion.com/p/TVSRC-001-Write-a-short-quote-script-project-brief-in-README-md-solution-design-3e8b381da176811cb3c5ccd0c2584d90

---
work_item: TVSRC-001
status: approved
approved: 2026-09-27 by Mike Rihm
---
# TVSRC-001: Write a short quote script project brief in README.md — solution design

**Requirements:** TVSRC-001  
**Design status:** Approved  
**Requirements checked:** TVSRC-001 Requirements, approved by Mike Rihm on 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike Rihm on 2026-09-27

## What this design solves

People new to Node who clone the project, and Mike Rihm when he returns later, need short instructions for the quote script. Option A keeps separate Purpose, Start here, and Add a quote sections. TVSRC-001 delivers Purpose and Start here. TVSRC-002 delivers Add a quote.

## Requirements and design readiness

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
|---|---|---|---|
| R-01 — Explain the quote script | Finalized | TVSRC-001 covers the script, audience, and run command; TVSRC-002 covers adding a quote. | None for the layout. |
| R-02 — Short bullet lists | Finalized | Both items use short bullets in their sections. | None for the layout. |

## What exists today

README.md has a paragraph, Purpose, a numbered Start here list, project record links, and project checks. It gives `node quote.js` but does not name the audience or explain how to add a quote. quote.js has three strings in `quotes`; the current day of the month modulo the array length selects the printed string. Checked in project files on 2026-09-27.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
|---|---|---|---|
| Constraint | Use short bullets in the brief. | TVSRC-001 R-02, approved 2026-09-27 | Revise Purpose and Start here to bullets; TVSRC-002 adds bullets. |
| Constraint | Instructions match quote.js. | TVSRC-001 R-01, approved 2026-09-27 | Check the run command and date-based quote selection. |
| Constraint | Keep useful project record links. | README.md, checked 2026-09-27 | Retain the Project records and Project checks and release sections. |

## Design options

### Option A — Expand the current sections

#### Approach

Keep Purpose and Start here, revise them as short bullets, and add a separate Add a quote section. TVSRC-001 owns Purpose and Start here; TVSRC-002 owns Add a quote. Keep the other README sections.

#### End-to-end behavior

1. The reader sees the audience and what the script prints in Purpose.
2. The reader installs Node.js if needed and runs `node quote.js` from the project folder using Start here.
3. The reader follows Add a quote to edit the `quotes` array in quote.js. The displayed quote still depends on the day of the month.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
|---|---|---|---|
| R-01 | Revise Purpose and Start here in TVSRC-001; add Add a quote in TVSRC-002. | Each requested point has its own clear location. | Compare the text and command with quote.js. |
| R-02 | Use short bullets in all three brief sections. | The brief can be scanned. | Inspect the section format and length. |

#### Technical shape

- **Components and files:** README.md changes; quote.js is reused as the source for instructions.
- **Data and state:** No data changes.
- **Access and security:** No access changes.
- **Integrations:** None.
- **Operations:** Run `node quote.js` to check the command. No deployment is configured.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
|---|---|---|
| More headings lengthen the README. | Certain, small effect. | Keep each section to one or two short bullets. |
| A newly added quote may not print that day. | Possible on any given day. | TVSRC-002 explains date-based selection. |
| Two items edit README.md. 
...[truncated]
```
### 2026-09-27T14:45:29.015Z exit=0
```
$ cat > /tmp/tvsrc-002-active-requirements.md <<'EOF'
### Active requirements

#### R-01 — Explain how to add a quote

**Status:** Finalized  
**Applies to:** People new to Node who clone the project, and Mike Rihm when he returns later.  
**Required behavior:** The README's Add a quote section explains how to add a JavaScript string to the `quotes` array in quote.js and says the printed quote depends on the day of the month.  
**Boundaries and exceptions:** The new quote may not print on the same day it is added. Do not change quote.js.  
**Acceptance check:** A reader can locate the `quotes` array and follow the instructions without expecting the new string to print immediately.  
**Decision record:** Derived from TVSRC-001 R-01, approved by Mike Rihm on 2026-09-27, and his 2026-09-27 split instruction. Approved by Mike Rihm on 2026-09-27: “Approved.”  
**Open questions:** None.

#### R-02 — Use short bullets

**Status:** Finalized  
**Applies to:** The Add a quote section.  
**Required behavior:** Write the section as short bullets.  
**Boundaries and exceptions:** Avoid long explanatory paragraphs.  
**Acceptance check:** The section uses short bullets and no long paragraph.  
**Decision record:** Derived from TVSRC-001 R-02, approved by Mike Rihm on 2026-09-27. Approved by Mike Rihm on 2026-09-27: “Approved.”  
**Open questions:** None.
EOF

```
### 2026-09-27T14:45:38.714Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-002 --section "Active requirements" --set-file /tmp/tvsrc-002-active-requirements.md
Saved "Active requirements" in TVSRC-002.

```
### 2026-09-27T14:45:45.610Z exit=0 [toolkit]
```
$ toolkit work approve TVSRC-002 --requirements --by "Mike Rihm"
Recorded: requirements of TVSRC-002 approved (2026-09-27 by Mike Rihm).
It is no longer waiting on the owner (waiting_on: none).
Now 03 Requirements approved (Ready). Continue with solution-design.

```
### 2026-09-27T14:45:51.980Z exit=0 [toolkit]
```
$ toolkit work history TVSRC-002 --note "Owner's words approving the Add a quote requirements: “Approved. Keep going.”"
Added a Recent History row to TVSRC-002.

```
### 2026-09-27T14:45:58.800Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-002 --waiting-on agent
Updated TVSRC-002: waiting on agent.
Now 03 Requirements approved (Ready). Continue with solution-design.

```
### 2026-09-27T14:46:26.726Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-001 --stage 08-build
Updated TVSRC-001: stage 06 Implementation plan -> 08 Build (status In Progress).
Now 08 Build (In Progress). Continue with work-on.

```
### 2026-09-27T14:46:33.013Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-002 --stage 08-build
Updated TVSRC-002: stage 03 Requirements approved -> 08 Build (status In Progress).
Now 08 Build (In Progress). Continue with work-on.

```
### 2026-09-27T14:46:40.890Z exit=0 [toolkit]
```
$ toolkit work history TVSRC-002 --note "Moved from approved requirements to build: TVSRC-001's approved Option A design already specifies this short section and its check; no separate design choice remains."
Added a Recent History row to TVSRC-002.

```
### 2026-09-27T14:46:54.262Z exit=0 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-check/SKILL.md
---
name: work-check
description: 'Checks a finished build against every requirement with an independent checker agent, fixes what fails, then shows the owner the result to approve. Use when the owner asks "is it ready", "does it work", "test it", or "check it against what I asked for", or when a build''s last task is done.'
---

# Work check

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. How to brief agents: `../../references/helpers.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Read the requirements, the acceptance list, and the tasks, then set the testing stage. When the show output's "Design:" value is not `none`, also read the design's Acceptance checks (in "Build and verification plan") and the selected option's "How to check it" column (the design command exits 1 for an item with no design).
   `toolkit work show <id>`
   `toolkit work design <id>`
   `toolkit work set <id> --stage 09-testing`
2. Run the project's tests and every acceptance check the item lists. A check with several scenarios or manual steps gets a test plan: a copy of `tests/TEST-PLAN-TEMPLATE.md` named for the item, with the results filled in. A check that could not run is reported as not run, never as passed.
3. Brief the `acceptance-checker` agent (never the agent that built it): one verdict per requirement (met, partly met, not met) with evidence, plus defects seen in the diff. Give it the branch and commit to check.
4. Failures: set the bug-fixing stage; a `builder` agent (or the main agent) fixes; the checker checks again. Repeat until clean, or until a failure needs an owner decision (an Open Questions row and the item waiting on the owner).
   `toolkit work set <id> --stage 10-bug-fixing`
5. Record the result: what was checked, the evidence, the known gaps.
   `toolkit work history <id> --note "Checked: <what>; evidence: <where>; gaps: <gaps or none>"`
6. Set the approval stage and wait on the owner. Show him what it does now, how to see it (a link, a command, or a screenshot), the evidence, and the gaps. Ask one line: "Do you approve this result?"
   `toolkit work set <id> --stage 11-user-approval --waiting-on owner`
7. Yes: record it (the command adds its own history row), quote his words in one note, and hand the item back to the agent unless another question for him is still open; then open `work-finish`. A requirement change goes to `work-requirements`; a fix becomes a task and continues here.
   `toolkit work approve <id> --result --by <owner>`
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`

## Agents

- `acceptance-checker`: step 3 and every re-check. Paste in the Agreed goal, every `R-xx` with its acceptance check, the Acceptance list, the design's Acceptance checks and "How to check it" column, and the test plan when there is one. Name the branch and commit.
- `builder`: fixes in step 4 when a team was recorded or the owner agreed; one builder per independent fix, one writer per path.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker. With no worker, do the work yourself and say that no independent check ran.

## Showing the result

- Lead with what the result does now, in the owner's terms: "The export button now creates a CSV file that opens in Excel."
- Then how he can see it himself: the link, the command to run, or a screenshot.
- Then the evidence: tests run and their result lines, the checker's verdicts.
- Then the gaps: anything partly met, not run, or known to be missing. Never hide a gap to get an approval.
- One question: "Do you approve this result?"

## Rules

- The checker is independent: never the agent or 
...[truncated]
```
### 2026-09-27T14:46:54.291Z exit=0
```
$ git diff --check && git diff -- README.md
diff --git a/README.md b/README.md
index ee3517e..3c1fed1 100644
--- a/README.md
+++ b/README.md
@@ -1,16 +1,19 @@
 # Toolkit V2 sample run c (safe to delete)
 
-This sample project contains a tiny Node script that prints a short quote.
-
 ## Purpose
 
-Run `node quote.js` to print one of three short quotes. The selected quote varies with the day of the month. Running the command more than once on the same day prints the same quote.
+- For people new to Node who clone this project to try it, and for Mike Rihm when he returns to it later.
+- `quote.js` prints one of three short quotes. The day of the month selects the quote, so runs on the same day print the same one.
 
 ## Start here
 
-1. Install Node.js if it is not already available.
-2. Run the script locally with `node quote.js`.
-3. Use `toolkit doctor` to check Toolkit V2 wiring. Work items and memory are on the Notion project page recorded in `.toolkit.json`.
+- Install Node.js if it is not already available.
+- From this project folder, run `node quote.js`.
+
+## Add a quote
+
+- Open `quote.js` and add a quoted JavaScript string, followed by a comma, to the `quotes` array.
+- Run `node quote.js`. The selected quote depends on the day of the month, so the new quote may not print today.
 
 ## Project records
 
@@ -24,5 +27,6 @@ Run `node quote.js` to print one of three short quotes. The selected quote varie
 ## Project checks and release
 
 - Local validation: `node quote.js`. No automated tests are configured.
+- Toolkit V2 check: `toolkit doctor`. Work items and memory are on the Notion project page recorded in `.toolkit.json`.
 - Deployment process: none specified.
 - Environments: local Node.js execution only.

```
### 2026-09-27T14:46:54.297Z exit=0
```
$ node quote.js
Small steps every day.

```
### 2026-09-27T14:46:57.306Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002 --section Requirements
## Requirements

**Overall status:** Finalized  
**Finalization rule:** The child scope is drawn from the approved parent requirements and Mike Rihm's split instruction. Record separate approval before treating these child requirements as Finalized.

### Starting request

Owner: make the new "Add a quote" section its own sub-item under the README brief item.

### Agreed goal

Add the Add a quote section in the Option A README layout. TVSRC-001 retains Purpose and Start here.

### Active requirements

#### R-01 — Explain how to add a quote

**Status:** Finalized  
**Applies to:** People new to Node who clone the project, and Mike Rihm when he returns later.  
**Required behavior:** The README's Add a quote section explains how to add a JavaScript string to the `quotes` array in quote.js and says the printed quote depends on the day of the month.  
**Boundaries and exceptions:** The new quote may not print on the same day it is added. Do not change quote.js.  
**Acceptance check:** A reader can locate the `quotes` array and follow the instructions without expecting the new string to print immediately.  
**Decision record:** Derived from TVSRC-001 R-01, approved by Mike Rihm on 2026-09-27, and his 2026-09-27 split instruction. Approved by Mike Rihm on 2026-09-27: “Approved.”  
**Open questions:** None.

#### R-02 — Use short bullets

**Status:** Finalized  
**Applies to:** The Add a quote section.  
**Required behavior:** Write the section as short bullets.  
**Boundaries and exceptions:** Avoid long explanatory paragraphs.  
**Acceptance check:** The section uses short bullets and no long paragraph.  
**Decision record:** Derived from TVSRC-001 R-02, approved by Mike Rihm on 2026-09-27. Approved by Mike Rihm on 2026-09-27: “Approved.”  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The Add a quote section is present under the Option A layout.
2. Its instructions match quote.js and its bullets are short.
3. Mike Rihm reviews the child result.

```
### 2026-09-27T14:47:05.775Z exit=0 [toolkit]
```
$ toolkit work --help
toolkit work: Work items: create, list, show, change, approve, finish, and sync them. toolkit work lifecycle shows the stages.

Usage:
  toolkit work lifecycle
  toolkit work new --title <t> [--type <t>] [--parent <id>] [--stage <s>] [--priority <p>] [--request <text>] [--group <folder>]
  toolkit work list [--status <s>] [--waiting-on <w>] [--tree] [--all]
  toolkit work show <id> [--section <heading>] [--path]
  toolkit work edit <id> --section <heading> --set-file <file|-> | --section <heading> --append-row "<a | b | c>" | --label <name> --value <text>
  toolkit work set <id> [--stage <s>] [--waiting-on <w>] [--priority <p>] [--type <t>] [--delivery <d>] [--title <t>] [--parent <id|none>] [--reopen] [--note <why>]
  toolkit work approve <id> --requirements|--design|--result --by <name>
  toolkit work design <id> [--create] [--set-file <file|->] [--status proposed|approved|superseded] [--by <name>]
  toolkit work history <id> --note <text> [--effect <text>]
  toolkit work move <id> --under <id|group|archive|root>
  toolkit work finish <id> --by <name> --evidence <text> [--allow-open-sub-items]
  toolkit work cancel <id> --reason <text> [--by <name>]
  toolkit work next
  toolkit work decisions
  toolkit work sync
  toolkit work validate [<id|file>]

Exit codes: 0 ok, 1 error, 2 validation failure or a refused gate, 3 not supported for this tracker, 4 not a toolkit project.
Skills find an item's file only with: toolkit work show <id> --path

```
### 2026-09-27T14:47:06.982Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-001 --section Overview
## Overview

**Goal:** Write the Purpose and Start here bullets for the short README brief. The Add a quote section is assigned to sub-item TVSRC-002.

**Current position:** Mike Rihm chose and approved Option A on 2026-09-27. TVSRC-002 owns the Add a quote section. The parent requirements and selected design are approved, and the parent tasks are planned.

**Next action:** Agent: write and check the Purpose and Start here bullets in README.md, coordinating the shared file with TVSRC-002.

**Blockers:** None for the main item. TVSRC-002 has its own requirements and review.

**Related items:** TVSRC-002.

```
### 2026-09-27T14:47:06.996Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002 --section Tasks
## Tasks

### P1 — Add a quote instructions

- [ ] **P1-T01 — Write Add a quote bullets** · Not Started  
  **Work:** Add a short Add a quote section to README.md under the Option A layout.  
  **Deliverable:** Add a quote bullets in README.md.  
  **Done when:** The instructions identify the `quotes` array in quote.js, show how to add a JavaScript string, and explain that the selected quote depends on the day of the month.  
  **Depends on:** Child requirements finalized.
- [ ] **P1-T02 — Check the instructions** · Not Started  
  **Work:** Compare the new section with quote.js and check its bullet format.  
  **Deliverable:** Check evidence for TVSRC-002.  
  **Done when:** The steps are accurate and use short bullets.  
  **Depends on:** P1-T01.

```
### 2026-09-27T14:47:07.117Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002 --section Overview
## Overview

**Goal:** Add a short Add a quote section to README.md under the Option A layout.

**Current position:** Created under TVSRC-001 at Mike Rihm's request on 2026-09-27. Draft child requirements cover an accurate quote edit instruction and short bullets.

**Next action:** Owner: approve or revise the child requirements. Agent: then write and check Add a quote in coordination with TVSRC-001.

**Blockers:** Child requirements need separate owner approval before the child build.

**Related items:** Parent TVSRC-001; covers its R-01 and R-02 for the Add a quote section.

```
### 2026-09-27T14:47:08.408Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-001 --section Tasks
## Tasks

### P1 — Purpose and Start here

- [ ] **P1-T01 — Write the main brief bullets** · Not Started  
  **Work:** Revise Purpose and Start here in README.md with short bullets covering the script, audience, and run command.  
  **Deliverable:** Purpose and Start here bullets in README.md.  
  **Done when:** The bullets match quote.js, serve the agreed readers, and use the Option A layout.  
  **Depends on:** Selected design recorded.
- [ ] **P1-T02 — Check the main brief** · Not Started  
  **Work:** Check the two sections against the approved requirements and run `node quote.js`.  
  **Deliverable:** Check evidence for TVSRC-001.  
  **Done when:** The text is accurate and the script runs.  
  **Depends on:** P1-T01.

```
### 2026-09-27T14:47:16.306Z exit=0 [toolkit]
```
$ rg --files /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/agents | rg 'acceptance-checker' && cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/agents/acceptance-checker.md
/Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/agents/acceptance-checker.md
---
name: acceptance-checker
description: Checks a finished work item result against each requirement's acceptance check and the design's acceptance checks, runs the tests, and returns a verdict per requirement with evidence, defects seen in the diff, and checks that could not run. Also checks a build plan before the build when asked. Never the agent that built it; changes nothing.
tools: Read, Glob, Grep, Bash
model: opus
---

# Acceptance checker

Check whether a finished result does what the owner asked. You are never the
agent that built it. You run tests and read code, but you change nothing. You
advise; the main agent fixes; the owner approves.

## Start with the brief

- The brief gives the work item id, the requirements (Agreed goal, every
  `R-xx` with its acceptance check, the Acceptance list), the design's
  Acceptance checks table (in its "Build and verification plan") and the
  "How to check it" column of the selected option's Requirement coverage, the
  item's test plan when it has one (a copy of `tests/TEST-PLAN-TEMPLATE.md`),
  the branch or commit to check, and the project's test commands.
- Check that you are looking at the exact code the brief names:

  ```text
  git status
  git rev-parse HEAD
  git log --oneline -5
  ```

  If the commit differs from the one in the brief, say so first.
- When the brief asks for a check before a merge, report the exact commit
  you checked, so the main agent can confirm nothing changed after it.

## Check

- Run the project's tests and every acceptance check you can run. Copy each
  command and its result line exactly.
- For each requirement, give one verdict:
  - **Met:** the acceptance check passed, or the evidence shows the required
    behavior. Name the evidence.
  - **Partly met:** some of the behavior works. Say what is missing.
  - **Not met:** the behavior is missing or wrong. Say what you saw.
  - **Not run:** the check could not run here. Say why and what would run it.
    Never report a check that did not run as passed.
- Read the diff for the item's branch against its base. Report defects you
  see: broken edge cases, missing error handling the requirements ask for,
  behavior the requirements did not ask for, files changed that the design
  did not name, and anything that would ship something unfinished.
- Walk the flow start to finish as the person who uses the result. Report any
  step where it breaks, even when each requirement passes on its own.

## Plan check (only when the brief asks for one)

Before a build starts, the brief may give the item's Roadmap and Tasks, the
requirements, and the design's "Build and verification plan" instead of a
finished result.
Then check the plan, not code:

- Every `R-xx` is covered by at least one task, and every task's "Done when"
  names evidence someone else can check.
- Each task has one owner, and each file has one writer. "Depends on" is
  right: no task starts before what it needs.
- Tasks that run at the same time have clear boundaries: no two builders
  write the same file, and no two use the same shared environment (a sandbox
  org, a database, a test service) at the same time without a stated order.
- No task relies on something the design or the code no longer says.
- Changes that affect other work items are named.

A different phase structure is not a defect by itself. Work that runs in
parallel does not need one agent per phase. Return for a plan check: the
verdict (ready to build, or not ready) in one line, then each finding with
the task id, what is wrong, and the fix in one line.

## Boundaries

- Bash is for tests and read-only commands only: running tests, `git status`,
  `git diff`, `git log`, `git show`, listing files. Never edit, stage, commit,
  push, merge, deploy, install, or delete anything.
- Never run a command against a shared or production org or service. Never
  touch production data.
- Never run a `to
...[truncated]
```
### 2026-09-27T14:47:25.959Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-001 --stage 09-testing
Updated TVSRC-001: stage 08 Build -> 09 Testing (status In Progress).
Now 09 Testing (In Progress). Continue with work-check.

```
### 2026-09-27T14:47:32.160Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-002 --stage 09-testing
Updated TVSRC-002: stage 08 Build -> 09 Testing (status In Progress).
Now 09 Testing (In Progress). Continue with work-check.

```
### 2026-09-27T14:48:21.478Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-001 --section Notes
## Notes

### Decisions and context

- Existing README explains the script and command but does not identify an audience or explain how to add a quote.
- quote.js holds three strings in a quotes array and selects one using the current day of the month modulo the array length.
- Owner, 2026-09-27: the README brief is for people new to Node who clone the repo to try it, and for him later. He prefers README sections as short bullet lists.
- Owner, 2026-09-27: “Approved.” This approved the requirements for the full README brief.
- Owner, 2026-09-27: “Go with option A. Then split the work: make the new "Add a quote" section its own sub-item under the README brief item, and keep the Purpose and Start here bullets in the main item.”
- TVSRC-001 now delivers Purpose and Start here. TVSRC-002 delivers Add a quote. Together they cover TVSRC-001 R-01 and R-02.
- Option A design approval was recorded for TVSRC-001 on 2026-09-27.

### Resume here

Write and check Purpose and Start here in README.md. Coordinate with TVSRC-002 because both items edit README.md. The child requirements remain a draft for separate approval.

### Solution options and considerations

Option A was selected. Keep its separate Purpose, Start here, and Add a quote headings; TVSRC-002 owns the Add a quote heading.

```
### 2026-09-27T14:48:21.489Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002 --section Notes
## Notes

### Decisions and context

- Parent: TVSRC-001. This child covers the Add a quote portion of parent R-01 and R-02; the parent keeps Purpose and Start here.
- Option A uses a separate Add a quote heading. The parent and child both edit README.md, so coordinate the final document and review.

### Resume here

Wait for Mike Rihm to approve or revise the child requirements. Then write and check the Add a quote section in coordination with TVSRC-001.

### Solution options and considerations

- Under Option A, add a separate Add a quote heading with short bullets. Check the wording against the `quotes` array and date-based selection in quote.js.

```
### 2026-09-27T14:48:21.489Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-001 --section Roadmap
## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Purpose and Start here | The README has short bullets for the script, audience, and run command. | Not Started | Bullets match quote.js and the approved parent requirements. | TVSRC-002 |

```
### 2026-09-27T14:48:23.038Z exit=0 [toolkit]
```
$ toolkit work show TVSRC-002 --section Roadmap
## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Add a quote instructions | The README explains how to add a string to the `quotes` array. | Not Started | Instructions match quote.js and use short bullets. | None. |

```
### 2026-09-27T14:49:02.771Z exit=0
```
$ python3 - <<'PY'
from pathlib import Path
base = Path('/tmp')
sections = {
 'tvsrc-001-tasks.md': '''## Tasks

### P1 — Purpose and Start here

- [x] **P1-T01 — Write the main brief bullets** · Done  
  **Work:** Revise Purpose and Start here in README.md with short bullets covering the script, audience, and run command.  
  **Deliverable:** Purpose and Start here bullets in README.md.  
  **Done when:** The bullets match quote.js, serve the agreed readers, and use the Option A layout.  
  **Depends on:** Selected design recorded.
- [x] **P1-T02 — Check the main brief** · Done  
  **Work:** Check the two sections against the approved requirements and run `node quote.js`.  
  **Deliverable:** Check evidence for TVSRC-001.  
  **Done when:** The text is accurate and the script runs.  
  **Depends on:** P1-T01.
''',
 'tvsrc-002-tasks.md': '''## Tasks

### P1 — Add a quote instructions

- [x] **P1-T01 — Write Add a quote bullets** · Done  
  **Work:** Add a short Add a quote section to README.md under the Option A layout.  
  **Deliverable:** Add a quote bullets in README.md.  
  **Done when:** The instructions identify the `quotes` array in quote.js, show how to add a JavaScript string, and explain that the selected quote depends on the day of the month.  
  **Depends on:** Child requirements finalized.
- [x] **P1-T02 — Check the instructions** · Done  
  **Work:** Compare the new section with quote.js and check its bullet format.  
  **Deliverable:** Check evidence for TVSRC-002.  
  **Done when:** The steps are accurate and use short bullets.  
  **Depends on:** P1-T01.
''',
 'tvsrc-001-roadmap.md': '''## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Purpose and Start here | The README has short bullets for the script, audience, and run command. | Complete | Bullets match quote.js and the approved requirements; independent check passed. | None; related item TVSRC-002 is a top-level card. |
''',
 'tvsrc-002-roadmap.md': '''## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Add a quote instructions | The README explains how to add a string to the `quotes` array. | Complete | Instructions match quote.js and use short bullets; independent check passed. | None. |
''',
 'tvsrc-001-overview.md': '''## Overview

**Goal:** Write the Purpose and Start here bullets for the short README brief. TVSRC-002 owns the Add a quote section.

**Current position:** Purpose and Start here are written in README.md. The combined draft passed an independent requirements check and `node quote.js` ran. TVSRC-002 is now a top-level Notion card and remains related to this item.

**Next action:** Owner: review and approve the TVSRC-001 result. Agent: after approval, continue the publication and closeout steps when Gi

```
### 2026-09-27T14:49:14.491Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-001 --section "Tasks" --set-file /tmp/tvsrc-001-tasks.md
Saved "Tasks" in TVSRC-001.

```
### 2026-09-27T14:49:21.040Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-001 --section "Roadmap" --set-file /tmp/tvsrc-001-roadmap.md
Saved "Roadmap" in TVSRC-001.

```
### 2026-09-27T14:49:26.428Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-001 --section "Overview" --set-file /tmp/tvsrc-001-overview.md
Saved "Overview" in TVSRC-001.

```
### 2026-09-27T14:49:31.352Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-001 --section "Notes" --set-file /tmp/tvsrc-001-notes.md
Saved "Notes" in TVSRC-001.

```
### 2026-09-27T14:49:35.964Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-002 --section "Tasks" --set-file /tmp/tvsrc-002-tasks.md
Saved "Tasks" in TVSRC-002.

```
### 2026-09-27T14:49:40.100Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-002 --section "Roadmap" --set-file /tmp/tvsrc-002-roadmap.md
Saved "Roadmap" in TVSRC-002.

```
### 2026-09-27T14:49:46.195Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-002 --section "Overview" --set-file /tmp/tvsrc-002-overview.md
Saved "Overview" in TVSRC-002.

```
### 2026-09-27T14:49:50.675Z exit=0 [toolkit]
```
$ toolkit work edit TVSRC-002 --section "Notes" --set-file /tmp/tvsrc-002-notes.md
Saved "Notes" in TVSRC-002.

```
### 2026-09-27T14:50:01.946Z exit=0 [toolkit]
```
$ toolkit work history TVSRC-001 --note 'Built Purpose and Start here bullets in README.md. Independent check found R-01 and R-02 met; node quote.js printed “Small steps every day.” git diff --check passed. Owner review is pending; publication is blocked by read-only Git metadata and no remote.'
Added a Recent History row to TVSRC-001.

```
### 2026-09-27T14:50:08.343Z exit=0 [toolkit]
```
$ toolkit work history TVSRC-002 --note 'Built Add a quote bullets in README.md. Independent check found R-01 and R-02 met; node quote.js printed “Small steps every day.” git diff --check passed. Owner review is pending; publication is blocked by read-only Git metadata and no remote.'
Added a Recent History row to TVSRC-002.

```
### 2026-09-27T14:50:17.686Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-001 --stage 11-user-approval --waiting-on owner
Updated TVSRC-001: stage 09 Testing -> 11 User approval (status In Progress); waiting on owner.
Now 11 User approval (In Progress). Continue with work-decide.

```
### 2026-09-27T14:50:22.750Z exit=0 [toolkit]
```
$ toolkit work set TVSRC-002 --stage 11-user-approval --waiting-on owner
Updated TVSRC-002: stage 09 Testing -> 11 User approval (status In Progress); waiting on owner.
Now 11 User approval (In Progress). Continue with work-decide.

```
### 2026-09-27T14:50:27.886Z exit=0 [toolkit]
```
$ cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/memory/0.2.0/skills/memory-save/SKILL.md
---
name: memory-save
description: 'Saves, corrects, or forgets one lasting fact in project memory, and sends anything that belongs elsewhere to its home. Use when the owner says "remember this", "from now on", "always do X", "never do X", "forget that", or "remind me", corrects the agent, or a hook says to save.'
---

# Memory save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Record format, types, focus, and glossary: `references/record-format.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Put each `toolkit` command on its own line; write `--body-file` and `--set-file` files in a temporary folder outside the repository.

## Steps

1. Decide the home first, with the memory criteria (`.memory/memory-criteria.md` with built-in memory; otherwise `references/record-format.md`). Memory holds a lasting preference, correction, fact about the project or the owner, or a hard-to-find reference. Elsewhere: project work goes to `work-on`; a decision for the whole project to `work-decide` (`DECISIONS.md`); delivered behavior to `requirements/`; how a change is built to the item's design; verified current structure to `system-guide/`; outside documentation to `ai-external-knowledge/`; a standing rule for how agents work here is proposed as a rule-file change; an owner to-do with no work item goes to the current focus "Untracked to-dos"; a project term goes to the glossary. A short memory pointer to a hard-to-find record is allowed; never copy its body.
2. Search first and update the existing record rather than add a duplicate.
   `toolkit memory find "<topic>"`
   `toolkit memory get <key>`
3. Approval. This is the only written copy of the memory approval policy. Read the mode, then apply it:
   `toolkit config get memory.approval`
   The owner's own words ("remember", "from now on", "always", "never", "forget", a correction) are the approval: save now, with his name as the approver. `onboarding` mode (the default): something the agent inferred gets one yes-or-no line first ("Save to memory: <one-line summary>?"); save after a yes. `trusted` mode: routine facts the agent is sure of are saved and reported, without an approver. Always ask first, in either mode, for anything about a named person, personal details, a hard delete, more than five records at once, or a change to this policy. A yes covers only the change and meaning shown. Silence is never a yes. There is no proposal inbox: keep an unanswered question in the conversation and go on with other work.
4. Save: type (`user`, `feedback`, `project`, `reference`, `event`), slug, one-line description, the source, and a body file with the model's labels: Remember, Why, How to apply, Evidence and limits (the source and an absolute date), Related memories (relative links such as `[deploy window](project_deploy_window.md)`), Authoritative records. The source is the person, conversation, or document the fact came from, with an absolute date, for example "The owner, in chat, 2026-09-26" or "requirements/billing.md, 2026-09-26". Saving the same type and slug again updates that record. Replacing a record under a new name: add `--supersedes <old-key>`. Giving the same record a better name, or a type that matches its content: rename it; links to it are repaired. Use the first save form when the owner approved (his words or his yes); the second only for a routine save in `trusted` mode.
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file> --source "<person or document>, <YYYY-MM-DD>" --approved-by <owner>`
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file> --source "<person or document>, <YYYY-MM-DD>"`
   `toolkit memory rename <key> --to <new-key>`
5. "Forget that": retire the record (it can be undone); right after a save, retire that 
...[truncated]
```
### 2026-09-27T14:50:27.909Z exit=0
```
$ git status --short --branch && git diff --check
## main
 M README.md

```
### 2026-09-27T14:50:28.866Z exit=0 [toolkit]
```
$ toolkit memory focus
# Current focus

Last updated: 2026-09-27, Mike Rihm's Option A and split instruction

## Now

- TVSRC-001.
- TVSRC-002.

## Waiting on the owner

- TVSRC-002.

## Untracked to-dos

- None.

## Next session starts with

- Read `PROJECT.md`, then open TVSRC-001 and TVSRC-002 through `toolkit work`. Follow their recorded next actions.

```
### 2026-09-27T14:50:31.079Z exit=0 [toolkit]
```
$ toolkit work validate TVSRC-002
Checked 1 item: 1 clean, 0 errors, 0 questions for the owner.

```
### 2026-09-27T14:50:31.438Z exit=0 [toolkit]
```
$ toolkit work validate TVSRC-001
Checked 1 item: 1 clean, 0 errors, 0 questions for the owner.

```
### 2026-09-27T14:50:37.843Z exit=0 [toolkit]
```
$ cat > /tmp/tvsrc-current-focus.md <<'EOF'
# Current focus

Last updated: 2026-09-27, Mike Rihm's approval and the README result check

## Now

- TVSRC-001.
- TVSRC-002.

## Waiting on the owner

- TVSRC-001.
- TVSRC-002.

## Untracked to-dos

- None.

## Next session starts with

- Read `PROJECT.md`, then open TVSRC-001 and TVSRC-002 through `toolkit work`. Follow their recorded next actions.
EOF

```
### 2026-09-27T14:50:45.137Z exit=0 [toolkit]
```
$ toolkit memory focus --set-file /tmp/tvsrc-current-focus.md
Saved the current focus (21 lines). Version: 15f8b0b0f485

```
### 2026-09-27T14:50:50.881Z exit=0
```
$ git diff --numstat -- README.md && git status --short --branch
10	6	README.md
## main
 M README.md

```
### 2026-09-27T14:50:51.272Z exit=1 [toolkit]
```
$ toolkit doctor
Toolkit doctor for Toolkit V2 sample run c (safe to delete) (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1).

Problems (1):
1. 1 scaffold file is missing: SOUL.md.
   Fix: Run toolkit sync.

Warnings (2):
2. Codex does not trust this folder (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1). Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off.
   Fix: The owner opens Codex in this folder and trusts it when Codex asks.
3. The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards).
   Fix: The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.

Notes (20):
- .claude/output-styles/plain-english.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/ai-external-knowledge.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/humanize-outbound-text.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/keep-work-item-current.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/memory-review-and-save.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/plain-english-artifacts.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/publish-project-documents.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/session-handoff.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- .claude/rules/shared-repository-work.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- AGENTS.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
- CLAUDE.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. The project-setup skill shows these to the owner and makes the changes he approves.
- DECISIONS.md was changed by the project, so sync leaves it alone. The toolkit would: the project had this file before the toolkit; the toolkit version was not installed. Th
...[truncated]
```
### 2026-09-27T14:50:51.545Z exit=0 [toolkit]
```
$ toolkit memory focus
# Current focus

Last updated: 2026-09-27, Mike Rihm's approval and the README result check

## Now

- TVSRC-001.
- TVSRC-002.

## Waiting on the owner

- TVSRC-001.
- TVSRC-002.

## Untracked to-dos

- None.

## Next session starts with

- Read `PROJECT.md`, then open TVSRC-001 and TVSRC-002 through `toolkit work`. Follow their recorded next actions.

```
### 2026-09-27T14:50:52.540Z exit=0 [toolkit]
```
$ toolkit work decisions
4 decisions wait on the owner:

TVSRC-001 Write a short quote script project brief in README.md
  - TVSRC-001 is waiting on the owner (11 User approval). Next action: Owner: review and approve the TVSRC-001 result. Agent: after approval, continue the publication and closeout steps when Git access is available. (work-decide)
  - TVSRC-001 is at 11 User approval: the owner reviews the result. Approve with: toolkit work approve TVSRC-001 --result --by <name>. (work-decide)

TVSRC-002 Add a quote section to README.md
  - TVSRC-002 is waiting on the owner (11 User approval). Next action: Owner: review and approve the TVSRC-002 result. Agent: after approval, continue the publication and closeout steps when Git access is available. (work-decide)
  - TVSRC-002 is at 11 User approval: the owner reviews the result. Approve with: toolkit work approve TVSRC-002 --result --by <name>. (work-decide)

```

## File edits (apply_patch)


## Other items

- 2026-09-27T14:44:38.640Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92bd5c05887d1b3b1c227c282fcd6", "summary_text": [], "raw_content": []}
- 2026-09-27T14:44:46.252Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92bdce97487d1904c79b38bf809e6", "summary_text": [], "raw_content": []}
- 2026-09-27T14:44:57.016Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92be67d0487d19fadeaa5c1ed6461", "summary_text": [], "raw_content": []}
- 2026-09-27T14:45:13.835Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92bf38f8887d1aa8d3a47da73ab3a", "summary_text": [], "raw_content": []}
- 2026-09-27T14:45:22.510Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c005f2087d19a0841d38d2979d5", "summary_text": [], "raw_content": []}
- 2026-09-27T14:45:46.986Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c1ab1d087d1900af62c8fdfb06f", "summary_text": [], "raw_content": []}
- 2026-09-27T14:45:53.777Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c21453087d1a22128d3b937139d", "summary_text": [], "raw_content": []}
- 2026-09-27T14:46:07.341Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c281c5c87d1b00ff4b4f29b3913", "summary_text": [], "raw_content": []}
- 2026-09-27T14:46:21.981Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c33856c87d18141efdc32885884", "summary_text": [], "raw_content": []}
- 2026-09-27T14:46:35.738Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c4b71e887d1a0b3a53bbda4f049", "summary_text": [], "raw_content": []}
- 2026-09-27T14:46:43.087Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c52c84087d1b4b94e456fd3adb2", "summary_text": [], "raw_content": []}
- 2026-09-27T14:46:49.771Z FileChange: {"type": "FileChange", "id": "exec-9c7ad7f0-ba45-47c1-a30e-040f635faf33", "changes": {"/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1/README.md": {"type": "update", "unified_diff": "@@ -2,7 +2,6 @@\n \n-This sample project contains a tiny Node script that prints a short quote.\n-\n ## Purpose\n \n-Run `node quote.js` to print one of three short quotes. The selected quote varies with the day of the month. Running the command more than once on the same day prints the same quote.\n+- For people new to Node who clone this project to try it, and for Mike Rihm when he returns to it later.\n+- `quote.js` prints one of three short quotes. The day of the month selects the quote, so runs on the same day print the same one.\n \n@@ -10,5 +9,9 @@\n \n-1. Install Node.js if it is not already available.\n-2. Run the script locally with `node quote.js`.\n-3. Use `toolkit doctor` to check Toolkit V2 wiring. Work items and memory are on the Notion project page recorded in `.toolkit.json`.\n+- Install Node.js if it is not already available.\n+- From this project folder, run `node quote.js`.\n+\n+## Add a quote\n+\n+- Open `quote.js` and add a quoted JavaScript string, followed by a comma, to the `quotes` array.\n+- Run `node quote.js`. The selected quote depends on the day of the month, so the new quote may not print today.\n \n@@ -26,2 +29,3 @@\n - Local validation: `node quote.js`. No automated test
- 2026-09-27T14:46:51.482Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c5af1ec87d1a8e1fbf1b7712cd1", "summary_text": [], "raw_content": []}
- 2026-09-27T14:47:03.547Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c62c30887d19e33a52cd3eae3c5", "summary_text": [], "raw_content": []}
- 2026-09-27T14:47:15.000Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c6de97487d1b89bddfdc2c0d99d", "summary_text": [], "raw_content": []}
- 2026-09-27T14:47:21.030Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c757bbc87d1b55251ddf21c2e92", "summary_text": [], "raw_content": []}
- 2026-09-27T14:47:34.038Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c857f8087d1a49802f181d679f2", "summary_text": [], "raw_content": []}
- 2026-09-27T14:47:40.589Z SubAgentActivity: {"type": "SubAgentActivity", "id": "call_waGaMcMAoWUWGnVrp4NcvYaF", "kind": "started", "agent_thread_id": "01a0e356-04e0-7b02-9f3c-054807c45a7e", "agent_path": "/root/acceptance_check"}
- 2026-09-27T14:47:53.236Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92c8f47ec87d1b679f1172645170c", "summary_text": [], "raw_content": []}
- 2026-09-27T14:48:04.356Z CollabAgentToolCall: {"type": "CollabAgentToolCall", "id": "call_g4NufiflYgOGNGEqX1VjZCU5", "tool": "wait", "status": "completed", "sender_thread_id": "01a0e353-2f8e-7dd1-84bf-9f3ac5f70e4c", "receiver_thread_ids": [], "receiver_agents": [], "agents_states": {}}
- 2026-09-27T14:48:06.225Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92ca55d6087d184d0542ecf2f151e", "summary_text": [], "raw_content": []}
- 2026-09-27T14:48:08.238Z SubAgentActivity: {"type": "SubAgentActivity", "id": "subagent-completed-01a0e356-052d-7be2-86b4-88e9f4a729a2", "kind": "completed", "agent_thread_id": "01a0e356-04e0-7b02-9f3c-054807c45a7e", "agent_path": "/root/acceptance_check"}
- 2026-09-27T14:48:14.591Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92ca72e3487d186ad38dc2d9860fd", "summary_text": [], "raw_content": []}
- 2026-09-27T14:48:32.148Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92cb9431487d191db34238adc991b", "summary_text": [], "raw_content": []}
- 2026-09-27T14:49:06.011Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92ce0228c87d196eb231103edb3c8", "summary_text": [], "raw_content": []}
- 2026-09-27T14:49:54.017Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92d0fd84087d1b88b8531c77423a9", "summary_text": [], "raw_content": []}
- 2026-09-27T14:50:10.996Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92d2261c887d19d12d6f91f4321b1", "summary_text": [], "raw_content": []}
- 2026-09-27T14:50:24.880Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92d304ce087d1866c2d8da0fbe793", "summary_text": [], "raw_content": []}
- 2026-09-27T14:50:34.362Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92d3916a087d1a1d0d1925e275dd6", "summary_text": [], "raw_content": []}
- 2026-09-27T14:50:47.579Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92d47152c87d1bf4fcb4bfb047b45", "summary_text": [], "raw_content": []}
- 2026-09-27T14:51:04.699Z Reasoning: {"type": "Reasoning", "id": "rs_08e08ac6f31060be016ab92d4e509087d19048209b867ef83a", "summary_text": [], "raw_content": []}

## Agent messages

### 2026-09-27T14:44:39.699Z
I’ll check the recorded approval and both README work items, then continue the approved work. I’ll use the work-on skill to keep the tracker current.

### 2026-09-27T14:44:58.747Z
The tracker shows one pending approval: TVSRC-002’s Add a quote requirements. I’ll record your “Approved” for that item. I also found that TVSRC-002 is now a top-level Notion card; I’ll leave that owner-side change intact and coordinate both README sections.

### 2026-09-27T14:46:08.996Z
TVSRC-002’s requirements are now recorded as approved. I’ll build the combined README draft and check it against `quote.js`. This checkout has no Git remote, and Git metadata is read-only here, so I’ll keep the result local for review.

### 2026-09-27T14:48:07.188Z
The README draft is written. An independent check found that both items meet their requirements; `node quote.js` ran successfully, and the diff check found no formatting errors. I’ll record the evidence and move both items to result review.

### 2026-09-27T14:51:09.673Z
The README draft is written in [README.md](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1/README.md). An independent check found that both TVSRC-001 and TVSRC-002 meet their requirements. `node quote.js` ran, and `git diff --check` passed.

The change is local and uncommitted. This checkout has no Git remote and cannot write Git metadata, so I could not publish it here. AGENTS.md requires your approval of each finished result: **do you approve both TVSRC-001 and TVSRC-002 results?**

