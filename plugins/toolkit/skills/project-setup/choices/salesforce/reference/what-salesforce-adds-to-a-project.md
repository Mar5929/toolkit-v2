# What the Salesforce choice adds to a project

This file lists what setup adds to a Salesforce project: the files, the text in `AGENTS.md`, the entries in the settings, the line in `PROJECT.md`, and the lines in `.gitignore`. Steps 6, 7, and 9 of [salesforce-setup.md](../salesforce-setup.md) use it.

## Everything the choice adds, by kind

| Kind | What it adds |
| --- | --- |
| Rules, skills, files, and templates | Copy `choices/salesforce/files-to-add/` into the project. It holds three rules (`salesforce-org-safety.md`, `salesforce-agent-permissions.md`, and `salesforce-deployments.md`), the skills `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check`, `sfdx-project.json` and `.forceignore`, and the templates in `delivery/`. |
| Text in `AGENTS.md` | Two lines near the top, and the Salesforce rows of three tables. "The text in AGENTS.md" below gives them. |
| Settings | Entries in `permissions.deny` of `.claude/settings.json`. [salesforce-refuse-list.md](salesforce-refuse-list.md), "The entries that every Salesforce project gets" and "The entries for each production org", give them. |
| Files inside a skill | The same folder adds one file inside `managing-work-items`, which every project has: `references/salesforce-deploying.md`. |
| `PROJECT.md`, "Toolkit settings" | Add the line `- Salesforce org aliases:` at the end of the section, with one nested line for each org. [salesforce-org-aliases.md](salesforce-org-aliases.md), "The aliases line in PROJECT.md", gives the form. |
| Lines in `.gitignore` | Add these three lines, which keep the files of Salesforce's own tools out of Git: `.sfdx/`, `.sf/`, and `.localdevserver/`. |
| Outside the project folder | Nothing is made. |

`.claude/rules/salesforce-agent-permissions.md` is the owner's own file from the first day. "Update the toolkit" never compares or replaces it.

Step 6 of the setup file copies the files of the rows "Rules, skills, files, and templates" and "Files inside a skill". Step 7 writes the text in `AGENTS.md`, the line in `PROJECT.md`, and the lines in `.gitignore`. Step 9 writes the entries in the settings.

## The text in AGENTS.md

Add this text to the project's root `AGENTS.md`.

Below the paragraph about voice-to-text, add these two lines:

```markdown
- Use Salesforce's official skills (`forcedotcom/sf-skills`) for Salesforce platform questions and work when installed and enabled. Report missing skills when the task needs them.
- This project's rules and its three `sf-*` skills decide what may be deployed or changed. They win over an official Salesforce skill. `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices for each kind of action in each kind of org.
```

In the "Project map" table, add this row after the row for `working-files/`:

```markdown
| `force-app/`, `sfdx-project.json`, `.forceignore` | The Salesforce metadata this project builds and deploys, in `force-app/`, and the two files that tell Salesforce tools how to treat this repository. `force-app/` is made when the first metadata is added. | The Salesforce rules in `.claude/rules/`; `sf-component-tracker` before building. |
```

In the same table, add one sentence to each of two rows:

- to the row for `delivery/deployments/`, in "What it holds": "Also the component tracker and the package files."
- to the row for `.claude/hooks/`, `.claude/settings.json`, in "What it holds": "In Claude Code, the settings file also refuses a command that changes a production org and names it."

In the "Which skill" table, add this row:

```markdown
| Salesforce metadata changes, a production data change, or a deploy to a shared org | `sf-component-tracker`, `sf-data-change`, `sf-deploy-check`. `.claude/rules/salesforce-deployments.md` says when to open each. |
```

In the "Commands" table, add this row:

```markdown
| Validate a change against the sandbox | `.claude/rules/salesforce-org-safety.md`, "The commands". The aliases are under "Toolkit settings" in `PROJECT.md`. |
```
