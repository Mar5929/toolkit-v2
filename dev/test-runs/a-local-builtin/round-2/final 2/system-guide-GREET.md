# Greet CLI

## What this area does today

The local Node.js command prints a greeting or version to standard output. This was checked in the project checkout on 2026-09-27.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| Command | Reads arguments and prints a greeting or version | `bin/greet.js` | Commits `8eab12e` and `3cf4d87` |
| Package metadata | Holds version `0.1.0` | `package.json` | Commit `3cf4d87` |
| Process tests | Checks command output | `tests/greet.test.js` | Four tests passed with `node --test` on 2026-09-27 |

## Data and flow

The command reads arguments after the script path. If any argument equals `--version`, it reads the version from `package.json` and prints it. Otherwise, it uses the first argument as the name, or `world` when none is supplied, and prints the greeting.

## Operational behavior

The command runs with Node.js and has no npm package dependencies. Its test command is `node --test`.

## Known gaps and uncertainty

Behavior with multiple names is unspecified.

## Last verified

- Date and environment: 2026-09-27, local `main` checkout.
- Sources: `bin/greet.js`, `package.json`, `tests/greet.test.js`, and a passing `node --test` run.
- Maintainer: Mike, project owner.
