---
name: work-finish
description: 'Ships and closes a whole work item whose result the owner approved (merge, deployment, specification update), or cancels any item, and asks him before marking it Done, so nothing merges, deploys, or closes without his yes. Use when he says "ship it", "merge it", "mark it done", or "cancel WI-031". Not for testing a build; use work-check. Not for a task''s status; use the work track skill.'
---

# Work finish

Takes a work item whose result the owner approved through stages 12 to 14
(pull request, deployment, specification update) to Done, or cancels it.
The project's work track skill reads the item and writes every change to it
(`AGENTS.md` names it under "Skills"). Every question
is a Questions and Answers row with `waiting_on: owner` and the Next action
in the waiting form (`.claude/rules/keep-work-item-current.md`).

Read first: the item by its ID, every routing field included; `PROJECT.md`
(the owner's name, tracker, memory system, Salesforce org aliases); and
`.claude/rules/owner-preferences.md` for a standing merge instruction.

## Steps

1. **Result approval.** `result_approved` is set, and Recent History names
   the independent checker's verdict on a commit that equals the branch's
   head (`git -C <item worktree> rev-parse HEAD`). Not set, but `work-check`
   already showed him the result, the gaps, and the evidence: his go-ahead to
   ship or finish is the result approval; record it. Anything else, or a
   different head: use `work-check` and stop.
2. **Pull request (stage 12)**, when the item changed files and the project
   has a remote (`references/ship.md`, section 1). In a GitHub Issues
   project the body says "Part of #12", never "Closes #12" or "Fixes #12":
   GitHub would close the item without his yes.
3. **Merge**, as its own question: "Pull request #14 is open and its checks
   pass. Merge it into main?", unless the standing merge instruction
   applies. The result approval is not a yes to the merge
   (`references/ship.md`, section 2; no remote: the local merge there).
4. **Deployment (stage 13)**, only when the result must go beyond the
   default branch. Each deploy needs his yes; production deploys and data
   loads are his to run (`references/ship.md`, section 3; Salesforce:
   `references/salesforce-deployment.md`).
5. **Specification update (stage 14)**, when the item changed agreed
   behavior or the verified structure of the system. Read
   `requirements/AGENTS.md`. Write only the Finalized requirements the
   checker marked Met into `requirements/`, each Source naming the item ID
   and Q-ID; tell him in one line about a Finalized one not marked Met.
   Update `system-guide/` only when the verified structure changed and
   `PROJECT.md` does not say it is unused. Save with `publish-docs`, set
   stage `14-spec-update`, status In Review, and add a Recent History row
   naming each file saved and the commit. This needs no new approval.
6. **Skipped stages** get one Recent History row naming them and why ("No
   repository change: stages 12 and 13 skipped.").
7. **Sub-items.** List the open ones with the work track skill. Each needs
   its own Done, cancel, or move, unless he says to mark the parent Done
   anyway; record his words in the Done row. Ask one question ("WI-032 is
   still in testing. Finish it first, or mark WI-031 Done anyway?").
8. **Ask for Done.** Before asking: the result approval is recorded; every
   change is merged, or he said to leave it on its branch; the
   `requirements/` and `system-guide/` updates are saved; every sub-item is
   Done, Cancelled, moved, or he said the parent is done anyway; every
   Roadmap phase the item completed says Done. Then add the row, with the
   Next action "Waiting on Mike: Q-12 (mark WI-031 Done). After his answer:
   record Done and close the item, with work-finish.", and end the reply
   with "Mark WI-031 Done?", the evidence in one line before it (checker
   verdict and commit, merged pull request, deploy result).
9. **After his yes:** save his words first, then set status Done and
   `waiting_on: none` (the stage stays), and rewrite the Current state
   (Where it stands "Done on `YYYY-MM-DD`: <evidence>.", Next action "None.
   Finished.", Waiting on "Nothing.", Blockers "None."). A "no": record his
   words, turn each problem into a task, and ask again when it is fixed.
   Then update the project's Current State (`memory/CURRENT_STATE.md` in the
   main checkout, or the Notion "Current state" page through the memory save
   skill): remove the item's line under "Now" and its lines under "Waiting
   on the owner", rewrite a "Next session starts with" line that names it,
   and set "Last updated:".
10. **Decisions to memory, once.** Take the item's Questions and Answers
    rows with Decision? yes, leaving out approvals, the Done or cancel row,
    merge and deploy yeses, Superseded rows, and decisions already offered.
    Offer only those a later item, or an agent working on something else,
    would need to follow: add one row per decision ("Save Q-04 to memory
    too?") and ask "These look project-wide. Save them to memory too?" A
    yes: save with the memory save skill (Hindsight: `retain`). A no: never
    offer it again. None: say so in one line.
11. **Report.** Say whether the work reached the default branch, what was
    deployed, and which specification files were saved. End with one
    question: the memory offer first; leftover branches and worktrees in a
    later reply (`references/ship.md`, section 4). Nothing to ask: "Tell me
    the next thing to build."

**Cancel instead** (the owner's word only): record his reason in his words
as an answered row, ask about each open sub-item (cancel it, move it to the
top level, or move it under another item), set status Cancelled and
`waiting_on: none`, rewrite the Current state (Where it stands "Cancelled on
`YYYY-MM-DD`: <his reason>.", Next action "None. Cancelled."), update the
project's Current State as in step 9, and offer its decisions as in step 10.
Its open pull request, branch, and worktree stay until he says what to do.
Nothing is deleted.

**The owner marked it Done or Cancelled himself:** that counts; never undo
it. Add the Recent History row "Marked Done by the owner by hand on
`YYYY-MM-DD`", tell him in one line what had not happened yet (result
approval, independent check, merge, specification update), and ask what he
wants done about it. Then do the Current state and Current State parts of
step 9, and step 10.

## Gotchas

- One message may answer several questions when his words name each (for
  example the merge and Done): one row per question, each with his words.
- In Codex, every Git write and every `gh` call runs alone, with escalated
  permissions.

## References

| File | Open it when |
| --- | --- |
| [references/ship.md](references/ship.md) | Steps 2 to 4 and 11: the pull request, the merge, the standing merge instruction, no remote, a deployment outside Salesforce, leftover branches and worktrees |
| [references/salesforce-deployment.md](references/salesforce-deployment.md) | Step 4 in a Salesforce project: validate, sandbox and production deploys, releases, the deployment record |
| [examples/finish-walkthrough.md](examples/finish-walkthrough.md) | Seeing a whole finish: the questions, the rows written, and the memory offer |
