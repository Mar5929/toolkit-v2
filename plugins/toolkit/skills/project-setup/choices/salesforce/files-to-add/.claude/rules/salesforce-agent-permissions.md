# What an Agent May Do in Each Salesforce Org

This file holds the owner's choices for this project. It starts with the toolkit's defaults. The owner changes it by telling you, and "update the toolkit" never replaces it.

- Read this file before any command that changes an org.
- Change this file only when the owner told you to in this session. A choice for every sandbox or scratch org, or for production, is a cell of the table: change the cell, and add the date and the owner's name in it. A narrower choice, such as one org, is a line under "Only in this project". A newer choice replaces the older one that says the opposite.
- Keep the choice only in this file. Write nothing about it in `owner-preferences.md` or in memory.
- `.claude/rules/salesforce-org-safety.md` holds the limits that are the same in every project. No line here changes them. That rule also says how this file and the refuse list in `.claude/settings.json` fit together.

## What each value means

- Allowed: run it without asking.
- Ask first: ask the owner, and run it after the owner's yes. The yes covers that one change in that session. It does not carry to another change, session, or org.
- Never: do not run it. Give the owner the exact command. For a data change, give the owner the handoff that the `sf-data-change` skill prepares.
- Never (fixed): `salesforce-org-safety.md` forbids it in every project, so changing the cell changes nothing.

## Actions

| Action | Sandbox or scratch org | Production | Read-only org |
| --- | --- | --- | --- |
| Read data or metadata | Allowed | Allowed | Allowed |
| Validate a deploy | Allowed | Never (fixed) | Never |
| Deploy metadata | Allowed | Never (fixed) | Never |
| Deploy with a destructive changes file | Ask first | Never (fixed) | Never |
| Deploy a profile | Never | Never (fixed) | Never |
| Run Apex or Flow tests | Allowed | Never (fixed) | Never |
| Change data | Ask first | Never (fixed) | Never |
| Run anonymous Apex | Ask first | Never (fixed) | Never |
| Create or change DevOps Center records | Ask first | Never | Never |
| Promote through a DevOps Center pipeline | Never | Never (fixed) | Never |
| Any other change to an org | Ask first | Never | Never |

A row covers its action whatever tool carries it out: the command line, an API, anonymous Apex, or a tool that wraps one of them. When two rows fit one action, the narrower row decides.

`PROJECT.md`, "Toolkit settings", names this project's orgs and says which one is production and which are read-only. A read-only org is one that agents only read, such as an org whose data is being moved into the new one.

## Confirm with the owner first

Before you start a change to one of these, confirm intent and scope with the owner. This is about whether and how to make the change. The table above decides the commands that carry it out.

- Object model: objects, fields, relationships, validation rules, record types.
- Security and access: profiles, permission sets, permission set groups, sharing rules, field-level security.
- Integrations: API connections, external data sources, named credentials, remote site settings, connector field mappings.
- Data-source priority: which system wins for a field or object.
- Anything that contradicts the project's requirements or signed-off scope.

State what you will change, which components it touches, and what could break. Then wait for the owner.

## Only in this project

Lines that only this project needs go here. Each line holds what the agent may or may not do, the date, and the owner's words. A line here wins over the table above.

None yet.
