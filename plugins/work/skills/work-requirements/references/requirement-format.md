# Writing a requirement

How to write an `R-xx` block and the Acceptance list so someone who was not
in the conversation can build and check the result.

## What a requirement says

- Plain words, no jargon. State the goal, what people must be able to do,
  what must happen, and the rules that govern it.
- Each requirement says what must be true and why, never how to build it. No
  file paths, versions, tool choices, or build steps in a requirement.
- Make behavior explicit: who is affected, when the rule applies, the
  expected result, and the exceptions.
- Every requirement has an acceptance check someone can observe.
- Use only settled details. Leave missing decisions open as questions.

## The `R-xx` block

From the work item template. The name follows an em dash. Each field starts
its own line, and every line but the last ends with two spaces.

```markdown
#### R-01 — Rejected requests show their reason

**Status:** Refining  
**Applies to:** The person who submitted a request, after it is rejected.  
**Required behavior:** The requester can see the rejection reason on the request.  
**Boundaries and exceptions:** Requests withdrawn by the requester have no reason.  
**Acceptance check:** Reject a request with a reason; the requester sees that reason on the request.  
**Decision record:** Owner, 2026-09-26, interview.  
**Open questions:** None.
```

- Status words: Refining, Finalized, Superseded.
- A new or changed requirement is Refining until the owner approves it.
- After his approval: Status Finalized, and the Decision record adds who
  approved it and when ("Approved by Mike on 2026-09-28."). Do this for every
  approved block in one edit of `Active requirements`.
- A superseded requirement keeps its block, with Status Superseded and the id
  of the `R-xx` that replaced it in its Decision record.
- A changed approved requirement keeps its old wording in its Decision record
  ("Was: ... Changed by the owner on 2026-09-28.").
- Numbers are never reused. A new requirement takes the next free `R-` number.

Save the whole subsection:

```text
toolkit work show <id> --section 'Active requirements'
toolkit work edit <id> --section 'Active requirements' --set-file <file>
```

## The Acceptance list

The Acceptance subsection says when the whole item can be accepted: the
result, how it is checked, and any owner review.

```markdown
This work item can be accepted when:

1. Managers can download the monthly report as a CSV file.
2. The file opens in Excel with every column the report shows (R-01, R-02).
3. The owner has tried one export himself.
```

## Build ideas are not requirements

Ideas about how to build something go under Notes > Solution options and
considerations, linked to the `R-xx` they relate to. They are neither
requirements nor an approved design.

```markdown
- **For R-01:** A page message or an email are possible ways to show the reason.
```

## Lines never written by hand

In the local and Notion trackers, the requirements approval command sets the
Requirements "Overall status" line. Never write Finalized there yourself.
GitHub Issues and Jira have no approve command, so after the owner's yes the
agent writes Finalized there (`tracker-github.md` or `tracker-jira.md`).

## Checks before asking for approval

- [ ] Every `R-xx` has all seven fields filled, with no template prompt left.
- [ ] Every acceptance check can be observed by someone else.
- [ ] No requirement names a file, version, tool, or build step.
- [ ] Every open question is an Open Questions row, linked from the `R-xx`.
- [ ] The Acceptance list covers the whole item.
