---
work_item: WI-001
status: approved
approved: "2026-09-27 by Mike"
---
# WI-001: Add a --shout flag to the greet CLI — solution design

**Requirements:** WI-001, Requirements section, approved by Mike on 2026-09-27  
**Design status:** Approved  
**Requirements checked:** WI-001 requirements, 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

A person running the greet CLI can request an uppercase greeting with --shout. The flag works before or after a supplied name and with no name. Calls without the flag keep their current output. The README shows the new flag.

## Requirements and design readiness

The approved requirements are ready for this small CLI change. No open requirement questions remain.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Shout greeting | Finalized | Option A parses the flag and capitalizes the full greeting. | None |
| R-02 — Flag documentation | Finalized | Option A adds a README example. | None |

## What exists today

`bin/greet.mjs` uses the first command-line argument as the name and calls `greet`, which returns `Hello, <name>!` or `Hello, world!`. `test/greet.test.mjs` tests those two function results. The README shows a name example and does not name any flag. These statements were checked in the project files on 2026-09-27.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Keep the current greeting output when --shout is absent. | R-01, approved 2026-09-27 | Apply uppercase only after the normal greeting is formed. |
| Constraint | Accept --shout before or after the name. | R-01, approved 2026-09-27 | Find the flag independently of the name argument. |
| Assumption | Only the placement and outputs named in R-01 are specified. | WI-001 requirements, checked 2026-09-27 | Other argument combinations keep existing handling where practical. |

## Design options

### Option A — Parse the flag in the existing CLI

#### Approach

Keep the existing `greet` function for normal greetings. In the command-line entry point, detect --shout and find the name from the remaining arguments. Capitalize the complete greeting when the flag is present. Add command-line tests and a README example.

#### End-to-end behavior

1. A person runs `node bin/greet.mjs` with an optional name and --shout.
2. The CLI identifies --shout and passes the remaining name, if any, to `greet`.
3. The CLI prints the normal greeting or its uppercase form.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Reuse `greet`; change argument handling in `bin/greet.mjs`. | Uppercase is applied to the entire greeting, and the flag is found in either position. | Run the CLI with --shout Mike, Mike --shout, --shout alone, and without the flag. |
| R-02 | Change `README.md`. | The flag and one invocation with output appear in the README. | Read the README example. |

#### Technical shape

- **Components and files:** Change `bin/greet.mjs` for flag handling; change `test/greet.test.mjs` for CLI checks; change `README.md` for usage.
- **Data and state:** No persistent data or state.
- **Access and security:** The command only processes local command-line arguments.
- **Integrations:** No external integration.
- **Operations:** Run `npm test`; no deployment target is defined.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Argument parsing could treat --shout as the name. | Directly affects the requested output. | Test both flag positions and the flag alone. |
| Uppercasing only the name would leave Hello mixed case. | Directly violates R-01. | Uppercase the completed greeting and check exact output. |

#### Build order

1. Update argument handling and uppercase output in `bin/greet.mjs`; check the required invocations.
2. Add CLI tests for the required flag positions and unchanged output; run `npm test`.
3. Add a --shout example with output to `README.md`; review it against R-02.

## Recommendation and owner decision

**Recommendation:** Option A. It changes the existing small CLI directly and needs no dependency.  
**Owner decision:** Mike chose Option A on 2026-09-27.  
**Reason for decision:** Mike said, "Go with option A." He also asked for README documentation to be a separate sub-item.

## Selected design

Use the existing `greet` function. The CLI detects --shout before or after the name and uppercases the complete greeting when present. Add exact-output CLI tests in WI-001. WI-002 documents --shout in the README and checks the example separately.

## Build and verification plan

### Technical sequence

1. Implement Option A in `bin/greet.mjs`.
2. Add exact-output CLI tests in `test/greet.test.mjs` and run `npm test`.
3. WI-002 documents --shout in `README.md` and checks the example.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | CLI tests for both flag positions, flag alone, and calls without the flag | Exact outputs in WI-001 Acceptance | `npm test` output |
| R-02 | README review | --shout is named and has an invocation with output | `README.md` |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Existing CLI uses its first argument as the name. | `bin/greet.mjs` | 2026-09-27 | Project evidence | Read the file. |
| Normal greeting outputs are covered by two tests. | `test/greet.test.mjs` | 2026-09-27 | Project evidence | Read the file. |
| Entire greeting is uppercase and the flag works in either position. | WI-001 R-01 | 2026-09-27 | Owner decision | Requirements approval recorded. |
| Every CLI flag belongs in the README. | WI-001 R-02 | 2026-09-27 | Owner decision | Requirements approval recorded. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Uppercase only the name. | Uppercase the complete `greet` result. |
| R-01 | Accept the flag only before the name. | Find --shout independently of the name argument. |
| R-02 | Name the flag without showing its result. | Show the invocation and output together. |

## Notes

### Open design questions

None.

### Design changes during the interview

None.

### Current position and next step

Mike approved Option A on 2026-09-27. WI-002 covers R-02 and has its own build and result check. No independent design critique has run.
