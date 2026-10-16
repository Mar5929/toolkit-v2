# Record a decision

A decision or open question that more than one work item needs becomes a `DEC-###` entry in `DECISIONS.md`. The comment at the top of that file gives the entry form, the four statuses, who may decide, and what never changes; read it first.

A sourced answer counts as decided only when its speaker, their authority, the date, and an unambiguous decision are verified. Keep the source passage or timestamp. Anything tentative stays Open.

## A new entry

1. Search `DECISIONS.md` for the subject, its rule IDs, and work item IDs. If an entry already says the same, just add any missing work item to its Affects. If it's an Open entry now being answered, see "Answering an open question". If a Decided entry says otherwise, see "Replacing a decision".
2. Mark it Decided when someone who may decide gave the answer; a job title alone doesn't establish that. Otherwise mark it Open, with the exact question on the Decision line. If `PROJECT.md` names nobody for that kind of decision, ask the owner who decides.
3. File any source that has no SRC ID yet (`file-source.md`).
4. Write the entry with the next DEC number. The Why line is in the decider's words, since later work won't read a closed item. Affects names only work items that exist (or "none yet"); ask if unclear. Sources lists SRC IDs, and each gets the DEC ID in its "Used by" cell in `sources/INDEX.md`. A closing lesson's Decision line states what to do or avoid, and its Why says where it was seen.
5. A Decided entry that says how the system must work is also a rule: write it with `update-system-doc.md` before saving. An Open entry gets a Draft rule only if work is being designed or built to its proposed wording now.
6. Save everything in one `publish-docs` save.
7. Once the save is in the main checkout, write the DEC and rule IDs into each affected item's Related items, and add "Filed as DEC-###." to the Q&A row that raised it. An item that can't continue without an Open answer waits on the owner. When no work item holds the wait, have `managing-project-memory` record it.
8. Tell the owner the decision's title, its status, and the names of the work items it affects.

## Answering an open question

Only someone who may decide closes it. Set Decided, fill the Decided line, replace the question with the decision, write the Why, update or add the rules (Draft rules become Approved), and save. Work items keep the same DEC ID; any that waited can continue, and any recorded wait is removed.

## Replacing a decision

Verify the new decision first; if it isn't verified, record an Open question and leave the old decision in force. Add a new entry that "replaces DEC-###", mark the old one Superseded and "replaced by DEC-###" without touching its other lines, update each rule sourced from the old entry, save both together, and swap the DEC ID in every open affected item. A change to an approved requirement goes through `managing-work-items`.

## Withdrawing an entry

If a rule's Source names the entry, don't withdraw it; ask the owner what holds now and replace it instead. Otherwise set Withdrawn, add the owner's reason and date to Why, save, and remove the DEC ID from open affected items.
