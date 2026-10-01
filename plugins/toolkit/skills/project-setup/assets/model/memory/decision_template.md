---
name: decision-template
description: The decision in one short line
updated: <YYYY-MM-DD of the last change>
metadata:
  type: decision
status: template
decided_on: <YYYY-MM-DD of the owner's answer>
decided_by: <Person who made the decision>
work_items:
  - "<Link to the work item where it was decided; see the fill-in guide>"
supersedes: none
---

# <Decision title>

<!-- Fill-in guide: a decision_ file holds one decision that matters beyond its work item. The test: "Will a later work item, or an agent working on something else, need to follow this?" Project-wide and architectural decisions pass; choices that affect only the item do not. Save the decision in the work item's Questions and Answers first, with the owner's words and the date; this record adds it to memory and does not copy the full reasoning. Copy this file to decision_<short-name>.md. Set name to that filename stem, description to a one-line summary of the decision, updated to the date of the last change, status to current, decided_on to the date of the owner's answer, decided_by to the person who decided, and supersedes to the decision_ file this one replaces, or none. Set work_items to one entry per related work item: an Obsidian link to the item's ID file, such as `"[[WI-031]]"`, when work items are local, or the item's ID and web address (the Notion page, GitHub issue, or Jira ticket) when they live there. For a local work item, the list entry uses `[[WI-031]]`, because Obsidian reads links in properties only in that form; a local work item link in the note's text uses the same form, because the item's file keeps its ID name when its folder moves, and other links in the note's text use Markdown format. Write each entry in double quotes, ID first, such as `"WI-31 https://www.notion.so/<page>"` or `"#12 https://github.com/<owner>/<repo>/issues/12"`; an unquoted `#12` is read as a YAML comment and lost. A project-wide decision made with no work item is saved straight to this record, after the owner's yes: set `work_items: []`, and write the conversation and its date under "Where it was decided", such as `conversation, 2026-09-30`, adding the Current State line it concerns when there is one. A decision about something that is not yet a work item goes first to a new work item at stage 01-discovery, as its first Questions and Answers row. When a later decision replaces this one, set this record's status to superseded; when the owner withdraws it, set status to withdrawn. Examples sit in backticks so Obsidian does not count them as links; write real links without backticks. Replace every angle-bracket prompt with sourced content, and remove this guide and the final template comment before saving. -->

**Decision:** <The decision in one sentence.>

**How to apply:** <What a later work item or another agent must do or check because of this decision.>

**Where it was decided:** <The work item and the Q-ID of its Questions and Answers row, such as `[[WI-031]] Q-04`; for a work item in Notion, GitHub, or Jira, its ID, the Q-ID, and its web address; with no work item, the conversation and its date.>

<!-- Allowed status values: current, superseded, withdrawn. Remove this comment and replace status: template with current before saving. -->
