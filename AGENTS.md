# AGENTS.md: working on Toolkit V2

## What this repository is

- It builds Toolkit V2 for Mike Rihm, a solo developer. The agent runs each of his projects; Mike decides and steers. `README.md` explains the toolkit for Mike.
- The toolkit is rules, skills, and three small hook commands. There is no custom program. It ships as one plugin, `toolkit`, for Claude Code and Codex, with one entry skill:
  - `project-setup` sets up a project by copying files: the folder every project gets, the folder for each of the owner's choices, and the settings. It also runs "check the setup" and "update the toolkit".
- Work on the toolkit is tracked in Notion, in the Toolkit V2 project (page ID `3edb381d-a176-81ee-b7dd-d0a6d662f9b2`). Its work items, with IDs starting TKV, are in the Work Items data source `b22b381d-a176-8301-a22c-0766e27d8dc9`.

## Working with Mike

- Mike dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what he means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.
- Follow `.claude/rules/evaluate-the-owners-request.md` on every request, also when Mike does not mention it. In this repository, "the whole project" in that rule means the whole toolkit: the filing system, memory, the work tracker, the project's records, the hook commands, setup and "update the toolkit", both hosts, and the projects that already use the toolkit.
- Read the corresponding Notion work item before you start: Mike's request, decisions, current work, and next step. Keep it up to date as you work, and before you stop: its properties, body, comments, and history. Mike's words take priority over agent proposals.
- Follow `.claude/rules/document-clarity-standard.md` when writing or changing documents and artifact text.
- In Codex, read the evaluate rule and the design principles file at the start of each session and again after compaction; Claude Code loads both by itself. A helper agent may load neither, so put both paths in every brief.

## Toolkit design principles

Follow Mike's guiding design principles on every request. They say how every agent designs and adds to the toolkit, the blueprint that every project gets. The file is `wiki/product-wiki/Toolkit Guiding Design Principles.md`.

@wiki/product-wiki/Toolkit\ Guiding\ Design\ Principles.md

## Hindsight memory

This project's memory is the Hindsight bank recorded in `PROJECT.md`, under "Toolkit settings". Follow `.claude/rules/hindsight-memory.md` for memory; in Codex, read it at session start and after compaction. It applies wherever this guide or a toolkit skill names `managing-project-memory`.

## Where information goes

| Information | Where the agent keeps it |
| --- | --- |
| Current work, decisions, questions, progress, and history | The corresponding Notion work item. Do not create `DECISIONS.md` here. |
| Intended Toolkit behavior | The relevant file in `wiki/product-wiki/`. |
| Lasting project context and lessons | Hindsight, under its memory rule, with a pointer to the authoritative record when one exists. |
| Outside sources, such as official product pages | `wiki/reference/ai-external-knowledge/`. |
| Standing instructions for this repository | This guide or the applicable rule, written with `.claude/skills/writing-harness-files/`. |

## Keep this file short and intentional

This file holds what an agent needs on every request in this repository, and nothing else.

- When a line here is no longer true, replace it. Do not add a paragraph below it.
- The detail of one feature goes in the file that holds the feature. This file names that file.
- Use Git history and the relevant work item when you need the reason for an earlier rule.

## Read first

- `wiki/product-wiki/Toolkit Setup Process.md`: an overview of setup and the reasons it works this way. The steps are in `plugins/toolkit/skills/project-setup/SKILL.md`.
- `wiki/product-wiki/ToolkitV2 Structure.md`: what each choice gives a project.
- `wiki/product-wiki/Toolkit's Definition of Persistent Memory.md`: what counts as memory and how it is represented. Read it before changing memory guidance.
- `wiki/product-wiki/Hindsight Decisions and Evidence.md`: the test evidence and reasoning behind the Hindsight settings and add-on patches. Setup does not load it.
- The relevant earlier work items and Git history: how the project got here. Read them before proposing a wider change.

## Where things are

`<setup>` is `plugins/toolkit/skills/project-setup/`.

| Path | What is there |
| --- | --- |
| `plugins/toolkit/` | The plugin: its two manifests (`.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`) and `project-setup`. |
| `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` | The `toolkit-v2` marketplace, for Claude Code and for Codex. |
| `<setup>SKILL.md`, `<setup>reference/` | Setup, "check the setup", and "update the toolkit". |
| `<setup>every-project/` | Everything every project gets, at the paths a project has: project files, rules, shared skills, settings, and three hook commands. |
| `<setup>choices/work-items/` | The local, Notion, and GitHub work-tracker modules. |
| `<setup>choices/memory/` | The local, Notion, and Hindsight memory modules, and `repository-records/` (`DECISIONS.md` and `wiki/product-wiki/`) shared by local and Hindsight memory. |
| `<setup>choices/notion-shared/`, `<setup>choices/salesforce/` | The shared Notion tools and Salesforce module. |
| `.claude/skills/writing-harness-files/` | This repository's procedure for writing or changing a harness file, and its official guidance checklist. |
| `.claude/settings.json`, `.codex/hooks.json`, `.claude/rules/`, `.claude/output-styles/` | The host settings, prompt reminder, rules, and output style for sessions that work on this repository. |
| `wiki/product-wiki/` | Mike's definition of intended Toolkit behavior. |
| `wiki/reference/ai-external-knowledge/` | Official pages of Claude Code, Codex, and Hindsight, captured with Firecrawl. `INDEX.md` lists them. |
| `wiki/archive/` | Earlier research and review records. Read one only when a task needs that history. |
| `archive/` | Earlier setup material and Salesforce tools. |

Only `plugins/toolkit/` is shipped. Nothing shipped reads `wiki/` or `archive/`.

## The starter project

`<setup>every-project/` and the selected `<setup>choices/` modules together supply the starter project. Edit these folders directly.

- A change that alters what a project file means needs Mike's yes.
- Each choice supplies complete files and the additions to project guides and settings documented by its module. A file every project gets goes in `every-project/`, and a file for one choice goes in that choice's folder. No delivered file holds a conditional setup marker such as `<!-- if ... -->`. Setup records confirmed owner answers in the documented places.
- `<setup>reference/placing-files.md` describes how setup copies files. `<setup>SKILL.md` routes each answer to its choice module. Keep those routes current when adding a module.
- Two files are the owner's own from the first day: `owner-preferences.md` and, in a Salesforce project, `salesforce-agent-permissions.md`. Setup copies each once. "Update the toolkit" never compares or replaces them.
- Delivered skills sit under `.claude/skills/`; setup links `.agents/skills` to that folder so Codex reads the same project skills. This repository's `.claude/settings.json` turns each project skill off by name, and stops the starter project's instruction files from loading here. When the memory rule or reminder names one of those skills, use this guide's procedures and locations instead.
- Each folder guide, `AGENTS.md`, has a `CLAUDE.md` beside it that holds only `@AGENTS.md`. Never delete one.
- This repository's `.claude/rules/evaluate-the-owners-request.md` is a copy of the starter rule, `<setup>every-project/.claude/rules/evaluate-the-owners-request.md`. Edit the starter rule, then copy it over the copy. Never edit the copy. `.claude/output-styles/plain-english.md` is a copy of `<setup>every-project/.claude/output-styles/plain-english.md`, kept the same way.
- After a change, run the applicable checks below and raise the version. A project gets the change when its owner says "update the toolkit" there. `<setup>reference/update.md` describes how to handle files the toolkit no longer ships.

## Checks

Run them from the repository root before you hand work back.

```bash
claude plugin validate .
claude plugin validate ./plugins/toolkit
git diff --check
```

- Check every change against the toolkit wiki, especially the guiding design principles.
- Verify skill front matter, reference links, exact copies, and both hosts' settings. Use representative workflows and independent review to check behavior.
- Report any check you could not run; do not claim it passed.
- Checks and tests use LF line endings. `.gitattributes` keeps them in every checkout.
- Use scratch folders for setup and host-loading tests. Keep real project records and the owner's host configuration intact.
- Codex has no validate command. To prove that Codex accepts the plugin, install it into a scratch Codex home.

## Rules

- **No AI credit anywhere.** No "Generated with" line, no `Co-Authored-By` naming an AI, and no AI named in a comment, file header, manifest, README, commit, or pull request.
