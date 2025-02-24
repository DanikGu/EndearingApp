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
import CustomAttributeData from './CustomAttributeData';
import MemberTypes from './MemberTypes';
import MethodInfo from './MethodInfo';
import Module from './Module';
import PropertyAttributes from './PropertyAttributes';
import Type from './Type';

/**
 * The PropertyInfo model module.
 * @module model/PropertyInfo
 * @version 1.0
 */
export default class PropertyInfo {
  /**
   * Constructs a new <code>PropertyInfo</code>.
   * @alias module:model/PropertyInfo
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>PropertyInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PropertyInfo} obj Optional instance to populate.
   * @return {module:model/PropertyInfo} The populated <code>PropertyInfo</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new PropertyInfo();
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('declaringType'))
        obj.declaringType = Type.constructFromObject(data['declaringType']);
      if (data.hasOwnProperty('reflectedType'))
        obj.reflectedType = Type.constructFromObject(data['reflectedType']);
      if (data.hasOwnProperty('module'))
        obj.module = Module.constructFromObject(data['module']);
      if (data.hasOwnProperty('customAttributes'))
        obj.customAttributes = ApiClient.convertToType(data['customAttributes'], [CustomAttributeData]);
      if (data.hasOwnProperty('isCollectible'))
        obj.isCollectible = ApiClient.convertToType(data['isCollectible'], 'Boolean');
      if (data.hasOwnProperty('metadataToken'))
        obj.metadataToken = ApiClient.convertToType(data['metadataToken'], 'Number');
      if (data.hasOwnProperty('memberType'))
        obj.memberType = MemberTypes.constructFromObject(data['memberType']);
      if (data.hasOwnProperty('propertyType'))
        obj.propertyType = Type.constructFromObject(data['propertyType']);
      if (data.hasOwnProperty('attributes'))
        obj.attributes = PropertyAttributes.constructFromObject(data['attributes']);
      if (data.hasOwnProperty('isSpecialName'))
        obj.isSpecialName = ApiClient.convertToType(data['isSpecialName'], 'Boolean');
      if (data.hasOwnProperty('canRead'))
        obj.canRead = ApiClient.convertToType(data['canRead'], 'Boolean');
      if (data.hasOwnProperty('canWrite'))
        obj.canWrite = ApiClient.convertToType(data['canWrite'], 'Boolean');
      if (data.hasOwnProperty('getMethod'))
        obj.getMethod = MethodInfo.constructFromObject(data['getMethod']);
      if (data.hasOwnProperty('setMethod'))
        obj.setMethod = MethodInfo.constructFromObject(data['setMethod']);
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
PropertyInfo.prototype.name = undefined;

/**
 * @member {module:model/Type} declaringType
 */
PropertyInfo.prototype.declaringType = undefined;

/**
 * @member {module:model/Type} reflectedType
 */
PropertyInfo.prototype.reflectedType = undefined;

/**
 * @member {module:model/Module} module
 */
PropertyInfo.prototype.module = undefined;

/**
 * @member {Array.<module:model/CustomAttributeData>} customAttributes
 */
PropertyInfo.prototype.customAttributes = undefined;

/**
 * @member {Boolean} isCollectible
 */
PropertyInfo.prototype.isCollectible = undefined;

/**
 * @member {Number} metadataToken
 */
PropertyInfo.prototype.metadataToken = undefined;

/**
 * @member {module:model/MemberTypes} memberType
 */
PropertyInfo.prototype.memberType = undefined;

/**
 * @member {module:model/Type} propertyType
 */
PropertyInfo.prototype.propertyType = undefined;

/**
 * @member {module:model/PropertyAttributes} attributes
 */
PropertyInfo.prototype.attributes = undefined;

/**
 * @member {Boolean} isSpecialName
 */
PropertyInfo.prototype.isSpecialName = undefined;

/**
 * @member {Boolean} canRead
 */
PropertyInfo.prototype.canRead = undefined;

/**
 * @member {Boolean} canWrite
 */
PropertyInfo.prototype.canWrite = undefined;

/**
 * @member {module:model/MethodInfo} getMethod
 */
PropertyInfo.prototype.getMethod = undefined;

/**
 * @member {module:model/MethodInfo} setMethod
 */
PropertyInfo.prototype.setMethod = undefined;

