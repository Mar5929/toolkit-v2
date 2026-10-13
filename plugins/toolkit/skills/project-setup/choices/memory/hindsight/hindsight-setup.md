# Set up Hindsight as a project's memory

Use these steps when the owner chooses Hindsight. Setup is done when the project reaches the intended bank, its settings and missions match the owner's choices, and the checks pass. Use Hindsight's existing tools and configuration; add no setup scripts.

## Confirm the connection and bank

Read [how the owner's Hindsight works](reference/how-the-owners-hindsight-works.md) for the service and connection. Check the server, installed add-on, connection settings without exposing the key, and the project's recorded bank. Follow [the bank strategy](reference/hindsight-bank-strategy.md) to confirm its scope and stable identity with the owner. Read an existing bank's settings before proposing changes.

Read [the recommended service settings](reference/hindsight-server-settings.md). Confirm provider authentication and record the service operator, effective model roles, capacity profile, and backup procedure. Explain any missing check or difference from the recommendation. Separate shared-service changes from this project's setup and show their scope before applying an authorized change.

## Offer the default settings

Read `reference/hindsight-package-default.md`. Explain what the package does and what it costs, then ask: "These are our normal Hindsight settings. Do you want them, or any changes?" Record the answer. The default is deliberate memory saves; automatic session saving is a change the owner may choose.

## Offer the memory instructions

Read `reference/hindsight-template-for-the-project.md` and `reference/hindsight-missions-recommended.md`. Explain the retain, observations, and reflect missions. Offer the Toolkit coding-project instructions together by default, with the option to change them or choose another template. Discuss suitability for the project, show the resulting missions and any template settings before applying them, and keep the approved package wherever it overlaps with a template.

## Check for the local add-on patch

After the interview, read `reference/hindsight-local-bank-detection-patch.md`. Check whether the installed add-on and chosen Git settings are affected. If so, explain the known bug and proposed local patch, obtain or use the owner's existing approval, and apply it before the new-session checks. If a fixed release is installed, record that no patch is needed. Include patch maintenance and rollback in the setup handoff.

## Apply and verify the configuration

1. Install the memory rule, write the "Project memory" section of the root `AGENTS.md`, wire the existing reminder, and record the approved choices and open steps as `reference/what-hindsight-adds-to-a-project.md` says. Copy the decision and system records and write their rows as [what-repository-records-add-to-a-project.md](../repository-records/reference/what-repository-records-add-to-a-project.md) says. Show changes outside the project before making them.
2. Prepare the add-on's connection and opt-in settings whether or not a key is already present. Before newly enabling the project or installing hooks, write its per-bank preparation settings with `retainSessions` and `codebaseSurvey` off; enable its path only after these settings are in place. Have the owner enter a missing key privately in their Terminal. Preserve settings for other projects.
3. Inspect existing hook and MCP registrations before installing or replacing an integration. Keep one approved integration for each intended host and preserve unrelated handlers. Install the add-on for Claude Code and Codex when missing, with the owner's server named; preserve the approved endpoint, bank, and capture choices during migration. Apply the default package's startup deadline and native Codex context allowance to the existing handler, and confirm that the delivered memory rule covers full saved-output reading. After installation, apply any approved bank-detection patch from the reference above; installation can replace patched files. Have the owner trust changed Codex hooks with `/hooks`.
4. Validate the approved bank configuration with Hindsight's template dry run, then create or configure the bank. Keep automatic sessions and the code survey off during preparation. For an existing bank, preserve its content and unrelated settings.
5. Map the main checkout to the intended bank with the approved per-bank settings. Have the add-on prepare its strategies and pages, then apply the approved missions to the effective strategies as the template reference says. Start a new session when its tools still use old connection settings.
6. Read back the effective bank and add-on settings. Check the three missions, extraction strategies, observation settings, redaction, routing, and page schedule. Try representative extraction input with the server's non-storing preview tools. Check a qualifying fact, a transient status, and an unresolved claim against the approved instructions. Verify that each proposed writer, including a code survey or automatic import, excludes forbidden text from the whole submitted document before storage. For a proposed code survey, follow [survey protection](reference/hindsight-survey-protection.md) after the intended bank and policy are effective; repair the native write-tool guidance when needed and verify complete outgoing documents. Keep capture off until the enable step below. Check any approved filter with safe dummy input; qualifying contact details must remain usable. Keep a writer off when its protection cannot be verified. Extraction previews do not prove that the stored document is scrubbed.
7. Enable the approved capture settings only after those checks pass. Follow [the memory-flow verification](reference/hindsight-verification.md) for processing, Recall, Reflect, surveys, pages, and new interactive sessions in both intended hosts. If a check needs a saved sample, agree on that sample with the owner first. Report failed or unavailable checks; use [known problems](reference/hindsight-known-problems.md) for diagnosis.
8. Report what is configured, what was checked, and what remains. Update the open steps in `PROJECT.md`. Mark setup done only when the checks pass.

When preparation cannot finish, keep capture disabled for the new setup and record where to resume. On an existing installation, retain working settings until replacement settings are verified.

## Check, update, or connect a new computer

Read the recorded choices first; do not repeat decisions the owner has already made. In a setup check, inspect and report without changing anything. In an update or on a new computer, compare the project's memory rule, add-on tool guidance, and effective retention instructions with the newer Toolkit guidance. Show relevant differences and apply the approved refinements, preserving owner customizations and unrelated settings; use the template reference to update effective extraction strategies and verify readback. Apply and verify any missing approved configuration. Memory stays on the server. For the dashboard, open the recorded bank link; its access key is separate from the API key.
