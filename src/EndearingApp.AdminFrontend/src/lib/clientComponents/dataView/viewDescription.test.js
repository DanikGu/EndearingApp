import { describe, it, expect } from 'vitest';
import { ViewDescription } from './viewDescription.js';
import { ConditionGroup, Condition } from '../queryBuilder/logic/typeDefinitions.js';

describe('ViewDescription', () => {
  it('creates an instance with defaults', () => {
    const vd = new ViewDescription();
    expect(vd.entityId).toBe('');
    expect(vd.columns).toEqual([]);
    expect(vd.aggregates).toEqual([]);
    expect(vd.filter).toBeNull();
    expect(vd.orderBy).toBe('createdon desc');
    expect(vd.pageSize).toBe(25);
  });

  it('creates an instance with partial init', () => {
    const vd = new ViewDescription({ entityId: 'abc', pageSize: 50 });
    expect(vd.entityId).toBe('abc');
    expect(vd.pageSize).toBe(50);
    expect(vd.orderBy).toBe('createdon desc');
  });

  it('serializes and deserializes via toJSON/fromJSON', () => {
    const vd = new ViewDescription({
      entityId: 'ent-123',
      columns: [
        { id: 'col1', type: 'field', label: 'Name', fieldName: 'Name' },
        { id: 'col2', type: 'field', label: 'Age', fieldName: 'Age' },
      ],
      aggregates: [
        { id: 'agg1', label: 'Count', collectionNavProp: 'Children_EtnColl', sourceField: 'Value', fn: 'count' },
      ],
      orderBy: 'Name asc',
      pageSize: 10,
    });

    const json = vd.toJSON();
    expect(json.entityId).toBe('ent-123');
    expect(json.columns).toHaveLength(2);
    expect(json.aggregates).toHaveLength(1);

    const restored = ViewDescription.fromJSON(json);
    expect(restored.entityId).toBe('ent-123');
    expect(restored.columns).toHaveLength(2);
    expect(restored.columns[0].fieldName).toBe('Name');
    expect(restored.aggregates[0].fn).toBe('count');
    expect(restored.orderBy).toBe('Name asc');
    expect(restored.pageSize).toBe(10);
  });

  it('serializes filter as plain object in toJSON', () => {
    const vd = new ViewDescription();
    vd.filter = new ConditionGroup('and', [
      new Condition('Name', 'contains', 'test', null),
    ]);

    const json = vd.toJSON();
    expect(json.filter).not.toBeNull();
    expect(json.filter.operator).toBe('and');
    expect(json.filter.children[0].field).toBe('Name');
    expect(json.filter.children[0].operation).toBe('contains');
  });

  it('round-trips filter through toJSON/fromJSON', () => {
    const original = new ViewDescription();
    original.filter = new ConditionGroup('or', [
      new Condition('Age', 'gt', 18, null),
      new Condition('Age', 'lt', 65, null),
    ]);

    const json = original.toJSON();
    const restored = ViewDescription.fromJSON(json);
    const filter = /** @type {import('../queryBuilder/logic/typeDefinitions').ConditionGroup} */ (restored.filter);
    expect(filter.operator).toBe('or');
    expect(filter.children).toHaveLength(2);
    const child0 = /** @type {import('../queryBuilder/logic/typeDefinitions').Condition} */ (filter.children[0]);
    expect(child0.field).toBe('Age');
  });

  it('round-trips full view through JSON for localStorage caching', () => {
    const vd = new ViewDescription({
      entityId: 'Animal',
      columns: [
        { id: '6e95f14d-...', type: 'field', label: 'Name', fieldName: 'Name', isNameField: true },
        { id: 'a3fc8c72-...', type: 'expand', label: 'Visitor.Name', fieldName: 'Name', navigationProp: 'VisitorId_Etn', targetEntityName: 'Visitor' },
        { id: 'agg-1', type: 'aggregate', label: 'Count of TicketPrice', fieldName: 'TicketPrice', collectionNavProp: 'FK_Visitor_Animal_EtnColl', sourceField: 'TicketPrice', aggregateFn: 'count' },
      ],
      aggregates: [
        { id: 'agg-1', label: 'Count of TicketPrice', collectionNavProp: 'FK_Visitor_Animal_EtnColl', sourceField: 'TicketPrice', fn: 'count' },
      ],
      filter: { operator: 'and', children: [] },
      orderBy: 'agg-1 desc',
      pageSize: 50,
    });

    const json = vd.toJSON();
    const restored = ViewDescription.fromJSON(json);

    expect(restored.entityId).toBe('Animal');
    expect(restored.columns).toHaveLength(3);
    expect(restored.columns[0].isNameField).toBe(true);
    expect(restored.columns[1].navigationProp).toBe('VisitorId_Etn');
    expect(restored.columns[2].aggregateFn).toBe('count');
    expect(restored.aggregates).toHaveLength(1);
    expect(restored.aggregates[0].fn).toBe('count');
    expect(restored.orderBy).toBe('agg-1 desc');
    expect(restored.pageSize).toBe(50);
    const v = restored.validate();
    expect(v.valid).toBe(true);
  });

  it('round-trips with null filter', () => {
    const vd = new ViewDescription({
      entityId: 'EmptyEntity',
      columns: [{ id: 'c1', type: 'field', label: 'Id', fieldName: 'Id' }],
      orderBy: 'createdon asc',
    });

    const json = vd.toJSON();
    expect(json.filter).toBeNull();
    const restored = ViewDescription.fromJSON(json);
    expect(restored.filter).toBeNull();
  });

  describe('validate', () => {
    it('returns valid for empty but valid view', () => {
      const vd = new ViewDescription({ entityId: 'abc' });
      const result = vd.validate();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns error for missing entityId', () => {
      const vd = new ViewDescription();
      const result = vd.validate();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('entityId is required');
    });

    it('returns error for invalid pageSize', () => {
      const vd = new ViewDescription({ entityId: 'abc', pageSize: 0 });
      const result = vd.validate();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('pageSize must be >= 1');
    });

    it('returns error for duplicate column ids', () => {
      const vd = new ViewDescription({
        entityId: 'abc',
        columns: [
          { id: 'dup', type: 'field', label: 'A' },
          { id: 'dup', type: 'field', label: 'B' },
        ],
      });
      const result = vd.validate();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Duplicate column id: dup');
    });

    it('detects invalid filter operator', () => {
      const vd = new ViewDescription({ entityId: 'abc' });
      const invalidFilter = { operator: 'xor', children: [] };
      vd.filter = /** @type {any} */ (invalidFilter);
      const result = vd.validate();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid filter operator: xor');
    });
  });

  describe('filter serialization class identity', () => {
    /** @param {any} obj @returns {import('../queryBuilder/logic/typeDefinitions.js').ConditionGroup} */
    function reviveConditionGroup(obj) {
      if (!obj || typeof obj !== 'object') return new ConditionGroup('and', []);
      if (obj.children && Array.isArray(obj.children) && (obj.operator === 'and' || obj.operator === 'or')) {
        const group = new ConditionGroup(obj.operator, []);
        group.children = obj.children.map((/** @type {any} */ child) => {
          if (child && child.children && Array.isArray(child.children) && (child.operator === 'and' || child.operator === 'or')) {
            return reviveConditionGroup(child);
          }
          if (child && typeof child.field === 'string' && typeof child.operation === 'string') {
            return new Condition(child.field, child.operation, child.value, child.fieldDto || null);
          }
          return child;
        });
        return group;
      }
      return new ConditionGroup('and', []);
    }

    it('toJSON produces plain object filter (not class instances)', () => {
      const vd = new ViewDescription({ entityId: 'abc' });
      vd.filter = new ConditionGroup('and', [
        new Condition('Name', 'contains', 'test', null),
      ]);

      const json = vd.toJSON();
      expect(json.filter).not.toBeNull();
      expect(json.filter instanceof ConditionGroup).toBe(false);
      const child0 = /** @type {any} */ (json.filter.children[0]);
      expect(child0 instanceof Condition).toBe(false);
    });

    it('fromJSON produces plain object filter (not class instances)', () => {
      const original = new ViewDescription({ entityId: 'abc' });
      original.filter = new ConditionGroup('or', [
        new Condition('Age', 'gt', 18, null),
        new Condition('Age', 'lt', 65, null),
      ]);

      const json = original.toJSON();
      const restored = ViewDescription.fromJSON(json);

      expect(restored.filter).not.toBeNull();
      const restoredFilter = /** @type {any} */ (restored.filter);
      expect(restoredFilter instanceof ConditionGroup).toBe(false);
      const child0 = /** @type {any} */ (restoredFilter.children[0]);
      expect(child0 instanceof Condition).toBe(false);
    });

    it('reviveConditionGroup converts plain object filter to proper instances', () => {
      const plain = {
        operator: 'and',
        children: [
          { field: 'Name', operation: 'contains', value: 'test', fieldDto: null },
          {
            operator: 'or',
            children: [
              { field: 'Age', operation: 'gt', value: 10, fieldDto: null },
            ],
          },
        ],
      };

      const revived = reviveConditionGroup(plain);
      expect(revived instanceof ConditionGroup).toBe(true);
      const child0 = /** @type {import('../queryBuilder/logic/typeDefinitions.js').Condition} */ (revived.children[0]);
      expect(child0 instanceof Condition).toBe(true);
      expect(child0.field).toBe('Name');
      const child1 = /** @type {import('../queryBuilder/logic/typeDefinitions.js').ConditionGroup} */ (revived.children[1]);
      expect(child1 instanceof ConditionGroup).toBe(true);
      expect(child1.operator).toBe('or');
      const nestedChild = /** @type {import('../queryBuilder/logic/typeDefinitions.js').Condition} */ (child1.children[0]);
      expect(nestedChild instanceof Condition).toBe(true);
      expect(nestedChild.field).toBe('Age');
    });

    it('reviveConditionGroup handles null/undefined gracefully', () => {
      expect(reviveConditionGroup(null) instanceof ConditionGroup).toBe(true);
      expect(reviveConditionGroup(undefined) instanceof ConditionGroup).toBe(true);
      expect(reviveConditionGroup({}) instanceof ConditionGroup).toBe(true);
      expect(reviveConditionGroup({ x: 1 }) instanceof ConditionGroup).toBe(true);
    });

    it('round-trip: toJSON → fromJSON → reviveConditionGroup produces working instances', () => {
      const original = new ViewDescription({ entityId: 'Animal' });
      original.filter = new ConditionGroup('and', [
        new Condition('Name', 'contains', 'a', null),
        new ConditionGroup('or', [
          new Condition('Age', 'gt', 5, null),
          new Condition('Weight', 'lt', 100, null),
        ]),
      ]);

      const json = original.toJSON();
      const restored = ViewDescription.fromJSON(json);
      const revived = reviveConditionGroup(restored.filter);

      expect(revived instanceof ConditionGroup).toBe(true);
      expect(revived.operator).toBe('and');
      expect(revived.children).toHaveLength(2);
      const child0 = /** @type {import('../queryBuilder/logic/typeDefinitions.js').Condition} */ (revived.children[0]);
      expect(child0 instanceof Condition).toBe(true);
      expect(child0.field).toBe('Name');
      expect(child0.value).toBe('a');
      const child1 = /** @type {import('../queryBuilder/logic/typeDefinitions.js').ConditionGroup} */ (revived.children[1]);
      expect(child1 instanceof ConditionGroup).toBe(true);
      const nested0 = /** @type {import('../queryBuilder/logic/typeDefinitions.js').Condition} */ (child1.children[0]);
      expect(nested0 instanceof Condition).toBe(true);
      expect(nested0.field).toBe('Age');
      const nested1 = /** @type {import('../queryBuilder/logic/typeDefinitions.js').Condition} */ (child1.children[1]);
      expect(nested1.field).toBe('Weight');
    });
  });
});
