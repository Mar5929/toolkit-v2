# Refining Requirements

Takes an item from a rough idea, meeting notes, or documents to requirements the owner approves. Every question is a row in the item's Questions and Answers, and every answer is saved the moment he gives it, so a later chat picks up at the first open question.

## Steps

1. **Start or pick up.**
   - New work: create the item in State Refining Requirements, titled in his words, with his words as the Starting request. Choose its `type` from the template's list.
   - An existing item with open questions: say in one line what is settled, then ask the first open question again. Never start the interview over.
2. **Read what the project already knows.** Search memory with the memory find skill, related items with `tracking-work-items`, and the area's files in `requirements/` and `system-guide/`. Save each new source before you use it (Sources, below).
3. **Agree the goal first.** Ask "So the goal is <one sentence>?" After his yes, write the Agreed goal.
4. **Offer a helper team once.** After the goal, when the item is clearly large (a part of it meets a split test below) and `delivery` is `not-offered`, ask once whether he wants a team of helper agents to build it, and record his answer in `delivery`. A sub-item takes its parent's answer.
5. **Interview one question at a time,** in the question format below. Ask first what later questions depend on. Ask about each vague word ("fast", "all users") until a tester could check it. Add the question's row before the reply ends, set `waiting_on` to the owner, and name its Q-ID in the Current state.
6. **Save each answer the moment he gives it,** in one save: his words, the date, Decision? `yes` or `no`, Status Answered; the Q-ID in Recent History; the rewritten Current state. Then update what the answer settles:
   - the goal: the Agreed goal and the Overview Goal;
   - a behavior, rule, or exception: an `R-xx` at Status Refining, naming the Q-ID in its Decision record, and the Acceptance list when its check changes;
   - something out of scope: the "Boundaries and exceptions" line of the requirement it limits;
   - a phase, its order, or a split: the Roadmap;
   - a fact that is not a requirement: Notes, Context;
   - an idea for how to build it: Notes, "Solution options and considerations", naming its `R-xx`.

   When the answer decides something a later item or another agent must follow, the next question is "This looks project-wide. Save it to memory too?", and on his yes, save it with the memory save skill.
7. **Handle a change** to an earlier answer or an approved requirement.
   - Never rewrite the old row. Add "Change to Q-03: <the question now>" with his words and the date, and set the old row to "Superseded by Q-09".
   - Each `R-xx` it changes goes back to Refining, keeping the old wording ("Was: ...; changed by Q-12").
   - When the old answer was saved to memory, ask "This changes a decision saved in memory. Save the new decision and mark the old one as replaced?"
   - A changed approved requirement needs his OK again for that change only: "Do you approve the change to R-02?" The others stay approved. A design it affects goes back to Designing.
   - A new requirement takes the next free `R-xx` number. A dropped one is marked Superseded with the Q-ID. Numbers are never reused.
8. **Shape the roadmap** (Roadmap and sub-items, below).
9. **Stop asking** when every requirement has a required behavior and an acceptance check, no open question affects a requirement, the roadmap has its phases, and the split is settled. Ask once: "What have we not talked about yet that could change this?"
10. **Check readiness** before asking for approval, and after any change to an approved requirement. Start the requirements analyst helper (`requirements-analyst-brief.md`). Fix wording that changes nothing he asked for yourself, and say so in one line. A finding that would change what he asked for becomes a question with your recommendation. More than three findings go to him as one numbered list.
11. **Ask for his OK on the requirements.** Show the Agreed goal, each requirement in one line, the Acceptance list, and your recommended next State with its reason (Designing or Building, as `SKILL.md` says). End the reply with exactly "Do you approve these requirements?" After his yes, save his words first, then:
    - each approved `R-xx` and the Requirements "Overall status" go to Finalized, with "Approved `YYYY-MM-DD` by `<name>` (Q-xx)";
    - set `requirements_approved` to `YYYY-MM-DD by <name>`;
    - move the item to the next State he agreed to;
    - a sub-item that these requirements cover: write "Covers <parent ID> R-xx, approved there.", give it the same approval with "(from <parent ID>)", and move it to the same next State. It skips its own interview.
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
- From a source: a stated behavior becomes an `R-xx` at Refining citing the source; something another person decided becomes a question asking the owner to confirm it; a gap becomes a question with your recommendation; other facts go under Notes, Context. Tell him how many requirements and questions it gave, then ask the first question.

## Roadmap and sub-items

- Propose the phases as one question, each with a one-line reason. Name a phase by what it delivers ("P1 — Personas agreed"), not by the kind of work.
- During refining, add a task only for work refining itself needs, such as "P1-T01 — Get the current persona list from the client".
- Propose a split into sub-items when a part of the work can be approved, built, or shipped on its own; is for other people or another area of the system; needs its own design; or is large enough that the owner will want to track it by itself. Never split for a single step (that is a task).
- Show the split in one message: each sub-item's title, a one-line reason, its phase, and the parent requirements it covers. Ask "Shall I split WI-012 into these 4 sub-items?" His yes covers the split only.
- After his yes, create each sub-item with the parent's ID, a Starting request quoting the part it covers, and the parent's `R-xx` IDs, in State Refining Requirements. When the parent's requirements are already approved and cover it, create it in the parent's next State with the approval copied from the parent instead. List each sub-item's ID in its phase on the parent.

## Gotchas

- Save before the next question. When the chat is cleared, an answer not yet saved is lost.
- Only the owner's words answer a question. A source, another person, or your recommendation stays a candidate until he confirms it. A tentative answer ("probably B, let me think") leaves the question open.
- Requirements say what and why, never how.
- Ask in the reply text, never through a question tool, one question per reply. A list of recommendations he can accept with one yes, each with a one-line reason, counts as one question.
- A sub-item has its own Questions and Answers. Save each answer in the item it is about.
