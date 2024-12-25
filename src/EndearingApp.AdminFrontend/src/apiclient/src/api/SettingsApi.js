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
import SettingDTO from '../model/SettingDTO';

/**
* Settings service.
* @module api/SettingsApi
* @version 1.0
*/
export default class SettingsApi {

    /**
    * Constructs a new SettingsApi. 
    * @alias module:api/SettingsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the apiSettingsNameGet operation.
     * @callback moduleapi/SettingsApi~apiSettingsNameGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SettingDTO{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} name 
     * @param {module:api/SettingsApi~apiSettingsNameGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    apiSettingsNameGet(name, callback) {
      
      let postBody = null;
      // verify the required parameter 'name' is set
      if (name === undefined || name === null) {
        throw new Error("Missing the required parameter 'name' when calling apiSettingsNameGet");
      }

      let pathParams = {
        'name': name
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
      let returnType = SettingDTO;

      return this.apiClient.callApi(
        '/api/Settings/{name}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}