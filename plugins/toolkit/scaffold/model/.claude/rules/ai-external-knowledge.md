---
paths:
  - 'ai-external-knowledge/**'
---

# Outside Documentation Goes in ai-external-knowledge

Agents work better when the documentation they need is already in the repository
instead of behind a web search. Pulling a vendor's docs, an API reference, or a
framework guide into the project as Markdown is a normal thing to do here. It has
one home.

This information is used to help ground the agent in official documentation or research so that it can provide better solutions.

## Where it goes

`ai-external-knowledge/` at the root of the project. Inside it, one folder per
topic, holding Markdown files. The root `INDEX.md` points to the topic folders.

## It is raw source material

What sits in that folder is somebody else's writing. It is not the project's
truth, and saving it does not make it the project's truth.

- What the project concluded after reading it belongs in the project's own
  knowledge or documentation, linked back to the source file.
- When a captured document and the project's current truth disagree, the
  project's truth wins. Say the disagreement out loud instead of quietly picking
  one.
- Never edit a captured document to make it agree with the project. Keep it as
  it was published and write the difference down somewhere else.
