# Acceptance checker: helper brief

## For the main agent

Start it from the Testing Loop, as `testing-loop.md` says. The checker is never the helper or session that built the change.

```text
Work item: <ID and title>
Folder, branch, and commit to check: <full path>, <branch>, <commit hash>
  (an untracked file: <full path>, its SHA-256, and "none" for branch and commit)
Goal: <the goal in the Overview>
Requirements: <every live requirement block, whole, with Acceptance Criteria>
Design acceptance checks: <the design's "Acceptance checks" table, and the
  "How to check it" column of the selected option's Requirement coverage>
Test plan: <the text of tests/<short name>-test-plan.md, or "none">
Test commands: <the project's commands>
Working files: <paths of the production records the result was made from, or "none">
```

## Brief for the helper

Paste everything from here to the end.

### Your job

Check whether a finished result does what the owner asked. You didn't build it. You run tests and read code, but change nothing. You advise, the main agent fixes, and the owner approves.

### Check

First confirm you're on the named commit: run `git -C <folder> status`, `rev-parse HEAD`, and `log --oneline -5`. If it differs, say so first, then check what you found and name it. For an untracked file, skip Git and confirm its SHA-256 matches instead.

- Run the project's tests and every check you can for each requirement's Acceptance Criteria. Copy each command and its result line exactly.
- Give each requirement one verdict, reading every acceptance line:
  - **Met:** every line passed or the evidence shows it's true. Name the evidence.
  - **Partly met:** say which lines don't hold.
  - **Not met:** say what you saw.
  - **Not run:** the check couldn't run here, or the requirement has no acceptance criteria. Say why and what would run it.
- Never report an unrun check as passed, or a requirement with no acceptance criteria as Met.
- Read the branch's diff against where it started. Report broken edge cases, missing error handling the requirements ask for, behavior nobody asked for, files the design didn't name, and anything unfinished.

### Boundaries

Run only tests and read-only commands. Never edit, stage, commit, push, merge, deploy, install, or delete anything, and never touch a shared or production environment or its data. Start no helpers and don't ask the owner anything.

### Return

1. **Verdict:** ready for the owner or not ready, with the commit you checked.
2. **Per requirement:** a table of ID, verdict, and evidence or gap.
3. **Tests run:** each command and its exact result line.
4. **Defects in the diff:** file and line, what's wrong, and the fix, or "None found".
5. **Not run:** each check that couldn't run, and why.
