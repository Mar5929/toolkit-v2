# Update a system document (Notion memory)

Approved facts about the system (rules, terms, integrations, diagrams) live in the Notion Project Wiki: product documentation in Product Wiki, terms in Terminology Glossary. The agent captures each change in Wiki Inbox through `managing-project-memory`, and the librarian files it.

A capture that has been read back counts as saved. The work item records the capture link, and that link stays valid after the librarian files the capture.

## A rule, term, integration, or diagram that changes

1. Search the wiki and pending captures for the subject through `managing-project-memory`, and read the record that covers it, with its status, dates, and replacement links.
2. Capture the change in Wiki Inbox with what changes, its source, the approval evidence, and the affected work items. A working design stays in its work item until the owner approves it.
3. Read the capture back. The save is then confirmed: return the capture link to the skill that asked.

## A rule a closing item built

When `closing.md` sends a rule whose behavior the item built or changed, capture the implementation evidence: the rule's Product Wiki record, the item's ID, the commit on the default branch, the deployment if there was one, the owner's approval of the result, and the checker's verdict on the requirement that built the rule. The librarian sets Implementation status to Live from that evidence. When the evidence is incomplete, capture nothing and say what is missing. Then read the capture back and return its link as above.
