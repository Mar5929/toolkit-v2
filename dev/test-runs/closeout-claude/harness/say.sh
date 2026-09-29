#!/bin/bash
# usage: say.sh NAME RESUME_FROM_NAME "message"   (resume the session id stored in RESUME_FROM_NAME.sid; "-" for a fresh session)
L=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/closeout2-claude-logs
NAME=$1; FROM=$2; shift 2
printf '%s' "$*" > $L/sessions/$NAME.prompt.txt
if [ "$FROM" = "-" ]; then $L/harness/run.sh $NAME; else $L/harness/run.sh $NAME "$(cat $L/sessions/$FROM.sid)"; fi
echo "== reply =="; sed -n '/^FINAL: /,$p' $L/sessions/$NAME.summary.txt
grep -E '^PERMISSION-DENIALS' $L/sessions/$NAME.summary.txt
