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
});
