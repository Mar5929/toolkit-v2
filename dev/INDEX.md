# Developer files

`dev/` holds the Toolkit V2 build records and checks. Nothing here is copied
into a client project. Start with `GOAL.md` for Mike's decisions, then
`PROGRESS.md` for the current work. `SKILL-INDEX.md` lists the skills.

## Where files go

| Kind of file | Place | Rule |
| --- | --- | --- |
| Settled goals and owner decisions | `GOAL.md` | Keep the current decision above older text. |
| Current build status and next step | `PROGRESS.md` | Add a dated entry. Preserve earlier entries as history. |
| Skill list and descriptions | `SKILL-INDEX.md` | Keep it in step with the shipped skills. |
| Current design or research | `research/` | Name the subject. Say whether it is a proposal, a source brief, or a settled design. |
| Review instructions used on every change | `reviews/` | Keep only the reusable checklists here. |
| Review results for work in progress | `reviews/YYYY-MM-DD-topic/` | Move the results to `archive/reviews/` once the work is settled. |
| Test plans and captured results | `test-runs/` | Give each run its own folder or named report. Do not edit past results. |
| Test cases and fixtures | `tests/` and `evals/` | Keep runnable tests separate from captured results. |
| Developer checks | `tools/` | These tools run in this repository and are not shipped. |
| Source text copied into several skills | `build-shared/` | Edit the source, then update every copy. |
| Superseded drafts, old handoffs, and settled reviews | `archive/` | Keep for history; do not treat these as current instructions. |

`HISTORY.md` records the direction change from the retired program. The
root `ARCHITECTURE.md` describes that retired program and stays at its path
because `AGENTS.md` points to it for history. It does not describe what the
toolkit ships today. `model-changes.md` remains at the root because the rule
checker points to open questions in it. The long earlier portion of
`PROGRESS.md` is filed at
`archive/model/progress-2026-09-29-to-2026-10-02.md`.

## Finding test evidence

`test-runs/` holds the run reports and raw captures. Its older scenario
folders (`a-local-builtin`, `b-salesforce`, `c-notion`, `d-local-hindsight`,
`confirm-*`, `final-*`, `claude-a`, `rules-codex`, and `closeout-*`) document
the retired program. Read each folder's `evidence.md` first. Newer reports
at the root are named for the skill, feature, or toolkit version they tested.
Keep the evidence in place: `GOAL.md`, `PROGRESS.md`, and review records cite
it, and Mike's approval is required before test data is deleted.

## Archive

`archive/` groups material by its former job: `research/`, `reviews/`,
`handoffs/`, `diagrams/`, and `model/`. The files remain in Git history and
in this checkout. The old diagrams include a hook that was later removed,
so use current files under `plugins/` and `research/` for today's design.
