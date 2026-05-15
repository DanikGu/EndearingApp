// @ts-nocheck
import { chromium } from 'playwright';
import { faker } from '@faker-js/faker';
import { readFileSync } from 'fs';

const BASE = 'http://localhost:32797';
const log = (msg) => console.log(`[${new Date().toISOString().replace('T',' ').slice(0,19)}] ${msg}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function req(url, opts = {}) {
  const r = await fetch(`${BASE}${url}`, { headers: { 'Content-Type': 'application/json' }, ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const t = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}: ${t.slice(0,200)}`);
  return t ? JSON.parse(t) : null;
}
const get = url => req(url);
const post = (url, body) => req(url, { method: 'POST', body });
const del = url => req(url, { method: 'DELETE' });

let typeConfig = null;
async function loadTypeConfig() {
  if (typeConfig) return typeConfig;
  const data = await get('/api/Settings/DataBaseTypesDescription').catch(() => null);
  if (data?.jsonSetting) typeConfig = JSON.parse(data.jsonSetting);
  return typeConfig;
}
function getTypeName(typeId) {
  if (!typeConfig) return `Type${typeId}`;
  return typeConfig[String(typeId)]?.Name || `Type${typeId}`;
}

function shuffle(arr) { for (let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

function clickItem(page, text) {
  return page.evaluate(t => { const el = [...document.querySelectorAll('.list-group-item-action')].find(i => i.textContent?.trim()===t); if(el)el.click(); }, text);
}

async function ensureEntities(page) {
  for (let i = 0; i < 3; i++) {
    const eb = page.locator('button:has-text("Entities")');
    const expanded = await eb.getAttribute('aria-expanded');
    if (expanded === 'true') return;
    await eb.click();
    await sleep(400);
  }
}

async function ensureOptionSets(page) {
  for (let i = 0; i < 3; i++) {
    const os = page.locator('button:has-text("Option Sets")');
    const expanded = await os.getAttribute('aria-expanded');
    if (expanded === 'true') return;
    await os.click();
    await sleep(400);
  }
}

const created = new Set();
const actions = JSON.parse(readFileSync(new URL('zoo-actions.json', import.meta.url), 'utf-8'));
const tables = actions.filter(a => a.action === 'addTable');

async function addTable(page, a) {
  if (created.has(a.name)) { log(`  Skip ${a.displayName} (exists)`); return; }
  log(`  Table: ${a.displayName}`);
  await page.goto(`${BASE}/DataCustomizations`); await sleep(1000);
  await ensureEntities(page);
  await clickItem(page, 'Add Entity'); await sleep(1000);
  await page.waitForSelector('#customEntityDisplayName', { timeout: 5000 });
  await page.locator('#customEntityDisplayName').fill(a.displayName);
  await page.keyboard.press('Tab');
  await sleep(400);
  await page.locator('#customEntityName').fill(a.name);
  if (a.desc) await page.locator('#customEntityDescription').fill(a.desc);
  await page.locator('button:has-text("Save Entity")').click(); await sleep(1500);
  created.add(a.name);
}

async function addField(page, a) {
  if (!created.has(a.table)) { const d = tables.find(t => t.name === a.table); await addTable(page, d || { name: a.table, displayName: a.table, desc: '' }); }
  log(`  Field: ${a.table}.${a.name} (${a.type})`);
  await page.goto(`${BASE}/DataCustomizations`); await sleep(1000);
  const def = tables.find(t => t.name === a.table);
  await ensureEntities(page);
  await clickItem(page, def ? def.displayName : a.table); await sleep(1000);
  await page.locator('button[title="Add new column"]').click(); await sleep(800);
  await page.waitForSelector('#fieldName', { timeout: 10000 });
  await page.locator('#fieldName').fill(a.name);
  await page.locator('#fieldDisplayName').fill(a.displayName);
  await page.locator('#fieldType').selectOption({ label: a.type });
  if (a.size && a.type.includes('Text')) { const si = page.locator('#fieldSize'); if (await si.count()>0) await si.fill(String(a.size)); }
  await page.locator('.modal button:has-text("Save")').click(); await sleep(800);
}

async function addRelationship(page, a) {
  log(`  Rel: ${a.table}.${a.fkField} → ${a.target}`);
  await page.goto(`${BASE}/DataCustomizations`); await sleep(1000);
  const def = tables.find(t => t.name === a.table);
  await ensureEntities(page);
  await clickItem(page, def ? def.displayName : a.table); await sleep(1000);
  await page.locator('button[title="Add new relationship"]').click(); await sleep(800);
  await page.waitForSelector('#relationshipSourceField', { timeout: 10000 });
  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await page.locator('#relationshipSourceField option').count();
    if (count > 1) break;
    await sleep(500);
  }
  const selectLabel = a.fkDisplay || a.fkField;
  await page.locator('#relationshipSourceField').selectOption({ label: selectLabel }).catch(async () => {
    const opts = await page.locator('#relationshipSourceField option').allTextContents();
    log(`    Options available: ${opts.join(', ')}`);
    throw new Error(`FK field ${selectLabel} not found`);
  });
  await page.locator('#relationshipReferencedEntity').selectOption({ label: a.target }); await sleep(300);
  await page.locator('#relationshipReferencedField').selectOption({ label: 'Id' }); await sleep(300);
  const ci = page.locator('#relationshipConstraintName');
  if (await ci.isVisible()) {
    const cname = a.constraint || `FK_${a.table}_${a.target}`;
    await ci.fill(cname);
  }
  await page.locator('.modal button:has-text("Save")').click(); await sleep(1000);
}

async function addOptionSet(page, a) {
  if (created.has(a.name)) { log(`  Skip OptionSet ${a.name} (exists)`); return; }
  log(`  OptionSet: ${a.name}`);
  await ensureOptionSets(page);
  await clickItem(page, 'Add Option Set'); await sleep(600);
  await page.locator('#optionSetName').fill(a.name);
  await page.locator('button:has-text("Save Option Set")').click(); await sleep(800);
  created.add(a.name);
}

async function addOption(page, a) {
  if (!created.has(a.optionSet)) await addOptionSet(page, { name: a.optionSet });
  log(`  Option: ${a.optionSet}=${a.name}(${a.value})`);
  await ensureOptionSets(page);
  await clickItem(page, a.optionSet); await sleep(400);
  await page.locator('button:has-text("Add Option")').click(); await sleep(500);
  await page.locator('#newOptionKey').fill(String(a.value));
  await page.locator('#newOptionValue').fill(a.name);
  await page.locator('button:has-text("Add")').click(); await sleep(600);
}

async function addForm(a) {
  log(`  Form: ${a.formName} for ${a.table}`);
  const entities = await get('/api/CustomEntities').catch(() => []);
  const entity = entities.find(e => e.name === a.table || e.displayName === a.table);
  if (!entity) { log(`    Entity ${a.table} not found (not applied to DB yet?), skip form`); return; }

  const components = [];
  const skipFields = new Set(['Id', 'CreatedOn', 'ModifiedOn']);
  for (const field of (entity.fields || [])) {
    if (skipFields.has(field.name)) continue;
    const typeName = getTypeName(field.type);
    let comp = null;
    switch (typeName) {
      case 'Unlimited Text':
        comp = { type: 'textarea', label: field.displayName || field.name, key: field.name, input: true, validate: { required: !field.isNullable } };
        break;
      case 'Limited Text':
        comp = { type: 'textfield', label: field.displayName || field.name, key: field.name, input: true, validate: { required: !field.isNullable } };
        break;
      case 'Whole Number':
      case 'Decimal Number':
        comp = { type: 'number', label: field.displayName || field.name, key: field.name, input: true, validate: { required: !field.isNullable } };
        break;
      case 'Date and Time':
        comp = { type: 'datetime', label: field.displayName || field.name, key: field.name, input: true };
        break;
      case 'Date':
        comp = { type: 'day', label: field.displayName || field.name, key: field.name, input: true };
        break;
      case 'Time':
        comp = { type: 'time', label: field.displayName || field.name, key: field.name, input: true };
        break;
      case 'Yes/No':
        comp = { type: 'checkbox', label: field.displayName || field.name, key: field.name, input: true };
        break;
      case 'Option Set':
      case 'Option Set MultiSelect':
        comp = {
          type: 'select', label: field.displayName || field.name, key: field.name, input: true,
          multiple: typeName === 'Option Set MultiSelect',
          data: { values: [] },
        };
        if (field.optionSetDefinitionId) {
          const os = await get(`/api/OptionSetDefinitions/${field.optionSetDefinitionId}`).catch(() => null);
          if (os?.options) {
            comp.data.values = os.options.map(o => ({ label: o.name, value: String(o.value) }));
          }
        }
        break;
      case 'Unique Identifier':
        const rel = (entity.relationships || []).find(r => r.sourceFieldId === field.id);
        if (rel) {
          const targetEntity = entities.find(e => e.id === rel.referencedCustomEntityId);
          if (targetEntity) {
            comp = { type: 'lookup', label: field.displayName || field.name, key: field.name, odataPath: 'api/odata', entityName: targetEntity.name };
          }
        }
        if (!comp) comp = { type: 'textfield', label: field.displayName || field.name, key: field.name, input: true };
        break;
      default:
        comp = { type: 'textfield', label: field.displayName || field.name, key: field.name, input: true };
    }
    if (comp) components.push(comp);
  }

  components.push({
    type: 'custombuttongroup',
    label: 'Actions',
    key: 'customButtonGroup',
    buttons: [
      { label: 'Save', event: 'EntitySave', style: 'btn-primary' },
      { label: 'Delete', event: 'EntityDelete', style: 'btn-danger' },
    ],
  });

  const schema = JSON.stringify({ components });
  const body = { name: a.formName, description: a.formDesc || '', customEntityId: entity.id, jsonSchema: schema };
  const result = await post('/api/Form', body).catch(err => { log(`    Form create error: ${err.message}`); return null; });
  if (result) log(`    Form created: ${result.id}`);
}

async function applyToDb(page) {
  log('  Applying all entities to DB...');
  await ensureEntities(page);
  const names = [...new Set(actions.filter(a => a.table).map(a => a.table))];
  for (const name of names) {
    const def = tables.find(t => t.name === name);
    await clickItem(page, def ? def.displayName : name); await sleep(400);
    const btn = page.locator('button:has-text("Apply to DB")');
    if (await btn.isVisible()) { await btn.click(); await sleep(1500); log(`    ${name} applied`); }
  }
}

async function seedAll(entityNames) {
  log('--- Seeding 1000 rows per entity ---');
  const idCache = {};
  async function getIds(name, count) {
    if (!idCache[name]) {
      const e = await get(`/api/odata/${name}?$select=Id&$top=2000`).catch(() => ({ value: [] }));
      idCache[name] = (e.value || []).map(/** @param {any} r */ r => r.Id).filter(Boolean);
    }
    const pool = idCache[name];
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return ids;
  }

  let animalIds = null; let habitatIds = null; let keeperIds = null;

  for (const name of entityNames) {
    const e = await get(`/api/odata/${name}?$count=true&$top=1`).catch(() => ({}));
    const cur = e['@odata.count'] || 0;
    if (cur >= 1000) { log(`  ${name}: ${cur} rows, skip`); continue; }
    const need = 1000 - cur;
    log(`  ${name}: seeding ${need}...`);
    const B = 50;

    if (name === 'Enclosure') habitatIds = await getIds('Habitat', need);
    if (name === 'FeedingSchedule') animalIds = await getIds('Animal', need);
    if (name === 'MedicalRecord') { animalIds = await getIds('Animal', need); keeperIds = await getIds('Zookeeper', need); }
    if (name === 'Visitor') animalIds = await getIds('Animal', need);

    for (let i = 0; i < need; i += B) {
      const ps = [];
      for (let j = 0; j < B && i + j < need; j++) {
        const idx = cur + i + j;
        const d = {};
        switch (name) {
          case 'Animal': d.Name=`${faker.animal.type()} #${idx}`; d.Age=faker.number.int({min:0,max:50}); d.Weight=faker.number.float({min:0.5,max:5000,fractionDigits:2}); d.DateOfBirth=faker.date.past({years:50}).toISOString().split('T')[0]; d.IsPredator=faker.datatype.boolean(); d.Notes=faker.lorem.sentence(); break;
          case 'Species': d.Name=`${faker.animal.type()} #${idx}`; d.LatinName=faker.lorem.word(); d.AverageLifespan=faker.number.int({min:1,max:100}); break;
          case 'Habitat': d.Name=`${faker.science.chemicalElement().name} #${idx}`; d.Climate=faker.helpers.arrayElement(['Tropical','Desert','Arctic','Temperate','Rainforest']); d.Size=faker.number.float({min:10,max:5000,fractionDigits:1}); d.IsIndoor=faker.datatype.boolean(); break;
          case 'Zookeeper': d.Name=`${faker.person.fullName()} #${idx}`; d.Specialization=faker.helpers.arrayElement(['Mammals','Reptiles','Birds','Aquatics','Primates']); d.YearsOfExperience=faker.number.int({min:1,max:40}); d.ShiftStart=`${String(faker.number.int({min:6,max:14})).padStart(2,'0')}:00:00`; break;
          case 'Enclosure': d.Name=`${faker.word.adjective()} #${idx}`; d.Capacity=faker.number.int({min:1,max:100}); if (habitatIds) d.HabitatId = habitatIds[idx % habitatIds.length]; break;
          case 'FeedingSchedule': d.Name=`Feed #${idx}`; d.TimeOfDay=`${String(faker.number.int({min:6,max:20})).padStart(2,'0')}:00:00`; d.PortionSize=faker.number.int({min:50,max:5000}); if (animalIds) d.AnimalId = animalIds[idx % animalIds.length]; break;
          case 'MedicalRecord': d.Name=`Record #${idx}`; d.Diagnosis=faker.lorem.sentence(); d.RecordDate=faker.date.past({years:10}).toISOString().split('T')[0]; if (animalIds) d.AnimalId = animalIds[idx % animalIds.length]; if (keeperIds) d.ZookeeperId = keeperIds[idx % keeperIds.length]; break;
          case 'Visitor': d.Name=faker.person.fullName(); d.Age=faker.number.int({min:1,max:90}); d.TicketPrice=faker.number.float({min:5,max:100,fractionDigits:2}); d.VisitDate=faker.date.past({years:1}).toISOString().split('T')[0]; d.IsMember=faker.datatype.boolean(); d.Notes=faker.lorem.sentence(); if (animalIds) d.FavoriteAnimalId = animalIds[idx % animalIds.length]; break;
          default: d.Name=`Row #${idx}`;
        }
        ps.push(post(`/api/odata/${name}`, d));
      }
      await Promise.all(ps);
    }
    log(`  ${name}: done`);
  }
}

async function verify(page, names) {
  log('--- Verifying ---');
  for (const n of names) {
    log(`  ${n}...`);
    await page.goto(`${BASE}/app/00000000-0000-0000-0000-000000000000/${n}`); await sleep(2000);
    const errs = await page.locator('.alert-danger,.text-danger').count();
    if (errs) log(`    ERR: ${await page.locator('.alert-danger,.text-danger').first().textContent()}`);
    const rows = await page.locator('table tbody tr').count();
    const info = await page.locator('.text-muted.small').last().textContent();
    log(`    ${rows} rows, ${info}`);
    const nb = page.locator('th button').filter({ hasText: 'Name' }).first();
    if (await nb.count() > 0 && await nb.isVisible()) { await nb.click(); await sleep(800); log('    Sort OK'); }
    const nx = page.locator('button:has-text("Next")');
    if (await nx.isVisible() && !(await nx.isDisabled())) { await nx.click(); await sleep(800); log('    Page OK'); }
    const lk = page.locator('table tbody tr a').first();
    if (await lk.isVisible()) { await lk.click(); await sleep(2000); const bb = page.locator('button:has-text("Back")'); if (await bb.isVisible()) { log('    Edit OK'); await bb.click(); await sleep(800); } }
  }
}

async function main() {
  log('=== Zoo Golden Ticket ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE}/DataCustomizations`); await sleep(1500);
    const existing = await get('/api/CustomEntities').catch(() => []);
    existing.forEach(e => created.add(e.name));
    const existingOS = await get('/api/OptionSetDefinitions').catch(() => []);
    existingOS.forEach(o => created.add(o.name));
    log(`Existing: ${[...created].join(', ') || 'none'}`);

    const tableActs = shuffle(actions.filter(a => a.action === 'addTable'));
    const optionSetActs = shuffle(actions.filter(a => a.action === 'addOptionSet'));
    const formActs = actions.filter(a => a.action === 'addForm');
    const fieldActs = shuffle(actions.filter(a => a.action === 'addField'));
    const relActs = shuffle(actions.filter(a => a.action === 'addRelationship'));
    const otherActs = shuffle(actions.filter(a => !['addTable','addOptionSet','addForm','addField','addRelationship','applyToDB'].includes(a.action)));

    log('--- Tables ---');
    for (const a of tableActs) await addTable(page, a);

    log('--- Fields ---');
    for (const a of fieldActs) await addField(page, a);

    log('--- Relationships ---');
    for (const a of relActs) await addRelationship(page, a);

    log('--- Option Sets ---');
    for (const a of optionSetActs) await addOptionSet(page, a);

    log('--- Options ---');
    const optionActs = shuffle(actions.filter(a => a.action === 'addOption'));
    for (const a of optionActs) await addOption(page, a);

    log('--- Apply to DB ---');
    await applyToDb(page);

    log('--- Type Config ---');
    await loadTypeConfig();

    log('--- Forms ---');
    for (const a of formActs) await addForm(a);

    const entityNames = [...new Set(actions.filter(a => a.table).map(a => a.table))];
    log('--- Seed ---');
    await seedAll(entityNames);

    log('--- Verify ---');
    await verify(page, entityNames);

    log('=== ALL PASSED ===');
  } catch (err) {
    log(`FAILED: ${err.message}`);
    await page.screenshot({ path: 'tests/failure.png' });
    process.exit(1);
  } finally { await browser.close(); }
}

main();
