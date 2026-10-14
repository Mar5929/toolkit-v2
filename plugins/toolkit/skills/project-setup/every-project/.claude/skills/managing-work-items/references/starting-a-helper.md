# Starting a helper

Use this procedure when a work-item step calls for a helper. The helper gets a complete standalone brief and reports on its assigned job.

A helper is a separate agent that the main agent starts for one job. Start every helper as a new agent that does not see this session. Never start a helper as a fork, which is a helper that starts with a copy of this session. Honor the project’s model preference; otherwise choose a suitable available model for the task.

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose`.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for the helper's report with `wait_agent`.
- The message to the helper is everything under "Brief for the helper" in the helper's brief file, word for word, and then the list of inputs from that file, filled in. The skill entry lists each helper brief. The helper sees nothing else.
