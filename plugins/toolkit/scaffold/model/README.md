# <Project name>

<!-- Fill-in guide for a copied project: replace the project name and every angle-bracket prompt in the purpose, Start here, and Project checks and release with verified facts in that exact location. Delete this guide after setup. -->

<One sentence describing this project and the result it is building.>

## Purpose

<Describe the business problem, intended users, and outcome in one or two paragraphs.>

## Start here

1. <How to obtain the required access and tools.>
<!-- if salesforce -->
2. <How to identify the correct Salesforce org or environment.>
<!-- endif -->
<!-- if not salesforce -->
2. <How to identify the correct environment.>
<!-- endif -->
3. <How to run the project's actual checks.>

## Project records

- [PROJECT.md](PROJECT.md): purpose, scope, systems, and owners.
- [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md): phases and deliverable-sized work units.
- [DECISIONS.md](DECISIONS.md): decisions for the whole project.
- [requirements/](requirements/): accepted functional behavior by area.
- [AGENTS.md](AGENTS.md): how the agent works in this project, where each kind of information goes, and the full project map.
- Active work and each item's design: the work tracker chosen at setup, recorded in `.toolkit.json`.

<!-- if memory=builtin -->
## Project memory

The agent keeps project memory in `.memory/`, which Git ignores. Back it up with `toolkit memory export --to <folder outside this project>`; a fresh clone restores it with `toolkit memory import --from <that folder>`.

To browse it in Obsidian, choose **Open folder as vault** and select `.memory/`. Under **Settings → Files and links**, turn off **Use [[Wikilinks]]** so new links use Markdown format for compatibility with other tools. Obsidian's Backlinks view will show incoming links. Obsidian creates its local `.obsidian/` settings folder when opened. The generated `MEMORY.md` index is kept by `toolkit memory reindex`, not by manual edits.

<!-- endif -->
## Project checks and release

- Local validation: <Verified command or procedure.>
- Deployment process: <Approved release path and owner.>
<!-- if salesforce -->
- Environments: <Verified orgs and aliases; never infer a target from a template.>
<!-- endif -->
<!-- if not salesforce -->
- Environments: <Verified environments; never infer a target from a template.>
<!-- endif -->
