# AGENTS.md: working on Toolkit V2

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things. This is similar in philosophy to @.claude/rules/evaluate-the-owners-request.md

You (the agent) must keep their according cooresponding Notion ticket up to date (properties, ticket body, comments, history, etc.)

You (the agent) use hindsight for memory recall, storage, and insights in this project. You (the agent) are responsible for saving this type of information to the toolkitv2 hindsight memory bank:
    - Persistent project memory criteria:
    (1 AND 2 AND 3)
      1. Lasting project-specific facts, decisions, lessons, events, and constraints that not already owned by another memory file (we don't want duplicates).
      2. It has lasting significance: losing it would cost a later agent real time or understanding.
      3. It comes from the owner, or from work done together with the owner.

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
- Keep decisions, questions, progress, and history in the corresponding Notion work item. Keep intended Toolkit behavior in `toolkit-wiki/`. They do not go here.
- The detail of one feature goes in the file that holds the feature. This file names that file.
- Use Git history and the relevant work item when you need the reason for an earlier rule.

## What this repository is

- It builds Toolkit V2 for Mike Rihm, a solo developer. The agent runs each of his projects; Mike decides and steers. `README.md` explains the toolkit for Mike.
- The toolkit is rules, skills, and three small hook commands. There is no custom program. It ships as one plugin, `toolkit`, for Claude Code and Codex, with one entry skill:
  - `project-setup` sets up a project by copying files: the folder every project gets, the folder for each of the owner's choices, and the settings. It also runs "check the setup" and "update the toolkit".
- This repository's `.claude/skills/writing-harness-files/` holds the steps for writing or changing a harness file.
- Work on the toolkit is tracked in Notion, in the Toolkit V2 project (page ID `3edb381d-a176-81ee-b7dd-d0a6d662f9b2`). Its work items, with IDs starting TKV, are in the Work Items data source `b22b381d-a176-8301-a22c-0766e27d8dc9`.
- `OUTSIDE-TOOLS.md` in the root is Mike's list of the outside tools he uses. It is a plain file: not a skill, not shipped, and never copied into a project. Never add a tool he has not chosen.

## The rule every agent follows here

Follow `.claude/rules/evaluate-the-owners-request.md` on every request, also when Mike does not mention it.

- Claude Code loads the rule by itself, and one entry in `.claude/settings.json` prints it again on every message. In Codex, read it at the start of each session and again after compaction.
- A helper agent may not load the rule, so put its path in every brief.
- In this repository, "the whole project" in the rule means the whole toolkit: the filing system, memory, the work tracker, the project's records, the hook commands, setup and "update the toolkit", both hosts, and the projects that already use the toolkit.
- The file is a copy of the starter rule, `<setup>every-project/.claude/rules/evaluate-the-owners-request.md`. Edit the starter rule, then copy it over the copy. Never edit the copy.

Follow `.claude/rules/document-clarity-standard.md` when writing or changing documents and artifact text.

## Three instructions for text that tells an agent what to do

They apply to every skill, rule, guide, hook text, and brief. Put all three in the brief of every helper agent that writes such text.

- Write the general rule. Do not add a sentence for each small case. Use review situations to verify the instruction, rather than adding a line for each situation.
- State the goal and the process. Do not tell the agent how to think.
- Do not put a count or a limit where the agent should use its judgment. Say what the step is for, and let the agent decide. When a question to Mike is about the edge of a count or a limit, first ask whether the count should be there at all.

## Read first

- The corresponding Notion work item: Mike's request, decisions, current work, and next step. Update it before you stop. Mike's words take priority over agent proposals.
- `toolkit-wiki/Toolkit Guiding Design Principles.md`: how Toolkit changes are designed.
- `toolkit-wiki/Toolkit Setup Process.md`: the intended setup process.
- `toolkit-wiki/ToolkitV2 Structure.md`: what each choice gives a project.
- `toolkit-wiki/Toolkit's Definition of Persistent Memory.md`: what counts as memory and how it is represented. Read it before changing memory guidance.
- The relevant earlier work items and Git history: how the project got here. Read them before proposing a wider change.
- `reference/how-the-owner-works-with-agents.md`: what Mike asks agents to do in his real projects. Read it before you propose a change to how a project runs.
- `reference/davis-memory-system.md`: the memory system of his Davis project, which he named as the example to follow. Read it before you change how a project keeps memory.

## Where things are

`<setup>` is `plugins/toolkit/skills/project-setup/`.

| Path | What is there |
| --- | --- |
| `plugins/toolkit/` | The plugin: its two manifests (`.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`) and `project-setup`. |
| `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` | The `toolkit-v2` marketplace, for Claude Code and for Codex. |
| `<setup>SKILL.md`, `<setup>reference/` | Setup, "check the setup", and "update the toolkit". |
| `<setup>every-project/` | Everything every project gets, at the paths a project has: project files, rules, shared skills, settings, and three hook commands. |
| `<setup>choices/work-items/` | The local, Notion, and GitHub work-tracker modules. |
| `<setup>choices/memory/` | The local, Notion, and Hindsight memory modules, and the process shared by local and Notion memory. |
| `<setup>choices/notion-shared/`, `<setup>choices/salesforce/` | The shared Notion tools and Salesforce module. |
| `.claude/skills/writing-harness-files/` | This repository's harness-writing procedure and official guidance checklist. |
| `.claude/settings.json`, `.claude/rules/` | The settings and the one rule for sessions that work on this repository. |
| `ai-external-knowledge/` | Official pages of Claude Code, Codex, and Hindsight, captured with Firecrawl. `INDEX.md` lists them. |
| `reference/` (root of this repository) | Records of how Mike works in his real projects. |
| `archive/` | Earlier setup material and Salesforce tools. Not shipped. |
| `toolkit-wiki/` | Mike's definition of intended Toolkit behavior. |

Only `plugins/toolkit/` is shipped. Nothing shipped reads the repository's `archive/`, root `reference/`, `toolkit-wiki/`, or `ai-external-knowledge/`.

## The starter project

`<setup>every-project/` and the selected `<setup>choices/` modules together supply the starter project. Edit these folders directly.

- A change that alters what a project file means needs Mike's yes.
- Each choice supplies complete files and the additions to project guides and settings documented by its module. A file every project gets goes in `every-project/`, and a file for one choice goes in that choice's folder. No delivered file holds a conditional setup marker such as `<!-- if ... -->`. Setup records confirmed owner answers in the documented places.
- `<setup>reference/placing-files.md` describes how setup copies files. `<setup>SKILL.md` routes each answer to its choice module. Keep those routes current when adding a module.
- Two files are the owner's own from the first day: `owner-preferences.md` and, in a Salesforce project, `salesforce-agent-permissions.md`. Setup copies each once. "Update the toolkit" never compares or replaces them.
- Delivered skills sit under `.claude/skills/`; setup links `.agents/skills` to that folder so Codex reads the same project skills. This repository's `.claude/settings.json` turns each project skill off by name, and stops the starter project's instruction files from loading here.
- Each folder guide, `AGENTS.md`, has a `CLAUDE.md` beside it that holds only `@AGENTS.md`. Never delete one.
- After a change, run the applicable checks below and raise the version. A project gets the change when its owner says "update the toolkit" there. `<setup>reference/update.md` describes how to handle files the toolkit no longer ships.

## Checks

Run them from the repository root before you hand work back.

```bash
claude plugin validate .
claude plugin validate ./plugins/toolkit
git diff --check
```

- Verify skill front matter, reference links, exact copies, and both hosts' settings. Use representative workflows and independent review to check behavior.
- The former `dev/` checks and tests are no longer present. Report unavailable checks accurately; do not claim they passed.
- Checks and tests use LF line endings. `.gitattributes` keeps them in every checkout.
- Use scratch folders for setup and host-loading tests. Keep real project records and the owner's host configuration intact.
- Codex has no validate command. To prove that Codex accepts the plugin, install it into a scratch Codex home.

## Rules

- **No AI credit anywhere.** No "Generated with" line, no `Co-Authored-By` naming an AI, and no AI named in a comment, file header, manifest, README, commit, or pull request.
