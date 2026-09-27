# Greet CLI

## Purpose and scope

The `greet` command prints a greeting or its version for a person running it with Node.js.

## Functional behavior

### G-01 — Greet a name or the world

- Trigger or context: Run `node bin/greet.js` with a name or with no argument.
- Required behavior: With a name, print `Hello, <name>!` followed by a newline. With no name, print `Hello, world!` followed by a newline.
- Conditions and exceptions: Behavior with multiple names is unspecified. The version flag takes precedence over a name.
- User or system outcome: The greeting appears on standard output.
- Source: WI-002 R-01, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in commit `8eab12e`; `node --test` passed on `main` on 2026-09-27.

### G-02 — Show the version

- Trigger or context: Run `node bin/greet.js --version`, with or without a name.
- Required behavior: Print `0.1.0` followed by a newline.
- Conditions and exceptions: `--version` takes precedence when a name is also supplied.
- User or system outcome: The version appears on standard output.
- Source: WI-002 R-02, delivered by WI-003 and approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in commit `3cf4d87`; `node --test` passed on `main` on 2026-09-27.

## Data and access rules

No stored data or access controls are part of these requirements.

## Integrations and dependencies

The command runs in Node.js. The version comes from `package.json`.

## Acceptance evidence

On `main` on 2026-09-27, `node --test` passed all four checks: named greeting, greeting with no name, version alone, and version with a name.

## Change history

- 2026-09-27 — Mike approved WI-002 and WI-003 results and their local merges. Both behaviors were delivered on `main`.
