# Saving to Notion memory: the steps

The approval policy is in `SKILL.md`, "Approval".

## Contents

- Before a save
- Adding to an existing concept
- A new concept record
- A lesson
- A project-wide decision
- Correcting or replacing a record
- "Forget that" and retiring
- Proposals: a save the owner has not answered
- The owner's instructions: owner-preferences
- Linking a record to work items
- The glossary

## Before a save

1. Read the ids from `PROJECT.md` "Toolkit settings": Memories data source, the Lore project row, Current state page, and Work Items data source (when work is in Notion).
2. Look for the concept first; a new fact joins its concept:

   ```bash
   ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"or":[
     {"property":"Record Key","rich_text":{"contains":"<word>"}},
     {"property":"Title","title":{"contains":"<word>"}},
     {"property":"Synopsis","rich_text":{"contains":"<word>"}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Record Key"].rich_text[0].plain_text // "")\t\(.properties.Synopsis.rich_text[0].plain_text // "")"'
   ```

## Adding to an existing concept

1. Read its page text (`ntn api v1/pages/<id>/markdown < /dev/null | jq -r .markdown`).
2. Add a `## <Sub-topic>` section before `## Gotchas and lessons` (labels from `assets/concept-record.md`), or change a section in place, with one `update_content` call (`ntn-basics.md`):

   ```json
   {"type":"update_content","update_content":{"content_updates":[
     {"old_str":"## Gotchas and lessons","new_str":"## Export format\n**Remember:** …\n## Gotchas and lessons"}]}}
   ```
3. Set Saved to today, Authorization to what allowed it ("Approved by <owner> on <date>", or "Trusted grant, <date>"), and change Synopsis when the concept now covers more.

## A new concept record

```bash
ntn api v1/pages -d @record.json < /dev/null | jq -r '.id, .url'
```

`record.json`: `parent` the Memories data source; properties per `record-mapping.md` (Kind "note", Tags the prefix, Status "accepted", Source "manual", and the rest); and `"markdown"` the body from `assets/concept-record.md` with every prompt filled. The key is `<prefix>_<slug>`: lower-case words joined by underscores, naming the concept (`project_deploys`), at most 60 characters. Check no record has that key first.

## A lesson

Under the concept it is about, in `## Gotchas and lessons`, as a `### <lesson>` heading with a `**Seen:**` line: the date, and the session or work item, of each time it came up. The first lesson replaces "None yet."; the same lesson again adds a date to its Seen line, never a second heading.

## A project-wide decision

Only after his yes to "This looks project-wide. Save it to memory too?". The item's own Questions and Answers row already holds it.

- Key `decision_<slug>`, Kind "decision", Tags "decision", Decided At the date, and the body from `assets/decision-record.md`: the decision in one sentence, how to apply it, and its first "Where it was decided" line ("Decided in IML-3, Q-04, on … by …" with his words). No copy of the full reasoning. Remove the "With no work item" line.
- Link it to the item (below).
- Made with no work item (after his yes): leave Work item IDs empty and set no Work items relation; keep the "With no work item" line and remove the first "Where it was decided" line.
- His no: save nothing and do not offer it again. No answer: make no proposal record. Add one line under "Waiting on the owner" on the Current state page ("Save to memory? Decision IML-3 Q-04: <one line>") and remove it when he answers.

## Correcting or replacing a record

- A corrected fact replaces the old text in its section, with the new source and date; the old wording does not stay beside it.
- A record replaced by another: set the old one's Status "superseded" and "Superseded by" to the new key; set the new one's "Supersedes" relation to the old page.
- A wrong prefix: make the record under the right key, then supersede the old one.

## "Forget that" and retiring

The agent never deletes a record.

- "Forget that" right after a save you reported undoes it: remove the section you added, put back the old wording of a section you changed, or set a record you made to Status "deprecated".
- About one older section: remove it, and quote the removed text in your reply so he can say "undo that".
- About a whole record: retire it. Status "deprecated", and a last section `## Retired` with the date and his words as the reason. "Bring it back": Status "accepted", and remove the `## Retired` section.
- He wants a record deleted: tell him which one, with its link, and that he deletes it in Notion himself. Never say it is deleted when it is not.
- A secret or an email address found in memory: remove that text at once, and tell him.

## Proposals: a save the owner has not answered

A question you asked ("Save to memory: <one line>?") that his next reply does not answer is kept as a proposal. A project-wide decision and an inferred rule are never kept as a proposal record: each gets only its line under "Waiting on the owner".

1. Save it where it would live, marked: a new record with Status "proposed", Authorization "Proposed by the agent on <date>; not approved", and a Synopsis that starts "Proposal, not approved yet:"; or, for an existing record, a new section whose first line is `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.`
2. Add one line under "Waiting on the owner" on the Current state page: `Save to memory? <one line> (proposal in <record title>, asked <date>)`.
3. His yes: remove the marks, set Status "accepted" and Authorization "Approved by <owner> on <date>", and remove the Current state line.
4. His no: remove the section, or set the proposal record to Status "deprecated", and remove the Current state line. Save the rejected fact nowhere else. A general rule he gives about what to keep goes to `.claude/rules/owner-preferences.md`, under "Memory".

To find open proposals:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Status","select":{"equals":"proposed"}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Record Key"].rich_text[0].plain_text // "")"'
```

## The owner's instructions: owner-preferences

An instruction for how the agent works, a preference, or a correction of it is a rule, never memory. His own words are the approval. The file is in Git, not in Notion.

1. Read `.claude/rules/owner-preferences.md` fresh. A bullet already says it: add nothing, and say so. A bullet says the opposite: replace it with his new words and name the old line in the reply. Otherwise add one bullet in his words under the `## ` area it is about (Replies, Questions, Testing, Git, Work items, Memory, or General), ending with `(<YYYY-MM-DD>, <owner name>, in chat)`. One instruction per bullet. A change or removal he asks for changes or removes that bullet.
2. When his words say every project: add the bullet to `~/.claude/rules/owner-preferences.md` for Claude Code and to `~/.codex/AGENTS.md` for Codex instead. Ask "This project or all projects?" only when his words leave it unclear.
3. An instruction you inferred: ask first: "Add to the project rules: <one line>?". Unanswered: one line under "Waiting on the owner" on the Current state page.
4. Reply: "Added to the project rules (<area>): <instruction>."

## Linking a record to work items

- Always: "Work item IDs" text, for example `IML-3, IML-5` (with each item's link when its work items are not in this workspace).
- When work items are in Notion too: the "Work items" relation, the whole list of page ids (read the current list first; sending replaces it):

  ```bash
  ntn api v1/pages/<record-page-id> -X PATCH -d '{"properties":{"Work items":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null
  ```

  Find an item's page id with the notion-work-track skill, or:
  `ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"property":"ID","unique_id":{"equals":3}}}' < /dev/null | jq -r '.results[0].id'`.
- The item's page now shows the record under "Linked memory"; its "Memories" property lists it.

## The glossary

A term whose meaning matters gets one row in the Terminology glossary page's table: insert a `<tr>` after the header row with `update_content` (Term, System or context, Meaning here, Distinction or alias, Source, Status / last checked). His own definition is the approval. A term you inferred: ask first.
