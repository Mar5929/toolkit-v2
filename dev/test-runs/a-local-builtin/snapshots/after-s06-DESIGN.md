---
work_item: WI-001
status: proposed
approved: "no"
---
# WI-001: Add a --version flag to the greet CLI — solution design

**Requirements:** WI-001  
**Design status:** Proposed  
**Requirements checked:** WI-001 Requirements, approved 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Pending

## What this design solves

People can run a new Node.js command to greet a named person, greet the world when they give no name, or print version `0.1.0`. The command must produce the exact output approved in WI-001. Handling other argument combinations remains unspecified.

## Requirements and design readiness

The requirements analyst found both approved requirements ready for design, with no material gap or owner question. Both options cover the same command behavior and differ in where the version number is stored.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Greeting | Finalized | Both options use the first name argument or `world` and write one line. | None |
| R-02 — Version flag | Finalized | Both options check for an exact `--version` argument before greeting. | Choose the version source in this design. |

## What exists today

`README.md` calls this a tiny Node.js command-line tool that greets people. The repository has no CLI source, `package.json`, or implemented tests. Node.js v25.8.1 is available in this session. No Git remote is configured.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | The command is `node bin/greet.js`. | WI-001 R-01, approved 2026-09-27 | Both options create this entry point. |
| Constraint | `--version` prints exactly `0.1.0` and takes precedence over a name. | WI-001 R-02, approved 2026-09-27 | Check the flag before greeting. |
| Constraint | Use plain Node.js without npm packages; use `node:test` for tests. | Project memory briefing, 2026-09-27 | No install step or external dependency. |
| Constraint | Compare two approaches, especially their version source. | Mike, 2026-09-27 | Present a `package.json` source and a CLI constant. |

## Design options

### Option A — Read the version from package.json

#### Approach

Create `package.json` with `"version": "0.1.0"`. Create `bin/greet.js` as a CommonJS script that reads `require('../package.json').version`. The package field is the only version source. Node.js can read the JSON directly, so no package installation is needed.

#### End-to-end behavior

1. A person runs `node bin/greet.js` with a name, no name, or `--version`.
2. The script checks `process.argv.slice(2)` for an argument exactly equal to `--version`. If present, it prints the version from `package.json` and ends. Otherwise, it prints a greeting for the first argument or `world`.
3. The person receives one line on standard output. The five approved commands print the exact lines in the acceptance table below.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `bin/greet.js` | It prints `Hello, Mike!\n` for `Mike` and `Hello, world!\n` with no argument. | Run the two greeting commands and compare exact output. |
| R-02 | New `package.json` and version branch in `bin/greet.js` | An exact flag check runs first; the `version` field supplies `0.1.0`. | Run all three approved flag commands and compare exact output. |

#### Technical shape

- **Components and files:** New `package.json` with a version field; new `bin/greet.js`; new `tests/greet.test.js` with five `node:test` cases. The existing `README.md` stays available as a short project description.
- **Data and state:** No persistent state. `package.json` owns the version number; the script reads it on each run.
- **Access and security:** The command reads its own package file and writes text to standard output. It does not evaluate an input name or pass it to a shell.
- **Integrations:** Node.js CommonJS JSON loading, `process.argv`, standard output, `node:test`, and `child_process.spawnSync`; no external service.
- **Operations:** Run `node bin/greet.js` directly. Change the `package.json` version field for a future version. Keep `package.json` beside `bin/` so the relative read path remains valid.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| An extra file is needed now. | Certain; small addition to a tiny tool. | Choose this option if package metadata will be useful. |
| Moving the files can break `require('../package.json')`. | Only if the layout changes; the command would fail on startup. | Update the relative path when moving the files, and rerun CLI tests. |

#### Build order

1. Add `package.json` with version `0.1.0`. No dependency. Check that Node.js reads the JSON and the field is exact.
2. Add `bin/greet.js`. Depends on step 1. Check the five approved commands by hand.
3. Add five `node:test` child-process cases in `tests/greet.test.js`. Depends on step 2. Check exit status, exact standard output, and empty standard error with `node --test tests/greet.test.js`.
4. Show the tested result to Mike. Depends on step 3. The owner decides whether to approve the result.

### Option B — Keep the version in the CLI

#### Approach

Create `bin/greet.js` with `const VERSION = '0.1.0'`. The constant is the only version source. Do not add `package.json` for this feature. Node.js runs the script and tests directly.

#### End-to-end behavior

1. A person runs `node bin/greet.js` with a name, no name, or `--version`.
2. The script checks `process.argv.slice(2)` for an argument exactly equal to `--version`. If present, it prints `VERSION` and ends. Otherwise, it prints a greeting for the first argument or `world`.
3. The person receives one line on standard output. The five approved commands print the exact lines in the acceptance table below.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `bin/greet.js` | It prints `Hello, Mike!\n` for `Mike` and `Hello, world!\n` with no argument. | Run the two greeting commands and compare exact output. |
| R-02 | New `VERSION` constant and version branch in `bin/greet.js` | An exact flag check runs first; the constant supplies `0.1.0`. | Run all three approved flag commands and compare exact output. |

#### Technical shape

- **Components and files:** New `bin/greet.js`; new `tests/greet.test.js` with five `node:test` cases. No `package.json` is needed. The existing `README.md` remains a short project description.
- **Data and state:** No persistent state. `VERSION` in `bin/greet.js` owns the version number.
- **Access and security:** The command writes text to standard output. It does not evaluate an input name or pass it to a shell.
- **Integrations:** Node.js `process.argv`, standard output, `node:test`, and `child_process.spawnSync`; no external service.
- **Operations:** Run `node bin/greet.js` directly. Change `VERSION` for a future version.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Adding package metadata later can create a second version value. | Only if `package.json` is later added; the two numbers could disagree. | Make the package field authoritative then, or add a check that keeps the two values equal. |

#### Build order

1. Add `bin/greet.js` with `VERSION = '0.1.0'`, the flag check, and greeting fallback. No dependency. Check the five approved commands by hand.
2. Add five `node:test` child-process cases in `tests/greet.test.js`. Depends on step 1. Check exit status, exact standard output, and empty standard error with `node --test tests/greet.test.js`.
3. Show the tested result to Mike. Depends on step 2. The owner decides whether to approve the result.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Version source | `package.json` version field | `VERSION` constant in `bin/greet.js` | Both are readable by built-in Node.js features. |
| Files added | `package.json`, CLI, and test file | CLI and test file | The repository has no package metadata today. |
| Future package metadata | Already has a single version field to use | Requires a version-source change or a consistency check | Future packaging is not an approved requirement. |
| Approved command output | All five cases | All five cases | Independent design critique found R-01 and R-02 satisfied in both. |

## Recommendation and owner decision

**Recommendation:** Option B. It meets the approved behavior with fewer files in this tiny repository. If package metadata becomes useful later, move the version source to its `version` field.  
**Owner decision:** Pending.  
**Reason for decision:** Pending owner decision.

## Selected design

Pending owner decision.

## Build and verification plan

### Technical sequence

After Mike chooses an option, follow its Build order and make its version source the only one in the implementation. Use one worktree for WI-001. Record the command outputs and test result in WI-001 before presenting the finished result for approval.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Run `node bin/greet.js Mike` and `node bin/greet.js`; compare standard output exactly. | `Hello, Mike!\n` and `Hello, world!\n`, respectively. | WI-001 test results |
| R-02 | Run `node bin/greet.js --version`, `node bin/greet.js Mike --version`, and `node bin/greet.js --version Mike`; compare standard output exactly. | `0.1.0\n` for each, with no greeting. | WI-001 test results |
| Result approval | Show the implementation and recorded test results to Mike. | Mike decides whether to approve the result. | WI-001 Recent History |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Exact greeting, version, and precedence | WI-001 Requirements | 2026-09-27 | Owner decision | Approval recorded in WI-001 |
| Three helpers and two approaches focused on version source | Mike's answer in WI-001 Recent History | 2026-09-27 | Owner decision | Owner's words recorded |
| No CLI source or package metadata exists | Repository file list and `README.md` | 2026-09-27 | Project evidence | Read the repository |
| CommonJS `require()` loads JSON | [Node.js CommonJS modules](https://nodejs.org/api/modules.html) | 2026-09-27 | Official documentation | Opened Node.js documentation |
| `version` is a `package.json` field, optional for unpublished packages | [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#version) | 2026-09-27 | Official documentation | Opened npm documentation |
| `node:test` supports built-in tests | [Node.js test runner](https://nodejs.org/api/test.html) | 2026-09-27 | Official documentation | Opened Node.js documentation |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | An absent name prints an empty greeting. | Use `world` when no argument is supplied; print `Hello, world!\n`. |
| R-02 | A name wins when combined with `--version`. | Check for the exact flag first, in either argument order; print only `0.1.0\n`. |
| Version source | Store `0.1.0` in both the CLI and package metadata. | Use only the selected option's source. Option A reads `package.json`; Option B defines `VERSION` in the CLI. |

## Notes

### Open design questions

None beyond Mike's choice between Option A and Option B.

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| 2026-09-27 | Use three helpers and compare two approaches, especially the version source. | Design options | Mike; approved way of working, design choice pending |

### Current position and next step

The requirements analyst found the approved requirements ready. The architect drafted both options. The independent critic found one unsupported packaging choice in Option A; it was removed and the critic confirmed no material finding remains. Mike chooses or approves an option before implementation planning.
