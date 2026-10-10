# A Salesforce project

Open this file when the owner answers yes to question 7 of `SKILL.md`. It gives the default to tell the owner, the questions to ask, what the choice adds to the project, and what it needs at the finish.

Its job is done when all of these are true: the Salesforce files are in the project; `PROJECT.md` holds the org aliases; `.claude/settings.json` holds the refuse list entries, and the entries for each production org that the owner named; the API version is written in the two files that hold it; the owner knows when Salesforce's skills are not installed; and the owner has said what to have on or off. Where the owner cannot give a value yet, the sections below say what to write in its place.

## Contents

- What the toolkit sets up by default
- Questions for the owner
- What this choice adds to the project
- Salesforce's skills
- The org aliases
- The refuse list
- The refuse list for production
- The API version
- At the finish
- Known problems

## What the toolkit sets up by default

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project gets the toolkit's rules for Salesforce work, three skills, and templates for deployments, data migrations, and releases in `delivery/`.
- An agent never deploys to production and never changes its data. Claude Code refuses a command that changes a production org and names it.
- In a sandbox or a scratch org, the agent may read, validate, deploy, and run tests without asking, and asks first before a data change, a destructive deploy, or anonymous Apex. The table "Actions" in the project's `.claude/rules/salesforce-agent-permissions.md` holds every default.
- Salesforce's own skills do the Salesforce platform work. They come from Salesforce, and setup installs none of them.

## Questions for the owner

Ask one question per message.

- **Which sandbox the agents may deploy to, and which org is production.** "The org aliases" below gives the two questions.
- **Whether the defaults for what an agent may do in each kind of org are what the owner wants.** Write each change into `.claude/rules/salesforce-agent-permissions.md`, in the place that the first bullets of that file give.
- **Which of Salesforce's own skills to have on or off.** "Salesforce's skills" below gives the question.
- **The API version**, when it cannot be read from the sandbox. "The API version" below says how to read it and what to ask.

## What this choice adds to the project

| Kind | What it adds |
| --- | --- |
| Rules, skills, files, and templates | Copy `choices/salesforce/files-to-add/` into the project. It holds the Salesforce rules, the skills `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check`, `sfdx-project.json` and `.forceignore`, and the templates in `delivery/`. |
| Settings | Entries in `permissions.deny` of `.claude/settings.json`. "The refuse list" and "The refuse list for production" give them. |
| `PROJECT.md`, "Toolkit settings" | Salesforce org aliases: one nested line for each org. "The org aliases" gives the form. |
| Outside the project folder | Nothing is made. |

`.claude/rules/salesforce-agent-permissions.md` is the owner's own file from the first day. "Update the toolkit" never compares or replaces it.

## Salesforce's skills

Salesforce publishes its own skills in the GitHub repository `forcedotcom/sf-skills`. A Salesforce project relies on them for platform questions and Salesforce work. They come from Salesforce. Setup installs none of them, and it changes one of their settings only when the owner says so.

- **Check that they are installed.** In Claude Code they come as plugins of that repository's marketplace, `salesforce`. The owner uses these seven: `salesforce-development`, `dx-devops`, `experience-lwc`, `integration`, `salesforce-code-quality`, `platform-lightning-widgets`, and `platform-trust-security`. In Codex they are skills, which `npx skills add forcedotcom/sf-skills` installs. Tell the owner what is missing.
- **Ask the owner what to have on or off**, in one message, and change only what the owner says:
  - whether Salesforce's plugins are on for the whole computer or only in Salesforce projects. Their hooks run on every command and every file edit wherever the plugins are on;
  - the automatic deploy of `salesforce-development` (`SFDX_AUTO_DEPLOY`). It deploys each saved file to an org, and nothing in the project checks that deploy;
  - the usage data that the same plugin sends (`SF_DISABLE_TELEMETRY`).

When Salesforce's skills are still missing at the end of setup, add a line to the report, and add a "Waiting on" line to the project's Current State. The project's Current State is the project's one short page of what is true now. `reference/finishing.md`, "The project's Current State", says how to write that line.

## The org aliases

Ask the owner for the org aliases, one question per message. Before the first of these questions, show the aliases on this computer with `sf org list`, which only reads.

1. Ask for the sandbox that the agents may deploy to for testing. Recommend an alias only when its name matches this project or the owner said it is this project's. When none of the listed orgs is for this project, recommend "none yet".
2. Ask for production. Agents never deploy to production or change its data. The rule `salesforce-org-safety.md` forbids both, and Claude Code refuses a command that changes the production org and names it, as "The refuse list for production" below says.

The aliases go in `PROJECT.md`, section "Toolkit settings", on the "Salesforce org aliases" line, as one nested line per org. Each nested line holds the alias, which org it is, and its purpose. Mark production. For example:

```text
- Salesforce org aliases:
  - `acme-uat`: the UAT sandbox; agents deploy here for testing.
  - `acme-prod`: production.
```

Use only the aliases the owner names for this project.

- When none of this project's orgs is on this computer yet (the org does not exist or is not connected), never invent an alias, and never write an alias that the owner says belongs to another project into this project's files. Write ``- Salesforce org aliases: `none yet` ``.
- The owner's step "Connect the project's Salesforce org" then gets a "Waiting on" line in the project's Current State, and the report lists the line as a prompt left. The line also says that the refuse list entries for production are still to be written. `reference/finishing.md`, "The project's Current State", says how to write the "Waiting on" line.
- When the owner gives an instruction about what an agent may do in an org (for example "don't use those" about the other orgs), write it into `.claude/rules/salesforce-agent-permissions.md`, in the place that the first bullets of that file give.

`.claude/rules/salesforce-agent-permissions.md` says what an agent may do in each kind of org, in Claude Code and in Codex.

## The refuse list

The refuse list is `permissions.deny` in `.claude/settings.json`: Claude Code refuses a command that matches one of its entries. The settings that every project gets hold no Salesforce entry. A Salesforce project adds two kinds.

Add these six entries in every Salesforce project. They refuse a command that deletes source or deletes an org, on any org:

- `Bash(sf project delete source *)`
- `Bash(sfdx force:source:delete *)`
- `Bash(sf org delete *)`
- `PowerShell(sf project delete source *)`
- `PowerShell(sfdx force:source:delete *)`
- `PowerShell(sf org delete *)`

Then add the entries for each production org, as the next section says.

## The refuse list for production

For each production org that the owner names, add entries to the refuse list, so that Claude Code refuses a command that changes that org. Write them into the project's `.claude/settings.json` when you write the org aliases. Claude Code matches an entry against the text of a command, and `*` stands for any text.

- Write two entries for each kind of command that changes an org: one for the org's name at the end of the command, and one for the name in the middle. For a deploy to the org `acme-prod`, the two entries are `Bash(sf project deploy * acme-prod)` and `Bash(sf project deploy * acme-prod *)`.
- The kinds of command are a deploy or a deploy validation (`sf project deploy`), each data change (`sf data create`, `sf data update`, `sf data upsert`, `sf data delete`, and `sf data import`), anonymous Apex and an Apex test run (`sf apex run`), and a Flow test run (`sf flow run` and `sf logic run`).
- Write no entry for a command that only reads, such as `sf data query` or `sf project retrieve`.
- When the owner gives the production username as well as the alias, write the same entries for the username.
- Write each entry a second time with `PowerShell(` in place of `Bash(`, for a session that runs on Windows.
- When no production org is known yet, write no entry. "The org aliases" above says how the project's Current State records that the entries are still to be written.

Tell the owner in one line for which org Claude Code now refuses changes. The list stops a command that names the org as a word of its own, as in `-o acme-prod` or `--target-org acme-prod`. It is not a full check: a command that writes the name another way, such as `--target-org=acme-prod`, is not refused. Codex has no such list. `.claude/rules/salesforce-org-safety.md` forbids every change to production in both.

## The API version

The copied files hold the API version as `XX.0`. Fill it in two files.

1. Read the API version from the sandbox with a command that only reads. The version is the `apiVersion` field of the output of this command:

   ```text
   sf org display -o <sandbox alias> --json
   ```

   - `<sandbox alias>` is only the sandbox alias the owner gave for this project. Never run `sf org display`, or any `sf` command with `-o` or `--target-org`, against an org the owner did not name for this project, even to read one value. The other orgs on this computer may belong to another client.
   - When there is no sandbox yet, or the command fails, say that you could not read the version from an org, and ask the owner which API version the project uses. Never call a version the newest or the current one from memory, because Salesforce adds a new API version three times a year.
   - When the owner does not know the version yet, leave `XX.0` in both files, add no other line anywhere, and list it in the report as a prompt left.
   - A project that already had its own `sfdx-project.json` keeps its `sourceApiVersion`. For such a project, skip step 1, leave `sfdx-project.json` as it is, and write that version in the `package.xml` only.
2. Write the version in two places:
   - in `sfdx-project.json`, as the `sourceApiVersion` value;
   - in `delivery/deployments/full-project-deployment-template/package.xml`, on the `<version>` line.

Leave `XX.0` in the two work item templates, `delivery/deployments/work-item-deployment-template/package.xml` and `destructiveChanges.xml`. Each copy of them fills the version from `sfdx-project.json`, as its fill-in guide says.

## At the finish

- **Check.** `jq '.permissions.deny' .claude/settings.json` lists the six entries of "The refuse list", and the entries for each production org that the owner named.
- **The owner's own steps:**
  - Install Salesforce's own skills, when they are not installed yet. "Salesforce's skills" says where they come from in Claude Code and in Codex.
  - Connect the project's Salesforce org with `sf org login web --alias <alias>`, and tell the agent the alias, when the project's org does not exist yet or is not connected. The agent never picks an org or signs in to one itself.

## Known problems

- Setup only reads orgs (`sf org list`, `sf org display`). Never run a deploy, a data command, or anything that changes an org during setup.
- A Salesforce platform question is for Salesforce's skills, not for setup.
