---
name: solution-design
description: 'Writes design options for how a work item gets built and asks the owner to choose and approve one. Use when approved requirements need a design, or the owner asks "how should we build this" or "give me design options". Not for a single Salesforce platform question; use sf-architect-solutioning.'
---

# Solution design

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Writes one design per work item with a small team of helper agents and asks the owner to choose and approve it; it never fills a requirements gap. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. A single Salesforce platform question that needs no design options (which Flow type fits, Flow or Apex): open `sf-architect-solutioning` and stop. Otherwise read the requirements. Not approved: open `work-requirements`, unless the owner asked for options first (`references/design-process.md`, section 2).
   `toolkit work show <id> --section Requirements`
2. Set the design stage when the requirements are approved or the item's type needs no approval. A `build` or `data-load` item without approved requirements keeps its stage (the CLI refuses the change).
   `toolkit work set <id> --stage 04-solution-design`
3. Brief the `requirements-analyst` and tell the owner plainly whether the requirements are ready to design from. A missing requirement goes back to `work-requirements`.
4. Agree the way of working and pick the team (`references/design-process.md`, section 3; `references/team-roles.md`): at most one question, only when its answer changes the design. State the small team in one line; ask only about a larger one. Record both in Notes > Decisions and context.
5. Create the design in the item's one design home and fill its opening sections (`references/design-process.md`, section 4; headings in `references/work-item-format.md`, section 4).
   `toolkit work design <id> --create`
   `toolkit work design <id>`
6. Research: one `researcher` per open question, started together; in a Salesforce project, `sf-architect-solutioning` as the specialist (`references/design-process.md`, section 5). Every box of the checklist in section 1 is ticked before step 7.
7. Design round: one `design-architect` per option and at least one `design-critic` per draft; repeat the fix round until the critic's list is empty (`references/design-process.md`, section 6; drafts in each host: section 7).
8. Save the merged design as proposed, set the item waiting on the owner, and add a history note.
   `toolkit work design <id> --set-file <file> --status proposed`
   `toolkit work set <id> --waiting-on owner`
   `toolkit work history <id> --note 'Design proposed: <options and recommendation>'`
9. Present the options, your recommendation, what he will see when it is done, the risks, and the build order, and ask him to choose or approve. His yes: run the design approval checklist in `references/approvals.md`, section 3, update the current focus (`references/current-focus.md`), and hand back to `work-on`.
   `toolkit work approve <id> --design --by <owner>`

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section and design text go on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- Local and Notion trackers: never write "Approved" in the Design status line. Only the approve command approves a design, all or nothing. When it fails, show the owner its error; never work around it by editing the design text. GitHub Issues and Jira have no approve command, so there the agent writes it after his yes.
- One design home per item: `DESIGN.md` beside a local record, the Solution Design page in Notion, one issue comment in GitHub or Jira. Never a separate design folder.
- Every design gets at least one critic, even a small one. Only a session with no agent tool at all, or an owner who said no to helpers, skips it; then the reply and the design's Notes say no critique ran.
- Drafts never go to a fixed name in `/tmp` or inside `.work-items/` (`references/design-process.md`, section 7).
- Add no Open Questions row for the design approval itself: a proposed design is already listed as the owner's decision.
- `sf-architect-solutioning` is a skill the main agent runs, not an agent. It starts no second interview.
- Built-in mechanisms first unless the owner chose otherwise. The existing build is evidence, not a limit.
- A design approval covers the design only, never merge, deployment, or spending.
- GitHub Issues or Jira: `toolkit work` exits with code 3. The design is one issue comment started from `assets/DESIGN.md` and edited in place (`references/tracker-github.md` or `references/tracker-jira.md`).

## Agents

- `requirements-analyst` (step 3), `researcher` (step 6), `design-architect` and `design-critic` (step 7). Their Codex texts: `references/agent-requirements-analyst.md`, `references/agent-researcher.md`, `references/agent-design-architect.md`, `references/agent-design-critic.md`.
- Every brief pastes in the design's current text (What this design solves, Requirements and design readiness, What exists today, Constraints and assumptions, Notes), the way of working from the item's Notes, and the requirements. Agents have no tracker access. The seven parts of a brief: `references/helpers.md`.
- Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran. That is allowed only when the session has no agent tool at all, or the owner said no to helpers.

## References

| File | Open it when |
| --- | --- |
| [references/design-process.md](references/design-process.md) | Every step: the readiness checklist, way of working, research, the architect and critic loop, drafts in each host, presenting |
| [references/approvals.md](references/approvals.md) | Steps 8 and 9: the design approval checklist; what counts as a yes |
| [references/work-item-format.md](references/work-item-format.md) | Step 5 and every design save: the exact `DESIGN.md` headings |
| [references/team-roles.md](references/team-roles.md) | Step 4: sizing the team |
| [references/helpers.md](references/helpers.md) | Before starting any agent |
| [references/agent-requirements-analyst.md](references/agent-requirements-analyst.md), [references/agent-researcher.md](references/agent-researcher.md), [references/agent-design-architect.md](references/agent-design-architect.md), [references/agent-design-critic.md](references/agent-design-critic.md) | Codex only: the text to give the worker |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | The owner answers; history notes; `waiting_on`; a failed save |
| [references/current-focus.md](references/current-focus.md) | Step 9: after the approval |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`: the Solution Design page, or a command prints a Notion error |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
| [assets/DESIGN.md](assets/DESIGN.md) | GitHub or Jira: the text of a new design comment |
