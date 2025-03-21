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
import ApiClient from "../ApiClient";
import FieldDto from '../model/FieldDto';
import ProblemDetails from '../model/ProblemDetails';
import ValidationProblemDetails from '../model/ValidationProblemDetails';

/**
* Fields service.
* @module api/FieldsApi
* @version 1.0
*/
export default class FieldsApi {

    /**
    * Constructs a new FieldsApi. 
    * @alias module:api/FieldsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the apiFieldsGet operation.
     * @callback moduleapi/FieldsApi~apiFieldsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/FieldDto>{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/FieldsApi~apiFieldsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiFieldsGet(callback) {
      
      let postBody = null;

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'application/octet-stream', 'text/json'];
      let returnType = [FieldDto];

      return this.apiClient.callApi(
        '/api/Fields', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiFieldsIdDelete operation.
     * @callback moduleapi/FieldsApi~apiFieldsIdDeleteCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} id 
     * @param {module:api/FieldsApi~apiFieldsIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     */
    apiFieldsIdDelete(id, callback) {
      
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiFieldsIdDelete");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'application/octet-stream', 'text/json'];
      let returnType = null;

      return this.apiClient.callApi(
        '/api/Fields/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiFieldsIdGet operation.
     * @callback moduleapi/FieldsApi~apiFieldsIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/FieldDto{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} id 
     * @param {module:api/FieldsApi~apiFieldsIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiFieldsIdGet(id, callback) {
      
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiFieldsIdGet");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'application/octet-stream', 'text/json'];
      let returnType = FieldDto;

      return this.apiClient.callApi(
        '/api/Fields/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiFieldsIdPut operation.
     * @callback moduleapi/FieldsApi~apiFieldsIdPutCallback
     * @param {String} error Error message, if any.
     * @param {module:model/FieldDto{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} id 
     * @param {Object} opts Optional parameters
     * @param {module:model/FieldDto} opts.body 
     * @param {module:api/FieldsApi~apiFieldsIdPutCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiFieldsIdPut(id, opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiFieldsIdPut");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'text/json', 'application/_*+json'];
      let accepts = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'application/octet-stream', 'text/json'];
      let returnType = FieldDto;

      return this.apiClient.callApi(
        '/api/Fields/{id}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiFieldsPatch operation.
     * @callback moduleapi/FieldsApi~apiFieldsPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/FieldDto{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.id 
     * @param {String} opts.fieldDelta 
     * @param {module:api/FieldsApi~apiFieldsPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiFieldsPatch(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
        
      };
      let queryParams = {
        'id': opts['id'],'fieldDelta': opts['fieldDelta']
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'application/octet-stream', 'text/json'];
      let returnType = FieldDto;

      return this.apiClient.callApi(
        '/api/Fields', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiFieldsPost operation.
     * @callback moduleapi/FieldsApi~apiFieldsPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/FieldDto{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {module:model/FieldDto} opts.body 
     * @param {module:api/FieldsApi~apiFieldsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiFieldsPost(opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'text/json', 'application/_*+json'];
      let accepts = ['application/json;odata.metadata=minimal;odata.streaming=true', 'application/json;odata.metadata=minimal;odata.streaming=false', 'application/json;odata.metadata=minimal', 'application/json;odata.metadata=full;odata.streaming=true', 'application/json;odata.metadata=full;odata.streaming=false', 'application/json;odata.metadata=full', 'application/json;odata.metadata=none;odata.streaming=true', 'application/json;odata.metadata=none;odata.streaming=false', 'application/json;odata.metadata=none', 'application/json;odata.streaming=true', 'application/json;odata.streaming=false', 'application/json', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=minimal;IEEE754Compatible=false', 'application/json;odata.metadata=minimal;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=full;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=full;IEEE754Compatible=false', 'application/json;odata.metadata=full;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.metadata=none;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=true', 'application/json;odata.metadata=none;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=false', 'application/json;odata.metadata=none;IEEE754Compatible=true', 'application/json;odata.streaming=true;IEEE754Compatible=false', 'application/json;odata.streaming=true;IEEE754Compatible=true', 'application/json;odata.streaming=false;IEEE754Compatible=false', 'application/json;odata.streaming=false;IEEE754Compatible=true', 'application/json;IEEE754Compatible=false', 'application/json;IEEE754Compatible=true', 'application/xml', 'text/plain', 'application/octet-stream', 'text/json'];
      let returnType = FieldDto;

      return this.apiClient.callApi(
        '/api/Fields', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}