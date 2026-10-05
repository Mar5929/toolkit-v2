# Salesforce projects

Purpose: the Salesforce facts setup records: the org aliases, written while
you build the setup copy, and the API version, written after the files are
in place. Everything else a Salesforce project needs comes with the
`salesforce` setup folder: the rules, the three `sf-*` skills, the two org
guards, the Salesforce templates in `delivery/`, and `tools/`. Salesforce's own skills come from Salesforce, not from setup.

## Salesforce's skills

Salesforce publishes official skills (`forcedotcom/sf-skills`). A Salesforce
project relies on them for platform questions and Salesforce work. Check
that they are installed on this computer or in the project, by looking in
the host's skill folders (`~/.claude/skills`, the project's `.claude/skills`,
`~/.agents/skills`) or the plugin list. When they are not there, tell the
owner and give him this command to run himself:

```text
npx skills add forcedotcom/sf-skills
```

Setup never installs them itself. Add a line to the report, and a Current
State "Waiting on the owner" line (`finishing.md` in this folder), when he
has not installed them yet.

## The org aliases

Ask for them in the interview (`interview.md` in this folder, question 4).
Write them while you build the setup copy (`setup-copy.md` in this folder,
"The project name and "Toolkit settings""): in `PROJECT.md`, section
"Toolkit settings", on the "Salesforce org aliases" line, one nested line
per org: the alias, which org it is, and its purpose. Mark production. For
example:

```text
- Salesforce org aliases:
  - `acme-uat`: the UAT sandbox; agents deploy here for testing.
  - `acme-prod`: production. Agents never deploy or change data here.
```

Use only the aliases the owner names for this project. When none of this
project's orgs is on this computer yet (the org does not exist or is not
connected), never invent an alias, and never write an alias he says belongs
to another project into this project's files. Write
``- Salesforce org aliases: `none yet` ``. His step "Connect the project's
Salesforce org" then gets a Current State "Waiting on the owner" line
(`finishing.md` in this folder), and the report lists the line as a prompt
left. An instruction he gives about the other orgs (for example "don't use
those") goes to `owner-preferences.md` (`finishing.md`, "Instructions he
gives during setup").

Leave `.claude/protected-orgs.json` as copied: the guard finds
production orgs itself and blocks them. Agents never deploy to production or
change its data; the guards hand the owner the command instead. In Codex
the owner also runs every sandbox deploy and sandbox data change; the agent
gives him the exact command with its `-o <sandbox alias>`.

## The API version

The copied files hold the API version as `XX.0`. Fill it in two files.

1. Read it from the sandbox with a command that only reads: the
   `apiVersion` field of

   ```text
   sf org display -o <sandbox alias> --json
   ```

   `<sandbox alias>` is only the sandbox alias the owner gave for this
   project. Never run `sf org display`, or any `sf` command with `-o` or
   `--target-org`, against an org he did not name for this project, even to
   read one value: the other orgs on this computer may belong to another
   client.
   No sandbox yet, or the command fails: say you could not read the version
   from an org, and ask the owner which API version the project uses. Never
   call a version the newest or the current one from memory: Salesforce
   adds a new API version three times a year. He does not know the version
   yet: leave `XX.0` in both files, add no other line anywhere, and list it
   in the report as a prompt left. A project that already had its own
   `sfdx-project.json` keeps its `sourceApiVersion`: skip step 1, leave
   `sfdx-project.json` as it is, and write that version in the
   `package.xml` only.
2. Write it in:
   - `sfdx-project.json`: the `sourceApiVersion` value;
   - `delivery/deployments/full-project-deployment-template/package.xml`: the
     `<version>` line.

Leave `XX.0` in the two work item templates,
`delivery/deployments/work-item-deployment-template/package.xml` and
`destructiveChanges.xml`. Each copy of them fills the version from
`sfdx-project.json`, as its fill-in guide says.

## Gotchas

- Setup only reads orgs (`sf org list`, `sf org display`). Never run a
  deploy, a data command, or anything that changes an org during setup.
- A Salesforce platform question is for Salesforce's skills, not for setup.
