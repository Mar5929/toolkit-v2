# Sourced decisions follow-up

Mike approved accepting a verified decision in a transcript when the speaker clearly has authority and the decision is unambiguous. A source may establish the answer without asking the owner to repeat it. The speaker's authority remains the owner or the person `PROJECT.md` names for that kind of decision.

The owner replied “yes” on October 11, 2026 to the recommendation. TKV-64 Q-09 records the answer in [the work item](https://app.notion.com/p/3f5b381da17680d8baddef8a6de49b5d). The sourced-decision change was reviewed as version 0.9.49 and is included with the batch-approval follow-up in version 0.9.50 on `codex/tkv-64-sourced-decisions`. Mike approved committing and merging the combined follow-ups on October 11, 2026. Version 0.9.48 is already on main through [PR #66](https://github.com/Mar5929/toolkit-v2/pull/66).

## What changed

- The starter `DECISIONS.md` guide recognizes verified source evidence of an authorized answer.
- `filing-project-records/references/record-decision.md` requires the speaker, their authority, the decision date and the clear decision to be verified. The entry retains the source ID and supporting passage or timestamp. Tentative statements, unverified authority and agent interpretations remain Open.
- `filing-project-records/references/file-source.md` routes sourced decisions to those checks rather than keeping every sourced decision Open.
- Shared and local work-item templates, local/GitHub answer mappings and design helper briefs preserve the actual speaker and source evidence. Verified replacements use the same authority checks; unverified contradictions leave the existing decision and rules in force.
- `managing-work-items/references/refining-requirements.md` applies the same checks to decisions that answer work-item questions. Recording a sourced decision does not replace the owner approvals required by the work-item lifecycle.

## Review situations

A clear owner decision in a filed transcript may be recorded as Decided. A documented delegated decision-maker may decide within that person's scope. A job title alone, an unknown speaker, an ambiguous statement or an agent inference leaves the question Open. A single-work-item decision remains in that work item; a shared decision uses `DECISIONS.md`. Corrected sources and replacement decisions retain their existing history processes.

## Verification

Claude marketplace/plugin validation, whitespace checks, nine tracker/memory assemblies, front matter/settings parsing, required links and scratch Codex 0.9.49 installation passed. The shared/local work-item templates match exactly. Independent review found owner-only answer/template and helper-brief conflicts, plus a replacement-authority gap. All were fixed and reread; no actionable findings remain. Current official skill guidance was read October 11: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills) and [Anthropic skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

No live project records, work-item schemas or installed projects changed. This is guidance for how future sessions record evidence; it does not automatically change existing Open decisions. Unrelated output-style edits, untracked duplicate files and TKV-60 reports remain separate.
