# Memory in Notion

Open this file when the owner answers "Notion" to question 6 of `SKILL.md`. It gives the default to tell the owner, the question to ask, what the choice adds to the project, and what it needs at the finish. The Notion steps themselves are in `choices/notion-shared/notion-setup.md`, because Notion work items use the same steps.

The job is done when the Memory page and the "Current state" page exist in the owner's Notion, the Notion files are in the project, `PROJECT.md` records the choice and the ids, and the session-start command prints the project's Current State. The project's Current State is the project's one short page of what is true now.

## What the toolkit sets up by default

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project's page in the owner's Notion gets a Memory page and a "Current state" page. The project's page is a row of the owner's Projects database, made as a copy of the owner's "Project" template.
- The Memory page holds a set of databases, where each subject is a page. The toolkit calls this layout Lore.
- At the start of each session, the agent is shown only the "Current state" page. It searches the Memory page when it needs something.
- With work items in Notion too, work and memory sit together and link to each other, and the owner can read both on a phone.
- The agent reaches Notion with the Notion command-line tool, `ntn`, which the owner signs in.

## Questions for the owner

- **Where the project's page goes**, when the project has no page in Notion yet. `choices/notion-shared/notion-setup.md`, "Where the project page goes", gives the question.

## What this choice adds to the project

| Kind | What it adds |
| --- | --- |
| Skill | Copy `choices/memory/shared-by-local-and-notion/files-to-add/` into the project. It holds the skill `managing-project-memory`: what counts as memory, and how to save, find, and tidy it. |
| Files inside that skill | Copy `choices/memory/notion/files-to-add/` into the project after it. It adds the files on how memory is kept as Notion pages, and two page templates. `references/memory-store.md` is the one that the skill opens first. |
| Skill and rule | Copy `choices/notion-shared/files-to-add/` into the project. It holds the skill `using-notion-cli` and the rule `notion-records.md`. Notion work items bring the same folder, and a project gets it once. |
| Settings | The session-start line names Notion and the "Current state" page. "The settings lines" below gives the change. |
| `PROJECT.md`, "Toolkit settings" | Write `notion` on the Memory line. Add the line `- Notion memory:` at the end of the section, with the ids of the Memory page, its databases, and the "Current state" page as nested bullets. `choices/notion-shared/notion-setup.md`, "The links in PROJECT.md", says how they are written. |

### The settings lines

The settings in the full layout name `local`. Change these two places:

| File | Change |
| --- | --- |
| `.claude/settings.json` | In the session-start hook, the last entry of `args` is `"local"`. Put these three entries in its place: `"notion"`, `"--page"`, `"{{CURRENT_STATE_PAGE_ID}}"`. |
| `.codex/hooks.json` | The session-start command ends with `--memory local`. Make it end with `--memory notion --page {{CURRENT_STATE_PAGE_ID}}`. |

`{{CURRENT_STATE_PAGE_ID}}` stays until the "Current state" page exists. Then put the page's id in its place in both files, as `choices/notion-shared/notion-setup.md`, "The links in PROJECT.md", says.

## Outside the project folder

After the owner's yes, make the project's pages in Notion. Follow `choices/notion-shared/notion-setup.md`: the sign-in, the owner's yes, where the project page goes, and which steps to follow.

Those steps remove the part of the page that this project keeps elsewhere and fill the fields of the project's row, so they need the owner's answers to question 5, where work items are kept, and question 7, Salesforce.

## At the finish

- **The project's Current State.** It is the "Current state" page in Notion. The Notion steps wrote its first lines when they made the page. Bring them up to date with what `reference/finishing.md`, "The project's Current State", says.
- **The project's outcome**, when work items are not in Notion. Write the owner's sentence from question 2 in the "Desired Outcome" field of the project's row in Notion, and read the row back. The page's "Project brief" prompts (Overview/Context, Goals, Success criteria) stay until the owner gives them. List them in the report with the prompts that are left.
- **Check.** `node .claude/hooks/session-start.mjs --memory notion --page <Current state page id> </dev/null` prints the Current State. Then do the check that starts "For a new project" under "Checks after any of these" in `choices/notion-shared/reference/notion-work-item-pages.md`.
- **The owner's own steps.** `choices/notion-shared/notion-setup.md`, "Sign-in: the owner's step", gives them.

## Known problems

- **`{{CURRENT_STATE_PAGE_ID}}` is still in a settings file at the finish.** The page's id was not put in. `grep -n '{{' .claude/settings.json .codex/hooks.json` shows where.
- **In Codex, the session-start check prints "could not be read here".** That text comes from the Codex sandbox, which blocks the network, and it is not a setup failure. Run the command escalated, as `SKILL.md`, "Known problems", says under "In Codex".
- **The owner trusted the Codex hooks before the page's id was put in.** A changed hook must be trusted again. Tell the owner.
