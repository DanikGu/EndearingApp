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
 * The SettingDTO model module.
 * @module model/SettingDTO
 * @version 1.0
 */
export default class SettingDTO {
  /**
   * Constructs a new <code>SettingDTO</code>.
   * @alias module:model/SettingDTO
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>SettingDTO</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SettingDTO} obj Optional instance to populate.
   * @return {module:model/SettingDTO} The populated <code>SettingDTO</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new SettingDTO();
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('description'))
        obj.description = ApiClient.convertToType(data['description'], 'String');
      if (data.hasOwnProperty('jsonSetting'))
        obj.jsonSetting = ApiClient.convertToType(data['jsonSetting'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
SettingDTO.prototype.name = undefined;

/**
 * @member {String} description
 */
SettingDTO.prototype.description = undefined;

/**
 * @member {String} jsonSetting
 */
SettingDTO.prototype.jsonSetting = undefined;

