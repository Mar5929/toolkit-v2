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
<!-- if tracker=local -->
- [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md): the project's phases and the top-level work items in each.
<!-- endif -->
- [requirements/](requirements/): accepted functional behavior by area.
- [project-wide-records/AGENTS.md](project-wide-records/AGENTS.md): where to find questions, domain maps, people, target direction, and intake receipts shared across work items.
- [AGENTS.md](AGENTS.md): how the agent works in this project, where each kind of information goes, and the full project map.
- Active work, each item's design and decisions, and the project's own tasks: the work tracker chosen at setup, recorded in `PROJECT.md` under "Toolkit settings". Every decision made while working an item is saved in its Questions and Answers first; a project-wide decision, after the owner's yes, also gets a memory record.

<!-- if tracker=local or memory=local -->
## Browse in Obsidian

To browse this project in Obsidian, choose **Open folder as vault** and select this project folder. Under **Settings → Files and links**, turn off **Use `[[Wikilinks]]`** so new links use Markdown format for compatibility with other tools. Work item links such as `[[WI-031]]` still work with this setting off. Obsidian creates its local `.obsidian/` settings folder when opened; Git ignores it.

<!-- endif -->
<!-- if tracker=local -->
## Work items

The agent keeps work items in `work-items/`, which Git ignores. Each item is a folder, such as `WI-031-login-page/`, holding `WI-031.md`, `DESIGN.md` when a design exists, and a `references/` folder for source files such as meeting transcripts. You may move or rename item folders; the agent finds each item by its ID.

<!-- endif -->
<!-- if memory=local -->
## Project memory

The agent keeps project memory in `memory/`, which Git ignores.

A memory names each work item it concerns by ID: `[[WI-031]]` for a local work item, or the ID and a link to the item's Notion page, GitHub issue, or Jira ticket. Obsidian's Backlinks view on a local work item shows the memories that link to it. The session-start hook rebuilds the `memory/MEMORY.md` index; do not edit it by hand.

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
