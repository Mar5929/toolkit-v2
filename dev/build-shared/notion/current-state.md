<!-- Shared text from the Toolkit V2 repository (dev/build-shared/notion/current-state.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# The Current state page

How to read and edit the project's Notion "Current state" page. Its id is in `PROJECT.md`. Its sections and limits are in the memory rule and the `CURRENT_STATE.md` template.

## Reading it

The session start hook prints it. To read it again:

```bash
ntn api v1/pages/{{CURRENT_STATE_PAGE_ID}}/markdown < /dev/null | jq -r .markdown
```

## Editing it

Change it with `update_content` (`ntn-basics.md`): replace a line, add a line under a heading, or remove a line (its `old_str` with the line break, `new_str` empty). Update "Last updated:" in the same call. An empty section says "None."

A section still over its limit after every line that is no longer true is gone: run the notion-memory-refine skill, which cuts a true line only after the owner's yes.
