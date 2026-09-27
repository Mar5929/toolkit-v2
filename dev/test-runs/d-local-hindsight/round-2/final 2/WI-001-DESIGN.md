---
work_item: WI-001
status: approved
approved: 2026-09-27 by Mike
---
# WI-001: Add --shout flag to greet CLI — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** WI-001 Requirements, 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

A person running the greet CLI can request an uppercase greeting with `--shout`, with the default name or a supplied name in either argument order. Ordinary greetings keep their current output. The README explains the flag. Other flags and general argument handling remain future work.

## Requirements and design readiness

The approved requirements are ready for design. No requirement question remains open.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Shout greeting | Finalized | Both options recognize `--shout`, preserve normal greetings, and uppercase the complete result. | None |
| R-02 — Document the flag | Finalized | Both options update README with usage and output examples. | None |

## What exists today

`bin/greet.mjs` exports `greet(name = 'world')`, which returns `Hello, ${name}!`. When run as a command, it passes the first argument to `greet` and prints the result. `test/greet.test.mjs` checks the default and named greetings through that exported function. `README.md` shows a named greeting and the test command. There is no flag parser or CLI-level test.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | `--shout` works alone and with a name before or after it. | WI-001 R-01, approved 2026-09-27 | Both orders must be tested through the CLI. |
| Constraint | Without `--shout`, current greeting output stays the same. | WI-001 R-01, approved 2026-09-27 | Preserve the existing `greet` result and current first-argument behavior. |
| Constraint | Every command-line flag is documented in README. | WI-001 R-02, approved 2026-09-27 | Add a flag example and description. |
| Assumption | Built-in JavaScript argument handling is sufficient for this one flag. | Current code, observed 2026-09-27 | Neither option needs a dependency. |

## Design options

### Option A — Handle the flag in the command

#### Approach

Keep the exported `greet(name)` function unchanged. In the command entry point, detect whether `process.argv.slice(2)` contains `--shout`, remove that token, and use the remaining first argument as the name. Convert the completed greeting to uppercase only when the flag is present. Add CLI-level tests and README examples.

#### End-to-end behavior

1. The person runs the command with no arguments, a name, `--shout`, or a name and `--shout` in either order.
2. The command checks for `--shout`, selects the first remaining argument as the name, and calls `greet`.
3. With `--shout`, it uppercases the complete greeting before printing. Otherwise it prints the existing result.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Change the entry point in `bin/greet.mjs`; reuse `greet` | Removing `--shout` leaves the name in either position; uppercasing occurs after the complete greeting is formed. | Run the four approved command examples and `npm test`. |
| R-02 | Change `README.md` | Usage and output examples describe the flag. | Review the README. |

#### Technical shape

- **Components and files:** Change `bin/greet.mjs` command entry point, `test/greet.test.mjs`, and `README.md`.
- **Data and state:** No stored data or migration.
- **Access and security:** No access control.
- **Integrations:** Node.js process arguments and standard output only.
- **Operations:** No deployment command is defined. Existing test command remains `npm test`.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Argument handling stays inside the entry point. | Low effort now; additional flags could make it harder to read later. | Extract a parser when another flag makes the behavior complex. |
| Removing `--shout` changes how that exact token is treated if someone previously used it as a name. | Expected change for the new flag. | Document its meaning and test the approved cases. |

#### Build order

1. Add flag detection and whole-greeting uppercase conversion in the command entry point.
2. Add CLI-level tests for default, both name orders, and ordinary output; update README; run `npm test`.

### Option B — Add a small argument parser

#### Approach

Add a separate `parseArgs(args)` function in `bin/greet.mjs`. It returns the selected name and a `shout` boolean. The command entry point uses that result, calls the existing `greet`, and uppercases the full result when requested. This separates argument handling from output. Add tests for the parser and CLI behavior, plus README examples.

#### End-to-end behavior

1. The person runs the command with no arguments, a name, `--shout`, or a name and `--shout` in either order.
2. `parseArgs` identifies `--shout` and selects the first remaining argument as the name; the command calls `greet`.
3. The command uppercases the complete greeting when requested and prints it.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Add `parseArgs` and change the entry point in `bin/greet.mjs`; reuse `greet` | Parsing handles either order; conversion happens after the full greeting is built. | Run the approved command examples and `npm test`. |
| R-02 | Change `README.md` | Usage and output examples describe the flag. | Review the README. |

#### Technical shape

- **Components and files:** Add `parseArgs` in `bin/greet.mjs`; change its command entry point, `test/greet.test.mjs`, and `README.md`.
- **Data and state:** No stored data or migration.
- **Access and security:** No access control.
- **Integrations:** Node.js process arguments and standard output only.
- **Operations:** No deployment command is defined. Existing test command remains `npm test`.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| A separate parser adds code and tests for one flag. | Small additional maintenance cost. | Keep `parseArgs` limited to behavior required by R-01. |
| Future flag rules are not specified. | A parser may need changes when those rules are chosen. | Avoid defining unknown-flag or multi-name policy in this item. |

#### Build order

1. Add `parseArgs` and connect its result to the existing greeting function.
2. Add parser and CLI-level tests for the approved cases; update README; run `npm test`.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Approved behavior | Meets R-01 and R-02 | Meets R-01 and R-02 | Both use the same greeting and README changes. |
| Code change | Smaller | Adds a function | Current entry point has only one argument lookup. |
| Future flags | Argument code may need extraction | Parser can hold future flag handling | Future flag behavior has not been chosen. |

## Recommendation and owner decision

**Recommendation:** Option A. It meets the approved behavior with the smallest change to this one-flag command. Its main cost is that a later flag may justify extracting argument handling.  
**Owner decision:** Mike chose Option A on 2026-09-27.  
**Reason for decision:** It meets the approved behavior with the smallest code change.

## Selected design

**End-to-end flow:** The command checks its arguments for `--shout`, removes that token, and uses the first remaining argument as the name. It calls the unchanged `greet(name)` function, uppercases the completed greeting only when `--shout` is present, and prints it.

**Components and responsibilities:** `bin/greet.mjs` handles the flag and output. CLI-level tests verify the default greeting, both name orders, and ordinary output. A separate child item updates `README.md` for R-02.

**Data, access, and integration details:** No stored data, access control, or new dependency. The command reads Node.js process arguments and writes to standard output.

**Edge cases and failure behavior:** `--shout` works alone and with a name on either side. Other argument rules remain as they are today.

**Release and ongoing operation:** Run `npm test` and the approved CLI examples. No deployment command is defined.

## Build and verification plan

1. In WI-001, add flag handling in the command entry point and CLI-level tests for `--shout`, `Mike --shout`, `--shout Mike`, and ordinary greetings. Run `npm test` and the approved CLI examples.
2. In WI-002, document `--shout` in `README.md` with usage and output examples; read the README against R-02. The child is checked and approved on its own.

| Requirement | Acceptance check | Work item |
| --- | --- | --- |
| R-01 | Run the approved CLI examples and `npm test`; confirm ordinary output remains unchanged. | WI-001 |
| R-02 | Read the README and confirm it explains `--shout` with an example. | WI-002 |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| Current greeting uses first argument and has no parser. | `bin/greet.mjs` | 2026-09-27 | Project evidence | Read current code. |
| Current tests cover only the greeting function. | `test/greet.test.mjs` | 2026-09-27 | Project evidence | Read current tests. |
| `--shout` must uppercase the whole greeting in either order. | WI-001 R-01 | 2026-09-27 | Owner decision | Requirements approval recorded. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Uppercase only `Hello` or only the name. | Uppercase the completed greeting, including punctuation and name. |
| R-01 | Accept only one order for the flag and name. | Test both `Mike --shout` and `--shout Mike`. |
| R-01 | Change the greeting function's ordinary output. | Keep `greet(name)` unchanged and convert only when `--shout` is present. |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Choose Option A or Option B. | Selected design | owner | Answered 2026-09-27: Option A | Build the selected design. |

### Design changes during the interview

2026-09-27: Mike chose Option A and requested the README documentation as a separate sub-item.

### Current position and next step

Requirements and design approved. WI-002 is created. Plan each item. No helper agents are needed for the design.
