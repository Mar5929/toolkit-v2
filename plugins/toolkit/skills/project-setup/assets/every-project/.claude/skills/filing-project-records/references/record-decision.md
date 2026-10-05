# Record a decision

For a decision or an open question that more than one work item needs. The rules for an entry, its four statuses, and its form are in the comment at the top of `DECISIONS.md`. This file gives the steps.

## A new entry

1. Search `DECISIONS.md` for the subject: its words, the rule IDs, and the work item IDs.
   - An entry already says the same: add no entry. Add a missing work item to its Affects line, and do steps 6 and 7 for that item.
   - An Open entry asks this question, and the answer is now given: go to "Answering an open question".
   - A Decided entry says something different: go to "Replacing a decision".
2. Choose the Status from who spoke.
   - The owner, or the person `PROJECT.md` names for this kind of decision, gave the answer: Decided.
   - Anyone else said it, a source says it, or you worked it out: Open, with the exact question on the Decision line. A job title alone gives nobody the right to decide: when `PROJECT.md` does not name the person, ask the owner.
3. File each original the entry rests on that has no SRC ID yet: `file-source.md`.
4. Add the entry in the form `DECISIONS.md` gives, with the next DEC number.
   - Why holds the reason in the words of the person who decided. A work item is temporary, so the reason must be in this entry, not only in the item.
   - Affects names each open work item the entry changes. When you cannot tell which items it changes, ask the owner in one question.
   - A lesson that the closing step of a work item moves up: the owner's yes to moving it up is the decision. The Decision line states the lesson as what to do or what to avoid. Why says what happened and where it was seen, with the work item's ID.
5. When the entry states how the system must work, it is also a rule: do `update-system-doc.md` now, before the save. An Open entry gets a rule only when more than one work item depends on the rule.
6. Save `DECISIONS.md`, and every system document step 5 changed, in one save with `publish-docs`.
7. In each work item under Affects, add the pointer with `using-work-tracker`: the DEC ID, and the ID of each rule that step 5 added or changed, on the item's Related items line. When a Questions and Answers row in an item raised the decision, that row keeps the owner's words and ends "Filed as DEC-###." An Open entry that the item cannot go on without also makes the item wait on the owner: hand that to `running-work-item-lifecycle`.
8. Tell the owner the DEC ID, its Status, and the work items that now point to it.

## Answering an open question

1. Only the answer of a person who may decide closes the question (step 2 above).
2. In the entry: set Status to Decided, fill the Decided line, replace the question on the Decision line with the decision, and write the reason in Why.
3. Each rule marked Draft that waited for this entry: `update-system-doc.md`.
4. Save as in step 6 above.
5. The pointer in each work item under Affects holds the ID only, so it stays as it is. An item that waited on this entry goes on: hand that to `running-work-item-lifecycle`.

## Replacing a decision

The owner changes a Decided entry.

1. Add a new entry for the new decision ("A new entry", steps 2 to 4). Its "Replaces or replaced by" line says "replaces DEC-###".
2. In the old entry, change two lines only: Status to Superseded, and "Replaces or replaced by" to "replaced by DEC-###".
3. Each rule whose Source names the old entry: `update-system-doc.md`, with the new DEC ID.
4. Save both entries and the system documents in one save.
5. Each work item under the old entry's Affects that is not Done or Cancelled: replace the old DEC ID with the new one on its Related items line, with `using-work-tracker`. When the old decision shaped a requirement the owner already approved, that is a requirement change: hand it to `running-work-item-lifecycle`.

## Withdrawing an entry

The owner drops a question or a decision, and nothing replaces it.

- A rule's Source names the entry: do not withdraw it. Ask the owner what holds now, and record that with "Replacing a decision".
- Otherwise: set Status to Withdrawn, add the owner's reason, with the date, to Why, and save. Then remove the DEC ID from the Related items line of each work item under Affects that is not Done or Cancelled, with `using-work-tracker`.
