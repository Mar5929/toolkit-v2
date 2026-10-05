# Review: every skill, with overlap

Date: 2026-10-05. Work item: TKV-24. Reviewed at commit `78297f54` by a
separate agent that changed no file. Short forms: `<assets>` is
`plugins/toolkit/skills/project-setup/assets/`; `LC/` is
`<assets>every-project/.claude/skills/running-work-item-lifecycle/`; `FPR/`
is `<assets>every-project/.claude/skills/filing-project-records/`; `EP/` is
`<assets>every-project/.claude/skills/`; `WHF/` is
`plugins/toolkit/skills/writing-harness-files/`; "root" is
`<assets>every-project/AGENTS.md`.

Result: 1 blocker, 24 should fix, 16 notes. The routing test in the two
products was not run by the reviewer.

## Blocker

1. **An original that only one work item uses has no clear owner.**
   `FPR/SKILL.md:3` and `:8` say the skill is only for "what more than one
   work item needs" and send one item's things to the lifecycle skill; the
   lifecycle description says "Not for a decision, an original, or a system
   rule that more than one item needs". Design decision 14 sends every
   original to `sources/`. Fix: in both descriptions and `FPR/SKILL.md:8`,
   every original is filed by `filing-project-records` whatever uses it; the
   filing test applies only to a decision, a question, or a rule.

## Should fix

2. `publish-docs` and `filing-project-records` both match "update the
   security doc". Fix: add to the `publish-docs` description "Not for
   deciding what DECISIONS.md, sources/, or system/ says; use
   filing-project-records."
3. `writing-harness-files` and `curating-project-memory` both claim a line
   in `owner-preferences.md` (also `LC/references/closing.md:47`). Fix: add
   to the WHF description "Not for a line the owner dictates for
   owner-preferences.md; use curating-project-memory", or say in curating
   which WHF steps apply.
4. Tracker descriptions: the Notion example "add a task to phase 2" is a
   plan change (the lifecycle skill's); the GitHub example "what is waiting
   on me" is "No skill" in the root; the Notion description lacks "Not for
   deciding States or approvals; use running-work-item-lifecycle". Fix: a
   plain lookup example in each, and the same clause in Notion.
5. The owner phrases in the filing description ("we decided", "let's go
   with") are not marked as examples and fit other requests. Fix: "such as
   ..." or drop them.
6. The pointer in a work item is written by two skills:
   `LC/references/refining-requirements.md:55` and `:27`, and
   `FPR/references/file-source.md:18` and `record-decision.md:21`. Fix: keep
   the write in the filing step only.
7. One save is ordered twice when a decision adds a rule:
   `record-decision.md:19-20` and `update-system-doc.md:22`. Fix: in
   update-system-doc step 8, "When `record-decision.md` sent you here, do
   not save: its step 6 makes the one save."
8. No step adds a decision's or a rule's ID to "Used by" in
   `sources/README.md` (`sources/AGENTS.md:22, 40` require it). Fix: add to
   record-decision step 4 and update-system-doc step 3.
9. The rule for keeping an original outside Git is in two files that differ
   (`file-source.md:10`; `sources/AGENTS.md:28`). Fix: measures and the
   question in the guide; the step points to it.
10. Skills repeat a folder guide or a record's home:
    `memory-local/.../using-memory-store/SKILL.md:37-48, 31` against
    `memory/AGENTS.md:25-37, 45, 21`; `update-system-doc.md:5, 10-12`
    against `system/AGENTS.md:82, 63-64, 83`; `record-decision.md:12-13, 37`
    against `DECISIONS.md:16, 17`; `file-source.md:13` against
    `sources/AGENTS.md:36`. Fix: keep each step, name the home, delete the
    restated rule.
11. "Delivered" is defined in two files with different conditions
    (`LC/references/closing.md:39`; `update-system-doc.md:28-31`). Fix:
    define it once in `update-system-doc.md`.
12. `owner-preferences.md` has two writers: `LC/references/testing-loop.md:35`
    writes it directly; `closing.md:47` says `curating-project-memory`
    writes it. Fix: hand the words to `curating-project-memory` (Hindsight:
    the rule).
13. A step was lost: a closed item's "Next session starts with" line stays
    in Current State (`closing.md:57`, also `:67`, `:77`; `main` had it in
    `deploying.md:58`). Fix: in closing step 5 hand the prune to
    `curating-project-memory` (Hindsight: the rule).
14. A hand-off ends at no step: an item that waits on an Open entry in
    `DECISIONS.md` (`record-decision.md:21, 30`; no lifecycle step; the
    waiting form in `keep-work-item-current.md` names a Q-ID only). Fix: one
    line in `LC/SKILL.md` "Every time".
15. With Notion memory a pointer is written and never read:
    `session-start.mjs:42-44` prints pointers only for local memory;
    curating has no find step. Needs the owner's decision.
16. The Notion memory skill ships a glossary template nothing uses
    (`memory-notion/.../SKILL.md:56`; `assets/terminology-glossary.md`).
    Fix: delete the asset and its row; say the page is from the older
    layout.
17. Notion memory now stores pointers only, which design section 7 left to
    the owner. Fix: his yes and a line in the spec, or restore section 7.
18. The GitHub tracker never names the Moved up line
    (`work-github/.../references/issue-layout.md:26, 42`). Fix: add it.
19. `curating-project-memory/SKILL.md:22` ("the owner asked to keep it in
    mind across sessions") reads two ways; the description is hard to parse
    and says "the project rules" while the root also names the two files in
    the owner's home folder. Fix: "the owner asked for a pointer in memory";
    description starts "Decides what project memory keeps: ...".
20. `writing-harness-files`: three different lists of what a harness file is
    (`WHF/SKILL.md:3`, `:8`, repository `AGENTS.md:449-452`);
    `references/checklist.md:34` says "Codex has no such folder" but Codex
    has a `rules/` folder of `.rules` files for command permissions
    (`ai-external-knowledge/codex/rules.md`); no row for that page or for
    output styles. Fix: one list in all three places; add the rows; reword
    line 34.
21. `WHF/SKILL.md:23` has no rule for a host that cannot start a helper.
    Fix: "No helper can start: review it yourself against the page, and
    tell the owner no separate review ran."
22. `EP/handoff/examples/handoff-example.md:17` cites the design file's
    header for an approval; the header no longer holds a status. Fix: the
    work item's `design: approved` field.
23. The handoff verifier's GitHub commands lack `-R <repo>`
    (`dev/build-shared/helper-briefs/handoff-verifier.md:53` and its copy).
24. Idioms and vague words: "kept for good" (`file-source.md:10`); "goes
    whole", "more than one sensible way" (`LC/SKILL.md:76, 31`); "cannot go
    on without", "goes on" (`record-decision.md:21, 30`); "carry on"
    (`work-local/.../SKILL.md:19`, `work-github/.../labels.md:95`,
    `issue-layout.md:61`, `EP/handoff/SKILL.md:10`); "lands in"
    (`work-notion/.../SKILL.md:3`); "touches", "touch"
    (`publish-docs/SKILL.md:3`, `merge-and-clean-up/SKILL.md:86`,
    `reset-to-remote/SKILL.md:11`, `acceptance-checker-brief.md:48`,
    `WHF/references/checklist.md:99`); "from scratch"
    (`handoff-verifier.md:69, 92`).
25. Sentences that tell the agent how to think:
    `LC/references/requirements-analyst-brief.md:31`;
    `handoff-verifier.md:38`; `WHF/SKILL.md:10`;
    `curating-project-memory/SKILL.md:16`.

## Notes

26. `dev/reviews/overlap-review.md` O1 says under 400 characters; the
    repository rule says under 500. Ten descriptions are 411 to 483
    characters. In a Salesforce project with Notion the 20 descriptions
    total 7,994 characters; Codex's list budget is 8,000 when the context
    window is unknown (`codex/build-skills.md:44-48`), and it cuts from the
    end, where the "Not for" clauses are.
27. The table of files is headed "Files" in five skills and "References" in
    four.
28. `LC/SKILL.md:65` says "main branch"; elsewhere "default branch".
29. Tracker differences the design does not explain: GitHub has no archive
    step; local and Notion add a "Sub-item created" row and GitHub does not;
    Notion does not say how to report a failed save; only Notion records
    who approved a design and when.
30. Two gotchas from `main` were dropped; confirm that was meant: one row
    per question when one message answers several; a sub-item has its own
    Questions and Answers.
31. `LC/references/design-architect-brief.md:44` differs from
    `designing.md:21` (as on `main`).
32. Whether a diagram needs a decision or a Changelog row is written
    nowhere.
33. `engagement/` is named in three Salesforce skill files; "Hitch-hiker"
    in `sf-deploy-check` is a figure of speech (the owner's text).
34. `DESIGN-SPEC.md:162` says the filing skill has templates in `assets/`;
    it has none.
35. The Codex Git paragraph is kept by hand in six skill files, not from
    `dev/build-shared/` (as on `main`).
36. `memory/AGENTS.md:18` says an Open decision is named under "Waiting on
    the owner"; no step adds that line.
37. "Where information goes" has no row for a fact about the client's
    business that is not a system rule.
38. `WHF/references/official-pages.md:16`:
    `https://github.com/openai/codex/releases` is in no source record.
    `checklist.md:82` "Claude Code does not read a root plugin.json": no
    captured page says so.
39. No file holds one map of every skill with its job, trigger, and "never
    does". The reviewer's map is in the orchestrator's records and on the
    owner's review page.
40. A closing item that both adds and delivers a rule needs two saves.
41. `handoff-verifier.md:52` misses a quoted `id:`.

## Ten requests that sit between two skills

| Request | Where the descriptions send it | Root table | Agree |
| --- | --- | --- | --- |
| "We decided to drop the export feature" | Filing or lifecycle | Lifecycle for one item; filing past one | Yes after the filing test (finding 5) |
| "Remember that the client's year starts in February" | `curating-project-memory` | Same | Yes |
| "Save this transcript" | Filing; unclear for one item | Filing | Unclear (finding 1) |
| "Close out WI-12" | Lifecycle | Lifecycle | Yes |
| "Update the security doc" | Filing and `publish-docs` | Filing | No (finding 2) |
| "Write this up as a rule for agents" | `writing-harness-files` and curating | Curating for "from now on" | No (finding 3) |
| "Add a task to phase 2 of WI-31" (Notion) | Notion tracker | Lifecycle | No (finding 4) |
| "Merge it" after approval | Lifecycle | Lifecycle | Yes |
| "What did we decide about the date format?" | Filing may match | No skill | Weak (finding 5) |
| "From now on, always run the tests before you ask me" | Curating; WHF also matches | Curating | Partly (finding 3) |

## Found clean

Structure of all 23 skills (frontmatter, names, description form and
length, index rows, file tables, no link leaving a folder, contents lists,
no script). No old skill name, removed folder, item `references/` folder,
or person's name. Only `filing-project-records` writes `DECISIONS.md`,
`sources/`, and `system/`. The three step names are worded the same in all
36 mentions. Template copies equal the project files.
`writing-harness-files`: 28 of 29 addresses match a source record, and the
checklist statements checked match the captured pages apart from findings
20 and 38.

## Status of the fixes

Open.
