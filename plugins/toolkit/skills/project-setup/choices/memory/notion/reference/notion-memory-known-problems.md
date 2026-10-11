# Problems with Notion Project Wiki setup

Use this reference when Notion memory setup or an operation fails. Preserve owner records while resolving the problem.

- When a configured destination is missing, traverse the project and confirm its actual structure before creating anything. A customized project is not automatically invalid.
- When copied relations still target the template, resolve and verify their project-specific targets before filing linked records.
- When fields differ from the template, inspect the live schema and preserve existing values. Confirm a needed schema change with the owner rather than adding fields silently.
- When Current state cannot be read at startup, check access and host permissions, then read it through `managing-project-memory`. [Setup problems](../../../../reference/setup-problems.md) describes host access failures.
- When a page ID placeholder remains, fill the confirmed identifier in both hosts’ settings and rerun the startup check. Tell the owner when changed Codex hooks need trusting again.
- When daily processing cannot be configured, record an open setup step and retain on-demand operation. Do not claim the schedule is active.
- When processing is partial or stale, use `maintaining-notion-wiki` to inspect completed links and the run record before retrying writes. Processing status alone does not prevent overlapping writers.
- When an existing project still has the former Memory layout, propose a reviewed migration batch using [update guidance](../../../../reference/update.md). Preserve its records and identifiers until the batch is authorized and verified.
