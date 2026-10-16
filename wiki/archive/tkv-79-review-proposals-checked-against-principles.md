# TKV-79: the review's proposals, checked against the guiding principles

This file lists every change that the six review reports of work item TKV-79 propose for the shipped toolkit. Each proposal has a verdict, so that Mike can choose which ones to make. No proposal in this file is approved unless its verdict says "Done".

The six reports are attached to TKV-79 in Notion. They checked the shipped files against `wiki/product-wiki/Toolkit Guiding Design Principles.md`. They did not check their own proposed fixes against those principles. This file does that second check.

Written on 2026-10-13 against toolkit version 0.9.83.

## How to read the verdicts

| Verdict | Meaning |
| --- | --- |
| Fits | The proposal follows the guiding principles and does not change what a project does. |
| Breaks | The proposal, as the report wrote it, breaks a guiding principle. The note names the principle and a way that fits. |
| Decision | The proposal changes how a project works, or it depends on a fact or a preference that only Mike has. |
| Done | Mike approved it on 2026-10-13, and it is made on the branch `claude/tkv-79-review-fixes`. |

Three limits apply to every row:

- The verdict comes from reading the reports and the principles. A row says "checked in the file" when the agent also read the shipped file.
- Mike corrected one point on 2026-10-13: a line for one case stays when it is truly needed for an edge case. So every row that replaces a list of cases says "check each case first". The agent that makes the change reads each case and keeps the ones that protect a real edge case.
- A report's replacement sentence is a draft. The agent that makes the change writes the final sentence under `.claude/rules/document-clarity-standard.md`.

Paths are short forms. `EP/` is `plugins/toolkit/skills/project-setup/every-project/`. `MWI/` is `EP/.claude/skills/managing-work-items/references/`. `CH/` is `plugins/toolkit/skills/project-setup/choices/`. `REF/` is `plugins/toolkit/skills/project-setup/reference/`.

## The proposals that break a principle as written

| ID | Proposal | Why it breaks | A way that fits |
| --- | --- | --- | --- |
| D16 | Put the reply words "Not saved" and "Saved but not verified" in the starter `AGENTS.md`. | It adds text that every session loads. Mike wants that file as small as possible (principle 1.1, point 7). | Keep the words in one skill file, and let the other four skills point to it. |
| D17 | Put the steps for starting a helper agent in the starter `AGENTS.md`. | The same reason as D16. | Keep the steps in `MWI/lifecycle-rules.md`, and let `handoff` and memory tidying point to it. |
| D19 | Move about 25 sentences on editing the parts of a work item from the GitHub and local tracker files into `MWI/lifecycle-rules.md`. | `lifecycle-rules.md` opens on every work-item turn and is already the largest load (point 7). | Put the sentences in one reference file of `managing-work-items` that opens only when a work item is edited. |
| D20 | Put the `MAIN=` command for finding the main checkout in the rule `shared-repository-work.md`. | Every project loads that rule, and only projects with local memory or local work items use the command (principle 5 and point 7). | Leave the two copies. A project with only one of the two local choices needs its own copy. |

## The proposals that need Mike's decision

| ID | The decision |
| --- | --- |
| A5 | The shared design steps say "use the official platform skills that the root `AGENTS.md` names". Only the Salesforce choice names such skills. Remove the step from the shared files and let the Salesforce choice supply it, or keep a general step for any platform? |
| B7 | The Hindsight reference files hold test timings and a note about a video from the testing sessions. Move them to `wiki/reference/` and leave one line, or keep them? `ToolkitV2 Structure.md` says setup explains the settings "with their evidence limits", so some of this may be intended. |
| B15 | `publish-docs` lists `tools/**/*.md` among the files it handles. No shipped file creates a `tools/` folder. Remove the line, or does a project of Mike's rely on it? |
| C2 | Two files give different words for the default question: `SKILL.md:107` ("This is how the toolkit sets up `<choice>` by default. Is this what you want?") and `hindsight-setup.md:20` ("These are our normal Hindsight settings. Do you want them, or any changes?"). Which wording is the one? |
| C4 | Two files say where a Hindsight project's open setup steps are written: a project task (`REF/finishing.md:92`) or `PROJECT.md` (`hindsight-setup.md:71`). Which one? |
| C7 | In Notion memory, `record-decision.md` says in line 3 that a shared open question stays in the work item and nothing is captured, and in line 8 that the open question is captured in Wiki Inbox. Which is right? |
| C14 | `MWI/refining-requirements.md:145` says "Ask one question in each reply". The output style says to put every question in one numbered section at the end of the reply. Which rule holds while requirements are refined? |
| C18 | `Toolkit Setup Process.md` marks "A project that already has the toolkit" as "Not decided yet", and `REF/update.md` holds a full update procedure. Is the procedure in `update.md` approved? |
| D15 | "No AI credit" is written in seven skill files. The report proposes one new line in the always-loaded rule `shared-repository-work.md` and no line in the skills. This adds one line to every session and removes six. Yes or no? |
| D50 | `maintaining-notion-wiki` has two files that list every field of the Notion wiki databases (166 lines). Cut them to the fields that carry a rule? The reviewer was not sure, because setup may use the full lists to build the published schema pages. |
| E1 | `sf-component-tracker` lists nine examples of a deploy that needs a manual step. Replace them with one rule and two examples, or are some of the nine cases that an agent would miss? |
| E6 | The Hindsight files hold about 30 sentences of the form "X alone does not prove Y". Replace them with one line, or did each one come from a real failure that the line must still prevent? |
| E12 | `REF/update.md:153-168` gives a method, with Git commands, for working out whether the owner or the toolkit last changed a file. Replace it with two general sentences, or keep the method because a wrong answer overwrites the owner's edit? |
| E16 | `shaping-a-prompt` steps 1 to 3 tell the agent how to hold the conversation. Replace them with one sentence that names what the finished prompt must say? |
| G6 | The work item template has long fill-in comments. One is about 1,900 characters. Cut each comment to what the field holds? The template is what the owner sees, and the local copy must stay the same as the shared copy. |
| G9 | The three Salesforce rules load in every session of a Salesforce project (141 lines). Give them a `paths` line so that they load only for Salesforce files? A safety rule that does not load in every session is a risk. |
| H8 | `managing-project-memory/SKILL.md:12` says "Make sure that you apply those metadata tags and keep them up to date on the memory files." Nothing before it says which tags. Mike wrote the line in commit `d4ba6f0f`. What should it say? |
| J2 | Several tracker files give exact words for a Recent History row, such as "Made in Notion by hand." Replace them with one general line ("Add a Recent History row that says what changed and who asked for it")? Mike said on 2026-10-13 that he does not recall asking for the exact words. |
| J5 | `MWI/deploying.md:22` and `MWI/lifecycle-rules.md:271` use a skill named `humanizer`. Setup does not install it or check for it. Should setup check for it, or should the two lines go? |

## A. Shared files that name a setup choice (principle 5)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| A1 | Change the two shared hook commands so that they name no memory choice. | `EP/.claude/hooks/session-start.mjs`, `prompt-reminder.mjs` | Decision | Mike said yes on 2026-10-13. The agent shows a plan first, because the change affects projects that already use the toolkit. Checked in the file. |
| A2 | Move the branch-name line for an ID such as `#12` to the GitHub choice. | `MWI/build-repository.md:18` | Fits | Checked in the file. |
| A3 | Move the test-plan file name for an ID that starts with `#` to the GitHub choice. | `MWI/testing-loop.md:22` | Fits | |
| A4 | Replace the Salesforce word "org" with a word that fits any project. | `MWI/deploying.md:8`, `building.md:76`, `testing-loop.md:21`, `builder-brief.md:56`, `acceptance-checker-brief.md:53` | Fits | Checked in the file. The new word must be as exact as "org", for example "environment". |
| A5 | Remove "the official platform skills that the root `AGENTS.md` names" from the shared design files, and let the Salesforce choice supply the step. | `MWI/designing.md:15`, `:24`, `:64`, `design-architect-brief.md:25` | Decision | Checked in the file. |
| A6 | Make the handoff example neutral, or let each work-item choice supply its own example. | `EP/.claude/skills/handoff/examples/handoff-example.md` | Fits | The neutral form is the smaller change. |
| A7 | Replace `gh` and "issue" in the handoff verifier and prompt template with neutral words. | `handoff-verifier.md:66`, `:101`, `handoff-prompt-template.md:5` | Fits | |
| A8 | Move the two lines that read a GitHub issue number from a branch name or pull request body. | `EP/.claude/skills/merge-and-clean-up/SKILL.md:53-54` | Fits | Mike said GitHub as the code host is fine. These two lines are about GitHub Issues as the work tracker, which is a setup choice. Checked in the file. |
| A9 | Make the local memory skill speak only about local memory. | `managing-project-memory/SKILL.md:10`, `:29-31`, `memory-process.md:10`, `:53` | Fits | Possible now that the folder merge is done. |
| A10 | Replace "(a Notion page, GitHub issue, or Jira ticket)" with "its link when the work tracker has one". | `sf-component-tracker/SKILL.md:131` | Fits | |
| A11 | Remove the lines in the Hindsight rule and the Hindsight `AGENTS.md` text that correct shared text, and say once that the project has no Current State page. | `hindsight-memory.md:38-39`, `what-hindsight-adds-to-a-project.md:26-27`, two `project-memory-steps.md` files | Fits | Only after A1. Until the hooks change, the lines are needed. |
| A12 | Say "no duplicate local `DECISIONS.md`" once in the Notion memory files. | Five Notion memory files | Fits | |

## B. Text that fits one project, one computer, or one past session (principle 3)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| B1 | Remove the sentence that names `tools/kb/`, `tools/permissions/`, and two rules of one project. | `REF/update.md:214` | Fits | Checked in the file. |
| B2 | Replace the `tools/kb/` command with "when the project has its own tool that shows what a component connects to, use it". | `sf-deploy-check/SKILL.md:27` | Fits | Checked in the file. |
| B3 | Replace the example prefix "IML". | Two Notion files | Done | |
| B4 | Write "this computer" in place of "this Mac". | `using-notion-cli/SKILL.md:26` | Fits | Checked in the file. |
| B5 | Replace "`jq` is on every Mac" with "when `jq` is not installed, tell the owner". | `ntn-commands.md:44` | Fits | |
| B6 | Replace `brew install gh` with the install steps of GitHub's own page for the owner's computer. | `github-sign-in.md:7` | Fits | Checked in the file. |
| B7 | Move the Hindsight test timings and the video note to `wiki/reference/`. | `hindsight-server-settings.md:19`, `:24`, `:45-57`, `hindsight-package-default.md:62`, `hindsight-known-problems.md:33` | Decision | |
| B8 | Remove the Hindsight lines about projects set up before a section existed. | `what-hindsight-adds-to-a-project.md:17`, `:21` | Fits | The same kind of line Mike said to remove on 2026-10-13. |
| B9 | Remove the two dates from the toolkit's own history, and keep the rule. | `MWI/testing-loop.md:81` | Fits | |
| B10 | Replace "his answer" and other words that assume a male owner. | `MWI/closing.md:54`, two templates | Fits | |
| B11 | Use an example that fits any project in place of the toolkit's own session. | `session-summary/SKILL.md:52`, `:74-76` | Fits | |
| B12 | Replace "such as `.obsidian/`" with a general example. | `reset-to-remote/SKILL.md:88` | Fits | Low value. It is only an example. |
| B13 | Rename the row "Hitchhiker review" to "Deploy scope check (`sf-deploy-check`)". | `DEPLOYMENT-RECORD.md:23` | Fits | Checked in the file. |
| B14 | Write a placeholder in place of `WI-031` inside the Salesforce deploy command. | `salesforce-deploying.md:17`, `:20` | Fits | Optional. The lead found that `WI-031` is the toolkit's usual example ID and breaks no principle. |
| B15 | Remove `tools/**/*.md` from the list in `publish-docs`. | `publish-docs/SKILL.md:26` | Decision | |
| B16 | Add "when a computer lacks one of these commands, reach the same result another way" where commands need `rsync` or `jq`. | `REF/update.md`, `setup-copy.md`, `finishing.md` | Fits | One file already has the line. |
| B17 | Remove the line for an owner who asks for Jira. | `REF/setup-problems.md:16` | Fits | |

## C. Wrong or conflicting statements

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| C1 | Remove the sentence that says the settings file holds refused Git commands. | `REF/skills-hooks-settings.md:39` | Done | Mike has not yet said yes to this one edit. |
| C2 | Choose one wording for the default question. | `SKILL.md:107`, `hindsight-setup.md:20` | Decision | |
| C3 | Replace the "three moments" section with one line, because two setup files do not mark their steps that way. | `SKILL.md:125-135` | Fits | |
| C4 | Choose one place for a Hindsight project's open setup steps. | `REF/finishing.md:92`, `hindsight-setup.md:71` | Decision | |
| C5 | Point to the right step of the Salesforce setup file. | `REF/finishing.md:60` | Fits | |
| C6 | Add `project-store-summary.md` to the file list of `SKILL.md`. | `SKILL.md` | Fits | |
| C7 | Make the two lines on a shared open question agree. | Notion `record-decision.md:3`, `:8` | Decision | |
| C8 | Say "as the rule says" in place of "as AGENTS.md says". | `hindsight-package-default.md:95` | Fits | |
| C9 | Point to `ntn-commands.md` for sections that are in that file and not in `SKILL.md`. | Notion `work-tracker-page-updates.md:9`, `:25`, `work-tracker-commands.md:54` | Fits | |
| C10 | Correct two pointers to text that is in another file or in no file. | `record-format.md:26`, `saving.md:116` | Fits | |
| C11 | Make the Flow test commands match, and make "without a manifest" clear. | `salesforce-refuse-list.md:25`, `salesforce-org-safety.md:17`, `:34` | Fits | The agent must first confirm the right command on the official Salesforce page. |
| C12 | Reword "Change nothing", which the next sentence contradicts. | `session-summary/SKILL.md:32-33` | Fits | |
| C13 | Write "that file" where the text calls `work-tracker.md` a skill. | `MWI/deploying.md:24` | Fits | |
| C14 | Settle whether requirements are asked one question per reply. | `MWI/refining-requirements.md:145`, the output style | Decision | |
| C15 | Remove the section "Git writes in Codex", whose text no longer mentions Codex. | `MWI/build-repository.md:34` | Fits | Goes with D2. |
| C16 | Write the real number of missing labels in the question, in place of "30". | `work-tracker-labels.md:80` | Fits | |
| C17 | Correct this repository's `AGENTS.md` row for `choices/memory/`. | `AGENTS.md:98` | Done | |
| C18 | Settle whether the update procedure is approved. | `Toolkit Setup Process.md:138`, `REF/update.md` | Decision | |

## D. Repeated text (principle 1.1, point 6)

The home of each text follows one rule in this list: the starter `AGENTS.md` and the always-loaded rules get no new text.

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| D1 | Keep the definition of "main checkout" in the rule only, and cut it from the starter `AGENTS.md` and 11 skill and guide files. | 17 places | Fits | Makes `AGENTS.md` shorter. The copies inside helper briefs and setup files stay. |
| D2 | Cut the host permissions paragraph from five shared skill files. | Five files | Fits | Checked in the file. The report also widens the rule's line by one clause. Leave that out, because the agent follows it already (principle 7). |
| D3 | Cut the definition of "worktree" from 10 files. | 11 places | Fits | The starter `AGENTS.md` already holds it. |
| D4 | Cut six lines from the always-loaded Salesforce rule that the Salesforce skills already hold, and cut the "Limits" table from `sf-data-change`. | `salesforce-deployments.md`, `sf-data-change/SKILL.md` | Fits | Makes the always-loaded text shorter. |
| D5 | Cut the rows in "Work that another skill does" tables that the starter `AGENTS.md` already holds. | Five skills, four folder guides | Fits | |
| D6 | Cut "A session is one chat with the agent" from four files. | Four files | Fits | |
| D7 | Cut "the five lines at the top" from four files. | Four files | Fits | The copy in the handoff prompt template stays. |
| D8 | Cut the three other wordings of what a source is. | Nine places | Fits | The wordings disagree today. |
| D9 | Replace the nine "Project map" rows that repository records add to `AGENTS.md` with one row, and the three rows that local memory adds with one row. | `what-repository-records-add-to-a-project.md:25-33`, `what-local-memory-adds-to-a-project.md:27-29` | Fits | Makes a project's `AGENTS.md` ten rows shorter. |
| D10 | Cut "stage each file by name" where it is only a phrase inside a step. | Six files | Fits | The exact command in `publish-docs` stays. |
| D11 | Cut "a merge into the default branch needs the owner's yes" from the starter `AGENTS.md`, because the rule says it. | `EP/AGENTS.md:47` | Fits | Makes `AGENTS.md` shorter. The approval stays in the rule and in the list of approval points. |
| D12 | Shorten the Notion rule's line on filling every field. | `notion-records.md:9` | Fits | |
| D13 | Keep the voice-to-text line in both places. | `SKILL.md:35`, `EP/AGENTS.md:11` | Fits | No change. Setup runs before the project has an `AGENTS.md`. |
| D15 | Write "No AI credit" once, in the always-loaded rule. | Seven files | Decision | |
| D16 | Put the "Not saved" reply words in the starter `AGENTS.md`. | Five files | Breaks | See the first table. |
| D17 | Put the steps for starting a helper in the starter `AGENTS.md`. | Three files | Breaks | See the first table. |
| D18 | Keep the closing steps for shared records (44 lines) once, in `repository-records/`. | Hindsight and local `project-memory-steps.md` | Fits | |
| D19 | Move the sentences on editing the parts of a work item to one shared place. | GitHub and local tracker files | Breaks | See the first table. |
| D20 | Put the `MAIN=` command in the always-loaded rule. | Local memory and local work items | Breaks | See the first table. |
| D21 | Cut three repeated definitions of a project task. | Three files | Fits | |
| D22 | Keep the merge conflict steps in `pull-latest` only. | `MWI/build-repository.md:30` | Fits | |
| D23 | Say "for any existing project, propose a review and migration batch" once. | Four Notion files | Fits | |
| D24 | Keep the Notion sign-in facts in `ntn-commands.md`, and point to them from setup. | `notion-sign-in.md:7-10` | Fits | |
| D25 | Cut the State and Status sentence from the three tracker files. | Three files | Fits | |
| D26 | Cut "Tell the owner this in a few plain lines" from the five default files. | Five files | Fits | |
| D27 | In a local project, name only the template in `work-items/work-item-template/`. | Local `work-tracker.md:66` | Fits | The two template copies stay. |
| D28 | Cut the restated levels of work from two trackers. | GitHub and local `work-tracker.md` | Fits | |
| D29 | Cut three repeated definitions of a prompt in angle brackets. | Three files | Fits | |
| D30 | Cut the memory exclusions from the local folder guide. | `memory/AGENTS.md:22-23` | Fits | |
| D31 | Point to `current-state.md` for the "Next session starts with" line. | Local `handoff/references/project-memory-steps.md:10-11` | Fits | |
| D32 | Cut the instruction to the agent from the Current State template. | `CURRENT_STATE.md:3` | Fits | |
| D33 | Cut the second list of reference files in `managing-work-items`. | `MWI/lifecycle-rules.md:273-291` | Fits | |
| D34 | Cut five other repeats inside `managing-work-items`. | Five places | Fits | The repeated lines inside the six helper briefs stay. |
| D35 | Cut the repeats inside `project-setup`: the Current State definition, the second file table, and ten more. | `SKILL.md`, `REF/` | Fits | |
| D36 | Cut the repeats inside `handoff`. | `handoff/SKILL.md:108-127` | Fits | One part needs a check: the fixed first line of a handoff prompt. One reviewer says cut it from `SKILL.md`, another says it must stay. |
| D37 | Cut the repeats inside `filing-project-records`. | `SKILL.md:10-16`, `file-source.md:29-37` | Fits | |
| D38 | Cut the repeats inside `using-notion-cli`. | Four places | Fits | |
| D39 | Cut the repeats inside `sf-component-tracker` and `sf-deploy-check`. | About 15 places | Fits | |
| D40 | Cut the repeats inside the local memory skill: the replacement rule, the read-back rule, and five more. | About 20 places | Fits | |
| D41 | Give each Hindsight fact one file: deadlines, limits, each known defect. | Hindsight reference files | Fits | The mission texts and the `toolGuideExtra` text stay as they are. |
| D42 | Cut the repeats inside the local and GitHub tracker files. | About 15 places | Fits | |
| D43 | Say "a capture does not approve its content" once in a Notion project. | About ten places | Fits | |
| D44 | Cut the repeats in the shared Notion setup files. | About 12 places | Fits | |
| D45 | Cut the repeats between the three Salesforce rules. | Six places | Fits | |
| D46 | List the header fields of a local work item once, and keep only the rows that carry a rule. | Three places | Fits | Principle 1.1 uses this as its own example. |
| D47 | Cut the rows of the Notion "Exact names and values" table that only repeat what the agent reads from the database. | `work-tracker-page-updates.md:70-85` | Fits | |
| D48 | Define the four statuses and the four marks of repository records once. | Six places | Fits | |
| D49 | Replace the 450-word comment in the local memory template with one line. | `project_topic_template.md:28` | Fits | |
| D50 | Cut the two Notion schema files to the fields that carry a rule. | `long-term-schemas.md`, `wiki-schemas.md` | Decision | |

## E. Lists of cases, and rules the agent already follows (points 3 and 4, principle 7)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| E1 | Replace nine examples of a manual deploy step with one rule and two examples. | `sf-component-tracker/SKILL.md:85-95` | Decision | |
| E2 | Replace eight cases for a moved or mismatched work-item folder with the two general rules the file already has. | Local `work-tracker-folders-and-files.md:89-104` | Fits | Check each case first. |
| E3 | Replace five cases for a label changed by hand with one rule. | `work-tracker-labels.md:99-103` | Fits | Check each case first. |
| E4 | Cut three small lines from "Mistakes to avoid". | Local `work-tracker.md:52`, `:53`, `:55` | Fits | Check each case first. |
| E5 | Cut or generalize four lines in the local memory skill. | `saving.md:37`, `tidying.md:57-58`, `:120-124`, `events-and-recurring-jobs.md:33` | Fits | Check each case first. |
| E6 | Replace about 30 "X alone does not prove Y" sentences with one line. | Hindsight reference files | Decision | |
| E7 | Merge one of seven Building cases into the two it repeats. | `MWI/building.md:57` | Fits | |
| E8 | Replace the lockfile table with one line. | `reset-to-remote/SKILL.md:53-64` | Fits | Keep "ask which package manager" and "never install a missing installer". |
| E9 | Move a one-time check from the skill to Salesforce setup. | `sf-data-change/SKILL.md:57` | Fits | |
| E10 | Delete a known-problems file whose one line is not a problem. | `salesforce-known-problems.md` | Fits | |
| E11 | Say the "approved migration batch" case once in place of four times. | `where-the-notion-project-page-goes.md:14-23` | Fits | Check each case first. |
| E12 | Replace the method for working out who last changed a file with two sentences. | `REF/update.md:153-168` | Decision | |
| E13 | Cut general care that the agent takes by itself. | `REF/setup-problems.md:15`, `:20`, `finishing.md:122-123`, `local-wiki-layout.md:23`, `context-from-past-work.md:20` | Fits | Keep the part of `setup-problems.md:15` that forbids changing the owner's answer to get past a failure. |
| E14 | Cut the retry and approval sentences that the agent follows by itself. | `work-tracker-gh-commands.md:44`, `:167`, `ntn-commands.md:149`, local `work-tracker.md:44` | Fits | Keep the exact tool lines, such as "run each `gh` command on its own". |
| E15 | Cut "Honor the project's model preference…" from three files. | Three files | Fits | |
| E16 | Replace steps 1 to 3 of `shaping-a-prompt` with one sentence. | `shaping-a-prompt/SKILL.md:13-14` | Decision | |
| E17 | Fold three coaching lines into the step they belong to. | `sf-data-change/SKILL.md:32`, `:33`, `:61` | Fits | |
| E18 | Cut the section that only explains a reason, and "is the highest risk". | `sf-deploy-check/SKILL.md:21`, `:37-39` | Fits | |
| E19 | Cut the CSV quoting rule and the list of metadata types. | `sf-component-tracker/SKILL.md:127`, `:176` | Fits | |

## F. Counts and limits (point 5)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| F1 | Drop reply limits such as "in one line" where the output style already asks for short replies. | About 57 lines | Fits | The limits that are Mike's own words in the product wiki stay, such as "Say in one line" in `SKILL.md:48`. |
| F2 | Write "every label in the full list" in place of "30 labels". | Four places | Fits | |
| F3 | Drop "two to four lowercase words" and "two to four capital letters". | Local and Notion files | Fits | The agent must first check whether Notion limits the prefix length. |
| F4 | Replace "every 5 seconds" and "after two minutes" with the agent's judgment. | `ntn-commands.md:114`, `:123` | Fits | |
| F5 | Replace "after a second fix" with "your fixes are not resolving the failure". | `MWI/testing-loop.md:33` | Fits | |
| F6 | Write "each of these" where a sentence gives the size of the list below it. | About 12 places | Fits | |
| F7 | Drop "exactly two questions" and "the eight statuses". | `session-summary/SKILL.md:8`, `:16` | Fits | |

## G. Long files (point 7)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| G1 | Keep in `lifecycle-rules.md` only what every work-item turn needs. Move levels, phases, and tasks to one new file, and the small work item to another. | `MWI/lifecycle-rules.md` | Fits | Every file that points into the moved sections must be updated. |
| G2 | Move two sections of `publish-docs` to reference files. | `publish-docs/SKILL.md:127-172` | Fits | |
| G3 | Move the rare merge cases to a reference file. | `merge-and-clean-up/SKILL.md:112-118`, `:139-144` | Fits | |
| G4 | Split `sf-component-tracker` into a short `SKILL.md` and reference files. | `sf-component-tracker/SKILL.md` | Fits | |
| G5 | Stop opening two long memory files for every memory job. | `managing-project-memory/SKILL.md:16` | Fits | Test a save and a search after the change, because the read-before rule is in those files. |
| G6 | Cut the fill-in comments of the work item template. | `work-item-template.md` | Decision | |
| G7 | Move the 23-line example out of `SKILL.md`. | `session-summary/SKILL.md` | Fits | |
| G8 | Point straight to `build-repository.md` in place of two headings with the same one-line body. | `MWI/building.md:87-93` | Fits | |
| G9 | Give the Salesforce rules a `paths` line. | Three rules | Decision | |
| G10 | Split one paragraph that covers three jobs into three lists, and give each setup step one action. | `hindsight-setup.md:79`, `notion-memory-setup.md:7-14`, `salesforce-setup.md:3` | Fits | Step numbers that other files cite must stay. |

## H. Wording (point 8)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| H1 | Rewrite labels with a colon as whole sentences. | `pull-latest/SKILL.md`, `braindump/SKILL.md` | Fits | |
| H2 | Rewrite the dense lines of the Notion tracker files. | Notion `work-tracker.md`, `work-tracker-page-updates.md` | Fits | |
| H3 | Rewrite `notion-memory-pages.md`, and explain "librarian", "Lore", "cutover", and "record home" at first use. | Notion shared and Notion memory files | Fits | |
| H4 | Explain or replace "canary", "provenance", and "supersession". | Hindsight reference files | Fits | |
| H5 | Rewrite `local-wiki-layout.md`. | `REF/local-wiki-layout.md` | Fits | |
| H6 | Replace "the ID is yours" with a plain sentence. | `filing-project-records/SKILL.md:52`, `file-source.md:18` | Fits | |
| H7 | Open `record-decision.md` with its purpose. | Repository records `record-decision.md:3` | Fits | |
| H8 | Make the sentence about metadata tags clear. | `managing-project-memory/SKILL.md:12` | Decision | |

## I. Steps of one choice kept in shared setup files (principle 6)

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| I1 | Move each memory choice's part of the finishing checks to that choice's folder. | `REF/finishing.md:94`, `:96-103`, `:116` | Fits | |
| I2 | Move the Hindsight steps of an update to the Hindsight folder. | `REF/update.md:249`, `:252`, `:253` | Fits | |
| I3 | Point to the Notion file for the page ID step. | `REF/update.md:63` | Fits | |
| I4 | Move the Notion memory detail out of the interview reference. | `REF/setup-interview.md:40` | Fits | |
| I5 | Give the Notion tracker an exact step for a helper that opens a work item. | Notion `work-tracker.md:66` | Fits | The GitHub and local trackers already give an exact command. |
| I6 | Write the exact local field names in the local memory skill. | `saving.md:43`, `:100`, `memory-store.md:36` | Fits | Possible now that the folder merge is done. |

## J. Other

| ID | Proposal | Where | Verdict | Note |
| --- | --- | --- | --- | --- |
| J1 | Remove the comment "Shared text from the Toolkit V2 repository…" that only one shared file has. | `handoff-verifier.md:1` | Fits | |
| J2 | Replace the fixed Recent History wording with one general line. | Three tracker files | Decision | |
| J3 | Remove setup step 10, which tells the owner what step 1 already told. | `github-work-items-setup.md:18` | Fits | Check that no file cites a later step number. |
| J4 | Remove a section that lists four file links and gives no instruction. | `what-github-work-items-add-to-a-project.md:28-35` | Fits | Check first that nothing reads the section. |
| J5 | Settle whether setup checks for the `humanizer` skill. | `MWI/deploying.md:22`, `lifecycle-rules.md:271` | Decision | |
| J6 | Merge `shared-by-local-and-notion/` into the local memory choice. | `CH/memory/` | Done | |
| J7 | Remove the lines for earlier toolkit versions. | `REF/update.md`, `REF/skills-hooks-settings.md` | Done | One line stays: it stops an update from removing an existing Notion project's `DECISIONS.md` and product wiki. |

## What nobody has checked yet

- Whether a helper agent loads the project's rules and `AGENTS.md` by itself. The official Claude Code and Codex pages answer this. If a helper does load them, some text inside the helper briefs can go.
- The `sf`, `ntn`, and `gh` commands, the Codex tool names, and the Hindsight settings against their official pages.
- How a project behaves after any of these changes. Each group of changes needs a test in a scratch folder before it is merged.
