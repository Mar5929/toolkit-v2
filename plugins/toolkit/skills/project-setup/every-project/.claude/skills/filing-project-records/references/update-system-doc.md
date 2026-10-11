# Update a system document

When the project uses Notion memory, use `managing-project-memory` to capture the decision, finalized documentation or term with its source and existing approval evidence. The librarian updates the configured wiki destination. Return verified capture links to the calling skill; the local publication procedure below does not apply.

Use this file to change a document in `wiki/product-wiki/`. That folder is the approved description of the system: how the system must work, written as numbered rules.

`wiki/product-wiki/AGENTS.md` says which document holds what. It also gives the form of a document, the form of a rule and its four marks, a glossary term, an integration document, a diagram, and what must stay true. Read it before you write.

The mark of a rule is one of four words: Draft (the owner has not approved the rule yet), Approved, Built (a work item built what the rule says), or Retired (the rule no longer applies).

Before you write a rule, name the DEC ID behind the change. When `DECISIONS.md` has no entry for the change, do `record-decision.md` first. It sends you back here before its save.

## Which section of this file to use

| What you change | Section |
| --- | --- |
| A rule: a new one, a changed one, or one that no longer applies | Add or change a rule |
| The mark of a rule, when `managing-work-items` closes a work item that may have built what the rule says | Mark a rule Built |
| A term in the glossary | A glossary term |
| An integration document or a diagram | An integration document or a diagram |

## Add or change a rule

1. Search `wiki/product-wiki/` for the subject. When a rule already says it, add no second rule.
2. Choose the mark from the Status of the decision's entry: Decided gives Approved, and Open gives Draft. `wiki/product-wiki/AGENTS.md` explains each mark under "What each mark means". For a Draft rule, add its DEC ID under the document's Open questions.
3. Write the rule. Do what applies to it:
   - Give a new rule the next ID of the document's prefix, in the form that `wiki/product-wiki/AGENTS.md` gives.
   - For a changed rule, change its Rule line and its "Conditions and exceptions" line in place, under the same ID, and set its Source to the new DEC ID. Do not keep the old wording in the document, because the Superseded entry in `DECISIONS.md` holds it.
   - When the wording of a rule marked Built changes, set its mark back to Approved with the new DEC ID, because no work item has built the new wording yet.
   - For a rule that no longer applies, set its mark to Retired, and its Source to the DEC ID that retired it.
   - When a rule's Source names an SRC ID, add the rule ID to the "Used by" cell of that row in `sources/INDEX.md`.
4. When an Open entry becomes Decided, change each Draft rule that waited for it to Approved, and remove its DEC ID from Open questions.
5. Set the document's "Last changed via" line to the DEC ID. Set the document's Status again. `wiki/product-wiki/AGENTS.md`, section "The form of a document", says which Status applies.
6. Add one Changelog row. It holds the date, the change with the rule ID, the DEC ID, and the work item that caused the change or "none".
7. Add the rule ID to the Affects line of the entry in `DECISIONS.md`. Step 7 of `record-decision.md` writes the rule ID into each work item.
8. Make one save with `publish-docs`. The save holds the document, `DECISIONS.md`, and `sources/INDEX.md` when step 3 changed it.
   - When `record-decision.md` sent you here, do not save. Go back to it, and its step 6 makes the one save.

## Mark a rule Built

Use this section when `managing-work-items` closes a work item and names a rule that the work item may have built.

1. Check three conditions. The work item built what the rule says only when all three are true. When one is not true, change nothing, and tell `managing-work-items` which one.
   - The rule's mark is Approved.
   - The work item's change is on the default branch, and deployed when the work item has a deployment.
   - The owner approved the work item's result, and the work item's checker marked Met a requirement of the work item that builds or changes the behaviour the rule states. The checker is the separate agent that tested the result. A requirement that only names, explains, or documents the rule does not count.
2. When the work item built something that more than one work item depends on, and no rule covers it, the rule needs the owner's decision first. Do `record-decision.md`, which adds the rule and saves. Then come back here.
3. Change the mark to Built with the work item's ID. Change no other line of the rule.
4. Set the document's Status again. Add one Changelog row that holds the date, "<rule ID> built", the rule's DEC ID, and the work item's ID. "Last changed via" keeps the rule's DEC ID.
5. Save with `publish-docs`.
6. Give `managing-work-items` each rule ID, the commit ID, and whether the main checkout holds the save. `SKILL.md`, section "Check what you wrote, and report", says what to report about the main checkout. `managing-work-items` records the rule IDs in the work item.

## A glossary term

The glossary is `wiki/product-wiki/glossary.md`.

- Ask the owner first about a meaning that the owner did not give and no decision gives, such as one a source gives or one you worked out. Ask: "Add to the glossary: <term> means <meaning>?"
- A term the owner defined in the session needs no entry in `DECISIONS.md`. The row's Source is the owner's words with the date, and the Changelog row's DEC cell says "none".
- Search the table before you add a term. When the term is there, change its row.
- Add the Changelog row, set the Status again, and save with `publish-docs`.

## An integration document or a diagram

`wiki/product-wiki/AGENTS.md`, sections "An integration document" and "A diagram", give the steps for each. The rules inside an integration document follow "Add or change a rule" in this file. Save with `publish-docs`.
