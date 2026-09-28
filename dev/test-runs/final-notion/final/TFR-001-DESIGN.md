Design of TFR-001 (approved) at https://app.notion.com/p/TFR-001-Build-the-days-until-command-with-a-weeks-flag-solution-design-3e9b381da17681859546d90fe3e13254

---
work_item: TFR-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---
# TFR-001: Build the days-until command — solution design

work_item: TFR-001 status: proposed approved: "no"

# TFR-001: Build the days-until command with a --weeks flag — solution design

**Requirements:** TFR-001, R-01 through R-03  
**Design status:** Approved  
**Requirements checked:** TFR-001 requirements, 2026-09-28; complete and approved by Mike Rihm  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

A person runs `node bin/days-until.js 2026-12-25` to see the number of local calendar days until a date. Adding `--weeks` shows whole weeks and leftover days. The `--weeks` work is tracked as a separate sub-item under TFR-001 for its own result review.

## Requirements and design readiness

| Requirement | What must work | Readiness |
|---|---|---|
| R-01 | A real `YYYY-MM-DD` date produces the signed local calendar day difference. | Approved. Parent work. |
| R-02 | `--weeks` works before or after the date and shows weeks and days, with singular forms, omitted zero units, and `ago` for past dates. | Approved. Separate sub-item. |
| R-03 | Invalid input prints an invalid-date error or usage and exits `1`. | Approved. Parent and sub-item checks. |

## What exists today

The repository has no application code or verified build and test commands.

## Constraints and assumptions

- Use plain Node.js and built-in modules. Add no npm packages.
- Treat the input as a date in the computer's local time zone, not as a UTC timestamp.
- Accept years `0001` through `9999`; reject year `0000`.
- Print one result line to standard output on success. Print errors to standard error and exit `1` on invalid input.
- Sample the current local date once per run.
- In default mode print a signed count with its unit: `0 days`, `1 day`, `-1 day`, or `17 days`. Mike Rihm confirmed this wording with his design approval.

## Design options

### Option A — One Node.js command with calendar-day arithmetic

#### Approach

Create `bin/days-until.js` with argument parsing, date validation, calendar-day calculation, and named formatting functions. Export functions for tests with a fixed local `Date`. Run the command only when it is the program entry point. Implement the `--weeks` path in a separate sub-item.

#### End-to-end behavior

1. Accept exactly one date and zero or one `--weeks`, in either order. Missing dates, repeated flags, unknown flags, and extra arguments print `Usage: node bin/days-until.js [--weeks] YYYY-MM-DD` and exit `1`.
2. Require exactly the `YYYY-MM-DD` shape. A malformed string prints usage and exits `1`.
3. Reject years outside `0001` through `9999` and impossible dates. Print `Invalid date: <input>` and exit `1`.
4. Read local year, month, and day once. Convert the local date labels for today and target into integer day numbers through UTC calendar arithmetic and subtract them. This avoids elapsed-hour errors across daylight saving changes.
5. Without `--weeks`, print the signed difference with `day` or `days`: `0 days`, `1 day`, `-1 day`, `17 days`.
6. With `--weeks`, format the absolute difference into whole weeks and leftover days. Omit zero units except when the total is zero, then print `0 days`. Append `ago` for a negative difference. Use singular units for a count of one.

Weeks examples: `1 day`, `1 day ago`, `3 days`, `1 week`, `2 weeks`, `2 weeks and 3 days`, and `2 weeks and 3 days ago`.

#### Requirement coverage

| Requirement | Design provision | Completion check |
|---|---|---|
| R-01 | Strict date parsing; local date fields for today; integer day subtraction. | Fixed today, tomorrow, and yesterday give `0 days`, `1 day`, and `-1 day`; daylight saving boundaries also pass. |
| R-02 | Order-independent flag parsing and a weeks formatter. | Both flag positions and `0`, `±1`, `±3`, `±7`, `±14`, and `±17` days produce the expected text. |
| R-03 | Separate shape and real-date checks, with usage and invalid-date paths. | Impossible dates fail in both modes; malformed dates, missing dates, unknown or repeated flags, and extra arguments give usage and exit `1`. |

#### Technical shape

- `bin/days-until.js` is executable with `node bin/days-until.js ...`; no package file is required.
- Parse exactly one date token and at most one `--weeks`; reject all other arguments. Check shape before real-date validation.
- For real-date validation, start with `new Date(0)`, call `setUTCFullYear(year, month - 1, day)`, then compare the resulting UTC fields with the input. Check year `0000` explicitly. This avoids the special handling of years `00` through `99` in `Date.UTC`.
- Divide the validated UTC midnight timestamp by `86_400_000` for its day number. Build today from `getFullYear()`, `getMonth() + 1`, and `getDate()` the same way.
- Default format uses the signed result. Weeks format uses `Math.abs(diff)`, `Math.floor(abs / 7)`, and `abs % 7`; join nonzero units with ` and ` and append ` ago` only when `diff < 0`.
- `test/days-until.test.js` uses `node:test` and `node:assert/strict`. Pure-function tests use fixed `Date` values. A child process with `TZ=America/New_York` covers spring and fall daylight saving changes. CLI child processes verify errors and exit codes.

#### Tradeoffs and risks

- The computer's local time zone determines today; two computers can differ near midnight.
- JavaScript normalizes impossible dates, so validation must compare the constructed fields back to the input.
- Elapsed local milliseconds cannot be divided into calendar days across daylight saving changes; integer calendar-day numbers address that risk.

#### Build order

1. Parent: add strict date parsing, validation, calendar-day conversion, default formatting, and usage/error handling. Verify R-01 and the default-mode part of R-03.
2. Sub-item: add `--weeks` parsing and formatting on the same command. Verify R-02 and the weeks-mode part of R-03 independently.
3. Run built-in Node.js tests and direct CLI examples for both modes. Record evidence separately on the parent and the sub-item before requesting each result approval.

## Recommendation and owner decision

**Recommendation:** Option A covers R-01 through R-03 with one command and built-in Node.js tests.

**Owner decision:** Mike Rihm approved Option A in chat on 2026-09-28, with the proposed default wording `1 day` and `-1 day`, and asked for `--weeks` to be a separate sub-item before the build.

**Reason for decision:** The owner did not state a reason.

## Selected design

### End-to-end flow

The user runs the command with a `YYYY-MM-DD` date. The command validates arguments and the real calendar date, computes the signed local calendar-day difference, and prints a single result line. With `--weeks`, it formats that result as whole weeks and leftover days. Invalid input goes to the usage or invalid-date error path and exits `1`.

### Components and responsibilities

`bin/days-until.js` owns parsing, validation, calculation, formatting, and the CLI entry point. Named exported functions support fixed-date tests. `test/days-until.test.js` checks functions and child-process CLI behavior. TFR-001 delivers the base command; its `--weeks` sub-item delivers the flag and its separate review.

### Data, access, and integration details

The command accepts a date string and an optional flag. It reads the local date from the runtime. It stores no data, uses no external service, and needs no npm package.

### Edge cases and failure behavior

Today prints `0 days`; tomorrow `1 day`; yesterday `-1 day` in default mode. Weeks mode uses `ago` for past dates and singular nouns for one. Impossible dates print `Invalid date: <input>`; missing or malformed dates, unknown or repeated flags, and extra arguments print usage. Each invalid case exits `1`.

### Release and ongoing operation

Run the command with Node.js. No build step or service is required. The parent and sub-item each need their own tested result and owner approval.

## Diagrams

No diagram is needed; the command has one input path, one calendar-day calculation, and two output formats.

## Build and verification plan

### Technical sequence

Build the parent base command and tests, then build the `--weeks` sub-item and extend tests. Keep each implementation on its own item branch and worktree. Check the combined command before result reviews.

### Acceptance checks

| Requirement | Acceptance check | Work item |
|---|---|---|
| R-01 | Fixed local today, tomorrow, and yesterday print `0 days`, `1 day`, and `-1 day`; daylight saving cases count calendar dates. | TFR-001 |
| R-02 | Both flag orders and `0`, `±1`, `±3`, `±7`, `±14`, and `±17` days print the specified weeks text. | `--weeks` sub-item |
| R-03 | Impossible dates print a clear error and exit `1` in both modes; malformed or missing dates, unknown or repeated flags, and extra arguments print usage and exit `1`. | TFR-001 and `--weeks` sub-item |

Run `node --test` and direct CLI success and error examples. Record output and exit codes in each work item.

## Sources and decisions that affect the build

| Source or decision | Effect on the design |
|---|---|
| TFR-001 requirements R-01 through R-03, approved by Mike Rihm on 2026-09-28. | Defines date difference, weeks output, and errors. |
| Owner chat, 2026-09-28: Option A approved with `1 day` and `-1 day` wording and a separate `--weeks` sub-item. | Selects the design and implementation split. |
| Project preference: plain Node.js, no npm packages, and `node:test`. | Uses built-in runtime and tests. |
| Existing repository scan and `PROJECT.md`. | Starts without application code or verified test commands. |

## Where a builder could misread this design

| Possible misreading | Intended reading |
|---|---|
| Use the current hour to calculate a duration. | Compare local calendar date fields, so today is `0` at every hour. |
| Parse the input with `new Date(input)` and use its timestamp. | Parse and validate fields, then use UTC arithmetic only for integer day numbers. |
| Show signed weeks or add `ago` to today. | Format magnitude in weeks mode and add `ago` only for a negative difference. |
| Treat malformed and impossible dates alike. | Malformed shape prints usage; impossible date prints `Invalid date: <input>`. |
| Treat the parent result approval as covering the sub-item. | Each item gets its own result approval. |

## Notes

### Open design questions

None.

### Design changes during the interview

Mike Rihm confirmed the proposed default wording and requested a separate `--weeks` sub-item before implementation on 2026-09-28.

### Current position and next step

Record the approved design, split `--weeks` into a sub-item, and plan the build.
