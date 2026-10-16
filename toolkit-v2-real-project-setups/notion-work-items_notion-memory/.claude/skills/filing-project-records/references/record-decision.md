# Record a decision (Notion memory)

Shared decisions live in the Notion Project Wiki: product decisions in Product Wiki, other lasting decisions in Long-Term Memory. The agent captures each decision in Wiki Inbox through `managing-project-memory`, and the librarian files it.

A capture that has been read back counts as saved. The work item records the capture link, and that link stays valid after the librarian files the capture.

A sourced answer counts as a decision only when its speaker, their authority, the date, and an unambiguous decision are all verified. Keep the source passage or timestamp. Anything tentative stays an open question.

## A decision

1. Search the wiki and pending captures for the subject through `managing-project-memory`. If a record already says the same, link it and capture nothing.
2. Otherwise capture the decision in Wiki Inbox with its source, date, decider, approval evidence, and affected work items.
3. Read the capture back. The save is then confirmed: return the capture link to the skill that asked, which writes it into each work item that needs it.
4. A correction or withdrawal is captured the same way, naming the record it replaces.

## A shared open question

A question more than one work item needs stays in each affected work item, linked to the others, until it's decided. Have `managing-project-memory` add a Waiting on line to Current state naming the question, the affected items, and who must answer. When the question is decided, record the decision as above and remove the line.
