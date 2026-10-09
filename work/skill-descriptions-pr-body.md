## What changed

- Clarified the descriptions for all 23 shipped skills without renaming them or changing their work and memory structure.
- Removed the owner-preferences routing sentence from `writing-harness-files` and its index entry.
- Added the missing writing guidance from pstack's `unslop` and `technical-writing` skills to the single plain-English rule: clear pronoun references, named evidence, readable noun phrases, natural list length, and document form suited to the reader's task. Updated the rule's exact copy in `writing-harness-files`. The output style is unchanged.
- Added the before-and-after description record and raised the toolkit plugin to 0.9.1.

## PR 24

This lands the description pass before PR 24 removes `explain-simply` and `choosing-outside-tools`, as requested in that PR. This change keeps their descriptions accurate until PR 24 lands.

## Checks

- `claude plugin validate .`
- `claude plugin validate ./plugins/toolkit`
- `claude plugin validate ./plugins/workstreams`
- `claude plugin test ./plugins/workstreams` (14 pass)
- `node dev/tools/check-skills.mjs` (23 skills, 0 errors)
- `node dev/tools/check-rules.mjs` (pass, three existing size warnings)
- `node --test 'dev/tests/*.test.mjs'` (112 pass)

Live routing in Claude Code and Codex still needs authenticated sessions, as recorded in `dev/PROGRESS.md`.
