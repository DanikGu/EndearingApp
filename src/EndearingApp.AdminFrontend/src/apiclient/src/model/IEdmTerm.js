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
import EdmSchemaElementKind from './EdmSchemaElementKind';
import IEdmTypeReference from './IEdmTypeReference';

/**
 * The IEdmTerm model module.
 * @module model/IEdmTerm
 * @version 1.0
 */
export default class IEdmTerm {
  /**
   * Constructs a new <code>IEdmTerm</code>.
   * @alias module:model/IEdmTerm
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>IEdmTerm</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IEdmTerm} obj Optional instance to populate.
   * @return {module:model/IEdmTerm} The populated <code>IEdmTerm</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new IEdmTerm();
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('schemaElementKind'))
        obj.schemaElementKind = EdmSchemaElementKind.constructFromObject(data['schemaElementKind']);
      if (data.hasOwnProperty('namespace'))
        obj.namespace = ApiClient.convertToType(data['namespace'], 'String');
      if (data.hasOwnProperty('type'))
        obj.type = IEdmTypeReference.constructFromObject(data['type']);
      if (data.hasOwnProperty('appliesTo'))
        obj.appliesTo = ApiClient.convertToType(data['appliesTo'], 'String');
      if (data.hasOwnProperty('defaultValue'))
        obj.defaultValue = ApiClient.convertToType(data['defaultValue'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
IEdmTerm.prototype.name = undefined;

/**
 * @member {module:model/EdmSchemaElementKind} schemaElementKind
 */
IEdmTerm.prototype.schemaElementKind = undefined;

/**
 * @member {String} namespace
 */
IEdmTerm.prototype.namespace = undefined;

/**
 * @member {module:model/IEdmTypeReference} type
 */
IEdmTerm.prototype.type = undefined;

/**
 * @member {String} appliesTo
 */
IEdmTerm.prototype.appliesTo = undefined;

/**
 * @member {String} defaultValue
 */
IEdmTerm.prototype.defaultValue = undefined;
