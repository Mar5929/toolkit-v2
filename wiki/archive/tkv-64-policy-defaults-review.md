# TKV-64 policy defaults review

Version 0.9.59 implements the remaining policy changes approved on 2026-10-11. The draft is independently reviewed and ready for delivery; it is uncommitted and unmerged.

## Owner decisions

| Question | Approved policy | Shipped guidance affected |
| --- | --- | --- |
| Q-13: memory review timing | Choose dates from usefulness, likelihood of change and evidence. Verify before consequential use; ask when unresolved uncertainty blocks work. | Four local-memory references: saving, tidying, retrieval and the general process. |
| Q-14: retries | Follow supported recovery and backoff, check uncertain writes before repeating them, and continue while useful progress is possible. | GitHub work-tracker and Notion CLI command references. |
| Q-15: models | Honor project model preferences, then choose a suitable available model for the task. | Work-item helpers, handoff verification and coordinated sessions in both hosts. |
| Q-16: handoff warning | Keep the exact warning specifically for handoff prompts. | Existing first line, template, verifier and example remain unchanged. |
| Q-17: startup briefing | Keep the soft 3,000-character Hindsight target, with completeness taking priority. | Existing mission and full-output recovery remain unchanged. |

Actual expiry, provenance, verification dates, uncertain labels, independent helpers, complete briefs, cleanup approvals, technical formats and the deliberate three-level work-item hierarchy remain intact. These changes affect toolkit guidance; installed projects and live service configuration are unchanged.

## Review and validation

- [Memory review](tkv-64-memory-aging-review.md) and [independent replay](tkv-64-memory-aging-review-independent.md): one stale retrieval cross-reference was corrected and reread; no blocker remains.
- [Retry review](tkv-64-retry-policy-review-independent.md): corrected requests, uncertain creations, conflicts, repeated failures, rate waits and access blockers passed paper replay. Current [Notion status-code guidance](https://developers.notion.com/reference/status-codes) and [GitHub API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) were checked on 2026-10-11.
- [Model review](tkv-64-model-policy-review-independent.md): project preference, unavailable choices, inherited settings and independent helper boundaries passed paper replay.

Both Claude package validations, whitespace checks and scratch Codex 0.9.59 installation passed on the final procedure snapshot. Installation: `/private/tmp/tkv59-models.incdtR/plugins/cache/toolkit-v2/toolkit/0.9.59`. Official skill/subagent guidance captures dated 2026-09-27 and 2026-10-05 were reread under the harness-writing procedure. Reviews simulate instruction use; they do not establish live service recovery or full host workflow behavior.

No identified policy question remains open in this pass. Next: deliver the checked 0.9.59 patch. This does not by itself close the broader TKV-64 work item.
