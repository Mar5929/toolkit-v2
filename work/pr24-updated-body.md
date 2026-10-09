Mike, 2026-10-06: "Delete the Explain Simply skill and the Choosing Outside Tools skill. That should absolutely not be a skill. That just needs to be something that's just a simple file that's referenced in the toolkit v2 but doesn't get installed into projects."

## What changed

- Removed `explain-simply` from the starter project. A project now gets 9 shared skills. Toolkit update steps remove the old folder after the owner's yes.
- Removed `choosing-outside-tools` from the plugin. Its content is now `OUTSIDE-TOOLS.md` in the repository root; it is never copied into a project.
- Updated the skill index, setup references, counts, settings, manifests, and progress record. This branch includes the description changes from PR 25 and the document clarity rule rename from PR 26. The plugin version is 0.9.3.

## Checks

All seven commands in `AGENTS.md` passed on the conflict-resolved branch: three plugin validations, workstreams plugin tests (14 pass), `check-skills.mjs` (21 skills, 0 errors), `check-rules.mjs` (passed with the same three size warnings), and the Node tests (112 pass). No live routing test ran for this change.
