# Local patch for Git-disabled bank detection

Use this when the installed coding-agent add-on still treats a populated bank as new with `gitIngest: "none"`. The defect was verified in add-on 0.8.0 on 2026-10-10. Check current behavior before patching: a later release may already fix it. This is a temporary change to the add-on's runtime, not a toolkit hook or setup script.

## Approval and project record

Show the proposed changes and apply them with the owner's approval. An approval already given for this patch does not need to be requested again. If the installed version has the fix, explain that no patch is needed. Record the outcome under Hindsight setup in `PROJECT.md`.

## Locate and back up the installed runtime

Use the add-on's installed skill and the host's actual hook entries to locate the runtime. The usual home-relative location is `.hindsight/coding-agents/dist/`. In 0.8.0 the Claude Code and Codex SessionStart handlers run `claude-sessionstart-hook.js` and `codex-sessionstart-hook.js`. Patch the files the installed hosts actually execute; do not assume every host uses these names.

Use the home directory and path tools of the current platform. On macOS and Windows, the runtime is JavaScript run by Node; the logic change is the same. Use Node or another available file tool for the edit and checks, rather than a platform-specific shell patch. Preserve paths, line endings, file permissions, and unrelated configuration.

Back up each runtime file and the add-on configuration before editing. Keep any configuration backup private because it contains the API key. Record the original package version and original `autoUpdate` value. Pause the add-on's automatic runtime updates with `autoUpdate: false` while this patch is in use so an update cannot silently erase it. Explain that this pins the installed runtime for all projects on the computer. Keep connection, bank routing, missions, capture choices, and other host handlers unchanged.

## Required behavior of the patch

In 0.8.0, find the shared `buildSessionStartContext` implementation in each active SessionStart bundle. It sets `cold` from `listDocumentIds("source:git", "all_strict")`, then takes the new-bank survey branch when the set is empty. Correct these related behaviors:

- With Git ingestion off, determine whether the bank has documents using the existing authenticated client and a read-only request to its documents endpoint, with a small result page. Use the returned total or items to distinguish empty from populated. An unsuccessful lookup is unknown, not evidence that the bank is empty. Reject non-success HTTP responses and malformed document listings, including in the survey-baseline and findings lookups; the 0.8.0 helper otherwise turns some failures into empty results. Preserve the existing Git-enabled path.
- Keep bank-content detection separate from Git-document reporting. Do not pass non-Git document IDs into Git synchronization status or start Git seeding when Git ingestion is off.
- For an existing bank, honor the stored survey baseline and findings: do not repeat a successful survey before its configured refresh is due; retry missing findings; start an initial survey when enabled and no baseline exists under the normal refresh configuration. Preserve a genuinely empty bank's initial survey behavior.
- A populated bank with available knowledge pages must not defer its startup summary solely because Git documents are absent. Keep the existing empty-page preparation behavior.

Use the client's existing request and bank-URL methods. In 0.8.0, `listDocumentIds` requires a tag; calling it with no tag is not an unfiltered bank lookup. Do not import Git, create fake Git records, disable an approved survey, or change the startup source to hide the defect.

For another version, inspect its implementation and adapt the smallest equivalent fix. Do not apply a text replacement when the expected code differs or when the version already has corrected behavior.

## Verify before calling it fixed

Check the changed JavaScript with `node --check`. Exercise the actual patched bank-detection function with controlled clients and survey/seed functions: a populated Git-disabled bank, an empty bank, a due survey refresh, missing findings, an initial survey, a lookup failure, and an unchanged Git-enabled path. Confirm no Git seed runs with Git off and no repeat survey runs for a current successful baseline.

Read the real bank's content and pages without saving test material. Confirm its populated state produces eligibility for the startup summary. In a fresh Claude Code and Codex session, verify the SessionStart and first-prompt behavior in the diagnostics: the repeated new-bank deferral should stop, and reflection or its documented fallback should supply context. Treat summary timeouts separately; this patch does not speed up model generation. Report any host or live-session check that could not run.

Check that no new Git documents or test memories were saved, and record the patch version, backups, checks, and remaining work in `PROJECT.md`. Windows verification requires a Windows run; a platform-independent edit alone is not proof it was tested there.

## Update or undo the patch

A reinstall or manual runtime update replaces patched bundles. Before updating, inspect the release's bank-detection behavior. When an official release fixes the defect, install it, repeat the checks, and restore the owner's original automatic-update choice. When it does not, disclose that the temporary patch must be reviewed and reapplied to the new runtime.

To undo, restore the backed-up bundles for their matching package version and the original automatic-update value, preserving subsequent unrelated configuration changes. If the installed package version has changed, reinstall that known version or inspect the new one instead of mixing old bundles with a new package. Do not restore the entire configuration backup over newer owner choices.
