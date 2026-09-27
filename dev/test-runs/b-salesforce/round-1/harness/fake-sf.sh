#!/bin/sh
# Fake Salesforce CLI for the b-salesforce sample run. It only logs its
# arguments and prints success JSON. It never contacts Salesforce.
LOG=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1-tools/sf-calls.log
printf '%s\tppid=%s\tcwd=%s\tsf %s\n' "$(date '+%Y-%m-%dT%H:%M:%S')" "$PPID" "$PWD" "$*" >> "$LOG" 2>/dev/null || true
case "$*" in
  "org list"*)
    cat <<'JSON'
{"status":0,"result":{"other":[],"sandboxes":[{"alias":"tkv2-sbx","username":"mike@acme.com.tkv2sbx","orgId":"00DFAKE0000SBX1","instanceUrl":"https://acme--tkv2sbx.sandbox.my.salesforce.com","loginUrl":"https://test.salesforce.com","isSandbox":true,"connectedStatus":"Unknown"}],"nonScratchOrgs":[{"alias":"tkv2-prod","username":"mike@acme.com","orgId":"00DFAKE0000PRD1","instanceUrl":"https://acme.my.salesforce.com","loginUrl":"https://login.salesforce.com","isSandbox":false,"connectedStatus":"Unknown"}],"devHubs":[],"scratchOrgs":[]},"warnings":[]}
JSON
    ;;
  "config get target-org"*)
    echo '{"status":0,"result":[{"name":"target-org","success":true}],"warnings":[]}' ;;
  "--version"|"version"*)
    echo "@salesforce/cli/2.99.0-fake darwin-arm64 node-v25.8.1" ;;
  *"deploy validate"*)
    echo '{"status":0,"result":{"id":"0AfFAKE000VALID1","status":"Succeeded","success":true,"checkOnly":true,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0,"numberTestErrors":0},"warnings":[]}' ;;
  *)
    echo '{"status":0,"result":{"status":"Succeeded","success":true,"done":true},"warnings":[]}' ;;
esac
exit 0
