---
name: topic-template
description: What future sessions would look here to remember
updated: <YYYY-MM-DD of the last change>
metadata:
  type: project
status: template
source: <Person, conversation, or document with absolute date>
last_verified: <YYYY-MM-DD or unknown>
authorization: <Approved card or explicit request, or trusted grant>
supersedes: none
---

# <Topic title>

<!-- Fill-in guide: one topic file holds one concept or area, such as user_profile.md or project_billing.md; an event_ file holds one episode. Copy this file to a typed filename such as project_<topic>.md. Set name to that filename stem, description to a one-line summary of the whole topic, updated to the date of the last change, metadata.type to the matching prefix, status to the real lifecycle state, and replace every angle-bracket prompt in front matter and body with sourced content. Give each sub-topic its own ## heading with the labels below; a new fact about this concept gets a new ## section here, not a new file. Put the durable point after Remember, its value after Why, future use after How to apply, and source/uncertainty after Evidence and limits. Keep "Gotchas and lessons" as the last section: each lesson the agent learned and has not proven is a ### heading with a Seen line giving the date of each session it came up in. An instruction for how the agent works is a rule in .claude/rules/owner-preferences.md, not memory. Remove this guide and the final template comment before saving. -->

## <Sub-topic>

**Remember:** <One durable point or closely related set of facts. State scope and date where needed.>

**Why:** <Why losing this context would change future work or cost meaningful effort.>

**How to apply:** <What the future agent should check or do with this context.>

**Evidence and limits:** <Exact source link or citation; uncertainty and freshness check.>

**Related memories:** <Link to existing notes in this vault when the relationship helps retrieval. Use relative Markdown links such as `[related topic](project_related_topic.md)`; Obsidian will show the backlink on the linked note. Do not invent a note just to make a link.>

**Authoritative records:** <Link or path to the requirement, design, work item, or other source outside this vault, when relevant.>

## Gotchas and lessons

None yet.

<!-- Rename the copied file to <type>_<topic>.md and set metadata.type to the same prefix. Allowed types: user, project, reference, event. Remove this comment and replace status: template before saving. -->
