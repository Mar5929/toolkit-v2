# Record a decision

Use this file to record a decision or an open question that more than one work item needs. Each one becomes an entry in `DECISIONS.md` with its own ID, DEC-###, so that later work on any work item finds it. This file gives the steps. The comment at the top of `DECISIONS.md` gives the form of an entry, its four statuses, who may decide, and what must never change.

The Status of an entry is one of four words: Open (a question that waits for an answer), Decided, Superseded (a later decision replaced it), or Withdrawn (dropped, with nothing in its place).

## A new entry

1. Search `DECISIONS.md` for the subject. Search for its words, the rule IDs, and the work item IDs.
   - When an entry already says the same, add no entry. Add a missing work item to its Affects line, and do steps 6 and 7 for that work item.
   - When an Open entry asks this question and the answer is now given, go to "Answering an open question".
   - When a Decided entry says something different, go to "Replacing a decision".
2. Choose the Status from who spoke.
   - When a person who may decide it gave the answer, the Status is Decided. A person who may decide is the owner, or the person `PROJECT.md` names for that kind of decision. The comment at the top of `DECISIONS.md` gives that rule.
   - When anyone else said it, a source says it, or you worked it out, the Status is Open. Write the exact question on the Decision line.
   - When `PROJECT.md` names no person for this kind of decision, ask the owner who decides. A job title alone does not show who decides.
3. When the entry rests on an original that has no SRC ID yet, file that original now. `file-source.md` gives the steps. An original is a document or message the project received and keeps unchanged, and filing gives it an SRC ID.
4. Add the entry in the form `DECISIONS.md` gives, with the next DEC number.
   - The Why line holds the reason in the words of the person who decided. Later work does not read a closed work item, so the reason must be in this entry, not only in the work item.
   - The Affects line names each open work item the entry changes.
     - Name only a work item that exists. For work that has no work item yet, write "none yet", or first add the work item to the Backlog with `running-work-item-lifecycle`.
     - When you cannot tell which work items the entry changes, ask the owner in one question.
   - The Sources line names each SRC ID the entry rests on. Add the DEC ID to the "Used by" cell of each of those rows in `sources/README.md`.
   - When the entry is a lesson that the closing step of a work item moves up, the owner's yes to moving it up is the decision. The closing step is the step of `running-work-item-lifecycle` that closes a work item. A lesson moves up when the owner says yes, at that step, to filing it for the whole project. The Decision line states the lesson as what to do or what to avoid. The Why line says what happened and where it was seen, with the work item's ID.
5. Check whether the entry needs a rule. A rule is a numbered statement, in a document in `system/`, of how the system must work.
   - When a Decided entry states how the system must work, it is also a rule. Write the rule now with `update-system-doc.md`, before the save in step 6.
   - An Open entry gets a rule only when a work item under its Affects is designed or built to the proposed wording before the answer is given. That rule is marked Draft, which means the owner has not approved it yet.
   - Otherwise, write the rule of an Open entry when the entry is answered.
6. Make one save with `publish-docs`. The save holds `DECISIONS.md`, `sources/README.md` when step 4 changed it, and every system document that step 5 changed.
7. Add the pointer in each work item under Affects, with `using-work-tracker`. A pointer is a record's ID, written in a work item that needs the record. `SKILL.md`, section "Every time", says when a pointer can be written. Wait until then. The pointer here is the DEC ID, and the ID of each rule that step 5 added or changed, on the work item's Related items line.
   - When a Questions and Answers row in a work item raised the decision, add "Filed as DEC-###." at the end of that row's Answer cell, after the owner's words. The row keeps the owner's words.
   - When a work item cannot continue without an Open entry, that work item waits on the owner. Hand it to `running-work-item-lifecycle`.
   - When no work item waits on an Open entry, hand a line for "Waiting on" in Current State to `curating-project-memory`. Current State is the project's one page of what is true now, and "Waiting on" is its part for who owes what. The line holds the DEC ID and who must answer. With Hindsight memory, follow `.claude/rules/hindsight-memory.md` instead.
8. Tell the owner the DEC ID, its Status, and the work items that now point to it.

## Answering an open question

1. Only the answer of a person who may decide closes the question. Step 2 of "A new entry" says who that is.
2. In the entry, set Status to Decided, fill the Decided line, replace the question on the Decision line with the decision, and write the reason on the Why line.
3. Update the rules in `system/` with `update-system-doc.md`, section "Add or change a rule".
   - Do this for each rule marked Draft that waited for this entry.
   - When the decision states how the system must work and no rule holds it yet, add the rule there now.
4. Save as step 6 of "A new entry" says.
5. The pointer in each work item under Affects holds the ID only, so it stays as it is.
   - When a work item waited on this entry, it continues now. Hand that to `running-work-item-lifecycle`.
   - When a line under "Waiting on" in Current State names this entry, hand its removal to `curating-project-memory`. With Hindsight memory, follow `.claude/rules/hindsight-memory.md` instead.

## Replacing a decision

Use these steps when the owner changes a Decided entry.

1. Add a new entry for the new decision, with steps 2 to 4 of "A new entry". Its "Replaces or replaced by" line says "replaces DEC-###".
2. In the old entry, set Status to Superseded and "Replaces or replaced by" to "replaced by DEC-###". Change no other line of it.
3. For each rule whose Source line names the old entry, update the rule with `update-system-doc.md`, section "Add or change a rule", and give it the new DEC ID.
4. Save both entries and the system documents in one save.
5. In each work item under the old entry's Affects that is not Done or Cancelled, replace the old DEC ID with the new one on its Related items line, with `using-work-tracker`.
   - When the old decision shaped a requirement the owner already approved, the new decision is a requirement change. Hand it to `running-work-item-lifecycle`.

## Withdrawing an entry

Use these steps when the owner drops a question or a decision, and nothing replaces it.

- When a rule's Source line names the entry, do not withdraw the entry. Ask the owner what holds now, and record the answer with "Replacing a decision".
- Otherwise, set Status to Withdrawn, add the owner's reason, with the date, to the Why line, and save. Then remove the DEC ID from the Related items line of each work item under Affects that is not Done or Cancelled, with `using-work-tracker`.
