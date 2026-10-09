## What changed

- Renamed the project's writing rule to `document-clarity-standard.md` and updated its title and opening to state the reader's job directly.
- Updated the exact copy in `writing-harness-files`, every current reference, and the toolkit update steps for projects that still have the 0.9.1 filename.
- Shortened the `writing-harness-files` description and rewrote its opening and several steps so they follow the clarity standard. The complete list of harness file kinds remains in the skill body.
- Adjusted the skill checker to validate the complete list without forcing every kind into the skill description. Raised the toolkit plugin version to 0.9.2.

PR 24 separately removes `explain-simply` and `choosing-outside-tools`. It also proposes version 0.9.2, so its version will need updating before that PR lands after this one.

## Checks

All seven checks in `AGENTS.md` passed: three plugin validations, the workstreams plugin tests (14 pass), the skill check (23 skills, no errors), the rule check (three existing size warnings), and the Node tests (112 pass).
