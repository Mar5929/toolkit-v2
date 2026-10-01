# Installing Hindsight on this Mac

Purpose: install the local Hindsight memory server on a Mac that does not
have it: Ollama and the `gpt-oss:20b` model, the server, a first start that
downloads its search models, and the background service. Open it when
`hindsight.md` in this folder finds no server.

Every step changes this computer. Before each one, say what it installs and
how large the download is, and run it only after the owner's yes.

## Contents

- 1. What is already there
- 2. Ollama and the model
- 3. The server
- 4. The first start
- 5. The background service
- Gotchas

## 1. What is already there

Each of these only reads:

```text
brew --version
ollama --version
uv --version
ls ~/.local/bin/hindsight-api
```

Skip each step below whose part is already there. No Homebrew: stop.
Installing Homebrew is the owner's step; `https://brew.sh` has its
installer.

## 2. Ollama and the model

```text
brew install ollama
brew services start ollama
ollama pull gpt-oss:20b
```

- Ollama then runs at login and listens on `127.0.0.1:11434`.
- The model is a 13 GB download and uses about 12 GB of memory while it is
  loaded. Tell the owner both numbers before he says yes.
- Check: `ollama list` shows `gpt-oss:20b`.

## 3. The server

```text
brew install uv
uv tool install hindsight-api --python 3.12
```

Skip the first line when `uv` is there. The server lands at
`~/.local/bin/hindsight-api`. Check: `~/.local/bin/hindsight-api --help`.

## 4. The first start

The background service runs with the network to Hugging Face turned off, so
it cannot download the two search models it needs (about 225 MB). Start the
server once with the network on. The owner runs this in a Terminal window,
where it keeps running:

```text
HINDSIGHT_API_HOST=127.0.0.1 HINDSIGHT_API_PORT=8888 HINDSIGHT_API_DATABASE_URL=pg0://hindsight HINDSIGHT_API_LLM_PROVIDER=ollama HINDSIGHT_API_LLM_MODEL=gpt-oss:20b HINDSIGHT_API_LLM_BASE_URL=http://127.0.0.1:11434/v1 HINDSIGHT_API_SKIP_LLM_VERIFICATION=true ~/.local/bin/hindsight-api
```

1. Wait about 30 seconds, then check `curl -s -m 2 http://127.0.0.1:8888/health`.
   No answer yet: check again before you report a problem.
2. When it answers, the owner presses Ctrl-C in that window.
3. `ls ~/.cache/huggingface/hub` lists `models--BAAI--bge-small-en-v1.5`
   and `models--cross-encoder--ms-marco-MiniLM-L-6-v2`.

`HINDSIGHT_API_HOST=127.0.0.1` keeps the server off the local network. The
`HINDSIGHT_API_LLM_PROVIDER`, `HINDSIGHT_API_LLM_MODEL`, and
`HINDSIGHT_API_LLM_BASE_URL` settings stop it from trying OpenAI.

## 5. The background service

Write `~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist` with the
text below. Replace each `<home>` with the owner's home folder, for example
`/Users/mike`: the service does not expand `~`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>local.toolkit-v2.hindsight</string>
	<key>ProgramArguments</key>
	<array>
		<string><home>/.local/bin/hindsight-api</string>
	</array>
	<key>WorkingDirectory</key>
	<string><home>/.hindsight</string>
	<key>EnvironmentVariables</key>
	<dict>
		<key>HINDSIGHT_API_HOST</key><string>127.0.0.1</string>
		<key>HINDSIGHT_API_PORT</key><string>8888</string>
		<key>HINDSIGHT_API_DATABASE_URL</key><string>pg0://hindsight</string>
		<key>HINDSIGHT_API_LLM_PROVIDER</key><string>ollama</string>
		<key>HINDSIGHT_API_LLM_MODEL</key><string>gpt-oss:20b</string>
		<key>HINDSIGHT_API_LLM_BASE_URL</key><string>http://127.0.0.1:11434/v1</string>
		<key>HINDSIGHT_API_LLM_MAX_CONCURRENT</key><string>2</string>
		<key>HINDSIGHT_API_LLM_OLLAMA_NUM_CTX</key><string>32768</string>
		<key>HINDSIGHT_API_LLM_EXTRA_BODY</key><string>{"think":"low"}</string>
		<key>HINDSIGHT_API_LLM_REASONING_EFFORT</key><string>low</string>
		<key>HINDSIGHT_API_LLM_TIMEOUT</key><string>300</string>
		<key>HINDSIGHT_API_RETAIN_MAX_COMPLETION_TOKENS</key><string>16000</string>
		<key>HINDSIGHT_API_SKIP_LLM_VERIFICATION</key><string>true</string>
		<key>HINDSIGHT_API_MCP_ENABLED_TOOLS</key><string>retain,sync_retain,recall,reflect,list_documents,get_document,list_memories,get_memory,list_tags,list_operations,get_operation,get_bank</string>
		<key>HINDSIGHT_API_LOG_LEVEL</key><string>info</string>
		<key>HF_HUB_OFFLINE</key><string>1</string>
		<key>HF_HUB_DISABLE_TELEMETRY</key><string>1</string>
		<key>LITELLM_LOCAL_MODEL_COST_MAP</key><string>True</string>
	</dict>
	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<true/>
	<key>ThrottleInterval</key>
	<integer>30</integer>
	<key>ExitTimeOut</key>
	<integer>30</integer>
	<key>SoftResourceLimits</key>
	<dict>
		<key>NumberOfFiles</key>
		<integer>8192</integer>
	</dict>
	<key>StandardOutPath</key>
	<string><home>/.hindsight/logs/hindsight-api.log</string>
	<key>StandardErrorPath</key>
	<string><home>/.hindsight/logs/hindsight-api.log</string>
</dict>
</plist>
```

Then load it, each command alone:

```text
mkdir -p ~/.hindsight/logs
plutil -lint ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist
curl -s -m 2 http://127.0.0.1:8888/health
```

Health can take about 10 seconds; check again before you report a problem.
The log is `~/.hindsight/logs/hindsight-api.log`. Then go back to
`hindsight.md` for the project's bank.

## Gotchas

- Never add `--daemon` to the server command: the service must run it in
  the foreground, or it restarts over and over.
- Never put a `.env` file in `~/.hindsight` or a folder above it: its values
  would replace the service's settings.
- A second server on port 8888 fails with "cannot bind". Stop the first
  start (Ctrl-C) before loading the service.
- The service starts without Ollama, but it cannot save or summarize until
  Ollama runs. Searching still works.
