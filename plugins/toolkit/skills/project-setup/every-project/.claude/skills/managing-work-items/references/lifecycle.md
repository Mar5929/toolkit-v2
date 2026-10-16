# Lifecycle

A work item moves to the next State only when its "Move on when" is true. Set Status together with State.

| State | Status | Procedure | Move on when |
| --- | --- | --- | --- |
| Backlog | Not Started | none | the owner asks to start it |
| Refining Requirements | Preparing | `refining-requirements.md` | the owner approves the requirements |
| Designing | In Progress | `designing.md` | the owner picks a design |
| Building | In Progress | `building.md` | every task is done, with proof |
| Testing Loop | In Progress | `testing-loop.md` | a separate checker passes it and the owner approves the result |
| Reflecting | In Progress | `closing.md` | the closing checklist is done |
| Deploying | In Progress | `deploying.md` | it is merged and deployed; then `closing.md`, "Marking Done" |
| Blocked | Blocked | none | the blocker is cleared |
| Done / Cancelled | Done / Cancelled | `closing.md` | only on the owner's word |

## The owner's yes

Stop for the owner's yes before each of these. Record the question, the answer, the date, and what it covers. An earlier yes counts only for the same scope.

1. Approving the requirements.
2. Choosing the design.
3. Approving the finished result, after the separate checker has tested it.
4. Each merge into the default branch, unless the standing merge instruction in `.claude/rules/owner-preferences.md` covers it.
5. Each deploy to an environment other people use, unless a project rule allows it. Production is the owner's unless a rule says otherwise.
6. Marking the work item Done.

## Rules by State

- **Backlog.** Record the idea in the owner's words as Requirement 1. Don't interview until the owner starts the item.
- **After requirements.** Recommend Designing when two ways to build it differ in what the owner would see, pay for, or maintain, or a mistake would be costly to undo. Otherwise recommend Building.
- **Parents.** A parent stays in Building until every sub-item is Done or Cancelled, then goes through the Testing Loop as a whole.
- **Blocked** means stuck on something outside the work (access, another team, a prerequisite). Waiting on the owner is not Blocked. Set `waiting_on` to whoever can clear it, and return to the State named in Blockers.
- **A shared open question** that holds up the item means it waits on the owner. Link the shared record in Next action; don't copy the question.

## The short path for a small item

A small item is a top-level item you can play back in one reply and build without an interview, a design, or sub-items. The owner's words win over your judgment of "small". A small item skips the interview and asks two questions instead of four:

- **Before work:** play back the goal, what you'll hand over, how you'll check it, and the project phase. The yes approves the requirements.
- **When done:** one closing question approves the result and marks the item Done, as `closing.md`, "Small items", says.

Approvals 4 and 5 still apply. If the work turns out to need an interview, a design, or sub-items, tell the owner and move it to the full path, keeping the approvals already given. Record in Recent History whenever an item takes or leaves the short path.
