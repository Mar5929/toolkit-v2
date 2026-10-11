# Record a decision

A sourced answer counts as decided only when its speaker, documented authority, date and unambiguous decision are verified. Retain the source passage or timestamp; a tentative statement or interpretation remains unresolved.

When the project uses Notion memory, use `managing-project-memory` to capture the decision, finalized documentation or term with its source and existing approval evidence. The librarian updates the configured wiki destination. Return verified capture links to the calling skill; the local publication procedure below does not apply.

Use this file to record a decision or an open question that more than one work item needs, so that later work on any work item finds it. Each one is an entry in `DECISIONS.md`, with an ID in the form DEC-###.

The comment at the top of `DECISIONS.md` gives the form of an entry, its four statuses, who may decide, and what must never change. Read it before you write.

The Status of an entry is one of four words: Open (a question that waits for an answer), Decided, Superseded (a later decision replaced it), or Withdrawn (dropped, with nothing in its place).

## Which section of this file to use

| What happened | Section |
| --- | --- |
| A decision was made, or a question was raised | A new entry |
| The answer to an Open entry was given | Answering an open question |
| A person who may decide changes a Decided entry | Replacing a decision |
| The owner drops a question or a decision, and nothing replaces it | Withdrawing an entry |

## A new entry

1. Search `DECISIONS.md` for the subject. Search for its words, the rule IDs, and the work item IDs.
   - When an entry already says the same, add no entry. Add a missing work item to its Affects line, and do steps 6 and 7 for that work item.
   - When an Open entry asks this question and the answer is now given, go to "Answering an open question".
   - When a Decided entry says something different, go to "Replacing a decision".
2. Choose the Status from who gave the answer.
   - When a person who may decide it gave the answer, the Status is Decided. `DECISIONS.md` says who may decide: the owner, or the person `PROJECT.md` names for that kind of decision.
   - A filed source may establish that answer without a second confirmation. Verify the speaker, their authority for this decision, the date, and the unambiguous decision in the source; retain its SRC ID and the passage or timestamp that supports the entry.
   - When the statement is tentative, the speaker or authority is unverified, or the answer is your interpretation, the Status is Open. Write the exact question on the Decision line.
   - When `PROJECT.md` names no person for this kind of decision, ask the owner who decides. A job title alone does not show who decides.
3. File each source the entry is based on that has no SRC ID yet. `file-source.md` gives the steps.
4. Add the entry in the form that `DECISIONS.md` gives, with the next DEC number. Fill these lines as follows.
   - On the Why line, write the reason in the words of the person who decided. Later work does not read a closed work item, so the reason must be in this entry, not only in the work item.
   - On the Affects line, name each open work item the entry changes.
     - Name only a work item that exists. For work that has no work item yet, write "none yet", or first add the work item to the Backlog with `managing-work-items`.
     - When you cannot tell which work items the entry changes, ask the owner in one question.
   - On the Sources line, name each SRC ID the entry is based on. Add the DEC ID to the "Used by" cell of each of those rows in `sources/INDEX.md`.
   - When the entry is a lesson from a work item that is being closed, the owner's yes to keeping the lesson for the whole project is the decision. On the Decision line, state the lesson as what to do or what to avoid. On the Why line, say what happened and where it was seen, with the work item's ID.
5. Decide whether the entry needs a rule in `system/`.
   - A Decided entry that states how the system must work is also a rule. Write the rule now with `update-system-doc.md`, before the save in step 6.
   - An Open entry gets a rule now only when a work item under its Affects is designed or built to the proposed wording before the answer is given. That rule is marked Draft.
   - Otherwise, write the rule of an Open entry when the entry is answered.
6. Make one save with `publish-docs`. The save holds `DECISIONS.md`, `sources/INDEX.md` when step 4 changed it, and every system document that step 5 changed.
7. Write the IDs in each work item under Affects, with `managing-work-items`. `SKILL.md`, section "When to write the ID", says when you can write them. Wait until then. On the work item's Related items line, write the DEC ID and the ID of each rule that step 5 added or changed.
   - When a Questions and Answers row in a work item raised the decision, add "Filed as DEC-###." at the end of that row's Answer cell, after the original answer. The row keeps the answer and its source evidence.
   - When a work item cannot continue without the answer to an Open entry, that work item waits on the owner. Continue with `managing-work-items` for that work item.
   - When no work item waits on an Open entry, keep its DEC ID and who must answer in `DECISIONS.md`. With local or Notion memory, also give `managing-project-memory` a "Waiting on" line in Current State. With Hindsight, use the tracker for any follow-up task and the Hindsight rule for qualifying lasting knowledge.
8. Tell the owner the DEC ID, its Status, and the work items that now name it.

## Answering an open question

1. Check who gave the answer. Only the answer of a person who may decide closes the question. Step 2 of "A new entry" says who that is.
2. Change the entry: set Status to Decided, fill the Decided line, replace the question on the Decision line with the decision, and write the reason on the Why line.
3. Update the rules in `system/` with `update-system-doc.md`.
   - Update each rule marked Draft that waited for this entry.
   - When the decision states how the system must work and no rule holds it yet, add the rule there now.
4. Save as step 6 of "A new entry" says.
5. Leave the DEC ID in each work item under Affects as it is. The work item holds only the ID, so nothing there changes.
   - When a work item waited on this entry, it continues now. Continue with `managing-work-items` for that work item.
   - When a line under "Waiting on" in the project's Current State names this entry, ask `managing-project-memory` to remove it.

## Replacing a decision

Use this section when a person who may decide changes a Decided entry. Apply the authority and evidence checks in "A new entry" first. When the proposed replacement is not verified as Decided, record an Open question and leave the existing decision and rules in force.

1. Add a new entry for the new decision, with steps 2 to 4 of "A new entry". Its "Replaces or replaced by" line says "replaces DEC-###".
2. In the old entry, set Status to Superseded and "Replaces or replaced by" to "replaced by DEC-###". Change no other line of the old entry.
3. For each rule whose Source names the old entry, update the rule with `update-system-doc.md`, and give it the new DEC ID.
4. Save both entries and the system documents in one save.
5. In each work item under the old entry's Affects that is not Done or Cancelled, replace the old DEC ID with the new one on its Related items line, with `managing-work-items`.
   - When a requirement the owner already approved was based on the old decision, that is a requirement change. Continue with `managing-work-items` for that change.

## Withdrawing an entry

Use this section when the owner drops a question or a decision, and nothing replaces it.

- When a rule's Source names the entry, do not withdraw the entry. Ask the owner what holds now, and record the answer with "Replacing a decision".
- Otherwise, set Status to Withdrawn, add the owner's reason, with the date, to the Why line, and save. Then remove the DEC ID from the Related items line of each work item under Affects that is not Done or Cancelled, with `managing-work-items`.
