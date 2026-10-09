# The reminder hook in a live Codex session, toolkit 0.9.25

This file records one live Codex session in a project that was set up from toolkit 0.9.25. Result: both hooks ran. The session got the project's Current State at its start, and it got the two reminder lines and the whole text of the rule `evaluate-the-owners-request.md` with the owner's message. Until this run the reminder hook had only been tested with `dev/tests/hooks.test.mjs`, and never seen in a live Codex session.

## What was tested

| Item | Value |
| --- | --- |
| Date of the run | 2026-10-09 |
| Toolkit | 0.9.25, main at commit `f8ba3537` |
| Codex | `codex-cli` 0.160.0, started with `codex exec`, which runs one session without a person |
| Model | `gpt-6.1-sol`, the test home's default (the session record's `turn_context` line) |
| Sign-in | `CODEX_HOME=~/.toolkit-v2-test-homes/codex` |
| Project | A copy of the base project of the baseline run: a real setup by `project-setup` in Claude Code (Pocket Ledger, local work items, local memory, not Salesforce), with the fixture `dev/evals/fixtures/pocket-ledger-records/` copied over it. Its `.codex/hooks.json` is the file that setup wrote, unchanged. |
| Message | The prompt of eval 36 of `dev/evals/keeping-project-records/`: "Thanks, that helps. Quick question while I've got you. How does sync decide which edit wins if I change the same transaction on two phones?" |
| Sandbox | `read-only` |

## The command

```bash
cd <the copy of the base project>
CODEX_HOME=~/.toolkit-v2-test-homes/codex codex exec --json --dangerously-bypass-hook-trust -s read-only "<the message>" < /dev/null
```

Two things were needed before a project hook ran in a session without a person:

- **The project's folder is trusted in the Codex home.** Codex loads a project's `.codex/` folder only when the project is trusted. For the run, these two lines were added to `~/.toolkit-v2-test-homes/codex/config.toml`, and the file was put back as it was after the run:

  ```toml
  [projects."<the copy of the base project>"]
  trust_level = "trusted"
  ```

  Giving the same setting on the command line with `-c` did not work: no hook ran.
- **`--dangerously-bypass-hook-trust`.** Codex runs a hook only after a person has reviewed and trusted it in `/hooks`, and a session without a person cannot do that. This option runs the hooks without that review, for one command. It was used only on the toolkit's own hooks, in a scratch project. In his own Codex, Mike reviews and trusts the hooks once in `/hooks`, as before.

`< /dev/null` is needed because `codex exec` otherwise waits for more input.

## What the session received

The session record is the file that Codex writes for every session, under `sessions/` in the Codex home. Its messages, in order:

| Message | From | Length | What it holds |
| --- | --- | --- | --- |
| 1 to 3 | Codex | | The list of skills, and two messages about helper agents |
| 4 | Codex | 25,309 characters | The project's root `AGENTS.md` and the `PROJECT.md` that it imports |
| 5 | The `SessionStart` hook, `session-start.mjs` | 1,471 characters | "The project's Current State:" and the whole of `memory/CURRENT_STATE.md` |
| 6 | The owner | 139 characters | The message |
| 7 | The `UserPromptSubmit` hook, `prompt-reminder.mjs` | 2,715 characters | The text below |

Message 7 starts with these two lines and then holds the whole rule, from its heading "# Evaluate the Owner's Request Before You Act" to its last bullet:

```text
Before you answer, check this project's skills and use every one that fits this message.
The owner's rule for every request, from .claude/rules/evaluate-the-owners-request.md. Where owner-preferences.md says otherwise, that file wins:
```

The message of the run holds no keep or decision phrase, so the hook added no hint about where a fact is filed. That part of the hook was not seen in this run.

The agent then opened `managing-work-items` and answered from WI-032: the most recent edit wins, and the user is not asked. It saved nothing, which is what eval 36 expects.

## A check that the hooks ran at all

Before the run above, a second copy of the project got one more command on each of the two hooks, which wrote the date to a file outside the project. With the project trusted in `config.toml`, both files were written. With the trust given only on the command line, neither was written. That second copy was used for nothing else.

## Not tested

- The hint for a keep or decision phrase, in a live Codex session.
- `codex-after-commit.mjs` and `validate-records.mjs` in a live Codex session: the run was read-only, so the agent made no commit and no edit.
- The hooks after a person trusts them in `/hooks`, which is how Mike's own Codex runs them.
