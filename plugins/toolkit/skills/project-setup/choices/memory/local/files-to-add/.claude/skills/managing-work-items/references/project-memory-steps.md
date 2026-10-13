# Project memory steps for managing-work-items: local memory

This file holds the steps of `managing-work-items` that depend on where this project keeps its memory. This project keeps memory in local files in `memory/`, with `managing-project-memory`. It keeps shared decisions in `DECISIONS.md` and the approved description of the system in `wiki/product-wiki/`. `references/closing.md` and `references/lifecycle-rules.md` say when to open each section.

## Filling the Moved up line

These six steps record changes to `wiki/product-wiki/` and `DECISIONS.md`. On the short path for a small work item, make the list in step 1 before you ask the closing question.

1. List what the whole project may need to keep. Read the work item's Questions and Answers rows marked Decision? `yes`, its design, its Related items line, and its Notes, "Lessons not proven yet". Put these five kinds of thing on the list:
   - Each decision that more than one work item needs, and whose row does not end "Filed as DEC-###". The root `AGENTS.md`, section "Where information goes", gives the test for whether more than one work item needs a decision.
   - Each rule that several work items rely on, that this work item added, changed, or retired, and that `wiki/product-wiki/` does not show yet.
   - Each rule that this work item may have built. Such a rule is one whose behaviour a requirement of this work item built or changed. It is either a rule already on this list, or a rule that `wiki/product-wiki/` holds with the mark Approved. The mark is the word on a rule in `wiki/product-wiki/` that says whether the rule is Draft, Approved, Built, or Retired.
     - A work item that only names, explains, or documents a rule did not build what the rule says.
     - A cancelled work item did not build what any rule says.
     - `filing-project-records`, step "update a system document", holds the conditions for when a work item built what a rule says, and it checks them.
   - Each project term that this work item added or changed, and that `wiki/product-wiki/glossary.md` does not show yet.
   - Each lesson that has no outcome at the end of its line. Step 5 gives the outcomes. Before you list a lesson, search and read relevant memory: use `managing-project-memory`. When the lesson was seen before, in another work item or another session, list it with the dates it was seen.
2. When the list holds a decision, a rule to add, change, or retire, a project term, or a lesson, ask the owner once. When the list holds only rules that the work item may have built, or holds nothing, ask no question.
   - Add one Questions and Answers row that shows each line of the list with your recommendation and a one-line reason.
   - For a lesson, the owner chooses one of three: keep it for the whole project, keep it as not proven, or drop it. Recommend keeping a lesson for the whole project when it was seen before.
   - Set `waiting_on` to the owner, and ask whether the owner agrees to keep each listed item for the whole project, with the proposed outcome.
3. File what the owner agreed to. This table says what to do with each thing.

   | What it is | What to do |
   | --- | --- |
   | A decision or an open question | `filing-project-records`, step "record a decision" |
   | A rule to add, change, or retire | `filing-project-records`, step "update a system document" |
   | A rule that this work item may have built | `filing-project-records`, step "update a system document". That step checks the conditions and, when they are met, sets the rule's mark to Built, with this work item's ID. |
   | A project term | `filing-project-records`, step "update a system document" |
   | A lesson that the owner agreed to keep for the whole project, and that is about the system or the project | `filing-project-records`, step "record a decision" |
   | A lesson that the owner agreed to keep for the whole project, and that is about how to do a step, such as a deploy, a data load, or a test, or about how the agent works | Give the lesson to `managing-project-memory`, which writes the line in `.claude/rules/owner-preferences.md`. |
   | A lesson that is kept as not proven | Give the lesson to `managing-project-memory`, with the work item's ID and the dates it was seen. |

4. Check that each record's ID may be written in the work item now. `references/work-tracker.md`, section "Writing a record's ID in a work item", says when it may. With each ID, `filing-project-records` reports whether the main checkout holds the save of that record. Steps 5 and 6 write those IDs into the work item.
   - When an ID may not be written yet, stop here, and tell the owner what `filing-project-records` reported. `filing-project-records` records the wait as "Recording a wait for a record or a decision" below says.
   - When every ID may be written, continue from this step.
5. Write each lesson's outcome at the end of its line. Choose the outcome that describes what was saved, with the real ID in place of the example:
   - "Moved up: DEC-021."
   - "Moved up: owner-preferences.md."
   - "Kept in memory."
   - "Kept in work item."
   - "Dropped (Q-12)."
6. Fill the Moved up line.
   - Name every entry in `DECISIONS.md` and every rule in `wiki/product-wiki/` that this work item added or changed. Name each one by its ID, and say what happened to it.
   - Name every project term in `wiki/product-wiki/glossary.md` that this work item added or changed, by the term.
   - Include the entries and rules that were filed before this step. The Questions and Answers rows of those entries end "Filed as DEC-###".
   - When there are none, write "Nothing: <the reason>."
   - Add a Recent History row that names the Q-ID of the question from step 2, or says that no question was needed.

## When a work item closes

Update the project's Current State, which is the project's one short page of what is true now, with `managing-project-memory`.

- Remove the work item's line under Now.
- Ask `managing-project-memory` to remove the rest: each line under "Coming up" or "Waiting on" that is about this work item, and a "Next session starts with" line that names it. The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps.

## Keeping active work current

The project's Current State holds one line for an active work item.

- Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State.
- Add, change, or remove the line with `managing-project-memory`.
- In the same write, or in the turn in which the session starts work on a work item whose line is already there, make "Next session starts with" name the work item: its ID and "read its Current state". A work item's Current state is the five lines at the top of the work item that say where it stands.

## Recording a wait for a record or a decision

Use this section when something the project needs is waiting, such as a record's ID that cannot be written in a work item yet, or an Open entry in `DECISIONS.md` that no work item waits on.

- Give `managing-project-memory` one line for "Waiting on" in the project's Current State. The project's Current State is the project's one short page of what is true now, and "Waiting on" is one of its parts. The line names what waits, each work item it affects, and who or what it waits on.
- When the wait ends, ask `managing-project-memory` to remove the line.
