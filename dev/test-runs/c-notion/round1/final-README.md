# Toolkit V2 sample run c (safe to delete)

## Purpose

- For people new to Node who clone this project to try it, and for Mike Rihm when he returns to it later.
- `quote.js` prints one of three short quotes. The day of the month selects the quote, so runs on the same day print the same one.

## Start here

- Install Node.js if it is not already available.
- From this project folder, run `node quote.js`.

## Add a quote

- Open `quote.js` and add a quoted JavaScript string, followed by a comma, to the `quotes` array.
- Run `node quote.js`. The selected quote depends on the day of the month, so the new quote may not print today.

## Project records

- [PROJECT.md](PROJECT.md): purpose, scope, systems, and owners.
- [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md): phases and deliverable-sized work units.
- [DECISIONS.md](DECISIONS.md): decisions for the whole project.
- [requirements/](requirements/): accepted functional behavior by area.
- [AGENTS.md](AGENTS.md): how the agent works in this project, where each kind of information goes, and the full project map.
- Active work and each item's design: the work tracker chosen at setup, recorded in `.toolkit.json`.

## Project checks and release

- Local validation: `node quote.js`. No automated tests are configured.
- Toolkit V2 check: `toolkit doctor`. Work items and memory are on the Notion project page recorded in `.toolkit.json`.
- Deployment process: none specified.
- Environments: local Node.js execution only.
