# Tally

## Purpose and scope

Tally counts words or lines in a text file for Mike through the command line.

## Functional behavior

### R-01 — Word count by default

- Trigger or context: Run `node bin/tally.js <file-path>` with no count flag.
- Required behavior: Print the number of words in the file. Spaces and line breaks separate words; repeated separators do not add words.
- Conditions and exceptions: An empty file prints 0. Tabs are not separators.
- User or system outcome: One integer followed by a line break appears on standard output.
- Source: WI-001, approved by Mike on 2026-09-28.
- Delivery status and evidence: Delivered on main. The five word-mode checks pass in `tests/tally.test.js`; Mike saw a four-word file print 4 and an empty file print 0.

### R-02 — Line count with --lines

- Trigger or context: Run `node bin/tally.js --lines <file-path>`.
- Required behavior: Print the number of lines instead of words. Blank lines count. A final nonempty line counts without a trailing line break. A trailing line break does not add another line.
- Conditions and exceptions: An empty file prints 0. LF, CRLF, and CR line breaks each count as one break.
- User or system outcome: One integer followed by a line break appears on standard output.
- Source: WI-001 R-02, delivered by WI-002; approved by Mike on 2026-09-28.
- Delivery status and evidence: Delivered on main. All nine checks pass in `tests/tally.test.js`; Mike saw four-line, two-line, and empty files print 4, 2, and 0.

### R-03 — Invalid input and file errors

- Trigger or context: The path is missing or extra, the flag is invalid or misplaced, or the file cannot be read.
- Required behavior: Print a usage or file error on standard error and exit with a nonzero status.
- Conditions and exceptions: Only an optional `--lines` before one file path is accepted.
- User or system outcome: No count appears on standard output.
- Source: WI-001 approved Option A design and WI-002 implementation.
- Delivery status and evidence: Delivered on main. Argument and missing-file checks pass in `tests/tally.test.js`.

## Data and access rules

Tally reads the named file as UTF-8 text. It does not change the file.

## Integrations and dependencies

Tally uses Node.js built-in file reading. It has no npm package dependency.

## Acceptance evidence

- `node --test` passed all nine checks after WI-002 was merged with main on 2026-09-28.
- Mike approved WI-001 and WI-002 results on 2026-09-28 after running the examples described above.

## Change history

- 2026-09-28 — WI-001 word count and WI-002 line count delivered and approved by Mike.
