# Refining Requirements

Use this file to take a work item from a rough idea, meeting notes, or documents to requirements that the owner approves. The job is done when the owner has approved the requirements and the work item has moved to its next State.

Every question to the owner is a row in the work item's Questions and Answers. Save each answer when it is received or verified from a source. A later session can then continue at the first open question.

The Requirements section of the work item template gives the form of a requirement and says what each part holds. Three facts apply in every step:

- The work item's goal is the goal in its Overview, together with the Goal of each requirement.
- Acceptance is the Acceptance Criteria of each requirement. The work item has no other acceptance list.
- A requirement is approved only when `requirements_approved` holds a date and no row that asks the owner to approve that requirement is open.

## Contents

- Steps
- The question format
- Sources
- Roadmap, tasks, and sub-items
- Mistakes to avoid

## Steps

A small work item that takes the short path does steps 1 and 2 only. `references/lifecycle-rules.md`, section "A small work item", says what a small work item is, and gives the steps that take the place of steps 3 to 11.

1. Start the work item, or continue it.
   - For new work, create the work item in State Refining Requirements, with a title in the owner's words. Give it one requirement for each separate thing the owner asked for. The owner's words for that thing are the requirement's Original verbatim requirement.
   - For an existing work item with open questions, say in one line what is settled, and then ask the first open question again. Never start the interview over.
2. Read existing decisions and documentation for the affected area. With Notion memory, use `managing-project-memory` for wiki retrieval and relevant pending captures. Other choices use `DECISIONS.md`, the area document in `system/` and `system/constraints.md`. Read related work items with `references/work-tracker.md`. File each new source before you use it, as "Sources" below says.
3. Agree the goal first. Ask "So the goal is <one sentence>?" After the owner's yes, write that sentence as the goal in the work item's Overview.
4. Offer a team of helper agents once. Ask after the goal is agreed, and only when both of these are true: the work item is clearly large, and `delivery` is `not-offered`. A work item is clearly large when a part of it meets one of the conditions for a split in "Roadmap, tasks, and sub-items" below.
   - Ask once whether the owner wants a team of helper agents to build the work item, and record the answer in `delivery`.
   - A sub-item takes its parent's answer.
5. Interview the owner, one question at a time, in the form that "The question format" below gives.
   - Ask first the questions that later questions depend on.
   - Ask about each vague word, such as "fast" or "all users", until a tester could check it.
   - Add the question's row before the reply ends, set `waiting_on` to the owner, and name the question's Q-ID in the work item's Current state.
6. Save each answer when it is received or verified from a source. Do three things for each answer, in this order.

   First, make one save that holds all of these:
   - in the question's row: the answer in the speaker's words, the date, and source evidence when applicable, Decision? `yes` or `no`, and Status Answered;
   - in Recent History: the Q-ID;
   - the rewritten Current state of the work item.

   Second, update what the answer settles. This table says where each kind of answer goes.

   | What the answer settles | Where to write it |
   | --- | --- |
   | The goal | The goal in the Overview, or the Goal of the requirement that the answer is about. |
   | A behavior, a rule, or an exception | A line in the Functional Requirements of the requirement it belongs to. When the check changes, also a line in that requirement's Acceptance Criteria. The question's row names the `R-xx` in its Affects column. `R-xx` is the short form of a requirement's number, such as R-01 for Requirement 1. |
   | A behavior, a rule, or an exception that no requirement covers | A new requirement, with the owner's words as its Original verbatim requirement. Then a line in its Functional Requirements and, when the check changes, a line in its Acceptance Criteria. The question's row names the `R-xx` in its Affects column. |
   | Something that is out of scope | A line in the Functional Requirements of the requirement it limits, in the form "Does not apply to ...". |
   | A phase, the order of the phases, or a split | The Roadmap of a top-level work item, or the task list of a sub-item. |
   | A fact that is not a requirement | Notes, Context. |
   | An idea for how to build it | Notes, "Solution options and considerations", with the `R-xx` it is for. |

   Third, check whether more than one work item needs the answer. The root `AGENTS.md`, section "Where information goes", gives the test: would an agent that works on a different work item need the answer?
   - When the answer passes that test, give it to `filing-project-records`. Use step "record a decision" for a decision or an open question, and step "update a system document" for a rule that several work items rely on.
   - With Notion memory, record verified capture or destination links and their processing state. Other choices add "Filed as DEC-014.", with the real ID, to the end of the row. The row keeps the original answer and its source evidence.
   - A requirement based on an existing rule names its authoritative ID or wiki link rather than copying the rule. Working designs stay with the work item.
7. Handle a change to an earlier answer or to an approved requirement.
   - Never rewrite the old row. Add a row "Change to Q-03: <the question now>", with the new answer, its speaker, date and source evidence, and set the old row to "Superseded by Q-09". Use the real Q-IDs.
   - Change the lines of each `R-xx` that the change affects, and keep the old wording in the Recent History row, in the form "R-02 was: ...; changed by Q-12".
   - Never change an Original verbatim requirement. Add the owner's new words after it, with the date and the Q-ID.
   - When a shared record depends on the old answer, route its correction as step 6 says, preserving the original evidence and replacement link.
   - After the requirements were approved, a changed requirement and a new requirement each need the owner's yes for that requirement only.
     - Add the row "Do you approve the change to R-02?" for a changed requirement, or "Do you approve R-05?" for a new one, and ask it.
     - While that row is open, that requirement is not approved. Design nothing, build nothing, and test nothing from it.
     - The other requirements stay approved, and `requirements_approved` stays as it is.
     - A design that the change affects goes back to Designing.
     - When a sub-item holds a copy of the changed requirement, change the copy in the same way once the owner approves.
   - When the owner says no, put the old lines back from that Recent History row, or mark a new requirement dropped. Save the owner's words in the row. A design that went back to Designing for that change returns to the status it had.
8. Shape the plan, as "Roadmap, tasks, and sub-items" below says.
9. Stop asking when all four of these are true:
   - Every requirement has its Goal, at least one line in its Functional Requirements, and at least one line in its Acceptance Criteria.
   - No open question affects a requirement.
   - The roadmap of a top-level work item has at least one phase.
   - The split is settled.

   Then ask once: "What have we not talked about yet that could change this?"
10. Check that the requirements are ready. Do this check before you ask for approval, and after any change to an approved requirement. Start the requirements analyst helper, with `requirements-analyst-brief.md`. Then handle its findings:
    - When a finding needs wording that changes nothing the owner asked for, fix the wording yourself, and say so in one line.
    - When a finding would change what the owner asked for, make it a question with your recommendation.
    - When there are more than three findings, give them to the owner as one numbered list.
11. Ask for the owner's yes on the requirements.
    - Show the goal, each requirement in one line with its Acceptance Criteria, and the next State you recommend, with the reason. The next State is Designing or Building. `references/lifecycle-rules.md`, section "Status and State", says when to recommend each.
    - Add the row "Do you approve these requirements?", with every `R-xx` in its Affects column, and end the reply with exactly that question.
    - After the owner's yes, first save the owner's words and the date in that row, with Decision? `yes`. Then do these three things:
      - Set `requirements_approved` to `YYYY-MM-DD by <name>`.
      - Move the work item to the next State that the owner agreed to.
      - For each sub-item that these requirements cover, bring the lines it copied from the parent up to the approved wording. Give it the same approval, with "(from <parent ID>)". Add the Recent History row "Covers <parent ID> R-xx, approved there." Move it to the same next State. Such a sub-item skips its own interview.

## The question format

Write each question to the owner in this form:

```text
Q-07: <One question that settles one thing.>
Recommended: <your answer>, because <the reason>.
Watch out: <the catch of this choice>.
Not yet covered: <what this affects that the owner has not raised>.
```

Leave out "Watch out" or "Not yet covered" only when there is nothing real to say on that line.

## Sources

A source is anything the project was given, such as a transcript, a document, a file, or pasted text.

- File a source before you use it, with `filing-project-records`, step "file a source". That step gives you the SRC-### and adds the source's line under Notes, Sources.
- A source gives four kinds of information:
  - A behavior that the source states becomes a requirement, or a line of one. The source's words are its Original verbatim requirement, and the SRC-### is named there.
  - For a project decision, use the authority and evidence checks in `filing-project-records`, reference `record-decision.md`. A verified decision from a person who may decide answers the relevant question; otherwise, keep a question open for confirmation. Record the speaker, decision date, SRC ID and supporting passage or timestamp in the answer.
  - A gap becomes a question with your recommendation.
  - Other facts go under Notes, Context.
- Tell the owner how many requirements and how many questions the source gave. Then ask the first question.

## Roadmap, tasks, and sub-items

`references/lifecycle-rules.md`, section "Levels", gives the levels and says which ones have phases.

- For a top-level work item, propose its phases as one question, with a one-line reason for each phase. Name a phase by what it delivers, such as "P1 — Personas agreed", and not by the kind of work.
- During Refining Requirements, add a task only for work that Refining Requirements itself needs, such as "P1-T01 — Get the current persona list from the client". In a sub-item the task is "T01 — ...".
- Propose a split into sub-items when a part of the work meets one of these four conditions:
  - It can be approved, built, or shipped on its own.
  - It is for other people or for another area of the system.
  - It needs its own design.
  - It is large enough that the owner will want to track it by itself.
- Never split off a single step. A single step is a task.
- Show the split in one message, and ask "Shall I split WI-012 into these 4 sub-items?", with the real ID and number. The owner's yes covers the split only. For each sub-item, the message gives:
  - its title;
  - a one-line reason;
  - the parent's phase it goes under, for a level-2 sub-item only;
  - the parent requirements it covers.
- After the owner's yes, create each sub-item with the parent's ID, in State Refining Requirements. Give it one requirement for each parent requirement it covers:
  - Its Original verbatim requirement quotes the parent's words for that part, and names where the words are from, in the form "from <parent ID> R-02".
  - Its Functional Requirements and Acceptance Criteria copy the parent's lines it covers, word for word.
- When the parent's requirements are already approved and cover the sub-item, create the sub-item in the parent's next State instead, with the approval copied from the parent.
- List the ID of each level-2 sub-item under its phase on the top-level parent. List a level-3 sub-item on its level-2 parent, with no phase.

## Mistakes to avoid

- For a project decision, use the authority and evidence checks under "Sources" above. Other questions require the owner's answer. A tentative statement or your recommendation leaves the question open. Recording a sourced decision does not replace the owner approvals required by the work-item lifecycle.
- Requirements say what and why. They never say how.
- A sub-item has its own Questions and Answers. Save each answer in the work item that the answer is about.
- Ask in the text of the reply, and never through a question tool. Ask one question in each reply. A list of recommendations that the owner can accept with one yes, each with a one-line reason, counts as one question.
