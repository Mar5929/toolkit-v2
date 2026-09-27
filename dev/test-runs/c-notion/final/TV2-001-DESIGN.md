Design of TV2-001 (approved) at https://app.notion.com/p/TV2-001-Write-a-short-project-brief-in-README-md-solution-design-3e8b381da1768115ba32e17059f0e746

---
work_item: TV2-001
status: approved
approved: "2026-09-27 by Mike Rihm"
---
# TV2-001: Write a short project brief in README.md — solution design

**Requirements:** TV2-001

**Design status:** Approved

**Requirements checked:** TV2-001 Requirements, 2026-09-27

**Last updated:** 2026-09-27

**Design approval:** Approved by Mike Rihm on 2026-09-27

## What this design solves

People new to Node who clone the repository need a short brief at the top of README.md. It explains the script, how to run it, and how to add a quote.

## Requirements and design readiness

R-01 through R-04 were approved by Mike Rihm on 2026-09-27. The parent keeps all four requirements. TV2-002 delivers R-04.

## What exists today

README.md has a title, paragraph, and sections for purpose, setup, project records, and checks. The earlier README commit e8c9796 has an unapproved result. quote.js contains a quotes array of strings, selects one at random, and prints it.

## Constraints and assumptions

- The brief uses short bullets immediately after the README title.
- The existing README sections stay below the brief.
- TV2-002 owns the quote instruction in README.md.

## Design options

### Option A — One short brief

Add a Project brief heading and four bullets: For, What it does, Run it, and Add a quote. TV2-001 adds the first three bullets. TV2-002 adds the fourth bullet for separate review.

### Option B — Brief with small sections

Add an audience bullet and three small sections. This uses more headings and may repeat the existing sections.

## Option comparison

Option A uses one list and changes fewer lines. Option B uses more headings.

## Recommendation and owner decision

**Recommendation:** Option A.

**Owner decision:** Mike Rihm chose Option A on 2026-09-27 and requested TV2-002 for the how to add a quote instruction.

**Reason for decision:** The owner selected Option A and requested separate review for R-04.

## Selected design

- Add a Project brief heading immediately after the README title.
- TV2-001 adds three short bullets: intended readers, what quote.js does, and how to run it.
- TV2-002 adds a fourth bullet that tells a reader to add a quoted string to the quotes list in quote.js.
- Keep the rest of README.md below the brief. Build and review the parent portion before the child portion so the quote instruction has its own result review.
- No script change, installation step, or deployment is needed.

## Diagrams

No diagram is needed for this README edit.

## Build and verification plan

1. In the TV2-001 worktree, add the heading and first three bullets. Check their wording against quote.js, run node quote.js, and check the diff.
2. Ask Mike to review the TV2-001 result.
3. In a TV2-002 worktree, add the fourth bullet. Compare it with the quotes list and ask Mike to review the TV2-002 result separately.
4. Merge only after the relevant result and merge approvals. The repository currently has no remote.

## Sources and decisions that affect the build

- TV2-001 approved requirements, 2026-09-27.
- Mike Rihm selected Option A and requested TV2-002, 2026-09-27.
- quote.js and README.md, read locally on 2026-09-27.
- The earlier result and merge were declined, per TV2-001 history.

## Where a builder could misread this design

- TV2-002 writes the R-04 instruction. The TV2-001 result review covers R-01 through R-03.
- TV2-002 changes README.md, not quote.js.

## Notes

### Open design questions

None.

### Design changes during the interview

The owner requested a separate sub-item for the Add a quote bullet after choosing Option A.

### Current position and next step

Build the TV2-001 portion.
