---
name: work-finish
description: 'Ships and closes an approved work item (pull request, merge, deployment, requirements update, Done) after an independent check, or cancels one with the owner''s reason, so nothing ships unchecked or unapproved. Use when the owner says "ship it", "deploy it", "close it out", or "mark it done", or asks to cancel or drop an item.'
---

# Work finish

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Takes an approved item through the pull request, merge, deployment, and requirements update to Done, or cancels it; it never marks Done without the owner's approval and never runs a production deploy. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. Check the result approval is recorded. Not recorded: when the history shows no `acceptance-checker` check of this result since its last build, run `work-check` first, which starts it (it runs whoever built the change; the result approval and the finish are refused without it). Then show the result, the gaps, and the evidence, and ask. "Ship it" or "mark it done" after he saw the result counts: save his words first, then record it (`references/approvals.md`, section 4). Each sub-item needs its own.
   `toolkit work show <id>`
   `toolkit work history <id> --note 'Owner said: <quote>' --effect 'Result approved; work-finish continues.'`
   `toolkit work approve <id> --result --by <owner>`
2. Repository work: commit the item's files by name on its branch, push it, open the pull request, and set the stage (`references/closing.md`, section 2; `references/git-rules.md` before any Git write).
   `toolkit work set <id> --stage 12-pr-and-push`
3. Merge through `merge-and-clean-up` only with the owner's yes to this merge, or a standing merge instruction with an independent check on the exact head (`references/closing.md`, section 3). No remote: the local merge (`references/closing.md`, section 4), then this note.
   `toolkit work history <id> --note 'No remote: merged locally into <default branch>.' --effect 'No pull request; no deployment.'`
4. Deployment, when the item needs one (`references/closing.md`, section 5). Production deploys and production data loads are the owner's to run. Salesforce: a sandbox validate runs; a sandbox deploy needs his yes for that deploy, and in Codex he runs every sandbox deploy and sandbox data change himself, so give him the exact command with its `-o <sandbox>`. Run each `sf` command directly, never from a script. A Salesforce release of several items gets a cutover plan and release notes (`assets/CUTOVER-PLAN.md`, `assets/RELEASE-NOTES.md`).
   `toolkit work set <id> --stage 13-deployment`
5. Requirements baseline: copy only delivered and approved behavior into the area's file in `requirements/`, update `system-guide/` when the structure changed, and save both with `publish-docs` (`references/closing.md`, section 6). A new area starts from the area templates (`assets/requirements-area-template.md`, `assets/system-guide-area-template.md`).
   `toolkit work set <id> --stage 14-spec-update`
6. Sub-items: list the open ones; each is finished, cancelled, or moved on its own (`references/closing.md`, section 7).
   `toolkit work list --tree`
7. Memory: at most one `event` record through `memory-save`, only when the episode will matter later.
8. Before Done, run the Done checklist in `references/approvals.md`, section 5, with the Overview and Roadmap updates and the leftover worktrees in `references/closing.md`, sections 9 and 10. Take the item off the current focus now, before the finish command, so the backup it makes holds the new focus (`references/current-focus.md`); if the finish refuses, put the item back. Then mark it Done. The command also backs up the tracker and memory: read its backup line. "No backup folder is set" or a line with "failed" goes to the owner as a question (`references/closing.md`, section 10).
   `toolkit work finish <id> --by <owner> --evidence '<what shows it works>'`
9. Say whether the work reached the default branch. End with the one question (the merge, the deploy, a leftover branch, the backup folder) or "Tell me the next thing to build."
10. Cancel instead: the owner's words are the reason; ask about each open sub-item first (`references/approvals.md`, section 6).
    `toolkit work cancel <id> --reason '<his words>'`

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- Never mark Done without a recorded result approval or the owner's quoted words. The CLI needs `--by`, and `--quote` when no result approval is recorded.
- Never mark Done while the item's changes, or its `requirements/` and `system-guide/` updates, are uncommitted.
- A result approval never covers merge, deployment, spending, or publishing. Each needs the owner's yes or a standing instruction recorded in `DECISIONS.md`.
- A standing merge instruction needs an `acceptance-checker` that did not build the change to find no blocking issue on that exact head. Without that check, ask the owner.
- Agents never run a production deploy or a production data load. Hand the owner the exact command and what to check afterwards; record his report in a history note.
- In Codex, every Git write needs the owner's approval and escalated permissions (`references/git-rules.md`). No remote: never run `git fetch` or `git push`.
- No AI credit in commits, pull requests, or release notes. The pull request description goes through `unslop`.
- Stages that do not apply are skipped, each with one history note saying so.
- Leave the folder or card where it is. Moving or archiving is `work-organize`'s, on the owner's request.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Close the issue as completed, or as not planned for a cancel (`references/tracker-github.md` or `references/tracker-jira.md`).

## Agents

- `acceptance-checker` (`references/agent-acceptance-checker.md`): the independent check of the exact head before a merge under a standing merge instruction. Brief it as `work-check` does and name the commit (`references/helpers.md`).
- Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. Only when this host cannot start a worker (no `spawn_agent` tool) do the work yourself, and say that no independent check ran. The `acceptance-checker` still runs when the owner chose owner-led delivery or no agent team. Without an independent check, a standing merge instruction does not apply: ask the owner.

## References

| File | Open it when |
| --- | --- |
| [references/closing.md](references/closing.md) | Steps 2 to 9: the pull request, merging, no remote, deployment, the requirements baseline, sub-items, leftover worktrees, Done |
| [assets/requirements-area-template.md](assets/requirements-area-template.md) | Step 5: a new business area in `requirements/` and the project has no `requirements/system-area-template/` |
| [assets/system-guide-area-template.md](assets/system-guide-area-template.md) | Step 5: a new area in `system-guide/` and the project has no `system-guide/AREA-TEMPLATE.md` |
| [assets/CUTOVER-PLAN.md](assets/CUTOVER-PLAN.md), [assets/RELEASE-NOTES.md](assets/RELEASE-NOTES.md) | Step 4: a Salesforce release of several items and the project has no `delivery/deployment/release-cutover-template/` |
| [references/approvals.md](references/approvals.md) | Step 1 (result approval), step 8 (Done checklist), step 10 (cancel), and the standing merge instruction |
| [references/git-rules.md](references/git-rules.md) | Before any commit, push, merge, or worktree removal, and every Git write in Codex |
| [references/helpers.md](references/helpers.md) | Before starting the checker |
| [references/agent-acceptance-checker.md](references/agent-acceptance-checker.md) | Codex only: the text to give the worker |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | The owner answers; history notes; a failed save |
| [references/work-item-format.md](references/work-item-format.md) | Before editing Overview or the Roadmap |
| [references/current-focus.md](references/current-focus.md) | Step 8: taking the item off the focus |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/tracker-local.md](references/tracker-local.md) | `tracker.type` is `local` |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion` |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
