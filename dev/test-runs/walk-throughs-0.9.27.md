# The two walk-throughs of the project layout, toolkit 0.9.27

This file records the two walk-throughs that work item TKV-24 waits on: a Salesforce org merge and a SaaS feature that spans three areas, each played in a live session in a project that was set up from main. The one-home layout shipped on 2026-10-06 as version 0.9.0. Before these runs, its two scenarios had only been walked on paper, against earlier candidate layouts.

Result, against the three acceptance criteria of TKV-24, Requirement 1. Both scenarios got the same three answers.

| Criterion | Result |
| --- | --- |
| 1. Each event has one home, and no two records each read as the current answer | Partly |
| 2. Mike can find the current answer, its source, and the work that a change affects | Yes |
| 3. Without the agent, Mike can find an answer by subject from `PROJECT.md` and the folders | Partly |

The folder `walk-throughs-0.9.27/` holds, for each scenario, every message, every reply, the list of changed files, and the full assessment.

## What was tested

| Item | Value |
| --- | --- |
| Date of the runs | 2026-10-09 |
| Toolkit | 0.9.27, the main checkout at commit `b42245b0`, loaded with `--plugin-dir` |
| Claude Code | 2.1.289, model `claude-opus-5-5`, the test home's default |
| Sign-in | `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude` |
| Projects | Two new folders. In each, one session without a person said "set up this project" with the answers in `setup-message.txt`, and the `project-setup` skill built the project. Both use local work items and local memory. The org-merge project is a Salesforce project with no org connected. No record was copied in: each project starts empty. |
| Cost | Org merge: 24.00 dollars of usage. SaaS: 13.02 dollars. Both include the setup session. |

The scenarios are the two in the design note `dev/research/project-filing-lifecycle-working.md`, sections "Scenario A" and "Scenario B", which the page of TKV-24 names. That note is in the main checkout and not in Git.

## How each walk-through ran

1. One session got the scenario's events as messages from Mike, one after the other, with `--resume`: eight for the org merge, five for the SaaS feature. The messages are `msg1.txt` to `msgN.txt`.
2. A second, new session in the same folder got one question: what the current answer is, where it is written, and which files hold it (`lookup-msg.txt`, `lookup-reply.txt`).
3. A separate agent read the messages, the replies, and the project as the run left it, and judged the three criteria and the boundary tests of the design note (`assessment.md`). It did not see this record.

`dev/evals/tools/run-live-eval.py` sent the messages. No option that skips permission checks was used.

## What the walk-throughs could not show

- **No org and no build.** The staging test, the production load, and the release arrive as Mike's reports. The runs show where a report is filed. They do not show a deploy, a data load, or the Salesforce component tracker in use.
- **Local work items and local memory only.** The design note's Scenario A keeps work items and memory in Notion, and Scenario B ends with a move from local files to Notion. A Notion test needs a throwaway Notion project that Mike agrees to. The filing of project records in files is the same for every tracker.
- **All events on one day.** Every message was sent on 2026-10-09. In the org merge, the agent asked which Saturday the cutover was, because no record could tell it.
- **One run of each.** A second run could file an event differently.

## The org merge

Eight events: the kickoff, the notes of the Accounts workshop, who may decide what, the sponsor's decision on the customer ID, a work item for the Account migration, a passed test in the UAT sandbox, the cutover, and a later change of the decision.

**What worked.** The two sources each got one ID, and every claim and open question from the workshop points to the filed notes. The recording that must stay in the client's SharePoint was recorded as a place to find it, and was not copied. A claim that nobody checked was marked as such. Who may decide what is in `PROJECT.md`. The later change made a new decision, DEC-003, marked DEC-002 Superseded, and reached every record. The new session gave the current rule, both decisions, both emails, and the one work item that the change affects, and every statement matched the files.

**The problems, most important first.**

1. **The cutover has no delivery record, and the status fields contradict it.** The root guide sends a data migration to `delivery/`, and the run left `delivery/` with only its templates. None of its forms fits "the owner reports that a load ran". After the cutover the two rules still say Approved, the work item says Backlog, the phase Cutover says Not Started, and the project's Current State says "Now: None". Only `PROJECT.md` says that the org is live.
2. **The decision and the rule hold the same sentences.** DEC-003 in `DECISIONS.md` and the rules DAT-01 and DAT-02 in `system/data-model.md` both read as the current answer. A change of one clause needed a whole new decision that repeats the unchanged customer ID.
3. **A rule about who can edit a field had two possible homes.** The guide puts it in `system/security-model.md`. The agent kept it in the data model.
4. **One reading of the agent's is recorded as the sponsor's decision.** "Read-only for everyone in the second year" is in the decision and in the rule with no mark. Only the reply says that it is the agent's reading.
5. **A question about work that has no work item yet had no clear home.**
6. **The sponsor's authority is repeated** in three decision entries, with a pointer to `PROJECT.md`.
7. **The record of how the system works today holds workshop statements**, each marked as not seen in the org, while `reference/AGENTS.md` asks for observed facts only. That folder's guide asks for the owner's yes before a commit, so the file stayed uncommitted and the agent asked about it in seven replies.

**Finding things without the agent.** The customer ID rule, who decides, and the workshop notes were found from `PROJECT.md` in one or two steps. The production load was not: a person looks in `delivery/`, finds nothing, and the fact sits in one cell of a table in `PROJECT.md`, with no date.

## The SaaS feature

Five events: a large feature with three sub-items, a rule that every part follows, an approved rule for billing with an open question for support, a passed test on staging, and a release of billing to production.

**What worked.** The shared rule is in one place, and the three sub-items name it by ID. The approved billing rule and the undecided support question stayed apart in every record. The staging result was never recorded as what runs in production. The agent moved no State and marked no rule Built on a report alone. The new session found both rules, the open question, and the production release, and every statement matched the files.

**The problems, most important first.**

1. **Production is hard to find without the agent.** `PROJECT.md` says "Not known yet" for production and does not name `delivery/`. Mike called it a release; the record is under `delivery/deployments/`, in a folder with no version and no date, and `delivery/releases/` is empty.
2. **A rule cannot be found by its subject in `system/`.** The documents are split by kind. The two billing rules are in `constraints.md` and `security-model.md`, and no file is named for billing. `DECISIONS.md` is what worked.
3. **Each approved rule is written in full twice**, in `DECISIONS.md` and in `system/`. The billing requirement is also word for word in the parent work item and in the billing sub-item.
4. **The staging result has no one home.** It is in five places, and `tests/` holds nothing.
5. **A status word is used against its own definition.** The deployment record says "Deployed" and also says that the checks after the deployment were not reported. `delivery/AGENTS.md` says that Deployed means that those checks passed.
6. **The project's Current State went stale.** It last changed after the first message.
7. **The billing work item says Refining Requirements while billing is live.** That is true to the records, and it reads wrong at a glance.

## What both runs show about the agent's replies

- Replies ran from about 250 to 470 words, for messages of two to four lines. A status report of 20 words got 314 words back. Each reply ends with a Sources list, and several repeat lines about what still waits.
- The org-merge run asked four questions that it did not need, and the SaaS run asked which project phase the feature goes under in four replies.
- The agent made a work item without a question when Mike asked for one, in both runs.

These match the baseline run of the same day (`evals-baseline-0.9.25.md`), and they are the subject of the wording work, TKV-50.

## What this means for TKV-24

The layout carried both scenarios from the first event to the changed answer with no lost fact and no stale answer, and a new session could answer from the records alone. Three weaknesses showed in both runs, and each is a choice about the layout, so each is Mike's:

- **A reported cutover or release has no clear record**, and nothing tells the work item, the phase, the rule's mark, or the project's Current State to follow it.
- **A rule is stated twice**, once as the decision and once as the rule in `system/`.
- **A person who looks for a rule by its subject has to guess** which of the seven documents in `system/` holds it.

No fix is proposed in this record.
