---
name: topic-template
description: The fact itself in a few words, with its dates
created: <YYYY-MM-DD the file was made>
updated: <YYYY-MM-DD of the last change>
check_by: <YYYY-MM-DD to check or remove it, or none>
metadata:
  type: project
status: template
modified_by: <Actual last editor, such as the owner or the agent host>
provenance:
  - "<Supporting conversation, document, or work item, with date and link or ID>"
tags:
  - "<Subject that helps retrieval>"
context: <Why this memory matters to the project>
source:
  - <stated, summarized, or inferred>
last_verified: <YYYY-MM-DD or unknown>
authorization: <"Approved by <owner> on YYYY-MM-DD" or "Logged by the agent on YYYY-MM-DD">
work_items:
  - "<Link to each related work item; see record-format.md>"
supersedes: none
superseded_by: none
---

# <Topic title>

<!-- Fill and maintain this copy with .claude/skills/managing-project-memory/references/record-format.md; remove template comments before saving. -->

## <Sub-topic>

**Remember:** <One durable point or closely related set of facts. State scope and date where needed. For an event: the date, who took part, what happened, and the result.>

**Why:** <Why losing this context would change future work or cost meaningful effort.>

**How to apply:** <What the future agent should check or do with this context.>

**Evidence and limits:** <Exact source link or citation; uncertainty and freshness check. For a claim nobody checked: "Not checked.", who said it, and what would check it.>

**Related memories:** <Link to existing notes in this folder when the relationship helps retrieval. Use relative Markdown links such as `[related topic](project_related_topic.md)`; Obsidian will show the backlink on the linked note. Do not invent a note just to make a link.>

**Authoritative records:** <The path, ID, or link of a record outside the memory folder (a DEC, an SRC, a work item's ID, a project task's ID, a file), when relevant. For an event: where its output is.>

## Gotchas and lessons

None yet.

<!-- Rename the copied file to <type>_<topic>.md and set metadata.type to the same prefix. Allowed types: user, project, reference, event. Remove this comment and replace status: template before saving. -->
