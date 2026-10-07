# Pocket Ledger

Pocket Ledger is an iPhone app for logging money transactions. This copy is a scratch project for testing Toolkit V2, and nothing in it is real.

## Purpose

People forget the cash they spend. Pocket Ledger lets a user log a transaction in a few taps and see where the month's money went.

## Start here

1. Nothing is installed yet. The app's code does not exist: the first work item is still in its requirements.
2. The systems and their environments are listed in [PROJECT.md](PROJECT.md), "Systems and environments".
3. Run the project's checks: the commands are in [AGENTS.md](AGENTS.md), "Commands".

## Project records

- [PROJECT.md](PROJECT.md): purpose, scope, systems, people, and the setup choices.
- [DECISIONS.md](DECISIONS.md): every decision and open question that more than one work item needs.
- [system/](system/): the approved description of the system, as numbered rules.
- [sources/](sources/): the sources, which are the documents and messages the project received, such as meeting notes and client documents.
- [delivery/](delivery/): each release, deployment, data migration, and client handoff.
- [reference/](reference/): outside documentation, and the record of the system as it is today.
- [AGENTS.md](AGENTS.md): how the agent works in this project, where each kind of information goes, and the full project map.
- Active work, each work item's design and decisions, the project's phases, and the project's own tasks: the place chosen at setup, which the "Tracker" line in `PROJECT.md` under "Toolkit settings" names.

## Browse in Obsidian

To read this project's Markdown files in Obsidian, choose **Open folder as vault** and select this project folder. Under **Settings → Files and links**, turn off **Use `[[Wikilinks]]`** so new links use Markdown format, which other tools also read. Obsidian creates its local `.obsidian/` settings folder when opened; Git ignores it.

## Release

- Deployment process: Mike uploads each beta build to TestFlight himself.
- Environments: listed in [PROJECT.md](PROJECT.md), "Systems and environments".
- Build, test, and deploy commands: [AGENTS.md](AGENTS.md), "Commands".
