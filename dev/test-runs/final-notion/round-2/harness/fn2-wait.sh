#!/bin/bash
# usage: fn-wait.sh <label> [seconds]: waits for the session to end (default 560 s), then prints the last lines
L=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-notion-r2-logs
end=$((SECONDS+${2:-560}))
until [ -f "$L/$1.done" ] || [ $SECONDS -gt $end ]; do sleep 5; done
/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/fn2-peek.sh "$1" 400 | tail -n 25
