# Comments, source files, and links

Purpose: the agent's running notes, the files a work item draws on, and how
pull requests and commits name an item.

## Contents

- Comments: the agent's running notes
- Source files and the Sources list
- Pull requests and commits

## Comments: the agent's running notes

Issue comments sit below the body.

```text
gh issue comment <number> -R <repo> --body 'Agent: helper finished P1-T02; 12 tests pass.'
```

- Start every agent note with "Agent:". `gh` signs in as the owner, so
  the note shows his name.
- Read the owner's comments before you change an item. An answer or a
  decision he wrote in a comment goes into Questions and Answers as a row,
  with his words and the date of the comment. A request he wrote there is
  handled like one he said in the chat.

## Source files and the Sources list

Meeting transcripts, documents, and other source material belong on the
item's issue, each with one line under Notes, "Sources". `gh` cannot
attach a file, so there are two ways.

**Text (a transcript, notes, a Markdown or plain text file):** post it as
its own comment.

1. Make the comment in a temporary file:

   `````markdown
   ## Source: 2026-09-30-kickoff-transcript.md

   Kickoff meeting transcript, 2026-09-30, Mike and Dana (finance lead).

   <details><summary>Full text</summary>

   ````text
   <the text, exactly as given>
   ````

   </details>
   `````

   Pasted text is named `YYYY-MM-DD-<short-name>.md`. Keep the text
   exactly as given. The four backticks keep any backticks inside it
   intact.
2. Post it with `gh issue comment <number> -R <repo> --body-file <file>`.
   Keep the comment address the command prints.
3. Longer than 60,000 characters: split it into parts,
   `## Source: <name> (part 1 of 3)` and so on, one comment each.
4. Add its Sources line, naming the comment by its address (replace the
   template's example line the first time):
   `- Comment "Source: 2026-09-30-kickoff-transcript.md" (<comment address>): kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02.`

**Any other file (a PDF, a Word document, an image):** only the owner can
attach it.

1. Ask him: "Please drag `<file name>` into a comment on #12 in the
   browser: <issue address>." GitHub takes files up to 25 MB (images up to
   10 MB).
2. Work from the file where he gave it to you meanwhile. Never copy it into
   the repository: it would be committed.
3. When he says it is there, find his comment and the file's address in it
   (`gh-basics.md`, "Comments"), and add the Sources line with that
   address.

Never edit a source after saving it. Anything taken from a source names it
where it is used ("from the kickoff transcript").

In a Salesforce project, a client file stays in `delivery/`, as `AGENTS.md`
says; its Sources line names the `delivery/` path.

## Pull requests and commits

GitHub closes an issue by itself when a pull request that "closes" it is
merged, or when a commit that "fixes" it reaches the default branch. That
would mark the item Done without the owner's yes.

- Never write `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`,
  `resolve`, `resolves`, or `resolved` directly before `#12` in a pull
  request title or body, or in a commit message.
- Write "Part of #12" instead. It links the two without closing anything.
- Never link a pull request to the issue in the pull request's
  "Development" panel: that link closes the issue on merge too.
- The issue closed by itself anyway: reopen it
  (`gh issue reopen <number> -R <repo>`), put back its stage label, add a
  Recent History row saying GitHub closed it on merge, and tell the owner
  in one line.
