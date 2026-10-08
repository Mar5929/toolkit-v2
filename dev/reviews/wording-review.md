# Wording review: the checklist for skill text

Mike, 2026-09-30: "For any wording that we add within these skills, you need
to have a reviewer to make sure that it's plain, clear, concise, with no
jargon or figurative language. There shouldn't be anything that an agent
could interpret differently every time unless it's intended to be
interpreted differently every time."

A separate agent, not the one that wrote the text, runs this review on every
new or changed line in a `SKILL.md`, reference, template, example, helper
brief, or `dev/build-shared/` source. The writer fixes what it finds, and the
reviewer reads the fix again. Nothing is committed before the review passes.

Mike found the skill text hard to follow. On 2026-10-06 he agreed with this
statement: "The wording is the problem: it was squeezed too short, and it
uses project words without saying what they mean." The same day he read a
trial rewrite that kept a made-up word and put a definition in front of it,
and said: "Why did you feel like you needed to keep the word 'an original'?
Isn't there a better way to just rewrite? We need to look at the file as a
whole." The writing rules are in one file, the starter rule
`plugins/toolkit/skills/project-setup/assets/every-project/.claude/rules/document-clarity-standard.md`
(Mike, 2026-10-06: one place for the writing rules). The
`writing-harness-files` skill holds an exact copy,
`references/writing-rule.md`. This file says how to check and report. Read
the rule before you review. Where a check below and the rule differ, the
rule wins: report the check as a finding on this file.

## What to review

- Review only the text in scope: the changed lines, or the files named.
- A file whose first lines say it is a copy of a `dev/build-shared/` source
  is reviewed at its source, never at the copy.
- Mike's own words are not rewritten: the model project's files, the body of
  `sf-architect-solutioning`, and any quote of Mike. Report a problem there
  as a question for Mike.

## The checks

Each finding names one check.

- **W1 Plain words.** Use common words. Name a real thing by its exact name:
  the tool, command, file, field, or skill. Do not explain what the agent
  already knows, such as what a pull request is (skill-writing guide B4).
  This is about general knowledge. A made-up word that the file keeps is
  explained once (W2), and that explanation is never a finding.
- **W2 No jargon.** No insider shorthand, coined labels, or abbreviations
  that the same file does not define. An ID the file defines (Q-07, R-01) is
  fine. An ordinary word that the project gave a meaning of its own (a
  made-up word) counts, for example home, pointer, concept. A made-up word
  is a finding when plain words, or a name the reader can already see such
  as a folder name or a field name, would do. A made-up word that neither
  can replace is explained in one clause where the reader first meets it:
  once for a whole skill, normally in `SKILL.md` (the writing rule, "Words
  and names").
  The replacement for a word that other files also use comes from the
  shared word list (`AGENTS.md`, Rules, "Plain English").
- **W3 No figurative language.** No idioms, sayings, metaphors, jokes, or
  picture words that stand for a real thing. Examples: "flows up",
  "leaks", "surfaces", "lever", "under the hood", "bubble up", "in the loop",
  "own" meaning "be responsible for". Replace each with the plain thing it
  means.
- **W4 One meaning.** An agent reading the line twice must do the same thing
  both times. Look for:
  - vague words with nothing concrete named: properly, correctly,
    appropriate, as needed, if needed, when necessary, reasonable, sensible,
    good, clean, carefully, best practice, and the rest of the list in
    `VAGUE_RE` in `dev/tools/rule-lint.mjs`;
  - size and time words with no measure: large, small, big, recent, soon,
    a few, several, often, long. Either define them in the same file, point
    to where they are defined, or say that the agent judges and what it
    judges by (W5);
  - a pronoun (it, this, that, they, them) that could point to two things;
  - "or" that could mean one of them or both;
  - a condition with no rule for the other case, where the other case can
    happen. The fix is a new sentence or a bullet under the main rule,
    never another clause in the same sentence;
  - a step whose order or trigger is unclear ("before merging": before
    which step?);
  - two lines, in this file or elsewhere in the skill, that say different
    things.
- **W5 Judgment on purpose.** Where the agent should decide, the text says
  so and says what to weigh: "Use your judgment: weigh X against Y." Text
  that leaves a decision open without saying so is a W4 finding.
- **W6 Concise.** No sentence the reader does not need. Report a sentence
  that repeats a rule in the same file, or that tells a story about what
  happens in place of saying what to do (B5).
  - Never report as unneeded: the opening that says what the file is for
    and its goal, the explanation of a made-up word that was kept, a
    reason, or the subject,
    verb, or condition of a sentence.
  - A whole sentence is never a finding because a shorter fragment could
    replace it. A replacement that turns a sentence into a label and a
    colon is dropped.
- **W7 One name for one thing.** The same thing has the same name across the
  skill, the shared texts, and the model (Current state, Questions and
  Answers, work item, sub-item, phase, task). Two names for one thing, or one
  name for two things, is a finding (B12). So is a made-up word where plain
  words or a name the reader can already see would do (W2).
- **W8 What the agent says to the owner.** Text the skill tells the agent to
  say or write to Mike is at a middle-school reading level: short, plain, no
  file paths unless he needs one.
- **W9 Reads alone.** The first lines say what the file is for and what
  must be true when its job is done. A reader with only the starter root
  `AGENTS.md` can follow each instruction without opening another file to
  work out what it means. For a reference file of a skill, that reader
  also has the skill's `SKILL.md`. A pointer outside a table says what is in the
  other file and when to open it.
- **W10 One instruction per sentence.** Each instruction is a whole
  sentence that says who does what, and when. A bullet with more than one
  rule gives the main rule first and each special case on its own line.

## How to report a finding

For each finding give:

- the file and line;
- the exact text;
- the check (W1 to W10);
- for W4, the two ways an agent could read it;
- the exact replacement text, which keeps every fact, number, and rule of
  the original.

If the only fix changes what the text means, it is a question for Mike, not
a finding to fix. Report nothing that is only a matter of taste.

## How to verify a finding

A second agent checks each finding before it is fixed:

- Is the problem real, by the check it names?
- Does the replacement keep every fact, number, and rule?
- Is the replacement clearly better by this checklist, and does it pass
  every check itself?
- Does it contradict another line of the skill or a shared text?

A finding that fails any of these is dropped, with the reason.
