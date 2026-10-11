# TKV-64 memory review timing

Mike approved Q-13 on 2026-10-11: “Use judgment and ask only when needed (Recommended)”. The 0.9.59 draft replaces local-memory fixed review intervals with review dates chosen from usefulness, likelihood of change and available evidence. The agent verifies uncertain or changing information before consequential use and asks the owner when unresolved uncertainty blocks work.

The local memory module installs the affected references from `choices/memory/shared-by-local-and-notion/`. The new Notion wiki module has its own procedures; this patch does not change its schedule or live records.

## Changes

- `saving.md` no longer assigns unchecked claims a default 30-day deadline.
- `tidying.md` no longer treats six months as the review threshold for changing facts or asks the owner whenever verification fails. It preserves useful uncertain context and distinguishes a due review from proof that a claim is false.
- `memory-process.md` aligns the uncertainty-question trigger with work that is blocked.
- `finding.md` routes retrieval to the revised freshness policy instead of an undefined allowed-age threshold. Independent review found this reference after the initial three-file edit; the correction was reread.

True time-bound expiry dates, unchecked labels, source evidence, metadata, cleanup-plan approval and deletion authorization remain intact. Dates alone do not establish truth or justify deletion.

## Verification and delivery

The [independent review](tkv-64-memory-aging-review-independent.md) replayed a new unchecked claim, an old stable fact, unavailable verification of a changing vendor fact needed now, true expiry, and cleanup requiring approval. No actionable blocker remains after the retrieval-reference correction.

Both Claude package validations, whitespace checks and scratch Codex 0.9.59 installation passed. The scratch installation is at `/private/tmp/tkv59-codex.ydvRiy/plugins/cache/toolkit-v2/toolkit/0.9.59`. No live memory or host workflow was executed. Writers and reviewer used the harness-writing procedure and eligible official skill guidance captures dated 2026-09-27 and 2026-10-05, reread on 2026-10-11.

The patch is uncommitted and unmerged. The earlier wording release 0.9.58 merged in [PR #70](https://github.com/Mar5929/toolkit-v2/pull/70), verified as `97ed96a1d403b103dd92328e7cd21c3bea2a6629` on origin/main.

## Remaining policy review

Mike approved Q-14 on 2026-10-11: “Use supported recovery and judgment (Recommended)”. The same 0.9.59 draft now replaces GitHub/Notion fixed retry rules with supported recovery, checks uncertain writes before retrying, and continues useful recovery while progress is possible. The [recovery review](tkv-64-retry-policy-review-independent.md) covers that separate change. Q-15 asks about helper and coordinated-session model defaults.

Q-15 is resolved: project model preference, then task judgment. Q-16 retains the exact handoff warning specifically for handoff prompts. Q-17 retains the soft Hindsight startup briefing target, with completeness taking priority. The [policy-defaults review](tkv-64-policy-defaults-review.md) records the full pass and delivery status.
