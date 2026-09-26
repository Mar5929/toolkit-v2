# Work-item package.xml template

Create an actual package.xml in the work item's folder under `delivery/deployment/` (named by its work item ID) only when that item changes deployable Salesforce metadata. This file explains the shape and is not a deployable manifest.

## File shape

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>COMPONENT_API_NAME</members>
        <name>METADATA_TYPE</name>
    </types>
    <version>PROJECT_API_VERSION</version>
</Package>
```

Repeat the `types` block for each type and the `members` line for each new or modified component in this work item. Replace every placeholder with verified source and project values; do not deploy this illustrative block.

## Checks before use

- Every member exists in source and in the master manifest.
- The component tracker names this work item's ID for the member.
- This manifest excludes unrelated project components and removals.
