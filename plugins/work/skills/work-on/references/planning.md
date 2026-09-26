# Planning and building a work item

Detail for `work-on` steps 6 to 10. Carried over from Toolkit V1's lifecycle
and planning rules, with V2 names.

## Roadmap and tasks

- The Roadmap is an ordered list of phases from where the item stands to the
  finished result. Name phases to fit the work. They do not have to match the
  fourteen lifecycle stages. "Phase" (`P1`) is the item's plan; "stage"
  (`08-build`) is the lifecycle. Never mix the two words.
- Build the phases from the approved design's Order of work. With no design
  (a small item that skipped design with a recorded reason), build them from
  the requirements.
- Each phase has one or more tasks, one or more sub-items, or both.
- Keep detail in proportion to the item. A one-hour fix needs one phase with
  one or two tasks.
- Link sources; do not copy them. A task names the `R-xx` it implements and
  the design section it follows.

Roadmap section format (the table keeps these columns in every tracker):

```markdown
A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 - CSV export button | The export button creates a file | In Progress | The file opens in Excel with every column | none |
| P2 - Large exports | Exports over 10,000 rows finish | Not Started | A 50,000-row export finishes in under a minute | WI-015 |
```

Tasks section format:

```markdown
### P1 - CSV export button

- [ ] **P1-T01 - Add the export endpoint** · In Progress  
  **Work:** Add the endpoint that streams the report rows as CSV (R-01, design Option A step 1).  
  **Deliverable:** The endpoint and its tests.  
  **Done when:** The endpoint test passes and a manual export opens in Excel.  
  **Depends on:** None.
```

- Task status words: Not Started, In Progress, Done, Cancelled.
- Tick a task (`- [x]`, status Done) only with evidence: the test result
  line, the commit, or what the owner saw.
- A done or cancelled task is not reopened. Add a new task instead.
- A task whose "Done when" names the owner (for example "the owner confirms
  the wording") is not ticked by the agent. It becomes an Open Questions row
  with "owner" as who decides.
- A phase that a sub-item delivers lists the sub-item id in its Sub-items
  column. The sub-item keeps its own requirements, design, roadmap, and
  approvals. Finishing it does not finish or approve the parent.

## Tracking setup (stage 07)

Only when the item needs it:

- **Branch and worktree** for code work, named `wi-<number>-<slug>`, for
  example `wi-007-csv-export`. Create the worktree next to the main checkout
  or under `.claude/worktrees/`, following the project's `AGENTS.md`.
- **Salesforce projects:** the item's manifest folder under
  `delivery/deployment/`, created and kept current by `sf-component-tracker`.
- **Sub-items** for phases that own real scope: open `work-organize`.

## Building (stage 08)

- Work on the item's own branch and worktree. Never on the default branch.
- One task at a time, in the order the Depends on lines allow.
- With a team: one `builder` agent per independent task, each with its own
  files. The main agent merges each builder's branch into the item's branch,
  checks the tests still pass, then ticks the task. Builders never change the
  work item.
- Tests go with each task. A check that could not run is reported as not
  run, never as passed.
- Salesforce: run `sf-component-tracker` after each metadata change. Anything
  that changes production data goes through `sf-data-change`; agents never
  write production data.
- When the build shows a requirement is wrong or missing, stop that task, add
  an Open Questions row, and open `work-requirements` for the change. Do not
  build around it.
- When the build shows the design does not work, record it in the item's
  Notes and open `solution-design` for a design change.

## Keeping the item current while building

- After each task: tick it with evidence, update Overview Current position
  and Next action, and add a history note when something changed the plan.
- Before stopping with work unfinished: Overview and Notes > Resume here say
  exactly where to pick up; `waiting_on` is true; `toolkit work validate`
  is clean. The `handoff` skill does this when the owner is clearing context.

## Several items at once

- Read each item's record before recommending an order. Say what can proceed
  independently, what depends on another outcome, and which one decision
  would unblock the most work.
- Each item has one main session that changes it. Other sessions return
  findings to it instead of editing the same record.
- Worktrees keep code apart; they do not keep shared environments apart.
  Check shared orgs, databases, and releases before two items change the same
  one.
