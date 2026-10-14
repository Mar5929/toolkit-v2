# Recording events, recurring jobs, and shared files

Use this reference when an event, recurring job, or shared file qualifies for memory. Apply `memory-criteria.md` first, then use the search, save, and verification steps in `saving.md` and the installed `memory-store.md`. Keep outputs and authoritative records in their assigned places.

## An event

An event is one of two things:

- work done for the owner that no work item, project task, commit, or filed record shows;
- anything else that happened and that a later session must know, such as a meeting, a call, or an outage.

Make one event record for it. The event record holds the following:

- the date, and who took part;
- what was done or what happened;
- the result;
- where the output is: an SRC ID, a file path, a work item or project task ID, or "said in chat only".

Name the event record for what happened and its date.

One kind of result gets no event record. When the root `AGENTS.md`, section "Where information goes", names a place for the result, write the result in that place. An analysis of how the system works today is an example.

## A recurring job and its runs

A recurring job is a job that the team runs again and again, such as a weekly data load, a monthly release, or the update of a shared sheet after each meeting. A recurring job has one event record. That event record holds the following:

- a first section that says what the job is, when it runs, who runs it, and the exact steps or the file that holds the steps;
- a section "Runs" with one row per run. `references/memory-store.md` gives the form of the table.

Add a row for each run. Use the owner’s report as the source for a reported run.

- A failed run gets a row too, with the error and the fix.
- When the owner reports a run without its detail, write the row with the date and the owner's words, and write "not known yet" in each cell that the owner did not give. Complete the row when the detail is known.
- When the job has no event record yet, make one with what is known. Add the job's line under "Standing jobs and shared files" in the project's Current State, as `references/current-state.md` says.
- When another record, such as a work item, already shows an earlier run, the row for that run holds only the date and that record's ID.

Before you run the job again, and before you answer how the last run went, read the Runs table.

## A shared file

A shared file is a file kept outside the project's records that people keep up to date, such as an open-items spreadsheet that the client shares. A shared file has one memory record of the type reference. That memory record says where the file is, who shares it, what it is for, and how and when it is updated.

- The shared file gets a line under "Standing jobs and shared files" in the project's Current State.
- The updates of the shared file are a recurring job, as the section above describes. The job's event record names the shared file's memory record under "Related memories".
