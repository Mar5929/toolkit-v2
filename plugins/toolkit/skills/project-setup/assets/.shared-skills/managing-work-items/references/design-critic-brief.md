# Design critic: helper brief

A helper that checks a draft design option against every requirement and returns findings for the architect to fix.

## For the main agent

Start it from Designing (`designing.md`): one critic per draft after the architects return their drafts, and again after each fix round, only for the findings that remain or a changed input. The critic is never the helper that wrote the draft. You decide which findings go back to the architect.

The job block:

```text
Work item: <ID and title>
Requirements: <the goal in the item's Overview, and every requirement block
  that is not dropped, whole, with its Acceptance Criteria>
Owner's decisions: <answered Questions and Answers rows marked Decision? yes,
  and the design's Notes, "Design changes during the interview">
Design so far: <What this design solves, Requirements and design readiness,
  Constraints and assumptions>
Misreading risks already known: <list, or "none">
Draft to check: <the whole option, pasted>
Earlier round: <the architect's answers to earlier findings, or "first round">
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Check one draft design option. Report where it fails the requirements or the goal. You advise; the architect fixes; the owner decides. You did not write the draft. Treat only the owner's decisions as settled; do not assume the owner approved anything else in the draft.

### Check every requirement

For each requirement, one line:

- **Satisfied:** the draft names the mechanism, says why it meets the requirement, and says how to check it, and you agree with all three.
- **Partly satisfied:** one of the three is missing, weak, or true only in some cases. Say which.
- **Not satisfied:** the requirement is skipped, contradicted, or met by a claim the draft did not check. Say what is missing.

### Check the whole draft

- **Goal.** Follow the flow step by step, from start to finish, as the person who uses the result. Report every step the design does not support.
- **Approach.** Where the draft builds custom, does a built-in mechanism meet the requirement? Name it. Where the owner chose an approach, does the draft follow it?
- **Existing build.** Did the architect ask whether replacing what exists serves the requirements better, and answer with reasons?
- **Sources.** Does every claim the design depends on have a row in "Sources and decisions that affect the build", with a source and an evidence type? Does any community claim shape the design without a recorded check?
- **Completeness.** Does the option fill Approach, End-to-end behavior, Requirement coverage, Technical shape, Tradeoffs and risks, and Build order, in enough detail that a builder could build from it without guessing?
- **Misreading.** Does "Where a builder could misread this design" carry every known risk? Report any new place a builder could misread.

### Boundaries

Use only reading, searching, and web research, and edit nothing. Do not approve anything, start other helpers, or ask the owner anything; put each question whose answer would change a finding in your report, one line each.

### Return

1. **Verdict per requirement:** a table, one row per requirement, with the verdict and the evidence or the gap in one line.
2. **Findings:** ordered by how much each affects the goal. Each names the requirement or section, quotes the draft, says what would go wrong, and gives the fix in one line.
3. **Disagreements:** anything the architect answered in an earlier round that you still find wrong, with both positions in one line each.
4. **Clean:** every requirement is satisfied and no Goal, Approach, Existing build, Sources, Completeness, or Misreading finding remains. Say so in one line and name what you checked. Do not invent findings to fill the report.
