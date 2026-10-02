# Notion

Purpose: what setup does when work items, memory, or both live in Notion:
the sign-in, the owner's yes before anything is made in his workspace, which
Notion setup steps to follow, and where the links go.

`notion-build/work-setup.md` in this folder holds the Notion steps for work
items, and `notion-build/setup.md` holds them for memory; setup follows
them. Setup makes only these Notion calls itself: `ntn whoami`; the
`ntn api v1/search` call in "Where the project page goes"; the one
write of the project's outcome into its row
(`finishing.md` in this folder, step 1 of "Fill the prompts"); and the one
read of the "Current state" page in the Services check of "Final checks"
in `finishing.md`.

## Contents

- Sign-in: the owner's step
- His yes before anything is made
- Where the project page goes
- Which steps to follow
- The links in PROJECT.md
- Updating a Notion project

## Sign-in: the owner's step

Ask for it right after the plan is approved, so he can do it while you copy
files.

1. Check: `ntn whoami`. It prints the "Notion CLI" connection, his email,
   and the workspace.
2. It says there is no sign-in or token: the owner runs `ntn login` in a
   terminal. It opens a browser, where he signs in and picks the pages the
   "Notion CLI" connection may use. Say so, wait for him to say it is done,
   then run `ntn whoami` again. Never run `ntn login` for him, and never ask
   him for a token, a code, or a password.
3. `ntn` is not installed (`command not found`): installing it changes his
   computer. After his yes: `npm install -g ntn`.

## His yes before anything is made

- Nothing is made in his real Notion workspace without his yes. The plan he
  approved (`interview.md`, "The plan to confirm") covers this project's
  pages when it named them.
- The "Project" template in his Projects database is built once per
  workspace, the first time any project needs it. Building it is its own
  question, asked when it does not exist yet: "Your Projects database has
  no Project template yet. I need you to make it in the Notion app: two
  empty templates (one in your Projects database, one in the Work Items
  database inside it), two choices of 'Set as default', and the page
  layout of the databases inside it. I give you the clicks in small groups
  and fill in everything else. Then every Notion project, and every card
  you make with New, starts from it. Go ahead?"
- When the owner says this project is a test, make its Notion pages only
  under the test page he names, never under his real pages unless he says
  so.

## Where the project page goes

The Notion setup files make the project page as a row of the owner's
Projects database (`<projects-data-source-id>`), from a template that lives
in that database. Nothing records its id yet, so find it before you follow
them:

1. List the data sources named "Projects" that "Notion CLI" can see, with
   each one's title column and the page that holds its database:

   ```text
   ntn api v1/search -d '{"query":"Projects","filter":{"property":"object","value":"data_source"}}' < /dev/null | jq -r '.results[] | [.id, (.title | map(.plain_text) | join("")), (.properties | to_entries[] | select(.value.type == "title") | .key), (.database_parent.page_id // "")] | @tsv'
   ```

2. Leave out every one whose title column is `Name`: that is Lore's
   Projects database under another project's Memory page. The owner's
   Projects database has the title column `Project`.
3. Ask him one question, with a recommendation: "I'll add this project as
   a row of your Projects database (<link>). OK?" Ask it as its own
   message, before the ID prefix question, and make no project page until
   he answers. The plan's yes does not cover which database, and a line
   about it inside a message that asks something else does not count as
   asking. When more than one is left, list each with its link and ask
   which one, recommending the one that holds his other projects. When he
   has none, stop, tell him a Notion project needs a Projects database
   because the template lives in one, and ask him to make one in Notion.
4. Use the id he confirms as `<projects-data-source-id>`.

When the owner names a page to put the project under, still run step 1,
and keep the Projects data sources whose database sits on that page (the
last column of step 1 is that page's id; compare the ids without their
dashes). When one has the title column `Project`, ask it the same way, as
its own message: "I'll add this project as a row of the Projects database
on <page>. OK?" When that page has no such database, stop, tell him
that page has no Projects database, and ask him to make one on it or to
name another page.

## Which steps to follow

Every Notion project is made from the one Projects database template,
"Project", which holds both the work items part and the memory part. Follow
`notion-build/work-setup.md`, "A new project", for work items, memory, or
both in Notion. It makes the project page, removes the part this project
keeps elsewhere, and runs the memory steps in `notion-build/setup.md` when
memory is in Notion.

The ID prefix: the work setup proposes one from the project name (two to
four capital letters) and asks the owner. Notion allows each prefix in only
one database of a workspace; when setting it fails with a conflict, propose
another.

## The links in PROJECT.md

The Notion setup files give a "Notion" block of links and ids for
`PROJECT.md`, section "Toolkit settings". In the project's `PROJECT.md`:

- put the prefix on the "Work item ID prefix" line;
- put the project page link on the "Notion work items" line, and the Memory
  page link on the "Notion memory" line;
- add that "Notion" block once, at the end of "Toolkit settings", and read
  it back. The Notion skills read every id from it.

With memory in Notion, the memory setup also fills the "Current state" page
with the project's first lines (`finishing.md` in this folder says what they
are). Then put that page's id in the session-start hook: replace
`{{CURRENT_STATE_PAGE_ID}}` with it in `.claude/settings.json` and
`.codex/hooks.json`. Do it before the owner trusts the hooks in Codex: a
changed hook must be trusted again. Check that no placeholder is left:

```text
grep -n '{{' .claude/settings.json .codex/hooks.json
```

## Updating a Notion project

Copying newer skill files changes nothing in Notion. For an update in a
Notion project, run "Bringing a project up to the current template" in
`notion-build/work-setup.md`, and "Bringing memory up to the current
layout" in `notion-build/setup.md`, for the parts the project keeps in
Notion. Both only add what is missing; they never remove, rename, or
retype anything, except the one view that the memory step names. A project
with a Stage property also needs "From Stage to State" in
`notion-build/work-setup.md`. Tell the owner in one short list
what was added.
