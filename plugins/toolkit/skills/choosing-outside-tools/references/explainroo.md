# explainroo

explainroo makes a narrated explainer video as an MP4 file. A voice explains a topic or a process while drawings appear. The voice is made on the computer. It is free and needs no account and no key.

Repository: https://github.com/vincentsch/explainroo

## Is it on this computer

It is set up when the folder `~/Documents/Projects/explainroo` holds the file `bin/explainroo.js`.

## Using it

- When a skill named `explainroo` is in this session's skills list, use that skill. Where it and this file differ, this file wins.
- Otherwise read `AGENTS.md` in the explainroo folder and follow its steps. It says how to write the script, draw the scenes, check them, and make the video.
- Run every command from the explainroo folder: `node bin/explainroo.js <command>`.

## The owner's choices

- **No corner label.** Set `"watermark": false` in every video's `video.json`. Never set `watermark` to a text.
- **Where videos go.** Create each video in the explainroo folder, under `videos/<short-name>`, unless the owner names another place. Never create a video folder inside the project the chat was opened in.
- **Handing it over.** When the session has a tool that sends files to the owner, send him the finished `out/video.mp4`. Then tell him where the file is, how long it is, and what the `verify` command said.

## Setting it up

Set it up only after the owner's yes. Tell him first that it adds the folder `~/Documents/Projects/explainroo` and downloads about 400 MB of voice files, once, into `~/.cache/explainroo`.

It needs Node.js 20.11 or newer, ffmpeg, and Chrome or Chromium. When one is missing, tell the owner. Never install it for him without his yes.

```bash
git clone https://github.com/vincentsch/explainroo.git "$HOME/Documents/Projects/explainroo"
cd "$HOME/Documents/Projects/explainroo"
npm install
node bin/explainroo.js doctor --fetch
```

The last command checks the setup and downloads the voice files. The setup works when the command prints no line that starts with `FAIL`.

## Known problem

On a Mac, each command prints one line as it closes: "libc++abi: terminating ... mutex lock failed". The work is finished before that line appears. Judge a command by the output above that line and by the files it made.
