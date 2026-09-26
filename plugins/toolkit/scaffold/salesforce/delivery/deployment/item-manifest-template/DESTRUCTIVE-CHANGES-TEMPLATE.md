# Destructive changes template

Create destructiveChanges.xml in the work item's folder under `delivery/deployment/` only when that item removes verified components.

## File shape

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>COMPONENT_API_NAME_TO_REMOVE</members>
        <name>METADATA_TYPE</name>
    </types>
    <version>PROJECT_API_VERSION</version>
</Package>
```

Repeat the `types` block for each type and the `members` line for each approved removal. Replace every placeholder with verified component and project values; do not deploy this illustrative block.

## Checks before use

- Each removal is approved, identified in the component tracker, and absent from the work-item package.xml.
- The target org still contains the component before deletion.
- The rollback or recovery approach is written in the release plan.
