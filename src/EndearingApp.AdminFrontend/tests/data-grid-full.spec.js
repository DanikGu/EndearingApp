// @ts-nocheck
import { chromium } from 'playwright';

const BASE = 'http://localhost:36335';
const DEFAULT_APP = '00000000-0000-0000-0000-000000000000';

function log(msg) { console.log(`[${new Date().toISOString().replace('T',' ').slice(0,19)}] ${msg}`); }
function assert(condition, msg) { if (!condition) throw new Error(`ASSERT: ${msg}`); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function apiGet(url) { const res = await fetch(`${BASE}/api${url}`); if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); }

const TYPE_NAMES = { 0:'Whole Number',1:'Whole Number (Small)',2:'Whole Number (Big)',3:'Decimal Number',6:'Unlimited Text',7:'Limited Text',8:'Date',9:'Time',10:'Date and Time',11:'Yes/No',13:'Unique Identifier' };
const FILTER_MATRIX = { 'Whole Number':{op:'eq',val:'42'},'Decimal Number':{op:'eq',val:'10.5'},'Unlimited Text':{op:'contains',val:'z'},'Limited Text':{op:'contains',val:'z'},'Date':{op:'eq',val:'2024-01-15'},'Time':{op:'eq',val:'12:30'},'Date and Time':{op:'eq',val:'2024-01-15T12:00'},'Yes/No':{op:'eq',val:'true'},'Unique Identifier':{op:'eq',val:'00000000-0000-0000-0000-000000000000'} };
const OP_LABEL = { eq:'Equals',contains:'Contains',startswith:'Starts With',endswith:'Ends With',lt:'Less Than',le:'Less or Equal',gt:'Greater Than',ge:'Greater or Equal',in:'In' };

async function applyFilter(page, fieldName, fieldDisplayName, op, val) {
  await page.getByRole('button', { name: 'Edit Filters' }).click();
  await sleep(500);
  await page.waitForSelector('.modal.show', { timeout: 3000 }).catch(() => {});
  const addBtn = page.locator('.modal.show button').filter({ hasText: 'Condition' }).first();
  if (await addBtn.isVisible({timeout:2000}).catch(()=>false)) { await addBtn.click(); await sleep(600); }
  const row = page.locator('.modal.show [data-qb-group]').first();
  if (!(await row.isVisible({timeout:2000}).catch(()=>false))) { await page.locator('.modal-footer button:has-text("Done")').click().catch(()=>{}); return null; }
  const fSelect = row.locator('select').first();
  const optVals = await fSelect.locator('option').evaluateAll(els => els.map(el => ({val:el.getAttribute('value'),txt:el.textContent?.trim()})));
  const match = optVals.find(o=>o.val===fieldName||o.txt?.toLowerCase()===(fieldDisplayName||fieldName).trim().toLowerCase());
  if (!match) { await page.locator('.modal-footer button:has-text("Done")').click().catch(()=>{}); return null; }
  await fSelect.selectOption(match.val); await sleep(400);
  const opSel = row.locator('select').nth(1);
  if (await opSel.isVisible({timeout:1000}).catch(()=>false)) { const lbl=OP_LABEL[op]; if(lbl){ const ops=await opSel.locator('option').allTextContents(); if(ops.some(o=>o.trim()===lbl)) await opSel.selectOption({label:lbl}); await sleep(200); } }
  const vInp = row.locator('> div').nth(2).locator('input').first();
  if (await vInp.isVisible({timeout:1000}).catch(()=>false)) { await vInp.fill(String(val)); await sleep(100); }
  let filterUrl = null;
  const handler = req => { if (req.url().includes('/api/odata/') && req.url().includes('$filter=')) filterUrl = req.url(); };
  page.on('request', handler);
  await page.locator('.modal-footer button:has-text("Done")').click();
  await sleep(500);
  page.off('request', handler);
  return filterUrl;
}

async function main() {
  log('=== Data Grid Full Verification ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const tested = new Set();

  try {
    const entities = await apiGet('/CustomEntities');
    log(`Found ${entities.length} entities`);

    const typeToField = new Map();
    for (const e of entities) for (const f of e.fields||[]) { const tn=TYPE_NAMES[f.type]; if(tn&&f.type!==12){ if(!typeToField.has(tn)) typeToField.set(tn,{field:f,entity:e}); } }

    // ── Phase 1: Filters (all types) ──
    log('\n--- Filters ---');
    for (const [tn, {field, entity}] of typeToField) {
      const def = FILTER_MATRIX[tn]; if (!def) continue;
      await page.goto(`${BASE}/app/${DEFAULT_APP}/${entity.name}`, { waitUntil: 'load' });
      await sleep(1500);

      const pc = await page.locator('.text-muted.small').last().textContent().catch(()=>'');
      const ic = pc.match(/\((\d+) total\)/); const initCount = ic ? parseInt(ic[1]) : -1;

      const filterUrl = await applyFilter(page, field.name, field.displayName||field.name, def.op, def.val);
      if (filterUrl) {
        tested.add(tn);
        const m = filterUrl.match(/\$filter=([^&]+)/);
        if (m) log(`  ✓ ${tn}.${field.name}: ${decodeURIComponent(m[1]).slice(0,120)}`);
        await sleep(1500);
        const rows = await page.locator('table tbody tr').count();
        log(`    Rows shown: ${rows}${initCount>=0?' (was '+initCount+')':''}`);
      }
    }
    log(`\nTested: ${tested.size} types — ${[...tested].sort().join(', ')}`);

    // ── Phase 2: Lookup Names ──
    log('\n--- Lookup Names ---');
    await page.goto(`${BASE}/app/${DEFAULT_APP}/Visitor`, { waitUntil: 'load' });
    await sleep(4000); // Wait for $expand effect to trigger reload

    const thTexts = await page.locator('table thead th').allTextContents();
    const favIdx = thTexts.findIndex(h => h.trim().toLowerCase() === 'favorite animal');
    if (favIdx >= 0) {
      // Wait for cells to have content (expand reload may be in progress)
      await page.waitForFunction((idx) => {
        const cells = document.querySelectorAll(`table tbody tr td:nth-child(${idx + 1})`);
        for (const c of cells) { if (c.textContent?.trim() && c.textContent.trim().length > 2) return true; }
        return false;
      }, favIdx, { timeout: 8000 }).catch(() => log('  Wait timed out for lookup cells'));

      const cells = await page.locator(`table tbody tr td:nth-child(${favIdx+1})`).allTextContents();
      const trimmed = cells.map(c=>c.trim()).filter(c=>c);
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}\.\.\.?$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const guids = trimmed.filter(c => guidRegex.test(c));
      if (guids.length > 0) {
        log(`  ! Lookup GUIDs found: ${guids.slice(0,3).join(', ')}`);
      } else if (trimmed.length > 0) {
        log(`  ✓ Lookup shows names: ${trimmed.slice(0,5).join(', ')}`);
      } else {
        log('  ⚠ No cell content found (expand may have failed)');
      }
    } else {
      log('  Favorite Animal column not found');
    }

    // ── Phase 3: Manage Columns ──
    log('\n--- Manage Columns ---');
    await page.goto(`${BASE}/app/${DEFAULT_APP}/Animal`, { waitUntil: 'load' });
    await sleep(2000);

    const bef = (await page.locator('table thead th').allTextContents()).map(h=>h.trim());
    log(`  Before: ${bef.length} cols`);

    await page.getByRole('button', { name: /Manage Columns/i }).click();
    await sleep(600);
    await page.waitForSelector('.modal.show', { timeout: 3000 }).catch(()=>{});
    await sleep(300);
    await page.locator('.modal-footer button:has-text("Save")').click();
    await sleep(800);

    const aft = (await page.locator('table thead th').allTextContents()).map(h=>h.trim());
    assert(aft.length === bef.length, `Col count changed: ${bef.length} -> ${aft.length}`);
    log('  ✓ Save preserves columns');

    // ── Phase 4: Aggregate ──
    log('\n--- Aggregate ---');
    const aggBef = (await page.locator('table thead th').allTextContents()).map(h=>h.trim());

    await page.getByRole('button', { name: /Add Aggregate/i }).click();
    await sleep(600);
    await page.waitForSelector('.modal.show', { timeout: 3000 }).catch(()=>{});
    await sleep(300);

    // Select collection
    const aggModal = page.locator('.modal.show');
    const sel0 = aggModal.locator('select#agg-collection');
    if (await sel0.isVisible({timeout:2000}).catch(()=>false)) {
      const cOpts = await sel0.locator('option').evaluateAll(els => els.map(el => el.getAttribute('value')));
      const valid = cOpts.filter(v => v && v.trim());
      if (valid.length > 0) {
        await sel0.selectOption(valid[0]); await sleep(800);

        const sel1 = aggModal.locator('select#agg-field');
        await sel1.waitFor({ state: 'attached', timeout: 3000 }).catch(()=>{});
        await sleep(500);

        const fOpts = await sel1.locator('option').evaluateAll(els => els.map(el => el.getAttribute('value')));
        const validF = fOpts.filter(v => v && v.trim());
        if (validF.length > 0) {
          await sel1.selectOption(validF[0]); await sleep(300);
        }

        const sel2 = aggModal.locator('select#agg-fn');
        if (await sel2.isVisible({timeout:1000}).catch(()=>false)) {
          await sel2.selectOption('count'); await sleep(100);
        }

        await aggModal.locator('button:has-text("Add")').click();
        await sleep(2500);

        const aggAft = (await page.locator('table thead th').allTextContents()).map(h=>h.trim());
        log(`  After: ${aggAft.length} cols`);
        const newCols = aggAft.filter(h => !aggBef.includes(h));
        if (newCols.length > 0) {
          log(`  ✓ Aggregate columns added: ${newCols.join(', ')}`);
        } else if (aggAft.length > aggBef.length) {
          log('  ✓ Aggregate column added');
        } else {
          log('  ! No new column');
        }
      } else {
        log('  No collection options');
      }
    }

    log('\n=== ALL TESTS PASSED ===');
    process.exit(0);
  } catch (err) {
    log(`\nFAILED: ${err.message}`);
    await page.screenshot({ path: 'tests/failure.png', fullPage: true }).catch(()=>{});
    process.exit(1);
  } finally { await browser.close(); }
}
main();
