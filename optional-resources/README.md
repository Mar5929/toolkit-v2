# Optional resources

This folder holds skills and outside knowledge that Mike made in his projects
and may want again. Nothing here is part of the toolkit. Setup does not install
it, "update the toolkit" does not read it, and the `toolkit` plugin does not
ship it. An owner copies a resource into a project by hand when that project
needs it.

## What is here

| Folder | What it holds |
| --- | --- |
| [`skills/`](skills/) | One folder per skill, in the form a project's `.claude/skills/` folder takes. |
| [`ai-external-knowledge/`](ai-external-knowledge/) | One folder per topic of knowledge captured from outside a project, such as vendor documentation written up for an agent to read. |

### Skills

| Skill | What it does | Where it came from |
| --- | --- | --- |
| [`devops-center-work-item`](skills/devops-center-work-item/SKILL.md) | The steps to run a Salesforce DevOps Center work item by command: create it, commit components with Git, open the review, and promote it. | A Salesforce org merger project, 2026-10-13. It is a template: the project's own org names and limits are left as values in angle brackets. |

### AI external knowledge

| Topic | What it holds | Written |
| --- | --- | --- |
| [`salesforce-security-model`](ai-external-knowledge/salesforce-security-model/README.md) | How Salesforce decides who can see and change what: sharing and record access, role hierarchy, permission sets, muting, least privilege, and monitoring. Seven documents written from Salesforce's published documentation, each with its list of sources. | 2026-08-25 |

## Using a resource in a project

- **A skill:** copy its folder into the project's `.claude/skills/`. Read it
  first, replace each value in angle brackets with the project's own value, and
  check its limits against the project's rules.
- **A knowledge topic:** copy its folder into the project's
  `wiki/reference/ai-external-knowledge/`, and add its row to that folder's
  `INDEX.md`. Outside knowledge goes stale, so check the date it was written.

## What may be added here

This repository is public. Before a file is added, it must pass these checks:

- It holds no client name, person's name, org ID, record ID, repository name,
  or credential from the project it came from.
- It is Mike's own writing or his project's own writing. A copy of a vendor's
  pages is not added. A document written from those pages, with its sources
  listed, may be added.

Two topics that Mike's projects hold are left out for the second reason. Both
are copies of Salesforce's own pages: the DevOps Center documentation and the
Salesforce architect library. They stay in the project that captured them.
