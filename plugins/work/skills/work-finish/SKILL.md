---
name: work-finish
description: 'Ships and closes a work item after the owner approves the result: pull request, merge, deployment, requirements baseline update, and Done; or cancels it with a reason. Use when the owner says "ship it", "deploy it", "close it out", "mark it done", "cancel it", or "drop it".'
---

# Work finish

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. Detail: `references/closing.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Check that the result approval is recorded. Not recorded: show the result, the gaps, and the evidence, and ask. "Ship it" or "mark it done" from the owner after he has seen the result counts as the approval; record it with his words.
   `toolkit work show <id>`
   `toolkit work approve <id> --result --by <owner>`
2. Repository work: push the item's branch, open the pull request (description through `unslop`, no AI credit), and set the pull request stage. Merge through `merge-and-clean-up` when the owner approves the merge, or when the project has a recorded standing merge instruction and the `acceptance-checker` agent found no blocking issue on that exact head.
   `toolkit work set <id> --stage 12-pr-and-push`
3. Deployment, when the item needs one: set the deployment stage. Salesforce: `sf-component-tracker` current, then `sf-deploy-check`, then validate against the sandbox. Production deploys and production data loads are handed to the owner to run (`sf-data-change`).
   `toolkit work set <id> --stage 13-deployment`
4. Requirements baseline: set the spec update stage; copy only delivered and approved behavior into `requirements/<area>.md`; save it with `publish-docs`.
   `toolkit work set <id> --stage 14-spec-update`
5. Sub-items: list the open ones. Each is finished or cancelled on its own (with its own approval or reason), or moved when the owner asks (`work-organize`). A parent with open sub-items is finished only when the owner says so, with the second finish command in step 7. Finishing a sub-item never finishes its parent.
   `toolkit work list --tree`
6. Memory: at most one `event` record through `memory-save`, only when the episode will matter later.
7. Mark it Done with what shows it works, and say whether the work reached the default branch. The second command is only for a parent the owner said is done while sub-items are still open; quote his words in a history note. Take the item off the current focus "Now" list (read it, remove the line, write it back).
   `toolkit work finish <id> --by <owner> --evidence "<what shows it works>"`
   `toolkit work finish <id> --by <owner> --evidence "<what shows it works>" --allow-open-sub-items`
   `toolkit memory focus`
   `toolkit memory focus --set-file <file>`
8. Cancel: use the owner's words as the reason, and ask what happens to its open sub-items.
   `toolkit work cancel <id> --reason "<owner's words>"`
9. Do not move or archive the folder unless the owner asks (`work-organize`).

## Agents

- `acceptance-checker`: the independent check of the exact head before a merge under a standing merge instruction. Brief it as `work-check` does, and name the commit.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker. With no worker, do the work yourself and say that no independent check ran. Without an independent check, a standing merge instruction does not apply: ask the owner.

## Rules

- Never mark Done without a recorded result approval. The CLI requires `--by`.
- Approval of the result never covers merge, deployment, spending, or publishing. Each needs the owner's yes or a standing instruction recorded in the project.
- Agents never run production deploys or production data loads. Hand the owner the exact command and what to check afterwards; record his report in a history note.
- Only delivered and approved behavior goes into `requirements/<area>.md`. Approved but undelivered behavior is never written there as shipped.
- Stages that do not apply are skipped: work with no repository change has no pull request; work with no deployment has no deployment stage.
- No AI credit in commits, pull requests, or release notes.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Close the issue as completed, or as not planned for a cancel, as `../../references/trackers.md` says.
