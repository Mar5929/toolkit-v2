# How the owner works with agents

This file records what Mike, the owner, asks agents to do in his real projects. It is evidence for decisions about Toolkit V2. Read it before you propose a change to how a project runs, so that the change fits the work the owner does.

Each section covers one project. An agent read the owner's own messages in that project's Claude Code session files and sorted them. No plugin ships this file, and setup never copies it into a project.

## How to read and add to this file

- A quotation is the owner's own message, word for word. The owner dictates most messages, so a quotation may hold a misheard or missing word.
- People other than the owner are named by role only, in square brackets, such as "[the client contact]". Apart from the owner's first name, the file holds no person's name, no email address, and no record ID, because this repository is not the client's. A project is called by the name the owner uses for it.
- A count marked "about" comes from a word search of the messages. Every other count comes from reading the messages.
- To add a project, add one section with the same headings, in the same order as the two project sections below. A project section may also describe a session that the owner named as an example.

## What the owner wants from the agent, in his words

The owner said these things on 2026-10-07, after he read the findings below.

- On the feeling he is after: "My whole point for showing you the Davis project was just that it feels very seamless. While it may be inefficient from a token perspective, it just seems like the agent is very proactive, knows my workflow, and works with me very seamlessly. That's what I'm after, and that's what I'm trying to get to."
- On the agent's role: "the agent understands my process and is just making sure that everything is put in the right spot, because that's its role, right? It's like the keeper of all this knowledge and stuff, so that I never have to think about that, right? I'm just sort of working on the things that actually matter, like making the decisions about the project and features and all that stuff, and sort of asking the agent to run tasks and sort of orchestrating the agent."
- On how the toolkit's instructions are written: "We're really just trying to define what our process is and make sure the agent follows our process, rather than trying to define the behavior of an agent."
- On instructions for single situations: "if we start defining the process for what happens after I send a transcript, what happens after I send this, after I say we have a call, or what happens in all of these really, really granular scenarios, then the agent is going to get tripped up, not start doing things, or start getting confused." And: "We just need general rules about how it should maintain the project."
- On a limit on how many memory records the agent may save without asking: "I don't think we need a limit."

## Davis (ongoing Salesforce support for one client)

What was read: the owner's own messages in all 17 session files of the Davis project, 2026-09-01 to 2026-10-07. That is about 150 messages, including interruptions and commands. Two of the 17 files are a request that was started and stopped within seconds.

Almost every session starts the same way: an email from [the client contact], or a meeting transcript, pasted in with a request. Most requests are finished within one hour.

### The kinds of requests

| Kind of request | Sessions | Example messages, in the owner's words |
| --- | --- | --- |
| A data job: match a list from the client against the org, and make a file the owner loads into production or sends to the client. | 4 | "Can you find that list of 1700 something contacts and populate these fields (give me the csv file)?" / "The output, the final output, should be a CSV file for a bulk upload that has the Salesforce 18-digit ID, the CRD, and then the new email field." / "I'm going to load the files in production now. Can you give me the steps to load them?" |
| A question about how the org works today, or whether a number is right. | 5 | "Can you double check the tier 2 rias and see if the activity rollups that count last phone visit and zoom are accurate?" / "If I populate these emails and I load them in your file, will our flow just overwrite them to blank?" / "[The client contact] asked if there is anything we need to do for this", followed by a pasted notice from Salesforce. |
| A small change to the org: a report, two formula fields, a checkbox with its settings, an email template. | 5 | "Clone the report and create that cloned sales cycle report here." / "deploy it to FullCopy once validation passes" / "Can you please add the email code to the other button on the template too, please?" |
| A message to another person. | 6 | "Can you draft a note back to [the client contact] on how many get an email?" / "Okay, can you draft a humanized response to [a client colleague], please?" / "Give me the email contents for the follow up emails I need to send to [the client contact]" |
| Keeping the list of open work: a transcript comes in, and the work items and a spreadsheet for the client come out. | 3 | "List out all of the outstanding work items that we have with Davis." / "ok so can you make sure everything has representation as a local work item. WI-004 remains under [the owner's manager] but I need everything tracked on my end" / "Can you create an Excel spreadsheet of these, please?" |
| Memory: save a finding, find an earlier one, or say what was saved. | 7 | "log all that to memory" / "What did you write to memory? I'm curious." / "Make sure the current state memory is fully up to date on all these open items." |
| Running other agents. | 4 | "I'd like you to have an Opus agent execute it, and then let me know." / "have opus do research" / "Can you have an Opus agent scan through memory to figure out how we do this?" |

### What the owner had to repeat

- **Play the request back before doing anything.** The owner asked for this in 5 sessions. "I'd like you to just repeat back to me in very simple terms what I'm asking you to do." (2026-09-01) / "Before you actually do anything, just read back to me what you think you understand the goal is here, and then we'll continue." (09-07) / "Show me the plan, what you're going to do, before you actually execute it, and keep it simple, like numbered steps." (09-14) / "Interview me to make sure that you fully understand the requirements first." (09-15)
- **Humanize anything that goes to another person.** The owner asked for this by hand in 6 sessions. "Make it a lot more human-sounding and casual." (09-01) / "Did you use the humanizer skill?" (09-24) / "make sure you use the humanizer skill on all of the" (10-06)
- **Check the number or the finding again.** The owner asked for this in 4 sessions. "I don't think that is right. didn't we make sure that a while ago that certain territories were no longer valid?" (09-16) / "Are you positive that there's no formula field, greeting, nickname, or anything in prod?" (09-17) / "are you aggregating based on the raw activity and email data? Are you sure you are getting the right numbers?" (10-05) / "can you make sure you are running that query correctly? are you filtering things out? could you dump it to excel and run analysis there?" (10-06)
- **We have done this before; look it up.** "We've done a very similar process before ... We've done this a number of times for other labels." (09-22) / "can you double check and also check project memory and work items to see if we have run into this before or how processes run?" (09-24) The job in the first quotation is a repeated one: a label, then a checkbox field, then a settings record, then a batch run by hand.
- **Subagents run on Opus.** The owner said this on 09-14, 09-18, and 09-22, and then made it a rule.
- **One file per work item.** "Under each work item - I want you to just have a work-item.md with the claude toolkit's latest layout. All the requirements, roadmap, tasks, open questions, etc. should live in there." (09-24)
- **Deploy with the relevant tests.** "Remember, it should always be run with relevant tests, right?" (09-22)
- **No trace of AI in what is delivered.** "there is no indication that AI touched this code right?" (09-17)

### Where the owner said it was too slow

The owner said so in five messages, in 3 sessions: "hurry up please" (twice, 2026-09-16) / "Dude, what is going on? This is taking such a long time." (09-22) / "What's the status" (09-22) / "been running for 25 minutes. What is going on? This is taking way too long." (09-22)

Two causes showed up in the sessions: a helper agent that ran long with no status, and a search through all of memory for the steps of a job that had been done before.

### Safety rules the owner asked to loosen

None. The owner ran every production load and every production deploy himself, and reported it in one word: "loaded", "done", "deployed". He asked once for the choice: "can you create a package that I can deploy to prod, or can I give you the go-ahead command to deploy?" (09-22)

### Where files ended up

- Files the client sent: a folder named for the sender, or an `inputs/` folder, inside the work item's folder.
- Records pulled from the org to work with: a `build/` or `input/` folder inside the work item's folder. One pull was every contact in production, 528,088 rows, to match a list of 1,752 rows.
- Results: a folder inside the work item's folder with a different name each time (`output/`, `outputs/`, `output-v2/`, `analysis-2026-10/`).
- About 40 files went to a session's temporary folder, which is deleted.
- The file that was loaded: copied to a folder for that load under the project's data folder, with a backup of the old values beside it.
- The spreadsheet of open work for the client: a `status-reports/` folder, one file per date.
- The owner later asked to see the working files: "Can you show me exactly what you checked when you say there have only been 4 phone calls on 2 advisors or 0 Zooms?" (10-06)

### A session the owner named as the example to follow

On 2026-10-07 the owner pointed to one Davis session, about a call with a data vendor, and said: "see how seemlessly (idk how accurately but it was seemless) the agent in [that session] kept memory up to date? That is how the toolkitv2 projects should function - I'm just giving you an example."

What happened in that session:

- The owner said only that the meeting was done and that the transcript was in his meeting recorder. He said nothing about memory.
- The agent read both parts of the transcript, wrote the call notes, and updated three work items.
- In the same turn the agent started a separate helper agent for memory and kept working. It told the owner in one line: "Project memory is being updated in the background."
- The helper asked the owner nothing. It added four people, rewrote two records with the state after the call first, and updated the page of what is true now.
- The helper also found two records that still said they waited on the call, and corrected them. It told the main agent about a work item whose next step was out of date, and the main agent corrected that.
- The owner got one line at the end, and one warning that the memory index was getting large.
- The helper ran for about 10 minutes and used about 200,000 tokens. The owner on cost: "I'm not worried about tokens."

Two things the session did not prove. The recording gave wrong speaker names in places, and one person's name had a spelling that nobody had confirmed. The project also ran on a long rule that listed about 30 kinds of event that start the helper, so the session does not show that a short rule gives the same result.

### How this fits Toolkit V2

This comparison was made against the starter files on 2026-10-07, and not in a live project.

- Toolkit V2 already handles these parts of the work as well as the project did, or better: the email or transcript filed in `sources/` and quoted word for word in the work item; the single work item file; `sf-data-change` for a load the owner runs; the org guards that keep the agent out of production; the rule that humanizes text sent to another person; project tasks that name who owes what; a repeated job with its steps and a row for each run; a finding about the org written to `reference/current-system/` before the reply.
- Did not fit, and changed in version 0.9.8: a small request went through the full process with six stops for the owner's yes, and it now takes a short path; a support project had no phases, and it now gets one phase, "P01 — Ongoing support"; working files had no named place, and they now go in `working-files/`.
- Handled outside the starter, by the owner's choice: which tests run on a Salesforce deploy (Salesforce's own skills), and ClickUp as a place for work items (maybe a skill later).

## Dragonfly (Salesforce org merge: two existing orgs into one new org)

What was read: the owner's own messages in all 43 session files of the Dragonfly project, 2026-09-04 to 2026-10-07. That is 718 messages.

### The kinds of requests

| Kind of request | Sessions | Example messages, in the owner's words |
| --- | --- | --- |
| Security and permissions design for the new org. Meeting transcripts come in; a client workbook, a design, and then the build come out. More than half of all messages. | about 10 | "I just added two new transcripts from our long meeting earlier today about the security and permissions architecture." / "Please make sure the excel file object visibility and record visibility columns are fully up to date based on the transcript." / "What are the outstanding questions we need [the two client leads] to answer in order to build out this package?" |
| DevOps Center problems: a failed promotion, a failed back sync, a record type that had to be removed from every org and branch, a merge conflict. About a quarter of all messages. | about 13 | "Getting these deploy errors for the items in the pipeline." / "I tried to back deploy, and it said that the back deployment could not sync with the next pipeline stage, but now in the UI, it's saying the sync status is in sync." / "How do I fix this?" |
| Toolkit upkeep inside the project: pull the latest toolkit, the output style, a hook, a plugin bug. | about 12 | "Did we get the latest output style(s) from the toolkit?" / "I want to do a toolkit sync where the toolkit version wins when they differ." |
| Production support questions from the client's team. | 3 | "[A developer] is getting this error in blue production." / "got this email from [the client's IT lead]" followed by the pasted email, then "Please write me a draft email." |
| Preparing for a meeting, and material to show people. | inside the design sessions | "I have a meeting today in about an hour. Can you prep me for that meeting, please?" / "Can you give me one that I could put on maybe one or two PowerPoint slides that could be presented to a C-suite team?" / "help me come up with like a simple like bulleted demo script" |
| Running other agents and other sessions. | in most long sessions | "spawn some Opus agents to..." / "Can you spawn another chat session to handle that?" / "tell the other chat that" |

### What the owner had to repeat

- **Write plainly and keep it short.** The owner said this in about 22 messages, in 7 sessions. "I don't know what you mean when you say the humanized patch was written against the old master." / "Your responses are so long." / "Can you explain to me like I'm five?" / "the file cannot seem like it's being written by AI."
- **Humanize anything that goes to another person.** The owner asked for this by hand on 2026-09-08, 09-14, 09-17, 09-18, and 09-22, and then made it a project rule on 09-18: "I want everything in this project, any output that's going to be sent to someone else ... to be humanized."
- **Keep track of it, and tell me where it is.** The owner said this in about 21 messages. "Where did you put everything? Everything needs to be in a simple place." / "Do you know which one is the most up-to-date file, because I feel like you don't?" / "This needs a work item, and it needs tasks associated with the work item. ... It shouldn't just live in the session."
- **One file per work item.** The owner asked for this on 2026-09-18 and again on 09-23: "I just want one place, one file, where all the requirements, decisions, roadmap of the work item, and tasks are all stored."
- **A fact already in memory.** "We've already been through this like 10 times, and you're not using memory efficiently." The fact is that a record type cannot be deleted through the pipeline; it must be deleted by hand.
- **Check the transcripts before asking me.** "Are any of these decisions answered in any of the transcripts or any of the past meetings?"
- **Subagents run on Opus.** The owner said this on 2026-09-09, 09-15, and 09-17, and then made it a rule.
- **Use the official Salesforce skills.** The owner said this on 2026-10-02 (twice) and 10-06.
- **Which sandbox to build in.** The owner changed it three times (09-23, 10-05, 10-06). Each time the owner also had to ask for the project guide and memory to be updated.

### Where the owner said it was too slow

The owner said so in about 20 messages, in 8 sessions. These are examples: "It's been 45 minutes since you last responded." / "Why is it taking 14 minutes to build a skill?" / "Can you just commit? It takes 2 seconds to commit and push it." / "It's been 27 minutes."

About 80 messages were only an approval: "yes", "go", "approve", "yes, run it".

Three causes showed up in the sessions: an approval for every sandbox deploy, a work tracker program that failed on Windows and let only one work item be changed at a time on the main branch, and helper agents that ran long with no status.

### Safety rules the owner asked to loosen

The owner asked for this in 6 sessions.

- Sandbox deploys without an approval each time: "You need to be able to deploy to sandboxes without me having to approve every deploy." (2026-10-06; also 09-22 and 10-05)
- Deleting metadata from a sandbox: "I'm giving you permission, so there should be an explicit override for this." (09-18; also 09-23)
- Deploying custom profiles, which the new org needs: "For this, I need you to bypass the rule and deploy the profiles." (09-24)
- Cleaning up DevOps Center records, which are data in the new org's production. Toolkit V2 hands every production data change to the owner. Here the owner let the agent run it after his approval: "show me and get my approval before executing." (09-15)

On 2026-10-07 the owner said of the four rules above: "I should just be able to disable these in a specific session." He agreed that this does not cover a production deploy.

### Where files ended up

- Meeting transcripts (`.docx`): in a `meetings/` folder inside the work item.
- The client workbook: inside the work item folder. During the work it had about four names (a plain name, "(1)", "V2", "V2-humanized"), a "for approval" copy, and a backup before each change in an `archive/` folder. The owner also edited a copy in his Downloads folder during two meetings, and the agent merged it back.
- One Python patch script per change to the workbook, about eight in all, inside the work item folder.
- Review reports from helper agents: an `analysis/` folder inside the work item. Several first went to a temporary folder, and one set of build scripts was lost from there.
- Meeting agendas: first a text file, then a subfolder, then a tab in the workbook.
- Decisions: a separate decision log with more than 400 entries, later pointed to from the single work item file.
- The design: in the work item until it ships, then in the solution architecture folder (the owner's choice, 2026-09-23).
- Two more things the project holds: the client's pipeline repository inside the project folder, and metadata retrieved from the two existing orgs, kept for reading only.

### How this fits Toolkit V2

This comparison was made against the starter files on 2026-10-07, and not in a live project.

- Toolkit V2 already handles these parts of the work as well as the project did, or better: transcripts in `sources/`; the single work item file; the design beside the work item and then `system/security-model.md`; the two writing rules; the question before a save to memory, which fits on one line ("Save to memory: <one line>?"); `publish-docs` for documents; the component tracker and the deployment record; no tracker program.
- Did not fit, and changed in version 0.9.8: working files had no named place, and the workbook drafts, earlier copies of the workbook, patch scripts, helper agents' reports, and meeting agendas now go in `working-files/`; a small request went through six stops for the owner's yes, and it now takes a short path.
- Does not fit yet: the Salesforce safety rules above. A way to turn the sandbox checks off for one session is being built as separate work.
- Handled by a setup choice or by the project itself: a second computer (Notion or GitHub for work items, Notion or Hindsight for memory); DevOps Center (Salesforce's own skills); the second repository and the two read-only orgs (the project's own guide).
