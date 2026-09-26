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
| `plugins/work/` | Nine work skills, six agents, and `references/`. |
| `plugins/memory/` | Three memory skills. |
| `plugins/session-skills/` | Five conversation skills and the `handoff-verifier` agent. |
| `plugins/git-workflows/` | Four Git skills and their tests. |
| `plugins/sf-architect-solutioning/` | The Salesforce architect skill, ported with its body unchanged. |
| `dev/` | Goal, progress, plan, skill index, research, tools, and test runs. Not shipped. |

## Checks to run before you hand work back

Run them from the repository root.

```bash
node --test 'plugins/toolkit/tests/**/*.test.mjs'
node --test 'plugins/git-workflows/tests/*.test.mjs'
node dev/tools/check-skills.mjs
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
  real "AI Agent Second Brain" page.
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
- **Never edit a generated file by hand.** In this repository:
  `plugins/toolkit/scaffold/MANIFEST.json` (its `description` names the tool
  that rebuilds it). In projects the toolkit writes `.work-items/DASHBOARD.md`,
  `.work-items/.toolkit-state.json`, `.memory/MEMORY.md`, and
  `ai-external-knowledge/INDEX.md`; the pre-tool hook refuses hand edits of
  them.
- **`dev/` is not shipped.** Claude Code and Codex install only
  `plugins/<name>/`. Shipped code never reads a file under `dev/` when it runs;
  a comment may cite one. A plugin also cannot use a file outside its own
  folder.
- **`AGENTS.md` only.** No `CLAUDE.md` anywhere: not in this repository, not in
  the scaffold. A `CLAUDE.md` stops Claude Code from reading `AGENTS.md`.
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
- **Read the documentation before building a Claude Code piece.** The captured
  Claude Code pages are in
  `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/claude-code/`
  (index: its `README.md`). Codex facts, with sources:
  `dev/research/platform-best-practices.md` part 3.
- **Read-only sources.** Never change
  `/Users/michaelrihm/Documents/Projects/claude-toolkit` or
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`.
- **Tests stay in scratch folders.** Point `HOME`, `CLAUDE_CONFIG_DIR`,
  `CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` at a temporary folder. Never write
  to Mike's real `~/.claude`, `~/.codex`, Notion page, or Hindsight banks.
- **Git.** Several agents may work in this folder at once. Change only the
  files you were given. Stage paths by name; never `git add -A`, `git add .`,
  or `git commit -a`. No GitHub repository until Mike says yes.
