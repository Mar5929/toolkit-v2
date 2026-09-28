---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---
# WI-001: Add a --times flag to greet — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** WI-001 requirements, approved 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

People running greet can ask for the same greeting a positive whole number of times, with or without a name. They see one line per greeting. Invalid values produce a clear error and a failure exit status. This design covers the command and tests in WI-001 and the README in its R-02 sub-item. Each has its own result check.

## Requirements and design readiness

The approved requirements are ready for design. Q-01 through Q-06 are answered, including name order, missing name, fractional input, and failure behavior.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Repeat the greeting | Finalized | Option A parses arguments, validates the count, and prints repeated lines. | None |
| R-02 — Explain flags in the README | Finalized | Option A documents the flag with a command and output example. | None |

## What exists today

Verified 2026-09-28: bin/greet.mjs exports greet(name), which returns one greeting. When run as a command, it passes only the first argument to greet and prints one line. test/greet.test.mjs checks the default name and a supplied name. README.md shows a named greeting and the test command. No flag parser exists.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Keep the optional name and one-greeting default. | WI-001 R-01, approved 2026-09-28 | Both behaviors stay in the command and tests. |
| Constraint | Accept positive whole numbers only; invalid values print no greeting. | WI-001 R-01, approved 2026-09-28 | Validate all arguments before printing. |
| Approach | Use existing Node.js code and built-in argument handling. | Work item Decisions and context, 2026-09-28 | No new dependency is needed. |

## Design options

### Option A — Parse the flag in the command

#### Approach

Keep greet(name) as the greeting formatter. Add a small command argument parser that recognizes one optional name and --times followed by a value in either order. Validate the full value before printing. Require a positive safe integer so very large values that JavaScript cannot represent exactly produce a clear error. Print the one greeting once per line without building one large output string. Document the flag in README.md and add command-level tests for output and exit status.

#### End-to-end behavior

1. A person runs greet with an optional name and optional --times N.
2. The command finds the name and count in either order and validates the count. With no count, it uses one.
3. On valid input, it prints the greeting N times, one line each. On invalid input, it prints a clear error, no greeting, and exits with failure.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Reuse greet(name); add argument parsing and repeated printing in bin/greet.mjs. | Validation happens before any greeting; one formatter provides identical lines. | Run command tests that check exact stdout for accepted inputs. For each rejected input, check clear stderr, empty stdout, and nonzero exit status. |
| R-02 | Update README.md. | Every flag has a short command and output example. | Review the README against the parser. |

#### Technical shape

- **Components and files:** bin/greet.mjs parses CLI arguments and prints; greet(name) remains the formatter. test/greet.test.mjs adds command process checks. README.md explains --times.
- **Data and state:** No stored data or migration.
- **Access and security:** Local command only; no access rules.
- **Integrations:** Node.js process arguments, standard output, standard error, and exit status.
- **Operations:** Run npm test. Revert the commit to roll back.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Extra or misplaced arguments could be mistaken for a name or count. | Possible incorrect greeting or success status. | Reject malformed input and test both allowed name positions. |
| Numeric conversion could accept fractions or non-number strings. | Would violate R-01. | Validate the full value as decimal digits and require a positive safe integer. Reject values beyond the safe integer range with a clear error. |

#### Build order

1. Add parsing, validation, and output in bin/greet.mjs.
2. Add command-level tests for both name orders, default behavior, no name, and invalid values.
3. Update README.md with the --times command and output.

## Recommendation and owner decision

**Recommendation:** Option A. It meets both requirements with the existing Node.js command and no dependency.  
**Owner decision:** Mike Rihm chose and approved Option A in chat on 2026-09-28, and asked to split the README documentation into its own sub-item.  
**Reason for decision:** Mike did not state a reason.

## Selected design

Option A — Parse the flag in the command.

### End-to-end flow

Parse the optional name and --times N in either order. Validate all input before printing. Print the formatted greeting N times, one line per greeting.

### Components and responsibilities

WI-001 changes bin/greet.mjs and test/greet.test.mjs. The R-02 sub-item updates README.md and checks it independently.

### Data, access, and integration details

The command uses process arguments, standard output, standard error, and exit status. There is no stored data, access rule, migration, or new dependency.

### Edge cases and failure behavior

Without --times, print one greeting. Without a name, greet world. Reject zero, negative, fractional, missing, non-number, unsafe integer, extra, and misplaced values with a clear error, empty standard output, and a failure status.

### Release and ongoing operation

Run npm test for the command. The README sub-item compares its examples with the implemented flags and verifies the documented output. Each item has its own result review.

## Diagrams

The command flow is short and is fully described in End-to-end behavior. No diagram is needed.

## Build and verification plan

### Technical sequence

1. Build argument parsing, validation, and repeated output in bin/greet.mjs.
2. Add command-level tests for valid and invalid arguments, output, and exit status.
3. Build README.md examples under the R-02 sub-item after the command behavior is ready.
4. Check the command and README results separately before requesting each result approval.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Run CLI tests for valid and invalid arguments, including a value beyond the safe integer range. | Valid input gives exact greeting lines. Every invalid case gives clear stderr, empty stdout, and nonzero exit status. | Test output and WI-001 history |
| R-02 | Review README.md against the implemented flags. | Every flag has a short command and output example. | README.md and WI-001 history |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Current command prints one greeting from its first argument. | bin/greet.mjs | 2026-09-28 | Project evidence | Read current code. |
| The --times behavior and invalid input rules are approved. | WI-001 Requirements | 2026-09-28 | Owner decision | Read approval field and R-01. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Print some greetings before discovering invalid input. | Parse and validate all input before printing any greeting; large values outside the safe integer range fail. |
| R-01 | Accept only a name before --times. | Both name positions are valid and tested. |
| R-02 | Show only the new flag without an example. | List every flag with a short command and output example. |

## Notes

### Open design questions

None.

### Design changes during the interview

None.

### Current position and next step

The independent design critique found one numeric boundary gap and one test detail gap; both are addressed above. Mike chose Option A on 2026-09-28 and requested an independent README sub-item. Record design approval, create that sub-item, then plan the build.
