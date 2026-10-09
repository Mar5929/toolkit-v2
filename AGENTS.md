# AGENTS.md: working on Toolkit V2

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things. This is similar in philosophy to @.claude/rules/evaluate-the-owners-request.md

After you change, add, or delete files, end your reply with the list of those files, each as a link, with one plain sentence on what changed and why.

Every agent must keep their according cooresponding Notion ticket up to date (properties, ticket body, comments, history, etc.)

## Mike's principles for building the toolkit

Guiding Design Principles - follow these on every request in this project:

1. The toolkit is an operating system and framework for AI agents. It provides a set of harness tools and instructions (like skills, rules, agents.md, system context, hooks, etc.) to tell the agent the owner’s procedures and processes that the agent should follow. The goal of the toolkitv2 is to create a harness around the agent so that it stays free to use its intelligence, reasoning, critical thinking, etc., but it just follows the ways of working that the owner defined (like how to manage work items, where and when to store files and why they are stored a certain way, how to keep things tidy, what is considered memory, what external apps the user uses on a project, etc. etc.)
2. Solutions should always evaluate the out of the box mechanisms for the request (like skills, hooks, instruction files, etc.)
3. Every project that uses the toolkit will have this project scaffolding, set of shared rules, and skills and hooks installed. The toolkitv2 installation will then run through an interview with the user to make sure the user has certain machine-wide or project specific things setup properly (such as MCPs, tools, plugins, etc.)
4. A skill holds your procedures, policies, rules, templates, and the order of the steps. It does not tell the agent how to reason.
5. Projects that have the toolkitv2 installed will use the framework and structure of the toolkit but could always layer on extra stuff or tweak certain things to meet the needs of the project. This should not be an issue. That is why we are trying to avoid writing custom scripts or programs to check for project setup, configuration, etc. as much as possible because it could cause the project to hit roadblocks because the toolkitv2 would restrict any possible deviation from what it is checking for. That is why we are opting to define the general rules, context, skills, and hooks in plain English instructions and guidelines so the agent remains free to reason and is equipped to handle anything that may come up on a project. We can still make the project follow the toolkitv2’s framework and guidelines while allowing the project to layer on certain extra rules or add tools, tweak settings, etc.
    1. An example would be: In the toolkit we ask the owner (aka user) where they want to store and track memory for the project. If the user chooses hindsight, great, we just provide the agent with a simple setup file that outlines what the agent should walk the owner through to make sure the memory bank is setup and maybe list out the default settings that the owner chose in the toolkitv2 blueprint that every project starts with. During that interview the user could say “for this project I think we should use this setting” or something like that.
6. Follow the official Claude Code and Codex pages, and use what they already provide.

## Keep this file short

This file holds what an agent needs on every request in this repository, and nothing else.

- When a line here is no longer true, replace it. Do not add a paragraph below it.
- The reason for a decision, its date, Mike's words, a size he was told, and what an earlier version did go in `dev/GOAL.md` (his decisions) or `dev/PROGRESS.md` (what was done). They do not go here.
- The detail of one feature goes in the file that holds the feature. This file names that file.
- The file as it was before the clean-up of 2026-10-09, with the history behind each rule, is `dev/archive/AGENTS-before-cleanup-2026-10-09.md`. Read it when you need the reason for a rule below.

## What this repository is

- It builds Toolkit V2 for Mike Rihm, a solo developer. The agent runs each of his projects; Mike decides and steers. `README.md` explains the toolkit for Mike.
- The toolkit is rules, skills, and four small hook commands. There is no custom program. It ships as one plugin, `toolkit`, for Claude Code and Codex, with two skills:
  - `project-setup` sets up a project by copying files: the folder every project gets, the folder for each of the owner's choices, and the settings. It also runs "check the setup" and "update the toolkit".
  - `writing-harness-files` holds the steps for writing or changing a harness file ("Harness files" under Rules).
- Work on the toolkit is tracked in Notion, in the Toolkit V2 project (page ID `3edb381d-a176-81ee-b7dd-d0a6d662f9b2`). Its work items, with IDs starting TKV, are in the Work Items data source `b22b381d-a176-8301-a22c-0766e27d8dc9`.
- `OUTSIDE-TOOLS.md` in the root is Mike's list of the outside tools he uses. It is a plain file: not a skill, not shipped, and never copied into a project. Never add a tool he has not chosen.

## The rule every agent follows here

Follow `.claude/rules/evaluate-the-owners-request.md` on every request, also when Mike does not mention it.

- Claude Code loads the rule by itself, and one entry in `.claude/settings.json` prints it again on every message. In Codex, read it at the start of each session and again after compaction.
- A helper agent may not load the rule, so put its path in every brief.
- In this repository, "the whole project" in the rule means the whole toolkit: the filing system, memory, the work tracker, the project's records, the hook commands, setup and "update the toolkit", both hosts, and the projects that already use the toolkit.
- The file is a copy of the starter rule, `<setup>assets/every-project/.claude/rules/evaluate-the-owners-request.md`. Edit the starter rule, then copy it over the copy. Never edit the copy.

## Three instructions for text that tells an agent what to do

They apply to every skill, rule, guide, hook text, and brief. Put all three in the brief of every helper agent that writes such text.

- Write the general rule. Do not add a sentence for each small case. A situation is a test in `dev/evals/`, never a line in an instruction.
- State the goal and the process. Do not tell the agent how to think.
- Do not put a count or a limit where the agent should use its judgment. Say what the step is for, and let the agent decide. When a question to Mike is about the edge of a count or a limit, first ask whether the count should be there at all.

## Read first

- `dev/GOAL.md`: Mike's goal and his decisions. His words there win over every other file.
- `dev/PROGRESS.md`: what is done, what is in progress, and the next step. Update it before you stop.
- `dev/research/layout-audit/DESIGN-SPEC.md`: the layout of a project, the filing rule, and the one job of each skill.
- `dev/HISTORY.md`: how the project got here, and what not to repeat. Read it before you propose anything bigger than a skill edit.
- `dev/SKILL-INDEX.md`: every skill, its folder, and its description.
- `reference/how-the-owner-works-with-agents.md`: what Mike asks agents to do in his real projects. Read it before you propose a change to how a project runs.
- `reference/davis-memory-system.md`: the memory system of his Davis project, which he named as the example to follow. Read it before you change how a project keeps memory.

## Where things are

`<setup>` is `plugins/toolkit/skills/project-setup/`.

| Path | What is there |
| --- | --- |
| `plugins/toolkit/` | The plugin: its two manifests (`.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`) and its two skills. |
| `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` | The `toolkit-v2` marketplace, for Claude Code and for Codex. |
| `<setup>SKILL.md`, `<setup>references/` | Setup, "check the setup", "update the toolkit", and the move-over from the older toolkit. |
| `<setup>assets/every-project/` | Everything every project gets, at the paths a project has: the project files, the rules, the shared skills, the four hook commands, and `.githooks/pre-commit`. |
| `<setup>assets/work-local/`, `work-notion/`, `work-github/` | The files for each choice of work tracker. |
| `<setup>assets/memory-local/`, `memory-notion/`, `memory-process/`, `memory-hindsight/` | The files for each choice of memory. |
| `<setup>assets/notion-tools/`, `salesforce/`, `soul/` | The files for a project that uses Notion, for a Salesforce project, and for a project whose owner keeps `SOUL.md`. |
| `<setup>assets/settings/` | The snippets that setup merges into a project's `.claude/settings.json`, `.codex/hooks.json`, and `.codex/config.toml`. |
| `plugins/toolkit/skills/writing-harness-files/` | The steps, the checklist, and the rewrite steps for a harness file. |
| `.claude/settings.json`, `.claude/rules/` | The settings and the one rule for sessions that work on this repository. |
| `ai-external-knowledge/` | Official pages of Claude Code, Codex, and Hindsight, captured with Firecrawl. `INDEX.md` lists them. |
| `reference/` (root of this repository) | Records of how Mike works in his real projects. |
| `dev/` | Goal, progress, research, reviews, test runs, evals, the check tools in `dev/tools/`, and the tests in `dev/tests/`. |

Only `plugins/toolkit/` is shipped. Nothing shipped reads a file under `dev/`, the root `reference/`, or `ai-external-knowledge/`.

## The starter project

The folders under `<setup>assets/` together are the starter project: the source of every file a project gets. Older text and the check tools also call it "the model". Edit these folders directly.

- A change that alters what a project file means needs Mike's yes.
- A choice decides which files a project gets, never which lines inside a file. A file every project gets goes in `every-project/`, and a file for one choice goes in that choice's folder. No file holds a setup marker such as `<!-- if ... -->`. Setup fills only blanks: the project name, the owner's answers, and the "Toolkit settings" lines in `PROJECT.md`.
- `<setup>references/setup-copy.md`, "Folders the choices add", is the only table of choices and folders. A new folder under `<setup>assets/` needs a row there.
- Two files are the owner's own from the first day: `owner-preferences.md` and, in a Salesforce project, `salesforce-agent-permissions.md`. Setup copies each once. "Update the toolkit" never compares or replaces them.
- Skills sit under `.claude/skills/` in every setup folder, because Codex would otherwise load each one in every folder on the computer. This repository's `.claude/settings.json` turns each project skill off by name, and stops the starter project's instruction files from loading here.
- Each folder guide, `AGENTS.md`, has a `CLAUDE.md` beside it that holds only `@AGENTS.md`. Never delete one.
- After a change, run every check below and raise the version. A project gets the change when its owner says "update the toolkit" there. A file that was renamed or removed gets a line in `<setup>references/update.md`, so that an existing project loses the old one.

## Checks

Run them from the repository root before you hand work back.

```bash
claude plugin validate .
claude plugin validate ./plugins/toolkit
node dev/tools/check-skills.mjs
node dev/tools/check-rules.mjs
node --test 'dev/tests/*.test.mjs'
```

- Keep the quotes around the test pattern, so that Node reads it and not the shell.
- `check-skills.mjs` checks the skills, the setup folders, and every text that is kept as a copy. `check-rules.mjs` checks the starter project's rules. When one fails, its message names the file to change.
- The `CHOICE_RULES` list in `check-rules.mjs` is a second copy of part of the table in `<setup>references/setup-copy.md`. Change both together.
- The checks and tests need LF line endings. `.gitattributes` keeps them in every checkout.
- The tests run on Windows and on a Mac. A new test takes what differs between the two from `dev/tests/support.mjs`.
- Codex has no validate command. To prove that Codex accepts the plugin, install it into a scratch Codex home ("Tests stay in scratch folders" under Rules).

## Rules

- **No AI credit anywhere.** No "Generated with" line, no `Co-Authored-By` naming an AI, and no AI named in a comment, file header, manifest, README, commit, or pull request.
- **Texts that Mike approved word for word.** Change a word of these only with his yes: the rules `evaluate-the-owners-request.md`, `document-clarity-standard.md`, and `salesforce-org-safety.md`; the section "Your job as the agent" in the starter root `AGENTS.md`; the default tables in `salesforce-agent-permissions.md`; the `sf-*` skills; and the default filter for saved sessions in `<setup>references/hindsight-on-vps.md`.

- **Plain English.** Every skill, rule, guide, and project document follows the writing rule, `<setup>assets/every-project/.claude/rules/document-clarity-standard.md`. All the writing rules are in that one file. A file that needs one points to it and does not state it again.
  - Clear beats short. Never squeeze a sentence to save words.
  - For a made-up word, choose in this order: plain words; a name the reader can already see, such as a folder name or an ID prefix; and only then the word itself, explained once. A word decision that reaches past one file goes on `dev/reviews/word-list.md`.
  - Do not rename a file, a skill, or a folder to make its name plainer.
  - Write "session", never "chat". Write "the project's Current State" or "the work item's Current state", never the bare name.
  - A helper agent and Codex never see the output style, so a helper's brief gives it the path of the writing rule.
- **Harness files follow the current official documentation.** A harness file is a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. This list is the same, word for word, in the `writing-harness-files` skill's `SKILL.md` and in `README.md`: change all three together.
  - Open the `writing-harness-files` skill before you write or change one, in this repository and in any project.
  - In this repository, read the official page for that kind of file in `ai-external-knowledge/`. Each folder's `SOURCE-RECORD.md` gives the capture date. When a capture is more than 14 days old, capture the page again with Firecrawl first. Never edit a captured page by hand.
  - Then read the toolkit's guide for that kind of file: `dev/research/skill-writing-guide.md`, `dev/research/rules-best-practices.md` Part 1, or `dev/research/platform-best-practices.md` part 3. Where a guide and the current page differ, the page wins; correct the guide in the same change.
  - Put this rule and those files in the brief of every helper agent that will change a harness file.
- **Skills.** A skill is a folder: `SKILL.md`, plus `references/`, `assets/`, and `examples/` as needed. It holds no script, and it reads only files inside its own folder.
  - The frontmatter holds only `name`, equal to the folder name, and `description`. The description starts with a verb that says what the skill does, then a sentence that starts "Use" and says when. It matches `dev/SKILL-INDEX.md` word for word.
  - `SKILL.md` is under 500 lines: what the skill is for and what must be true when its job is done, then the steps, then a table that links every file in the folder.
  - One skill owns each job, and each instruction lives in one file. A file that needs an instruction from elsewhere points to its home.
  - A shared skill never assumes one work tracker or one memory store. It sends work to `managing-work-items` and memory to `managing-project-memory`.
  - A new project skill, or a third skill in the plugin, needs Mike's yes first.
  - Adding, renaming, or removing a skill changes its folder, `dev/SKILL-INDEX.md`, `<setup>references/skills-hooks-settings.md`, the skill counts in `<setup>references/interview.md`, `README.md`, the `skillOverrides` list in `.claude/settings.json`, and the "Which skill" table in the starter root `AGENTS.md`.
- **Shared texts.** A text that several skills need is copied into each skill. Edit the source, then copy it over every copy; never edit a copy. The first line of a copy names its source, and `check-skills.mjs` fails when a copy differs. The sources are in `dev/build-shared/`, apart from the two starter rules that are copied (the writing rule and `evaluate-the-owners-request.md`).
- **Rule files** live in the starter project and follow `dev/research/rules-best-practices.md` Part 1: one topic per file, one instruction per bullet, and procedures in skills. What differs by choice is a rule file that only that choice gets. A change to a rule's meaning waits for Mike's yes.
- **Review before a commit.** A separate agent reviews new or changed text in a skill, a rule, a hook, a settings snippet, or the starter root `AGENTS.md` against `dev/reviews/wording-review.md` and `dev/reviews/best-practices-review.md`. A changed description, skill name, or row of the "Which skill" table also gets `dev/reviews/overlap-review.md`, and then the routing test in both hosts. Size the review to the change.
- **Hooks.** A project's Claude Code hooks are in `.claude/settings.json`, and its Codex hooks in `.codex/hooks.json`. The snippets in `<setup>assets/settings/` must match the hook commands; `dev/tests/hooks.test.mjs` checks both. After any change to a Codex hook entry, Mike must trust it again in Codex `/hooks`: tell him.
- **Versions.** Both manifests and `metadata.version` in `.claude-plugin/marketplace.json` carry one version number. Every shipped change raises it in all three.
  - Claude Code runs the plugin in place from the main checkout, so a saved edit under `plugins/` there reaches Mike's Claude Code at its next session start.
  - Codex runs its own copy. A change reaches it after the version is raised and `codex plugin add toolkit@toolkit-v2` runs.
  - Each install command changes Mike's own setup, so ask him first.

- **Records and work items in a project.** The starter root `AGENTS.md` holds two rules that no other file states again. "Your job as the agent": the agent keeps the project's records in the same turn, without being asked. "Every session": the agent asks the owner whether a job gets a work item, and a change with no work item still goes on a branch.
- **Memory.** Memory holds only what no other project file holds.
  - Local and Notion memory use one skill, `managing-project-memory`. Notion memory uses Lore's layout: never rename or remove a Lore database or property.
  - A Hindsight project gets no toolkit memory skill. It gets the rule `hindsight-memory.md`, which says what the agent saves and holds the owner's choices for the bank in plain words, and it uses the skill of Hindsight's own add-on. `<setup>references/hindsight-on-vps.md` is a short plain-English file: how Mike's Hindsight is set up, what must be true when setup is done, and the defaults that setup offers the owner. It gives no commands, and the toolkit ships no settings file for a bank.
  - The Hindsight server is Mike's. An agent never changes it, and never reads or prints its API key.
- **This repository's own Hindsight bank** is `toolkit-v2`. Nothing is saved to it by itself. Save a record on purpose, with the add-on's tools, only for something a later session needs and no file in this repository holds: one record for one subject, with its date. Never save a decision, a to-do, or the status of work: `dev/GOAL.md`, `dev/PROGRESS.md`, Git, and the work items in Notion hold those. The bank stores a record as written, imports no Git history, surveys no code, and builds observations after every save. Change a setting only when Mike asks. Never use this bank for a test.
- **Salesforce.** What an agent may do in an org is stated in three places, and no other file states a permission again.
  - `salesforce-org-safety.md` holds the limits that are the same in every project.
  - `salesforce-agent-permissions.md` holds the owner's choices for one project.
  - The guard and `.claude/protected-orgs.json` block production and an org the guard cannot classify, whatever the owner's file says. No code asks before a change to a sandbox.
  - For Salesforce's own plugins, setup checks that they are installed and asks the owner what to have on or off. The toolkit ships no settings for them.
- **Tests stay in scratch folders.** Point `HOME`, `CLAUDE_CONFIG_DIR`, and `CODEX_HOME` at a temporary folder. Never write to Mike's real `~/.claude`, `~/.codex`, Notion pages, or Hindsight banks.
  - Live test sessions sign in through two fixed test homes: `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude` and `CODEX_HOME=~/.toolkit-v2-test-homes/codex`. Reuse them, and never delete either folder. Signing in is Mike's step; never copy his own sign-in files.
  - A Notion test runs only in a throwaway project made from Mike's "Project" template and named "<what it tests> (safe to delete)". Make it only after his yes.
  - A Hindsight test uses only a bank made for the test, with his yes.
- **Read-only sources.** Never change `/Users/michaelrihm/Documents/Projects/claude-toolkit`, `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`, or `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
- **Instruction files.** This repository has no `CLAUDE.md`: one here would stop Claude Code from reading this `AGENTS.md`.
- **Git.** Several agents may work in this repository at once. Change only the files you were given. Stage paths by name; never `git add -A`, `git add .`, or `git commit -a`. The GitHub repository is `Mar5929/toolkit-v2` (private). Push `main` only with Mike's yes.
