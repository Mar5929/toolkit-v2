# Problems with Notion Project Wiki setup

Use this reference when Notion memory setup or an operation fails. Preserve owner records while resolving the problem.

- When a configured destination is missing, traverse the project and confirm its actual structure before creating anything. A customized project is not automatically invalid.
- When copied relations still target the template, resolve and verify their project-specific targets before filing linked records.
- When fields differ from the template, inspect the live schema and preserve existing values. Confirm a needed schema change with the owner rather than adding fields silently.
- When Current state cannot be read at startup, check access and host permissions, then read it through `managing-project-memory`. [Setup problems](../../../../reference/setup-problems.md) describes host access failures.
- When `{{CURRENT_STATE_PAGE_ID}}` remains in `.claude/hooks/session-start-choice.mjs`, set the verified Current state page ID there, as [what-notion-memory-adds-to-a-project.md](what-notion-memory-adds-to-a-project.md), "Session-start settings", says, and rerun the startup check.
- When the scheduled librarian is not set up yet, on-demand runs still work. Do not claim the schedule is active.
- When processing is partial or stale, start an on-demand librarian run, which inspects completed links and the run record before it retries writes. Processing status alone does not prevent overlapping writers.
