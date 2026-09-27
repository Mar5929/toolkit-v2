# Greeting CLI

## Purpose and scope

The `greet` command prints a greeting or its version when run with the documented arguments. WI-001 approved greetings; WI-002 approved `--version`.

## Functional behavior

### GREET-01 — Greet a person or the world

- Trigger or context: Run `node bin/greet.js` with one name or no argument.
- Required behavior: One name prints `Hello, <name>!` followed by a newline. No name prints `Hello, world!` followed by a newline.
- Conditions and exceptions: Behavior for additional arguments is outside this rule.
- User or system outcome: The greeting appears on standard output.
- Source: WI-001, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered on main in commit `78bbe1e`; the named and default greeting checks passed on 2026-09-27.

### GREET-02 — Show the version

- Trigger or context: Run `node bin/greet.js --version` with no other argument.
- Required behavior: Print only `0.1.0` followed by a newline and exit successfully. The value comes from `package.json`.
- Conditions and exceptions: The rule applies when `--version` is the sole argument.
- User or system outcome: The version appears on standard output.
- Source: WI-002, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered on main in commit `41fbaab`; the version check passed on 2026-09-27.

## Data and access rules

The command uses its argument and the package version. No persistent data or account access is involved.

## Integrations and dependencies

Node.js runs the command. The version is read from `package.json`.

## Acceptance evidence

`node --test` passed all three checks on 2026-09-27. Direct runs printed `Hello, Mike!`, `Hello, world!`, and `0.1.0`. See `tests/WI-001-TEST-PLAN.md` and `tests/WI-002-TEST-PLAN.md`.

## Change history

- 2026-09-27 — Greeting behavior delivered and approved under WI-001.
- 2026-09-27 — Version behavior delivered and approved under WI-002.
