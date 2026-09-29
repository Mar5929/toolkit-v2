# Close-out run, Claude Code (everyday install): not run, sign-in expired

Tried on 2026-09-28 from 22:13 to 22:47 EDT (2026-09-29 02:13 to 02:47 UTC).
Claude Code 2.1.280. Toolkit V2 plugins from this repository's folders, with
their uncommitted concept-memory changes: `toolkit` 0.2.9, `work` 0.2.11,
`memory` 0.2.9, `session-skills` 0.2.9, `git-workflows` 0.2.8. Each Claude
Code cache copy of these versions matches its source folder (`diff -rq`
printed nothing), and `~/.config/toolkit-v2/plugin-root` names
`~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.9`.

## Result

The scenario did not run. The `claude` command-line tool is signed out, so
no `claude -p` session can start.

- The first session (s01, "Set up this project with the toolkit.") ended at
  once with "Failed to authenticate: OAuth session expired and could not be
  refreshed" (`sessions/s01.summary.txt`, exit 1, 155 ms, no model turn).
- `claude auth status` printed `"loggedIn": false` at 22:15, and still at
  22:45 and 22:47 after a 29-minute wait that checked every 30 seconds.
- A desktop notification asked Mike to run `claude auth login`. The phone
  push was not sent (Remote Control was off).
- Signing in is Mike's step. This run did not use any other session's
  sign-in.

So none of the scenario's checks has a result from a real session: setup,
the work item from 01-discovery to Done, the split and hand rename, the "No
agent team" answer and the acceptance checker, the three preferences in one
concept file, the project fact, the proposal, the passing remark, the
questions, the backup, and the hooks.

## What is ready for the rerun

- Project folder: a new Git repository with one commit, `af48cf4 Initial
  commit` by Mike Rihm, holding a three-line `README.md` for "tempconv", a
  command-line tool that converts temperatures between Celsius and
  Fahrenheit:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/closeout2-claude`.
  The failed s01 changed nothing in it.
- Backup folder (empty):
  `.../scratchpad/backups/closeout2-claude`.
- Harness, copied to `harness/` here: `run.sh` runs one `claude -p` session
  with Mike's everyday settings (no `--setting-sources`, `--settings`,
  `--plugin-dir`, or `--strict-mcp-config`; only `--output-format
  stream-json --verbose --include-hook-events`, `--permission-mode
  acceptEdits`, an `--allowedTools` list with `Bash(toolkit *)`, and
  `--disallowedTools` for `toolkit machine-setup`, because `HOME` is Mike's
  own). `say.sh <name> <session to resume or -> '<message>'` writes the
  prompt and runs it. Logs go to `.../scratchpad/runs/closeout2-claude-logs/`.
- Planned messages (Mike's words), in order:
  1. Fresh: "Set up this project with the toolkit." Then one reply per
     question: local folders, built-in memory, not Salesforce, and the backup
     folder above. Then "Yes, commit them."
  2. Fresh: a work request with three parts (C to F and F to C, a
     `--precision` option, a README usage section), "Track it as a work item
     and do it properly." Answer the requirements questions.
  3. Fresh: "Remember that I prefer commit messages without the work item
     number in them. Just say what changed."
  4. Before requirements approval: "Split Kelvin support into its own
     sub-item under WI-001." This makes WI-001 more than a small item, so
     `work-delegate` makes the delivery offer (a small item gets none,
     `work-delegate` step 1).
  5. After approval, to the offer: "No agent team for this one, I'll lead it
     myself." Check that an `acceptance-checker` agent starts before the
     result approval question.
  6. Fresh: "From now on, run the tests before you tell me something is
     done, and tell me how many passed."
  7. By hand between sessions: rename the sub-item folder. Fresh: "Where are
     we?" must report it.
  8. Fresh: "Remember that the weather dashboard script reads tempconv's
     output, so each line must stay a number and a unit with no space." Must
     go to a `project_` concept.
  9. A passing remark about how he likes work done, with no keep phrase.
     The agent must ask "Save to memory: ...?" and not save it as approved.
     Leave it unanswered; the next turn must show a proposal that names its
     concept. Later, under "What do you need from me?", approve it.
  10. Fresh: "Always give me the exact command to try a result before you
      ask me to approve it."
  11. Fresh: "What did I tell you about how I like work done?" The answer
      must come from the one concept file.
  12. Result approvals, merge, `work-finish` for both items, the backup
      check, "Where are we?", "What do you need from me?", and the checks on
      `MEMORY.md`, `git log`, and the hooks.

## Checks run on the current tree

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 979 tests: 976 pass, 0 fail, 3 skipped, 150 seconds |
| `node dev/tools/check-skills.mjs --quiet` | 29 `SKILL.md` files, 205 reference files (159 generated copies), 7 agent files, 683 `toolkit` commands; 0 failures, 0 warnings, 16 notes (the recorded exceptions) |
| `node dev/tools/sync-skill-references.mjs --check` | 159 copies, 0 problems |
| `node dev/tools/import-model.mjs --check` | Matches the approved model folder (112 files, commit `648bf4e`); every `CONDITIONS.json` rule matches |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 14 pass, 0 fail |
| `claude plugin validate .` | Passed |

## Concept memory through the `toolkit` command (not a session test)

To give the rerun something to compare against, the concept-memory commands
were run by hand in a scratch project
(`.../scratchpad/runs/closeout2-cli-smoke/proj`, set up with `toolkit init
--tracker local --memory builtin`). `HOME`, `CLAUDE_CONFIG_DIR`,
`CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` pointed at scratch folders. This
checks the command and the Stop hook. It does not show what the agent does.

What worked:

- Three facts saved into one file, `feedback_ways_of_working.md`, each
  under its own `##` heading (`checks/smoke-feedback_ways_of_working.md`).
  The third fact was first sent as a new record
  (`--type feedback --name result_approval_command`). The command refused
  it: "it belongs in the concept feedback_ways_of_working ("Ways of
  working")", and printed the `--concept` command that adds it there.
- A `project_output_format` concept was made for the project fact.
- A proposal saved with `--concept feedback_ways_of_working --proposal`
  named its concept: `toolkit memory list` showed "[proposal for
  feedback_ways_of_working: the owner has not answered]", and `toolkit work
  decisions` said "A yes adds it to the concept feedback_ways_of_working".
  `toolkit memory approve ... --by 'Mike Rihm'` added it as the section
  "Status tables" and removed the proposal record.
- `MEMORY.md` lists each concept under its type heading with its title, its
  one-line summary, and "(updated 2026-09-28)" (`checks/smoke-MEMORY.md`).

### Finding C1 (medium): the Stop hook can put a preference into an unrelated project concept

Memory held `feedback_ways_of_working` and `project_output_format` ("The
output format of tempconv and who reads it"). The Stop hook was given a
turn that ended with "**Save to memory: you find tables easier to read than
bullets in status replies?**". It saved
`project_proposal_mike_rihm_finds_tables_easier_to_read_than_bulle`, with
`concept: project_output_format` in its frontmatter, and the next turn's
context said:

> ... as a memory proposal for the concept project_output_format (his yes
> adds it there as a section) ...

Two causes, both in `plugins/toolkit/lib`:

- `proposalType` in `hooks/proposal.mjs` makes a question typed `project`
  unless it matches "prefers", "likes", "wants", "hates", "dislikes", an
  agent word, or an imperative verb. "You find ... easier" matches none.
- `suggestConcept` in `memory/concepts.mjs` joins a fact to a concept at
  `SUGGEST_AT = 2`. Here one shared word was enough: a direct save of "Owner
  finds status tables easier to read than bullet lists" as a project record
  was refused with "it belongs in the concept project_output_format
  ("Output format"), which shares its words (read)."

What Mike would see: he says yes, the agent runs `toolkit memory approve
<key> --by 'Mike Rihm'` as `memory-save` and `proposals.md` tell it to, and
a note about how he likes status replies lands in the output-format concept.
The same looseness showed on a direct save: "Always give the exact command
to try a result ..." was matched to `feedback_ways_of_working` on the words
"give, before". That match happened to be right.

### Finding C2 (medium, a risk for this scenario): "I prefer" and "from now on" can split into two files

The record format and the model's `memory-criteria.md` say a "working
preference the owner stated" is `user`, and a "standing correction to how
the agent works" is `feedback`. A concept's facts share its type, and the
command enforces it. The Stop hook typed "you prefer short replies that lead
with the answer" as `user`. Approving it into the feedback concept was
refused:

> Error: feedback_ways_of_working is a feedback key and
> user_mike_rihm_prefers_short_replies_lead_answer a user proposal, so
> nothing was approved. A concept's facts share its type: name a user_
> concept.

So in a real session, "Remember that I prefer ..." may go to a `user_`
concept while "From now on ..." and "Always ..." go to `feedback_`: two
files, where the scenario asks for one. The rerun will show which way the
agent goes. If it splits them, the fix is a rule for which type "how I like
work done" takes, in the record format, the model's criteria, and
`proposalType`.

### Note: the index does not name a proposal's concept

For a proposal that names a concept, `MEMORY.md` ends its line with
"[proposal: not a fact until the owner answers]", as `memory-builtin.md`
section 3 says. `toolkit memory list` names the concept. Not a bug, but
Mike reading the index in Obsidian cannot see where a yes would put it.

## Open question for the rerun: which setup skill answers first

In a folder that is not yet a V2 project, Mike's everyday install loads both
`toolkit:project-setup` and the older `claude-toolkit` plugins, including
`project-init:project-init` ("initialize a NEW project") and
`project-init:project-sync` (s01's `init` event lists both). The five final
runs did their setup in isolation mode, so "Set up this project with the
toolkit." has not been tried with both loaded. The rerun's first session
answers it.

## What this run touched

- Wrote only: the project and log folders above, the scratch CLI project,
  and this folder. s01 left a transcript in `~/.claude/projects/` and its
  hook state in `~/.claude/plugins/data/`, as every earlier run did.
- Did not write to Mike's model folders, `claude-toolkit`, Notion,
  Hindsight, `~/.codex`, `~/.local/bin`, or `~/.config/toolkit-v2`. No
  toolkit code or skill was changed. Nothing was staged or committed.

## Next step

Mike runs `claude auth login` in a terminal. Then the lead starts this task
again: the project folder, backup folder, harness, and message plan above
are ready.
