# The setup interview

Detail for `project-setup` step 2. Ask one question per message. Each
question carries a recommendation and its main reason, so the owner can
answer "yes" and move on.

## Look before asking

Check these first, without asking:

- Is this folder a Git repository? (`git rev-parse --show-toplevel`.) No
  repository: say so and offer `git init`. Toolkit V2 finds the project, the
  tracker, and memory through Git.
- Is the repository empty, or does it already hold code? Name the language
  and framework you see.
- `sfdx-project.json` present: this is a Salesforce project. Confirm it in
  one line instead of asking.
- `.toolkit.json` present with `"toolkit": "toolkit-v2"`: this is a repair,
  not a new setup (see `repair-and-wiring.md`).
- Files from the current toolkit (`.toolkit-memory.json`, `knowledge/`,
  `CLAUDE.md` files): tell the owner what you found. Toolkit V2 adds its own
  files and turns the current toolkit's plugins off for this project; it does
  not move or delete the old files. Ask before touching them.
- The owner name: `git config user.name`.
- `ntn whoami` (only matters for Notion): signed in or not.
- `toolkit hindsight health` (only matters for Hindsight): the local server is
  up or not.

## Question 1: the project name

Confirm the name, key, id prefix, and owner in one line:

> I'll call this project "Acme CRM" (short key `acme-crm`, work item ids `WI-001`, `WI-002`, owner Mike). Is that right?

- The key is the name in lowercase words joined by hyphens. It names the
  Hindsight memory bank and appears in the Notion page title.
- The id prefix is `WI` unless the owner wants another (for example `ACME`).
  A different prefix is set right after init, before any item exists, with
  `toolkit config set tracker.idPrefix <prefix>`.

## Question 2: where work is tracked

> Where should work items live? I recommend local folders on this computer: they are the fastest, work offline, and need nothing else set up. Choose Notion if you want to see and change the board on your phone or the web. GitHub Issues and Jira are possible, but the toolkit only gives written instructions for them.

| Choice | `--tracker` | Good when | What to know |
| --- | --- | --- | --- |
| Local folders | `local` | A solo project on one computer | Items live in `.work-items/`, which Git ignores. They stay on this computer; `toolkit export` is the backup. |
| Notion | `notion` | The owner wants the board on his phone or the web | Needs `ntn` signed in. Each project gets its own Work Items and Memory databases under the "AI Agent Second Brain" page. |
| GitHub Issues | `github` | The code and the team already live in GitHub | No driver: agents follow written instructions with `gh`. Labels are created once, with a yes. |
| Jira | `jira` | A client requires Jira | No driver: agents follow written instructions with the Jira tool the owner connects. |

## Question 3: where memory lives

> Where should the project's memory live? I recommend the built-in `.memory/` folder: it is private, fast, and needs no server. [When the tracker is Notion: I recommend Notion, so work and memory sit together and you can read both on your phone.] Hindsight is also installed on this Mac; choose it if you want search by meaning across many memories.

| Choice | `--memory` | Good when | What to know |
| --- | --- | --- | --- |
| Built-in `.memory/` | `builtin` | Most projects | Files in the main checkout, Git-ignored, on this computer only; the `memory-tidy` skill backs it up to a folder the owner picks. |
| Local Hindsight | `hindsight` | Many memories, and search by meaning matters | The local server at `127.0.0.1:8888` must be running (a background service on this Mac). One memory bank per project. Never Hindsight Cloud. |
| Notion | `notion` | The tracker is Notion, or the owner reads memory on his phone | The project's Memory database in Notion. Needs `ntn` signed in. |

Recommendation rule: Notion when the tracker is Notion; otherwise built-in.

## Question 4: Salesforce

Skip the yes-or-no question when `sfdx-project.json` answered it; confirm in
one line instead.

> Is this a Salesforce project? I recommend no, because I found no `sfdx-project.json`. A yes adds the Salesforce rules, the deploy and data-change skills, the protected-org guards, and the `delivery/` folder.

For a Salesforce project, ask for the org aliases, one question at a time.
Show the aliases on this computer first (`sf org list`, a read-only command):

> Which org alias is the sandbox the agents may deploy to for testing? I see `acme-uat` and `acme-dev`; I recommend `acme-uat`.

> Which org alias is production? Agents never deploy there or change its data; the guards block it and hand you the command instead. I see `acme-prod`.

Record them after init:

```text
toolkit config set salesforce.orgs.sandbox <alias>
toolkit config set salesforce.orgs.production <alias>
```

## After the answers

Say what will happen in three or four lines, then run it:

> I'll now: copy the project scaffold; write AGENTS.md, the rules, and the settings; turn on the Toolkit V2 plugins for this project only (and turn the older toolkit's plugins off here); set up local folders for work and built-in memory. Nothing outside this folder changes.

Then `toolkit init`, the `toolkit config set` lines the answers need, the
wiring in `repair-and-wiring.md`, and `toolkit doctor`.

## Explaining the result

End with a short plain report:

- What was set up, as a short list the owner can check: tracker, memory,
  Salesforce or not, the files added.
- What was skipped and why.
- What the owner must do himself (see the SKILL.md list), each with why.
- Doctor's result: clean, or each remaining problem with its fix.
- One next step: "Tell me the first thing you want built."
