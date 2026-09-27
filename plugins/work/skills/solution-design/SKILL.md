---
name: solution-design
description: 'Designs how a work item gets built: checks the requirements are ready, runs researcher, architect, and critic agents, and writes design options for the owner to approve. Use when the owner asks "how should we build this" or "give me design options", or signed-off requirements need a design.'
---

# Solution design

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: the work plugin's `references/conventions.md` and `references/team-roles.md` (team sizes), two folders above this skill's folder (`../../references/`). Full process and checklist: this skill's `references/design-process.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line: in Codex a command joined by `&&`, `;`, a pipe, or a heredoc, or run from a script, runs inside the sandbox and fails. Give text with `--text`, or a file in a new `mktemp -d` folder (never a fixed `/tmp` name, deleted right after the command). Never change a record with a script.

## Steps

1. Read the item. Requirements not approved: say so and open `work-requirements`, unless the owner asked for options first (then keep the open choices visible). Set the design stage only when the requirements are approved or the item's type does not need approval; a `build` or `data-load` item without approved requirements keeps its stage (the CLI refuses the change), gets its design saved as proposed, and the owner hears that the requirements approval is still needed.
   `toolkit work show <id> --section Requirements`
   `toolkit work set <id> --stage 04-solution-design`
2. Brief the `requirements-analyst` agent and tell the owner plainly whether the requirements are ready to design from. A missing requirement goes back to `work-requirements`; the design never fills a requirements gap.
3. Agree the way of working in at most two questions, skipping anything already recorded: built-in mechanisms first or a specialized approach; one option or several (and what differs); the team from `../../references/team-roles.md`. Record the answers in the item's Notes > Decisions and context.
4. Create the item's design from the project's template and read it. One home only: `DESIGN.md` beside the local record, the Solution Design child page in Notion, the "Solution design" comment in GitHub or Jira. Never a separate design folder. Fill the header lines, What this design solves, Requirements and design readiness, What exists today, and Constraints and assumptions (a built-in-first choice is a constraint row); section list in `../../references/conventions.md`.
   `toolkit work design <id> --create`
   `toolkit work design <id>`
5. One `researcher` per open question, started together. Salesforce project: open `sf-architect-solutioning` as the specialist and pass its findings to the architect.
6. Make one folder for this design with `mktemp -d` (never a fixed name such as `/tmp/wi002-option-a.md`: another project's WI-002 could overwrite it). One `design-architect` per option, each writing its own file in that folder, named in its brief; one `design-critic` per draft; repeat the fix round until the critic's list is empty. A disagreement still open after two rounds goes to the owner as one question.
7. Save the design as proposed, delete the design's temporary folder, and set the item waiting on the owner. The proposed design is the owner's decision: add no Open Questions row for the design approval itself. "Saved but not verified" from the save: lead the reply with it. Project-wide decisions go to `work-decide`; lasting lessons to `memory-save`.
   `toolkit work design <id> --set-file <file> --status proposed`
   `toolkit work set <id> --waiting-on owner`
   `toolkit work history <id> --note "Design proposed: <options and recommendation>"`
8. Show the owner the options, your recommendation, what he will see when it is done, the risks, and the build order. Ask him to choose or approve. Yes: fill Recommendation and owner decision and Selected design, save, record the approval (the command adds its own history row), quote his words in one note, hand the item back to the agent unless another question for him is still open, then hand back to `work-on`.
   `toolkit work approve <id> --design --by <owner>`
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`
   `toolkit work validate <id>`
   End the reply with the approval question, or after a yes, the exact words that continue.
9. Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. Only when the session has no `spawn_agent` tool, do the work yourself; then say plainly, in the reply to the owner and in the design's Notes, that no independent research or critique ran.

## Agents

- `requirements-analyst` (step 2), `researcher` (step 5), `design-architect` and `design-critic` (step 6). How to brief them: `../../references/helpers.md`.
- Every brief pastes in the design's current text (What this design solves, Requirements and design readiness, What exists today, Constraints and assumptions, Notes), the way of working from the item's Notes, and the requirements. Agents have no tracker access.
- The architect writes only its draft file. The main agent saves the chosen text with the design command. Several options go in one design, under Design options, as `### Option A — <name>`, `### Option B — <name>`.
- Salesforce: `sf-architect-solutioning` is a skill, not an agent. The main agent runs it and returns its findings to this design; it starts no second interview.

## Rules

- A design is a proposal until the owner approves it. Approval covers the design only, never merge, deployment, or spending.
- Built-in first unless the owner chose otherwise. The existing build is evidence, not a limit: recommend a rewrite when that serves the requirements better, with its cost.
- A community claim shapes the design only after a check against official documentation, the project's code, or a test.
- A requirement no design can meet goes to the owner as a requirements question, not a design compromise.
- Stop the fix loop because the critic's list is empty or the owner decided the rest, never because it is long. Start another round only for a named finding or a changed input.
- Keep the current review position in the design's Notes > Current position and next step (open findings, next action), not a transcript of every round.
- The design reads like the project's writing rules: common words, real names, no figurative language, a term defined the first time it appears.
- GitHub Issues or Jira: `toolkit work` exits with code 3. The design is one issue comment that starts with "Solution design", edited in place, as `../../references/trackers.md` says.
