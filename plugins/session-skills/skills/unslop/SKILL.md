---
name: unslop
description: >-
  Rewrites text so it no longer reads as machine-written, keeping every fact, and shows the findings before saving. Use when the owner says "unslop this", "this reads like AI wrote it", or "make it sound human", or when the humanize-outbound-text rule applies to text going to another person.
---

# Unslop

Take writing that already exists, name every pattern in it that reads as
machine-written, and hand back a version with those patterns gone and a voice
put back. It runs in two cases: the owner asks for it, or the
`humanize-outbound-text.md` rule applies because the text will be read by
someone other than the owner.

1. **Read the voice rules first** (the Voice line below; in Claude Code the
   project copy is `.claude/output-styles/plain-english.md`). Where a pattern
   below and those rules disagree, the rules win. Say in one line which rule
   you followed.
2. **Scan for the 31 patterns** in the six groups below.
3. **Rewrite.** Keep the meaning and the tone the writing was aiming for. Put a
   human voice back in ("Adding a voice"). Then ask: "What still makes this
   read as machine written?" and fix what the answer names. Outbound text that
   goes out under the owner's name is written in his first person.
4. **Show the findings, then the rewrite.** About 25 finding lines at most.
   Then wait, unless the owner already approved sending it ("Outbound text").
5. **Change the owner's files only after a yes.** Never change numbers, paths,
   names, ids, quotes, or code ("What never changes").

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

It never runs on an ordinary chat reply to the owner. How a chat reply is
written is the output style's job, and the words inside a diagram, chart, or
generated document are the job of the `plain-english-artifacts.md` rule. This
skill cleans up text that is already written.

## What it works on

In this order:

1. A file, or several files, the owner named.
2. Text the owner pasted in the same message.
3. Under the humanize-outbound-text rule: the draft you wrote for another
   person (an email, a chat message, a support case comment, a GitHub issue, a
   pull request description, a client document).
4. Your own last substantial answer in this conversation.

If none of those exist, say so in one line and ask what to clean up. Never guess
at a file. Before starting on anything long, say roughly how much text it is and
get a go-ahead.

## What never changes

- Numbers, counts, dates, money, times.
- File paths, file names, branch names, commands.
- People's real names, company names, product names.
- Record ids, work item ids, org names, object names, field names, and any other
  code identifier, even when the word is on a list below.
  `dd_Universe_Identifier__c` stays spelled that way. Only the prose around it
  changes.
- Quoted material, block quotes, and anything somebody else said. Rewriting a
  quotation changes what a person said.
- Code blocks and their contents.

If a pattern cannot be removed without losing one of these, keep the fact and
leave the pattern. Say in one line which one you left and why.

## Patterns to find and fix

### What the text claims

1. **Puffery.** "pivotal moment", "testament to", "evolving landscape", "setting
   the stage for", "indelible mark", "deeply rooted". Cut it and say what
   happened.
2. **Name-dropping.** Listing outlets, tools, or companies with no context. Pick
   one and say what it actually said or did.
3. **Trailing -ing clauses that add nothing.** "highlighting the need for...",
   "ensuring that...", "reflecting a wider...", "showcasing...", "fostering...".
   Delete them, or replace with a real source and a real fact.
4. **Promotional words.** "nestled", "vibrant", "breathtaking", "groundbreaking",
   "renowned", "stunning", "must-visit", "seamless". Describe the thing plainly.
5. **Attribution with nobody in it.** "Experts believe", "Industry reports
   suggest", "Some critics argue", "It is widely considered". Name the source or
   delete the sentence.
6. **The formula challenge sentence.** "Despite these challenges, X continues to
   thrive." Replace with a specific fact about what happened.
7. **Generic endings.** "The future looks bright." "Only time will tell." State
   a plan, a date, or a number, or end the piece one sentence earlier.

### The words

8. **AI vocabulary.** additionally, crucial, delve, enduring, enhance, fostering,
   garner, interplay, intricate, landscape (as an abstract noun), pivotal,
   showcase, tapestry (as an abstract noun), testament, underscore, vibrant.
   Swap in the plain word.
9. **Long ways to say "is".** "serves as", "stands as", "acts as", "boasts",
   "features". Say "is" or "has".
10. **Plain word swaps.** "utilize" becomes "use". "leverage" becomes "use".
    "facilitate" becomes "help". "numerous" becomes "many". "in the event that"
    becomes "if". "commence" becomes "start". "sufficient" becomes "enough".
11. **Metaphor nouns doing technical work.** substrate, wedge, vector, locus,
    vantage, nexus, primitive (as a noun), harness (as a metaphor), surface (as
    in "API surface"), bedrock, scaffolding (as a metaphor), modality, paradigm,
    gold-plating, ratchet (as a metaphor), evacuate (for moving code), endgame,
    north star, flywheel. "substrate" becomes "base". "wedge in" becomes "add".
    "vector" becomes "way" or "method". "gold-plating" becomes "more than the
    job needs". "ratchet" becomes the real mechanism's name, or "a limit that
    only tightens". "evacuate" becomes "move out". "endgame" becomes "the last
    phase". Pick the concrete word.
12. **Adverbs propping up a weak verb.** "runs quickly" becomes "is fast" or the
    measured number. "significantly improves" becomes the measured difference.
13. **Hedge stacking.** "could potentially possibly be argued that it might"
    becomes "may". One hedge at most, and only where the doubt is real.
14. **Filler openers.** "In order to" becomes "To". "Due to the fact that"
    becomes "Because". "It is important to note that" gets deleted whole.

### The shapes

15. **"Not just X, but Y."** Say the point directly.
16. **Groups of three.** Three examples where the real number is two or five.
    Use the real number.
17. **Synonym cycling.** Protagonist, main character, central figure, and hero
    inside one paragraph. Pick one word and repeat it. Repeating a noun is not a
    mistake.
18. **False ranges.** "from X to Y" where X and Y sit on no shared scale ("from
    scheduling to company culture"). List the items instead.
19. **Sentences the reader has to read twice.** Split it in two or drop the
    clauses. One idea per sentence.
20. **Passive voice with a hidden actor.** Catch "is/are/was/were" plus a past
    participle and name who did it. "queries are validated" becomes "the
    compiler validates queries". Passive is fine only where the actor is unknown
    or does not matter.

### The punctuation and formatting

21. **Em dashes.** Remove them. Use a comma, a colon, or a new sentence.
    Swapping in parentheses or a hyphen used as a dash trades one tell for
    another. If a thought needs separating, end the sentence.
22. **Colons mid-sentence.** A colon before a list or an example is fine. A
    colon as a connector inside a sentence is a crutch. Rewrite so the point
    stands without it.
23. **Bold on everything.** Do not bold every proper noun, acronym, or number.
24. **Inline-header lists.** The tell is a bold label and a colon restating the
    line that follows: "**Performance:** Performance improved by 12%." Turn
    those into prose. A bold lead-in that ends in a period, names the item, and
    is followed by new detail ("**Schema in TypeScript.** Tables live in one
    file.") is fine.
25. **Title Case Headings.** Use sentence case.
26. **Decorative emoji.** Remove from headings and bullets. Emoji carrying real
    meaning in a status table stay.
27. **Curly quotes and curly apostrophes.** Replace with straight ones.

### The assistant leaking through

28. **Chatbot phrases.** "I hope this helps!", "Let me know if you need
    anything", "Of course!", "Certainly!", "Great question", "Found the smoking
    gun". Delete.
29. **Sycophancy.** "You're absolutely right!", "That's a fantastic point."
    Delete and answer directly.
30. **Cutoff and knowledge disclaimers.** "While specific details are limited",
    "As of my last update". Find the fact or cut the sentence.

### Sentences that name a feeling instead of a fact

31. **Say what it does, not how it feels.** "the database stays close at hand",
    "SQL you can read", "types that follow your schema" all name a feeling. The
    fix names the mechanism or a number: "`.toSQL()` returns the exact string
    sent to the database", "a column rename fails the build". Ask what the
    sentence tells the reader to do or know, then write that. If it cannot be
    restated as a concrete instruction, fact, or number, cut it. If the sentence
    could sit unchanged in another project's documents, it says nothing about
    this one. Cut it.

## Adding a voice

Removing patterns is half the job. Text with every tell stripped out and nothing
put back reads as machine-written too, only blander.

- **Have an opinion.** React to a fact instead of listing its pros and cons
  neutrally.
- **Vary the rhythm.** Short sentences. Then a longer one that takes its time
  and earns the length.
- **Let a thing be two things at once.** "Impressive and slightly unsettling"
  beats "impressive."
- **Use "I" where it fits.** First person is not unprofessional. Text sent under
  the owner's name is always in his first person.
- **Allow some mess.** Perfectly parallel structure looks machine-made.
- **Be specific.** Not "this is concerning" but "agents still running at 3am
  with nobody watching."

The limit: adding voice never adds a claim. Do not invent an opinion about a
fact you cannot check, and do not add detail that asserts something the original
did not say.

## What to show the owner

Findings first, one line each, in the order they appear. Name the pattern,
quote the phrase, give the replacement.

```text
Line 4   metaphor noun       "the north star for the team"  ->  "what the team is aiming at"
Line 11  passive voice       "the records are merged"       ->  "the batch job merges the records"
Line 19  inline-header list  "**Cost:** Cost dropped 40%."  ->  "Cost dropped 40%."
Line 26  em dash             two of them                    ->  full stops
```

About 25 lines at most. Past that, group the repeats ("em dashes, 14 places")
and keep single lines for the ones worth seeing.

Then the rewrite: the full text, or for a long file the changed sections with
enough around them to read. Then stop and wait, except where "Outbound text"
below says to go ahead.

## Outbound text

Under the humanize-outbound-text rule, the rewrite is the final version, and
the findings can shrink to one line ("Fixed 6 patterns: 3 em dashes, 2 filler
openers, 1 chatbot phrase"). Whether to wait depends on whether the owner
already approved sending it:

- **Already approved: go ahead.** A pull request description that `work-finish`
  writes goes ahead without a second yes, because `work-finish` opens the pull
  request only after the owner approved the result ("ship it"). Use the final
  text and show it in the report.
- **Not approved: show the final text and wait.** Emails, chat messages,
  support case comments, client documents, and anything else sent or posted
  under the owner's name are not sent or posted without his yes on the final
  text.

## Writing it

- Change a file the owner named only after he says yes. Under the
  humanize-outbound-text rule, the draft is your own text: put the final
  version where it goes (for example the pull request body).
- The owner may take some fixes and not others. Apply those, leave the rest, and
  say in one line what was left.
- Where the owner approved nothing, change nothing. Say so in one line.
- Never rewrite a file the owner did not name.

## When the text is already clean

Say so in one line and stop. Do not invent findings to look useful, and do not
rewrite clean writing into different clean writing.

## Where this came from

The pattern list started from the public `unslop` skill in the `cursor/plugins`
repository, then was adapted: the always-on instruction was dropped so this runs
only when asked or under the humanize-outbound-text rule, the approval and
write-only-on-yes behavior was added, and the rule about deferring to the
project's own style was added so it does not compete with the project's voice.
