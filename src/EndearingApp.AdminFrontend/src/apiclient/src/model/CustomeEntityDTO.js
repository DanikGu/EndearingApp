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
import FieldDto from './FieldDto';
import RelationshipDTO from './RelationshipDTO';

/**
 * The CustomeEntityDTO model module.
 * @module model/CustomeEntityDTO
 * @version 1.0
 */
export default class CustomeEntityDTO {
  /**
   * Constructs a new <code>CustomeEntityDTO</code>.
   * @alias module:model/CustomeEntityDTO
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>CustomeEntityDTO</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomeEntityDTO} obj Optional instance to populate.
   * @return {module:model/CustomeEntityDTO} The populated <code>CustomeEntityDTO</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CustomeEntityDTO();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'String');
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('displayName'))
        obj.displayName = ApiClient.convertToType(data['displayName'], 'String');
      if (data.hasOwnProperty('description'))
        obj.description = ApiClient.convertToType(data['description'], 'String');
      if (data.hasOwnProperty('metadata'))
        obj.metadata = ApiClient.convertToType(data['metadata'], 'String');
      if (data.hasOwnProperty('fields'))
        obj.fields = ApiClient.convertToType(data['fields'], [FieldDto]);
      if (data.hasOwnProperty('relationships'))
        obj.relationships = ApiClient.convertToType(data['relationships'], [RelationshipDTO]);
    }
    return obj;
  }
}

/**
 * @member {String} id
 */
CustomeEntityDTO.prototype.id = undefined;

/**
 * @member {String} name
 */
CustomeEntityDTO.prototype.name = undefined;

/**
 * @member {String} displayName
 */
CustomeEntityDTO.prototype.displayName = undefined;

/**
 * @member {String} description
 */
CustomeEntityDTO.prototype.description = undefined;

/**
 * @member {String} metadata
 */
CustomeEntityDTO.prototype.metadata = undefined;

/**
 * @member {Array.<module:model/FieldDto>} fields
 */
CustomeEntityDTO.prototype.fields = undefined;

/**
 * @member {Array.<module:model/RelationshipDTO>} relationships
 */
CustomeEntityDTO.prototype.relationships = undefined;

