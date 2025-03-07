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
import ResultStatus from './ResultStatus';
import ValidationError from './ValidationError';

/**
 * The FieldDtoResult model module.
 * @module model/FieldDtoResult
 * @version 1.0
 */
export default class FieldDtoResult {
  /**
   * Constructs a new <code>FieldDtoResult</code>.
   * @alias module:model/FieldDtoResult
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>FieldDtoResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/FieldDtoResult} obj Optional instance to populate.
   * @return {module:model/FieldDtoResult} The populated <code>FieldDtoResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new FieldDtoResult();
      if (data.hasOwnProperty('value'))
        obj.value = FieldDto.constructFromObject(data['value']);
      if (data.hasOwnProperty('status'))
        obj.status = ResultStatus.constructFromObject(data['status']);
      if (data.hasOwnProperty('isSuccess'))
        obj.isSuccess = ApiClient.convertToType(data['isSuccess'], 'Boolean');
      if (data.hasOwnProperty('successMessage'))
        obj.successMessage = ApiClient.convertToType(data['successMessage'], 'String');
      if (data.hasOwnProperty('correlationId'))
        obj.correlationId = ApiClient.convertToType(data['correlationId'], 'String');
      if (data.hasOwnProperty('location'))
        obj.location = ApiClient.convertToType(data['location'], 'String');
      if (data.hasOwnProperty('errors'))
        obj.errors = ApiClient.convertToType(data['errors'], ['String']);
      if (data.hasOwnProperty('validationErrors'))
        obj.validationErrors = ApiClient.convertToType(data['validationErrors'], [ValidationError]);
    }
    return obj;
  }
}

/**
 * @member {module:model/FieldDto} value
 */
FieldDtoResult.prototype.value = undefined;

/**
 * @member {module:model/ResultStatus} status
 */
FieldDtoResult.prototype.status = undefined;

/**
 * @member {Boolean} isSuccess
 */
FieldDtoResult.prototype.isSuccess = undefined;

/**
 * @member {String} successMessage
 */
FieldDtoResult.prototype.successMessage = undefined;

/**
 * @member {String} correlationId
 */
FieldDtoResult.prototype.correlationId = undefined;

/**
 * @member {String} location
 */
FieldDtoResult.prototype.location = undefined;

/**
 * @member {Array.<String>} errors
 */
FieldDtoResult.prototype.errors = undefined;

/**
 * @member {Array.<module:model/ValidationError>} validationErrors
 */
FieldDtoResult.prototype.validationErrors = undefined;

