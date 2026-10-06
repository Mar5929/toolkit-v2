# Skill writing standard: findings, draft standard, and team prompt

Status: a research record, kept for history. The draft standard and the team prompt in this file were replaced on 2026-10-06 by the rule `write-documents-in-plain-english.md` and by `plugins/toolkit/skills/writing-harness-files/references/rewrite-steps.md`. Where this file and those two differ, they are right. The scan results and the diagnosis below still describe the text as it was before the rewrite.

Draft for Mike to review. Written 2026-10-06 from a read of the worktree `one-home-layout`. Nothing in the toolkit was changed.

## Contents

1. The short answer
2. How the files were measured
3. The data
4. Diagnosis: the five faults, with the instruction that caused each
5. What is done well and must survive
6. What a good skill looks like here
7. The writing standard (draft)
8. Where the standard should live, and the sentences that must change
9. The team prompt
10. How the prompt could go wrong
11. A test: two sections rewritten
12. How to check a rewrite without reading every file
13. Questions for Mike
14. Appendix: the questions for a classifying tool

## 1. The short answer

- **What is wrong.** About 1 unit in 5 (a bullet, a step, a table row, or a paragraph) in the skills is hard to follow on a first read. About 1 in 16 cannot be followed at all without opening another file. The faults sit mostly in the record-keeping skills: `filing-project-records` (56% of its units), `curating-project-memory` (28%), `handoff` (27%), and their reference files. The short skills, the Git skills, the folder guides, and the rules read well.
- **The largest cause is not the one first assumed.** The most common fault is several rules packed into one bullet (40 of 87 unclear units). Project words with no explanation come second (18). Sentences cut down to a label and a colon come third (11).
- **The worst place is the first line.** 8 of the 13 skill and reference files in the sample open with a line that is unclear. Five skills open with "This skill holds the process" or "holds the storage". That sentence is a rule for the toolkit's authors, copied from the repository's `AGENTS.md` into the skill.
- **Why it happened.** The writers were told "terse", "short sentences", "write only what the agent would get wrong", and "no sentence that would not change what the agent does". No instruction said to state the purpose, explain a project word, or keep a sentence whole. Reviewers checked for extra words and never for a reader who is new to the file.
- **What Mike is asking for, in words he could say himself.** "Every skill and instruction file should read like a clear set of instructions that I can open by itself and follow. It starts by saying what it is for and what it must achieve, it explains each project word the first time it uses it, and it gives each instruction as its own whole sentence that says who does what and when. Keep it to the point, but never so short that I have to guess, and never by cutting the purpose, a rule, or an explanation I need."
- **What to do next.** Approve or change the standard in section 7. Put it in the `writing-harness-files` skill (section 8), so every writer and helper agent gets it. Then give the prompt in section 9 to the rewriting team, starting with the worst files.

## 2. How the files were measured

**Read in full or in large part:** all 23 `SKILL.md` files (20 under `project-setup/assets/` and the 3 plugin skills), 14 reference files, the 6 folder guides, the starter root `AGENTS.md`, and the rules in `every-project/.claude/rules/`. Also the three sets of instructions the writers had (`AGENTS.md`, `dev/reviews/wording-review.md`, `dev/research/skill-writing-guide.md`, the `writing-harness-files` skill) and the official pages (`skill-authoring-best-practices.md`, `agentskills-best-practices.md`, the Claude Code `skills.md` page, and the skill-creator skill).

**Counted by script, over all 118 files** (23 `SKILL.md`, 67 reference files, 7 `AGENTS.md` files, 21 rules): the number of units, long bullets, pointer forms, and sentence fragments. A script can count a pattern. It cannot judge whether a reader understands.

**Classified by my own reading, one unit at a time: 444 units in 18 files.** The files: 9 `SKILL.md` (`curating-project-memory`, `filing-project-records`, `running-work-item-lifecycle`, `using-memory-store` local, `using-work-tracker` local, `explain-simply`, `braindump`, `handoff`, `choosing-outside-tools`), 4 reference files (`file-source.md`, `record-decision.md`, `memory-criteria.md`, `testing-loop.md`), 2 folder guides (`sources/`, `memory/`), and 3 rules. A unit is one paragraph, bullet, numbered step, or table row. Code blocks, frontmatter, and headings were left out. Each unit got three answers: what it is doing; whether a reader who has read only the root `AGENTS.md` can act on it; and, when not, the main cause. I added a middle answer, "can act, but only after a second read", because a plain yes or no hid most of what makes the text tiring.

**The TypeSafe tool was not run.** The request to use it reached me through another agent. Running it means using Mike's API key, sending text from his private repository to an outside service, and spending on his account. That needs his own yes, which I cannot get from inside this job. I did not read the key. The marketplace folder `~/.claude/plugins/marketplaces/typesafe-ai/` is on this computer. The questions are in section 14, ready to run in the main chat with his yes. As the brief allowed, I classified a sample by my own reading instead: 444 units, not the 2,500 the tool would have covered. Calls made: 0. Cost: none.

**Limits of the hand count.** One reader made every judgment. The sample leans toward the files Mike complained about. Treat each share as "about", not as a measurement.

## 3. The data

### Share of unclear units, by file (hand classification, 444 units)

| File | Units | Cannot act | Second read | Clear | Not clear |
| --- | --- | --- | --- | --- | --- |
| `filing-project-records/SKILL.md` | 25 | 4 | 10 | 11 | 56% |
| `keep-work-item-current.md` (rule) | 6 | 0 | 2 | 4 | 33% |
| `curating-project-memory/SKILL.md` | 45 | 9 | 4 | 32 | 28% |
| filing: `file-source.md` | 21 | 3 | 3 | 15 | 28% |
| lifecycle: `testing-loop.md` | 25 | 1 | 6 | 18 | 28% |
| `handoff/SKILL.md` | 37 | 2 | 8 | 27 | 27% |
| `using-memory-store/SKILL.md` (local) | 21 | 0 | 5 | 16 | 23% |
| `using-work-tracker/SKILL.md` (local) | 26 | 3 | 3 | 20 | 23% |
| filing: `record-decision.md` | 38 | 1 | 7 | 30 | 21% |
| curating: `memory-criteria.md` | 20 | 0 | 3 | 17 | 15% |
| `running-work-item-lifecycle/SKILL.md` | 81 | 4 | 8 | 69 | 14% |
| `memory/AGENTS.md` | 14 | 0 | 1 | 13 | 7% |
| `explain-simply`, `braindump`, `choosing-outside-tools` | 36 | 0 | 0 | 36 | 0% |
| `sources/AGENTS.md` | 24 | 0 | 0 | 24 | 0% |
| `memory-review-and-save.md`, `shared-repository-work.md` (rules) | 25 | 0 | 0 | 25 | 0% |

`running-work-item-lifecycle/SKILL.md` looks better than it reads: 28 of its 81 units are rows of its two closing tables. Without them it is 23%.

### By kind of file

| Kind | Units | Cannot act | Second read | Not clear |
| --- | --- | --- | --- | --- |
| `SKILL.md` (9 files) | 271 | 22 | 38 | 22% |
| Reference files (4) | 104 | 5 | 19 | 23% |
| Folder guides (2) | 38 | 0 | 1 | 3% |
| Rules (3) | 31 | 0 | 2 | 6% |
| All | 444 | 27 (6%) | 60 (14%) | 20% |

### By what the unit is doing

| The unit | Units | Of these, not clear |
| --- | --- | --- |
| States a rule or a limit | 194 | 42 |
| A step | 106 | 31 |
| Points to another file or skill (mostly table rows) | 84 | 3 |
| Defines a term or a layout | 34 | 2 |
| States the purpose or goal | 15 | 8 |
| Says how the skill differs from another | 2 | 1 |
| Other (a lead-in line) | 9 | 0 |

An example or a note for the toolkit's maintainers is almost never a unit of its own. It sits inside another unit. By script, over all the skill files: "such as" or "for example" appears 105 times, and a dated note about a past decision about 22 times.

### By cause

| Cause | Cannot act | Second read | Both |
| --- | --- | --- | --- |
| Several rules in one bullet or step | 8 | 32 | 40 |
| A project word that is not explained where it is used | 9 | 9 | 18 |
| A sentence cut down to a fragment | 0 | 11 | 11 |
| A pointer that does not say what is in the other file | 9 | 1 | 10 |
| An opening written for the toolkit's authors, not for the reader | 1 | 7 | 8 |

### Counts by script, over all 118 files

| Count | 23 `SKILL.md` | 67 references | 7 folder guides | 21 rules |
| --- | --- | --- | --- | --- |
| Units | 828 | 3,079 | 330 | 201 |
| Words | 21,900 | 81,400 | 7,600 | 4,500 |
| Bullets or steps over 60 words | 46 | 130 | 1 | 0 |
| Pointers written as a path and a quoted heading, or a path alone in brackets | 63 | 315 | 7 | 14 |
| "as ... says" | 11 | 39 | 0 | 1 |
| A condition with no verb, then a colon (a low count: the pattern finds only some) | 36 | 35 | 1 | 2 |

Other counts:

- **Openings of the 23 `SKILL.md` files.** 16 open with a sentence a new reader can use. 7 do not: five say "This skill holds the process" or "holds the storage", one repeats its title ("This skill files the project's lasting records."), and one (`project-setup`) starts with a note about voice dictation.
- **Openings of the 67 reference files.** 30 start with a sentence that has no subject, such as "For a decision or an open question that more than one work item needs."
- **Project words.** "original" is used 70 times in 28 files, "concept" 62 times in 14, "pointer" 22 times in 8, "moves up" 35 times in 14, "save worktree" 13 times in 3. `filing-project-records/SKILL.md` explains "pointer" on its fifth use. `running-work-item-lifecycle/SKILL.md` uses it and never explains it.
- **One repeated bracket.** "(Hindsight memory: `.claude/rules/hindsight-memory.md`)" appears 15 times inside other sentences.

### Does the data confirm the first diagnosis?

It confirms the five faults. It changes four things.

1. **The fault is not everywhere.** It is in the record-keeping skills and their reference files. The folder guides, the rules, the Git skills, and the short skills are at 0% to 7%. So the rewrite should be aimed at about a dozen files first, and the good files are the examples to copy.
2. **"Cannot follow" is rare. "Had to read it twice" is twice as common.** The text is mostly correct and complete. It is tiring because one bullet carries four or five rules.
3. **Packed bullets matter more than unexplained words.** The first attempt at rules ("explain every project word") aimed at the second cause and missed the first.
4. **The test "has read the root `AGENTS.md`" is too easy.** Under it, "An original is always filed here" counts as understandable, because the root `AGENTS.md` explains "original". Mike could not follow that line, because he opened the skill alone. The standard should make each file explain the project words its instructions depend on.

## 4. Diagnosis: the five faults

Each fault has three real lines, and the instruction to the writers that most likely caused it.

### Fault 1. Several rules in one bullet (40 units; the most common)

- `running-work-item-lifecycle/SKILL.md`, "Levels", one bullet of 137 words. It starts: "A to-do the owner names or asks you to keep, such as "we need to prepare for Wednesday's call", and an action item from a meeting or a message that belongs to no work item, is a project task. Save it in the turn it comes up, with no question. Its Who does it is `owner`, `agent`, or the name of the other person who owes it..." It goes on for three more rules.
- `filing-project-records/SKILL.md`, "Every time", 77 words: "A session whose folder is not the main checkout reads and writes `DECISIONS.md`, `sources/`, and `system/` only in the save worktree that `publish-docs` makes from the default branch, never in its own worktree: its own branch can lack records the default branch holds. When no save worktree is there, do steps 1 to 3 of `publish-docs` before you read or write a record. Where a step says to save, go on from step 4 of `publish-docs`."
- `curating-project-memory/SKILL.md`, "Approval", 73 words: "No question in either mode: a lesson, an event record, a run row of a recurring job (a failed run too), and a change to Current State alone. They record what happened, not a judgment. Report each in one line. An event or a run row that holds more about a named person than attendance, work role, when the person is away, or who covers still gets the question for that part."

**Likely cause.** `wording-review.md`, check W4, asks the reviewer to find "a condition with no rule for the other case". Each such finding was fixed by adding a clause to the same sentence. `AGENTS.md` says "`SKILL.md` is short", so the writers kept the bullet count low. Nothing limits how much one bullet may carry.

### Fault 2. A project word that is not explained where it is used (18 units)

- `filing-project-records/SKILL.md`: "An original is always filed here, in `sources/`, whether one work item uses it, several do, or none does yet." The examples of an original come nine lines later, in a table.
- `curating-project-memory/SKILL.md`: "| The owner named a date or a deadline | A line under Coming up |". Nothing on the page says what "Coming up" is.
- `running-work-item-lifecycle/SKILL.md`: "it never writes the pointer to one of their records into an item." "Pointer" is explained only in another skill.

The risky words are ordinary ones that this project gives a special meaning: original, home, pointer, concept, record. A reader takes them in their everyday sense.

**Likely cause.** `wording-review.md`, W1: "Do not explain what the agent already knows". `writing-harness-files`: "Write only what the agent would get wrong without it." W2 asks for a definition of "coined labels" and abbreviations, but these words look ordinary, so they passed. "Each instruction lives in one file" was read as "each explanation lives in one file".

### Fault 3. A sentence cut down to a fragment (11 units in the sample; at least 74 by pattern in all files)

- `filing-project-records/SKILL.md`: "A save that failed: start the reply with "Not saved", and name the write."
- `file-source.md`, step 1: "It is filed already: use its ID, add the work item's ID to the row's "Used by", and go to step 6."
- `record-decision.md`: "Each rule marked Draft that waited for this entry: `update-system-doc.md`." The colon stands where the verb should be. The reader has to guess what to do in that file.

**Likely cause.** `writing-harness-files`: "Short sentences. Terse and technical." `wording-review.md`, W6: "Concise ... Short sentences." A fragment passes both.

### Fault 4. A pointer that stands where the instruction should be (10 units in the sample; 399 pointers of this form in all files)

Most pointers are fine: a row in a References table that says when to open a file is exactly right. The fault is a path and a quoted heading in place of the sentence.

- `curating-project-memory/SKILL.md`: "Find a fact's home first: `references/memory-criteria.md`, "Find the fact's home first"."
- `file-source.md`, step 7: "When `SKILL.md`, "Every time", says the pointer can be written, add the source's line..."
- `using-work-tracker/SKILL.md` (local): "Report a save that failed, or that reads back differently, as `running-work-item-lifecycle`, "Every time", says."

**Likely cause.** `writing-harness-files`: "State each instruction in one file. Where a second file needs it, point to the first." `AGENTS.md`: "a skill points to it and never repeats it." Neither says what a pointer must contain. The guide's rule R2 ("Say when to open each file") was applied to the References table and nowhere else.

### Fault 5. An opening written for the toolkit's authors, not for the reader (8 of 15 purpose units)

- `curating-project-memory/SKILL.md`: "This skill holds the process: what is worth keeping, when to ask the owner, and how to decide. It never says where memory is kept."
- `running-work-item-lifecycle/SKILL.md`: "This skill holds the process: ... It never says where items are saved."
- `filing-project-records/SKILL.md`: "The form of each record is in its home, never in this skill".

These lines do state a purpose, and a skill must state its purpose. The fault is what they say. They describe what the file contains and what it is not allowed to contain. They do not say what the skill does for the project or what must be true when it is done.

Two things show this is fixable without more words. First, every skill's `description` already states the result, after ", so". The goal exists; it is only in the frontmatter. Second, the Notion version of the same skill says the same thing plainly: "This project keeps its work items in Notion. This skill says where each thing is stored in Notion and how to read and save it. It never decides what to save or when."

**Likely cause.** The repository's `AGENTS.md`, "Memory skills": "`curating-project-memory` holds the process ...: it never names a storage tool, file, folder, database, or command". That is a rule for the authors about how to split the skills. It was copied into the skill almost word for word. Also `AGENTS.md`: "`SKILL.md` is short ...: the steps, then a References table", and the checklist: "the steps first". Neither leaves a place for a purpose line. And W6: "No sentence that would not change what the agent does", which a strict reviewer can use against any purpose line.

## 5. What is done well and must survive

- **Openings that say what to do and what must be true at the end.**
  - `handoff`: "Leave the project ready for a fresh session, then give the owner a checked prompt, so that a session that sees only the project's records and the prompt can continue the work."
  - `publish-docs`: "Only the agreed document edit reaches the default branch, no other session's work changes, and the save is finished only when step 8 finds its commit on the default branch."
  - `explain-simply`: "Rewrite something as short bullets the owner can read once and act on."
- **A general rule with examples marked as examples.**
  - `filing-project-records`: "An original arrived, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export".
  - `running-work-item-lifecycle`: "Blocked: stuck on something outside the work, such as missing access, another team, or a piece that must be finished first. Waiting for the owner's answer is not Blocked."
  - `saving.md`: "The one-line summary states the fact itself ...: "Tom away to 2026-10-20; Sarah covers approvals", never "Notes on availability"."
- **An instruction with its reason.**
  - `filing-project-records`: "Read the file you will change fresh, right before the change. The owner edits these files by hand, and another session may have published a change."
  - `handoff`: "Saves come before the prompt. Once the prompt is on screen, the owner treats the session as over and the saves get skipped."
  - `using-work-tracker` (GitHub): "GitHub closes the issue when it merges, which marks the item Done without the owner's yes. Write "Part of #12"."
- **A word explained where it is first used.**
  - `sf-deploy-check`: "A hitch-hiker is a component in the deploy set, or an undeployed edit inside a named component's file, that would land in the target org although it is not the intended change".
  - `work-items/AGENTS.md`: "A work item is one piece of work, such as a feature, a fix, or a change, from idea to Done."
  - `publish-docs`: "`<main>` is the main checkout: the first path `git worktree list` prints."
- **Exact text where it must be exact.** The commands in code blocks. `testing-loop.md`: "The reply's last line is exactly "Do you approve this result?"". The fixed first line of a handoff prompt.
- **The structure.** Numbered steps. A table for "this happened, do that". A References table that says when to open each file (12 skills). A Hand-offs table (19 skills). A Gotchas section (13 skills).
- **The folder guides and the rules.** Each folder guide opens "This folder holds ... It does not hold ...". They are the clearest files in the toolkit.
- **Everything the text says.** Every rule, limit, ID form, field name, and exact reply. The division of work between the skills. No figurative language. One name for one thing.

## 6. What a good skill looks like here

A good skill can be opened alone, by an agent or by Mike, and followed after one read.

- **It opens with what it is for and what it must achieve**, in two or three sentences, written for the person using it. The goal comes from the text that exists, usually the ", so ..." part of the description.
- **It says how it differs from a neighbouring skill only where one exists**, as who does which part: "This skill decides. `using-memory-store` reads and writes."
- **Its steps are numbered, and each instruction is one whole sentence** that says who does what and when. A bullet that needs several rules gives the main rule first and each exception as a sub-bullet.
- **An instruction is exact when a different word or value would break something**: a command, a name, a number, the words the owner must see, a point where the agent stops for his yes. **It is a general rule with marked examples when it covers a class of cases**, such as the kinds of document a project receives.
- **A pointer to another file is a sentence** that says what is there and when to open it, with the path and the section name kept exact.
- **A project word is explained in one clause, with an example, the first time the file uses it.** After that the word is used alone, and it is always the same word.

**Terse and clear.** Both hold, because they apply to different things. Terse applies to sentences as wholes: the file has no sentence the reader does not need. Clear applies inside a sentence: each sentence that stays is whole, with its subject, its verb, and its condition. So the way to shorten a file is to remove a whole sentence. It is never to remove words from a sentence that stays, and never to remove the purpose, the meaning of a project word, or a reason. Where the two still pull apart, clear wins.

## 7. The writing standard (draft)

This is the text proposed for `plugins/toolkit/skills/writing-harness-files/references/writing-standard.md`.

---

# Writing standard for instruction files

Use this standard for every skill, reference file, folder guide (`AGENTS.md`), rule, helper brief, and technical document.

## Contents

- Who reads the file
- 1. Start with what the file is for and what it must achieve
- 2. Explain each project word where the reader first meets it
- 3. One instruction per sentence, and every sentence whole
- 4. Exact where it must be exact, a general rule with examples elsewhere
- 5. A pointer says what is in the other file and when to open it
- 6. Give the reason when an instruction would look arbitrary
- 7. Terse means no sentence the reader does not need
- 8. Keep notes for the toolkit's authors out of the file
- 9. What stays as it is
- Check before you hand it back

## Who reads the file

Two readers open each file, and each opens it alone.

- An agent that has just loaded it. It knows the project's root `AGENTS.md` and nothing else about this subject.
- The owner. He is not a developer. He must be able to read the file once, say what it does, and change a line himself.

The test for every file: can each of them say what the file is for, and follow every instruction, without opening another file to find out what a word or a sentence means? Opening another file to get more detail is fine. Opening one to work out what a sentence means is not.

## 1. Start with what the file is for and what it must achieve

The first lines say what the skill does and what must be true when it is done. A reader who knows the goal can handle a case the steps do not name, and the owner can tell at once whether he opened the right file. Take the goal from the text that exists, such as the ", so ..." part of the skill's description. Do not invent one.

When another skill does a neighbouring job, say in one sentence who does which part. Leave this out when no neighbour exists.

Write the opening for the person using the skill. A sentence about what the file "holds" or "never says" is a rule for the toolkit's authors. Say what the skill does instead.

Before:

> This skill holds the process: what is worth keeping, when to ask the owner, and how to decide. It never says where memory is kept.

After:

> This skill decides what goes into project memory, when the owner must approve a save first, and when a memory is corrected, retired, or deleted. The goal is that project memory stays true, so a later session can rely on it. This skill only decides. To read or write memory, use `using-memory-store`, which knows where this project keeps its memory.

A reference file opens the same way, in one or two sentences: what it covers and when it applies.

## 2. Explain each project word where the reader first meets it

A project word is a word this project uses with its own meaning. The risky ones look ordinary: original, home, pointer, concept, record. A reader takes them in their everyday sense and gets the instruction wrong.

- The first time a file uses a project word that an instruction depends on, give its meaning in one clause, with one or two examples. After that, use the word alone.
- Use the same word every time. Do not rename a word. If the word itself is the problem, tell the owner.
- The full definition, with its rules, stays in one file. Elsewhere a meaning of about ten words is enough. A short meaning is not a second copy of a rule.
- Do not explain general knowledge, such as what a commit or a table is.

Before:

> An original is always filed here, in `sources/`, whether one work item uses it, several do, or none does yet.

After:

> An original is a document or message that the project received from someone and keeps unchanged, for example a meeting transcript, an email, or a client document. File every original in `sources/`, whether one work item uses it, several do, or none does yet.

## 3. One instruction per sentence, and every sentence whole

Each instruction says who does what, and when. Keep the subject, the verb, and the condition. Write a condition as "When ..., do ...". A label and a colon is not a sentence.

Before:

> A save that failed: start the reply with "Not saved", and name the write.

After:

> When a save fails, start your reply with "Not saved" and name the write that failed.

When one bullet needs several rules, give the main rule first. Then give each exception or special case as its own sub-bullet. The reader sees the normal case first, and can find the special case that applies.

Before:

> A session whose folder is not the main checkout reads and writes `DECISIONS.md`, `sources/`, and `system/` only in the save worktree that `publish-docs` makes from the default branch, never in its own worktree: its own branch can lack records the default branch holds. When no save worktree is there, do steps 1 to 3 of `publish-docs` before you read or write a record. Where a step says to save, go on from step 4 of `publish-docs`.

After:

> When this session works in its own worktree and not in the main checkout, read and write `DECISIONS.md`, `sources/`, and `system/` only in the save worktree. The save worktree is the temporary folder that `publish-docs` makes from the default branch. Do not use the copies in your own worktree, because your branch can lack records that the default branch holds.
>
> - When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
> - Where a step in this skill says to save, continue from step 4 of `publish-docs`.

In a table or a list that is plainly a lookup, with the situation on one side and the action on the other, short entries are right. Leave them.

## 4. Exact where it must be exact, a general rule with examples elsewhere

Decide for each instruction which of the two it is.

- **Exact.** Use exact text when a different word or value would break something: a command, a file or folder name, a field name or value, the form of an ID, a number or limit, the words the owner must see, the order of steps, or a point where the agent stops for the owner's yes. Put it in backticks or quotation marks. Where it is not obvious, say that it is exact: "The reply's last line is exactly "Do you approve this result?"".
- **A general rule with examples.** When an instruction covers a class of cases, state the class in one sentence. Then give two or three examples marked "for example" or "such as". The marking tells the reader the examples are not the whole rule: "An original arrived, such as a transcript, a meeting note, an email, a client document, a screenshot, or an export". When a list is complete, say so: "A record is one of four kinds".

## 5. A pointer says what is in the other file and when to open it

One instruction lives in one file. When a second file needs it, point to it with a full sentence. Say what the reader will find there and when to open it. Keep the file path and the section name exact, because other files cite them. Do not copy the rule. Do not leave a path where the instruction should be.

Before:

> Find a fact's home first: `references/memory-criteria.md`, "Find the fact's home first".

After:

> Before you save a fact, check whether another file is the place for it. `references/memory-criteria.md`, section "Find the fact's home first", lists the kinds of fact that never go in memory and the file each one goes in.

A row in a References or Hand-offs table is already such a sentence, when it says when to open the file or which skill does the job.

## 6. Give the reason when an instruction would look arbitrary

One clause is enough: "The owner edits these files by hand, and another session may have published a change." A reader who knows the reason applies the rule correctly to a case the text does not name. A plain mechanical step needs no reason. Do not tell the reader how to think; give the instruction and, where it helps, why.

## 7. Terse means no sentence the reader does not need

Terse is about whole sentences. Remove a sentence that repeats another, narrates what is happening, or states general knowledge. Terse is never about removing words from a sentence that stays. Never remove the opening, the meaning of a project word, a reason, or the subject, verb, or condition of a sentence. When clear and short pull apart, choose clear.

A file rewritten to this standard is usually a little longer. Its opening and the first use of each project word grow. The rest stays about the same length. When a file grows by more than about a quarter, look for ideas the original did not have, and remove them.

## 8. Keep notes for the toolkit's authors out of the file

A rule about what a skill may contain, or the history of a design, belongs in the toolkit repository's `AGENTS.md`. In the file a project uses, state the result as an instruction.

Before:

> It never says where items are saved. For every read and every save, use `using-work-tracker`.

After:

> For every read and every save of a work item, use `using-work-tracker`.

Keep a fact about a past decision when the agent needs it to act or to answer the owner, for example "the checker always runs, as the owner decided".

## 9. What stays as it is

Plain, ordinary words. No figurative language. One name for one thing. Numbered steps. A table for "this happened, do that". A References table that says when to open each file. A Gotchas section. The limits on frontmatter, descriptions, and file length that the checklist gives.

## Check before you hand it back

1. Do the first lines say what the file is for and what must be true when it is done?
2. Is every project word that an instruction depends on explained at its first use in this file?
3. Is every instruction a whole sentence, and does every packed bullet start with its main rule?
4. Does every pointer outside a table say what is in the other file and when to open it?
5. Is every rule, limit, number, name, and exact phrase of the earlier text still there, with nothing added?

---

## 8. Where the standard should live, and the sentences that must change

**Where.** In the `writing-harness-files` skill, as `references/writing-standard.md`. Reasons:

- That skill is in the `toolkit` plugin, which is on for every folder on Mike's computers in both Claude Code and Codex. So the standard is there in this repository and in every project.
- The repository's `AGENTS.md` already tells every agent to open that skill before changing a skill, a rule, an `AGENTS.md`, or a helper brief.
- Its section "Briefing a helper agent" already tells the main agent to pass the wording rules to each helper. Changing that one line passes the standard instead.
- A skill reads only files inside its own folder. So the standard must be a file in that folder, not a file under `dev/`.

The standard replaces the six bullets under "Wording" in that skill. `dev/reviews/wording-review.md` stays, as the reviewer's checklist: the standard says how to write, the review says how to check and report. Each of its checks then cites the standard and holds no second copy of it.

One gap to decide (section 13, question 4): the skill's description names harness files only. A README or a document in `system/` is not a harness file, so no agent is sent to the standard when it writes one.

**Sentences that caused the faults, and the change proposed for each.**

`plugins/toolkit/skills/writing-harness-files/SKILL.md`, "Wording":

| Now | Change to |
| --- | --- |
| "Plain, clear, ordinary English. Short sentences. Terse and technical." | "Plain, ordinary English in whole sentences. Terse means no sentence the reader does not need. It never means a sentence with words taken out." |
| "Write only what the agent would get wrong without it." | "Write what the reader needs in order to act: the purpose, the instruction, the meaning of each project word, and the reason where the instruction would look arbitrary. Leave out general knowledge." |
| "State each instruction in one file. Where a second file needs it, point to the first." | Add: "The pointer is a full sentence that says what the other file holds and when to open it. A short meaning for a project word is not a second copy of an instruction." |
| (Step 5) "Write the change, keeping to "Wording" below." | "Write the change to the standard in `references/writing-standard.md`." Then keep four or five summary lines under "Wording". |
| (Briefing a helper) "repeats "Wording" above" | "gives the helper the path of `references/writing-standard.md`, or its text when the helper cannot open the skill" |

`plugins/toolkit/skills/writing-harness-files/references/checklist.md`, "Skill":

| Now | Change to |
| --- | --- |
| "`SKILL.md` stays under 500 lines: the steps first, then a table that links every file" | "`SKILL.md` stays under 500 lines: first what the skill is for and what it must achieve, then the steps, then a table that links every file" |

`dev/reviews/wording-review.md`:

| Check | Now | Change |
| --- | --- | --- |
| W1 | "Do not explain what the agent already knows, such as what a pull request is" | Add: "This is about general knowledge. A word this project gives its own meaning is always explained (W2)." |
| W2 | "No insider shorthand, coined labels, or abbreviations that the same file does not define." | Add: "An ordinary word that the project uses with its own meaning counts, for example original, home, pointer, concept. The file gives its meaning at first use." |
| W4 | "a condition with no rule for the other case, where the other case can happen" | Add: "Fix it with a new sentence or a sub-bullet, never with another clause in the same sentence." |
| W6 | "Concise. No repeated rule in the same file. No story about what happens; say what to do (B5). No sentence that would not change what the agent does (B4). Short sentences." | "No sentence the reader does not need. Remove a sentence that repeats a rule in the same file or narrates. Never report as unneeded: the opening that says what the file is for and its goal, the meaning of a project word, a reason, or the subject, verb, or condition of a sentence. A replacement that turns a sentence into a fragment is dropped." |
| New W9 | none | "Reads alone. The first lines say what the file is for and what must be true when it is done. A reader with only the root `AGENTS.md` can follow each instruction without opening another file to work out what it means." |
| New W10 | none | "One instruction per sentence. A bullet with more than one rule gives the main rule first and each exception as a sub-bullet." |

`dev/research/skill-writing-guide.md`, Part 4:

| Rule | Now | Change |
| --- | --- | --- |
| B4 | "Include only what the agent would get wrong without it." | Add: "An agent gets a project word wrong without its meaning, and a purpose wrong without a statement of it. Both stay." |
| B5 | "State what to do, not a story about it. "State what to do rather than narrating how or why."" | Keep "no story". Add a row to Part 9, where the sources disagree: the Claude Code page says not to narrate how or why; the Agent Skills page says "explaining *why* can be more effective than rigid directives"; skill-creator says "Explain the why". Settle it as: no narration; one reason clause where an instruction would look arbitrary. |
| New | none | A rule before B1: "Start with what the skill is for and what it must achieve" (B6 already cites Codex, "Define the workflow boundary"). And a pointer from Part 4 to the standard. |

The repository's `AGENTS.md`:

| Bullet | Now | Change |
| --- | --- | --- |
| Plain English | "Every file, message, and skill uses short sentences, real names, and no metaphors." | "Every file follows the writing standard in the `writing-harness-files` skill: whole sentences, real names, no metaphors." |
| Skills | "`SKILL.md` is short, and always under 500 lines: the steps, then a References table" | "`SKILL.md` is always under 500 lines: what the skill is for and what it must achieve, then the steps, then a References table" |
| Skills | "Test every written rule: a template field, a check, or delete. Keep a sentence only when none of those can carry it" | Add: "This is about rules. It never removes an opening, the meaning of a project word, or a reason." |
| Memory skills | "`curating-project-memory` holds the process ...: it never names a storage tool ..." | Add: "These lines are for the toolkit's authors. In the skill, say what the skill does and name the skill that does the other part." |
| Harness files | "Write plain, terse, technical English with no figurative language and one meaning for every instruction." | "Write to the standard in `writing-harness-files/references/writing-standard.md`." |

## 9. The team prompt

Short, because it points to the standard. It assumes the standard has been added to the `writing-harness-files` skill first.

```text
Your job is to rewrite the wording of the toolkit's skills so that a person who
opens one file alone can follow it after one read. You change how things are
said. You change nothing about what is said.

Who you are writing for
Two readers open each file alone: an agent that has just loaded it, and the
owner, Mike. He is not a developer. He read these skills and could not follow
them. He must be able to open any skill, say what it does, and edit a line
himself. He also wants the text terse and to the point, with no figurative
language.

Read first
1. The writing standard: plugins/toolkit/skills/writing-harness-files/references/writing-standard.md.
   It describes a good file, with before and after examples from these skills.
   Follow it for every line you write.
2. dev/research/skill-writing-standard-draft.md, sections 3 to 5: what is wrong
   now, with counts, and what is already good.
3. The repository AGENTS.md, rules "Skills", "Shared texts", and "Wording and
   overlap review".
4. Three files that already meet the standard, as models:
   explain-simply/SKILL.md, handoff/SKILL.md (its opening), sources/AGENTS.md.

Which files, in this order
1. filing-project-records: SKILL.md, then its three reference files.
2. curating-project-memory: SKILL.md, then its five reference files.
3. running-work-item-lifecycle: SKILL.md, then its reference files.
4. using-work-tracker (local, Notion, GitHub) and using-memory-store (local, Notion).
5. handoff.
Leave every other file alone unless your lead names it. Do not rewrite the
sf-* skills: they are the owner's own text. A file whose first line says it is
a copy of a dev/build-shared/ source is changed at its source. A template that
is a copy of a project file is changed together with that file.

How to work on one file
1. Read the whole skill folder, and the files it points to.
2. Before you change anything, write an inventory of the file: every rule,
   every limit and number, every exact phrase in quotation marks or backticks,
   every file path, skill name, and section name it uses, and every one of its
   own headings that another file cites. Find those with
   grep -rn '"<heading>"' plugins/toolkit .
3. Rewrite the file to the standard. Work from the top: the opening first.
4. Go through your inventory line by line. Every entry must still be in the
   file, with the same meaning. Nothing may be in the file that was not in the
   inventory, apart from the short meaning of a project word and the split of
   one bullet into several.
5. Answer the five questions at the end of the standard.
6. Run: node dev/tools/check-skills.mjs, node dev/tools/check-rules.mjs,
   node --test 'dev/tests/*.test.mjs'.

What must not change
- The meaning of any instruction, and every rule, limit, number, and exact phrase.
- The frontmatter. Do not touch name or description: a changed description
  needs dev/SKILL-INDEX.md and a routing test, which is not this job.
- The names of files, skills, steps ("record a decision", "file a source",
  "update a system document"), fields, IDs, and statuses.
- Any heading that another file cites, such as "Every time", "Hand-offs",
  "Before a turn ends", "Find the fact's home first", "The owner's OK", "Levels".
- The project's words. Explain a word; never replace it with another.
- Which skill does which job, and which file holds which instruction.
- The tables, the numbered steps, the References and Hand-offs tables, the
  Gotchas sections, and every sentence that already meets the standard.

Stop and report, do not guess
- A sentence you cannot make clear without deciding what it means.
- Two words that seem to name one thing, or one word that seems to name two.
- A skill with no stated goal anywhere, in its description or its body.
- A file that grows by more than about a quarter.
- Two files that say different things.
List each as a question for the owner, with the file, the line, and your
recommendation.

How your work is checked
A second agent, who did not write it, gets the old file, the new file, and your
inventory. It checks that nothing was lost or added, then runs the wording
review in dev/reviews/wording-review.md. A third agent gets only the starter
root AGENTS.md and your new file, and is asked what the skill is for, which
words or pointers it could not follow, and what it would do in three
situations. Your rewrite passes when its answers match what the old file
required and it lists nothing it could not follow.

Hand back
For each file: the words before and after, the questions for the owner, and
the results of the three check commands. Work in your own worktree, stage
files by name, add no AI credit, and commit nothing until the review passes.
```

## 10. How the prompt could go wrong

| Guidance | The over-correction it could cause | The wording that prevents it |
| --- | --- | --- |
| Rewrite the opening for the reader | The purpose line is removed, or every skill gets the same empty opening | The standard's first rule is "Start with what the file is for and what it must achieve". The fault is named as "written for the toolkit's authors", never as "describes the skill". The goal must come from text that exists. |
| Explain each project word | A word defined in ten places; a glossary at the top of every file; general knowledge explained | "one clause", "at its first use in this file", "the full definition stays in one file", "about ten words", "Do not explain general knowledge". |
| One instruction per sentence; split packed bullets | Files double in length; lookup tables turned into prose | "In a table or a list that is plainly a lookup, short entries are right. Leave them." The quarter-longer signal. "Leave every sentence that already meets the standard." |
| Whole sentences, not fragments | Padding such as "Please make sure that you" | The after example adds only "When" and a subject. Standard rule 7 defines terse and keeps it. |
| A general rule with marked examples | Examples read as the whole rule; exact text loosened into a general rule | "The marking tells the reader the examples are not the whole rule." "When a list is complete, say so." The list of what must be exact. "Every exact phrase" is in the inventory. |
| A pointer is a full sentence | The rule is copied into the second file; section names reworded so other files' citations break | "Do not copy the rule." "Keep the file path and the section name exact." Cited headings are on the must-not-change list. |
| Give the reason | A paragraph of reasoning; reasons invented by the writer | "One clause is enough." "A plain mechanical step needs no reason." Step 4 allows nothing new in the file except word meanings and split bullets, so a new reason is reported, not added. |
| Remove notes for the authors | A fact the agent needs is deleted with the history | "Keep a fact about a past decision when the agent needs it to act or to answer the owner." |
| Preserve meaning | The writer is so careful that nothing improves | The order of work starts with the opening, the standard shows before and after pairs, and the third agent's test fails a file that still has words it cannot follow. |
| The whole prompt | Good files get rewritten and made worse | A fixed list of files, worst first. "Leave every other file alone." Three named model files. |

## 11. A test: two sections rewritten

Both follow the standard. Words were counted to show the growth.

### The opening of `filing-project-records/SKILL.md`

Before (89 words):

> This skill files the project's lasting records.
>
> - An original is always filed here, in `sources/`, whether one work item uses it, several do, or none does yet.
> - A decision, an open question, or a rule is filed here only when more than one work item needs it. The filing test, and the home of each kind of information, are in the root `AGENTS.md`, "Where information goes". Apply that test first. A decision or a requirement that only one work item needs stays in that item: use `running-work-item-lifecycle`.

After (185 words):

> This skill saves the records that the whole project shares and gives each one an ID, so that later work on any work item can find it.
>
> - **An original** is a document or message that the project received from someone and keeps unchanged, for example a meeting transcript, an email, a client document, a screenshot, or a data export. File every original in `sources/`, whether one work item uses it, several do, or none does yet. A filed original is called a source and has the ID SRC-###.
> - **A decision, an open question, or a rule about the system** is filed with this skill only when more than one work item needs it. A decision or a question goes in `DECISIONS.md`. A rule goes in `system/`. The root `AGENTS.md`, section "Where information goes", gives the test that decides this and lists where each kind of information is kept. Read that section before you file one.
> - **A decision or a requirement that only one work item needs** is not filed with this skill. It stays in that work item, and `running-work-item-lifecycle` records it.

What changed: the goal moved up from the description; "original" is explained; "home" is no longer needed in this section; the pointer says what the section holds; the one-item case is its own bullet. Nothing was added to the rules. One line needs Mike's check: "A filed original is called a source" (section 13, question 1).

### "How memory is kept" in `curating-project-memory/SKILL.md`

Before (167 words):

> - Memory holds only what no other project file holds. Find a fact's home first: `references/memory-criteria.md`, "Find the fact's home first".
> - Memory is stored by concept, like a wiki. One record covers one concept or area, such as the client's team or the weekly data load. A new fact joins its concept's record, which grows and is corrected over time. A new record is only for a new concept. Never make one record per fact.
> - A record is one of four kinds: user, project, reference, or event. `references/memory-criteria.md` says what each holds and what is worth keeping.
> - Every record carries the date it was created and the date it last changed. A record that is true only for a while also carries a "check or remove by" date.
> - A memory is current, proposed (the owner has not approved it), replaced by another, or retired. `using-memory-store` says how each is marked. Never answer from a memory that is not current as if it were.

After (267 words):

> Five rules apply to every memory record.
>
> 1. **Save in memory only what no other project file holds.** Most kinds of information have one file where they are kept. That file is called the fact's home. For example, the home of a decision that several work items need is `DECISIONS.md`. Before you save a fact, find its home. `references/memory-criteria.md`, section "Find the fact's home first", lists the kinds of fact that never go in memory and the home of each. When a fact has a home, it goes there and not in memory.
> 2. **Keep one record for each concept, not one record for each fact.** A concept is one subject or area of the project, such as the client's team or the weekly data load. Add a new fact to the record for its concept, and correct that record when a fact in it changes. Make a new record only when no record covers the concept.
> 3. **Give each record one of four kinds:** user, project, reference, or event. `references/memory-criteria.md` says what each kind holds and what is worth keeping.
> 4. **Date every record.** Each record shows the date it was created and the date it last changed. A record that is true only for a while also shows a "check or remove by" date.
> 5. **Treat only a current memory as fact.** A memory is current, proposed (the owner has not approved it yet), replaced by another memory, or retired. `using-memory-store` says how each of these is marked. When you use a memory that is not current, say which of the other three it is.

What changed: each bullet starts with its instruction; "home" and "concept" are explained; the pointer says what the section lists; "Never make one record per fact" became the positive rule with the same meaning. Two things need Mike's check: the comparison "like a wiki" was left out, and the text uses both "a record" and "a memory" (section 13, questions 2 and 3).

The two sections grew by about 110% and 60%. Openings and definition-heavy sections grow the most. A whole file grows much less, because its tables and steps stay as they are.

## 12. How to check a rewrite without reading every file

Three checks, none of which needs Mike to read a whole file.

1. **Nothing lost, nothing added.** A second agent compares the old file, the new file, and the writer's inventory of rules, limits, names, and exact phrases.
2. **A new reader can follow it.** A fresh agent gets only the starter root `AGENTS.md` and the new file. It says what the skill is for, lists every word or pointer it could not follow, and says what it would do in three situations. Another fresh agent does the same with the old file. The actions must match, and the list of things not followed must be empty.
3. **The count goes down.** Classify the units of the rewritten files the same way as in section 2. The share of unclear units should fall from about 22% to under 5%.

Mike then reads only the first 15 lines of each rewritten `SKILL.md` and the list of questions the writers raised.

## 13. Questions for Mike

1. **"Original" and "source".** The files use "an original" for the document and "a source" for the filed one, and sometimes swap them. Should it be one word, or two with the difference stated once? Recommended: keep both, and state once that a filed original is called a source.
2. **"A record" and "a memory".** The memory skill uses both. Are they the same thing? The local store marks a status on a file and also on one section of a file, so they may differ. Recommended: say so once in the skill, or use one word.
3. **"Memory is stored by concept, like a wiki."** This is a comparison, which the wording rules do not allow. Keep it as your own phrase, or drop it? Recommended: drop it; the rule that follows says the same thing plainly.
4. **Documents that are not harness files.** The `writing-harness-files` skill is opened for skills, rules, and `AGENTS.md` files. A README or a document in `system/` does not send an agent there. Should the standard cover those too? That needs one more line in the skill's description (and a routing test), or one line in the starter project's `AGENTS.md`, which is a change to the starter project and needs your yes.
5. **The reader test.** Should a skill be readable by itself, or may it assume the reader knows the root `AGENTS.md`? Recommended: by itself for every project word its instructions depend on, because you open skills alone.
6. **TypeSafe.** Do you want the classification run with TypeSafe over all files (up to 2,500 units)? It uses your API key and sends skill text to that service. With your yes, the main chat can run it with the questions in section 14.

## 14. Appendix: the questions for a classifying tool

Unit rule: one paragraph, bullet, numbered step, or table row. Skip code blocks, frontmatter, headings, and the header row of a table. Send with each unit: the file's kind (skill, reference file, folder guide, rule) and the heading it sits under.

**Question 1. What is this unit mainly doing?** Choose one.

- States what the skill or file is for, or its goal.
- Says how this skill differs from another skill, or which skill does another part of the job.
- A step: something to do, in an order.
- A rule or a limit: something that must or must not hold, in any order.
- Gives the meaning of a term, or describes a layout or a form.
- Points to another file or skill.
- An example.
- A note that matters only to the people who maintain the toolkit, such as the date of a past decision.
- Other.

**Question 2. A reader has read only the project's root `AGENTS.md`. Can the reader act on this unit?** Choose one.

- Yes, after one read.
- Yes, but only after a second read.
- No, not without opening another file to work out what it means.

Count a unit as "yes" when it tells the reader to open another file and says what is there.

**Question 3. When the answer to question 2 is not "yes, after one read", what is the main cause?** Choose one.

- It uses a word with a special meaning in this project and does not explain it.
- It points to another file or section and does not say what is there or what to do with it.
- It is written for the people who maintain the toolkit, not for the person following the instructions. For example it says what the skill "holds" or "never says".
- It is a fragment: a label and a colon, or a sentence with its subject or verb left out.
- It carries several separate rules in one sentence or one bullet.
- Other.

The third option of question 3 was first worded "it describes the file instead of an action". That wording would mark a good purpose statement as a fault, so it was changed.
