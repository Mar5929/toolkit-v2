#!/bin/zsh
# usage: fch2-memstate.sh <key> <query>
key=$1; q=$2
P=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-hindsight-r2
cd $P
echo "### $(date -u)  key=$key  query='$q'"
echo "--- toolkit memory list --status all"; toolkit memory list --status all
echo "--- toolkit memory get $key"; toolkit memory get $key 2>&1 | head -5; echo "exit=$?"
echo "--- toolkit memory find '$q' --all"; toolkit memory find "$q" --all 2>&1; echo "exit=$?"
echo "--- toolkit brief (memory part)"; toolkit brief 2>&1 | grep -i -A8 'Project memory'
echo "--- grep -c $key .git/toolkit-v2/memory-cache.json"; grep -c "$key" .git/toolkit-v2/memory-cache.json
echo "--- Hindsight bank documents"; curl -s "127.0.0.1:8888/v1/default/banks/greet-cli-final-h2/documents?limit=100" | python3 -c 'import json,sys; d=json.load(sys.stdin); items=d.get("items",d.get("documents",d)); print(len(items), sorted([x.get("id") for x in items]))'
echo "--- GET document $key"; curl -s -o /dev/null -w '%{http_code}\n' "127.0.0.1:8888/v1/default/banks/greet-cli-final-h2/documents/$key"
echo "--- Hindsight recall '$q'"; curl -s -X POST "127.0.0.1:8888/v1/default/banks/greet-cli-final-h2/memories/recall" -H 'content-type: application/json' -d "{\"query\": \"$q\"}" | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("results",[]); print(len(r), "results"); [print(" -", (x.get("document_id") or ""), "|", (x.get("text") or "")[:110].replace("\n"," ")) for x in r[:8]]'
