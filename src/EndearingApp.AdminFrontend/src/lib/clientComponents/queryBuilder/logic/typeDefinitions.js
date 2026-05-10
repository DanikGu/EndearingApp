import { FieldDto } from "@apiclients/src";

/**
 * @class Field
 * @property {string} name
 * @property {string} displayName
 */
class Field {
  /**
   * @param {string} name
   * @param {string} displayName
   */
  constructor(name, displayName) {
    this.name = name;
    this.displayName = displayName;
  }
}

/**
 * @class Condition
 * @property {string} field
 * @property {string} operation
 * @property {any} value
 * @property {FieldDto | null} fieldDto
 */
class Condition {
  /**
   * @param {string} field
   * @param {string} operation
   * @param {any} value
   * @param {FieldDto | null} fieldDto
   */
  constructor(field, operation, value, fieldDto) {
    this.field = field;
    this.operation = operation;
    this.value = value;
    this.fieldDto = fieldDto;
  }
}

/**
 * @class ConditionGroup
 * @property {(Condition | ConditionGroup)[]} children
 * @property {"and" | "or"} operator
 */
class ConditionGroup {
  /**
   * @param {"and" | "or"} operator
   * @param {(Condition | ConditionGroup)[]} children
   */
  constructor(operator, children = []) {
    this.operator = operator;
    this.children = children;
  }
}

export { Condition, ConditionGroup, Field }
