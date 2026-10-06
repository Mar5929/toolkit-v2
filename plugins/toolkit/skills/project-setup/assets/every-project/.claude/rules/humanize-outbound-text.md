# Humanize Anything Sent to Another Person

- Run any text that will leave the project and be read by someone other than the owner through the `humanizer` skill before the owner sees the final version.
- If `humanizer` is not installed, rewrite the text yourself following `.claude/rules/document-clarity-standard.md`, and tell the owner the humanizer did not run.
- This covers emails, chat messages, support case text and comments, GitHub issues, pull request descriptions, client documents, and any file made to hand to someone else.
- It does not cover replies to the owner in a session, work items, project knowledge, code, or commit messages.
- Keep every fact, name, id, number, and date exactly as it was.
- Write it in the owner's voice, first person, when it goes out under their name.
