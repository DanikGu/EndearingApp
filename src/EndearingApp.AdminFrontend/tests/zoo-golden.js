// @ts-nocheck
import { chromium } from 'playwright';
import { faker } from '@faker-js/faker';

const BASE = 'http://localhost:32797';
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function apiGet(url) {
  const res = await fetch(`${BASE}/api${url}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on GET ${url}`);
  return res.json();
}

async function apiPost(url, body) {
  const res = await fetch(`${BASE}/api${url}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} on POST ${url}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

// ─── Zoo entities with FK fields included ───
const ZOO = [
  {
    name: 'Animal', displayName: 'Animal', description: 'Zoo animals',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'Age', displayName: 'Age', type: 'Whole Number' },
      { name: 'Weight', displayName: 'Weight (kg)', type: 'Decimal Number' },
      { name: 'DateOfBirth', displayName: 'Date of Birth', type: 'Date' },
      { name: 'IsPredator', displayName: 'Is Predator', type: 'Yes/No' },
      { name: 'Notes', displayName: 'Notes', type: 'Unlimited Text' },
    ],
    fks: [],
  },
  {
    name: 'Habitat', displayName: 'Habitat', description: 'Animal habitats',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'Climate', displayName: 'Climate', type: 'Limited Text', size: 100 },
      { name: 'Size', displayName: 'Size (sqm)', type: 'Decimal Number' },
      { name: 'IsIndoor', displayName: 'Is Indoor', type: 'Yes/No' },
    ],
    fks: [],
  },
  {
    name: 'Zookeeper', displayName: 'Zookeeper', description: 'Staff members',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'Specialization', displayName: 'Specialization', type: 'Limited Text', size: 200 },
      { name: 'YearsOfExperience', displayName: 'Years of Experience', type: 'Whole Number' },
      { name: 'ShiftStart', displayName: 'Shift Start', type: 'Time' },
    ],
    fks: [],
  },
  {
    name: 'Enclosure', displayName: 'Enclosure', description: 'Animal enclosures',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'Capacity', displayName: 'Capacity', type: 'Whole Number' },
    ],
    fks: [{ name: 'HabitatId', target: 'Habitat' }],
  },
  {
    name: 'FeedingSchedule', displayName: 'Feeding Schedule', description: 'Animal feeding times',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'TimeOfDay', displayName: 'Time of Day', type: 'Time' },
      { name: 'PortionSize', displayName: 'Portion Size (g)', type: 'Whole Number' },
    ],
    fks: [{ name: 'AnimalId', target: 'Animal' }],
  },
  {
    name: 'MedicalRecord', displayName: 'Medical Record', description: 'Animal health records',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'Diagnosis', displayName: 'Diagnosis', type: 'Unlimited Text' },
      { name: 'RecordDate', displayName: 'Record Date', type: 'Date' },
    ],
    fks: [{ name: 'AnimalId', target: 'Animal' }, { name: 'ZookeeperId', target: 'Zookeeper' }],
  },
  {
    name: 'Visitor', displayName: 'Visitor', description: 'Zoo visitors',
    fields: [
      { name: 'Name', displayName: 'Name', type: 'Limited Text', size: 200, required: true },
      { name: 'VisitDate', displayName: 'Visit Date', type: 'Date and Time' },
      { name: 'TicketNumber', displayName: 'Ticket Number', type: 'Whole Number' },
    ],
    fks: [],
  },
];

async function createEntity(page, def) {
  log(`Entity: ${def.name}`);
  
  // Click Add Entity in the list
  await page.locator('.list-group-item-action:has-text("Add Entity")').click();
  await sleep(1000);
  
  await page.locator('#customEntityDisplayName').fill(def.displayName);
  await page.locator('#customEntityName').fill(def.name);
  await page.locator('#customEntityDescription').fill(def.description);
  await page.locator('button:has-text("Save Entity")').click();
  await sleep(1500);
  
  // Click on the entity in the list to open its editor
  await page.locator(`.list-group-item-action:has-text("${def.displayName}")`).click();
  await sleep(1000);
  
  // Add regular fields
  for (const f of def.fields) {
    log(`  Field: ${f.name} (${f.type})`);
    await page.locator('button[title="Add new column"]').click();
    await sleep(800);
    
    await page.locator('#fieldName').fill(f.name);
    await page.locator('#fieldDisplayName').fill(f.displayName);
    await page.locator('#fieldType').selectOption({ label: f.type });
    await sleep(300);
    
    if (f.required) {
      const cb = page.locator('#isRequiredField');
      if (await cb.isVisible()) await cb.check();
    }
    if (f.size && f.type.includes('Text')) {
      const sizeInput = page.locator('#fieldSize');
      if (await sizeInput.count() > 0) await sizeInput.fill(String(f.size));
    }
    
    await page.locator('.modal button:has-text("Save")').click();
    await sleep(1000);
  }
  
  // Add FK fields (Unique Identifier type)
  for (const fk of def.fks) {
    log(`  FK Field: ${fk.name}`);
    await page.locator('button[title="Add new column"]').click();
    await sleep(800);
    
    await page.locator('#fieldName').fill(fk.name);
    await page.locator('#fieldDisplayName').fill(fk.name);
    await page.locator('#fieldType').selectOption({ label: 'Unique Identifier' });
    await sleep(300);
    
    await page.locator('.modal button:has-text("Save")').click();
    await sleep(1000);
  }
  
  // Save entity after adding fields
  await page.locator('button:has-text("Save Entity")').click();
  await sleep(500);
}

async function createRelationships(page, defs) {
  log('Creating relationships...');
  
  for (const def of defs) {
    if (!def.fks || def.fks.length === 0) continue;
    
    await page.locator(`.list-group-item-action:has-text("${def.displayName}")`).click();
    await sleep(1000);
    
    for (const fk of def.fks) {
      log(`  ${def.name}.${fk.name} → ${fk.target}`);
      
      await page.locator('button[title="Add new relationship"]').click();
      await sleep(800);
      
      // Select source field (the FK field)
      await page.locator('#relationshipSourceField').selectOption({ label: fk.name });
      await sleep(200);
      
      // Select target entity
      await page.locator('#relationshipReferencedEntity').selectOption({ label: fk.target });
      await sleep(200);
      
      // Select target field (PK - usually Id)
      const targetPk = page.locator('#relationshipReferencedField');
      await targetPk.selectOption({ label: 'Id' });
      await sleep(200);
      
      // Fill constraint name
      const constraintInput = page.locator('#relationshipConstraintName');
      if (await constraintInput.isVisible()) {
        await constraintInput.fill(`FK_${def.name}_${fk.target}`);
      }
      
      await page.locator('.modal button:has-text("Save")').click();
      await sleep(1000);
    }
    
    await page.locator('button:has-text("Save Entity")').click();
    await sleep(500);
  }
}

async function seedData() {
  log('Seeding 1000 rows per entity...');
  const batchSize = 50;
  
  for (const def of ZOO) {
    const name = def.name;
    const existing = await apiGet(`/odata/${name}?$count=true&$top=1`);
    const currentCount = existing['@odata.count'] || 0;
    
    if (currentCount >= 1000) {
      log(`  ${name}: ${currentCount} rows, skipping`);
      continue;
    }
    
    const needed = 1000 - currentCount;
    log(`  ${name}: seeding ${needed} rows...`);
    
    for (let i = 0; i < needed; i += batchSize) {
      const promises = [];
      for (let j = 0; j < batchSize && i + j < needed; j++) {
        const idx = currentCount + i + j;
        const data = generateRow(name, idx);
        promises.push(apiPost(`/odata/${name}`, data));
      }
      await Promise.all(promises);
      log(`    ${Math.min(currentCount + i + batchSize, 1000)} / 1000`);
    }
    log(`  ${name}: done`);
  }
}

function generateRow(entityName, idx) {
  const data = {};
  switch (entityName) {
    case 'Animal':
      data.Name = `${faker.animal.type()} #${idx}`;
      data.Age = faker.number.int({ min: 0, max: 50 });
      data.Weight = faker.number.float({ min: 0.5, max: 5000, fractionDigits: 2 });
      data.DateOfBirth = faker.date.past({ years: 50 }).toISOString().split('T')[0];
      data.IsPredator = faker.datatype.boolean();
      data.Notes = faker.lorem.sentence();
      break;
    case 'Habitat':
      data.Name = `${faker.science.chemicalElement().name} #${idx}`;
      data.Climate = faker.helpers.arrayElement(['Tropical', 'Desert', 'Arctic', 'Temperate', 'Rainforest']);
      data.Size = faker.number.float({ min: 10, max: 5000, fractionDigits: 1 });
      data.IsIndoor = faker.datatype.boolean();
      break;
    case 'Zookeeper':
      data.Name = `${faker.person.fullName()} #${idx}`;
      data.Specialization = faker.helpers.arrayElement(['Mammals', 'Reptiles', 'Birds', 'Aquatics', 'Primates']);
      data.YearsOfExperience = faker.number.int({ min: 1, max: 40 });
      data.ShiftStart = `${String(faker.number.int({ min: 6, max: 14 })).padStart(2, '0')}:00:00`;
      break;
    case 'Enclosure':
      data.Name = `${faker.word.adjective()} #${idx}`;
      data.Capacity = faker.number.int({ min: 1, max: 100 });
      break;
    case 'FeedingSchedule':
      data.Name = `Feed #${idx}`;
      data.TimeOfDay = `${String(faker.number.int({ min: 6, max: 20 })).padStart(2, '0')}:00:00`;
      data.PortionSize = faker.number.int({ min: 50, max: 5000 });
      break;
    case 'MedicalRecord':
      data.Name = `Record #${idx}`;
      data.Diagnosis = faker.lorem.sentence();
      data.RecordDate = faker.date.past({ years: 10 }).toISOString().split('T')[0];
      break;
    case 'Visitor':
      data.Name = `${faker.person.fullName()} #${idx}`;
      data.VisitDate = faker.date.past({ years: 2 }).toISOString();
      data.TicketNumber = faker.number.int({ min: 1000, max: 99999 });
      break;
    default:
      data.Name = `Row #${idx}`;
  }
  return data;
}

async function verifyInApp(page) {
  log('Verifying entities in User App...');
  
  for (const def of ZOO) {
    log(`  ${def.name}...`);
    await page.goto(`${BASE}/app/00000000-0000-0000-0000-000000000000/${def.name}`);
    await sleep(2500);
    
    const errors = await page.locator('.alert-danger, .text-danger').count();
    if (errors > 0) {
      const t = await page.locator('.alert-danger, .text-danger').first().textContent();
      log(`  ERROR: ${t}`);
    }
    
    const rows = await page.locator('table tbody tr').count();
    const info = await page.locator('.text-muted.small').last().textContent();
    log(`    ${rows} rows, ${info}`);
    
    // Sort
    const nameBtn = page.locator('th button:has-text("Name")');
    if (await nameBtn.isVisible()) {
      await nameBtn.click();
      await sleep(1000);
      log(`    Sort OK`);
    }
    
    // Pagination
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isVisible() && !(await nextBtn.isDisabled())) {
      await nextBtn.click();
      await sleep(1000);
      log(`    Pagination OK`);
    }
    
    // Edit form
    const link = page.locator('table tbody tr a').first();
    if (await link.isVisible()) {
      await link.click();
      await sleep(2000);
      const backBtn = page.locator('button:has-text("Back")');
      if (await backBtn.isVisible()) {
        log(`    Edit form opens OK`);
        await backBtn.click();
        await sleep(1000);
      }
    }
  }
}

async function main() {
  log('=== Zoo Golden Ticket ===');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(`${BASE}/DataCustomizations`);
    await sleep(2000);
    await page.locator('button:has-text("Entities")').click();
    await sleep(500);
    
    const existing = await apiGet('/CustomEntities');
    const existingNames = existing.map(e => e.name);
    log(`Existing: ${existingNames.join(', ')}`);
    
    // Step 1: Create entities
    log('--- Creating entities ---');
    const toCreate = ZOO.filter(d => !existingNames.includes(d.name));
    for (const def of toCreate) {
      await createEntity(page, def);
    }
    
    // Step 2: Create relationships
    if (toCreate.length > 0) {
      log('--- Creating relationships ---');
      await createRelationships(page, ZOO);
    }
    
    // Apply all entities to DB
    log('--- Applying entities to DB ---');
    for (const def of ZOO) {
      await page.locator(`.list-group-item-action:has-text("${def.displayName}")`).click();
      await sleep(500);
      const applyBtn = page.locator('button:has-text("Apply to DB")');
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
        await sleep(2000);
        log(`  Applied ${def.name} to DB`);
      }
    }
    
    // Step 3: Seed data
    log('--- Seeding data ---');
    await seedData();
    
    // Step 4: Verify
    log('--- Verification ---');
    await verifyInApp(page);
    
    log('=== ALL TESTS PASSED ===');
  } catch (err) {
    log(`FAILED: ${err.message}`);
    await page.screenshot({ path: 'tests/failure.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
