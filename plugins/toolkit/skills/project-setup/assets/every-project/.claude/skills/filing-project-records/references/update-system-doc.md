# Update a system document

Use this file to change a document in `system/`. That folder holds the approved description of the system: how it must work, written as numbered rules, so that work items, decisions, and tests can name a rule by its ID. This file gives the steps. `system/AGENTS.md` says which document holds what, and gives the form of a document, the form of a rule and its four marks, a glossary term, an integration document, a diagram, and what must stay true.

The mark of a rule is one of four words: Draft (the owner has not approved it yet), Approved, Built (a work item delivered it), or Retired (it no longer applies).

Before you write a rule, name the DEC ID behind the change. A DEC ID, DEC-###, is the ID of the entry in `DECISIONS.md` that holds the decision or the open question. When no entry exists, record the decision with `record-decision.md` first. It sends you back here before its save.

## Add or change a rule

1. Search `system/` for the subject. When a rule already says it, add no second rule.
2. Choose the mark from the Status of the decision's entry: Decided gives Approved, and Open gives Draft. `system/AGENTS.md`, under "What each mark means", gives the meaning of each mark. For a Draft rule, add its DEC ID under the document's Open questions.
3. Write the rule.
   - A new rule gets the next ID of the document's prefix, in the form `system/AGENTS.md` gives.
   - For a changed rule, change its Rule line and its "Conditions and exceptions" line in place, under the same ID, and set its Source to the new DEC ID. Do not keep the old wording in the document, because the superseded entry in `DECISIONS.md` holds it.
   - A rule marked Built whose wording changes goes back to Approved with the new DEC ID, because the new wording is not delivered yet.
   - For a rule that no longer applies, set its mark to Retired, and its Source to the DEC ID that retired it.
   - When a rule's Source names an SRC ID, add the rule ID to the "Used by" cell of that row in `sources/README.md`. An SRC ID is the ID of a source, which is a filed original.
4. When an Open entry becomes Decided, change each Draft rule that waited for it to Approved, and remove its DEC ID from Open questions.
5. Set the document's "Last changed via" line to the DEC ID. Set the document's Status again. `system/AGENTS.md`, section "The form of a document", says what each Status means.
6. Add one Changelog row. It holds the date, the change with the rule ID, the DEC ID, and the work item that caused the change or "none".
7. Add the rule ID to the Affects line of the entry in `DECISIONS.md`. Step 7 of `record-decision.md` writes the rule ID into each work item.
8. Make one save with `publish-docs`. The save holds the document, `DECISIONS.md`, and `sources/README.md` when step 3 changed it.
   - When `record-decision.md` sent you here, do not save. Go back to it, and its step 6 makes the one save.

## Mark a rule Built

Use this when the closing step of `running-work-item-lifecycle` names a rule a work item may have delivered. The closing step is the step that closes a work item as Done or Cancelled.

1. A work item delivered a rule only when all three of these are true. When one is not true, change nothing, and tell the closing step which one.
   - The rule's mark is Approved.
   - The work item's change is on the default branch, and deployed when the work item has a deployment.
   - The owner approved the work item's result, and the work item's checker marked Met a requirement of the work item that builds or changes the behaviour the rule states. The checker is the separate agent that tested the result. A requirement that only names, explains, or documents the rule does not count.
2. When the work item delivered something that more than one work item depends on, and no rule covers it, the rule needs the owner's decision first. Record that decision with `record-decision.md`, which adds the rule and saves. Then come back here.
3. Change the mark to Built with the work item's ID. Change no other line of the rule.
4. Set the document's Status again. Add one Changelog row that holds the date, "<rule ID> built", the rule's DEC ID, and the work item's ID. "Last changed via" keeps the rule's DEC ID.
5. Save with `publish-docs`.
6. Give the closing step each rule ID, the commit ID, and whether the main checkout holds the save. `SKILL.md`, section "Every time", says what to report about the main checkout. The closing step records the rule IDs in the work item.

## A glossary term

The glossary is `system/glossary.md`, the table of the words that have a special meaning in this project.

- Ask the owner first about a meaning that the owner did not give and no decision gives, such as one a source gives or one you worked out. Ask: "Add to the glossary: <term> means <meaning>?"
- A term the owner defined in the conversation needs no entry in `DECISIONS.md`. The row's Source is the owner's words with the date, and the Changelog row's DEC cell says "none".
- Search the table before you add a term. When the term is there, change its row.
- Add the Changelog row, set the Status again, and save with `publish-docs`.

## An integration document or a diagram

An integration document describes one connection between this system and another system. `system/AGENTS.md`, sections "An integration document" and "A diagram", give the steps for each. The rules inside an integration document follow "Add or change a rule" in this file. Save with `publish-docs`.
