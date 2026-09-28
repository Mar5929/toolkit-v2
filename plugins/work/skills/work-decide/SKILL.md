---
name: work-decide
description: 'Takes the owner through the decisions his work items wait on, each with a recommendation, and records his answers. Use when he asks "what do you need from me", answers a waiting decision ("go with option B"), or states a project-wide decision. Not for a bare "yes" when this chat asked no question.'
---

# Work decide

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: the work plugin's `references/conventions.md`, two folders above this skill's folder (`../../references/conventions.md`). To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line, in both hosts: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). Text (conventions, "Text in a command"): one-line values (`--note`, `--effect`, `--append-row`, `--title`) go in single quotes, with an apostrophe written `'\''`, because double quotes run backticks and `$(...)`; section and design text goes on standard input in Claude Code (`<file>` is `-`, followed by a quoted heredoc, `<<'EOF'`), and in Codex in `--text '<text>'` or a file in a new `mktemp -d` folder, deleted right after the command. Never change a record with a script. Ask the owner in the reply text, never through a question tool. No remote (`git remote` prints nothing): never run `git fetch`, and never report a fetch refusal as a blocker.

## Steps

1. Build the queue: requirements waiting for approval, designs marked proposed, items at stage 11 waiting for result approval, Open Questions rows where the owner decides, and memory proposals (records saved as `needs-review` because the owner did not answer "Save to memory?"). The command lists each decision once. Its "Agent to-do" lines are the agent's own steps, not decisions waiting on the owner: count and show only the decisions. A delivery offer, as an agent to-do or as an open question, belongs to `work-delegate`, the only skill that makes or records it: open it after the owner's other decisions.
   `toolkit work decisions`
2. The owner gave an answer without being asked ("approved", "go with B"): match it to exactly one waiting decision. If two could match, ask which one, naming both. A bare "yes", "ok", or "looks good" is not such an answer ("What counts as an answer").
3. Otherwise take the decisions one at a time, the one blocking the most work first. For each: what is being decided, the choices, your recommendation and its main reason, and what happens after each answer. Every decision carries a recommendation, even when it is the only one in the queue; a bare question is not enough. One decision per message, asked in the reply text.
4. A requirements approval: save his words as a history note first, so no later session asks him again. Then check the Agreed goal and the open questions. The goal still holds the template text: write the goal he was shown with the approval question, then record the approval. A requirement still has an open question linked: say which one, open `work-requirements` for it, and record the approval, without asking him again, once it is answered.
   `toolkit work show <id> --section Requirements`
   `toolkit work history <id> --note 'Owner'\''s words: <quote>' --effect 'Requirements approval to record.'`
   `toolkit work edit <id> --section "Agreed goal" --text '<goal he was shown>'`
5. Record each answer where it belongs. Approvals (for requirements, first set each approved `R-xx` Status to Finalized and put who approved it and when in its Decision record, as `work-requirements` step 8 does; after it, a `build` or `data-load` item goes to `solution-design` unless the owner agreed to skip the design, and a skip is said in the final reply). The approve command marks the Open Questions rows that asked for that approval Answered and prints "Marked Q-xx Answered"; read that line, and do not mark those rows again by hand. An Open Questions answer: rewrite that row with the answer, the date, and status Answered (the delivery offer row: open `work-delegate`, which records it).
   `toolkit work approve <id> --requirements --by <owner>`
   `toolkit work approve <id> --design --by <owner>`
   `toolkit work approve <id> --result --by <owner>`
   `toolkit work edit <id> --section "Open Questions" --set-file <file>`
   Then, for an approval or an answer: `waiting_on` set to `agent` when the agent continues (the approve command sets it to `none` by itself), unless another question for him on that item is still open; then one history note in the owner's words, with an `--effect` that says what the answer changes (a requirements approval has its note from step 4).
   `toolkit work set <id> --waiting-on agent`
   `toolkit work history <id> --note 'Owner'\''s words: <quote>' --effect '<what the answer changes>'`
6. A memory proposal: show its one line and whether you recommend keeping it. The agent does not rely on it until he approves it. Yes: approve it, and it becomes a current memory. No: reject it (the proposal is deleted), and never propose the same fact again under other words.
   `toolkit memory approve <key> --by <owner>`
   `toolkit memory reject <key>`
7. A decision for the whole project: add a `DECISIONS.md` row and save it with `publish-docs`. Run the command inside the worktree `publish-docs` opens, then let it commit (and push, when the project has a remote).
   `toolkit decision add --decision '<decision>' --why '<why>' --by <owner>`
8. A "no" or a change: record it as the answer, move the item back (for example to refinement), and open the skill that redoes the work.
   `toolkit work set <id> --stage 02-refinement`
9. Lead with "Not saved" if any write failed. When an answer changed an item's next step, update the current focus (`../../references/conventions.md`, "The current focus"). When the queue is empty, say so and offer to continue unblocked items with `work-on`. End the reply with the next decision's question, or the exact words that continue.

## What counts as an answer

- Only the owner's explicit words count. Quote them in the history note. The lifecycle command prints the full approval rules:
  `toolkit work lifecycle`
- A question, a suggestion, a tentative answer ("probably B"), or silence is not an answer. Ask again in one line.
- An approval covers only what was shown. It never covers merge, deployment, spending, or publishing.
- A bare "yes", "ok", or "looks good" answers only a question asked earlier in this conversation. When none was asked, or the waiting question is not a yes-or-no question, show the decision with its choices and your recommendation, and record nothing.
- Set `waiting_on` to `agent` when the agent can continue, to `none` when nothing waits, or keep `owner` when another owner question is still open on that item.

## After a result approval

The item continues with `work-finish` (pull request, deployment, requirements baseline, Done). Open it when the owner wants it shipped now.

## Project-wide decisions

- A decision for the whole project goes in `DECISIONS.md`, not in memory and not in one item. Examples: "use Postgres everywhere", and a standing merge instruction ("agents may merge a pull request after an independent check finds no blocking issue").
- A decision that replaces an older one names it with `--replaces D-<n>`:
  `toolkit decision add --decision '<decision>' --why '<why>' --by <owner> --replaces D-<n>`
- A decision about one item stays in that item: its Recent History, the answered Open Questions row, and Notes > Decisions and context when the next session needs the context.
- `DECISIONS.md` is append-only. Never rewrite or remove a row; a changed decision is a new row that names the one it replaces.

## Tracker notes

- GitHub Issues or Jira: the `toolkit work` commands exit with code 3. Build the queue from the waiting-on-owner and stage 11 labels that `../../references/trackers/github.md` or `../../references/trackers/jira.md` names, and record answers as `../../references/trackers.md` says. Remove the waiting-on-owner label after each approval or last answer, as above.
