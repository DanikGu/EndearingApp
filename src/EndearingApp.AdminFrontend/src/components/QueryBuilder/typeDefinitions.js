/**
 * @class Field
 * @property {string} name - The actual name or identifier of the field.
 * @property {string} displayName - The user-friendly name for display purposes.
 */
class Field {
  /**
   * @param {string} name - The actual name or identifier of the field.
   * @param {string} displayName - The user-friendly name for display purposes.
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
   * @property {string} value
   */
class Condition {
  /**
   * @param {string} field
   * @param {string} operation
   * @param {string} value
   */
  constructor(field, operation, value) {
    this.field = field;
    this.operation = operation;
    this.value = value;
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
