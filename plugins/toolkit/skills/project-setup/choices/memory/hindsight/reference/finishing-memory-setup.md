# Finishing and moving Hindsight memory setup

Use this reference to run this choice's checks and preserve current work when memory moves to Hindsight. Hindsight stores lasting memory; the work tracker and project records hold current work.

## Check the Hindsight choice

Run the checks in [hindsight-setup.md](../hindsight-setup.md), including both intended hosts and the recorded bank. This choice has no local Current State or `memory/` folder; its installed startup module adds no state snapshot, while the shared hook preserves the compaction reminder.

## Move approved memory into Hindsight

Follow the shared update reference's approved migration batch, preservation, and read-back procedure. When the add-on's tools are available only in the next session, save each approved record through the server's API with the record's ID as the document ID, and search for it after processing completes. Use the installed package's supported API and configuration; keep credentials outside the project.

The preview must map still-current information from the old Current State to the work tracker and project records before removal. Retain old records and connections until the move is verified and authorized.

## Retire Hindsight after an approved move

After records have moved out of Hindsight and the move is verified and authorized, remove this project's opt-in path from the coding-agent add-on settings within the approved scope. Preserve other projects' settings and records. Keep the old connection until that verification; an instruction-file update alone does not retire the memory store.
