# The steps left for the owner in a Salesforce project

This file holds the steps that only the owner does in a Salesforce project, and what the setup report lists as still open.

## The owner's own steps

- Install Salesforce's own skills, when they are not installed yet. [salesforce-own-skills.md](salesforce-own-skills.md) says where they come from in Claude Code and in Codex.
- Connect the project's Salesforce org with `sf org login web --alias <alias>`, and tell the agent the alias, when the project's org does not exist yet or is not connected. The agent never picks an org or signs in to one itself.

## What the report lists as still open

List each item below in the setup report.

- Salesforce's skills are still missing at the end of setup.
- `PROJECT.md` holds ``- Salesforce org aliases: `none yet` ``. The owner still has to connect the project's Salesforce org, and the refuse list entries for production are still to be written. The report also lists the aliases line as a prompt left.
- The API version is not known yet. The report lists it as a prompt left, as [salesforce-api-version.md](salesforce-api-version.md), "Find the version", says.
