# Greet CLI

## Purpose and scope

This file records the delivered behavior of the local Node greeting command.

## Functional behavior

### CLI-02 — Print a shouted greeting

- Trigger or context: A command includes `--shout` and does not include `--help`.
- Required behavior: Capitalize the entire greeting, including the supplied or default name.
- Conditions and exceptions: With a name, `--shout` works before or after it. Without `--shout`, the command prints `Hello, Mike!` for Mike and `Hello, world!` with no name. `--help` takes precedence when both flags appear.
- User or system outcome: `--shout Mike` and `Mike --shout` print `HELLO, MIKE!`; `--shout` alone prints `HELLO, WORLD!`.
- Source: WI-001 requirements and result, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in local `main` at merge commit `9c83b89`; all six tests passed on 2026-09-27.

### CLI-01 — Show help for every flag

- Trigger or context: A command includes `--help`.
- Required behavior: Print usage and explain every supported flag, including `--help` and `--shout`.
- Conditions and exceptions: `--help` takes precedence wherever it appears, including with a name or `--shout`.
- User or system outcome: Help appears instead of a greeting.
- Source: WI-002 requirements and result, approved by Mike on 2026-09-27.
- Delivery status and evidence: Delivered in `main` at merge commit `9c83b89`; all six tests passed on 2026-09-27.

## Data and access rules

The command uses a supplied name or its default. It has no stored data or access controls.

## Integrations and dependencies

The command runs locally with Node. No external service is required.

## Acceptance evidence

- `npm test` passed six tests on local `main` on 2026-09-27, including shouted greetings in both flag positions, the default shouted greeting, and unchanged greetings without `--shout`.
- Direct CLI checks on 2026-09-27 produced `HELLO, MIKE!` in both flag positions, `HELLO, WORLD!` with no name, and the agreed normal greetings without `--shout`.
- `npm test` passed six tests on `main` on 2026-09-27, including `--help` alone, before or after a name, and with `--shout` in either order.
- `node bin/greet.mjs --help` displayed usage and explanations for both flags on 2026-09-27.
- The README documents both flags.

## Change history

- 2026-09-27 — Added delivered `--shout` behavior from WI-001, approved by Mike.
- 2026-09-27 — Added delivered `--help` behavior from WI-002, approved by Mike.
