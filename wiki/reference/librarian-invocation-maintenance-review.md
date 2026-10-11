# Librarian invocation and existing-wiki maintenance review

The 0.9.62 draft adds a short invocation prompt and a focused existing-wiki maintenance reference to the Notion librarian package. The main entry is 31 lines. Setup fills the project name and published entry URL, publishes the prompt with the package, and uses it for scheduled and on-demand invocation.

Maintenance runs even with no new inbox captures. It covers stale or misplaced content, duplicate current authority and broken pointers while preserving distinct context, history, provenance, approval evidence and derived Current state summaries. It verifies writes and keeps unfinished maintenance in the configured run record, without assigning capture statuses to operations with no capture.

An independent agent reviewed the entire librarian package, setup, publication and recovery together. Document scenarios covered an empty inbox, duplicate/history distinctions, unavailable sources, snapshot summaries, partial recovery, capture statuses, cloud publication and common invocation. No confirmed material issues remain; no runtime or live Notion writes were performed.

Official guidance read: Claude Code skills captured 2026-10-05, Codex build-skills and Anthropic skill-authoring best practices captured 2026-09-27. Both Claude package validations, git diff --check, front matter, prompt filling and all package reference links passed. Codex accepted 0.9.62 in a scratch home at /private/var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tkv62-maint-codex.kwgz4j1k/plugins/cache/toolkit-v2/toolkit/0.9.62.

Mike authorized implementation and independent review. The draft is uncommitted on codex/librarian-maintenance, based on main 0.9.61. No live template publication, scheduler activation or installed-project update occurred.
