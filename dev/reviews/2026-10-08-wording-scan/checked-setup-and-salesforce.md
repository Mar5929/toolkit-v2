# Wording scan check: setup part one, setup part two, and the Salesforce and plugin files

This file checks three findings files: `setup-part-one.md`, `setup-part-two.md`, and `salesforce-and-plugin-files.md`. For every finding named below, I opened the cited file and line in this worktree. I searched the worktree before I judged a string that a tool might read.

Two path shortcuts are used below:

- `SETUP/` means `plugins/toolkit/skills/project-setup/`.
- `SF/` means `plugins/toolkit/skills/project-setup/assets/salesforce/`.

A finding's ID (for example U-1, FIN-5, or F17) is the ID that the reader gave it.

## How reliable the readers were

| Area | Findings checked | Confirmed | Wrong level | Not a problem | Rewrites that need work |
| --- | --- | --- | --- | --- | --- |
| Setup part one | All 63 Medium | 61 | 2 | 0 | 11 |
| Setup part two | The 1 High and all 37 Medium | 35 | 3 | 0 | 5 |
| Salesforce and plugin files | All 80 Medium | 70 | 8 | 2 | 10 |

- **Setup part one.** The reader is reliable. Every problem I opened is in the file where the reader says it is. No Medium finding is unchecked. The reader's counts are often wrong by a little: "four of nine checks" is three (INT-1), "eight sentences" is five (INT-5), and "11 top-level bullets" is nine (SHS-6). Read each count in that file as a rough number.
- **Setup part two.** The reader is reliable, and its rewrites are careful. No Medium finding is unchecked. The reader left four values for "the file's author" to supply, and the repository gives all four ("Questions answered from the repository" below).
- **Salesforce and plugin files.** The problems are real, but the reader missed one fact that changes what can be done with them. `dev/SKILL-INDEX.md:166-168` says the three `sf-*` skills "are Mike's own project skills ... a change to them needs Mike's yes", and `dev/tools/check-skills.mjs:67-68` says the same. The readers' brief did not name those skills, so the reader proposed rewrites for 18 Medium findings in them as if the text were the toolkit's. No Medium finding is unchecked. For seven of them (F52, F108 to F111, F117, F118) I read the cited lines and agree with the problem, but I did not test the rewrite against other files.

## High findings

**U-1, `SETUP/references/update.md:230-264`. Confirmed, and it is High. The rewrite needs work.**

What is true in the file:

- The table at lines 243 to 249 has the headers "Old folder" and "New folder". It maps `managing-work-items` to `running-work-item-lifecycle`, and `managing-project-memory` to `curating-project-memory`.
- The table at lines 253 to 258 maps `running-work-item-lifecycle` back to `managing-work-items`, and `curating-project-memory` back to `managing-project-memory`.
- Both tables are correct history. The skills had three sets of names: `managing-work-items` and `tracking-work-items` first, then `running-work-item-lifecycle` and `using-work-tracker`, and now one merged skill that is again named `managing-work-items`. `dev/reviews/word-list.md` still uses the second set.
- Line 251 says that the two names are current and that the folder is kept. So a reader who reads on recovers. A reader who acts on the first table lists the two current skills as old folders, or renames them to retired names.
- Line 232 says "The current merge retires ...". No earlier line tells the reader about a merge.

The reader's one table is safe to use when the writer also does these four things:

1. Keep the first two sentences of line 232: what a retired skill is, and "List it, check whether the owner edited it, and remove it only after the owner's yes." Keep line 234, which says to leave a folder and ask when it may be the owner's own skill.
2. Say which rename lines 262 and 264 mean. Both say "the rename". After the two sections are joined, the reader cannot tell which change of name altered the Codex hook entry.
3. Keep the list of names in `SETUP/references/one-home-layout.md:57` the same as the left column of the new table. That row is the search that finds these folders.
4. Remove "Retired skills" and "Renamed skills" from the Contents list at lines 35 and 36. No other file names either heading. The root `AGENTS.md` names only the parent heading, "4. What the toolkit no longer ships", which stays.

No Medium finding in the three files should be raised to High. F60 comes closest ("A line here wins over the table above", `SF/.claude/rules/salesforce-agent-permissions.md:51`). It is the source of F76, which is already confirmed and passed on. Fix the two lines together.

## Patterns

### Setup part one

| Pattern | Reader's count | Corrected count | Three examples | Verdict |
| --- | --- | --- | --- | --- |
| A. One definition is repeated in many files | About 25 | 24 repeats of five definitions | `SETUP/references/placing-files.md:3`, `SETUP/references/finishing.md:91`, `SETUP/references/interview.md:24` | The count is right. It is Low, and the proposed fix is the owner's choice (first question for the owner below). |
| B. A tool or service is used without saying what it is | About 70 lines | `ntn` is on 57 lines in 6 files, and "VPS" is on 3 lines | `SETUP/SKILL.md:104`, `SETUP/references/interview.md:78`, `SETUP/references/notion.md:9` | Real. Only `SETUP/references/finishing.md:191` says what `ntn` is, and only in a table. "Lore" is also explained at `SETUP/references/notion-build/work-setup.md:96`, which the reader did not list. |
| C. A pointer that depends on position | About 12 | 15 lines | `SETUP/references/notion-build/setup.md:26`, `SETUP/references/setup-copy.md:155`, `SETUP/references/placing-files.md:111` | Real. |
| D. A table cell that holds several sentences | About 8 | 22 cells hold three or more sentences, and 11 of them are in `work-layout.md` | `SETUP/references/notion-build/work-layout.md:28`, `SETUP/references/interview.md:91`, `SETUP/references/finishing.md:196` | Real, and larger than reported. The reader did not report `work-layout.md:28`, which holds seven sentences. |
| E. A bullet that holds many instructions | About 6 | 47 bullets hold four or more sentences. 19 are in `work-setup.md` and 9 are in `finishing.md` | `SETUP/references/notion-build/work-setup.md:216`, `SETUP/references/finishing.md:138`, `SETUP/references/github.md:33` | Real. The reader's six are the worst cases. This is the strongest pattern in the area. |
| F. One thing has several names | About 7 groups | 6 groups | `SETUP/references/interview.md:29`, `SETUP/references/notion-build/work-setup.md:48`, `SETUP/references/notion-build/work-setup.md:59` | Real for six groups. The seventh, lowercase "id" for a Notion id, is not a problem: Notion's own field is `id`, and the files use "ID" only for work item IDs. |
| G. A file number without the word "file" | 3 places | 4 lines | `SETUP/references/notion-build/setup.md:95`, `SETUP/references/notion-build/setup.md:99`, `SETUP/references/notion-build/work-setup.md:336` | Real, and Low. |
| H. A heading whose subject is missing | 4 headings | 3 headings | `SETUP/references/github.md:74`, `SETUP/references/placing-files.md:129`, `SETUP/SKILL.md:93` | Three are real. "Mistakes to avoid" is not: `dev/reviews/word-list.md`, part 2, chose that heading, and ten skills use it. |

### Setup part two

| Pattern | Reader's count | Corrected count | Three examples | Verdict |
| --- | --- | --- | --- | --- |
| 1. A bullet with three or more instructions | 9 | 46 bullets hold four or more sentences: 13 in `update.md`, 12 in `move-over.md`, 12 in `hindsight-on-vps.md` | `SETUP/references/update.md:416`, `SETUP/references/one-home-layout.md:344`, `SETUP/references/earlier-versions.md:54` | Real. The reader's nine are the worst cases. U-7 does not belong in the list: it is one instruction in the passive. |
| 2. A word used before it is explained, or never explained | 6 | 6, and 2 of them are Low | `SETUP/references/hindsight-on-vps.md:63`, `SETUP/references/hindsight-on-vps.md:50`, `SETUP/references/earlier-versions.md:46` | Real. In M-2 and P-1 the explanation is one or two lines after the word, so those two are Low. |
| 3. A pointer the reader cannot follow without guessing | 9, and 5 more in one file | 14 | `SETUP/references/update.md:100`, `SETUP/references/one-home-layout.md:65`, `SETUP/references/hindsight-on-vps.md:393` | Real for the nine. The five "under this table" pointers in `old-toolkit-pieces.md` point to the text directly under the table and are Low. |
| 4. A heading that does not say what is under it | 4 | 4, and the bold labels in `one-home-layout.md` number 22, not 20 | `SETUP/references/update.md:357`, `SETUP/references/old-toolkit-pieces.md:54`, `SETUP/references/one-home-layout.md:135` | Real. |
| 5. A sentence with no actor, such as "after the branch was merged" | About 12 | "after the branch was merged" appears 7 times in 3 files | `SETUP/references/update.md:70`, `SETUP/references/one-home-layout.md:324`, `SETUP/references/move-over.md:124` | Weak. "After the branch was merged" is a condition, and `update.md:384` already names who merges. The other two examples are real and Low. |
| 6. History the step does not need | 4 | 4 | `SETUP/references/update.md:232`, `SETUP/references/update.md:286`, `SETUP/references/update.md:409` | Real. |
| 7. A value that the sentence needs and does not name | 4 | 4, and the repository gives all 4 | `SETUP/references/update.md:336`, `SETUP/references/earlier-versions.md:75`, `SETUP/references/hindsight-on-vps.md:63` | Real. None of the four needs the owner. |

### Salesforce and plugin files

| Pattern | Reader's count | Corrected count | Three examples | Verdict |
| --- | --- | --- | --- | --- |
| 1. "Tracker" means two things | 6 places | 7 lines where the bare word could mean either | `SF/.claude/rules/check-deployment-contents.md:6`, `SF/.claude/skills/sf-deploy-check/SKILL.md:28`, `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md:5` | Real, but the reader's third example is wrong. `sf-component-tracker/SKILL.md:33-34` writes "work tracker" and "component tracker" in full. The real clash is in four template lines, where "the tracker" means the place the work items are kept. |
| 2. One manifest has several names | 5 places | 4 lines use a name other than "master manifest" | `SF/.claude/skills/sf-component-tracker/SKILL.md:18`, `SF/.claude/skills/sf-component-tracker/SKILL.md:32`, `SF/delivery/deployments/full-project-deployment-template/manual-steps.md:5` | Real. No line says what the master manifest is. |
| 3. "This model" and "the model files" | 4 places | 5 lines | `SF/tools/permissions/README.md:5`, `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:9`, `plugins/toolkit/.codex-plugin/plugin.json:4` | Real. The reader missed line 4 of the Codex manifest, which holds the same text as the Claude Code manifest. |
| 4. A pointer to something the reader cannot open | 4 places | 8 lines: 3 for the research file, 1 for "Hitchhiker review", 4 for "the project this was built in" | `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:14`, `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md:23`, `SF/tools/kb/README.md:80` | Real. |
| 5. A made-up word with no explanation | 7 words | 6 words | `SF/.claude/rules/permissions-source-control.md:29`, `SF/.claude/skills/sf-component-tracker/SKILL.md:43`, `SF/.claude/rules/dependency-graph.md:7` | Real for six. "Slug" is a general software word. |
| 6. A bullet with several rules | 8 places | 9 bullets hold four or more sentences in the rules and skills, and the workstreams instruction is a tenth case | `SF/.claude/rules/salesforce-agent-permissions.md:6`, `SF/.claude/skills/sf-data-change/SKILL.md:56`, `plugins/workstreams/hooks/register.tsx:43` | Real. |
| 7. A label and a colon in place of a sentence | 7 places | About 19 list items in 3 files | `SF/.claude/skills/sf-component-tracker/SKILL.md:84`, `SF/.claude/skills/sf-data-change/SKILL.md:23`, `SF/.claude/rules/salesforce-delivery.md:13` | Real, and larger than reported. 13 of the items are in `sf-component-tracker`. |
| 8. A heading that numbers sections that are not steps, or does not say its subject | 6 places | 6 | `SF/.claude/skills/sf-component-tracker/SKILL.md:37`, `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:167`, `SF/.claude/rules/salesforce-project.md:6` | Real. |
| 9. A word that names two checks, or a pronoun with two subjects | 9 places | 5 that I confirmed | `SF/.claude/skills/sf-component-tracker/SKILL.md:110`, `plugins/toolkit/skills/writing-harness-files/SKILL.md:40`, `plugins/toolkit/skills/writing-harness-files/references/checklist.md:114` | Real. The pattern joins two different problems, and the reader lists five cases, not nine. |
| 10. One rule worded two ways in a rule and a skill | 4 places | 4 | `SF/.claude/rules/check-deployment-contents.md:7`, `SF/.claude/skills/sf-component-tracker/SKILL.md:111`, `SF/.claude/rules/dependency-graph.md:13` | Real. For the last one, 70 lines write `python tools/kb` and 2 lines write `python3 tools/kb`, both in `dependency-graph.md:13`. |

## Files that need a rewrite

**`SETUP/references/notion-build/work-setup.md`. I do not agree with "needs a rewrite". The verdict should be "small fixes", with many of them.**

- The file opens with what it is for and when a job is done. Its Contents list matches its ten sections. Each section says in its first lines which job runs it.
- All twelve Medium findings are real. Each one is fixed in place: a table that maps a job to its sections (WS-1), one name for the Notion layout (WS-2), numbered parts inside two long steps (WS-11, WS-12), and eight sentence fixes.
- The file is mostly exact commands, ids, file numbers, and view names. A rewrite puts those at risk and makes nothing clearer that the twelve fixes do not.
- The reader also suggests splitting the file into three. Eight other files name this file or its sections (`SETUP/SKILL.md`, `notion.md`, `setup.md`, `work-layout.md`, `update.md`, `finishing.md`, `earlier-versions.md`, and `one-home-layout.md`). A split means changing each of those. Do it only when the owner asks for it.

**`SF/.claude/skills/sf-component-tracker/SKILL.md`. I agree, but the text is the owner's.**

- By the standard, this is the weakest file in the three areas. Its opening does not say what the component tracker is. The headings "Step 1" to "Step 4" are not steps in order. "Master manifest" and "flag" are used long before they are explained. 13 list items are a label and a colon.
- `dev/SKILL-INDEX.md:166-168` says a change to this skill needs the owner's yes. So the rewrite is a proposal for the owner, not a job to start.
- Three of the reader's rewrites for this file change a rule and need the owner's answer first: F2, F7, and F8 ("Findings that are not a problem or have an unsafe rewrite" below).

**`SETUP/references/update.md`, the parts "Retired skills" and "Renamed skills". I agree that these two parts need a rewrite**, as U-1 says. The rest of `update.md` needs small fixes.

## Headings and layout

The heading test: a reader who sees only the heading must know what the section holds. These proposed headings fail it. Each has a fuller heading beside it.

| File | The reader's heading | Why it fails | A fuller heading |
| --- | --- | --- | --- |
| `SETUP/references/interview.md` (INT-1) | "A Git repository", "A linked worktree" | Each names a thing and not what the section tells the reader to do | "What to do when the folder is not the root of a Git repository", "What to do when the session runs in a linked worktree". The reader's own Layout section gives headings that pass. Use those, and not the ones in INT-1. |
| `SETUP/references/placing-files.md` | "6. Check the result" | It does not say which result | "6. Check that the files, the link, and the pre-commit setting are in place" |
| `SETUP/references/skills-hooks-settings.md` (SHS-6) | "Where to start" | It does not say what starts | "Which file a merge starts from" |
| The same | "Plain settings" | "Plain" has no meaning alone | "A setting with a plain value: when to add it and when to ask" |
| The same | "Entries added last" | It does not say which entries | "The entries for `validate-records.mjs`, which are added last" |
| The same | "A key written another way" | It does not say what to do | "What to do when the file writes a key in another form" |
| `SETUP/references/finishing.md` (FIN-4) | "Checks for one choice" | It does not say which choices | "Checks only for a Salesforce, Notion, GitHub Issues, or Hindsight project" |
| `SETUP/references/github.md` (GH-3) | "Checks after a new project or an update" | `finishing.md:157` names this heading with no file text around it | "Checks after setting up GitHub Issues or bringing it up to date" |
| `SETUP/SKILL.md` | "Commands in Codex" | It does not say which commands or why | "Commands that the Codex sandbox refuses, and how to run them" |
| `SETUP/references/update.md` (U-13) | "5. Steps for the project's tracker, memory service, and earlier versions" | "Tracker" is a word that `dev/reviews/word-list.md` replaces with plain words | "5. Steps for Notion, Hindsight, GitHub Issues, and projects set up before an earlier version" |
| `SETUP/references/one-home-layout.md` (O-5) | 22 headings such as "A shared question", "The glossary", "`PROJECT.md`" | Each names a thing and not what the section says about it | "Where a shared question goes", "Where the glossary goes", "What changes in `PROJECT.md`", and so on for each of the 22 |
| The same | "Steps after the owner's yes" | It does not say yes to what | "The order of the moves after the owner's yes to the plan" |
| `SETUP/references/old-toolkit-pieces.md` (P-3) | "Old plugins" | It does not say what to do with them | "Old plugins to turn off for this project" |
| The same | "Old rules in `.claude/rules/`", "Old hook commands in `.claude/hooks/`" | Each names the files and not what the table gives | "Old rules in `.claude/rules/` and what Toolkit V2 has in their place", and the same form for hook commands |
| `SF/.claude/rules/salesforce-project.md` (F73) | "Where to look" | It does not say for what | "Where to find the command or the steps for a Salesforce task" |
| `SF/.claude/skills/sf-component-tracker/SKILL.md` (F1) | "Manual steps (`manual-steps.md`)" | It does not say what the section tells the reader | "When to add a manual step, and the form of a step in `manual-steps.md`" |

Five notes on the layout proposals:

- **`SETUP/SKILL.md`, "Mistakes to avoid".** Do not rename it to "Rules for every setup job". `dev/reviews/word-list.md`, part 2, chose "Mistakes to avoid", ten skills use it, and `finishing.md:134` and `hindsight-on-vps.md:119` name it.
- **`SETUP/references/finishing.md`, the 24 checks.** The reader keeps the numbers "because other files may cite them". No file names a check by its number. So move check 24 to follow check 18 and renumber. A list that runs 1 to 18, then 24, then 19 to 23 would be harder to follow than the list as it is.
- **`SETUP/references/one-home-layout.md`, "After the owner's yes".** The reader says nine places in `update.md` and `move-over.md` name this heading. None does. The heading is named six times inside `one-home-layout.md` and by no other file. `update.md:389` names the step number only. `move-over.md` has its own heading "5. After the owner's yes".
- **`SF/tools/permissions/PERMISSIONS-RUNBOOK.md`, "Verified on this org".** The new heading passes. Do not move the section after "Procedure 3". `SF/tools/permissions/README.md:5` says to verify before the tool is used, so the section belongs before the procedures.
- **`SF/.claude/rules/salesforce-agent-permissions.md`, "Confirm with the owner first".** The new heading passes. Three shipped files name the old one (`update.md:281`, `update.md:321`, and `old-toolkit-pieces.md:75`), and the file is the owner's own.

## Questions answered from the repository

| Question | Answer | Where the answer is |
| --- | --- | --- |
| U-1: do the two tables in `update.md` map `managing-work-items` to `running-work-item-lifecycle` and back? | Yes. See "High findings". | `SETUP/references/update.md:245`, `:255` |
| F17: where is `salesforce-permissions-research.md`? | No file of that name is in this worktree. The runbook points to it three times (lines 14, 21, 195). It was a 323-line guide in the older claude-toolkit. The owner was asked on 2026-09-30 whether to copy it in, and no file shows an answer. | `dev/archive/research/project-init-library.md:587`, `dev/archive/model/model-changes-2026-09-30.md:429-431` |
| Where is the skill `sf-architect-solutioning`? | The toolkit does not ship it. "Toolkit V2 ships no Salesforce architect skill (Mike, 2026-10-02)". The name is left in two places only: the settings snippets, which turn off the older plugin `sf-architect-solutioning@claude-toolkit`, and the history files under `dev/`. The root `AGENTS.md` does not name it. So the readers' brief names a text that does not exist. | `dev/SKILL-INDEX.md:165`, `SETUP/assets/settings/enabled-plugins-off.json:9` |
| FIN-5: where does 22,528 bytes come from? | It is 22 times 1,024. The limit was set on 2026-09-30 at "about 20 KB", to leave room under Codex's 32,768 bytes for the owner's own `~/.codex/AGENTS.md`. It was 20,480 until pull request 30 raised it to 22,528, because the starter `AGENTS.md` had grown to 20,768 bytes. The starter file is 22,501 bytes now. A clause for `finishing.md:145`: "The byte limit leaves about 10,000 of those bytes for the owner's own Codex file and the folder guides." | `dev/archive/reviews/2026-09-30-routing-and-agents-md-review.md:172`, `dev/PROGRESS.md:774-777` |
| FIN-2: are the line limits of the project's Current State only in a guide that setup deletes? | The limits are in the fill-in guide comment, and `finishing.md:105` deletes that comment. But the limits are stated again in two files that stay. So the rewrite can give the numbers: Now 5, Coming up 3, Waiting on 4, Standing jobs and shared files 3, Next session starts with 3, and under 40 lines in all. | `SETUP/assets/memory-local/memory/CURRENT_STATE.md:3`, `SETUP/assets/memory-process/.claude/skills/managing-project-memory/references/current-state.md:22-32`, `SETUP/assets/memory-hindsight/.claude/rules/hindsight-memory.md:27-32` |
| U-11: which field holds "what allowed the save"? | The header field `authorization` in a local memory file, and the property "Authorization" in Notion. | `SETUP/assets/memory-local/.claude/skills/managing-project-memory/references/record-format.md:34`, `SETUP/assets/memory-notion/.claude/skills/managing-project-memory/references/database-layout.md:220` |
| U-12: where does a project record its toolkit version? | Nowhere. "Toolkit settings" has no version line. So the rewrite must give a sign for each version. For 0.8.0: an "Untracked to-dos" heading in the project's Current State, a `### P01-U01` heading in `PROJECT-ROADMAP.md`, or a "Done" checkbox on the Notion Tasks database. For 0.8.1: the line `**Overall status:**` in the Requirements section of the work item template. | `SETUP/references/earlier-versions.md:49`, `:57`, `SETUP/references/notion-build/work-setup.md:244`, `:280` |
| E-5: what is the older label of the Functional Requirements? | "Functional, Process, Logic, Schema, etc. Requirements" | `dev/PROGRESS.md:1117` |
| H-2: what is a knowledge page? | A page that Hindsight builds from the bank's observations and brings up to date after each consolidation. | `ai-external-knowledge/hindsight/api-knowledge-pages.md:19` |
| H-3: what are `world` and `experience` memories? | `world` is a general fact, and `experience` is a personal experience. | `ai-external-knowledge/hindsight/claude-code-integration.md:225` |
| F21: where is the preflight receipt? | `permsets.py preflight` writes it to `.claude/.permset-preflight/<name>.json`, and the deploy guard reads it. | `SF/tools/permissions/permsets.py:583-594` |
| F37: which install steps of the `kb` README does setup already do? | Steps 1, 2, and 5. The reader guessed 1 and 2. Setup copies `tools/kb/`, the `.gitignore` that every project gets holds the three lines, and the settings file that every project gets holds the Stop hook, which setup removes in a project that is not a Salesforce project. Steps 3 and 4 are left. | `SETUP/assets/every-project/.gitignore:12-14`, `SETUP/assets/every-project/.claude/settings.json:17` |
| F45: how is the Stop hook turned on again? | `GRAPH_FRESHNESS` is an environment variable. The hook is off only while it is `0`. Remove the variable. The reader's rewrite is right. | `SF/tools/kb/graph_freshness_hook.py:172` |
| F94: what is a "Hitchhiker review"? | It is the older toolkit's name for the check that `sf-deploy-check` now does. The older rule was `deploy-hitchhiker-check.md`. | `SETUP/references/old-toolkit-pieces.md:77` |
| F116: do skill descriptions have a part that follows ", so"? | 2 of the 17 shipped descriptions do. The reader wrote that none does. The finding stands, because the example fits only those two. | A search of every `SKILL.md` under `plugins/` |
| SHS-1: what does `codex-after-commit.mjs` print? | After a `git commit` command, it reminds the agent to update the work item's Recent History and status, and the work item's line in the project's Current State. | `SETUP/assets/every-project/.claude/hooks/codex-after-commit.mjs:9-11` |
| Which workstreams strings does a test compare? | "Done today (1)" is compared exactly (`register.test.tsx:248`). "Stopped 4 min ago" is compared exactly (`:164`), so "min ago" is fixed, and "h ago" and "d ago" are not tested. For the instruction to every chat, the test checks only that it contains `mcp__workstreams__report` (`:362`). For "Not saved: ...", the test checks only the words "Not saved" (`:341`). No test reads the command description (F135), the tool's field texts (F136), or "Could not read the chats." (F139). | `plugins/workstreams/hooks/register.test.tsx` |

## Questions only the owner can answer

1. **The setup skill explains the same five words again in each of its files, for example "setup copy" and "main checkout".** Keep one sentence in each file, or explain each word once in the main file? Keeping them means each file can be read alone, at the cost of 24 repeated sentences. Removing them follows the rule "explain a word once for a whole skill". The two readers of the setup files asked for opposite things, so every setup file is rewritten one way or the other.
2. **The three Salesforce skills are your own text.** May they be rewritten to the standard? `sf-component-tracker` needs it most. A yes means a full rewrite of that skill and small fixes in the other two. A no means the findings F1 to F16 and F76 to F89 are closed.
3. **Does a manual deploy step have a "Deploy" phase?** The skill lists three phases: Pre-deploy, Deploy, and Post-deploy. Both templates have only Pre-deploy and Post-deploy. One of the two changes.
4. **The folder `full-project-deployment-template/` holds the project's live master manifest, and a rule says "Never write a record into a template".** May the rule get one sentence that names this folder as the exception? Without it, the rule and the skill disagree.
5. **The permissions runbook points three times to a research file that no project has.** Copy that file into every Salesforce project, or remove the three pointers? You were asked this on 2026-09-30, and no file shows an answer.
6. **Four lines of `salesforce-org-safety.md`, which is your wording.**
   - It says never to add a production org to "any sandbox allow-list". The settings file has no such list. Which list did you mean, or should those words go?
   - It says the guard "asks by default" for production. Every project is set up with the guard set to block. Should the line say that?
   - It says "every agent and subagent". The other toolkit files say "helper agent". Should the word match?
   - It opens with "Three places, each with one job" and does not say what the rule is for. May it get an opening sentence?
7. **The workstreams panel says "Done today" above work that was finished in the last 24 hours**, so work from yesterday afternoon shows under "today". "Done today" is your label. Change it to "Done in the last day"? A test compares the text, so the test changes too.
8. **The instruction that every chat reads for the workstreams panel is one paragraph of about 150 words.** May it be split into three short paragraphs? The rules stay the same, and the plugin's code grows by a few lines.
9. **The limit for a project's `AGENTS.md` is 22,528 bytes, and the starter file is 27 bytes under it.** The next line that is added to the starter file fails setup's check. Raise the limit, shorten the file, or drop the byte limit and keep only the line limit?
10. **After a permission set deploy, a rule tells the agent to "click Recalculate" in Salesforce Setup.** An agent cannot click there. Should the rule say that the agent tells you to click?
11. **Data change folders are dated `<MMDDYYYY>`, and release folders are dated `<YYYY-MM-DD>`.** Use one form? A change affects only folders made after it.

## Findings that are not a problem or have an unsafe rewrite

### Not a problem

- **F84, `SF/.claude/skills/sf-deploy-check/SKILL.md:8-29`.** The long phrase is repeated five times and is clear each time. The rewrite coins a new word, "an unwanted shipment". The standard puts a made-up word last, after plain words.
- **F136, `plugins/workstreams/hooks/register.tsx:260-272`.** The instruction and the tool's field texts repeat the limits on purpose. A chat reads the instruction at its start, and it sees the field texts only after it loads the tool.
- **Pattern F in setup part one, lowercase "id".** See "Patterns".
- **The rename of "Mistakes to avoid" in `SETUP/SKILL.md`.** See "Headings and layout".

### Wrong level: Low, not Medium

- **INT-5, `SETUP/references/interview.md:91`.** The cell holds five sentences, and the two rows above it hold three and four. The rewrite also drops "on the VPS" from the first sentence.
- **FIN-4, `SETUP/references/finishing.md:113-158`.** Each of checks 19 to 23 already starts with the choice it is for.
- **U-5, `SETUP/references/update.md:145`.** "That section" follows the sentence that names the section.
- **M-2, `SETUP/references/move-over.md:96-98`, and P-1, `SETUP/references/old-toolkit-pieces.md:29`.** The explanation is one or two lines after the word.
- **F5, `SF/.claude/skills/sf-component-tracker/SKILL.md:33-34`.** This file writes both names in full.
- **F10, the same file, `:55-59`.** One bullet that adds nothing.
- **F31, `SF/tools/kb/README.md:127`.** "The reader" is understood at once.
- **F59, `SF/.claude/rules/salesforce-agent-permissions.md:37-39`.** Line 39 explains the difference in two sentences.
- **F86, F101, F130, and F135.** Each is awkward and is understood at once.

### The problem is real, and the rewrite needs work

| Finding | What is wrong with the rewrite | A better rewrite, or what to do |
| --- | --- | --- |
| SKILL-3, `SETUP/SKILL.md:70` | It puts the third case in front of a list of "either of these" | Keep the three sentences. Add one clause each for Hindsight, bank, and observation where each word first appears. For "observation": "a statement that Hindsight builds from several saved memories" (`hindsight-on-vps.md:50`). |
| INT-3, `SETUP/references/interview.md:30` | "Another toolkit's setup" leaves out agent files made by hand, which `SETUP/SKILL.md:84` counts | Rename row 7 to "Toolkit V2 already set up", and keep the name of row 8. |
| SHS-1, `SETUP/references/skills-hooks-settings.md:45` | It leaves a gap for the writer | "`codex-after-commit.mjs` runs after a `git commit` command. It reminds the agent to update the work item's Recent History and status, and the work item's line in the project's Current State." |
| SHS-7, the same file, `:22-41` | It edits text that `dev/tools/check-skills.mjs` reads | Keep the sentence "The shared skills are the same in every project (10): ..." word for word (`check-skills.mjs:469`). In the Skills column of the table, the tool reads every word in backticks that has no dot as a skill name (`check-skills.mjs:486`), so add no such word to a cell. |
| FIN-1, `SETUP/references/finishing.md:37` | It allows only the questions of two files, but `notion.md`, `github.md`, `salesforce.md`, and `hindsight-on-vps.md` also give questions | "Ask only the questions that this skill's files give. Never invent a question to finish setup." |
| FIN-8, `SETUP/references/finishing.md:148` | It replaces "front matter", which `dev/reviews/word-list.md`, part 3, says to leave alone | Add only the clause about `command grep`. |
| COPY-2, `SETUP/references/setup-copy.md:48` | It drops the names of the two setup folders that supply the skills | Keep "that `every-project` already supplied" and "that `memory-process` supplied". |
| SF-2, `SETUP/references/salesforce.md:53` | It narrows "add no other line anywhere" to a "Waiting on" line, which is a guess | "leave `XX.0` in both files, write nothing about the version in any other file, and list the version in the report among the prompts that are left." |
| U-3, `SETUP/references/update.md:65` | It drops the point of the clause | "Run sections 2 to 4 from your worktree, so that each path without a folder in front of it, such as `.claude/skills/<name>/`, is a path in the worktree." |
| U-4, `SETUP/references/update.md:121` | It loses the step that tells the owner. Line 186 uses "name" the same way | "Never overwrite one of these files. Tell the owner each change that the toolkit made to the file (a new section, a changed heading, or a changed guide comment). Make only those changes, and make them after the owner's yes." |
| U-10, `SETUP/references/update.md:273` | "For the same reason" still makes the reader look back | "The current folder layout also removed `decision_template.md` and `terminology-glossary.md` from the local `memory/` folder, because a project term is now a row of `system/glossary.md`, and a decision that more than one work item needs is an entry in `DECISIONS.md`." |
| O-3, `SETUP/references/one-home-layout.md:279` | It adds the line only when `validate-records.mjs` reports it. That command does not read work items in Notion or GitHub | Keep "In step 7" with no condition. Add: "For a local work item, this is the one change that is made in the main checkout before the merge." |
| F2, `SF/.claude/skills/sf-component-tracker/SKILL.md:44` | "It lists every component in the project" is not true. Line 69 keeps four types out | "It lists every component of the project that the Salesforce command line can deploy." |
| F7, the same file, `:105-112` | It removes the Deploy phase, which is a rule | Ask the owner first (question 3). |
| F8, the same file, `:116` | Deleting the line loses "and updates its status" | Keep that clause in line 111. |
| F25, `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:19` | "Only adds to what the org holds" is not what "overlay" means | "a profile deploy changes only what the file names and leaves the rest of the profile in the org as it is" |
| F31, `SF/tools/kb/README.md` | "Use 'the extractor' everywhere" is wrong at line 294, where "the shared reader" is `graph.py` and not an extractor | Change only lines 127 to 131 and 267. |
| F75 (Low), `SF/.claude/rules/salesforce-project.md:3` | "The toolkit installs Salesforce's official skills" is false. Setup never installs them (`SETUP/SKILL.md:110`) | "The owner installs Salesforce's official skills (`forcedotcom/sf-skills`). Use them for ..." |
| F105, `plugins/toolkit/skills/writing-harness-files/SKILL.md:32` | It defines "small" with a test that the owner did not give | "For a small edit, one reviewer reads the change once and does not read the fix." Leave "small" to the agent's judgment. |
| F109, `plugins/toolkit/skills/writing-harness-files/references/checklist.md:34` | It adds an instruction that the official page does not give | Check the live page before adding it. |
| F126, `plugins/toolkit/.claude-plugin/plugin.json:4` | "The hook commands those skills need" is not true. Every project gets the four hook commands | "It copies the project files, the skills for the work tracking and memory that the owner chooses, and four hook commands." |
| F133, `plugins/workstreams/hooks/register.tsx:43-56` | The rewrite keeps every rule. It makes the code longer, and the root `AGENTS.md` says to tell the owner the size before the plugin grows | Ask the owner first (question 8). |

Two rewrites rest on a guess that the reader marked as a guess. The writer confirms each from the file before using it: PLACE-2 (`placing-files.md:79`, what comes after "first") and WS-7 (`work-setup.md:256`, what "Do the same" covers).

One rename costs more than the reader says. WS-2 renames the heading "Bringing a project up to the current template". That heading is named 15 times: 11 in `work-setup.md`, 2 in `earlier-versions.md`, 1 in `notion.md`, and 1 in `one-home-layout.md`.

## What the readers missed

- **The three `sf-*` skills are the owner's own text**, and the readers' brief did not say so. See "How reliable the readers were". The same care applies to `salesforce-agent-permissions.md`, which the root `AGENTS.md` calls the owner's own file with defaults that the owner approved on 2026-10-08.
- **The readers' brief names a skill that is not shipped.** It lists "the body of the skill `sf-architect-solutioning`" as the owner's approved words. The toolkit has no such skill (`dev/SKILL-INDEX.md:165`).
- **Two lines of `sf-component-tracker` disagree about adding a column.** Line 136 says "Rename or add columns to match the project's orgs". Line 172 says "The header and column order are fixed. Ask the owner before adding a column." An agent that reads line 136 adds a column without asking.
- **The permissions runbook asks for setup steps that no setup file gives.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:6-9` says "At setup, fill the verified sandbox alias ... and package directory, then record the first org verification below". `SF/tools/permissions/README.md:5` says to do it "before using the tool". No file of `project-setup` names the runbook, `<SANDBOX>`, or `<PACKAGE_DIR>`. So a new Salesforce project keeps those prompts, and setup's report does not list them, because the report searches only `AGENTS.md`, `README.md`, and `PROJECT.md` (`finishing.md:215`).
- **`SF/.claude/rules/salesforce-project.md:3` says that Salesforce's official skills "are installed for this project".** Setup only checks for them and gives the owner the command. In a project where the owner has not run it, the rule is false.
- **In four template lines, "the tracker" means the place where the work items are kept**, while the skill beside them uses "the tracker" for the component tracker: `SF/delivery/deployments/full-project-deployment-template/manual-steps.md:14` and `:29`, and `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md:5` and `:37`.
- **Three sentences in the setup files are read by `dev/tools/check-skills.mjs`**, and no finding marks them "exact string": the sentence "The shared skills are the same in every project (10): ..." (`skills-hooks-settings.md:22`), the header `| Choice | Skills |` (`:26`), and the sentence "10 shared, plus 1 for local or Notion memory (none for Hindsight), plus 1 for Notion work items or memory (`using-notion-cli`, once), plus 3 for Salesforce" (`interview.md:140`). A writer who rewords one of them fails the check.
- **`SETUP/references/notion-build/work-layout.md` has 11 table cells with three or more sentences.** The reader gave that file one Medium finding and did not list the cells.
