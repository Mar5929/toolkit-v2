# Agent-led delivery

Carried over from Toolkit V1's work tracker. The four questions below keep
their exact wording. What changed for V2: the
choice is recorded in the work item's Notes > Decisions and context and in its
`delivery` frontmatter value, through `toolkit work` commands, in every
tracker.

## Offer once for the goal

First read the item's `delivery` value and its Notes > Decisions and context
to see whether the owner already accepted, declined, or revoked agent-led
delivery for this goal. `not-offered` means no answer is recorded yet. Do not
treat missing access as an undecided choice. When the records show no choice,
ask exactly:

> Would you like agents to take responsibility for delivering this, with you acting as product owner?

Do not make this offer for a simple question or quick edit. Wait for the
answer before taking responsibility for organizing delivery, while continuing
any useful work that does not depend on the choice.

A clear acceptance authorizes agent-led delivery for this goal across
sessions. A later explicit request for agents to manage or deliver the goal
also counts ("you drive", "run with it", "take it from here"); do not ask the
offer question again. A decline keeps normal help and the usual record upkeep,
and stops the offer for this goal, including in later sessions. Offer again
only if the work grows a lot or the owner asks about agent-led delivery. The
owner may revoke acceptance at any time. Record it as revoked: agent-led
responsibility ends, normal help and record upkeep continue, and the same
rules as a decline apply.

The choice belongs to the named goal. It does not carry over to an unrelated
goal, a new work item, or an unrelated sub-item. The end of a session does not
end it, and missing tracker access does not mean the owner is undecided.

## Ask how the team is arranged

After a clear acceptance, read the goal record for a saved team arrangement.
When none is recorded, ask one more question:

> Do you want one team inside this chat, or do you want me to rename this chat to Main Orchestrator and coordinate other chats that each have their own team?

Offer the multi-chat choice only where the current host lets this chat list,
read, and message other chats and offer new chats to the owner as task
buttons. Today that is the Claude Code desktop app. On any other host, tell
the owner the multi-chat arrangement is not available on this host and ask
one simple question instead:

> Shall I run one team of helpers inside this chat?

A yes is an arrangement choice: one team inside this chat. A no means the main
agent does the work itself. Record either answer with the goal.

Do not ask after a decline or a revocation, and do not ask again once the
owner's answer is recorded for the goal. The owner may change the arrangement
at any time; record the new answer.

When the owner chooses the Main Orchestrator arrangement, ask one more
question:

> Do you want me to archive sessions after their task is fully complete, everything is merged and shipped, and you approved?

Record the answer with the goal like the arrangement answer, and do not ask it
again.

[Team arrangements](team-arrangements.md) explains what each answer means,
including when a chat may be archived. Read it before organizing the team, and
when resuming a goal that has a recorded arrangement.

## Record the choice

Save accepted, declined, or revoked, and the team arrangement answer once
given, in the item:

- `toolkit work set <id> --delivery agent-led` for accepted;
  `toolkit work set <id> --delivery owner-led` for declined or revoked.
- A block in Notes > Decisions and context, written with
  `toolkit work edit <id> --section "Decisions and context" --set-file <file>`:

  ```markdown
  - **Agent-led delivery (WI-012 goal: CSV export):** accepted by Mike on
    2026-09-26 ("you drive, I'll approve things"). Team: one team inside this
    chat. Archive answer: not asked. Limits: no merge, deployment, spending, or
    publishing beyond what was given. Lead: this chat.
  ```

- One history note with the owner's words.

Record the goal scope, the state (accepted, declined, or revoked), the team
arrangement answer when one was given, the archive answer when it was asked,
who said it and the date, the limits, and which chat or agent leads delivery.
A lead reference coordinates ownership; it is not a lock and not proof that an
agent is still running. Read the saved section back and check the meaning
landed.

Keep the Overview Next action consistent with the choice. For example,
replace a pending "ask whether agents lead" next action once the owner
answers. Check the choice and the next action together; if only one save
worked, report the partial save and keep the exact fix as pending.

No item exists yet: create one through `work-on` when the goal warrants a
record. Never create an item only to record a refusal. With no place to save
it, say so and carry the choice in the handoff until it can be saved.

The main agent owns every change to the item. Helpers return findings and
proposed changes to it. Respect another main session's ownership, read shared
records again before editing, and settle conflicting ownership before
overwriting anything.

If the write fails, lead with "Not saved", name the destination and the
failed step, and keep the choice as a pending update. If the write worked but
the read-back failed, say "Saved but not verified". Continue independent work.
Put the pending save in the handoff and retry when access returns.

## Divide responsibility

With acceptance, agents take responsibility for moving the agreed goal
through discovery, the owner interview, requirements, open questions, records,
focused research, design challenge, the authorized build, testing, and
delivery. They keep the plan and the Resume here note current and bring the
owner the decisions and results that need him.

The owner stays product owner: he makes product and scope decisions, gives
the required approvals, and approves the result. Acceptance does not widen
tool, security, spending, publishing, deployment, build, or any other existing
authority. Every project gate still applies, and approvals already given still
count.

Acceptance alone does not authorize starting helpers. The owner's choice of a
team arrangement does: it authorizes focused, bounded helper agents for that
goal only. It does not carry over to another goal, and every other limit on
tools, spending, publishing, deployment, and approvals still applies. A no to
the one-team question is not an arrangement and authorizes no helpers. Use
helpers only when that choice or other recorded authority allows them and
research, specialist knowledge, an independent check, or parallel work helps.
Every agent runs on Opus. Do not set up a fixed council, repeat reviews
without a new reason, or let helper rounds replace a decision.

Run each stage through the skill that owns it: `work-requirements`,
`solution-design`, `work-on`, `work-check`, `work-finish`. If a skill or an
agent is not available, the main agent does that part itself and records the
same decisions, evidence, and next action.
