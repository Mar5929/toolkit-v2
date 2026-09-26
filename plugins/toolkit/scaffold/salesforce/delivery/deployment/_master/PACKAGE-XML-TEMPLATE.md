# Master package.xml template

The actual file is named package.xml. Keep it matching component-tracker.csv, following the `sf-component-tracker` skill. Use the selected Salesforce API version. Do not deploy this explanatory template.

## File shape

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <!-- Reviewed <YYYY-MM-DD>. Members: <count>. Manual-only metadata: <types and reason, or none>. -->
    <types>
        <members>COMPONENT_API_NAME</members>
        <name>METADATA_TYPE</name>
    </types>
    <version>PROJECT_API_VERSION</version>
</Package>
```

Repeat the `types` block for each deployable metadata type and the `members` line for each component of that type. Replace every placeholder with verified tracker and project values; do not deploy this illustrative block.

## Checks before use

- Every CLI-deployable tracker row appears in the master manifest.
- Every master member has a corresponding tracker row.
- Destructive items that are gone from all orgs and source are excluded.
- A full-cutover deploy is explicitly intended; narrow work-item deploys use their own manifest.
