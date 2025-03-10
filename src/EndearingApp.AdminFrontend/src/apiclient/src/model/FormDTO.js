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
 * The FormDTO model module.
 * @module model/FormDTO
 * @version 1.0
 */
export default class FormDTO {
  /**
   * Constructs a new <code>FormDTO</code>.
   * @alias module:model/FormDTO
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>FormDTO</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/FormDTO} obj Optional instance to populate.
   * @return {module:model/FormDTO} The populated <code>FormDTO</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new FormDTO();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'String');
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('description'))
        obj.description = ApiClient.convertToType(data['description'], 'String');
      if (data.hasOwnProperty('jsonSchema'))
        obj.jsonSchema = ApiClient.convertToType(data['jsonSchema'], 'String');
      if (data.hasOwnProperty('customEntityId'))
        obj.customEntityId = ApiClient.convertToType(data['customEntityId'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} id
 */
FormDTO.prototype.id = undefined;

/**
 * @member {String} name
 */
FormDTO.prototype.name = undefined;

/**
 * @member {String} description
 */
FormDTO.prototype.description = undefined;

/**
 * @member {String} jsonSchema
 */
FormDTO.prototype.jsonSchema = undefined;

/**
 * @member {String} customEntityId
 */
FormDTO.prototype.customEntityId = undefined;

