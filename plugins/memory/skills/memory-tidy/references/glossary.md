<!-- Generated file. Source: plugins/memory/shared/glossary.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# The terminology glossary

Purpose: the format of the project's glossary and the exact sequence to add,
change, or retire a term.

## Where it lives

| Backend | Where |
| --- | --- |
| Built-in | `.memory/terminology-glossary.md` in the main checkout |
| Hindsight | The document `glossary` in the project's bank |
| Notion | The "Terminology glossary" page under the project's page |

The same commands work in every backend. Never edit the file or page by
hand.

## The format

The model's format: the `# Terminology glossary` title, its short paragraph,
one table, then the section "Naming changes and aliases".

```markdown
| Term | System or context | Meaning here | Distinction or alias | Source | Status / last checked |
| --- | --- | --- | --- | --- | --- |
| Account | Salesforce | A customer company | Not a login account | Owner, 2026-09-26 | Current, 2026-09-26 |
| Account | Billing app | The login a person signs in with | Salesforce calls this a User | Owner, 2026-09-26 | Current, 2026-09-26 |

## Naming changes and aliases

- Client → Account (Salesforce); the team renamed the object; Owner, 2026-09-26.
```

- One term per row. A word two systems use differently gets two rows, as
  above.
- **Meaning here:** the exact meaning in this project, from the owner or an
  authoritative project source. Never a definition you inferred from a
  similar word elsewhere.
- **Source:** who or what defined it, with an absolute date.
- **Status / last checked:** `Current` or `Needs review`, with a date. A
  term no longer used: `Retired, <date>` while other records still use it;
  remove the row when nothing does.
- An alias line: the old term, an arrow, the preferred term, the reason, the
  source, and the date.
- A new project's glossary still holds the model's fill-in guide comment and
  an example row with angle-bracket prompts. Remove both with the first real
  term.

## Read, change, save

1. Read it with its version:

   ```text
   toolkit memory glossary --json
   ```

2. Add, change, or retire rows in the whole text. Keep the title, the
   paragraph, and every row you are not changing.
3. Save the whole text with the version you read. Claude Code: `<file>` is
   `-`, with the text on standard input after a quoted heredoc
   (`<<'EOF'`).

   ```text
   toolkit memory glossary --set-file <file> --expect <version>
   ```

   Codex: the text in single quotes, or a file in a new `mktemp -d` folder
   that you delete after the save. Write an apostrophe as ’ (the curly
   apostrophe, U+2019), or reword the text; never `'\''` in Codex, which
   runs the command inside the sandbox:

   ```text
   toolkit memory glossary --text '<text>' --expect <version>
   ```

4. Exit code 2 with "changed since it was read": read it again, redo the
   change, and save with the new version. An empty glossary is refused.
5. Read it back:

   ```text
   toolkit memory glossary
   ```

## Examples

- The owner: "When I say 'job' I mean a scheduled Apex batch, not a work
  item." Add a row: `| Job | Salesforce | A scheduled Apex batch run | Not a work item | Owner, 2026-09-28 | Current, 2026-09-28 |`.
- The owner: "We call them Customers now, not Clients." Change the row's
  Term, add an alias line, and tell him in one line. The alias line:
  `- Client → Customer; renamed by the owner; Owner, 2026-09-28.`
- A term only an old design used: set its status to `Retired, 2026-09-28`.
