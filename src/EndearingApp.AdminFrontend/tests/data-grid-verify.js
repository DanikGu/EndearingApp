// @ts-nocheck
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const BASE = 'http://localhost:32797';
const DEFAULT_APP = '00000000-0000-0000-0000-000000000000';

function log(msg) {
  console.log(`[${new Date().toISOString().replace('T',' ').slice(0,19)}] ${msg}`);
}

function assert(condition, msg) {
  if (!condition) throw new Error(`ASSERT FAILED: ${msg}`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function apiGet(url) {
  const res = await fetch(`${BASE}/api${url}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} GET ${url}`);
  return res.json();
}

const ENTITIES_WITH_LOOKUPS = [
  { name: 'Enclosure', lookupField: 'HabitatId', lookupNavProp: 'HabitatId_Etn', targetEntity: 'Habitat' },
  { name: 'FeedingSchedule', lookupField: 'AnimalId', lookupNavProp: 'AnimalId_Etn', targetEntity: 'Animal' },
  { name: 'MedicalRecord', lookupField: 'AnimalId', lookupNavProp: 'AnimalId_Etn', targetEntity: 'Animal' },
];

const FIELD_TYPES_TO_TEST = [
  { type: 'text', filterOp: 'contains', filterValue: 'test' },
  { type: 'number', filterOp: 'eq', filterValue: '42' },
  { type: 'date', filterOp: 'on', filterValue: '2024-01-15' },
  { type: 'datetime', filterOp: 'on', filterValue: '2024-01-15' },
  { type: 'bool', filterOp: 'eq', filterValue: 'true' },
  { type: 'optionSet', filterOp: 'eq', filterValue: '1' },
];

const UNSUPPORTED_SORT_TYPES = ['Option Set', 'Option Set MultiSelect', 'Binary Data', 'Image'];

async function main() {
  log('=== Data Grid Verification ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    const customEntities = await apiGet('/CustomEntities');
    log(`Found ${customEntities.length} entities`);

    await page.goto(`${BASE}/app/${DEFAULT_APP}/${customEntities[0].name}`);
    await sleep(2000);

    for (const entity of customEntities) {
      const name = entity.name;
      log(`\n--- ${entity.displayName || name} ---`);

      await page.goto(`${BASE}/app/${DEFAULT_APP}/${name}`);
      await sleep(2500);

      const errors = await page.locator('.alert-danger, .text-danger').count();
      assert(errors === 0, `${name}: ${errors} error alerts on page load`);
      if (errors > 0) {
        const t = await page.locator('.alert-danger').first().textContent();
        log(`  ERROR present: ${t}`);
      }

      const rows = await page.locator('table tbody tr').count();
      const infoText = await page.locator('.text-muted.small').last().textContent().catch(() => 'no pagination');
      log(`  Rows: ${rows}, ${infoText}`);

      if (rows === 0) {
        log(`  SKIP: no data for ${name}`);
        continue;
      }

      // ── Lookup verification ──
      if (entity.relationships && entity.relationships.length > 0) {
        log(`  Checking lookup columns (${entity.relationships.length} relationships)...`);
        const headerCells = await page.locator('table thead th').allTextContents();
        for (const rel of entity.relationships) {
          const field = entity.fields?.find(f => f.id === rel.sourceFieldId);
          if (!field) continue;
          const colIndex = headerCells.findIndex(h =>
            h.trim().toLowerCase() === (field.displayName || field.name).toLowerCase()
          );
          if (colIndex === -1) {
            log(`    ${field.name}: column not visible (not in view)`);
            continue;
          }
          const cellText = await page.locator(`table tbody tr td:nth-child(${colIndex + 1})`).first().textContent();
          const hasLink = await page.locator(`table tbody tr td:nth-child(${colIndex + 1}) a`).count() > 0;

          if (hasLink) {
            const linkText = await page.locator(`table tbody tr td:nth-child(${colIndex + 1}) a`).first().textContent();
            const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(linkText.trim());
            assert(!isGuid, `${name}.${field.name}: lookup shows raw GUID "${linkText}" instead of name`);
            log(`    ${field.name}: OK "${linkText}"`);
          } else if (cellText && cellText.trim()) {
            const trimmed = cellText.trim();
            const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);
            assert(!isGuid, `${name}.${field.name}: cell shows raw GUID "${trimmed}" instead of name link`);
            log(`    ${field.name}: ${trimmed}`);
          } else {
            log(`    ${field.name}: empty cell`);
          }
        }
      }

      // ── Filter verification ──
      const filterBtn = page.locator('button:has-text("Edit Filters")');
      if (await filterBtn.isVisible()) {
        log('  Testing filter...');
        await filterBtn.click();
        await sleep(1000);

        const addConditionBtn = page.locator('button:has-text("Add Condition")');
        if (await addConditionBtn.isVisible()) {
          await addConditionBtn.click();
          await sleep(500);

          const fieldSelect = page.locator('select').first();
          if (await fieldSelect.isVisible()) {
            const options = await fieldSelect.locator('option').allTextContents();
            const textOption = options.find(o => /name/i.test(o) || /text/i.test(o));
            if (textOption) {
              await fieldSelect.selectOption({ label: textOption });
              await sleep(300);

              const opSelect = page.locator('select').nth(1);
              if (await opSelect.isVisible()) {
                const ops = await opSelect.locator('option').allTextContents();
                const contains = ops.find(o => /contains/i.test(o));
                if (contains) {
                  await opSelect.selectOption({ label: contains });
                  await sleep(200);
                }
              }

              const valueInput = page.locator('input[type="text"]').first();
              if (await valueInput.isVisible()) {
                await valueInput.fill('a');
                await sleep(200);
              }
            }
          }

          const doneBtn = page.locator('button:has-text("Done")');
          if (await doneBtn.isVisible()) {
            await doneBtn.click();
            await sleep(1500);
            const filteredRows = await page.locator('table tbody tr').count();
            log(`    Filter applied: ${filteredRows} rows shown`);
          }
        } else {
          const closeBtn = page.locator('.modal-header button.btn-close');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await sleep(500);
          }
          log('    Cannot add condition in filter modal (no button)');
        }
      }

      // ── Sort verification ──
      log('  Checking sort headers...');
      const thButtons = await page.locator('table thead th button').all();
      for (const btn of thButtons) {
        const text = await btn.textContent();
        const isUnsortedType = UNSUPPORTED_SORT_TYPES.some(t =>
          text.toLowerCase().includes(t.toLowerCase())
        );
        if (isUnsortedType) {
          log(`    ${text}: unsupported sort type (OK - no sort expected)`);
        } else {
          const initialRows = await page.locator('table tbody tr').count();
          await btn.click();
          await sleep(800);
          const afterRows = await page.locator('table tbody tr').count();
          const thClass1 = await btn.locator('..').getAttribute('class') || '';
          log(`    ${text}: sorted (class: ${thClass1})`);
          await btn.click();
          await sleep(800);
          const thClass2 = await btn.locator('..').getAttribute('class') || '';
          log(`    ${text}: reverse sorted (class: ${thClass2})`);
        }
      }
    }

    log('\n=== ALL DATA GRID VERIFICATIONS PASSED ===');
  } catch (err) {
    log(`FAILED: ${err.message}`);
    await page.screenshot({ path: 'tests/data-grid-failure.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
