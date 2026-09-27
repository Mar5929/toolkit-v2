# AGENTS.md: working on Toolkit V2

This repository builds Toolkit V2: six plugins for Claude Code and Codex that
set up and run one solo developer's projects. The agent runs each project; Mike
only decides and steers. `README.md` explains it for Mike.

## Read first

- `dev/GOAL.md`: Mike's goal and settled decisions. It wins over every other
  file.
- `dev/PROGRESS.md`: what is done, what is in progress, and the next step.
  Update it before you stop.
- `dev/ARCHITECTURE.md`: the build plan. Open the section your task needs.
- `dev/SKILL-INDEX.md`: every skill name, description, and agent.

## Layout

| Path | What is there |
| --- | --- |
| `.claude-plugin/marketplace.json` | The `toolkit-v2` marketplace for Claude Code. |
| `.agents/plugins/marketplace.json` | The `toolkit-v2` marketplace for Codex. Each entry has `policy` and `category`. |
| `plugins/<name>/.claude-plugin/plugin.json` | Claude Code manifest. `defaultEnabled: false`: projects switch plugins on. |
| `plugins/<name>/.codex-plugin/plugin.json` | Codex manifest: same `name` and `version`, `"skills": "./skills/"`, an `interface` block. |
| `plugins/toolkit/` | The `toolkit` command (`bin/toolkit`, `lib/`), the hooks (`hooks/hooks.json` for Claude Code, `hooks/codex-hooks.json` for Codex), `templates/`, `scaffold/`, the `project-setup` skill, and `tests/`. |
| `plugins/toolkit/scaffold/model/` | An exact copy of Mike's model project: every folder, file name, template, rule, `AGENTS.md`, `CLAUDE.md`, project hook, and project skill a new project gets. Made by `dev/tools/import-model.mjs`; never edited by hand. `.import.json` in it records the model branch and commit it came from. |
| `plugins/toolkit/scaffold/CONDITIONS.json` | The only hand-kept file beside the copy: which model paths install only for the local tracker, built-in memory, Salesforce, or one host; which files a toolkit command generates; where init fills the project name; and which Salesforce entries and lines a project without Salesforce leaves out. |
| `plugins/toolkit/templates/` | Only what the model does not hold: the toolkit's own settings entries, the Codex plugin switches and command rule, the toolkit's `.gitignore` lines, and the Hindsight service file. `TEMPLATE-LANGUAGE.md` there explains how init, sync, and doctor install the copy. |
| `plugins/work/` | Nine work skills, six agents, and `references/`. |
| `plugins/memory/` | Three memory skills. |
| `plugins/session-skills/` | Five conversation skills and the `handoff-verifier` agent. |
| `plugins/git-workflows/` | Four Git skills and their tests. |
| `plugins/sf-architect-solutioning/` | The Salesforce architect skill, ported with its body unchanged. Only its description was rewritten (Mike approved, 2026-09-27). |
| `plugins/toolkit/lib/notion/lore-schema.mjs` | Lore's five Notion memory databases (Projects, Topics, Memories, Entities, Facts), copied from Lore 1.0.0 at commit `6e741b1`. Notion memory is stored in this layout (`dev/research/lore.md`). The toolkit's added Memories columns are in `lib/notion/schema.mjs`. |
| `ai-external-knowledge/` | Official Claude Code, Codex, Agent Skills, and Anthropic engineering pages, captured with Firecrawl on 2026-09-27. `INDEX.md` lists the folders; each folder's `SOURCE-RECORD.md` gives every page's web address. Not shipped. |
| `dev/` | Goal, progress, plan, skill index, research, tools, and test runs. Not shipped. |
| `dev/research/skill-writing-guide.md` | The rules for skill names, descriptions, and bodies, taken from `ai-external-knowledge/`. Every rule cites its page. |
| `dev/tools/import-model.mjs` | Copies the model project into `plugins/toolkit/scaffold/model/`. `--check` compares the copy with the model and changes nothing. |
| `.claude/settings.json` | Settings for sessions working on this repository. `claudeMdExcludes` stops the copy's `CLAUDE.md`, `AGENTS.md` files, and `.claude/rules/` from loading as instructions here; they are for projects, not for this repository. |

## The model project and the scaffold copy

The model project is the exact source for every project file (`dev/GOAL.md`).
The toolkit ships an exact copy of it. `toolkit init` and `toolkit sync`
apply the setup answers while they install the files; the copy itself is
never changed by hand.

- The model is Mike's Git repository at
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`. The 23
  approved changes (`dev/model-changes.md`) sit on its branch
  `toolkit-v2/approved-changes`, checked out as a second folder at
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
  Until Mike merges that branch, the import reads the second folder (the
  `DEFAULT_SOURCE` line in `dev/tools/import-model.mjs`).
- Setup markers in the model's `AGENTS.md`, `README.md`, and `PROJECT.md`
  (`<!-- if salesforce -->`, `<!-- if not salesforce -->`,
  `<!-- if tracker=... -->`, `<!-- if memory=... -->`, each closed by
  `<!-- endif -->`) keep only the blocks that match the setup answers. The
  rules list in `AGENTS.md` sits between `<!-- toolkit:rules:start -->` and
  `<!-- toolkit:rules:end -->` and is rebuilt from the rules a project has.
- The parity test, `plugins/toolkit/tests/scaffold/parity.test.mjs`, runs
  `toolkit init` for all 24 combinations of tracker, memory, and Salesforce
  and compares each result with the model file by file. Every difference must
  be explained by `CONDITIONS.json` or be a file the toolkit adds.

### Refresh the copy after Mike changes the model

1. Read his change in the model folder. Never write there.
2. After Mike merges `toolkit-v2/approved-changes`, change `DEFAULT_SOURCE`
   in `dev/tools/import-model.mjs` to his own model folder, before the second
   folder is removed. Until then, pass `--from <folder>` to read another
   folder.
3. Copy it: `node dev/tools/import-model.mjs`. It copies the model's working
   tree, uncommitted edits included, and says so. It stops and copies nothing
   when a `CONDITIONS.json` rule no longer matches the model, for example
   after Mike renames a Salesforce rule. Update `CONDITIONS.json` and its
   `notes` to match, then run it again.
4. Stage any new file under `scaffold/model/.memory/` or
   `scaffold/model/.work-items/` with the `git add -f` command the import
   prints. The model's own `.gitignore`, copied into `scaffold/model/`, hides
   those folders from this repository's Git, so a plain `git add` skips them
   and a clean clone would set up projects without those templates.
5. `node dev/tools/import-model.mjs --check` must pass.
6. Run every check below. If the parity test fails, the model changed in a
   way `CONDITIONS.json` does not cover yet: fix the rule, not the copy. If a
   runtime test fails, the toolkit code must follow the model's new format.
7. Raise the version of the `toolkit` plugin (see Versions). Existing
   projects pick up the change with `toolkit sync` (the `project-setup`
   skill: "update the toolkit").

Full install rules: `plugins/toolkit/templates/TEMPLATE-LANGUAGE.md`.

## Checks to run before you hand work back

Run them from the repository root.

```bash
node --test 'plugins/toolkit/tests/**/*.test.mjs'
node --test 'plugins/git-workflows/tests/*.test.mjs'
node dev/tools/check-skills.mjs
node dev/tools/import-model.mjs --check
claude plugin validate .
claude plugin validate ./plugins/toolkit
```

- Run `claude plugin validate` on every plugin folder you changed. Validating
  the root checks only the manifests; a plugin folder run also checks its
  hooks, skills, and agents.
- Keep the quotes around the test pattern. `node --test plugins/toolkit/tests/`
  (a folder name) fails on the Node 25 installed here, because Node reads it as
  one file.
- The Hindsight tests use the local server at `127.0.0.1:8888` and are skipped
  when it is down. They create and delete only banks named `tkv2-test-...`.
  `TOOLKIT_SLOW=1` also runs the slow `find --reflect` test.
- `TOOLKIT_NOTION_LIVE=1` runs the Notion tests against the private Notion test
  area named in `dev/test-runs/notion-test-area.json`, never against Mike's
  real "AI Agent Second Brain" page. The Lore layout checks run by hand:
  `TOOLKIT_NOTION_LIVE=1 node plugins/toolkit/tests/notion/live/run-lore-live.mjs`
  (results: `dev/test-runs/lore-layout.md`).
- `TOOLKIT_LORE_CLONE=<built Lore clone>` also runs the test that compares
  `lore-schema.mjs` with Lore's own code. Run it before moving to a newer Lore.
- Codex has no validate command. To prove Codex accepts the packages, install
  them into a scratch Codex home, never Mike's own:
  `CODEX_HOME=<scratch folder> codex plugin marketplace add <this folder>`, then
  `CODEX_HOME=<scratch folder> codex plugin add <plugin>@toolkit-v2`.
  `CLAUDE_CONFIG_DIR=<scratch folder>` does the same for Claude Code installs.

## Rules

- **No AI credit anywhere.** No "Generated with" line, no `Co-Authored-By`
  naming an AI, and no AI named in a comment, file header, manifest, README, or
  pull request.
- **Plain English.** Every file, message, and skill uses short sentences, real
  names, and no metaphors. Agents carry their own writing rules, because
  subagents and Codex never see the output style.
- **Never edit a generated file by hand.** In this repository: everything
  under `plugins/toolkit/scaffold/model/`, which `node dev/tools/import-model.mjs`
  rebuilds from the model. A change to a project file is a change to the model,
  made by Mike or with his approval, then imported. In projects the toolkit
  writes `.work-items/DASHBOARD.md`, `.work-items/.toolkit-state.json`,
  `.memory/MEMORY.md`, and `ai-external-knowledge/INDEX.md`; the pre-tool hook
  refuses hand edits of them.
- **`dev/` is not shipped.** Claude Code and Codex install only
  `plugins/<name>/`. Shipped code never reads a file under `dev/` when it runs;
  a comment may cite one. A plugin also cannot use a file outside its own
  folder.
- **Instruction files.** This repository has no `CLAUDE.md`: a `CLAUDE.md`
  here would stop Claude Code from reading this `AGENTS.md`. Projects get what
  the model has: one root `CLAUDE.md` holding only `@AGENTS.md`, plus the
  model's `AGENTS.md` files. Never delete `plugins/toolkit/scaffold/model/CLAUDE.md`.
- **Node 20 or newer, no npm dependencies.** Code is ES modules (`.mjs`).
  `bin/toolkit` stays a small CommonJS file that loads `lib/cli.mjs`. No
  `package.json` with a lockfile at a plugin root.
- **Two hook files.** `hooks/hooks.json` is for Claude Code (exec form:
  `"command": "node"` plus `"args"`). `hooks/codex-hooks.json` is for Codex
  (one shell string per command, anchored regex matchers, and only
  `description` and `hooks` at the top level, so no `$schema`). Any change to a
  Codex hook means Mike must trust it again in Codex `/hooks`; say so.
- **Versions.** Both manifests of a plugin carry the same `name` and
  `version`. Codex runs a copy filed under the version, so bump `version` in
  both manifests (and `metadata.version` in `.claude-plugin/marketplace.json`)
  for any change Codex must see. Claude Code reads the folder in place.
- **Adding or renaming a plugin** means changing both marketplace files, the
  `V2_PLUGINS` list in `plugins/toolkit/lib/project/hosts.mjs`, and the
  `README.md` table.
- **Skills.** `name` equals the folder name. The frontmatter holds only `name`
  and `description`, and the description matches `dev/SKILL-INDEX.md` section
  1 word for word. No `when_to_use`, `` !`command` ``, `$ARGUMENTS`, or
  `${CLAUDE_*}`: Codex shows them as literal text. `check-skills.mjs` checks
  all of this.
- **Skill descriptions** follow `dev/research/skill-writing-guide.md` Part 3
  (Mike, 2026-09-27): in single quotes, what the skill does, then when to use
  it, with two to four of the owner's example phrases, and a "Not for ...; use
  <skill>" clause only where a neighbor skill competes. After changing one,
  re-run the routing check (`dev/test-runs/skill-routing-r3.md` is the latest).
- **Read the documentation before building a Claude Code or Codex piece.** The
  captured pages are in this repository's `ai-external-knowledge/` (index:
  `INDEX.md`): `claude-code/`, `codex/`, `anthropic-agent-skills/`, and
  `anthropic-engineering/`. More Codex facts, with sources:
  `dev/research/platform-best-practices.md` part 3. Never edit a captured
  page; capture it again with Firecrawl and update its `SOURCE-RECORD.md`.
- **Notion memory uses Lore's layout.** Never rename or remove a property in
  `plugins/toolkit/lib/notion/lore-schema.mjs`; Lore finds its databases and
  columns by these exact names. The toolkit does not install or run Lore, and
  Lore's own saving and hooks stay off.
- **Read-only sources.** Never change
  `/Users/michaelrihm/Documents/Projects/claude-toolkit`,
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`, or
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
  A change to the model needs Mike's approval and goes on a branch of the
  model's own Git repository, never into his checkout.
- **Tests stay in scratch folders.** Point `HOME`, `CLAUDE_CONFIG_DIR`,
  `CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` at a temporary folder. Never write
  to Mike's real `~/.claude`, `~/.codex`, Notion page, or Hindsight banks.
- **Git.** Several agents may work in this folder at once. Change only the
  files you were given. Stage paths by name; never `git add -A`, `git add .`,
  or `git commit -a`. No GitHub repository until Mike says yes.
