# Set up Hindsight as a project's memory

Use these steps when the owner chooses Hindsight. Setup is done when the project reaches the intended bank, its settings and missions match the owner's choices, and the checks pass. Use Hindsight's existing tools and configuration; add no setup scripts.

## Confirm the connection and bank

Read `reference/how-the-owners-hindsight-works.md`. Check the server, installed add-on, connection settings without exposing the key, and the project's recorded bank. Confirm the bank with the owner; offer one bank for the project when none is recorded. Read an existing bank's settings before proposing changes.

## Offer the default settings

Read `reference/hindsight-package-default.md`. Explain what the package does and what it costs, then ask: "These are our normal Hindsight settings. Do you want them, or any changes?" Record the answer. The default is deliberate memory saves; automatic session saving is a change the owner may choose.

## Offer a template or the owner's own instructions

Read `reference/hindsight-template-for-the-project.md`. Explain the retain, observations, and reflect missions. Recommend a published template suited to the project, and ask whether the owner wants that template or their own instructions. Show the resulting missions and other template settings before applying them. Keep the approved package wherever it overlaps with the template.

## Apply and verify the configuration

1. Record the approved choices and open steps as `reference/what-hindsight-adds-to-a-project.md` says. Show changes outside the project before making them.
2. Prepare the add-on's connection and opt-in settings whether or not a key is already present. Have the owner enter a missing key privately in their Terminal. Preserve settings for other projects.
3. Install the add-on for Claude Code and Codex when missing, with the owner's server named. Check the first-message hook timeout against the package. Have the owner trust changed Codex hooks with `/hooks`.
4. Validate the approved bank configuration with Hindsight's template dry run, then create or configure the bank. Keep automatic sessions and the code survey off during preparation. For an existing bank, preserve its content and unrelated settings.
5. Map the main checkout to the intended bank with the approved per-bank settings. Have the add-on prepare its strategies and pages, then apply the approved missions to the effective strategies as the template reference says. Start a new session when its tools still use old connection settings.
6. Read back the effective bank and add-on settings. Check the three missions, extraction strategies, observation settings, redaction, routing, and page schedule. Try representative extraction input with the server's non-storing preview tools. Check a qualifying fact, a transient status, and an unresolved claim against the approved instructions.
7. Enable the approved capture settings only after those checks pass. Verify retrieval, survey behavior, knowledge pages, and the startup summary in a new session. If a check needs a saved sample, agree on that sample with the owner first. Report failures; use `reference/hindsight-known-problems.md` for diagnosis.
8. Report what is configured, what was checked, and what remains. Update the open steps in `PROJECT.md`. Mark setup done only when the checks pass.

When preparation cannot finish, keep capture disabled for the new setup and record where to resume. On an existing installation, retain working settings until replacement settings are verified.

## Check, update, or connect a new computer

Read the recorded choices first; do not repeat decisions the owner has already made. In a setup check, inspect and report without changing anything. In an update or on a new computer, apply the missing approved configuration and verify it. Memory stays on the server. For the dashboard, open the recorded bank link; its access key is separate from the API key.
