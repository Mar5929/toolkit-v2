# Independent local-memory review policy review

The policy changes implement the owner-approved replacement of fixed memory-aging cutoffs with usefulness, likelihood of change, and evidence. The related retrieval sentence was aligned after review; no actionable blocker remains.

## Corrected finding

`plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/finding.md`, final paragraph under “Reading what you found”, still instructs reporting a last check older than `tidying.md` “allows”. The revised Stale records section allows no maximum age. That sentence now points to an undefined cutoff and can suggest that age alone requires reporting. The fix now directs use of the revised review and verification policy and disclosure of uncertainty that matters to the answer or action. The reviewer reread this change: it removes the undefined threshold, keeps verification on the retrieval path, and adds no age cutoff or approval boundary.

The three edited references otherwise preserve uncertain labels, check/remove and verification dates, source checks, true time-bound expiry, owner-approved cleanup plans, deletion authority and historical records. The changes supply a general process rather than a case-specific schedule or reasoning prescription. Setup supplies these references to local memory; the separate Notion memory module and Hindsight rule are unchanged.

## Paper scenarios

| Scenario | Expected result from the revised policy |
| --- | --- |
| New unchecked claim | Search/read first, retain qualifying context with provenance, “Not checked.” and what would check it, then choose a useful review date from volatility and evidence or the owner’s date. No automatic 30-day rule. Read the save back; do not present the claim as established fact. |
| Old stable fact | Age alone does not invalidate the record or force an owner question. Review its relevance and evidence; retain still-useful stable context. Set last-verified only after an actual check. |
| Changing vendor fact needed now, source unavailable | Before consequential use, seek current authoritative evidence. If verification remains unavailable, show uncertainty and preserve useful context. Ask the owner when that unresolved issue blocks the work; a nonblocking uncertainty does not itself require a question. |
| True expiry | An absence ending on a known date still carries the real check/remove date from memory-criteria.md. When due, check and correct or retire it. Removing the policy cutoff does not make a time-bound fact permanent, and a passed unchecked-claim review date does not establish falsity. |
| Cleanup needing approval | Merges, record deletions, removal of true Current State lines, and owner rule changes retain their applicable approval requirements. Nonblocking uncertainty does not authorize those operations. The existing exceptions for no-longer-true dated information and security-compromising text remain scoped exceptions. |

## Review basis and limits

The review read request evaluation, document clarity, the memory entry and affected references, finding and true-expiry routes, writing-harness-files and its Skill checklist. It reread eligible official skill guidance copies: Codex build-skills and skill best practices captured 2026-09-27, and Claude Code skills captured 2026-10-05, within the 14-day window on 2026-10-11. `git diff --check` returned no output.

These are paper instruction traces, not executed memory operations. No actual memory records, bank, scheduler, host settings, live systems or commits changed. The only review write is this record. Delivery authorization is separate from acceptance of the policy.
