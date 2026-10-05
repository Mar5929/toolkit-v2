---
paths:
  - "ai-external-knowledge/**"
---

# Outside Documentation Goes in ai-external-knowledge

This information is used to help ground the agent in official documentation or research so that it can provide better solutions.

## Where it goes

- Save outside documentation, such as a vendor's docs, an API reference, or a framework guide, as Markdown in `ai-external-knowledge/` at the root of the project. Capturing it is a normal thing to do here, and this folder is its only home.
- Inside `ai-external-knowledge/`, keep one folder per topic.
- The root `INDEX.md` points to the topic folders.

## It is raw source material

A file in this folder is somebody else's writing. It is not the project's truth, and saving it does not make it the project's truth.

- What the project concluded after reading it belongs in the project's own knowledge or documentation, linked back to the source file.
- When a captured document and the project's current truth disagree, the project's truth wins. Say the disagreement out loud instead of quietly picking one.
- Never edit a captured document to make it agree with the project. Keep it as it was published and write the difference down somewhere else.
