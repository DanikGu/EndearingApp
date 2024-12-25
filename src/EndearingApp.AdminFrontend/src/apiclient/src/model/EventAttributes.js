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
 * Enum class EventAttributes.
 * @enum {Number}
 * @readonly
 */
const EventAttributes = {
  /**
   * value: 0
   * @const
   */
  _0: 0,

  /**
   * value: 512
   * @const
   */
  _512: 512,

  /**
   * value: 1024
   * @const
   */
  _1024: 1024,

  /**
   * Returns a <code>EventAttributes</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/EventAttributes} The enum <code>EventAttributes</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export default {EventAttributes};