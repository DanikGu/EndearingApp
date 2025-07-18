import { FieldDto } from "@apiclients/src";
import { Condition, ConditionGroup } from "./typeDefinitions";
import { getTypeId } from "@utils/fieldtypesutils";

/** @param {ConditionGroup} query 
 *  @returns {string} */
export function convertToOdataFilter(query) {
  /**
   * @param {Condition | ConditionGroup} item - The item to process.
   * @returns {string} The OData string for the given item.
   */
  const processItem = (item) => {
    if (item instanceof ConditionGroup) {
      if (item.children.length === 0) {
        return '';
      }

      const childrenClauses = item.children
        .map(child => processItem(child))
        .filter(clause => clause)
        .join(` ${item.operator} `);

      return item.children.length > 1 ? `(${childrenClauses})` : childrenClauses;
    }

    if (item instanceof Condition) {
      const { field, operation, value, fieldDto } = item;

      if (!field || !operation || !fieldDto || !value) {
        return '';
      }

      const formattedValue = formatValue(value, fieldDto)
      return `${field} ${operation} ${formattedValue}`;
    }

    return '';
  };

  return processItem(query);
}

/** @param {any} value 
 *  @param {FieldDto} fieldDefinition 
 *  @return {any} **/
function formatValue(value, fieldDefinition) {
  const formatAs = {
    [getTypeId("Unlimited Text")]: "string",
    [getTypeId("Limited Text")]: "string",
    [getTypeId("Whole Number")]: "raw",
    [getTypeId("Whole Number (Small)")]: "raw",
    [getTypeId("Whole Number (Big)")]: "raw",
    [getTypeId("Decimal Number")]: "raw",
    [getTypeId("Date and Time")]: "date",
    [getTypeId("Date")]: "date",
    [getTypeId("Time")]: "time",
    [getTypeId("Yes/No")]: "raw",
    [getTypeId("Binary Data")]: "unsupported",
    [getTypeId("Unique Identifier")]: "guid",
    [getTypeId("Option Set")]: "select",
    [getTypeId("Option Set MultiSelect")]: "select",
  }[fieldDefinition.type];

  if (formatAs === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  } else if (formatAs === "raw") {
    return value;
  } else if (formatAs === "date") {

  }
  else if (formatAs === "select") {

  } else if (formatAs === "guid") {

  }
}

