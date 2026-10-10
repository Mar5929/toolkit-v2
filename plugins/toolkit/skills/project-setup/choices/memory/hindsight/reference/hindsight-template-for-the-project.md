# Choose Hindsight's memory instructions

Use this after the owner approves the settings package. Offer the recommended three missions, changes to them, or another template, then prepare one combined bank configuration for review. A template may carry settings as well as text; preserve the owner's approved package when they overlap.

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

## Recommended instructions, changes, or another template

Read `hindsight-missions-recommended.md`. Offer its three missions together as "Toolkit coding-project instructions", with the project name filled in. Explain their purpose and origin. Ask: "These are our recommended memory instructions for coding projects. Do you want these, changes to them, or another template?"

When accepted, use the supplied mission text. It adds no settings, labels, directives, or knowledge pages by itself; keep the approved operating package and separately agreed page choices. For a non-coding project, explain the coding focus and help the owner adapt it or choose a more suitable template.

When the owner wants changes or their own instructions, use the recommended missions as a starting point where useful. Help them describe retention, synthesis, and answers, and show the resulting text before applying it.

With a published template, work on a copy of its current file. Inspect the three missions and any extraction settings, labels, pages, directives, and disposition values. Show how it changes the recommended missions, identify missing missions, and explain any overlap with the approved package. Fill a missing mission from the recommendation where suitable, or from the owner's own instructions, and show that addition for approval. Adapt its instructions to the project's subject and approved memory policy without silently changing the package.

With the owner's own instructions, help the owner describe what to retain, what to synthesize, and how answers should use memory. Prepare all three missions and discuss other bank fields only where the project needs them. This choice does not mean accepting the add-on's missions without review.

For every choice, preserve the distinction between evidence and decisions. Keep proposed or unresolved claims marked as such. Keep live work status in the work tracker. Include code structure in the retain instructions when the survey is approved. Show the combined missions and other configuration, then get the owner's approval.

## Apply approved instructions

Use the server's current template schema and dry run to validate the combined configuration before importing it. A template can create a bank; it can also update an existing bank. Preserve unrelated existing settings and records.

The add-on creates named extraction strategies. Their overrides can replace the bank's general retain mission. After it prepares the bank, read the whole `retain_strategies` value and make the effective `document` mission match the approved retain instructions. Apply them to `conversation` too when session saving is approved. Preserve the add-on's source-handling guidance and other strategies, and update an existing owner section rather than appending duplicates. Read back the strategies and check the effective extraction prompt. Check `retain_default_strategy` too: a native save without an explicit strategy must use the approved retain instructions, not an unrelated Git mission. Include any needed default-strategy change in the configuration shown to the owner.

Keep the approved `observations_mission` and `reflect_mission` on the bank. Read them back after the add-on prepares it; do not assume the add-on supplies a missing mission when another mission already exists. Verify its configuration ownership and extraction mode against the approved package.

## Knowledge pages from a template

The add-on supplies its seeded pages. For additional template pages, use `customPages` where its supported fields can represent them, including their source queries and tags. Avoid duplicating subjects covered by existing pages. The add-on's page schedule follows the approved package.

When a template page has configuration the add-on cannot represent, explain that difference before applying it. Use the bank's native page configuration when needed, and verify that the available retrieval tools can find it. Preserve approved page behavior rather than silently dropping fields.
