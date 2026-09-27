#!/bin/sh
# Fake Salesforce CLI for the b-salesforce round 2 sample run. It only logs its
# arguments and prints success JSON. It never contacts Salesforce.
LOG=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r2-tools/sf-calls.log
printf '%s\tppid=%s\tcwd=%s\tsf %s\n' "$(date '+%Y-%m-%dT%H:%M:%S')" "$PPID" "$PWD" "$*" >> "$LOG" 2>/dev/null || true
case "$*" in
  "org list"*)
    cat <<'JSON'
{"status":0,"result":{"other":[],"sandboxes":[{"alias":"tkv2-sbx","username":"mike@acme.com.tkv2sbx","orgId":"00DFAKE0000SBX1","instanceUrl":"https://acme--tkv2sbx.sandbox.my.salesforce.com","loginUrl":"https://test.salesforce.com","isSandbox":true,"connectedStatus":"Unknown"}],"nonScratchOrgs":[{"alias":"tkv2-prod","username":"mike@acme.com","orgId":"00DFAKE0000PRD1","instanceUrl":"https://acme.my.salesforce.com","loginUrl":"https://login.salesforce.com","isSandbox":false,"connectedStatus":"Unknown"}],"devHubs":[],"scratchOrgs":[]},"warnings":[]}
JSON
    ;;
  "org display"*)
    case "$*" in
      *tkv2-prod*) echo '{"status":0,"result":{"id":"00DFAKE0000PRD1","apiVersion":"62.0","alias":"tkv2-prod","username":"mike@acme.com","instanceUrl":"https://acme.my.salesforce.com","connectedStatus":"Connected"},"warnings":[]}' ;;
      *) echo '{"status":0,"result":{"id":"00DFAKE0000SBX1","apiVersion":"62.0","alias":"tkv2-sbx","username":"mike@acme.com.tkv2sbx","instanceUrl":"https://acme--tkv2sbx.sandbox.my.salesforce.com","connectedStatus":"Connected"},"warnings":[]}' ;;
    esac ;;
  "sobject describe"*Account*)
    echo '{"status":0,"result":{"name":"Account","label":"Account","custom":false,"fields":[{"name":"Id","type":"id","label":"Account ID"},{"name":"Name","type":"string","label":"Account Name"},{"name":"Type","type":"picklist","label":"Account Type"},{"name":"Industry","type":"picklist","label":"Industry"},{"name":"Rating","type":"picklist","label":"Account Rating","picklistValues":[{"value":"Hot"},{"value":"Warm"},{"value":"Cold"}]},{"name":"OwnerId","type":"reference","label":"Owner ID"},{"name":"Tier__c","type":"picklist","label":"Tier","custom":true,"nillable":true,"defaultValue":null,"inlineHelpText":"Select Gold, Silver, or Bronze to show this account’s sales priority. Leave blank if no tier has been assigned.","picklistValues":[{"value":"Gold","label":"Gold","active":true,"defaultValue":false},{"value":"Silver","label":"Silver","active":true,"defaultValue":false},{"value":"Bronze","label":"Bronze","active":true,"defaultValue":false}],"restrictedPicklist":true}],"recordTypeInfos":[{"name":"Master","master":true,"available":true}]},"warnings":[]}' ;;
  *"data query"*FieldDefinition*)
    echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}' ;;
  *"data query"*Profile*)
    echo '{"status":0,"result":{"records":[{"attributes":{"type":"Profile"},"Id":"00eFAKE00000SM1","Name":"Sales Manager"},{"attributes":{"type":"Profile"},"Id":"00eFAKE00000SA1","Name":"System Administrator"},{"attributes":{"type":"Profile"},"Id":"00eFAKE00000SU1","Name":"Sales User"},{"attributes":{"type":"Profile"},"Id":"00eFAKE00000RO1","Name":"Read Only"}],"totalSize":4,"done":true},"warnings":[]}' ;;
  *"data query"*Layout*)
    echo '{"status":0,"result":{"records":[{"attributes":{"type":"Layout"},"Id":"00hFAKE0000AL01","Name":"Account Layout","TableEnumOrId":"Account"}],"totalSize":1,"done":true},"warnings":[]}' ;;
  *"data query"*FieldPermissions*Tier__c*)
    echo '{"status":0,"result":{"records":[{"Parent":{"Profile":{"Name":"Sales Manager"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"System Administrator"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"Sales User"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":false},{"Parent":{"Profile":{"Name":"Read Only"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":false}],"totalSize":4,"done":true},"warnings":[]}' ;;
  *"data query"*PermissionSet*|*"data query"*FieldPermissions*)
    echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}' ;;
  *"data query"*)
    echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}' ;;
  *"project retrieve start"*Layout*Account*)
    if [ -f sfdx-project.json ]; then
      mkdir -p "force-app/main/default/layouts" && cp "/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r2-tools/account-layout.xml" "force-app/main/default/layouts/Account-Account Layout.layout-meta.xml"
    fi
    echo '{"status":0,"result":{"done":true,"status":"Succeeded","success":true,"files":[{"fullName":"Account-Account Layout","type":"Layout","state":"Created","filePath":"force-app/main/default/layouts/Account-Account Layout.layout-meta.xml"}]},"warnings":[]}' ;;
  *"data create record"*)
    echo '{"status":0,"result":{"id":"001FAKE0000TEST1","success":true,"errors":[]},"warnings":[]}' ;;
  *"data update record"*|*"data delete record"*)
    echo '{"status":0,"result":{"id":"001FAKE0000TEST1","success":true,"errors":[]},"warnings":[]}' ;;
  *"data get record"*)
    echo '{"status":0,"result":{"attributes":{"type":"Account"},"Id":"001FAKE0000TEST1","Name":"Tier Test","Tier__c":null},"warnings":[]}' ;;
  "config get target-org"*)
    echo '{"status":0,"result":[{"name":"target-org","success":true}],"warnings":[]}' ;;
  "--version"|"version"*)
    echo "@salesforce/cli/2.99.0-fake darwin-arm64 node-v25.8.1" ;;
  *"deploy validate"*)
    echo '{"status":0,"result":{"id":"0AfFAKE000VALID2","status":"Succeeded","success":true,"checkOnly":true,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0,"numberTestErrors":0},"warnings":[]}' ;;
  *"deploy start"*)
    echo '{"status":0,"result":{"id":"0AfFAKE000DEPLOY2","status":"Succeeded","success":true,"checkOnly":false,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0},"warnings":[]}' ;;
  *)
    echo '{"status":0,"result":{"status":"Succeeded","success":true,"done":true},"warnings":[]}' ;;
esac
exit 0
