# Finishing Notion memory setup

Use this reference at the finish of Notion memory setup. The job is done when the confirmed Current state is printed at session start.

## Initialize Current state

Start an on-demand librarian run, the skill `maintaining-notion-wiki`, to initialize the existing Current state sections from the interview: the confirmed priorities, the deadlines, and the next action. Keep the copied page's structure, and read the update back.

## Set the page ID and check startup

Set the verified Current state page ID in `.claude/hooks/session-start-choice.mjs`, as [what-notion-memory-adds-to-a-project.md](what-notion-memory-adds-to-a-project.md), "Session-start settings", says. Then run `node .claude/hooks/session-start.mjs </dev/null` and confirm that it prints that page. When it does not, read Current state through `managing-project-memory`, report the failed check, and do not report it as passed.
