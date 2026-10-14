# Set up Hindsight as a project's memory

Follow these steps, in order, when the owner chooses Hindsight. Setup is done when the project reaches the intended bank, its settings and missions match the owner's choices, and the checks pass. Use Hindsight's existing tools and configuration; add no setup scripts.

The first three parts below are the interview with the owner. The parts after them apply the owner's answers and check the result.

## Steps to set up Hindsight for a project

### Confirm the connection and bank

1. Read [how the owner's Hindsight works](reference/how-the-owners-hindsight-works.md) for the service and connection.
2. Check the server, the installed add-on, the connection settings without exposing the key, and the project's recorded bank.
3. Follow [the bank strategy](reference/hindsight-bank-strategy.md) to confirm the bank's scope and stable identity with the owner. Read an existing bank's settings before proposing changes.
4. Read [the recommended service settings](reference/hindsight-server-settings.md). Confirm provider authentication, and record the service operator, effective model roles, capacity profile, and backup procedure.
5. Explain any missing check or difference from the recommendation. Separate shared-service changes from this project's setup, and show their scope before applying an authorized change.

### Offer the default settings

6. Read [the default package](reference/hindsight-package-default.md). Explain what the package does and what it costs.
7. Ask: "These are our normal Hindsight settings. Do you want them, or any changes?" Record the answer. The default is deliberate memory saves; automatic session saving is a change the owner may choose.

### Offer the memory instructions

8. Read [the template for the project](reference/hindsight-template-for-the-project.md) and [the recommended missions](reference/hindsight-missions-recommended.md). Explain the retain, observations, and reflect missions.
9. Offer the Toolkit coding-project instructions together by default, with the option to change them or choose another template. Discuss suitability for the project.
10. Show the resulting missions and any template settings before applying them. Keep the approved package wherever it overlaps with a template.

### Add the project's files and records

Show changes outside the project before making them.

11. Install the memory rule, write the "Project memory" section of the root `AGENTS.md`, wire the existing reminder, and record the approved choices and open steps as [what Hindsight adds to a project](reference/what-hindsight-adds-to-a-project.md) says. That file's new-session check runs in step 30.
12. Copy the folder `choices/memory/repository-records/files-to-add/`, which holds `DECISIONS.md`, `wiki/product-wiki/`, and the reference files that two shared skills read for these records. Write the rows for these records as [what the repository records add to a project](../repository-records/reference/what-repository-records-add-to-a-project.md) says.

### Prepare the add-on

Preserve settings for other projects.

13. Prepare the add-on's connection and opt-in settings whether or not a key is already present. Before you newly enable the project or install hooks, write the project's per-bank preparation settings with `retainSessions` and `codebaseSurvey` off. Enable the project's path only after these settings are in place. Have the owner enter a missing key privately in their Terminal.
14. Inspect existing hook and MCP registrations before installing or replacing an integration. Keep one approved integration for each intended host and preserve unrelated handlers.
15. Install the add-on for Claude Code and Codex when missing, with the owner's server named. During migration, preserve the approved endpoint, bank, and capture choices.
16. Apply the default package's startup deadline and native Codex context allowance to the existing handler, and confirm that the delivered memory rule covers full saved-output reading.
17. Read [the local bank-detection patch](reference/hindsight-local-bank-detection-patch.md). Check whether the installed add-on and the chosen Git settings are affected by the bug that file describes.
18. When the add-on and settings are affected, explain the known bug and the proposed local patch, obtain or use the owner's existing approval, and apply the patch. When a fixed release is installed, record that no patch is needed. Installing the add-on can replace patched files, so check each later installation again, and apply the approved patch only when that installation is still affected.
19. Have the owner trust changed Codex hooks with `/hooks`.

### Create or configure the bank

Keep automatic sessions and the code survey off during preparation. Start a new session when the session's Hindsight tools still use old connection settings.

20. Validate the approved bank configuration with Hindsight's template dry run, then create or configure the bank. For an existing bank, preserve its content and unrelated settings.
21. Map the main checkout to the intended bank with the approved per-bank settings.
22. Have the add-on prepare its strategies and pages, then apply the approved missions to the effective strategies as [the template for the project](reference/hindsight-template-for-the-project.md) says.

### Check the configuration before capture is on

Keep capture off until step 28. Keep a writer off when its protection cannot be verified. Extraction previews do not prove that the stored document is scrubbed.

23. Read back the effective bank and add-on settings. Check the three missions, extraction strategies, observation settings, redaction, routing, and page schedule.
24. Try representative extraction input with the server's non-storing preview tools. Check a qualifying fact, a transient status, and an unresolved claim against the approved instructions.
25. Verify that each proposed writer, including a code survey or automatic import, excludes forbidden text from the whole submitted document before storage.
26. For a proposed code survey, follow [survey protection](reference/hindsight-survey-protection.md) after the intended bank and policy are effective. Repair the native write-tool guidance when needed and verify complete outgoing documents.
27. Check any approved filter with safe dummy input; qualifying contact details must remain usable.

### Turn capture on and verify

28. Enable the approved capture settings only after the checks in steps 23 to 27 pass.
29. Follow [the memory-flow verification](reference/hindsight-verification.md) for processing, Recall, Reflect, surveys, pages, and new interactive sessions in both intended hosts. If a check needs a saved sample, agree on that sample with the owner first. When the bank-detection patch from step 18 was applied, also run the checks in [the local bank-detection patch](reference/hindsight-local-bank-detection-patch.md), "Verify before calling it fixed", that need the real bank or a new session.
30. In a new session, confirm that the agent reads the memory rule and that the add-on reaches the recorded bank, as [what Hindsight adds to a project](reference/what-hindsight-adds-to-a-project.md), "Verify the project wiring", says.
31. Report failed or unavailable checks; use [known problems](reference/hindsight-known-problems.md) for diagnosis.
32. Report what is configured, what was checked, and what remains. When the bank-detection patch from step 18 was applied, include its maintenance and rollback in this setup handoff. Record open steps with [finishing memory setup](reference/finishing-memory-setup.md). Mark setup done only when the checks pass.

## When preparation cannot finish

When preparation cannot finish, keep capture disabled for the new setup and record where to resume. On an existing installation, retain working settings until replacement settings are verified.

## Check, update, or connect a new computer

Read the recorded choices first; reuse decisions the owner has already made.

- For "check the setup", inspect and report without changing anything.
- For "update the toolkit", compare the project's memory rule, add-on tool guidance, and effective retention instructions with newer Toolkit guidance. Show relevant differences and apply approved refinements, preserving owner customizations and unrelated settings. Follow [the template for the project](reference/hindsight-template-for-the-project.md) to update effective extraction strategies and verify readback.
- For a new computer, apply and verify any missing approved configuration. Memory stays on the server. Open the recorded bank link for the dashboard; its access key is separate from the API key.
