# Review: the fixes, read again, and the three new pieces

Date: 2026-10-05. Work item: TKV-24. A separate agent that changed no file
read commit `d552593d` against `78297f54`: every fix made for the three
reviews of 2026-10-05, plus the first review of the checking script, the
Hindsight text, and the split update steps. Short forms: `<setup>` is
`plugins/toolkit/skills/project-setup/`; `<assets>` is `<setup>assets/`;
`EP/` is `<assets>every-project/`; `LC/` is
`EP/.claude/skills/running-work-item-lifecycle/`; `FPR/` is
`EP/.claude/skills/filing-project-records/`; `VR` is
`EP/.claude/hooks/validate-records.mjs`.

Result: of the 103 earlier findings, 7 are not closed, 1 was made worse in
one place, 14 wait for the owner or stay by design, and the rest are closed.
New findings: 2 blockers, 13 should fix, 21 notes. The check tools pass (23
skills, 0 errors; 98 tests).

## Earlier findings not closed

- Review 2, finding 24: made worse at `LC/SKILL.md:31` (new finding 13).
- Review 2, finding 26: `dev/reviews/overlap-review.md:44, 76, 84` still say
  "under 400 characters" (new finding 15).
- Review 2, finding 35: the Codex Git paragraph is still kept by hand in six
  skill files.
- Review 3, finding 11: two pointers to the moved section were missed (new
  finding 11).
- Review 3, finding 19: the version fields and `dev/PROGRESS.md` (the last
  build step).
- Review 3, finding 23: three starter files still say "before this
  project's changes" (new finding 9).
- Review 3, finding 28: the review files still end "Open".
- Review 3, finding 30: the rule "Challenge the current design (Mike,
  2026-10-04)" is still only an uncommitted edit in the main checkout. It
  must be in the branch before it lands.

## Blockers

1. **The record check reports a false problem after the documented filing
   steps**, in every project with a remote, and in every session that works
   in its own worktree. `VR:251-264` reads `DECISIONS.md`, `system/`, and
   `sources/` in the checkout it runs in; `publish-docs/SKILL.md:83,
   146-147` pushes the record and leaves the local checkouts as they were;
   the next step (`FPR/references/record-decision.md:22-23`,
   `file-source.md` steps 6 and 7) writes the ID into the work item, and the
   check finds no such ID locally. Seen with a remote and, from a worktree,
   without one: exit 2, "DEC-003 is written here, but DECISIONS.md has no
   DEC-003 ... file the record first". The test "from a Git worktree" in
   `dev/tests/validate-records.test.mjs` fixes this behaviour as intended.
   Fix: after a save, bring the checkout the check reads up to date before
   the pointer is written (`publish-docs` moves the main checkout's default
   branch forward; a session on its own branch merges the default branch);
   or checks 9 and 15 read the three records from the tip of the default
   branch, which changes the script.
2. **The pre-commit step turns off every other Git hook the project has.**
   `<setup>references/placing-files.md:121-122` looks only for a file named
   `pre-commit`. With any other hook in `.git/hooks` (seen: `commit-msg`,
   `pre-push`; Git LFS installs four) it sets `core.hooksPath`, and Git
   stops running those hooks. Fix: the "change nothing, tell the owner" row
   applies when the hooks folder lists any file whose name does not end in
   `.sample`. Say the same in the repository `AGENTS.md` ("Code limit") and
   `README.md:137-139`.

## Should fix

3. **The starter root `AGENTS.md` is 20,664 bytes; setup's final check
   allows 20,480** (`finishing.md:129`, `update.md:168-169`). Every new
   project fails that check. Fix: cut at least 400 bytes from the rows the
   fixes lengthened, or the owner's yes to a new limit.
4. **Setup in a folder that already has its own `sources/` or `system/`
   folder** stops the setup commit and every later commit to those files
   (seen). Fix: a row in `interview.md` "Look before asking": when
   `system/`, `sources/`, `delivery/`, or `reference/` already holds files,
   stop and ask the owner.
5. **A work item that still holds the template's Related items or Moved up
   prompt gets three false findings, and check 14 misses it.** Both prompts
   in `WORK-ITEM.md:41, 43` (and the copies) hold a second pair of angle
   brackets, so the script reads the example IDs as real. Fix: reword the
   two prompts so they hold no inner angle brackets.
6. **Check 10 reports real text as a prompt** (`VR:20`): a rule line with
   `` `Map<Id, Account>` ``. Fix: remove text in backticks from the line
   before the test, in the same expression.
7. **Check 7 reports an original kept outside Git** when its place holds a
   file name that starts with its SRC ID (`VR:147-150`). Fix: a row is kept
   in the repository only when the cell holds a Markdown link; drop the
   second pattern.
8. **An edit to an `AGENTS.md` or `CLAUDE.md` in another repository makes
   the check run on that repository** (`VR:251-262`). Fix: exit 0 when the
   edited file is not inside the session's repository or its main checkout.
9. **`EP/AGENTS.md:65`, `EP/reference/AGENTS.md:11`,
   `EP/system/AGENTS.md:94`** say `reference/current-system/` holds the
   system "before this project's changes"; the update writes what the
   project built into it, and design decision 16 says "as it is today".
   Fix: "what was observed, in which environment, and on which date".
10. **The Hindsight rule sends the agent to a skill Codex does not have, and
    the two Hindsight files give different save times.**
    `memory-hindsight/.claude/rules/hindsight-memory.md:3, 7, 9`;
    `hindsight-on-vps.md:70`. The add-on's README says the skill is
    installed for Claude Code; the save is at the end of every turn. Fix:
    "In Codex, which has no such skill, follow the guide the add-on shows at
    session start"; one save time in both files.
11. **`old-toolkit-pieces.md:155, 261`** point to `update.md`, "Where each
    old piece goes"; the section is in `one-home-layout.md`.
12. **`earlier-versions.md:47-48` and
    `publish-docs/references/recovery.md:56-57`** still say
    `keep-work-item-current.md` gives the forms of Next action; they are in
    the work item template.
13. **`LC/SKILL.md:31`**: "Designing when more than one way to build it
    would meet the requirements" fits almost every item. Fix: a measure,
    for example "when two ways to build it differ in what the owner would
    see, pay for, or have to maintain".
14. **`README.md:156`** says "check the setup" changes nothing; it now puts
    back a missing guide or template.
15. **`dev/reviews/overlap-review.md:44, 76, 84`**: 400 characters; the
    rule is 500.

## Notes

16. `prompt-reminder.mjs:43`: with `--skill hindsight`, "the filing test
    there" follows the sentence about `hindsight-memory.md`, which holds no
    filing test. Fix: "the filing test in the root AGENTS.md".
17. `prompt-reminder.mjs:57`: every sentence that ends in "?" is dropped,
    so "From now on, can you always ask before you merge?" gives no keep
    hint.
18. `EP/AGENTS.md:35`: "restores them"; `finishing.md:163` copies only a
    missing file. Fix: "puts back a missing one".
19. `EP/AGENTS.md:68`: "`salesforce-project.md` gives the commands"; it now
    points to three other files. Fix: "says where each command is".
20. `move-over.md:248`: "adds them in step 7" fits three places. Fix: name
    `update.md`, "The record check and the pre-commit file", step 4.
21. `VR:274-278`: with the reader of stderr closed, the script ends with
    exit 1 on its own error. No test covers it.
22. `VR:29`: an unreadable `sources/README.md` is read as an empty list, so
    every source is reported (exit 2). The specification asks for one line
    and exit 0.
23. The description total (7,987 of 8,000) counts descriptions only; the
    Codex list also holds each skill's name and path. The project's
    `max_context_tokens = 10000` is what applies (inferred).
24. Script details: check 11 looks only at the project folder and the
    folders directly inside it; a top-level folder from elsewhere with its
    own `AGENTS.md` and a different `CLAUDE.md` is reported at every Stop;
    an ID of another system in a work item, such as a Jira key "SEC-45", is
    reported as an undefined rule; the Claude Code matcher names
    `MultiEdit`, which the captured page does not name.
25. Message wording in `VR`: "1 problem(s)", "1 line(s)"; "Its name starts
    with its row's SRC ID" reads as a statement; the own-error line shows a
    JavaScript error text.
26. Counts left behind: repository `AGENTS.md:240` "the three hook
    commands"; `plugins/toolkit/.codex-plugin/plugin.json` `longDescription`
    "Holds two skills" and "three small hook commands"; `CHECKS-SPEC.md:25`
    says the pre-commit file has three lines (it has six).
27. `README.md:246`: "with Hindsight, the add-on's tools"; the hook names
    `.claude/rules/hindsight-memory.md`.
28. `update.md:125-127`: a commit counts as the toolkit's when it also
    changes a file under `.claude/skills/`; a commit of the owner's that
    changes a rule and a skill together is then read as "no edit of his".
    Fix: also require that the file equals the setup copy's version at one
    of those commits, or ask.
29. `FPR/references/update-system-doc.md:10`: no file says in plain words
    that Decided gives Approved and Open gives Draft.
30. `writing-harness-files/references/checklist.md:110`: "helper agents
    never see an output style"; the page says a fork inherits the style.
31. The list of harness file kinds is kept by hand in five places plus the
    description. They agree today. No check compares them.
32. `work-local/work-items/AGENTS.md:23`: the second sentence is a
    fragment, and "unique within their item" does not fit a project task.
33. `EP/delivery/AGENTS.md:67-68` and `EP/AGENTS.md:60`: the commit rule
    names "the work item's branch"; no rule covers a record with no single
    work item (a client handoff, a release of several items).
34. `<setup>SKILL.md:3`: the new description keeps "where work items or
    memory live".
35. Two tool names are in toolkit text: `hindsight_ingest_document` (the
    rule) and `hindsight_diagnose` (`hindsight-on-vps.md:345`). Neither file
    lists the tools.
36. In Codex, exit code 2 after `apply_patch` replaces the tool result with
    the finding text (inferred).

## Changes the owner should see

Made by the builders, consistent with the design unless marked:
1. A work item deployed to a second environment gets a second folder with
   the environment in its name.
2. A diagram needs no decision, only a Changelog row with "none".
3. A glossary meaning that only an original gives needs the owner's yes.
4. A plain fact about the client's business or the team goes to
   `PROJECT.md`, "Operating conventions".
5. `work-items/AGENTS.md` no longer lists the States, the levels, or the IDs
   inside an item; it points to the lifecycle skill. This reverses the
   design's direction (the folder guide holds the statuses), because Notion
   and GitHub projects have no such guide.
6. "Check the setup" now puts back a missing toolkit file in `work-items/`
   or `memory/`.
7. An update now writes a Moved up line and a history row into every closed
   work item, because the record check needs that line.
8. The agent recommends Designing whenever more than one way to build an
   item would meet the requirements. This widens a rule (finding 13).
9. A request phrased as a question no longer gets the keep hint (note 17).
10. `publish-docs` now covers every `.md` file under `tools/` and every file
    whose name starts with `PROJECT`.
11. The root guide says never to edit the guides in `work-items/` and
    `memory/`.
12. In the starter `PROJECT.md` and `README.md`, the build, test, and deploy
    commands are only in `AGENTS.md`, "Commands".

## Found clean

A fresh project gives no finding in any mode, for local, Salesforce, GitHub
with Hindsight, and a folder with no Git. Bad input always ends with exit 0.
The script wrote no file and ran in 0.06 seconds. Ten checks each reported a
broken record in plain words; check 8 stopped a real commit. The six
snippets match the documented shapes. The Hindsight setup file matches the
owner's guide and the captured pages apart from finding 10, and the rule
keeps to the owner's decision. `writing-harness-files` matches its pages
apart from note 30. Nothing was lost in the split of `update.md`. The order
of the update steps is safe, and so is its one stated exception.

## Not checked

Any live session; the routing test; the plugin validate and test commands;
a scratch Codex install; Notion, GitHub, Hindsight, and org steps; Windows.

## Status of the fixes

Open.
