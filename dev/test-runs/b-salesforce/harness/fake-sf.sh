#!/bin/sh
# Fake Salesforce CLI for the b-salesforce round 3 sample run. It only logs its
# arguments and prints success JSON. It never contacts Salesforce.
# It remembers which org got a real "deploy start" (state folder), so a
# describe shows Tier__c only in an org it was deployed to.
T=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r3-tools
LOG=$T/sf-calls.log
ST=$T/org-state
printf '%s\tppid=%s\tcwd=%s\tsf %s\n' "$(date '+%Y-%m-%dT%H:%M:%S')" "$PPID" "$PWD" "$*" >> "$LOG" 2>/dev/null || true
org=sbx
case "$*" in *tkv2-prod*) org=prod ;; esac
case " $* " in *" --help "*|*" -h "*) echo "fake sf help for: $*"; exit 0 ;; esac
tier_field='{"name":"Tier__c","type":"picklist","label":"Tier","custom":true,"nillable":true,"defaultValue":null,"inlineHelpText":"Select Gold, Silver, or Bronze.","picklistValues":[{"value":"Gold","label":"Gold","active":true,"defaultValue":false},{"value":"Silver","label":"Silver","active":true,"defaultValue":false},{"value":"Bronze","label":"Bronze","active":true,"defaultValue":false}],"restrictedPicklist":true}'
case "$*" in
  "org list"*)
    cat <<'JSON'
{"status":0,"result":{"other":[],"sandboxes":[{"alias":"tkv2-sbx","username":"mike@acme.com.tkv2sbx","orgId":"00DFAKE0000SBX1","instanceUrl":"https://acme--tkv2sbx.sandbox.my.salesforce.com","loginUrl":"https://test.salesforce.com","isSandbox":true,"connectedStatus":"Unknown"}],"nonScratchOrgs":[{"alias":"tkv2-prod","username":"mike@acme.com","orgId":"00DFAKE0000PRD1","instanceUrl":"https://acme.my.salesforce.com","loginUrl":"https://login.salesforce.com","isSandbox":false,"connectedStatus":"Unknown"}],"devHubs":[],"scratchOrgs":[]},"warnings":[]}
JSON
    ;;
  "org display"*)
    if [ $org = prod ]; then echo '{"status":0,"result":{"id":"00DFAKE0000PRD1","apiVersion":"62.0","alias":"tkv2-prod","username":"mike@acme.com","instanceUrl":"https://acme.my.salesforce.com","connectedStatus":"Connected"},"warnings":[]}'
    else echo '{"status":0,"result":{"id":"00DFAKE0000SBX1","apiVersion":"62.0","alias":"tkv2-sbx","username":"mike@acme.com.tkv2sbx","instanceUrl":"https://acme--tkv2sbx.sandbox.my.salesforce.com","connectedStatus":"Connected"},"warnings":[]}'; fi ;;
  "sobject describe"*Account*)
    extra=""; [ -f "$ST/$org.deployed" ] && extra=",$tier_field"
    echo '{"status":0,"result":{"name":"Account","label":"Account","custom":false,"fields":[{"name":"Id","type":"id","label":"Account ID"},{"name":"Name","type":"string","label":"Account Name"},{"name":"Type","type":"picklist","label":"Account Type"},{"name":"Industry","type":"picklist","label":"Industry"},{"name":"Rating","type":"picklist","label":"Account Rating","picklistValues":[{"value":"Hot"},{"value":"Warm"},{"value":"Cold"}]},{"name":"OwnerId","type":"reference","label":"Owner ID"}'"$extra"'],"recordTypeInfos":[{"name":"Master","master":true,"available":true}]},"warnings":[]}' ;;
  *"data query"*FieldPermissions*Tier__c*)
    if [ -f "$ST/$org.fls" ]; then
      echo '{"status":0,"result":{"records":[{"Parent":{"Profile":{"Name":"Sales Manager"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"System Administrator"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"Sales User"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":false},{"Parent":{"Profile":{"Name":"Read Only"}},"Field":"Account.Tier__c","PermissionsRead":true,"PermissionsEdit":false}],"totalSize":4,"done":true},"warnings":[]}'
    else echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}'; fi ;;
  *"data query"*CustomField*Tier*)
    if [ -f "$ST/$org.deployed" ]; then echo '{"status":0,"result":{"records":[{"attributes":{"type":"CustomField"},"Id":"00NFAKE0000TIER1","DeveloperName":"Tier","TableEnumOrId":"Account"}],"totalSize":1,"done":true},"warnings":[]}'
    else echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}'; fi ;;
  *"data query"*ProfileLayout*)
    echo '{"status":0,"result":{"records":[{"ProfileId":"00eFAKE00000SM1","Profile":{"Name":"Sales Manager"},"LayoutId":"00hFAKE0000AL01","Layout":{"Name":"Account Layout"},"RecordTypeId":null},{"ProfileId":"00eFAKE00000SA1","Profile":{"Name":"System Administrator"},"LayoutId":"00hFAKE0000AL01","Layout":{"Name":"Account Layout"},"RecordTypeId":null},{"ProfileId":"00eFAKE00000SU1","Profile":{"Name":"Sales User"},"LayoutId":"00hFAKE0000AL01","Layout":{"Name":"Account Layout"},"RecordTypeId":null},{"ProfileId":"00eFAKE00000RO1","Profile":{"Name":"Read Only"},"LayoutId":"00hFAKE0000AL01","Layout":{"Name":"Account Layout"},"RecordTypeId":null}],"totalSize":4,"done":true},"warnings":[]}' ;;
  *"data query"*ObjectPermissions*)
    echo '{"status":0,"result":{"records":[{"Parent":{"Profile":{"Name":"Sales Manager"}},"SobjectType":"Account","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"System Administrator"}},"SobjectType":"Account","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"Sales User"}},"SobjectType":"Account","PermissionsRead":true,"PermissionsEdit":true},{"Parent":{"Profile":{"Name":"Read Only"}},"SobjectType":"Account","PermissionsRead":true,"PermissionsEdit":false}],"totalSize":4,"done":true},"warnings":[]}' ;;
  *"data query"*FROM\ User*|*"data query"*"FROM User"*)
    echo '{"status":0,"result":{"records":[{"Id":"005FAKE000000SM","Name":"Sam Manager","Profile":{"Name":"Sales Manager"},"IsActive":true},{"Id":"005FAKE000000AD","Name":"Mike Admin","Profile":{"Name":"System Administrator"},"IsActive":true},{"Id":"005FAKE000000SU","Name":"Sue Seller","Profile":{"Name":"Sales User"},"IsActive":true},{"Id":"005FAKE000000RO","Name":"Rob Reader","Profile":{"Name":"Read Only"},"IsActive":true}],"totalSize":4,"done":true},"warnings":[]}' ;;
  *"data query"*FlexiPage*)
    echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}' ;;
  *"data query"*Profile*)
    echo '{"status":0,"result":{"records":[{"attributes":{"type":"Profile"},"Id":"00eFAKE00000SM1","Name":"Sales Manager"},{"attributes":{"type":"Profile"},"Id":"00eFAKE00000SA1","Name":"System Administrator"},{"attributes":{"type":"Profile"},"Id":"00eFAKE00000SU1","Name":"Sales User"},{"attributes":{"type":"Profile"},"Id":"00eFAKE00000RO1","Name":"Read Only"}],"totalSize":4,"done":true},"warnings":[]}' ;;
  *"data query"*Layout*)
    echo '{"status":0,"result":{"records":[{"attributes":{"type":"Layout"},"Id":"00hFAKE0000AL01","Name":"Account Layout","TableEnumOrId":"Account"}],"totalSize":1,"done":true},"warnings":[]}' ;;
  *"data query"*)
    echo '{"status":0,"result":{"records":[],"totalSize":0,"done":true},"warnings":[]}' ;;
  *"project retrieve start"*)
    dest="force-app/main/default"
    case "$*" in *--target-metadata-dir*|*" -t "*) dest="" ;; esac
    case "$*" in *Layout*Account*)
      src="$T/account-layout.xml"; [ -f "$ST/$org.layout" ] && src="$T/account-layout-tier.xml"
      if [ -n "$dest" ] && [ -f sfdx-project.json ]; then mkdir -p "$dest/layouts" && cp "$src" "$dest/layouts/Account-Account Layout.layout-meta.xml"; fi ;;
    esac
    echo '{"status":0,"result":{"done":true,"status":"Succeeded","success":true,"files":[{"fullName":"Account-Account Layout","type":"Layout","state":"Created","filePath":"force-app/main/default/layouts/Account-Account Layout.layout-meta.xml"}]},"warnings":[]}' ;;
  *"data create record"*)
    echo '{"status":0,"result":{"id":"001FAKE0000TEST1","success":true,"errors":[]},"warnings":[]}' ;;
  *"data update record"*|*"data delete record"*)
    echo '{"status":0,"result":{"id":"001FAKE0000TEST1","success":true,"errors":[]},"warnings":[]}' ;;
  *"data get record"*)
    echo '{"status":0,"result":{"attributes":{"type":"Account"},"Id":"001FAKE0000TEST1","Name":"Tier Test","Tier__c":null},"warnings":[]}' ;;
  "config get"*)
    echo '{"status":0,"result":[{"name":"target-org","success":true}],"warnings":[]}' ;;
  "--version"|"version"*)
    echo "@salesforce/cli/2.142.7 darwin-arm64 node-v22.23.0" ;;
  *"deploy validate"*|*"deploy start"*--dry-run*)
    echo '{"status":0,"result":{"id":"0AfFAKE000VALID3","status":"Succeeded","success":true,"checkOnly":true,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0,"numberTestErrors":0},"warnings":[]}' ;;
  *"deploy start"*)
    mkdir -p "$ST"; date '+%Y-%m-%dT%H:%M:%S' >> "$ST/$org.deployed"
    case "$*" in *WI-002*|*Layout*) date >> "$ST/$org.layout" ;; esac
    echo '{"status":0,"result":{"id":"0AfFAKE000DEPLOY3","status":"Succeeded","success":true,"checkOnly":false,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0},"warnings":[]}' ;;
  *)
    echo '{"status":0,"result":{"status":"Succeeded","success":true,"done":true},"warnings":[]}' ;;
esac
exit 0
