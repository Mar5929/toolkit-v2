---
name: devops-center-work-item
description: The normal steps to run a Salesforce DevOps Center (Lifecycle Center) work item by command, when nothing is broken - create it, fill its fields, start it, commit components from the development sandbox to its branch with Git, open the review, mark it Ready to Promote, and promote it into a sandbox stage. Use when the owner asks to create, update, commit to, send to review, or promote a work item, or to get components onto a work item without picking them one by one on the screen.
---

# Running a DevOps Center work item by command

Use this skill to take one DevOps Center work item from creation to review, and
to promotion when the owner approves it, with commands only. The job is done
when the work item is at the status the owner asked for, its Change List holds
exactly the components that were meant to be on it, and the project's records
say what was done.

Salesforce now shows DevOps Center as "Lifecycle Center". Both names mean the
same app. The hub org is the org that holds DevOps Center, its pipeline, and
its work item records. It is often the production org.

This is a template. Before you use it in a project, replace each value in angle
brackets with the project's own value, and write the project's own limits into
"Limits that apply to every step".

## What was seen working, and what was not

These steps were run on one real pipeline on 2026-10-13, with Salesforce CLI
plugin `devops-center` 2.2.0.

| Step | Seen working |
| --- | --- |
| Create a work item | Yes |
| Set the assignee and the development environment | Yes |
| Move to In Progress, which makes the branch | Yes |
| Commit components with Git | Yes |
| DevOps Center lists the committed component by itself | Yes. The list was empty straight after the push and held the component about 6 minutes later |
| Open the review | Yes |
| Mark Ready to Promote by command | Not run |
| Promote by command | The command runs. No promotion by command was seen to succeed |

When you run a step for the first time in a project, tell the owner that it is
not proven there before you run it, and record the result.

## Limits that apply to every step

- Every command below that names the hub org writes to that org's records.
  When the hub org is production, follow the project's rules for production.
- Create or change a DevOps Center record only under a plan the owner approved.
  Say which work item, which components, and how far the work item goes.
- Promote only into a stage the owner approved for the agent. Leave the
  Production stage to the owner unless the project's rules say otherwise.
- Never merge a DevOps Center pull request by hand, and never push to a stage
  branch. DevOps Center merges the pull request itself during the promotion. A
  hand merge freezes the stage.
- Pass `--target-org <hub org>` on every `sf devops` command and
  `-o <alias>` on every other `sf` command. Never rely on the default org.
- A component cannot be taken off a work item on the screen. Check the list of
  files before you push.

## Step 1: create the work item

1. List the project's work items first, so that you do not make a second one
   with the same subject:
   `sf devops work-item list --target-org <hub org> --project-id <project id> --json`.
   `sf devops project list --target-org <hub org> --json` gives the project ID.
2. Create it. On Windows, run it from PowerShell; from Git Bash the command can
   fail when a value holds spaces.

   ```
   sf devops work-item create --target-org <hub org> --project-id <project id> --subject "<subject>" --description "<description>" --json
   ```

   - Subject: a short title of the change.
   - Description: what the work item changes and the ticket it belongs to.
3. The result does not give the work item's number. Read it:

   ```
   sf data query -o <hub org> --json -q "SELECT Id, Name, Subject, Status FROM WorkItem WHERE Subject = '<subject>'"
   ```

`sf devops work-item update --subject` failed with `JSON_PARSER_ERROR` on the
pipeline this was tested on. To change a subject there, update the `Subject`
field on the `WorkItem` record.

## Step 2: set the assignee and the development environment

The create command has no flag for either. Look both IDs up in the hub org,
set them on the `WorkItem` record, and read the record back.

```
sf data query -o <hub org> -q "SELECT Id, Name FROM DevopsEnvironment WHERE Name = '<environment name>'"
sf data query -o <hub org> -q "SELECT Id, Name FROM User WHERE Name = '<name>' AND IsActive = true"
sf data update record -o <hub org> -s WorkItem -i <work item id> --json -v "AssignedToId=<user id> DevelopmentEnvironmentId=<environment id>"
```

## Step 3: move it to In Progress

```
sf devops work-item update --target-org <hub org> --work-item-name <WI-number> --status "In Progress" --json
```

DevOps Center makes a branch named after the work item, started from the tip
of the first stage's branch. Confirm it:

```
sf data query -o <hub org> --json -q "SELECT Name, Status, SourceCodeRepositoryBranch.Name FROM WorkItem WHERE Name = '<WI-number>'"
```

## Step 4: commit the components

The components must already be in the development sandbox. The sandbox is
where a change is built and tested, and the branch must hold what the sandbox
holds. Never commit a file that was only written on this computer.

1. **Agree the list.** Show the owner the components that will go on the work
   item, and wait for approval.
2. **Check out the work item's branch** in a clone of the pipeline's
   repository. Use a separate worktree when other sessions use the same clone.

   ```
   git fetch origin <WI-number>
   git worktree add <folder> -b <WI-number> origin/<WI-number>
   ```

3. **Retrieve from the sandbox into that folder**, one `--metadata` flag per
   component or with a manifest:

   ```
   sf project retrieve start -o <development sandbox> --metadata "Flow:<name>" --metadata "CustomPermission:<name>"
   ```

4. **Check what changed.** Run `git status --short` and `git diff`. Every
   changed file must belong to a component on the agreed list. A retrieve can
   pull a whole shared file, such as a record type or a Lightning page, with
   another developer's change in it. When a file shows a change that is not
   this work item's, stop and tell the owner. Leave out anything the
   repository's `.forceignore` excludes.
5. **Commit and push.** Stage each path by name.

   ```
   git add <path> <path>
   git commit -m "<WI-number>: <what changed>"
   git push origin <WI-number>
   ```

6. **Confirm that DevOps Center lists the components.** Wait a few minutes,
   then read the list and compare it with the agreed list:

   ```
   sf data query -o <hub org> --json -q "SELECT MemberName, MemberType, ChangeType FROM WorkItemComponent WHERE WorkItemComponentList.WorkItem.Name = '<WI-number>'"
   ```

   When the list is still empty after 15 minutes, stop and tell the owner. Do
   not create the rows by hand.

A second commit to the same branch adds to the work item or updates a
component that is already on it.

## Step 5: open the review

```
sf devops review create --target-org <hub org> --work-item-name <WI-number> --json
```

The result gives the pull request's address. DevOps Center opens the pull
request from the work item's branch into the first stage's branch and sets the
work item to In Review. Read the pull request's files and checks, and give the
owner the link.

## Step 6: approval of the pull request

A person approves the pull request in source control. The account that opened
a pull request cannot approve it on GitHub. Nobody merges it by hand.

## Step 7: mark Ready to Promote

Only when the owner says so, after the approval:

```
sf devops work-item update --target-org <hub org> --work-item-name <WI-number> --status "Ready to Promote" --json
```

## Step 8: promote

Only as a step of a plan the owner approved.

```
sf devops promote --target-org <hub org> --work-item-id <work item id> --target-stage-id <stage id>
sf devops request status --target-org <hub org> --request-token <token>
```

Read the work item's status and the stage from the hub org afterwards. A
passing `sf devops promotion validate` does not predict the result.

## What the commands cannot do

`sf devops work-item update --status` accepts only "In Progress" and "Ready to
Promote". To retire a work item, the owner sets it to Never on the screen.

## Source

Salesforce Help, "Quick Start: Use Salesforce CLI with Lifecycle Center":
https://help.salesforce.com/s/articleView?id=platform.devops_center_cli_quick_start.htm&type=5
