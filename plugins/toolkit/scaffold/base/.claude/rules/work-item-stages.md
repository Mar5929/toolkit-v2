# Keep the Active Work Item Accurate

The work tracker is the source of truth for current work.

- Before substantial work, use the `work-on` skill. Read the active item's requirements, state, next step, and blockers.
- Save the owner's decisions, requirements, and corrections in the item or its design before moving on. Answers that arrive later go through `work-decide`.
- `build` and `data-load` work needs approved requirements before it starts. A later stage does not revoke that approval.
- When the item needs a decision from the owner, add it to Open Questions with "Decision needed from: owner" and set `waiting_on` to `owner`: `toolkit work set <id> --waiting-on owner` with the local or Notion tracker; the label the written instructions name with GitHub or Jira.
- After the owner accepts agent-led delivery, ask how the team is arranged. That choice authorizes helpers for that goal only.
- Mark an item Done only after the owner approves the result.
- Before ending unfinished work, record the exact next step in the item.

`toolkit work lifecycle` prints the stages, statuses, approval gates, and the skill that continues each stage.
