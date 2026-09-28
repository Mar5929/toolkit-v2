#!/bin/bash
# Usage: wait.sh <label> [chars]: wait for a session to finish, then show it.
T=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-salesforce-r2-tools
for i in $(seq 1 115); do [ -f $T/logs/$1.summary.txt ] && break; sleep 5; done
if [ ! -f $T/logs/$1.summary.txt ]; then echo "STILL RUNNING"; exit 0; fi
cat $T/logs/$1.exit
$T/show.sh $1 ${2:-1200}
