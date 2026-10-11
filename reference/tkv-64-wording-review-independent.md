# Independent wording review and workflow replay

The eleven procedure-file changes match the authorized wording and judgment changes. No actionable blocker was found. The review compared the stable patch on `codex/tkv-64-wording-cleanup` with the merged 0.9.57 HEAD and read the changed procedures through their parent skills.

## Authorized changes and preserved safeguards

The patch replaces required conversational phrases with questions that name the approval and its scope. It removes the arbitrary finding-list threshold, design dispute round threshold, and handoff verifier limit. It preserves the required record formats, status markers, evidence, approval fields, owner words and dates, and three work-item levels. No skill name or description changed.

`managing-work-items/references/lifecycle-rules.md` makes example questions optional while preserving all six approval boundaries and earlier authorization for the same scope. Closure still distinguishes local/Hindsight promotion from Notion capture. The Git skills change question/report wording while retaining the 0.9.57 remote, head, overlap, ownership, cleanup and reset safeguards. No new approval boundary, weaker approval scope, or added reasoning prescription was found.

## Paper workflow replay

All results below are simulated state traces, not live tool results. Procedure paths are under `plugins/toolkit/skills/project-setup/every-project/.claude/skills/`.

| Scenario | Result under the changed instructions |
| --- | --- |
| Change approved requirement R-02 | `refining-requirements.md` adds the new scoped approval row, preserves the original words and supersession evidence, and keeps other requirements approved. R-02 remains unapproved while its row is open; its design/build/test cannot proceed. Flexible question wording does not approve it. |
| Full closure with local or Hindsight memory | After checked-result approval, reusable outcomes are listed with proposed outcomes and evidence. The owner approves the listed promotion scope; records are filed and read back, Moved up records the actual results, and Done needs its own authorization. Hindsight uses its rule and tracker rather than creating Current State. |
| Small closure with local or Hindsight memory | The closing question explicitly covers the checked result, listed outcomes to keep, and Done. The answer supplies the corresponding recorded approvals. Any pending merge, deployment or data load is identified and remains outside that answer; deployment procedures still apply. Earlier approval of the same scope is not discarded. |
| Notion capture before closure | A failed or unreadable capture cannot satisfy the capture verification step. A read-back-verified Inbox capture in New state can be linked in Moved up and closure can proceed; pending filing is labeled accurately. No local promotion question or claim of a filed wiki destination is added. This applies to both full and small paths. |
| Design dispute | A dispute requiring owner choice is raised with the evidence and recommendation when needed, rather than waiting for two rounds. The design remains proposed until its choice is approved. An unmet requirement returns to refinement instead of becoming a weaker compromise. |
| Handoff with unsupported claims | Unsupported claims are marked “not confirmed”. A substantive correction to the goal or a supported claim is rechecked as needed, with no fixed verifier count. Failed/unavailable checks are disclosed and the prompt is still delivered; save failures remain visible. The required warning line and verification labels remain intact. |
| Team and archive | Recorded delivery and team choices are reused. Missing arrangement authorization prompts a scoped choice only after tool availability is checked. Archive authorization is separate; an existing applicable authorization is reused. Completion, recorded report, merged/shipped work, and owner-approved result remain prerequisites. |
| Pull latest with dirty main checkout | A clean item worktree can fetch and update its branch, while the dirty main checkout is left unchanged. The report names that reason. No stash, reset, branch switch or implicit permission to discard another session’s work is introduced. |
| Destructive reset | An explicit reset request starts inspection and a concrete discard/install plan. It does not authorize execution before approval of that plan. Shared-main effects and evidence of no other active session are stated in ordinary language. Other worktrees, uncommitted work, upstreams and exact discarded commits remain protected by the existing checks. |

## Review basis and checks

The review read root `AGENTS.md`, request evaluation, document clarity, and `writing-harness-files` with its Skill checklist. It reread the eligible official skill guidance copies: Codex build-skills and skill-authoring best practices captured 2026-09-27, and Claude Code skills captured 2026-10-05. These are within the permitted 14-day window on 2026-10-11. The changed text fits progressive reference loading and states procedures rather than prescribing thought.

`git diff --check` returned no output. The complete changed hunks were reviewed; parent skills and affected approval, capture and safety paths were read for context. The paper scenarios do not prove live Notion, Hindsight, GitHub or host operations, scheduler execution, actual approval interpretation in a fresh session, or filesystem behavior. No live operations, commits, or shipped-file edits were made by this review. The only write was this review record.
