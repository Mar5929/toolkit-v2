**Verdict:** Criterion 1 (one home, no rival answers): partly. Criterion 2 (answer, source, affected work): yes. Criterion 3 (Mike finds it alone): partly.

Paths are inside the run folder `saas-01-a1/`.

| Event | Where recorded | Right home? |
| --- | --- | --- |
| Organization accounts, three sub-items | WI-001 to WI-004; `memory/CURRENT_STATE.md` "Now" | Yes |
| Goal confirmed | WI-001 Goal and Q-01 | Yes |
| Organization is the billing entity | DEC-001; CON-01 (`system/constraints.md`); items point by ID | Yes |
| Admin can change the plan (approved) | DEC-002; SEC-01 (`system/security-model.md`); WI-003 Q-01 | Yes, see problems 2 and 3 |
| Ticket ownership not decided | DEC-003 Open; WI-004 Q-01 and task T01 | Yes |
| Support lead | `PROJECT.md` people table, no name | Yes |
| Staging 14 of 14, build 0.8.2 | WI-003 history, Notes, Current state; WI-001 history; deployment record | Unclear: `tests/` holds nothing |
| Billing in production, 0.9.0 | `delivery/deployments/WI-003-billing-production/`; one history line in each item | Yes |
| Terms: organization, admin, member | Overviews of two system documents | No: `system/glossary.md` untouched |

**Problems, most important first**

1. **Production is hard to find alone.** `PROJECT.md:19` says "Not known yet" for Production, and its record list (lines 30-36) never names `delivery/`. Mike called it a release, but `delivery/releases/` is empty; the record is under `deployments/`, in a folder with no version or date.
2. **Billing rules cannot be found by subject in `system/`.** The documents are split by kind, not by area. The two billing rules are in two files (`constraints.md`, `security-model.md`), and none is named billing. Mike said "write that into billing". `DECISIONS.md` is what worked: DEC-002's title is the rule.
3. **Each approved rule is written in full twice.** `DECISIONS.md:41` and `constraints.md:18`; `DECISIONS.md:52` and `security-model.md:18`. They agree today. The billing requirement lines are also identical in `WI-001.md:104-109` and `WI-003.md:75-80`.
4. **The staging result has no single home.** It is in five places, none in `tests/`.
5. **Status word.** The deployment record says "Deployed" (line 7) and that the checks after it were not reported. `delivery/AGENTS.md:36,55` says Deployed means those checks passed.
6. **The project's Current State is stale.** It last changed after message 1. "Waiting on" is full with four setup lines, so DEC-003 and production are missing.
7. **WI-003 says `state: Refining Requirements` while billing is live.** Honest, but wrong at a glance. Its "Where it stands" is eight sentences (`WI-003.md:29`).
8. All three decisions say "Sources: none"; the source is Mike's quoted words in Why.

**Boundary tests**

- Shared direction: pass. The sub-items name DEC-001 and CON-01 by ID only (line 39 of each). Mike's plan-rule quote is copied into `WI-001.md:99` and `WI-003.md:70`.
- Approved versus open: pass. SEC-01 "Approved (DEC-002)"; `DECISIONS.md:60` "Status: Open"; no support rule exists.
- Four statuses: pass, apart from problem 5. Staging sits under "Checks before it" (record line 11). CON-01 and SEC-01 stay Approved, not Built.
- Nothing invented: pass. "Not reported" is marked throughout. Two small inferences: Mike "is responsible" for the deployment (line 9), and the support lead's role (`PROJECT.md:26`).

**Fresh session:** every statement matched the records. It found both rules, the open question, production, and that all came from Mike's reports. It changed no file. It ran 470 words, with a Files list and a Sources list that repeat each other.

**Criterion 3, tried by hand:** (a) `PROJECT.md` to `DECISIONS.md` to DEC-002: two steps. (b) The support lead row names DEC-003: one step, the best case. (c) Lost at `PROJECT.md`; found only by browsing `delivery/`.

**Process**

- "Which project phase?" (Q-05) was asked in full twice and raised twice more, for a project with one piece of work.
- Replies ran 245 to 403 words. A 20-word status report got 314 words. Each ends with a Sources block that repeats "What I saved".
- Three commits to `main` without asking, as the toolkit's rule allows.
- Added unasked, all disclosed: placeholder phase P1, task T01 for Mike, one acceptance criterion.

**Worked well**

- It refused to move a State or mark a rule Built on a report alone.
- It caught two real gaps: how build 0.8.2 relates to 0.9.0, and how production tells an admin from a member when authentication is not released.
- The open question stayed open everywhere.
