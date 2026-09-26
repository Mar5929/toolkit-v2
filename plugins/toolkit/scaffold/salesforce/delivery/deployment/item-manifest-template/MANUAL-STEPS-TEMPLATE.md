# <Work item ID, or "Full cutover"> manual deployment steps

Copy this file as `manual-steps.md` into the work item's folder under `delivery/deployment/`, or into `_master/` for the full cutover. Every step has the shape in the `sf-component-tracker` skill, Step 4. The owner runs the steps and updates each Status.

## Pre-deploy

### <Order, in gaps of 10>. <Title: short imperative step name>

- Phase: Pre-deploy
- Owner: <Who runs the step.>
- Status: <Not started, in progress, done, or skipped.>
- Source: <Work item ID and the implementation task that required this step.>

<Purpose, in one or two sentences.>

1. <Numbered operator instruction, with the exact org, object, and setting names.>
2. <Next instruction.>

Verification: <SOQL query, screenshot, or UI check that confirms the step worked.>

```text
<Inline script (anonymous Apex, SOQL, or CLI command), when the step needs one.>
```

## Deploy

<Steps in the same shape, if any: change-set builds or manual moves.>

## Post-deploy

<Steps in the same shape, if any: assignments, connector updates, schedules, backfills, and checks.>
