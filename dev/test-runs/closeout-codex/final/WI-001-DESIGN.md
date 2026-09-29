---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---

# WI-001: Build the plain tip and total command — solution design

**Requirements:** WI-001  
**Design status:** Approved  
**Requirements checked:** [WI-001 requirements](WORK-ITEM.md#requirements), 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

A person running [WI-001's agreed goal](WORK-ITEM.md#agreed-goal) can see the tip and total for a restaurant bill and, when requested, each person's share. This design covers one terminal command and its checks. It does not add another way to run the calculation.

## Requirements and design readiness

The approved requirements describe a complete result for this small command. They settle accepted values, tip and total rounding, split rounding, output, and rejection of invalid values. The independent requirements check found no remaining gap. The command's internal parsing rules and error wording are implementation details; neither changes the required results.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Show tip and total | Finalized | Option A, end-to-end behavior, requirement coverage, and technical shape | None |
| R-02 — Divide the total between friends | Finalized | Option A, end-to-end behavior, requirement coverage, and technical shape | None |

## What exists today

The repository has project records but no application JavaScript, `package.json`, or `bin/tipcalc.js`. The work item also records that no application code has been built. There is no existing calculation or command behavior to reuse or replace.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Run the command as `node bin/tipcalc.js 50 --percent 20`. | [WI-001 starting request](WORK-ITEM.md#starting-request), approved 2026-09-28 | Create `bin/tipcalc.js` for direct execution by Node. |
| Constraint | Accept nonnegative bill amounts and tip percentages and a positive whole-number split count. | [WI-001 R-01 and R-02](WORK-ITEM.md#active-requirements), approved 2026-09-28 | Validate input before calculation. |
| Constraint | Round Tip and Total half up to cents, meaning an exact half cent rounds to the higher cent; round a divided share upward to cents. | [WI-001 R-01 and R-02](WORK-ITEM.md#active-requirements), approved 2026-09-28 | Use exact whole-number arithmetic throughout. |
| Assumption | Bill amount appears first, `--percent` is required, and `--split` is optional; standard unsigned decimal text is accepted for bill and percentage. | Proposed command syntax derived from the [WI-001 starting request](WORK-ITEM.md#starting-request) | Parse the shown command shape; reject missing, duplicate, unknown, or malformed arguments. This does not narrow any numeric range in the requirements. |

## Design options

### Option A — One Node command with exact decimal arithmetic

#### Approach

Create `bin/tipcalc.js` using Node's built-in `process` object and `BigInt`. Parse decimal input as digits and a count of digits after the decimal point, without converting it to a JavaScript floating point number, which can only approximate many decimal values. Calculate cents as whole numbers, then format them as dollar amounts with two decimal places. Add focused checks using Node's built-in test runner and process execution facilities. No package or outside service is needed.

#### End-to-end behavior

1. The person runs `node bin/tipcalc.js <bill> --percent <percentage>` and may add `--split <count>`, for example `node bin/tipcalc.js 50 --percent 20 --split 3`.
2. The command checks the argument names, counts, and decimal values before calculating. If any value is missing or invalid, it writes an error to standard error (the terminal's error channel), exits with a nonzero status (a process result that signals failure), and prints no calculation to standard output (the terminal's normal output channel).
3. The command calculates the exact percentage of the original bill, rounds Tip to cents half up, adds that rounded Tip to the original bill, and rounds Total to cents half up. It prints `Tip: $10.00  Total: $60.00` for the example without a split.
4. When `--split` is present, the command divides the rounded Total in cents by the whole-number count, rounds a remainder upward by one cent, and prints `Each person pays: $20.00` on the second line for a split of three.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `bin/tipcalc.js`; reuse Node `process` and `BigInt` | Exact decimal parsing and half-up whole-number division, which discards fractions, produce a rounded Tip and Total. The formatter fixes two decimal places and two spaces between fields. Validation rejects negative or malformed bill and percentage values. | Run the three exact-output R-01 examples, zero inputs, and invalid input cases; check standard output, standard error, and exit status. |
| R-02 | New split parsing and share calculation in `bin/tipcalc.js`; reuse Node `BigInt` | A positive whole-number count divides rounded Total cents. Integer division plus one cent for a remainder makes each displayed share cover at least its exact share. | Run the `--split 3` and `--split 7` examples; check that zero, negative, fractional, and malformed counts fail without a share. |

#### Technical shape

- **Components and files:** New `bin/tipcalc.js` owns argument parsing, exact decimal conversion, rounding, formatting, and the command's output. New `tests/tipcalc.test.js` runs the command in separate Node processes and checks outputs and exit status. Node's `process`, `BigInt`, `node:test`, `node:assert/strict`, and `node:child_process` are reused built-in facilities. No `package.json` is required for direct `node` execution or `node --test`.
- **Data and state:** Input decimals become a nonnegative `BigInt` coefficient and a nonnegative decimal scale. For example, `10.005` becomes coefficient `10005` and scale `3`. Let the bill be `B / 10^b` dollars and the percentage be `P / 10^p`. Tip in cents before rounding is `B × P / 10^(b+p)`. For any nonnegative numerator `n` and positive denominator `d`, half-up rounding is `(2n + d) / (2d)` using whole-number division, which discards any fractional remainder. Apply it to Tip cents. Round bill cents from `B × 100 / 10^b` by the same rule, then add rounded Tip cents to get rounded Total cents. Because the rounded Tip is already a whole cent, this equals rounding the original bill plus the rounded Tip. For a split count `s`, each share in cents is `(totalCents + s - 1) / s` using whole-number division. No data persists.
- **Access and security:** This is a local command with no accounts, credentials, network access, or stored personal data. Validate complete argument strings before arithmetic. Reject extra, repeated, or unknown flags to avoid silently using an unintended value.
- **Integrations:** The only interface is command-line arguments and standard output, standard error, and exit status. A successful calculation writes the required line or lines to standard output and exits successfully. An invalid command writes a short error to standard error, exits nonzero, and writes no result to standard output.
- **Operations:** Run directly with Node. Use `node --test tests/tipcalc.test.js` for the checks. No installation, migration, backup, monitoring, or external service is needed. A code revert removes the command if the proposed design is later replaced.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Native floating point arithmetic can change a half-cent result. | Likely for some decimal inputs; would fail R-01. | Keep the coefficient, scale, and all cent calculations in `BigInt`; do not use `Number` or `parseFloat` for amounts or percentages. |
| Very long decimal arguments can make arbitrary-precision calculations slower. | Low in the 3–8-person Friday dinner use case recorded in [WI-001 Notes](.work-items/WI-001-build-the-tip-command/WORK-ITEM.md#decisions-and-context); a local user would see a slow command. | Keep parsing linear in the input length and avoid a hard monetary cap that the approved requirements do not set. |
| Rounding every person's share upward can make the combined displayed shares exceed Total. | Expected when division has a cent remainder. | Show the single per-person amount specified by R-02; do not alter Total or distribute different amounts without another owner decision. |
| Input syntax beyond the shown command is not fully enumerated. | Low; an unfamiliar spelling may be rejected as malformed. | Document the accepted command form in the code's error text and test the required form. Accept plain nonnegative decimal values with digits, an optional decimal point, and digits after it; accept `0` and leading zeroes. Reject signs, exponent notation, separators, spaces, and missing digits. |

#### Build order

1. Create `bin/tipcalc.js` with argument validation and decimal parsing. Depends on the approved R-01 and R-02 input rules. Complete when the sample command is accepted and missing, repeated, unknown, negative, and malformed arguments return an error without result output.
2. Add integer-cent Tip and Total calculation and exact formatting in `bin/tipcalc.js`. Depends on step 1. Complete when the three R-01 acceptance examples print the required exact line and zero bill and percentage work.
3. Add split validation, upward cent division, and the second output line. Depends on step 2. Complete when `--split 3` and `--split 7` print the required shares and invalid counts fail.
4. Add `tests/tipcalc.test.js` with the approved calculation and error cases, then run it with Node. Depends on steps 1 through 3. Complete when WI-001 acceptance items 1–8 have recorded test results; then show the tested result to Mike Rihm for his review under item 9.

## Recommendation and owner decision

**Owner decision:** Mike Rihm approved Option A in chat on 2026-09-28 and directed that `--split` be a sub-item under WI-001 before building.  
**Reason for decision:** The owner gave no reason for choosing Option A.

## Selected design

### End-to-end flow

1. Run `node bin/tipcalc.js <bill> --percent <percentage>` with optional `--split <count>`.
2. Validate every argument. On invalid input, write an error to standard error, exit nonzero, and print no calculation.
3. Parse the decimal inputs exactly. Round Tip half up to cents, add the rounded Tip to the original bill, then round Total half up to cents.
4. Print `Tip: $10.00  Total: $60.00` for the $50 and 20% example. When `--split 3` is present, divide rounded Total cents by three, round any remainder upward, and print `Each person pays: $20.00` on a second line.

### Components and responsibilities

| Component or file | New, changed, or reused | Responsibility | Requirement IDs |
| --- | --- | --- | --- |
| `bin/tipcalc.js` | New | Parse and validate arguments; calculate and print Tip and Total | R-01 |
| `bin/tipcalc.js` split path | New in the R-02 sub-item | Validate the split count and print the upward-rounded share | R-02 |
| `tests/tipcalc.test.js` | New, then extended by the sub-item | Check command output, errors, and exit status | R-01, R-02 |
| Node built-ins | Reused | `process`, `BigInt`, `node:test`, `node:assert/strict`, and `node:child_process` | R-01, R-02 |

### Data, access, and integration details

Use the exact coefficient-and-scale decimal representation and integer cent formulas in Option A's Technical shape. The command stores no data, uses no account or network service, and communicates through command-line arguments, standard output, standard error, and exit status.

### Edge cases and failure behavior

| Situation | Expected behavior | How it will be checked |
| --- | --- | --- |
| Zero bill or percentage | Calculate and print valid zero values | R-01 zero-input test |
| Negative, malformed, missing, repeated, or unknown argument | Error on standard error; nonzero exit; no result on standard output | R-01 command tests |
| Invalid `--split` count | Error on standard error; nonzero exit; no result on standard output | R-02 sub-item tests |
| Total does not divide evenly | Round each displayed share upward to the next cent | R-02 `--split 7` test |

### Release and ongoing operation

Build and test the R-01 command in WI-001 first. Build and test the optional R-02 path in its sub-item. Run directly with Node; no installation, migration, external service, or persistent state is required. Reverting the code commit removes the command if necessary.

## Diagrams

No diagram is needed for this single local command. The end-to-end behavior above gives the input, calculation, error path, and output in order.

## Build and verification plan

### Technical sequence

1. In WI-001, build and check input validation and exact R-01 calculation in `bin/tipcalc.js`, with R-01 checks in `tests/tipcalc.test.js`.
2. In the R-02 sub-item, add split output and invalid split handling, extend `tests/tipcalc.test.js`, and record its own test results for owner review.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01, items 1 to 3 | Execute each exact command in [WI-001 acceptance](WORK-ITEM.md#acceptance) | Exactly `Tip: $10.00  Total: $60.00`, `Tip: $1.01  Total: $11.06`, and `Tip: $0.00  Total: $10.01` respectively | `tests/tipcalc.test.js` and WI-001 execution history |
| R-02, items 4 and 5 | Execute the $50, 20% cases with `--split 3` and `--split 7` | Exact first line plus second line `Each person pays: $20.00` or `Each person pays: $8.58` respectively | `tests/tipcalc.test.js` and WI-001 execution history |
| R-01, items 6 and 7 | Execute zero inputs, then negative and malformed bill and percentage inputs | Zero inputs calculate; invalid inputs exit nonzero, write an error, and write no result | `tests/tipcalc.test.js` and WI-001 execution history |
| R-02, item 8 | Execute zero, negative, fractional, and malformed split counts | Each exits nonzero, writes an error, and writes no result | `tests/tipcalc.test.js` and WI-001 execution history |
| Acceptance item 9 | Show the tested command and results to Mike Rihm | Owner reviews the tested result | WI-001 and WI-002 result approval records after their separate checks |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| The command path and $50 example are required. | [WI-001 starting request](WORK-ITEM.md#starting-request) | 2026-09-28 | Owner decision | Read approved work item. |
| Tip and Total use half-up cent rounding; Total adds the rounded Tip. | [WI-001 R-01](WORK-ITEM.md#r-01--show-tip-and-total) | 2026-09-28 | Owner decision | Read approved requirement and acceptance examples. |
| Shares use rounded Total and round upward to cents. | [WI-001 R-02](WORK-ITEM.md#r-02--divide-the-total-between-friends) | 2026-09-28 | Owner decision | Read approved requirement and acceptance examples. |
| The usual split is one Friday dinner bill among 3–8 people. | [WI-001 Notes](WORK-ITEM.md#decisions-and-context) | 2026-09-28 | Owner context | Read the recorded owner statement; this does not narrow valid split counts. |
| There is no application code, JavaScript, or `package.json` today. | Repository files and [WI-001 current position](WORK-ITEM.md#overview) | 2026-09-28 | Project evidence | Repository file scan and work item review. |
| Built-in Node facilities are sufficient for a direct command and process checks. | Node `process`, `BigInt`, `node:test`, `node:assert/strict`, and `node:child_process` | 2026-09-28 | Design choice based on platform built-ins | Builder verifies in the installed Node environment during step 4; no community claim used. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Round the bill to cents before calculating Tip. | Calculate Tip from the original bill decimal. Round Tip first; then round the original bill plus rounded Tip for Total. The integer formulas specify this order. |
| R-01 | Use a floating point number or round half cents with the runtime's default rounding. | Parse decimal digits into `BigInt` and use the stated half-up formula. The `10.05` example must produce a $1.01 Tip. |
| R-01 | Add the unrounded Tip to the bill before calculating Total. | Add rounded Tip cents to the original bill, then round Total. The data and state section states the equivalent integer calculation. |
| R-01 | Put Tip and Total on separate lines or separate them by one space. | The first line has two fields and exactly two spaces between them. The acceptance check compares the full line. |
| R-02 | Divide the unrounded bill and Tip, or round shares to the nearest cent. | Divide rounded Total cents and round any remainder upward. The $60 split by seven must print $8.58. |
| R-02 | Force the displayed shares to sum exactly to Total. | Every displayed share is the same rounded-up amount; their sum may exceed Total, as R-02 allows. |
| Input failures | Print a partial calculation or quietly accept an extra argument. | Validate the entire command before calculation; error to standard error, nonzero exit, and no calculation on standard output. |
| Design approval | Treat this draft as permission to build. | The selected design remains pending until the owner approves Option A. |

## Notes

### Open design questions

None. The owner has approved the requirements; the owner still decides whether to approve this proposed design.

### Design changes during the interview

None.

### Current position and next step

Mike Rihm approved Option A and directed an R-02 sub-item before the build. Build WI-001's plain Tip and Total first, then build the split sub-item.
