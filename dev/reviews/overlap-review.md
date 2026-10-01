# Overlap review: the checklist for skill descriptions

Mike, 2026-09-30: "I want someone to be reviewing the skills to make sure,
again, all the descriptions make sense. There's no overlap that could trip
up an agent. We're trying to just keep things clean and clear."

A host picks a skill from its name and description alone (skill-writing
guide Part 1). So a separate agent runs this review whenever a description,
a skill name, or a routing line in the model's `AGENTS.md` is added or
changed, and once over all of them before each test stage. After any fix,
the routing test runs again in both hosts (`AGENTS.md`, "Skills").

## What to review

- Every description in `dev/SKILL-INDEX.md` and in each `SKILL.md`: all the
  skills `project-setup` ships, the model's Salesforce skills, and
  `project-setup` itself.
- The routing lines in the model's `AGENTS.md` (the model copy in
  `plugins/toolkit/skills/project-setup/assets/model/AGENTS.md`). They are
  Mike's text: a change there is a question for him.
- The machine-wide skills on Mike's Mac that compete (`dev/SKILL-INDEX.md`
  section 8).

## The principle: situation, not trigger words

Mike, 2026-09-30: "as the user, you can't expect me to remember all these
key trigger words, right? This should not just become sort of a matrix grid
of trigger words that I have to sort of remember ... we don't want to make
this a hard-coded nightmare of just trigger words."

- Mike talks normally and never learns special phrases. Two skills are told
  apart by the situation: the work item's stage, what its Current state says
  is open or waiting on him, and what he is doing right now. Never by one
  word only one skill may use.
- The owner phrases in a description are a few everyday examples that help
  the host match the request. They are never a list he must follow.
- A fix that only adds a trigger phrase, or makes Mike say an extra word, is
  not a fix. Rewrite it to name the situation, or drop it.

## The checks

- **O1 Shape.** What the skill does (a verb first), why (", so ..."), when
  ("Use when ..." with two to four of Mike's own phrases), and "Not for ...;
  use <skill>." only where a neighbor competes. Under 400 characters. A set's
  skills say which projects they are for.
- **O2 Makes sense.** A reader who knows nothing about Toolkit V2 can tell
  from the description alone what the skill does and when to use it. The
  wording passes `wording-review.md` W1 to W4.
- **O3 Phrase test.** Write at least 40 requests the way Mike says them,
  including voice-to-text slips (missing punctuation, a wrong word, a run-on
  sentence). For each, list every description it matches. A request that
  matches two skills in the same project, with no "Not for" line settling
  it, is a finding.
- **O4 Pairs.** For each pair of skills that share a verb, an object, or an
  owner phrase (for example "plan", "design", "done", "task", "memory",
  "status", "handoff"), check that both descriptions draw the same dividing
  line.
- **O5 Routing lines agree.** Each routing line in the model's `AGENTS.md`
  sends a phrase to the same skill its description claims, and no two lines
  claim the same phrase.
- **O6 Codex cut.** Codex shortens descriptions from the end when the list
  is long. The part that tells two neighbors apart comes early in each
  description.
- **O7 Mike's other skills.** A request that also matches one of his
  machine-wide skills (Notion plugin skills, todoist-cli, consolidate-memory,
  update-config, project-init, and the others in section 8) is listed with
  which one would likely win and why.
- **O8 Situation, not words.** Every dividing line between two skills names
  a situation the agent can see (stage, open question, what is waiting on
  the owner), per the principle above.

## How to report a finding

For each finding give the two skills, the request that matches both, why an
agent could pick either, and the exact new description text for each skill
you would change (whole description, under 400 characters, same shape).
A change to a model routing line is a question for Mike. Report nothing that
is only a matter of taste.

## How to verify a finding

A second agent checks each finding: is the overlap real for a request Mike
would plausibly say; does the new text settle it without opening a new
overlap with a third skill; does it keep the O1 shape and the 400-character
limit? A finding that fails any of these is dropped, with the reason.
