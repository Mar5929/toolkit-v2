# Finishing local memory setup

Use this reference at the finish of local memory setup. The first Current State holds confirmed context for the next session, and the startup hook and exclusions work.

## Initialize Current State

Keep the headings concise and retain what a later session needs. Write these values in `memory/CURRENT_STATE.md` from the interview:

- Last updated: the date, "setup", and "agent".
- Now: the current work from question 11, or "None."
- Coming up: each dated event or deadline the owner named, or "None."
- Waiting on: each open step from the shared finishing reference's "The owner's steps" section. Start each line with "Owner:" and end it with "Setup step; remove this line when it is done."
- Standing jobs and shared files: "None."
- Next session starts with: the next roadmap step from question 11.

## Check the local choice

Run `node .claude/hooks/session-start.mjs </dev/null` and confirm that it prints Current State and the memory index. Verify the index excludes retired records. `git ls-files -- memory/` must print nothing, `git check-ignore memory/CURRENT_STATE.md` must print its path, and `.ignore` must hold `!/memory/`.
