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
import OptionSetDefinitionDTO from '../model/OptionSetDefinitionDTO';
import ProblemDetails from '../model/ProblemDetails';
import ValidationProblemDetails from '../model/ValidationProblemDetails';

/**
* OptionSetDefinitions service.
* @module api/OptionSetDefinitionsApi
* @version 1.0
*/
export default class OptionSetDefinitionsApi {

    /**
    * Constructs a new OptionSetDefinitionsApi. 
    * @alias module:api/OptionSetDefinitionsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the apiOptionSetDefinitionsGet operation.
     * @callback moduleapi/OptionSetDefinitionsApi~apiOptionSetDefinitionsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/OptionSetDefinitionDTO>{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/OptionSetDefinitionsApi~apiOptionSetDefinitionsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiOptionSetDefinitionsGet(callback) {
      
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
      let returnType = [OptionSetDefinitionDTO];

      return this.apiClient.callApi(
        '/api/OptionSetDefinitions', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiOptionSetDefinitionsIdDelete operation.
     * @callback moduleapi/OptionSetDefinitionsApi~apiOptionSetDefinitionsIdDeleteCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} id 
     * @param {module:api/OptionSetDefinitionsApi~apiOptionSetDefinitionsIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     */
    apiOptionSetDefinitionsIdDelete(id, callback) {
      
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiOptionSetDefinitionsIdDelete");
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
        '/api/OptionSetDefinitions/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiOptionSetDefinitionsIdGet operation.
     * @callback moduleapi/OptionSetDefinitionsApi~apiOptionSetDefinitionsIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OptionSetDefinitionDTO{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} id 
     * @param {module:api/OptionSetDefinitionsApi~apiOptionSetDefinitionsIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiOptionSetDefinitionsIdGet(id, callback) {
      
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiOptionSetDefinitionsIdGet");
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
      let returnType = OptionSetDefinitionDTO;

      return this.apiClient.callApi(
        '/api/OptionSetDefinitions/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiOptionSetDefinitionsIdPut operation.
     * @callback moduleapi/OptionSetDefinitionsApi~apiOptionSetDefinitionsIdPutCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OptionSetDefinitionDTO{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} id 
     * @param {Object} opts Optional parameters
     * @param {module:model/OptionSetDefinitionDTO} opts.body 
     * @param {module:api/OptionSetDefinitionsApi~apiOptionSetDefinitionsIdPutCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiOptionSetDefinitionsIdPut(id, opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiOptionSetDefinitionsIdPut");
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
      let returnType = OptionSetDefinitionDTO;

      return this.apiClient.callApi(
        '/api/OptionSetDefinitions/{id}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the apiOptionSetDefinitionsPost operation.
     * @callback moduleapi/OptionSetDefinitionsApi~apiOptionSetDefinitionsPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OptionSetDefinitionDTO{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {module:model/OptionSetDefinitionDTO} opts.body 
     * @param {module:api/OptionSetDefinitionsApi~apiOptionSetDefinitionsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiOptionSetDefinitionsPost(opts, callback) {
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
      let returnType = OptionSetDefinitionDTO;

      return this.apiClient.callApi(
        '/api/OptionSetDefinitions', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}