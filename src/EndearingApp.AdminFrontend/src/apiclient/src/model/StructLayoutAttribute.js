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
import LayoutKind from './LayoutKind';

/**
 * The StructLayoutAttribute model module.
 * @module model/StructLayoutAttribute
 * @version 1.0
 */
export default class StructLayoutAttribute {
  /**
   * Constructs a new <code>StructLayoutAttribute</code>.
   * @alias module:model/StructLayoutAttribute
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>StructLayoutAttribute</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StructLayoutAttribute} obj Optional instance to populate.
   * @return {module:model/StructLayoutAttribute} The populated <code>StructLayoutAttribute</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new StructLayoutAttribute();
      if (data.hasOwnProperty('typeId'))
        obj.typeId = ApiClient.convertToType(data['typeId'], Object);
      if (data.hasOwnProperty('value'))
        obj.value = LayoutKind.constructFromObject(data['value']);
    }
    return obj;
  }
}

/**
 * @member {Object} typeId
 */
StructLayoutAttribute.prototype.typeId = undefined;

/**
 * @member {module:model/LayoutKind} value
 */
StructLayoutAttribute.prototype.value = undefined;

