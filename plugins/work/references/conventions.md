# Conventions every work skill follows

Every skill in the work plugin follows these rules. A skill's own `SKILL.md`
names the file when a rule matters for a step.

## Voice

Every skill carries this line near its top:

> Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Agents do not receive the output style. Each agent file in `agents/` carries
its own writing rules.

## Opening another skill

- Claude Code: use the Skill tool with the skill's name, for example
  `work-requirements`.
- Codex: read that skill's `SKILL.md` from the path shown in the skill list,
  then follow it.
- Say the handover in one line, for example "WI-012 needs a design; opening
  solution-design."
- The skill that asked a question records the answer. An answer that arrives
  later, after that skill has finished, is recorded by `work-decide`.

## Running `toolkit` commands

- Put each `toolkit` command on its own line and run it as a plain command.
  Do not wrap it in `$(...)`, a pipe, or a redirect. Codex matches its
  command rule against the plain command.
- Add `--json` when you need to read the output field by field.
- Exit codes: `0` done; `1` error; `2` validation failure (fix what it names
  and run it again); `3` not supported for this tracker or memory backend
  (follow [trackers.md](trackers.md)); `4` not a Toolkit V2 project (open
  `project-setup`).
- "saved but not verified" in the output means the write happened and the
  read-back failed. Report it that way.

## Changing a work item

- Change a work item only through `toolkit work` commands. This keeps the
  local tracker and Notion the same, and it keeps the CLI's record of what it
  wrote. A value the agent changes by hand looks like an owner edit to the
  CLI.
- Find a file only with the command below. Never build a path by hand: the
  owner may have moved or renamed the folder.

  ```text
  toolkit work show <id> --path
  ```

- To change one section of the body, read it, change only what needs to
  change, and write the whole section back. The file holds the same text the
  read printed for that heading, with your changes.

  ```text
  toolkit work show <id> --section "<heading>"
  toolkit work edit <id> --section "<heading>" --set-file <file>
  ```

- To add one row to a table section (Open Questions, Recent History), use
  `--append-row` with the full Markdown table row. A new question takes the
  next free `Q-` number: read the Open Questions section first and add one to
  the highest number there (`Q-01` when there is none).

  ```text
  toolkit work edit <id> --section "Open Questions" --append-row "| <next Q-id> | <question> | R-02 | Open | owner |"
  ```

- Frontmatter values change only through `toolkit work set`, `approve`,
  `design`, `move`, `finish`, and `cancel`. Never edit frontmatter by hand.
- Never hand-edit `.work-items/DASHBOARD.md` or
  `.work-items/.toolkit-state.json`. The hooks refuse it.
- Files for `--set-file` and `--body-file`: write the full new text to a file
  in a temporary folder outside the repository (make one with `mktemp -d`).
  Never leave draft files inside `.work-items/`: a second `DESIGN.md`-shaped
  file there confuses the design lookup.

## Section names in `WORK-ITEM.md`

These are the headings `--section` uses. Every tracker uses the same body.

| Heading | What it holds |
| --- | --- |
| `Overview` | Goal, Current position, Next action (and who owns it), Blockers, Related items (ids, never paths) |
| `Roadmap` | Phases `P1`, `P2` with Outcome, Status, Exit result, Sub-items |
| `Tasks` | Tasks `P1-T01` with Work, Deliverable, Done when, Depends on |
| `Recent History` | Dated rows: change or decision, effect on the work |
| `Open Questions` | `Q-01` rows: question, affects, status, decision needed from (`owner` for the owner) |
| `Requirements` | Overall status, Starting request, Agreed goal, Active requirements `R-01`, Acceptance |
| `Notes` | Decisions and context, Resume here, Solution options and considerations |

## Saving what the owner says

Save each settled answer in its home before moving to the next topic. An
unanswered question is also information to save. Open decisions do not delay
saving answers that are already settled.

| Information | Home | What to record |
| --- | --- | --- |
| Requirement or correction | The item's `Requirements` section (the `R-xx` block and Acceptance) | The new meaning, and Status `Refining` until approved |
| Design choice | The item's design (`toolkit work design`) | The approach, proposed or approved, and why |
| Open question | The item's `Open Questions` table | Question, what it affects, Open, who must answer (`owner` or a name) |
| Answer or decision about this item | The existing question row, the affected section, and one history note | The answer, who gave it, the date, and whether it is an approval |
| Decision for the whole project | `DECISIONS.md`, through `work-decide` | Decision, why, who decided, what it replaces |
| Outstanding task | The item's `Tasks` section | Work, deliverable, done when, depends on |
| Useful context that is not a requirement | `Notes` > `Decisions and context` | Only what the next session needs |
| Build idea kept for later | `Notes` > `Solution options and considerations` | The idea and the `R-xx` it relates to; it is not a requirement |
| A lasting fact, preference, or lesson | Project memory, through `memory-save` | One record |

- Check the item and memory before asking the owner a question again.
- When sources disagree, keep the conflict open and ask. Do not pick the
  convenient answer.
- A question, a suggestion, a tentative answer, or a saved draft is not
  approval. `toolkit work lifecycle` prints what counts as approval.
- Read the section back after saving. A command that exits `0` is not proof
  by itself.

## Reporting a failed save

- A write failed: lead with "Not saved", name what was not saved and where it
  should go, and keep the text so it can be saved later.
- The write worked and the read-back failed: lead with "Saved but not
  verified".
- Never say "updated" first and correct it later in the same reply.

## When to add a history note

Add one `toolkit work history <id> --note "<text>"` when:

- the stage, type, priority, `waiting_on`, blockers, or next action changes
  for a reason that is not obvious;
- the owner gives a choice, an answer, a requirement, a constraint, an
  approval, or a rejection (quote his words);
- someone outside reports an approval (record who, and do not claim you
  checked it);
- a discovery changes the plan;
- a requested result is finished.

Record the owner's meaning briefly. Do not add reasons, scope, or certainty he
did not give. Do not log routine commands, files opened, ordinary test runs,
or small edits.

## Waiting on the owner

- Set `waiting_on` to `owner` when you ask the owner for an approval or add an
  Open Questions row that he must answer.
- `toolkit work approve` does not change `waiting_on`. After each recorded
  approval, and after the owner answers his last open question on the item,
  set it back: `agent` when the agent can continue, `none` when nothing
  waits. Keep `owner` only while another question for him on that item is
  still open.

  ```text
  toolkit work set <id> --waiting-on agent
  ```

- An item left at `owner` stays in the briefing and in
  `toolkit work decisions`, and `work-on` sends it to `work-decide` instead of
  its next stage.

## Stages in plain words

- Show a stage with the item id and the plain label from
  `toolkit work lifecycle`, for example "WI-012 is in testing (stage 09)".
- Never ask the owner which stage an item is in. Work it out from the record.
- Status follows the stage. `waiting_on` shows who the item is waiting for.
  Blocked is not a status.

## Owner edits win

The owner may edit the tracker by hand: move a folder, drag a Notion card,
change a stage. The CLI keeps his value, adds a "Changed by hand" history row,
and reports it. Never undo it. When a hand change skips a gate (a build item
moved past stage 03 without approved requirements, or Done without a recorded
result approval), ask the owner about it as a question.

## Branches and worktrees

- An item's code work happens on its own branch and worktree, named
  `wi-<number>-<slug>`, for example `wi-007-csv-export`. The briefing ties a
  worktree to its item by that name.
- Never commit `.work-items/` or `.memory/`. They are Git-ignored and live in
  the main checkout.
- No AI credit anywhere: not in commits, pull requests, comments, or files.
