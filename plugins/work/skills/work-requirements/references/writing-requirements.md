# Interviewing the owner and writing requirements

Detail for `work-requirements`. Carried over from Toolkit V1's requirements
interview, deep-interview, and spec-check rules, with V2 homes: everything
lands in the work item, not in a separate requirements document or notes file.

## Aim at the outcome the owner wants

- Work toward the outcome the owner wants, not only the words he used. Read a
  rough answer in the context of that requirement's purpose and the rest of
  the system, and ask focused follow-up questions until the real intent is
  clear.
- Say so when an answer would undermine his own goal, conflict with a stated
  constraint, cause a problem elsewhere, or when a clearly better approach
  exists. Name the concern, the tradeoff, and the direction you recommend,
  then let him choose. Once he has heard the concern and decided, do it his
  way.
- Never quietly replace what he said with what you inferred.
- Keep it light. Do not read every answer back for approval, do not challenge
  every answer, and do not start designing while the goal is still open.

## The interview

- Read the item, the related `requirements/<area>.md` file, and memory before
  asking. Ask only what the records and the code cannot answer.
- One question at a time. Include a recommended answer based on what you
  know, so the owner can confirm, correct, or redirect it.
- Settle upstream decisions before the ones that depend on them.
- When the owner does not know, record an Open Questions row with who can
  answer, and continue with independent questions. Offer a `researcher` when
  a fact can be found.
- Follow contradictions and vague answers ("fast", "easy", "secure") until
  they are resolved or recorded as open questions.
- Save each settled answer into the item before asking the next question. A
  long interview fills the conversation; the item is the record that
  survives a cleared context.
- When resuming an interview, read the item first and continue from its
  Open Questions and Notes > Resume here.
- Near the end, ask: "What have we not touched that could change this?"

## Writing requirements someone else can use

- Plain words, no jargon. State the goal, what people must be able to do,
  what must happen, and the rules that govern it.
- Each requirement says what must be true and why, never how to build it. No
  file paths, versions, tool choices, or build steps in a requirement.
- Make behavior explicit: who is affected, when the rule applies, the
  expected result, and the exceptions. Include an observable acceptance
  check.
- Use only settled details. Leave missing decisions open as questions.
- Someone who was not in the conversation must be able to understand the
  goal, the required behavior, and how to tell it works.

`R-xx` block format (from the work-item template):

```markdown
#### R-01 - Rejected requests show their reason

**Status:** Refining  
**Applies to:** The person who submitted a request, after it is rejected.  
**Required behavior:** The requester can see the rejection reason on the request.  
**Boundaries and exceptions:** Requests withdrawn by the requester have no reason.  
**Acceptance check:** Reject a request with a reason; the requester sees that reason on the request.  
**Decision record:** Owner, 2026-09-26, interview.  
**Open questions:** None.
```

- Status words: Refining, Finalized, Superseded. The requirements approval
  command sets the Overall status; never write that line by hand. After the
  approval, set each approved `R-xx` to Finalized and add who approved it and
  when to its Decision record, in one section edit.
- A superseded requirement keeps its block, with Status Superseded and a link
  to the `R-xx` that replaced it.
- The Acceptance list says when the whole item can be accepted: the result,
  how it is checked, and any owner review.

## Build ideas

Ideas about how to build something go under Notes > Solution options and
considerations, linked to the `R-xx` they relate to. They are not
requirements and not an approved design. Example: "For R-01: a page message
or an email are possible ways to show the reason." Revisit these notes when a
requirement changes, so an old idea cannot quietly control the design.

## Corrections and changes

- Apply a clear correction without asking him to approve it again. Check the
  requirements and design it affects; ask only about consequences whose
  meaning is unclear.
- For a simple correction, acknowledge it in a sentence and ask only the next
  question that matters. Do not replay the whole item.
- A change to an approved requirement moves the item back to refinement and
  needs approval again. Keep the old wording in the decision record.
- After stage 03, say what the change affects: the design, tasks already
  built, sub-items.

## The spec check

Run it before asking for approval and whenever the owner says "check the
spec". Brief the `requirements-analyst` agent. It returns ready or not ready
and findings. For each finding, propose a fix in plain words: what to change,
where, and what the line would say instead.

- Change nothing without the owner's yes. Few findings: one decision at a
  time. Many: a short numbered list he can answer in one message.
- A dismissed finding stays dismissed for this item in this session.
- Two sources that disagree (the item and `requirements/<area>.md`, for
  example): name both, quote the disagreement, and let the owner pick. Never
  silently prefer the newer or longer one.
- Do not turn the check into a rewrite. Personal wording taste is not a
  finding.
- Clean spec: say so in one line and move on.

## Approval

- Show a short summary: the Agreed goal, each requirement in one line, the
  Acceptance list, and any open question.
- Ask exactly one line: "Do you approve these requirements?"
- Only his explicit yes counts. Quote it in the history note.
- After his yes: run the approval command, mark each approved `R-xx`
  Finalized with who approved it and when, and add the history note.
- Never approve while the Agreed goal is empty or a linked open question is
  still open.
- The owner asked for a design first: continue to `solution-design` with the
  open choices kept visible. That request is not a requirements approval.
