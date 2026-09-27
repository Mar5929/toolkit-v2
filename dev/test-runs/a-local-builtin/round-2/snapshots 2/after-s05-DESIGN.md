---
work_item: WI-002
status: proposed
approved: "no"
---
# WI-002: Build greet CLI with --version — solution design

**Requirements:** WI-002
**Design status:** Proposed
**Requirements checked:** WI-002 Requirements, 2026-09-27
**Last updated:** 2026-09-27
**Design approval:** Pending

## What this design solves

A person runs `node bin/greet.js` to greet a name or the world, or to see version `0.1.0`. Both options meet WI-002's four approved command outputs. The choice is where the version value lives. Multiple-name behavior remains unspecified by WI-002.

## Requirements and design readiness

The requirements are approved and ready for design. The version source is a design choice, not an open behavior requirement.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Greet a person or the world | Finalized | Options A and B | None |
| R-02 — Show the version | Finalized | Options A and B | Owner chooses the version source |

## What exists today

`README.md` describes a tiny Node.js command-line tool. No application code or `package.json` exists. WI-002 has an implementation plan that proposes `package.json` as the version source; that plan is not an approved design.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | Print the four exact outputs in WI-002 Acceptance, including final newlines. | WI-002; approved by Mike, 2026-09-27 | Both options must pass all four checks. |
| Constraint | Prefer plain Node.js, no npm packages, and `node:test`. | Project memory and WI-002 Notes; recorded preference | Both options use Node.js built-ins. |
| Assumption | Use CommonJS for `bin/greet.js`. | Proposed design choice | `require('../package.json')` can load the manifest in Option A. |

## Design options

### Option A — Read `package.json` at runtime

#### Approach

Create `package.json`, the Node.js package metadata file, with `"version": "0.1.0"`. Use CommonJS, Node.js's `require()` module format, in `bin/greet.js` to read `require('../package.json').version`. The path resolves from the script, so the command works when run from another current directory. `package.json` is the single version source. Use Node.js built-ins and no installed packages.

#### End-to-end behavior

1. A person runs `node bin/greet.js` with a name, no name, `--version`, or a name with `--version`.
2. The command inspects `process.argv.slice(2)` for `--version` first. For the approved greeting case, it uses the sole supplied name. If present, it prints the manifest version. Otherwise, it prints `Hello, <name>!` or `Hello, world!`.
3. The person receives exactly one line on standard output, ending in a newline.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `bin/greet.js`; Node.js `process.argv` and `console.log` | Chooses the given name or `world` and prints one greeting. | Run the named and no-name acceptance commands; compare exact output. |
| R-02 | New `package.json`; CommonJS JSON loading in `bin/greet.js` | Prints the manifest's `0.1.0` before greeting when `--version` appears anywhere. | Run both version acceptance commands; compare exact output. |

#### Technical shape

- **Components and files:** New `package.json` holds the version and a `test` script. New `bin/greet.js` handles arguments and output. New `tests/greet.test.js` invokes the command as a child process, a separate Node.js run, and compares exact output and exit status.
- **Data and state:** `package.json` stores the version. Command arguments last for one run. No user data persists.
- **Access and security:** The command needs no credentials or network. It prints the name as text and does not execute it.
- **Integrations:** Local Node.js command line, standard output, and `package.json` only. A missing manifest is a packaging error with no fallback version.
- **Operations:** Change the version in `package.json` once, then rerun the version tests. Keep the manifest one directory above `bin/greet.js`.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Moving the script without its manifest breaks `--version`. | Possible if files are distributed separately. | Keep the package layout together and test `--version` after packaging changes. |
| Manifest loading adds a file dependency at runtime. | Small cost for a tiny local command. | Use the direct relative JSON load; no generated file or install step. |

#### Build order

1. Add `package.json` with version `0.1.0` and no dependencies. Check that Node.js can load it.
2. Add `bin/greet.js` with version precedence and greeting logic. Check the four exact outputs.
3. Add `tests/greet.test.js` with four process-level checks. Run `node --test`.

### Option B — Keep a version constant in `bin/greet.js`

#### Approach

Put `0.1.0` directly in `bin/greet.js`. The command needs no `package.json` to run. If the project later adds `package.json` for metadata or distribution, its version must be kept in sync with the script constant. WI-002's current P1-T01 task assumes a manifest source, so choosing Option B requires revising that task and the implementation plan before building.

#### End-to-end behavior

1. A person runs the same four approved command forms.
2. The command inspects `process.argv.slice(2)` for `--version` first. For the approved greeting case, it uses the sole supplied name. If present, it prints the constant. Otherwise, it prints the named or world greeting.
3. The person receives exactly one line on standard output, ending in a newline.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | New `bin/greet.js`; Node.js `process.argv` and `console.log` | Chooses the given name or `world` and prints one greeting. | Run the named and no-name acceptance commands; compare exact output. |
| R-02 | New constant in `bin/greet.js` | Prints `0.1.0` before greeting when `--version` appears anywhere. | Run both version acceptance commands; compare exact output. |

#### Technical shape

- **Components and files:** New `bin/greet.js` owns the constant, arguments, and output. New `tests/greet.test.js` checks four child-process results. `package.json` is optional for running the command.
- **Data and state:** The constant is in source code. Command arguments last for one run; no user data persists.
- **Access and security:** The command needs no credentials or network. It prints the name as text and does not execute it.
- **Integrations:** Local Node.js command line and standard output only. No `package.json` read is needed.
- **Operations:** Change the script constant for a new version. If `package.json` is added, change and check both values together.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| `package.json` could disagree with the CLI after a version change. | Possible after version updates; users see conflicting versions. | Add a consistency test if `package.json` is added, or choose Option A. |
| No manifest is needed for the command itself. | Less initial setup, but fewer package scripts and metadata. | Run `node --test` directly. Add metadata only when needed. |

#### Build order

1. Add `bin/greet.js` with the constant, version precedence, and greeting logic. Check the four exact outputs.
2. Add `tests/greet.test.js` with four process-level checks. Run `node --test`.
3. If a manifest is later needed, add `package.json` and a version consistency test.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Version source | One value in `package.json` | One script constant now; a second value if `package.json` is added | Node.js supports relative JSON loading; npm uses manifest version metadata. |
| Runtime files | Script and manifest | Script alone | Both meet WI-002's accepted commands. |
| Version changes | Edit the manifest once | Edit the constant, plus manifest if one exists | Option B can drift after `package.json` is added. |
| Build work | Matches WI-002's current P1-T01 task | Requires revising P1-T01 and the implementation plan | The current task is a proposal, not an approved design. No package installation or generation step is needed in either option. |

## Recommendation and owner decision

**Recommendation:** Option A. The manifest already has a standard version field, and the CLI can read it directly without a package or build step. It adds one small runtime file dependency.
**Owner decision:** Pending.
**Reason for decision:** Pending owner choice.

## Selected design

Pending owner decision.

## Build and verification plan

### Technical sequence

1. After the owner chooses, follow the selected option's build order.
2. Verify exact standard output and successful exit for the four approved command forms with `node:test` and direct runs.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 named | `node bin/greet.js Mike` | `Hello, Mike!` and newline | WI-002 test results |
| R-01 no name | `node bin/greet.js` | `Hello, world!` and newline | WI-002 test results |
| R-02 flag | `node bin/greet.js --version` | `0.1.0` and newline | WI-002 test results |
| R-02 name and flag | `node bin/greet.js Mike --version` | `0.1.0` and newline | WI-002 test results |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| WI-002's four outputs are approved. | WI-002 Requirements and Acceptance | 2026-09-27 | Owner decision | Read Mike's recorded approval and acceptance checks. |
| No application code or manifest exists. | Repository and WI-002 Notes | 2026-09-27 | Project evidence | Inspected repository file list and item. |
| CommonJS can load a relative JSON file. | [Node.js CommonJS modules](https://nodejs.org/api/modules.html) | 2026-09-27 | Official documentation | Checked relative `require()` paths and JSON loading. |
| `package.json` has a standard version field. | [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) | 2026-09-27 | Official documentation | Checked version metadata. |
| Plain Node.js and `node:test` are preferred. | Project memory and WI-002 Notes | 2026-09-27 | Project evidence | Read recorded preference. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | No name gives an error or empty greeting. | Print `Hello, world!` and newline. |
| R-02 | `--version` works only as the first argument. | Check all arguments; it takes precedence over a name. |
| Option A | Copy `0.1.0` into the CLI or read from the current directory. | Read `require('../package.json').version` relative to `bin/greet.js`. |
| Option B | `package.json` is already required or is the version source. | The script constant is the source; a manifest is optional. |
| R-01 | Multiple names need a defined joining rule. | Multiple-name behavior is unspecified; implement only approved cases. |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Choose Option A or Option B for the version source. | R-02 implementation | owner | Open | Mike selects a design option. |

### Design changes during the interview

None yet.

### Current position and next step

Requirements are approved. Options A and B are proposed. Mike chooses the version source before implementation. No application code has been written.
