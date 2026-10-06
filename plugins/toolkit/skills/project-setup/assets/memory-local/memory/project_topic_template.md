---
name: topic-template
description: The fact itself in a few words, with its dates
created: <YYYY-MM-DD the file was made>
updated: <YYYY-MM-DD of the last change>
check_by: <YYYY-MM-DD to check or remove it, or none>
metadata:
  type: project
status: template
source: <Person, conversation, or document with absolute date>
last_verified: <YYYY-MM-DD or unknown>
authorization: <"Approved by <owner> on YYYY-MM-DD", "Trusted grant, YYYY-MM-DD", "Logged by the agent on YYYY-MM-DD", or "Proposed by the agent on YYYY-MM-DD; not approved">
work_items:
  - "<Link to each related work item; see the fill-in guide>"
supersedes: none
---

# <Topic title>

<!-- Fill-in guide: one topic file holds one concept or area, such as user_team_availability.md or project_client_plans.md; an event_ file holds one thing that happened, or one recurring job with a row per run. Copy this file to a typed filename such as project_<topic>.md. Set name to that filename stem, description to a few words that state the fact itself with its dates (the filename stem and the description together hold at most 70 characters), created and updated to today, check_by to the date a fact that is true only for a while must be checked or removed (or none), metadata.type to the matching prefix, status to the real lifecycle state, and replace every angle-bracket prompt in front matter and body with sourced content. Set work_items to one entry per related work item: an Obsidian link to the item's ID file, such as `"[[WI-031]]"`, when work items are local, or the item's ID and web address (the Notion page or GitHub issue) when they live there; then name the item's ID under Authoritative records. For a local work item, the list entry uses `[[WI-031]]`, because Obsidian reads links in properties only in that form; a local work item link in the note's text uses the same form, because the item's file keeps its ID name when its folder moves, and other links in the note's text use Markdown format. Write each entry in double quotes, ID first, such as `"WI-31 https://www.notion.so/<page>"` or `"#12 https://github.com/<owner>/<repo>/issues/12"`; an unquoted `#12` is read as a YAML comment and lost. Use `work_items: []` when no work item applies. These links let each work item list its memories in Obsidian's backlinks panel. Examples sit in backticks so Obsidian does not count them as links; write real links without backticks. Give each sub-topic its own ## heading with the labels below; a new fact about this concept gets a new ## section here, not a new file. Put the durable point after Remember, its value after Why, future use after How to apply, and source/uncertainty after Evidence and limits. Keep "Gotchas and lessons" as the last section: each lesson the agent learned and has not proven is a ### heading with a Seen line giving the date of each session or work item it came up in. Memory never holds a decision more than one work item needs (DECISIONS.md), a project term (system/glossary.md), or how the system works (system/ or reference/current-system/); an instruction for how the agent works is a line in .claude/rules/owner-preferences.md. Remove this guide and the final template comment before saving. -->

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
