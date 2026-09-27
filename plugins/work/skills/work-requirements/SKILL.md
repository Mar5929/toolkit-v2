---
name: work-requirements
description: 'Interviews the owner one question at a time, writes the answers into the work item''s requirements and open questions, then asks for approval. Use when the owner says "grill me", "ask me questions", "what should it do", or "check the spec", changes a requirement, or requirements are missing.'
---

# Work requirements

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: the work plugin's `references/conventions.md`, two folders above this skill's folder (`../../references/conventions.md`). Interview and writing rules: this skill's `references/writing-requirements.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line: in Codex a command joined by `&&`, `;`, a pipe, or a heredoc, or run from a script, runs inside the sandbox and fails. Give text with `--text`, or a file in a new `mktemp -d` folder (never a fixed `/tmp` name, deleted right after the command). Never change a record with a script.

## Steps

1. Find the item as `work-on` does; none exists, create it. Use discovery while the goal is being worked out, refinement once requirements are being written. Requirements already approved and no change asked: stop and open the skill the lifecycle's "Continue with" column names.
   `toolkit work show <id> --section Requirements`
   `toolkit work new --title "<title>" --type <type> --stage 01-discovery`
   `toolkit work set <id> --stage 02-refinement`
2. Before asking anything, read the item (Starting request, Agreed goal, `R-xx`, Open Questions) and look up what the project already knows, so no question repeats an answer.
   `toolkit work show <id>`
   `toolkit memory find "<topic>"`
3. Restate the goal in one sentence ("So the goal is X?"). Write the Agreed goal after a yes, and always before asking for approval in step 8.
   `toolkit work edit <id> --section "Agreed goal" --text "<goal>"`
4. Ask one question at a time, most basic first, each with a recommended answer and a short reason. Push back when an answer works against the goal.
5. Write each answer into the item before the next question: `R-xx` blocks (Status Refining, required behavior, boundaries, acceptance check, decision record) and the Acceptance list. Anything unanswered becomes an Open Questions row (next free `Q-` number) with who must answer; the item waits on the owner while one of his is open, and goes back to the agent when he answers the last one. Build ideas go under Notes > Solution options and considerations, never into requirements. A fact the owner cannot answer: brief a `researcher` agent.
   `toolkit work edit <id> --section "Active requirements" --set-file <file>`
   `toolkit work edit <id> --section "Open Questions" --append-row "| <next Q-id> | <question> | R-02 | Open | owner |"`
   `toolkit work set <id> --waiting-on owner`
   `toolkit work set <id> --waiting-on agent`
6. A change to an approved requirement: edit the `R-xx`, keep the old wording in its decision record, set it back to Refining, move the item to refinement, and say what the change affects when the item is past stage 03.
   `toolkit work set <id> --stage 02-refinement`
7. Spec check, before asking for approval and whenever the owner says "check the spec": brief the `requirements-analyst` agent with the requirements text. Fix what it finds or turn it into questions. Change nothing without a yes.
8. With the Agreed goal written (the CLI refuses an approval while it holds the template text), show the goal and a short summary and ask one line: "Do you approve these requirements?" and set the item waiting on the owner. Yes: quote his words in one note first, set each approved `R-xx` Status to Finalized and put who approved it and when in its Decision record, record the approval (the command adds its own history row), and hand the item back to the agent unless another question for him is still open. Then a `build` or `data-load` item goes to `solution-design`, unless the owner agreed to skip the design; say a skip in the final reply, not a progress line. Not yet: it stays waiting on him.
   `toolkit work history <id> --note "Owner's words: <quote>" --effect "Requirements approved."`
   `toolkit work edit <id> --section "Active requirements" --set-file <file>`
   `toolkit work approve <id> --requirements --by <owner>`
   `toolkit work set <id> --waiting-on agent`
9. Lead with "Not saved" on a failed write. Check the item, then hand back to `work-on` unless the owner stops. End the reply with the one question for the owner, or the exact words that continue.
   `toolkit work validate <id>`

## Agents

- `requirements-analyst`: the spec check in step 7. Paste in the Starting request, Agreed goal, every `R-xx`, the Acceptance list, and the open questions.
- `researcher`: one per fact the owner cannot answer (a platform limit, what the existing build does).
- How to brief them: `../../references/helpers.md`.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran.

## Spec check findings

The analyst reports: missing pieces; places not explicit end to end; wording a builder could misread; build details inside requirements; drift from the Agreed goal; research or history in the wrong place. For each finding, propose a fix in plain words. The owner approves, edits, or dismisses each one. A dismissed finding stays dismissed for this item in this session. Clean spec: say so in one line and move on.

## Notes

- "Grill me" means a deep interview: keep asking, one question at a time, until every branch that could change the result is covered. End with "What have we not touched that could change this?"
- The owner thinks out loud; let him. Save settled answers as they come; do not wait for the interview to end.
- Brainstorming methods from other plugins may run inside this skill. The answers still land in the work item.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Edit the issue body's Requirements section as `../../references/trackers.md` says.
