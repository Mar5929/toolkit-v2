---
name: work-on
description: 'Starts, resumes, or logs a work item and builds it, so every change is tracked and work picks up where it stopped. Use whenever the owner asks to build, add, fix, or change something, names an item id to resume, says "keep going", or wants a bug or idea logged ("put it in the backlog"). Not for requirement edits (work-requirements) or handovers (work-delegate).'
---

# Work on

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Starts or resumes one work item, plans it, and builds it; it never records an approval, Done, a merge, or a deploy. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. No project briefing in this conversation: run the briefing. Exit code 4: open `project-setup` and stop. Tell the owner each change listed under "Changes found in the tracker", one line each in the CLI's words, before other work.
   `toolkit brief`
2. A bare "ok", "yes", or "looks good" when this chat asked him nothing: start no work and ask what he wants. Otherwise find the item: the id he named, this worktree's item, or a title that matches. Two matches: ask one question naming both.
   `toolkit work list`
   `toolkit work show <id>`
3. No item yet: size the request as a quick edit, log only, or a work item, and pick the type (`references/sizing-and-routing.md`, sections 1 to 3). He asks to be asked first ("ask me questions", "grill me"): open `work-requirements`, which creates the item, and ask nothing here. Otherwise title a new item in his words, say the title in one line, and save his exact words as the Starting request. Log only: reply "Logged as WI-014 (bug, backlog). Not started." and stop.
   `toolkit work new --title '<title>' --type <type> --stage 01-discovery`
   `toolkit work edit <id> --section 'Starting request' --text '<his exact words>'`
4. Route by where the item stands: go down the table in `references/sizing-and-routing.md`, section 4, take the first row that matches, and say the route in one line. The owner's decisions come first (`waiting_on: owner` opens `work-decide`). Then the delivery offer: the agent to-do "Make the agent-led delivery offer" for this item, or "you drive", opens `work-delegate`, and nothing is built until he answers. Stay here only for planning and building.
   `toolkit work lifecycle`
5. Plan (stage 06): Roadmap phases and Tasks from the design's Build and verification plan (the design's sections: `assets/DESIGN.md`), in the formats in `references/planning.md` (sections 1 to 4).
   `toolkit work set <id> --stage 06-implementation-plan`
   `toolkit work edit <id> --section Roadmap --set-file <file>`
   `toolkit work edit <id> --section Tasks --set-file <file>`
6. Tracking setup (stage 07) when the item changes committed files: its own worktree and branch, with the names the show command prints (`references/git-rules.md` before any Git write).
   `toolkit work set <id> --stage 07-tracking-setup`
7. Build (stage 08) task by task on the item's branch. Tick a task only with evidence (`references/planning.md`, sections 6 and 7).
   `toolkit work set <id> --stage 08-build`
8. The owner is needed: add an Open Questions row, set the item waiting on him, keep working on what the answer does not block, and ask in the reply (`references/recording-owner-answers.md`).
   `toolkit work edit <id> --section 'Open Questions' --append-row '| <next Q-id> | <question> | <affects> | Open | owner |'`
   `toolkit work set <id> --waiting-on owner`
9. Last task done: open `work-check`. Stopping with work unfinished: run the checklist in `references/planning.md`, section 8, and end with the one question or the exact words that continue. The final reply repeats every tracker change of this session in the CLI's words: each "Changes found in the tracker" line from step 1, and each "Tell the owner in the reply" line a command printed (a new title, a renamed folder).
   `toolkit work history <id> --note '<what changed>'`
   `toolkit work validate <id>`

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- Setup steps are never work items. They go in the reply, and only a step the doctor command checks also goes in the current focus.
- A deliverable the owner named without its content ("write a short project brief") gets `Q-01` and a question. Never invent the content.
- A change to product behavior, Salesforce metadata, or anything bound for production is `build` (data changes: `data-load`), never `task`, even when it looks small.
- "Ask me questions first" means `work-requirements`, which creates the item. Never ask a batch of questions here.
- Build only on the item's own branch and worktree, never on the default branch. No remote (`git remote` prints nothing): never run `git fetch`.
- A task whose "Done when" names the owner is his question, never ticked by the agent.
- Salesforce: `sf-component-tracker` after each metadata change; production data only through `sf-data-change`. Run each `sf` command directly, never from a script or file you wrote, so the guard sees it. A sandbox deploy or sandbox data change needs the owner's yes for that change; in Codex he runs it himself, so hand him the exact command with its `-o <sandbox>`.

## Agents

- `builder` (`references/agent-builder.md`): one per independent build task, only when `work-delegate` recorded a team or the owner agreed. The main agent merges each builder's branch into the item's branch, then ticks the task. In Codex the main agent first makes each builder's worktree (`references/helpers.md`, section 2, "Codex builders").
- `researcher` (`references/agent-researcher.md`): one per unknown found while planning or building.
- `acceptance-checker` (`references/agent-acceptance-checker.md`): a plan check after step 5 when the plan has several builders, parallel tasks, or a shared environment. Paste in the requirements, the design's Build and verification plan, the Roadmap, and the Tasks.
- Brief them as `references/helpers.md` says; size a team with `references/team-roles.md`.
- Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. Only when this host cannot start a worker (no `spawn_agent` tool) do the work yourself, and say that no independent check ran. The `acceptance-checker` still runs when the owner chose owner-led delivery or no agent team.

## References

| File | Open it when |
| --- | --- |
| [references/sizing-and-routing.md](references/sizing-and-routing.md) | Step 3 (a new request, its size and type) and step 4 (which skill continues the item) |
| [references/planning.md](references/planning.md) | Steps 5 to 7, and before stopping with work unfinished |
| [references/work-item-format.md](references/work-item-format.md) | Before any section edit or table row: section names, header fields, the read-change-write sequence |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | The owner answers or must be asked; a history note; a failed save |
| [references/current-focus.md](references/current-focus.md) | The item's stage or next step changed (step 9) |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before the first `toolkit` command that carries text, and on any exit code other than 0 |
| [references/git-rules.md](references/git-rules.md) | Steps 6 and 7: the worktree, commits, and Git writes in Codex |
| [references/helpers.md](references/helpers.md) | Before starting any agent; in Codex, section 2 before each builder |
| [references/team-roles.md](references/team-roles.md) | Step 7: sizing a build team |
| [references/agent-builder.md](references/agent-builder.md), [references/agent-researcher.md](references/agent-researcher.md), [references/agent-acceptance-checker.md](references/agent-acceptance-checker.md) | Codex only: the text to give the worker |
| [references/tracker-local.md](references/tracker-local.md) | `tracker.type` is `local`: folders, hand moves, the dashboard |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`: the board, cards the owner changed |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
| [assets/WORK-ITEM.md](assets/WORK-ITEM.md) | GitHub or Jira: the body of a new issue |
| [assets/DESIGN.md](assets/DESIGN.md) | Step 5: the design's sections, to find its Build and verification plan and the chosen option's Build order; a design that does not work (its Notes) |
