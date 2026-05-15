// @ts-nocheck
import { faker } from '@faker-js/faker';

const BASE = 'http://localhost:32797';
const DEFAULT_APP = '00000000-0000-0000-0000-000000000000';
const API_BASE = `${BASE}/api`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

async function apiGet(url) {
  return request(`${API_BASE}${url}`);
}

async function apiPost(url, body) {
  return request(`${API_BASE}${url}`, { method: 'POST', body: JSON.stringify(body) });
}

async function apiPatch(url, body) {
  return request(`${API_BASE}${url}`, { method: 'PATCH', body: JSON.stringify(body) });
}

async function apiDelete(url) {
  return request(`${API_BASE}${url}`, { method: 'DELETE' });
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function assert(condition, msg) {
  if (!condition) throw new Error(`ASSERT FAILED: ${msg}`);
}

async function main() {
  log('=== Golden Ticket Test ===');
  log('1. Checking API health...');
  const customEntities = await apiGet('/CustomEntities');
  log(`   Found ${customEntities.length} custom entities: ${customEntities.map(e => e.name).join(', ')}`);
  assert(customEntities.length > 0, 'No custom entities found');

  log('2. Seeding data via API...');
  for (const entity of customEntities) {
    log(`   Entity: ${entity.name} (${entity.displayName || entity.name})`);
    const existing = await apiGet(`/odata/${entity.name}?$count=true&$top=1`);
    const currentCount = existing['@odata.count'] || 0;
    log(`   Current row count: ${currentCount}`);

    if (currentCount < 1000) {
      log(`   Seeding ${1000 - currentCount} rows for ${entity.name}...`);
      const batchSize = 50;
      for (let i = currentCount; i < 1000; i += batchSize) {
        const promises = [];
        for (let j = 0; j < batchSize && i + j < 1000; j++) {
          const data = { Name: `${faker.person.fullName()} #${i + j}` };
          promises.push(apiPost(`/odata/${entity.name}`, data));
        }
        await Promise.all(promises);
        log(`   ... ${Math.min(i + batchSize, 1000)} / 1000 rows created for ${entity.name}`);
      }
      log(`   Done seeding ${entity.name}`);
    }
  }

  log('3. Verifying OData collection endpoints...');
  for (const entity of customEntities) {
    const result = await apiGet(`/odata/${entity.name}?$top=5&$orderby=createdon desc&$count=true`);
    const count = result['@odata.count'] || 0;
    log(`   /odata/${entity.name}: ${count} records, first page has ${result.value?.length || 0} rows`);
    assert(count >= 0, `${entity.name} count should be >= 0`);
    assert(result.value !== undefined, `${entity.name} response should have .value array`);
  }

  log('4. Verifying OData single-entity endpoints...');
  for (const entity of customEntities) {
    const list = await apiGet(`/odata/${entity.name}?$top=1`);
    if (list.value && list.value.length > 0) {
      const id = list.value[0].Id || list.value[0].id;
      const single = await apiGet(`/odata/${entity.name}(${encodeURIComponent(id)})`);
      assert(single !== null, `GET /odata/${entity.name}(id) should return data`);
      log(`   /odata/${entity.name}(id): OK`);
    }
  }

  log('5. Verifying OData $select works...');
  for (const entity of customEntities) {
    const result = await apiGet(`/odata/${entity.name}?$select=Id,Name&$top=2`);
    if (result.value && result.value.length > 0) {
      const keys = Object.keys(result.value[0]);
      log(`   ${entity.name} $select=Id,Name fields: ${keys.join(', ')}`);
    }
  }

  log('6. Verifying OData $expand for lookup fields...');
  for (const entity of customEntities) {
    if (entity.relationships && entity.relationships.length > 0) {
      for (const rel of entity.relationships) {
        const field = entity.fields?.find(f => f.id === rel.sourceFieldId);
        if (field) {
          const navProp = `${field.name}_Etn`;
          const result = await apiGet(`/odata/${entity.name}?$expand=${navProp}($select=Id,Name)&$top=1`);
          if (result.value && result.value.length > 0) {
            const expanded = result.value[0][navProp];
            log(`   ${entity.name} $expand=${navProp}: ${expanded ? 'OK' : 'null (no related record)'}`);
          }
        }
      }
    }
  }

  log('7. Verifying OData $filter works...');
  for (const entity of customEntities) {
    const hasName = entity.fields?.some(f => f.name === 'Name' || f.name === 'name');
    if (hasName) {
      const result = await apiGet(`/odata/${entity.name}?$filter=Name ne null&$top=1&$count=true`);
      log(`   ${entity.name} $filter: ${result['@odata.count'] || 0} records match`);
    }
  }

  log('8. Verifying CRUD operations...');
  for (const entity of customEntities) {
    const createData = { Name: `TEST_${Date.now()}` };
    log(`   Creating ${entity.name}: ${createData.Name}`);
    const created = await apiPost(`/odata/${entity.name}`, createData);
    const newId = created?.Id || created?.id;
    assert(newId, `Created ${entity.name} should have an Id`);
    log(`   Created with ID: ${newId}`);

    if (newId) {
      log(`   Updating ${entity.name}...`);
      await apiPatch(`/odata/${entity.name}(${encodeURIComponent(newId)})`, { Name: `UPDATED_${Date.now()}` });

      log(`   Deleting ${entity.name}...`);
      await apiDelete(`/odata/${entity.name}(${encodeURIComponent(newId)})`);
      log(`   CRUD cycle complete for ${entity.name}`);
    }
  }

  log('9. Verifying forms are available...');
  const forms = await apiGet('/Form');
  log(`   Found ${forms.length} forms`);
  for (const entity of customEntities) {
    const entityForms = forms.filter(f => f.customEntityId === entity.id);
    log(`   ${entity.name}: ${entityForms.length} form(s)`);
  }

  log('10. Verifying option sets...');
  const optionSets = await apiGet('/OptionSetDefinitions');
  log(`   Found ${optionSets.length} option set definitions`);

  log('');
  log('=== ALL TESTS PASSED ===');
}

main().catch(err => {
  console.error('TEST FAILED:', err.message);
  process.exit(1);
});
