# Fix list after the three final reviews

Work item: TKV-24. Date: 2026-10-05. Two builders work from this list in
parallel. The three reviews are in `dev/reviews/`:
`2026-10-05-starter-files-and-hooks-review.md` (review 1),
`2026-10-05-project-skills-review.md` (review 2),
`2026-10-05-setup-skill-tools-and-docs-review.md` (review 3).
The reviews cite lines at commit `78297f54`. Files changed since: find each
place by its text.

## Waits for the owner: do not change these

- `session-handoff.md` (his wording): review 1, finding 6.
- The "Memory approval" line in `PROJECT.md`: review 1 finding 7, review 3
  finding 12. Leave the line and every count of "11 lines" as they are.
- What Notion memory stores, and when its pointers are read: review 2,
  findings 15 and 17.
- Figurative words in the owner's older, unchanged files: review 1 finding
  17 and note 25 (date form, rule size); review 2 note 33 ("Hitch-hiker",
  `engagement/`).
- The form of dates in Salesforce data folders.

## Builder A: everything under the setup folders (`<assets>`)

Owns: `plugins/toolkit/skills/project-setup/assets/**`, `dev/tests/**`,
`dev/build-shared/**`, and the description rows of `dev/SKILL-INDEX.md`.

1. Review 1: every finding and note not listed under "Waits for the owner".
2. Review 2: every finding and note about a file under `<assets>` or
   `dev/build-shared/`, the blocker first. Findings 3, 20, 21, and 38
   concern `writing-harness-files`: builder B has them, except the sentence
   finding 3 may need in `curating-project-memory`.
3. The owner's review of the root file, 2026-10-05, applied to every other
   file: a description covers the whole class of use with examples marked
   as examples; a description says in specific words what belongs there; no
   sentence tells the agent how to think in place of what to do.
4. One choice decides files, never lines (review 1, note 19): move the
   Salesforce lines of `every-project/delivery/AGENTS.md` into a
   Salesforce-only rule file with `paths: delivery/**`; make
   `README.md`, `publish-project-documents.md`, and `TEST-PLAN-TEMPLATE.md`
   true for every project.
5. Hindsight, from the captured pages in `ai-external-knowledge/hindsight/`
   (`coding-agents-skill-preamble.md`, `coding-agents-readme.md`,
   `source-coding-agents-knowledge-tools.ts.md`). The owner decided that
   Hindsight projects get no toolkit memory skill: the add-on ships its own
   skill, `hindsight-coding-agent`, and puts a guide to its tools in front
   of the agent at session start. Change only
   `memory-hindsight/.claude/rules/hindsight-memory.md`:
   - A decision or a system fact is filed in `DECISIONS.md` or `system/` as
     in every project. Hindsight is the search across past sessions; when
     it returns a decision or a rule, name the DEC or rule ID.
   - Name the add-on's own skill as the place that says how to use its
     tools. Do not list the tools.
   - "Forget that" and a wrong memory: the add-on's correction route (save
     a document titled "Correction: <topic>"); deleting a memory is the
     owner's step in the dashboard. Take the exact tool name from the
     captured pages.
   - "Clean up memory" (review 1, note 28): say what the agent does.
   - Say which bullets of `memory-review-and-save.md` do not apply
     (review 1, finding 4).
6. The four skill files that say "Notion block" (`memory-notion`
   `using-memory-store/SKILL.md`, its `references/searching.md` and
   `current-state-page.md`, and the Notion `using-work-tracker/SKILL.md`):
   the links are nested bullets under the fixed lines "Notion work items"
   and "Notion memory" in `PROJECT.md`. Make the `PROJECT.md` prompts say
   the same.
7. Hook tests: review 1, notes 23 and 24. `validate-records.mjs` is at its
   size limit (279 of 280 lines; the owner accepted 279): do not add a line
   to it. If a fix needs one, report it.

## Builder B: the setup skill, the tools, the plugin skill, the repository docs

Owns: `plugins/toolkit/skills/project-setup/SKILL.md` and `references/**`,
`plugins/toolkit/skills/writing-harness-files/**`, `dev/tools/**`, the
repository `AGENTS.md`, `README.md`, `.gitignore`, `.claude/settings.json`,
`dev/SKILL-INDEX.md` except the description rows of project skills, the
three research guides, and `dev/research/layout-audit/DESIGN-SPEC.md`
(section 9 only).

1. Review 3: every finding and note not listed under "Waits for the owner".
   Finding 13: keep the 8 `.gitignore` lines in every project and delete
   the step. Finding 16: `owner-preferences.md` stays apart, because setup
   and "update the toolkit" must never overwrite the owner's own file; add
   the Layout row that says so.
2. Review 2, findings 3, 20, 21, and 38 (`writing-harness-files`).
3. The checking script (`dev/research/layout-audit/CHECKS-SPEC.md`,
   `dev/test-runs/checking-script.md`). The owner accepted its size on
   2026-10-05: 279 lines, 279 lines of tests, and a 6-line pre-commit file.
   - The repository `AGENTS.md` "Code limit" rule: name the fourth command
     `validate-records.mjs`, the owner's yes and date, what he was told
     (about 220 and 220) and what it is (279 and 279), and "tell him the
     size again before it grows".
   - The setup step for the pre-commit file, in the setup references, for a
     new project, "check the setup", and "update the toolkit": copy
     `.githooks/pre-commit` and keep it executable; run
     `git config --get core.hooksPath` in the main checkout; empty: run
     `git config core.hooksPath .githooks`; `.githooks`: nothing; anything
     else, or a real `.git/hooks/pre-commit`: change nothing, tell the
     owner the check will not run before commits, and offer the one line
     `"$(git rev-parse --show-toplevel)/.githooks/pre-commit" || exit 1`
     for his own hook; not a Git repository: skip and say so.
   - "Check the setup" reports the result of
     `node .claude/hooks/validate-records.mjs --all < /dev/null`.
   - "Update the toolkit" for a project on the old layout: a finding nobody
     fixes comes back at the end of every Claude Code turn, so the records
     must pass `--all` before the new hook entries go in. The likely case is
     a Done work item with no Moved up line.
   - A Codex project must trust its hooks again in `/hooks`: say so where
     the update steps tell the owner what changed.
4. Hindsight setup file (`references/hindsight-on-vps.md`), from
   `dev/research/hindsight-server-setup-guide.md` (the owner's own guide)
   and `ai-external-knowledge/hindsight/`. A shipped skill reads no file
   under `dev/`, so the facts go into the reference itself:
   - "What runs where": the VPS runs four services from one folder,
     `/opt/hindsight`, with Docker Compose: the database, Ollama with its
     model, Hindsight, and Caddy. DNS sends the two addresses to the VPS;
     Caddy accepts HTTPS and passes the dashboard address and the API
     address to Hindsight. Only ports 22, 80, and 443 are open; the
     database, Ollama, and Hindsight's own ports are not public.
   - Backups: the VPS has weekly automatic backups at the host. The file
     says there is no backup step: correct it.
   - Safety: never run `docker compose down -v` on the server; `-v` deletes
     the volumes that hold the database and the model. An agent never
     changes the server; server work is the owner's.
   - Name the add-on's own skill and its eight tools' purpose in one
     sentence, without listing them, and correct anything the captured
     pages show to be out of date.
5. Review status: do not edit the review files. Report the status of each
   finding by number.
