import buildQuery, { guid, duration } from 'odata-query';
import { Condition, ConditionGroup } from './typeDefinitions';
import { getTypeName } from '@utils/fieldtypesutils';

/** @param {import('./typeDefinitions').ConditionGroup} query
 *  @returns {string} */
export function convertToOdataFilter(query) {
  const filterObj = buildFilterObject(query);
  if (!filterObj) return '';

  const fullQuery = buildQuery({ filter: filterObj });
  const match = fullQuery.match(/\$filter=(.+)/);
  return match ? match[1] : '';
}

/** @param {import('./typeDefinitions').Condition | import('./typeDefinitions').ConditionGroup} item
 *  @returns {Object | null} */
function buildFilterObject(item) {
  if (item instanceof ConditionGroup) {
    if (!item.children || item.children.length === 0) return null;

    /** @type {(Object | null)[]} */
    const childrenFilters = item.children
      .map(child => buildFilterObject(child))
      .filter(f => f != null);

    if (childrenFilters.length === 0) return null;
    if (childrenFilters.length === 1) return childrenFilters[0];

    return { [item.operator]: childrenFilters };
  }

  if (item instanceof Condition) {
    const { field, operation, value, fieldDto } = item;
    if (!field || !operation || !fieldDto) return null;
    if (value === null || value === undefined || value === '') {
      if (operation === 'eq' || operation === 'ne') {
        return { [field]: { [operation]: null } };
      }
      return null;
    }

    const formattedValue = formatValueForOdataQuery(value, fieldDto, operation);
    if (formattedValue === null || formattedValue === undefined) return null;

    return { [field]: { [operation]: formattedValue } };
  }

  return null;
}

/** @param {any} value
 *  @param {import('@apiclients/src').default.FieldDto} fieldDefinition
 *  @param {string} operation
 *  @returns {any} */
function formatValueForOdataQuery(value, fieldDefinition, operation) {
  const typeName = getTypeName(fieldDefinition.type);

  if (['contains', 'startswith', 'endswith'].includes(operation)) {
    return String(value);
  }

  switch (typeName) {
    case 'Unlimited Text':
    case 'Limited Text':
      if (operation === 'in') {
        return parseInValues(value, 'string');
      }
      return String(value);

    case 'Whole Number':
    case 'Whole Number (Small)':
    case 'Whole Number (Big)':
      if (operation === 'in') {
        return parseInValues(value, 'number');
      }
      return Number(value);

    case 'Decimal Number':
      if (operation === 'in') {
        return parseInValues(value, 'decimal');
      }
      return { type: 'decimal', value: String(value) };

    case 'Date and Time':
    case 'Date': {
      if (operation === 'in') {
        return parseInValues(value, 'date');
      }
      const d = new Date(value);
      return isNaN(d.getTime()) ? value : d;
    }

    case 'Time':
      if (operation === 'in') {
        return parseInValues(value, 'duration');
      }
      return duration(value);

    case 'Yes/No':
      return value === true || value === 'true' || value === 1 || value === '1';

    case 'Unique Identifier':
      if (operation === 'in') {
        return parseInValues(value, 'guid');
      }
      return guid(value);

    case 'Option Set':
    case 'Option Set MultiSelect':
      if (operation === 'in') {
        if (Array.isArray(value)) {
          return value.map(v => Number(v));
        }
        return parseInValues(value, 'number');
      }
      return Number(value);

    case 'Binary Data':
      return null;

    default:
      return String(value);
  }
}

/** @param {any} value
 *  @param {string} type
 *  @returns {any[]} */
function parseInValues(value, type) {
  let values = Array.isArray(value) ? value : String(value).split(',').map(v => v.trim()).filter(v => v !== '');

  switch (type) {
    case 'number':
      return values.map(v => Number(v));
    case 'string':
      return values;
    case 'guid':
      return values.map(v => guid(v));
    case 'decimal':
      return values.map(v => ({ type: 'decimal', value: String(v) }));
    case 'duration':
      return values.map(v => duration(v));
    case 'date':
      return values.map(v => {
        const d = new Date(v);
        return isNaN(d.getTime()) ? v : d;
      });
    default:
      return values;
  }
}
