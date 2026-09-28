# Slug command

## What this area does today

As checked locally on 2026-09-28, `node bin/slug.js` turns a supplied blog title into a slug and can limit its length with `--max`.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| Command | Reads arguments, converts the title, validates and applies `--max`, prints the result or an error | [`bin/slug.js`](../bin/slug.js) | Code in commit `4d20885` |
| CLI checks | Runs the conversion and error cases | [`tests/slug.test.js`](../tests/slug.test.js) | 7 of 7 passed on 2026-09-28 |

## Data and flow

The command reads the title and optional `--max` from its arguments, converts the title, applies the length limit when supplied, then writes the slug to standard output. Invalid input writes an error to standard error and exits with code 1.

## Operational behavior

Run it with Node.js from the project root. The command has no package installation or external service dependency.

## Known gaps and uncertainty

None identified in the approved WI-001 acceptance cases.

## Last verified

- Date and environment: 2026-09-28, local `main` checkout.
- Sources: `bin/slug.js`, `tests/slug.test.js`, and WI-001 through WI-003.
- Maintainer: Project owner Mike Rihm.
