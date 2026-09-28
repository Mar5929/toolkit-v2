---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike"
---

# WI-001: Add a --shout flag to the greet CLI — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** `.work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WORK-ITEM.md`, 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike on 2026-09-28

## What this design solves

People running `node bin/greet.mjs` can add `--shout` before or after an optional name and receive the entire greeting in capital letters. The command keeps its current greeting when the flag is absent. `README.md` will show how to use the flag. This design covers WI-001's agreed goal and no other flags.

## Requirements and design readiness

The approved requirements describe a complete result for this small command. Both requirements are Finalized, and neither needs another owner decision before design review.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Capitalize the whole greeting with `--shout` | Finalized, approved by Mike on 2026-09-28 | Option A: argument selection and uppercase output | None |
| R-02 — Document the flag | Finalized, approved by Mike on 2026-09-28 | Option A: `README.md` example | None |

## What exists today

Source inspection shows that `bin/greet.mjs` exports `greet(name = 'world')`, which returns `Hello, ${name}!`. Its CLI reads `process.argv.slice(2)` and passes only `args[0]` to `greet`. Thus the code currently treats `--shout` in the first position as a name. `test/greet.test.mjs` checks only `greet()` and `greet('Mike')`; it does not run the CLI. `README.md` shows the basic named greeting and no flag. These are code and file observations; the command has not been run for this design.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Keep the existing greeting when `--shout` is absent. | WI-001 R-01, approved 2026-09-28 | Leave the `greet` result unchanged unless the flag is present. |
| Constraint | `--shout` may precede or follow the optional name. | WI-001 R-01, approved 2026-09-28 | Select the name after excluding the recognized flag. |
| Constraint | Every CLI flag must be documented in `README.md`. | WI-001 R-02, approved 2026-09-28 | Add a description and working example for `--shout`. |
| Assumption | This change needs no dependency or new parser package. | Current `bin/greet.mjs` and `package.json`; proposed design choice | Use JavaScript array methods and `String.prototype.toUpperCase()` in the existing Node.js command. |

## Design options

### Option A — Extend the existing command

#### Approach

Change the CLI path in `bin/greet.mjs` to detect `--shout` and select the optional name from arguments other than that flag. Call the existing `greet` function, then uppercase its complete result only when `--shout` is present. Keep `greet(name = 'world')` and its exported behavior intact. Replacing the command or its `greet` function would require reimplementing behavior that already meets the no-flag requirement, with no benefit for this one flag and more risk of changing existing output. Add command-level tests with Node's built-in test tools and document the flag in `README.md`. This uses the current command and requires no dependency.

#### End-to-end behavior

1. A person runs `node bin/greet.mjs`, optionally with a name and `--shout` before or after that name.
2. The CLI checks whether the argument list contains `--shout`. It chooses the first argument other than `--shout` as the name, or uses the existing `world` default when no name remains. It builds the greeting with `greet` and applies uppercase to the whole greeting if the flag is present.
3. The command prints one greeting line. `--shout` alone prints `HELLO, WORLD!`; either `--shout Mike` or `Mike --shout` prints `HELLO, MIKE!`. Without the flag, no name prints `Hello, world!` and `Mike` prints `Hello, Mike!`.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Change CLI argument handling and output in `bin/greet.mjs`; reuse `greet` and JavaScript `toUpperCase()` | Excluding the flag before choosing the name accepts both positions; uppercasing the completed greeting includes the name and punctuation stays in place; the no-flag branch keeps the current result. | Run command-level tests for `--shout`, `--shout Mike`, `Mike --shout`, no arguments, and `Mike` without the flag; run `npm test`. |
| R-02 | Change `README.md` | A flag description and executable command/output example show readers how to use it. | Review the README example and run its command to confirm the shown output. |

#### Technical shape

- **Components and files:** `bin/greet.mjs` is changed for CLI argument selection and conditional uppercase output. Its `greet` function is reused unchanged. `test/greet.test.mjs` is changed to add command-level tests using Node's built-in test and child-process tools. `README.md` is changed to document `--shout` with a working example. `package.json` and its `npm test` script are reused unchanged.
- **Data and state:** Arguments exist only for one process run. The command stores no data and needs no migration.
- **Access and security:** The local command has the same access as the user running it. No account, permission, or security rule changes.
- **Integrations:** The CLI receives process arguments and writes to standard output. The tests invoke the CLI as a child process. No external service is involved.
- **Operations:** Run `npm test` and the README example before delivery. A rollback restores the previous `bin/greet.mjs`, tests, and README. No monitoring or backup change is needed for this local command.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Checking only the first argument would miss `Mike --shout` or greet the flag as a name. | Likely if argument selection is left as written today; R-01 would fail. | Search the full argument list for the flag and exclude it when choosing the name; test both positions. |
| Uppercasing only the fixed word `Hello` would leave a supplied name mixed case. | Possible; R-01 would fail. | Apply `toUpperCase()` to the complete greeting returned by `greet`; test `Mike` in both flag positions. |
| Changing `greet` itself could change imported calls without the flag. | Possible; existing behavior could regress. | Leave `greet` unchanged and test the CLI's no-flag output as well as its existing unit tests. |

#### Build order

1. Change `bin/greet.mjs` to identify `--shout`, select the optional name from the remaining arguments, and uppercase the final greeting conditionally. Depends on the approved R-01. Complete when the five specified CLI cases print their expected lines by direct command run.
2. Add command-level cases to `test/greet.test.mjs` for the three shouted inputs and two no-flag inputs. Depends on step 1. Complete when `npm test` passes and the tests would detect a wrong flag position or a mixed-case name.
3. Add the `--shout` description and a command/output example to `README.md`. Depends on step 1. Complete when the shown command prints the documented output and R-02 is covered.

## Recommendation and owner decision

**Recommendation:** Option A uses the existing command and adds no dependency.

**Owner decision:** Mike approved Option A on 2026-09-28: "Go with option A." He also requested that README documentation be built and checked in its own sub-item, WI-002.

## Selected design

### End-to-end flow

The CLI recognizes `--shout` before or after an optional name, calls the existing `greet` function, uppercases its complete result only when the flag is present, and prints one line.

### Components and responsibilities

WI-001 changes `bin/greet.mjs` and adds command-level cases in `test/greet.test.mjs` for R-01. WI-002 changes `README.md` for R-02 and checks its example separately.

### Data, access, and integration details

The command reads process arguments and writes to standard output. It stores no data, changes no access, and adds no external service or dependency.

### Edge cases and failure behavior

With `--shout` alone, the default name produces `HELLO, WORLD!`. Either flag position with `Mike` produces `HELLO, MIKE!`. Without the flag, the existing greeting remains unchanged.

### Release and ongoing operation

Run the command cases and `npm test` for WI-001. Run the exact README example for WI-002, then seek separate result approval for each child and parent as required by their records.

## Diagrams

The command has one argument-processing path; the end-to-end flow above fully describes it.

## Build and verification plan

### Technical sequence

1. Implement Option A's CLI argument selection and conditional uppercase output in `bin/greet.mjs`. Depends on design approval. Artifact: changed command; check all five required command outputs.
2. Add command-level tests in `test/greet.test.mjs`. Depends on the command change. Artifact: tests for flag alone, both name positions, and unchanged no-flag behavior; check `npm test` passes.
3. Complete WI-002 after the command change. Its own build and check produce the `README.md` flag description and verified example.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01: `--shout` alone | Command-level test of `node bin/greet.mjs --shout` | `HELLO, WORLD!` followed by a newline | `test/greet.test.mjs` and test run output |
| R-01: flag before name | Command-level test of `node bin/greet.mjs --shout Mike` | `HELLO, MIKE!` followed by a newline | `test/greet.test.mjs` and test run output |
| R-01: flag after name | Command-level test of `node bin/greet.mjs Mike --shout` | `HELLO, MIKE!` followed by a newline | `test/greet.test.mjs` and test run output |
| R-01: no-flag behavior | Command-level tests with no arguments and with `Mike`, plus existing `greet` unit tests | `Hello, world!` and `Hello, Mike!` respectively | `test/greet.test.mjs` and test run output |
| R-02: README | Review `README.md` and run its example | The flag is described and the example output matches the command | `README.md` and delivery check |
| Work item acceptance | Ask Mike to review the tested result | Mike approves the finished result | WI-001 decision record |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Mike approved R-01 and R-02, including both flag positions and README documentation. | `.work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WORK-ITEM.md` | 2026-09-28 | Owner decision | Read approval field, requirements, and history. |
| The CLI currently passes its first argument to `greet`; `greet` returns `Hello, ${name}!` with a `world` default. | `bin/greet.mjs` | 2026-09-28 | Project evidence | Inspected source; runtime behavior remains to be checked during build. |
| Existing tests cover only direct calls to `greet`. | `test/greet.test.mjs` | 2026-09-28 | Project evidence | Inspected test source. |
| `npm test` runs Node's test runner on `test/*.test.mjs`. | `package.json` | 2026-09-28 | Project evidence | Inspected script; execution remains to be checked during build. |
| The README has only a named-greeting example. | `README.md` | 2026-09-28 | Project evidence | Inspected file. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | The flag works only before the name. | Detect `--shout` anywhere in the argument list and select the name after excluding it; test both positions. |
| R-01 | Capitalize only `Hello`, leaving `Mike` unchanged. | Apply uppercase to the complete result from `greet`; test `HELLO, MIKE!`. |
| R-01 | Make `greet` always uppercase. | Keep `greet` unchanged; uppercase only the CLI output when the flag is present. |
| R-01 | Treat `--shout` as the name when it is the only argument. | Exclude the flag before name selection so the existing default yields `HELLO, WORLD!`. |
| R-02 | Mention the flag without showing how to run it. | Include a command and its verified output in `README.md`. |
| Design approval | Treat the approved design as still proposed. | Mike approved Option A on 2026-09-28; WI-002 separately delivers its README portion. |

## Notes

### Open design questions

None. Option A is approved, and WI-002 owns the README build and check.

### Design changes during the interview

No design changes have been recorded.

### Current position and next step

R-01, R-02, and Option A are approved. WI-001 plans and builds the CLI change; WI-002 builds and checks README documentation on its own.
