# TKV-64 shared instructions independent cross-review

## Scope

Reviewed diffs against HEAD for shared project skills, managing-work-items common references, relocated team/repository references, and local writing-harness-files. Compared with document clarity, wiki, owner ways-of-working record, and current official skill routing guidance. No cross-edit made.

## Findings sent to coordinator

1. team-arrangement.md lost the identity of its originating document: the phrase “When a helper returns” should point to building.md and that section. A reader retrieving the focused reference alone cannot find the report procedure reliably.
2. team-arrangement.md opening recognizes the already chosen arrangement and proceeds; its subsequent question bullets must clearly apply only when that choice is missing, or the patch recreates the redundant approval question it intended to remove. Preserve the exact questions for missing choices.
3. filing-project-records blocked publication: the instruction “write no ID in the work item” and the Hindsight instruction to record a “deferred link” there need a distinction. Store the pending reference as a blocker/context note, not an authoritative linked record or Affects link, until the main checkout contains the record.

## Reader scenarios

- Hindsight handoff: read Memory in PROJECT.md, route recall/saves through hindsight-memory.md, update current work in selected tracker, skip the local/Notion Current State section, include unresolved claims and pending saves in the checked handoff. No Current State file created. Verifier now receives explicit Hindsight inputs. PASS.
- Shared decision from transcript: filing-project-records retains source filing and DECISIONS.md ownership, publication, Affects/Related items, Q&A owner wording, and Open-question blockers. Store-specific memory routing adds no second authoritative decision. PASS except pending-link distinction above.
- Done or Cancelled: closing retains nonempty Moved up line, memory review, durable promotion destinations, read-back, and source-record preservation. Hindsight follows its rule and tracker. Cancellation keeps unmerged branches/worktrees pending owner action. PASS.
- Blocked publication: document save stays on default branch; local work-item links wait until main checkout holds it. Local/Notion use Waiting on and Hindsight uses affected tracker. PASS pending note clarification above.
- Existing authorization: lifecycle-rules recognizes explicit instruction and same-scope earlier approval; a changed result still needs its own approval. Six approval outcomes retained. Team arrangement needs the conditional wording above. PASS otherwise.
- Host permissions: Git/service instructions now use active permissions, report denials, and preserve the no-bypass/default-branch boundary. Git branch and worktree commands remain in build-repository.md. PASS.
- Capability checks: team arrangement still checks session tools and has helper-only fallback, preserves archive-not-delete and owner archive approval. Link to returned-helper process needed above. PASS otherwise.

## Requirements and exact content

Relocated build repository commands, branch forms, main-checkout resolution, sub-item parent branching, merge conflict handling, no AI credit and no commit --no-edit survive. Team hierarchy, exclusive orchestrator writes/merges, starting brief contents, archive prerequisites survive. Handoff fixed first line, verdicts, failed-save labels and prompt inclusion survive. Closing read-back, Moved up and cancel preservation survive. Lifecycle widened authorized defect repair follows the approved goal, not arbitrary extras; changed requirements return through Refining Requirements.

The local writing-harness edit replaces arbitrary reader/reviewer counts with appropriate coverage while retaining independent review and rereading confirmed fixes. Direct entry links now discover supporting Notion and build references. No new mandatory approval introduced by the reviewed diffs.

## Validation scope

This is a text and scenario review, not a fresh live-host invocation test. Coordinator performs whole-repository checks and behavior evals.

## Reread of confirmed corrections

Reread team-arrangement.md and filing-project-records/SKILL.md after fixes. All three findings are resolved: the returned-helper procedure now names building.md; arrangement questions apply only when the choice is missing; Hindsight blocked saves create a blocker note while authoritative link fields remain unchanged. No further requirement loss or new mandatory approval found.
