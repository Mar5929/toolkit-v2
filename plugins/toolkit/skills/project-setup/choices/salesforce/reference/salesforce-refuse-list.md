# The refuse list of a Salesforce project

This file holds the entries that a Salesforce project adds to the refuse list, and what to tell the owner about them. A settings file that the project already had is merged as [skills-hooks-settings.md](../../../reference/skills-hooks-settings.md), "Merge rules", says.

The refuse list is `permissions.deny` in `.claude/settings.json`: Claude Code refuses a command that matches one of its entries. The settings that every project gets hold no Salesforce entry. A Salesforce project adds two kinds.

## The entries that every Salesforce project gets

Add these six entries in every Salesforce project. They refuse a command that deletes source or deletes an org, on any org:

- `Bash(sf project delete source *)`
- `Bash(sfdx force:source:delete *)`
- `Bash(sf org delete *)`
- `PowerShell(sf project delete source *)`
- `PowerShell(sfdx force:source:delete *)`
- `PowerShell(sf org delete *)`

Then add the entries for each production org and each read-only org, as the next section says.

## The entries for each production or read-only org

For each production org that the owner names, add entries to the refuse list, so that Claude Code refuses a command that changes that org. Write them into the project's `.claude/settings.json` when you write the org aliases. Claude Code matches an entry against the text of a command, and `*` stands for any text.

- Write two entries for each kind of command that changes an org: one for the org's name at the end of the command, and one for the name in the middle. For a deploy to the org `acme-prod`, the two entries are `Bash(sf project deploy * acme-prod)` and `Bash(sf project deploy * acme-prod *)`.
- The kinds of command are a deploy or a deploy validation (`sf project deploy`), each data change (`sf data create`, `sf data update`, `sf data upsert`, `sf data delete`, and `sf data import`), anonymous Apex and an Apex test run (`sf apex run`), and a Flow test run (`sf flow run` and `sf logic run`).
- Write no entry for a command that only reads, such as `sf data query` or `sf project retrieve`.
- When the owner gives the production username as well as the alias, write the same entries for the username.
- Write each entry a second time with `PowerShell(` in place of `Bash(`, for a session that runs on Windows.
- For a production org, follow the production cells of the owner's `.claude/rules/salesforce-agent-permissions.md`. Keep an entry while any row it covers says Never; leave it out only when every row it covers says Allowed or Ask first. The project's `.claude/rules/salesforce-org-safety.md`, "Keeping the refuse list in step", says how the entries map to the rows and how they stay in step later.
- Write all of the entries for each read-only org that the owner names.
- When no production org is known yet, write no entry. [salesforce-steps-left-for-the-owner.md](salesforce-steps-left-for-the-owner.md), "What the report lists as still open", says how setup records that the entries are still to be written.

Tell the owner in one line for which org Claude Code now refuses changes. The list stops a command that names the org as a word of its own, as in `-o acme-prod` or `--target-org acme-prod`. It is not a full check: a command that writes the name another way, such as `--target-org=acme-prod`, is not refused. Codex has no such list. In both, the owner's `.claude/rules/salesforce-agent-permissions.md` and `.claude/rules/salesforce-org-safety.md` decide what an agent may change.
