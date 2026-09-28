# The spec check

How to run the `requirements-analyst` check on an item's requirements and
turn its findings into fixes or questions for the owner.

## When it runs

- Before asking for the requirements approval.
- Whenever the owner says "check the spec".
- Again after a change to an approved requirement.

## The brief

Give the `requirements-analyst` agent (Claude Code: `work:requirements-analyst`;
Codex: the text of `references/agent-requirements-analyst.md`) this, pasted
in, because it has no tracker access:

1. The item id.
2. The Starting request, the Agreed goal, every `R-xx` block, the Acceptance
   list, and the open questions.
3. The area's file in `requirements/` when one exists, so it can spot a
   conflict.
4. The job: "Check these requirements before design. Return ready or not
   ready, then each finding with a fix."
5. Files it may write: nothing.

## What it returns

Ready or not ready, then findings of these kinds, each with a fix:

- missing pieces (a step, a person, an error case, a state, a boundary with
  another system, a way to tell it worked);
- places not explicit end to end;
- wording a builder could misread;
- build details inside requirements;
- drift from the Agreed goal;
- research or history in the wrong place.

## Handling the findings

- For each finding, propose a fix in plain words: what to change, where, and
  what the line would say instead.
- Change nothing without the owner's yes. Three findings or fewer: one
  decision per message, in order. More than three: one numbered list he can
  answer in one message. That list is the only exception to one question per
  message.
- A dismissed finding stays dismissed for this item in this session.
- Two sources that disagree (the item and the area file in `requirements/`,
  for example): name both, quote the disagreement, and let the owner pick.
  Never silently prefer the newer or longer one.
- Do not turn the check into a rewrite. Personal wording taste is not a
  finding.
- A clean spec: say so in one line and move on to the approval question.

## Example findings for the owner

Two findings: the first message asks about the first one only.

```markdown
The spec check found 2 things. The first:

R-02 says "large exports finish quickly". A builder cannot test "quickly".
I recommend: "An export of 50,000 rows finishes in under one minute."
Use this wording?
```

Four findings: one numbered list.

```markdown
The spec check found 4 things. Answer each by number, for example "1 yes, 2 no".

1. R-02 says "large exports finish quickly". A builder cannot test "quickly".
   Fix: "An export of 50,000 rows finishes in under one minute." Use this?
2. Nothing says what a person without manager access sees. Fix: add R-03,
   "People who are not managers do not see the Export button." Add it?
3. R-01 and the Acceptance list name different file types (CSV and Excel).
   Fix: CSV in both. Use CSV?
4. Nothing says what happens when the report has no rows. Fix: add R-04,
   "An empty report exports a file with only the column names." Add it?
```
