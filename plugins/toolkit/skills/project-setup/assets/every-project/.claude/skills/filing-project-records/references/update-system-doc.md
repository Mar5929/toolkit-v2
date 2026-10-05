# Update a system document

For a change to `system/`: the approved description of the system. Which document holds what, the form of a document, the form of a rule and its four marks, a glossary term, and an integration document are in `system/AGENTS.md`. This file gives the steps.

A rule changes only together with a decision. Name the DEC ID before you write. No entry exists: do `record-decision.md` first, and save both in one save.

## Add or change a rule

1. Search `system/` for the subject. A rule that already says it gets no second rule.
2. Choose the mark from the decision's Status.
   - Decided: Approved, with the DEC ID.
   - Open: Draft. Add the DEC ID under the document's Open questions.
3. Write the rule.
   - A new rule: the next ID of the document's prefix, in the form `system/AGENTS.md` gives.
   - A changed rule: change its Rule line and its "Conditions and exceptions" line in place, under the same ID, and set its Source to the new DEC ID. Do not keep the old wording in the document: the superseded entry in `DECISIONS.md` holds it.
   - A rule marked Built whose wording changes goes back to Approved with the new DEC ID. The new wording is not delivered yet.
   - A rule that no longer applies: set its mark to Retired, and its Source to the DEC ID that retired it.
4. When an Open entry becomes Decided: change each Draft rule that waited for it to Approved, and remove its DEC ID from Open questions.
5. Set "Last changed via" to the DEC ID. Set the document's Status again.
6. Add one Changelog row: the date, the change with the rule ID, the DEC ID, and the work item that caused the change or "none".
7. Add the rule ID to the Affects line of the entry in `DECISIONS.md`. `record-decision.md`, step 7, writes the rule ID into each work item.
8. Save the document and `DECISIONS.md` in one save with `publish-docs`.

## Mark a rule Built

Use this when the closing step of `running-work-item-lifecycle` says a work item delivered a rule.

1. Mark a rule Built only when all three are true. When one is not, change nothing and tell the closing step which one.
   - The rule's mark is Approved.
   - The work item's change is on the default branch.
   - The owner approved the item's result, and the check of the requirement behind the rule passed.
2. The item delivered something more than one work item depends on, and no rule covers it: the rule needs the owner's decision first. Do `record-decision.md`, then "Add or change a rule", then come back here.
3. Change the mark to Built with the work item's ID. Change no other line of the rule.
4. Set the document's Status again. Add one Changelog row: the date, "<rule ID> built", the rule's DEC ID, and the work item's ID. "Last changed via" keeps the rule's DEC ID.
5. Save with `publish-docs`.
6. Give the closing step each rule ID and the commit ID. It records them in the work item.

## A glossary term

- A term comes from the owner's words, a decision, or a source. A meaning you worked out: ask the owner first, "Add to the glossary: <term> means <meaning>?"
- A term the owner defined in the conversation needs no entry in `DECISIONS.md`: the row's Source is the owner's words with the date, and the Changelog row's DEC cell says "none".
- Search the table before you add. A term that is there is changed in its row.
- Add the Changelog row, set the Status again, and save with `publish-docs`.

## An integration document or a diagram

`system/AGENTS.md` gives the steps for both. The rules inside an integration document follow "Add or change a rule".
