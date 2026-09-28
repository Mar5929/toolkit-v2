# Planning and building a work item

The Roadmap and Tasks formats, tracking setup, and the build rules for
`work-on` stages 06 to 08.

## Contents

1. Roadmap and tasks
2. The Roadmap format
3. The Tasks format
4. Status words and ticking a task
5. Tracking setup (stage 07)
6. Building (stage 08)
7. Keeping the item current while building
8. Checklist before stopping

## 1. Roadmap and tasks

- The Roadmap is an ordered list of phases from where the item stands to the
  finished result. Name phases to fit the work. "Phase" (`P1`) is the item's
  plan; "stage" (`08-build`) is the lifecycle. Never mix the two words.
- Build the phases from the approved design's "Build and verification plan"
  (its Technical sequence and Acceptance checks) and the chosen option's
  Build order. With no design (a small item that skipped design with a
  recorded reason), build them from the requirements.
- A sub-item that inherits its parent's approved design is planned from the
  parent's design: `toolkit work design <parent-id>`.
- Each phase has one or more tasks, one or more sub-items, or both.
- Keep detail in proportion. A one-hour fix needs one phase with one or two
  tasks.
- Link sources; do not copy them. A task names the `R-xx` it implements and
  the design section it follows.

## 2. The Roadmap format

The table keeps these columns in every tracker. The phase name follows an em
dash, as in the template.

```markdown
A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — CSV export button | The export button creates a file | In Progress | The file opens in Excel with every column | None. |
| P2 — Large exports | Exports over 10,000 rows finish | Not Started | A 50,000-row export finishes in under a minute | WI-015 |
```

## 3. The Tasks format

Each phase gets a `###` heading with the same phase id and name as its
Roadmap row. Each task field (`**Work:**`, `**Deliverable:**`,
`**Done when:**`, `**Depends on:**`) starts its own line, and every line of a
task but the last ends with two spaces, which Markdown reads as a line break.
Never run the fields together on one line.

```markdown
### P1 — CSV export button

- [ ] **P1-T01 — Add the export endpoint** · In Progress  
  **Work:** Add the endpoint that streams the report rows as CSV (R-01, design Technical sequence step 1).  
  **Deliverable:** The endpoint and its tests.  
  **Done when:** The endpoint test passes and a manual export opens in Excel.  
  **Depends on:** None.
- [ ] **P1-T02 — Add the Export button** · Not Started  
  **Work:** Add the button that calls the endpoint (R-01).  
  **Deliverable:** The button and its test.  
  **Done when:** Clicking Export downloads the file.  
  **Depends on:** P1-T01.
```

Save both sections with the section command (`work-item-format.md`,
"Changing one section"):

```text
toolkit work edit <id> --section Roadmap --set-file <file>
toolkit work edit <id> --section Tasks --set-file <file>
```

## 4. Status words and ticking a task

- Phase status: Not Started, In Progress, Done (Cancelled for a phase that
  was dropped). Use no other word, such as "Planned".
- Task status: Not Started, In Progress, Done, Cancelled.
- From stage 07 on, `toolkit work validate` warns when the Roadmap has no
  phase table, when Tasks has no checkbox lines, and when a template example
  row or task is left.
- Tick a task (`- [x]`, status Done) only with evidence: the test result
  line, the commit, or what the owner saw.
- A done or cancelled task is not reopened. Add a new task instead.
- A task whose "Done when" names the owner (for example "the owner confirms
  the wording") is not ticked by the agent. It becomes an Open Questions row
  with `owner` as who decides.
- A phase that a sub-item delivers lists the sub-item id in its Sub-items
  column. Finishing the sub-item does not finish or approve the parent.
- When the item is finished, every phase it completed says Done.

## 5. Tracking setup (stage 07)

Only what the item needs:

- **Branch and worktree** for code work: the worktree
  `.claude/worktrees/<prefix>-<number>-<slug>` on the branch
  `claude/<prefix>-<number>-<slug>`, as the project's
  `.claude/rules/shared-repository-work.md` says. `toolkit work show <id>`
  prints the exact names. For WI-007:
  `git worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export`
  In Codex this Git write needs the owner's approval and escalated
  permissions (`git-rules.md`).
- **Salesforce projects:** the item's deployment folder
  `delivery/deployment/<work-item-id>-<short-name>/`, copied from
  `delivery/deployment/work-item-deployment-template/` and kept current by
  `sf-component-tracker`.
- **A test plan**, when the checks need more than the item's acceptance
  checks (several scenarios, a manual check, or a release): `work-check`
  writes it, in `tests/` on the item's branch.
- **Sub-items** for phases that own real scope: open `work-organize`.

## 6. Building (stage 08)

- Work on the item's own branch and worktree. Never on the default branch.
- One task at a time, in the order the Depends on lines allow.
- Commit with files staged by name and a plain message. No `Co-Authored-By`
  line naming an AI and no "Generated with" line (`git-rules.md`).
- With a team recorded by `work-delegate`: one `builder` agent per
  independent task, each with its own files. The main agent merges each
  builder's branch into the item's branch, checks the tests still pass, then
  ticks the task. Builders never change the work item.
- In Codex, a builder gets no worktree by itself. Before each one starts, the
  main agent makes its worktree and branch and names the folder in the
  brief; with approvals off, one builder at a time in the item's own worktree
  (`helpers.md`, section 2, "Codex builders").
- Tests go with each task. A check that could not run is reported as not
  run, never as passed.
- Salesforce: run `sf-component-tracker` after each metadata change. Anything
  that changes production data goes through `sf-data-change`; agents never
  write production data.
- The build shows a requirement is wrong or missing: stop that task, add an
  Open Questions row, and open `work-requirements`. Do not build around it.
- The build shows the design does not work: record it in the design's Notes
  and open `solution-design` for a design change.

## 7. Keeping the item current while building

After each task:

- tick it with evidence;
- update Overview Current position and Next action;
- add a history note only when something changed the plan.

The owner may edit the record while you build. Read the section again right
before you change it.

## 8. Checklist before stopping

Before the reply that ends a session with work unfinished:

- [ ] Overview Current position and Next action say where things stand.
- [ ] Notes > Resume here says exactly where to pick up.
- [ ] `waiting_on` is true: `owner` only while a question for him is open.
- [ ] One history note says what changed in this session.
- [ ] `toolkit work validate <id>` is clean.
- [ ] The current focus names the item and its real next step
      (`current-focus.md`).
- [ ] The reply ends with the one question for the owner, or the exact words
      that continue ("Say 'keep going' and I'll build P1.").

The `handoff` skill does this when the owner is clearing context.
