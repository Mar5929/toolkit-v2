# Evals for the short path of a small work item

This folder holds nine prompts that test one thing: whether an agent in a Toolkit V2 project takes a small work item through the short path the way the `managing-work-items` skill states it. Nothing here is shipped.

## What is tested

The short path is the process for a small work item. A small work item is a top-level work item whose whole job the agent can play back to the owner in one reply, and that it can build and check without an interview, without Designing, and without sub-items. The agent judges this from the owner's request. No count of tasks decides it (Mike, 2026-10-08). The skill states the short path as general rules in three places, all under `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/managing-work-items/references/`:

- `lifecycle-rules.md`, section "A small work item": what a small work item is, the goal of the short path, its six steps, and when a work item leaves the short path.
- `testing-loop.md`, section "A small work item": when the separate checker runs, and what takes its place when it does not run.
- `closing.md`, section "Closing a small work item": the one closing question, and what follows the owner's answer.

Every expectation in `evals.json` about the short path states what those three sections said on 2026-10-08. When one of the sections changes, change the expectations that it made wrong.

Each eval also tests the question that comes before a work item exists. The starter's root guide, `plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md`, section "Every session", says that the agent asks the owner in one short line whether to make a work item, when the owner asks for work and no work item covers it (Mike, 2026-10-08: "The agent should just ask me if something g needs a work item. Keep it simple"). The agent does not ask when the owner has already said, or when the whole result of the work is text in the agent's reply.

- In evals 2, 3, 8, and 9 the work makes or changes a file, so the first reply is that question, and Mike's second message says yes.
- In evals 1, 4, 5, and 6 the result is a text in the reply, so the agent would not ask and would make no work item. The prompt of each one therefore says to make a work item. In eval 7 Mike asks for the full process. In these five evals the agent does not ask.

`../work-item-question/` tests what happens when Mike says no, and the other cases in which the agent must not ask.

## Where the cases come from

The nine cases are the situations that were used on 2026-10-08 to check a rewrite of the short-path text.

**These situations are for testing only. Never copy a case, a prompt, or an expectation into the agent's instructions.** That covers the root guide, a rule, a skill, a hook, and a helper agent's brief. When an eval fails, change the general rule or the step that the agent got wrong, and never add a sentence for that one situation. Mike's reason, in his words on 2026-10-07: "We're really just trying to define what our process is and make sure the agent follows our process, rather than trying to define the behavior of an agent."

## The files

- `evals.json` is in skill-creator's format, with `expectations` as the schema names them. `skill_name` is `managing-work-items`, the skill that the set tests. `prompt` is Mike's first message. Each `expected_output` starts with "Short path", the letter of the case, and the number of messages in the run.
- `messages.json` holds the messages that follow the prompt, in order, for each eval. `../tools/run-live-eval.py` reads it.
- `../fixtures/pocket-ledger-records/` is the scratch project that every eval uses. This set changes nothing in it. The `files` lists in `evals.json` are repository-relative paths.

`../keeping-project-records/README.md` describes the scratch project, and its section "Building the base project" says how to build the project that a run starts from. Build it the same way for this set.

## Running one eval

An eval in this set needs more than one message, because the short path waits for the owner's answer two times, and in four evals the agent first asks whether to make a work item. Run it in Claude Code or Codex, in a session that can start a helper agent: the separate checker is a helper agent.

1. Copy the whole base project, with its `.git` folder, to a new folder. Make a fresh copy for every run.
2. For eval 6 or eval 9, change the run folder first, as "Changes to the run folder" below says.
3. Start a new session in the copy, with the test home, as `../keeping-project-records/README.md`, "Running one eval", says.
4. Send the eval's `prompt` as message 1, with its line breaks. Allow the file edits and the Git commands that the agent asks for.
5. After each reply, send the next message from the table below. Reply 1 is the agent's reply to message 1, reply 2 its reply to message 2, and so on. `messages.json` holds the same messages, word for word, for `../tools/run-live-eval.py`: change both together.
6. The run ends when the agent has replied to the last message of the eval. Keep the text of every reply and the folder.

When a reply asks a question that the table has no message for, stop the run there, and score what happened.

| Eval | Message 2 | Message 3 | Message 4 | Message 5 |
| --- | --- | --- | --- | --- |
| 1 | "Yes, that's right." | "Yes." | None | None |
| 2 | "Yes, make a work item for it. Don't file Bea's email, I have it in my mailbox." | "Yes, that's right." | "Yes." | None |
| 3 | "Yes, make a work item for it." | "Yes, that's right." | "Yes." | "Yes, merge it." |
| 4 | "Yes, that's right." | "No. The long checklist is missing the step where I ask the tester for their phone model and iOS version." | None | None |
| 5 | "Yes, that's right." | "Change of plan after the call with Nadia and Tomas. The text isn't enough on its own anymore. We also want it shown inside the app the first time a tester opens a new build, and we need a way to change it without shipping a new build. It could be bundled in the app or fetched from Tomas's server, and I haven't picked. The three flows are: add a purchase, edit a purchase, and the day's list." | None | None |
| 6 | "Yes, that's right." | "Yes." | None | None |
| 7 | None | None | None | None |
| 8 | "Yes, make a work item for it. Don't file Bea's email, I have it in my mailbox." | "Yes, that's right." | "Yes." | "I uploaded it. Three went through, but TestFlight could not send Dana's invite. Bea had her address wrong, it's dana.whitfield@example.com. Fix the file and I'll upload it again." |
| 9 | "Yes, make a work item for it." | "Yes, that's right." | None | None |

In evals 2, 3, 8, and 9, message 2 answers the question whether to make a work item, and message 3 answers "Is that right?". In evals 1, 4, 5, and 6, message 2 answers "Is that right?". The message after that answers the closing question, except in eval 5. In eval 5, send message 3 after reply 2, whatever reply 2 says.

In evals 2 and 8, message 2 also says that Bea's email is not filed. The email holds email addresses, and `sources/AGENTS.md` tells the agent to ask the owner before it files personal data. Mike's answer is in message 2, so that the agent has no second question to ask, whichever reply it would have asked it in.

The date of the run is "the run date" in the expectations. The next free work item ID in the scratch project is WI-034, so the expectations name the new work item WI-034.

## Changes to the run folder

Two evals cannot run on the scratch project as it is. Make each change in the run folder, never in the fixture. `run-folder-changes.json` and `eval-9-constraints-body.md` hold the same two changes for `../tools/run-live-eval.py`: change them together with the text below. Then run the record check, which must print nothing, and commit the changed file, so that the run starts with nothing uncommitted:

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
| 2 | (b) One list of records that the owner loads into production himself | 4 | Yes: the file will be loaded into production | Deploying, waiting for Mike's upload |
| 3 | (c) A small change that is merged and deployed to an environment other people use | 5 | Yes: the result changes that environment | Deploying, at the question about the deploy |
| 4 | (d) The owner answers "no" to the closing question, and the fix adds a task | 3 | No | Testing Loop, at the second closing question |
| 5 | (e) During the build, the work turns out to need a design | 3 | Not reached | One question to Mike |
| 6 | (f) A small work item in a project whose only phase is "P01 — Ongoing support" | 3 | No | WI-034 is Done |
| 7 | (g) The owner asks for the full process at the start | 1 | Not reached | Refining Requirements, at the question that agrees the goal |
| 8 | (h) After the closing yes, the owner's upload fails, and the fix changes the result | 5 | Yes, two times | Testing Loop, at the second closing question |
| 9 | (i) A small work item whose result builds what a rule in `system/` says | 3 | Yes: the result builds what CON-01 says | Testing Loop, at the closing question |

## What the scratch project cannot show

Know these six limits before you read a result:

- **Eval 2 and eval 8 stop before Done.** Mike's Apple developer account is not approved yet (PT-03), so a real upload to TestFlight cannot happen. An agent that says so has not failed.
- **Eval 3 names a deploy that the scratch project does not have.** `PROJECT.md` says that the staging sync server is built from Tomas's repository. The prompt says that Tomas's deploy copies this repository's `staging/` folder onto that server, so that the request fits the project. An agent that names this as something it is unsure of in the play-back has not failed.
- **Eval 3 ends at the question about the deploy.** The scratch project has no remote and no deploy command, and Mike has no sign-in to the staging server (PT-01). The eval tests that the agent asks before the merge and before the deploy. It does not test a deploy.
- **Eval 5 gets the larger work from Mike.** The scratch project holds no code in which an agent could find by itself that the work is larger. What Mike adds is not approved yet, and the agent may first record the change in the State it is in, so eval 5 has no expectation about the State.
- **Eval 6 tests half of the rule for "P01 — Ongoing support".** It tests that the agent puts the work item under that phase without asking which phase. It cannot show that the agent never asks whether that phase is Done. An agent asks that question about a phase only when the last open work item of the phase closes, and WI-031 and WI-033 stay open. A full test needs a project whose other work items are all Done or Cancelled. A test that the agent proposes the phase needs a project with no phases.
- **Eval 9 ends before the rule is marked Built.** The mark changes at the close, after Mike's yes and the merge. The eval tests only that the separate checker runs.
