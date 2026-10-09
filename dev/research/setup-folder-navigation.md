# Telling apart the folders of the `project-setup` skill

This report answers Mike's question of 2026-10-08 about `assets/` and `references/` in `plugins/toolkit/skills/project-setup/`. It is analysis only. No file was changed.

## The answer in three lines

1. `references/` holds the instructions the setup agent reads. `assets/` holds the files a project gets, which is the starter project (Mike's "blueprint"). Inside `assets/`, `every-project/` goes to every project, and each other folder goes with one setup choice.
2. The recommendation is to keep both names and add one short map, `README.md`, beside `SKILL.md`, in the folder where the question comes up.
3. The reason is that `assets` and `references` are the folder names that the skill format recommends in Claude Code and in Codex. A rename of `assets/` changes 31 files and moves 260. The map adds 1 file, changes 9, and moves none.

## How it is laid out today

`plugins/toolkit/skills/project-setup/` holds one file and two folders: 281 files tracked by Git.

| Folder or file | What it holds | Who reads it |
| --- | --- | --- |
| `SKILL.md` | The setup jobs and the eight steps of a new setup (192 lines). | The setup agent |
| `references/` | 14 instruction files, one per step or service (for example `setup-copy.md`, `update.md`). | The setup agent |
| `references/notion-build/` | 6 files with the steps and the page texts for building the Notion pages. | The setup agent |
| `assets/every-project/` | 82 files that every project gets: `AGENTS.md`, `PROJECT.md`, the rules, 10 skills, 4 hook commands. | A project |
| `assets/work-local/`, `work-notion/`, `work-github/` | The files for one answer to "where are work items kept" (11, 29, and 6 files). | A project with that choice |
| `assets/memory-local/`, `memory-notion/`, `memory-hindsight/` | The files for one answer to "where is memory kept" (9, 24, and 2 files). | A project with that choice |
| `assets/memory-process/` | The memory skill that local memory and Notion memory share (7 files). | A project with either choice |
| `assets/notion-tools/` | The Notion command skill and one rule (3 files). | A project with work items or memory in Notion |
| `assets/salesforce/`, `assets/soul/` | The files of a Salesforce project (77 files), and `SOUL.md` (1 file). | A project with that choice |
| `assets/settings/` | 8 small settings files. Setup merges their lines into a project's settings files. | The setup agent; never copied as a folder |
| `assets/owner-preferences.md` | The starting text of one project rule file. Setup copies it only when the project has none. | A project, once |

Seven facts make this hard to read in a file tree. Each was checked in the files.

- The names `assets` and `references` do not say their subject. A reader must already know the skill format.
- The same thing has four names: "starter project" (`README.md`, `AGENTS.md`), "the model" (`AGENTS.md`), "setup folder" (`SKILL.md` and its references), and the folder name `assets`. No file uses "blueprint".
- `settings/` looks like a setup folder but is never copied as a folder.
- `memory-process` and `notion-tools` are not named for one choice. Two choices share each of them.
- `owner-preferences.md` is the one file beside the 12 folders.
- Six folders (`memory-hindsight`, `memory-notion`, `memory-process`, `notion-tools`, `work-github`, `work-notion`) hold only a `.claude` folder. A file browser that hides names starting with a dot shows these six as empty.
- A project file is six folders below the repository root, and a project skill is nine.

One stray folder exists on disk only: `assets/work-notion/.claude 2`. It is empty, and Git does not track it.

## What limits the names

- The names are a recommendation, never a requirement. The Agent Skills specification says "A skill directory may contain any files and directories beyond the required `SKILL.md`. The conventions below are recommendations for organizing common types of content" (`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`, "Optional directories").
- Codex names both folders. Its page says "Use `assets/` for templates or files the workflow should copy or transform" (`ai-external-knowledge/codex/openai-plugins-build-skills.md`). The text Codex gives its own model says "If `assets/` or templates exist, reuse them" (`ai-external-knowledge/codex/source-skills-catalog-prompt.md`, lines 39 and 41).
- No captured page says that Claude Code or Codex loads either folder by its name. The agent finds a file through its link in `SKILL.md`.
- The toolkit follows the recommendation. `dev/research/skill-writing-guide.md`, rule R6, says "Put fixed files the agent copies in `assets/`". Of the 17 skills the toolkit holds, 8 have a `references/` folder and 3 have an `assets/` folder.
- `dev/tools/check-skills.mjs` holds the names. Line 121 reads a path in backticks as a link only when it starts with `references/`, `assets/`, `examples/`, `scripts/`, or `agents/`. Lines 304 and 376 apply the contents-list rule to files under `references/`.
- One loading rule must stay. Each project skill sits under a `.claude/skills/` folder, because Codex skips a `SKILL.md` whose parent folder name starts with a dot (`AGENTS.md`, row "Why skills sit under `.claude/`"). No option below changes that.
- A file beside `SKILL.md` fails `check-skills.mjs` today, also when `SKILL.md` links it. Line 285 keeps only links that contain a `/`. A file at `assets/README.md` passes once the References table of `SKILL.md` names it. Both were run in a scratch copy.

## Earlier decisions of Mike's that a rename would revisit

- "Apart from the rule above, no file, skill, or folder is renamed to make its name plainer", and "a name says its subject" (`AGENTS.md`, "Plain English", 2026-10-06). The first sentence forbids a rename. The second sentence is the reason a rename would help here.
- "We're just using the out-of-the-box recommended harness development components", and his question whether the skills are "set up based on Claude Code and Codex best practices" (`dev/GOAL.md`, lines 722 to 725).
- One folder per setup choice, each named for its choice, approved on 2026-10-05 (`dev/research/layout-audit/DESIGN-SPEC.md`, section 8; `dev/test-runs/one-folder-per-choice.md`). That move renamed 247 files.
- A new name such as "blueprint" would be a fifth name. `AGENTS.md` and `README.md` call this thing "the starter project" (`AGENTS.md`, "The starter project").

## Options

| Option | What Mike gains | What it costs | Earlier decision it revisits |
| --- | --- | --- | --- |
| 1. Keep the names. Add a map, `README.md`, beside `SKILL.md`. **Recommended.** | The explanation is the first thing in the folder he opens. The two words mean the same in every skill, so he learns them once. | 1 new file and 9 changed files. No file moves. One changed line in `check-skills.mjs`. Version 0.9.19. Existing projects get nothing new. | None |
| 2. Keep the names. Add two lines to the root `README.md`, "Where things are". | The explanation exists in a file written for him. | 1 file. He does not see it where he browses. | None |
| 3. Rename folders inside `assets/`: `settings`, `memory-process`, `notion-tools`, or group the choice folders one level down. | The three odd names go away, or the tree shows two groups. | `memory-process` is named on 15 lines in 6 files, `notion-tools` on 15 lines in 8 files, and the `settings` folder on 13 lines in 8 files. Grouping adds a seventh folder level and moves 169 files. `check-skills.mjs` requires each word of a folder name to be in its choice. | No rename (2026-10-06); one folder per choice (2026-10-05) |
| 4. Rename `assets/` to `starter-project/`. Keep `references/`. | The tree says which folder is the starter project without a map. | 31 files and 183 lines change, and 260 files move. Nine of those lines fail without any error when missed: 5 patterns in `.claude/settings.json` and 4 in `.gitignore`. Seven other worktrees have branches with the old paths. `project-setup` becomes the one skill with a different folder name. | No rename (2026-10-06); the recommended names of both hosts |
| 5. Rename `references/` as well. | Both names say their subject. | Option 4, and also 75 lines in 11 files of the skill, 16 lines in `AGENTS.md`, 3 rules in `check-skills.mjs`, and 20 files moved. | The same two |

One more idea was considered and dropped: a link named `starter-project` in the repository root that points to `assets/`. The patterns in `.claude/settings.json` that stop the starter's `AGENTS.md` files and rules from loading match by path, and it is not known whether they match a path through a link.

## The recommended option

Option 1 answers the question at the place where it comes up, and it keeps the names that both hosts and the toolkit's other skills use. The map is about 25 lines for the owner. It says what the three entries are, lists the 12 folders and the one file under `assets/` in the groups below, and uses the name "starter project", with "blueprint" beside it once. A new check keeps the map complete: `check-skills.mjs` fails when something directly under `assets/` is missing from the map. Option 4 is the right next step only if the map does not help, and it needs Mike's yes because it revisits his decision of 2026-10-06.

Before:

```text
project-setup/
├── SKILL.md
├── assets/
└── references/
```

After (the notes are what the map says):

```text
project-setup/
├── README.md            the map: what each folder is
├── SKILL.md             the setup jobs and steps, for the agent
├── references/          instructions the setup agent reads
└── assets/              the starter project: files a project gets
    ├── every-project/           every project
    ├── work-local/ work-notion/ work-github/          one of three: where work items are kept
    ├── memory-local/ memory-notion/ memory-hindsight/ one of three: where memory is kept
    ├── memory-process/          with local or Notion memory
    ├── notion-tools/            with work items or memory in Notion
    ├── salesforce/ soul/        only when chosen
    ├── settings/                lines merged into settings files; not copied as a folder
    └── owner-preferences.md     starting text of one rule file; copied once
```

## What would have to change for the recommended option

1. New file: `plugins/toolkit/skills/project-setup/README.md`, about 25 lines.
2. `plugins/toolkit/skills/project-setup/SKILL.md`: one new row in the References table. The row says that the file is the owner's map and that setup never needs it. `check-skills.mjs` requires the row.
3. `dev/tools/check-skills.mjs`: line 285 changes so that a file beside `SKILL.md` counts when `SKILL.md` links it. With that one changed line the scratch copy passed for all 17 skills, and it failed again when the row was removed. The new check for a complete map is about 5 more lines. It is not written or tested.
4. `AGENTS.md`: the Layout row for `<setup>SKILL.md`, and the list under "Checks".
5. Root `README.md`, "Where things are": one sentence on what `references/` holds.
6. The version, 0.9.18 to 0.9.19, in 4 files: `plugins/toolkit/.claude-plugin/plugin.json`, `plugins/toolkit/.codex-plugin/plugin.json`, `plugins/workstreams/.claude-plugin/plugin.json`, and `.claude-plugin/marketplace.json`.
7. `dev/PROGRESS.md`: one entry.
8. On disk only: remove the empty folder `assets/work-notion/.claude 2`.

That is 1 new file and 9 changed files. The new file and the new row are text for a skill, so they get the wording review and the best-practices review that `AGENTS.md` requires. Existing projects are not affected by any option: no file under `assets/` names a path of this skill, and "update the toolkit" reads the installed plugin.

How the counts were made: `rg` counted the lines that name `project-setup/assets`, `<setup>assets`, or `assets/<one of the 12 folders>`, and the same for `references`. The 31 files of option 4 are `.claude/settings.json` (6 lines), `.claude/rules/evaluate-the-owners-request.md` (1), `.gitignore` (5), `AGENTS.md` (22), `README.md` (3), `dev/SKILL-INDEX.md` (26), the two check tools (38), five test files (33), `SKILL.md` (13), eight of its reference files (21), two files of `writing-harness-files` (2), and seven guides and briefs under `dev/` (13). Another 57 files under `dev/` and the root `reference/` hold the old path on 287 lines as records of past work. Those would stay as they are.

## What could not be verified

- Which file browser Mike uses, whether it hides folders whose names start with a dot, and whether it shows a `README.md` without a click.
- Whether Codex accepts a `README.md` beside `SKILL.md`. `claude plugin validate ./plugins/toolkit` passed in the scratch copy with the file present. Codex has no validate command, and no install into a scratch Codex home was run.
- The line counts are counts of matching lines. A count can be off by a few lines where a path is split over two lines.
