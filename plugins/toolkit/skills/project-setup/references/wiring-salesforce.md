# Wiring a Salesforce project

Purpose: the two Salesforce facts setup records after init with
`--salesforce`: the org aliases and the API version.

## The org aliases

Ask for them in the interview (`interview.md` in this folder, question 4),
then record them after init:

```text
toolkit config set salesforce.orgs.sandbox <alias>
toolkit config set salesforce.orgs.production <alias>
```

The protected-org guards read these. Agents never deploy to production or
change its data: the guards block it and hand the owner the command instead.
In Codex the owner also runs every sandbox deploy and sandbox data change;
the agent hands him the exact command with its `-o <sandbox>`.

## The API version

The model leaves the API version as `XX.0`. Fill it in two files.

1. Read it from the sandbox org with a read-only command, the `apiVersion`
   field of:

   ```text
   sf org display -o <sandbox alias> --json
   ```

   No sandbox yet, or the command fails: ask the owner which API version the
   project uses.

2. Write it in both places:

   - `sfdx-project.json`: the `sourceApiVersion` value.
   - `delivery/deployment/full-project-deployment-template/package.xml`: the
     `<version>` line.

Leave `XX.0` in the two work item templates,
`delivery/deployment/work-item-deployment-template/package.xml` and
`destructiveChanges.xml`. They are copied once per work item, and each one's
fill-in guide comment says to replace `XX.0` in the copy with the version from
`sfdx-project.json`. That works only when step 2 has put the real version in
`sfdx-project.json`.

## Gotchas

- `sf org list` and `sf org display` only read. Never run a deploy, a data
  command, or anything that changes an org during setup.
- Salesforce platform questions go to `sf-architect-solutioning`; setup does
  not answer them.
