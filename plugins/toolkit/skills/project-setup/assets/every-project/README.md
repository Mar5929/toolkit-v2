# <Project name>

<!-- Fill-in guide for a copied project: replace the project name and every angle-bracket prompt in the purpose, Start here, and Project checks and release with verified facts in that exact location. Delete this guide after setup. -->

<One sentence describing this project and the result it is building.>

## Purpose

<Describe the business problem, intended users, and outcome in one or two paragraphs.>

## Start here

1. <How to obtain the required access and tools.>
2. <How to identify the correct environment.>
3. <How to run the project's actual checks.>

## Project records

- [PROJECT.md](PROJECT.md): purpose, scope, systems, people, and the setup choices.
- [DECISIONS.md](DECISIONS.md): every decision and open question that more than one work item needs.
- [system/](system/): the approved description of the system, as numbered rules.
- [sources/](sources/): the originals the project received, such as meeting notes and client documents.
- [delivery/](delivery/): each release, deployment, data migration, and client handoff.
- [reference/](reference/): outside documentation, and the record of the system as it is today.
- [AGENTS.md](AGENTS.md): how the agent works in this project, where each kind of information goes, and the full project map.
- Active work, each item's design and decisions, the project's phases, and the project's own tasks: the work tracker chosen at setup, recorded in `PROJECT.md` under "Toolkit settings".

## Browse in Obsidian

To browse this project in Obsidian, choose **Open folder as vault** and select this project folder. Under **Settings → Files and links**, turn off **Use `[[Wikilinks]]`** so new links use Markdown format for compatibility with other tools. A link written as `[[WI-031]]` still works with this setting off. Obsidian creates its local `.obsidian/` settings folder when opened; Git ignores it.

## Project checks and release

- Local validation: <Verified command or procedure.>
- Deployment process: <Approved release path and owner.>
- Environments: <Verified environments; never infer a target from a template.>
