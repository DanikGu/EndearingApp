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
import IEdmExpression from './IEdmExpression';
import IEdmTerm from './IEdmTerm';
import IEdmVocabularyAnnotatable from './IEdmVocabularyAnnotatable';

/**
 * The IEdmVocabularyAnnotation model module.
 * @module model/IEdmVocabularyAnnotation
 * @version 1.0
 */
export default class IEdmVocabularyAnnotation {
  /**
   * Constructs a new <code>IEdmVocabularyAnnotation</code>.
   * @alias module:model/IEdmVocabularyAnnotation
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>IEdmVocabularyAnnotation</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IEdmVocabularyAnnotation} obj Optional instance to populate.
   * @return {module:model/IEdmVocabularyAnnotation} The populated <code>IEdmVocabularyAnnotation</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new IEdmVocabularyAnnotation();
      if (data.hasOwnProperty('qualifier'))
        obj.qualifier = ApiClient.convertToType(data['qualifier'], 'String');
      if (data.hasOwnProperty('term'))
        obj.term = IEdmTerm.constructFromObject(data['term']);
      if (data.hasOwnProperty('target'))
        obj.target = IEdmVocabularyAnnotatable.constructFromObject(data['target']);
      if (data.hasOwnProperty('value'))
        obj.value = IEdmExpression.constructFromObject(data['value']);
      if (data.hasOwnProperty('usesDefault'))
        obj.usesDefault = ApiClient.convertToType(data['usesDefault'], 'Boolean');
    }
    return obj;
  }
}

/**
 * @member {String} qualifier
 */
IEdmVocabularyAnnotation.prototype.qualifier = undefined;

/**
 * @member {module:model/IEdmTerm} term
 */
IEdmVocabularyAnnotation.prototype.term = undefined;

/**
 * @member {module:model/IEdmVocabularyAnnotatable} target
 */
IEdmVocabularyAnnotation.prototype.target = undefined;

/**
 * @member {module:model/IEdmExpression} value
 */
IEdmVocabularyAnnotation.prototype.value = undefined;

/**
 * @member {Boolean} usesDefault
 */
IEdmVocabularyAnnotation.prototype.usesDefault = undefined;
