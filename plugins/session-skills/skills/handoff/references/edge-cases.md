# Handoff edge cases

Open this file when a handoff does not follow the normal path in `SKILL.md`.

| Situation | What to do |
| --- | --- |
| The project is not set up with Toolkit V2 (no `.toolkit.json`) | Skip the work item and current focus steps, say so in one line, and put everything worth keeping in the prompt |
| This session worked on no work item | Ask the owner which item, if any, the handoff belongs to. Never pick an open item on your own: another session may own it. No answer or "none": skip the work item step, say so in one line, and write the continuation note into "Next session starts with" instead |
| The focus save fails with exit code 2 because another session changed it | Read the focus again, put this handoff's entry into the new text, and save with the new version |
| The tracker is GitHub Issues or Jira | `toolkit work` exits with code 3 and prints the instructions path. Follow those instructions to update the issue, then read the issue back |
| Nothing in the session is worth saving to memory | One line saying so. Do not invent a save |
| The owner declines every memory save | Carry the declined items in the prompt unless the owner asked not to keep them. Save nothing |
| The owner approves some saves and cuts others | `memory-save` saves only the approved ones. Carry the cut ones in the prompt |
| A work item write or the focus write fails | Report "Not saved" first, name the exact write, and carry that content in the prompt so it survives either way |
| A write succeeds but the read-back fails | Report "Saved but not verified" and name what to check |
| `toolkit work set` refuses a stage move because an approval is missing | Leave the stage as it is. Put the missing approval under open questions in the prompt |
| The old "Next session starts with" entry points at other work still in progress | Replace it anyway (one entry only) and say so in the short list. That work's Resume here still holds its continuation |
| The whole focus file would go over 50 lines | Shorten the new entry to a pointer. Do not delete other sections to make room; tell the owner the focus needs `memory-tidy` |
| The goal is written in no file, only in this chat | It goes in the prompt, labeled not confirmed. Do not stop to write it into the work item first |
| The goal points at a work item id or file that does not exist | Keep the goal, label it not confirmed, and say so in the short list |
| The prompt was built from an earlier handoff prompt | Every carried-over fact is checked from scratch. Being in a previous handoff is not a source |
| The checker fails, errors, or cannot run (including Codex with no native worker and no time to do the check) | One line saying so. Write the prompt anyway and say inside it that it was not checked |
| The prompt claims tests or a build passed | The checker never runs them. With no command output from this session behind the claim, it is labeled not confirmed |
| `/handoff` runs twice in a row | Do not save again what was already saved. Update only what changed, then draft and check again |
| The session is short and produced nothing | Say so. Write a short prompt if the owner still wants one. Do not pad it |
| The owner wants only the prompt, with no saves | The owner's call. Say once that nothing will be saved, then draft, check, and show the prompt with everything inside it |
| The owner wants the prompt with no check | The owner's call. Say once that nothing in it was verified. The fixed first line still goes at the top |
| Another session works in the same repository | Name this session's worktree and branch in the prompt |
| A save changed a Git-tracked document (for example `requirements/` or `DECISIONS.md`) | That save goes through `publish-docs`, not this skill. Report whether it reached the remote |
