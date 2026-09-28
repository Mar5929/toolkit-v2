# Tip command

## Purpose and scope

The terminal command calculates a restaurant bill's tip and total. It can also show an amount for each person when the bill is split.

## Functional behavior

### R-01 — Show tip and total

- Trigger or context: Run `node bin/tipcalc.js <bill> --percent <percentage>`.
- Required behavior: Round the tip to the nearest cent, with a half cent rounded up. Add the rounded tip to the bill. Print both amounts with two decimal places.
- Conditions and exceptions: The bill is zero or more with at most two decimal places. The percentage is from 0 to 100, inclusive.
- User or system outcome: `node bin/tipcalc.js 50 --percent 20` prints `Tip: $10.00  Total: $60.00`.
- Source: WI-001, approved by Mike Rihm on 2026-09-28.
- Delivery status and evidence: Delivered on `main` at `a6d571c`; `node --test` passed 9 tests on 2026-09-28.

### R-02 — Show a share when splitting

- Trigger or context: Add `--split <people>` to the command.
- Required behavior: Divide the total, including the rounded tip, by the number of people. Round each share up to the next cent and print `Each person pays: $<amount>` on a second line.
- Conditions and exceptions: The number of people is a whole number of 1 or more. Each share has two decimal places.
- User or system outcome: A $50 bill at 20 percent split three ways shows `$20.00` per person. A $10 bill at 0 percent split three ways shows `$3.34` per person.
- Source: WI-001 R-02, delivered by WI-002; approved by Mike Rihm on 2026-09-28.
- Delivery status and evidence: Delivered on `main` at `a6d571c`; `node --test` passed 9 tests on 2026-09-28.

### R-03 — Explain invalid input

- Trigger or context: Required input is missing or any input is invalid.
- Required behavior: Print an error that explains the valid input and exit with code 1.
- Conditions and exceptions: Bills must be nonnegative with at most two decimal places; percentages must be from 0 to 100; split counts must be whole numbers of 1 or more.
- User or system outcome: A person can correct the input and rerun the command.
- Source: WI-001 R-03, with split validation delivered by WI-002; approved by Mike Rihm on 2026-09-28.
- Delivery status and evidence: Delivered on `main` at `a6d571c`; `node --test` passed 9 tests on 2026-09-28.

## Data and access rules

The command uses values supplied on the command line. It does not store bill data.

## Integrations and dependencies

Node.js runs the command. The implementation uses Node built-in APIs.

## Acceptance evidence

See `tests/WI-001-TEST-PLAN.md`, `tests/WI-002-TEST-PLAN.md`, and `tests/tipcalc.test.js`. The owner said on 2026-09-28 that the whole tip command works the way he asked.

## Change history

- 2026-09-28 — Tip, total, split, and input validation delivered under WI-001 and WI-002.
