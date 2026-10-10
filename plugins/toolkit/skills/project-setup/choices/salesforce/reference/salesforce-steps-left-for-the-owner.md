# The steps left for the owner in a Salesforce project

This file holds the steps that only the owner does in a Salesforce project, and how setup records what is still open when setup finishes. Steps 11, 13, and 14 of [salesforce-setup.md](../salesforce-setup.md) use it.

## The owner's own steps

- Install Salesforce's own skills, when they are not installed yet. [salesforce-own-skills.md](salesforce-own-skills.md) says where they come from in Claude Code and in Codex.
- Connect the project's Salesforce org with `sf org login web --alias <alias>`, and tell the agent the alias, when the project's org does not exist yet or is not connected. The agent never picks an org or signs in to one itself.

## How setup records what is still open

- When Salesforce's skills are still missing at the end of setup, add a line to the report, and add a "Waiting on" line to the project's Current State.
- When `PROJECT.md` holds ``- Salesforce org aliases: `none yet` ``, the owner's step "Connect the project's Salesforce org" gets a "Waiting on" line in the project's Current State, and the report lists the line as a prompt left. The line also says that the refuse list entries for production are still to be written.
- When the API version is not known yet, the report lists it as a prompt left, as [salesforce-api-version.md](salesforce-api-version.md), "Find the version", says.

The project's Current State is the project's one short page of what is true now. A project with local or Notion memory has one, and [reference/finishing.md](../../../reference/finishing.md), "The project's Current State", says how to write a "Waiting on" line. A Hindsight project has no Current State. In a Hindsight project, write each of these lines as a project task, as the same section says, and name it in the report.
