---
name: work-finish
description: 'Ships and closes an approved work item (pull request, merge, sandbox or production deployment, requirements update, Done), or cancels an item with the owner''s reason. Use when the owner says "ship it", "deploy it", "close it out", or "mark it done", or asks to cancel or drop an item.'
---

# Work finish

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: the work plugin's `references/conventions.md`, two folders above this skill's folder (`../../references/conventions.md`). Detail: this skill's `references/closing.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line, in both hosts: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). Text (conventions, "Text in a command"): one-line values (`--note`, `--effect`, `--append-row`, `--title`) go in single quotes, with an apostrophe written `'\''`, because double quotes run backticks and `$(...)`; section and design text goes on standard input in Claude Code (`<file>` is `-`, followed by a quoted heredoc, `<<'EOF'`), and in Codex in `--text '<text>'` or a file in a new `mktemp -d` folder, deleted right after the command. Never change a record with a script. Ask the owner in the reply text, never through a question tool. No remote (`git remote` prints nothing): never run `git fetch`, and never report a fetch refusal as a blocker.

## Steps

1. Check that the result approval is recorded. Not recorded: show the result, the gaps, and the evidence, and ask. "Ship it" or "mark it done" from the owner after he has seen the result counts as the approval; record it with his words. Each sub-item needs its own result approval: the owner's approval of the parent does not cover it.
   `toolkit work show <id>`
   `toolkit work approve <id> --result --by <owner>`
   `toolkit work history <id> --note 'Owner'\''s words: <quote>' --effect 'Result approved; work-finish continues.'`
2. Repository work: commit the item's files by name on its branch (no `Co-Authored-By` line naming an AI and no "Generated with" line), push it, open the pull request (description through `unslop`, no AI credit), and set the pull request stage. Merge through `merge-and-clean-up` when the owner approves the merge, or when `DECISIONS.md` records a standing merge instruction and the `acceptance-checker` agent found no blocking issue on that exact head. With no remote, a local merge (`git merge --ff-only <branch>` in the main checkout) follows the same approval: still set the pull request stage, and say "No remote: merged locally into <branch>." in a history note. The fast-forward fails when the default branch moved on after the item's branch was made (for example another item's local merge): merge the default branch into the item's branch in its worktree (`git merge <default-branch>`), run the item's checks again (under a standing merge instruction the `acceptance-checker` checks the new head), then run the fast-forward again. A merge that stops on a conflict is committed with a message you write, never `git commit --no-edit` (it keeps the "# Conflicts:" lines). In Codex, `git add`, `git commit`, `git merge`, `git push`, `git worktree remove`, and `git branch -d` need the owner's approval and escalated permissions (`sandbox_permissions` set to `require_escalated`, with a one-line reason), because the sandbox keeps `.git/` read-only: say in one line what each does before Codex asks. Refused without asking: show him the exact command and ask him to approve it or run it in a terminal.
   `toolkit work set <id> --stage 12-pr-and-push`
   `toolkit work history <id> --note 'No remote: merged locally into main.' --effect 'No pull request; no deployment.'`
3. Deployment, when the item needs one: set the deployment stage. Salesforce: `sf-component-tracker` current and the item's folder in `delivery/deployment/` complete, then `sf-deploy-check`, then validate against the sandbox. Production deploys and production data loads are handed to the owner to run (`sf-data-change`).
   `toolkit work set <id> --stage 13-deployment`
4. Requirements baseline: set the spec update stage; read `requirements/AGENTS.md`; copy only delivered and approved behavior into the business area's one file in `requirements/`. A new area: copy `requirements/system-area-template/` to a folder named for the area and rename the copied `AREA-TEMPLATE.md` for it (for example `requirements/billing/BILLING.md`), so every area has the same layout; leave `system-area-template/` unchanged. Update the area's file in `system-guide/` when the verified structure changed (a new one is a copy of `system-guide/AREA-TEMPLATE.md` named for the area, for example `system-guide/billing.md`). Save both with `publish-docs`; with no remote it commits them on the default branch locally.
   `toolkit work set <id> --stage 14-spec-update`
5. Sub-items: list the open ones. Each is finished or cancelled on its own (with its own approval or reason), or moved when the owner asks (`work-organize`). A parent with open sub-items is finished only when the owner says so, with the `--allow-open-sub-items` finish command in step 8. Finishing a sub-item never finishes its parent.
   `toolkit work list --tree`
6. Memory: at most one `event` record through `memory-save`, only when the episode will matter later.
7. Before Done, check the item's files: every change the item made, including the `requirements/` and `system-guide/` updates from step 4, is committed and reached the default branch (or the owner said to leave it on the branch). `git status` in the main checkout shows none of them uncommitted. List the item's leftover worktrees and branches (`git worktree list`, `git branch --list '*<prefix>-<number>*'` with the item's id prefix in lower case, for example `'*wi-007*'`), compare each with the default branch, and offer to remove the ones already delivered; remove one only with the owner's yes, and never one that holds uncommitted work.
8. First set each finished Roadmap phase to Done, and in Overview bring Related items up to date (which sub-items delivered what), set Current position to "Done on <date>: <what shows it works>", and set Blockers to "None." (a blocker about a merge or branch that is now finished is stale). Then mark it Done with what shows it works (the command also closes Next action and Notes > Resume here, and says what still needs a note), and say whether the work reached the default branch. The second command is only for a result approval not yet recorded: `--quote` takes the owner's exact words approving the result. The third is only for a parent the owner said is done while sub-items are still open; quote his words in a history note. Take the item off the current focus "Now" list and out of "Next session starts with" (`../../references/conventions.md`, "The current focus").
   `toolkit work finish <id> --by <owner> --evidence '<what shows it works>'`
   `toolkit work finish <id> --by <owner> --evidence '<what shows it works>' --quote '<his exact words>'`
   `toolkit work finish <id> --by <owner> --evidence '<what shows it works>' --allow-open-sub-items`
   `toolkit memory focus --json`
   `toolkit memory focus --set-file <file> --expect <version>`
9. Cancel: use the owner's words as the reason, and ask what happens to its open sub-items.
   `toolkit work cancel <id> --reason '<his words>'`
10. Do not move or archive the folder unless the owner asks (`work-organize`). End the reply with the one question for the owner (the merge, the deploy, a leftover branch), or the exact words that continue ("Tell me the next thing to build.").

## Agents

- `acceptance-checker`: the independent check of the exact head before a merge under a standing merge instruction. Brief it as `work-check` does, and name the commit.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran. Without an independent check, a standing merge instruction does not apply: ask the owner.

## Rules

- Never mark Done without a recorded result approval or the owner's quoted words. The CLI requires `--by`, and `--quote` when no result approval is recorded.
- Never mark Done while the item's changes, or the requirements and system guide updates it made, are uncommitted.
- Approval of the result never covers merge, deployment, spending, or publishing. Each needs the owner's yes or a standing instruction recorded in the project.
- Agents never run production deploys or production data loads. Hand the owner the exact command and what to check afterwards; record his report in a history note.
- Only delivered and approved behavior goes into the area's file in `requirements/`. Approved but undelivered behavior is never written there as shipped.
- Stages that do not apply are skipped: work with no repository change has no pull request; work with no deployment has no deployment stage.
- No AI credit in commits, pull requests, or release notes.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Close the issue as completed, or as not planned for a cancel, as `../../references/trackers.md` says.
