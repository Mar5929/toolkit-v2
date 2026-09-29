# Working with helper agents

How to start a helper agent in each host, what to put in its brief, and when
helpers are allowed.

## Contents

1. The agents
2. Starting an agent
3. The brief
4. A worked brief
5. Rules
6. When helpers are allowed

## 1. The agents

Every agent runs on Opus and carries its own writing rules. A skill that
sizes a team also carries `team-roles.md`: what each role returns and how
many of each to start.

| Agent | What it does | Used by |
| --- | --- | --- |
| `requirements-analyst` | Checks requirements before design or build | `work-requirements`, `solution-design` |
| `researcher` | Answers one bounded question with sources | `work-on`, `work-requirements`, `solution-design`, `work-delegate` |
| `design-architect` | Writes or fixes one design option | `solution-design` |
| `design-critic` | Checks a draft design against every requirement | `solution-design` |
| `builder` | Builds one planned task in its own worktree | `work-on`, `work-check`, `work-delegate` |
| `acceptance-checker` | Checks a result, or a build plan, against the requirements | `work-on`, `work-check`, `work-finish`, `work-delegate` |

Each skill in the "Used by" column carries the agent's definition as
`references/agent-<agent>.md`. In Codex, that text goes to the worker
(section 2).

## 2. Starting an agent

Claude Code:

- Start it with the Agent tool. Plugin agents carry the plugin name in front,
  for example `work:researcher`.
- Pass `model: opus` on every call, so the choice is visible.
- Start agents whose work does not depend on each other in the same message,
  so they run at the same time.

Codex: the plugin's agents do not load there. Every skill that uses an agent
carries this line:

> Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. Only when this host cannot start a worker (no `spawn_agent` tool) do the work yourself, and say that no independent check ran. The `acceptance-checker` still runs when the owner chose owner-led delivery or no agent team.

- Read the agent file yourself and paste its whole text, then the brief, into
  the worker's message. The worker cannot open the skill folder for you.
- `fork_turns` set to `none` matters most for a checker: a worker forked from
  the builder's thread is not an independent check.

Codex builders. Codex has no automatic worktree for a worker, and its sandbox
keeps `.git/` read-only. Two builders in one checkout write the same files,
and their commits fail on `.git/index.lock`. So, for each builder:

1. The main agent makes the builder's own worktree and branch from the item's
   branch, as its own command, with the owner's approval and escalated
   permissions (`sandbox_permissions` set to `require_escalated`). Every skill
   that starts a builder also carries `git-rules.md`: its "Git writes in
   Codex" checklist applies. Name the worktree and branch for the item id and
   the task id, and give a full path in the primary checkout:

   ```text
   git worktree add <primary checkout>/.claude/worktrees/wi-012-p1-t01 -b claude/wi-012-p1-t01 claude/wi-012-csv-export
   ```

2. The brief names that full folder path and branch. The worker works only
   there.
3. The brief tells the worker to run each Git write (`git add`, `git commit`)
   alone, as its own command, with `sandbox_permissions` set to
   `require_escalated` and a one-line reason.
4. After the builder reports, the main agent merges its branch into the
   item's branch, checks the tests, and removes the builder's worktree and
   branch (each an escalated Git write).

With approvals turned off (`codex exec`), Codex refuses every Git write
without asking. Then make no builder worktrees: run one builder at a time in
the item's own worktree, and tell it to write files only and commit nothing.
Each commit then goes to the owner as `git-rules.md` says for a refused Git
write: the exact command for him to run, with the item waiting on him.

## 3. The brief

An agent does not see this conversation, the loaded skills, the tracker, or
another agent's findings. Put everything it needs in the brief:

1. The work item id and, when there is one, the task id (`P1-T02`).
2. The text it needs, pasted in: the Agreed goal, the `R-xx` blocks and the
   Acceptance list, the relevant design sections, the owner's rulings. Agents
   have no tracker access, so this works the same for local and Notion items.
3. The exact question or job.
4. The deliverable: what to return, and in what shape.
5. "Done when": the check that says the job is finished.
6. The files it may write, each path named. "Nothing" for a read-only agent.
7. For `builder`: the branch the work goes on and the tests to run. In
   Codex, also the full path of the worktree folder the main agent made for
   it.

## 4. A worked brief

```markdown
Work item: WI-012, task P1-T01.

Agreed goal: Anyone on the team can export the monthly report as a CSV file
that opens in Excel.

R-01 — Export button creates a CSV file
Required behavior: The Export button on the monthly report downloads the
report rows as a CSV file.
Acceptance check: Click Export; the file opens in Excel with every column.

Design, Technical sequence step 1: add GET /reports/monthly/export that
streams the rows as CSV.

Job: build P1-T01, "Add the export endpoint".
Return: what changed (file paths), the tests you ran with their result
lines, the commit on your branch, and anything you could not do.
Done when: the endpoint test passes and a manual export opens in Excel.
Files you may write: src/reports/export.ts, tests/reports/export.test.ts.
Branch: claude/wi-012-csv-export. Tests: npm test -- reports.
```

## 5. Rules

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
- Reconcile what the agents return into one recommendation before telling
  the owner.
- In Claude Code a helper never leaves a file outside the project: a draft
  comes back in its reply.

## 6. When helpers are allowed

- The acceptance check always runs (the owner's decision of 2026-09-28).
  Before you ask the owner to approve a result, start one
  `acceptance-checker` that did not build the change: in Claude Code with the
  Agent tool, in Codex with a native worker given the agent's text (section
  2). It needs no permission. His answers about delivery and the team decide
  only who builds: "owner-led", "no agent team", "I'll lead it myself", and a
  no to the team question in `work-delegate` never remove it. Only when this
  host has no way to start a worker do you check the result yourself, and
  then you say plainly that no independent check ran, and why.
- If the owner asks to skip the acceptance check, say in one line that it
  always runs before a result approval, as he decided, and ask whether he
  wants to change that decision. Until he changes it, run it.
- Outside agent-led delivery, a small bounded helper needs no permission: one
  `researcher` for one question, or one `requirements-analyst` check. Honor
  any limit the owner set.
- The small design team (one requirements analyst, one architect, one
  critic, and a researcher when a question is open) needs no permission.
  State it in one line. The exception is an owner who said no to helper
  agents at all ("no helper agents at all"); that exception never covers the
  acceptance check.
- A larger team needs the owner's team-arrangement answer recorded by
  `work-delegate`, or his yes to the team a skill proposed.
- A "no" to the team question authorizes no team: the main agent builds the
  work itself. The design critic and the one acceptance checker still run.
- Helpers never widen what the owner allowed: no merge, deployment,
  spending, or publishing beyond what was given.
