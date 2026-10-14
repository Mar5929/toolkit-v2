# Recording the owner's standing instructions

Use this reference when the owner gives a working instruction or approves turning a lesson into a project rule. Keep standing instructions in the rule file so later sessions load them; memory can preserve their context or a pointer.

## The owner's instructions

An instruction from the owner for how the agent works is a rule, and never memory. So is a preference of the owner, and a correction of how the agent works. The owner's own words are the owner's yes.

Write a line that the owner dictates with the steps below alone. Every other change to a rule file follows `.claude/rules/document-clarity-standard.md` and needs the owner's yes first, as the Project map in the root `AGENTS.md` says.

1. Read `.claude/rules/owner-preferences.md` again, right before you change it. Then do the one of these that fits:
   - When a bullet already says the same, add nothing.
   - When a bullet says the opposite, replace it with the owner's new words.
   - Otherwise, add one bullet in the owner's words under the `## ` area that the instruction is about: Replies, Questions, Testing, Git, Work items, Memory, or General. End the bullet with `(<YYYY-MM-DD>, <owner name>, in chat)`. Write one instruction per bullet.
   - When the owner asks to change or remove an instruction, change or remove that bullet.
2. When the owner's words say that the instruction is for every project, add the bullet to the files that the root `AGENTS.md` names for every project, in place of this project's file. The root `AGENTS.md` names those files in the section "Where information goes", in the row for the owner's preference. Clarify the scope only when the owner's words leave it unclear.
3. A request that a problem never happens again, such as "don't let that happen again", is an instruction. Write the bullet as the check or the step that prevents the problem. In the bullet, name the record that explains the problem by its ID: a DEC, a work item, or a memory record.
4. When you inferred an instruction that the owner did not give, get the owner's approval before adding it to the rule file.
5. When `managing-work-items` closes a work item and the owner agreed to keep a lesson from it as a rule, write that rule in the same way. Its bullet ends with the work item's ID in place of "in chat".
