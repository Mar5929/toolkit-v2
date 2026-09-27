# Keep the Active Work Item Accurate

The work tracker is the source of truth for current work.

- Before substantial work, use the `work-on` skill. Read the active item's requirements, state, next step, and blockers.
- Save the owner's decisions, requirements, and corrections in the item or its linked document before moving on.
- When the work needs the owner's decision, add it to the item's Open Questions with "Decision needed from: owner" and set the item's `waiting_on` to `owner`. The `work-decide` skill records the answer.
- `build` and `data-load` work needs approved requirements before it starts. A later stage does not revoke that approval.
- After the owner accepts agent-led delivery, ask how the team is arranged. That choice authorizes helpers for that goal only.
- Mark an item Done only after the owner approves the result.
- Before ending unfinished work, record the exact next step in the item.

`toolkit work lifecycle` prints the stages, statuses, and approval gates. "Where information goes" in `AGENTS.md` is the routing table; the `work-delegate` skill holds the delivery offer and team questions, and the `handoff` skill holds the handoff steps.
