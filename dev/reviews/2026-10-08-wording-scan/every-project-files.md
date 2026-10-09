# Wording scan: every-project-files

Reader: Claude (one reader of seven). Scope: everything a new project gets from `plugins/toolkit/skills/project-setup/assets/every-project/`, except the skill `managing-work-items`, plus the text the four hook commands print, `assets/owner-preferences.md`, `assets/soul/SOUL.md`, and the `description` text in `assets/settings/*.json`.

In this file, "the standard" is `document-clarity-standard.md`. A path that starts with `.claude/` or with a folder name such as `system/` is under `assets/every-project/`. "(P1 in flight)" marks a file that another branch is changing now.

## Files read

All 63 files were read in full. The columns H, M, and L count High, Medium, and Low findings. Three codex hook files hold the same finding, so the Medium total of 65 counts it three times.

| File | Verdict | H | M | L | Biggest problem |
| --- | --- | --- | --- | --- | --- |
| `AGENTS.md` (root, P1 in flight) | needs a rewrite | 1 | 13 | 12 | A status procedure hides in one table cell, the 46-row map comes before the filing table, and the opening never says what the file is or what "toolkit" means |
| `CLAUDE.md` (root, `system/`, `sources/`, `delivery/`, `reference/`) | clear as it is | 0 | 0 | 0 | None. Each holds the exact line `@AGENTS.md`. |
| `PROJECT.md` | small fixes | 0 | 1 | 3 | "Toolkit settings" and "Tracker" are never explained to a reader who sees the rendered page |
| `DECISIONS.md` | small fixes | 0 | 2 | 2 | "Decided" names both a status and a field in the same sentence |
| `README.md` | clear as it is | 0 | 0 | 2 | A heading that lists a file that is not a record |
| `.claude/rules/cite-recalled-knowledge.md` | small fixes | 0 | 1 | 0 | "the words that continue the work" is not explained |
| `.claude/rules/evaluate-the-owners-request.md` | not scanned | 0 | 0 | 0 | The owner's approved words |
| `.claude/rules/document-clarity-standard.md` | not scanned | 0 | 0 | 0 | The measure for this scan, and the owner's approved words |
| `.claude/rules/humanize-outbound-text.md` | small fixes | 0 | 1 | 2 | The rule does not say what the `humanizer` skill does |
| `.claude/rules/keep-work-item-current.md` | small fixes | 0 | 2 | 2 | "status", "State", and "requirements approval" are not told apart |
| `.claude/rules/memory-review-and-save.md` | small fixes | 0 | 1 | 3 | "the main agent" is not defined |
| `.claude/rules/publish-project-documents.md` | clear as it is | 0 | 0 | 1 | None that matters |
| `.claude/rules/session-handoff.md` | clear as it is | 0 | 0 | 1 | None that matters |
| `.claude/rules/shared-repository-work.md` | small fixes | 0 | 2 | 3 | The first sentence states as fact what is only possible |
| `.claude/output-styles/plain-english.md` (P1 in flight) | small fixes | 0 | 3 | 3 | Two vague limits, and a rule to stop after the answer that other files contradict |
| `system/AGENTS.md` | small fixes | 0 | 1 | 3 | One glossary sentence is unclear about who confirms what |
| `system/glossary.md` | clear as it is | 0 | 0 | 1 | The comment starts "Keep this guide." with no reason |
| `system/architecture.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `system/automation.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `system/constraints.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `system/data-model.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `system/security-model.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `system/integrations/INTEGRATION-TEMPLATE.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `system/integrations/README.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `sources/AGENTS.md` | small fixes | 0 | 1 | 1 | A heading that does not match the first bullet under it |
| `sources/README.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `delivery/AGENTS.md` | small fixes | 0 | 3 | 2 | "real records" has a second meaning, and the handoff bullet gives its reason last |
| `reference/AGENTS.md` | small fixes | 0 | 1 | 2 | A list of things to keep out gives a destination for only the first three |
| `reference/outside-docs/INDEX.md` | clear as it is | 0 | 0 | 1 | Same comment |
| `tests/TEST-PLAN-TEMPLATE.md` | clear as it is | 0 | 0 | 1 | One comment holds five instructions |
| `.claude/skills/braindump/SKILL.md` | small fixes | 0 | 2 | 3 | Steps 2 to 6 are labels with fragments |
| `.claude/skills/filechanges/SKILL.md` | small fixes | 1 | 2 | 3 | One bullet in step 4 holds seven link rules |
| `.claude/skills/filing-project-records/SKILL.md` | small fixes | 0 | 3 | 3 | "record" is defined on line 18 but used from line 8 |
| `.claude/skills/filing-project-records/references/file-source.md` | small fixes | 0 | 1 | 3 | "Save" means two different things |
| `.claude/skills/filing-project-records/references/record-decision.md` | small fixes | 0 | 1 | 1 | One sentence in step 5 is hard to parse |
| `.claude/skills/filing-project-records/references/update-system-doc.md` | small fixes | 0 | 1 | 1 | A garbled sentence in "Mark a rule Built" |
| `.claude/skills/handoff/SKILL.md` | small fixes | 0 | 1 | 3 | "Now" is used as a name with no explanation |
| `.claude/skills/handoff/assets/handoff-prompt-template.md` | clear as it is | 0 | 0 | 0 | None |
| `.claude/skills/handoff/examples/handoff-example.md` | clear as it is | 0 | 0 | 0 | None |
| `.claude/skills/handoff/references/handoff-verifier.md` | not scanned | 0 | 0 | 0 | A copy of `dev/build-shared/helper-briefs/handoff-verifier.md` |
| `.claude/skills/merge-and-clean-up/SKILL.md` | small fixes | 0 | 2 | 3 | "Run each command on its own" can be read two ways |
| `.claude/skills/publish-docs/SKILL.md` | small fixes | 0 | 2 | 3 | The rule on when to use the skill is buried at the end of step 1 |
| `.claude/skills/publish-docs/references/recovery.md` | clear as it is | 0 | 0 | 2 | None that matters |
| `.claude/skills/pull-latest/SKILL.md` | needs a rewrite | 1 | 3 | 2 | Steps 1 and 2 pack exceptions and forward references into a few lines |
| `.claude/skills/reset-to-remote/SKILL.md` | small fixes | 0 | 3 | 2 | Required wording for the plan sits in "Mistakes to avoid" |
| `.claude/skills/session-summary/SKILL.md` | small fixes | 0 | 4 | 3 | Step 5 says "Change nothing" and then says to make changes |
| `.claude/hooks/session-start.mjs` (strings) | small fixes | 0 | 2 | 2 | A message that gives a fact and no action |
| `.claude/hooks/prompt-reminder.mjs` (strings) | small fixes | 0 | 1 | 3 | "Record what it says" does not say what "it" is |
| `.claude/hooks/codex-after-commit.mjs` (string) | clear as it is | 0 | 0 | 1 | One sentence holds three ideas |
| `.claude/hooks/validate-records.mjs` (strings) | clear as it is | 0 | 0 | 4 | Small details only |
| `assets/owner-preferences.md` | small fixes | 0 | 1 | 1 | No sentence says how it differs from `SOUL.md` |
| `assets/soul/SOUL.md` | small fixes | 0 | 1 | 2 | The fill-in guide uses "seed" and "obtain their approval" |
| `assets/settings/codex-hooks.local.json` (description) | small fixes | 0 | 1 | 0 | The description leaves out two things the prompt hook prints |
| `assets/settings/codex-hooks.notion.json` (description) | small fixes | 0 | 1 | 0 | Same description |
| `assets/settings/codex-hooks.hindsight.json` (description) | small fixes | 0 | 1 | 0 | Same description |
| `assets/settings/claude-settings-hooks.{local,notion,hindsight}.json` | clear as it is | 0 | 0 | 0 | No `description` text in these files |
| `assets/settings/codex-plugins-off.toml`, `enabled-plugins-off.json` | clear as it is | 0 | 0 | 0 | No `description` text in these files |

Totals: 3 High, 65 Medium, 98 Low.

## Findings

### `AGENTS.md` (root; every finding here is P1 in flight)

**`AGENTS.md:150`, High**
- Text: "The owner asks where the project stands, what waits on the owner, or what comes next, such as "where are we" | Use `managing-work-items` for open work items and project tasks. Use `managing-project-memory` for the project's Current State, ... Ask one decision at a time, with your recommendation. Name the next work item to start: ..."
- Breaks: "Extra rules for documents": "Give each instruction its own sentence."
- Why: This table is called "Which skill", so a reader looks here for a skill name, but this cell is an eight-step procedure, and it is the only place that procedure is written.
- Rewrite: Replace the cell with "Follow "When the owner asks where the project stands", below." Add this section after the table:

  > ## When the owner asks where the project stands
  >
  > Use this section when the owner asks where the project stands, what waits on the owner, or what comes next, for example "where are we".
  >
  > 1. Read the open work items and project tasks with `managing-work-items`.
  > 2. Read the project's Current State with `managing-project-memory`. In a Hindsight project, read it as `.claude/rules/hindsight-memory.md` says. Report each dated line, and say when its date has passed.
  > 3. Read the Open entries in `DECISIONS.md`.
  > 4. Report each open project task with who owes it, and any unsaved work in the worktree of each work item in progress.
  > 5. Ask one decision at a time, with your recommendation.
  > 6. Name the next work item to start. Choose work that has started first, then the earliest project phase that is not Done, then the highest-priority work item in Backlog.

**`AGENTS.md:1-9`, Medium**
- Text: "<One sentence describing this project and its outcome.> A session is one chat with the agent. / The owner named in `PROJECT.md` dictates most messages with voice-to-text, ..."
- Breaks: "Extra rules for documents": "Open the document with what it is for and what must be true when its job is done."
- Why: A stranger never learns that this is the first file every agent reads, that the project was set up with "Toolkit V2", or what "the toolkit" is, yet the word "toolkit" appears on lines 47, 55, and 156.
- Rewrite: Add a paragraph after the project sentence: "This file is the first file every agent reads in this project. It says what your job is, where each kind of information is kept, which skill to use for each job, and when to ask the owner. This project was set up with Toolkit V2, a set of files, skills, and hook commands (small programs that Claude Code or Codex runs at set moments) that give every project the same layout and rules. In this file, "the toolkit" means Toolkit V2."

**`AGENTS.md:27`, Medium**
- Text: "Read them again after resume, clear, or compaction. In Claude Code this import has already loaded `PROJECT.md`: @PROJECT.md"
- Breaks: "Words and names": "Make the subject of "this", "that", "it", and "they" clear."
- Why: "this import" points forward to a line the reader has not seen yet, and "resume, clear, or compaction" are three session events that are not explained.
- Rewrite: "Read them again after the session is resumed, cleared, or compacted (shortened by the host to save space). In Claude Code, the import that follows has already loaded `PROJECT.md`: @PROJECT.md" (The text `@PROJECT.md` stays bare, because Claude Code ignores an import inside backticks.)

**`AGENTS.md:29`, Medium**
- Text: "Codex: at session start, and again after compaction, read every file in `.claude/rules/` that has no `paths` line at its top. Open each of the others before you work on a path it names."
- Breaks: "Words and names": "Make the subject of "this", "that", "it", and "they" clear." and "Name who acts, and put that name first."
- Why: The reader must know that a "`paths` line" sits in the file's front matter, and "the others" and "it" could each mean two things.
- Rewrite: "In Codex, read these files at the start of each session and again after each compaction: every file in `.claude/rules/` that has no `paths` line in its front matter (the block at the top of the file). Before you work on a path that a rule file names in its `paths` line, open that rule file."

**`AGENTS.md:30`, Medium**
- Text: "The bullets below are for the session the owner writes to. A helper agent (a separate agent started for one job) follows its brief."
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project." and "Write about the subject. Do not write about the document itself".
- Why: "The bullets below" does not say which bullets, because the same list has bullets above and below this line, and "brief" is not explained.
- Rewrite: Move the sentence to the top of the section: "Every bullet in this section is for the session the owner types into. A helper agent, which is a separate agent started for one job, follows the instructions in its brief and not this section."

**`AGENTS.md:34`, Medium**
- Text: "Stop at the first check that finds one. Ask the owner only when it finds two."
- Breaks: "Words and names": "Make the subject of "this", "that", "it", and "they" clear."
- Why: "it finds two" could mean two checks, or one check that finds two work items; only the second makes sense, because the first check that finds one stops the search.
- Rewrite: "Stop at the first check that finds a work item. When that check finds two or more, ask the owner which one."

**`AGENTS.md:39`, Medium**
- Text: "Git does not track `work-items/`, `memory/`, and `working-files/`. They exist only in the main checkout, the first path `git worktree list` prints. Every worktree, a separate folder with its own branch, shares them."
- Breaks: "Sentences": "Put one idea in a sentence, or two ideas that belong together." and "Words and names": "Say a thing in plain words before you give it a name."
- Why: "They exist only in the main checkout" and "every worktree shares them" read as a contradiction, and the term "main checkout" is introduced as a path, not as a folder.
- Rewrite: "Git does not track `work-items/`, `memory/`, and `working-files/`, so these three folders exist only in the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints. A worktree is a separate folder with its own branch. A session in a worktree reads these three folders from the main checkout."

**`AGENTS.md:47`, Medium**
- Text: "A folder below that has its own `AGENTS.md` holds the same pair of files."
- Breaks: "Words and names": "Make the subject of "this", "that", "it", and "they" clear."
- Why: "A folder below that" has no clear referent, and "the same pair" refers to a pair that the cell names only in passing.
- Rewrite: "A folder inside the project that has its own `AGENTS.md` also has a `CLAUDE.md` beside it with the same one line."

**`AGENTS.md:36, 42`, Medium**
- Text: Heading "Project map", and the column heading "When you change it".
- Breaks: "Words and names": "Give every heading a name in ordinary words that tells the reader what the section covers."
- Why: "Map" is a picture word, and the third column does not hold "when" at all: its cells say who may change a file ("Only the owner changes it"), which skill to use, or "Never edit".
- Rewrite: Rename the heading "What each file and folder holds" and the column "How to change it".

**`AGENTS.md:36-87 and 89-118`, Medium (layout)**
- Text: The 46-row table "Project map" comes before "Where information goes", and about a dozen files and folders are described in both tables (for example `working-files/` on lines 79 and 112, `sources/` on lines 68 and 106, `system/glossary.md` on lines 60 and 105).
- Breaks: "Extra rules for documents": "Organize the document so that a reader can find a thing from the headings alone. ... Put the sections in the order the reader needs them." and "Paragraphs and sections": "Leave out a sentence that the reader does not need."
- Why: The reader needs the filing table and the skill table on most turns, and the long reference table delays them, and a fact that appears in both tables must be kept true in both.
- Rewrite: Put "Where information goes", "Ask the owner first", and "Which skill" before the file table, and move the file table last. Keep the file table for what a file is, and keep "Where information goes" for where a fact goes. Remove the repeated detail from one of the two tables. See "Layout".

**`AGENTS.md:91`, Medium**
- Text: "File at the narrowest scope that covers everyone affected. The test: would an agent working on a different work item need to know this? If yes, file it at the wider scope and write one line with its ID in the work item."
- Breaks: "Sentences": "Write whole sentences in prose and instructions." and "Words and names": "Be specific."
- Why: "File at" has no object, "scope" is an abstract word for a place, and "its ID" does not say whose ID.
- Rewrite: "Put each fact in the narrowest place that covers everyone it affects. To choose, ask: would an agent working on a different work item need to know this? If so, put the fact in the wider place (a project file such as `DECISIONS.md` or `system/`), and add one line with the fact's ID to the work item."

**`AGENTS.md:116`, Medium**
- Text: "Something that happened, such as a meeting, a run of a recurring job, or a failure the owner reports, or a result given only in a reply, that a later session would need and no other record shows"
- Breaks: "Sentences": "Keep the subject and its verb close together." and "Put one idea in a sentence".
- Why: The relative clause "that a later session would need" comes about 30 words after the word it describes, and the list has two "or" levels.
- Rewrite: "Something that happened, when a later session would need it and no other record shows it: a meeting, a run of a recurring job, a failure the owner reports, or a result given only in a reply".

**`AGENTS.md:117`, Medium**
- Text: "`.claude/rules/owner-preferences.md`. For every project: `~/.claude/rules/owner-preferences.md` and `~/.codex/AGENTS.md`. Never a setting of Claude Code or Codex, or a hook."
- Breaks: "Words and names": "Be specific." and "Sentences": "Write whole sentences in prose and instructions."
- Why: "For every project:" could mean "also write to these files" or "write only there", and the reader does not know when a preference counts as "for every project".
- Rewrite (the meaning is a guess, so the owner should confirm it): "`.claude/rules/owner-preferences.md` for this project. When the owner says the preference is for all of the owner's projects, also add it to `~/.claude/rules/owner-preferences.md` (Claude Code) and `~/.codex/AGENTS.md` (Codex). Never turn a preference into a setting of Claude Code or Codex, or into a hook."

**`AGENTS.md:120`, Medium**
- Text: "To find what was decided before, read `DECISIONS.md`, then `system/`, then the work item. Before you say nothing is recorded, search `work-items/` and `memory/` too ... Search memory before you ask the owner to repeat something, name who does or decides something, set a date, deploy, load data, or run a recurring job."
- Breaks: "Extra rules for documents": "Give each section one subject, and put everything about that subject in that section."
- Why: The paragraph is about searching, but it sits under "Where information goes", which is about filing, and its last sentence lists six different reasons to search.
- Rewrite: Give it its own heading, "How to find what was decided before", and split the last sentence into a list: "Search memory before you do any of these: ask the owner to repeat something; name who does or decides something; set a date; deploy; load data; run a recurring job."

Low findings in `AGENTS.md`: 12. Examples: line 26, "adds the project's Current State ... to your context" uses "hook" and "context" without explaining either; line 118, "a procedure that proved itself" is an idiom (write "a procedure that has worked"); line 108, 111, and 114, the right-hand cell of "Where it is kept" holds an instruction in three different forms ("Write it to ... before you reply", "... Never commit it.", "... With no work item open: memory"), so the items in the column do not have the same form.

Questions for the owner (the section "Your job as the agent" is his approved text, so no rewrite is proposed):
- Line 15: "the project's phases" uses "phase" with no explanation. Should the section say once what a phase is?
- Line 16: "Keep each record" uses "record" without saying which records (the word list says each file should say which). Should the sentence name them?
- Line 20: the paragraph holds five instructions. Should it become a list?

### `PROJECT.md`

**`PROJECT.md:47-60`, Medium**
- Text: Heading "Toolkit settings" and labels such as "Tracker: `<local, notion, or github>`" and "Memory: `<local, notion, or hindsight>`".
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project. ... explain the made-up word when it first appears."
- Why: A reader who sees the rendered page (an HTML comment is hidden) gets no sentence that says what these lines are, who changes them, or what "Tracker" means; line 32 uses the word before it is explained.
- Rewrite: Add a visible sentence under the heading: "These lines record the choices made when this project was set up with Toolkit V2. "Tracker" is the place where work items are kept, and "Memory" is the place where project memory is kept. The setup skill changes a line only when the owner changes a choice." Keep the labels word for word.

Low findings in `PROJECT.md`: 3. Examples: line 14, the "Constraints" line under "Scope and boundaries" is a pointer, not a scope fact; line 32, the first bullet is a 30-word sentence with a nested quotation; line 54, "ids" should be "IDs" (template prompt, so only a note).

### `DECISIONS.md`

**`DECISIONS.md:12-13`, Medium**
- Text: "Open: a question that waits for an answer. Decided says "not yet"." and "Decided: the person named in Decided gave the answer on that date."
- Breaks: "Words and names": "Use the exact name the system uses for a thing, and use the same name every time." and "Make the subject of "this", "that", "it", and "they" clear."
- Why: "Decided" is both a Status value and the name of a line in the entry, so "Decided says" and "named in Decided" can each mean either one.
- Rewrite: "Open: a question that waits for an answer. Its Decided line says "not yet"." and "Decided: the person named on the Decided line gave the answer on that date."

**`DECISIONS.md:19`, Medium**
- Text: "Each work item under Affects of an Open or Decided entry names the DEC ID on its Related items line."
- Breaks: "Sentences": "Name who acts, and put that name first." and "Put the condition before the action."
- Why: The sentence has four nouns joined by "of" and "on", and the reader cannot tell whether the work item or the entry holds the ID.
- Rewrite: "When an Open or Decided entry lists a work item under Affects, that work item's Related items line holds the entry's DEC ID."

Low findings in `DECISIONS.md`: 2. Examples: line 10, "The ID is DEC- and three digits" (write "The ID is DEC- followed by three digits"); line 15, "Why says the reason" (write "The Why line gives the reason").

### `README.md`

Low findings: 2. Examples: line 17, the heading "Project records" lists `AGENTS.md`, which is not a record; line 26, the last bullet is one 40-word sentence (split it after "tasks").

### `.claude/rules/cite-recalled-knowledge.md`

**`cite-recalled-knowledge.md:8`, Medium**
- Text: "just above the closing question or the words that continue the work"
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project."
- Why: "the words that continue the work" is a project phrase, and the same phrase, with small changes, appears in the output style and in five skills.
- Rewrite: "just above the closing question or, when there is no question, the exact words the owner can say to continue". See Patterns, pattern 7.

### `.claude/rules/humanize-outbound-text.md`

**`humanize-outbound-text.md:3`, Medium**
- Text: "Run any text that will leave the project and be read by someone other than the owner through the `humanizer` skill before the owner sees the final version."
- Breaks: "Extra rules for documents": "When you point to another file, say what is in the file and when to open it."
- Why: A stranger does not know what the `humanizer` skill does, and the sentence holds three ideas.
- Rewrite: "Before you show the owner the final version of any text that someone other than the owner will read, run the text through the `humanizer` skill. The skill rewrites text so that it does not sound like AI."

Low findings: 2. Examples: line 7, "id" should be "ID"; line 8, "their name" mixes with "the owner" (write "the owner's name").

### `.claude/rules/keep-work-item-current.md`

**`keep-work-item-current.md:10`, Medium**
- Text: "Rewrite Next action to match the work item's status, its State, its `waiting_on`, its approvals, and its ticked tasks."
- Breaks: "Sentences": "Break up a string of nouns when the reader would have to guess how they relate."
- Why: "status" and "State" are two different things in a work item, and a stranger cannot tell which is which.
- Rewrite (confirm the field names against the work item template): "Rewrite Next action to match the work item's other fields: its Status, its State, its `waiting_on`, its approvals, and which tasks are ticked."

**`keep-work-item-current.md:16-18`, Medium**
- Text: Heading "Approvals" with the one bullet "A work item keeps its requirements approval when it moves to a later State."
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project." and "Be specific."
- Why: "requirements approval" is not explained, and the bullet does not say what the agent must do or must not do.
- Rewrite: "When a work item moves to a later State, keep the owner's approval of its requirements. Do not clear it." (Confirm this is the intended rule.)

Low findings: 2. Examples: line 9, "the form that the template gives for a work item that waits" is circular; line 12, the heading "Questions and decisions" does not match its one bullet, which is about requirements and corrections.

### `.claude/rules/memory-review-and-save.md`

**`memory-review-and-save.md:3`, Medium**
- Text: "This rule applies to the main agent."
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project."
- Why: "the main agent" is not defined anywhere in the file, and the root `AGENTS.md` calls the same thing "the session the owner writes to".
- Rewrite: "This rule applies to the agent in the session the owner writes to. A helper agent does not follow it."

Low findings: 3. Examples: line 3, the second sentence describes the document ("It says when to review...") and can go; line 9, the first bullet has two "in which" clauses; line 17, "a fact that `AGENTS.md` ... keeps in a place outside memory" has the document as the subject (write "Never save in memory a fact that belongs in another file. `AGENTS.md`, section "Where information goes", says which facts those are.").

### `.claude/rules/shared-repository-work.md`

**`shared-repository-work.md:3`, Medium**
- Text: "Other sessions edit this repository now."
- Breaks: "Words and names": "Be specific."
- Why: The sentence states as fact something that is only possible, and "now" has no point in time; a reader alone in a repository may think the rule does not apply.
- Rewrite: "Other sessions may be editing this repository at the same time as you."

**`shared-repository-work.md:18`, Medium**
- Text: "An unknown worktree, a moved branch, or a change you did not make means that other sessions are working. Do not fix it. Tell the owner."
- Breaks: "Words and names": "Make the subject of "this", "that", "it", and "they" clear."
- Why: "it" could mean the worktree, the branch, the change, or the situation, so "Do not fix it" could be read as "do not undo the change" or "do not repair the worktree".
- Rewrite: "An unknown worktree, a moved branch, or a change you did not make means that another session is working here. Do not change or undo what you find. Tell the owner."

Low findings: 3. Examples: line 23, "The one exception to using your own worktree and branch is a one-file edit asked for directly" is a noun chain (write "Make a one-file edit that the owner asked for directly in the folder you are in; every other change uses your own worktree and branch" if that is the intent); line 31, "check every folder where work items are kept" applies to a work item ID but not to a DEC or SRC number; line 33, "When a file is in both" does not say both what.

### `.claude/output-styles/plain-english.md` (P1 in flight)

**`plain-english.md:33`, Medium (P1 in flight)**
- Text: "If a named thing has not appeared recently, add a few words that identify it."
- Breaks: "Words and names": "Be specific."
- Why: "a named thing" and "recently" have no measure, so the agent decides differently each time.
- Rewrite: "If the owner has not seen a work item's name in this session, add a few words that say what the work item is."

**`plain-english.md:37`, Medium (P1 in flight)**
- Text: "Give one direct line whenever any of these is true: ... or there is a cost."
- Breaks: "Words and names": "Be specific." and "Use common words."
- Why: "a direct line" is a picture word, and "a cost" does not say what kind of cost.
- Rewrite: "Say so in one plain sentence whenever any of these is true: the user lost or will lose something; an action cannot be undone; work cannot continue until the user acts; or the work costs money or time that the user has not agreed to." (Confirm the kind of cost.) The same wording is in the root `AGENTS.md` line 170.

**`plain-english.md:15`, Medium (P1 in flight)**
- Text: "Stop after the answer. Do not add extra implementation detail, related advice, next steps, or an offer to do more unless the user asked for them."
- Breaks: "Paragraphs and sections": "Leave out a sentence that the reader does not need." The related W4 check in `dev/reviews/wording-review.md` is "two lines ... that say different things".
- Why: Seven skills tell the agent to end with a question or with "the exact words that continue" (for example `pull-latest` line 74 and `merge-and-clean-up` line 213), and `filechanges` says "Reply with the list ... and nothing else", so the agent has two instructions that disagree.
- Rewrite: Add a sentence that settles it: "A skill that names a closing line for its reply overrides this paragraph for that reply." This is a question for the owner if he wants one rule for all replies.

Low findings: 3. Examples: line 7, "chat replies" (the word list says "session"); the words "user" (7 times) and "owner" (the word list: use "the owner"); line 27, "rhetorical contrast" and "word pairs chosen for rhythm" are jargon for a reader who is not a writer.

### `system/AGENTS.md`

**`system/AGENTS.md:74`, Medium**
- Text: "A meaning that only a source listed in `sources/README.md` gives, or that you worked out, is not a term yet. The owner confirms it first."
- Breaks: "Sentences": "Name who acts, and put that name first." and "Put the condition before the action."
- Why: "is not a term yet" does not say what to do, and "first" does not say before what.
- Rewrite: "When a meaning comes only from a source listed in `sources/README.md`, or from your own work, do not add it to the glossary until the owner confirms it."

Low findings: 3. Examples: line 17, "which side holds the true value" (write "which system is the source of truth"); lines 22, 45, and 78 use "The form of ..." as headings, and "What goes in a document" and "What goes in a rule" say the subject in ordinary words; line 90, "What must stay true" could be "Rules that always apply".

### System document templates (7 files) and the integrations list

Each of `system/glossary.md`, `architecture.md`, `automation.md`, `constraints.md`, `data-model.md`, `security-model.md`, `integrations/INTEGRATION-TEMPLATE.md`, `integrations/README.md`, plus `sources/README.md`, `reference/outside-docs/INDEX.md`, and `DECISIONS.md`, has an HTML comment that starts "Keep this guide." (11 files).

**Low, in each of the 11 files, line 3 (line 3 of the comment in `DECISIONS.md`)**
- Text: "Keep this guide."
- Breaks: "Extra rules for documents": "When an instruction would look arbitrary, give the reason in one clause."
- Why: The reader can guess to keep the comment, but not why, and other templates say "Delete this guide".
- Rewrite: "Keep this comment: it tells the agent what this document is for." (Check first that no tool reads the exact words; `grep` found none in `dev/tools` or `dev/tests`.)

### `sources/AGENTS.md`

**`sources/AGENTS.md:26-33`, Medium**
- Text: Heading "A source kept outside Git", whose first bullet is "Text the owner pasted, and a Markdown or plain text file, is kept in this folder."
- Breaks: "Extra rules for documents": "Give each section one subject".
- Why: The first bullet is about what stays in the repository, so the heading does not describe the section.
- Rewrite: Rename the heading "Where to keep a source: in this folder or outside Git". Start the first bullet with the actor: "Keep text that the owner pasted, and any Markdown or plain text file, in this folder."

Low findings: 1. Example: line 28 (the passive "is kept"; fixed in the rewrite above).

### `delivery/AGENTS.md`

**`delivery/AGENTS.md:56`, Medium**
- Text: "Never commit a file that holds real records, such as a data load file, a backup, or a list of contacts made for the client."
- Breaks: "Words and names": "Use the exact name the system uses for a thing, and use the same name every time."
- Why: In this folder "record" means a deployment record, a release plan, and similar files, so "real records" can be read as "the records of this folder".
- Rewrite: "Never commit a file that holds real data, such as a data load file, a backup, or a list of contacts made for the client."

**`delivery/AGENTS.md:57`, Medium**
- Text: "For a client handoff that includes such a file, or a file that `publish-docs` does not commit, such as a spreadsheet: put the file beside `HANDOFF.md` in the main checkout, ... The main checkout is the first path that `git worktree list` prints; a file that Git does not track is lost when its worktree is removed."
- Breaks: "Sentences": "Write steps in the order the reader does them, and give each step its own sentence." and "Put one idea in a sentence".
- Why: The bullet has six sentences, the label comes before the case, and the reason for the odd rule (Git does not track the file) comes last.
- Rewrite: "A client handoff may include a file that Git must not track, such as a spreadsheet or a file that holds real data. Git does not track the file, so a worktree that is removed takes the file with it. To keep the file: (1) put it beside `HANDOFF.md` in the main checkout, which is the first path that `git worktree list` prints; (2) add the file's name to a `.gitignore` in that handoff's folder; (3) commit `HANDOFF.md` and that `.gitignore`; (4) never commit the file itself."

**`delivery/AGENTS.md:22-28`, Medium**
- Text: Table "Record | File | Fields", where each Fields cell is a list of 8 to 11 items joined by semicolons.
- Breaks: "Sentences": "Give every item in a list the same form." and "Extra rules for documents": "Choose the form that serves the reader's job."
- Why: The reader checks a record against this list field by field, and a cell of 100 words is hard to scan; in the "Migration area" row the cells name files and fields in the same list.
- Rewrite: Replace the table with one short list per record type, one field on each line, for example under "Deployment (`DEPLOYMENT-RECORD.md`)": "The work item's ID. The target environment. Status. The date and time it ran. Who ran it, and who is responsible. Exactly what was deployed: a commit, a version, or a package. ..."

Low findings: 2. Examples: line 20, "holding these fields" (write "that holds these fields"); line 27, the "Migration area" row does not say which three files make up the record.

### `reference/AGENTS.md`

**`reference/AGENTS.md:13`, Medium**
- Text: "Never put any of these here: a client file, a meeting note, or a transcript, which go in `sources/`; a project decision; an instruction for agents."
- Breaks: "Sentences": "Give every item in a list the same form." and "Extra rules for documents": "Never leave a file name where the instruction should be."
- Why: "which go in `sources/`" attaches to the first three items, and the last two have no destination.
- Rewrite: "Put a client file, a meeting note, or a transcript in `sources/`. Put a project decision in `DECISIONS.md` or `system/`. Do not put an instruction for agents here."

Low findings: 2. Examples: line 17, `SOURCE-RECORD.md` is named like a source but holds the web address and capture date of a captured page; sources are a different thing (exact string, so only a note); line 3, "Never use a page here as a decision or a rule of this project" repeats line 51.

### Other templates

`reference/outside-docs/INDEX.md`, `tests/TEST-PLAN-TEMPLATE.md`, and `sources/README.md` each have 1 Low. For `TEST-PLAN-TEMPLATE.md` line 3, one comment holds five instructions; split it into a short numbered list.

### `.claude/skills/braindump/SKILL.md`

**`braindump/SKILL.md:13-28`, Medium**
- Text: "2. **The goal first.** One or two sentences: what the owner wants to achieve ..." and "5. **Questions, then stop.** Each with a recommended answer where you have one."
- Breaks: "Sentences": "Write whole sentences in prose and instructions. ... Never cut a prose sentence down to a label and a colon." and "Give every step in a procedure the same form."
- Why: Step 1 is an instruction, but steps 2 to 6 are labels followed by fragments that do not say who does what.
- Rewrite: "2. **State the goal first.** Write one or two sentences that say what the owner wants to achieve, even where the dump does not say it directly." "3. **List each separate ask.** Write a short numbered list, so that no ask is merged or dropped without a note." "4. **Say what you are not sure about.** Write every guess, gap, and thing that could be read two ways, for example "I think you mean X, but you might mean Y."" "5. **Ask your questions, then stop.** Give each question a recommended answer where you have one. When you have no questions, end with one line that asks for a yes." "6. **Replay only a correction.** When the owner corrects you, say back only the corrected part, in one or two lines, and ask again."

**`braindump/SKILL.md:37-38`, Medium**
- Text: "A hook reminder says something may be worth keeping: save nothing before the owner's yes. Name it in the playback."
- Breaks: "Sentences": "Put the condition before the action." and "Words and names": "Make the subject of "this", "that", "it", and "they" clear."
- Why: The condition is given as a statement, "it" has no clear subject, and "the playback" is not defined where it is used.
- Rewrite: "When a hook reminder says something in the dump may be worth keeping, save nothing until the owner says yes. Mention the item in the playback."

Low findings: 3. Examples: line 10, "With none" (write "When there is no dump"); line 36, "do it" (write "do the work"); the opening says what happened and not what the skill is for or when it is done.

### `.claude/skills/filechanges/SKILL.md`

**`filechanges/SKILL.md:31`, High**
- Text: "For a copy on this computer, the target is the full path of the copy. ... Claude Code and Codex each have their own form for a link to a local file, so use the form that your instructions give, with the full path in it. When that form shows the path itself, as a path in code form does, write the full path in place of the name. ..."
- Breaks: "Extra rules for documents": "Give each instruction its own sentence." and "Sentences": "Put one idea in a sentence".
- Why: One bullet holds about 200 words and seven separate rules (full path, host form, code form, no form given, forward slashes, spaces, folders a link may open), so the reader cannot tell which rule applies first.
- Rewrite: Replace the bullet with a short procedure: "For a copy on this computer, build the link target from the full path of the copy. A path that is not a full path is resolved from a folder you may not be working in, so it can open another copy. (1) Use the link form that your instructions give for a local file, with the full path in it. (2) When your instructions give no form, write a Markdown link whose target is the full path. (3) In a Markdown link, write the path with forward slashes, and put a path that holds a space between `<` and `>`. (4) When your instructions say that a link opens only files in certain folders, and the copy is outside them, write the full path of the copy in code form in place of the link, so that the owner can open the file." (This keeps the rule in the original about a form that shows the path itself.)

**`filechanges/SKILL.md:12`, Medium**
- Text: "A file can have more than one copy: one in the project's main folder, one in each Git worktree, and one on each branch on the remote. ... A copy holds the change when ... A link to a copy without the change shows the owner the old text, so every link must open a copy that holds the change."
- Breaks: "Sentences": "Put one idea in a sentence, or two ideas that belong together. Start a new sentence for a third idea."
- Why: One paragraph of seven sentences defines "copy", "main folder", "worktree", and "holds the change", and the reader must remember all four for step 3.
- Rewrite: Split into a short list of the four words, each with one sentence, and put the rule "every link must open a copy that holds the change" after the list.

**`filechanges/SKILL.md:28`, Medium**
- Text: "Put the changes that the project's main folder holds, and the changes to files that are in no copy of the project, in one table. Group the other changes by the copy that step 3 found: ..."
- Breaks: "Sentences": "Put one idea in a sentence". "Write steps in the order the reader does them."
- Why: The first sentence mixes two kinds of change in one table, and the grouping rule that follows is hard to apply.
- Rewrite: "Make one table for the changes that the project's main folder holds, together with the changes to files that are in no copy of the project. Make one more table for each worktree, and one for each branch whose changes no folder on this computer holds. Above each of these extra tables, ..."

Low findings: 3. Examples: line 31, "so that the owner can open the file himself" (use "the owner", not "he"); line 35, "may stand above a table" (write "may appear above a table"); line 32, "The command prints an address in any case" is an idiom (write "The command prints an address even when the file is not on that branch").

### `.claude/skills/filing-project-records/SKILL.md`

**`filing-project-records/SKILL.md:18`, Medium**
- Text: "In this skill, a record is one saved source, one entry in `DECISIONS.md`, or one rule in `system/`. To save a record is to commit the change to the default branch with `publish-docs`."
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project. ... explain the made-up word when it first appears."
- Why: "record" is used from line 8, and "save" from line 10, and both are defined only on line 18.
- Rewrite: Move the two sentences to line 8, directly after "Use this skill to file records that later work may need."

**`filing-project-records/SKILL.md:50-51`, Medium**
- Text: "Where a step in this skill says to save, continue from step 4 of `publish-docs`."
- Breaks: "Words and names": "Be specific."
- Why: The reader does not know why step 4, and "continue from" does not say that steps 1 to 3 are already done.
- Rewrite: "The save worktree now exists, so when a step in this skill says to save, start at step 4 of `publish-docs`."

**`filing-project-records/SKILL.md:55`, Medium**
- Text: "The record's ID is yours only when its save is on the default branch."
- Breaks: "Words and names": "Name the thing directly. Do not replace its name with a metaphor, idiom, or joke."
- Why: "yours" is an ownership metaphor, and a reader may think the ID is reserved when the file is written.
- Rewrite: "Until the save is on the default branch, another session can take the same ID. The ID is safe to use only after the save is on the default branch." The same idiom is in `file-source.md` line 20.

Low findings: 3. Examples: line 33, "The rest of this file applies to all three steps" describes the document; line 24, the column header "Open" clashes with the status "Open" of a decision (write "File to open"); line 76, the bullet defines "the project's Current State" in the middle of an instruction.

### `.claude/skills/filing-project-records/references/file-source.md`

**`file-source.md:37`, Medium**
- Text: "An action item: something a named person agreed to do | Save it at once, without asking."
- Breaks: "Words and names": "Use the exact name the system uses for a thing, and use the same name every time."
- Why: In this skill "save" means commit with `publish-docs`, but here it means add a task to a work item.
- Rewrite: "Add it at once, without asking, as a task in the work item it belongs to, or as a project task with that person as Who does it. Use `managing-work-items`."

Low findings: 3. Examples: line 14, "Take the next SRC number" does not say where the number comes from (point to `sources/AGENTS.md`, the row form); line 20, "makes the number yours" (see the finding at `SKILL.md:55`); line 21, "`SKILL.md`, section ..." does not name the skill (write "`filing-project-records/SKILL.md`").

### `.claude/skills/filing-project-records/references/record-decision.md`

**`record-decision.md:38`, Medium**
- Text: "An Open entry gets a rule now only when a work item under its Affects is designed or built to the proposed wording before the answer is given."
- Breaks: "Sentences": "Name who acts, and put that name first." and "Put the condition before the action."
- Why: The sentence has the condition at the end and a passive verb pair, so the reader cannot tell who designs or builds.
- Rewrite: "Write a rule for an Open entry now only when a work item listed under its Affects is being designed or built to the proposed wording before anyone has answered the question. Mark that rule Draft."

Low findings: 1. Example: lines 29-35 nest bullets three deep in one step.

### `.claude/skills/filing-project-records/references/update-system-doc.md`

**`update-system-doc.md:44`, Medium**
- Text: "the work item's checker marked Met a requirement of the work item that builds or changes the behaviour the rule states."
- Breaks: "Sentences": "Keep the subject and its verb close together."
- Why: The verb "marked Met" is followed by a long object, and "the work item" appears twice so the reader loses the thread.
- Rewrite: "the work item's checker marked Met a requirement that builds or changes the behavior the rule states."

Low findings: 1. Example: line 44, "behaviour" is spelled differently from "behavior" in `reference/AGENTS.md`.

### `.claude/skills/handoff/SKILL.md`

**`handoff/SKILL.md:66`, Medium**
- Text: "Check the line under "Now" for each of this session's work items."
- Breaks: "Words and names": "A made-up word is new or has a meaning that exists only in this project."
- Why: "Now" is one of the five parts of the project's Current State, and the file never says so.
- Rewrite: "In the project's Current State, check the line under "Now" (the part that lists what is in progress) for each of this session's work items."

Low findings: 3. Examples: line 12, "hold back" in "Never hold back the prompt" is an idiom (write "Always show the prompt, even when a save or the check failed"); line 73, the list "a file, the repository, the owner, or it was worked out" is not parallel; lines 117-121, two pairs of table rows send to the same skill.

### `.claude/skills/merge-and-clean-up/SKILL.md`

**`merge-and-clean-up/SKILL.md:16`, Medium**
- Text: "Run each command on its own."
- Breaks: "Words and names": "Name the thing directly. Do not replace its name with a metaphor, idiom, or joke."
- Why: "on its own" could mean "alone, with nothing else running", "in a separate tool call", or "without `&&`". See Patterns, pattern 3.
- Rewrite: "Run each command in a separate step. Never join two commands with `&&`, `;`, or a pipe."

**`merge-and-clean-up/SKILL.md:117`, Medium**
- Text: "Never write a word that closes an issue or a work item in the subject or the body."
- Breaks: "Words and names": "Be specific."
- Why: "a word that closes an issue" is not an example, so a stranger does not know that it means a keyword such as "Closes #12".
- Rewrite: "Never put a closing keyword in the subject or the body, for example "Closes #12" or "Fixes #12"."

Low findings: 3. Examples: line 160, "all five proofs" (use "conditions"); line 101, the sentence that explains the second and third commands comes after the code block that holds them; line 217, the Codex bullet repeats text that four other files hold (pattern 4).

### `.claude/skills/publish-docs/SKILL.md`

**`publish-docs/SKILL.md:37`, Medium**
- Text: "Save only an edit that the owner asked for or said yes to, an edit that the root `AGENTS.md` tells you to make without asking, or an edit that another skill tells you to save with this skill ... That request, yes, or instruction also covers the push in step 7."
- Breaks: "Extra rules for documents": "Organize the document so that a reader can find a thing from the headings alone."
- Why: The rule on when this skill may be used is the last paragraph of step 1, and "That request, yes, or instruction" points back to three things.
- Rewrite: Move the paragraph to a new section before "Steps", called "When to use this skill". Begin: "Use this skill only for an edit that the owner asked for or said yes to, an edit that the root `AGENTS.md` tells you to make without asking, or an edit that another skill sends to this skill, for example `filing-project-records`. Any of these also covers the push in step 7."

**`publish-docs/SKILL.md:38-55`, Medium**
- Text: Step 2 "Look first", which nests conditions four levels deep (remote or not, then `origin` or not, then the command fails, then "(unknown)").
- Breaks: "Extra rules for documents": "Give each instruction its own sentence. The sentence says who does what, and when."
- Why: The reader has to track four open conditions at once to find the default branch.
- Rewrite: Split step 2 into "2. Look first" (the three commands and what `remote` prints) and "3. Find the default branch" (with a remote; with no remote), and renumber the later steps. Every file that cites a step number must change in the same edit (`filing-project-records/SKILL.md` lines 50-51, `recovery.md`, `file-source.md`).

Low findings: 3. Examples: line 96, "Saved to main" even when the default branch is not `main` (exact string); line 159, "what blocks the update" uses "update" for two different things; line 16, "on its own" (pattern 3).

### `.claude/skills/publish-docs/references/recovery.md`

Low findings: 2. Examples: the last section ("The repository has remotes, but none named `origin`") is the one a reader meets first in step 2 of `SKILL.md`, but it is last here; line 41, a list of six causes in one sentence.

### `.claude/skills/pull-latest/SKILL.md`

**`pull-latest/SKILL.md:31-33`, High**
- Text: "In your own worktree, a stop for no checked-out branch or for uncommitted changes ends only the work on your own branch: run step 2 first, then stop, and add step 5's line on the main checkout to the line saying why."
- Breaks: "Sentences": "Put one idea in a sentence" and "Write steps in the order the reader does them."
- Why: The sentence gives an exception to step 1, jumps to step 2, then to step 5, and "the line saying why" and "step 5's line" are two lines that the reader must match.
- Rewrite: "In your own worktree, two of these stops (no branch checked out, uncommitted changes) end only the work on your own branch. In that case, do this: (1) do step 2, which updates the main checkout; (2) stop work on your own branch, and say why in one line; (3) add the line about the main checkout that step 5 gives."

**`pull-latest/SKILL.md:35`, Medium**
- Text: "The default branch: `git symbolic-ref --short refs/remotes/origin/HEAD` prints `origin/<default>`. If it fails, read the "HEAD branch" line of `git remote show origin`. Never assume `main`."
- Breaks: "Sentences": "Never cut a prose sentence down to a label and a colon."
- Why: The label starts a fragment, and the paragraph is a different subject from the stop list above it.
- Rewrite: "To find the default branch, run `git symbolic-ref --short refs/remotes/origin/HEAD`, which prints `origin/<default>`. If that command fails, read the "HEAD branch" line of `git remote show origin`. Never assume that the default branch is `main`."

**`pull-latest/SKILL.md:38-43`, Medium**
- Text: "**Fetch:** `git fetch --prune origin`. In your own worktree, update the main checkout next: ... On another branch, with uncommitted changes, or a pull that fails: leave the main checkout as it is."
- Breaks: "Sentences": "Give every step in a procedure the same form." and "Never cut a prose sentence down to a label and a colon."
- Why: Step 2 holds two jobs (fetch, then update the main checkout) and ends with a fragment.
- Rewrite: Split into "2. Fetch" and "3. In your own worktree, update the main checkout". End with "In these cases, leave the main checkout as it is: it is on another branch, it has uncommitted changes, or the pull fails."

**`pull-latest/SKILL.md:68-72`, Medium**
- Text: "The main project folder is updated to <short commit id>." / "The main project folder was already up to date." / "I left the main project folder alone: ..."
- Breaks: "Words and names": "Use the exact name the system uses for a thing, and use the same name every time."
- Why: The skill calls the same folder "the main checkout" in steps 1 and 2 and "the main project folder" here. The word list says to use "main checkout" only. These lines are what the agent says to the owner, so this is an exact string if a test reads it.
- Rewrite: Use "The main checkout is updated to ...", or explain the one name once at the top ("the main checkout, which is the project's main folder").

Low findings: 2. Examples: line 8, "from your own worktree the main checkout too" is hard to read (write "and, when you work in your own worktree, also bring the main checkout up to date"); lines 79-85, the first "Mistakes to avoid" bullet holds five sentences.

### `.claude/skills/reset-to-remote/SKILL.md`

**`reset-to-remote/SKILL.md:25`, Medium**
- Text: "**Run only on the owner's own words** that ask for a destructive reset."
- Breaks: "Sentences": "Name who acts, and put that name first."
- Why: The sentence has no subject: it does not say what "run" refers to.
- Rewrite: "**Use this skill only when the owner's own words ask for a destructive reset.**"

**`reset-to-remote/SKILL.md:36`, Medium**
- Text: "Any output is another session's work. So is another worktree that has a branch with an upstream checked out."
- Breaks: "Sentences": "Keep the subject and its verb close together." and "Be specific."
- Why: "Any output is another session's work" is a claim, not an instruction, and "So is another worktree" is an elliptical sentence.
- Rewrite: "Treat any output of that command as another session's work. Also treat a worktree that has a branch with an upstream checked out as another session's work. In either case, stop and report it."

**`reset-to-remote/SKILL.md:66 and 82-88`, Medium (layout)**
- Text: Step 4 says "Include, word for word, the line about the shared main checkout that is true. "Mistakes to avoid" below gives the two lines."
- Breaks: "Extra rules for documents": "Put each kind of content where its reader will look for it."
- Why: The two lines the agent must put in the plan are in a section about mistakes, far from the step that needs them.
- Rewrite: Move the two quoted lines, and the two conditions that decide which one applies, into step 4, and keep one sentence in "Mistakes to avoid" that says this skill is the one exception to `.claude/rules/shared-repository-work.md`.

Low findings: 2. Examples: line 53, the paragraph that explains "lockfile" is followed by a table and three conditions in one step; line 93, the Codex bullet (pattern 4).

### `.claude/skills/session-summary/SKILL.md`

**`session-summary/SKILL.md:15-16`, Medium**
- Text: "2. **Write the table.** Columns `#`, `What you asked`, `Status`, `Result`. One row per request, in the order asked. Use only the eight statuses below."
- Breaks: "Sentences": "Write whole sentences in prose and instructions."
- Why: The second and third sentences are fragments without a subject or verb.
- Rewrite: "2. **Write the table.** Use the columns `#`, `What you asked`, `Status`, and `Result`. Write one row for each request, in the order the owner asked. Use only the eight statuses below."

**`session-summary/SKILL.md:26-30`, Medium**
- Text: "4. **Name another skill only in this case.**"
- Breaks: "Words and names": "Give every heading a name in ordinary words that tells the reader what the section covers."
- Why: The label says nothing about the step, which offers to turn open requests into work items.
- Rewrite: "4. **Offer to save open requests.**" and begin the step with the condition: "When a request is still open and nothing in this session shows it saved as a work item or a project task, end the open block with one offer ..."

**`session-summary/SKILL.md:31-32`, Medium**
- Text: "5. **Change nothing.** If the owner says yes to the offer, make each change the owner chose with that skill."
- Breaks: "Paragraphs and sections": "Start a paragraph or a section with the sentence that states its point." (W4: two lines that say different things.)
- Why: The label says to change nothing, and the sentence says to make changes.
- Rewrite: "5. **Change nothing until the owner says yes to the offer.** When the owner says yes, make each change the owner chose, with the skill named in "Work that another skill does"."

**`session-summary/SKILL.md:46-49`, Medium**
- Text: "The owner choosing from options you offered, answering your question, or adjusting work under way, parts of one job, and work you suggested and then did all belong to the request that prompted them."
- Breaks: "Sentences": "Break up a string of nouns" and "Put one idea in a sentence".
- Why: Four kinds of item run together in one sentence, and "parts of one job" breaks the list.
- Rewrite: "Count these as part of the request that prompted them, not as new requests: the owner choosing from options you offered; the owner answering your question; the owner adjusting work that is under way; the parts of one job; and work you suggested and then did."

Low findings: 3. Examples: line 45, "a long session usually holds one to three" is a count (the root `AGENTS.md` asks for no counts where the agent judges: question for the owner); line 36, "No title above the table, no story of the work, no wrap-up, no third part" is a list of fragments; line 13, "the owner's real requests" (write "the requests the owner made").

### Hook command strings

All strings below are compared by tests or read by other files, so each is an exact string.

**`session-start.mjs:38-39`, Medium (exact string)**
- Text: "The project's Current State is 9 days old. Remove the lines that are no longer true with the managing-project-memory skill."
- Breaks: "Words and names": "Be specific."
- Why: The message does not give the limit (7 days), and removing lines does not make a page less old; the agent should also check each line and update "Last updated".
- Rewrite: "The project's Current State is 9 days old (the limit is 7 days). Check each line, remove the lines that are no longer true, and set the "Last updated" line, with the managing-project-memory skill."

**`session-start.mjs:43`, Medium (exact string)**
- Text: "memory/CURRENT_STATE.md is missing or empty in <folder>."
- Breaks: "Sentences": "Say what to do."
- Why: The message states a fact and gives no action; the handoff skill says to tell the owner and suggest the setup check.
- Rewrite: "memory/CURRENT_STATE.md is missing or empty in <folder>. Tell the owner, and suggest the setup check (the project-setup skill, "check the setup")."

Low findings: 2. Examples: line 9, "Context was just compacted" (write "This session was just compacted, which means the host shortened it"); line 14, the index link text "Current state" uses the work item's name for the project's Current State.

**`prompt-reminder.mjs:50-52`, Medium (exact string)**
- Text: "File a shared source with filing-project-records, step "file a source". Record what it says."
- Breaks: "Words and names": "Make the subject of "this", "that", "it", and "they" clear."
- Why: "it" could mean the source or the owner's message, and "Record" does not say where (the work item, `DECISIONS.md`, memory).
- Rewrite: "File a shared source with filing-project-records, step "file a source". Then record what the source says in the place that "Where information goes" names."

Low findings: 3. Examples: line 49, "that table names the file" (write "the "Where information goes" table names the file"); line 55, "owner-preferences.md" has no path (write `.claude/rules/owner-preferences.md`); line 43, "The managing-project-memory skill decides whether anything is saved" (a skill does not decide; write "Use the managing-project-memory skill to decide ...").

**`codex-after-commit.mjs:9-11`, Low (exact string)**
- Text: "A git commit command just ran. If the commit succeeded, update the work item's Recent History and status with managing-work-items, and the work item's line in the project's Current State when that line changed."
- Why: The second sentence holds three ideas. Write: "... update the work item's Recent History and Status with managing-work-items. Also update the work item's line in the project's Current State, when that line changed."

**`validate-records.mjs` strings, 4 Low (exact strings)**
- Line 133, `"None.".` ends with a quoted full stop followed by another stop (write `"None"`).
- Line 177, "the id of" uses lowercase "id" where the rest of the file says "ID".
- Line 276, "Fix these first." does not say that it means the findings that are shown (write "Fix the findings shown first").
- Line 72, "its Decided line holds the date and the name: YYYY-MM-DD, who." is hard to read (write "its Decided line holds the date and the name of the person, as YYYY-MM-DD, name").

### `assets/owner-preferences.md`

**`owner-preferences.md:3`, Medium**
- Text: "How the owner wants the agent to work in this project. Follow every line, every session."
- Breaks: "Extra rules for documents": "When another skill or file does a neighbouring job, say in one sentence which one does which part."
- Why: The root `AGENTS.md` also describes `SOUL.md` as the owner's description of how the agent works, so the reader does not know which file to use for which instruction.
- Rewrite: Add to the root `AGENTS.md` row for `SOUL.md`, and to `SOUL.md`'s guide, one sentence: "`SOUL.md` describes the working style the owner wants in general. `.claude/rules/owner-preferences.md` holds the owner's standing instructions, one per line." (Check with the owner that this is the intended split.)

Low findings: 1. Example: line 5, "Lines someone else wrote stay as they are" (write "Do not change a line that was not written by the agent from the owner's words" if that is the intent).

### `assets/soul/SOUL.md`

**`SOUL.md:3`, Medium**
- Text: "Fill-in guide for this optional owner-defined file: ask the owner whether to use it. If selected, replace the title and each angle-bracket prompt ... with the owner's stated preference; obtain their approval and delete this guide. ... Do not infer personal preferences from this seed."
- Breaks: "Words and names": "Use common words."
- Why: "seed" is jargon, "obtain their approval" differs from the project's "the owner's yes", and the comment mixes the owner's words with "their".
- Rewrite: "Fill-in guide for this optional file. Ask the owner whether to use it. If the owner says yes, replace the title and each angle-bracket prompt with what the owner says, show the owner the result, and delete this guide once the owner says yes. If the owner says no, remove the file. Do not guess the owner's preferences."

Low findings: 2. Examples: line 1, the title `<Owner-defined working style>` is a prompt, not a name a reader can find; line 15, the heading "Judgment and initiative" could be "When to act and when to ask".

### `assets/settings/codex-hooks.{local,notion,hindsight}.json`, `description`

**Line 2 of each, Medium (exact string)**
- Text: "Toolkit V2 hooks for this project in Codex: Current State at session start, a memory reminder when the owner uses a keep or decision phrase, a work item reminder after each commit, a work item reminder when a helper agent starts or reports back, and a check of the project's records after each file edit."
- Breaks: "Words and names": "Be specific." and "Sentences": "Never cut a prose sentence down to a label and a colon."
- Why: The list does not say that the message hook also prints a skill check and the owner's rule on every message, and "Current State at session start" has no verb.
- Rewrite: "Toolkit V2 hooks for this project in Codex. At the start of a session, the first hook prints the project's Current State. On every message from the owner, the second hook reminds the agent to check the project's skills, prints a hint when the message has a keep or decision phrase, and prints the owner's rule for every request. After each commit, the third hook reminds the agent to update the work item. When a helper agent starts or reports back, the fourth hook gives the same reminder. After each file edit, the last hook checks the form of the project's records." (The three files hold the same text; the sentence about the owner's rule is true of all three.)

## Patterns

1. **Four names for the project's main folder, and nine different definitions.** The same folder is called "main checkout" 81 times, "the project's main folder" 13 times, "main project folder" 3 times, and "main folder" 2 times. Nine files define it (the first path that `git worktree list` prints) in nine different sentences, and seven files define "worktree". Examples: `filechanges/SKILL.md:12` ("the project's main folder"), `pull-latest/SKILL.md:68` ("The main project folder is updated"), `AGENTS.md:39`. The word list says to use "main checkout" only. Because a skill may rely on the root `AGENTS.md`, one definition there, used by name everywhere, would shorten nine files.
2. **A step that is a label and a fragment.** Steps in `braindump` (5), `session-summary` (4), `pull-latest` (3), `handoff` step 3 (5 kinds), `reset-to-remote` (1) start with a bold label and continue with a fragment such as "Each with a recommended answer where you have one." Examples: `braindump/SKILL.md:22`, `session-summary/SKILL.md:16`, `pull-latest/SKILL.md:38`. The standard: "Never cut a prose sentence down to a label and a colon."
3. **"on its own" as an idiom for "in a separate step".** 11 times in 8 files. Examples: `merge-and-clean-up/SKILL.md:16`, `publish-docs/SKILL.md:16`, `reset-to-remote/SKILL.md:26`. A reader cannot tell whether it means alone, in a separate tool call, or without `&&`. One sentence in the root `AGENTS.md` or one wording used in all eight files would fix it.
4. **The same Codex sandbox paragraph in five files with different wording.** `merge-and-clean-up` line 217, `publish-docs` line 166, `pull-latest` line 86, `reset-to-remote` line 93, and `shared-repository-work.md` line 16. Each has four to five sentences about `.git/` being read-only, escalated permissions, and what to do when Codex refuses. A change to one must be made in five places. (The skills cannot share a file, so the fix is one agreed wording copied from a source, as `dev/build-shared/` does for other text.)
5. **A procedure or a rule hidden in a table cell or an unrelated section.** `AGENTS.md:150` (status procedure), `AGENTS.md:79` (`working-files/` rules in a cell of 90 words), `delivery/AGENTS.md:24-28` (field lists of 8 to 11 items in one cell), `reset-to-remote/SKILL.md:82-88` (required plan lines in "Mistakes to avoid"), `publish-docs/SKILL.md:37` (the gate for the whole skill at the end of step 1). The standard: "Put each kind of content where its reader will look for it."
6. **"Keep this guide." with no reason.** 11 files (the 8 system templates, `DECISIONS.md`, `sources/README.md`, and `reference/outside-docs/INDEX.md`). All the guides sit in HTML comments, which a rendered view hides, so a person who opens `DECISIONS.md` in a viewer sees only "No entries yet" and not the rules. Question for the owner: should the rules for `DECISIONS.md` be visible text?
7. **The closing line of a reply is described seven ways.** "the exact words the owner can say to start the next step" (`reset-to-remote:78`, `pull-latest:74`), "the exact words that continue" (`merge-and-clean-up:213`), "exact words that continue" (`publish-docs:98`), "the words that continue the work" (`cite-recalled-knowledge:8`, `plain-english:17`). The output style also says "Stop after the answer" (finding at `plain-english.md:15`).
8. **Idioms that mean an ordinary thing.** "holds" for "contains" (19 uses, for example "the main checkout holds the save", `publish-docs`, `filing-project-records`, `filechanges`), "yours" for "reserved for you" (`filing-project-records/SKILL.md:55`, `file-source.md:20`), "hold back" (`handoff/SKILL.md:15`), "proved itself" (`AGENTS.md:118`), "stand above" (`filechanges/SKILL.md:35`). The standard: "Name the thing directly. Do not replace its name with a metaphor, idiom, or joke."
9. **"save" means two things.** In `filing-project-records` and `publish-docs` it means commit to the default branch; in `file-source.md:37`, `handoff`, and the root `AGENTS.md` it means write to a file or a work item. Examples: `file-source.md:37`, `handoff/SKILL.md:31`, `AGENTS.md:116`.
10. **Words for the owner.** `plain-english.md` says "the user" 7 times and "chat replies" once; `filechanges/SKILL.md:31` says "himself". The word list says "the owner" and "session".

## Layout

### `AGENTS.md` (root; P1 in flight)

Headings as they are, in order: `AGENTS.md`; `<Project name>: agent guide`; Your job as the agent; Every session; Project map; Where information goes; Ask the owner first; Which skill; Commands; How to write replies.

Proposed headings, in order:
1. `<Project name>: agent guide` (with a short paragraph that says what the file is and what "Toolkit V2" is)
2. Your job as the agent (the owner's text, unchanged)
3. At the start of a session and on every message (was "Every session"; the heading now says when it applies)
4. Where information goes
5. How to find what was decided before (split from the paragraph that ends "Where information goes")
6. Ask the owner first
7. Which skill
8. When the owner asks where the project stands (the procedure from the cell on line 150)
9. Commands
10. How to write replies
11. What each file and folder holds (was "Project map"; the long reference table moves last)

"Ask the owner first" points to files that the file table marks "Only with the owner's yes", so add a pointer to heading 11.

### `.claude/skills/pull-latest/SKILL.md`

As they are: Pull the latest from the remote; Steps; Mistakes to avoid; Work that another skill does. Proposed: Pull the latest from the remote; Steps (with step 1 "Look first", step 2 "Find the default branch", step 3 "Fetch", step 4 "Update the main checkout from your own worktree", then the existing steps 3 to 5 renumbered); Mistakes to avoid; Work that another skill does.

### `.claude/skills/publish-docs/SKILL.md`

As they are: Commit project documents to the default branch; Names used in the commands; Steps; Refused files; Carrying an edit across; The main checkout; Mistakes to avoid; Work that another skill does; References. Proposed: add "When to use this skill" after the opening; split step 2 into "Look first" and "Find the default branch".

### `delivery/AGENTS.md`

As they are: Folders; The form of a record; Status values; What must stay true; Which skill to use. Proposed: Folders; What a record holds (one list per record type, in place of the table); Status values; Rules that always apply (was "What must stay true"); Which skill to use.

### `sources/AGENTS.md`

As they are: Files; The form of a row in the list; A source kept outside Git; What must stay true; Which skill to use. Proposed: Files; What a row in the list holds; Where to keep a source: in this folder or outside Git; Rules that always apply; Which skill to use.

### `.claude/rules/keep-work-item-current.md`

As they are: the intro; The work item's Current state; Questions and decisions; Approvals; Before you stop. Proposed: the intro; Keep the Current state true; Save the owner's requirements and corrections; Keep the owner's approval when the State changes; Before you stop (each heading names its instruction).

### `.claude/skills/session-summary/SKILL.md`

As they are: the opening and numbered steps 1 to 5; Mistakes to avoid; One row per request; Status words; Example; Work that another skill does. Proposed: put "One row per request" before "Steps" (step 1 refers to it with "see"), and keep the rest in order.
