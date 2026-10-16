# The org aliases of a Salesforce project

This file holds the three questions about the project's Salesforce orgs, the form of the aliases line in `PROJECT.md`, and what to write when an org is not known yet.

## The three questions

Ask the owner for the org aliases, one question per message. Before the first of these questions, show the aliases on this computer with `sf org list`, which only reads.

1. Ask for the sandbox that the agents may deploy to for testing. Recommend an alias only when its name matches this project or the owner said it is this project's. When none of the listed orgs is for this project, recommend "none yet".
2. Ask for production. By default agents never deploy to production or change it: every production cell of `.claude/rules/salesforce-agent-permissions.md` says Never, and Claude Code refuses those commands when they name the production org, as [salesforce-refuse-list.md](salesforce-refuse-list.md), "The entries for each production or read-only org", says. The owner may change those cells for this project.
3. Ask whether the project has orgs that agents may only read, such as an org whose data or metadata is being moved into the new one. Agents read them and never change them, and Claude Code refuses a command that changes one and names it.

## The aliases line in PROJECT.md

The aliases go in `PROJECT.md`, section "Toolkit settings", on the "Salesforce org aliases" line, as one nested line per org. Each nested line holds the alias, which org it is, and its purpose. Mark production and each read-only org. For example:

```text
- Salesforce org aliases:
  - `acme-uat`: the UAT sandbox; agents deploy here for testing.
  - `acme-prod`: production.
  - `legacy-prod`: the old org that data moves from; read-only.
```

Use only the aliases the owner names for this project.

- When none of this project's orgs is on this computer yet (the org does not exist or is not connected), never invent an alias, and never write an alias that the owner says belongs to another project into this project's files. Write ``- Salesforce org aliases: `none yet` ``. [salesforce-steps-left-for-the-owner.md](salesforce-steps-left-for-the-owner.md), "What the report lists as still open", says how setup then records that the owner still has to connect the org.
- When the owner gives an instruction about what an agent may do in an org (for example "don't use those" about the other orgs), write it into `.claude/rules/salesforce-agent-permissions.md`, in the place that the first bullets of that file give.

`.claude/rules/salesforce-agent-permissions.md` says what an agent may do in each kind of org, in Claude Code and in Codex.
