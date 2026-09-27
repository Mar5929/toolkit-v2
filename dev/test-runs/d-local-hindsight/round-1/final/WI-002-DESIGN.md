---
work_item: WI-002
status: approved
approved: 2026-09-27 by Mike
---
# WI-002: Add --help option listing every flag — solution design

**Requirements:** WI-002  
**Design status:** Approved  
**Requirements checked:** WI-002 Requirements, approved by Mike on 2026-09-27  
**Last updated:** 2026-09-27  
**Design approval:** Approved by Mike on 2026-09-27

## What this design solves

A person running `greet` can ask for help in any argument position and see every supported flag. `--help` takes precedence over a name and `--shout`. WI-001 remains responsible for the existing greeting and `--shout` behavior.

## Requirements and design readiness

The requirements are approved and ready to design. The exact wording of help text is an implementation detail; the required content and precedence are explicit.

| Requirement | Status in work item | Design coverage | Remaining decision or gap |
| --- | --- | --- | --- |
| R-01 — Help output lists every flag | Finalized | Both options print help for `--help` anywhere and list `--help` and `--shout`. | Mike chooses the parsing option. |
| R-02 — README documents the help flag | Finalized | Both options update the README with both flags. | None. |

## What exists today

The WI-001 worktree's `bin/greet.mjs` checks `args.includes('--shout')`, takes the first argument other than `--shout` as the name, then calls `greet(name, shout)`. Its tests cover `--shout` before and after a name and normal greetings. The README describes `--shout`; no help behavior is built. The local Node version is v25.8.1.

## Constraints and assumptions

| Type | Constraint or assumption | Source and status | Effect on the design |
| --- | --- | --- | --- |
| Constraint | `--help` wins in any position, including with a name or `--shout`. | WI-002 R-01; Mike, 2026-09-27; approved | Both options check or parse all arguments before printing a greeting. |
| Constraint | Existing greetings and `--shout` in both positions remain working. | WI-001 R-01; approved | Both options retain the existing output and tests. |
| Constraint | Every flag is documented in the README. | WI-002 R-02; approved | Both options update the README. |
| Assumption | No new policy for unknown flags or extra names is required by WI-002. | WI-002 requirements; unspecified, so treated as an assumption | The options state any difference in those cases. |

## Design options

### Option A — Extend the current checks

#### Approach

Keep the current argument checks in `bin/greet.mjs`. Check the entire argument list for `--help` first and print a short usage message that explains `--help` and `--shout`. If help is absent, use the existing `--shout` check and name selection. This is the smallest change to the built WI-001 code.

#### End-to-end behavior

1. The person runs `greet` with any combination of a name, `--shout`, and `--help`.
2. If any argument is `--help`, the CLI prints help and stops. Otherwise it reads `--shout` and the first other argument as the name.
3. The person sees help or the existing greeting. Help contains a usage line and descriptions of both flags.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Add help branch and text to `bin/greet.mjs`; reuse existing greeting path. | The help check precedes both name selection and shout handling. | Run all five help examples and existing greeting examples. |
| R-02 | Update `README.md`. | It explains both supported flags. | Read the flag descriptions and examples. |

#### Technical shape

- **Components and files:** `bin/greet.mjs` checks for `--help` before the existing checks and prints one help text constant. `test/greet.test.mjs` adds CLI cases. `README.md` lists both flags.
- **Data and state:** No stored data or state.
- **Access and security:** Not applicable.
- **Integrations:** No new package or service.
- **Operations:** Run `npm test` and the CLI examples. Existing release process remains unchanged.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Each added flag needs another manual check. | Low impact with two flags; maintenance grows if more are added. | Move to a structured parser if the CLI gains more flags or values. |
| An unrecognized flag is still treated as a name. | Existing behavior remains; it may surprise a user. | No change under WI-002; decide an error policy if needed later. |

#### Build order

1. Add the help text and early `--help` check to the WI-001 CLI code.
2. Add tests for all five required help combinations and rerun existing greetings.
3. Document `--help` and `--shout` in the README; run `npm test` and the CLI examples.

### Option B — Use Node's built-in argument parser

#### Approach

Use `parseArgs` from `node:util` with two Boolean options, `help` and `shout`, and `allowPositionals: true`. Read the returned option values and positional name. Print help when `help` is true; otherwise call the existing `greet` function with the name and `shout` value. This creates one explicit list of supported flags in the parser configuration.

#### End-to-end behavior

1. The person runs `greet` with a name and either flag in any position.
2. Node parses both flags and the positional name. If `help` is true, the CLI prints help; otherwise it prints the greeting.
3. An unknown flag causes a parse error under the parser's default strict behavior. This differs from the current CLI.

#### Requirement coverage

| Requirement | Build or reuse | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | Replace manual argument checks in `bin/greet.mjs` with `parseArgs`; add help text. | Both Boolean flags are recognized before output selection; positional names work before or after flags. | Run all five help examples and existing greeting examples. |
| R-02 | Update `README.md`. | It explains both supported flags. | Read the flag descriptions and examples. |

#### Technical shape

- **Components and files:** `bin/greet.mjs` imports `parseArgs` from `node:util`, defines both Boolean options, enables positional arguments, and selects help or greeting output. Tests and README change as in Option A.
- **Data and state:** No stored data or state.
- **Access and security:** Not applicable.
- **Integrations:** Node's built-in `node:util`; no package dependency. The supported Node version should be recorded if this option is selected.
- **Operations:** Run `npm test` and the CLI examples. Existing release process remains unchanged.

#### Tradeoffs and risks

| Tradeoff or risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| Unknown flags change from greeting text to a parser error. | Certain if an unknown flag is entered; outside approved acceptance. | Accept the change with this option or keep Option A. |
| Parser support depends on the Node runtime. | The local v25.8.1 runtime supports the needed behavior; the project does not declare a minimum Node version. | Record a supported Node version and verify CI/runtime before building. |

#### Build order

1. Replace the manual argument checks with `parseArgs` and add help text.
2. Add help and regression tests, including flags on either side of the name.
3. Document both flags; run `npm test` and the CLI examples on the supported Node version.

## Option comparison

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| Approved behavior | Meets R-01 and R-02 | Meets R-01 and R-02 | WI-002 acceptance examples; Node behavior checked locally. |
| Change to current CLI | One early help check and help text | Replaces current flag selection | WI-001 `bin/greet.mjs`. |
| Unknown flags | Existing behavior: used as the name | Parser error | Node `parseArgs` defaults to strict mode. |
| Future flags | Requires another manual check | Add another parser option | Node `parseArgs` option map. |
| Runtime requirement | Existing Node setup | Declare and check Node support for `parseArgs` | The project has no `engines` field. |

## Recommendation and owner decision

**Recommendation:** Option A. It meets the two approved flag requirements with the least change to WI-001 and preserves current behavior for other arguments. Option B is useful if more flags are planned and Mike wants the stricter unknown-flag behavior.  
**Owner decision:** Option A. Mike said, "Go with option A." on 2026-09-27.  
**Reason for decision:** Mike did not state a reason.

## Selected design

Extend the current argument checks in `bin/greet.mjs`.

### End-to-end flow

Check every argument for `--help` first. If present, print usage and explanations of `--help` and `--shout`, then stop. Otherwise, keep the current `--shout` and name handling.

### Components and responsibilities

`bin/greet.mjs` handles argument checks and output. `test/greet.test.mjs` covers help precedence and greeting regressions. `README.md` explains both flags.

### Data, access, and integration details

No stored data, new access, or integration is needed.

### Edge cases and failure behavior

`--help` wins wherever it appears. Without help, the existing behavior for unknown flags and extra names remains. With no name, the existing default greeting remains.

### Release and ongoing operation

Run `npm test` and the accepted CLI examples. No deploy command is configured.

## Build and verification plan

### Technical sequence

1. Add the early `--help` check and help text to the WI-001 CLI code.
2. Test the five required help combinations and existing greetings.
3. Document both flags in `README.md`, then run `npm test` and the CLI examples.

### Acceptance checks

| Requirement or acceptance item | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | CLI runs for the five required help combinations and existing greeting examples | Help wins and lists both flags; greetings remain as approved | `test/greet.test.mjs` and work item test history |
| R-02 | README review | Both flags and their effects are documented | `README.md` and work item test history |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| `--help` wins in any position. | WI-002 R-01 and Q-01 | 2026-09-27 | Owner decision | Requirements approved by Mike. |
| WI-001 uses `includes` and `find` for `--shout`. | WI-001 worktree `bin/greet.mjs` | 2026-09-27 | Project evidence | Read the current file and tests. |
| `parseArgs` supports Boolean options and positionals; strict is true by default. | https://nodejs.org/api/util.html#utilparseargsconfig | 2026-09-27 | Official documentation | Read Node documentation and ran the accepted flag positions locally with Node v25.8.1. |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading and how the design makes it clear |
| --- | --- | --- |
| R-01 | Help only works as the first argument. | Search or parse all arguments; help wins even after a name or `--shout`. |
| R-01 | Help needs to list `--shout` but not `--help`. | List and explain both supported flags. |
| Option B | `parseArgs` keeps unknown-flag behavior unchanged. | Its strict default causes an error; the option comparison calls out the change. |

## Notes

### Open design questions

| Question | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| Which flag-reading option should be built? | Design options | Mike | Answered | Option A, selected 2026-09-27. |

### Design changes during the interview

None.

### Current position and next step

Requirements are approved. Mike selected Option A. Approve the selected design, then plan and build WI-002.
