# Choose Hindsight's memory instructions

Use this after the owner approves the settings package. Offer a published template or the owner's own instructions, then prepare one combined bank configuration for review. A template may carry settings as well as text; preserve the owner's approved package when they overlap.

## The three missions

| Mission | What its plain-English text guides |
| --- | --- |
| `retain_mission` | Which facts to extract and ignore from incoming content. |
| `observations_mission` | Which lasting conclusions to form from accumulated facts. |
| `reflect_mission` | How to answer questions using the bank's memory. |

Missions guide model behavior. They do not guarantee a filter, and they do not exclude the incoming source document from storage. The agent checks the project's memory criteria and existing records before a deliberate save.

## Sources for templates and settings

| Source | Open it for |
| --- | --- |
| https://hindsight.vectorize.io/templates | Available templates and their purposes. |
| https://hindsight.vectorize.io/best-practices | Guidance for writing memory instructions. |
| https://github.com/vectorize-io/hindsight/tree/main/hindsight-docs/src/data/templates | The full published template files. |
| https://hindsight.vectorize.io/developer/api/bank-templates | Supported manifest fields, import, and dry run. |
| https://hindsight.vectorize.io/developer/api/memory-banks | Meanings of bank settings and missions. |

## Template or the owner's own instructions

Recommend a template suited to the project and explain what it supplies. Ask: "Would you like this template, another published template, or your own instructions?"

With a published template, work on a copy of its current file. Inspect the three missions and any extraction settings, labels, pages, directives, and disposition values. Explain omissions and any overlap with the approved package. Adapt its instructions to the project's subject and approved memory policy without silently changing the package.

With the owner's own instructions, help the owner describe what to retain, what to synthesize, and how answers should use memory. Prepare all three missions and discuss other bank fields only where the project needs them. This choice does not mean accepting the add-on's missions without review.

For either choice, preserve the distinction between evidence and decisions. Keep proposed or unresolved claims marked as such. Keep live work status in the work tracker. Include code structure in the retain instructions when the survey is approved. Show the combined missions and other configuration, then get the owner's approval.

## Apply approved instructions

Use the server's current template schema and dry run to validate the combined configuration before importing it. A template can create a bank; it can also update an existing bank. Preserve unrelated existing settings and records.

The add-on creates named extraction strategies. Their overrides can replace the bank's general retain mission. After it prepares the bank, read the whole `retain_strategies` value and make the effective `document` mission match the approved retain instructions. Apply them to `conversation` too when session saving is approved. Preserve the add-on's source-handling guidance and other strategies, and update an existing owner section rather than appending duplicates. Read back the strategies and check the effective extraction prompt.

Keep the approved `observations_mission` and `reflect_mission` on the bank. Read them back after the add-on prepares it; do not assume the add-on supplies a missing mission when another mission already exists. Verify its configuration ownership and extraction mode against the approved package.

## Knowledge pages from a template

The add-on supplies its seeded pages. For additional template pages, use `customPages` where its supported fields can represent them, including their source queries and tags. Avoid duplicating subjects covered by existing pages. The add-on's page schedule follows the approved package.

When a template page has configuration the add-on cannot represent, explain that difference before applying it. Use the bank's native page configuration when needed, and verify that the available retrieval tools can find it. Preserve approved page behavior rather than silently dropping fields.
