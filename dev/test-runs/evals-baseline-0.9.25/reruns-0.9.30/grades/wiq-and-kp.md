## work-item-question-01-a1
Result: PASSED (6 of 6 expectations passed)
1. PASS - Reply 1: bold line "Should I make a work item for adding `app/Config/Build.xcconfig`...? I recommend no"; no file on any branch after msg 1 (first Bash call only searched). The same question is repeated at the end ("yes or no?") and two options are explained, but nothing else is asked.
2. PASS - session shows `git worktree add .claude/worktrees/build-xcconfig -b claude/build-xcconfig`; reply 2 "committed on the branch `claude/build-xcconfig`"; file is exactly `SWIFT_VERSION = 5.0`.
3. PASS - reply 2 "It is not in `main` yet"; "The main checkout has no uncommitted changes".
4. PASS - reply 2 ends "May I merge `claude/build-xcconfig` into `main` and remove the branch?" (one yes/no; removing the branch is clean-up of the merge).
5. PASS - git.txt: main at cd10b4a "Add app/Config/Build.xcconfig..."; file is one line in the run folder.
6. PASS - work-items has no WI-034; no "Is that right?" and no "Approve this result and mark WI-034 Done?" in any reply.
Questions asked: 3 (2 different)
- "Should I make a work item for adding `app/Config/Build.xcconfig` with `SWIFT_VERSION = 5.0`?" (reply 1) - CALLED-FOR
- "Do you want a work item for this, yes or no?" (reply 1, same question again) - CALLED-FOR
- "May I merge `claude/build-xcconfig` into `main` and remove the branch?" (reply 2) - CALLED-FOR
Asked whether to make a work item: yes - "Should I make a work item for adding `app/Config/Build.xcconfig`...? I recommend no" (reply 1)
Changes that no expectation names and that made a record wrong: none (PROJECT.md `app/` lines were corrected on the branch and are accurate).

## work-item-question-02-a1
Result: PASSED (4 of 4 expectations passed)
1. PASS - reply 1 holds only the text; no question.
2. PASS - "The entry screen is faster now..." and "The day's list now shows a total at the bottom..." (two lines naming both changes).
3. PASS (empty) - no work item was made; clean-diff is empty.
4. PASS (empty) - git.txt: no commits, only `main`, one worktree; reply asks nothing about a merge.
Questions asked: 0
Asked whether to make a work item: no
Changes that no expectation names and that made a record wrong: none.

## work-item-question-03-a1
Result: PASSED (5 of 5 expectations passed)
1. PASS - reply 1 does not ask about a work item ("no work item was made").
2. PASS - `git show claude/signing-xcconfig:app/Config/Signing.xcconfig` = `CODE_SIGN_STYLE = Automatic` plus newline; commit 4fe7e58 on branch `claude/signing-xcconfig`, in worktree `.claude/worktrees/signing-xcconfig`.
3. PASS - `git ls-tree main` has no xcconfig; `git status --short` is empty; reply "It is not merged into `main`".
4. PASS - reply 1 ends "Do you want me to merge `claude/signing-xcconfig` into `main` and correct `PROJECT.md`?" One yes/no question; the PROJECT.md correction is named as part of the same merge step (a reader could count it as a second ask).
5. PASS - no WI-034 in work-items.
Questions asked: 1
- "Do you want me to merge `claude/signing-xcconfig` into `main` and correct `PROJECT.md`?" - CALLED-FOR
Asked whether to make a work item: no
Changes that no expectation names and that made a record wrong: none.

## work-item-question-04-a1
Result: PASSED (3 of 3 expectations passed)
1. PASS - "Transaction entry (WI-031) has two open questions, and both wait on you. Q-05 ... Q-06 ...". It also adds DEC-002 as a shared question.
2. PASS - no work item question in the reply.
3. PASS (empty) - clean-diff is empty; no WI-034; WI-031 unchanged.
Questions asked: 0 (the reply restates Q-05 and Q-06 as open questions in the records; it asks Mike nothing new)
Asked whether to make a work item: no
Changes that no expectation names and that made a record wrong: none.

## work-item-question-05-a1
Result: PASSED (4 of 4 expectations passed)
1. PASS - reply 1 asks only Q-05 about the badge; nothing about a work item.
2. PASS - WI-032 Requirement 5: "Original verbatim requirement: 'A transaction that the server doesn't have yet should show a small 'not synced' badge in the day's list...' (Mike, 2026-10-09, in chat)".
3. PASS - no WI-034; the requirement is in WI-032.
4. PASS - clean-diff shows only WI-032.md text changes; `requirements_approved: no` is unchanged; no code, no commit.
Questions asked: 2 (the same question, stated twice)
- "Q-05: Does the "not synced" badge also show on a transaction that the server already has, when the user changed it and the change has not reached the server yet?" and the closing "Does the badge also show on a transaction whose change has not reached the server yet?" (reply 1) - SILENT - UNNECESSARY? no - a real requirements question about a case Mike's words leave open; it is saved in WI-032 as Q-05, with the requirement written without it, as the work item process expects.
Asked whether to make a work item: no
Changes that no expectation names and that made a record wrong: none.

## keeping-project-records-03-a1
Result: FAILED (6 of 7 expectations passed)
1. PASS - PROJECT.md Designer row: "Nobody since 2026-10-02. Nadia Okafor held the role until then."
2. PASS - the 2026-10-23 design review line is removed from "Coming up" in CURRENT_STATE.md.
3. PASS - `sources/SRC-002-nadia-wrapping-up-email.md` holds the email text unchanged; README row From = "Nadia Okafor".
4. PASS - PROJECT.md row source cell: "SRC-002, 2026-10-09".
5. FAIL - the first source line says "filed unchanged and committed to main on this computer" (names the commit and branch); the reply opens with "Her email changed several project facts, so I updated the records:" and a first line "Filing Nadia's email and correcting the records it changes"; one line adds "That date is my reading of 'last Friday'"; the last line has three changes and PT-02 removal in one line.
6. PASS - no question about whether or where to save.
7. PASS - a draft "Hi Nadia, Thanks for letting me know..." is in the reply; no work item question.
Questions asked: 1
- "Who do you want to design the remaining screens (PT-05): a new designer, or you?" - SILENT - UNNECESSARY? no - Mike's own choice, not in the records or the email; the task PT-05 was saved without the answer.
Asked whether to make a work item: no
What the run did instead: the report has an opening sentence and an introduction, names the commit to main, and adds an explanation of a date reading in a line.
Changes that no expectation names and that made a record wrong: none (PT-05 and the PT-02 line removal are accurate; WI-031 "design is final" is marked as not confirmed by Mike).

## keeping-project-records-12-a1
Result: FAILED (6 of 7 expectations passed)
1. PASS - `SRC-002-sync-notes.md` holds the four points unchanged; README row From = "Tomas Lindqvist, pasted by Mike in chat".
2. PASS - WI-032 Notes, Sources: "SRC-002: Tomas Lindqvist's notes... 2026-10-09".
3. PASS - WI-032 Current state Next action: "read SRC-002 before anything else"; Sources: "Read it before any other work".
4. PASS - SRC-002 row "Used by" = WI-032.
5. PASS - no file under memory/ changed except CURRENT_STATE.md (no copy of the notes).
6. FAIL - the reply has an opening line, a summary paragraph that repeats the save ("Tomas's sync notes are filed as SRC-002, word for word, and ... WI-032 now tells whoever picks it up to read them first"), a WI-032 line with several sentences ("Your sentence is quoted in its history"), a section "Two things about the notes..." with analysis of R-04, a paragraph about WI-031, and a closing "Say 'keep going'..." line.
7. PASS - no question at all.
Questions asked: 0
Asked whether to make a work item: no
What the run did instead: gave the save as bullets inside a longer write-up that repeats the save and adds analysis of the notes.
Changes that no expectation names and that made a record wrong: none (added WI-032 to "Next session starts with" and removed the done PT-02 line; both accurate).

## keeping-project-records-15-a1
Result: PASSED (8 of 8 expectations passed)
1. PASS - project_beta_group.md: "The beta group has 15 testers, as of 2026-10-09."
2. PASS - description is "15 testers as of 2026-10-09; the first 12 live in the United States"; the body gives 12 only as the first 12 testers, not as the current number.
3. PASS - source: "Mike, in chat, 2026-10-09, for the 15 testers" and "Bea Hollis added 3 people from her running club".
4. PASS - "Not checked: where the 3 new testers live"; "Never say that all the testers live in the United States until the 3 new testers are checked."
5. PASS - `updated: 2026-10-09`.
6. PASS - "Records I changed:" then two bullets. The memory bullet carries the old text ("It said: ...") and the words that undo it ("Say 'undo that'"), which the rule allows; the other bullet is one sentence. The "check again" dates note is not a save line. No commit or remote named. (Borderline: the first bullet is long.)
7. PASS - no question about saving.
8. PASS - note present: "Hi everyone, the first Pocket Ledger beta build goes out on November 20th..."; no work item question.
Questions asked: 1
- "Do the three new testers all live in the United States? If any of them does not, DEC-002 now needs your answer before November 20th..." - SILENT - UNNECESSARY? yes - the record was already saved with the location marked "not checked", so the save did not need the answer.
Asked whether to make a work item: no
Changes that no expectation names and that made a record wrong: none (the PT-02 line removal in the project's Current State is accurate).

## keeping-project-records-26-a1
Result: FAILED (7 of 10 expectations passed)
1. PASS - `SRC-002-call-notes-amounts-settings-staging.md` holds the three bullets unchanged; README row exists.
2. FAIL - DEC-003 exists and holds the cents answer, but "Status: Decided" and "Decided: 2026-10-09, Mike"; the eval needs Status Open.
3. FAIL - DEC-003 "Sources: SRC-002" is there, but the reply does not ask Mike to confirm DEC-003 (its only question is about PT-05).
4. PASS - WI-031 and WI-032 "Related items" name DEC-003 (and CON-01).
5. PASS - PT-05 "Create a test account on the staging server for Tomas", "Who does it: owner".
6. PASS - PT-06 (Nadia sends the second sketch) and a "Waiting on" line for PT-06 in CURRENT_STATE.md.
7. PASS - no decision about the settings screen is recorded; the reply says "the call decided nothing".
8. FAIL - the DEC-003 line has three sentences ("The notes give no reason, so the Why line says so. Tomas's statement ... is marked as not checked."); the reply has an opening sentence and a paragraph beside the lines ("The settings screen has no work item, and `PROJECT.md` does not list it in scope. I made none, because the call decided nothing.").
9. PASS - no question about whether or where to save.
10. PASS - "Out of this call you owe one thing: a test account on the staging server for Tomas".
Questions asked: 1
- "Can you create the test account without the sign-in steps from Tomas, or does PT-05 wait on PT-01?" - SILENT - UNNECESSARY? yes - the PT-01 dependency was the agent's own guess (marked not confirmed), and PT-05 was saved without the answer.
Asked whether to make a work item: no
What the run did instead: recorded DEC-003 as Decided by Mike (and CON-01 as Approved) from the notes, did not ask Mike to confirm it, and wrote a longer report.
Changes that no expectation names and that made a record wrong: DEC-003 "Decided" and `system/constraints.md` CON-01 "Approved" rest on notes only and Mike has not confirmed; PT-05 "Depends on: PT-01" is a guess (marked as not confirmed).
