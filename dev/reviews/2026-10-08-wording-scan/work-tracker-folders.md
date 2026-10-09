# Wording scan: work-tracker-folders

This file reports the wording scan of the three folders that hold what a project gets for its choice of where work items are kept: `work-local/`, `work-notion/`, and `work-github/`. I read every `.md` file in full, 21 files, against `document-clarity-standard.md`, `wording-review.md`, and `word-list.md`.

How paths are written: every path starts at `plugins/toolkit/skills/project-setup/assets/`. The text `references/` inside a path stands for `.claude/skills/managing-work-items/references/` in that folder. For example, `work-local/references/work-tracker.md` is `work-local/.claude/skills/managing-work-items/references/work-tracker.md`.

Standard lines are named by section and first words, for example Words and names, "Use common words". A rewrite keeps every rule, limit, name, number, and exact string. "Exact string" marks text that a tool, a check, or another file reads.

## Files read

| File | Verdict | High | Medium | Low | Biggest problem |
| --- | --- | --- | --- | --- | --- |
| `work-local/PROJECT-ROADMAP.md` | clear as it is | 0 | 0 | 2 | Table columns use other names than the work item's phase table |
| `work-local/work-items/AGENTS.md` | small fixes | 0 | 1 | 2 | Two names for the same fields: header fields and front matter |
| `work-local/work-items/PROJECT-TASKS.md` | clear as it is | 0 | 0 | 2 | The guide says "Keep this guide"; the roadmap guide says to remove its guide |
| `work-local/work-items/CLAUDE.md` | clear as it is | 0 | 0 | 0 | One line, `@AGENTS.md` (exact string) |
| `work-local/work-items/work-item-template/DESIGN.md` | small fixes | 0 | 2 | 2 | A guide comment leaves the number of options undecided; "interview" is not explained |
| `work-local/work-items/work-item-template/WORK-ITEM.md` | needs a rewrite (the guide comments only) | 0 | 6 | 3 | Three guide comments of 150 to 230 words each hold a dozen instructions in one paragraph |
| `work-local/references/work-tracker.md` | small fixes | 0 | 1 | 3 | An example that does not give an example |
| `work-local/references/work-tracker-searching.md` | small fixes | 0 | 3 | 2 | Three instructions that name no place or no purpose |
| `work-local/references/work-tracker-project-roadmap-and-tasks.md` | small fixes | 0 | 4 | 2 | Pointers with no place; "writes" used as a noun |
| `work-local/references/work-tracker-field-mapping.md` | small fixes | 0 | 7 | 3 | "Moved up" never explained; a heading that is jargon; an inconsistent "level changes" condition |
| `work-local/references/work-tracker-folders-and-files.md` | small fixes | 0 | 5 | 4 | A heading that does not say its content; "rows" with no table named |
| `work-notion/references/work-tracker.md` | small fixes | 0 | 3 | 3 | A sentence that cannot be parsed ("the views in the page block that call") |
| `work-notion/references/work-tracker-database-layout.md` | small fixes | 0 | 8 | 4 | 352 lines mix a property reference with procedures; version history in headings |
| `work-notion/references/work-tracker-page-layout.md` | small fixes | 0 | 5 | 3 | Convoluted explanations of the page note and of truncated reads |
| `work-notion/references/work-tracker-searching.md` | small fixes | 0 | 1 | 2 | The report order sentence does not fit its section |
| `work-github/references/work-tracker.md` | small fixes | 0 | 2 | 3 | No steps section: the first step (open the `gh` file) sits only in the References table |
| `work-github/references/work-tracker-issue-layout.md` | small fixes | 0 | 5 | 2 | One step holds three instructions; a heading is missing before "How to change them" |
| `work-github/references/work-tracker-labels.md` | small fixes | 0 | 4 | 3 | The `state`, `status`, `design`, and "closed by the owner" rows are hard to read |
| `work-github/references/work-tracker-gh-commands.md` | small fixes | 0 | 1 | 1 | `<id>` and a work item's ID look alike |
| `work-github/references/work-tracker-searching.md` | clear as it is | 0 | 0 | 3 | Only small heading and placement points |
| `work-github/references/work-tracker-project-roadmap-and-tasks.md` | small fixes | 0 | 2 | 2 | "That line marks the issue, and the title does not" |
| Total | | 0 | 60 | 51 | |

No High finding: no text here would make a careful reader do the wrong thing without warning. Several Medium findings are close to High because the reader must guess a meaning. They are marked "reading to confirm" where I could not tell the intended meaning from the file alone.

## Findings

### `work-local/work-items/work-item-template/WORK-ITEM.md`

Prompts in angle brackets are not findings. The guide comments (`<!-- ... -->`) are instructions to the agent, so they are in scope.

1. `work-local/work-items/work-item-template/WORK-ITEM.md:128`
   - Text: "<!-- Add a row for every question you ask about this item, with a stable Q-ID. Write the exact question, then “Recommended: <answer>, because <reason>.” when you recommend one; ..."
   - Medium. Standard: Extra rules for documents, "Give each instruction its own sentence"; Sentences, "Put one idea in a sentence".
   - Why: one comment of about 230 words holds more than a dozen instructions (add a row, write a recommendation, answer a question, mark a decision, save a bulk "yes to all", file a decision in `DECISIONS.md`, keep open rows first, replace the example rows). The reader cannot find the rule that applies.
   - Rewrite: split it into a comment with short lines, one instruction each, in this order, keeping the exact strings “Recommended: <answer>, because <reason>.”, “reason shown: none”, and “Filed as DEC-###.”:
     - "Add one row for each question you ask about this work item. Give the row a Q-ID that is never reused."
     - "Write the exact question. When you recommend an answer, add “Recommended: <answer>, because <reason>.”"
     - "Write the IDs of the requirements and tasks the answer affects, and who can answer: `owner` for the project owner, or another person or role."
     - "When the owner answers, put the owner's words in Answer, put the date in Date answered, set Status to Answered, and update the goal, requirement, or task that the answer affects. Set Decision? to yes when the answer decides something."
     - "Save every decision made while working this work item as a row here, with the owner's words and the date. When the owner decides something without being asked, add a row for the question that the decision settles."
     - "When the owner gives one “yes to all”, save one row for each thing it covered, each with the reason the owner was shown (“reason shown: none” when there was none)."
     - "When more than one work item needs a decision, file it as an entry in `DECISIONS.md`. The row that raised it keeps the owner's words and ends “Filed as DEC-###.”"
     - "Keep unanswered rows first, so a new session resumes at the first open question. Never keep an open question only in Notes."
     - "Replace the example rows with real ones."

2. `work-local/work-items/work-item-template/WORK-ITEM.md:107`
   - Text: "<!-- Every requirement follows the structure below: one block per requirement, numbered 1, 2, 3 in the order they are added. After Original verbatim requirement, put the words of the owner, ..."
   - Medium. Standard: same two lines as finding 1.
   - Why: about 200 words, with the rules for the block, the verbatim line, dropped requirements, the short form `R-01`, where approval is recorded, and where solution ideas go, all in one paragraph. "In this chat" also uses the word that the word list replaces with "session".
   - Rewrite: one line per rule, for example: "Write one block for each requirement, numbered in the order added." / "After “Original verbatim requirement”, write the words of the person who asked for it, word for word. When they are not the owner's words in this session, name who said them and where (a source by its SRC-###)." / "In each numbered list, write one line for each thing that must be true, exact enough to check." / "Who or what a requirement applies to, and where it does not apply, are lines of its Functional Requirements." / "Each Acceptance Criteria line is one thing someone can observe." / "A dropped requirement keeps its block, with “ (dropped, Q-ID)” added to its heading. A number is never reused." / "Elsewhere, name a requirement in the short form R-01, which means Requirement 1." / "Record approval in `requirements_approved` and in Questions and Answers, not here." / "Put solution ideas in the final Notes subsection, not here."

3. `work-local/work-items/work-item-template/WORK-ITEM.md:19`
   - Text: "<!-- Fill-in guide for a new work item: create it with `managing-work-items`, which sets the real ID in the front matter and the heading. In the front matter, keep one value from each list; ..."
   - Medium. Standard: same two lines as finding 1; Words and names, "Use the exact name the system uses" (the guide says "the item" 4 times where the word list says "work item").
   - Why: about 150 words, nine instructions, one paragraph, and "item" alone four times.
   - Rewrite: the same instructions as separate lines, with "work item" in place of "item": for example "Create the work item with `managing-work-items`, which sets the real ID in the front matter and the heading." / "In the front matter, keep one value from each list. The status follows from the state, as `managing-work-items` says." / "A new work item starts with `waiting_on: "none"`, `priority: medium`, `delivery: not-offered`, both approvals `no`, and `design: none`." / "A sub-item's `parent` names the work item above it." / "Replace each prompt in angle brackets with real content, or delete it when there is nothing to write yet. No angle-bracket prompt may be left." / "Keep the headings and field labels." / "Delete each example phase, task, question, and requirement that the work item does not have yet." / "Delete this guide when you create the work item."

4. `work-local/work-items/work-item-template/WORK-ITEM.md:145`
   - Text: "<!-- One line per original this item used. The original is filed in `sources/` first; this line holds its SRC-### ID, never the original or a copy of its text. ..."
   - Medium. Standard: Words and names, "When a name is needed, use a name the reader can already see". Word list: "original" becomes "source" (row decided).
   - Why: the reader sees a folder named `sources/` and an ID named SRC-###, and then a different word, "original".
   - Rewrite: "One line for each source this work item used. File the source in `sources/` first. This line holds the source's SRC-### ID, never the source itself or a copy of its text. Wherever the work item uses something drawn from a source, name its SRC-###. Write “None.” when the work item has no sources."

5. `work-local/work-items/work-item-template/WORK-ITEM.md:151` (and `:43`)
   - Text: "The closing step asks the owner whether each one moves up or is dropped, and writes the outcome at the end of its line." Line 43: "Leave empty until the closing step of `managing-work-items`; ..."
   - Medium. Standard: Words and names, "A made-up word is new or has a meaning that exists only in this project." Word list rows "closing step" and "moves up, Moved up" are decided as plain words.
   - Why: a stranger does not know what "closing step" is or what it means for a lesson to "move up".
   - Rewrite for :151: "When the work item is closed (`managing-work-items` has the steps), the agent asks the owner whether to keep each lesson for the whole project or drop it, and writes the owner's answer at the end of the lesson's line." Rewrite for :43: "Leave empty until `managing-work-items` closes the work item; the work item cannot become Done or Cancelled while it is empty."

6. `work-local/work-items/work-item-template/WORK-ITEM.md:99`
   - Text: "... a finished result; the independent checker's report; a plan change; a change the owner made by hand; ..." and "... for a reason a later reader could not see; ..."
   - Medium. Standard: Words and names, "explain the made-up word when it first appears" (word list: "checker" is kept and explained once); Sentences, "Put one idea in a sentence".
   - Why: "the independent checker" is not explained in this file. "For a reason a later reader could not see" has two readings: the change is recorded only when its reason is not visible elsewhere, or the reason is hidden from later readers.
   - Rewrite (reading to confirm): "Add one row, newest first, for each of these: a change of state, `waiting_on`, blocker, or next action whose reason a later reader could not see in the work item's other sections; an answer, approval, rejection, or decision; the report of the checker (the separate agent that tests the result); a plan change; a change the owner made by hand; a finished result."

Low findings: 3. Examples: `:107` "this chat" (word list: "session"); `:60` "a check he must make himself" (word list: "the owner", not "he"); `:23` "further down" (say "in the sections below").

### `work-local/references/work-tracker-field-mapping.md`

7. `work-local/references/work-tracker-field-mapping.md:115`
   - Text: "### A task's writes"
   - Medium. Standard: Words and names, "Give every heading a name in ordinary words that tells the reader what the section covers."
   - Why: "writes" as a noun is not an ordinary word, and the heading does not say that the section covers starting, ticking, and cancelling a task. Another file cites it (`work-tracker-project-roadmap-and-tasks.md:51`).
   - Rewrite: "### Starting, ticking, and cancelling a task". Update the citation at `work-local/references/work-tracker-project-roadmap-and-tasks.md:51` in the same change.

8. `work-local/references/work-tracker-field-mapping.md:42`
   - Text: "**Goal**, **Related items**, and **Moved up** are single paragraphs under `## Overview`."
   - Medium. Standard: Words and names, "explain the made-up word when it first appears"; word list: say in words that the owner agreed to keep it for the whole project.
   - Why: a stranger reads about "Moved up" here and at `:168` with no meaning. The template explains it only in a comment.
   - Rewrite: "**Goal**, **Related items**, and **Moved up** are single paragraphs under `## Overview`. **Moved up** lists the decisions and rules that this work item added or changed for the whole project, by ID. It stays empty until the work item is closed."

9. `work-local/references/work-tracker-field-mapping.md:100`
   - Text: "... or a work item that was made before toolkit 0.8.0 has sub-items that still have phases."
   - Medium. Standard: Sentences, "Name who acts"; the two other trackers' versions say something different (see Patterns, item 1).
   - Why: this file says the work item "has sub-items that still have phases". The Notion and GitHub files say the work item "is a sub-item that still has phases". The steps below ("Phases to a plain list (the work item is now a sub-item)") match the second reading.
   - Rewrite (reading to confirm): "... or a work item that was made before toolkit 0.8.0 is now a sub-item and still has phases."

10. `work-local/references/work-tracker-field-mapping.md:135`
    - Text: "Insert the row after the last open row. When no row is open, insert it right after the separator line. Open rows then stay on top, oldest first."
    - Medium. Standard: Words and names, "Be specific"; wording-review W4 (vague term).
    - Why: the file never says when a row is open. A stranger must look at the template to learn that the Status cell says `Open`.
    - Rewrite: add before the bullets: "A row is open while its Status cell says Open." Also write "Q-ID" as "question ID (for example Q-07)" at its first use in this file.

11. `work-local/references/work-tracker-field-mapping.md:166`
    - Text: "Next action is in one of the template's forms."
    - Medium. Standard: Extra rules for documents, "When you point to another file, say what is in the file and when to open it."
    - Why: the reader does not know how many forms there are, what they are, or where they are.
    - Rewrite: "Write Next action in one of the three forms that the guide comment under Next action in the template gives: working, waiting, or finished or cancelled."

12. `work-local/references/work-tracker-field-mapping.md:183`
    - Text: "A line that the command prints is not finished when it holds a template prompt."
    - Medium. Standard: Words and names, "Be specific"; Sentences, "Say what to do."
    - Why: "is not finished" does not say what to do.
    - Rewrite: "When a printed line holds a template prompt, replace the prompt with real content or delete it."

13. `work-local/references/work-tracker-field-mapping.md:19`
    - Text: "`work-items/AGENTS.md` calls these fields the header fields."
    - Medium. Standard: Words and names, "use the same name every time". Word list section 2 and wording-review W7 (one name for one thing).
    - Why: this file says "front matter" 6 times and "header fields" once, and `work-items/AGENTS.md` uses "header fields" 6 times and defines them as "the front matter". See Patterns, item 4.
    - Rewrite: choose one name. Either use "front matter fields" in both files, or use "header fields" in both and write in the first sentence: "The header fields are the lines in the block between the two `---` lines at the top of `<ID>.md`."

Low findings: 3. Examples: `:66` "This file and ... call either place the parent's list of sub-items." (write: "In both files, “the parent's list of sub-items” means either place."); `:171` "Every other angle-bracket prompt is deleted." (passive; write: "Delete every other angle-bracket prompt."); `:80` the punctuation `"None.".`.

### `work-local/references/work-tracker-folders-and-files.md`

14. `work-local/references/work-tracker-folders-and-files.md:19`
    - Text: "## The work-items folder" (the section holds "Levels" and "Three things say the same.")
    - Medium. Standard: Words and names, "Give every heading a name in ordinary words that tells the reader what the section covers."
    - Why: the heading names a folder, but the section covers how to count levels and how the folders and fields agree.
    - Rewrite: "## Levels, and how folders and fields agree". The line at `:21` ("This section adds two things that `work-items/AGENTS.md` does not say.") can stay.

15. `work-local/references/work-tracker-folders-and-files.md:24`
    - Text: "**Three things say the same.** The nesting of the folders, the sub-item's `parent:` line, and its parent's list of sub-items say the same thing."
    - Medium. Standard: Words and names, "Be specific".
    - Why: "say the same" is a label that does not say what is the same.
    - Rewrite: "**Folders and fields name the same parent.** The folder that a sub-item is in, the sub-item's `parent:` line, and its parent's list of sub-items must all name the same parent."

16. `work-local/references/work-tracker-folders-and-files.md:85`
    - Text: "Also check that each ID you are about to use exists. An ID that no file holds is missing."
    - Medium. Standard: Words and names, "Make the subject of 'this', 'that', 'it', and 'they' clear"; wording-review W4.
    - Why: the reader does not know which IDs these are. My reading is the IDs in `parent:` lines and in links. Reading to confirm.
    - Rewrite: "Also check every ID that a `parent:` line, a list of sub-items, or a link names, and that you are about to use. An ID that no work item file holds is a missing work item."

17. `work-local/references/work-tracker-folders-and-files.md:92` (also `:97`)
    - Text: "Add "Moved by hand" rows on the work item, on X, and on Y." / "Add rows on both work items."
    - Medium. Standard: Words and names, "Be specific".
    - Why: no table is named. The reader learns at `:104` that Recent History is meant.
    - Rewrite: ":92 Add a Recent History row “Moved by hand” on the work item, on X, and on Y." / ":97 Add a Recent History row on both work items."

18. `work-local/references/work-tracker-folders-and-files.md:126`
    - Text: "The deepest work item that moves, with its sub-items, must end at level 3 at most."
    - Medium. Standard: Sentences, "Name who acts"; "Put the action in the verb".
    - Why: "must end at level 3 at most" can be read as "must end at level 3" or "must end no deeper than level 3".
    - Rewrite: "After the move, no work item that moves, and none of its sub-items, may be deeper than level 3."

Low findings: 4. Examples: `:23` uses "in a group" before the section "Groups" (`:138`) explains it; `:135` "Q-ID" is not written out; `:143` "Never start a group's name with an ID." gives no reason (add: "because every work item folder name starts with its ID").

### `work-local/references/work-tracker-searching.md`

19. `work-local/references/work-tracker-searching.md:18`
    - Text: "When the command prints no path, run the check for changes made by hand, and then search by title."
    - Medium. Standard: Extra rules for documents, "When you point to another file, say what is in the file and when to open it."
    - Why: the command for a search by title is below, in "Search by words or by a field". The sentence does not say so.
    - Rewrite: "... and then search by title with the commands under "Search by words or by a field" below."

20. `work-local/references/work-tracker-searching.md:42`
    - Text: "Report in this order: first what waits on the owner (the work item's ID, the Q-ID, and what the question blocks), then what is in progress, then your next step."
    - Medium. Standard: Paragraphs and sections, "Start a paragraph or a section with the sentence that states its point"; wording-review W4.
    - Why: the section is about open questions. "What is in progress" is not a question, so the reader cannot tell what to report. The same sentence is at `work-notion/references/work-tracker-searching.md:61`.
    - Rewrite (reading to confirm): "Report in this order. First list what waits on the owner: for each open question, the work item's ID, the question ID, and what the question blocks. Then list what is in progress. Then give your next step."

21. `work-local/references/work-tracker-searching.md:54`
    - Text: "Under a top-level item, a sub-item that no Sub-items cell names goes last, under "No phase"."
    - Medium. Standard: Sentences, "Name who acts"; Words and names, "Be specific".
    - Why: the sentence does not say where "No phase" is: in the agent's report, or in the file.
    - Rewrite (reading to confirm): "When you report the tree of a top-level item, list a sub-item that no Sub-items cell names last, under the heading "No phase"."

Low findings: 2. Examples: `:46` "The parent's folder is the folder of its file." (the placeholders `<parent folder>` and `<item file>` use "item" alone; write `<parent file>` and `<work item file>`); `:50` the same placeholder.

### `work-local/references/work-tracker-project-roadmap-and-tasks.md`

22. `work-local/references/work-tracker-project-roadmap-and-tasks.md:11`
    - Text: "Git tracks `PROJECT-ROADMAP.md`, so read the copy on the default branch."
    - Medium. Standard: Extra rules for documents, "When an instruction would look arbitrary, give the reason in one clause."
    - Why: "Git tracks the file" does not lead to "read the default branch"; the reason is missing. My reading: the saved version on the default branch is the project's current version.
    - Rewrite (reading to confirm): "Git tracks `PROJECT-ROADMAP.md`, and the version saved on the default branch is the project's current version. Read that copy."

23. `work-local/references/work-tracker-project-roadmap-and-tasks.md:13`
    - Text: "Find `<default>` the way `publish-docs` finds it."
    - Medium. Standard: Extra rules for documents, "When you point to another file, say what is in the file and when to open it."
    - Why: the reader does not know what `<default>` is or where `publish-docs` does this.
    - Rewrite: "`<default>` is the name of the default branch. Find it the way the `publish-docs` skill does."

24. `work-local/references/work-tracker-project-roadmap-and-tasks.md:31`
    - Text: "Record each change that the owner approved under "Planning changes": the date, the owner's words, and what changed."
    - Medium. Standard: Words and names, "Be specific".
    - Why: the sentence does not say that "Planning changes" is a heading in `PROJECT-ROADMAP.md`.
    - Rewrite: "Record each change that the owner approved as a line in the "Planning changes" section of `PROJECT-ROADMAP.md`: the date, the owner's words, and what changed."

25. `work-local/references/work-tracker-project-roadmap-and-tasks.md:51`
    - Text: "Starting, ticking, and cancelling a project task are the same writes as for a work item's task. `work-tracker-field-mapping.md`, section "A task's writes", gives them."
    - Medium. Standard: Words and names, "Use common words".
    - Why: "writes" as a noun (see finding 7).
    - Rewrite: "A project task is started, ticked, and cancelled in the same way as a work item's task. `work-tracker-field-mapping.md`, section "Starting, ticking, and cancelling a task", gives the steps."

Low findings: 2. Examples: `:48` "with the party" (write: "with the side the person is on"); `:41` "pipe the output of the `git show` command into the same `grep`, without the file name" is terse (write the command or say "run the same `grep` on the output of `git show`, and leave out the file name").

### `work-local/work-items/AGENTS.md`

26. `work-local/work-items/AGENTS.md:37`
    - Text: "`work-item-template/WORK-ITEM.md` lists every header field and its allowed values, and it calls the header the front matter."
    - Medium. Standard: Words and names, "Use the exact name the system uses for a thing, and use the same name every time."
    - Why: two names for one block; the template itself uses "front matter" only. See Patterns, item 4.
    - Rewrite: choose one name and use it in this file, in `work-tracker-field-mapping.md`, and in the template. For example: "`work-item-template/WORK-ITEM.md` lists every header field and its allowed values. The header fields are the lines between the two `---` lines at the top of the file."

Low findings: 2. Examples: `:59` "Never `git add` a file from this folder." gives no reason (add: "because Git ignores this folder"); `:28` the pointer names two files for "the forms of those IDs" without saying which holds which.

### `work-local/work-items/work-item-template/DESIGN.md`

27. `work-local/work-items/work-item-template/DESIGN.md:39`
    - Text: "<!-- Include the number of options chosen for this design (the owner's number when he gave one). ..."
    - Medium. Standard: Extra rules for documents, "Decide whether each instruction is exact or general"; wording-review W5 (judgment on purpose).
    - Why: "the number of options chosen" has two readings: how many options to write, or how many options the owner picked. The sentence does not say what decides the number when the owner gave none. "He" also breaks the word list ("the owner").
    - Rewrite (needs the maintainer's yes on the missing rule): "Write the number of options that the owner asked for. When the owner gave no number, use your judgment: weigh the size of the decision against the cost of designing each option."

28. `work-local/work-items/work-item-template/DESIGN.md:13` (and `:177`)
    - Text: "During an interview, update settled answers in the relevant design section, ..." Heading `:177`: "### Design changes during the interview"
    - Medium. Standard: Words and names, "A made-up word is new or has a meaning that exists only in this project."
    - Why: no file in this folder says what the interview is. A stranger may think it means a separate meeting.
    - Rewrite: "While you work through the open design questions with the owner, update ..." and heading "### Design changes while questions are answered".

Low findings: 2. Examples: `:13` "the item's decisions" (write "the work item's decisions"); `:39` "he" for the owner.

### `work-notion/references/work-tracker.md`

29. `work-notion/references/work-tracker.md:46`
    - Text: "Never replace the whole text of a work item's page, for example with `replace_content`. The views in the page block that call, and the call would overwrite the owner's edits."
    - Medium. Standard: Sentences, "Keep the subject and its verb close together"; Words and names, "Make the subject of 'this', 'that', 'it', and 'they' clear".
    - Why: "The views in the page block that call" cannot be parsed. My reading: Notion refuses a whole-page replacement of a page that holds views. Reading to confirm.
    - Rewrite (reading to confirm): "Never replace the whole text of a work item's page, for example with `replace_content`. A page that holds views blocks that call, and a call that worked would overwrite the owner's edits."

30. `work-notion/references/work-tracker.md:52`
    - Text: "When the owner drags a card on the Board, only the work item's Status changes, so its State and its Status no longer match. ... The table below names the skill that handles a State and a Status that no longer match."
    - Medium. Standard: Words and names, "Say a thing in plain words before you give it a name"; "Use the exact name the system uses".
    - Why: the sentence uses "card" and "Board" before it explains them, and the table row it points to names a file in this skill (`references/lifecycle-rules.md`), not a skill. The word "card" is a second name for a work item.
    - Rewrite: "When the owner drags a work item to another column of the Board (a view of Work Items), only the work item's Status changes, so its State and its Status no longer match. The row "A State and a Status that no longer match" in the table below says what to do."

31. `work-notion/references/work-tracker.md:51`
    - Text: "Never add work to a template."
    - Medium. Standard: Words and names, "Be specific".
    - Why: "add work" has two readings: add a work item, or write real content into the template.
    - Rewrite: "Never write the content of a real work item into a template."

Low findings: 3. Examples: `:25` "The ids of the databases and pages" (lower-case "ids" next to "ID"; see Patterns, item 12); `:47` "usually ID 1" (the reason for "usually" is not given); `:29` "Read the ids from `PROJECT.md`".

### `work-notion/references/work-tracker-database-layout.md`

32. `work-notion/references/work-tracker-database-layout.md:61`
    - Text: "A project's own prefix, set after the copy. A template has none."
    - Medium. Standard: Words and names, "Make the subject of 'this', 'that', 'it', and 'they' clear"; "Be specific".
    - Why: "the copy" has no subject: a copy of what? "A template" is not the work item template or the project template.
    - Rewrite (reading to confirm): "A number that Notion assigns, with the project's own prefix. The prefix is set when the project is made from the Project template. The work item template has no ID."

33. `work-notion/references/work-tracker-database-layout.md:97`
    - Text: "A sub-item is linked only to phases that were set to Cancelled when the sub-item changed level."
    - Medium. Standard: Sentences, "Put the condition before the action"; "Put one idea in a sentence".
    - Why: the reader must work out that a sub-item can have phases only when it used to be top-level.
    - Rewrite: "A sub-item has no phases. It can be linked only to phases that it had when it was a top-level item, and those were set to Cancelled when it changed level."

34. `work-notion/references/work-tracker-database-layout.md:242`
    - Text: "### A task with an empty Status, and a Tasks database from before toolkit 0.8.0"
    - Medium. Standard: Paragraphs and sections, "Give each section one subject"; Words and names, headings in ordinary words.
    - Why: two subjects in one heading, and the second names a version that the reader cannot match to anything.
    - Rewrite: two headings: "### A task with an empty Status" and "### A Tasks database that still has the old Status".

35. `work-notion/references/work-tracker-database-layout.md:250`
    - Text: "Until the database is converted, tick Done, where it exists, exactly when Status is Done or Cancelled."
    - Medium. Standard: Words and names, "Be specific".
    - Why: "tick Done" does not say that Done is a checkbox property of the old database.
    - Rewrite: "Until the database is converted, tick the "Done" checkbox, in a database that has one, exactly when Status is Done or Cancelled."

36. `work-notion/references/work-tracker-database-layout.md:272`
    - Text: "A row with an empty "Work item" and another ID was made by hand."
    - Medium. Standard: Words and names, "Be specific".
    - Why: "another ID" does not say which IDs are normal.
    - Rewrite: "A row with an empty "Work item" whose ID does not have the project form (`P01` for a phase, `PT-01` for a task) was made by hand."

37. `work-notion/references/work-tracker-database-layout.md:336`
    - Text: "## A card the owner made by hand"
    - Medium. Standard: Words and names, "Use the exact name the system uses for a thing, and use the same name every time."
    - Why: this file calls a work item a "work item" everywhere except in this section, which says "card". The local folder calls the same job "A work item that the owner made by hand".
    - Rewrite: "## A work item the owner made by hand in Notion", and "work item" in the section text. If "card" stays, define it at the first use in this file (`work-tracker.md:52` is the only place that defines it).

38. `work-notion/references/work-tracker-database-layout.md:352`
    - Text: "Name it or archive it only after the owner says which of the two the owner wants and, to name it, what the title is."
    - Medium. Standard: Sentences, "Put one idea in a sentence, or two ideas that belong together".
    - Why: three ideas in one sentence, with a nested condition.
    - Rewrite: "Ask the owner whether to name the card or to archive it. Name it or archive it only after the owner answers. To name it, ask for the title."

39. `work-notion/references/work-tracker-database-layout.md:1` (layout)
    - Medium. Standard: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone"; "Choose the form that serves the reader's job".
    - Why: 352 lines hold a property reference (three tables), nine procedures, and two special cases. A reader who wants "how do I move a work item" finds it after the reference tables, and "A work item that changes level" sits between "Phases and tasks" and "The project's phases and tasks".
    - Rewrite: see Layout.

Low findings: 4. Examples: `:33` "Memory, Current State, Terminology glossary" (the page names are exact strings; the file should say once that "Current state" here is the project's Current State page); `:5` and `:119` "bodies" and "The body below" (say "the request body"); `:119` `{{WORK_ITEMS_DS}}` (exact string; write once what "DS" means, "data source").

### `work-notion/references/work-tracker-page-layout.md`

40. `work-notion/references/work-tracker-page-layout.md:38`
    - Text: "The note says what `references/lifecycle-rules.md`, section "Rules that apply in every State", says about text in angle brackets."
    - Medium. Standard: Sentences, "Name who acts"; "Break up a string of nouns".
    - Why: "The note says what X says" is a loop. The reader does not learn what the note says or why it exists.
    - Rewrite: "The note tells the agent to replace every text in angle brackets with real content, as `references/lifecycle-rules.md`, section "Rules that apply in every State", says." (reading to confirm: the note's wording is not in this file).

41. `work-notion/references/work-tracker-page-layout.md:39`
    - Text: "- **Lines that are not text.** The Solution Design is a child page, and the page text shows it as a `<page url="…">` line."
    - Medium. Standard: Words and names, "Be specific".
    - Why: the label says the opposite of the content. The lines are in the text; they stand for a page or a view.
    - Rewrite: "- **Lines that stand for a page or a view.** ..."

42. `work-notion/references/work-tracker-page-layout.md:60`
    - Text: "A page that holds the "Embed Github" block answers reads and writes of its text with `truncated: true`, ..."
    - Medium. Standard: Sentences, "Name who acts".
    - Why: a page does not answer; Notion does.
    - Rewrite: "When a page holds the "Embed Github" block, Notion returns `truncated: true` for every read and write of its text, and lists the embed's block id in `unknown_block_ids`. When `unknown_block_ids` holds only that block's id, no action is needed."

43. `work-notion/references/work-tracker-page-layout.md:92`
    - Text: "The first time you change such a card, do the same, and keep everything that the owner wrote."
    - Medium. Standard: Words and names, "Make the subject of 'this', 'that', 'it', and 'they' clear".
    - Why: "do the same" could mean "delete the note and the prompts" or "do everything in this section".
    - Rewrite: "The first time you change such a card, delete the note and the prompts as this section says, and keep everything that the owner wrote."

44. `work-notion/references/work-tracker-page-layout.md:159`
    - Text: "## Notes lines"
    - Medium. Standard: Words and names, headings in ordinary words.
    - Why: "Notes lines" is a made-up name; the section covers how to add a line under Sources or under "Lessons not proven yet".
    - Rewrite: "## Adding a line under Sources or Lessons not proven yet". Update the contents list at `:15`.

Low findings: 3. Examples: `:37` "before toolkit 0.8.1" (history; keep only if a reader can still meet such a page); `:150` "The shape of a row." is a label for three rules; `:208` the last line ("When the owner approves the design, also set Design approved ...") stands alone after the section that explains the design page.

### `work-notion/references/work-tracker-searching.md`

45. `work-notion/references/work-tracker-searching.md:61`
    - Text: "Report in this order: first what waits on the owner (the work item's ID, the Q-ID, and what the question blocks), then what is in progress, then your next step."
    - Medium. Standard: Paragraphs and sections, "Start a paragraph or a section with the sentence that states its point".
    - Why: same sentence as local finding 20. The section is "What waits on the owner"; "what is in progress" does not belong there.
    - Rewrite: same as finding 20.

Low findings: 2. Examples: `:55` "report each card that it returns as a problem in the project's records" (say which records, or "tell the owner that the card has no title"); `:19` "ids".

### `work-github/references/work-tracker.md`

46. `work-github/references/work-tracker.md:26`
    - Text: "## After every write" (the file has no section that tells the reader what to do before the first read or write)
    - Medium. Standard: Extra rules for documents, "Write steps in the order the reader does them"; "Organize the document so that a reader can find a thing from the headings alone".
    - Why: the local and Notion files have a section "Steps for every read and every save". Here the essential first step, to open `work-tracker-gh-commands.md` before the first `gh` call, appears only in the References table. A reader who reads the first sections never learns it.
    - Rewrite: add a section before "Mistakes to avoid", for example: "## Steps for every read and every save" / "1. Before your first `gh` call in a session, open `references/work-tracker-gh-commands.md`. It says how to sign in, how to name the repository, how to run `gh` in Codex, and what to do when a call fails." / "2. Make the change with the file that the References table below names for it." / "3. Read the change back, and check that it says what you wrote. When a write failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with." Then remove "After every write".

47. `work-github/references/work-tracker.md:15` (also `work-tracker-labels.md:1` and `:3`, `work-tracker-issue-layout.md:3`)
    - Text: "The header fields of the work item template are labels on the issue: State, type, priority, who the work item waits on, who builds it, and the approvals."
    - Medium. Standard: Words and names, "A made-up word ... explain the made-up word when it first appears".
    - Why: no GitHub file says what the header fields are. Only the local folder's `work-items/AGENTS.md` does, and the GitHub project never gets it.
    - Rewrite: "The work item template starts with a block of fields (id, title, state, status, type, parent, waiting_on, priority, delivery, the approvals, design, updated). On GitHub these are the header fields. Most are labels on the issue: State, type, priority, who the work item waits on, who builds it, and the approvals. Status has no label." The field list is the one in the template; check it before use.

Low findings: 3. Examples: `:44` the last bullet says the same thing twice ("tell the owner that GitHub Issues has no archive and that a closed issue is already left out of the lists of open issues" repeats the first two sentences; write: "When the owner asks to archive an open work item, tell the owner this and ask whether to cancel the work item."); `:24` "Every command in this skill" (this file is a reference of the skill); `:17` "up to three levels" appears only in this tracker's version of the sentence.

### `work-github/references/work-tracker-issue-layout.md`

48. `work-github/references/work-tracker-issue-layout.md:42`
    - Text: "Take the work item template text that `managing-work-items` opened from its `assets/`, from the line `## Overview` to the end."
    - Medium. Standard: Words and names, "Be specific"; Extra rules for documents, "say what is in the file and when to open it".
    - Why: "opened from its `assets/`" assumes the agent has already opened a file. A stranger does not know which file.
    - Rewrite: "Start from the work item template, `WORK-ITEM.md`, which is in the `assets/` folder of the `managing-work-items` skill. Take the text from the line `## Overview` to the end." (check the path in that skill before use.)

49. `work-github/references/work-tracker-issue-layout.md:50`
    - Text: "2. Write IDs as `#12` wherever the template says a work item ID. Keep the form of the plan that the template's guide gives for the work item's level: ... Write the Related items line for the work item's level:"
    - Medium. Standard: Sentences, "Put one idea in a sentence"; Extra rules for documents, "Give each instruction its own sentence".
    - Why: three separate instructions in one numbered step.
    - Rewrite: split into steps 2, 3, and 4: "2. Write IDs as `#12` wherever the template says a work item ID." / "3. Keep the form of the plan that the template's guide gives for the work item's level. A top-level item keeps the Roadmap. A sub-item keeps only the sub-item form under Tasks." / "4. Write the Related items line for the work item's level:" and the three bullets. Renumber the later steps and update the cross-references to "step 1" if they change (none changes: step 1 stays).

50. `work-github/references/work-tracker-issue-layout.md:76`
    - Text: "... swap `waiting-on:owner` for `waiting-on:agent` when you continue the work, or remove `waiting-on:owner`."
    - Medium. Standard: wording-review W4 ("or" that could mean one or both).
    - Why: two actions are offered, and the sentence gives no rule for choosing.
    - Rewrite (needs the maintainer's yes on the rule): "... swap `waiting-on:owner` for `waiting-on:agent` when you continue the work yourself. Otherwise, remove `waiting-on:owner` and add no other waiting-on label."

51. `work-github/references/work-tracker-issue-layout.md:92`
    - Text: "How to change them:"
    - Medium. Standard: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone".
    - Why: a bold-less line stands in the place of a heading, and "them" points to phases, sub-items, and tasks across a bullet list above.
    - Rewrite: "### Changing phases, tasks, and sub-items" (and add it to the contents list at `:12`).

52. `work-github/references/work-tracker-issue-layout.md:111`
    - Text: "Use this part in two cases: a move puts a work item at another level, or a sub-issue that was made before toolkit 0.8.0 still has a Roadmap."
    - Medium. Standard: Words and names, "use the same name every time" (and the same step in the other two folders is worded differently; see Patterns, item 1).
    - Why: the reader cannot tell whether an issue was "made before toolkit 0.8.0"; the sentence should lead with what the issue shows (a Roadmap section on a sub-issue).
    - Rewrite: "Use this part in two cases: a move puts a work item at another level, or a sub-issue still has a Roadmap section (sub-issues made before toolkit 0.8.0 can still have one)."

Low findings: 2. Examples: `:147` "Start every note of the agent's with "Agent:"." (write "Start every comment that the agent writes with "Agent:"."); `:159` "unless the owner's text makes the type plain" (write "obvious").

### `work-github/references/work-tracker-labels.md`

53. `work-github/references/work-tracker-labels.md:18`
    - Text: "The State of a closed issue is Done or Cancelled, as the `status` row says. The state label of a closed issue stays as it was, and it is ignored."
    - Medium. Standard: Sentences, "Put one idea in a sentence"; Words and names, "Make the subject of 'this', 'that', 'it', and 'they' clear".
    - Why: a long table cell with four ideas, and "as the `status` row says" sends the reader to another row for the rule.
    - Rewrite: "Exactly one `state:<state>` label, written as the State's name in lower case with hyphens, for example `state:refining-requirements`. A closed issue has the State Done or Cancelled, which the `status` row explains. The state label of a closed issue stays as it was, and you ignore it."

54. `work-github/references/work-tracker-labels.md:25`
    - Text: "No label means `none` when the issue has no design comment, and `superseded` when it has one."
    - Medium. Standard: Sentences, "Put the condition before the action".
    - Why: "has one" is far from its noun. A reader may think that a design comment makes the design "superseded".
    - Rewrite: "When the issue has no design label, `design` is `none` if the issue has no design comment, and `superseded` if the issue has one."

55. `work-github/references/work-tracker-labels.md:30`
    - Text: "The owner may close an issue in the browser. That counts as the owner's word."
    - Medium. Standard: Words and names, "Be specific"; word list section 2 ("the owner's yes").
    - Why: the sentence does not say what the agent does. "The owner's word" does not say whether the work item is Done, Cancelled, or only to be checked.
    - Rewrite (reading to confirm): "The owner may close an issue in the browser. Treat that as the owner's decision: the work item is Done when the issue is closed as completed, and Cancelled when it is closed as not planned or as a duplicate."

56. `work-github/references/work-tracker-labels.md:3`
    - Text: "On GitHub, the header fields of a work item are labels on its issue, together with whether the issue is open or closed."
    - Medium. Standard: Words and names, "explain the made-up word when it first appears".
    - Why: this is the same problem as finding 47: "header fields" is never defined in the GitHub folder.
    - Rewrite: see finding 47. Add one clause here: "The header fields are the fields at the top of the work item template."

Low findings: 3. Examples: `:79` "Names match without regard to capital letters." (write "Ignore capital letters when you compare names."); `:61` "see the Current state Waiting on line" (exact string in a label description; the bare "Current state" is the work item's Current state); `work-tracker.md:16` says a closed issue "as not planned" is Cancelled but this file and `work-tracker-searching.md:28` add "or as a duplicate".

### `work-github/references/work-tracker-gh-commands.md`

57. `work-github/references/work-tracker-gh-commands.md:55`
    - Text: "`<id>` is the issue's numeric id from the REST API, for example `5638907867`. Only the sub-issue calls need it."
    - Medium. Standard: Words and names, "use the same name every time"; "Make the subject ... clear".
    - Why: a work item's ID is `#12` in this folder. `<id>` and ID look alike, and a reader may use the wrong one in a sub-issue call. `work-tracker.md:33` warns about this mistake.
    - Rewrite: "`<id>` is the issue's numeric id from the REST API (not the issue number and not the work item's ID), for example `5638907867`. Only the sub-issue calls need it."

Low findings: 1. Example: `:102` "When the owner says that text of the owner's is gone, put that text back." (write: "When the owner says that some of the owner's text is gone, restore it from an earlier version.").

### `work-github/references/work-tracker-project-roadmap-and-tasks.md`

58. `work-github/references/work-tracker-project-roadmap-and-tasks.md:58`
    - Text: "Its body starts with the line `## Project tasks`. That line marks the issue, and the title does not."
    - Medium. Standard: Words and names, "Be specific".
    - Why: "the title does not" is a clipped sentence. The reader does not learn what to do: find the issue by the body line and never by its title.
    - Rewrite: "Its body starts with the line `## Project tasks`. Find the issue by that line, never by its title."

59. `work-github/references/work-tracker-project-roadmap-and-tasks.md:66`
    - Text: "When the command finds no issue, make the issue the first time a project task is saved. Write this body in `<dir>/body.md`, with that project task in place of the example:"
    - Medium. Standard: Sentences, "Put one idea in a sentence"; "Put the condition before the action".
    - Why: the condition has two parts ("no issue" and "the first time a project task is saved"), and the sentence ends in an instruction about the example.
    - Rewrite: "When the command finds no issue, make the issue at the moment you save the first project task. Write this body in `<dir>/body.md`, and replace the example task with that project task:"

Low findings: 2. Examples: `:19` "Never set a due date on a milestone." (no reason); `:77` "with the party".

### `work-local/references/work-tracker.md`

60. `work-local/references/work-tracker.md:44`
    - Text: "When Claude Code or Codex blocks a write outside the session's worktree, ask the owner to approve the write. For example, the Codex sandbox, which is the closed area where Codex runs commands, asks for approval or fails with a sandbox error."
    - Medium. Standard: Extra rules for documents, "When one point needs several rules, give the main rule first. Then give each special case on its own line"; Words and names, "Be specific".
    - Why: "For example" introduces a definition and a symptom, not an example of a block, so the reader cannot tell what the example shows.
    - Rewrite: "When Claude Code or Codex blocks a write outside the session's worktree, ask the owner to approve the write. In Codex, the sandbox is the closed area where Codex runs commands. A write that the sandbox blocks asks for approval or fails with a sandbox error."

Low findings: 3. Examples: `:23` "Begin every command that uses `$MAIN` with that line and a `;`, in the same command." (write: "Begin every command that uses `$MAIN` with the `MAIN=` line above, followed by `;`, so that the line and the command run together."); `:52` states a fact about Obsidian and gives no instruction (end it with what the agent does: "Match the value with or without quotation marks, as the commands do."); `:61` and `:62` hold two rows with the same answer.

### Files with no Medium or High finding

- `work-local/PROJECT-ROADMAP.md`: Low 2. `:3` says to remove the guide after setup, while `work-local/work-items/PROJECT-TASKS.md:3` says "Keep this guide."; a reader may wonder why. The table headings "Intended outcome" and "Exit condition" name what a work item's phases call "Outcome" and "Exit result" (see Patterns, item 11).
- `work-local/work-items/PROJECT-TASKS.md`: Low 2. `:3` "Keep this guide." has no reason; `:9` "with the party".
- `work-local/work-items/CLAUDE.md`: one line, `@AGENTS.md`. Exact string. Nothing to report.
- `work-github/references/work-tracker-searching.md`: Low 3. `:5` the sentence "Run each command on its own..." sits between the opening and the contents list, where the other files in this folder put the contents list first; `:18` the heading "One work item, a section, a parent" is a list of nouns for a section that holds one pointer (write "Reading one work item, one section, or a parent"); `:32` says "every open issue" where the other searching files say "open work items".

## Patterns

1. The same step is worded differently in the three folders, and one wording differs in meaning. Count: 5 places.
   - "A work item that changes level": `work-local/references/work-tracker-field-mapping.md:98-113` says "has sub-items that still have phases", `work-notion/references/work-tracker-database-layout.md:252-266` says "is a sub-item that still has phases", `work-github/references/work-tracker-issue-layout.md:109-124` says "a sub-issue ... still has a Roadmap". The steps then say "Do these four things" (local), "six things" (Notion), "four things" (GitHub). The counts differ because the Notion steps are more detailed, but a reader who knows one tool meets different wording for the same job. Fix: use one opening sentence in all three, with the tool's own noun.
   - The open-question report: `work-local/references/work-tracker-searching.md:42` and `work-notion/references/work-tracker-searching.md:61` hold the same sentence "Report in this order ... then what is in progress"; the GitHub file has no report order at all.
   - The Related work table: local has 5 rows, Notion 6, GitHub 4. Local and Notion hold two rows with the same answer ("Follow `references/lifecycle-rules.md` in this skill"); GitHub holds only the first.
   - The section names for the same job: "Open questions" (local) and "What waits on the owner" (Notion and GitHub); "Search by words or by a field" (local) and "Search" (Notion and GitHub).
   - Project phases in the searching file: only Notion's `work-tracker-searching.md` holds a section on the project's phases and tasks; local and GitHub keep them in `work-tracker-project-roadmap-and-tasks.md`.

2. Hand-made work items have three names. Count: 3 headings. Local: "A work item that the owner made by hand" (`work-tracker-folders-and-files.md:162`). Notion: "A card the owner made by hand" (`work-tracker-database-layout.md:336`), plus "Pages without the template" and "Cards with no title" in `work-tracker-searching.md`. GitHub: "An issue made by hand" (`work-tracker-issue-layout.md:153`) and "Issues without the layout". The word "card" is a second name for a work item, and it is defined once, in one bullet of `work-notion/references/work-tracker.md:52`.

3. The `work-tracker.md` files differ in structure for no reason a reader could see. Count: 3 files, 3 differences.
   - Local and Notion have "Steps for every read and every save"; GitHub has "After every write" and no steps (finding 46).
   - Notion has a section "Create a work item" inside `work-tracker.md`; the others put the creation steps in a reference file.
   - The opening of the Notion and GitHub files adds one sentence on what the file says about the tool ("where each part of a work item is stored in Notion"; "kept in GitHub Issues"). The local file has none, and the two verbs differ ("stored", "kept").

4. Two names for one block, "header fields" and "front matter", and one folder never defines them. Count: "front matter" about 12 times and "header field" about 14 times across the area. Examples: `work-local/work-items/AGENTS.md:37` ("calls the header the front matter"); `work-local/references/work-tracker-field-mapping.md:19`; `work-github/references/work-tracker-labels.md:3` (never defined). The word list says one name for one thing. Findings 13, 26, 47, and 56 report it.

5. Version history in instructions. Count: 6 uses of "toolkit 0.8.0" or "0.8.1". Examples: `work-notion/references/work-tracker-database-layout.md:242`, `:246`, and `:254`; `work-notion/references/work-tracker-page-layout.md:37`; `work-local/references/work-tracker-field-mapping.md:100`; `work-github/references/work-tracker-issue-layout.md:111`. A stranger cannot tell whether a project is "before 0.8.0". The instruction should name what the reader sees (a Done checkbox, a Status of type select, a sub-issue with a Roadmap), as `:246` partly does.

6. Pointers that name a place without saying what is there. Count: about 5. Examples: `work-local/references/work-tracker-project-roadmap-and-tasks.md:13` ("the way `publish-docs` finds it"); `work-local/references/work-tracker-searching.md:18` ("then search by title"); `work-github/references/work-tracker-issue-layout.md:42` ("opened from its `assets/`"). The standard says to say what is in the file and when to open it.

7. Word list rows not applied in the local templates. Count: "item" alone about 20 times in `WORK-ITEM.md`, `DESIGN.md`, and `PROJECT-ROADMAP.md`; "he" or "his" for the owner 8 times in `WORK-ITEM.md` and `DESIGN.md`; "original" 3 times in the guide comment at `WORK-ITEM.md:145`; "chat" once; "closing step" twice; "moves up" once. Examples: `WORK-ITEM.md:19` ("the item" four times), `:128` ("put his words in Answer"), `:145` ("per original this item used"). The "his" in the Next action example (`WORK-ITEM.md:33`, "After his answer:") is probably an exact string that a check compares; ask before changing it.

8. Very long guide comments in the templates. Count: 5 comments over 100 words. `WORK-ITEM.md:19`, `:99`, `:107`, `:128`, and `DESIGN.md:13`. Each holds many instructions in one run of prose. The standard asks for one instruction per sentence and the main rule first.

9. Headings that name a made-up thing instead of the content. Count: 5. Examples: "A task's writes" (`work-tracker-field-mapping.md:115`), "Notes lines" (`work-tracker-page-layout.md:159`), "The work-items folder" (`work-tracker-folders-and-files.md:19`). The standard asks for ordinary words that say what the section covers.

10. "The party" for a person's side. Count: 4. `work-local/work-items/PROJECT-TASKS.md:9`, `work-local/references/work-tracker-project-roadmap-and-tasks.md:48`, `work-notion/references/work-tracker-database-layout.md:111`, `work-github/references/work-tracker-project-roadmap-and-tasks.md:77`. "Party" is unclear to a stranger. The example "Sarah Chen (client)" shows that the word in brackets says who the person works for. Write "with the side the person is on, such as `Sarah Chen (client)`".

11. Names of the same columns differ. Count: 3 pairs. The project's phase table (`work-local/PROJECT-ROADMAP.md:19`) uses "Intended outcome" and "Exit condition"; a work item's phases use "Outcome" and "Exit result" (`WORK-ITEM.md:53`, and the Notion and GitHub properties). The GitHub milestone description uses "Outcome" and "Exit result" for project phases (`work-github/references/work-tracker-project-roadmap-and-tasks.md:16`). One tracker's project phases have different column names from the other trackers' project phases.

12. "id" and "ID" for two things. Count: the plural "ids" 6 times, and the singular "id" for system identifiers in many more places, in the Notion and GitHub files. Examples: "the ids in `PROJECT.md`" (`work-notion/references/work-tracker-searching.md:19`), `<id>` (`work-github/references/work-tracker-gh-commands.md:55`), "the new ID" (`work-notion/references/work-tracker-database-layout.md:147`). Upper-case "ID" is the work item's identifier; lower-case "id" is a system identifier. The files do not say so once, and `<id>` in the GitHub folder is the case that causes a wrong call (finding 57).

13. Bold-label bullets. Count: many, in all three trackers. The pattern "**A new row.** Its ID is ..." appears in all three trackers. It is a whole sentence after the label, so it follows the standard. It is not a finding. It is listed so the owner knows I checked it.

## Layout

Files whose layout needs work, in order.

### `work-notion/references/work-tracker-database-layout.md`

As it is:

1. The Notion databases
2. Contents
3. How a project looks in Notion
4. Where each work item field goes
5. Work Items properties
6. Phases properties
7. Tasks properties
8. Creating a work item
9. Setting State and Status
10. Phases and tasks (with five sub-headings)
11. A task with an empty Status, and a Tasks database from before toolkit 0.8.0
12. A work item that changes level
13. The project's phases and tasks (with five sub-headings)
14. Links and tags
15. Moving a work item under another parent
16. A card the owner made by hand

Proposed (the same text, regrouped; a split into two files is also possible, with the property tables in one file and the procedures in the other, but that changes the References table, so the owner decides):

1. The Notion databases
2. Contents
3. How a project looks in Notion
4. Where each work item field goes
5. Work Items properties
6. Phases properties
7. Tasks properties
8. Creating a work item
9. Setting State and Status
10. Links and tags
11. Moving a work item under another parent
12. A work item the owner made by hand in Notion
13. Phases and tasks (with the sub-headings; the two special cases become sub-headings "A task with an empty Status" and "A Tasks database that still has the old Status")
14. A work item that changes level
15. The project's phases and tasks (with the sub-headings)

Reason: the procedures for one work item come first, then the plan (phases and tasks), then the project's own phases and tasks, which the standard's "Put the sections in the order the reader needs them" supports. Update every file that cites a heading in this file (`work-tracker.md:20` and `:38`; `work-tracker-page-layout.md:149`; `work-tracker-searching.md:116`).

### `work-notion/references/work-tracker-page-layout.md`

As it is: "Notes lines", and "Three more things are true of every page" with the bullet "Lines that are not text".

Proposed: "Adding a line under Sources or Lessons not proven yet", and the bullet "Lines that stand for a page or a view". Update the contents list.

### `work-local/references/work-tracker-field-mapping.md`

As it is: "A task's writes". Proposed: "Starting, ticking, and cancelling a task". Update `work-tracker-project-roadmap-and-tasks.md:51`.

### `work-local/references/work-tracker-folders-and-files.md`

As it is: "The work-items folder". Proposed: "Levels, and how folders and fields agree". Update the contents list (`:7`).

### `work-github/references/work-tracker.md`

As it is: Where the work items are kept / After every write / Mistakes to avoid / Related work / References.

Proposed: Where the work items are kept / Steps for every read and every save / Mistakes to avoid / Related work / References. (Finding 46.)

### `work-github/references/work-tracker-issue-layout.md`

As it is: under "Phases, tasks, and sub-items", the text "How to change them:" then "A work item that changes level".

Proposed: "Phases, tasks, and sub-items" / "Changing phases, tasks, and sub-items" / "A work item that changes level". Update the contents list (`:12`).

### `work-github/references/work-tracker-searching.md`

As it is: the sentence "Run each command on its own..." before the contents list; heading "One work item, a section, a parent".

Proposed: contents list first, then the sentence; heading "Reading one work item, one section, or a parent".
