# Local project memory

Keep future sessions oriented without turning every conversation into lasting memory. This folder is the project's built-in memory store and can be opened directly as an Obsidian vault. Active topics stay flat; filenames and YAML types agree. Git ignores this folder, so back it up with `toolkit memory export --to <folder outside this project>`.

## Read and route

- Read `CURRENT_FOCUS.md` at startup; the session briefing includes it. Read `MEMORY.md` as a short index, then open relevant topics and read each one whole. Check dates, scope, and the current source before acting on a remembered claim.
- Read `memory-criteria.md` before selecting or changing memory. It holds the default eligibility rules; the `memory-save` skill holds the approval policy and the onboarding or trusted mode. Use the terminology glossary for project language, including distinct meanings across systems.
- Link related notes inside this vault with relative Markdown links, such as `[account model](project_account_model.md)`. Obsidian shows backlinks to a note from the notes that link to it; a second reverse link is optional. Link only when the relationship helps retrieval, and check that the target exists. Keep tracker URLs and paths outside `.memory/` as source references rather than vault links.
- Keep current tasks and owner-mentioned to-dos in `CURRENT_FOCUS.md`, naming work items by ID. Keep full tasks, status, requirements, history, and the work item's design together in the chosen tracker; verified system behavior in the System Guide; the owner's instructions for how the agent works in `.claude/rules/owner-preferences.md` (`toolkit rule add`); procedures in skills; and raw outside sources in their source folders.

## Curate

- Keep one topic file per concept or area, such as `user_profile.md` or `project_billing.md`, with a `##` heading for each sub-topic and a last `## Gotchas and lessons` section for lessons not yet proven. Allowed prefixes and matching `metadata.type` values are `user`, `project`, `reference`, and `event`; an `event` file holds one episode. The `feedback` prefix is retired: an older `feedback_` file is moved to the rules and concepts with `memory-tidy`. `project_topic_template.md` is a seed, not a saved memory. Each file starts with its title, a one-line summary (`description`), and the date of its last change (`updated`). Aim for a quick read; split a topic that grows too large.
- Record source and date, status, scope, the durable point, why it matters, and how to apply it. Keep uncertainty explicit. Preserve extra YAML fields written by a host or imported record.
- Search for the topic a new fact belongs to before creating one (`toolkit memory find`), and add the fact under a heading there (`toolkit memory save --concept <key> --section <heading>`). Create a new file only for a new concept. Correct, merge, or supersede in place where possible. Mark obsolete claims in both file text and index; do not leave an archived item reading as currently open.
- When renaming, merging, archiving, or deleting a topic, inspect links from other memory notes and repair any affected links, saving each repaired note with `toolkit memory save`. Do not leave a link pointing at a former active location.
- `toolkit memory save`, `retire`, and `restore` rebuild `MEMORY.md`; run `toolkit memory reindex` after any other topic change. The index holds one short line per active topic, grouped by prefix: its title, summary, and updated date, not the content itself. Keep it below the configured budget.
- Keep `CURRENT_FOCUS.md` under 50 lines by replacing stale sections, not appending, and write it with `toolkit memory focus --set-file`. Do not remove an unresolved owner to-do solely to meet that limit.
- Keep the glossary broad through sourced real terms, aliases, and system-specific meanings, and write it with `toolkit memory glossary --set-file`. Do not invent definitions.

## Authority and completion

- Save through the `memory-save` skill, which holds the approval policy for onboarding and trusted mode. An explicit request to remember or correct is authorization for that specific change.
- Ask before ambiguous, bulk, or irreversible deletion of unique content. Only the owner can change the mode.
- A rejected candidate is not saved to another memory, a criteria example, the glossary, or a pending queue. Record only the general selection lesson, as a rule with `toolkit rule add`, if the owner gave one.
- The main agent writes this folder only with `toolkit memory` commands, for example `save`, `retire`, `focus`, `glossary`, and `reindex` (`toolkit memory --help` lists them all). They lock the folder, refuse stale edits, and rebuild the index. Never run parallel writers against the same topic.
- Read back changes with `toolkit memory get` and run `toolkit doctor` before reporting success. Memory work does not edit requirements, work-item status, designs, deployments, or source code.
