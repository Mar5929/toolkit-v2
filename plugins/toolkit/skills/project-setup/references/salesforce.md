# Salesforce projects

This file says which Salesforce facts setup records in a Salesforce project: the org aliases, written while you build the setup copy, and the API version, written after the files are in place. It also says how to check that Salesforce's own skills are installed, and what to ask the owner about them. Open it at step 7 of "New project" in `SKILL.md`, and at step 4 when you write the org aliases. Its job is done when `PROJECT.md` holds the org aliases, the API version is written in the two files that hold it, the owner knows when Salesforce's skills are not installed, and the owner has said what to have on or off. Where the owner cannot give a value yet, the sections below say what to write in its place.

The setup copy is the project's finished files, built in a temporary folder before anything is put into the project.

Everything else a Salesforce project needs comes with the `salesforce` setup folder: the rules, the three `sf-*` skills, and the Salesforce templates in `delivery/`. A setup folder is a folder in this skill's `assets/` that holds project files at the paths a project has them. Salesforce's own skills come from Salesforce, not from setup.

## Salesforce's skills

Salesforce publishes its own skills in the GitHub repository `forcedotcom/sf-skills`. A Salesforce project relies on them for platform questions and Salesforce work. They come from Salesforce. Setup installs none of them, and it changes one of their settings only when the owner says so.

- **Check that they are installed.** In Claude Code they come as plugins of that repository's marketplace, `salesforce`. The owner uses these seven: `salesforce-development`, `dx-devops`, `experience-lwc`, `integration`, `salesforce-code-quality`, `platform-lightning-widgets`, and `platform-trust-security`. In Codex they are skills, which `npx skills add forcedotcom/sf-skills` installs. Tell the owner what is missing.
- **Ask the owner what to have on or off**, in one message, and change only what the owner says:
  - whether Salesforce's plugins are on for the whole computer or only in Salesforce projects. Their hooks run on every command and every file edit wherever the plugins are on;
  - the automatic deploy of `salesforce-development` (`SFDX_AUTO_DEPLOY`). It deploys each saved file to an org, and nothing in the project checks that deploy;
  - the usage data that the same plugin sends (`SF_DISABLE_TELEMETRY`).

When Salesforce's skills are still missing at the end of setup, add a line to the report, and add a "Waiting on" line to the project's Current State. The project's Current State is the project's one short page of what is true now. `finishing.md`, "The project's Current State", says how to write that line.

## The org aliases

Ask the owner for the org aliases in the interview, as `interview.md`, "Question 4: Salesforce", says. Write them while you build the setup copy, at the point that `setup-copy.md`, "The project name and "Toolkit settings"", gives.

The aliases go in `PROJECT.md`, section "Toolkit settings", on the "Salesforce org aliases" line, as one nested line per org. Each nested line holds the alias, which org it is, and its purpose. Mark production. For example:

```text
- Salesforce org aliases:
  - `acme-uat`: the UAT sandbox; agents deploy here for testing.
  - `acme-prod`: production.
```

Use only the aliases the owner names for this project.

- When none of this project's orgs is on this computer yet (the org does not exist or is not connected), never invent an alias, and never write an alias that the owner says belongs to another project into this project's files. Write ``- Salesforce org aliases: `none yet` ``.
- The owner's step "Connect the project's Salesforce org" then gets a "Waiting on" line in the project's Current State, and the report lists the line as a prompt left. `finishing.md`, "The project's Current State", says how to write the "Waiting on" line.
- When the owner gives an instruction about what an agent may do in an org (for example "don't use those" about the other orgs), write it into `.claude/rules/salesforce-agent-permissions.md`, in the place that the first bullets of that file give.

`.claude/rules/salesforce-agent-permissions.md` says what an agent may do in each kind of org, in Claude Code and in Codex.

## The refuse list for production

For each production org that the owner names, add entries to `permissions.deny` in the project's `.claude/settings.json`, so that Claude Code refuses a command that changes that org. Claude Code matches an entry against the text of a command, and `*` stands for any text.

- Write two entries for each kind of command that changes an org: one for the org's name at the end of the command, and one for the name in the middle. For a deploy to the org `acme-prod`, the two entries are `Bash(sf project deploy * acme-prod)` and `Bash(sf project deploy * acme-prod *)`.
- The kinds of command are a deploy or a deploy validation (`sf project deploy`), each data change (`sf data create`, `sf data update`, `sf data upsert`, `sf data delete`, and `sf data import`), anonymous Apex and an Apex test run (`sf apex run`), and a Flow test run (`sf flow run`).
- Write no entry for a command that only reads, such as `sf data query` or `sf project retrieve`.
- When the owner gives the production username as well as the alias, write the same entries for the username.
- On Windows, write each entry a second time with `PowerShell(` in place of `Bash(`.
- When no production org is known yet, write no entry. Add the entries when the owner names the org.

Tell the owner in one line which org Claude Code now refuses. The list stops a command that names production plainly, and it is not a full check. Codex has no such list. `.claude/rules/salesforce-org-safety.md` forbids every change to production in both.

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

## Mistakes to avoid

- Setup only reads orgs (`sf org list`, `sf org display`). Never run a deploy, a data command, or anything that changes an org during setup.
- A Salesforce platform question is for Salesforce's skills, not for setup.
