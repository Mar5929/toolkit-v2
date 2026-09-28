# Greeting command

## Purpose and scope

The local `greet` command prints a greeting for an optional name. The `--shout` flag changes its output to capital letters.

## Functional behavior

### G-01 — Print a greeting

- Trigger or context: Run `node bin/greet.mjs` with an optional name.
- Required behavior: Print `Hello, world!` with no name or `Hello, <name>!` with a name.
- Conditions and exceptions: Without `--shout`, the greeting keeps this capitalization.
- User or system outcome: One greeting is printed to standard output.
- Source: Delivered WI-001 R-01, approved by Mike on 2026-09-28.
- Delivery status and evidence: Delivered on `main` at 9c30dd9; the command tests passed on 2026-09-28.

### G-02 — Capitalize the complete greeting

- Trigger or context: Run the command with `--shout` before or after an optional name.
- Required behavior: Print the complete greeting in capital letters, including the name when provided.
- Conditions and exceptions: With no name, print `HELLO, WORLD!`.
- User or system outcome: `--shout Mike` and `Mike --shout` both print `HELLO, MIKE!`.
- Source: Delivered WI-001 R-01, approved by Mike on 2026-09-28.
- Delivery status and evidence: Delivered on `main` at 9c30dd9; the command tests passed on 2026-09-28.

### G-03 — Document the flag

- Trigger or context: A reader uses `README.md` to learn the command.
- Required behavior: The README describes `--shout` and gives a working command and output example.
- Conditions and exceptions: This rule covers the delivered `--shout` flag.
- User or system outcome: The README example `node bin/greet.mjs --shout Mike` prints `HELLO, MIKE!`.
- Source: Delivered WI-001 R-02 through WI-002, approved by Mike on 2026-09-28.
- Delivery status and evidence: Delivered on `main` at 9c30dd9; the documented example matched the command output on 2026-09-28.

## Data and access rules

The command uses its local arguments. No stored data or access controls are involved.

## Integrations and dependencies

The command runs with Node.js from `bin/greet.mjs`. `README.md` documents its use.

## Acceptance evidence

`npm test` passed 7 of 7 tests on `main` on 2026-09-28. Directly running `node bin/greet.mjs --shout Mike` printed `HELLO, MIKE!`.

## Change history

- 2026-09-28 — Mike approved the WI-001 and WI-002 results; `--shout` and its README documentation were delivered on `main` at 9c30dd9.
