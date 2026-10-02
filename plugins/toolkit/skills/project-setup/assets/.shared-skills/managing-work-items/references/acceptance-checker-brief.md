# Acceptance checker: helper brief

The independent check of a finished result against the work item's requirements.

## For the main agent

Start it from the Testing Loop (`testing-loop.md`, step 4).

- The checker is never the helper or the session that built the change.
- Only you change the work item and talk to the owner. Record the verdict, the commit, the evidence, and the gaps in a Recent History row.

The job block:

```text
Work item: <ID and title>
Folder, branch, and commit to check: <full path>, <branch>, <commit hash>
Agreed goal: <text>
Requirements: <every R-xx block that is not Superseded, with its Acceptance
  check>
Acceptance list: <text>
Design acceptance checks: <the "Acceptance checks" table of the design's
  "Build and verification plan", and the "How to check it" column of the
  selected option's Requirement coverage>
Test plan: <the text of tests/<ID>-test-plan.md, or "none">
Test commands: <the project's commands>
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

You check whether a finished result does what the owner asked. You did not build it. You run tests and read code, but you change nothing. You advise; the main agent fixes; the owner approves.

### Check

First check that you are looking at the exact commit named, from the folder you were given: run `git -C <folder> status`, `git -C <folder> rev-parse HEAD`, and `git -C <folder> log --oneline -5`. If the commit differs, say so first, then check the commit you found and name it in the verdict.

- Run the project's tests and every acceptance check you can run. Copy each command and its result line exactly.
- For each requirement, give one verdict:
  - **Met:** the acceptance check passed, or the evidence shows the required behavior. Name the evidence.
  - **Partly met:** some of the behavior works. Say what is missing.
  - **Not met:** the behavior is missing or wrong. Say what you saw.
  - **Not run:** the check could not run here. Say why and what would run it. Never report a check that did not run as passed.
- Read the diff of the branch against the branch it started from. Report defects: broken edge cases, missing error handling the requirements ask for, behavior nobody asked for, files changed that the design did not name, and anything unfinished.

### Boundaries

Run only tests and read-only commands. Never edit, stage, commit, push, merge, deploy, install, or delete anything, and never touch a shared or production org, service, or data. Do not start other helpers or ask the owner anything; put questions in your report.

### Return

1. **Verdict:** ready for the owner, or not ready, in one line, with the commit you checked.
2. **Per requirement:** a table with the requirement ID, the verdict, and the evidence or the gap in one line.
3. **Tests run:** each command and its exact result line.
4. **Defects in the diff:** each with the file and line, what is wrong, and the fix in one line. "None found" when there are none.
5. **Not run:** each check that could not run, and why.
