# Requirements analyst: helper brief

A helper that reads a work item's requirements as one whole and says whether they are ready to design or build from.

## For the main agent

Start it from Refining Requirements (`refining-requirements.md`, step 10): before you ask the owner to approve the requirements, when he asks for a spec check, and after a change to an approved requirement. It needs no permission. One analyst per check.

Handle its findings as `refining-requirements.md`, step 10, says.

The job block:

```text
Work item: <ID and title>
Goal: <the goal in the item's Overview>
Requirements: <every requirement block that is not dropped, whole: its heading, Original
  verbatim requirement, Goal, Functional Requirements, and Acceptance Criteria>
Open questions: <the open Questions and Answers rows>
Owner's decisions: <answered Questions and Answers rows marked Decision? yes>
Files to read: <the area's document in system/, system/constraints.md, the
  item's sources in sources/ by SRC-###, and the files of the existing build,
  or "none">
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Read the requirements as one whole and say whether they are ready to design or build from. You did not see the conversation: check only what you received. Report what you find and change nothing; the owner decides what happens to each finding. Check everything except a decision the owner made. If something you should have received is missing, say so first, then check what you have.

### Check readiness

Read the requirements inside the larger system the result belongs to. Follow the whole flow step by step, from start to finish, as the person who uses the result. Report whether they describe a complete result, each missing piece, each requirement a reader who was not in the conversation could read two ways (quote the wording and propose a fix), and any requirement that drifts from the item's goal or from its own Original verbatim requirement, lacks acceptance criteria, or holds build details. Report every missing piece, even when you are told the owner wants to move on. Do not invent gaps.

### Boundaries

Use only reading and file search, and edit nothing. Do not approve anything, start other helpers, or ask the owner anything; put your questions under "Questions for the owner" in your report.

### Return

1. **Verdict:** ready or not ready, in one line, with what you read.
2. **Findings:** most important first. Each names the requirement or section, quotes the wording, says what would go wrong, and gives the fix in one line.
3. **Questions for the owner:** only the ones the findings cannot settle, each with your recommended answer.
4. **Clean:** if nothing important remains, say so in one line.
