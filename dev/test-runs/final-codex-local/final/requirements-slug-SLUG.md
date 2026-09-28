# Slug command

## Purpose and scope

Mike can turn a blog title into a URL-friendly slug with `node bin/slug.js`. The command also accepts an optional maximum length.

## Functional behavior

### R-01 — Convert a title

- Trigger or context: Run `node bin/slug.js "<title>"`.
- Required behavior: Print a lowercase slug followed by a newline. Spaces between words become hyphens, punctuation is removed, and accented letters such as `é` become plain letters such as `e`.
- Conditions and exceptions: A title with no letters or numbers prints an error and exits with code 1.
- User or system outcome: `Hello World!` prints `hello-world`; `Café` prints `cafe`.
- Source: WI-001 R-01, delivered by WI-002.
- Delivery status and evidence: Delivered on 2026-09-28 in commit `d6f9221`; [CLI checks](../../tests/slug.test.js) passed on local `main`.

### R-02 — Limit the slug length

- Trigger or context: Add `--max <number>` to the command.
- Required behavior: Limit the slug to the requested number of characters, counting hyphens. Remove a trailing hyphen after cutting.
- Conditions and exceptions: A missing, zero, negative, or non-whole-number value prints an error and exits with code 1.
- User or system outcome: `Hello World --max 5` and `Hello World --max 6` both print `hello`.
- Source: WI-001 R-02, delivered by WI-003.
- Delivery status and evidence: Delivered on 2026-09-28 in commit `4d20885`; [CLI checks](../../tests/slug.test.js) passed on local `main`.

## Data and access rules

The command uses the title and option supplied on the command line. It has no stored project data or account access.

## Integrations and dependencies

The command uses Node.js built-in features. It has no npm package dependencies.

## Acceptance evidence

`node --test tests/slug.test.js` passed 7 of 7 checks on local `main` on 2026-09-28. Mike also ran the basic and maximum-length cases in the worktrees and approved WI-002 and WI-003.

## Change history

- 2026-09-28 — Delivered R-01 and R-02 from WI-001 through WI-002 and WI-003.
