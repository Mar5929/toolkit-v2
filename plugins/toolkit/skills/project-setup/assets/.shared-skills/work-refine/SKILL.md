---
name: work-refine
description: 'Refines a work item from a rough idea, notes, or files into approved requirements, a roadmap, and sub-items, one question at a time, so any session resumes it. Use before its requirements are approved or when a requirement changes, such as "help me plan this", "here are the meeting notes", "grill me", or "what am I missing". Not for design; use solution-design. Not for a playback; use braindump.'
---

# Work refine

Takes one work item from a rough idea, meeting transcripts, and documents to an agreed goal, requirements, and roadmap. It ends when the owner approves the requirements. The work item is the only record: every question is a row in its Questions and Answers, and every answer is saved the moment he gives it, so any later session picks up at the first open question. Read and change the item only with the project's work track skill; `AGENTS.md`, under "Skills", names it.

## Steps

1. **Find or make the item.**
   - **Find:** with the work track skill, as `AGENTS.md` says. Two or more fit: ask which, with your recommendation.
   - **Make:** none exists and he describes new work: create one with the work track skill at `01-discovery`, titled in his words, with his words as the Starting request. Choose its `type` from the template's `type:` list. An existing item keeps its `type`.
   - **Wrong skill:** the item is at stage 03 or later and he asked for no new or changed requirement: use the skill `AGENTS.md`, "Skills", names for the item's stage.
2. **Pick up where it stopped.** Read the whole item fresh, its Current state first, and every routing field. It has open Questions and Answers rows: say in one line what is settled, then ask the first open row again. Never start the interview again from its first question. The owner changed the item by hand: his change wins; say what you found in one line and carry on.
3. **Read what the project knows, and every new source.** Search memory with the memory find skill (a Hindsight project: Hindsight's `recall` tool), related items with the work track skill, and the area's files in `requirements/` and `system-guide/`. Save each new source and add its Sources line before you use it (`references/sources.md`). Turn what the sources say into candidate requirements and question rows. Move the item to `02-refinement` when you write its first requirement.
4. **Agree the goal first.** The first question is "So the goal is <one sentence>?". After his yes, write the Agreed goal.
5. **Offer the agent team once.** After his yes to the goal, when `delivery` is `not-offered` and the item is clearly large (a part of it meets a split test in `references/roadmap-and-breakdown.md`), open `work-delegate`: it makes the offer, records his answer, and sends you back here. An item that is not clearly large gets the offer when its plan first has sub-items, more than one phase, or more than two tasks. A small item never gets it, and a sub-item takes its parent's answer.
6. **Interview one question at a time,** each in the question format below. Ask first what later questions depend on. One question settles one thing. Ask about each vague word ("fast", "all users") until a tester could check it, or record it as open. Add the question's row before the reply ends, set `waiting_on: owner`, and rewrite the item's Current state: Next action in the waiting form with the Q-ID (`.claude/rules/keep-work-item-current.md`), and Waiting on naming the same Q-ID.
7. **Save each answer the moment he gives it,** in one save: fill its row (his words, the date, Decision?, Answered), name the Q-ID in Recent History, rewrite the item's Current state in place, and read the item back. Update what the answer settles:
   - the goal: the Agreed goal and the Overview Goal;
   - a behavior, rule, or exception: an `R-xx` block at Status Refining naming the Q-ID in its Decision record, and the Acceptance list when its check changes;
   - something out of scope: the "Boundaries and exceptions" line of the requirement it limits;
   - a phase, its order, or a split: the Roadmap;
   - a fact that is not a requirement: Notes, Context;
   - an idea for how to build it: Notes, "Solution options and considerations", naming its `R-xx`.

   Only then ask the reply's one question. When the answer is a decision (Decision? `yes`), apply the project-wide test: "Will a later work item, or an agent working on something else, need to follow this?" When it passes, that question is "This looks project-wide. Save it to memory too?", with its own row, and the next interview question waits for his answer.
8. **Handle a change:** he changes an earlier answer or an approved requirement, or adds or drops a requirement.
   - Never rewrite the old row. Add a row "Change to Q-03: <the question as it stands now>" with his words, the date, and Decision? `yes`, and set the old row's Status to "Superseded by Q-09".
   - Update what the old answer affected (goal, each `R-xx`, Acceptance, Roadmap). Each changed `R-xx` goes back to Refining, naming the new Q-ID and keeping the old wording ("Was: ...; changed by Q-12").
   - When the old row was saved to memory, ask "This changes a decision saved in memory. Save the new decision and mark the old one as replaced?"
   - An approved requirement: set the Requirements "Overall status" to Refining, keep the stage, say which work waits for the new approval, run the readiness check (step 11), and ask only "Do you approve the change to R-02?" The other requirements stay approved. After his yes: that `R-xx` and the Overall status go back to Finalized, with "Approved `YYYY-MM-DD` by `<name>` (Q-13)" in its Decision record, and `requirements_approved` takes the new date. An approved design the change affects goes back to `solution-design`.
   - A new requirement takes the next free `R-xx` number at Refining. A dropped one is marked Superseded with the Q-ID. Numbers are never reused.
9. **Shape the roadmap.** Propose the phases as a question, each with a one-line reason, and write them in the Roadmap after his answer. When a part of the work meets a split test in `references/roadmap-and-breakdown.md`, also propose sub-items, and make them with the work track skill after his yes. When the plan now has sub-items or more than one phase, step 5 applies now.
10. **Stop asking** when every requirement has a required behavior and an acceptance check, no open row affects a requirement, the roadmap has its phases, and whether to split into sub-items is settled. Then ask once: "What have we not talked about yet that could change this?" and save the answer.
11. **Check readiness** before every requirements approval, when he asks for a spec check, and after a change to an approved requirement. Start the requirements analyst helper (`references/requirements-analyst.md`) and turn each finding into a fix or a question. Fix wording that changes nothing he asked for yourself, and say so in one line. A finding that would change what he asked for becomes a question with your recommendation. Three findings or fewer go to him one per message; more than three go as one numbered list he can answer in one message.
12. **Ask for approval.** Before asking, check: the Agreed goal holds real text; every `R-xx` block is filled (Required behavior, Acceptance check, the rest); each analyst finding was fixed or became a question; no open row affects a requirement. Show the Agreed goal, each requirement in one line, and the Acceptance list. Add the row, set `waiting_on: owner`, write Next action in the waiting form with its Q-ID, and make the reply's last line exactly "Do you approve these requirements?" After his yes, save his words in the row first, then:
    - set each approved `R-xx` to Finalized with "Approved `YYYY-MM-DD` by `<name>` (Q-xx)" in its Decision record, and the Requirements "Overall status" to Finalized;
    - set `requirements_approved` to `YYYY-MM-DD by <name>`; an item before stage 03 moves to `03-requirements-approved`, status Ready;
    - each existing sub-item that covers some of these `R-xx`: write "Covers <parent ID> R-xx, approved there." in its Active requirements; when it has no `R-xx` of its own waiting, also set its `requirements_approved` with `(from <parent ID>)` and move it to stage 03, status Ready;
    - a `build` or `data-load` item goes to `solution-design`, unless he agreed to skip the design; any other item goes on to its build. Next action names the skill: "Agent: write design options for WI-031, with solution-design."
13. **Pausing before approval:** rewrite the item's Current state: Where it stands says what is settled and anything half done, and Next action names the first open Q-ID in the waiting form. Make sure the project's Current State names the item under "Now" in one line (the memory save skill; a Hindsight project: edit `memory/CURRENT_STATE.md`). End with the words that continue, for example "Say 'keep refining WI-031' to pick up at Q-08."

## The question format

Every interview question looks like this in the reply, and its row in Questions and Answers holds the question and the "Recommended:" line.

```text
Q-07: <One question that settles one thing.>
Recommended: <your answer>, because <the reason>.
Watch out: <the gotcha of this choice>.
Not yet covered: <what this affects that he has not raised>.
```

- Leave out "Watch out" or "Not yet covered" only when there is nothing real to say. Never invent one.
- Name the source of anything you took from a source or recalled, where you use it ("(`references/2026-09-30-kickoff.md`)", "(memory: `decision_money_format.md`)"), and put a short Sources list just above the question.

## Gotchas

- Save before the next question. A save fails: lead with "Not saved", keep his words in the reply, and do not ask another question until the answer is saved. When the context is cleared, an answer not yet saved in the item is lost.
- Only the owner's words answer a question. A source, a meeting attendee, or your recommendation stays a candidate until he confirms it. A tentative answer ("probably B, let me think") leaves the row Open.
- Requirements say what and why, never how. A build idea goes under Notes, "Solution options and considerations", naming its `R-xx`.
- Ask in the reply text, never through a separate question tool, and one question per reply. The only reply that asks several questions is a list of more than three readiness findings. A list of recommendations he can accept with one yes, each with a one-line reason, is one question.
- Never delete a requirement, a question row, or a phase. Mark a requirement Superseded, a question row "Superseded by Q-xx", and a phase Cancelled.
- A sub-item has its own Questions and Answers. Save each answer in the item it is about.
- Salesforce projects: a client transcript or document stays in `delivery/`, and its Sources line names that path. Never copy it into an item's `references/` folder. A Salesforce platform question goes to `sf-architect-solutioning`, as `AGENTS.md`, under "Skills", says.

## Helpers

Start each as a new helper that does not see this conversation, as the "For the main agent" section of its brief says.

| Helper | Brief | Start it |
| --- | --- | --- |
| Requirements analyst | `references/requirements-analyst.md` | Step 11. |
| Researcher | `references/researcher.md` | One per fact the owner cannot answer and the project files do not hold, such as a platform limit or what the existing system does. |

## References

| File | Open it when |
| --- | --- |
| [references/sources.md](references/sources.md) | Step 3, and whenever he gives you a transcript, document, file, or link: where to save it, the Sources line, and how to use it. |
| [references/roadmap-and-breakdown.md](references/roadmap-and-breakdown.md) | Steps 5 and 9: the tests for a large item, writing phases, and splitting into sub-items. |
| [references/requirements-analyst.md](references/requirements-analyst.md) | Starting the requirements analyst helper: the brief to paste and the job block. |
| [references/researcher.md](references/researcher.md) | Starting a researcher helper: the brief to paste and the job block. |
| [examples/ios-transactions-walkthrough.md](examples/ios-transactions-walkthrough.md) | To see how a pasted transcript becomes a saved source, draft requirements, and the first question. |
