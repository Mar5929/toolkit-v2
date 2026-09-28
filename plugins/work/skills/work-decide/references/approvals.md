<!-- Generated file. Source: plugins/work/shared/approvals.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Approvals and gates

The exact steps to ask for and record each owner approval, and what counts as
one. Run each checklist in order; one wrong or missing command leaves the
item in the wrong state.

## Contents

1. What counts as approval
2. Requirements approval
3. Design approval
4. Result approval
5. Done
6. Cancel
7. Delivery offer
8. Project-wide decision
9. Memory proposal
10. Sub-items and approvals
11. Standing merge instruction
12. When an approve command refuses

## 1. What counts as approval

`toolkit work lifecycle` prints the gates and these rules. In short:

- Only the owner's explicit words count. Quote them in a history note.
- A question, a suggestion, a tentative answer ("probably B"), silence, or a
  saved draft is not approval.
- An approval covers only what was shown. It never covers merge, deployment,
  spending, or publishing.
- An approval survives later stages. A stage alone does not prove approval:
  check the approval field (`toolkit work show <id>`).
- A bare "yes", "ok", or "looks good" answers only a yes-or-no question asked
  earlier in this conversation. When none was asked, or the waiting question
  is not a yes-or-no question, show the decision with its choices and your
  recommendation, and record nothing.
- After a yes, save his words first, in a history note that starts with
  `Owner said:`. Then run the gate's commands. A command that refuses then
  never loses his answer, and no later session asks him again.

| The owner says | After this question | It is |
| --- | --- | --- |
| "Yes, approved." | "Do you approve these requirements?" | The requirements approval |
| "Go with B." | The design options with a recommendation | The choice and approval of Option B |
| "Looks good." | "Do you approve this result?" | The result approval |
| "Looks good." | "Shall I split WI-12 into these three sub-items?" | A yes to the split only, not a result approval |
| "ok" | Nothing was asked in this chat | Not an answer; ask what he wants |
| "Probably A, but let me think." | The design options | Not an answer; the design stays proposed |
| "Ship it." | He has seen the result, gaps, and evidence | The result approval (record it with his words) |

## 2. Requirements approval

Asked by `work-requirements`. `work-decide` records a later answer.

Before asking:

- [ ] The Agreed goal holds real text. The CLI refuses the approval while it
      still holds the template text.
- [ ] The spec check ran (`requirements-analyst`), and its findings were fixed
      or turned into questions.
- [ ] No Open Questions row linked to a requirement is still open. If one is,
      say which and ask it first.

Ask: show the Agreed goal, each requirement in one line, the Acceptance list,
and any open question. Then ask exactly "Do you approve these requirements?"
as the last line, and set the item waiting on the owner.

```text
toolkit work set <id> --waiting-on owner
```

After his yes, in this order:

- [ ] Save his words first, so no later session asks him again.
      `toolkit work history <id> --note 'Owner said: <quote>' --effect 'Requirements approved.'`
- [ ] Set each approved `R-xx` Status to Finalized and add who approved it and
      when to its Decision record, in one edit of `Active requirements`.
      `toolkit work edit <id> --section 'Active requirements' --set-file <file>`
- [ ] Record the approval. It adds its own history row, marks the Open
      Questions rows that asked for it Answered, sets `waiting_on` to `none`,
      and moves an earlier item to stage 03.
      `toolkit work approve <id> --requirements --by <owner>`
- [ ] Hand the item back to the agent, unless another question for him is
      still open on it.
      `toolkit work set <id> --waiting-on agent`
- [ ] Check the record.
      `toolkit work validate <id>`
- [ ] Next: a `build` or `data-load` item goes to `solution-design`, unless the
      owner agreed to skip the design. Say a skip in the final reply, not in a
      progress line.

Not yet, or a change: the item stays waiting on him. Record the change and
ask again.

A yes that arrives later (`work-decide` records it):

- The Agreed goal still holds the template text: write the goal he was shown
  with the approval question, then record the approval.
  `toolkit work edit <id> --section 'Agreed goal' --text '<goal he was shown>'`
- A requirement still has a linked open question: say which one, open
  `work-requirements` for it, and record the approval once it is answered,
  without asking him again.

## 3. Design approval

Asked by `solution-design`. `work-decide` records a later answer.

Before asking:

- [ ] The design is saved as proposed, and the item waits on the owner. Add no
      Open Questions row for the design approval itself: a proposed design is
      already listed as his decision.
      `toolkit work design <id> --set-file <file> --status proposed`
      `toolkit work set <id> --waiting-on owner`

Ask: the options in one sentence each, your recommendation and its reason,
what he will see when it is done, the main risks, and the build order. Then
ask him to choose or approve.

After his yes, or his choice of one option, in this order:

- [ ] Save his words first, so no later session asks him again.
      `toolkit work history <id> --note 'Owner said: <quote>' --effect 'Design approved; work-on plans the build.'`
- [ ] Fill "Recommendation and owner decision": Owner decision (who, when,
      where he said it) and Reason for decision (his reason only; never invent
      one).
- [ ] Fill every "Selected design" subsection and the "Build and verification
      plan" (Technical sequence, and Acceptance checks with one row per
      requirement). `work-check` reads those checks.
- [ ] Remove every leftover template prompt. Leave the Design status line as
      it is.
- [ ] Save the design text.
      `toolkit work design <id> --set-file <file>`
- [ ] Record the approval. It adds its own history row.
      `toolkit work approve <id> --design --by <owner>`
- [ ] Hand the item back to the agent, unless another question is still open.
      `toolkit work set <id> --waiting-on agent`
- [ ] Check the record.
      `toolkit work validate <id>`

He wants changes: record them in the design's Notes > Design changes during
the interview, run a fix round for the named changes only, save it as
proposed again, and ask again.

## 4. Result approval

Asked by `work-check` at stage 11.

Before asking:

- [ ] The tests and every acceptance check ran, and an independent checker
      reported, or you say plainly that no independent check ran.
- [ ] The check is recorded in a history note (what was checked, the
      evidence, the gaps).
- [ ] The item is at stage 11 and waits on the owner. Add no Open Questions
      row: stage 11 already lists the result as his decision.
      `toolkit work set <id> --stage 11-user-approval --waiting-on owner`

Ask: what it does now in his terms, how he can see it himself, the evidence,
and the gaps. Then ask exactly "Do you approve this result?" Never hide a gap
to get a yes.

After his yes, in this order:

- [ ] Save his words first.
      `toolkit work history <id> --note 'Owner said: <quote>' --effect 'Result approved; work-finish continues.'`
- [ ] Record the approval.
      `toolkit work approve <id> --result --by <owner>`
- [ ] Hand the item back to the agent.
      `toolkit work set <id> --waiting-on agent`
- [ ] Open `work-finish`.

A "no": record his words, turn each problem he names into a task or a
requirement change, and continue checking.

## 5. Done

Asked by `work-finish`. Only `toolkit work finish` sets Done.

Before the finish command:

- [ ] The result approval is recorded, or you have the owner's own words
      approving this result to pass with `--quote`.
- [ ] Every change the item made is committed and reached the default branch,
      or the owner said to leave it on the branch.
- [ ] Requirements and system guide updates are saved through `publish-docs`.
- [ ] Every open sub-item is finished, cancelled, or moved, or the owner said
      the parent is done anyway.
- [ ] Every Roadmap phase the item completed says Done.
- [ ] Overview: Related items current, Current position "Done on <date>:
      <evidence>", Blockers "None.".
- [ ] Leftover worktrees and branches for the item are listed and offered for
      removal.

Then run one of these:

```text
toolkit work finish <id> --by <owner> --evidence '<what shows it works>'
toolkit work finish <id> --by <owner> --evidence '<what shows it works>' --quote '<his exact words>'
toolkit work finish <id> --by <owner> --evidence '<what shows it works>' --allow-open-sub-items
```

The second is only for a result approval not yet recorded. The third is only
for a parent the owner said is done while sub-items are still open; quote his
words in a history note. The command sets Next action and Resume here, and
prints what still needs a note.

The finish command also backs up `.work-items/` and `.memory/` (and Hindsight
memory) to the owner's backup folder and prints one line about it. Read that
line:

- "Backed up ... to <folder>": done. Say it in one line in the reply.
- "No backup folder is set ...": ask the owner for a folder outside the
  project, as a question in the reply. After his answer:
  `toolkit config set backup.dir <folder>` (or `none` when he wants no backup).
- A line with "failed" or "Tell the owner": tell him that line as it is. The
  item is still Done; only the backup is missing.

## 6. Cancel

Asked by `work-finish`. Only `toolkit work cancel` sets Cancelled.

- [ ] The reason is the owner's own words, not a summary.
- [ ] Each open sub-item: ask whether to cancel it, move it to the top level,
      or move it under another item. Never cancel them without asking.
- [ ] `toolkit work cancel <id> --reason '<his words>'`

Cancelling keeps the record. Nothing is deleted.

## 7. Delivery offer

Only `work-delegate` makes the offer and records the answer. Every other skill
opens `work-delegate` for it. The recorded value:

```text
toolkit work set <id> --delivery agent-led
toolkit work set <id> --delivery owner-led
```

A delivery answer never approves requirements, a design, or a result, and
never widens merge, deployment, spending, or publishing.

## 8. Project-wide decision

Recorded by `work-decide` as a row in `DECISIONS.md` at the project root,
then committed through `publish-docs`.

```text
toolkit decision add --decision '<decision>' --why '<why>' --by <owner>
toolkit decision add --decision '<decision>' --why '<why>' --by <owner> --replaces D-<n>
```

`DECISIONS.md` is append-only. A changed decision is a new row that names the
one it replaces. Any skill that meets a project-wide decision opens
`work-decide`, which runs the full order of work with `publish-docs`.

## 9. Memory proposal

A memory the owner did not answer ("Save to memory?") is saved as a proposal:
status `needs-review`. The agent does not rely on it until he approves it.

```text
toolkit memory approve <key> --by <owner>
toolkit memory reject <key>
```

A rejection deletes the proposal. Never propose the same fact again in other
words.

## 10. Sub-items and approvals

- A child made with `--covers R-02,R-03` links those parent requirements and
  inherits the parent's requirements approval. The owner is never asked to
  approve the same requirement twice.
- A parent design the owner approved covers its `--covers` children: they
  start at planning (stage 06) with no design of their own.
- A child that needs new behavior gets its own `R-xx` and its own approval.
- Each sub-item needs its own result approval. The owner's approval of the
  parent does not cover it.
- Finishing a sub-item never finishes or approves its parent.

## 11. Standing merge instruction

A merge normally needs the owner's yes to that merge. A standing merge
instruction replaces that yes only when all of these hold:

- [ ] `DECISIONS.md` records it as the owner's decision (the project's
      `AGENTS.md` may point at it);
- [ ] an `acceptance-checker` that did not build the change reported no
      blocking issue on that exact head commit;
- [ ] every check passes on that head;
- [ ] the work item does not say its merge needs the owner's approval (an
      item that says so overrides the instruction).

Without an independent check the instruction does not apply: ask the owner.
A new commit after the check means a new check on the new head.

## 12. When an approve command refuses

- Show the owner the command's error in plain words. Never work around it by
  editing the record, the design text, or a header field.
- The error names what is missing (for example the Agreed goal still holds
  the template text). Fix that, then run the same command again.
- Exit code 2 means a refused gate: the record is unchanged.
