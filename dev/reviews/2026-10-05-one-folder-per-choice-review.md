# Review: one folder per setup choice

Date: 2026-10-05. Work item: TKV-24. Branch: `claude/one-home-layout`.
Reviewed: commits `aa1f1db`, `a239045`, `ffd9dce`, `91fd96c`, `06c3db8`, and
`693b0d9`, against `origin/main`, by a separate agent that changed no file.
Lines are cited at `693b0d9`. `<setup>` is
`plugins/toolkit/skills/project-setup/`.

Result: 0 blockers, 7 should fix, 8 notes. Status of each fix is at the end.

## Should fix

1. **The table the agent acts on is not checked.** `<setup>references/setup-copy.md`
   52-61 ("Folders the choices add") is checked by nothing;
   `dev/tools/check-skills.mjs` 351-363 reads only the second copy of the
   table in `skills-hooks-settings.md` 42-50. Shown by changing a row in
   `setup-copy.md`: the tool still passed. On `origin/main` the acting table
   was the checked one. The two tables also state one rule twice.
   Fix: keep the choice-to-folders table only in `setup-copy.md`, make the
   tool read it, and cut the other table to choice and skill names.
2. **The hook commands lost a check.** `check-skills.mjs` line 215 no longer
   checks the three hook commands for a command of the retired program.
   Shown by adding such a line to `session-start.mjs`: fails on
   `origin/main`, passes after the step.
   Fix: run the check at lines 238-241 over
   `every-project/.claude/hooks/*.mjs` too.
3. **Project skills now load into sessions that work on the toolkit.** All 20
   project skills sit in folders named `.claude/skills/` below the repository
   root. Claude Code loads such skills the first time it reads or edits a
   file in that folder (`ai-external-knowledge/claude-code/skills.md` line
   149). Seen in the review session: 10 skills from `every-project` were
   added to its skill list. `claudeMdExcludes` does not cover skills.
   Fix: decide whether toolkit sessions should list them; if not, add
   `skillOverrides` entries of `"off"` for the project skill names to the
   repository's `.claude/settings.json` (`skills.md` lines 810-831), test it
   in the test sign-in, and record the decision in `AGENTS.md`.
4. **`<setup>references/update.md` line 160 has two readings.** "A rule in
   `.claude/rules/` that the model no longer has": rules are now in three
   folders. Fix: "A rule in `.claude/rules/` that the fresh setup copy lacks
   and that an earlier Toolkit V2 setup put there".
5. **"The model" is used about 20 times in the skill and no longer defined.**
   `skills-hooks-settings.md` 3-4, 90, 111, 115; `setup-copy.md` 139, 143,
   156-157, 269; `SKILL.md` 149; `update.md` 4, 87, 168, 310.
   `interview.md` 124 says "the toolkit's files" for the same thing.
   Fix: one name across the skill, or one defining sentence in `SKILL.md`.
6. **`AGENTS.md` 105-109 does not match the tool.** The text says the tool
   fails on any shared path except the two storage skills; the tool allows
   any path shared inside one group of alternative folders
   (`check-skills.mjs` line 266). Fix: limit the tool's exception to the two
   storage skills' paths, or change the sentence.
7. **`README.md` 17-19 and 304-305.** The list of choices with a folder
   leaves out GitHub work items; "Where things are" describes the old
   layout.

## Notes

8. `<setup>SKILL.md` 86-87: a sentence that changes nothing the agent does.
   Delete it.
9. `setup-copy.md` 45 and `skills-hooks-settings.md` 24: "each folder in
   `assets/`" is not true of `assets/settings/` and `assets/soul/`. Say
   "each folder in the table below".
10. `setup-copy.md` 64-67, 76-88, 90-91: three pieces no longer lead to an
    action. Delete them, or say what the agent uses them for.
11. `check-skills.mjs` 55-57, 302-330 and `check-rules.mjs` 64: the folder
    list is written by hand in both tools; a new folder under `assets/` that
    is not in the list is outside the two-folders check. Fail when a folder
    under `assets/` other than `settings` is not in the list.
12. The Python and tool-output ignore patterns now apply only inside
    `every-project/`, so files the Salesforce tools leave in
    `assets/salesforce/tools/kb/` are no longer hidden from this
    repository's Git. Add those patterns to the root `.gitignore`.
13. `AGENTS.md` 100, 285, 295, 434 and `interview.md` 137: wording from the
    old layout ("on top of it", "a set's skills", "the model copy's
    `CLAUDE.md`", "the work tracking set").
14. The plugin version is still `0.8.16`. The design raises it at the end of
    the build.
15. `README.md` 241-251, already so on `main`: "refresh the model copy ...
    from `toolkit-v2-model-project-approved`" contradicts `AGENTS.md`
    ("never copy his outside model folder in again").

## Found clean

- The move: 279 tracked files under `plugins/toolkit` before and after; 247
  renames, all 100%; no project file in two folders except the two storage
  skills.
- Nothing a project receives changed: the reviewer's own script ran the old
  steps on `origin/main` and the new steps for 36 combinations; 0 differ.
- Walk-throughs of the new copy steps for three sets of choices: no missing
  or wrong step.
- `update.md` compares a project with a fresh setup copy, so several source
  folders work.
- No old path left as a current fact; `--model` has no remaining use;
  `check-rules.mjs` gives the same numbers; 42 tests pass; the plugin
  validates; Codex lists only the plugin's two skills.
- `claudeMdExcludes` covers every `CLAUDE.md`, `AGENTS.md`, and rule file
  under `assets/` (from the documentation; not run in a live session).

## Not checked

A live Claude Code session for `claudeMdExcludes`; a live setup run by an
agent; the routing test (no description changed in this step).

## Status of the fixes

Open. They are assigned to the build step that rewrites the setup
instructions and the check tools.
