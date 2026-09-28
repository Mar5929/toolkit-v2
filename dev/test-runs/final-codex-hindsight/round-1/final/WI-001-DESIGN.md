---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike"
---
# WI-001: Add --shout flag to greet CLI — solution design

**Requirements:** WI-001 R-01 and R-02, approved by Mike on 2026-09-28  
**Design status:** Approved  
**Last updated:** 2026-09-28

## What this design solves

The CLI prints the whole greeting in capitals when `--shout` is present. The flag works before or after a name and with the default greeting. WI-002 documents the flag in the README and checks that result separately.

## Requirements and design readiness

| Requirement | Status | Design coverage | Gap |
| --- | --- | --- | --- |
| R-01 — Shout greeting | Approved | CLI parsing, uppercase conversion, and tests | None. |
| R-02 — Document the flag | Approved | WI-002 README edit and example check | None. |

## What exists today

`bin/greet.mjs` exports `greet(name = 'world')`, returns a normal greeting, and uses the first CLI argument as the name. `test/greet.test.mjs` covers named and default function output. `README.md` shows the named greeting command.

## Constraints and assumptions

| Type | Statement | Source | Effect |
| --- | --- | --- | --- |
| Constraint | The complete named and default greeting is uppercase with `--shout`. | WI-001 R-01 | Convert the complete greeting. |
| Constraint | The flag works before or after a name. | WI-001 R-01 | Scan all CLI arguments. |
| Constraint | The README explains the flag and shows a usable command. | WI-001 R-02 | WI-002 builds and checks the documentation. |
| Assumption | Arguments beyond the first non-flag name are outside the approved behavior. | Existing CLI shape | Preserve first-name selection without new error or help behavior. |

## Design options

### Option A — Extend the current Node.js CLI

Scan `process.argv.slice(2)` for the exact `--shout` flag. Use the first other argument as the name. Keep the default name `world`. Build the complete greeting, then apply `toUpperCase()` when shout is requested. Keep normal output unchanged. Add CLI tests for flag positions and default output. WI-002 documents the flag and a working example in `README.md`. No new package, stored state, permission, or integration is needed.

## Recommendation and owner decision

**Recommendation:** Option A extends the existing command with built-in Node.js and JavaScript behavior.  
**Owner decision:** Mike chose Option A in chat on 2026-09-28: “Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own.”  
**Reason for decision:** Mike did not state a reason for selecting Option A.

## Selected design

### End-to-end flow

The CLI reads all arguments, detects `--shout`, and takes the first other argument as the name. `greet` builds the normal complete greeting. When shout is true, it uppercases the full string before printing it. Without a name, the default is `world`. Without the flag, the existing output remains unchanged.

### Components and responsibilities

- `bin/greet.mjs`: argument parsing, greeting construction, and output.
- `test/greet.test.mjs`: named, default, both flag positions, and unchanged normal behavior.
- `README.md`: WI-002 explains and demonstrates `--shout`.

### Data, access, and integration details

Arguments and the greeting exist only during one command run. The command reads local arguments and writes standard output. There is no stored data, credential, permission, external integration, or new dependency.

### Edge cases and failure behavior

With no name, `--shout` prints `HELLO, WORLD!`. With the flag before or after Mike, it prints `HELLO, MIKE!`. Other arguments keep the existing first-name behavior; new error or help behavior is outside this work.

### Release and ongoing operation

Run `npm test` and each required CLI form. WI-002 runs the exact README example. There is no build or deployment command. Reverting the changed files restores earlier behavior.

## Diagrams

The three-file flow is simple enough to read in the component list above; no diagram is needed.

## Build and verification plan

### Technical sequence

1. Implement the CLI argument scan and uppercase behavior in `bin/greet.mjs`. Verify named and default shout forms and existing normal output.
2. Add `test/greet.test.mjs` checks for both flag positions, default shout output, and existing output. Run `npm test`.
3. Complete WI-002 after the implementation. Add the flag meaning, a runnable command, and shown output to `README.md`. Run that exact command and compare output. Check and seek result approval for WI-002 separately.

### Acceptance checks

| Requirement | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01, flag before a name | `node bin/greet.mjs --shout Mike` | `HELLO, MIKE!` | CLI output and WI-001 history |
| R-01, flag after a name | `node bin/greet.mjs Mike --shout` | `HELLO, MIKE!` | CLI output and WI-001 history |
| R-01, default | `node bin/greet.mjs --shout` | `HELLO, WORLD!` | CLI output and WI-001 history |
| R-01, existing behavior | `npm test` and normal CLI commands | `Hello, Mike!` and `Hello, world!` | Test output and WI-001 history |
| R-02 | Read `README.md` and run its `--shout` example | Flag explained; shown output matches command | README.md and WI-002 history |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence |
| --- | --- | --- | --- |
| R-01 and R-02 are approved. | WI-001 requirements and approval | 2026-09-28 | WI-001 work record |
| Option A is selected and README work is separate. | Mike in chat | 2026-09-28 | WI-001 history and this design |
| Existing greeting uses the first argument and defaults to world. | `bin/greet.mjs` | 2026-09-28 | Source review recorded in proposed design |

## Where a builder could misread this design

| Possible mistake | Intended behavior |
| --- | --- |
| Uppercase only the name. | Uppercase the complete greeting. |
| Detect the flag only first. | Detect it anywhere in the arguments. |
| Treat README as part of the CLI check. | WI-002 builds and checks R-02 separately. |

## Notes

**Design changes during the interview:** Mike requested that README documentation be a separate sub-item.  
**Current position and next step:** Option A approved. WI-001 continues with the R-01 CLI build plan; WI-002 covers R-02.
