# Evals for the short path of a small work item

This folder holds nine prompts that test one thing: whether an agent in a Toolkit V2 project takes a small work item through the short path the way the `managing-work-items` skill states it. Nothing here is shipped.

## What is tested

The short path is the process for a small work item. A small work item is a top-level work item with at most one phase, one or two tasks, and no sub-items. The skill states the short path as general rules in three places, all under `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/managing-work-items/references/`:

- `lifecycle-rules.md`, section "A small work item": what a small work item is, the goal of the short path, its six steps, and when a work item leaves the short path.
- `testing-loop.md`, section "A small work item": when the separate checker runs, and what takes its place when it does not run.
- `closing.md`, section "Closing a small work item": the one closing question, and what follows the owner's answer.

Every expectation in `evals.json` states what those three sections said on 2026-10-08. When one of the sections changes, change the expectations that it made wrong.

## Where the cases come from

The nine cases are the situations that were used on 2026-10-08 to check a rewrite of the short-path text.

**These situations are for testing only. Never copy a case, a prompt, or an expectation into the agent's instructions.** That covers the root guide, a rule, a skill, a hook, and a helper agent's brief. When an eval fails, change the general rule or the step that the agent got wrong, and never add a sentence for that one situation. Mike's reason, in his words on 2026-10-07: "We're really just trying to define what our process is and make sure the agent follows our process, rather than trying to define the behavior of an agent."

## The files

- `evals.json` is in skill-creator's format, with `expectations` as the schema names them. `skill_name` is `managing-work-items`, the skill that the set tests. `prompt` is Mike's first message. Each `expected_output` starts with "Short path", the letter of the case, and the number of messages in the run.
- `../fixtures/pocket-ledger-records/` is the scratch project that every eval uses. This set changes nothing in it. The `files` lists in `evals.json` are repository-relative paths.

`../keeping-project-records/README.md` describes the scratch project, and its section "Building the base project" says how to build the project that a run starts from. Build it the same way for this set.

## Running one eval

An eval in this set needs more than one message, because the short path waits for the owner's answer two times. Run it in Claude Code or Codex, in a session that can start a helper agent: the separate checker is a helper agent.

1. Copy the whole base project, with its `.git` folder, to a new folder. Make a fresh copy for every run.
2. For eval 6 or eval 9, change the run folder first, as "Changes to the run folder" below says.
3. Start a new session in the copy, with the test home, as `../keeping-project-records/README.md`, "Running one eval", says.
4. Send the eval's `prompt` as message 1, with its line breaks. Allow the file edits and the Git commands that the agent asks for.
5. After each reply, send the next message from the table below. Reply 1 is the agent's reply to message 1, reply 2 its reply to message 2, and so on.
6. The run ends when the agent has replied to the last message of the eval. Keep the text of every reply and the folder.

When a reply asks a question that the table has no message for, stop the run there, and score what happened.

| Eval | Message 2 | Message 3 | Message 4 |
| --- | --- | --- | --- |
| 1 | "Yes." | "Yes." | None |
| 2 | "Yes." | "Yes." | None |
| 3 | "Yes." | "Yes." | "Yes, merge it." |
| 4 | "Yes." | "No. The long checklist is missing the step where I ask the tester for their phone model and iOS version." | None |
| 5 | "Yes." | "Change of plan after the call with Nadia and Tomas. The text isn't enough on its own anymore. We also want it shown inside the app the first time a tester opens a new build, and we need a way to change it without shipping a new build. It could be bundled in the app or fetched from Tomas's server, and I haven't picked. The three flows are: add a purchase, edit a purchase, and the day's list." | None |
| 6 | "Yes." | "Yes." | None |
| 7 | None | None | None |
| 8 | "Yes." | "Yes." | "I uploaded it. Three went through, but TestFlight could not send Dana's invite. Bea had her address wrong, it's dana.whitfield@example.com. Fix the file and I'll upload it again." |
| 9 | "Yes." | None | None |

In every eval except eval 5, message 2 answers "Is that right?", and message 3 answers the closing question. In eval 5, send message 3 after reply 2, whatever reply 2 says.

The date of the run is "the run date" in the expectations. The next free work item ID in the scratch project is WI-034, so the expectations name the new work item WI-034.

## Changes to the run folder

Two evals cannot run on the scratch project as it is. Make each change in the run folder, never in the fixture. Then run the record check, which must print nothing, and commit the changed file, so that the run starts with nothing uncommitted:

```bash
echo '{}' | node .claude/hooks/validate-records.mjs --all
```

**Eval 6.** The scratch project's only phase is "P01 — First beta". In `PROJECT-ROADMAP.md`, replace `P01 — First beta` with `P01 — Ongoing support` in both places: the row of the table under "Phases", and the heading below the table.

**Eval 9.** No system document in the scratch project holds a rule. In `system/constraints.md`, keep the heading and the guide comment, and replace everything below the comment with this text:

```markdown
- Status: Approved
- Last changed via: DEC-001
- Governs: the versions of iOS that the app runs on

## Overview

The app supports one oldest version of iOS, so that every screen uses the same tools.

## Content

### CON-01: Oldest iOS version

- Mark: Approved (DEC-001)
- Rule: The app runs on iOS 17 and newer, and on no older version.
- Conditions and exceptions: None
- Source: DEC-001

## Open questions

None.

## Changelog

| Date | Change | DEC | Work item |
| --- | --- | --- | --- |
| 2026-09-28 | Added CON-01. | DEC-001 | WI-033 |
```

Both changes passed the record check on 2026-10-08, in a folder made from the starter and the fixture.

## Scoring a run

Score a run as `../keeping-project-records/README.md`, "Scoring a run", says: list what the run changed, decide each expectation from that list and from the replies, and pass the eval only when every expectation passes.

- An expectation that names a reply by its number is decided from that reply.
- An expectation about a row, a field, or a State is decided from the work item's file at the end of the run. Recent History shows the order in which things happened.
- A failed eval means that a general rule of the short path did not carry that case. The repair is a change to the rule or the step.

## Which case each eval tests

| Eval | Case | Messages | Does the separate checker run? | Where the run ends |
| --- | --- | --- | --- | --- |
| 1 | (a) One line added to an email text, with nothing to merge or deploy | 3 | No | WI-034 is Done |
| 2 | (b) One list of records that the owner loads into production himself | 3 | Yes: the file will be loaded into production | Deploying, waiting for Mike's upload |
| 3 | (c) A small change that is merged and deployed to an environment other people use | 4 | Yes: the result changes that environment | Deploying, at the question about the deploy |
| 4 | (d) The owner answers "no" to the closing question, and the fix adds a third task | 3 | No on the short path. Yes after the work item moves to the full path | Testing Loop, at "Do you approve this result?" |
| 5 | (e) During the build, the work turns out to need three tasks and a design | 3 | Not reached | One question to Mike about what he added |
| 6 | (f) A one-task work item in a project whose only phase is "P01 — Ongoing support" | 3 | No | WI-034 is Done |
| 7 | (g) The owner asks for the full process at the start | 1 | Not reached | Refining Requirements, at the question that agrees the goal |
| 8 | (h) After the closing yes, the owner's upload fails, and the fix changes the result | 4 | Yes, two times | Testing Loop, at the second closing question |
| 9 | (i) A small work item whose result builds what a rule in `system/` says | 2 | Yes: the result builds what CON-01 says | Testing Loop, at the closing question |

## What the scratch project cannot show

Know these eight limits before you read a result:

- **Eval 2 and eval 8 stop before Done.** Mike's Apple developer account is not approved yet (PT-03), so a real upload to TestFlight cannot happen. An agent that says so has not failed.
- **Eval 3 ends at the question about the deploy.** The scratch project has no remote and no deploy command, and Mike has no sign-in to the staging server (PT-01). The eval tests that the agent asks before the merge and before the deploy. It does not test a deploy.
- **Eval 4 follows the text as it is written.** The definition allows one or two tasks, and a task that fixes the result is a task that builds the result. So the fix task is a third task, and the work item leaves the short path. Mike has not confirmed this reading. When he decides otherwise, change the expectations of eval 4.
- **Eval 4 tests its case only when the agent gave WI-034 two tasks.** With one task, the work item stays small after the fix, and the agent is right to ask the closing question again. Such a run does not test this case: run it again.
- **Eval 8 expects the work item to stay small after the fix.** When the fix makes a third task, the full path applies, and expectations 9 and 10 do not.
- **Eval 5 gets the larger work from Mike.** The scratch project holds no code in which an agent could find by itself that the work is larger. The skill also does not say how a work item goes from Building to Designing, so eval 5 has no expectation about the State.
- **Eval 6 tests half of the rule for "P01 — Ongoing support".** It tests that the agent puts the work item under that phase without asking which phase. It cannot show that the agent never asks whether that phase is Done. An agent asks that question about a phase only when the last open work item of the phase closes, and WI-031 and WI-033 stay open. A full test needs a project whose other work items are all Done or Cancelled. A test that the agent proposes the phase needs a project with no phases.
- **Eval 9 ends before the rule is marked Built.** The mark changes at the close, after Mike's yes and the merge. The eval tests only that the separate checker runs.
