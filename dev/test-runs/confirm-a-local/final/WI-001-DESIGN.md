---
work_item: WI-001
status: approved
approved: "2026-09-28 by Mike"
---
# WI-001: Build tally word count CLI — solution design

**Requirements:** WI-001 R-01 and R-02  
**Design status:** Approved  
**Requirements checked:** WI-001 R-01 and R-02, 2026-09-28  
**Last updated:** 2026-09-28  
**Design approval:** Approved by Mike on 2026-09-28

## What this design solves

Mike runs a command on a named text file and sees one integer: the word count by default, or the line count with --lines. WI-001 delivers word mode; its child WI-002 delivers line mode.

## Requirements and design readiness

Both requirements are Finalized in WI-001. An independent requirements review found no material gap.

| Requirement | Delivery item | Design coverage |
|---|---|---|
| R-01 — Word count by default | WI-001 | Option A word mode |
| R-02 — Line count with --lines | WI-002 | Option A line mode |

## What exists today

The repository had no application code when the design was proposed on 2026-09-28. It has a test plan template but no bin directory.

## Constraints and assumptions

- Run as node bin/tally.js <file-path> or node bin/tally.js --lines <file-path>, as Mike approved in the starting request.
- Use plain Node.js with no npm packages and node:test checks, per the recorded project preference.
- Files are ordinary UTF-8 text files that fit in memory. This is an approved Option A assumption.

## Design options

### Option A — One Node.js command

Create bin/tally.js with built-in argument handling and file reading. Accept exactly a path, or --lines followed by a path. Reject missing or extra arguments, repeated --lines, unknown flags, and flags after the path. Read the file as UTF-8. Print one integer and a line break on success. Print a short error to standard error and exit nonzero for invalid arguments or file errors.

Word mode splits on runs of spaces or line breaks, discards empty pieces, and returns 0 for an empty file. Tabs are not word separators. Line mode counts LF, CR, and CRLF breaks, treating CRLF as one break; add one for a nonempty final segment. Blank lines count, a trailing break adds no extra line, and an empty file returns 0.

Hold the text in memory for one run. Read with the user's file permissions and never execute contents. tests/tally.test.js uses node:test, built-in assertions, and temporary files. A whole-file read may use too much memory for a large file; the approved scope is ordinary text files.

**Build order:** WI-001 adds word mode and its checks. WI-002 starts from that code and adds line mode and its checks.

## Recommendation and owner decision

**Recommendation:** Option A, one plain Node.js command with no package dependency.  
**Owner decision:** Mike approved Option A on 2026-09-28.  
**Reason for decision:** Mike's approval followed the proposal and its independent requirements and design reviews. He also requested that --lines be delivered by a sub-item.

## Selected design

Option A is selected. WI-001 and WI-002 deliver its modes separately.

### End-to-end flow

1. Mike runs node bin/tally.js notes.txt for words or node bin/tally.js --lines notes.txt for lines.
2. The command checks the exact accepted argument form before reading.
3. It reads UTF-8 text, calculates the requested count, and prints one integer with a line break.
4. Invalid arguments or read failures print a short error to standard error and exit nonzero.

### Components and responsibilities

- bin/tally.js owns argument parsing, file reading, counting, output, and errors.
- tests/tally.test.js checks both modes and invalid input using node:test and temporary files.
- WI-001 adds the default mode; WI-002 extends the same files with --lines.

### Data, access, and integration details

The command reads one named local file using the caller's permissions. It keeps text in memory for one run and stores nothing. It uses built-in Node.js modules only.

### Edge cases and failure behavior

Empty files print 0 in both modes. Repeated spaces and line breaks do not add words. Tabs are not separators for words. Blank lines count. A final nonempty line counts without a trailing break, while a trailing break adds no extra line. CRLF is one break. Reject unknown, repeated, misplaced, missing, and extra arguments. File errors go to standard error with nonzero exit.

### Release and ongoing operation

No service, database, migration, package installation, or deployment is needed. Run the command with Node.js. A larger-file requirement would need a separate design change.

## Build and verification plan

### Technical sequence

1. WI-001: implement default word mode and argument/file errors in bin/tally.js.
2. WI-001: add node:test checks for sample, repeated separators, empty file, and error paths; run a manual word-count command.
3. WI-002: start from the completed WI-001 code and implement --lines, including LF, CR, and CRLF.
4. WI-002: add checks for blank lines, trailing break, final nonempty line, empty file, invalid flag use, and a manual --lines command.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
|---|---|---|---|
| R-01 | node:test and manual sample, repeated separator, and empty-file runs | Counts match WI-001 R-01 | WI-001 test output and review |
| R-02 | node:test and manual blank, trailing-break, final-line, CRLF, and empty-file runs | Counts match WI-001 R-02 | WI-002 test output and review |
| Argument and file errors | node:test invalid argument and missing-file runs | Error on standard error and nonzero exit | Test output |

## Diagrams

The command has one path: parse arguments, read the named file, count words or lines, then print the number. No separate components or shared state need a diagram.

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
|---|---|---|---|---|
| Default word and --lines behavior | WI-001 R-01, R-02, Q-01, Q-02 | 2026-09-28 | Owner decision | Requirements approval in WI-001 |
| Option A selected and scope split | Mike in chat | 2026-09-28 | Owner decision | Approval and history in WI-001; WI-002 created with --covers R-02 |
| No application code existed | Repository scan | 2026-09-28 | Project evidence | No bin directory or application source found |
| Plain Node.js and node:test preference | Project memory | 2026-09-28 | Project evidence | Session briefing |

## Where a builder could misread this design

- Repeated separators add no words; tabs are not word separators.
- Blank lines count, a trailing break adds no line, and a final nonempty line counts.
- CRLF is one line break.
- Print only the integer and a line break, with no label.
- --lines must appear once before the path.
- WI-002 delivers R-02; it inherits the approved parent requirement and design.

## Notes

### Open design questions

None.

### Design changes during the interview

Mike clarified blank and trailing line behavior in WI-001 Q-02 on 2026-09-28. He approved Option A and split --lines into WI-002 on 2026-09-28.

### Current position and next step

The design is approved and complete. Plan and build WI-001 word mode first, then WI-002 line mode.

Checked again by Mike on 2026-09-28.
