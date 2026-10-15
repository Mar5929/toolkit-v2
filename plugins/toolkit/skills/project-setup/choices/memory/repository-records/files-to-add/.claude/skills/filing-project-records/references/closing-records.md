# Filing records when a work item closes

`managing-work-items` calls this step from `closing.md` to fill the Moved up line. Shared decisions live in `DECISIONS.md`; the approved description of the system lives in `wiki/product-wiki/`. On the short path, build the list before the closing question.

1. **List what the project may need to keep.** Read the item's Q&A rows marked Decision? yes, its design, its Related items, and its unproven lessons. List:
   - decisions more than one item needs that aren't yet "Filed as DEC-###";
   - rules several items rely on that this item added, changed, or retired, and the wiki doesn't show yet;
   - Approved rules whose behavior this item's requirements built or changed (naming or documenting a rule doesn't count, and a cancelled item builds nothing);
   - project terms added or changed that the glossary doesn't show yet;
   - lessons without an outcome, with every date they were seen (check memory first through `managing-project-memory`).
2. **Ask the owner once**, if the list holds anything other than possibly-built rules: one Q&A row showing each line with a recommendation and a one-line reason. For a lesson the choices are keep for the whole project, keep as not proven, or drop; recommend keeping one that's been seen before.
3. **File what the owner agreed to.**
   - Decisions, open questions, and lessons about the system or project: `record-decision.md`.
   - Rules to add, change, or retire, possibly-built rules, and terms: `update-system-doc.md`.
   - Lessons about how to do a step or how the agent works, and lessons kept as not proven: `managing-project-memory`.
4. **Write the IDs** once `publish-docs` confirms the main checkout has the save. If it doesn't yet, stop, tell the owner, and have `managing-project-memory` record the wait.
5. **Mark each lesson's outcome** at the end of its line: "Moved up: DEC-021.", "Moved up: owner-preferences.md.", "Kept in memory.", "Kept in work item.", or "Dropped (Q-12)."
6. **Fill the Moved up line** with every DEC entry and wiki rule this item added or changed (by ID, with what happened), every glossary term it touched, and anything filed earlier in the item; or "None: <reason>". Add a Recent History row naming the Q-ID from step 2, or saying no question was needed.
