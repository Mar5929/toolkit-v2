# Choose and preserve the Hindsight bank

Use this during the connection interview to agree on which knowledge the project's agents may recall together. Setup records a stable bank ID and connects each intended host to that same bank.

## Choose the memory boundary

Offer one bank for the project, shared by the project's Claude Code and Codex sessions. Explain that a normal memory query searches one bank; knowledge stored in another bank does not automatically follow the project.

When the owner wants knowledge shared beyond the project, establish which projects, agents, and people may use it before offering a shared bank. Keep distinct customer, access, and untrusted-content boundaries separate. Confirm broader sharing with the owner and record its scope. A bank separates stored knowledge; verify the service's access controls separately.

Use tags for useful distinctions within an approved bank. Tags can select information for a query, but they do not restrict access. Check the installed tools' tag-filter behavior before relying on it, including whether untagged records are included. Preserve the add-on's source, harness, and knowledge routing, and offer additional tags when they serve the project's retrieval needs.

Choose the boundary for the knowledge the owner wants shared. Investigate performance separately; do not split or merge banks as an unmeasured latency remedy.

## Keep the bank identity stable

Read the bank ID recorded in `PROJECT.md` before configuring a host. Use that ID for every intended session, host, and checkout of this project. Update machine-specific `mapPathToBank` entries when the project moves or is connected on another computer; keep the recorded bank ID. Verify that linked worktrees resolve to it. Do not derive the bank from a session ID.

Before a write can create a bank, confirm that the resolved ID is the owner's intended destination. When retrieval is empty or the bank is missing, inspect routing, filters, and the existing records before proposing a new bank. Missing context does not establish a need for a replacement bank.

## Change the memory boundary

Routing to a different underlying bank changes where future writes and reads go; it does not move the old records. Verify the resolved bank identity before treating an ID change as migration. Treat a split, merge, or change of bank as separate migration work. Show the source, destination, sharing effects, treatment of existing records, and verification before applying an owner-approved migration. Preserve the old records until their handling is approved and verified.

## Verify and record the result

Record the bank ID, what its memory covers, who or what shares it, and any approved tag convention under `PROJECT.md`'s "Toolkit settings", as [the project additions](what-hindsight-adds-to-a-project.md) describe. Read back the effective route from each intended host and representative checkout, including a linked worktree when the project uses one. Verify retrieval of approved existing evidence or an agreed sample before calling setup complete.

For an existing project, reuse recorded choices. A new computer or checkout needs a connection to the same bank; it does not require a new memory store. Report unresolved routing or access problems without moving records or changing the approved bank.

## Sources and version checks

These sources were reviewed on 2026-10-11. Read the relevant current documentation when configuring routing or filters, and verify support in the installed server and add-on.

| Source | What it establishes |
| --- | --- |
| [Hindsight bank-strategy article](https://hindsight.vectorize.io/blog/2026/07/16/bank-strategy-agent-memory) | Banks set recall boundaries; tags organize information within a bank. Session-scoped or unstable bank IDs fragment memory. |
| [Memory-banks API](https://hindsight.vectorize.io/developer/api/memory-banks) | Banks are separate stores. Current documentation says writes create missing banks; reads of a missing bank return `404`. This qualifies the article's broader first-use description. |
| [Coding Agents bank resolution](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md#bank-resolution) | `mapPathToBank` takes precedence, its longest matching prefix wins, and linked worktrees inherit their main checkout's mapping. |
| [Recall tag filters](https://hindsight.vectorize.io/developer/api/recall#tags) | Non-empty `any` and `all` filters include untagged records. Strict modes exclude them for a non-empty filter; an empty tag list ordinarily means no filter. |
| [Reflect tag filters](https://hindsight.vectorize.io/developer/api/reflect#tags) | Filtering also applies to reflection. Untagged directives remain global even with strict tag filtering. |
