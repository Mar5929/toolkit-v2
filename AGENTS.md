# AGENTS.md: working on Toolkit V2

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

This repository builds Toolkit V2 for Mike Rihm, a solo developer. The agent
runs each of his projects; Mike only decides and steers. `README.md` explains
it for Mike.

All work on Toolkit V2 is tracked in Notion, in the Toolkit V2 project
(page ID `3edb381d-a176-81ee-b7dd-d0a6d662f9b2`). Its work items, with IDs
starting TKV, are in the Work Items data source
`b22b381d-a176-8301-a22c-0766e27d8dc9`.

Toolkit V2 is rules, skills, and four small hook commands. There is no
custom program (Mike, 2026-09-29). It ships as one plugin, `toolkit`, for
Claude Code and Codex. Its main skill is `project-setup`. That skill sets up
a project by copying files: the folder every project gets (with the shared
skills and the four hook commands), the folder for each of the owner's
choices (with its skills), and the settings. Each tool is used its own way: plain
files and Obsidian, Notion through `ntn` or the Notion connector, GitHub
through `gh`, and Hindsight through its own MCP tools.

The owner's list of outside tools is one plain file, `OUTSIDE-TOOLS.md`, in
the root of this repository (Mike, 2026-10-06). It names the outside tool he
uses for each kind of job, such as explainroo for explainer videos, and says
how to set each one up. It is not a skill, no plugin ships it, and it is
never copied into a project. From 2026-10-03 to 2026-10-06 it was a skill of
the `toolkit` plugin, `choosing-outside-tools` (work item TKV-18). The
toolkit ships none of those tools.

The `toolkit` plugin holds a second skill, `writing-harness-files` (Mike,
2026-10-05).
It tells an agent that writes or changes a harness file to get the current
official guidance first: from the agents and skills that Claude Code
provides for the job, and from the official page addresses when none is
available, and always for Codex. It also holds the checklist and the steps
for rewriting a file. Mike, 2026-10-06: "the `writing-harness-files` skill is
basically just supposed to point at the Claude documentation ... best
practices ... and tell it to use the installed skills". The writing rules
are not written there: they are in one rule ("Plain English" under Rules).
The skill holds an exact copy of it, `references/writing-rule.md`, which
`check-skills.mjs` compares with the rule. A harness file is a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. It is text only.

One exception (Mike, 2026-10-03): a second plugin, `workstreams`, for Claude
Code only. It is a mod: code that runs inside Claude Code and draws a side
panel. `/streams` lists the pieces of work the project's chats report, the
chat handling each one, and each chat's state. It uses no Notion. See
"Workstreams plugin" under Rules.

## Read first

- `dev/GOAL.md`: Mike's goal and his decisions. Read "Goal and finish list"
  at the top, then "Interview answers". His words there win over every other
  file.
- `dev/research/skills-first-architecture.md` (draft 2): the design.
  `dev/GOAL.md` wins where they differ.
- `dev/research/layout-audit/DESIGN-SPEC.md`: the one-home layout Mike
  approved on 2026-10-05: the project layout, the filing rule, and the one
  job of each skill. It wins over the draft above where they differ.
- `dev/HISTORY.md`: how the project got here, including why the program was
  retired. Read it before you propose anything bigger than a skill edit.
- `dev/PROGRESS.md`: what is done, what is in progress, and the next step.
  Update it before you stop.
- `dev/SKILL-INDEX.md`: every skill, its folder, and its description.
- `dev/research/skill-writing-guide.md`: the rules for skill names,
  descriptions, and bodies, each with its source page.
- `dev/ARCHITECTURE.md` describes the retired program. Read it only for
  history.
- `reference/how-the-owner-works-with-agents.md`: what Mike asks agents to
  do in his real projects, taken from his own session messages, one section
  per project. Read it before you propose a change to how a project runs.
- `reference/davis-memory-system.md`: how memory is kept in his Davis
  project, which he named as the example to follow: its parts, its rule word
  for word, and the 32 kinds of event that start its memory helper. Read it
  before you change how a project keeps memory or its Current State.

## Layout

`<setup>` is `plugins/toolkit/skills/project-setup/`.

| Path | What is there |
| --- | --- |
| `.claude-plugin/marketplace.json` | The `toolkit-v2` marketplace for Claude Code. It lists two plugins, `toolkit` and `workstreams`. |
| `.agents/plugins/marketplace.json` | The marketplace for Codex, with `policy` and `category`. It lists only `toolkit`: Codex cannot run a mod. |
| `plugins/workstreams/` | The `workstreams` plugin: its manifest, the mod in `hooks/register.tsx`, its tests in `hooks/register.test.tsx`, and the types of its stored values in `types/index.d.ts`. Claude Code writes `tsconfig.json` and `.claude-plugin/types/` there when it loads the plugin from this folder; `tsconfig.json` is kept in Git so it does not show as a new file, and the `types/` folder ignores itself. |
| `plugins/toolkit/.claude-plugin/plugin.json` | The Claude Code manifest. |
| `plugins/toolkit/.codex-plugin/plugin.json` | The Codex manifest: the same `name` and `version`, `"skills": "./skills/"`, and an `interface` block. |
| `<setup>SKILL.md`, `<setup>references/` | Onboarding, "check the setup", "update the toolkit", and the move-over for a project set up with the older toolkit or by hand (`references/move-over.md`, `references/old-toolkit-pieces.md`). `references/setup-copy.md` holds the one table of setup choices and the folders each one copies; the check tools read it. `references/placing-files.md`, "5. The pre-commit check", is the one place that says how `core.hooksPath` is set. `references/update.md` is "update the toolkit"; two parts of it are in their own files: `references/one-home-layout.md` brings a project set up before the one-home layout to it, and `references/earlier-versions.md` holds the changes from toolkit 0.6.0, 0.8.0, and 0.8.1. |
| `OUTSIDE-TOOLS.md` | The owner's list of outside tools: a table with one row per kind of job, and one section per tool (where it comes from, how to set it up, and the owner's choices). A plain file, not a skill. No plugin ships it, and it is never copied into a project. |
| `plugins/toolkit/skills/writing-harness-files/` | How to write or change a harness file: `SKILL.md` holds the steps and the one list of the kinds of harness file, `references/official-pages.md` says how to get the current official guidance (the agents and skills Claude Code provides first, then the web address of the official page for each kind), `references/checklist.md` holds the practices and the check for each kind, and `references/rewrite-steps.md` the steps and checks for rewriting a file that exists, with the prompt for a team. `references/writing-rule.md` is an exact copy of the rule `document-clarity-standard.md`, which holds all the writing rules; `check-skills.mjs` fails when the copy and the rule differ. Never copied into a project. |
| `<setup>assets/every-project/` | Everything every project gets, at the paths a project has: the project files (`AGENTS.md`, `PROJECT.md`, `DECISIONS.md`, the rules, `system/`, `sources/`, `delivery/`, `reference/`, the test plan template), the 9 shared skills in `.claude/skills/`, the four hook commands in `.claude/hooks/` (`session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, `validate-records.mjs`), and `.githooks/pre-commit`, which runs the fourth before each commit. Edited here directly (see "The starter project"). |
| `<setup>assets/work-local/`, `work-notion/`, `work-github/` | One folder per work tracking choice. Each adds the selected tracker references inside the shared `managing-work-items` skill. `work-local/` also holds `work-items/` (with its own `AGENTS.md` and `CLAUDE.md`) and `PROJECT-ROADMAP.md`. |
| `<setup>assets/memory-local/`, `memory-notion/`, `memory-process/`, `memory-hindsight/` | The memory choice. `memory-process/` holds the `managing-project-memory` skill and its common process references for local or Notion memory. `memory-local/` and `memory-notion/` add their selected storage references inside that skill; `memory-local/` also holds `memory/`: its own `AGENTS.md` and `CLAUDE.md`, `CURRENT_STATE.md`, `MEMORY.md` (the index the session-start hook rebuilds), and `project_topic_template.md`, the blank form for a memory record. `memory-hindsight/` holds one rule, `hindsight-memory.md`, and no skill. Hindsight takes it and only `memory/CURRENT_STATE.md` from `memory-local/`. |
| `<setup>assets/notion-tools/` | `using-notion-cli` and the rule `notion-records.md`, for every project with work items or memory in Notion. |
| `<setup>assets/salesforce/` | Everything only a Salesforce project gets: `sfdx-project.json`, `.forceignore`, the Salesforce templates inside `delivery/` (a folder every project has), `tools/`, the protected-orgs file, the two guards, the `sf-*` skills, `.codex/hooks.json`, and eleven rules. One of them, `salesforce-delivery.md`, holds the Salesforce lines for `delivery/` and loads only for files there (`paths: delivery/**`). |
| `<setup>assets/soul/` | `SOUL.md`, for a project whose owner keeps it. |
| `<setup>assets/owner-preferences.md` | The starting text of `.claude/rules/owner-preferences.md`, which every project gets. It is the one file every project gets that sits outside `every-project/`: from the first instruction on it is the owner's own file, so setup and "update the toolkit" copy it only into a project that has none, and never compare or replace it (`<setup>references/setup-copy.md`, "The owner-preferences rule"). `check-rules.mjs` counts its size with the rules. |
| Why skills sit under `.claude/` | Every folder holds its skills under `.claude/skills/`, and `.claude` starts with a dot. Codex loads every `SKILL.md` under a plugin's `skills/` folder as a plugin skill, in every folder on the computer, unless a parent folder's name starts with a dot. So the 14 possible project skill names stay out of Codex outside a project. Tested in a scratch Codex home: `dev/test-runs/one-folder-per-choice.md` and `dev/test-runs/setup-update-and-tools.md`; the first test, with the older folder names, is `dev/test-runs/codex-dot-folders.md` in Git history. Claude Code is different: it loads a skill in a `.claude/skills/` folder below the session's folder once the agent reads or edits a file there, so `.claude/settings.json` turns the project skills off for this repository (last row). |
| `<setup>assets/settings/` | The snippets onboarding merges into a project's `.claude/settings.json`, `.codex/hooks.json`, and `.codex/config.toml` for each choice. |
| `ai-external-knowledge/` | Official pages, captured with Firecrawl, one folder per source: `claude-code/`, `codex/`, `openai-plugins/`, `anthropic-agent-skills/`, `anthropic-engineering/`, and `hindsight/`. `INDEX.md` lists them; each folder's `SOURCE-RECORD.md` gives every page's web address and capture date. Not shipped. |
| `reference/` (root of this repository) | `how-the-owner-works-with-agents.md`: the record of what Mike asks agents to do in his real projects, with his own words. It names people by role only. Add a section for each project that is studied. `davis-memory-system.md`: how the memory system of his Davis project works, as its files were on 2026-10-07. Not shipped (Mike, 2026-10-07: "I don't want it to be buried under 'dev'"). |
| `dev/` | Goal, progress, design, research, diagrams, test runs, tools, and tests. Not shipped. |
| `dev/build-shared/` | The source of every text several skills hold word for word: today only `helper-briefs/handoff-verifier.md`. One copied text has its source elsewhere: the writing rule ("Shared texts" under Rules). |
| `dev/tools/check-skills.mjs` | Checks every skill the `toolkit` plugin holds and every skill `project-setup` copies into a project, and the setup folders (see "Checks"). |
| `dev/tools/check-rules.mjs` | Checks the model's rule files against Claude Code's guidance for rules (`dev/research/rules-best-practices.md`). |
| `dev/tools/rule-lint.mjs` | The checks `check-rules.mjs` runs, and the rules list that the `AGENTS.md` of a project set up before the one-home layout holds. Dev only: nothing under `plugins/` imports it. |
| `dev/tests/hooks.test.mjs` | Tests the first three hook commands and the settings snippets in scratch folders, and the size limit of every hook command. |
| `dev/tests/validate-records.test.mjs` | Tests `validate-records.mjs`: a new project gives no finding, each of the 15 checks reports a broken record, and a real `git commit` is stopped through `.githooks/pre-commit`. It is at its size limit. |
| `dev/tests/validate-records-cases.test.mjs` | More tests for `validate-records.mjs`, from the second review: a record saved to the default branch and then named in a work item, with a remote and from a worktree; a work item that still holds the template's prompts; text in backticks; a source kept outside Git; an edit in another repository; a closed output; an unreadable record; and the first line of the findings in each mode. From the review of those fixes: a record written in a save worktree by a session that works in its own worktree, and an unreadable record in the main checkout. New cases go here. |
| `dev/tests/org-guard.test.mjs` | Tests the Salesforce org guard, `guard-protected-orgs.cjs`, with the `salesforce` folder's `protected-orgs.json`, in a scratch folder with a stand-in `sf`. No org is reached. |
| `dev/tests/permission-set-guard.test.mjs` | Tests the second Salesforce guard, `guard-permission-set-deploy.cjs`, in a scratch folder. No org is reached. |
| `.claude/settings.json` | Settings for sessions working on this repository. `claudeMdExcludes` stops the `CLAUDE.md`, `AGENTS.md` files, and rules in every folder of `<setup>assets/` from loading as instructions here: they are for projects, not for this repository. `skillOverrides` sets each of the 14 project skill names to `"off"`, so a session that reads a file under `<setup>assets/` does not get the project skills. It matches by name, so add a new project skill's name there: `check-skills.mjs` fails when the list and the project skill names differ. It does not touch the `toolkit` plugin's own skills. Both settings were tested in a session started in a worktree on 2026-10-05: `dev/test-runs/fix-pass-setup-and-tools.md`. |

What a project gets from onboarding:

- the files of `every-project/` and of the folder for each choice it made;
- the skills in `.claude/skills/<name>/`, with `.agents/skills` as a link to
  `.claude/skills`, so both hosts read one copy (Codex follows the link);
- the hook commands in `.claude/hooks/`, the hooks in
  `.claude/settings.json` (Claude Code) and `.codex/hooks.json` (Codex),
  and `.githooks/pre-commit`, with `core.hooksPath` set to `.githooks` in
  that copy of the repository;
- its settings in `PROJECT.md`, section "Toolkit settings".

## The starter project

The folders under `<setup>assets/` (`every-project/`, then one folder per
choice) together are the starter project: the source for every project
file. Older text, the check tools, and the rules below also call it "the
model".
Mike, 2026-10-02: his model folder outside this repository "is sort of just
like a throwaway folder ... as long as we have the structure set up properly
in V2". So edit these folders directly, and never copy his outside model
folder in again. A change that alters what a project file means still needs
his yes. `project-setup` copies `every-project/`, then the folders for the
owner's choices. `<setup>references/setup-copy.md`, "Folders the choices
add", is the only table of choices and folders; a new folder under
`<setup>assets/` needs a row there, and `check-skills.mjs` fails without it.

- Every project gets `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and
  `reference/` as files in its repository, whatever its tracker and memory
  (Mike, 2026-10-05). Notion databases for decisions and sources are a
  later, separate work item. `project-wide-records/`, `requirements/`,
  `system-guide/`, and `ai-external-knowledge/` are no longer in the model.
- Memory is the Davis-based design Mike built, restored on 2026-10-05
  (`dev/research/layout-audit/MEMORY-RESTORE-SPEC.md`): Current State, and
  one record per concept in four kinds (`user_`, `project_`, `reference_`,
  `event_`). It holds only what no other project file holds. A decision
  more than one work item needs is in `DECISIONS.md`, a project term in
  `system/glossary.md`, and how the system works in `system/` or
  `reference/current-system/`: memory has no decision records, no decision
  template, and no glossary. Every record carries the date it was created
  and the date it last changed, and a record that is true only for a while
  carries a "check or remove by" date. A work item holds no original: every
  original goes to `sources/`, and the item holds its SRC ID (Mike,
  2026-10-05).

- A choice decides which files a project gets, never which lines inside a
  file (Mike, 2026-10-05). A folder holds files at the paths a project has
  them. A file every project gets goes in `every-project/`; a file for one
  choice goes in that choice's folder. A project path is in one folder. The
  exception is a reference file the choices alternate:
  `managing-work-items/references/work-tracker.md` in `work-local/`,
  `work-notion/`, and `work-github/`, and
  `managing-project-memory/references/memory-store.md` in `memory-local/`
  and `memory-notion/`.
  `check-skills.mjs` fails on any other path in two folders.
- The model's root `AGENTS.md` and its folder `AGENTS.md` files hold no
  setup marker and no generated rules list: they read the same in every
  project. What differs by choice is in a file only that choice gets
  (`hindsight-memory.md`, `notion-records.md`, `salesforce-project.md`,
  `salesforce-delivery.md`, `work-items/AGENTS.md`, `memory/AGENTS.md`).
- No file under `<setup>assets/` holds a setup marker (`<!-- if ... -->`,
  `<!-- endif -->`): `check-skills.mjs` fails on one. Setup fills only
  blanks: the project name, the prompts the owner answers, and the 11 lines
  of "Toolkit settings" in `PROJECT.md`, which are the same lines in every
  project (a line for a choice the owner did not make holds `not used`).
  The settings files (`.claude/settings.json`, `.codex/hooks.json`,
  `.codex/config.toml`) are machine settings: setup still merges them and
  takes the Salesforce entries out of a project that is not a Salesforce
  project.
- `every-project/.ignore` is a project file (added 2026-10-05, for Mike to confirm). It holds two lines that make ripgrep, and with it Claude Code's Grep and Glob tools, read `work-items/` and `memory/`, which `.gitignore` hides from them. Without it a session that searched the project missed an earlier record in a work item in 2 of 2 live runs; with it, it found the record (`dev/test-runs/memory-restore.md`). It changes nothing in this repository: `every-project/` holds neither folder.
- `every-project/.gitignore` is a project file. It keeps the lines
  `/memory/`, `/work-items/`, and `/working-files/`, which apply only inside
  `every-project/`, where none of the three folders exists. So `memory-local/memory/` and `work-local/work-items/` are
  not hidden from this repository's Git: stage a new file there by name.
- Some skill templates are copies of model files (`dev/SKILL-INDEX.md`,
  section 8). `check-skills.mjs` fails when one differs from its project
  file: change both together.
- After a change, run every check below and raise the plugin version.
  Existing projects get it when the owner says "update the toolkit".

## Checks

Run them from the repository root before you hand work back.

```bash
claude plugin validate .
claude plugin validate ./plugins/toolkit
claude plugin validate ./plugins/workstreams
claude plugin test ./plugins/workstreams
node dev/tools/check-skills.mjs
node dev/tools/check-rules.mjs
node --test 'dev/tests/*.test.mjs'
```

- `claude plugin validate .` checks the marketplace; `./plugins/toolkit`
  checks the plugin, its manifest, and its skill.
- `claude plugin validate ./plugins/workstreams` reads the mod the way
  Claude Code will and lists what it hooks and calls. `claude plugin test`
  runs `hooks/register.test.tsx` without a session, on the terminal and the
  desktop app.
- `check-skills.mjs` checks project-setup, every skill under it, and the
  plugin's other skill (`writing-harness-files`): only
  `name` and `description` in the frontmatter, `name` equal to the folder
  and in the allowed form, the description's shape and its row in
  `dev/SKILL-INDEX.md`, a `SKILL.md` body under 500 lines, every file
  linked from `SKILL.md`, no link leaving the folder, a contents list in
  every reference over 100 lines, no command of the retired program (in the
  skills and in the hook commands of every setup folder), every shared copy
  equal to its source, every template copy equal to its project file, and
  the copy of the writing rule in `writing-harness-files` equal to the rule
  (its `RULE_COPIES` list: the copy is one comment line that names the
  rule, a blank line, and then the rule's whole text).
  - It reads the setup folders from the table in
    `<setup>references/setup-copy.md`, "Folders the choices add". It fails
    when a folder under `<setup>assets/` other than `settings/` is in no
    row, when a folder other than `notion-tools` and `memory-process` is
    in two rows, when a word of such a folder's name is not in its row's
    Choice cell (a setup folder is named for its choice, so `work-github`
    in the row "Work items local" fails), when a project path is in two
    setup folders (apart from the selected references inside the two merged
    skills), and when any file under `<setup>assets/` holds a setup marker.
  - It fails when the skills table in
    `<setup>references/skills-hooks-settings.md` or the skill counts in
    `<setup>references/interview.md` differ from what the folders hold.
  - It fails when the `skillOverrides` list in this repository's
    `.claude/settings.json` does not set every project skill name to
    `"off"`, or names anything that is no project skill.
  - It fails when the Salesforce entries listed in
    `<setup>references/setup-copy.md`, "Salesforce entries in the settings
    file", differ from the `sf` and `sfdx` permission rules and the
    Salesforce hook commands in `every-project/.claude/settings.json`.
  - It checks that the Next action prompt in the Notion work item
    template's text (`<setup>references/notion-build/work-item-page.md`)
    matches `work-local/work-items/work-item-template/WORK-ITEM.md`.
  - Warnings are on text that is Mike's (the `sf-*` skills): they do not
    fail the run.
- `check-rules.mjs` puts every folder under `<setup>assets/` except
  `settings/` together in a scratch folder, as one project that has every
  choice, and checks that project's rules. Its `CHOICE_RULES` list is kept
  by hand: it says which setup folders hold rules only some projects get,
  and which choice gets them. It is a second copy of part of the table in
  `<setup>references/setup-copy.md`, so change both together. The tool
  fails when a folder for one choice holds rules and the list does not
  name it; nothing checks the choice written beside a folder.
- Keep the quotes around the test pattern, so Node reads it, not the shell.
  A folder name instead of a pattern fails on the Node 25 installed here.
- The checks and tests need LF line endings, because they split files at
  the line ends and compare copies byte for byte. `.gitattributes` in the
  root keeps LF in every checkout, also on Windows, where Git would
  otherwise write CRLF. A checkout made on Windows before that file was
  added still has CRLF. `check-skills.mjs` then stops and prints the two
  commands that fix the checkout.
- The tests run on Windows and on a Mac. `dev/tests/support.mjs` holds what
  differs between the two: the form of `PATH`, where `sh` is, and how a
  stand-in for a command such as `ntn` is made. A new test takes these from
  that file, and never writes `/bin/sh` or joins a `PATH` with `:` itself.
  Two tests in `validate-records-cases.test.mjs` are skipped on Windows,
  because `chmod` cannot make a file unreadable there.
- Codex has no validate command. To prove Codex accepts the plugin, install
  it into a scratch Codex home, never Mike's own:
  `CODEX_HOME=<scratch folder> codex plugin marketplace add <this folder>`,
  then `CODEX_HOME=<scratch folder> codex plugin add toolkit@toolkit-v2`.
  `CLAUDE_CONFIG_DIR=<scratch folder>` does the same for Claude Code.

## Rules

- **No AI credit anywhere.** No "Generated with" line, no `Co-Authored-By`
  naming an AI, and no AI named in a comment, file header, manifest, README,
  commit, or pull request.
- **Plain English.** Every skill, rule, agent guide, project document, and
  artifact follows the writing rule, `document-clarity-standard.md`.
  Prose uses whole sentences and real names. Artifact text uses the fewest
  clear words. Replies to the owner follow the output style. Text sent to
  another person follows `humanize-outbound-text.md`; an artifact sent to
  that person follows both rules. Helper agents and Codex never see the
  output style, so a helper's brief gives it the path of the writing rule.
  - The writing rule (Mike, 2026-10-06). He found the skill text hard
    to follow and agreed with this statement: "The skills are organized
    correctly and their rules are right. The wording is the problem: it was
    squeezed too short, and it uses project words without saying what they
    mean. Every skill should open with what it is for and its goal, explain
    each project word once, and use full sentences, without changing any
    rule." The cause was the earlier instructions to writers here, which
    asked for short and terse text. The writing rule replaces the earlier
    wording rule ("plain, terse, technical English"), also where
    `dev/research/layout-audit/DESIGN-SPEC.md`, point 19, still states it.
  - His correction the same day, after a trial rewrite kept a made-up word
    and put a definition in front of it: "Why did you feel like you needed
    to keep the word 'an original'? Isn't there a better way to just
    rewrite? We need to look at the file as a whole." So a writer starts
    from the whole file, and for each made-up word chooses in this order:
    plain words; a name the reader can already see, such as a folder name,
    a field name, or an ID prefix ("source" for something in `sources/`);
    and only then the word itself, explained once. A writer may regroup a
    file and rename a heading, and updates every file that cites it in the
    same change. The checks in the skill's `references/rewrite-steps.md`
    protect the rules, not a limit on what the writer may touch. An exact
    string that a tool or another file reads stays word for word.
  - One name for one thing still holds. A made-up word is a finding when
    plain words or a name the reader can already see would do.
  - A word decision that reaches past one file goes on the shared word
    list, `dev/reviews/word-list.md`, with one row per word: the word, the
    files that use it, the choice (plain words, a visible name, or keep and
    explain), and the text that takes its place. The first team that
    rewrites the skills makes the file. Every writer reads it before
    choosing, so every file changes the same way.
  - One place for the writing rules (Mike, 2026-10-06). All the writing
    rules are in one rule,
    `<setup>assets/every-project/.claude/rules/document-clarity-standard.md`,
    and only there. He approved its text: change a word of it only with his
    yes. On 2026-10-06 he renamed it from
    `write-documents-in-plain-english.md` to `document-clarity-standard.md`.
    Before that, it was `write-for-the-reader.md` for about two hours on the
    rewrite branch, a name no released version held, and it replaced
    `plain-english-artifacts.md`. `<setup>references/update.md`, "The renamed
    rule", replaces each old file in an existing project. No
    other file states a writing rule again: a file that needs one points to
    the rule.
  - The copy in the skill. He found a second, longer text of the writing
    rules in the `writing-harness-files` skill confusing, so that file
    (`references/writing-standard.md`) was deleted on 2026-10-06. A plugin
    skill reads only files in its own folder, and this one must work in a
    folder where the toolkit was never set up. So the skill holds
    `references/writing-rule.md`: one comment line that names the rule, a
    blank line, and then the rule's whole text. The rule is the source.
    Edit the rule, then copy it over the copy below those two lines; never
    edit the copy. `check-skills.mjs` fails when the two differ.
  - What the skill is for (Mike, 2026-10-06): "the `writing-harness-files`
    skill is basically just supposed to point at the Claude documentation
    ... best practices ... and tell it to use the installed skills". So the
    skill holds only what is about harness files: how to get the current
    official guidance (the agents and skills that Claude Code provides
    first, the page addresses when none is available and always for
    Codex), the checklist, and the rewrite steps.
  - Plain never means vaguer, and a name says its subject (Mike,
    2026-10-06). He rejected renames such as `memory-criteria.md` to
    `what-to-keep.md`. Apart from the rule above, no file, skill, or folder
    is renamed to make its name plainer.
  - "Session", never "chat" (Mike, 2026-10-06), for one run of work with
    the agent, in every file a project gets. A file the owner reads
    explains it once as "one chat with the agent".
  - Both "Current State" names stay (Mike, 2026-10-06). "The project's
    Current State" is the project's one short page of what is true now.
    "The work item's Current state" is the five lines at the top of a work
    item. Every file says which one it means, and never uses the bare name.
  - Guidance for writers describes the reader and the result and shows
    before-and-after examples. It is never a list of bans: he rejected one,
    because a ban could be read as "remove the statement of what the skill
    is and its goal".
- **Challenge the current design** (Mike, 2026-10-04). Inspect current files
  to understand existing behavior. Recommend the clearest end-to-end
  lifecycle, filing locations, record schemas, and procedures even when they
  differ from the current setup. Explain why and identify earlier owner
  decisions that a recommendation would revisit before changing the model.
- **Code limit** (`dev/GOAL.md`, "Code limit"; Mike, 2026-09-30). The only
  code a project runs is the four hook commands (`session-start.mjs`,
  `prompt-reminder.mjs`, `codex-after-commit.mjs`, and
  `validate-records.mjs`, which has its own bullet below), the pre-commit
  file that runs the fourth, and the model's own
  Salesforce code (its two guards, its graph Stop hook, and `tools/`). Each
  hook command does one job; can never break a session (on any error it
  prints one line and exits normally); needs nothing installed beyond Node
  (Node 20 or newer, ES modules, no npm dependencies); is covered by
  `dev/tests/hooks.test.mjs` (the fourth by the two files below); and stays
  short enough to read in one sitting.
  No other script goes into a skill or a project. A new command, or a new
  job for one, needs Mike's yes first, with its size in plain numbers: do not
  write it; stop and tell him.
  - A fourth command, `validate-records.mjs` (Mike's yes, 2026-10-05, work
    item TKV-24). It checks the form of a project's records with 15 checks
    (`dev/research/layout-audit/CHECKS-SPEC.md`): after each file edit in
    both hosts, when the agent stops in Claude Code, and before each
    commit. It only reads, and a finding goes to the agent as text with
    exit code 2. He was told about 220 lines plus about 220 lines of tests.
    It is 279 lines plus 279 lines of tests
    (`dev/tests/validate-records.test.mjs`), and he accepted that size on
    2026-10-05. A test fails when the command is over 280 lines, and the
    command never goes over that. Tell him the size again before it grows.
    The fixes after the second review and after the review of those fixes
    (2026-10-05) kept the command at 279 lines. Their tests are in a second
    file, `dev/tests/validate-records-cases.test.mjs` (242 lines), so the
    first test file stays at 279: tell him about those 242 lines of tests.
  - With it comes `.githooks/pre-commit`, a 6-line shell file every project
    gets (his yes with the same size, 2026-10-05). It runs the fourth
    command before a commit and stops the commit only on a finding. Git
    runs it once `core.hooksPath` is `.githooks` in that copy of the
    repository; `project-setup` sets that, and changes nothing when a
    project already has another hooks folder, or any hook of its own in
    its Git hooks folder (a file whose name does not end in `.sample`,
    such as `commit-msg` or `pre-push`): with `core.hooksPath` set, Git
    stops running every hook in that folder
    (`<setup>references/placing-files.md`, "5. The pre-commit check").
- **Workstreams plugin** (Mike, 2026-10-03, work items TKV-12 and TKV-14).
  The one other piece of code the toolkit ships. The first version (TKV-12)
  listed Notion work items. Mike had it rebuilt the same day (TKV-14) so it
  works in every project with no Notion: he was told about 450 lines, and it
  was about 540 lines (`register.tsx`, `types/index.d.ts`) plus about 290
  lines of tests. With the Dismiss buttons (his yes, 2026-10-03, told about
  45 more lines) it was about 620 lines plus about 370 lines of tests. With
  the Done button and one card per chat (his yes and his idea, 2026-10-03,
  told about 30 more lines) it was about 650 lines plus about 415 lines of
  tests. With plain names, the About line, the labelled layout, and
  collapsible cards (his yes, 2026-10-04, told about 70 more lines) it is
  about 715 lines plus about 475 lines of tests. Tell him the size again
  before it grows.
  - It is installed once per computer in Claude Code. Nothing of it is copied
    into a project, so the code limit for projects stands.
  - Each chat reports its own work. The plugin gives the agent one tool,
    `mcp__workstreams__report`, and one short instruction at the start of
    each chat. The agent sends a name, an "about" text, a status, and the
    next step. Mike switches between many chats and needs reminding what each
    piece of work is (2026-10-04), so the name is a subject line of 8 words
    or fewer in his own plain words, and "about" is one or two plain
    sentences, 30 words or fewer, on what he asked for and why. Neither holds
    a ticket number, a file name, or a technical term. The first "about" is
    kept; later reports change only the status and the next step. This
    costs a few tokens per report, plus the instruction and the tool's
    listing in every chat. A piece of work is Mike's "workstream" (his words,
    2026-10-03: "a significant piece of work ... a work item or some large
    task that I'm tracking"). The instruction tells the agent to report only
    those, never the steps inside one, a question, or a small chore. One chat
    may report several, and a helper agent's report is not saved.
  - The plugin also notes, at no token cost, whether each chat is working,
    asking Mike a question, or stopped, his last message to it, and how many
    helper agents it runs.
  - Each chat saves its record in its own file,
    `~/.claude/workstreams/<project>/<chat id>.json`, so no chat writes over
    another. `/streams` reads every file of the project. A chat in a worktree
    under the project's `.claude/worktrees/` folder counts as the same
    project. A mod cannot delete a file, so these small files stay on disk;
    the panel leaves out a chat that has not changed for 7 days. A chat that
    is opened again takes up its saved record first.
  - A chat's name is read from Claude Code's own
    `~/.claude/projects/<folder>/<chat id>/custom-title.json` each time, so a
    chat renamed in the sidebar shows its new name. A chat named "Main
    Orchestrator" is listed first.
  - The panel shows one card per chat, with that chat's pieces of work inside
    it (Mike's layout, 2026-10-03 and 2026-10-04). A "Chat" label sits above
    the chat's name and a "Workstreams" label above its work, so the two are
    never confused. Each piece of work shows its name, then the lines About,
    Status, and Next, always in that order; color is used only for status.
    A card folds with Collapse and opens with Expand; a folded card still
    says how many pieces of work it has and how many need him. The work
    finished in the last day is listed below the cards.
  - Mike's own presses are kept in one file for the project,
    `_dismissed.json`, beside the chats' files, so every chat's panel shows
    the same. "Mark done" moves a piece of work to the finished list. "Hide"
    hides a piece of work. Collapse folds a card. "Dismiss chat" hides a chat
    and its work: the panel is
    not told when Mike archives a chat. A press on a piece of work holds
    until the work is reported again. A dismissed chat shows again when Mike
    writes to it or it reports work.
  - It writes only its own files under `~/.claude/workstreams/`. It never
    writes to a project, to Notion, or to a chat file, and it runs no other
    program.
  - A new job for it needs Mike's yes first, with its size.
  - A mod can never break a session: Claude Code skips a hook that fails.
    Keep every failure to one short line in the panel.
  - Read `ai-external-knowledge/claude-code/mods/` and
    `dev/research/claude-code-mods.md` before changing it. The mods API is
    early access and may change between Claude Code releases.
  - Live tests run in the test sign-in with
    `--plugin-dir ./plugins/workstreams`; remove
    `~/.toolkit-v2-test-homes/claude/workstreams` afterwards. Nothing here
    has run on Windows; the plugin uses only Claude Code's own file calls
    there.
- **Shared texts.** Text several skills need is copied into each skill,
  because a skill reads only files inside its own folder. Edit the source in
  `dev/build-shared/`, then copy it over every copy (the first line of each
  copy names its source; `grep -rl 'dev/build-shared/<file>' plugins` lists
  them). Never edit a copy. One copy has its source outside
  `dev/build-shared/`: `writing-harness-files/references/writing-rule.md`
  copies the starter rule `document-clarity-standard.md`, so the
  owner's rule stays where a project gets it ("Plain English" above).
- **`dev/` and the root `reference/` folder are not shipped.** Claude Code
  installs only `plugins/toolkit/` and `plugins/workstreams/`, and Codex only
  `plugins/toolkit/`. Nothing shipped reads a file under `dev/` or under this
  repository's root `reference/`. The `reference/` folder that every project
  gets is a different folder, in the starter project.
- **Skills.** A skill is a folder: `SKILL.md`, plus `references/`,
  `assets/` (templates), and `examples/` as needed. No scripts inside
  skills: steps are file edits, `git`, `gh`, `ntn`, or MCP tool calls.
  - The frontmatter holds only `name` (equal to the folder name: lowercase
    letters, digits, and hyphens, at most 64 characters, without
    "anthropic" or "claude") and `description`. No `when_to_use`, `$ARGUMENTS`, `` !`command` ``, or
    `${CLAUDE_*}`: Codex shows them as literal text.
  - The description is in single quotes and under 500 characters, written
    in the third person: it starts with a verb saying what the skill does,
    then a sentence starting "Use" saying when to use it. That sentence may
    be a little pushy ("Use this whenever ..."). Add "Not for ...; use
    <skill>." only where a neighbor skill competes. A skill that only one
    choice gets says which projects it is for ("Only for projects that track
    work locally.").
  - The description matches `dev/SKILL-INDEX.md` word for word. After you
    change one, run the routing test again in both hosts.
  - `SKILL.md` is always under 500 lines: what the skill is for and what
    must be true when its job is done, then the steps, then a References
    table that links every file in the folder with when to open it. A reference over 100 lines
    starts with a `## Contents` list. A skill reads only files inside its own
    folder, never `../`.
  - Shared skills never assume one tracker or memory store. They send work
    to `managing-work-items`, whose tracker reference comes from the chosen
    work folder. They send local or Notion memory to
    `managing-project-memory`, whose storage reference comes from the
    chosen memory folder. A Hindsight project has no toolkit memory skill,
    so they point it to `.claude/rules/hindsight-memory.md`.
  - One skill owns each job, and each instruction lives in one file (Mike,
    2026-10-05). `managing-work-items` runs one work item; its
    `references/closing.md` fills the Moved up line, and it never writes
    `DECISIONS.md`, `sources/`, or `system/`. `filing-project-records`
    files what more than one item needs, in three steps named "record a
    decision", "file a source", and "update a system document"; other
    files hand over with those exact names. The form of a record is in its
    home (the comment at the top of `DECISIONS.md`, and the folder's
    `AGENTS.md`); a skill points to it and never repeats it.
  - Test every written rule: a template field, a check, or delete. Keep a
    sentence only when none of those can carry it (Mike, 2026-10-05). This
    is about rules. It never removes an opening, the explanation of a
    made-up word that was kept, or a reason.
  - Memory (Mike, 2026-10-06). `managing-project-memory` holds one process
    for local and Notion memory. Its selected `memory-store.md` holds the
    storage instructions. The process sends each fact that has a home
    outside memory to that home and keeps in memory only what no other
    project file holds (Mike, 2026-10-05). The Notion tracker and memory
    references use `ntn` through `using-notion-cli` and do not repeat its
    sign-in, Codex, or error text. Each instruction lives in one file.
- **Wording and overlap review** (Mike, 2026-09-30). New or changed text in
  a skill, reference, template, example, helper brief, or
  `dev/build-shared/` source is reviewed by a separate agent against
  `dev/reviews/wording-review.md` before it is committed: plain, clear,
  concise, no jargon, no figurative language, and one meaning for every
  instruction unless the text says the agent should use its judgment.
  Concise means what the writing rule says: no sentence the reader
  does not need, and never fewer words inside a sentence that stays
  (Mike, 2026-10-06; "Plain English" above). The
  writer fixes each verified finding and the reviewer reads the fix. A new
  or changed description, skill name, or row of the "Which skill" table in
  the starter's `AGENTS.md` also gets a
  review against `dev/reviews/overlap-review.md`, then the routing test in
  both hosts. Every change to a skill, rule, hook, settings snippet, or
  the model's `AGENTS.md` also gets a review against
  `dev/reviews/best-practices-review.md`: grounded in the official Claude
  Code and Codex pages, out of the box, and nothing Mike must remember
  (Mike, 2026-09-30). Every workflow that edits skill text includes these
  steps.
- **The tool list** (`OUTSIDE-TOOLS.md`, in the root of this repository). A
  row holds a tool Mike chose; never add one he has not chosen. A new tool
  is one row in the table and one section below it. The file is not a skill
  (Mike, 2026-10-06: "That should absolutely not be a skill. That just needs to be something that's just a simple file that's referenced in the toolkit v2 but doesn't get installed into projects."). So it
  has no description, no row in `dev/SKILL-INDEX.md`, and no routing test,
  and nothing under `plugins/` reads it.
- **Adding, renaming, or removing a skill** changes its folder,
  `dev/SKILL-INDEX.md`, `<setup>references/skills-hooks-settings.md`, the
  skill counts in `<setup>references/interview.md`, `README.md`, the
  `skillOverrides` list in this repository's `.claude/settings.json`
  (`check-skills.mjs` fails when it differs from the project skill names),
  and the "Which skill" table in the model's `AGENTS.md`. The last one is a
  model change and needs Mike's yes. A renamed or removed project skill
  also gets a line in `<setup>references/update.md`, "4. What the toolkit
  no longer ships", so existing projects lose the old folder. No new
  project skill without Mike's yes: closing a work item is a step inside
  `managing-work-items`, and recording a decision, filing a
  source, and updating a system document are three steps inside
  `filing-project-records` (Mike, 2026-10-05).
- **Hooks.** A project's Claude Code hooks are in `.claude/settings.json` and
  its Codex hooks in `.codex/hooks.json` (only `description` and `hooks` at
  the top level). The snippets in `<setup>assets/settings/` must match the
  hook commands; `dev/tests/hooks.test.mjs` checks both. `work-items/` and
  `memory/` are kept out of Git, so they exist only in the main checkout:
  `session-start.mjs` finds it with `git rev-parse --git-common-dir`, and so
  works from inside a Git worktree. With local memory it rebuilds
  `memory/MEMORY.md`, the index of the memory records, and prints one line
  per record: its title, its file, its description, and the date it last
  changed. Claude Code caps a hook's output at 10,000 characters
  (`ai-external-knowledge/claude-code/hooks.md`). Codex limits it by
  tokens: about 2,500 by default, and 4,000 in the toolkit's Codex snippets,
  which set `additionalContextLimit`
  (`ai-external-knowledge/codex/hooks.md`, "Large hook output"). So the
  command cuts longer output at 9,500 characters, between two lines, and
  names the files that hold the rest. A project with 30 memory records and
  a Current State at its line limits (under 40 lines) prints whole; a test
  fails when it does not. It is 76 lines. `validate-records.mjs`
  runs from three places: a `PostToolUse` entry in both hosts, a `Stop`
  entry in Claude Code only (Codex accepts only JSON output for `Stop`),
  and `.githooks/pre-commit`. In an update of a project that does not have
  its entries yet, the records must pass `--all` before the entries go in
  (`<setup>references/update.md`, "Turning on validate-records.mjs and the
  pre-commit file"). Any change to a Codex hook means Mike
  must trust it again in Codex `/hooks`; say so. Codex trusts the entry in
  `.codex/hooks.json`, not the `.mjs` file it runs, so the memory skill
  names live in `session-start.mjs` and `prompt-reminder.mjs`, and the
  snippets pass none: renaming a memory skill changes only those files and
  needs no new trust.
- **Versions.** Both `toolkit` manifests carry the same `name` and `version`.
  Every shipped change raises `version` in both, in
  `plugins/workstreams/.claude-plugin/plugin.json`, and `metadata.version` in
  `.claude-plugin/marketplace.json`, so the toolkit has one version number.
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
  for every folder in both hosts. It holds `project-setup` and no hooks, so
  "set up this project" works in an empty folder and nothing runs in other
  projects. Its second skill is `writing-harness-files` (Mike's yes,
  2026-10-05), so every agent on this computer, in any project, has the
  steps for a harness file. Mike took the skill `choosing-outside-tools` out
  of this plugin on 2026-10-06 ("The tool list" above). A third skill in
  this plugin needs Mike's yes
  first: every chat in both hosts reads each one's description.
  `workstreams` is on for every folder in Claude Code only,
  and its hooks run there ("Workstreams plugin" above says what they do).
- **Rule files** live in the model and follow
  `dev/research/rules-best-practices.md` Part 1: one topic per file, a `# `
  heading, one specific instruction per bullet, `paths` frontmatter only
  where the rule is about certain files, short always-on rules, and
  procedures in skills. A change to a rule is a model change; a change to a
  rule's meaning waits for Mike's yes. The 4 KB limit for an always-on rule
  is proposed, not decided, so `check-rules.mjs` only warns on it. Never cut
  Mike's words to meet it. What differs by choice is a rule file only that
  choice gets (`hindsight-memory.md`, `notion-records.md`, the Salesforce
  rules), never a marked block inside a rule (Mike, 2026-10-05).
- **Harness files follow the current official documentation** (Mike,
  2026-10-05: "they must always be written using the most up to date claude
  code and codex best practices and up to date documentation", by every
  agent and helper agent, without him repeating it). A harness file is
  a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. A hook means the command and its entry in a settings or hooks
  file. This list is the same, word for word, in the
  `writing-harness-files` skill's `SKILL.md` and in `README.md`: change all
  three together. Keep the skill's description an accurate summary. The
  `writing-harness-files` skill is the way to follow this
  rule: open it, in this repository and in any project. In this repository
  its steps mean:
  - Read the official page for that kind of file in `ai-external-knowledge/`
    (`claude-code/`, `codex/`, `anthropic-agent-skills/`, `openai-plugins/`,
    `anthropic-engineering/`; `hindsight/` for the Hindsight setup file).
    For a skill, read
    `anthropic-agent-skills/skill-authoring-best-practices.md` every time,
    together with `claude-code/skills.md` and `codex/build-skills.md`
    (Mike, 2026-10-06).
    Each folder's `SOURCE-RECORD.md` gives the
    capture date. When the capture is more than 14 days old, capture the
    page again with Firecrawl first, update its `SOURCE-RECORD.md`, and read
    what changed. Never edit a captured page by hand.
  - Read the toolkit's guide for that kind of file:
    `dev/research/skill-writing-guide.md`,
    `dev/research/rules-best-practices.md` Part 1, or
    `dev/research/platform-best-practices.md` part 3. Where a guide and the
    current page differ, the page wins; correct the guide in the same
    change.
  - Follow the writing rule,
    `<setup>assets/every-project/.claude/rules/document-clarity-standard.md`
    ("Plain English" above). The skill holds an exact copy of it,
    `references/writing-rule.md`, which `check-skills.mjs` compares with
    the rule.
  - Put this rule, the files above, and the path of the writing rule in
    the brief of every helper agent that will change a harness file.
  - "Wording and overlap review" above covers the separate review.
- **Notion memory uses Lore's layout.** Never rename or remove a Lore
  database or property: Lore finds them by their exact names. The layout is
  in the Notion storage references that setup places inside
  `managing-project-memory`, under
  `<setup>assets/memory-notion/.claude/skills/managing-project-memory/`:
  every database and column in `references/database-layout.md`,
  the views and page layout in `references/views-and-layout.md`,
  and the request files in `assets/schema/`. The toolkit does not install or run Lore, and Lore's own
  saving and hooks stay off. Before moving to a newer Lore, compare
  `database-layout.md` with Lore's `src/notion/schema.ts` again.
- **Notion tests** run only in a throwaway project made from Mike's
  "Project" template and named "<what it tests> (safe to delete)". Make it
  only after his yes, and move it to the trash after he has looked. Never
  test on his real projects, his templates, or his "AI Agent Second Brain"
  page unless he says yes. The earlier test area
  (`dev/test-runs/notion-test-area.json`) was deleted and is no longer used
  (Mike, 2026-10-03).
- **Hindsight memory** is on Mike's Hostinger VPS (API
  `https://memory-api.mrihm-memory.com`, dashboard
  `https://memory.mrihm-memory.com`), one bank per project, never on the Mac
  and never Hindsight Cloud. Hindsight's coding-agent add-on, installed
  machine-wide with his yes, saves each session and gives the agent its
  `hindsight_*` tools, so there are no toolkit memory skills; Current State
  stays in `memory/CURRENT_STATE.md`. Mike, 2026-10-05: a Hindsight project
  gets no toolkit memory skill, because the add-on ships its own skill,
  `hindsight-coding-agent`, and shows the agent a guide to its tools at
  session start. Toolkit text names that skill and never lists the tools.
  The server is his: an agent never changes it, and the facts an agent
  needs about it are in `<setup>references/hindsight-on-vps.md`, taken from
  his own guide (`dev/research/hindsight-server-setup-guide.md`). The API key lives in
  `~/.hindsight/coding-agent.json` (or, by his choice, `HINDSIGHT_API_TOKEN`
  in `~/.zshenv`), never in a repository. Tests use only banks made for the
  test, with his yes, never his own.
- **Jira is deferred** by Mike: no Jira skills now.
- **Read-only sources.** Never change
  `/Users/michaelrihm/Documents/Projects/claude-toolkit`,
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`, or
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
  The model project now lives in the folders under `<setup>assets/`.
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
  what the model has (Mike, 2026-10-05): a root `AGENTS.md` that is the
  outline (one or two sentences per location, and the filing table), and
  one detailed guide, under 200 lines, in each of `system/`, `sources/`,
  `delivery/`, `reference/`, `work-items/`, and `memory/`. Each
  has a `CLAUDE.md` beside it that holds only `@AGENTS.md`: with a root
  `CLAUDE.md`, Claude Code loads a folder's `AGENTS.md` only through that
  file (`dev/test-runs/folder-instructions-load-test.md`). Never delete one
  of the model's `CLAUDE.md` files.
- **Git.** Several agents may work in this repository at once. Change only
  the files you were given. Stage paths by name; never `git add -A`,
  `git add .`, or `git commit -a`. The GitHub repository is
  `Mar5929/toolkit-v2` (private). Push
  `main` only with Mike's yes.
