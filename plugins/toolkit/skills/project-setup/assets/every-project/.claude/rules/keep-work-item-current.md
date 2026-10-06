# Keep the Active Work Item Accurate

While you work on a work item, keep the whole work item true, and not only its Current state. A work item's Current state is the five lines at the top of the work item that say where it stands. Keep these true as well: the status of each task and who does it, the status of each of the work item's phases, and every field you have information for.

The work item template gives the form of each field, such as the five Current state lines, the three forms of Next action, and a Questions and Answers row. The template is `assets/work-item-template.md` in the `running-work-item-lifecycle` skill.

## The work item's Current state

- When the work item waits on the owner, write Next action in the form that the template gives for a work item that waits, with the first open question.
- When Next action disagrees with the work item's fields, the fields are right. Rewrite Next action to match the work item's status, its State, its `waiting_on`, its approvals, and its ticked tasks.

## Questions and decisions

- Save the owner's requirements and corrections before you go on. Save them in the work item, or in the work item's design when they change the design.

## Approvals

- A work item keeps its requirements approval when it moves to a later State.

## Before you stop

- Before you end work that is not finished, rewrite the work item's Current state so that its Next action names the exact next step.
