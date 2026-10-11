# TKV-64 wording cleanup

Version 0.9.58 is a wording follow-up to the workflow patch merged in [PR #69](https://github.com/Mar5929/toolkit-v2/pull/69) as 0.9.57. The workflow patch was reviewed as 0.9.56; concurrent Hindsight work used that version first. The merged release preserves both sets of changes.

## Changes and approval

Mike approved situational wording instead of mandatory conversational phrases, and judgment instead of unexplained editorial caps. Eleven shipped instruction files apply those decisions:

- The work-item lifecycle, requirements, testing and closing references describe the scope of approval questions instead of prescribing exact speech. Questions and Answers, owner evidence, checked results and existing authorization remain required.
- The requirements reference leaves presentation of findings to judgment instead of switching format after three findings.
- The design reference escalates disputes when an owner decision is needed or further review is unproductive instead of after two rounds.
- The building and team-arrangement references allow natural delivery, team and archive questions while preserving authorization and archive prerequisites.
- The handoff skill rechecks consequential edits as needed instead of limiting verifier runs. Unsupported claims and unavailable checks remain visible.
- The pull, merge and reset skills describe actual results and next actions naturally. Reset still requires its reviewed plan, shared-checkout disclosure and evidence about other sessions.

The four earlier lifecycle drafts were selectively reconciled with merged files. No old file or old manifest replaced the current release. Notion wiki routing, verified capture before closure, Git safeguards, deliberate three-level work-item nesting, technical formats and faithful evidence remain intact.

## Length and remaining decisions

The eleven changed instruction files total 23,329 whitespace-separated words, compared with 23,366 before this pass. This pass improves flexibility rather than substantially reducing length. Necessary procedural scope remains explicit.

Memory aging schedules, operational retry limits, model defaults, the handoff template warning and the Hindsight startup briefing size target remain unchanged. These need review of their purpose and owner evidence before any separate policy change.

## Verification

Both Claude marketplace/plugin validations, whitespace checks and a scratch Codex 0.9.58 installation passed. All changed skill front matter, headings and Markdown link targets are unchanged; manifest JSON parses. The scratch installation is at `/private/tmp/tkv58-codex.vCtTLJ/plugins/cache/toolkit-v2/toolkit/0.9.58`.

The [independent workflow review](tkv-64-wording-review-independent.md) compares the patch with merged 0.9.57 and replays approval, closure, design, handoff and Git scenarios. These are instruction reviews and simulated workflows, not live Notion operations or full host sessions.

Writers used the repository harness-writing procedure and official skill guidance reread on 2026-10-11: Claude Code skills and Codex build-skills captures dated 2026-10-05, plus Claude skill authoring best practices captured 2026-09-27 and checked unchanged on 2026-10-05. The eligible captures and their source records are under `ai-external-knowledge/`.

The wording patch is uncommitted and unmerged. No installed project, live wiki record, scheduler or owner host configuration was changed.
