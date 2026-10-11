# An existing project that adopts the toolkit

Open this file when Step 2 of [SKILL.md](../SKILL.md) finds agent files that the toolkit did not put there. [SKILL.md](../SKILL.md), "An existing project", gives the one question to ask the owner and the three rules. This file says what to look for before you ask, how the branch works with the folders that Git ignores, and which problems are known.

The job is done when the project holds the parts of the toolkit that the owner chose, nothing of the owner's was replaced or deleted without the owner's answer, every old record is still there, and the changes can be undone.

The toolkit gives no instruction for each possible project. Use your judgment, and ask the owner.

## What to look for

Before copying or comparing the full layout, review existing local product and reference folders with [Moving existing records into the local wiki](local-wiki-layout.md). Show the owner the mapping and destination conflicts before a move. A missing new path does not mean the owner's populated document should be replaced by a template.

Before Step 3 copies the full layout, check whether an existing Notion memory layout needs migration to Project Wiki. If it does, prepare new files in a setup copy and follow the reviewed batch procedure in [reference/update.md](update.md), "Changing a setup choice". Preserve active guides, skills, record routes and settings until the approved destinations and moved records are verified.

Read what the project holds before you ask the question, so that you can tell the owner what each of the two answers would change in this project. Look in the main checkout, because a folder that Git ignores exists only there. The main checkout is the project's main folder, the first path that `git worktree list` prints.

- **Agent guides:** a root `AGENTS.md` or `CLAUDE.md`, and a guide inside a folder.
- **Rules, skills, hook commands, and settings:** what is in `.claude/`, `.codex/`, and `.agents/`, and `.mcp.json`.
- **Records:** work items, memory, decisions, requirements, and client documents, in whatever place the project keeps them.

## The branch, and the folders that Git ignores

- Make the branch before the first change. Change the files that Git tracks only on that branch.
- In a repository with no commit yet, a branch can undo nothing. Offer to commit what is there first.
- Git ignores `work-items/` and `memory/`, so they are on no branch. They belong in the main checkout, where every later session finds them.
- The toolkit's `.gitignore` lines for those two folders are on the branch until it is merged. Until then, stage nothing from the two folders.
- A work item or a memory record must never name a record that is not on the default branch yet. Write such a line after the branch is merged.

## Known problems

**Files with the name of a toolkit file**

- **A file of the owner's has the name of a file in the full layout**, such as `AGENTS.md`, `README.md`, `PROJECT.md`, `DECISIONS.md`, or `SOUL.md`. [reference/placing-files.md](placing-files.md), "Files the project already has", says what to do with each kind.
- **The project has its own folder named `work-items/` or `memory/`.** The toolkit uses the same names for local work items and local memory. Ask the owner before you add a file there. One answer to offer is a new name for the old folder, so that old and new records never mix.
- **The project's settings files hold hooks that the toolkit did not put there.** [reference/skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", says which entries are the toolkit's and which stay. When a hook comes out, take out its entry and its command file in the same step.
- **A Salesforce project has a guard of its own that refuses a change to a production org**, such as a hook command. Toolkit V2 does that job with entries in `permissions.deny`. Put those entries in before a guard comes out, so that the project is never without something that refuses a change to production. The step on the refuse list in [choices/salesforce/salesforce-setup.md](../choices/salesforce/salesforce-setup.md) gives the entries.

**Old records**

- **An old record is the owner's.** It stays where it is, unchanged, unless the owner approves a layout move under [local wiki layout guidance](local-wiki-layout.md). A layout move preserves its content and identity. To carry an old record into a new record form, write a new record in the toolkit's form, and say in it where it came from.
- **Old records are already in the place where the new ones go**, such as issues in the same GitHub repository or pages in the same Notion database. Change none of them before the owner answers.
- **Old work items have numbers.** With local work items, new IDs must continue above the highest old ID.
- **A later session must be able to tell old records from current ones.** Say in `PROJECT.md`, under "Work and project records", which folders hold old records that are kept as history.
