---
name: work-delegate
description: 'Hands a work item to helper agents with the owner as product owner, runs them from this chat, and updates each helper''s sub-item and tasks, so helpers work separate sub-items in parallel while he only decides. Use when the owner hands an item over or says yes to agents running it, for example "you drive", "take it from here", or "run with it".'
---

# Work delegate

The owner hands over a goal (a top-level work item and all its sub-items) and stays product owner: he decides, approves, and marks work Done. This chat leads the goal's top-level item (the parent). It plans, briefs helper agents, keeps every item current through the work track skill, and is the only writer of the work items. Each helper works one sub-item or one task and reports back.

## Steps

1. **Read the goal.** Find the item by its ID with the work track skill and read it fresh. A sub-item is part of its parent's goal: lead from the top-level item of the goal. Read its `delivery` value, Roadmap, Tasks, sub-items, Questions and Answers, and every routing field of each item you read.
2. **Settle who delivers.** Read the top-level item's `delivery` value and its Questions and Answers rows whose Affects column says `delivery`. `agent-led` or `owner-led` with an answered row: he already answered for this goal, so do not ask again. `not-offered`: nothing is recorded. A sub-item takes its parent's answer and gets no offer; a sub-item under an `agent-led` parent is `agent-led` too.
   - He just handed it over in his own words ("you drive"): that is his yes. Add an answered row for the question it settles, and do not ask the offer.
   - Nothing is recorded, he has not handed it over, and either the plan has sub-items, more than one phase, or more than two tasks, or `work-refine` sent you here for a clearly large goal: add the offer as an open Questions and Answers row with your recommendation, set `waiting_on: owner`, give your recommendation and its reason in one line, and make the last line of the reply exactly: "Would you like agents to take responsibility for delivering this, with you acting as product owner?" Build nothing until he answers. When `work-refine` sent you, plan no team until the requirements and the design are approved, and go back to `work-refine` after you record his answer.
   - A small item (one phase, one or two tasks, no sub-items) gets no offer: set `delivery: owner-led` and add a Recent History row, "Small item: one phase, one or two tasks, no sub-items, so no delivery offer." His own later "you drive" still counts.
   - His yes: `delivery: agent-led`. His no: `delivery: owner-led`; ask no team question and stop, and he steers the build himself. A yes widens nothing: no merge, deployment, spending, publishing, or sign-in beyond what he already allowed, and every approval gate still applies. It holds across sessions for this goal only.
   - A revoke (he takes the work back): add an answered row "Change to <old Q-ID>: ..." with his words, mark the row that recorded his yes "Superseded by <new Q-ID>", set `delivery: owner-led`, start no new helper, and ask whether the helpers still running finish or stop.
   - A goal he declined or revoked gets no new offer, unless he asks about agent delivery or the work grows a lot.
3. **Settle the team arrangement** once per goal, unless his words already chose it. Ask the exact questions in `references/team-arrangements.md`, section 1, and record each answer in its own row.
4. **Get the item ready to build**, each stage through its own skill: requirements with `work-refine`, the design with `solution-design`.
5. **Plan the team** from the approved design and the Roadmap (`references/running-the-team.md`, section 1). Map each helper to one sub-item or one task. Make missing sub-items with the work track skill, with the parent, a phase, and the parent's `delivery` value.
6. **Start the helpers.** For each: make its worktree and branch (`references/git-rules.md`), set its sub-item to `08-build`, In Progress, `waiting_on: agent`, set its task and that task's phase In Progress, add its line to the parent's team list, then start it with `references/builder-brief.md` and the filled job block. Start helpers that do not depend on each other at the same time.
7. **After each helper returns, update its items before anything else** (`references/running-the-team.md`, section 3).
8. **Change the plan when the work changes** (`references/running-the-team.md`, section 4), with the work track skill. Ask the owner first when a change drops or merges work he approved. A new or changed requirement goes to `work-refine`; a changed design goes to `solution-design`.
9. **Stop at every owner gate** (`AGENTS.md`, "What the owner decides"): set the item `waiting_on: owner`, write its Next action in the waiting form, ask through the skill that asks for that approval (`work-refine` for requirements, `solution-design` for the design, `work-check` for the result, `work-finish` for a merge, a deployment, Done, or Cancel), and keep the team on work his answer does not block.
10. **Finish each sub-item, then the parent.** A built sub-item goes to `work-check`, then to `work-finish`. The parent follows when each sub-item is Done or Cancelled, or was moved to the top level or under another item. Finishing a sub-item never finishes or approves the parent. Only the owner marks an item Done.
11. **End every reply** with the one question he must answer, or the exact words that continue ("Say 'go' and the team starts on P2.").

## Gotchas

- Only this chat changes work items and talks to the owner. Helpers never touch `work-items/`, `memory/`, Notion pages, or issues. They report; you record.
- A helper that reports "partly done" or "not done": never tick its task. Record what is left as a task or an open question.
- The owner may change items by hand while the team runs. Read each item fresh before you change it. His change wins.

## References

| File | Open it when |
| --- | --- |
| [references/team-arrangements.md](references/team-arrangements.md) | Step 3: one team or a Main Orchestrator, starting other chats, archiving them |
| [references/running-the-team.md](references/running-the-team.md) | Steps 5, 7, and 8, and when resuming a delegated goal in a new session |
| [references/builder-brief.md](references/builder-brief.md) | Step 6: the text to give each builder, and what to do with its report |
| [references/git-rules.md](references/git-rules.md) | Steps 6 and 7: builder worktrees, merges, and every Git write in Codex |
