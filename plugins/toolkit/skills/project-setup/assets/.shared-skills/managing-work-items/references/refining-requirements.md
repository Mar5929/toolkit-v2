# Refining Requirements

Takes an item from a rough idea, meeting notes, or documents to requirements the owner approves. Every question is a row in the item's Questions and Answers, and every answer is saved the moment he gives it, so a later chat picks up at the first open question.

## The Requirements layout

Each requirement is one block, headed "Requirement <number>: <short name>". `tracking-work-items` gives the block's exact form in this project's tracker.

| Part | What goes in it |
| --- | --- |
| Original verbatim requirement | The words of the owner, or of the stakeholder or source that asked for it, word for word. Never reworded. When they are not the owner's words in this chat, name who said them and where. |
| Goal | What this requirement achieves, in one sentence. |
| Functional Requirements | A numbered list. Each line is one thing that must happen or be true, exact enough to check. It holds system behavior, process steps, business rules, and the data model. Who or what it applies to, and where it does not apply, are lines of this list. |
| Acceptance Criteria | A numbered list. Each line is one thing someone can observe to confirm the requirement is met. |

- Requirements are numbered 1, 2, 3 in the order they are added. Everywhere else (Questions and Answers, tasks, the design, reports), name a requirement in the short form `R-01`, which means "Requirement 1".
- The item's goal is the goal in its Overview, together with each requirement's Goal. Acceptance is each requirement's Acceptance Criteria; the item has no other acceptance list.
- Approval is never written in the Requirements section. It is recorded in `requirements_approved` (who and when) and in the Questions and Answers row that holds his yes. A requirement is approved only when `requirements_approved` holds a date and no row that asks him to approve it is open.
- An item made before toolkit 0.8.1 can have the older layout: a Starting request, an Agreed goal, `R-01` blocks of labeled lines, and one Acceptance list. Read it as it is: the Starting request holds his words, "Required behavior" and "Boundaries and exceptions" are the Functional Requirements, and "Acceptance check" and the Acceptance list are the criteria. Move an item to this layout only when the owner asks for that item. Then each requirement keeps its number and every word of his, a Superseded one becomes a dropped one, and you show him the new section before you save it.
- An item made before toolkit 0.8.4 can label the Functional Requirements "Functional, Process, Logic, Schema, etc. Requirements". It is the same list: existing blocks keep their label, and a new block gets "Functional Requirements".

## Steps

1. **Start or pick up.**
   - New work: create the item in State Refining Requirements, titled in his words. Give it one requirement for each separate thing he asked for, with his words for it as its Original verbatim requirement.
   - An existing item with open questions: say in one line what is settled, then ask the first open question again. Never start the interview over.
2. **Read what the project already knows.** Search memory with `managing-project-memory`, related items with `tracking-work-items`, and the area's files in `requirements/` and `system-guide/`. Save each new source before you use it (Sources, below).
3. **Agree the goal first.** Ask "So the goal is <one sentence>?" After his yes, write it as the goal in the item's Overview.
4. **Offer a helper team once.** After the goal, when the item is clearly large (a part of it meets a split test below) and `delivery` is `not-offered`, ask once whether he wants a team of helper agents to build it, and record his answer in `delivery`. A sub-item takes its parent's answer.
5. **Interview one question at a time,** in the question format below. Ask first what later questions depend on. Ask about each vague word ("fast", "all users") until a tester could check it. Add the question's row before the reply ends, set `waiting_on` to the owner, and name its Q-ID in the Current state.
6. **Save each answer the moment he gives it,** in one save: his words, the date, Decision? `yes` or `no`, Status Answered; the Q-ID in Recent History; the rewritten Current state. Then update what the answer settles:
   - the goal: the goal in the Overview, or the Goal of the requirement it is about;
   - a behavior, rule, or exception: a line in the Functional Requirements of the requirement it belongs to, and a line in that requirement's Acceptance Criteria when the check changes. When no requirement covers it, add a new requirement, with his words as its Original verbatim requirement. The row's Affects column names the `R-xx`;
   - something out of scope: a line in the Functional Requirements of the requirement it limits ("Does not apply to ...");
   - a phase, its order, or a split: the Roadmap of a top-level item, or the task list of a sub-item;
   - a fact that is not a requirement: Notes, Context;
   - an idea for how to build it: Notes, "Solution options and considerations", naming its `R-xx`.

   When the answer decides something a later item or another agent must follow, the next question is "This looks project-wide. Save it to memory too?", and on his yes, save it with `managing-project-memory`.
7. **Handle a change** to an earlier answer or an approved requirement.
   - Never rewrite the old row. Add "Change to Q-03: <the question now>" with his words and the date, and set the old row to "Superseded by Q-09".
   - Change the lines of each `R-xx` it affects, and keep the old wording in the Recent History row ("R-02 was: ...; changed by Q-12"). Never change an Original verbatim requirement: add his new words after it, with the date and the Q-ID.
   - When the old answer was saved to memory, ask "This changes a decision saved in memory. Save the new decision and mark the old one as replaced?"
   - After the requirements were approved, a changed requirement and a new one each need his OK for that requirement only: add the row "Do you approve the change to R-02?", or "Do you approve R-05?" for a new one, and ask it. While that row is open, that requirement is not approved: design, build, and test nothing from it. The others stay approved, and `requirements_approved` stays as it is. A design it affects goes back to Designing. When a sub-item holds a copy of the changed requirement, change the copy the same way once he approves.
   - On his no, put the old lines back from that Recent History row, or mark a new requirement dropped, and save his words in the row. A design that went back to Designing for that change returns to the status it had.
   - A new requirement takes the next free number. A dropped one keeps its block, with " (dropped, <Q-ID>)" added to its heading: "Requirement 3: Export to PDF (dropped, Q-12)". Numbers are never reused.
8. **Shape the plan** (Roadmap, tasks, and sub-items, below).
9. **Stop asking** when every requirement has its Goal, at least one line in its Functional Requirements, and at least one line in its Acceptance Criteria, no open question affects a requirement, a top-level item's roadmap has at least one phase, and the split is settled. Ask once: "What have we not talked about yet that could change this?"
10. **Check readiness** before asking for approval, and after any change to an approved requirement. Start the requirements analyst helper (`requirements-analyst-brief.md`). Fix wording that changes nothing he asked for yourself, and say so in one line. A finding that would change what he asked for becomes a question with your recommendation. More than three findings go to him as one numbered list.
11. **Ask for his OK on the requirements.** Show the goal, each requirement in one line with its Acceptance Criteria, and your recommended next State with its reason (Designing or Building, as `SKILL.md` says). Add the row "Do you approve these requirements?" (Affects: every `R-xx`), and end the reply with exactly that question. After his yes, save his words and the date in that row first (Decision? `yes`), then:
    - set `requirements_approved` to `YYYY-MM-DD by <name>`;
    - move the item to the next State he agreed to;
    - a sub-item that these requirements cover: bring the lines it copied from the parent up to the approved wording, give it the same approval with "(from <parent ID>)", add the Recent History row "Covers <parent ID> R-xx, approved there.", and move it to the same next State. It skips its own interview.
12. **Pausing before approval:** the Current state names what is settled and the first open Q-ID. The project's Current State names the item under "Now".

## The question format

```text
Q-07: <One question that settles one thing.>
Recommended: <your answer>, because <the reason>.
Watch out: <the catch of this choice>.
Not yet covered: <what this affects that he has not raised>.
```

- Leave out "Watch out" or "Not yet covered" only when there is nothing real to say.
- The row in Questions and Answers holds the question and the "Recommended:" line.
- Name the source of anything taken from a source or from memory where you use it, and list the sources just above the question.

## Sources

- Save a transcript, document, or file before you use it, with `tracking-work-items`. Pasted text is saved exactly as pasted, named `YYYY-MM-DD-<short-name>.md`. Never edit a saved source; corrections go in the item.
- Salesforce projects: a client file stays in `delivery/` and is saved there with `publish-docs`, never copied into the item.
- Add one line per source under Notes, "Sources": where it is, what it is, and the IDs taken from it. Name the source again wherever the item uses it.
- From a source: a stated behavior becomes a requirement, or a line of one, with the source's words as its Original verbatim requirement and the source named there; something another person decided becomes a question asking the owner to confirm it; a gap becomes a question with your recommendation; other facts go under Notes, Context. Tell him how many requirements and questions it gave, then ask the first question.

## Roadmap, tasks, and sub-items

The levels, and which ones have phases, are in `SKILL.md`, "Levels".

- A top-level item: propose its phases as one question, each with a one-line reason. Name a phase by what it delivers ("P1 — Personas agreed"), not by the kind of work.
- During refining, add a task only for work refining itself needs, such as "P1-T01 — Get the current persona list from the client" (in a sub-item, "T01 — ...").
- Propose a split into sub-items when a part of the work can be approved, built, or shipped on its own; is for other people or another area of the system; needs its own design; or is large enough that the owner will want to track it by itself. Never split for a single step (that is a task).
- Show the split in one message: each sub-item's title, a one-line reason, the parent's phase it goes under (a level-2 sub-item only), and the parent requirements it covers. Ask "Shall I split WI-012 into these 4 sub-items?" His yes covers the split only.
- After his yes, create each sub-item with the parent's ID, in State Refining Requirements, with one requirement for each parent requirement it covers: its Original verbatim requirement quotes the parent's words for that part and names where they are from ("from <parent ID> R-02"), and its Functional Requirements and Acceptance Criteria copy the parent's lines it covers, word for word. When the parent's requirements are already approved and cover it, create it in the parent's next State with the approval copied from the parent instead. List each level-2 sub-item's ID under its phase on the top-level parent; a level-3 sub-item is listed on its level-2 parent, with no phase.

## Gotchas

- Save before the next question. When the chat is cleared, an answer not yet saved is lost.
- Only the owner's words answer a question. A source, another person, or your recommendation stays a candidate until he confirms it. A tentative answer ("probably B, let me think") leaves the question open.
- Requirements say what and why, never how.
- Ask in the reply text, never through a question tool, one question per reply. A list of recommendations he can accept with one yes, each with a one-line reason, counts as one question.
- A sub-item has its own Questions and Answers. Save each answer in the item it is about.
