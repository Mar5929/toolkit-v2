# Hindsight memory

Purpose: how memory works when the project uses the local Hindsight server,
and how its search results differ from built-in and Notion memory.

## Contents

- Where it lives
- The server
- Search results
- A combined answer (`--reflect`)
- Retire, delete, and rename
- The session briefing
- Backup
- Checking the bank

## Where it lives

- One Hindsight server on this computer, at `http://127.0.0.1:8888` unless
  `.toolkit.json` sets `hindsight.url`. Self-hosted only: never Hindsight
  Cloud.
- One memory bank per project, named by `hindsight.bank` in `.toolkit.json`.
  The `project-setup` skill creates it (`toolkit hindsight ensure-bank`).
- Each record is one document whose id is the key: one document per
  concept. Its text is the record exactly as a built-in `.memory/` file
  would hold it, so the formats and commands are the same as in every
  backend. A section save (`--concept ... --section ...`) writes the whole
  document again, with every line it did not change kept as it was. The
  current focus is the document `focus`; the glossary is the document
  `glossary`.
- Search finds the concept document, and the hit's text is the part of it
  that matched. Read the whole concept with `toolkit memory get <key>`
  before answering.
- There is no `.memory/` folder. The memory criteria come from the copy of
  `memory-criteria.md` that the `memory-save` and `memory-tidy` skills carry
  in their references folder.
- Only the `toolkit memory` commands write the bank. The bank allows only
  read-only tools to anything else.

## The server

```text
toolkit hindsight health
toolkit hindsight service status
```

- `health` checks that the server answers. `service status` shows whether
  the background service is installed and running.
- Start the service only after the owner says yes; it runs a local language
  model and uses the computer's memory. In Codex, run it alone with
  `sandbox_permissions` set to `require_escalated` and a one-line reason:

  ```text
  toolkit hindsight service start
  ```

- A server that does not answer: every command fails with "did not answer"
  and nothing is saved. Lead the reply with "Not saved", keep the text, tell
  the owner in one line, and try again later in the session.
- In Codex, "was blocked before it left this computer ... This is the Codex
  sandbox" means the command ran inside the sandbox, not that the server is
  down. Run the `toolkit` command alone, on its own line, so the project's
  command rule runs it outside the sandbox.

## Search results

`toolkit memory find` in Hindsight searches by meaning ("recall"), not only by
words, and always returns the closest records, even when none is about the
question. The command sorts what it found into three groups, with these
words:

| The output says | What it means | What you may do |
| --- | --- | --- |
| "N memory records are about ..." | The record shares the question's words, or recall scored it very high | Read it with `toolkit memory get <key>`, then answer from its text |
| "This record may be about it" / "These records may also be about it" | Recall scored it above the rest, but it shares few words with the question | Read it before answering. Answer only if its text says it |
| "Hindsight recall ranked these closest ... none is known to be about it" | Not known to be about the question | Never an answer. Read the first one; if its text does not say it, answer "I don't know; nothing recorded says" |

"Do not answer from these" in the output means exactly that.

## A combined answer (`--reflect`)

For a question that needs several records ("why did we move off Heroku?"),
ask the local model for a combined answer:

```text
toolkit memory find '<question>' --reflect
```

It takes about 20 to 30 seconds. The output calls the answer "a summary,
not a source". Read each record it relies on with `toolkit memory get <key>`
and cite those records, never the summary.

## Retire, delete, and rename

- Retire: the document is tagged retired, so search leaves it out.
- Delete, or reject a proposal: the document is deleted from the bank.
- Rename: a new document is saved under the new key, then the old one is
  deleted.
- In each case the record also leaves the briefing cache
  (`<git common dir>/toolkit-v2/memory-cache.json`) at once.

## The session briefing

The briefing reads memory from the cache that every `toolkit memory` write
refreshes. When there is no cache yet, it tries one live read with a
2-second limit; a server that is down gives one line in the briefing, and
the session goes on.

## Backup

- The project export (`toolkit export`) does not reach the bank. Two things
  do: the automatic backup, which `toolkit work finish` and the handoff's
  last step run when a backup folder is set (`backup.dir`; it writes a
  memory export to `<backup.dir>/<project key>-<YYYY-MM-DD>/memory-export/`;
  a second one on the same day replaces it), and a memory export by hand:

  ```text
  toolkit memory export --to <folder>
  ```

- `toolkit memory status` shows the last export.
- Hindsight memory lives on one computer. To move it: a memory export on the
  old computer, then `toolkit memory import --from <folder>` on the new one,
  after a dry run.

## Checking the bank

```text
toolkit memory status
```

It names the bank and the server, the record counts, and each problem: the
server does not answer, the bank does not exist (run
`toolkit hindsight ensure-bank` through `project-setup`), a bank setting to
fix, or a current focus without its title or `Last updated:` line.
`toolkit memory reindex` writes each record's tags and metadata again from
its text.
