# Review: the second round of fixes

Date: 2026-10-05. Work item: TKV-24. A separate agent that changed no file
read commit `6ff85ccf` against `d552593d`, built projects by the setup
steps, and ran the real script and real Git commands. Short forms: `EP/` is
`plugins/toolkit/skills/project-setup/assets/every-project/`; `FPR/` is
`EP/.claude/skills/filing-project-records/`; `PD` is
`EP/.claude/skills/publish-docs/SKILL.md`; `VR` is
`EP/.claude/hooks/validate-records.mjs`; `<setup>` is
`plugins/toolkit/skills/project-setup/`.

Result: of the 36 findings of the review before it, 33 are closed, 1 is not
closed in one case, 1 was corrected, 1 stays by decision. New: 1 blocker, 2
should fix, 10 notes. The reviewer's judgment: the branch is ready for the
owner to look at a sample project built fresh from it; the blocker and the
two should-fix findings must be fixed before it lands.

## Blocker

1. **In a session that works in its own worktree, the filing steps still
   give a false finding, and can remove a published entry.** `FPR/SKILL.md:26,
   28`, `FPR/references/record-decision.md:15-19`, `PD:140-152`.
   `publish-docs` takes the session's own copy out of its worktree after a
   save, so the worktree does not hold what the session just saved; the next
   record is written there and checked there. Seen with a bare remote: file
   SRC-001 from the session worktree, save, fast-forward the main checkout,
   then add DEC-001 with "Sources: SRC-001" in the session worktree: "SRC-001
   is written here, but sources/README.md has no SRC-001", exit 2. A second
   decision written in the session worktree and copied across stages the
   removal of the first. Fix: one sentence in `FPR/SKILL.md`, "Every time":
   a session that works in its own worktree writes each record in the save
   worktree that `publish-docs` step 4 makes from the default branch, never
   in its own worktree.

## Should fix

2. `FPR/SKILL.md:28`, `running-work-item-lifecycle/references/closing.md:50`:
   when `publish-docs` cannot update the main checkout (seen: an unpushed
   commit there), no pointer is written and nothing records that it is owed.
   Fix: hand a "Waiting on the owner" line to Current State with the ID, the
   items that need the pointer, and what blocks the update. (An ID written
   only in Current State gives no finding.)
3. `<setup>references/finishing.md:128`: when `git config --get
   core.hooksPath` prints nothing, the text says the project has another
   hooks folder or a hook of its own. False in a new copy of the project and
   in a folder with no Git. Fix: "report what it prints, and the reason
   `placing-files.md`, section 5, gives".

## Notes

4. `PD:100`: "With no remote, the fast-forward in step 7 did it" is not true
   when step 7 used `git push . HEAD:<default>` or another worktree holds
   the default branch.
5. `closing.md:49`: step 4 writes the Moved up line before the condition in
   step 5. Put the condition first.
6. `FPR/SKILL.md:28`, `closing.md:50`: the wait and the stop apply only with
   local work items; say so.
7. `prompt-reminder.mjs:13-14`: "Always ask before you merge, ok?" gets no
   hint. Add "always" and "never" to the words that keep a sentence.
8. `VR:261-264`: an unreadable record in the main checkout makes the second
   run fail, and the findings of the first run are lost.
9. `VR:251-252`: only the first file a Codex patch names decides the
   repository; a session started in a parent folder with no Git gets no
   check.
10. `EP/sources/AGENTS.md:21`: "with no Markdown link" for an original kept
    outside Git is a new rule for the form of a record, missing from
    `DESIGN-SPEC.md` section 9.
11. `PD:171-172, 179` and `FPR/SKILL.md:28`: "in the way" is an idiom. Use
    "blocks the update".
12. `dev/research/layout-audit/CHECKS-SPEC.md:15-16, 133-135` disagree with
    the shipped text (the script also runs `git rev-parse`; "check the
    setup" does not set `core.hooksPath`; "or any hook of its own" is
    missing).
13. `<setup>references/placing-files.md:122`: a repository with no hooks
    folder makes `ls` print an error; the table should name that case.

## Found working

The blocker 1 sequence from the main checkout and from a worktree with the
pointer written after the update: no false finding; a missing ID is still
reported. The fast-forward of the main checkout never changed or lost an
uncommitted file there. The pre-commit step is right for seven kinds of
repository. The script is 279 lines, gives no finding on a fresh project,
exits 0 on 23 kinds of bad input, and writes no file. 108 tests pass. The
starter root file is 19,879 bytes and no description became vaguer.

## Status of the fixes

Set on 2026-10-05, after the third fix pass. The commands and their output
are in `dev/test-runs/fix-pass-3.md`. No separate agent has read these
fixes yet.

- Blocker 1: closed. `FPR/SKILL.md`, "Every time": a session whose folder
  is not the main checkout reads and writes `DECISIONS.md`, `sources/`,
  and `system/` only in the save worktree that `publish-docs` makes from
  the default branch. `PD`, "Carrying an edit across", copies a file only
  when the session's checkout started from the version the save worktree
  has. Reproduced with a bare remote: no finding after the edit, at stop,
  or before the commit; the published `DECISIONS.md` holds both decisions;
  a missing ID is still reported.
- Should fix 2: closed. `FPR/SKILL.md`, "Every time": with local work
  items, when the main checkout does not hold the save, no pointer is
  written, and one line for "Waiting on the owner" in Current State goes to
  `curating-project-memory`, which writes it through `using-memory-store`
  (Hindsight memory: `.claude/rules/hindsight-memory.md`). The line is
  removed when the pointers are written. `closing.md` points to it.
- Should fix 3: closed. `finishing.md` reports what the command prints and
  the reason `placing-files.md`, section 5, gives.
- Note 4: closed. `PD`, "The main checkout", says when the main checkout
  holds a save made with no remote.
- Note 5: closed. `closing.md` has the condition as its own step 4, before
  the two steps that write an ID into the item.
- Note 6: closed. Both files say the wait and the stop apply with local
  work items; with Notion or GitHub the pointer is written once the save is
  on the default branch.
- Note 7: closed. "always" and "never" keep a sentence that ends in "?".
  The hook is 65 lines. Tested in `dev/tests/hooks.test.mjs`.
- Note 8: closed. The findings of the session's own checkout are reported,
  then one line: "The record check did not run in the main checkout. Its
  own error: ...". The script is 279 lines. Tested in
  `dev/tests/validate-records-cases.test.mjs`.
- Note 9: stays, by instruction. The script is not changed. Both limits
  are in `CHECKS-SPEC.md`, "Known limits of this version".
- Note 10: closed. The line is in `DESIGN-SPEC.md`, section 9, for the
  owner to confirm.
- Note 11: closed. `PD` and `FPR/SKILL.md` say "blocks the update".
- Note 12: closed. `CHECKS-SPEC.md` names both Git commands, says "check
  the setup" only reports the setting, and names a hook of the project's
  own.
- Note 13: closed. The last row of the table in `placing-files.md`, section
  5, names a hooks folder that does not exist.
