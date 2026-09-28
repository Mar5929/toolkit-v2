---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike Rihm"
---

# WI-001: Build slug command with max option — solution design

**Requirements:** WI-001 R-01 and R-02  
**Design status:** Approved  
**Requirements checked:** WI-001, R-01 and R-02, 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike Rihm on 2026-09-28

## What this design solves

Mike runs `node bin/slug.js "Hello World!"` and gets `hello-world`. An optional `--max` limits its length. The two behaviors are tracked in separate sub-items under WI-001.

## Requirements and design readiness

Both parent requirements were approved on 2026-09-28. R-01 belongs to the basic slug child. R-02 belongs to the max option child. No additional behavior is needed to build either one.

## What exists today

This repository has project records and a test-plan template, but no command implementation.

## Constraints and assumptions

The command runs directly with Node.js at `bin/slug.js`, uses no npm packages, and uses built-in `node:test` for automated checks. The title is one quoted argument. The optional `--max` may appear before or after it. Unicode letters and numbers outside Latin script remain valid title content.

## Design options

### Option A — One command file

Put argument parsing and slug conversion in `bin/slug.js`. Normalize accents, form lowercase hyphen-separated words, and reject content with no letters or numbers. Validate and apply `--max` after conversion. Test the command as a child process.

### Option B — Command plus conversion module

Keep CLI parsing in `bin/slug.js` and put conversion in `src/slug.js`. It would add a module boundary for future reuse, with an extra file and interface to maintain now.

## Option comparison

Both options meet R-01 and R-02. Option A uses one source file. Option B makes conversion reusable if another caller needs it.

## Recommendation and owner decision

**Recommendation:** Option A because this command has no second caller.  
**Owner decision:** Mike Rihm approved Option A in chat on 2026-09-28. He also directed that basic slug conversion and `--max` be tracked as separate sub-items under WI-001 before building.  
**Reason for decision:** Mike did not state a reason for choosing Option A.

## Selected design

### End-to-end flow

1. Read one quoted title from the command arguments. The max child adds optional `--max` followed by a positive whole number, before or after the title.
2. Normalize accented Latin letters to plain letters. Convert runs of non-letter and non-number characters to hyphens, lowercase the result, and remove edge hyphens.
3. Reject a title that yields no letters or numbers, with an error on stderr and exit code 1.
4. When `--max` is present, validate it, cut the completed slug to that character count, and remove a trailing hyphen. Print the result with a newline.

### Components and responsibilities

`bin/slug.js` owns command arguments, conversion, validation, stdout, stderr, and exit code. The basic child introduces the file and R-01 behavior. The max child extends the same file with R-02 behavior. `tests/slug.test.js` checks the command through Node.js child processes, with tests for each requirement.

### Data, access, and integration details

The command uses only process arguments and an output string. It stores no data. Input is handled as text and is never executed. It integrates only with Node.js process arguments and streams.

### Edge cases and failure behavior

A punctuation-only title prints an error and exits 1. Accented `Café` becomes `cafe`. Invalid `--max` values, including missing, zero, negative, and non-whole values, print an error and exit 1. Hyphens count toward the limit; a trailing hyphen at the cut point is removed.

### Release and ongoing operation

Run with `node bin/slug.js` after the change is delivered. No package installation or service is needed. Revert the command file to undo the implementation.

## Diagrams

No diagram is needed for this command.

## Build and verification plan

### Technical sequence

1. Split WI-001 into a basic slug child covering R-01 and a max option child covering R-02.
2. Build and test the basic slug command on its item branch.
3. Extend the same command with `--max` and test R-02 after the basic command is available.
4. Check each child against its acceptance cases, then check the combined command against both parent requirements.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | Run Hello World!, Café, and punctuation-only input through the CLI | `hello-world` and `cafe` each end with a newline; punctuation-only prints an error and exits 1 | `node:test` output and basic slug child history |
| R-02 | Run `--max 5`, `--max 6`, and missing, zero, negative, and non-whole values through the CLI | `hello` for both valid examples; each invalid value prints an error and exits 1 | `node:test` output and max option child history |

## Sources and decisions that affect the build

WI-001 approved R-01 and R-02 on 2026-09-28. Mike approved Option A and directed the split in chat on 2026-09-28. The project memory briefing records a preference for plain Node.js and built-in `node:test`.

## Where a builder could misread this design

Normalize accented letters before replacing separators. Count output characters including hyphens. Remove a trailing hyphen after cutting. Print errors on stderr with exit code 1.

## Notes

### Open design questions

None.

### Design changes during the interview

Mike directed separate sub-items for the basic slug and `--max` before building.

### Current position and next step

Option A was selected. Record design approval, then split WI-001 before building.