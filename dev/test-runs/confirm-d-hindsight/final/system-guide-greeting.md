# Greeting command

## What this area does today

The local Node.js command prints a greeting. It accepts an optional name and a `--shout` flag that prints the entire greeting in capital letters. Verified locally on 2026-09-28.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| CLI | Reads arguments and prints the greeting. | `bin/greet.mjs` | Source at 9c30dd9; direct command check on 2026-09-28. |
| Tests | Check greeting output and flag positions. | `test/greet.test.mjs` | `npm test` passed 7 of 7 on 2026-09-28. |
| Usage guide | Documents the flag and an example. | `README.md` | Example matched direct command output on 2026-09-28. |

## Data and flow

The CLI reads the argument list. It detects `--shout`, takes the first other argument as the name, builds the greeting with `greet(name)`, then uppercases the complete greeting when the flag is present. It prints the result to standard output.

## Operational behavior

Run locally with `node bin/greet.mjs [name] [--shout]`. The command has no service, stored data, or external integration.

## Known gaps and uncertainty

No known gap in the delivered WI-001 and WI-002 behavior. Other arguments and flags were outside their approved requirements.

## Last verified

- Date and environment: 2026-09-28, local checkout on `main` at 9c30dd9.
- Sources: `bin/greet.mjs`, `test/greet.test.mjs`, `README.md`, `npm test`, and the direct CLI check.
- Maintainer: Project owner Mike.
