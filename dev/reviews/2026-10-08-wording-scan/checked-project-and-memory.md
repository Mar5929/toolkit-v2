# Wording scan check: the files every project gets, and the memory folders

This file checks two findings files: `every-project-files.md` and `memory-folders.md`. For each finding that it checks, it says whether the problem is real, whether the level is right, and whether the proposed rewrite is safe to use. I opened the cited file and line for every finding below.

Short paths in this file start at `plugins/toolkit/skills/project-setup/assets/`. A path that starts with `.claude/` or with a project folder such as `delivery/` is under `every-project/`. "The standard" is `document-clarity-standard.md`. "The size test" is the last test in `dev/tests/hooks.test.mjs` (lines 762 to 771).

## How reliable the readers were

Both readers find real problems. Both are weak on the same three things: the level of a High finding, a string that a test compares, and what a change does to other files.

| Area | Checked | Problem is real | Rewrite safe as written | Rewrite needs work | Level too high | Not a problem |
| --- | --- | --- | --- | --- | --- | --- |
| `every-project-files.md` | All 3 High and all 65 Medium | 67 of 68 | 40 | 21 | 8 | 1 |
| `memory-folders.md` | The 1 High and all 56 Medium | 54 of 57 | 42 | 11 | 4 | 3 |

- A finding can be in two columns, for example a real problem with a level that is too high.
- Of the Low findings (98 and 84), I checked about ten in each area. The ones I checked were accurate, apart from the four on `validate-records.mjs` (see "Findings that are not a problem").
- **Every-project area.** The Medium findings can be trusted as a list of places to fix. Do not use a rewrite for the root `AGENTS.md`, for a hook string, or for a heading without the checks in this file. Eight rewrites there break a test as written.
- **Memory area.** The Medium findings can be trusted. The reader's line numbers and counts were right in all but three places. The rewrites for `hindsight-memory.md` make a file longer that loads in every session and is already over its proposed size.

Three things that both readers missed are in "What the readers missed". They change how the fixes should be made.

## High findings

Only one of the four High findings is High as `BRIEF.md` defines it ("the reader would likely do the wrong thing, or cannot follow the text").

| Finding | Verdict | Reason |
| --- | --- | --- |
| `AGENTS.md:150` (the "where are we" procedure in a table cell) | Wrong level: Medium. Rewrite needs work. | Every sentence in the cell is clear, so the reader does the right thing. The problem is that the procedure is hard to find. In step 6 of the rewrite, "Choose work that has started first" can be read as "the work that started earliest". The proposed heading fails the heading test (see "Headings and layout"). |
| `.claude/skills/filechanges/SKILL.md:31` (seven link rules in one bullet) | Wrong level: Medium. Rewrite is unsafe. | Each sentence starts with its condition and can be followed on a second read. The rewrite drops one rule: "When that form shows the path itself, as a path in code form does, write the full path in place of the name." The reader's note says the rule is kept, and it is not. The numbers (1) to (4) also make four alternatives look like four steps in order. |
| `.claude/skills/pull-latest/SKILL.md:31-33` (the exception to the stops) | Confirmed. High stands. | One sentence gives an exception to step 1, sends the reader to step 2 and to step 5, and uses "your own worktree", which the skill never explains. The exception comes after the list that says "Stop". A reader is likely to stop before step 2. The rewrite keeps every rule. Add one clause that says what "your own worktree" is: a worktree that is not the main checkout. |
| `memory-local/memory/project_topic_template.md:20` (TP-1) | Wrong level: Medium. Rewrite needs a small fix. | The comment is one line of 2,354 characters (the reader wrote "about 2,700"). The rule for `work_items` can be followed on a second read, and `record-format.md` and `memory-store.md:63` state it again. The rewrite turns "Examples sit in backticks" into an instruction to write examples, which the agent never does. It also drops the reason "These links let each work item list its memories in Obsidian's backlinks panel". |

Better rewrites:

- **`AGENTS.md:150`, step 6:** "Name the next work item to start. Choose in this order: work that has already started; then work in the earliest project phase that is not Done; then the highest-priority work item in Backlog."
- **`filechanges/SKILL.md:31`:** keep the first two sentences, and then give each case its own line.
  - "For a copy on this computer, the target is the full path of the copy. A path that is not a full path is resolved from a folder that you may not be working in, so it can open another copy. Then choose the form of the link:"
  - "When your instructions give a form for a link to a local file, use that form, with the full path in it. Claude Code and Codex each have their own form."
  - "When that form shows the path itself, as a path in code form does, write the full path in place of the name."
  - "When your instructions give no form, write a Markdown link whose target is the full path."
  - "In a Markdown link, write the path with forward slashes, and put a path that holds a space between `<` and `>`, so that the whole path stays in the link."
  - "When your instructions say that a link opens only files in certain folders, and the copy is outside those folders, write the full path of the copy in code form in place of the link, so that the owner can open the file."
- **Template, last sentence of TP-1:** "The examples in this guide are in backticks so that Obsidian does not count them as links. Write a real link without backticks."

## Patterns

### Patterns in `every-project-files.md`

| # | Pattern | The reader's count | Corrected count | Three examples | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | Four names for the project's main folder | "main checkout" 81, "the project's main folder" 13, "main project folder" 3, "main folder" 2; nine definitions in nine different sentences | See the next section | `.claude/skills/filechanges/SKILL.md:12`, `.claude/skills/pull-latest/SKILL.md:68`, `.claude/skills/reset-to-remote/SKILL.md:87` | Real, but narrower than reported |
| 2 | A step that is a label and a fragment | 18 in 5 skills | 13 in 4 skills: `braindump` 5, `session-summary` 3, `pull-latest` 4, `reset-to-remote` 1 | `.claude/skills/braindump/SKILL.md:22`, `.claude/skills/session-summary/SKILL.md:15`, `.claude/skills/pull-latest/SKILL.md:35` | Real. The five kinds in step 3 of `handoff` are not cases: each is a label followed by whole sentences. |
| 3 | "on its own" for "in a separate command" | 11 in 8 files | 7 in 5 files in this area, one of them a copy. 10 in 8 files in all of `plugins/`. | `.claude/skills/merge-and-clean-up/SKILL.md:16`, `.claude/skills/publish-docs/SKILL.md:38`, `.claude/skills/reset-to-remote/SKILL.md:47` | Real, Low. The toolkit already has the clear wording: `work-github/.../work-tracker-gh-commands.md:46` says "Never join it to another command with `&&`, `;`, or a pipe." Use that sentence everywhere. |
| 4 | The Codex sandbox paragraph in five files | 5 | 5 in this area: four paragraphs that are almost the same, and one line in a rule. 13 files in `plugins/` name escalated permissions. | `.claude/skills/pull-latest/SKILL.md:86`, `.claude/skills/reset-to-remote/SKILL.md:93`, `.claude/skills/publish-docs/SKILL.md:166` | Real. A shared source under `dev/build-shared/` is the fix, as the reader says. |
| 5 | A procedure or a rule in a table cell or in the wrong section | 5 | 5 | `AGENTS.md:150`, `.claude/skills/reset-to-remote/SKILL.md:82`, `.claude/skills/publish-docs/SKILL.md:37` | Real. The strongest pattern in this area. |
| 6 | "Keep this guide." with no reason | 11 files | 11 files | `DECISIONS.md:3`, `system/glossary.md:3`, `sources/README.md:3` | Real, Low. The reader's question is answered below: the guide must stay a comment. |
| 7 | The closing line of a reply is described seven ways | 7 | 4 wordings on 9 lines in all of `plugins/` | `.claude/skills/pull-latest/SKILL.md:74`, `.claude/skills/merge-and-clean-up/SKILL.md:213`, `.claude/rules/cite-recalled-knowledge.md:8` | Real. One wording is already the most used: "the exact words that continue the work". |
| 8 | Idioms | "holds" 19, and four others | 5 single cases. "holds" is not a case. | `.claude/skills/filing-project-records/SKILL.md:55`, `.claude/skills/handoff/SKILL.md:15`, `AGENTS.md:118` | Partly real. "Holds" is an ordinary word. The standard uses it ("what the section holds"), and this area uses it 124 times. |
| 9 | "save" means two things | 3 | 1 real clash | `.claude/skills/filing-project-records/references/file-source.md:37` | Weak. The word list decided "save" for a work item or a memory record. `filing-project-records` and `publish-docs` each say what "save" means in that skill. Only `file-source.md:37` uses the other meaning inside one of them. |
| 10 | Words for the owner | "the user" 7 | "user" 10 times in the output style; "himself" once | `.claude/output-styles/plain-english.md:11`, `.claude/output-styles/plain-english.md:37`, `.claude/skills/filechanges/SKILL.md:31` | Real, Low. |

### The names for the main folder, counted across `plugins/`

The caller asked for this count. Each number counts every use, including a name that is split across two lines.

| Name | Uses | Files | What it is |
| --- | --- | --- | --- |
| "main checkout" | 182 | 36 | The name the word list keeps. |
| "the project's main folder" | 28 | 22 | In 21 files it is the explanation of "main checkout". Only `filechanges/SKILL.md` uses it as the name (6 uses), and that skill never says "main checkout". |
| "main project folder" | 5 | 2 | Words the agent says to the owner: `pull-latest/SKILL.md:68-70` (3) and the sample reply in `session-summary/SKILL.md:84` and `:87` (2). |
| "main folder" alone | 2 | 1 | `filechanges/SKILL.md:26` and `:29`. |
| "the project folder that other sessions share" | 2 | 1 | `reset-to-remote/SKILL.md:87-88`, in the two lines the plan must show the owner word for word. The reader did not list this name. |
| "base worktree" | 11 | 1 | Not a name for the main folder. `merge-and-clean-up/SKILL.md:24` defines it as the worktree that holds the base branch. |

What the word list decided (`dev/reviews/word-list.md`, row "main checkout"): keep the word and explain it once, as "the project's main folder: the first path `git worktree list` prints". Use one name, and drop "main project folder" and "base worktree". The word list also notes that hook text and tests hold the word.

What this means:

- The skills follow the word list in their instructions. The exceptions are `filechanges` (8 uses) and the 7 uses in words that the owner reads.
- The words that the owner reads use three plain names. None of them is "main checkout", and that is reasonable: the owner does not know that word. One plain name for those lines needs the owner's choice (see "Questions only the owner can answer").
- "Nine definitions in nine different sentences" is not right. In this area ten files explain the main checkout. Five use the same sentence, and five use another wording (`AGENTS.md:39`, `pull-latest/SKILL.md:27`, `delivery/AGENTS.md:57`, `filechanges/SKILL.md:12`, and a form field in the copy `handoff-verifier.md:35`). Across `plugins/`, 25 files explain it and 13 use the same sentence. "A worktree is a separate folder with its own branch." is the same sentence in 13 files.
- Do not move the explanation to the root `AGENTS.md` only, as the reader suggests. A helper agent may not load the root `AGENTS.md`, and the standard says to explain a kept word where the reader first meets it. Use the one sentence in the five files that differ.

### Patterns in `memory-folders.md`

| # | Pattern | The reader's count | Corrected count | Three examples | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | The bare name "Current state" for the project's page | 14 lines in 7 files | 14 lines in 7 files, of which 3 are real cases | `memory-local/memory/CURRENT_STATE.md:1`, `memory-local/memory/MEMORY.md:21`, `memory-process/.../tidying.md:156` | Mostly not a problem. The other 11 lines name the Notion page by its real title, and `memory-notion/.../memory-store.md:8` and `current-state-page.md:3` each say once that the page holds the project's Current State. |
| 2 | "the procedure that asked for it" | 3 | 3 | `memory-local/.../memory-store.md:59`, `memory-notion/.../memory-store.md:44`, `memory-notion/.../memory-store.md:45` | Real. |
| 3 | "header" for the front matter | 16 in `memory-local/` | 16 in `memory-local/`, and 10 more in `work-local/`. "Front matter" has 21 uses in 12 files. | `memory-local/.../record-format.md:21`, `memory-local/.../memory-store.md:25`, `memory-local/.../searching.md:20` | Real, and wider than this area. It is a choice for the word list, because work item files use both words too. No table in `memory-local/` has a "header row", as the reader wrote. |
| 4 | History in an instruction | 8 places | 3 lines with the phrase "the layout that was used before the current folder layout" | `memory-notion/.../memory-store.md:30`, `memory-notion/.../views-and-layout.md:20`, `memory-notion/.../database-layout.md:248` | Real for those 3 lines. The other places tell the agent what to do with an old record that an older project still has, so the reader needs them. The reader proposes two different rewrites for the one phrase (VL-2 and DL-2). Use one. |
| 5 | Abbreviations and section names with no place | 5 and 4 | About the same | `memory-process/.../saving.md:161`, `memory-local/memory/project_topic_template.md:34`, `memory-process/.../finding.md:27` | Real, Low. |
| 6 | The sentence hides that a hook acts | 5 | 4 | `memory-process/.../finding.md:18`, `memory-process/.../tidying.md:110`, `memory-local/memory/MEMORY.md:5` | Real. `current-state.md:89` names the hook, so it is not a case. |
| 7 | A label and a colon in place of a sentence | 6 lines | 6 lines | `memory-hindsight/.claude/rules/hindsight-memory.md:28`, `memory-hindsight/.claude/rules/hindsight-memory.md:29`, `memory-hindsight/.claude/rules/hindsight-memory.md:30` | Real by the letter of the standard, but Low: each line is understood at once. See "Files that need a rewrite". |
| 8 | The same rule in several files | 3 rules | 3 rules | `memory-local/memory/project_topic_template.md:20`, `memory-local/.../record-format.md:97`, `memory-local/.../memory-store.md:63` | Real. The repository rule "each instruction lives in one file" (the repository's `AGENTS.md`, "Skills") supports it. |
| 9 | Counts where the agent could judge | 5 counts | 5 counts | `memory-process/.../saving.md:59`, `memory-process/.../tidying.md:88`, `memory-local/.../folders-and-files.md:50` | Real questions for the owner. |

## Files that need a rewrite

| File | The reader's verdict | My verdict | Reason |
| --- | --- | --- | --- |
| Root `AGENTS.md` | Needs a rewrite | Agree for the layout. Disagree for the sentences. | The sentences are clear, apart from the 13 Medium findings. The layout is the problem: six things cannot be found from the headings (see "Headings and layout"). A layout change here has costs that the reader did not name. |
| `.claude/skills/pull-latest/SKILL.md` | Needs a rewrite | Agree. | Steps 1 and 2 hold the one High finding and three label-and-fragment steps. The skill also never explains "your own worktree". |
| `memory-hindsight/.claude/rules/hindsight-memory.md` | Needs a rewrite | Partly agree: regroup it under headings, and fix eight sentences. Do not lengthen it without the owner's yes. | The file has 17 bullets and 2 sub-bullets under no heading (the reader's table says 22, and finding H-2 says 19). Every rule in it is right. The file loads in every session of a Hindsight project. It is 5,313 bytes, and `check-rules.mjs` already warns that it is over the proposed limit of 4,096. The reader's rewrites add about 800 to 1,000 bytes by my estimate. An earlier rewrite kept "the Hindsight rule no longer than before" (commit `c8f6205a`). |
| `memory-local/memory/project_topic_template.md` | Needs a rewrite | Agree, for the comment on line 20. | The comment is one line of 2,354 characters with about twelve instructions. The fields and the body prompts are fine. |

Other verdicts I checked: `filechanges`, `session-summary`, `delivery/AGENTS.md`, `reset-to-remote`, `saving.md`, `tidying.md`, and `views-and-layout.md` are "small fixes", and I agree with each.

## Headings and layout

### The root `AGENTS.md` of the starter project

Headings as they are, in order:

1. `# AGENTS.md`
2. `## <Project name>: agent guide`
3. `## Your job as the agent`
4. `## Every session`
5. `## Project map`
6. `## Where information goes`
7. `## Ask the owner first`
8. `## Which skill`
9. `## Commands`
10. `## How to write replies`

What a new reader cannot find from these headings:

| The reader looks for | Where it is now |
| --- | --- |
| What to report when the owner asks "where are we" | One cell of the "Which skill" table (line 150) |
| How to find what was decided before, and when to search memory first | The last paragraph of "Where information goes" (line 120) |
| What to do on every message, and how to find the work item a message is about | Under "Every session" (lines 31 to 34), although the text says "On every turn" |
| What a helper agent follows | A bullet in the middle of "Every session" (line 30) |
| What "main checkout" and "worktree" mean, and that Git does not track three folders | A bullet above the table in "Project map" (line 39) |
| That work items are kept in one place and are named by ID | A bullet above the table in "Project map" (line 40) |
| What this file is, and what "the toolkit" is | Nowhere. The word "toolkit" is used on lines 47, 55, and 156. |

The order I propose. It is the reader's order with one more split and with fuller headings.

1. `## <Project name>: agent guide`: the project sentence, what this file is, what a session is, and the note on voice-to-text.
2. `## Your job as the agent`: the owner's text, unchanged.
3. `## What to read at the start of every session`: lines 26 to 29.
4. `## What to decide on every message`: lines 30 to 34.
5. `## Where information goes`: the filing sentence and the table.
6. `## How to find what was decided before`: line 120, with its last sentence as a list.
7. `## Ask the owner first`
8. `## Which skill`
9. `## What to report when the owner asks where the project stands`: the procedure from line 150.
10. `## How to write replies`
11. `## Commands`
12. `## What each file and folder holds`: the table that is "Project map" today, with its three bullets, last.

Three headings keep their names for a reason:

- "Where information goes" and "Ask the owner first" are named inside "Your job as the agent" (line 20), which is the owner's approved text. "Where information goes" is also cited on 24 lines in 17 files, in `prompt-reminder.mjs`, and in `dev/tests/hooks.test.mjs:469`.
- "Which skill" is cited on 11 lines in 9 files.

Costs of this change that the reader did not name:

- **Every existing project.** `references/update.md:186-187` compares the `## ` headings of the starter's `AGENTS.md` with the project's file, "in the same order". When a heading is missing or the order differs, "update the toolkit" builds a new `AGENTS.md` for that project and carries the owner's lines over. So one renamed, moved, or added heading starts that rebuild in every existing project. Make all the heading changes in one version, together with the changes of the branch `audit-p1-new-rule-fits`.
- **"Every session" is an exact string.** `session-start.mjs:10` prints "then do "Every session" in the root AGENTS.md again", and `dev/tests/hooks.test.mjs:146` and `:149` compare the hook's line and the heading. A rename changes the hook, the test, and the heading together. The new name fits in the hook's three lines, so the hook does not grow.
- **"Project map" is cited in five other places.** They are `AGENTS.md:128`, `memory-hindsight/.claude/rules/hindsight-memory.md:27`, `memory-process/.../memory-process.md:58`, `memory-process/.../memory-criteria.md:67` (in lower case, so search without regard to case), and `references/update.md:186`. `dev/evals/keeping-project-records/README.md:82` names it too.
- **"Commands" is cited.** `references/update.md` says a section that the owner added "goes in right after "Commands"".
- **Size.** The file is 22,501 bytes and loads in every session. The reader's new opening paragraph and new section add text. An earlier pass cut the file to 19,879 bytes on purpose.

### Proposed headings that fail the heading test

The test: a reader who sees only the heading knows what the section holds.

| File | The reader's heading | Why it fails | A fuller heading |
| --- | --- | --- | --- |
| Root `AGENTS.md` | "At the start of a session and on every message" | It says when, and not what the section holds. | Two headings: "What to read at the start of every session" and "What to decide on every message" |
| Root `AGENTS.md` | "When the owner asks where the project stands" | It gives a condition and no subject. | "What to report when the owner asks where the project stands" |
| `.claude/skills/publish-docs/SKILL.md` | "When to use this skill" | The section holds which edits the skill may commit. | "Which edits this skill may commit" |
| `delivery/AGENTS.md` | "What a record holds" | It does not say which records. | "The file and the fields of each kind of delivery record" |
| `delivery/AGENTS.md`, `sources/AGENTS.md` | "Rules that always apply" | It does not say what the rules are for. It is no fuller than "What must stay true". | "Rules for every record in this folder" |
| `sources/AGENTS.md` | "What a row in the list holds" | It does not say which list. | "The columns of a row in the list of sources" |
| `.claude/rules/keep-work-item-current.md` | "Keep the Current state true" | It uses the bare name, which the owner ruled out on 2026-10-06. | "Keep the work item's Current state true" |
| `.claude/rules/keep-work-item-current.md` | "Keep the owner's approval when the State changes" | It does not say approval of what. | "Keep the owner's approval of the requirements when the State changes" |
| `memory-hindsight/.claude/rules/hindsight-memory.md` | "How to search, save, and file" | It does not say what. | "How to search Hindsight, save to it, and file a fact" |
| `memory-hindsight/.claude/rules/hindsight-memory.md` | "Correcting, deleting, and cleaning up" | It does not say what. | "How to correct or delete a memory, and how to clean up memory" |
| `memory-hindsight/.claude/rules/hindsight-memory.md` | "Secrets and the API key" | It names two subjects and no instruction. | "What never goes into Hindsight, and how to keep its API key secret" |
| `memory-hindsight/.claude/rules/hindsight-memory.md` | "The bank and its settings" | It does not say what the reader does there. | "How to see the bank and change its settings" |
| `memory-local/memory/AGENTS.md` | "The memory/ folder" (as the title) | The title today says more: "memory/: what a later session needs and no other file holds". Five other folder guides use the same form. | Keep the title as it is. |
| `memory-notion/.../views-and-layout.md` | "Schema files" | It does not say what the files are for. | "The schema files that build the databases and views" |

Proposed headings that pass: "How to find what was decided before", "What each file and folder holds", "Where to keep a source: in this folder or outside Git", "Save the owner's requirements and corrections", "What Hindsight holds and what it does not", "Pinned properties, sections, and hidden properties of each database", "How to set the page layout in the Notion app", and "Parts of the layout that get no new content".

### Layout proposals that touch other files

- **"What must stay true"** is the heading in six folder guides: `system/`, `sources/`, `delivery/`, `reference/`, `memory/`, and `work-items/`. The readers rename it in three of them, to two different names. Decide once for all six.
- **`sources/AGENTS.md`, "A source kept outside Git".** Two files cite this heading: `.claude/skills/filing-project-records/references/file-source.md:13` and `references/one-home-layout.md:220`. A rename changes both.
- **`memory-notion/.../views-and-layout.md`, "Property order and page layout".** `references/notion-build/setup.md:102` and `:103` cite this heading, the first for the order of the columns and the second for the clicks. The reader's split into two sections changes both lines. The new lists must keep the order of the properties, because `setup.md:102` sends them "in the order of" this section.
- **`.claude/skills/publish-docs/SKILL.md`, step 2 split in two.** The step numbers of this skill are cited on 13 lines inside the skill, in `references/recovery.md`, and in `filing-project-records/SKILL.md:51`. The step is already written with its conditions first and is at most three levels deep, and not four. Keep the step number, and put two bold labels inside step 2: "Look first" and "Find the default branch".
- **`.claude/skills/pull-latest/SKILL.md`, steps renumbered.** Only the skill itself cites its step numbers, so this is safe. Change the four cross-references in the skill in the same edit.
- **`.claude/skills/session-summary/SKILL.md`.** The file has no heading "Steps". The steps follow the opening. Moving "One row per request" above the steps is fine.

## Questions answered from the repository

| Question | Answer | Where |
| --- | --- | --- |
| Which strings of the four hook commands do tests compare? | Nearly all of them. `session-start.mjs`: every printed line except the "stopped early" line and the Notion form of the "Cut short" line. `prompt-reminder.mjs`: every printed string, and the names of the phrase groups. `codex-after-commit.mjs`: its one string, whole. `validate-records.mjs`: the first line in each of its three forms, the line "N more are not shown. Fix these first.", the line "did not run. Its own error:", and a part of the message of each of the 15 checks. | `dev/tests/hooks.test.mjs:146`, `:159`, `:274`, `:284`, `:346`, `:372-382`, `:578`; `dev/tests/validate-records.test.mjs:114-146`, `:254`; `dev/tests/validate-records-cases.test.mjs:175` |
| Does a test compare the `description` in the three Codex hooks files? | Yes, its ending. The description must end with "a check of the project's records after each file edit." The reader's rewrite ends differently and fails this test. | `dev/tests/validate-records.test.mjs:272` |
| Is the title line of `memory/CURRENT_STATE.md` read by a hook or a test? | No. `session-start.mjs` prints the whole file, counts its lines, and reads only the "Last updated:" date. `validate-records.mjs` reads the file only for work item IDs. The tests write their own text, which starts "# Current state", and never read the starter file's title. A new title breaks nothing. | `session-start.mjs:33-34`, `validate-records.mjs:219-220`, `dev/tests/hooks.test.mjs:48`, `:345` |
| Is any line of `memory/MEMORY.md` read by a hook or a test? | Yes. The hook reads the headings "## User" and "## Other memory views" and rebuilds everything between them. The hook writes the link "- [Current state](CURRENT_STATE.md)" in a new index, and a test compares that line. Line 5, the explanation, is free to change. `validate-records.mjs` does not read the file. | `session-start.mjs:12-14`, `:60-61`; `dev/tests/hooks.test.mjs:84`, `:94` |
| Does "Stop after the answer" in the output style conflict with skills on this branch? | Yes. Line 15 forbids "next steps, or an offer to do more unless the user asked". Six skills tell the agent to end with words that continue the work, and one skill tells it to make an offer. The list is below this table. A skill that ends with a question does not conflict, because line 15 does not forbid a question. `filechanges` ("and nothing else") agrees with line 15. | `.claude/output-styles/plain-english.md:15`, `:17` |
| Should the rules at the top of `DECISIONS.md` be visible text (the reader's pattern 6)? | No, unless the hook changes. `validate-records.mjs` skips the text of a comment. As visible text, the line "## DEC-001: <short title>" in the guide would be read as an entry, and its prompts would be reported. The hook is at its limit of 280 lines. | `validate-records.mjs:20`, `:36`, `:58` |
| `saving.md:72` and `:163`: where does a lesson go when the owner agrees to keep it? | The owner chooses one of three outcomes: keep it for the whole project, keep it as not proven, or drop it. A kept lesson about the system or the project becomes a decision, with `filing-project-records`. A kept lesson about how to do a step or how the agent works becomes a line in `owner-preferences.md`. A lesson kept as not proven goes to memory. So the reader's rewrite of SV-3 is wrong where it says that `managing-work-items` drops the lesson. | `.claude/skills/managing-work-items/references/closing.md:53`, `:63-65` |
| `saving.md:160`: does "in place of this project's file" mean "instead of"? | Yes. The words say so, and no other file says otherwise. The other reader's rewrite of the root `AGENTS.md:117` says "also add it", which is the opposite. Use "in place of this project's file" in both. | `memory-process/.../saving.md:160` |
| `hindsight-memory.md:13`: does the list for the owner hold every wrong memory? | The reader's reading holds. Lines 11 and 12 say the add-on cannot delete any memory, so "the memories only the owner can delete" does not narrow the list. | `memory-hindsight/.claude/rules/hindsight-memory.md:11-12` |
| `writing-pages.md:141`: how long does Notion keep a page in the trash? | 30 days. | `dev/research/notion-live-tests.md:123` |
| `using-notion-cli/SKILL.md:44`: what happens when the line of a child page is removed? | Notion deletes the child page, or refuses the change with "This operation would delete 1 child page(s)". The test was run for a child page. No test for the line of a database view is recorded. | `dev/research/notion-live-tests.md:64` |
| Keep "a memory" in the Hindsight rule? | Yes. It is Hindsight's own name for the thing (656 uses of "memories" in the captured Hindsight pages), and the standard says to use the name the system uses. | `ai-external-knowledge/hindsight/` |
| `keep-work-item-current.md:10` and `:18`: what are the field names? | `state`, `status`, `waiting_on`, and `requirements_approved`. The reader's reading of line 18 is right: the approval of the requirements still counts in a later State. | `work-local/work-items/work-item-template/WORK-ITEM.md:5-11`, `.claude/skills/managing-work-items/references/lifecycle-rules.md:184` |
| `owner-preferences.md:3`: how does it differ from `SOUL.md`? | Only the owner changes `SOUL.md`. The agent writes each standing instruction of the owner in `owner-preferences.md`. A true sentence for both files: "`SOUL.md` is the owner's own page about working style, and only the owner changes it. `.claude/rules/owner-preferences.md` holds each standing instruction that the owner gives in a session." | `AGENTS.md:49`, `:82`, `:117` |
| Which file holds the rules for a memory file: the template or `record-format.md`? | The repository states the split: the template shows the shape, and `record-format.md` "holds what the template does not say". The two files do not keep to it, because both give the rule for `work_items`. TP-3 proposes the opposite split. See question 5 for the owner. | `memory-local/.../record-format.md:5` |
| Does "Run each command on its own" mean no `&&`? | Yes. Two files give the full rule. | `work-github/.../work-tracker-gh-commands.md:46`, `.claude/skills/managing-work-items/references/building.md:171` |

The lines that conflict with "Stop after the answer" on this branch:

- `.claude/skills/pull-latest/SKILL.md:74`
- `.claude/skills/reset-to-remote/SKILL.md:78`
- `.claude/skills/merge-and-clean-up/SKILL.md:213`
- `.claude/skills/publish-docs/SKILL.md:98`
- `managing-project-memory`: `memory-process/.../saving.md:169` and `tidying.md:165`
- `managing-work-items`: `references/designing.md:46`, and `references/closing.md:102` ("Tell me the next thing to build.")
- `.claude/skills/session-summary/SKILL.md:26-30`, which ends with an offer

The output style expects such a line itself: line 17 puts the Sources list "just above the closing question or the words that continue the work".

## Questions only the owner can answer

1. **The first file every agent reads in a project.** Its long table of files and folders comes before the table that says where each kind of information goes, and three of its headings do not say what is under them. A new order and fuller headings make it easier to use. The cost: at the next "update the toolkit", the guide of each existing project is rebuilt from the new one, and you approve that in each project. Do you want the new order, made once together with the changes on the other branch? Yes leads to one layout change. No leads to sentence fixes only.
2. **Your text "Your job as the agent".** The reader asks three things. Should it say once what a project phase is? Should "Keep each record" name the records? Should the paragraph "You keep this project's records" become a list? My advice is to leave all three, because the sentences are clear.
3. **The messages that the hook commands print.** Three could be clearer: the note that the project's Current State is old, the note that its file is missing, and the hint on a message with a keep phrase. All four hook commands are at the number of lines you approved. Each clearer message adds one line. Do you allow one more line in the session-start command and one more in the prompt command, or do the messages stay as they are?
4. **The Hindsight rule.** It loads in every session of a Hindsight project, and it is already over the proposed size. Headings and whole sentences make it about a fifth longer. Do you accept a longer rule, or must the rewrite stay within today's size?
5. **The template for a memory file.** The rules for filling in a memory file are written twice: in the comment inside the template, and in the skill. Which one should hold them? My advice: the skill holds the rules, and the template holds a short numbered list of steps.
6. **Numbers in the memory process.** These are fixed numbers today: 30 days to check an unchecked claim, six months before a fact about something that changes is checked again, two sessions before a lesson is offered as a rule, and about 20 sections or 300 lines for one memory file. The session summary also says that a long session "usually holds one to three" requests. Which of these stay as numbers, and which become the agent's judgment?
7. **The name you read for the project's main folder.** Replies to you use three names: "the main project folder", "the project folder that other sessions share", and "the project's main folder". Should every line you read say "the project's main folder"?
8. **One heading in six folder guides.** "What must stay true" is the heading for the fixed rules of each folder. Keep it, or change all six to "Rules for every record in this folder"?
9. **"Header" or "front matter".** The memory and work item files use both words for the block of fields at the top of a file (26 uses and 21 uses). Which one?
10. **"There is a cost" in the output style.** The agent gives one plain line when "there is a cost". Does this mean money, your time, or both?
11. **The Notion rule.** It tells the agent to fill every field of a record, and it says where the fields of a memory record are listed. Should it also say where the fields of a work item are listed?

## Findings that are not a problem or have an unsafe rewrite

### Not a problem

- **`.claude/output-styles/plain-english.md:33`.** "Recently" leaves the judgment to the agent, which is what the owner asked for on 2026-10-08. The rewrite narrows "a named thing" to "a work item's name", which changes the rule.
- **MP-1, `memory-process/.../memory-process.md:65`.** "No longer small and true" states the goal and leaves the judgment to the agent, and the next sentence gives an example. This is the form the owner asked for on 2026-10-08.
- **NP-1 and MN-1, the Notion page named "Current state".** The files use the page's real title and say once what the page holds. "The project's Current State page" would be a name that Notion does not show.
- **The four Low findings on `validate-records.mjs`.**
  - Line 133: `"None."` is the text that the fill-in guides tell the agent to write, so the message quotes it exactly.
  - Line 177: "id" is the name of the field, `id:`, and `dev/tests/validate-records.test.mjs:140` compares the words.
  - Line 276: `dev/tests/validate-records.test.mjs:254` compares "Fix these first."
  - Line 72: `dev/tests/validate-records.test.mjs:117` compares the start of the message.
- **Pattern 8, "holds".** It is an ordinary word.

### Level too high (the problem is real, and it is Low)

- `delivery/AGENTS.md:22-28`: the cells are clear lists. Only the "Migration area" row makes the reader guess, and that row is Medium.
- `.claude/skills/filing-project-records/SKILL.md:18`: lines 8 to 12 name the three kinds of record before the word is defined.
- `.claude/skills/filing-project-records/SKILL.md:50-51`: clear in its place.
- `.claude/skills/handoff/SKILL.md:66`: the step is "Update the project's Current State", so "Now" is clearly a part of it.
- `.claude/skills/publish-docs/SKILL.md:38-55`: see "Layout proposals that touch other files".
- `.claude/output-styles/plain-english.md:37`: "one direct line" is understood at once. The kind of cost is question 10.
- H-7, `hindsight-memory.md:28-33`: each line is understood at once.
- NC-1, `notion-tools/.../ntn-commands.md:70`: "Those pages" sits beside the two placeholder names.
- NR-1, `notion-tools/.claude/rules/notion-records.md:9`: understood at once. The rewrite adds a rule (question 11).

### The problem is real, and the rewrite is unsafe as written

| Finding | What is wrong with the rewrite | A better rewrite, or what to do |
| --- | --- | --- |
| `AGENTS.md:27` | It changes "Read them again after resume, clear, or compaction.", which `dev/tests/hooks.test.mjs:150` compares. | Keep that sentence. Add after it: "Compaction is when Claude Code or Codex shortens the session to save space. In Claude Code, the import at the end of this line has already loaded `PROJECT.md`: @PROJECT.md" |
| `AGENTS.md:29` | It changes the start of the line, which `dev/tests/hooks.test.mjs:151` compares. | "Codex: at session start, and again after compaction, read every file in `.claude/rules/` that has no `paths` line in the block of fields at its top. Before you work on a path that another rule file names in its `paths` line, open that rule file." |
| `AGENTS.md:39` | "Reads these three folders" leaves out that a session also writes them. | "... A session in a worktree reads and writes these three folders in the main checkout." |
| `AGENTS.md:91` | It removes "The test: would an agent working on a different work item need to know this?", which `dev/tests/hooks.test.mjs:472` compares and which the prompt hook names as "the test". | "Put each fact in the narrowest place that covers everyone it affects. The test: would an agent working on a different work item need to know this? If yes, put the fact in the wider place, such as `DECISIONS.md` or `system/`, and write one line with the fact's ID in the work item." |
| `AGENTS.md:117` | It breaks `dev/tests/hooks.test.mjs:473`, and "also add it" is the opposite of `saving.md:160`. | "`.claude/rules/owner-preferences.md`. When the owner's words say that the preference is for every project, write it in `~/.claude/rules/owner-preferences.md` (Claude Code) and `~/.codex/AGENTS.md` (Codex) in place of this project's file. Never make a preference a setting of Claude Code or Codex, or a hook." |
| `AGENTS.md:36` and `:42`, and the layout finding | The rename and the move have the costs listed under "Headings and layout". | Make them once, with the other branch, after the owner's answer to question 1. |
| `.claude/rules/humanize-outbound-text.md:3` | It drops the condition "that will leave the project". | "Before the owner sees the final version of any text that will leave the project and that someone other than the owner will read, run the text through the `humanizer` skill. That skill rewrites text so that it does not read as written by AI." |
| `delivery/AGENTS.md:57` | It drops the name `publish-docs` and changes the second case to "a file that Git must not track". | "When a client handoff includes a file that holds real data, or a file that `publish-docs` does not commit, such as a spreadsheet, keep that file out of Git. Git does not track it, so it is lost when its worktree is removed. Put the file beside `HANDOFF.md` in the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints. Add the file's name to a `.gitignore` in that handoff's folder. Then commit `HANDOFF.md` and that `.gitignore`. Never commit the file." |
| `.claude/skills/filing-project-records/references/file-source.md:37` | It may drop "A project task is a task that belongs to no work item.", which explains a kept word. | Use the rewrite, and keep that sentence after it. |
| `.claude/skills/pull-latest/SKILL.md:68-72` | "The main checkout is updated" puts a project word, with no explanation, in a line the owner reads. | "The project's main folder is updated to <short commit id>.", after the owner's answer to question 7. |
| `sources/AGENTS.md:26-33` | The rename leaves two citations behind. | Change `file-source.md:13` and `references/one-home-layout.md:220` in the same edit. |
| `session-start.mjs:38-39` and `:43`, `prompt-reminder.mjs:50-52` | Each longer string adds a line to a command that is at its line limit, so the size test fails. Each also changes a string that a test compares. | Wait for the owner's answer to question 3. Then change the hook and its test together. |
| `settings/codex-hooks.*.json`, `description` | The new ending fails `dev/tests/validate-records.test.mjs:272`. | "Toolkit V2 hooks for this project in Codex: Current State at session start; on every message, a reminder to check the project's skills, the owner's rule for every request, and a memory reminder when the owner uses a keep or decision phrase; a work item reminder after each commit; a work item reminder when a helper agent starts or reports back; and a check of the project's records after each file edit." |
| `assets/owner-preferences.md:3` | The reader marked the split as a guess. | Use the sentence under "Questions answered from the repository". |
| H-6, `hindsight-memory.md:27` | It adds two sentences to a rule that is over its size. | "Git does not track it, so it is only in the main checkout, which is the project's main folder. `AGENTS.md`, "Project map", says how to find it." |
| H-7, `hindsight-memory.md:28` | "Start the file with "Last updated:", then one line that holds the date" is wrong twice: the title comes first, and the date is on the same line. `session-start.mjs:34` reads the date from that line. | "The line "Last updated:" holds the date as YYYY-MM-DD, what caused the change, and who made it. Set it with every change." |
| TP-3, `project_topic_template.md:20` | "`references/record-format.md`" is not a path from the `memory/` folder. The rewrite also goes against `record-format.md:5`. | Give the full path, `.claude/skills/managing-project-memory/references/record-format.md`, and change `record-format.md:5` in the same edit, after the owner's answer to question 5. |
| SV-3, `saving.md:72` | `managing-work-items` does not drop a lesson. The owner chooses. | "When `managing-work-items` closes the work item, the owner chooses one of three outcomes for each lesson: keep it for the whole project, keep it as not proven, or drop it. `managing-work-items` then gives this skill each lesson that this skill must write." |
| TI-1, `tidying.md:30` | The first list holds more than the changes to the project's Current State. | "When the helper returns, make the changes on its first list yourself. That list holds the removals from the project's Current State, so do not do the section "The project's Current State" again." |
| MP-2, `memory-process.md:51` | It puts a fact about Notion in the file that is the same for local and Notion memory. | "`references/memory-store.md` says whether this project shows its memory records at the start of a session. When it does not, this search is the only way that you see a memory record." |
| FI-1, `finding.md:20` | The reason is not exact. With `.ignore`, a search does read `work-items/` and `memory/`. A session in a worktree does not have them. | "A search of the project's files can miss the work items and memory. They are only in the main checkout, which a session in a worktree does not search, or they are in Notion or GitHub." |
| MI-1, `MEMORY.md:21` | The link text is in three places: the hook (`session-start.mjs:14`), the test (`dev/tests/hooks.test.mjs:84`), and the starter file. The longer text adds a line to the hook, which is at its limit. | Leave it, or change all three after the owner's answer to question 3. |
| MN-2, `memory-notion/.../memory-store.md:30` | "Do not read from" is wider than the rule, which forbids reading "for a term or a decision". "Update the toolkit" must read these pages to move them. | "Never write to the **Terminology glossary** page beside the Memory page, or to a page of Memories with the `decision` tag. Never read either of them for a term or a decision. Both remain from a project that was set up before project terms moved to `system/glossary.md` and decisions moved to `DECISIONS.md`." Use the last sentence for VL-2 and DL-2 too. |
| SV-6, the added note on `memory-criteria.md:89` | Adding "an email address" to the list changes what the list says. It is a fix of the rules, and not of the wording. | It is consistent with `saving.md:147`. Make it as its own change. |

## What the readers missed

- **The four hook commands have no room.** `session-start.mjs` is 76 lines against a limit of 76, `prompt-reminder.mjs` is 72 against 72, `codex-after-commit.mjs` is 20 against 20, and `validate-records.mjs` is 280 against 280. No line may be over 100 characters. The repository's `AGENTS.md`, "Code limit", says to tell the owner the size before a command grows. So a longer hook message is a decision for the owner, and not a wording fix.
- **Eight rewrites break a test as written.** They are `AGENTS.md:27`, `:29`, `:91`, and `:117`, the two rewrites of `session-start.mjs` strings, the rewrite of the `prompt-reminder.mjs` string, and the Codex `description`. The heading "Every session" and the link text in `MEMORY.md` are compared too. The every-project reader wrote that hook strings are exact strings, and still did not check its own rewrites of `AGENTS.md` against `dev/tests/hooks.test.mjs:149-151` and `:469-473`.
- **A heading change in the root `AGENTS.md` rebuilds that file in every existing project** (`references/update.md:186-187`). Neither reader opened `update.md`.
- **The two readers contradict each other** on where a preference for every project is written: "also" in `AGENTS.md:117`, and "in place of" in `saving.md:160`.
- **`hindsight-memory.md` is an always-on rule over its proposed size**, and the reader proposes to lengthen it.
- **`dev/evals/fixtures/pocket-ledger-records/project/`** holds copies of starter files, such as `DECISIONS.md` and `sources/README.md`. A rewrite of a starter comment leaves those copies with the old text. No check compares them.
- **I could not check three things.** I cannot see the branch `audit-p1-new-rule-fits` from this worktree, so I do not know which three sections of the root `AGENTS.md` it changes. I did not test whether a changed `description` in `.codex/hooks.json` makes Codex ask for trust again. The captured Codex page says trust is kept for each hook definition, and that `description` is file metadata (`ai-external-knowledge/codex/hooks.md:72-74`, `:187`), so it probably does not. I did not run the tests, because this check only reads. Each claim that a rewrite "fails a test" comes from reading the test.
