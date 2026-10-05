# Keep the Active Work Item Accurate

While you work an item, keep its whole record true, not only its Current state: each task's status and who does it, each phase's status, and every field you have information for. The work item template gives the form of each field, such as the five Current state lines, the three forms of Next action, and a Questions and Answers row: `assets/work-item-template.md` in `running-work-item-lifecycle`.

## Current state

- When the item waits on the owner, write Next action in the template's waiting form, with the first open question.
- The item's fields win when they disagree with Next action: when its status, State, `waiting_on`, approvals, or ticked tasks say something else, rewrite Next action to match them.

## Questions and decisions

- Save the owner's requirements and corrections in the item, or in its design when they change the design, before moving on.

## Approvals

- Moving an item to a later State does not revoke its requirements approval.

## Before you stop

- Before ending unfinished work, rewrite the item's Current state so its Next action names the exact next step.
