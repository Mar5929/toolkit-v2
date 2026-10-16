# The API version of a Salesforce project

This file holds how to find the project's API version and where to write it.

The files that this choice copies into the project hold the API version as `XX.0`. Fill it in two files.

## Find the version

Read the API version from the sandbox with a command that only reads. The version is the `apiVersion` field of the output of this command:

```text
sf org display -o <sandbox alias> --json
```

- `<sandbox alias>` is only the sandbox alias the owner gave for this project. Never run `sf org display`, or any `sf` command with `-o` or `--target-org`, against an org the owner did not name for this project, even to read one value. The other orgs on this computer may belong to another client.
- When there is no sandbox yet, or the command fails, say that you could not read the version from an org, and ask the owner which API version the project uses. Never call a version the newest or the current one from memory, because Salesforce adds a new API version three times a year.
- When the owner does not know the version yet, leave `XX.0` in both files, add no other line anywhere, and list it in the report as a prompt left.
- A project that already had its own `sfdx-project.json` keeps its `sourceApiVersion`. For such a project, do not read the version from the sandbox, leave `sfdx-project.json` as it is, and write that version in the `package.xml` only.

## Write the version

Write the version in two places:

- in `sfdx-project.json`, as the `sourceApiVersion` value;
- in `delivery/deployments/full-project-deployment-template/package.xml`, on the `<version>` line.

Leave `XX.0` in the two work item templates, `delivery/deployments/work-item-deployment-template/package.xml` and `destructiveChanges.xml`. Each copy of them fills the version from `sfdx-project.json`, as its fill-in guide says.
