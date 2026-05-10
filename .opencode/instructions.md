# SvelteKit Project Rules

## Formatting
- Absolutely no inline comments in any code.
- All JavaScript and TypeScript functions must be documented using standard JSDoc format.

## Architecture
- Use Clean Architecture principles.
- Use Svelte 5 runes ($state, $derived, $effect, $props, $bindable).

## OData Query Layer
- Always use `buildQuery` from `odata-query` for constructing OData URL parameters.
- Never manually build `$filter`, `$select`, `$expand`, `$top`, `$skip`, `$orderby` query strings.
- For collection (array) fields, use `ITEM_ROOT` import from `odata-query` for `any`/`all` lambda operators.
- Import `ITEM_ROOT` as a named export: `import buildQuery, { ITEM_ROOT } from 'odata-query'`.

## API Layer
- All API calls go through `$lib/api/odata.js` using the result pattern `{ data, error }`.
- No inline `fetch()` in components — always use the API module.
- Functions: `fetchEntities`, `fetchEntityById`, `fullTextSearch`, `fetchFirstPage`, `createEntity`, `updateEntity`, `deleteEntity`.

## Dark Mode
- Use `dark:` Tailwind prefixes for custom components in dark mode.
- For third-party components (Svelecte), use `:global(.dark .sv-*)` CSS with Bootstrap CSS variables (`--bs-body-bg`, `--bs-border-color`, `--bs-body-color`, `--bs-tertiary-bg`).
- May require `!important` to override scoped component styles.

## Reactivity
- Use `untrack()` in `$effect` when calling functions that read state the effect itself writes.
- Use `$derived.by()` for complex derivations, `$derived()` for simple expressions.
- Avoid reading a state variable in the same `$effect` that writes to it — causes infinite loops.
- For bindable props that are computed from local state, compute in a local variable first then assign once.

## Testing 
- After modifying a component, use Playwright MCP to verify its behavior in the browser.
- Check console for errors after interactions.
- Verify OData URLs in the QueryBuilder page before/after changes.
