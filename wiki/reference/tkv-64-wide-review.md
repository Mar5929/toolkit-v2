# Wider review of shipped project instructions

Three reviewers audited the shared project files, setup and choice modules, and representative workflows on October 11, 2026. The reviewed tree includes the unmerged 0.9.55 Notion routing patch. That patch remains sound; the wider review found additional process gaps. No further shipped files or live systems changed during this audit.

## Confirmed findings

Paths are relative to `plugins/toolkit/skills/project-setup/`.

| Finding | Location | Recommended correction |
| --- | --- | --- |
| A file-edit-only builder returns into the work item's worktree, but integration assumes a separate committed helper branch. | `every-project/.claude/skills/managing-work-items/references/building.md`; `builder-brief.md` | Verify and integrate returned edits in their actual worktree; merge and remove only distinct helper branches. |
| Source guidance forbids quotations required by requirements guidance. | `every-project/sources/AGENTS.md`; `refining-requirements.md` | Preserve the complete immutable source and allow necessary attributed evidence quotations. |
| Pull/reset asks for a remote but later commands still use origin. | `every-project/.claude/skills/pull-latest/SKILL.md`; `reset-to-remote/SKILL.md` | Carry the selected remote through the procedure. |
| Merge selection ignores an explicit PR number or URL in its initial read. | `every-project/.claude/skills/merge-and-clean-up/SKILL.md` | Resolve the owner's explicit selection before branch inference. |
| Merge overlap checks compare the default branch rather than the PR's actual base. | `every-project/.claude/skills/merge-and-clean-up/SKILL.md` | Use the actual PR diff and distinguish it from checkout-update changes. |
| Requirements-helper inputs omit configured wiki decisions and pending evidence. | `every-project/.claude/skills/managing-work-items/references/requirements-analyst-brief.md` | Pass relevant authoritative records and access or fresh evidence. |
| GitHub error guidance assumes an error means nothing changed. | `choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md` | Verify uncertain remote writes before retrying. |
| Local memory still advertises Notion support and references files it no longer delivers. | `choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md` | Make the entry local-only and retain its working references. |
| Salesforce guide additions assert installation even when official skills are missing. | `choices/salesforce/reference/what-salesforce-adds-to-a-project.md` | State verified availability accurately. |
| The no-remote merge recipe sends child items into the default branch rather than their parent. | `every-project/.claude/skills/managing-work-items/references/deploying.md` | Resolve and use the actual merge target throughout the recipe. |
| Hindsight disconnection appears before record verification in the migration sequence. | `reference/update.md` | Place disconnection explicitly after verified cutover. |

The parent read the cited instructions and confirmed their conflicts or missing routes. These are evidence-backed instruction defects and risks, not reproduced live failures. Related findings were consolidated rather than counted separately by each reviewer.

## Simplification candidates

Exact conversational phrases, count-based escalation/verifier rules and default aging intervals need reconciliation with Mike's existing decisions and the preserved approval-wording draft. These are separate from the functional fixes above. Preserve deliberate three-level work-item navigation, exact schema/tool formats, meaningful evidence and existing authorization.

Chosen-memory guards already cover several remaining local examples. Those examples and the commit reminder's Current State wording are clarity follow-ups, not additional confirmed duplicate-writing failures.

## Coverage and evidence

- [Shared skills, rules, guides, hooks and settings](tkv-64-wide-review/shared-review.md)
- [Setup and all choice modules](tkv-64-wide-review/choices-review.md)
- [Local/GitHub trackers with local/Hindsight memory](tkv-64-wide-review/workflow-review.md)

The reviewers used the repository principles, owner-workflow records, clarity standard and harness-writing guidance. They reviewed every shipped category and replayed representative processes; this does not claim every line or command was executed. The choices report identifies truncated reads and focused follow-ups. Local/GitHub integration used four scratch assemblies; the earlier Notion rerun used two independent assemblies.

No live Notion, GitHub, Hindsight or Salesforce operation, deployment, scheduler activation or full host-session test ran in this wider audit. Concurrent TKV-60 Hindsight changes were excluded.

## Recommended next step

Repair the functional gaps in a focused follow-up, review the changes independently and replay the affected workflows. Then reconcile the broader wording cleanup, shortening instructions where clarity and faithful behavior permit it.
