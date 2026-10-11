# Eleven workflow fixes

Version 0.9.56 fixes the eleven gaps from the wider shipped-content review and includes the earlier three Notion routing fixes. The patch is ready on `codex/tkv-62-routing-fixes`, uncommitted and unmerged. Broader wording-policy cleanup and concurrent TKV-60 changes remain separate.

## What changed

| Gap | Corrected behavior |
| --- | --- |
| File-edit-only builder return | Record the starting state; verify returned changes in the item worktree; preserve unrelated changes and commit when permitted. Remove only a separate helper worktree. |
| Source quotations | Preserve the complete immutable source and allow necessary attributed evidence excerpts. |
| Non-origin remote | Carry the selected remote through pull and reset procedures and shared-repository fetch guidance. |
| Explicit PR selection | Resolve the supplied PR and repository before branch inference; bind local cleanup to the verified remote and base upstream. |
| PR-base comparison | Use the actual PR diff, inspect dirty target and main worktrees, and check checkout-update overlap separately. |
| Requirements-helper context | Supply configured project/wiki records and relevant pending evidence, with read access or fresh retrieved text. |
| Uncertain GitHub writes | Verify the target or attempted creation before retrying; resume only unconfirmed work. |
| Local-memory entry | Remove obsolete Notion scope and unavailable links; keep metadata and local procedures. |
| Salesforce availability | Use official skills when installed and enabled; report missing skills when needed. |
| No-remote child merge | Target the parent branch; reserve default-branch authorization for top-level merges and verify the tested head. |
| Hindsight migration | Keep the old connection until verified, approved cutover. |

The changes preserve approval scope, exact record/tool fields, independent verification, customized records and the three-level work-item structure. Supporting detail stays in references. No arbitrary new limits or new shipped scripts were introduced.

## Review and workflow replay

Writers reviewed each other's work; a separate reviewer checked the setup/choice changes. One PR-cleanup remote mismatch was found, fixed and rereviewed. No remaining blocker was found in the approved scenarios.

- [Lifecycle fixtures and independent Git review](tkv-64-workflow-fixes-review/lifecycle-and-git-review.md)
- [Independent lifecycle review](tkv-64-workflow-fixes-review/independent-lifecycle-review.md)
- [Choice/setup review and recovery replay](tkv-64-workflow-fixes-review/choice-review.md)

Disposable Git fixtures verified non-origin fetch/pull, remote default lookup, reset-plan lockfile lookup, actual-base comparisons and child-to-parent merging without advancing main. Procedure replays covered interrupted builders, inaccessible wiki evidence, explicit PR identity, moving heads/bases, dirty worktrees, ambiguous remote writes, missing Salesforce skills and partial migration.

Claude marketplace/plugin validation, whitespace, nine module assemblies and scratch Codex 0.9.56 installation passed. Assemblies checked front matter, JSON, host skill symlinks, guide pairs, librarian presence and entry routes. The link check accounts for documented tracker/Salesforce references supplied only by their selected overlay; the revised local-memory entry resolves all its links locally.

The review used official skill/instruction guidance read on October 11 or eligible repository captures from September 27/October 5, plus the harness checklist and clarity standard. No skill name or description, hook behavior or schema changed.

## Verification limits and next step

Fixtures and tabletop replays do not prove live Notion/GitHub/Hindsight/Salesforce operations, scheduler execution or full host loading. No live record or schedule changed. Review reports retain detailed limits.

Next, commit and merge the reviewed patch; then resume the separate wording-policy cleanup.
