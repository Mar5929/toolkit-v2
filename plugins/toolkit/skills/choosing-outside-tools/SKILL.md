---
name: choosing-outside-tools
description: 'Lists the outside tool the owner chose for each kind of job and explains how to set it up. Use when the owner asks which tool they use for a job, asks to add a tool to the list, or asks for a listed job when that tool has no installed skill. When the tool has an installed skill, use that skill to do the job.'
---

# The owner's tool list

The owner uses outside tools for some jobs. Toolkit V2 does not ship them, and a tool set up on one of the owner's computers is not on the others. This skill lists the tool the owner chose for each job, so every computer uses the same one.

## Steps

When the owner only asks which tool they use for a job, answer from the list and stop. When the owner asks to add, change, or remove a tool, go to "Changing the list". When the owner asks for a job:

1. Find the job in the list below. When no row fits, tell the owner the list has no tool for that job, then do the job the way you would without this skill.
2. Open the row's file. It says how to tell whether the tool is on this computer.
3. When the tool is on this computer, use it, and follow the owner's choices in the file.
4. When it is not, tell the owner which tool they use for this job and that it is not on this computer. Say what setting it up downloads and which folders it adds. Set it up only after the owner's yes. When the owner says no, ask how they want the job done.
5. Use another tool for a job on the list only when the owner says so.

## The list

| Job | Tool | File |
| --- | --- | --- |
| A narrated explainer video: drawings appear while a voice explains a topic or a process | explainroo | [references/explainroo.md](references/explainroo.md) |

## Changing the list

The list is kept in the Toolkit V2 repository, in the folder `plugins/toolkit/skills/choosing-outside-tools/`.

- In a chat opened in that repository, add, change, or remove the row and its file there, and follow that repository's `AGENTS.md`.
- In any other folder, never edit the copy of this skill that is installed on the computer. Tell the owner the change is made in a session opened in the Toolkit V2 repository, and give the owner the tool's name and web address to paste there.
- A row holds a tool the owner chose. Add a tool only after the owner chooses it.
