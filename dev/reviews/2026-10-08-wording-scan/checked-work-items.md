# Wording scan check: the work item skill and the three work tracker folders

This file checks two findings files, `work-item-skill.md` and `work-tracker-folders.md`. I opened the cited file and line for every finding that I judge below.

How paths are written in this file:

- A path that starts with `SKILL.md`, `references/`, or `assets/` is in the skill folder `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/managing-work-items/`.
- A path that starts with `work-local/`, `work-notion/`, or `work-github/` starts at `plugins/toolkit/skills/project-setup/assets/`. In such a path, `references/` stands for `.claude/skills/managing-work-items/references/`, as in the tracker reader's file.
- `<setup>` is `plugins/toolkit/skills/project-setup/`.
- "The skill reader" wrote `work-item-skill.md`. "The tracker reader" wrote `work-tracker-folders.md`. The tracker reader numbered its findings 1 to 60, and I use those numbers.

## How reliable the readers were

### The work item skill (`work-item-skill.md`)

I checked both High findings and all 41 Medium findings. I did not check the Low findings, apart from the examples that the patterns use.

| What I checked | Count | Result |
| --- | --- | --- |
| High findings | 2 | Both problems are real. Both are Medium, and neither rewrite is safe as written. |
| Medium findings | 41 | 35 are real at Medium, 2 are real but Low, and 4 are not a problem. |
| Rewrites of the 37 real Medium and Low findings | 37 | 22 are safe to use. 2 findings have no rewrite, because the owner decides. 13 need work, and 6 of those 13 change a rule or break a string that another file reads. |

The skill reader finds real problems, so its list of places can be trusted. Its rewrites cannot be used without a check, because about one rewrite in three needs work, and half of those drop a rule, add a rule, or narrow a general rule to a list of cases. I checked every Medium finding in this area, so no unchecked Medium finding is left.

Two more facts about this findings file:

- The skill reader reviewed two files that are copies. `assets/work-item-template.md` and `assets/design-template.md` are byte-for-byte copies of `work-local/work-items/work-item-template/WORK-ITEM.md` and `DESIGN.md` (`dev/SKILL-INDEX.md:206-213`, and `dev/tools/check-skills.mjs:125-126` fails when they differ). `BRIEF.md` says to review the source only. So 8 of the 41 Medium findings are about text that the tracker reader also reviewed, and the two readers wrote different rewrites for the same lines. "Headings and layout" and "Findings that are not a problem" below say which rewrite to use.
- The counts in the Patterns section are often too high or too low. "Patterns" below gives the corrected counts.

### The three work tracker folders (`work-tracker-folders.md`)

I checked all 60 Medium findings. The reader reported no High finding, and I agree that none is High.

| What I checked | Count | Result |
| --- | --- | --- |
| Medium findings | 60 | 54 are real at Medium, 5 are real but Low, and 1 is not a problem. |
| Rewrites of the 59 real findings | 59 | 36 are safe to use. 18 need work, and 5 of those 18 state a wrong fact, add a rule, or break a heading or a string that another file reads. The 5 Low findings have rewrites that are safe, except finding 16. |

The tracker reader is reliable about where the problems are. I checked every Medium finding in this area too, so no unchecked Medium finding is left. The reader marked 12 rewrites "reading to confirm" or "needs the maintainer's yes". Those marks were honest: 3 of those 12 rewrites state something that the repository does not support (findings 9, 27, and 32). "Questions answered from the repository" gives the right reading for each.

## High findings

### `references/designing.md:23`, step 5 ("Settle how the design work will go")

Verdict: Wrong level, and the rewrite needs work. The level is Medium.

The problem is real. The step does not say what the agent settles. It is Medium because the same step gives the default ("two options that differ in approach ... with built-in mechanisms first"), so a reader who does not understand the first sentence still writes the right design.

The skill reader guessed that the step is about the number of options, and asked the owner to confirm. The repository answers this. Before the rewrite of 2026-10-06 (commit `4c5d3f9c`), the step read "Settle the way of working: at most one question, only when its answer changes the design." The first version of that step (in the tree before commit `6d293c03`, `dev/SKILL-INDEX.md:457`) named the two things that the question may be about: "one option or several; built-in mechanisms first or a specialized approach". So the step settles two things, and the reader's rewrite covers only one. The rewrite also changes "at most one question" to "one question", which removes the choice to ask nothing.

A better rewrite:

> 5. Decide how many design options to write, and whether to consider built-in mechanisms first. A built-in mechanism is one that the platform or the tool already provides. Ask the owner at most one question about these two points, and only when the answer changes the design. When you do not ask, write two options that differ in approach when the requirements leave a real choice, and consider built-in mechanisms first.

### `references/closing.md:68-70`, step 4 of "Filling the Moved up line"

Verdict: Wrong level, and the rewrite needs work. The level is Medium.

The problem is real. The step says "check that the main checkout holds each save" before it says what a save is, and it gives its purpose last. It is Medium because the two bullets under the step tell the reader exactly what to do in each case, so the reader acts correctly after a second read.

The skill reader asked the owner to confirm that "save" means the committed record. The repository answers this. `publish-docs` uses "the main checkout holds the save" as its own phrase (`.../publish-docs/SKILL.md:138-145`), and `filing-project-records/SKILL.md:74-78` uses the same phrase for a record that `publish-docs` committed. So the reading is right.

The rewrite keeps every rule except one: it drops the sentence that says what the main checkout is. A better rewrite keeps that sentence and keeps the word "save" once, because two neighbouring skills report it in that word:

> 4. Do this step only when the project keeps its work items as local files. Steps 5 and 6 write the IDs of records into the work item, and the command `.claude/hooks/validate-records.mjs` looks up each of those IDs in the main checkout. The main checkout is the project's main folder, which is the first path that `git worktree list` prints. With each ID, `filing-project-records` reports whether the main checkout holds the save, which is the commit that `publish-docs` made of that record.
>    - When the main checkout does not hold the save of a record, stop here, and tell the owner what `filing-project-records` reported. `filing-project-records` records in the project's Current State that the ID is still to be written in the work item.
>    - When the main checkout holds the save of every record, continue with step 5.

One point stays open. The file says "continue from this step". That can mean "go on", or it can mean "come back to this step later, when the main checkout holds the save". Both lead to step 5, so the rewrite above is safe.

## Patterns

### Patterns in `work-item-skill.md`

1. **The list of files is given three times.** Corrected count: 2. `SKILL.md:18-28` and `SKILL.md:30-41` are two halves of one list of 17 files. `references/lifecycle-rules.md:264-282` repeats 15 of those 17. The repeated text is 1,785 characters, and the reader's "about 5,000" is the size of both lists together (2,223 and 1,785). Examples: `SKILL.md:20`, `SKILL.md:36`, `references/lifecycle-rules.md:275`. Verdict: Confirmed. Deleting the table in `lifecycle-rules.md` is safe for the tools, because `check-skills.mjs:289` only requires that `SKILL.md` links every file. The same change must edit `references/lifecycle-rules.md:242` and `SKILL.md:20`, as the reader says.

2. **One sentence about Hindsight is repeated eight times.** Count confirmed: 8, plus the statement in `SKILL.md:14`. Examples: `references/closing.md:50`, `references/deploying.md:72`, `references/lifecycle-rules.md:254`. Verdict: the pattern is real, and it is Low, because no reader is confused by the repeat. The fix carries a risk. A Hindsight project has no `managing-project-memory` skill, and an agent that opens `closing.md` alone would no longer be told what to do in its place. The owner decides (question 4 below).

3. **The procedure for a small work item is in five files.** Confirmed, and the reader's numbers are too low. "Questions answered from the repository", point 3, gives the count.

4. **Definitions are repeated, with small differences.** Counts confirmed: "main checkout" 3 times (`references/building.md:134`, `references/deploying.md:55`, `references/closing.md:68`), "worktree" 2, "checker" 3, "head commit" 2. Verdict: Not a problem. The three definitions of "main checkout" say the same thing. Each reference file is opened for one State, and the standard asks for a word to be explained "when it first appears". A reader who opens `closing.md` first needs the definition there. Moving the definitions into `lifecycle-rules.md` would also add text to the one file that is read on every turn.

5. **"Item" alone is used for "work item".** Corrected count: about 40. `SKILL.md` has 10 (`SKILL.md:12` twice, `SKILL.md:22-28`, `SKILL.md:34`), the work item template has 25, the design template has 2, and three more are exact strings (`references/lifecycle-rules.md:171`, `references/testing-loop.md:62`, `references/building.md:47`). Verdict: Confirmed. The reader is right to keep the exact strings: `dev/evals/small-work-item-short-path/evals.json` reads them. The 27 uses in the two templates are in copies, so the change is made in `work-local/` and copied over.

6. **The owner is called "he" or "his".** Corrected count: 10 uses. Nine are in the two templates (`assets/work-item-template.md:33` twice, `:60` twice, `:128` three times and not four, `:133` once, `assets/design-template.md:39` once), and one is in `references/closing.md:91`. Verdict: Confirmed. The word list already decides this ("the owner", not "he"). "Questions answered from the repository", point 1, says which files change together for the two uses that are in the Next action form.

7. **"The flow" and "from start to finish" are used without a definition.** Corrected count: these are two different phrases. "The flow" is in 5 places (`references/testing-loop.md:28`, `:29`, `:32`, `references/design-critic-brief.md:47`, `references/requirements-analyst-brief.md:41`). "Explicit from start to finish" is in 2 places (`references/designing.md:18`, `references/design-architect-brief.md:41`). Verdict: the second phrase is a real Medium problem, and the reader's rewrite for it is safe. The first is Low: both helper briefs already say "as the person who uses the result" in the same sentence.

8. **Whole procedures sit in one numbered item.** Count confirmed: 6 places. Examples: `references/refining-requirements.md:37-59`, `references/refining-requirements.md:60-71`, `references/building.md:40-57`. Verdict: Confirmed. The reader's list of the files that cite "step 6" and "step 7" of `refining-requirements.md` is complete. I searched for every citation and found the same five (`references/designing.md:35`, `:45`, `references/testing-loop.md:34`, `references/closing.md:27`, `references/lifecycle-rules.md:177`), plus one inside the file itself (`references/refining-requirements.md:64`).

9. **The rule "no AI credit" is stated three times.** Count confirmed: 3 (`references/building.md:154-156`, `references/deploying.md:21`, `references/testing-loop.md:18`). Verdict: Not a problem. Two of the three are the three words "with no AI credit" inside a sentence. The reader's reason is also wrong: the rule `no-ai-attribution.md` is on the owner's own computer, and the starter project ships no such rule (its `.claude/rules/` folder holds nine rules, and none is about AI credit). In another owner's project these three places are the only statement.

10. **Very long single-line guide comments in the templates.** Corrected count: 6 comments are over 100 words, and not 10. They are `WORK-ITEM.md:19` (137 words), `:60` (112), `:99` (124), `:107` (169), `:128` (212), and `DESIGN.md:13` (107). The other four that the reader lists have 50 to 90 words and three to five sentences. Verdict: Confirmed for the six.

11. **The helper briefs repeat the same "Boundaries" text.** The reader says this is correct and must stay. I agree.

### Patterns in `work-tracker-folders.md`

1. **The same step is worded differently in the three folders.** Count confirmed: 5 places. Examples: `work-local/references/work-tracker-field-mapping.md:100`, `work-notion/references/work-tracker-database-layout.md:254`, `work-github/references/work-tracker-issue-layout.md:111`. Verdict: only the first of the five places is a problem for a reader. A project gets one of the three folders, so no reader ever sees two wordings side by side. The first place matters because the local wording points at the wrong work item ("Questions answered from the repository", point 2). One of the other four differences is correct as it is: the GitHub table has no row "A State and a Status that no longer match", because on GitHub the Status has no label and cannot differ from the State (`work-github/references/work-tracker-labels.md:19`).

2. **Hand-made work items have three names.** Count confirmed: 3 headings. Examples: `work-local/references/work-tracker-folders-and-files.md:162`, `work-notion/references/work-tracker-database-layout.md:336`, `work-github/references/work-tracker-issue-layout.md:153`. Verdict: real only inside the Notion folder, where "card" and "work item" both name a work item and "card" is explained once, at `work-notion/references/work-tracker.md:52`.

3. **The `work-tracker.md` files differ in structure.** Count confirmed: 3 differences. Verdict: one of the three is a real problem, and finding 46 reports it. The GitHub file has no "Steps" section, so the instruction to open `work-tracker-gh-commands.md` before the first `gh` call is only in the References table (`work-github/references/work-tracker.md:59`).

4. **Two names for one block, "header fields" and "front matter".** Corrected count: "front matter" 12 times and "header field" 13 times. Examples: `work-local/work-items/AGENTS.md:37`, `work-local/references/work-tracker-field-mapping.md:19`, `work-github/references/work-tracker-labels.md:3`. Verdict: Confirmed. The word list answers which name to keep ("Questions answered from the repository", point 9).

5. **Version history in instructions.** Count confirmed: 6. Examples: `work-notion/references/work-tracker-database-layout.md:242`, `work-notion/references/work-tracker-page-layout.md:37`, `work-github/references/work-tracker-issue-layout.md:111`. Verdict: Confirmed. The reader's fix is right: name what the reader can see, such as a "Done" checkbox, and keep the version in a bracket.

6. **Pointers that name a place without saying what is there.** The reader's count is "about 5". I checked the three examples, and all three are real: `work-local/references/work-tracker-project-roadmap-and-tasks.md:13`, `work-local/references/work-tracker-searching.md:18`, `work-github/references/work-tracker-issue-layout.md:42`. The same wording as the third example is at `work-github/references/work-tracker-issue-layout.md:128`, which the reader did not list.

7. **Word list rows not applied in the local templates.** Corrected counts: "item" alone 25 times in `WORK-ITEM.md`; "he", "his", or "himself" 9 times in the two templates; "original" for a source 3 times, all in `WORK-ITEM.md:145`. The counts for "chat" (1), "closing step" (2), and "moves up" (1) are right. Verdict: Confirmed.

8. **Very long guide comments in the templates.** Corrected count: 6, and not 5. The reader missed `WORK-ITEM.md:60` (112 words).

9. **Headings that name a made-up thing instead of the content.** The reader's count is 5 and gives three examples, which are real: `work-local/references/work-tracker-field-mapping.md:115`, `work-notion/references/work-tracker-page-layout.md:159`, `work-local/references/work-tracker-folders-and-files.md:19`. Verdict: Confirmed.

10. **"The party" for a person's side.** Count confirmed: 4 in these folders, and a fifth in `references/lifecycle-rules.md:121`. Two of the four are template prompts (`work-local/work-items/PROJECT-TASKS.md:9`, `work-github/references/work-tracker-project-roadmap-and-tasks.md:77`). Verdict: Low. The example that follows each use, `Sarah Chen (client)`, shows what is meant. The reader's rewrite, "the side the person is on", is vaguer than "party". A better wording is "followed by who the person works for, in brackets, such as `Sarah Chen (client)`".

11. **Names of the same columns differ.** Confirmed. `work-local/PROJECT-ROADMAP.md:19` says "Intended outcome" and "Exit condition", the same file says "Outcome" at `:25`, and a work item's phase table says "Outcome" and "Exit result" (`WORK-ITEM.md:53`). The owner decides (question 6 below), because the names are column headings in a file that existing projects hold.

12. **"id" and "ID" for two things.** Count confirmed: lower-case "ids" 6 times in the Notion files. Examples: `work-notion/references/work-tracker.md:25`, `work-notion/references/work-tracker-searching.md:19`, `work-github/references/work-tracker-gh-commands.md:55`. Verdict: Confirmed.

13. **Bold-label bullets.** The reader says this is not a finding. I agree.

## Files that need a rewrite

- **`references/designing.md`** (the skill reader: "needs a rewrite of steps 5, 10, 11"). I do not agree. Step 5 needs a rewrite, and "High findings" above gives one. Step 10 is long, but its three cases are in bold, and each case can be followed. Step 11 needs the small fix that the reader gives. The verdict is "small fixes".
- **`references/closing.md`** (the skill reader: "needs a rewrite of the Moved up steps"). I agree in part. Step 4 needs a rewrite. Steps 1, 2, 3, 5, and 6 of "Filling the Moved up line" can be followed as they are. The verdict is "small fixes, and a rewrite of step 4".
- **`work-local/work-items/work-item-template/WORK-ITEM.md`** (the tracker reader: "needs a rewrite (the guide comments only)"). I agree. Six guide comments hold 107 to 212 words in one paragraph each. The skill reader gave the copy of this same file the verdict "small fixes", so the two readers disagree, and the tracker reader is right. The rewrite must keep five things, which "Questions answered from the repository", point 1, explains.

## Headings and layout

The owner's test: a reader who sees the heading alone must know what the section holds.

| Proposed heading | Where | Passes? | A fuller heading |
| --- | --- | --- | --- |
| "Saving an answer" | `references/refining-requirements.md` | No. It does not say whose answer, or to what. | "How to save the owner's answer to a question" |
| "A change to an earlier answer or to an approved requirement" | `references/refining-requirements.md` | Yes | |
| "Words used in this skill" | `references/lifecycle-rules.md` | No. It does not say which words. I also judge the section not needed (pattern 4). | "What main checkout, worktree, checker, and head commit mean" |
| "Approving the design" | `references/designing.md` | Not fully. It does not say who acts. | "What to do when the owner chooses a design option" |
| "Merging under the standing merge instruction" | `references/deploying.md` | Only for a reader who already knows the term. | "When the owner's standing merge instruction allows a merge without a new yes" |
| "Links and closing summary" | the work item template | No. Moved up is not a summary, and "links" does not say to what. | See the first note below. |
| "Starting, ticking, and cancelling a task" | `work-local/references/work-tracker-field-mapping.md` | Yes | |
| "Levels, and how folders and fields agree" | `work-local/references/work-tracker-folders-and-files.md` | No. It does not say what they agree on. | "How a work item's level is counted, and the three places that show a sub-item's parent" |
| "A task with an empty Status" | `work-notion/references/work-tracker-database-layout.md` | Yes | |
| "A Tasks database that still has the old Status" | the same file | No. The reader cannot know what "old" means. | "A Tasks database that still has a "Done" checkbox or a Status of type select" |
| "A work item the owner made by hand in Notion" | the same file | Yes | |
| "Adding a line under Sources or Lessons not proven yet" | `work-notion/references/work-tracker-page-layout.md` | Yes | |
| "Steps for every read and every save" | `work-github/references/work-tracker.md` | Yes. The local and Notion files use the same heading. | |
| "Changing phases, tasks, and sub-items" | `work-github/references/work-tracker-issue-layout.md` | Yes | |
| "Reading one work item, one section, or a parent" | `work-github/references/work-tracker-searching.md` | Yes | |
| "Design changes while questions are answered" | `DESIGN.md:177` | No, and the rename is not safe. | See the second note below. |

Notes on the layout proposals:

- **The work item template, `:27-43`.** The finding is real: "Related items" and "Moved up" sit under `### Current state`, and the comment at `:29` says "the five lines under this heading" while seven labelled lines follow. No new heading is needed. The two lines can move up to sit directly after **Goal**, above `### Current state`. No tool reads their position ("Questions answered from the repository", point 1). The owner decides (question 2 below), because the Notion template has the same layout and every new work item gets the result.
- **`DESIGN.md:177`, "Design changes during the interview".** The tracker reader (finding 28) proposes a new name for this heading. Two files cite the heading by its exact words: `references/designing.md:37` and `references/design-critic-brief.md:21`. Designs that already exist also hold it. If the heading is renamed, a name that passes the test is "Design changes made while the owner answers the design questions", and both citing files and the skill's copy of the template change in the same change.
- **`references/designing.md`, moving the third case of step 10 into its own section.** I do not recommend this. Step 10 says "do the first of these three cases that fits". A reader must see all three cases together to find the first that fits.
- **`references/building.md`, moving the two Git sections to the end.** This is safe. Other files cite "Git for a build" and "Git writes in Codex" by name and not by position (`references/testing-loop.md:87`, `references/deploying.md:10`, `:63`). Joining "While the owner decides something" to "When the plan changes" puts a second subject in that section, so I would leave it.
- **`work-notion/references/work-tracker-database-layout.md`, the new section order (finding 39).** This is a choice of taste. The file has a contents list, and each procedure can be found from it. Only the split of the heading at `:242` is needed.
- **`references/lifecycle-rules.md` and `references/refining-requirements.md`** are being changed on another branch. Any layout change to them waits for that branch.

## Questions answered from the repository

1. **Does `validate-records.mjs`, `check-skills.mjs`, or any test read the headings or the field lines of the work item template?** Some of them, and the answer differs for each string.

   | String | What reads it | What follows for a rewrite |
   | --- | --- | --- |
   | `### Current state` (the heading) | No tool and no test. Two local references name it exactly: `work-local/references/work-tracker-field-mapping.md:43` and `work-local/references/work-tracker-searching.md:17`. In Notion the agent finds the heading "by its words" (`work-notion/references/work-tracker-page-layout.md:36`). | Keep the heading. The lines under it can be reordered. |
   | `**Moved up:**` (the label) | `validate-records.mjs:180` reads it with `/^\*\*Moved up:\*\*(.*)$/m`, anywhere in the file, for its check 14. Tests: `dev/tests/validate-records.test.mjs:55`, `:141`, and `dev/tests/validate-records-cases.test.mjs:111-121`. | The label must stay exactly, at the start of a line. Its place in the file is free. The prompt after it must stay one pair of angle brackets with no second pair inside, because the command removes the prompt with `/<[^<>\n]*>/` to see the line as empty, and the test at `validate-records-cases.test.mjs:112` checks this. |
   | `**Related items:**` (the label) | The same test, `validate-records-cases.test.mjs:111`, and about 20 shipped places that name the line, for example `.../filing-project-records/SKILL.md:66` and the starter `DECISIONS.md:19`. | The label must stay. Its prompt has the same one-pair rule. `<setup>references/one-home-layout.md:272` and `<setup>references/notion-build/work-setup.md:241` say that Moved up is "the line after Related items", so the two lines stay in that order. |
   | `**Next action:**` (the label) | The local board command (`work-local/references/work-tracker-searching.md:26`), the GitHub board command (`work-github/references/work-tracker-searching.md`, in "The board"), and `check-skills.mjs:441`. | The label must stay exactly, at the start of a line. |
   | "After his answer" (inside the Next action prompt) | `check-skills.mjs:438-447` compares the whole Next action prompt in `WORK-ITEM.md` with the one in `<setup>references/notion-build/work-item-page.md:9`. No tool matches the words "After his answer" themselves. | It can change to "After the owner's answer", as the word list asks. Four places change together: `work-local/.../WORK-ITEM.md:33`, the skill's copy `assets/work-item-template.md:33`, `<setup>references/notion-build/work-item-page.md:9`, and the example in `references/closing.md:91`. Work items that exist keep their old line, and nothing reads it. |
   | `## Overview` (the heading) | The GitHub command that finds an issue without the layout (`work-github/references/work-tracker-searching.md:101-109`), and `work-github/references/work-tracker-issue-layout.md:42`. | Keep it exactly. |
   | The comment that starts "Fill-in guide for a new work item", and the comment that starts "Sub-item form" | `work-local/references/work-tracker-field-mapping.md:174` and `:176` tell the agent to find each comment by those first words. | A rewrite of the comment at `WORK-ITEM.md:19` must still start with "Fill-in guide for a new work item". The skill reader's rewrite starts "Fill-in guide, delete it when you create the work item", which breaks this. |
   | The text of every other guide comment | Nothing. `validate-records.mjs` blanks the text of a comment and keeps its line breaks (`validate-records.mjs`, the function `lines`), so a comment may be split over several lines. | Free to rewrite. |

   One more copy exists. `<setup>references/notion-build/work-item-page.md:10-11` holds the Related items prompt and the Moved up prompt of the Notion template, written by hand, and no tool compares them. A rewrite of those two prompts in `WORK-ITEM.md` must be made there too. `<setup>references/notion-build/work-setup.md:239` replaces a differing Related items prompt in existing Notion projects at the next "update the toolkit".

2. **"A work item that changes level": which wording is right?** The Notion and GitHub wording is right. `<setup>references/earlier-versions.md:46` says which work items are converted: "every level-2 and level-3 work item that still has a phase". The steps in the local file also treat the work item as the sub-item ("Phases to a plain list (the work item is now a sub-item)", `work-local/references/work-tracker-field-mapping.md:102`). The local sentence at `:100` describes the parent instead ("has sub-items that still have phases"), so a reader would apply the steps to the parent. The tracker reader's rewrite, "is now a sub-item and still has phases", suggests that the work item changed level, which is the first case and not the second. A better wording, in the form of the GitHub file: "or a sub-item that was made before toolkit 0.8.0 still has phases".

3. **Is the small-work-item procedure really spread over five files, and how many cross-references does a reader follow?** Yes, five files hold a part of it: `references/lifecycle-rules.md:146-184` (the six steps), `references/refining-requirements.md:23` (one sentence), `references/building.md:47` (one bullet), `references/testing-loop.md:48-67` (one section), and `references/closing.md:104-120` (one section, with one more sentence at `:87`). The skill reader wrote "four files and nine cross-references". My count is higher:

   - A reader on the short path opens all five files, and also `references/work-tracker.md`, and `references/deploying.md` when something is merged.
   - The small-work-item text holds 15 pointers to another file, and about 20 pointers to another section of the same file.
   - Six of the 15 pointers go from one small-work-item text to another. These six would go away in one file. The other nine point to steps of the full path that the short path uses again, such as steps 1 and 2 of Refining Requirements, the build, and "Marking Done". Those nine would stay.
   - The three larger parts together are 76 lines. The section in `lifecycle-rules.md` is 4,364 characters of the 21,682 that are read on every turn.
   - The tests in `dev/evals/small-work-item-short-path/` name the sections, and `SKILL.md` must link a new file, or `check-skills.mjs` fails.

4. **`references/lifecycle-rules.md:215-216`: does this skill decide the line and `managing-project-memory` write it?** Yes. `.../managing-project-memory/references/current-state.md:62-66` says that a work item's line under "Now" is "Decided by `managing-work-items`", and `references/lifecycle-rules.md:254` gives the writing to `managing-project-memory`. The skill reader's rewrite is right and safe.

5. **`references/building.md:40-57`: are the seven cases in order?** No. The list is not a list in which the first case that fits wins. Cases 4, 5, and 6 are the owner's answers to the offer that case 2 makes, and case 7 is a rule for the time after case 5 or case 6. The skill reader's rewrite says "find the first case below that fits", which changes how the list works. A safe regrouping keeps every bullet word for word under two lead sentences: "First decide whether to make the offer" (the cases at `:42`, `:43`, `:47`, and `:57`), and "Then act on what the owner says" (the cases at `:48`, `:51`, and `:52`).

6. **`references/designing.md:43`: which list becomes the tasks?** The Build order of the option that the owner chose. `references/design-architect-brief.md:49` says "The Build order becomes the work item's tasks if the owner picks this option." The skill reader also says that "when it has none" has no case. That is wrong: a top-level work item from before toolkit 0.8.0 can have no phase (`<setup>references/earlier-versions.md:47`). Keep those words.

7. **`SKILL.md:12`: what is the "identification order"?** It is the line at `.../every-project/AGENTS.md:33`, in the section "Every session": "the work item the owner names, the one this branch or session is working on, the one the project's Current State names". The skill reader's rewrite still does not name the section. A better rewrite: "If it is unclear which work item the owner means, check in the order that the root `AGENTS.md`, section "Every session", gives: the work item the owner names, then the one this branch or session is working on, then the one the project's Current State names. When more than one work item is still possible, ask the owner which one."

8. **`references/design-critic-brief.md:48-52`: does the critic get the sections that it must check?** In part. The list of inputs does give the known misreading risks ("Misreading risks already known", `:24`), so the reader is wrong on that one. The reader is right on the other two: the critic gets neither "Sources and decisions that affect the build" nor "What exists today". The architect gets "What exists today" (`references/design-architect-brief.md:22`), and the critic does not. The fix is a change to a brief, so the owner decides (question 3 below).

9. **"Header fields" or "front matter"?** The word list keeps "front matter" (`dev/reviews/word-list.md`, section 3, "Words to leave alone": explain it at first use in a file the owner reads). The template itself says "front matter". "Header fields" is not on the word list. So use "front matter", explained once in each file, and add a row to the word list for "header fields". In the GitHub and Notion folders the fields are labels and properties, so those files should say "the fields in the front matter of the work item template".

10. **Finding 32, `work-notion/references/work-tracker-database-layout.md:61`: what are "the copy" and "a template"?** "The copy" is the project that setup copies from the shared "Project" template, and "a template" is that "Project" template. `<setup>references/notion-build/work-setup.md:91` says "A copy starts with no prefix", and `:330` says "The ID property has no prefix in a template ... Each project sets its own prefix after the copy". The tracker reader's rewrite says "The work item template has no ID", which is a different and wrong fact. A better rewrite: "A number that Notion assigns, shown with the project's own prefix, such as `WI-31`. Setup sets the prefix after it copies the project from the shared "Project" template. In that template, the ID has no prefix."

11. **Finding 27, `DESIGN.md:39`: what decides the number of options when the owner gave none?** `references/designing.md:23` decides it: two options that differ in approach, when the requirements leave a real choice. The tracker reader's rewrite adds a new rule ("weigh the size of the decision against the cost of designing each option"). Use the skill reader's rewrite of the same line instead: "Write as many options as were chosen for this design: the number the owner gave, when the owner gave one."

12. **Finding 40, `work-notion/references/work-tracker-page-layout.md:38`: what does the note say?** `<setup>references/notion-build/work-item-page.md:2` holds the note: text in "<>" says what to write there; replace it with real content, or delete it when there is nothing to write yet; delete the note too. A better rewrite: "The note tells the agent that text in angle brackets says what to write there, and to replace it with real content or delete it. `references/lifecycle-rules.md`, section "Rules that apply in every State", gives the same rule."

13. **Finding 11, `work-local/references/work-tracker-field-mapping.md:166`: how many forms of Next action are there, and where?** Three. They are in the prompt after `**Next action:**` at `WORK-ITEM.md:33`, and not in a guide comment as the reader's rewrite says. `.../rules/keep-work-item-current.md` also says "the three forms of Next action". A better rewrite: "Write Next action in one of the three forms that the template's Next action prompt gives: working, waiting, or finished or cancelled."

14. **Finding 48, `work-github/references/work-tracker-issue-layout.md:42`: what is the template's file name?** `assets/work-item-template.md`, and not `WORK-ITEM.md` as the reader's rewrite says. A GitHub project has no `work-items/` folder. The same wording at `:128` means `assets/design-template.md`.

15. **Finding 50, `work-github/references/work-tracker-issue-layout.md:76`: swap the label or remove it?** `work-github/references/work-tracker-labels.md:22` says "No label means `none`". So the label follows the work item's `waiting_on`. A better rewrite: "After the owner's last open question is answered, change the label to match the work item's `waiting_on`: swap `waiting-on:owner` for `waiting-on:agent` when you continue the work, and otherwise remove `waiting-on:owner`."

16. **Finding 55, `work-github/references/work-tracker-labels.md:30`: what does "counts as the owner's word" lead to?** The reader's reading is right. `work-github/references/work-tracker-labels.md:19` says which State a closed issue has, and `references/closing.md:135-142`, "Done or Cancelled by hand", gives the steps. The rewrite should end with a pointer to that section.

17. **Finding 21, `work-local/references/work-tracker-searching.md:54`: where is "No phase"?** In the agent's report of the tree. The GitHub file says the same about a listing (`work-github/references/work-tracker-searching.md:73`). The reader's rewrite is right.

18. **Finding 23, `work-local/references/work-tracker-project-roadmap-and-tasks.md:13`: where does `publish-docs` find `<default>`?** In step 2 of that skill (`.../publish-docs/SKILL.md:22`: "`<default>` is the name of the default branch. Step 2 finds it."). The rewrite can name the step.

## Questions only the owner can answer

1. **One file for a small work item?** The steps for a small work item are in five files of the work item skill, and the agent follows 15 pointers between files to do one. Do you want the steps gathered in one new file? If yes, six of the pointers go away, three sections move, and the tests for small work items change with them. If no, nothing changes. Two of the five files are being changed on another branch now, so the change would wait for that branch in either case.

2. **Where do "Related items" and "Moved up" sit in a work item?** In every work item, these two lines sit under the heading "Current state", but they are not part of the five Current state lines. Do you want them moved up, to sit directly after the Goal? If yes, the template for local files, the Notion template, and the GitHub issue layout change, and only new work items get the new order. If no, the comment that says "the five lines under this heading" gets a small fix instead.

3. **What does the design critic get to read?** The helper that checks a draft design is told to check the design's table of sources and what the design says exists today. The main agent does not send it either section. Do you want the agent to send those two sections to the critic, or do you want those two checks taken out of the critic's instructions?

4. **Say the Hindsight sentence once, or keep it in eight places?** The work item skill tells a Hindsight project eight times, in five files, to follow the Hindsight rule in place of the memory skill. Do you want it said once at the top of the skill and removed from the eight places? If yes, the files get shorter, and an agent that reads only one of those files no longer sees the sentence. If no, the eight sentences stay.

5. **Does the design template ask for the same steps twice on purpose?** The design template asks for the build steps in two places ("Build order" in each option, and "Technical sequence" in the build plan). It also asks for the user's steps in two places ("End-to-end behavior" and "End-to-end flow"). Do you want the chosen design to keep its own second copy of each list, or to use the chosen option's lists?

6. **One pair of column names for a phase?** The project's roadmap file calls two columns "Intended outcome" and "Exit condition". A work item's phases, and the project phases on GitHub and in Notion, call the same two things "Outcome" and "Exit result". Do you want the roadmap file to use "Outcome" and "Exit result" too? Only new projects would get the new names.

7. **A count in the design template.** The design template asks for "Three to five plain-language sentences" about each option's approach. Do you want to keep that count, or let the agent judge the length?

## Findings that are not a problem or have an unsafe rewrite

### From `work-item-skill.md`

Not a problem:

- `references/lifecycle-rules.md:194`. The sentence before it says to keep a change that the owner made by hand. A State and a Status that no longer match is the one hand-made change that the agent does not simply keep. So the reader can tell what the exception is to.
- `references/testing-loop.md:64`. The sentence states one general rule ("Wherever this skill names the checker's verdict ..."). The owner asked on 2026-10-08 for the general rule and no sentence for each case, and this text was cut down for that reason in version 0.9.15. The rewrite is also unsafe: its list of places leaves out `references/closing.md:27` and `references/closing.md:91`, which both name the checker's verdict.
- `references/closing.md:99`. The reader describes "one sentence of 70 words". The bullet holds three sentences, and the longest has about 33 words.
- `assets/work-item-template.md:41`. This is a prompt in a template, and `BRIEF.md` says that the blank prompts are not findings.
- Patterns 4 and 9, as "Patterns" above says.

Wrong level, Low:

- `references/building.md:63`. The sentence already names the four things the tools must do. The rewrite is safe and puts the check first.
- `references/closing.md:45-48`. Each of the four sentences holds one idea. The rewrite joins two of them into one sentence with three ideas, so I would not use it.

Real, but the rewrite is unsafe or needs work:

- `references/designing.md:23` and `references/closing.md:68-70`. See "High findings".
- `references/lifecycle-rules.md:8`. The rewrite turns "Never write those three places, or such an ID, with this skill" into "This skill does neither of these things". The first is a prohibition, and the second is a statement. Keep "Never": "The skill `filing-project-records` writes those three places. It also writes into a work item the ID of a decision, a rule, or a source. Never write those three places, or such an ID, with this skill." See also "What the readers missed", point 1.
- `references/lifecycle-rules.md:177`. The rewrite is safe. Add "of the short path" after "step 2", because the sentence also names a step of another file.
- `references/designing.md:43`. Keep "or becomes its phases when it has none" (point 6 above). The safe part of the rewrite is "Put the Build order of the selected option into the work item's plan."
- `references/building.md:40-57`. The rewrite turns the list into a first-match list (point 5 above).
- `references/building.md:57`. The rewrite adds a rule that the file does not hold ("weigh the size of the remaining tasks against the cost of asking the owner again"). A rewrite that only marks the judgment: "Make no new offer, unless the owner asks about agent delivery, or the work has grown a lot since the owner answered. Use your judgment to decide whether it has."
- `references/building.md:92`. The rewrite hangs the reason on the wrong half of the item. The reason explains why every permission must be in the starting prompt. A better rewrite: "every permission the session needs, because a session will not let a later message from another session remove a limit that its own starting prompt set. Give only permissions that the owner or the project already gave;"
- `references/closing.md:50`. The rewrite removes the Hindsight sentence from this place. That is safe only if the owner says yes to question 4.
- `references/closing.md:102`. The section "Leftover branches and worktrees" holds an offer and a question, and the rewrite names only "the question". A better rewrite: "End the report with the offer and the question that "Leftover branches and worktrees" below gives. When that section finds nothing to offer or to ask, end with "Tell me the next thing to build.""
- `assets/work-item-template.md:19`. The rewrite changes the first words of the comment, which another file reads (point 1 above). It also drops "as `managing-work-items` says".
- `assets/work-item-template.md:27-43`. The proposed heading fails the heading test ("Headings and layout").
- `references/refining-requirements.md:37-59`. The finding is right, and the proposed heading "Saving an answer" fails the heading test.

### From `work-tracker-folders.md`

Not a problem:

- Finding 39 (the section order of the Notion database file). See "Headings and layout".

Wrong level, Low:

- Finding 16. "Each ID you are about to use" is clear enough. The rewrite narrows the rule to IDs in a `parent:` line, a list of sub-items, or a link, which the file does not say. A rewrite that keeps the rule: "Also check that a file holds each work item ID that you are about to use. When no file holds an ID, that work item is missing, and "Findings that need the owner" below says what to ask."
- Findings 20 and 45. The sentence is clear. The rewrite only splits it, which is safe.
- Finding 35. The "Done" checkbox is named two lines above, at `:246`.
- Finding 60. The sentence is an example of how Codex blocks a write. The rewrite is safe.

Real, but the rewrite is unsafe:

- Finding 3 (`WORK-ITEM.md:19`). The rewrite gives no first line. The comment must still start "Fill-in guide for a new work item" (point 1 above). It also drops the sentence that says what text in angle brackets is.
- Finding 27 (`DESIGN.md:39`). The rewrite adds a rule (point 11 above).
- Finding 28 (`DESIGN.md:13` and `:177`). The rename of the heading breaks two citations ("Headings and layout").
- Finding 32. The rewrite states a wrong fact (point 10 above).
- Finding 48. The rewrite names the wrong file (point 14 above).

Real, and the rewrite needs a small fix:

- Finding 1 (`WORK-ITEM.md:128`). Three slips. "A stable Q-ID" became "a Q-ID that is never reused": write "a Q-ID that never changes". "The moment the owner answers" became "When the owner answers": write "As soon as the owner answers". "A decision more than one work item needs is an entry in `DECISIONS.md`" became "file it as an entry in `DECISIONS.md`", which tells the agent to write a file that only `filing-project-records` writes: keep the statement.
- Finding 2 (`WORK-ITEM.md:107`). "The words of the owner, or of the stakeholder or source that asked for it" became "the words of the person who asked for it". A source is not a person. Keep "or of the stakeholder or source".
- Finding 5 (`WORK-ITEM.md:151`). The rewrite says the agent "writes the owner's answer at the end of the lesson's line". `references/closing.md:71-75` says that the agent writes one of four fixed outcomes there. Keep "the outcome". See also "What the readers missed", point 4.
- Finding 9. See point 2 above.
- Finding 11. See point 13 above.
- Finding 14. The heading fails the heading test.
- Finding 15. A parent's list of sub-items names the sub-item, and not the parent. A better rewrite: "**Folders and fields show the same parent.** The folder that a sub-item is in, the sub-item's `parent:` line, and the parent's list of sub-items must all show the same parent for that sub-item."
- Finding 31. "Never write the content of a real work item into a template" does not cover a real work item that is added as a row to the "Project" template. A better rewrite: "Never put a real work item, phase, or task, or its content, into a template."
- Finding 33. The rewrite covers only a sub-item that used to be top-level. A sub-item from before toolkit 0.8.0 also had phases. A better rewrite: "A sub-item has no phases of its own. The only phases that a sub-item can be linked to are phases that "A work item that changes level" set to Cancelled."
- Finding 34. The second heading fails the heading test.
- Finding 40. See point 12 above.
- Finding 47. The rewrite says "On GitHub these are the header fields", but they have that name in every folder. Use the answer in point 9 above.
- Finding 50. See point 15 above.

One finding I could not settle from the repository: finding 6 (`WORK-ITEM.md:99`, "for a reason a later reader could not see"). No other file states the rule for when a change gets a Recent History row. The reader's reading is the natural one.

## What the readers missed

1. **Two files disagree on which skill writes a record's ID into a work item.** `references/lifecycle-rules.md:8-9` says that `filing-project-records` writes the ID, and "Never write ... such an ID, with this skill". `references/closing.md:68` says that steps 5 and 6 of this skill "write those IDs into the work item". `.../filing-project-records/references/update-system-doc.md:49` says "`managing-work-items` records the rule IDs in the work item", and `.../filing-project-records/references/record-decision.md:41` says "Write the IDs in each work item under Affects, with `managing-work-items`". A reader cannot tell who writes the ID. This is a contradiction in the rules, and not only a wording problem. `lifecycle-rules.md` is being changed on another branch, so check that branch first.

2. **The tracker references name their own skill as if it were another skill.** The three tracker folders hold 24 sentences such as "the values that `managing-work-items` gave you" and "The table in `managing-work-items` gives it", in 7 files. Examples: `work-local/references/work-tracker-field-mapping.md:31`, `work-notion/references/work-tracker-database-layout.md:121`, `work-notion/references/work-tracker-database-layout.md:152`. These files are now reference files inside `managing-work-items`, so a stranger looks for a second skill that does not exist. Each sentence should name the file that holds the thing, which is `references/lifecycle-rules.md` in most cases. The readers reported three single cases of this (`references/deploying.md:24`, `work-notion/references/work-tracker.md:52`, `work-github/references/work-tracker.md:24`) and did not report the pattern.

3. **The same template text is kept in three places, and the readers reported two of them as separate files.** The source is `work-local/work-items/work-item-template/`. The skill's `assets/` folder holds a copy that a tool compares. `<setup>references/notion-build/work-item-page.md` holds a third version, written by hand, of which a tool compares only the Next action prompt. A rewrite of the template must start from the source, be copied to the skill, and be carried into the Notion text by hand.

4. **The template and `closing.md` disagree on what happens to a lesson.** `WORK-ITEM.md:151` says that closing asks the owner "whether each one moves up or is dropped". `references/closing.md:53` gives the owner three choices (keep it for the whole project, keep it as not proven, or drop it), and `references/closing.md:71-75` gives four outcomes. The comment in the template should give the three choices.

5. **A sentence about the owner's decision is true only for this owner.** `references/testing-loop.md:82` says "The owner decided this rule on 2026-09-28." The file is copied into every project, and in another owner's project that owner decided nothing on that date. The skill reader reported the dates as history and kept "The owner decided". A wording that is true in every project: "The checker runs before every result approval, whoever built the change. The one exception is a small work item that takes the short path."
