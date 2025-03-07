/*
 * EndearingApp.Web
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.64-SNAPSHOT
 *
 * Do not edit the class manually.
 *
 */
import ApiClient from '../ApiClient';

/**
 * Enum class ValidationSeverity.
 * @enum {Number}
 * @readonly
 */
const ValidationSeverity = {
  /**
   * value: 0
   * @const
   */
  _0: 0,

  /**
   * value: 1
   * @const
   */
  _1: 1,

  /**
   * value: 2
   * @const
   */
  _2: 2,

  /**
   * Returns a <code>ValidationSeverity</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/ValidationSeverity} The enum <code>ValidationSeverity</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export default {ValidationSeverity};