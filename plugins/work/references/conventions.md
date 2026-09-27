# Conventions every work skill follows

Every skill in the work plugin follows these rules. A skill's own `SKILL.md`
names the file when a rule matters for a step.

This file is `references/conventions.md` in the work plugin's own folder. From
a skill's `SKILL.md` it is two folders up: `skills/work-on/SKILL.md` and
`references/conventions.md` share the plugin folder. In Codex the plugin
folder is the installed copy, for example
`~/.codex/plugins/cache/toolkit-v2/work/<version>/`, so this file is
`~/.codex/plugins/cache/toolkit-v2/work/<version>/references/conventions.md`.

Four rules that are easy to miss:

- Run each `toolkit` command alone, as its own command (below).
- Never change a work item with a script (Python, Node, `sed -i`, `cat >`).
  Use `toolkit work edit --section` or `--label`, or the file edit tool for
  body text. The hooks refuse the script, so it only wastes a step.
- Temporary text goes in `--text`, or in a file in a new `mktemp -d` folder,
  never at a fixed name such as `/tmp/wi001.md`.
- End every reply to the owner with the one question he must answer, or with
  the exact words that continue the work ("Say 'keep going' and I'll start the
  build."). Never end on "The next step is ..." with nothing for him to do.

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
  command rule against the plain command. This holds for read commands too:
  `toolkit work decisions && toolkit work show WI-001` is two commands.
- In Codex, a `toolkit` command joined to anything else (`&&`, `;`, a pipe, a
  heredoc, `cd ... &&`) or run from a script (for example Python's
  `subprocess`) runs inside the Codex sandbox. The sandbox blocks Notion,
  Hindsight, and the main checkout's `.work-items/` and `.memory/` from a
  worktree, so the command fails or reports the wrong cause. Run each one
  alone, as its own command.
- Add `--json` when you need to read the output field by field.
- Exit codes: `0` done; `1` error; `2` validation failure (fix what it names
  and run it again); `3` not supported for this tracker or memory backend
  (follow [trackers.md](trackers.md)); `4` not a Toolkit V2 project (open
  `project-setup`).
- "saved but not verified" in the output means the write happened and the
  read-back failed. The message names the first line that differs. Lead the
  reply to the owner with "Saved but not verified", say which line, and read
  the item back to judge it.

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
- A title is the owner's call. A new item's title uses the owner's own words
  for the request. When you shorten them or choose another, say the title in
  one line in the reply ("I started WI-003, 'Write a short project brief'.").
  To retitle an item, say the new title to him in one line before
  `toolkit work set <id> --title`, and never retitle an item quietly.
- Never hand-edit `.work-items/DASHBOARD.md` or
  `.work-items/.toolkit-state.json`. The hooks refuse it.
- Text for a section or a design:
  - Short or medium text, in both hosts: give it in the command with
    `--text "<text>"`. No file is needed, and newlines inside the quotes are
    kept:

    ```text
    toolkit work edit <id> --section "<heading>" --text "<text>"
    toolkit work design <id> --text "<text>" --status proposed
    ```

  - Claude Code, for long text: pass it on standard input, so no file is left
    anywhere: `toolkit work edit <id> --section "<heading>" --set-file - <<'EOF'`,
    then the text, then `EOF`. (In Codex a heredoc runs the command inside the
    sandbox; use `--text` or a file there.)
  - Codex, for text too long for `--text`: make a new folder for this one save
    with `mktemp -d` (its name is unique, so two sessions or two projects never
    share a file), write the file in it with the file edit tool, run the
    `toolkit` command alone with the file's full path, and delete the file and
    the folder right after the command succeeds (`rm <file>`, then
    `rmdir <folder>`), before you ask the owner anything. Never use a fixed
    name such as `/tmp/wi001-requirements.md`: every project starts at
    `WI-001`, so another session's save could land in this item. Never write
    the file and run the `toolkit` command in one shell command.
  - Never leave draft files inside `.work-items/`: a second `DESIGN.md`-shaped
    file there confuses the design lookup.
- Never write a work item record from the shell (`cat >`, `tee`, `sed -i`,
  `cp`, or a script) and never change its frontmatter with a file edit. The
  hooks refuse both, because they would skip the approval gates.

## Section names in `WORK-ITEM.md`

These are the headings `--section` uses. Every tracker uses the same body: the
project's `.work-items/work-item-template/WORK-ITEM.md`, copied from the model
project.

| Heading | What it holds |
| --- | --- |
| `Overview` | Goal, Current position, Next action (and who owns it), Blockers, Related items (ids, never paths) |
| `Roadmap` | Phases `P1`, `P2` with Outcome, Status, Exit result, Sub-items |
| `Tasks` | Tasks `P1-T01` with Work, Deliverable, Done when, Depends on |
| `Recent History` | Dated rows: change or decision, effect on the work |
| `Open Questions` | `Q-01` rows: question, affects, status, decision needed from (`owner` for the owner) |
| `Requirements` | Overall status, Starting request, Agreed goal, Active requirements `R-01`, Acceptance |
| `Notes` | Decisions and context, Resume here, Solution options and considerations |

The frontmatter fields are `id`, `title`, `type`, `stage`, `status`, `parent`,
`waiting_on`, `priority`, `delivery`, `requirements_approved`, `design`,
`result_approved`, and `updated`. Only `toolkit work` commands change them.

## Section names in `DESIGN.md`

The design has one shape in every tracker (`DESIGN.md` beside a local item,
the "Solution Design" page in Notion, the "Solution design" comment in GitHub
or Jira). The CLI writes its frontmatter: `work_item`, `status` (`proposed`,
`approved`, `superseded`), and `approved`.

| Heading | What it holds |
| --- | --- |
| Header lines | Requirements (the item id), Design status, Requirements checked, Last updated, Design approval |
| `What this design solves` | Who uses the result, what they need, what must be true afterward, and what the design leaves to another item |
| `Requirements and design readiness` | One row per `R-xx`: its status in the item, the design coverage, and the remaining decision or gap |
| `What exists today` | Verified current behavior and files, or "nothing exists yet" |
| `Constraints and assumptions` | One row each, with source, status, and effect on the design |
| `Design options` | `### Option A — <name>` (then B, C) with Approach, End-to-end behavior, Requirement coverage (Build or reuse, Why it meets the requirement, How to check it), Technical shape, Tradeoffs and risks, Build order |
| `Option comparison` | Only with more than one option |
| `Recommendation and owner decision` | Recommendation, Owner decision, Reason for decision |
| `Selected design` | After the owner chooses: End-to-end flow, Components and responsibilities, Data, access, and integration details, Edge cases and failure behavior, Release and ongoing operation |
| `Diagrams` | Mermaid diagrams, each with a heading and a one-sentence explanation |
| `Build and verification plan` | Technical sequence, and Acceptance checks (one row per requirement) |
| `Sources and decisions that affect the build` | Claim or decision, source, date, evidence type, how it was checked |
| `Where a builder could misread this design` | Requirement or section, plausible wrong reading, intended reading |
| `Notes` | Open design questions, Design changes during the interview, Current position and next step |

Keep the headings exactly as the template has them, including the dash in
`Option A — <name>`.

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

Add one `toolkit work history <id> --note "<text>" --effect "<what it changes>"`
when (without `--effect`, the row says which skill continues the item):

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
- `toolkit work approve` sets `waiting_on` from `owner` to `none`, because the
  owner just answered. After the approval, set it to `agent` when the agent
  continues. After the owner answers his last open question on the item, set
  it back the same way: `agent` when the agent can continue, `none` when
  nothing waits. Keep `owner` only while another question for him on that
  item is still open.

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

The session briefing lists these changes under "Changes found in the
tracker", and every `toolkit work` command prints the ones it finds. Tell the
owner each one in one line ("You renamed WI-002's folder to help-option; I'll
use the new path.") before other work. The CLI writes the history rows for a
hand move itself: "Moved by hand", "Folder renamed by hand", or "Parent
changed in Notion by hand" on the item, and "Sub-item ... moved out" or
"moved here" on the parents it left and joined. Add a note only for what the
CLI cannot know, such as the owner's reason.

## Branches and worktrees

- An item's code work happens in its own worktree
  `.claude/worktrees/wi-<number>-<slug>` on the branch
  `claude/wi-<number>-<slug>`, the form the project's
  `shared-repository-work.md` rule uses:
  `git worktree add .claude/worktrees/wi-007-csv-export -b claude/wi-007-csv-export`.
  The briefing ties a worktree to its item by the item id in the branch name.
  With another id prefix, use it in lower case (`acme-007-...`).
- Never commit `.work-items/` or `.memory/`. They are Git-ignored and live in
  the main checkout.
- No AI credit anywhere: not in commits, pull requests, comments, or files.
- Codex: its sandbox keeps `.git/` read-only, so `git add`, `git commit`,
  `git worktree add` and `remove`, `git merge`, `git branch -d`, `git fetch`,
  and `git push` cannot run inside it. The project's
  `.codex/rules/toolkit.rules` makes Codex ask the owner before each one.
  - Run each Git write as its own command and ask for escalated permissions:
    set `sandbox_permissions` to `require_escalated`, with a one-line reason
    that says what the command does ("Create the worktree for WI-002 on its own
    branch."). An approval without escalation still runs the command inside
    the sandbox, where it fails on `.git/index.lock`.
  - Tell the owner in one line what the command does before Codex asks.
  - Codex refused it without asking ("approval required by policy, but
    AskForApproval is set to Never"): this session cannot ask. Stop that
    step, show the owner the exact command, ask him to approve it in an
    interactive session or to run it in a terminal, and set the item waiting
    on the owner. It is not an outside blocker.
  - Never work around it: no nested `git clone` of the project, no copy of
    `.git/`, no building on the default branch instead of the item's branch.
- The project's shared-repository rule runs `git fetch origin` before the
  first edit. When `git remote` prints nothing, the project has no remote:
  skip the fetch.
- A merge that stops on a conflict: resolve it, then commit with a message you
  write (`git commit -m "Merge <branch>: <what it brings>"`), never
  `git commit --no-edit`, which keeps Git's "# Conflicts:" lines in the
  message.
