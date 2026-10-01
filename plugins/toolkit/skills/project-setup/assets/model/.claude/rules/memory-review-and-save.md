# Review and Save Project Memory

This rule applies to the main agent. The project's one memory store is the system named under "Memory" in `PROJECT.md`, "Toolkit settings"; with local memory it is the `memory/` folder. Claude's native auto-memory and the `claude-toolkit` Second Brain plugin are off in this project. The session-start hook shows Current State in Claude Code and Codex.

In the rules and `AGENTS.md`, "the memory save skill" means `local-memory-save` or `notion-memory-save`, whichever the project has; the memory find and memory refine skills follow the same pattern.

## When to review memory

- Review memory after an explicit remember or forget request, a correction, a standing preference, a meaningful decision or discovery, a significant fix or episode, a change of people, tools, or references, a focus shift, a finished work item, and a handoff.
- A hook reminder is not a save decision. The prompt hook flags keep and decision phrases, such as "remember", "from now on", and "we decided". Do not save on every hook reminder or every turn. A review can end with nothing saved.

## Where it goes

- Decide the home first, with the memory criteria (local memory: `memory/memory-criteria.md`; Notion memory: `notion-memory-save` and its references, which say which record each kind of memory goes to) and the "Where information goes" table in `AGENTS.md`.
- Every decision made while working an item is saved in its Questions and Answers first (`keep-work-item-current.md`); a project-wide decision also gets a memory record: the decision in one sentence, how to apply it, and a link back to the work item naming the Q-ID. In local memory that record is a `decision_<short-name>.md` file.
- A decision made with no work item goes where the "Where information goes" table in `AGENTS.md` says.
- The owner's instructions for how the agent works go to `.claude/rules/owner-preferences.md`, never to memory.
- A small memory pointer may route future sessions to a hard-to-find record, without copying its body.

## How to save

- Save and correct memory, and act on "forget that", only through the memory save skill, which holds the approval policy.
- Merge, retire, and prune stale memory only through the memory refine skill.
- The approval mode (onboarding or trusted) is the "Memory approval" line in `PROJECT.md`, "Toolkit settings"; when that line is missing or still shows its prompt, use the memory save skill's default. Only an explicit owner instruction changes it.
- When the owner changes the mode, change that line with the `project-setup` skill; never record the mode in `.claude/rules/owner-preferences.md`.
- A yes approves only the operation and meaning shown. Silence approves nothing.
- An unanswered save question stays a proposal: do not rely on it.
- Add one line for an unanswered save question to Current State under "Waiting on the owner". Remove it when he approves or rejects the save.
- If the owner says a proposed item should not be memory, withdraw it. When his feedback gives a general selection rule, write it to `.claude/rules/owner-preferences.md` and check later candidates against it. Do not restate the rejected fact in Current State or another topic.
- A change to Current State only, or glossary maintenance the owner already authorized, is saved without a lasting-memory question.
- Remove a line from Current State the moment it stops being true. The memory refine skill prunes the rest.
- Group several independent signals into one save. Never run two writes to the same memory record at once.
- Before you say a save worked, read it back from where it was saved. Then tell the owner briefly what was kept or what needs his decision.
<!-- if memory=hindsight -->

## Hindsight projects

This section applies when the "Memory" line in `PROJECT.md`, "Toolkit settings", is `hindsight`. Such a project has no memory skills. Its memory is the bank on the "Hindsight bank" line of `PROJECT.md`, on the owner's Hindsight server.

- Hindsight's coding-agent add-on saves each session into the bank by itself, at the end of every turn. Never save a session, a transcript, or a log yourself.
- The add-on's tools: `hindsight_ingest_document` saves a document, `hindsight_search_knowledge_pages` and `hindsight_read_knowledge_page` search and read the bank's knowledge pages, and `hindsight_reflect` answers from all of the bank's memory.
- Where the rules, `AGENTS.md`, or a skill name the memory save skill or Hindsight's `retain` tool, use `hindsight_ingest_document`.
- Where they name the memory find skill or Hindsight's `recall` tool, use `hindsight_search_knowledge_pages`, then `hindsight_reflect` when the pages do not answer.
- Where the add-on's own guidance differs from this section, follow this section.
- Current State and `.claude/rules/owner-preferences.md` are files: edit them directly.
- Before every save, check that the memory concerns this project, has a credible source, would matter in a future session, would be costly to reconstruct, and has no better home (a work item, a rule, requirements, or the system guide). These are the memory criteria in a Hindsight project.
- Never save secrets, credentials, personal data, raw logs, live status, pending approvals, or a rejected candidate.
- A project-wide decision passes these memory criteria even though its work item holds it first. After the owner's yes, save the decision in one sentence, how to apply it, and the work item ID with the Q-ID of its Questions and Answers row (for example "WI-031 Q-04"), plus the item's web link when it has one (its Notion page, GitHub issue, or Jira ticket).
- For a decision with no work item, name the conversation and its date instead.
- A Hindsight project has no trusted mode, so no "Memory approval" line applies.
- Save each project-wide decision, lesson, and fact with `hindsight_ingest_document` or `hindsight_capture_initiative` only on the owner's own keep words ("remember", "keep this") or his yes to a save question ("Save to memory: <one-line summary>?", or, for a decision, "This looks project-wide. Save it to memory too?"). The add-on's session save holds the conversation, not a checked record.
- An instruction for how the agent works ("from now on", "always", "never") goes to `.claude/rules/owner-preferences.md`, never to Hindsight.
- Start the title of each saved document with the ID of every work item it is about (for example "WI-031: ..."), and write each item's web link, when it has one, in the text. The title is the document's ID: a title already used replaces that document, so make each title unique (work item ID, Q-ID, or topic). To find one item's memories, ask `hindsight_reflect` about its ID.
- What the add-on's tools return is project memory: cite it as `.claude/rules/cite-recalled-knowledge.md` says, in place of the add-on's own credit line.
- For "forget that", never delete a memory yourself; the add-on has no delete tool.
- Tell the owner which memory you would remove, and ask him to remove it on the bank's page in the Hindsight dashboard or, on his yes, save a document titled "Correction: <topic>" that says what memory claimed, what is true, and the evidence.
- Never say a memory is deleted when it is not.
- To open the bank in the Hindsight dashboard, `open` the link on the "Hindsight dashboard" line of `PROJECT.md` (for another project, the line in that project's `PROJECT.md`); the owner signs in himself with the dashboard's own access key.
- List the Hindsight project folders with `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`. Never print `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy: they hold the API key.
- Current State is the local file `memory/CURRENT_STATE.md`, kept out of Hindsight: never save it there.
- There is no memory refine skill, so prune Current State yourself: remove stale lines at each handoff and whenever the session-start hook says the file is too long or too old.
- Keep Current State within its line limits: Now 5, Waiting on the owner 5, Untracked to-dos 7, Next session starts with 3, and under 40 lines in all.
<!-- endif -->
