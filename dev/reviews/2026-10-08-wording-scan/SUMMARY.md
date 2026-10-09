# Wording scan of the shipped instruction files: summary for the owner

This file sums up the wording scan of 2026-10-08 (work item TKV-50) for Mike, the owner. It says what the scan found across the toolkit, what a second set of agents confirmed or threw out, what could go wrong if the findings are fixed carelessly, and the order in which the fixes should be made. The decisions that need the owner are in `DECISIONS-FOR-THE-OWNER.md` in this folder. The same text went to the Main Orchestrator session on 2026-10-09, and "Decisions that wait for the owner" below lists the decisions by subject.

## What was done, and what has not been checked

Seven reader agents each read one area of the shipped files twice.

- **Pass 1** asked: can a reader who is new to the project follow this text? The brief is `BRIEF.md`. The readers reported 7 High, 402 Medium, and about 440 Low findings.
- **Pass 2** asked: does this text state the owner's process, or does it script how the agent thinks? The brief is `BRIEF-PROCESS-NOT-BEHAVIOR.md`. The readers reported 117 places, and marked 99 of them "borderline".

Three checker agents then opened the cited file and line for all 7 High findings and all 402 Medium findings of pass 1. Their files are `checked-work-items.md`, `checked-project-and-memory.md`, and `checked-setup-and-salesforce.md`.

Three things have not been checked:

- **No second agent has checked pass 2.** The 117 places are one reader's opinion each.
- **The Low findings of pass 1** were checked only by sample (about ten in each of two areas).
- **The headings that the files have today** were not tested against the fuller heading rule of 2026-10-08. The checkers tested only the headings that the readers proposed. A count on 2026-10-09 found 1,227 headings in the 160 shipped Markdown files. 389 of them are one or two words long, and about 390 are named in quotes by another file, a hook, or a test. `headings-and-citations.txt` in this folder lists them. The count of citations is rough, because a common word such as "Status" is also quoted for other reasons.

The readers read the files as they were at version 0.9.20. Since then, versions 0.9.21 and 0.9.22 changed 17 shipped files, among them the starter root `AGENTS.md`, the output style, `lifecycle-rules.md`, `saving.md`, and `hindsight-on-vps.md` (141 lines). The findings in those files must be read against the current text before a fix.

## What is true across the toolkit

1. **A reader who is new to the project can follow almost every file, but often only on a second read.** After the check, 2 findings are High: a reader would likely do the wrong thing. 398 of the 409 checked findings are real.
2. **The rules are right. The trouble is how the text is packed and named.** The same few problems repeat in every area: too many instructions in one bullet or table cell, a word that is used before it is explained, several names for one thing, a heading that does not say what its section holds, and a pointer that the reader cannot follow.
3. **Most of the text states the owner's process.** Every pass 2 reader wrote that its area is mainly steps, places, record forms, exact words, and protections. Of the 117 places that may script the agent, the readers were sure of 18.
4. **The readers' list of places can be trusted. Their rewrites cannot be used without a check.** 89 of the 398 rewrites need work, and some of them drop a rule, add a rule, or break a string that a test compares.
5. **The scan also found places where two files state different rules.** These are not wording problems. "Places where two files disagree about a rule" lists them.

## The two findings that are High

| Where | What is wrong | The checker's verdict |
| --- | --- | --- |
| The skill `pull-latest`, `SKILL.md:31-33` | One sentence gives an exception to "Stop", sends the reader to two later steps, and uses "your own worktree" with no explanation. The exception comes after the list that says "Stop", so a reader is likely to stop too early. | High. The reader's rewrite is safe with one added clause. |
| `project-setup`, `references/update.md:230-264` | Two tables list the old and the new names of skills. The first table shows two current skill names as old folders. A reader who acts on it lists current skills for removal, or renames them to retired names. | High. The reader's one table is safe when the writer does four more things that the checker lists. |

The other five findings that a reader marked High are real, and the checkers lowered each to Medium.

## What the checkers confirmed, lowered, or threw out, by area

| Area | Checked | Real | Not a problem | Rewrites that need work |
| --- | --- | --- | --- | --- |
| The work item skill | 2 High, 41 Medium | 39 | 4 | 13 |
| The three work tracker folders | 60 Medium | 59 | 1 | 18 |
| The files every project gets | 3 High, 65 Medium | 67 | 1 | 21 |
| The memory folders and the Notion tools | 1 High, 56 Medium | 54 | 3 | 11 |
| Setup, part one | 63 Medium | 63 | 0 | 11 |
| Setup, part two | 1 High, 37 Medium | 38 | 0 | 5 |
| The Salesforce files, `writing-harness-files`, and the plugin files | 80 Medium | 78 | 2 | 10 |
| Total | 7 High, 402 Medium | 398 | 11 | 89 |

What the checkers threw out or corrected:

- **11 findings are not a problem.** Examples: a sentence that states one general rule, which is the form the owner asked for on 2026-10-08; the word "holds", which is an ordinary word; and four messages of `validate-records.mjs` whose words a test compares.
- **34 findings have a level that is too high.** Five were High and are Medium. The rest were Medium and are Low.
- **Two verdicts of "needs a rewrite" do not stand.** `designing.md` and `notion-build/work-setup.md` need small fixes, and not a rewrite.
- **Several patterns do not stand.** Explaining "main checkout" again in each reference file is correct, because each file is opened alone. "With no AI credit" in three places is correct, because the starter project ships no rule for it. The heading "Mistakes to avoid" stays, because the word list chose it and ten skills use it.
- **Many counts were wrong.** The checkers counted each pattern again with a search. This file uses the checkers' counts.
- **The readers' brief had two mistakes.** It named a skill, `sf-architect-solutioning`, that the toolkit does not ship. It did not say that the three `sf-*` skills are the owner's own text, so one reader proposed rewrites for 18 findings in them.

## The patterns that repeat across the areas

The counts are the checkers' counts.

| Pattern | Where and how often |
| --- | --- |
| Many instructions in one bullet, one numbered item, or one table cell | Setup, part one: 47 bullets with four or more sentences, and 22 table cells with three or more. Setup, part two: 46 bullets. The work item skill: 6 numbered items that each hold a whole procedure. The work item template: 6 guide comments of 107 to 212 words. The memory record template: one comment of 2,354 characters. The files every project gets: 5 procedures in a table cell or in the wrong section. This is the strongest pattern. |
| A word that is used before it is explained, or is never explained | `ntn`, Notion's command-line tool, is on 57 lines in 6 setup files, and one table says what it is. "Master manifest" is never explained. The Salesforce files have 6 made-up words with no explanation. `pull-latest` never explains "your own worktree". |
| Several names for one thing | The project's main folder has five names (182 uses of "main checkout", which the word list keeps, and 37 uses of four other names). "Header" and "front matter" both name the block of fields at the top of a file (26 and 21 uses). "Tracker" has two meanings on 7 lines of the Salesforce files. "Item" alone stands for "work item" about 40 times. The owner is "he" or "his" 10 times, and "the user" 10 times in the output style. |
| A heading that does not say what its section holds | Of the headings that the readers proposed, about 60 fail the owner's test of 2026-10-08 (22 of them in one file), and the checkers wrote a fuller heading for each. Headings that fail in the files today include "What must stay true" in six folder guides, 22 bold labels in `one-home-layout.md`, and "Step 1" to "Step 4" in `sf-component-tracker`, which are not steps in order. |
| A label and a colon in place of a sentence | 13 steps in 4 of the skills every project gets, about 19 list items in the Salesforce files, and 6 lines of the Hindsight rule. |
| A pointer that the reader cannot follow | 15 pointers in setup, part one, that depend on position, such as "step 1 below at its step 5". 14 in setup, part two. 8 lines in the Salesforce files that point to a thing no project has. 24 sentences in the tracker references that name their own skill as if it were another skill. |
| History that the reader cannot use | 6 places in the tracker folders, 4 in setup, part two, 3 in the memory folders, and 4 lines in the Salesforce files about "the project this was built in". One sentence, "The owner decided this rule on 2026-09-28", is true only in the owner's own projects. |
| The same text in several places | The paragraph about the Codex sandbox is in 5 skills. One sentence about Hindsight is in the work item skill 8 times. A list of the skill's files is in `lifecycle-rules.md` a second time, in the file that is read on every turn. The steps for a small work item are in 5 files with 15 pointers between them. The work item template is kept in three places, and a tool compares only two of them. |

## The files that need a rewrite

| File | What needs a rewrite | Note |
| --- | --- | --- |
| The skill `pull-latest` | Steps 1 and 2 | It holds one of the two High findings. |
| `project-setup`, `references/update.md` | The two parts "Retired skills" and "Renamed skills" | It holds the other High finding. The rest of the file needs small fixes. |
| The work item template, `WORK-ITEM.md` | Six guide comments | The comment at line 19 must still start with "Fill-in guide for a new work item", because another file finds it by those words. The change is made in three places. |
| The memory record template, `project_topic_template.md` | The comment on line 20 | The same rules are also in the memory skill. The owner decides which one holds them. |
| The Hindsight rule, `hindsight-memory.md` | Its layout: 17 bullets under no heading | Every rule in it is right. It loads in every session and is already over its proposed size. |
| The starter root `AGENTS.md` | Its layout only | Its sentences are clear. Six things cannot be found from its headings. A changed heading rebuilds this file in every existing project. |
| The skill `sf-component-tracker` | The whole file | It is the weakest file by the standard. It is the owner's own text. |
| `closing.md` of the work item skill | Step 4 of "Filling the Moved up line" | The other steps can be followed. |

## Text that may script the agent: the 117 places of pass 2

| Group | Places | Of which the reader was sure | Examples |
| --- | --- | --- | --- |
| A list or table of situations, where one general rule would cover them | 34 | 2 | The five times to check for changes made by hand; nine situations that need a manual deploy step; five things to file at a handoff |
| A number where the agent could judge | 30 | 12 | "Three to five sentences" for a design approach; "six months" before a fact is checked again; "more than three findings"; "two rounds" before a dispute goes to the owner |
| One of the owner's phrases, and what it means or starts | 22 | 2 | "ship it" is the owner's yes; "toolkit v2" alone means an update; "remember this" in the Hindsight rule |
| A line that says how to weigh or what to assume, or that tells the agent to do what it would do anyway | 31 | 2 | "Read for what the owner means"; "When unsure, add the step"; "Do not invent gaps"; "Run each command alone" |

What the readers found about trigger words:

- **The reminder hook `prompt-reminder.mjs` passes.** Each of its phrase groups only adds a hint, and the starter root `AGENTS.md` states the general goal. These are the owner's "insurance trigger words".
- **The Hindsight rule is the one clear failure.** Three of its rules start from a quoted phrase ("remember this", "forget that", "clean up memory"), and the file never states the general condition.
- Every other phrase list states its general condition in the same place, or is a list of exact words that the agent says to the owner.

The numbers that every reader passed, such as the limits of Claude Code, Codex, Notion, and GitHub, the forms of IDs, and the waits that stop a loop, are listed at the end of each file named `<area>-process-not-behavior.md`.

## Places where two files disagree about a rule

The readers and checkers met these while they read. None was searched for, so there may be more.

| Where | The two statements |
| --- | --- |
| The work item skill and `filing-project-records` | `lifecycle-rules.md` says that `filing-project-records` writes a record's ID into a work item, and "Never write ... such an ID, with this skill". `closing.md` and two files of `filing-project-records` say that `managing-work-items` writes it. |
| The work item template and `closing.md` | The template says that closing asks whether a lesson "moves up or is dropped". `closing.md` gives the owner three choices. |
| The design critic's brief | The brief tells the critic to check two sections of the design. The main agent sends the critic neither section. |
| `sf-component-tracker`, lines 136 and 172 | One line says to add columns to match the project's orgs. The other says to ask the owner before adding a column. |
| `sf-component-tracker` and its two templates | The skill gives a manual step three phases: Pre-deploy, Deploy, and Post-deploy. The templates have two. |
| `salesforce-delivery.md` and `sf-component-tracker` | The rule says "Never write a record into a template". The project's live master manifest is kept in a folder named as a template. |
| The permissions runbook | It points three times to a research file that no project has. It also asks for setup steps that no file of `project-setup` gives. |
| `salesforce-project.md` | It says that Salesforce's official skills "are installed for this project". Setup only checks for them and gives the owner the command. |

Two of these disagreements are settled since the scan:

- The output style said "Stop after the answer" while nine skill lines end a reply with the words that continue the work. Version 0.9.22 added a sentence to the output style that allows those lines.
- Which skill writes a record's ID into a work item (the first row of the table). Phase P2 of the cohesion audit (TKV-43, version 0.9.24, pull request 51) gave the rule one place: `filing-project-records/SKILL.md`, section "Writing a record's ID in a work item". The other three files now agree with it.

## Rules that the cohesion audit gave one place, and text that it will still move

The session of the cohesion audit (TKV-43) reported this on 2026-10-09. A fix from this scan rewrites each of these rules once, in the file that holds it, and leaves the other files as pointers. Paths start at `plugins/toolkit/skills/project-setup/assets/every-project/`.

| Rule | The file that holds it | Files that point to it |
| --- | --- | --- |
| When a standing merge instruction counts as the owner's yes | `.claude/skills/managing-work-items/references/deploying.md`, "What a merge into the default branch needs" | `.claude/rules/shared-repository-work.md`, and `references/lifecycle-rules.md`, stop 4 |
| Which deploys need the owner's yes | `references/lifecycle-rules.md`, "When to stop for the owner's yes", stop 5 | `references/deploying.md`, and "Ask the owner first" in the root `AGENTS.md` |
| Which skill writes a record's ID into a work item | `.claude/skills/filing-project-records/SKILL.md`, "Writing a record's ID in a work item" | `references/lifecycle-rules.md`, `references/closing.md` step 4, and `update-system-doc.md` step 6 |
| Which edits the commit skill saves | `.claude/skills/publish-docs/SKILL.md`, step 1 | `reference/AGENTS.md`, step 4, keeps its own rule with no reason. Ask the owner for the reason when that file is fixed. |
| How a question and a choice are written to the owner | The root `AGENTS.md`, "How to write a question to the owner" (version 0.9.22) | The output style |
| The reply lines after a save | `managing-project-memory/references/saving.md`, "Reply lines" | |

Phase P2 also changed `.claude/rules/memory-review-and-save.md`, the section "Which skill to use" in the guides of `work-items/` and `memory/`, the `description` in the three Codex hook snippets, and `references/update.md`, "Old hook entries". The findings in those files must be read again.

Two phases of the audit will still move text:

- **Phase P3** moves the form of the project's Current State, and the steps for an owner's standing instruction, to one place that every project gets. It touches `current-state.md`, `saving.md`, the Hindsight rule, and the `CURRENT_STATE.md` template. The memory area of this scan is fixed after P3.
- **Phase P4** shortens the starter root `AGENTS.md` and splits `lifecycle-rules.md`. The audit session starts P4 only after it has seen the findings of this scan. The work item skill and the root guide are fixed together with P4.

## What could go wrong if the findings are fixed carelessly

The owner asked on 2026-10-08: "make sure that nothing i asked for would get us into trouble".

1. **A rewrite could make the agent worse, and today nothing would show it.** The live tests at version 0.9.18 passed 1 of 9 and 5 of 36. Until they give a clean result, a fix that changes what an instruction says cannot be measured.
2. **A line that looks like scripting may be a protection.** Some pass 2 text was added after a live test failed without it. For many of the 117 places the reader wrote "cannot tell" what the text protects. Nothing is removed on a reader's word.
3. **A reader's rewrite can change a rule.** 89 rewrites need work. Examples: one turns a list into "use the first case that fits", which changes how the list works; one drops a rule about links; one adds a rule the file does not hold.
4. **A rewrite can break a test or a tool.** Eight rewrites of the starter root `AGENTS.md`, the hook messages, and the Codex hook description fail a test as written. `check-skills.mjs` reads three sentences in the setup files word for word. `validate-records.mjs` reads the labels `**Moved up:**`, `**Related items:**`, and `**Next action:**`.
5. **A renamed heading has costs outside its file.** "Where information goes" is cited on 24 lines in 17 files, in the prompt hook, and in a test. "Every session" is printed by the session-start hook. Any changed, moved, or added heading in the starter root `AGENTS.md` makes "update the toolkit" rebuild that file in every existing project.
6. **The fuller heading rule, read word for word, reaches far more headings than anyone meant.** Of the 389 headings of one or two words, most are one of three kinds: a section of a record template that tools and other files find by its name, such as "Overview", "Requirements", and "Current state"; a section name that every skill uses the same way, such as "Contents" (47 files), "References", and "Steps"; and a section of a helper agent's brief, such as "Your job" and "Boundaries". Renaming those would change every work item layout and many citations, and would make nothing clearer. Decision 13 asks where the rule stops.
7. **Fuller headings and whole sentences make files longer.** That is what the owner asked for on 2026-10-06, and it has limits in three places: the four hook commands are each at their approved number of lines, the Hindsight rule is over its proposed size, and the starter root `AGENTS.md` is 23,477 bytes of an allowed 24,576.
8. **Some text is the owner's own and changes only with his yes to the exact words.** This covers the writing rule, the rule `evaluate-the-owners-request.md`, "Your job as the agent", `salesforce-org-safety.md`, `salesforce-agent-permissions.md`, and the three `sf-*` skills.
9. **Some text exists in more than one place, and no check compares every copy.** The work item template is in the local folder, in the skill, and, by hand, in the Notion build text. The test fixtures under `dev/evals/fixtures/` hold copies of starter files.
10. **The project's own checklist pulls against the owner's request.** `dev/reviews/wording-review.md`, check W5, tells a writer to say "what to weigh". The owner asked on 2026-10-08 for text that states the goal and does not tell the agent how to think.
11. **Other sessions change the same files.** The cohesion audit (TKV-43, phase P4) will shorten the starter root `AGENTS.md` and the work item skill. The Salesforce session has two pieces of work open on the Salesforce files.

## Decisions that wait for the owner

The full text of each decision, with its options and a recommendation, is in `DECISIONS-FOR-THE-OWNER.md`. By subject:

1. Two sentences in the writing rule that are the orchestrator's wording: the fuller heading rule, and the line on organizing a document. Closed on 2026-10-09: Mike had approved both on 2026-10-08, and all five additions shipped in version 0.9.24.
2. What to do with the 34 lists of situations.
3. Which of the 30 numbers stay, and which become the agent's judgment.
4. What to do with the 22 places that name one of the owner's phrases.
5. What to do with the 31 lines that say how to weigh, or that tell the agent what it would do anyway.
6. A change to check W5 of the wording checklist. Decided on 2026-10-09 by the Main Orchestrator session, as proposed, and made in version 0.9.24.
7. A new order and fuller headings for the starter root `AGENTS.md`.
8. Whether the owner's own Salesforce texts may be rewritten, and the Salesforce rules that disagree.
9. Whether the Hindsight rule may get longer.
10. Where a project word is explained: once in each file, or once in each skill.
11. The rules that disagree outside the Salesforce files.
12. A set of small choices, such as the label "Done today" and one heading in six folder guides.
13. Which headings the fuller heading rule does not rename.

## The order of the fixes

No fix has started. Each area is fixed with the steps of the skill `writing-harness-files`, `references/rewrite-steps.md`. A separate agent reviews each change against `dev/reviews/wording-review.md` and `dev/reviews/best-practices-review.md`. Every check in the repository's `AGENTS.md`, "Checks", runs before the work is handed back.

**Before any area:**

- The branch `wording-scan` was brought up to main at version 0.9.23 on 2026-10-09. At the start of each area, read that area's findings again in the files that changed since version 0.9.20. There were 23 such files on 2026-10-09, and other sessions will change more before the fixes start.
- Have a second agent, on the stronger model, check each pass 2 place that the owner decides to change.
- Test each heading in `headings-and-citations.txt` against the fuller heading rule, within the limits that decision 13 sets.
- Add the decided words to `dev/reviews/word-list.md`, for example "front matter" in place of "header fields".

**The areas, in order.** Each one waits for what its row names, and the tests that cover it run again before the next area starts.

| Order | Area | Waits for | What shows that the agent did not get worse |
| --- | --- | --- | --- |
| 1 | The writing rule and check W5 | The owner's yes to the exact words | `check-skills.mjs` compares the rule with its copy |
| 2 | Setup: the skill `project-setup` and its reference files | The orchestrator's go-ahead. The live tests do not cover setup. | The checks, and one setup in a scratch folder |
| 3 | The small skills, rules, and folder guides that every project gets | The test baseline | The checks, and the questions to two fresh agents that the rewrite steps give |
| 4 | The memory folders, the Notion tools, and the Hindsight rule | The test baseline, phase P3 of the cohesion audit, and decisions 9 and 10 | The 36 tests of keeping the records |
| 5 | The three work tracker folders and the work item template | The test baseline | Both sets of live tests |
| 6 | The work item skill | The test baseline, and agreement with the cohesion audit on who changes which file | Both sets of live tests |
| 7 | The starter root `AGENTS.md` | Decision 7, in one version together with phase P4 of the cohesion audit | Both sets of live tests, and one "update the toolkit" in a scratch project |
| 8 | The Salesforce files, `writing-harness-files`, the plugin descriptions, and the workstreams plugin | Decision 8, and the Salesforce session's two open pieces of work | The guard tests, `claude plugin validate`, and `claude plugin test` |

A change that the owner approves from pass 2 is made in the same pass as the other fixes of its area, so that each file is rewritten once.
