# Refining requirements

The goal: requirements the owner approves, built from the owner's own words.

## How to run it

- Continue from open questions; never restart the interview.
- Read related decisions, system rules, memory, and work items for the area first.
- Agree the goal in one sentence before anything else, and write it in the Overview.
- Ask one question at a time, the ones others depend on first. Push every vague word ("fast", "all users") until a tester could check it.
- Split into sub-items when a part can ship on its own, serves another area, needs its own design, or the owner will want to track it alone. Get a yes for the split. Sub-items copy the parent's lines word for word. When those parent requirements are already approved, the sub-item inherits the approval as "(from WI-x)" and skips its own interview.
- Before asking for approval, ask "What have we not talked about yet that could change this?", then run the requirements analyst helper and fix or raise its findings.
- Ask for approval showing the goal, each requirement with its acceptance criteria, and the recommended next State.

## Question format

```plain
Q-07: <one question that settles one thing>
Recommended: <answer>, because <reason>.
Watch out: <the catch>.
Not yet covered: <what this affects that the owner hasn't raised>.
```

## Saving answers

- Add each question as a Q&A row before the reply ends, set `waiting_on` to the owner, and name the Q-ID in Current state.
- Save each answer when it arrives: the speaker's words, the date, and the source. Then update what it settles: the goal, a requirement's lines, Notes, or the plan.
- Open rows stay on top, oldest first; answered rows below, newest first. Q-IDs count up within the item.
- An answer another work item would need goes to `filing-project-records`; note the returned ID on the row.
- Never rewrite an answered row or an Original verbatim requirement. Add a "Change to Q-03" row and mark the old one "Superseded by Q-09".
- A changed or new requirement after approval needs its own yes. Until then, design, build, and test nothing from it. If the owner says no, restore the old lines from Recent History and return any affected design to its prior status.

## Sources

File each source with `filing-project-records` before using it. A stated behavior becomes a requirement quoting the source; a gap becomes a question; a decision counts only from someone with authority to make it.

Requirements say what and why, never how.
