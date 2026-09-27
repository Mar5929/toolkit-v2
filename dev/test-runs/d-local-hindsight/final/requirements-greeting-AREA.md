# Greeting CLI

## Purpose and scope

The local Node.js command prints a greeting for a supplied name or for the world by default. WI-001 approved the `--shout` behavior; WI-002 delivered its README documentation.

## Functional behavior

### G-01 — Standard greeting

- Trigger or context: Run the command without `--shout`.
- Required behavior: Print `Hello, <name>!` for a supplied name or `Hello, world!` with no name.
- Conditions and exceptions: No other conditions are defined.
- User or system outcome: One greeting is printed.
- Source: WI-001 R-01, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in `bin/greet.mjs`; `npm test` passed on 2026-09-27.

### G-02 — Shout greeting

- Trigger or context: Run the command with `--shout` before or after the name, or with the flag alone.
- Required behavior: Print the entire greeting in capital letters.
- Conditions and exceptions: With a name of `Mike`, print `HELLO, MIKE!`; with no name, print `HELLO, WORLD!`. Calls without the flag use G-01.
- User or system outcome: One capitalized greeting is printed.
- Source: WI-001 R-01, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in `bin/greet.mjs`; exact-output tests in `test/greet.test.mjs` passed on 2026-09-27.

### G-03 — Flag documentation

- Trigger or context: A user reads `README.md` to learn the command.
- Required behavior: Document `--shout` with invocations and their output.
- Conditions and exceptions: The flag may appear before or after the name.
- User or system outcome: The README explains how to print a capitalized greeting.
- Source: WI-001 R-02 and WI-002, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in `README.md`; its examples were run and matched on 2026-09-27.

## Data and access rules

The command uses its arguments to produce output. No stored data or account access is involved.

## Integrations and dependencies

The command runs with Node.js. No other service is used.

## Acceptance evidence

`npm test` passed five tests on 2026-09-27, covering both flag positions, the default greeting, and unchanged output without the flag. Both README examples produced their documented output.

## Change history

- 2026-09-27 — `--shout` behavior and README documentation delivered and approved under WI-001 and WI-002.
