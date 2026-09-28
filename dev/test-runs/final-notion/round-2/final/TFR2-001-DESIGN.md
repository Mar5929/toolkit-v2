Design of TFR2-001 (approved) at https://app.notion.com/p/TFR2-001-Build-the-tip-split-bill-command-solution-design-3e9b381da1768133a4fbecd575748cc7

---
work_item: TFR2-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---
# TFR2-001: Build the tip-split bill command — solution design

**Requirements:** TFR2-001  
**Design status:** Approved  
**Requirements checked:** TFR2-001 R-01 and R-02, 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

A person enters a restaurant bill and the number of people, optionally sets a tip percentage, and sees one equal per-person amount with tip included. The command uses an 18% default tip and rounds an exact half-cent share up. This item covers the command and its tests; no other system is involved.

## Requirements and design readiness

The requirements analyst checked the full input-to-output flow on 2026-09-28 and found no material gap. Q-01, Q-02, and Q-03 are answered.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
|---|---|---|---|
| R-01 — Split the bill with the default tip | Finalized | Option A: input validation, exact calculation, output, and tests | None |
| R-02 — Choose the tip percentage | Finalized | Option A: optional tip parsing, replacement of the default, and tests | None |

## What exists today

The repository has project documents and a test-plan template. It has no implementation files or verified build or test command for this feature. The proposed command and test file are new.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
|---|---|---|---|
| Constraint | Use plain Node.js without npm packages and tests with `node:test`. | Project memory preference, 2026-09-28 | Use Node.js built-in modules only. |
| Constraint | Exact half-cent shares round up. | TFR2-001 Q-03, owner answer, 2026-09-28 | Calculate with integers and round the final share once. |
| Design choice | Accept ordinary nonnegative decimal numbers for the bill and tip; accept scientific decimal notation for tips. | Option A approved by Mike Rihm, 2026-09-28 | Input parsing must retain exact decimal values. |

## Design options

### Option A — One Node.js command with exact decimal arithmetic

#### Approach

Add `bin/tip-split.js` for the command and `tests/tip-split.test.js` for its tests. Parse decimal input without converting money to a binary floating-point number. Use Node.js `BigInt` values to calculate each share exactly, then round the final share to cents with an exact half cent rounded up. The command needs no npm package, saved data, or outside service.

#### End-to-end behavior

1. The user runs `node bin/tip-split.js <bill> <people> [--tip <percent>]`. Accept two arguments, or four with `--tip` third. Any other argument shape prints `Usage: node bin/tip-split.js <bill> <people> [--tip <percent>]` to standard error and exits 1.
2. Parse the bill as nonnegative dollars with at most two digits after the decimal point, and people as a positive whole number. Accept leading zeroes. Reject signs, currency symbols, internal spaces, missing values, fractional cents, and fractional people with the same usage line and exit code.
3. Use 18% when `--tip` is absent. When present, accept a nonnegative decimal percentage such as `0`, `20`, `18.5`, or `.5`, with an optional leading plus sign; also accept decimal scientific notation such as `1e2` and `1e-2`. Reject a leading minus sign, including `-0`, an empty value, `NaN`, `Infinity`, and other text. Do not impose a percentage ceiling.
4. Convert the bill to integer cents. Keep the tip as an integer numerator and power-of-ten denominator. Calculate the exact share in cents as `billCents × (100 × tipDenominator + tipNumerator) ÷ (100 × tipDenominator × people)`. Divide as integers, then add one cent to the quotient when twice the remainder is at least the denominator. Round once, after dividing by people.
5. Print one line in the form `Each person pays $33.24` and exit 0. The approved examples produce `$33.24`, `$33.80`, and `$0.01` respectively.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
|---|---|---|---|
| R-01 | New `bin/tip-split.js` validation, calculation, and formatting | Applies the exact 18% default, divides equally, rounds half cents up, and rejects invalid bill or people values. | Run `84.50 3` and `0.01 2 --tip 0`; test missing and invalid bill or people. |
| R-02 | New optional tip parser in `bin/tip-split.js` | Replaces 18% with a nonnegative numeric tip without a fixed ceiling. | Run `84.50 3 --tip 20`; test missing, negative, and nonnumeric tip values. |

#### Technical shape

- **Components and files:** New `bin/tip-split.js` parses arguments, validates decimal text, calculates with `BigInt`, formats dollars and cents, and writes one output or usage line. New `tests/tip-split.test.js` uses `node:test`, `assert`, and `process.execPath` to check the actual command, text, and exit code.
- **Data and state:** No saved data. Keep the parsed bill in cents and the tip as a decimal ratio until the final rounded share is formatted.
- **Access and security:** The local command uses only the arguments supplied by the caller. Invalid arguments print usage and exit 1.
- **Integrations:** None.
- **Operations:** Run the test file with `node --test tests/tip-split.test.js`. No deployment, migration, or ongoing service is involved.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
|---|---|---|
| `BigInt` needs more parsing code than `Number`. | Small increase in code size; decimal rounding stays exact. | Keep parsing and calculation in small functions and test fractional tips and half cents. |
| The bill syntax requires `0.50` rather than `.50`, and no `$` prefix. | A user entering another form gets the required usage line. | Document accepted input with command examples and tests. |
| The sum of equal rounded shares can differ from the total by cents. | Possible when the exact share has fractions of a cent. | Print one equal share as R-01 requests; do not distribute leftover cents. |
| Scientific tip notation adds parser cases. | More input cases to test. | Parse it as exact decimal text without `Number`. |

#### Build order

1. After design approval, add the command with its argument and decimal validation.
2. Add exact share calculation and output formatting.
3. Add `node:test` cases for the three approved examples, zero bill, fractional and large tips, exact half cents, and invalid inputs.
4. Run `node --test tests/tip-split.test.js` and the three approved commands directly. Record results in TFR2-001 for owner review.

## Recommendation and owner decision

**Recommendation:** Option A. Exact integer arithmetic meets the half-cent rule without external packages. The cost is a small decimal parser.  
**Owner decision:** Mike Rihm approved Option A in chat on 2026-09-28.  
**Reason for decision:** No reason stated by the owner.

## Selected design

Option A: one Node.js command with exact decimal arithmetic. TFR2-001 delivers the default-tip command (R-01). A sub-item delivers the optional `--tip` behavior (R-02) and gets its own result review.

### End-to-end flow

The command reads a bill and people count, then uses an 18% tip unless `--tip <percent>` is supplied. It validates the inputs, calculates the exact share using integer ratios, rounds the final share to cents with half cents up, and prints `Each person pays $<amount>`. Invalid input prints the exact usage line to standard error and exits 1.

### Components and responsibilities

`bin/tip-split.js` parses arguments, validates values, calculates the share with `BigInt`, and formats the result. `tests/tip-split.test.js` runs the command using `node:test` and checks output and exit codes. The parent work implements and checks the default path. The R-02 sub-item adds optional tip parsing and its tests. The R-01 half-cent check that uses `--tip 0` runs with the child tests.

### Data, access, and integration details

The bill is held as integer cents, the tip as an integer numerator and power-of-ten denominator, and the people count as a positive integer. The command reads only arguments and writes one result or usage line. It stores no data and calls no outside service.

### Edge cases and failure behavior

Accept a bill of at least $0 with no more than two decimal places and a positive whole people count. The optional tip accepts nonnegative decimal percentages, including scientific decimal notation, without a ceiling. Reject invalid argument order, missing values, negative values, nonnumeric values, fractional bill cents, and fractional people. Round once after dividing; do not distribute leftover cents.

### Release and ongoing operation

Run the command with Node.js. Run its tests with `node --test tests/tip-split.test.js`. No package install, migration, deployment, or ongoing service is required. Review the default command result under TFR2-001 and the optional tip result under its sub-item.

## Diagrams

The command has one input and one output path. The numbered end-to-end behavior describes both valid and invalid input paths.

## Build and verification plan

### Technical sequence

1. Build the default 18% path under TFR2-001: argument and bill validation, exact calculation, formatting, and tests for R-01.
2. Build the optional `--tip` path under the R-02 sub-item, reusing the exact calculation and adding tip validation and tests.
3. Run `node --test tests/tip-split.test.js` and the approved command examples. Record the evidence on both items. Present each result for its own owner approval.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
|---|---|---|---|
| R-01 | Command tests and direct runs | Default example prints `$33.24`; invalid bill and people inputs print usage and exit 1. The half-cent example using `--tip 0` is checked after the child adds that flag. | TFR2-001 test history after build |
| R-02 | Command tests and direct runs | `--tip 20` example prints `$33.80`; `--tip 0` half-cent example prints `$0.01`; invalid tips print usage and exit 1. | R-02 sub-item test history after build |
| Owner review | Present each tested result separately | Owner accepts or names changes for the default command and the optional tip behavior. | TFR2-001 and R-02 sub-item result approvals |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
|---|---|---|---|---|
| Default tip, output, bill and people validation, half-cent rule | TFR2-001 R-01 and Q-03 | 2026-09-28 | Owner decision | Read item and revised approval. |
| Optional tip and invalid tip behavior | TFR2-001 R-02 and Q-01/Q-02 | 2026-09-28 | Owner decision | Read item and revised approval. |
| No implementation or verified build command exists | Repository files and `PROJECT.md` | 2026-09-28 | Project evidence | Inspected repository file list and `PROJECT.md`. |
| Plain Node.js and `node:test` preference | Project memory | 2026-09-28 | Owner preference | Read session briefing. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
|---|---|---|
| R-01 | Round the tip or total before splitting. | Keep the calculation exact and round only the final share. |
| R-01 | Use `Number` for money. | Parse decimal text and use integer `BigInt` arithmetic for the whole calculation. |
| R-01 | Spread leftover cents among people. | Print one equal, rounded share, with no separate payments. |
| R-02 | Treat `--tip 20` as 20 dollars or 0.20%. | It means 20% of the bill and replaces the 18% default. |
| R-02 | Cap the tip at 100%. | Apply no percentage ceiling. |
| R-01 and R-02 | Print an explanation for invalid input. | Print the exact usage line and exit 1. |

## Notes

### Open design questions

None.

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
|---|---|---|---|
| 2026-09-28 | Exact half-cent shares round up. | R-01 arithmetic and tests | TFR2-001 Q-03; owner approved revised requirements. |

### Current position and next step

The owner approved Option A on 2026-09-28 and requested a separate R-02 sub-item for `--tip` review. Record design approval, create the sub-item, then plan the parent and child work.
