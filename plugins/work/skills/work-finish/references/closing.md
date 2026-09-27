# Closing a work item

Detail for `work-finish`. Carried over from Toolkit V1's "Finish or
cancel" rules and its "Closing a work item" checklist, with V2 homes.

## Before Done

- Give the owner a short result, the known gaps, and the evidence, and ask
  for approval. A clear earlier approval of that same result counts.
- Never describe an unverified result as complete.
- Done means the owner accepted the result. Cancelled means the work stopped
  without it.

## The pull request (stage 12)

- Push the item's branch (`wi-<number>-<slug>`). Never force-push.
- Write the pull request title and description in plain words: what changed,
  why, how it was checked, and the item id. Run the description through the
  `unslop` skill, because it is read by other people. No line crediting an AI.
- Merge only through `merge-and-clean-up`, and only when one of these holds:
  - the owner said yes to this merge; or
  - `DECISIONS.md` records a standing merge instruction from the owner (the
    project's `AGENTS.md` names it there), and an `acceptance-checker` that
    did not build the change reported no blocking issue on that exact head
    commit, and every check passes. `merge-and-clean-up` step 2 checks the
    same record.
- A work item that says its merge needs the owner's approval overrides a
  standing instruction.

## Deployment (stage 13)

- Only when the result must be put somewhere beyond the default branch.
- Salesforce projects, in order: `sf-component-tracker` is current and the
  item's folder `delivery/deployment/<work-item-id>-<short-name>/` holds its
  `package.xml`, `destructiveChanges.xml` when something is removed,
  `manual-steps.md`, and `DEPLOYMENT-RECORD.md`; `sf-deploy-check` finds
  nothing that would ship too early; then a validate against the sandbox. A
  production deploy is handed to the owner: the exact command, what it
  deploys, and what to check afterwards. A release of several items uses a
  copy of `delivery/deployment/release-cutover-template/`.
- Production data changes go through `sf-data-change`, which builds the
  owner's package. The owner runs it.
- Record the owner's report of the deploy in a history note.

## Requirements baseline (stage 14)

- The work item holds the proposed requirements while the work is in
  progress. After delivery and approval, copy the delivered rules into the
  area's file in `requirements/`. Read `requirements/AGENTS.md` first. A new
  area starts as a copy of `requirements/system-area-template/`, with the
  folder and the file renamed for the business area, as the template's
  fill-in guide says. Rules that apply across areas go in
  `requirements/SYSTEM-DATA-MODEL.md`.
- Copy only behavior that was delivered and approved. Behavior that was
  approved but not delivered is never written as shipped.
- Link the work item id from the area file when it explains a requirement,
  and add a line to its Change history. Do not copy task history there.
- When the change altered the verified structure of the current system, also
  update the area's file in `system-guide/` (a new area starts from
  `system-guide/AREA-TEMPLATE.md`), with the observed facts and the date
  checked.
- Save these files with the `publish-docs` skill (it commits and pushes the
  documents from its own worktree).
- Confirm the item links to the requirements, decisions, and code that
  actually exist. Do not create missing documents just to complete a
  checklist.

## Sub-items

- List the open sub-items before finishing a parent. Each one is finished or
  cancelled on its own (with its own approval or reason), or moved when the
  owner asks. A parent with open sub-items is finished only when the owner
  says so: then `toolkit work finish` needs `--allow-open-sub-items`
  (without it the command refuses with exit code 2), and a history note
  quotes his words.
- Finishing a sub-item never finishes or approves its parent.
- Cancelling a parent: ask what happens to each open sub-item (cancel it,
  move it to the top level, or move it under another item). Never cancel them
  without asking.

## Memory

- At most one `event` record through `memory-save`, only when the episode
  will matter later, for example a costly fix or a surprising platform limit.
- Take the item off the current focus "Now" list and update its "Last
  updated" line. The focus holds work item ids only, never their status.

## Done

- `toolkit work finish <id> --by <owner> --evidence "<what shows it works>"`.
  The evidence names the test result, the pull request or commit, or what the
  owner saw.
- Repository work: say whether the work reached the default branch.
- Leave the folder where it is. Moving or archiving happens only on the
  owner's request, through `work-organize`.

## Cancel

- `toolkit work cancel <id> --reason "<owner's words>"`. The reason is his
  words, not a summary.
- Cancelling keeps the record. Nothing is deleted.
