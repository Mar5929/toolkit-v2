# Greet CLI

## What this area does today

The local Node.js CLI prints a greeting for a supplied name, greets the world when no name is given, or prints version `0.1.0` when `--version` is present. This was verified on `main` on 2026-09-27.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| CLI entry point | Reads arguments and prints one result | `bin/greet.js` | Commits `cf0b951` and `ce657c1` |
| Version metadata | Supplies the version string | `package.json` | Commit `ce657c1` |
| CLI tests | Checks greetings and version precedence | `tests/greet.test.js` | Five tests passed on `main`, 2026-09-27 |

## Data and flow

Node.js passes command arguments to `bin/greet.js`. The script checks for `--version` first and reads the version from `package.json`. Otherwise it uses the first argument as the name or `world` when none is supplied. It writes the result to standard output.

## Operational behavior

Run the CLI with `node bin/greet.js`. The test suite uses Node.js built-in `node:test`; there are no npm package dependencies.

## Known gaps and uncertainty

Behavior for additional arguments other than `--version` has not been specified. No runtime environment beyond the local checkout has been verified.

## Last verified

- Date and environment: 2026-09-27, local `main` checkout.
- Sources: `bin/greet.js`, `package.json`, `tests/greet.test.js`, and `node --test tests/greet.test.js` (five passed).
- Maintainer: Project owner Mike.
