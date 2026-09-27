# Greeting CLI

## Purpose and scope

The local greeting command prints a greeting for a supplied name or `world`. This file covers the command and its `--shout` flag.

## Functional behavior

### GREET-01 — Ordinary greeting

- Trigger or context: Run `node bin/greet.mjs` with no arguments or with a name.
- Required behavior: Print `Hello, world!` by default or `Hello, <name>!` for the supplied name.
- Conditions and exceptions: This behavior applies when `--shout` is absent.
- User or system outcome: The greeting is printed on one line.
- Source: WI-001 R-01, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered on local `main`; [CLI tests](../../test/greet.test.mjs) passed on 2026-09-27.

### GREET-02 — Shout greeting

- Trigger or context: Run the command with `--shout`, with or without a name.
- Required behavior: Print the whole greeting in capital letters, including the name.
- Conditions and exceptions: A name can appear before or after `--shout`. With no name, print `HELLO, WORLD!`.
- User or system outcome: `Mike --shout` and `--shout Mike` both print `HELLO, MIKE!`.
- Source: WI-001 R-01, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered on local `main` at `dfabaf3`; [WI-001 test plan](../../tests/WI-001-TEST-PLAN.md) and six passing automated tests on 2026-09-27.

### GREET-03 — Flag documentation

- Trigger or context: A reader consults the [README](../../README.md) for command usage.
- Required behavior: The README explains `--shout` and shows its output with the default name and a name in either argument order.
- Conditions and exceptions: None.
- User or system outcome: The examples match the command output.
- Source: WI-001 R-02 and WI-002, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered on local `main` at `dfabaf3`; [WI-002 test plan](../../tests/WI-002-TEST-PLAN.md) checked the examples on 2026-09-27.

## Data and access rules

The command uses local command-line arguments. No stored data or access controls are involved.

## Integrations and dependencies

Node.js runs `bin/greet.mjs`. There are no external services.

## Acceptance evidence

`npm test` passed six tests on 2026-09-27. The command printed `Hello, Mike!` without the flag and the uppercase greetings shown above with the flag. Mike approved the WI-001 and WI-002 results on 2026-09-27.

## Change history

- 2026-09-27 — Recorded delivered `--shout` behavior and README documentation from WI-001 and WI-002.
