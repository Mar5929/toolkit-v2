# AGENTS.md: working on Toolkit V2

This repository builds Toolkit V2 for Mike Rihm, a solo developer. The agent
runs each of his projects; Mike only decides and steers. `README.md` explains
it for Mike.

Toolkit V2 is rules, skills, and three small hooks. There is no custom
program (Mike, 2026-09-29). It ships as one plugin, `toolkit`, for Claude Code
and Codex, with one skill, `project-setup`. That skill sets up a project by
copying files: the model project, the skills for the owner's choices, the
three hook commands, and the settings. Each tool is used its own way: plain
files and Obsidian, Notion through `ntn` or the Notion connector, GitHub
through `gh`, and Hindsight through its own MCP tools.

## Read first

- `dev/GOAL.md`: Mike's goal and his decisions. Read "Goal and finish list"
  at the top, then "Interview answers". His words there win over every other
  file.
- `dev/research/skills-first-architecture.md` (draft 2): the design.
  `dev/GOAL.md` wins where they differ.
- `dev/HISTORY.md`: how the project got here, including why the program was
  retired. Read it before you propose anything bigger than a skill edit.
- `dev/PROGRESS.md`: what is done, what is in progress, and the next step.
  Update it before you stop.
- `dev/SKILL-INDEX.md`: every skill, its folder, and its description.
- `dev/research/skill-writing-guide.md`: the rules for skill names,
  descriptions, and bodies, each with its source page.
- `dev/ARCHITECTURE.md` describes the retired program. Read it only for
  history.

## Layout

`<setup>` is `plugins/toolkit/skills/project-setup/`.

| Path | What is there |
| --- | --- |
| `.claude-plugin/marketplace.json` | The `toolkit-v2` marketplace for Claude Code. It lists one plugin, `toolkit`. |
| `.agents/plugins/marketplace.json` | The same marketplace for Codex, with `policy` and `category`. |
| `plugins/toolkit/.claude-plugin/plugin.json` | The Claude Code manifest. |
| `plugins/toolkit/.codex-plugin/plugin.json` | The Codex manifest: the same `name` and `version`, `"skills": "./skills/"`, and an `interface` block. |
| `<setup>SKILL.md`, `<setup>references/` | Onboarding, "check the setup", and "update the toolkit". |
| `<setup>assets/model/` | An exact copy of Mike's model project. Never edited by hand (see "The model project and its copy"). |
| `<setup>assets/.shared-skills/<name>/` | The 13 skills every project gets. |
| `<setup>assets/.skill-sets/<set>/<name>/` | One work tracking set and one memory set per project: `local-work`, `notion-work`, `github-work`, `local-memory`, `notion-memory`. |
| `<setup>assets/.salesforce/sf-architect-solutioning/` | The Salesforce architect skill. Its description was rewritten on 2026-09-27, and its body was reworded and given a "Which phases to run" section on 2026-09-30, both with Mike's yes. The model holds the other three Salesforce skills. |
| (the three folders above) | Their names start with a dot on purpose. Codex loads every `SKILL.md` under a plugin's `skills/` folder as a plugin skill, in every folder on the computer, but skips folders whose names start with a dot. Without the dot, 23 project skills would load machine-wide. Tested in scratch Codex homes with and without the dots: `dev/test-runs/codex-dot-folders.md`. |
| `<setup>assets/hooks/` | The three hook commands: `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`. |
| `<setup>assets/settings/` | The snippets onboarding merges into a project's `.claude/settings.json`, `.codex/hooks.json`, and `.codex/config.toml` for each choice. |
| `ai-external-knowledge/` | Official Claude Code, Codex, Agent Skills, and Anthropic engineering pages, captured with Firecrawl. `INDEX.md` lists them; each folder's `SOURCE-RECORD.md` gives every page's web address. Not shipped. |
| `dev/` | Goal, progress, design, research, diagrams, test runs, tools, and tests. Not shipped. |
| `dev/build-shared/` | The source of every text several skills hold word for word: `git-rules.md`, `helper-briefs/`, and the texts the Notion, GitHub, and local memory sets share, in `notion/`, `github/`, and `local-memory/`. |
| `dev/tools/check-skills.mjs` | Checks every skill `project-setup` ships (see "Checks"). |
| `dev/tools/check-rules.mjs` | Checks the model's rule files against Claude Code's guidance for rules (`dev/research/rules-best-practices.md`). |
| `dev/tools/rule-lint.mjs` | The checks `check-rules.mjs` runs, and the `AGENTS.md` rules list the rule files give. Dev only: nothing under `plugins/` imports it. |
| `dev/tests/hooks.test.mjs` | Tests the three hook commands and the settings snippets in scratch folders. |
| `.claude/settings.json` | Settings for sessions working on this repository. `claudeMdExcludes` stops the model copy's `CLAUDE.md`, `AGENTS.md` files, and rules from loading as instructions here: they are for projects, not for this repository. |

What a project gets from onboarding:

- the model's files, minus the parts for choices it did not make;
- the skills in `.claude/skills/<name>/`, with `.agents/skills` as a link to
  `.claude/skills`, so both hosts read one copy (Codex follows the link);
- the hook commands in `.claude/hooks/`, and the hooks in
  `.claude/settings.json` (Claude Code) and `.codex/hooks.json` (Codex);
- its settings in `PROJECT.md`, section "Toolkit settings".

## The model project and its copy

The model project is the exact source for every project file (`dev/GOAL.md`).
The toolkit ships an exact copy of it in `<setup>assets/model/`.
`project-setup` applies the owner's choices while it copies; the copy itself
is never changed by hand.

- The model is Mike's Git repository at
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`. The
  approved changes are on its branch `toolkit-v2/approved-changes`, checked
  out at `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
  Until Mike merges that branch, copy from the second folder.
- The setup markers in the model's `AGENTS.md`, `README.md`, `PROJECT.md`,
  and `.claude/rules/memory-review-and-save.md` (`<!-- if salesforce -->`,
  `<!-- if not salesforce -->`, `<!-- if tracker=... -->`,
  `<!-- if memory=... -->`, and `<!-- if tracker=local or memory=local -->`,
  each closed by `<!-- endif -->`) and the rules list between
  `<!-- toolkit:rules:start -->` and `<!-- toolkit:rules:end -->` are
  resolved by the agent during setup, following `<setup>references/setup-copy.md`.
  A new marker form in the model also needs a row in that file's "Setup
  markers" table.
- Some skill templates are copies of model files (`dev/SKILL-INDEX.md`,
  section 7). `check-skills.mjs` fails when one differs from the model copy.

### Refresh the model copy

1. Read the change in the model folder. Never write there.
2. Note the model's branch and commit, and whether it has uncommitted edits:
   `git -C <model folder> log -1 --oneline` and
   `git -C <model folder> status --short`. Uncommitted edits are copied too;
   tell Mike when there are some.
3. Copy it:
   `rsync -a --delete --exclude .git --exclude .vscode --exclude .sfdx --exclude __pycache__ --exclude '*.pyc' --exclude .DS_Store <model folder>/ plugins/toolkit/skills/project-setup/assets/model/`
   The excluded files are local to one computer, and project-setup's "Never
   copied" list removes them anyway (approved model change 22).
4. The model's `.gitignore` is copied too, and it hides the copy's `memory/`
   and `work-items/` templates from this repository's Git. Stage new files
   there with `git add -f <path>`, by name, or a clean clone sets up projects
   without those templates.
5. Copy each model template a skill holds over its skill copy (the list is in
   `dev/SKILL-INDEX.md`, section 7).
6. Run every check below. A failure in a skill means the skill must follow
   the model's new format; never change the copy to make a check pass.
7. Raise the plugin version (see Rules, "Versions"). Existing projects get
   the change when the owner says "update the toolkit" in each one.

## Checks

Run them from the repository root before you hand work back.

```bash
claude plugin validate .
claude plugin validate ./plugins/toolkit
node dev/tools/check-skills.mjs
node dev/tools/check-rules.mjs --dir plugins/toolkit/skills/project-setup/assets/model
node --test 'dev/tests/*.test.mjs'
```

- `claude plugin validate .` checks the marketplace; `./plugins/toolkit`
  checks the plugin, its manifest, and its skill.
- `check-skills.mjs` checks project-setup and every skill under it: only
  `name` and `description` in the frontmatter, `name` equal to the folder,
  the description's shape and its row in `dev/SKILL-INDEX.md`, every file
  linked from `SKILL.md`, no link leaving the folder, a contents list in
  every reference over 100 lines, no command of the retired program, every
  shared copy equal to its source, and every model template copy equal to
  the model. It also checks that the Next action prompt in the Notion work
  item page matches the model's `WORK-ITEM.md`. `--model <folder>`
  checks against another model folder, such as the model worktree before a
  refresh. Warnings are on text that is Mike's (the model's own skills, and
  the body of `sf-architect-solutioning`): they do not fail the run.
- Keep the quotes around the test pattern, so Node reads it, not the shell.
  A folder name instead of a pattern fails on the Node 25 installed here.
- Codex has no validate command. To prove Codex accepts the plugin, install
  it into a scratch Codex home, never Mike's own:
  `CODEX_HOME=<scratch folder> codex plugin marketplace add <this folder>`,
  then `CODEX_HOME=<scratch folder> codex plugin add toolkit@toolkit-v2`.
  `CLAUDE_CONFIG_DIR=<scratch folder>` does the same for Claude Code.

## Rules

- **No AI credit anywhere.** No "Generated with" line, no `Co-Authored-By`
  naming an AI, and no AI named in a comment, file header, manifest, README,
  commit, or pull request.
- **Plain English.** Every file, message, and skill uses short sentences,
  real names, and no metaphors. Skills and helper briefs carry their own
  writing rules, because helper agents and Codex never see the output style.
- **Code limit** (`dev/GOAL.md`, "Code limit"; Mike, 2026-09-30). The only
  code a project runs is the three hook commands (`session-start.mjs`,
  `prompt-reminder.mjs`, `codex-after-commit.mjs`) and the model's own
  Salesforce code (its two guards, its graph Stop hook, and `tools/`). Each
  hook command does one job; can never break a session (on any error it
  prints one line and exits normally); needs nothing installed beyond Node
  (Node 20 or newer, ES modules, no npm dependencies); is covered by
  `dev/tests/hooks.test.mjs`; and stays short enough to read in one sitting.
  No other script goes into a skill or a project. A new command, or a new
  job for one, needs Mike's yes first, with its size in plain numbers: do not
  write it; stop and tell him.
- **Never edit the model copy by hand.** A change to a project file is a
  change to the model, made on the model branch with Mike's approval, then
  copied with the refresh steps above.
- **Shared texts.** Text several skills need is copied into each skill,
  because a skill reads only files inside its own folder. Edit the source in
  `dev/build-shared/`, then copy it over every copy (the first line of each
  copy names its source; `grep -rl 'dev/build-shared/<file>' plugins` lists
  them). Never edit a copy.
- **`dev/` is not shipped.** Claude Code and Codex install only
  `plugins/toolkit/`. Nothing shipped reads a file under `dev/`.
- **Skills.** A skill is a folder: `SKILL.md`, plus `references/`,
  `assets/` (templates), and `examples/` as needed. No scripts inside
  skills: steps are file edits, `git`, `gh`, `ntn`, or MCP tool calls.
  - The frontmatter holds only `name` (equal to the folder name) and
    `description`. No `when_to_use`, `$ARGUMENTS`, `` !`command` ``, or
    `${CLAUDE_*}`: Codex shows them as literal text.
  - The description is in single quotes and under 400 characters. It starts
    with a third-person verb saying what the skill does, then ", so ..."
    saying why, then "Use when ..." with two to four of the owner's own
    phrases, and "Not for ...; use <skill>." only where a neighbor skill
    competes. A set's skills say which projects they are for ("Only for
    projects that track work locally.").
  - The description matches `dev/SKILL-INDEX.md` word for word. After you
    change one, run the routing test again in both hosts.
  - `SKILL.md` is short: the steps, then a References table that links every
    file in the folder with when to open it. A reference over 100 lines
    starts with a `## Contents` list. A skill reads only files inside its own
    folder, never `../`.
  - Shared skills never assume one tracker or memory. They say "the
    project's work track skill", "memory save skill", or "memory find skill" (`AGENTS.md` names which one a project has), and for
    Hindsight memory "Hindsight's retain and recall tools, as the memory rule
    says".
- **Wording and overlap review** (Mike, 2026-09-30). New or changed text in
  a skill, reference, template, example, helper brief, or
  `dev/build-shared/` source is reviewed by a separate agent against
  `dev/reviews/wording-review.md` before it is committed: plain, clear,
  concise, no jargon, no figurative language, and one meaning for every
  instruction unless the text says the agent should use its judgment. The
  writer fixes each verified finding and the reviewer reads the fix. A new
  or changed description, skill name, or model routing line also gets a
  review against `dev/reviews/overlap-review.md`, then the routing test in
  both hosts. Every change to a skill, rule, hook, settings snippet, or
  the model's `AGENTS.md` also gets a review against
  `dev/reviews/best-practices-review.md`: grounded in the official Claude
  Code and Codex pages, out of the box, and nothing Mike must remember
  (Mike, 2026-09-30). Every workflow that edits skill text includes these
  steps.
- **Adding, renaming, or removing a skill** changes its folder,
  `dev/SKILL-INDEX.md`, `<setup>references/skills-hooks-settings.md`,
  `README.md`, and the routing lines in the model's `AGENTS.md`. The last one
  is a model change and needs Mike's yes.
- **Hooks.** A project's Claude Code hooks are in `.claude/settings.json` and
  its Codex hooks in `.codex/hooks.json` (only `description` and `hooks` at
  the top level). The snippets in `<setup>assets/settings/` must match the
  hook commands; `dev/tests/hooks.test.mjs` checks both. `work-items/` and
  `memory/` are kept out of Git, so they exist only in the main checkout:
  `session-start.mjs` finds it with `git rev-parse --git-common-dir`, and so
  works from inside a Git worktree. Any change to a Codex hook means Mike
  must trust it again in Codex `/hooks`; say so.
- **Versions.** Both manifests carry the same `name` and `version`. Every
  shipped change raises `version` in both, and `metadata.version` in
  `.claude-plugin/marketplace.json`.
  - Codex runs its own copy, filed under the version
    (`~/.codex/plugins/cache/toolkit-v2/toolkit/<version>`). A change reaches
    Codex only after the version is raised and `codex plugin add
    toolkit@toolkit-v2` runs.
  - Claude Code runs a plugin from a marketplace that is a local folder in
    place, not pinned by its version
    (`ai-external-knowledge/claude-code/plugins-manifest-reference.md`).
    Mike's `toolkit-v2` marketplace is the main checkout,
    `/Users/michaelrihm/Documents/Projects/toolkit-v2`, so a saved edit under
    `plugins/` there reaches his Claude Code at its next session start.
    `claude plugin marketplace update toolkit-v2` and
    `claude plugin update toolkit@toolkit-v2` refresh its cached copy.
  - Projects hold their own copies of the skills and hooks. They change only
    when the owner says "update the toolkit" in each project.
  - Each install command changes Mike's own setup, so ask him first.
- **Machine-wide plugin** (Mike, 2026-09-28, and draft 2): `toolkit` is on
  for every folder in both hosts. It holds only `project-setup` and no hooks,
  so "set up this project" works in an empty folder and nothing runs in
  other projects.
- **Rule files** live in the model and follow
  `dev/research/rules-best-practices.md` Part 1: one topic per file, a `# `
  heading, one specific instruction per bullet, `paths` frontmatter only
  where the rule is about certain files, short always-on rules, and
  procedures in skills. A change to a rule is a model change; a change to a
  rule's meaning waits for Mike's yes. The 4 KB limit for an always-on rule
  is proposed, not decided, so `check-rules.mjs` only warns on it. Never cut
  Mike's words to meet it.
- **Read the documentation before building a Claude Code or Codex piece.**
  The captured pages are in `ai-external-knowledge/` (`claude-code/`,
  `codex/`, `anthropic-agent-skills/`, `anthropic-engineering/`). More Codex
  facts, with sources: `dev/research/platform-best-practices.md` part 3.
  Never edit a captured page; capture it again with Firecrawl and update its
  `SOURCE-RECORD.md`.
- **Notion memory uses Lore's layout.** Never rename or remove a Lore
  database or property: Lore finds them by their exact names. The layout is
  in `<setup>references/notion-build/` (`lore-layout.md` and `lore/`). The toolkit does not install or run Lore, and Lore's own
  saving and hooks stay off. Before moving to a newer Lore, compare that
  layout list with Lore's `src/notion/schema.ts` again.
- **Notion tests** run only in the private Notion test area named in
  `dev/test-runs/notion-test-area.json`, never on Mike's real "AI Agent
  Second Brain" page unless he says yes.
- **Hindsight memory has no toolkit skills.** The agent uses Hindsight's own
  `retain`, `recall`, and `reflect` tools, tags each memory `wi:<ID>`, and
  keeps Current State in the local file `memory/CURRENT_STATE.md`. Tests use
  only banks made for the test, never Mike's own.
- **Jira is deferred** by Mike: no Jira skills now.
- **Read-only sources.** Never change
  `/Users/michaelrihm/Documents/Projects/claude-toolkit` or
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project` (Mike's
  own model checkout). A model change needs Mike's approval and goes on the
  branch `toolkit-v2/approved-changes`, in the worktree
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
  Write there only for a change Mike approved, commit it as Mike Rihm, stage
  paths by name, and add no AI credit.
- **Tests stay in scratch folders.** Point `HOME`, `CLAUDE_CONFIG_DIR`, and
  `CODEX_HOME` at a temporary folder. Never write to Mike's real `~/.claude`,
  `~/.codex`, Notion pages, or Hindsight banks.
  - Live test sessions sign in through two fixed test homes:
    `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude` and
    `CODEX_HOME=~/.toolkit-v2-test-homes/codex` (made 2026-09-30, so Mike
    signs in once, not once per session). Reuse them in every session;
    never make a new signed-in home in a scratchpad or `/tmp`, because
    those are emptied and Mike would have to sign in again. Signing in is
    Mike's step (`claude auth login` or `codex login` with the variable
    set); never copy his own sign-in files.
  - Never delete either folder. Between tests, remove only the plugins,
    marketplaces, and settings the last test added (`claude plugin` and
    `codex plugin` commands with the variable set).
- **Instruction files.** This repository has no `CLAUDE.md`: a `CLAUDE.md`
  here would stop Claude Code from reading this `AGENTS.md`. Projects get
  what the model has: one root `CLAUDE.md` holding only `@AGENTS.md`, plus
  the model's `AGENTS.md` files. Never delete the model copy's `CLAUDE.md`.
- **Git.** Several agents may work in this repository at once. Change only
  the files you were given. Stage paths by name; never `git add -A`,
  `git add .`, or `git commit -a`. The GitHub repository is
  `Mar5929/toolkit-v2` (private); the work is tracked in its issue #1. Push
  `main` only with Mike's yes.
