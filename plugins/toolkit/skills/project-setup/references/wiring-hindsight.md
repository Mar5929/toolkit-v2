# Wiring Hindsight

Purpose: get the local Hindsight memory server ready for a project whose
memory is `hindsight`, before and after `toolkit init`.

Hindsight runs only on this Mac: never in Hindsight Cloud, and never in
Docker. The server is `http://127.0.0.1:8888` unless `.toolkit.json`
`hindsight.url` says otherwise.

## Before init

Init stops, with nothing written, when the server does not answer.

1. Check the server:

   ```text
   toolkit hindsight health
   ```

2. It does not answer: check the background service.

   ```text
   toolkit hindsight service status
   ```

   - The server itself is not installed (`~/.local/bin/hindsight-api` is
     missing), or Ollama is not: follow `installing-hindsight.md` in this
     folder. It installs Ollama, the model, the server, and the service.
   - The server is installed but the service is not: ask the owner, then
     install the service.
   - Installed but stopped: ask the owner, then start it.

   ```text
   toolkit hindsight service install
   toolkit hindsight service start
   ```

   Both ask the owner first in both hosts, because they change this computer.
   In Codex, run each alone with `sandbox_permissions` set to
   `require_escalated` and a one-line reason: the approval alone keeps it
   inside the sandbox, which cannot write `~/Library/LaunchAgents`.

3. The server uses the local model `gpt-oss:20b` through Ollama. When doctor
   says Ollama is not running, tell the owner. It runs as a Homebrew service
   (`brew services start ollama`), which he may prefer to start himself. When
   Ollama is not installed: `installing-hindsight.md` in this folder.

## What init does

`toolkit init` runs `toolkit hindsight ensure-bank` for you. It creates this
project's memory bank (one bank per project, named from the project key) and
writes the bank id into `.toolkit.json`. A bank with that id that belongs to
another project is never reused: the new bank gets `-2`, `-3`, and so on.

## After init, or to repair

```text
toolkit hindsight ensure-bank
```

Running it again changes only what is missing.

## Gotchas

- In Codex, a request to the local server from inside the sandbox is blocked.
  Init then says the Codex sandbox blocked its request; the server may be
  fine. Show the owner the exact command init printed, and ask him to approve
  it or run it in a terminal (`running-init.md` in this folder).
- `toolkit export` does not reach Hindsight memory. Its backup is
  `toolkit memory export --to <folder>` (`backup-and-restore.md` in this
  folder).
