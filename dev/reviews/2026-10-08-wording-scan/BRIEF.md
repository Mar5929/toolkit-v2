# Wording scan of the shipped instruction files: the brief for a reader

This brief is for a helper agent that reads one area of Toolkit V2 and reports where the text is hard to follow. You change no file except your own findings file.

## What the owner asked for

Mike, the owner, 2026-10-08: "I want a team of a few agents to scan through the whole toolkit shipped skills instructions files etc and make sure that the wording is clear, not too verbose, uses common English words, uses active tense, follows the document clarity standard, is written to be simple and easily understood by a stranger or someone that hasn't been a part of the chat sessions that designed the toolkit". He added: "Document layouts need to be organized and be clear and use ordinary language and just say what the section is about".

Your job is done when your findings file lists every place in your area where that goal is not met, with a rewrite for each, and a verdict for every file.

## Who the reader is

Read every file as a capable person, or an agent, who has never seen this project. This reader was in none of the sessions that designed it, does not know its history, and reads each file once. This reader knows general software terms such as "pull request" and "branch".

## Read these first

All paths start at the root of this worktree: `/Users/michaelrihm/Documents/Projects/toolkit-v2/.claude/worktrees/wording-scan`. Read every file from this worktree and from no other copy of the repository.

1. `plugins/toolkit/skills/project-setup/assets/every-project/.claude/rules/document-clarity-standard.md`. This is the one place for the writing rules, and it is your measure. Every finding names the line of the standard that the text breaks.
2. `dev/reviews/wording-review.md`. It holds checks W1 to W5 and examples of what counts.
3. `dev/reviews/word-list.md`. It holds the project words that are already decided. Do not report a word as unexplained when the list says to keep it and the skill explains it once.
4. `.claude/rules/evaluate-the-owners-request.md`. Every agent in this repository follows it. For this job it means: think about what serves the whole toolkit and its readers, not only the one line in front of you.

## How to read a file

Read the whole file before you judge a line. Then check it in this order.

1. The opening. Does the file say what it is for, and what must be true when its job is done?
2. The layout. Can the reader find a thing from the headings alone? Does each heading say plainly what its section covers? Does each section hold one subject? Are the sections in the order the reader needs them?
3. The words. Look for uncommon words where a common word would do, project words that are not explained, abbreviations that are not written out, and metaphors or idioms.
4. The sentences. Look for a sentence that does not say who acts, a sentence that gives the action before the condition, a sentence with three or more ideas, a string of nouns, and a pronoun that could mean two things.
5. What the reader does not need. Look for a sentence about how things used to work, a sentence about a session or a decision date that the reader cannot use, a sentence about the document itself, and a statement that the same file already made.
6. What is missing for a stranger. Look for a step that names a file, a field, or a tool without saying what it is or where it is, and an instruction that only makes sense if you know an earlier design.

## An earlier decision you must hold to

On 2026-10-06 the owner found the skill text "squeezed too short". So "not too verbose" means: leave out a sentence that the reader does not need. It never means removing words that a sentence needs, turning a sentence into a label, or removing the explanation of a project word. The standard says the same under "Paragraphs and sections". A rewrite you propose may be longer than the text it replaces when that makes it clear.

## What is a finding and what is not

A finding is a place where the reader described above would stop, read again, guess, or do the wrong thing, or a place that breaks a line of the standard.

These are not findings:

- A choice of taste, where the text is already clear.
- An exact string that a tool or another file reads, such as a field name, an ID form, a command, or text a hook prints and a test compares. When such a string is unclear, report it and mark it "exact string".
- A copy. Review the source only. The copies are: `plugins/toolkit/skills/writing-harness-files/references/writing-rule.md` (source: the standard), any file whose first line says it is a copy of a file under `dev/build-shared/`, and a skill template that `dev/SKILL-INDEX.md`, section 8, lists as a copy of a project file.
- The blank prompts in a template.

These texts are the owner's approved words. Report a problem in one as "question for the owner", and propose no rewrite: `document-clarity-standard.md`, `evaluate-the-owners-request.md`, the section "Your job as the agent" in the starter root `AGENTS.md`, the body of the skill `sf-architect-solutioning`, `salesforce-org-safety.md`, and any quotation of the owner.

Four files are being changed on another branch right now: the output style `plain-english.md`, the starter root `AGENTS.md`, and `lifecycle-rules.md` and `refining-requirements.md` of `managing-work-items`. Review them as they are here, and add "(P1 in flight)" to each finding in them.

## How serious a finding is

- High: the reader would likely do the wrong thing, or cannot follow the text.
- Medium: the reader must read again or guess, and would then get it right.
- Low: the text is wordy or awkward, and the reader still understands it at once.

Report every High and Medium finding. For Low findings, give a count for the file and up to three examples.

## What to write

Write one file: `dev/reviews/2026-10-08-wording-scan/<your area name>.md`. Use this layout.

1. `# Wording scan: <area name>`
2. `## Files read`: a table with one row per file: the file, its verdict ("clear as it is", "small fixes", or "needs a rewrite"), the count of High, Medium, and Low findings, and the biggest problem in a few words. List every file you were given, also one you could not read, and say why.
3. `## Findings`: one entry per finding, grouped by file, most serious first. Each entry holds:
   - the file and line number, as `path:line`;
   - the text as it is, quoted, at most two sentences;
   - how serious it is;
   - the line of the standard it breaks, by section name and its first words;
   - why the reader described above would have trouble, in one sentence;
   - the rewrite you propose. The rewrite keeps every rule, limit, name, number, and exact string unchanged.
4. `## Patterns`: problems that repeat across the area, each with a count and three examples. A pattern is worth more than its single cases, so look for them.
5. `## Layout`: for each file whose layout needs work, the headings as they are and the headings you propose, in order.

Follow the standard in your own findings file.

## Limits

- Change no file except your findings file. Run no command that changes the repository, and no `git` command other than ones that only read.
- Do not start other agents.
- Do not open files outside your area, apart from the four files under "Read these first" and a file you must open to check what a pointer leads to.
- Your last message is a short report: the counts by seriousness, the five files that need the most work, the three strongest patterns, and anything you could not read or were unsure about. It carries no findings in full; those are in the file.
