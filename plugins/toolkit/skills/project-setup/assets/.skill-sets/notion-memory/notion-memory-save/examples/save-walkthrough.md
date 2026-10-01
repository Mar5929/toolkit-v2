# Example: a decision saved to Notion memory

A real run in the private Notion test area (2026-09-29), project "iOS money
log", work items and memory both in Notion.

While refining IML-1, the owner answered Q-01: "Amount, date, category.
Notes are optional." The work track skill saved it as Q-01 in IML-1. Every
later screen and import must follow it, so the agent asked "This looks
project-wide. Save it to memory too?" and the owner said "yes".

## The record

```bash
ntn api v1/pages -d @record.json < /dev/null | jq -r '.id, .url'
```

`record.json` (ids shortened):

```json
{"parent": {"type": "data_source_id", "data_source_id": "558b…"},
 "properties": {
   "Title": {"title": [{"text": {"content": "Required transaction fields"}}]},
   "Record Key": {"rich_text": [{"text": {"content": "decision_required_transaction_fields"}}]},
   "Keywords": {"rich_text": [{"text": {"content": "decision_required_transaction_fields"}}]},
   "Synopsis": {"rich_text": [{"text": {"content": "Every transaction has amount, date, and category; notes are optional."}}]},
   "Kind": {"select": {"name": "decision"}},
   "Tags": {"multi_select": [{"name": "decision"}]},
   "Status": {"select": {"name": "accepted"}},
   "Source": {"select": {"name": "manual"}},
   "Author": {"rich_text": [{"text": {"content": "Mike Rihm"}}]},
   "Agent": {"rich_text": [{"text": {"content": "Claude Code"}}]},
   "Project": {"relation": [{"id": "3ebb…2e88"}]},
   "Saved": {"date": {"start": "2026-09-29"}},
   "Decided At": {"date": {"start": "2026-09-29"}},
   "Source note": {"rich_text": [{"text": {"content": "Mike, 2026-09-29, IML-1 Q-01"}}]},
   "Authorization": {"rich_text": [{"text": {"content": "Approved by Mike on 2026-09-29"}}]},
   "Last verified": {"rich_text": [{"text": {"content": "2026-09-29"}}]},
   "Work item IDs": {"rich_text": [{"text": {"content": "IML-1"}}]},
   "Work items": {"relation": [{"id": "3ebb…4192"}]}},
 "markdown": "## Decision\nEvery transaction has an amount, a date, and a category; notes are optional.\n## How to apply it\nEvery screen, import, and report that makes a transaction requires the three fields and never requires notes.\n## Where it was decided\nDecided in IML-1, Q-01, on 2026-09-29, by Mike: \"Amount, date, category. Notes are optional.\" The full reasoning is in that work item.\n## Gotchas and lessons\nNone yet."}
```

## Read back

```bash
ntn api v1/pages/<IML-1-page-id> < /dev/null | jq -c '.properties.Memories.relation'
# [{"id":"3ebb…9226"}]   ← IML-1 now lists the decision; its page shows it under Linked memory
```
