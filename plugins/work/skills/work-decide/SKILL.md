---
name: work-decide
description: 'Walks the owner through each decision waiting on him, one at a time with a recommendation, and records each answer. Use when the owner asks "what do you need from me" or "what''s waiting on me", says "approved" or "go with option B", or states a decision for the whole project.'
---

# Work decide

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Build the queue: requirements waiting for approval, designs marked proposed, items at stage 11 waiting for result approval, Open Questions rows where the owner decides, and delivery offers not yet answered.
   `toolkit work decisions`
2. The owner gave an answer without being asked ("approved", "go with B"): match it to exactly one waiting decision. If two could match, ask which one, naming both.
3. Otherwise take the decisions one at a time, the one blocking the most work first. For each: what is being decided, the choices, your recommendation and its main reason, and what happens after each answer. One decision per message.
4. Before recording a requirements approval, check that the Agreed goal is filled in and that no open question is linked to a requirement. If not, say what is missing and open `work-requirements`.
   `toolkit work show <id> --section Requirements`
5. Record each answer where it belongs. Approvals (for requirements, first mark each approved `R-xx` Finalized, as `work-requirements` step 8 does):
   `toolkit work approve <id> --requirements --by <owner>`
   `toolkit work approve <id> --design --by <owner>`
   `toolkit work approve <id> --result --by <owner>`
   An Open Questions answer: rewrite that row with the answer, the date, and status Answered.
   `toolkit work edit <id> --section "Open Questions" --set-file <file>`
   Then, for an approval or an answer: one history note in the owner's words, and `waiting_on` back to `agent` (or `none` when nothing waits), unless another question for him on that item is still open. The approve command does not change `waiting_on`.
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`
   An unanswered delivery offer: open `work-delegate`.
6. A decision for the whole project: add a `DECISIONS.md` row and save it with `publish-docs`. Run the command inside the worktree `publish-docs` opens, then let it commit and push.
   `toolkit decision add --decision "<decision>" --why "<why>" --by <owner>`
7. A "no" or a change: record it as the answer, move the item back (for example to refinement), and open the skill that redoes the work.
   `toolkit work set <id> --stage 02-refinement`
8. Lead with "Not saved" if any write failed. When the queue is empty, say so and offer to continue unblocked items with `work-on`.

## What counts as an answer

- Only the owner's explicit words count. Quote them in the history note. The lifecycle command prints the full approval rules:
  `toolkit work lifecycle`
- A question, a suggestion, a tentative answer ("probably B"), or silence is not an answer. Ask again in one line.
- An approval covers only what was shown. It never covers merge, deployment, spending, or publishing.
- "Yes", "ok", or "looks good" with nothing waiting: ask what he is approving.
- Set `waiting_on` to `agent` when the agent can continue, to `none` when nothing waits, or keep `owner` when another owner question is still open on that item.

## After a result approval

The item continues with `work-finish` (pull request, deployment, requirements baseline, Done). Open it when the owner wants it shipped now.

## Project-wide decisions

- A decision for the whole project goes in `DECISIONS.md`, not in memory and not in one item. Examples: "use Postgres everywhere", and a standing merge instruction ("agents may merge a pull request after an independent check finds no blocking issue").
- A decision that replaces an older one names it with `--replaces D-<n>`:
  `toolkit decision add --decision "<decision>" --why "<why>" --by <owner> --replaces D-<n>`
- A decision about one item stays in that item: its Recent History, the answered Open Questions row, and Notes > Decisions and context when the next session needs the context.
- `DECISIONS.md` is append-only. Never rewrite or remove a row; a changed decision is a new row that names the one it replaces.

## Tracker notes

- GitHub Issues or Jira: the `toolkit work` commands exit with code 3. Build the queue from the waiting-on-owner and stage 11 labels that `../../references/trackers/github.md` or `../../references/trackers/jira.md` names, and record answers as `../../references/trackers.md` says. Remove the waiting-on-owner label after each approval or last answer, as above.
