# Project Rules

## Code Style
- Prefer self-explanatory code over comments — no inline comments or JSDoc descriptions
- Use descriptive function names instead of doc comments

## API Layer
- All API calls must use `$lib/api/` modules with result pattern `{ data, error }`
- No inline `fetch()` in components or pages — always use the API module
- New API methods go in `src/lib/api/`, export from `index.js`

## Data Fetching
- Use stores in `stores/global.js` for metadata (custom entities, option sets, forms, type config)
- Ensure cached data with `ensure*()` functions before using
- Pass store values via `$storeName` auto-subscription or `get(storeName)`

## OData
- Use `odata-query` library (`buildQuery` from `odata-query`) for filter construction
- Always use `$` prefixed OData query options (`$filter`, `$select`, `$expand`, `$top`, `$skip`, `$orderby`)

## Navigation Properties
- Single lookup (FK field): navigation property name is `{FieldName}_Etn` (e.g. field `Test2Id` → nav prop `Test2Id_Etn`)
- Collection (one-to-many): navigation property name is `{ConstraintName}_EtnColl` (e.g. constraint `Test` → nav prop `Test_EtnColl`)
- Always include `$select=id,name` when expanding a single lookup to get the display name and link target

## Forms
- The `/Open` route resolves entity/form navigation: `/Open?entity=Name&id=Id&form=FormId`
- For DataTable, name field links use `/Open?entity=EntityName&id=RowId`
- For DataTable, lookup field links use `/Open?entity=TargetEntity&id=FieldValue`

## Component Conventions
- Use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, `$props`, `$bindable`)
- Use TypeScript via JSDoc annotations
