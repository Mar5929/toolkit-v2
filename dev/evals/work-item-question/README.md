# Evals for the question whether a job gets a work item

This folder holds five prompts that test one thing: whether an agent in a Toolkit V2 project asks the owner whether a job gets a work item when it should, and only then, and what the agent does after the owner says no. Nothing here is shipped.

## What is tested

Mike decided on 2026-10-08 that the agent does not decide by itself whether a job gets a work item. His words: "The agent should just ask me if something g needs a work item. Keep it simple". He also decided that a change with no work item still goes on a branch and reaches the default branch only after his yes.

The starter's root guide, `plugins/toolkit/skills/project-setup/assets/every-project/AGENTS.md`, section "Every session", states both as one general rule:

- When the owner asks for work and no work item covers it, the agent asks whether to make a work item, before it starts the work. It asks in one short line that names the work and says whether it recommends a work item.
- The agent does not ask when the owner has already said whether to make one, when the turn only answers a question, or when the whole result of the work is text in the agent's reply.
- After a no, the agent does the work without a work item. It makes every change to a file that Git tracks in a worktree of its own, on a branch of its own, and merges that branch into the default branch only after the owner's yes. A project document is the one exception: `publish-docs` commits it.

Every expectation in `evals.json` states what that rule said on 2026-10-09. When the rule changes, change the expectations that it made wrong.

`../small-work-item-short-path/` tests what happens after the owner says yes: four of its nine evals start with the same question.

Mike has not yet confirmed the last of the three cases in which the agent does not ask, the result that is only text in the reply. The Main Orchestrator session put it to him on 2026-10-09. When he chooses that the agent asks there too, eval 2 changes: its first reply is the question, and its second message is "No.".

**These situations are for testing only. Never copy a case, a prompt, or an expectation into the agent's instructions.** That covers the root guide, a rule, a skill, a hook, and a helper agent's brief. When an eval fails, change the general rule, and never add a sentence for that one situation.

## The files

- `evals.json` is in skill-creator's format, with `expectations` as the schema names them. `skill_name` holds the name of this set, because the set tests no single skill. Each `expected_output` starts with "Work item question", the letter of the case, and the number of messages in the run.
- `messages.json` holds the messages that follow the prompt, in order, for each eval. `../tools/run-live-eval.py` reads it.
- `../fixtures/pocket-ledger-records/` is the scratch project that every eval uses. This set changes nothing in it.

## Running one eval

Build the base project as `../keeping-project-records/README.md`, "Building the base project", says. Then run an eval as `../small-work-item-short-path/README.md`, "Running one eval", says, with the messages below. `../tools/run-live-eval.py` does the same steps without a person.

| Eval | Message 2 | Message 3 |
| --- | --- | --- |
| 1 | "No, just do it." | "Yes, merge it." |
| 2 | None | None |
| 3 | None | None |
| 4 | None | None |
| 5 | None | None |

When a reply asks a question that the table has no message for, stop the run there, and score what happened. The next free work item ID in the scratch project is WI-034.

## Scoring a run

Score a run as `../keeping-project-records/README.md`, "Scoring a run", says. Three more things apply to this set:

- Decide an expectation about a branch or a worktree from Git in the run folder: `git worktree list`, `git branch --all`, and `git log --all --oneline -- <file>` show where a file was committed.
- A record that the agent saves while it does the job, such as a line in memory about a text it gave only in a reply, is not a failure.
- A failed eval means that the general rule did not carry that case. The repair is a change to the rule.

## Which case each eval tests

| Eval | Case | Messages | Does the agent ask whether to make a work item? | Where the run ends |
| --- | --- | --- | --- | --- |
| 1 | (a) A change to a file that Git tracks, and the owner says no | 3 | Yes | The file is on main, after Mike's yes to the merge |
| 2 | (b) The whole result is a short text in the reply | 1 | No | The text is in the reply |
| 3 | (c) The owner says in the request that the job gets no work item | 1 | No | At the question about the merge |
| 4 | (d) The turn only answers a question | 1 | No | The answer |
| 5 | (e) A work item that exists covers the work | 1 | No | The requirement is recorded in WI-032 |

## What the scratch project cannot show

- **The scratch project has no remote.** So the merge in eval 1 is a local merge, and no pull request is opened.
- **Eval 5 tests only the question.** It does not test the whole step that records a changed requirement: `../small-work-item-short-path/` and the skill's own steps cover that.
