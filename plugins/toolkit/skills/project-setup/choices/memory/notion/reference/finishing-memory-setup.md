# Finishing Notion memory setup

Use this reference at the finish of Notion memory setup. The confirmed Current state is visible at startup, pending captures and work records remain authoritative for freshness, and librarian access is verified.

## Initialize and check Current state

Follow [notion-memory-setup.md](../notion-memory-setup.md) for the published librarian package and selected host access. Initialize the existing Current state sections from confirmed priorities, deadlines, open setup steps, and the next action from the interview. Preserve the copied page's structure and read the update back.

Set the verified Current state page ID in `.claude/hooks/session-start-choice.mjs`, as `what-notion-memory-adds-to-a-project.md`, "Session-start settings", says. Run `node .claude/hooks/session-start.mjs </dev/null` and confirm it prints that page. A failed command uses the coding-agent retrieval procedure; do not report the check passed.

Verify the configured wiki record homes, both installed memory skills, retrieval and capture read-back, and librarian destination access using the setup procedure. Do not add duplicate authoritative repository records. Keep the open owner steps in Current state and in the setup report.
