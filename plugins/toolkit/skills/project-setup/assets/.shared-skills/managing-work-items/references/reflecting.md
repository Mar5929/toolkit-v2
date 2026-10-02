# Reflecting

Looks back on the work just done, after the owner approved the result and before anything is merged or closed: make sure everything is clean and tidy, and check whether anything should go into the system guide or be saved to memory. Go through the checklist in order. No new approval is needed for it.

## Checklist

1. **The work item is tidy and current.**
   - Every task is ticked or cancelled, and every phase the item completed says Done.
   - No question row is left Open.
   - Every sub-item is Done or Cancelled, or was moved to another item.
   - The Current state matches the item's State, `waiting_on`, and approvals.
2. **The requirements match what was built.** Compare each Finalized `R-xx` with the checker's verdicts in Recent History. A requirement the build changed is a change to a requirement: handle it as `refining-requirements.md`, step 7, says.
3. **Decisions and lessons are offered to memory, once.**
   - Take the item's Questions and Answers rows with Decision? `yes`. Leave out approvals, the Done or cancel row, merge and deploy yeses, Superseded rows, and decisions already offered.
   - Add a lesson the build or the tests taught that a later item would otherwise find out again (a platform limit, an approach that failed).
   - Keep only what a later item, or an agent working on something else, would need to follow. Add one row per decision ("Save Q-04 to memory too?") and ask "These look project-wide. Save them to memory too?"
   - His yes: save with the memory save skill. A no: never offer it again. Nothing to offer: say so in one line.
4. **Project documents and the system guide are updated.**
   - Read `requirements/AGENTS.md`. Write into `requirements/` only the Finalized requirements the checker marked Met, each Source naming the item ID and Q-ID. Tell him in one line about a Finalized one that was not marked Met.
   - Update `system-guide/` only when the verified structure changed and `PROJECT.md` does not say it is unused.
   - Update `PROJECT.md`, `PROJECT-ROADMAP.md`, or a README only when the item made what it says out of date.
   - Save each with `publish-docs`, and add a Recent History row naming each file saved and the commit.

## When it is done

- Something to merge or deploy: the item moves to Deploying.
- Nothing to merge or deploy: add a Recent History row naming what was skipped and why ("Nothing to merge or deploy: Deploying skipped."), then ask him to mark it Done as `deploying.md`, "Marking Done", says.
