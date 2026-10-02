# Local project memory

Keep future sessions oriented without turning every conversation into lasting memory. This folder is the project's local memory store. The whole project folder is the Obsidian vault, so memory notes can link work items. Active topics stay flat; filenames and YAML types agree. Git ignores this folder, so it exists only in the main checkout on this computer.

## Read and route

- Read `CURRENT_STATE.md` at startup; the session-start hook prints it. Read `MEMORY.md` as a short index, then open relevant topics and read each one whole. Check dates, scope, and the current source before acting on a remembered claim. Name the memory file where you use a remembered claim, and list it in the reply's short Sources list (`.claude/rules/cite-recalled-knowledge.md`).
- Read `memory-criteria.md` before selecting or changing memory. It holds the default eligibility rules; the `local-memory-save` skill holds the approval policy for onboarding and trusted mode, and the project's mode is the "Memory approval" line in `PROJECT.md`, "Toolkit settings". Use the terminology glossary for project language, including distinct meanings across systems.
- Link related memory notes with relative Markdown links, such as `[account model](project_account_model.md)`.
- Link a note to its work items in its `work_items` property. A memory always stores each item's ID, plus a link when the item has one: an Obsidian link to the item's ID file, such as `[[WI-031]]`, when work items are local, or the ID and the item's web address (its Notion page, GitHub issue, or Jira ticket) when they live there. Write each entry in double quotes, ID first, written exactly as the tracker shows it, such as `"WI-31 https://www.notion.so/<page>"` or `"#12 https://github.com/<owner>/<repo>/issues/12"`; an unquoted `#12` is read as a YAML comment and lost.
- For a local work item, the `work_items` entry uses `[[WI-031]]`, because Obsidian reads links in properties only in that form. A local work item link in a note's text uses the same form, because the item's file keeps its ID name when its folder moves; other links in a note's text use Markdown format, as the Obsidian setting in `README.md` asks.
- Obsidian shows backlinks to a note from the notes that link to it, so each work item lists its memories in its backlinks panel; a second reverse link is optional.
- Link only when the relationship helps retrieval, and check that the target exists.
- Name other records outside `memory/` by path or web address, as source references.
- Keep one line per active work item and the owner-mentioned to-dos in `CURRENT_STATE.md`, naming work items by ID. Where an item stands, its next action, and what it waits on stay in the item's own Current state.
- Keep full tasks, status, requirements, history, decisions (in the item's Questions and Answers), the item's sources (in its `references/` folder, or attached to the item in Notion, GitHub, or Jira; a Salesforce client file stays in `delivery/` and the item's Sources list names its path), and the work item's design together in the chosen tracker.
- Keep verified system behavior in the System Guide; the owner's instructions for how the agent works in `.claude/rules/owner-preferences.md` (`local-memory-save` writes it); procedures in skills; and raw outside sources in their source folders.

## Curate

- Keep one topic file per concept or area, such as `user_profile.md` or `project_billing.md`, with a `##` heading for each sub-topic and a last `## Gotchas and lessons` section for lessons not yet proven.
- Allowed prefixes and matching `metadata.type` values are `user`, `project`, `reference`, `event`, and `decision`; an `event` file holds one episode, and a `decision` file holds one decision.
- The `feedback` prefix is retired: an older `feedback_` file is moved to the rules and concepts with `local-memory-refine`.
- `project_topic_template.md` and `decision_template.md` are seeds, not saved memories.
- Each file starts with its title, a one-line summary (`description`), and the date of its last change (`updated`). Aim for a quick read; split a topic that grows too large.
- Record source and date, status, scope, the durable point, why it matters, and how to apply it. Keep uncertainty explicit. Preserve extra YAML fields written by a host or imported record.
- Save every decision made while working an item in its Questions and Answers first (`managing-work-items` writes it); a decision made with no work item goes where the "Where information goes" table in the root `AGENTS.md` says. A project-wide one also gets a `decision_<short-name>.md` record copied from `decision_template.md`, linking back with the Q-ID, such as `[[WI-031]] Q-04`; `memory-criteria.md`, "Decisions", has the test. The full reasoning stays in the work item.
- Search for the topic a new fact belongs to before creating one (`local-memory-find`), and add the fact under a heading there (`local-memory-save`). Create a new file only for a new concept. Correct, merge, or supersede in place where possible. Mark an obsolete claim in the file's text, its `status`, and its `description`, so the generated index does not show it as current; do not leave an archived item reading as currently open.
- When renaming, merging, archiving, or deleting a topic, inspect links from other memory notes and repair any affected links in the same change (`local-memory-refine`). Do not leave a link pointing at a former active location.
- `MEMORY.md` is a generated file: the session-start hook rebuilds it from each memory file's title (its `# ` heading), `description`, and `updated` date, grouped by prefix. Never edit it by hand; a change to a memory file shows in the index at the next session start. The index holds one short line per active memory file, not the content itself, so keep each `description` to one short line.
- Keep `CURRENT_STATE.md` within its line limits: Now 5, Waiting on the owner 5, Untracked to-dos 7, Next session starts with 3, and the whole file under 40 lines.
- `local-memory-save` keeps it current by replacing stale lines, not appending.
- Remove a line the moment it stops being true: `managing-work-items` removes the item's line, `local-memory-save` removes a waiting line when the owner answers it, and `handoff` rewrites "Next session starts with"; `local-memory-refine` prunes the rest.
- Do not remove an unresolved owner to-do solely to meet a limit; offer the owner a work item for it instead.
- Keep the glossary broad through sourced real terms, aliases, and system-specific meanings, and write it with `local-memory-save`. Do not invent definitions.

## Authority and completion

- Save through the `local-memory-save` skill, which holds the approval policy for onboarding and trusted mode. An explicit request to remember or correct is authorization for that specific change.
- Ask before ambiguous, bulk, or irreversible deletion of unique content. Only the owner can change the mode.
- A rejected candidate is not saved to another memory, a criteria example, the glossary, or a pending queue. Record only the general selection lesson, as a rule in `.claude/rules/owner-preferences.md`, if the owner gave one.
- The main agent changes this folder only through the local memory skills: `local-memory-save` saves and corrects, and `local-memory-refine` merges, retires, and prunes; `local-memory-find` searches it. `managing-work-items` and `handoff` also edit `CURRENT_STATE.md` as above. Read a file again right before changing it, so a newer edit is not overwritten. Never run parallel writers against the same file.
- Read back each changed file before reporting success. Memory work does not edit requirements, work-item status, designs, deployments, or source code.
