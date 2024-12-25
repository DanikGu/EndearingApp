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
 * The ICustomAttributeProvider model module.
 * @module model/ICustomAttributeProvider
 * @version 1.0
 */
export default class ICustomAttributeProvider {
  /**
   * Constructs a new <code>ICustomAttributeProvider</code>.
   * @alias module:model/ICustomAttributeProvider
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>ICustomAttributeProvider</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ICustomAttributeProvider} obj Optional instance to populate.
   * @return {module:model/ICustomAttributeProvider} The populated <code>ICustomAttributeProvider</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ICustomAttributeProvider();
    }
    return obj;
  }
}