# Pocket Ledger

## Purpose and intended outcome

- Purpose: An iPhone app for logging money transactions fast, so that a cash purchase is not forgotten.
- Intended outcome: A user logs a transaction in a few taps and sees where the month's money went.

## Scope and boundaries

- In scope: logging a transaction, the day's list, offline use with sync to the server, and one chart of spending by category.
- Outside scope: an Android app, shared budgets, and a connection to a bank.
- Constraints: the approved rules that cover several areas of the system are in [system/constraints.md](system/constraints.md).

## Systems and environments

| System or org | Purpose | Environment | Source of truth | Access notes |
| --- | --- | --- | --- | --- |
| Pocket Ledger iPhone app | Where a user logs and views transactions | Built with Xcode on Mike's Mac | `app/` in this repository, made when the first work item reaches Building | Mike builds every version himself |
| Sync server (production) | Stores each user's transactions and computes the monthly totals | Hosted on Render | Tomas's repository `pocket-ledger-server` | Tomas deploys; Mike can read the logs |
| Sync server (staging) | A copy of the sync server for testing sync | Hosted on Render | Tomas's repository `pocket-ledger-server` | Mike has no sign-in yet (PT-01) |
| TestFlight | Sends beta builds to the testers | Apple, production | App Store Connect | Mike's Apple developer account, once Apple approves it (PT-03) |
| Sentry | Collects crash reports from beta builds | Sentry cloud | The Sentry project `pocket-ledger-ios` | Mike's Sentry account |

## People and ownership

| Role | Person or team | Responsibility | May decide | Source / last confirmed |
| --- | --- | --- | --- | --- |
| Owner | Mike Rihm | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, 2026-09-28 |
| Backend developer (contractor) | Tomas Lindqvist | Builds the sync server and looks after its hosting | How the server is built and hosted | Mike, in chat, 2026-09-28 |
| Designer | Nadia Okafor | Designs the screens of the app | The layout and the colors of a screen | Mike, in chat, 2026-09-28 |
| Beta coordinator | Bea Hollis | Runs the beta tester group and collects the testers' feedback | Who is in the beta tester group | SRC-001, 2026-09-29 |

Keep this table short. Write no biography and no contact details.

## Work and project records

- Work items, the project's phases, and the project's tasks: in the place that the "Tracker" line under "Toolkit settings" below names.
- Decisions and open questions that more than one work item needs: [DECISIONS.md](DECISIONS.md).
- The approved description of the system: [system/](system/).
- Sources, which are the documents and messages the project received: [sources/](sources/).
- Project memory: in the place that the "Memory" line under "Toolkit settings" below names.

## Resources and project paths

- Source code: `app/`, which does not exist yet. It is made when the first work item reaches Building.
- Tests: `tests/`. The commands that build, test, and deploy are in `AGENTS.md`, "Commands".

## Operating conventions

- Bea sends Mike a round-up of the testers' feedback every Monday. (Mike, in chat, 2026-09-28)
- Mike builds and uploads every beta build himself. Nobody else holds the signing keys. (Mike, in chat, 2026-09-28)

## Toolkit settings

<!-- Fill-in guide: the `project-setup` skill fills this section at setup and changes a value only when the owner changes a setup choice. The work and memory skills read these values, so keep every line and each label exactly as written. A line for a choice this project did not make holds `not used`. -->

- Tracker: `local`
- Memory: `local`
- Work item ID prefix: `WI`
- Notion work items: `not used`
- GitHub repository: `not used`
- Notion memory: `not used`
- Hindsight bank: `not used`
- Hindsight server: `not used`
- Hindsight dashboard: `not used`
- Salesforce org aliases: `not used`
