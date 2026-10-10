# Short Term Memory
* Current working state of a project across work items and ai agent sessions. This includes current priorities, upcoming things to be aware of, key deadlines or action items, etc.

# Long Term (Persistent) Memory
* These are the criteria for long term persistent memory that we want in a project:
    (1 AND 2 AND 3)
      1. Lasting project-specific facts, people, terminology, decisions, lessons, events, and constraints that are not already explained by another memory file (we don't want duplicates).
      2. It has lasting significance: losing it would cost a later agent real time or understanding.
      3. It comes from the owner, or from work done together with the owner.

* Long term memory must have these properties associated with them:
	* Created date
	* Modified date
	* Modified by
	* Provenance
	* Supersedes
	* Superseded by
	* Tags
	* Context (255 characters of context about the memory)
	* Source (User said, agent translated, etc.)
	* Type


# Memory Principles the agents must follow
* Memory should not be treated as truth by the ai agent when referenced. Rather it should always be used to enrich reasoning and thinking.
* The agent should always 
* Memory should always be cited when the agent uses it in an answer.