# Finishing local memory setup

Use this reference at the finish of local memory setup. The job is done when the first Current State holds confirmed context for the next session, every open owner step is recorded in it, and the checks below pass.

## Initialize Current State

Keep the headings concise and keep what a later session needs. Write these values in `memory/CURRENT_STATE.md` from the interview:

- Last updated: the date, "setup", and "agent".
- Now: the current work from question 11, or "None."
- Coming up: each dated event or deadline the owner named, or "None."
- Waiting on: each open owner step, from the shared finishing reference's "The owner's steps" and from each choice that leaves an owner step open, such as Salesforce. Start each line with "Owner:" and end it with "Setup step; remove this line when it is done."
- Standing jobs and shared files: "None."
- Next session starts with: the next roadmap step from question 11.

## Check the local choice

- `node .claude/hooks/session-start.mjs </dev/null` prints Current State and the memory index, and the index lists no retired record.
- `git ls-files -- memory/` prints nothing, `git check-ignore memory/CURRENT_STATE.md` prints its path, and `.ignore` holds `!/memory/`.
