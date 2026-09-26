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
2. Find the item: the id the owner named, or a title in the list that matches the request. Two possible matches: ask one question naming both. No match: it is new.
   `toolkit work show <id>`
   `toolkit work list`
3. Size a new request. A quick edit (one sitting, no choice for the owner, no behavior recorded in `requirements/`): do it and report it, with no item. "Later", "backlog", "park that": check the list for a duplicate, create the item, write the owner's words unchanged into Starting request, reply "Logged as WI-014 (bug, backlog). Not started." and stop. Anything else: create it the same way and continue.
   `toolkit work new --title "<title>" --type <type> --stage 01-discovery`
   `toolkit work edit <id> --section "Starting request" --set-file <file>`
4. A substantial goal whose item shows `delivery: not-offered`: open `work-delegate` first. Quick questions and small edits get no offer.
5. Route by where the item stands, using the item and the "Continue with" column of the lifecycle. Requirements not approved and type `build` or `data-load` (or the risk calls for it): `work-requirements`. More than one reasonable way to build it and no approved design: `solution-design`. Too big for one build: `work-organize`. Stages 09 to 11: `work-check`. Stages 12 to 14: `work-finish`. `waiting_on: owner`: ask that one question first (`work-decide`) and keep working on anything it does not block. Say the route in one line ("WI-012 is waiting for your OK on the requirements; opening work-requirements."). Never ask the owner which stage it is in.
   `toolkit work lifecycle`
6. Plan (stage 06): Roadmap phases `P1`, `P2` and tasks `P1-T01` (Work, Deliverable, Done when, Depends on) from the design's Order of work, in the format in `references/planning.md`. Tracking setup (stage 07) only when needed: the item's branch and worktree `wi-<number>-<slug>`; in a Salesforce project, the manifest folder through `sf-component-tracker`.
   `toolkit work set <id> --stage 06-implementation-plan`
   `toolkit work edit <id> --section Roadmap --set-file <file>`
   `toolkit work edit <id> --section Tasks --set-file <file>`
7. Build (stage 08) on the item's own branch and worktree. With a team recorded by `work-delegate`: one `builder` agent per independent task, one writer per path. Tests go with each task. Tick a task only with evidence. A task whose "Done when" names the owner is a question for him (step 8). Salesforce: `sf-component-tracker` on each metadata change; production data only through `sf-data-change`.
   `toolkit work set <id> --stage 08-build`
8. When the owner is needed: add an Open Questions row (next free `Q-` number) with "owner" as who decides, set the item waiting on the owner, keep working on tasks that do not depend on the answer, and tell him in one line. After his last answer, set it back to the agent (`../../references/conventions.md`, "Waiting on the owner").
   `toolkit work edit <id> --section "Open Questions" --append-row "| <next Q-id> | <question> | <affects> | Open | owner |"`
   `toolkit work set <id> --waiting-on owner`
9. Last task done: open `work-check`. This skill never records approvals, Done, merges, or deploys.
10. Before stopping with work unfinished: Overview (Current position, Next action) and Notes > Resume here are current, one history note says what changed, and validation is clean.
   `toolkit work history <id> --note "<what changed>"`
   `toolkit work validate <id>`

## Agents

- `builder`: one per independent build task, only when `work-delegate` recorded a team or the owner agreed to one. The main agent merges each builder's branch into the item's branch, then ticks the task.
- `researcher`: one per unknown found while planning or building.
- `acceptance-checker`: a plan check after step 6, before the build, when the plan has several builders, parallel tasks, or a shared environment. Paste in the requirements, the design's Order of work, the Roadmap, and the Tasks, and ask for a plan check.
- How to brief them: `../../references/helpers.md`.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker. With no worker, do the work yourself and say that no independent check ran.

## Sizing a request

- **Quick edit, no item:** one sitting, no decision for the owner, and it does not change behavior recorded in `requirements/`. Examples: fix a typo, rename a variable, answer a question. Report what changed in one line.
- **Log only:** the owner says "later", "backlog", "park that", "not now", or "log a bug". Create the item at `01-discovery`, fill Starting request with his exact words, and stop. Do not start the work.
- **Work item:** everything else. A request that grows past a quick edit while you work on it becomes an item then, with the owner's words as the Starting request.
- Types: pick the closest from the lifecycle's type list. `build` and `data-load` need approved requirements before stage 03 is passed; the CLI refuses otherwise.

## Routing notes

- The lifecycle's "Continue with" column is the default. The item's real state decides: for example, a `task` type item with no open choices can skip requirements approval and go straight to planning, with the reason in a history note.
- Stages may be skipped, repeated, or revisited. Record a short reason when a move is not obvious.
- A worktree whose branch is named `wi-<number>-<slug>` belongs to that item. The briefing says so. Work on that item there.
- Several items at once: recommend what can proceed independently, what depends on another outcome, and which decision would unblock the most work. See `references/planning.md`.

## Never

- Never record an approval, Done, or a cancel here. Those belong to `work-requirements`, `solution-design`, `work-check`, `work-decide`, and `work-finish`.
- Never merge, deploy, or write production data.
- Never create a second tracker or a local copy of items kept in Notion, GitHub, or Jira.
