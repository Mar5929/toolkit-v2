# Finishing Notion memory setup

Use this reference at the finish of Notion memory setup. The job is done when the confirmed Current state is printed at session start and holds every open owner step.

## Initialize Current state

Start an on-demand librarian run, the skill `maintaining-notion-wiki`, to initialize the existing Current state sections from the interview: the confirmed priorities, the deadlines, each open owner step, and the next action. The open owner steps come from the shared finishing reference's "The owner's steps" and from each choice that leaves an owner step open, such as Salesforce. Keep the copied page's structure, and read the update back.

## Set the page ID and check startup

Set the verified Current state page ID in `.claude/hooks/session-start-choice.mjs`, as [what-notion-memory-adds-to-a-project.md](what-notion-memory-adds-to-a-project.md), "Session-start settings", says. Then run `node .claude/hooks/session-start.mjs </dev/null` and confirm that it prints that page. When it does not, read Current state through `managing-project-memory`, report the failed check, and do not report it as passed.

Keep the open owner steps in Current state and in the setup report.
