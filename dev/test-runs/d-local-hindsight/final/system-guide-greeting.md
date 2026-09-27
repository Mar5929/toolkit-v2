# Greeting CLI

## What this area does today

The local Node.js command prints `Hello, <name>!` for a supplied name and `Hello, world!` by default. With `--shout`, it prints the entire greeting in capital letters. This was verified locally on 2026-09-27.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| CLI | Reads arguments and prints a greeting | `bin/greet.mjs` | Source code and exact-output tests |
| CLI tests | Check standard and shout output | `test/greet.test.mjs` | `npm test` passed five tests on 2026-09-27 |
| Usage guide | Shows command examples | `README.md` | Both shout examples produced their documented output |

## Data and flow

The CLI reads command-line arguments. The first argument other than `--shout` is used as the name; with no name, `greet` uses `world`. The CLI creates `Hello, <name>!`, converts it to uppercase when `--shout` is present, and prints it to standard output.

## Operational behavior

The command runs with Node.js. It has no account permissions, schedule, external service, or stored data.

## Known gaps and uncertainty

No further command-line behavior was verified beyond the cases in `test/greet.test.mjs` and the README examples.

## Last verified

- Date and environment: 2026-09-27, local Node.js.
- Sources: `bin/greet.mjs`, `test/greet.test.mjs`, `README.md`, WI-001, WI-002.
- Maintainer: Mike, project owner.
