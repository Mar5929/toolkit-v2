# Update a system document

`wiki/product-wiki/` is the approved description of the system, written as numbered rules. Its `AGENTS.md` gives the document, rule, glossary, integration, and diagram forms and the four marks; read it first. Every rule change names a DEC ID; if `DECISIONS.md` has no entry, do `record-decision.md` first (it sends you back here before its save).

## Add or change a rule

1. Search the wiki; never add a second rule that says the same.
2. Mark it from the decision's status: Decided gives Approved, Open gives Draft (and the DEC ID goes under the document's Open questions).
3. A new rule gets the next ID for the document's prefix. A changed rule is edited in place under the same ID with its Source set to the new DEC; old wording isn't kept here, because the superseded entry holds it. Changed wording on a Built rule drops it back to Approved. A rule that no longer applies becomes Retired. A rule sourced from an SRC ID goes in that source's "Used by" cell.
4. When an Open entry becomes Decided, its Draft rules become Approved and leave Open questions.
5. Set "Last changed via" to the DEC ID, reset the document's Status, and add a Changelog row (date, change with rule ID, DEC ID, causing work item or "none").
6. Add the rule ID to the DEC entry's Affects, then save with `publish-docs`, unless `record-decision.md` sent you here, in which case it saves.

## Mark a rule Built

At closing, a rule becomes Built only if all three hold: it's Approved; the item's change is on the default branch (and deployed, if it has a deployment); and the owner approved the result with the checker marking Met a requirement that builds or changes the rule's behavior. If any fails, change nothing and say which. If the item built something shared that no rule covers, record the decision first. Then set Built with the item's ID, reset the Status, add a "<rule ID> built" Changelog row, save, and report each rule by its heading and ID, the commit, and whether the main checkout has the save.

## Glossary terms

In `wiki/product-wiki/glossary.md`. Ask the owner before adding a meaning they didn't give. A term the owner defined in the session needs no DEC entry: its Source is their words and the date, and its Changelog DEC cell is "none". Update an existing row rather than adding a duplicate, then add the Changelog row, reset the Status, and save.

## Integration documents and diagrams

Follow their sections in `wiki/product-wiki/AGENTS.md`. Rules inside an integration document follow "Add or change a rule". Save with `publish-docs`.
