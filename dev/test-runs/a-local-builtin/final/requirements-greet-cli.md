# Greet CLI

## Purpose and scope

The Node.js command-line tool prints a greeting or its version. These rules cover the commands approved in WI-001 and WI-002. Other arguments have no specified behavior.

## Functional behavior

### G-01 — Greeting

- Trigger or context: Run `node bin/greet.js` without `--version`.
- Required behavior: With `Mike` as the name, print `Hello, Mike!` followed by a newline. With no name, print `Hello, world!` followed by a newline.
- Conditions and exceptions: Behavior for additional arguments has not been specified.
- User or system outcome: One greeting is written to standard output.
- Source: WI-001 R-01, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in commit `cf0b951`; the greeting tests passed on `main` on 2026-09-27.

### G-02 — Version

- Trigger or context: Run `node bin/greet.js` with `--version`.
- Required behavior: Print `0.1.0` followed by a newline, whether a name is present or not.
- Conditions and exceptions: The version takes precedence over the greeting when both a name and `--version` are present.
- User or system outcome: Only the version is written to standard output.
- Source: WI-001 R-02, delivered by WI-002; approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in commit `ce657c1`; the version tests passed on `main` on 2026-09-27.

## Data and access rules

The CLI reads arguments and prints to standard output. No stored user data or access rules are involved.

## Integrations and dependencies

The CLI uses Node.js. The version is read from `package.json`.

## Acceptance evidence

`node --test tests/greet.test.js` passed all five tests on `main` on 2026-09-27. The tests check exact standard output, empty standard error, and exit status for both greetings and all three version commands. Mike approved both results on 2026-09-27.

## Change history

- 2026-09-27 — Greeting delivered through WI-001 and version flag through WI-002; both results approved by Mike.
