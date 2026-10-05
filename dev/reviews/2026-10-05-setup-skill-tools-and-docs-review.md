# Review: the setup skill, the check tools, and the repository docs

Date: 2026-10-05. Work item: TKV-24. Reviewed at commit `78297f54` by a
separate agent that changed no file. `<setup>` is
`plugins/toolkit/skills/project-setup/`; `<assets>` is `<setup>assets/`.
The reviewer built three new projects and one old-layout project in scratch
folders and walked the steps as shell commands.

Result: 0 blockers, 20 should fix, 14 notes.

## Should fix

1. **`update.md` 460, 468-474, 514-526.** After the update lands, a
   Salesforce project's ignored data files (`delivery/data/data-loads/`,
   `production-backups/`) are no longer ignored, and no step says when to
   move them. Seen in the trial: `git status` listed `?? delivery/data/`.
   Fix: first point of step 8 moves them with `mv` and checks `git status`;
   name the two old `.gitignore` files in the toolkit-files list.
2. **`update.md` 476-479.** "A template file that differs holds his facts"
   is wrong for three templates the toolkit itself changed on this branch.
   Fix: decide by Git history: a template with a commit other than the
   setup commit or a toolkit update commit holds his facts.
3. **`move-over.md` 319, 329-330** name `update.md` "6. Checks and report";
   it is now section 7.
4. **`update.md` 52-55, 90, 492-495.** Two sentences give different times
   for changing `memory/` and `work-items/` in the main checkout, and the
   "Missing files" `rsync` lacks its excludes. Fix: one time (step 8) for
   every change there; write both `rsync` commands as `move-over.md` does.
5. **`update.md` 447, 448, 506, 514-526.** Step 8 lists fewer main-checkout
   writes than the table sends there (Questions and Answers rows and
   lessons carried from memory records; the line for `owner-preferences.md`),
   and old paths named inside work items are never found (the step 5 `grep`
   runs in the worktree). Fix: add them to step 8, with the `grep` on
   `<main>/work-items` and `<main>/memory`; name `owner-preferences.md` in
   step 4.
6. **`update.md` 462, 468-474.** The old `ai-external-knowledge/INDEX.md`
   has no removal. Fix: `git rm` after its rows are read back.
7. **`update.md` 94, 95, 480.** The steps ask the agent to tell the owner's
   edits from toolkit changes but give no way. In the trial 13 of 18 rule
   files differed in a project where the owner edited none. Fix: "A file
   whose only commits are the setup commit and toolkit update commits holds
   no edit of his: recommend the toolkit's version", with the `git log`
   command.
8. **`update.md` 95-96.** `work-items/PROJECT-TASKS.md` holds the owner's
   project tasks but is not in "His own records". Fix: add it to row 96.
9. **`update.md` 389** points to `using-work-tracker/references/searching.md`
   for the Files lookup, which that file does not hold. Fix: write the
   filter in the row.
10. **`update.md` 451.** A rule carried from `system-guide/` is marked Built
    with a work item but given no decision; the rule form requires a
    Source. Fix: its Source is the decision found or recorded as row 450
    says.
11. **`update.md` is 596 lines and holds four subjects.** Fix: move section
    6 to `references/one-home-layout.md` and the three older version
    sections to `references/earlier-versions.md`; link both from `SKILL.md`;
    change the 12 references to the moved sections.
12. **`setup-copy.md` 115, 176; `every-project/PROJECT.md` 53.** "Memory
    approval" is written at setup and read by nothing. The owner's call:
    delete the line (then "11" becomes "10" in five places) or restore the
    reader.
13. **`setup-copy.md` 151-154; repository `AGENTS.md` 136-144.** Setup
    deletes 8 lines from `.gitignore` in a project that is not Salesforce:
    a choice deciding lines inside a file. Fix: keep the 8 lines in every
    project and delete the step.
14. **`.claude/settings.json` `skillOverrides`.** No check compares the list
    with the project skill names. Fix: `check-skills.mjs` fails when they
    differ.
15. **`.claude/settings.json` `claudeMdExcludes`.** Not tested on this
    branch; the builder's own record says the starter's `CLAUDE.md` and
    eight rules loaded in a worktree session. Fix: run the load test from a
    worktree in the test sign-in, record it, add patterns if needed.
16. **`<assets>/owner-preferences.md`** is the one file every project gets
    that is not in `every-project/`, and it is not in the Layout table.
    Fix: move it to `every-project/.claude/rules/` and delete its copy step,
    or add a Layout row that says why it sits apart.
17. **`<setup>SKILL.md` 3.** The description gives four phrases as the whole
    trigger and leaves out "check the setup", a move-over, a changed setup
    choice, the Hindsight dashboard, a new computer, and `SOUL.md`. Fix:
    name the class, mark the phrases as examples, change the index row, run
    the routing test.
18. **"The one-home layout"** is a coined name used before it is defined
    (`SKILL.md` 46-48; `update.md` 6, 35, 120, 182). Fix: define it at first
    use in each file.
19. **The four version fields and `dev/PROGRESS.md`** are unchanged (0.8.16).
    This is the last build step; listed so it is not lost.
20. **`memory-notion/.../using-memory-store/SKILL.md` 56** says
    `project-setup` builds the glossary page; setup no longer does. Fix:
    delete the asset and its row.

## Notes

21. `update.md` 459: `git mv` onto a file the setup copy already put there
    fails. Write `git mv -f`.
22. `update.md` 448: no rule for a topic record whose status is superseded
    or retired, or for the old kinds `user_`, `reference_`, `event_`.
23. `update.md` 451 and `reference/AGENTS.md`: `current-system/` is defined
    as what exists before this project's changes, but the row sends the old
    system guide there, which describes what this project built.
24. `check-skills.mjs` 357-376: a row of the acting table is checked only
    through the skills its folders hold; swapping two folders between rows
    passes. Fix: fail when a folder other than `notion-tools` and
    `memory-process` is in two rows.
25. `check-rules.mjs` 178-182: `CHOICE_RULES` is a second hand-kept map.
    Say so in `AGENTS.md`.
26. `setup-copy.md` 81: 14 of the 15 "Never copied" paths cannot exist in a
    copy built from the setup folders.
27. Repository `AGENTS.md` 100, 368, 81, 28-31, 449-452 and
    `check-skills.mjs` 26: old or uneven wording ("The model project and
    its copy", "model routing line", the `ai-external-knowledge/` row omits
    `openai-plugins/`, "tracking sets", three different lists of harness
    file kinds).
28. The earlier review file still says "Open".
29. `DESIGN-SPEC.md` 162 and 91-93 are out of date (the filing skill holds
    no templates; the checking script was approved).
30. The main checkout has an uncommitted 5-line `AGENTS.md` edit, the rule
    "Challenge the current design (Mike, 2026-10-04)". It is in neither
    `origin/main` nor this branch. That dated decision must be kept when
    the branch lands.
31. `SKILL.md` 46: "Check the setup ... Change nothing in the project", but
    in a project on the old layout the old start hook rewrites
    `memory/MEMORY.md` when the checks run it.
32. `update.md` 79-81 and 397-398 say the same thing twice; four rows of
    the "Find it with" column give no command.
33. `finishing.md` 66-69: the instruction that `DECISIONS.md`, `system/`,
    and `sources/README.md` stay as copied sits inside an item about the
    roadmap. `interview.md` 131 joins two sentences on one line.
34. `setup-copy.md` 133-149: the hand-kept list of Salesforce entries to
    delete from `.claude/settings.json` is checked by nothing; a
    Salesforce-only settings snippet would make both hosts add instead.

## The earlier review's 15 items

Closed: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15. Open: 14 (the
version number). Remaining gaps are findings 14, 24, 26, and 27 above.

## Found clean

A new project for local work and local memory, built by every step as shell
commands, matches the design: 13 skills, 11 settings lines, 7 guides each
with a one-line `CLAUDE.md`. The Notion with Hindsight and Salesforce copy,
and the GitHub with Notion memory copy, match up to the first live-service
step. The check tools pass, and against `main` no check is weaker except
those whose subject was removed. Every sentence about the checks in
`AGENTS.md` matches the tools. Every dated decision of the owner is still
in `AGENTS.md`. All guide corrections match the cited pages. For an
old-layout project, every old file in the trial mapped to a row or to "Your
call", except the files in findings 1, 6, and 8.

## Not checked

Any live session; the plugin validate and test commands; a scratch Codex
install; every Notion, GitHub, Hindsight, and Salesforce org step; the
update walk for Notion or GitHub work items.

## Status of the fixes

Set on 2026-10-05, after the second fix pass
(`dev/test-runs/fix-pass-2.md`). The first fix pass is recorded in
`dev/test-runs/fix-pass-setup-and-tools.md`; the second review
(`2026-10-05-fixes-reread-review.md`) read those fixes again.

- Closed: 1 to 11, 13 to 18, 20 to 29, and 31 to 34. Three of them were
  closed in the second fix pass: 11 (the two pointers in
  `old-toolkit-pieces.md` now name `one-home-layout.md`), 23 (the three
  starter files say "what was observed, in which environment, and on which
  date"), and 28 (this section, in all five review files).
- Waits for the owner: 12 (the "Memory approval" line and every count of
  "11 lines").
- Open: 19. The version fields and `dev/PROGRESS.md` change in the last
  build step of the branch.
- Open: 30. The rule "Challenge the current design" (Mike, 2026-10-04) is
  an uncommitted edit in the main checkout, made by another session. It is
  added when the branch lands.
