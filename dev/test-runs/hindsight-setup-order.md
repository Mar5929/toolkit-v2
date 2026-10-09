# The order of the Hindsight setup steps, tested on a bank made for the test

Date: 2026-10-08. Toolkit version: 0.9.21. Add-on: `@vectorize-io/hindsight-coding-agents` 0.8.0.

The finding came from the first live Hindsight setup, of the bank `toolkit-v2`, on 2026-10-08. The owner chose `verbose` for the detail of a save, and the bank on the server showed `concise` in every kind of save, and no mission of the add-on.

`<ref>` is `plugins/toolkit/skills/project-setup/references/hindsight-on-vps.md`.

## How the tests ran

- Mike said yes to a throwaway bank on 2026-10-08 ("you can make a throwaway test bank"). The bank was `toolkit-order-test`, named "Toolkit order test (safe to delete)". It was created and deleted several times, and the last list of banks did not hold it.
- The bank `toolkit-v2` was only read, never changed.
- The add-on's job (`~/.hindsight/coding-agents/dist/deepen.js`) ran with `HOME` set to a scratch folder, so it read a scratch settings file and wrote its log there. The API key was passed in the `HINDSIGHT_API_TOKEN` variable and was never written to a file or printed.
- The job ran against an empty scratch Git repository, with session saves, the Git history, the code survey, the summary, and the five knowledge pages all off. So the job saved no memory and used no model. One run, the last one below, saved one test text and used the model once.

## What the live setup did, from the add-on's log and file times

| Time (local) | What happened |
| --- | --- |
| 20:11:54 | The install finished. |
| 20:12:03 | A hook in a session that was already running started the add-on's job. The job applied `enable_observations`, `entities_allow_free_form`, `entity_labels`, `retain_default_strategy`, and `retain_strategies` to the bank. It applied no mission and no `retain_extraction_mode`. |
| 20:12:28 | Setup wrote the bank's own settings into `~/.hindsight/coding-agent.json`. |

## What the add-on's program does (`codingBankManifest`)

- When a bank holds any of `reflect_mission`, `retain_mission`, or `observations_mission`, the add-on writes none of its own three missions, and no `retain_extraction_mode` on the bank.
- The add-on adds each of its five kinds of save (`git`, `gitlog`, `conversation`, `document`, `survey`) that the bank lacks, with the detail that its settings hold at that moment.
- On every later run, the add-on sets the detail of `git`, `gitlog`, `conversation`, and `document` to its settings again, and leaves their missions as they are.
- When a bank holds no mission, the add-on writes `enable_observations: true` with its missions. A `defaultBankConfig` value wins over that, but only when the bank does not set the field itself.

The add-on's own page says the same (`ai-external-knowledge/hindsight/coding-agents-skill.md`, "A bank you shape yourself").

## The runs

| Run | What was done | Result on the bank |
| --- | --- | --- |
| 1 | The old order: the bank created with the toolkit's two missions, then the add-on's job with no settings for the bank. | The two toolkit missions, no `observations_mission`, no `retain_extraction_mode`, every kind of save `concise`. The same five fields applied as in the live setup. |
| 1b | The bank's settings (`verbose`) written afterwards, then the job again. | The kinds of save moved to `verbose`. The missions and the bank's `retain_extraction_mode` did not change. So a late setting reaches the kinds of save on the add-on's next run, and what was saved before that run keeps the wrong detail. |
| 2 | The new order: the bank created with a name only, the bank's settings in the add-on's settings, then the job. | All three missions of the add-on, `retain_extraction_mode` `verbose`, every kind of save `verbose`, and both observation values as chosen. A second run of the job applied nothing. |
| 2b | The new order with observations off, sent as `defaultBankConfig` under the bank's ID. | `enable_observations` `false` and `enable_auto_consolidation` `false`. |
| 2c | Observations off sent to the server with `PATCH` before the add-on's first run. | The add-on set `enable_observations` to `true`. So no setting is sent to a bank before the add-on has prepared it. |
| 3 | A filter paragraph added to the end of the mission of `conversation` with `PATCH`, then the job, then the detail changed to `concise` and the job again. | The paragraph stayed, and the detail followed the settings. |
| 3b | Observations changed with `PATCH` on a bank that the add-on had prepared, then the job. | The values stayed. |

## The commands of the reference, end to end

The commands of `<ref>` ran in this order against a new test bank: create the bank with a name only; the one write of "4. The add-on", step 4; the read of "Apply the settings", step 3; the send of step 4; the add-on's job in the background, as step 3 gives it; the read again; the send; the read and the comparison of step 5.

- The send before the add-on's job printed "the add-on has not prepared this bank yet" and sent nothing.
- The read found the bank prepared on its third try, about one second after the job started.
- After the send, the bank showed the file's observation values, `verbose` on the bank and on the four kinds of save, 3 missions, and the filter paragraph word for word.
- A later change (the owner's own filter with a quote mark in it, `concise`, observations off) and a second send left one filter paragraph. A send with `sessionFilter` `""` removed the paragraph and left the add-on's mission whole.

A last run took each command from the text of `<ref>`, filled in only the placeholders, and ran them in the same order against a new test bank. Both comparisons passed. The second comparison followed a later change (`concise`, observations off, no filter) that was sent with no run of the add-on's job in between: the send itself set the detail on the add-on's four kinds of save. The test bank was deleted, and the list of banks did not hold it afterwards.

## The save-and-search check on a prepared bank

A review of the change found that the test save of "6. Save and search" named no kind of save. On a bank that the add-on has prepared, the server then reads the text with the add-on's mission for a Git commit. The item now names the kind `document`. The save, status, and search commands ran from the text of `<ref>` against a new test bank that the add-on had prepared: the save completed after 10 seconds, and the search returned one memory that names the bank. The test bank was deleted afterwards.

## One saved record stays one record (2026-10-09)

Mike chose that agents save a record on purpose. One record of five sentences about a weekly export was saved three times to a new test bank, as a document, once under each setting for the detail of a save. With `concise` it became three memories. With `verbatim` and with `chunks` it stayed one memory, stored as written. `verbatim` uses the model to find names and dates in the record, and `chunks` uses no model. The test bank was deleted afterwards.

The commands in the sections above are from toolkit 0.9.21. Since toolkit 0.9.28 the reference gives no commands.

## Not tested

- A real project folder, the installer, and a save of a real session through the filter. No run saved a session, so no run shows how well the model follows the filter paragraph.
- Codex. The job ran only with `--harness claude-code`.
- Windows.
