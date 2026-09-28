#!/bin/bash
# Print the readable part of a session summary (agent messages and calls, no briefing).
T=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-salesforce-r2-tools
python3 $T/summarize.py $T/logs/$1 | grep -v '^Wall time\|^Script completed\|^Output:$' | awk '/^\[HOOK CONTEXT\]/{h=1} /^\[AGENT\]|^\[CALL|^\[PATCH|^SKILLS|^TOOLKIT/{h=0} !h' | cut -c1-${2:-1500}
