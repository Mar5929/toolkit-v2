---
work_item: WI-002
status: approved
approved: 2026-09-27 by Mike
---

# WI-002: Add --version flag — solution design

**Requirements:** WI-002  
**Design status:** Approved  
**Requirements checked:** WI-002 Requirements, 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

A person running the greeting CLI can ask for its version. This design covers only `--version`; basic greetings belong to WI-001.

## Requirements and design readiness

WI-002 R-01 has the same behavior as the previously approved WI-001 R-02. Mike approved WI-002 R-01 on 2026-09-27.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Show the tool version | Finalized | Option A reads `package.json` and prints its version. | None. |

## What exists today

The uncommitted WI-001 worktree contains `package.json`, `bin/greet.js`, and `tests/greet.test.js`. The package declares `0.1.0`; the CLI reads that field, and the version check passed on 2026-09-27. The files remain shared with WI-001 pending delivery separation.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Use plain Node.js without npm packages and test with `node:test`. | Owner preference in project memory, confirmed. | Use built-in module loading and tests. |
| Constraint | Print only `0.1.0` and a newline for `--version` alone. | Previously approved WI-001 R-02, moved to WI-002 R-01. | Do not add a label or other output. |
| Decision | Read the version from `package.json` (Option A). | Mike, 2026-09-27, original WI-001 design. | Use one declared version source. |

## Design options

### Option A — Read package.json

#### Approach

Keep the version in `package.json`. For `--version` alone, `bin/greet.js` reads its `version` field and prints it. The existing worktree code uses this approach.

#### End-to-end behavior

1. A person runs `node bin/greet.js --version`.
2. The CLI recognizes the sole argument and reads the imported package version.
3. The CLI prints `0.1.0` and a newline, then exits successfully.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Reuse `package.json`, `bin/greet.js`, and the version check. | The printed value follows the declared package version. | Run the command and assert the exact initial output and package match. |

#### Technical shape

- **Components and files:** `package.json` owns the version; `bin/greet.js` reads it; `tests/greet.test.js` checks it.
- **Data and state:** One local version field; no persistent runtime state.
- **Access and security:** Local CLI execution; no account or network access.
- **Integrations:** Node.js loads the neighboring package file. Missing or invalid JSON prevents startup.
- **Operations:** A future release changes the package version once; keep the package file beside the CLI.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| The CLI needs the neighboring `package.json`. | Moving the CLI alone would break startup. | Keep the package file with the CLI. |

#### Build order

1. Keep the existing Option A implementation.
2. Check exact output and equality with the declared version.

### Option B — Store the version in the CLI

#### Approach

Put `0.1.0` in a CLI constant and print it for `--version`. Keep `package.json` for the package declaration. This allows the CLI file to print its version alone but requires two values to stay equal.

#### End-to-end behavior

1. A person runs `node bin/greet.js --version`.
2. The CLI recognizes the sole argument and reads its version constant.
3. The CLI prints `0.1.0` and a newline, then exits successfully.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Change `bin/greet.js` to a constant. | The constant begins at the approved version. | Assert exact output and equality with `package.json`. |

#### Technical shape

- **Components and files:** `bin/greet.js` owns the printed constant; `package.json` still declares the package version.
- **Data and state:** Two version values must remain equal.
- **Access and security:** Local CLI execution; no account or network access.
- **Integrations:** The version command does not read the package file at runtime.
- **Operations:** Every version update changes two files, checked by a test.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| The two values may differ. | A later release could print the wrong version. | Test equality on each change. |

#### Build order

1. Add the CLI constant.
2. Check output and equality with the package version.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Version updates | Change one field. | Change two values. | Current file structure. |
| Runtime dependency | Needs `package.json`. | CLI constant works without it. | No standalone CLI distribution requirement. |
| Current code | Already written. | Needs a change. | WI-001 worktree, 2026-09-27. |

## Recommendation and owner decision

**Recommendation:** Option A, because the package already declares the version and one value is simpler to maintain.  
**Owner decision:** Mike approved Option A for WI-002 on 2026-09-27: "I approve the WI-002 design, option A. Keep going."  
**Reason for decision:** Mike did not state a separate reason.

## Selected design

Option A is the approved WI-002 design.

### End-to-end flow

For `--version` alone, read the imported package version and print it with a newline, then exit successfully.

### Components and responsibilities

| Component or file | New, changed, or reused | Responsibility | Requirement IDs |
| --- | --- | --- | --- |
| `package.json` | Reused | Declare `0.1.0`. | R-01 |
| `bin/greet.js` | Reused | Print the declared version for `--version`. | R-01 |
| `tests/greet.test.js` | Reused | Check exact output and package equality. | R-01 |

### Data, access, and integration details

The version is local package data loaded by Node.js through a relative path. No account, network access, or persistent runtime state is involved.

### Edge cases and failure behavior

| Situation | Expected behavior | How it will be checked |
| --- | --- | --- |
| `package.json` is missing or invalid. | Node.js cannot start the CLI; distribute the package file with it. | Keep the file in the package. |
| Extra arguments accompany `--version`. | Outside WI-002 R-01. | No acceptance check required. |

### Release and ongoing operation

Change the `version` field in `package.json` for future releases and keep that file beside the CLI.

## Build and verification plan

### Technical sequence

1. Record WI-002 design approval; its requirements were approved on 2026-09-27.
2. Keep the retained Option A code, run the direct version command and `node --test`, then seek separate result approval.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Direct run and automated test. | Exact `0.1.0` plus newline, successful exit, and match with `package.json`. | `tests/greet.test.js` and `tests/WI-002-TEST-PLAN.md`. |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Initial version and exact output | WI-001 historical R-02 | 2026-09-27 | Owner decision | Read original item history and current WI-002 R-01. |
| Option A selected | WI-001 historical DESIGN.md | 2026-09-27 | Owner decision | Read approved design and Mike's recorded choice. |
| Existing CLI reads `package.json` | WI-001 worktree `bin/greet.js` | 2026-09-27 | Project evidence | Recorded independent acceptance check. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Print `greet 0.1.0`. | Print only `0.1.0` and a newline. |
| Option A | Hardcode a second version value in the CLI. | Read `package.json`. |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Approve this WI-002 design after requirements approval. | Design approval | Mike | Answered 2026-09-27: Option A approved. | Verify the result under WI-002. |

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| 2026-09-27 | Mike chose Option A for the original combined design. | Selected design | Approved for WI-001; pending separate WI-002 approval. |
| 2026-09-27 | Mike moved --version into WI-002. | Scope and requirement links | Owner request; split recorded. |
| 2026-09-27 | Mike approved Option A for WI-002. | Selected design | Approved for WI-002. |

### Current position and next step

Option A is approved for WI-002. The version command and automated test passed on 2026-09-27. Seek separate WI-002 result approval.
