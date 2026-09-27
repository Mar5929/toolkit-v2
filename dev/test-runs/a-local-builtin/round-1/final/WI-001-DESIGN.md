---
work_item: WI-001
status: approved
approved: 2026-09-27 by Mike
---

# WI-001: Build greet CLI with version flag — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** WI-001 Requirements, 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

A person runs a small Node.js command to greet one person, greet the world, or see the tool's version. The command must produce the exact output in WI-001's approved requirements. This design chooses where `--version` gets its value. Behavior for extra arguments remains outside WI-001.

## Requirements and design readiness

The two requirements are approved and ready to design. The owner requested alternatives for the version source after withholding result approval. That choice is Q-02; it does not change the approved output.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Greet a person or the world | Finalized | Both options use the same argument handling and exact greeting output. | None |
| R-02 — Show the tool version | Finalized | Option A prints `0.1.0` and a newline for `--version` alone. | None; Mike chose Option A. |

## What exists today

Uncommitted files in the WI-001 worktree are `package.json`, `bin/greet.js`, `tests/greet.test.js`, and `tests/WI-001-TEST-PLAN.md`. The CLI currently imports `version` from `../package.json`. The package declares `0.1.0`. The automated version check compares CLI output with that package field. The item records three passing tests and direct runs on 2026-09-27. The code remains in the worktree for review; it is evidence for Option A, not an approved design.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Use plain Node.js without npm packages and `node:test`. | Owner preference in project memory; confirmed. | Both options use CommonJS and built-in Node.js APIs. |
| Constraint | Print exactly `0.1.0` plus a newline for `--version` alone and exit successfully. | WI-001 R-02; approved 2026-09-27. | The source may vary, but the initial output may not. |
| Constraint | Keep the current code in its worktree during design review. | Mike, 2026-09-27; confirmed. | No code changes before design choice. |
| Assumption | A version release should update the declared package version. | Agent proposal; open. | Option A uses that field directly; Option B needs synchronized edits. |

## Design options

### Option A — Read package.json

#### Approach

Keep `package.json` as the version's single source. `bin/greet.js` imports its `version` field with Node.js `require` and prints it for `--version` alone. Keep the existing greeting logic. This is the approach already written in the worktree.

#### End-to-end behavior

1. A person runs `node bin/greet.js Mike`, `node bin/greet.js`, or `node bin/greet.js --version`.
2. The CLI checks whether the sole argument is `--version`. For that case it reads the imported package version; otherwise it chooses the first argument or `world`.
3. It prints one line and exits successfully for the three required commands.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Reuse current `bin/greet.js` greeting branch. | It prints the named or default greeting. | Run the two greeting commands and `node --test`. |
| R-02 | Reuse `package.json` `version` and the CLI import. | CLI output follows the declared package version. | Compare `--version` output with the field and test the exact initial value. |

#### Technical shape

- **Components and files:** `package.json` owns `version`; `bin/greet.js` reads it; `tests/greet.test.js` checks it.
- **Data and state:** One version field in the local package file; no persistent runtime state.
- **Access and security:** Local CLI execution; no account or network access.
- **Integrations:** Node.js module loading reads the neighboring package file. A missing or invalid package file prevents the CLI from starting.
- **Operations:** A release changes `package.json` once; `--version` follows that change. Keep the package file with the CLI when distributing it.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| CLI depends on a readable `package.json` at the expected relative path. | Low in this repository; moving only the CLI file would break startup. | Distribute the package file with the CLI and retain the relative path. |
| The current test compares the CLI value with the same package field it reads. | The test could pass with an incorrect initial version. | Also assert that the initial package version and output are `0.1.0`. |

#### Build order

1. Keep the existing package and CLI files, then check that `--version` prints `0.1.0`.
2. Strengthen the version test to assert the approved initial value as well as the field match; run all acceptance checks.

### Option B — Store the version in the CLI

#### Approach

Put `0.1.0` in a constant in `bin/greet.js` and print that constant for `--version` alone. Keep the greeting behavior. Retain `package.json` for the package declaration and command mapping. This avoids reading the package file at runtime, but creates two places to update for a release.

#### End-to-end behavior

1. A person runs one of the three required commands.
2. The CLI checks whether the sole argument is `--version`. For that case it prints its version constant; otherwise it chooses the first argument or `world`.
3. It prints one line and exits successfully for the three required commands.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Reuse current greeting branch. | It prints the named or default greeting. | Run the two greeting commands and `node --test`. |
| R-02 | Change `bin/greet.js` to a version constant. | The constant starts at `0.1.0`; a check keeps it equal to the declared package version. | Assert exact output and compare with `package.json`. |

#### Technical shape

- **Components and files:** `bin/greet.js` holds the printed version; `package.json` still declares the package version; `tests/greet.test.js` compares them.
- **Data and state:** Two source values must stay equal; no persistent runtime state.
- **Access and security:** Local CLI execution; no account or network access.
- **Integrations:** No package file read when the CLI runs. The test reads `package.json` during development.
- **Operations:** Every version change updates both files; the test catches mismatches before delivery.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Package version and CLI constant can diverge. | Moderate on a later release; users may see the wrong version. | Require the automated equality check when changing versions. |
| Removes the runtime file dependency. | Useful only if the CLI is distributed without `package.json`; that use is not required. | Choose this if independent distribution becomes a real need. |

#### Build order

1. Change the CLI to use a version constant while leaving `package.json` at `0.1.0`.
2. Test exact output and equality with the package version, then run all acceptance checks.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Version updates | Change one field. | Change two values. | File structure and proposed code. |
| Runtime dependency | Needs neighboring `package.json`. | Version output needs only the CLI file. | Existing `require` call; no standalone distribution requirement. |
| Current code | Already written. | Requires a small code change. | WI-001 worktree, 2026-09-27. |
| Approved behavior | Meets R-01 and R-02. | Meets R-01 and R-02 if values stay equal. | Requirements and acceptance checks. |

## Recommendation and owner decision

**Recommendation:** Option A. The package already declares the version, and reading that field avoids duplicate values. Its cost is that `package.json` must remain beside the CLI.  
**Owner decision:** Mike chose Option A on 2026-09-27: "Go with option A."  
**Reason for decision:** `package.json` already declares the version, so the CLI can read one source value.

## Selected design

Use Option A: keep the version in `package.json` and have `bin/greet.js` read its `version` field. Keep the existing greeting branch. Assert both the initial `0.1.0` value and the CLI output in the automated check.

### End-to-end flow

For `--version` alone, read the imported package version and print it with a newline. For one name, print `Hello, <name>!`; with no name, print `Hello, world!`.

### Components and responsibilities

`package.json` owns the version. `bin/greet.js` reads and prints it. `tests/greet.test.js` checks the exact initial version, the package field, and the required greeting output.

### Data, access, and integration details

The version is local package data. Node.js module loading reads `package.json` through a relative path. No account, network access, or persistent runtime state is involved.

### Edge cases and failure behavior

If `package.json` is missing or invalid, Node.js cannot load the CLI. Keep it with the CLI. Behavior with additional arguments is outside WI-001's approved requirements.

### Release and ongoing operation

Change the `version` field in `package.json` for a future release. Keep `package.json` beside the CLI when distributing it.

## Build and verification plan

### Technical sequence

1. Record Mike's choice for Q-02 and the design approval.
2. Keep the existing Option A CLI and strengthen the version test to assert `0.1.0`.
3. Run the direct commands and `node --test`; return the result for owner approval.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Run both greeting commands and `node --test`. | Exact named and default greeting lines, each with a newline. | `tests/greet.test.js` and WI-001 test plan. |
| R-02 | Run `node bin/greet.js --version`; compare with `package.json`; run `node --test`. | Exact `0.1.0` plus newline, successful exit, and equality with the declared version. | `tests/greet.test.js` and WI-001 test plan. |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Approved outputs and initial version | WI-001 Requirements | 2026-09-27 | Owner decision | Read R-01, R-02, and approval field. |
| Existing CLI reads `package.json` | `bin/greet.js` in WI-001 worktree | 2026-09-27 | Project evidence | Read current file. |
| Existing package version is `0.1.0` | `package.json` in WI-001 worktree | 2026-09-27 | Project evidence | Read current file. |
| Mike wants design options before result approval and wants code retained. | Owner message | 2026-09-27 | Owner decision | Recorded in WI-001 history. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-02 | Print a label such as `greet 0.1.0`. | Print only `0.1.0` and a newline. |
| Option A | Hardcode the version in the CLI as well as `package.json`. | Read `package.json` at runtime; retain one source value. |
| Option B | Update only the CLI constant on later releases. | Keep the CLI constant and package version equal, checked by a test. |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Q-02: choose Option A or Option B for the version source. | R-02 and Selected design | Mike | Answered 2026-09-27: Option A | Use `package.json` as the version source. |

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| 2026-09-27 | Mike withheld result approval and asked for design options. | Design options and owner decision | Owner message; design pending. |
| 2026-09-27 | Mike chose Option A: "Go with option A." | Selected design and version test plan | Owner decision. |

### Current position and next step

Mike chose Option A. The existing code remains uncommitted in its WI-001 worktree. Strengthen the version test, run the acceptance checks, and return the result for approval. Result approval remains outstanding.
