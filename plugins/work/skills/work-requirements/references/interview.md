# Interviewing the owner

How to run the requirements interview: what to read first, how to ask, how
to handle "grill me", resuming, and corrections. Everything the owner says
lands in the work item, never in a separate notes file.

## Contents

1. Aim at the outcome he wants
2. Before the first question
3. Asking
4. "Grill me" and "ask me questions"
5. Saving as you go
6. Resuming an interview
7. Corrections and changes
8. An example exchange

## 1. Aim at the outcome he wants

- Work toward the outcome the owner wants, not only the words he used. Read a
  rough answer in the context of that requirement's purpose and the rest of
  the system, and ask focused follow-up questions until the real intent is
  clear.
- Say so when an answer would undermine his own goal, conflict with a stated
  constraint, cause a problem elsewhere, or when a clearly better approach
  exists. Name the concern, the tradeoff, and the direction you recommend,
  then let him choose. Once he has heard the concern and decided, do it his
  way.
- Never quietly replace what he said with what you inferred.
- Keep it light. Do not read every answer back for approval, do not challenge
  every answer, and do not start designing while the goal is still open.

## 2. Before the first question

Read, so no question repeats an answer:

- the item: Starting request, Agreed goal, every `R-xx`, Open Questions, and
  Notes > Resume here;
- the area's file in `requirements/`, and `requirements/SYSTEM-DATA-MODEL.md`
  when data is involved;
- the area's file in `system-guide/`;
- project memory on the topic: `toolkit memory find '<topic>'`.

Ask only what the records and the code cannot answer.

## 3. Asking

- One question at a time, in the reply text, never through a question tool.
- Each question carries a recommended answer and a one-line reason, so the
  owner can confirm, correct, or redirect it.
- Settle upstream decisions before the ones that depend on them. Most basic
  first: who uses it, what they must be able to do, then the rules, then the
  exceptions.
- Follow contradictions and vague words ("fast", "easy", "secure") until
  they are resolved or recorded as open questions.
- The owner does not know: add an Open Questions row with who can answer, and
  go on with questions that do not depend on it. Offer a `researcher` when
  the fact can be found.
- He thinks out loud: let him. Save the settled parts as they come.
- Brainstorming methods from other plugins may run inside this skill. The
  answers still land in the work item.

## 4. "Grill me" and "ask me questions"

- "Grill me" means a deep interview: keep asking, one question at a time,
  until every branch that could change the result is covered.
- "Ask me questions first" means the interview comes before any build. It is
  not a batch of questions in one message.
- Near the end of every interview, ask: "What have we not touched that could
  change this?"

## 5. Saving as you go

Save each settled answer into the item before asking the next question. A
long interview fills the conversation; the item is the record that survives
a cleared context.

| He settles | Save it as |
| --- | --- |
| The goal ("So the goal is X?" and a yes) | The Agreed goal |
| A behavior, rule, or exception | An `R-xx` block (Status Refining) and, when it changes acceptance, the Acceptance list (`requirement-format.md`) |
| Something he cannot answer yet | An Open Questions row with who must answer; the item waits on him while one of his is open |
| An idea about how to build it | Notes > Solution options and considerations, linked to the `R-xx` |
| A lasting preference or lesson | A memory, through `memory-save` |

## 6. Resuming an interview

Read the item first. Continue from its Open Questions and Notes > Resume
here. Never start the interview again from the top.

## 7. Corrections and changes

- A correction to a requirement that is not yet approved needs no separate
  confirmation: apply it. Check the requirements and design it affects; ask
  only about consequences whose meaning is unclear.
- For a simple correction, say it in one sentence and ask only the next
  question that matters. Do not replay the whole item.
- A change to an approved requirement moves the item back to refinement and
  needs approval again. Keep the old wording in its Decision record.
- After stage 03, say what the change affects: the design, tasks already
  built, sub-items.
- Revisit Notes > Solution options and considerations when a requirement
  changes, so an old idea cannot quietly steer the design.

## 8. An example exchange

> Owner: Add a CSV export to the monthly report.
>
> Agent: So the goal is: anyone on the team can download the monthly report
> as a CSV file that opens in Excel? My recommendation is yes, with every
> column the report shows.
>
> Owner: Yes, but only managers.
>
> Agent (saves the Agreed goal, then R-01 "Managers can export the monthly
> report as CSV", Status Refining): Should archived rows be in the export? I
> recommend leaving them out, because the report hides them too.

The agent saved the goal and the first requirement before asking the second
question, and the second question carries a recommendation and a reason.
