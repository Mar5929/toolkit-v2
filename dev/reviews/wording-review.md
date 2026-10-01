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
- **W2 No jargon.** No insider shorthand, coined labels, or abbreviations
  that the same file does not define. An ID the file defines (Q-07, R-01) is
  fine.
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
    a few, several, often, long. Either define them in the same file ("large:
    has sub-items or more than two tasks") or point to where they are
    defined;
  - a pronoun (it, this, that, they, them) that could point to two things;
  - "or" that could mean one of them or both;
  - a condition with no rule for the other case, where the other case can
    happen;
  - a step whose order or trigger is unclear ("before merging": before
    which step?);
  - two lines, in this file or elsewhere in the skill, that say different
    things.
- **W5 Judgment on purpose.** Where the agent should decide, the text says
  so and says what to weigh: "Use your judgment: weigh X against Y." Text
  that leaves a decision open without saying so is a W4 finding.
- **W6 Concise.** No repeated rule in the same file. No story about what
  happens; say what to do (B5). No sentence that would not change what the
  agent does (B4). Short sentences.
- **W7 One name for one thing.** The same thing has the same name across the
  skill, the shared texts, and the model (Current state, Questions and
  Answers, work item, sub-item, phase, task). Two names for one thing, or one
  name for two things, is a finding (B12).
- **W8 What the agent says to the owner.** Text the skill tells the agent to
  say or write to Mike is at a middle-school reading level: short, plain, no
  file paths unless he needs one.

## How to report a finding

For each finding give:

- the file and line;
- the exact text;
- the check (W1 to W8);
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
