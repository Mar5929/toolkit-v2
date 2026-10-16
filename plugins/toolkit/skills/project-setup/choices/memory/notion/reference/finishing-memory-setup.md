# Finishing Notion memory setup

Use this reference at the finish of Notion memory setup. The job is done when the confirmed Current state is printed at session start.

## Initialize Current state

Start an on-demand librarian run, the skill `maintaining-notion-wiki`, to fill in the Current state page from the interview with these values, then read the page back.

- Last updated: the date, "setup", and "agent".
- Active work: the current work from question 11, most important first, or "None."
- Coming up: each dated event or deadline the owner named, or "None."
- Waiting on: what the project's work waits on, or "None."
- Standing jobs and shared files: "None."
- Where we stopped: the next roadmap step from question 11.

## Set the page ID and check startup

Set the verified Current state page ID in `.claude/hooks/session-start-choice.mjs`, as [what-notion-memory-adds-to-a-project.md](what-notion-memory-adds-to-a-project.md), "Session-start settings", says. Then run `node .claude/hooks/session-start.mjs </dev/null` and confirm that it prints that page. When it does not, read Current state through `managing-project-memory`, report the failed check, and do not report it as passed.
