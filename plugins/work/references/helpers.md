# Working with helper agents

The work plugin ships six agents in `agents/`. Each runs on Opus and carries
its own writing rules. [team-roles.md](team-roles.md) says what each one does
and how to size a team.

| Agent | Used by |
| --- | --- |
| `requirements-analyst` | `work-requirements`, `solution-design` |
| `researcher` | `work-requirements`, `solution-design`, `work-on`, `work-delegate` |
| `design-architect` | `solution-design` |
| `design-critic` | `solution-design` |
| `builder` | `work-on`, `work-check`, `work-delegate` |
| `acceptance-checker` | `work-check`, `work-finish`, `work-on` (plan check) |

## Starting an agent

- Claude Code: start it with the Agent tool. Plugin agents are listed with the
  plugin name in front, for example `work:researcher`. Pass `model: opus` on
  every call so the choice is visible. Start agents whose work does not
  depend on each other in the same message, so they run at the same time.
- Codex: this plugin's agents do not load there. Read the agent's file in this
  plugin's `agents/` folder and give its full text, with the brief, to a
  native Codex worker: the `spawn_agent` tool. Start it without this
  conversation (`fork_turns` set to `none`): a worker forked from the
  builder's thread is not an independent checker. Only when the session has
  no `spawn_agent` tool, do the work yourself and say that no independent
  check ran.

Every skill that uses an agent carries this line:

> Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran.

## The brief

An agent does not see this conversation, the loaded skills, the tracker, or
another agent's findings. Put everything it needs in the brief:

1. The work item id and, when there is one, the task id (`P1-T02`).
2. The text it needs, pasted in: the Agreed goal, the `R-xx` blocks and
   Acceptance list, the relevant design sections, the owner's rulings. Agents
   have no tracker access, so this works the same for local and Notion items.
3. The exact question or job.
4. The deliverable: what to return, and in what shape.
5. "Done when": the check that says the job is finished.
6. The files it may write. Name each path. "Nothing" for read-only agents.
7. For `builder`: the branch the work goes on and the tests to run.

## Rules

- One writer per path at a time. Two agents never write the same file.
- A checker never edits what it checks, and is never the agent that built it.
- Only the main agent changes the work item, talks to the owner, merges, or
  deploys. Agents return findings and proposed changes; the main agent saves
  what is settled.
- Agents never start other agents.
- Close each assignment when its question is answered, its finding is
  resolved or taken to the owner, or another run has no new reason. Add a
  review round only for a named finding or a changed input. There is no
  standing council.
- Reconcile what the agents return into one recommendation before telling the
  owner.

## When helpers are allowed

- Outside agent-led delivery, a small bounded helper needs no permission, for
  example one `researcher` for one question, or one `requirements-analyst`
  check. Honor any limit the owner set.
- A team (several agents working on the goal) needs either the owner's
  team-arrangement answer recorded by `work-delegate`, or the owner's yes to
  the team a skill proposed (for example the design team in
  `solution-design`).
- A "no" to the team question authorizes no helpers: the main agent does the
  work itself.
- Helpers never widen what the owner allowed: no merge, deployment, spending,
  or publishing beyond what was given.
