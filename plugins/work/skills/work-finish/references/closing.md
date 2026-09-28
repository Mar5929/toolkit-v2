# Closing a work item

The detail behind each `work-finish` step: the pull request and merge, a
merge with no remote, deployment, the requirements baseline, sub-items,
memory, leftover worktrees, Done, and cancel.

## Contents

1. Before anything ships
2. Commit, push, and the pull request (stage 12)
3. Merging
4. No remote: the local merge
5. Deployment (stage 13)
6. Requirements baseline (stage 14)
7. Sub-items
8. Memory and the current focus
9. Leftover worktrees and branches
10. Done
11. Cancel

## 1. Before anything ships

- The result approval is recorded (`toolkit work show <id>` shows
  `result_approved`), or the owner said "ship it" or "mark it done" after he
  saw the result, the gaps, and the evidence. Record that with his words
  (`approvals.md`, "Result approval").
- Never describe an unverified result as complete.
- Done means the owner accepted the result. Cancelled means the work stopped
  without it.
- Stages that do not apply are skipped. Work with no repository change has no
  pull request; work with no deployment has no deployment stage. A skipped
  stage gets one history note saying so, so `toolkit work finish` has a
  record of it.

## 2. Commit, push, and the pull request (stage 12)

- Commit the item's files on its branch, staged by name
  (`claude/<prefix>-<number>-<slug>`, for example `claude/wi-007-csv-export`).
  No `Co-Authored-By` line naming an AI and no "Generated with" line.
- Push the branch. Never force-push.
- Write the pull request title and description in plain words: what changed,
  why, how it was checked, and the item id. Run the description through the
  `unslop` skill, because other people read it. No line crediting an AI.
- Set the stage:
  `toolkit work set <id> --stage 12-pr-and-push`
- In Codex, every Git write here needs the owner's approval and escalated
  permissions (`git-rules.md`).

## 3. Merging

Merge only through `merge-and-clean-up`, and only when one of these holds:

- the owner said yes to this merge; or
- a standing merge instruction applies (`approvals.md`, "Standing merge
  instruction"): it is recorded in `DECISIONS.md`, an `acceptance-checker`
  that did not build the change found no blocking issue on that exact head
  commit, and every check passes.

A work item that says its merge needs the owner's approval overrides a
standing instruction. Without an independent check, the standing instruction
does not apply: ask the owner.

A merge that stops on a conflict: resolve it and commit with a message you
write (`git commit -m 'Merge <branch>: <what it brings>'`). Never
`git commit --no-edit`: it keeps Git's "# Conflicts:" lines in the message.

## 4. No remote: the local merge

`git remote` prints nothing: the project has no remote. There is no push and
no pull request, and `git fetch` is never run.

- [ ] The same approval as a merge applies (section 3).
- [ ] The merge-safety check (`git-rules.md`, "The merge-safety check"):
      list the files the merge brings in, and the primary checkout's
      uncommitted files. A file in both lists: stop, name exactly those
      files, and let the owner decide.
      `git diff --name-only <default branch>...<branch>`
      `git -C <primary checkout> status --porcelain`
- [ ] In the main checkout, on the default branch:
      `git merge --ff-only <branch>`
- [ ] The fast-forward fails when the default branch moved on after the
      item's branch was made (for example another item's local merge). Then,
      in the item's worktree: `git merge <default branch>`, run the item's
      checks again (under a standing merge instruction the
      `acceptance-checker` checks the new head), run the merge-safety check
      again, and run the fast-forward again.
- [ ] Set the stage anyway and record it, with the real name of the default
      branch in the note:
      `toolkit work set <id> --stage 12-pr-and-push`
      `toolkit work history <id> --note 'No remote: merged locally into <default branch>.' --effect 'No pull request; no deployment.'`

## 5. Deployment (stage 13)

Only when the result must be put somewhere beyond the default branch.

`toolkit work set <id> --stage 13-deployment`

Salesforce projects, in order:

- [ ] `sf-component-tracker` is current, and the item's folder
      `delivery/deployment/<work-item-id>-<short-name>/` holds its
      `package.xml`, `destructiveChanges.xml` when something is removed,
      `manual-steps.md`, and `DEPLOYMENT-RECORD.md`.
- [ ] `sf-deploy-check` finds nothing that would ship too early.
- [ ] A validate against the sandbox. It needs no yes, in both hosts.
- [ ] A sandbox deploy, when the item needs one: in Claude Code, only after
      the owner's yes for that deploy, in this chat.
- [ ] In Codex, the owner runs every sandbox deploy and sandbox data change,
      including `sf apex run` against a sandbox. Hand him the exact command
      with its `-o <sandbox>`; do not run it yourself, even after his yes.
- [ ] Run each `sf` command directly, never from a script or file you wrote,
      so the guard sees it (`salesforce-org-safety.md`).
- [ ] A DevOps Center pipeline deploy (`sf project deploy pipeline start`,
      `quick`, `resume`, or `validate`) goes to the owner: the command does
      not name the org it reaches, and that org can be production.
- [ ] A production deploy is handed to the owner: the exact command, what it
      deploys, and what to check afterwards. Agents never run it.
- [ ] Production data changes go through `sf-data-change`, which builds the
      owner's package. The owner runs it.
- [ ] A release of several items uses a copy of
      `delivery/deployment/release-cutover-template/`.

Record the owner's report of the deploy in a history note.

## 6. Requirements baseline (stage 14)

`toolkit work set <id> --stage 14-spec-update`

- The work item held the proposed requirements while the work was in
  progress. After delivery and approval, copy the delivered rules into the
  area's file in `requirements/`. Read `requirements/AGENTS.md` first.
- Each business area has one folder holding one maintained file. A new area:
  copy `requirements/system-area-template/` to a folder named for the area,
  then name the copied `AREA-TEMPLATE.md` for the area, for example
  `requirements/billing/BILLING.md`. Fill it as its guide says and delete the
  guide. Leave `system-area-template/` unchanged for the next area.
- Rules that apply across areas go in `requirements/SYSTEM-DATA-MODEL.md`.
- Copy only behavior that was delivered and approved. Behavior that was
  approved but not delivered is never written as shipped.
- Link the work item id from the area file when it explains a requirement,
  and add a line to its Change history. Do not copy task history there.
- When the change altered the verified structure of the system, also update
  the area's file in `system-guide/` (a new area is a copy of
  `system-guide/AREA-TEMPLATE.md` named for the area, for example
  `system-guide/billing.md`), with the observed facts and the date checked.
- Save these files with the `publish-docs` skill. It commits them from its own
  worktree and pushes them; with no remote it commits them on the default
  branch locally and says "No remote: committed locally".
- Confirm the item links to the requirements, decisions, and code that
  actually exist. Do not create missing documents only to complete a
  checklist.

## 7. Sub-items

- List the open sub-items before finishing a parent:
  `toolkit work list --tree`
- Each one is finished or cancelled on its own (with its own approval or
  reason), or moved when the owner asks (`work-organize`).
- A parent with open sub-items is finished only when the owner says so. Then
  `toolkit work finish` needs `--allow-open-sub-items` (without it the
  command refuses with exit code 2), and a history note quotes his words.
- Finishing a sub-item never finishes or approves its parent.
- Cancelling a parent: ask what happens to each open sub-item (cancel it,
  move it to the top level, or move it under another item). Never cancel
  them without asking.

## 8. Memory and the current focus

- At most one `event` memory through `memory-save`, only when the episode will
  matter later, for example a costly fix or a surprising platform limit.
- Take the item off the current focus "Now" list, replace a "Next session
  starts with" line that names it, and update the "Last updated" line
  (`current-focus.md`). The focus names work item ids, never their status.

## 9. Leftover worktrees and branches

- List the item's worktrees and branches, with its id prefix in lower case:
  `git worktree list`
  `git branch --list '*wi-007*'`
- Compare each with the default branch. Offer to remove the ones already
  delivered. Remove one only with the owner's yes, and never one that holds
  uncommitted work: `git worktree remove <folder>`, then
  `git branch -d <branch>`. A merged pull request's branch and worktree are
  removed by `merge-and-clean-up`.
- `git status` in the main checkout must show none of the item's files
  uncommitted.

## 10. Done

Run the Done checklist in `approvals.md` first. Then:

- Before the finish command: set each Roadmap phase the item completed to
  Done, and in Overview bring Related items up to date (which sub-items
  delivered what, and anything left to another item), set Current position to
  "Done on <date>: <evidence>", and set Blockers to "None.". A Done item that
  still names a deleted branch or a merge waiting for approval misleads the
  next reader.
- Also before the finish command: take the item off the current focus
  (section 8). The finish command makes the backup, and a focus changed after
  it is not in that backup until the next one. If the finish command
  refuses, put the item back on the focus.
- `toolkit work finish <id> --by <owner> --evidence '<what shows it works>'`.
  The evidence names the test result, the pull request or commit, or what
  the owner saw. The command sets Next action to "None. Finished." and Notes >
  Resume here to "Finished on <date>. Nothing to resume.", and prints a note
  when stages 12 to 14 left no record or a Roadmap phase is not Done. Answer
  each note it prints.
- The finish command then backs up `.work-items/` and `.memory/` (and
  Hindsight memory) to the owner's backup folder, and prints one line about
  it. Read that line:
  - "No automatic backup: this project keeps its work items and memory
    outside this computer ...": a Notion tracker with Notion memory. Nothing
    is copied; say so in one line when the owner set a backup folder.
  - "Backed up ... to <folder>": say it in one line in the reply.
  - "No backup folder is set ...": ask the owner for a folder outside the
    project, as the one question of the reply. After his answer:
    `toolkit config set backup.dir <folder>` (`none` when he wants no
    backup).
  - A line with "failed" or "Tell the owner": tell him that line as it is.
    The item is still Done; only the backup is missing.
- Repository work: say whether the work reached the default branch.
- Leave the folder or card where it is. Moving or archiving happens only on
  the owner's request, through `work-organize`.
- End the reply with the one question for the owner (the merge, the deploy, a
  leftover branch, the backup folder), or the exact words that continue
  ("Tell me the next thing to build.").

## 11. Cancel

- `toolkit work cancel <id> --reason '<his words>'`. The reason is his
  words, not a summary.
- Ask about each open sub-item first (section 7).
- Cancelling keeps the record. Nothing is deleted.
