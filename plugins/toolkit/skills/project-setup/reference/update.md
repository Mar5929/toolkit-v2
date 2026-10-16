# Updating the toolkit in a project

Use this procedure when the owner says "update the toolkit" in a project that already uses Toolkit V2. Scan the project against the current toolkit, explain the differences and updates, and ask what the owner wants to adopt. Apply those choices and verify the result. A project may keep its own layout, settings, skills, and rules.

When the owner asks to change a setup choice, follow "Changing a setup choice" below for the records and services affected by the move.

## Read the project’s setup

Read `PROJECT.md`, "Toolkit settings", and the installed project guides to find the project’s recorded choices and current record homes. Keep those choices unless the owner asks to change them.

Use this skill’s `every-project/` folder and the setup modules for those choices as the current toolkit source. When the installed plugin lacks an update the owner expects, explain that and ask before updating the plugin on the owner’s computer. Follow the host’s plugin instructions and start a new session after the plugin update.

Before changing project files, make your worktree and branch as the project’s `.claude/rules/shared-repository-work.md` says. Inspect ignored records in the main checkout, because a worktree does not contain them. Keep approved changes to those records until after the branch is merged, so they do not refer to changes absent from the default branch.

## Scan for toolkit differences and updates

Compare the installed toolkit files with the current source for this project’s choices. Read the differences to identify updates, project customizations, missing toolkit files, and files the toolkit no longer ships. Use ordinary file and Git tools as useful; a commit message alone does not establish who owns a change.

When the choice modules add text or settings to shared files, build the setup copy that [setup-copy.md](setup-copy.md) describes and compare the assembled result. [skills-hooks-settings.md](skills-hooks-settings.md) explains the skills, hooks, and settings to include.

Preserve the project’s facts and records during the scan. Existing `owner-preferences.md` and `salesforce-agent-permissions.md` are the owner’s files; never compare or replace them as toolkit updates. An intentionally deleted `SOUL.md` stays deleted. Generated indexes are maintained by their existing procedures, not treated as source-file differences.

The owner's records stay where they are unless the owner approves a move.

## Show the owner the differences

Explain the available changes in plain words, including how they affect the project and any existing customizations. Include proposed removals or replacements of older toolkit files. Ask which changes the owner wants to adopt. A request to update the toolkit authorizes this review; it does not select every change.

Show the actual proposed content when a change affects the owner’s instructions or project guide. Preserve project-specific facts, commands, settings, and instructions unless the owner selects a change to them. When the origin or purpose of existing content is unclear, include it in the review rather than assume it is disposable.

## Apply the owner’s choices

Apply only the changes the owner selected. Merge them into the project’s files while preserving records, unrelated settings, and project customizations. Use [skills-hooks-settings.md](skills-hooks-settings.md), "Merge rules", when updating host settings and hooks. Replace the toolkit’s own handler rather than install a duplicate. Keep each `AGENTS.md` paired with its `CLAUDE.md` containing `@AGENTS.md`.

Remove a retired toolkit file only when the owner selected its removal. Update its references and settings in the same change, preserving any owner content that still belongs in the project. A toolkit file’s retirement does not authorize deleting project records. Keep production safeguards in place while their replacements are prepared.

For changes in an outside service, follow the choice's own update steps within the owner-selected scope:

- Notion: [updating-a-notion-project.md](../choices/notion-shared/reference/updating-a-notion-project.md).
- GitHub Issues: [updating-a-project-with-github-work-items.md](../choices/work-items/github/reference/updating-a-project-with-github-work-items.md).
- Hindsight: [hindsight-setup.md](../choices/memory/hindsight/hindsight-setup.md).
- Salesforce: [salesforce-setup.md](../choices/salesforce/salesforce-setup.md). Put the new production and read-only org protections in before an earlier protection comes out.

## Verify and report the adopted update

Run the applicable final checks in [finishing.md](finishing.md) against the adopted setup. Verify that the project’s record routes and customizations still work. A difference the owner chose to retain is not a setup failure.

Report what was adopted, what stayed, and anything still unresolved. Name any service affected and the owner’s remaining host steps. A changed Codex hook entry or description needs the owner’s trust in `/hooks`; the owner starts a new session to load the updated instructions.

Use the commit offer in [finishing.md](finishing.md). Merge only with the owner’s authorization, through the project's `merge-and-clean-up` skill. After the branch is merged, apply approved changes to ignored folders in the main checkout and verify their links. Preserve original records recoverably when an approved move changes them. Remove only your update worktree, branch, and temporary comparison files after the work is complete.

## Changing a setup choice

Change a setup choice only when the owner asks, for example "move memory to Notion". A setup choice is where work items are kept or where memory is kept.

### Where work items or memory are kept

A changed choice updates these parts: it adds the files of the new choice's setup folders, it removes the files of the old choice's setup folders, it changes lines of "Toolkit settings", and it changes the lines that a choice adds to a file the project already has. No other line of `AGENTS.md`, `README.md`, `PROJECT.md`, or a rule changes.

1. Tell the owner what changes and what cannot move (for example Notion page history and comments), and get the owner's yes.
2. Make your own worktree and branch, as "Read the project’s setup" says. Plan these changes for the setup copy; apply them to the project only after verification in step 6:
   - Change the Tracker or Memory line.
   - Remove each line that only the old choice used.
   - Write the new choice's lines as its "what it adds" reference says, and as [SKILL.md](../SKILL.md), "The lines of "Toolkit settings"", says for every line.
   - Take out the lines that the old choice adds to a file the project already has, such as rows in `AGENTS.md`, entries in the settings files, and lines in `.gitignore` and `.ignore`. Put in the lines that the new choice adds. Refresh the root summary using [project-store-summary.md](project-store-summary.md) after the new destinations are verified.
3. Build and compare the setup copy for the agreed choices as "Scan for toolkit differences and updates" says, including the planned settings and routing changes from step 2. Keep the installed configuration unchanged until step 6.
   - Apply approved changes unrelated to the move as "Apply the owner’s choices" says. Keep affected operational files, including new skills, in the setup copy until the records have moved in step 5. Install them in step 6.
   - Keep the old choice's installed instructions until the records move in step 5. Read the old tracker reference or memory skill and its installed store instructions before the change. Read the new choice’s entry skill and applicable references in the setup copy to learn how to create and read back its records. Do not install the new instructions over the old ones yet.
   - Prepare the new memory choice’s hook handlers in the setup copy’s `.claude/settings.json` and `.codex/hooks.json` ([reference/skills-hooks-settings.md](skills-hooks-settings.md), "What a choice changes in the settings" and "Merge rules"). After step 6 applies the change, the owner trusts the changed Codex hooks again in `/hooks`.
4. Do what the setup file of the new choice gives for outside the project folder.
   - When the project already has work items or memory in Notion and adds the other one, make no second project page. Follow [notion-project-pages.md](../choices/notion-shared/reference/notion-project-pages.md), "Adding work items or memory later".
5. Preview the named records to move, their destination and any information that cannot transfer. One owner approval may cover that reviewed batch and its confirmed destination. Reuse that approval for the listed moves; ask again before changing the scope or destination. Preserve the originals and read every moved record back in its new place. Record which moves were verified or failed, so a later session can resume without creating duplicates.
   - Follow the source choice's retirement procedure and the destination choice's import and read-back procedure, through their setup references. Prepare source retirement now, but apply it only after step 6's verified move and owner approval.
6. After the records are moved and the owner says yes to the list, apply the prepared project settings, guide routes and hook changes, install the new choice’s merged skill folder from the setup copy, and remove the old choice’s files. Apply the source choice's retirement steps within that approved scope, so that only the selected store remains active. Check for owner edits before replacing or removing a skill file. The installed tracker reference or memory entry skill then routes to the new choice’s instructions.
   - The list is every file of the old choice's `files-to-add/` folders that no folder of the new choices holds.
   - A file in `work-items/` or `memory/` that is not in a setup folder is the owner's record. It stays until the owner says what to do with it.
