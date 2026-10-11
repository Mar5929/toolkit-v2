# Hindsight project memory

Keep this project's lasting memory in the Hindsight bank recorded in `PROJECT.md`, under "Toolkit settings". Use Hindsight's coding-agent add-on skill and tools to find, save, and correct it. Work items and project records keep their own facts; memory supplies context and lessons for later sessions.

## What qualifies as memory

- Save lasting project-specific facts, people, terminology, decisions, lessons, events, and constraints that are not already explained by another memory record, would cost a later agent real time or understanding to lose, and come from the owner or work done together with the owner.
- A significant failure the agent found and fixed itself may also be saved, with its cause and fix.
- Keep the authoritative project record where `AGENTS.md`, "Where information goes", places it. A qualifying memory can name that record and preserve the lasting context; do not create a second source of current work status.
- Keep proposals, unchecked claims, and unresolved questions marked as such. Never turn an agent's report into an owner-approved decision.
- Exclude secrets and information whose storage could compromise system, product, or project security. Ordinary contact details may be saved when they meet the memory criteria.
- Keep transcripts, routine status updates, and facts that matter only for the moment out of deliberate memory saves.

## When to review and save

- Review memory when the owner gives lasting information or a correction, when joint work yields a lasting decision or lesson, and when work ends or is handed off.
- Treat keyword reminders as prompts to review against the criteria, not commands to save. Review qualifying lessons found during the agent's work even when no phrase matches.
- Before saving, search Hindsight and read relevant records. Save qualifying new knowledge, or an addition or correction that identifies the existing subject. Include the source, date, useful context, and a pointer to its project record when one exists.
- Preserve creation and revision dates, who made the revision, provenance, source, type, tags, useful context, and supersession relationships using supported Hindsight fields or clearly labeled document text. Distinguish the source speaker from the agent that translated or saved it. When correcting a record, identify both the earlier record and its replacement; report metadata the available tools cannot maintain rather than inventing fields or claiming they were updated.
- With the default package, no session is saved automatically. Save deliberately with `hindsight_ingest_document`; a statement that the conversation will save itself does not apply here. Follow the recorded package when the owner approved a different capture setting.
- Tell the owner what was saved or corrected. When the criteria yield nothing, save nothing.

## Find and use memory

- Search the knowledge pages before asking the owner to repeat remembered information or acting on past decisions, constraints, or lessons. Read the relevant page or record; use reflection when the remembered rationale needs more context.
- Verify changeable claims against project records, work items, Git, or the running system. Memory gives no permission to act and does not establish current approvals or status.
- Cite memory where it contributes to an answer, naming the record or page and its relevant evidence. Distinguish source claims from confirmed facts.

## Correct and retire memory

- Search and read before a correction. Save a document titled `Correction: <topic>` that states the earlier claim, what is true now, and the evidence. Identify what it supersedes.
- A correction does not delete the earlier document or guarantee it can never be recalled. Verify retrieval and clearly identify the correction when the old claim appears.
- When the owner asks to forget or delete memory, use the available supported deletion capability. If the add-on cannot delete it, identify the record for the owner to remove in the bank dashboard. Never report a correction as deletion.

## One memory store

- Use this rule for Hindsight memory where another toolkit file refers to `managing-project-memory`. Use `managing-work-items` for current work and `filing-project-records` for authoritative decisions and sources.
- A Hindsight project uses no local `memory/` folder or Current State file. Wherever a toolkit guide or skill asks to read, update, report, or check that file, use the current work tracker and authoritative project records instead, and record handoff context there. Do not create a local state file or treat its absence as a setup failure. The add-on supplies memory context at session start.
- Keep standing instructions for agent behavior in `owner-preferences.md` or the applicable rule, as the root guide says. Hindsight may hold their history or a pointer, but never replaces the instructions.
- Change the bank's configuration through `project-setup` when the owner requests it. Follow the add-on's guidance without exposing its API key.
