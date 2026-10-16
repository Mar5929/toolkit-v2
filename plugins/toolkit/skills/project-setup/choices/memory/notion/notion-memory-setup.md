# Memory in the Notion Project Wiki

Follow these steps when the owner chooses to keep memory in Notion. Setup connects Project Wiki, installs the coding-agent and librarian skills, and publishes the librarian package inside the wiki. The job is done when the wiki's links and the librarian schedule are recorded, Current state is initialized, and retrieval and verified capture work.

## Steps

Do steps 1 to 4 right after the answer, before the next interview question. Do steps 5 to 9 when the owner's sign-in is done and the shared Notion steps have made the project's pages. Do steps 10 to 12 when setup finishes.

1. **Tell the owner how the toolkit sets up the Project Wiki by default, and ask whether that is what the owner wants.** [reference/notion-memory-default.md](reference/notion-memory-default.md) holds the default.
2. **Copy this choice's files into the project.** Do not copy the local memory files. [reference/what-notion-memory-adds-to-a-project.md](reference/what-notion-memory-adds-to-a-project.md) lists them.
3. **Write `notion` on the Memory line of `PROJECT.md`, and write the root `AGENTS.md` text.** [reference/what-notion-memory-adds-to-a-project.md](reference/what-notion-memory-adds-to-a-project.md) gives the text and where it goes.
4. **Ask the owner to sign in to Notion**, as the sign-in step of [notion-setup.md](../../notion-shared/notion-setup.md) says.
5. **Make or reuse the project's Project Wiki, after the owner's yes**, as the remaining steps of [notion-setup.md](../../notion-shared/notion-setup.md) say. Reuse an existing Project Wiki. Those steps find the Wiki Inbox, the four destinations and the long-term collections, verify their schemas and relation targets, and record their links.
6. **Point the record homes in `PROJECT.md` at the wiki**, as [reference/what-notion-memory-adds-to-a-project.md](reference/what-notion-memory-adds-to-a-project.md), "Project authoritative destinations", says. Keep the owner's records and customized content.
7. **Publish the librarian processing skill inside Project Wiki, and verify it.** [reference/librarian-package.md](reference/librarian-package.md) gives the steps.
8. **Help the owner set up the scheduled librarian**, normally a daily Claude scheduled job that runs `maintaining-notion-wiki` with the filled librarian invocation prompt. Record it on the "Librarian schedule" line.
9. **Verify memory works.** Check project-scoped retrieval, capture and read-back, librarian access to every destination, and relation targets. Test one permitted capture and its filing without changing the template or unrelated records. Check that both hosts can find the two delivered skills.
10. **Initialize Current state, and set its page ID in the session-start module.** [reference/finishing-memory-setup.md](reference/finishing-memory-setup.md) gives the steps and this choice's startup check.
11. **When work items are not in Notion, fill the project row's Desired Outcome** with the owner's sentence from question 2, and list the project page's unanswered "Project brief" prompts (Overview/Context, Goals, and Success criteria) in the report.
12. **Tell the owner the owner's own steps for Notion.** [notion-sign-in.md](../../notion-shared/reference/notion-sign-in.md) gives them.

When a step fails, open [reference/notion-memory-known-problems.md](reference/notion-memory-known-problems.md). Updating instruction files does not by itself authorize a change in Notion or turn on a schedule.
