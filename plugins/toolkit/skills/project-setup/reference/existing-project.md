# An existing project that adopts the toolkit

Open this file when Step 2 of `SKILL.md` finds agent files that the toolkit did not put there. `SKILL.md`, "An existing project", gives the one question to ask the owner and the three rules. This file says what to look for before you ask, how the branch works with the folders that Git ignores, and which problems are known.

The job is done when the project holds the parts of the toolkit that the owner chose, nothing of the owner's was replaced or deleted without the owner's answer, every old record is still there, and the changes can be undone.

The toolkit gives no instruction for each possible project. Use your judgment, and ask the owner.

## What to look for

Read what the project holds before you ask the question, so that you can tell the owner what each of the two answers would change in this project. Look in the main checkout, because a folder that Git ignores exists only there. The main checkout is the project's main folder, the first path that `git worktree list` prints.

- **Agent guides:** a root `AGENTS.md` or `CLAUDE.md`, and a guide inside a folder.
- **Rules, skills, hook commands, and settings:** what is in `.claude/`, `.codex/`, and `.agents/`, and `.mcp.json`.
- **Records:** work items, memory, decisions, requirements, and client documents, in whatever place the project keeps them.
- **Which earlier setup made them.** The table gives the signs.

| The folder holds | It was set up by |
| --- | --- |
| `.work-items/`, `knowledge/knowledge-manual.md`, `knowledge/memory/`, `.claude/toolkit-sync.md`, `.claude/RULES.md`, `.toolkit-memory.json`, `.system-guide.json`, or a name ending in `@claude-toolkit` set to `true` under `enabledPlugins` in `.claude/settings.json` | The older claude-toolkit |
| `.toolkit.json` | The retired `toolkit` program |
| None of these | The owner or an agent, by hand |

## The branch, and the folders that Git ignores

- Make the branch before the first change. Change the files that Git tracks only on that branch.
- In a repository with no commit yet, a branch can undo nothing. Offer to commit what is there first.
- Git ignores `work-items/` and `memory/`, so they are on no branch. They belong in the main checkout, where every later session finds them.
- The toolkit's `.gitignore` lines for those two folders are on the branch until it is merged. Until then, stage nothing from the two folders.
- A work item or a memory record must never name a record that is not on the default branch yet. Write such a line after the branch is merged.

## Known problems

**Files with the name of a toolkit file**

- **A file of the owner's has the name of a file in the full layout**, such as `AGENTS.md`, `README.md`, `PROJECT.md`, `DECISIONS.md`, or `SOUL.md`. `reference/placing-files.md`, "Files the project already has", says what to do with each kind.
- **The project has its own folder named `work-items/` or `memory/`.** The toolkit uses the same names for local work items and local memory. Ask the owner before you add a file there. One answer to offer is a new name for the old folder, so that old and new records never mix.
- **The project's settings files hold hooks of an earlier setup.** `reference/skills-hooks-settings.md`, "Merge rules", says which entries are the toolkit's and which stay. Take out a hook's entry and its command file in the same step.

**Old records**

- **An old record is the owner's.** It stays where it is, unchanged. To carry one over, write a new record in the toolkit's form, and say in it where it came from.
- **Old records are already in the place where the new ones go**, such as issues in the same GitHub repository or pages in the same Notion database. Change none of them before the owner answers.
- **Old work items have numbers.** With local work items, new IDs must continue above the highest old ID.
- **A later session must be able to tell old records from current ones.** Say in `PROJECT.md`, under "Work and project records", which folders hold old records that are kept as history.

**The older claude-toolkit**

- **Its plugins have skills with the same names as Toolkit V2 skills**, such as `handoff` and `pull-latest`. The toolkit's settings turn those plugins off for this project only. `reference/skills-hooks-settings.md`, "The older plugins, off in this project", says how.
- **Its files in the project may hold the owner's edits.** Claude Code keeps the older toolkit's own copy in the folder that this command prints, and a comparison with that copy shows whether a file was edited. The command only reads. Never change anything in that folder or anywhere under `~/.claude`.

  ```text
  jq -r '."claude-toolkit".installLocation // empty' ~/.claude/plugins/known_marketplaces.json
  ```

- **Its hooks still run in this session**, until the branch with the changes is merged. An old hook may ask you to save knowledge, record a review, or open an old skill. Such a request is not part of the setup. When a hook blocks a reply, tell the owner in one line.
- **The project's Git hooks folder may hold a `pre-commit` that names `check-knowledge`.** That hook runs the older toolkit's tool in `.claude/tools/`, so it comes out in the same step as that folder, after the owner's yes. Git does not track a Git hook, so each computer's copy of the project has its own. Tell the owner that the hook must come out on each other computer too.
- **Its records are in these places:** work items in `.work-items/`, memory in `knowledge/memory/memory-entries/`, project facts in `knowledge/project.md`, and requirements in `knowledge/prds/`.
- **A Salesforce project has its guards**, `guard-protected-orgs.js` and `.claude/protected-orgs.json`, which refuse a change to a production org. Toolkit V2 does that job with entries in `permissions.deny`. Put those entries in before a guard comes out, so that the project is never without something that refuses a change to production. `choices/salesforce/salesforce-setup.md`, "The refuse list for production", gives the entries.
