# Outside tools

This file lists the outside tool that Mike uses for each kind of job, and says how to set each tool up. An outside tool is a tool that Toolkit V2 does not ship. A tool that is set up on one of Mike's computers is not on his other computers, so this list keeps the choice the same on every computer.

This file is a plain document in the Toolkit V2 repository. It is not a skill, no plugin ships it, and setup never copies it into a project. An agent reads it in a session opened in this repository.

## The list

| Job | Tool | Section of this file |
| --- | --- | --- |
| A narrated explainer video: drawings appear while a voice explains a topic or a process | explainroo | "explainroo" |

## Using the list

When Mike asks which tool he uses for a job, answer from the list. When he asks for a job and no row fits it, tell him that the list has no tool for that job, and then do the job the way you would without this list. When he asks for a job that is on the list, do these steps:

1. Open the section for the tool. The section says how to tell whether the tool is on this computer.
2. When the tool is on this computer, use the tool, and follow Mike's choices in the section.
3. When the tool is not on this computer, tell Mike which tool he uses for the job and that the tool is not on this computer. Say what setting the tool up downloads and which folders it adds. Set the tool up only after his yes. When he says no, ask him how he wants the job done.
4. Never use another tool for a job on the list unless Mike says so.

## Changing the list

- A row holds a tool that Mike chose. Never add a tool he has not chosen.
- A new tool is one row in the list and one section below it. The section says where the tool comes from, how to tell whether it is on this computer, how to use it, Mike's choices, and how to set it up.
- Change this file in a session opened in the Toolkit V2 repository, and follow `AGENTS.md` there.

## explainroo

explainroo makes a narrated explainer video as an MP4 file. A voice explains a topic or a process while drawings appear. The voice is made on the computer. It is free and needs no account and no key.

Repository: https://github.com/vincentsch/explainroo

### Is it on this computer

It is set up when the folder `~/Documents/Projects/explainroo` holds the file `bin/explainroo.js`.

### Using it

- When a skill named `explainroo` is in this session's skills list, use that skill. Where that skill and this section differ, this section wins.
- Otherwise read `AGENTS.md` in the explainroo folder and follow its steps. It says how to write the script, draw the scenes, check them, and make the video.
- Run every command from the explainroo folder: `node bin/explainroo.js <command>`.

### Mike's choices

- **No corner label.** Set `"watermark": false` in every video's `video.json`. Never set `watermark` to a text.
- **No drawing sounds.** Set `"sfx": "minimal"` in every video's `video.json`. It removes the sounds drawings make by themselves when they appear (pencil, pop, whoosh, tick, typing). Scene-change sounds, the voice, and the music stay. Sounds added with `s.sfx` or an element's `sfx` option also stay, so add none unless Mike asks.
- **Where videos go.** Create each video in the explainroo folder, under `videos/<short-name>`, unless Mike names another place. Never create a video folder inside the project the session was opened in.
- **Handing it over.** When the session has a tool that sends files to Mike, send him the finished `out/video.mp4`. Then tell him where the file is, how long it is, and what the `verify` command said.

### Setting it up

Set it up only after Mike's yes. Tell him first that it adds the folder `~/Documents/Projects/explainroo` and downloads about 400 MB of voice files, once, into `~/.cache/explainroo`.

It needs Node.js 20.11 or newer, ffmpeg, and Chrome or Chromium. When one is missing, tell Mike. Never install it for him without his yes.

```bash
git clone https://github.com/vincentsch/explainroo.git "$HOME/Documents/Projects/explainroo"
cd "$HOME/Documents/Projects/explainroo"
npm install
node bin/explainroo.js doctor --fetch
```

The last command checks the setup and downloads the voice files. The setup works when the command prints no line that starts with `FAIL`.

### Known problem

On a Mac, each command prints one line as it closes: "libc++abi: terminating ... mutex lock failed". The work is finished before that line appears. Judge a command by the output above that line and by the files it made.
