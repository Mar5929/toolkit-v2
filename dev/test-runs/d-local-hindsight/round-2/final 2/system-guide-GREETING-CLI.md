# Greeting CLI

## What this area does today

The local Node.js command prints a greeting for a supplied name or `world`. With `--shout`, it prints the whole greeting in capital letters. This was checked in the local worktree on 2026-09-27.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| Greeting command | Reads arguments and prints the greeting | [bin/greet.mjs](../bin/greet.mjs) | Code and CLI output checked on 2026-09-27 |
| Automated tests | Check default, named, and shout behavior | [test/greet.test.mjs](../test/greet.test.mjs) | Six tests passed on 2026-09-27 |
| Usage guide | Shows `--shout` examples | [README.md](../README.md) | Examples matched CLI output on 2026-09-27 |

## Data and flow

The command reads arguments after the script name. It detects `--shout`, removes that flag from the arguments, and uses the first remaining argument as the name. The `greet` function forms `Hello, <name>!`, using `world` when no name is provided. The command uppercases the full greeting when `--shout` is present, then prints it.

## Operational behavior

The command runs locally with Node.js. `npm test` runs its automated checks. No external service, stored data, or deployment command is involved.

## Known gaps and uncertainty

No gap was found in the approved WI-001 and WI-002 scope. Other flags have not been specified.

## Last verified

- Date and environment: 2026-09-27, local Node.js worktree at `dfabaf3`.
- Sources: [CLI code](../bin/greet.mjs), [tests](../test/greet.test.mjs), [README](../README.md), WI-001 and WI-002.
- Maintainer: Project owner Mike.
