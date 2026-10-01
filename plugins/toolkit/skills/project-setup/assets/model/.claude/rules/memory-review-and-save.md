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

This section applies when the "Memory" line in `PROJECT.md`, "Toolkit settings", is `hindsight`. Such a project has no memory skills.

- Where the rules or `AGENTS.md` name the memory save skill for a fact, a lesson, a term, or a project-wide decision, use `retain`.
- Where they name the memory find skill, use `recall`.
- Current State and `.claude/rules/owner-preferences.md` are files: edit them directly.
- Use Hindsight's own tools on the project's bank (the Hindsight bank in `PROJECT.md`, "Toolkit settings"): `retain` to save, `recall` to search, and `reflect` for an answer drawn from many memories.
- Before every `retain`, check that the memory concerns this project, has a credible source, would matter in a future session, would be costly to reconstruct, and has no better home (a work item, a rule, requirements, or the system guide). These are the memory criteria in a Hindsight project.
- Never retain secrets, credentials, personal data, transcripts, raw logs, live status, pending approvals, or a rejected candidate.
- A project-wide decision passes these memory criteria even though its work item holds it first. After the owner's yes, `retain` the decision in one sentence, how to apply it, and the work item ID with the Q-ID of its Questions and Answers row (for example "WI-031 Q-04"), plus the item's web link when it has one (its Notion page, GitHub issue, or Jira ticket), tagged `wi:<ID>`.
- For a decision with no work item, name the conversation and its date instead, and add no `wi:` tag.
- A Hindsight project has no trusted mode, so no "Memory approval" line applies.
- Save only on the owner's own keep words ("remember", "keep this") or his yes to a save question ("Save to memory: <one-line summary>?", or, for a decision, "This looks project-wide. Save it to memory too?").
- An instruction for how the agent works ("from now on", "always", "never") goes to `.claude/rules/owner-preferences.md`, never to `retain`.
- Tag each memory `wi:<ID>` for every work item it is about, and write each item's ID, and its web link when it has one, in the memory text.
- To find one item's memories, `recall` with that tag and `tags_match: "any_strict"`; the default also returns untagged memories.
- What `recall` and `reflect` return is project memory: cite it as `.claude/rules/cite-recalled-knowledge.md` says.
- For "forget that", never delete a memory yourself; setup hides Hindsight's delete tools.
- Tell the owner which memory you would remove, and ask him to remove it in Hindsight's own interface or, on his yes, `retain` a correction that supersedes it.
- Never say a memory is deleted when it is not.
- Current State is the local file `memory/CURRENT_STATE.md`, kept out of Hindsight: never `retain` it.
- There is no memory refine skill, so prune Current State yourself: remove stale lines at each handoff and whenever the session-start hook says the file is too long or too old.
- Keep Current State within its line limits: Now 5, Waiting on the owner 5, Untracked to-dos 7, Next session starts with 3, and under 40 lines in all.
<!-- endif -->
