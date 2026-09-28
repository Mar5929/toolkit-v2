# Installing Hindsight on this Mac

Purpose: install the local Hindsight memory server on a Mac that does not
have it yet: Ollama and the `gpt-oss:20b` model, the Hindsight server, the
first start that downloads its search models, and the background service.
Open it when `toolkit machine-setup`, `toolkit doctor`, or
`toolkit hindsight service status` says Hindsight or Ollama is not installed.

Hindsight runs only on this Mac: never in Hindsight Cloud, and never in
Docker. Every install below changes this computer, so each one runs only
after the owner's yes. Say what it installs and how large the download is
before you ask.

## Contents

- Checklist
- 1. Check what is already there
- 2. Ollama and the gpt-oss:20b model
- 3. The Hindsight server
- 4. The first start: download the search models
- 5. The background service
- Codex
- Gotchas

## Checklist

```text
- [ ] Checked what is installed: brew, ollama, uv, hindsight-api
- [ ] Ollama installed and running as a Homebrew service (owner's yes)
- [ ] gpt-oss:20b downloaded (owner's yes; 13 GB)
- [ ] hindsight-api installed with uv (owner's yes)
- [ ] First start with the network on; search models downloaded; stopped
- [ ] Background service installed and started (owner's yes)
- [ ] toolkit hindsight health answers
```

## 1. Check what is already there

Run each command alone. None of them changes anything:

```text
toolkit hindsight health
toolkit hindsight service status
brew --version
ollama --version
uv --version
ls ~/.local/bin/hindsight-api
```

Skip each step below whose part is already installed. When health already
answers, Hindsight is ready: go back to `wiring-hindsight.md` in this folder.

No Homebrew (`brew: command not found`): stop. Installing Homebrew is the
owner's step. Tell him it is the Mac package manager the next steps use, and
that `https://brew.sh` has the one-line installer.

## 2. Ollama and the gpt-oss:20b model

Hindsight writes and summarizes memories with the local model `gpt-oss:20b`,
which Ollama runs. After the owner's yes, run each command alone:

```text
brew install ollama
brew services start ollama
ollama pull gpt-oss:20b
```

- `brew services start ollama` runs Ollama as a background service that
  starts at login. It listens on `127.0.0.1:11434`.
- `ollama pull gpt-oss:20b` downloads 13 GB. It uses about 12 GB of memory
  while it is loaded. Tell the owner both numbers before he says yes.
- Check: `ollama list` shows `gpt-oss:20b`.

## 3. The Hindsight server

No `uv` (`uv: command not found`): install it first, after his yes:

```text
brew install uv
```

Then install the server, after his yes:

```text
uv tool install hindsight-api --python 3.12
```

- `uv` downloads Python 3.12 by itself when the Mac does not have it.
- The server lands at `~/.local/bin/hindsight-api`. The background service
  runs that exact path.
- Check: `~/.local/bin/hindsight-api --help` prints the server's options.

## 4. The first start: download the search models

The background service runs with `HF_HUB_OFFLINE=1`, so it never reaches the
internet. That means it cannot download the two search models Hindsight needs
(`BAAI/bge-small-en-v1.5` and `cross-encoder/ms-marco-MiniLM-L-6-v2`, about
225 MB together). Without them the service does not start. So start the
server once with the network on, then stop it.

This start keeps running until it is stopped. The default is that the owner
runs it in a Terminal window. Give him this command in one block:

```text
HINDSIGHT_API_HOST=127.0.0.1 HINDSIGHT_API_PORT=8888 HINDSIGHT_API_DATABASE_URL=pg0://hindsight HINDSIGHT_API_LLM_PROVIDER=ollama HINDSIGHT_API_LLM_MODEL=gpt-oss:20b HINDSIGHT_API_LLM_BASE_URL=http://127.0.0.1:11434/v1 HINDSIGHT_API_SKIP_LLM_VERIFICATION=true ~/.local/bin/hindsight-api
```

Then:

1. Wait about 30 seconds. The first start downloads the models, creates the
   database, and sets it up.
2. Check that it answers, as its own command:

   ```text
   toolkit hindsight health
   ```

3. When it answers, the owner presses Ctrl-C in that Terminal window to stop
   the server.
4. Check that both models are saved:

   ```text
   ls ~/.cache/huggingface/hub
   ```

   It lists `models--BAAI--bge-small-en-v1.5` and
   `models--cross-encoder--ms-marco-MiniLM-L-6-v2`.

Why each setting in the command matters:

- `HINDSIGHT_API_HOST=127.0.0.1`: without it the server listens on every
  network interface, so anyone on the same Wi-Fi could reach it.
- `HINDSIGHT_API_DATABASE_URL=pg0://hindsight`: the same database the
  service uses, so this start sets up the real one.
- The three `LLM` settings: without them the server tries OpenAI.
- `HINDSIGHT_API_SKIP_LLM_VERIFICATION=true`: the server starts even when
  Ollama is still loading.

In Claude Code, the agent may run the same command itself as a background
command instead, check health, and then stop that background command. Say so
before you start it.

## 5. The background service

After the owner's yes, run each command alone:

```text
toolkit hindsight service install
toolkit hindsight health
```

`toolkit hindsight service install` writes
`~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist` and loads it, so the
server starts at login and restarts after a crash. Its log is
`~/.hindsight/logs/hindsight-api.log`. Health can take about 10 seconds after
the install; run `toolkit hindsight health` again before you report a
problem.

Then go back to `wiring-hindsight.md` in this folder for the project's
memory bank.

## Codex

Every install here needs the network and writes outside the project, which
the Codex sandbox refuses. Run each command alone, as its own command, with
`sandbox_permissions` set to `require_escalated` and a one-line reason, for
example "Install Ollama with Homebrew." Codex refused it without asking: show
the owner the exact command and ask him to run it in a terminal. The first
start in step 4 is always the owner's, in a Terminal window.

## Gotchas

- Never run `hindsight-api --daemon`. The background service must run the
  server in the foreground, or launchd restarts it over and over.
- Never put a `.env` file in `~/.hindsight` or a folder above it. The server
  reads one at startup, and its values replace the service's settings.
- A second server on port 8888 fails with "cannot bind 127.0.0.1:8888". Stop
  the first-start server (Ctrl-C) before you install the service.
- The service starts without Ollama, but it cannot save or summarize until
  Ollama runs. Search still works.
