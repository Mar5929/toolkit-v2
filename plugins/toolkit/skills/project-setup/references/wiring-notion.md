# Wiring Notion

Purpose: get Notion ready for a project whose tracker or memory is `notion`,
before and after `toolkit init`.

## Before init

1. Check the Notion command-line tool is signed in:

   ```text
   ntn whoami
   ```

   In Codex, run it alone with `sandbox_permissions` set to
   `require_escalated` and the reason "Check the Notion sign-in." Before init
   the project has no `.codex/rules/` file, so inside the sandbox `ntn whoami`
   has no network and no keychain, and it fails even when the owner is signed
   in.

   It says no sign-in or token was found: the owner runs `ntn login` himself.
   It opens a browser sign-in to his Notion account. Say so, wait for him to
   say it is done, then run `ntn whoami` again. Never run `ntn login` for him.
   Any other failure (a network, keychain, or sandbox error) is not a
   sign-out: say what failed, and run it again outside the sandbox before you
   send him to `ntn login`.

2. Check the "AI Agent Second Brain" page and its Projects database. This
   changes nothing:

   ```text
   toolkit notion ensure-root --check
   ```

   - It says no root page is known on this computer: ask the owner for the
     link or id of his "AI Agent Second Brain" page, then run
     `toolkit notion ensure-root --root-page <id or link>`.
   - It lists missing parts: say what will be added, then run it without
     `--check`. It only adds; it never deletes or trashes anything.

   ```text
   toolkit notion ensure-root
   ```

   - It prints a "Warnings:" line (for example, the "All Projects" view could
     not be changed): the ids are saved and setup goes on. Tell the owner the
     warning in one line; showing a column in his view is his step in the
     Notion app.
   - It fails (exit code 1 or 2): stop, show the owner the error line, and
     wait. Never change his Notion pages, databases, or views yourself with
     `ntn api`, a script, or the Notion connector to get past it, and never
     leave the error out of the final reply.

## What init does

`toolkit init` runs `toolkit notion ensure-project` for you. It creates or
repairs:

- this project's row in the Projects database;
- a Work Items database, when the tracker is `notion` (board and table views,
  the fourteen stages, sub-items);
- a Memory page in Lore's layout, when the memory is `notion` (the Projects,
  Topics, Memories, Entities, and Facts databases; the records are rows of
  Memories), with the Current focus and Terminology glossary pages.

It saves the Notion ids in `.toolkit.json`. When `WI` is already used as an id
prefix there, it may take another one: say the prefix it reports in one line.

## After init, or to repair

Check the project's pages, then repair what is missing:

```text
toolkit notion ensure-project --check
toolkit notion ensure-project --project-name '<name>'
```

Every write outside the "AI Agent Second Brain" page is refused.

## Gotchas

- The toolkit's `notion` commands are the only writes to the owner's Notion
  during setup. A failure is reported to him, never worked around with
  `ntn api ... -X PATCH` or another tool.
- In Codex, Notion calls need the network, which the sandbox turns off. The
  project's `.codex/rules/toolkit.rules` lets `toolkit` commands run outside
  the sandbox. Before init that file does not exist yet, so Codex asks the
  owner to approve each call.
- Never rename or remove a property in the Lore databases. Lore's own tools
  find them by these exact names, and Lore's own saving stays off.
- A project still on the older single Memory database has its records copied
  into the Memories database by `ensure-project`. The old database is renamed
  "Old memory database (safe to delete)". Deleting it is the owner's call.
