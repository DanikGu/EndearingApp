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
 * The IntPtr model module.
 * @module model/IntPtr
 * @version 1.0
 */
export default class IntPtr {
  /**
   * Constructs a new <code>IntPtr</code>.
   * @alias module:model/IntPtr
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>IntPtr</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IntPtr} obj Optional instance to populate.
   * @return {module:model/IntPtr} The populated <code>IntPtr</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new IntPtr();
    }
    return obj;
  }
}
