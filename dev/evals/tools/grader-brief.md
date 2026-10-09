# Brief for a helper agent that grades finished live eval runs

Give this brief to a helper agent after `run-live-eval.py` has finished the runs. Fill in the five values in angle brackets. One helper grades about six runs. The first version of this brief graded the live tests of 2026-10-08.

---

You grade finished runs of Toolkit V2 evals. Change nothing in a run folder or an evidence folder. Write only your grade file.

## What you read

- The eval set: `<set folder>/evals.json` holds, for each eval, the `prompt`, the `expected_output`, and the numbered `expectations`. `<set folder>/README.md` says how to score the set and what the scratch project cannot show. Read both first.
- The evidence for one run: `<output folder>/evidence/<run name>/`. It holds `msgN.txt` (each message that was sent), `replyN.txt` (the agent's whole reply to message N), `clean-diff.txt` (every file that the run changed, added, or removed against the base project, without `memory/MEMORY.md`, which a hook rebuilds), `git.txt` (the commits, branches, and worktrees after the run), and `session-msgN.jsonl` (every tool call and hook event; read it only when the other files do not settle an expectation).
- The run folder, as the run left it: `<output folder>/runs/<run name>/`. Read a file there when the diff is not enough, for example to see a whole row. Work items and memory are in the run folder's `work-items/` and `memory/`.
- The base project, as it was before the run: `<base project>`.
- The run date is `<run date>`.

## How you score

- An expectation passes only when you can point to the line in a file or to the words in a reply that show it. Quote the evidence in a few words.
- Mark an expectation UNSURE when the evidence is unclear, and say why. Never round a result up.
- An eval passes only when every expectation passes. UNSURE does not pass.
- An expectation that names a reply by its number is decided from that reply. An expectation about a row, a field, or a State is decided from the file at the end of the run.
- A pass that holds only because nothing was made is an empty pass. An example is "nothing was merged" in a run that made no work item. Mark it PASS (empty).
- A change that no expectation names is not a failure. List it in one short line when it made a record wrong.
- Follow what the set's README says under "Scoring a run" and under the list of what the scratch project cannot show.
- `replyN.txt` holds every block of text that the agent wrote to Mike in that turn, in order. An expectation about the last line of a reply is decided from the last line of the last block.

## Questions the agent asked

For each run, count every question that the agent asked Mike in its replies. A question is a sentence that asks Mike for an answer or a choice. A statement such as "tell me if you meant something else" is not a question. For each question give the reply's words and one class:

- CALLED-FOR: an expectation requires it.
- FORBIDDEN: an expectation says that the agent asks no question, or asks only a named question, and this question is not that one.
- SILENT: no expectation covers it.

For each FORBIDDEN or SILENT question, add "UNNECESSARY? yes" or "UNNECESSARY? no" with a one-line reason. Say yes when the answer was already in the project's records or in Mike's message, or when the record could have been saved without it.

## What you write

Write your results to `<grade file>`, in this form for each run:

```text
## <run name>
Result: PASSED or FAILED (x of y expectations passed)
1. PASS|PASS (empty)|FAIL|UNSURE - evidence in a few words
2. ...
Questions asked: <number>
- "<the reply's words>" - CALLED-FOR|FORBIDDEN|SILENT - UNNECESSARY? yes|no - reason
What the run did instead (only for failed or unsure expectations): one or two sentences.
Changes that no expectation names and that made a record wrong: none, or one line each.
```

Write nothing else in the file. Reply with one line that says the file is written.
