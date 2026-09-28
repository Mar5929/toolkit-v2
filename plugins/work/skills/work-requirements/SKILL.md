---
name: work-requirements
description: 'Interviews the owner one question at a time, writes a work item''s requirements (R-01, R-02), checks them, and asks for his approval. Use when an item''s requirements are missing or the owner changes, adds, or drops one at any stage, or says "grill me", "ask me questions", or "check the spec".'
---

# Work requirements

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Interviews the owner and writes what the result must do, never how to build it; every answer lands in the work item. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. Find the item as `work-on` does; none exists, create it with his words as the Starting request. Requirements already approved and no change asked: open the skill the item's "Continue with" names and stop.
   `toolkit work show <id>`
   `toolkit work new --title '<title>' --type <type> --stage 01-discovery`
   `toolkit work edit <id> --section 'Starting request' --text '<his exact words>'`
2. Move it to refinement once requirements are being written. Before the first question, read the item and what the project already knows (`references/interview.md`, section 2).
   `toolkit work set <id> --stage 02-refinement`
   `toolkit memory find '<topic>'`
3. Restate the goal in one sentence ("So the goal is X?"). Write the Agreed goal after a yes, and always before asking for approval.
   `toolkit work edit <id> --section 'Agreed goal' --text '<goal>'`
4. Ask one question at a time, most basic first, each with a recommended answer and a short reason (`references/interview.md`, sections 3 and 4).
5. Save each answer before the next question: `R-xx` blocks and the Acceptance list in the format in `references/requirement-format.md`; anything unanswered as an Open Questions row, with the item waiting on the owner while one of his is open.
   `toolkit work edit <id> --section 'Active requirements' --set-file <file>`
   `toolkit work edit <id> --section 'Open Questions' --append-row '| <next Q-id> | <question> | R-02 | Open | owner |'`
   `toolkit work set <id> --waiting-on owner`
6. A change to an approved requirement: edit the `R-xx`, keep the old wording in its Decision record, set it back to Refining, move the item to refinement, and say what the change affects when the item is past stage 03 (`references/interview.md`, section 7).
   `toolkit work set <id> --stage 02-refinement`
7. Spec check, before asking for approval and whenever the owner says "check the spec": brief the `requirements-analyst` and handle its findings (`references/spec-check.md`).
8. Ask for approval and record his yes with the requirements checklist in `references/approvals.md`, section 2. Then a `build` or `data-load` item goes to `solution-design`, unless he agreed to skip the design.
   `toolkit work approve <id> --requirements --by <owner>`
9. Lead with "Not saved" on a failed write. Validate, update the current focus when the next step changed (`references/current-focus.md`), and hand back to `work-on` unless the owner stops. End with the one question or the exact words that continue.
   `toolkit work validate <id>`

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- Ask in the reply text, never through a question tool. "Grill me" or "ask me questions" means one question at a time, never a batch.
- Build ideas never go into requirements: they go under Notes > Solution options and considerations.
- The CLI refuses the approval while the Agreed goal still holds the template text.
- Local and Notion trackers: never write the Requirements "Overall status" line; the approve command sets it. GitHub Issues and Jira have no approve command, so there the agent writes it after his yes.
- A change to an approved `R-xx` sends the item back to refinement and needs approval again.
- The spec check changes nothing without the owner's yes.
- "Give me options first" is not a requirements approval: go to `solution-design` with the open choices kept visible.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Edit the issue's Requirements section as `references/tracker-github.md` or `references/tracker-jira.md` says.

## Agents

- `requirements-analyst` (`references/agent-requirements-analyst.md`): the spec check in step 7. The brief is in `references/spec-check.md`.
- `researcher` (`references/agent-researcher.md`): one per fact the owner cannot answer (a platform limit, what the existing build does).
- Brief them as `references/helpers.md` says.
- Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran.

## References

| File | Open it when |
| --- | --- |
| [references/interview.md](references/interview.md) | Steps 2 to 6: what to read first, how to ask, "grill me", resuming, corrections |
| [references/requirement-format.md](references/requirement-format.md) | Step 5: writing an `R-xx` block or the Acceptance list |
| [references/spec-check.md](references/spec-check.md) | Step 7: the analyst's brief and handling its findings |
| [references/approvals.md](references/approvals.md) | Step 8: the requirements approval checklist; what counts as a yes |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | Where each answer goes; history notes; `waiting_on`; a failed save |
| [references/work-item-format.md](references/work-item-format.md) | Before any section edit or table row |
| [references/current-focus.md](references/current-focus.md) | Step 9: the item's next step changed |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/helpers.md](references/helpers.md) | Before starting any agent |
| [references/agent-requirements-analyst.md](references/agent-requirements-analyst.md), [references/agent-researcher.md](references/agent-researcher.md) | Codex only: the text to give the worker |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`, or a command prints a Notion error |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
| [assets/WORK-ITEM.md](assets/WORK-ITEM.md) | GitHub or Jira: the body of a new issue |
