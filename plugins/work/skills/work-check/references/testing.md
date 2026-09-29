# Testing a work item

How `work-check` decides what to check, writes a test plan when one is
needed, briefs the independent checker, runs the fix loop, and records the
result.

## Contents

1. What to check against
2. When a test plan is needed
3. Writing the test plan
4. Briefing the acceptance checker
5. The check and fix loop
6. Recording the result
7. Showing the result to the owner

## 1. What to check against

Read these before running anything:

- every `R-xx` block and its Acceptance check, and the item's Acceptance
  list: `toolkit work show <id>`;
- the design's "Build and verification plan" > Acceptance checks, and the
  selected option's "How to check it" column: `toolkit work design <id>`
  (it exits 1 when the item has no design);
- a sub-item whose show output says "Design: none of its own; WI-012's design
  is approved" is checked against the parent's design:
  `toolkit work design <parent-id>`;
- the Tasks section, to know what was built and on which branch.

## 2. When a test plan is needed

A test plan is needed when a check has several scenarios, a manual step, test
data, or a release across environments. The item's own acceptance checks are
enough when each one is a single automated test or a single observation.

## 3. Writing the test plan

- [ ] Work in the item's worktree, on its branch. Never on the default branch.
- [ ] Copy the project's `tests/TEST-PLAN-TEMPLATE.md` to
      `tests/<id>-TEST-PLAN.md`, for example `tests/WI-012-TEST-PLAN.md`.
      Leave the template unchanged. The project has no template: copy this
      skill's `assets/TEST-PLAN-TEMPLATE.md` instead, which is the same
      template as new projects get. Leave out its first line, the
      "Generated file" comment: it names a toolkit file, not a project one.
- [ ] Fill it as its guide comment says: Scope (the `R-xx` and items
      checked), Environment and data, one Checks row per scenario, then
      Results and follow-up. Delete the guide and the example row.
- [ ] Commit it on the item's branch with the results filled in, staged by
      name (`git-rules.md`).
- [ ] Never save it in `.work-items/`: Git ignores that folder, so the plan
      would never be committed.

One Checks row:

```markdown
| A manager clicks Export on the September report | A CSV file downloads and opens in Excel with all 12 columns | Manual, in the staging app | tests/evidence/wi-012-export.png |
```

## 4. Briefing the acceptance checker

The checker is never the agent or session that built the change. It runs
before every result approval, whoever built the change: a delivery choice or
a no to the team question never removes it (`helpers.md`, section 6). Brief
the `acceptance-checker` (Claude Code: `work:acceptance-checker`; Codex: the
text of `references/agent-acceptance-checker.md`, given to a `spawn_agent`
worker with `fork_turns` set to `none`) with, pasted in:

1. The item id.
2. The Agreed goal, every `R-xx` with its acceptance check, and the
   Acceptance list.
3. The design's Acceptance checks and the "How to check it" column.
4. The test plan, when there is one.
5. The branch and the exact commit to check.
6. The job: "Return one verdict per requirement (met, partly met, not met)
   with evidence, defects seen in the diff, and checks that could not run.
   Flag only gaps that affect correctness or the stated requirements."
7. Files it may write: nothing.

## 5. The check and fix loop

Repeat until clean, or until a failure needs the owner:

- [ ] Run the project's tests and every acceptance check the item lists.
- [ ] Brief the checker, or brief it again after a fix, naming the new commit.
- [ ] A failure: set the bug-fixing stage, add a task for it, and fix it (a
      `builder` agent when a team was recorded or the owner agreed, otherwise
      the main agent).
      `toolkit work set <id> --stage 10-bug-fixing`
- [ ] Set the testing stage again and repeat.
      `toolkit work set <id> --stage 09-testing`
- [ ] Stop the loop when every requirement is met, or when a failure needs an
      owner decision: add an Open Questions row and set the item waiting on
      him.
- [ ] A failure that shows a requirement is wrong goes to `work-requirements`,
      never around it.

A check that did not run is reported as not run, never as passed.

## 6. Recording the result

One history note that says what was checked, the checker's verdict, where
the evidence is, and the gaps. The words `acceptance-checker:` in the note
are how `toolkit work` knows the check ran: without them, moving the item to
stage 11 or recording the result approval prints a note that no independent
check is recorded.

```text
toolkit work history <id> --note 'Checked: R-01 to R-03 against commit 4f2a9c1; acceptance-checker: R-01 to R-03 met; evidence: tests/WI-012-TEST-PLAN.md and the checker report; gaps: none' --effect 'Result approval asked.'
```

When this host had no way to start a worker, write
`acceptance-checker: none, <why>` and say so to the owner first.

## 7. Showing the result to the owner

In this order:

1. What the result does now, in his terms: "The export button now creates a
   CSV file that opens in Excel."
2. How he can see it himself: the link, the command to run, or a screenshot.
3. The evidence: the tests run and their result lines, the checker's
   verdicts.
4. The gaps: anything partly met, not run, or known to be missing. Never hide
   a gap to get an approval. When no independent check ran, say so first.
5. One question: "Do you approve this result?"
