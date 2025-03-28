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
import ApiClient from './ApiClient';
import CustomeEntityDTO from './model/CustomeEntityDTO';
import EdmContainerElementKind from './model/EdmContainerElementKind';
import EdmExpressionKind from './model/EdmExpressionKind';
import EdmSchemaElementKind from './model/EdmSchemaElementKind';
import EdmTypeKind from './model/EdmTypeKind';
import FieldDto from './model/FieldDto';
import FormDTO from './model/FormDTO';
import IEdmDirectValueAnnotationsManager from './model/IEdmDirectValueAnnotationsManager';
import IEdmEntityContainer from './model/IEdmEntityContainer';
import IEdmEntityContainerElement from './model/IEdmEntityContainerElement';
import IEdmExpression from './model/IEdmExpression';
import IEdmModel from './model/IEdmModel';
import IEdmSchemaElement from './model/IEdmSchemaElement';
import IEdmTerm from './model/IEdmTerm';
import IEdmType from './model/IEdmType';
import IEdmTypeReference from './model/IEdmTypeReference';
import IEdmVocabularyAnnotatable from './model/IEdmVocabularyAnnotatable';
import IEdmVocabularyAnnotation from './model/IEdmVocabularyAnnotation';
import ODataEntitySetInfo from './model/ODataEntitySetInfo';
import ODataFunctionImportInfo from './model/ODataFunctionImportInfo';
import ODataServiceDocument from './model/ODataServiceDocument';
import ODataSingletonInfo from './model/ODataSingletonInfo';
import ODataTypeAnnotation from './model/ODataTypeAnnotation';
import OptionDTO from './model/OptionDTO';
import OptionSetDefinitionDTO from './model/OptionSetDefinitionDTO';
import ProblemDetails from './model/ProblemDetails';
import RelationshipDTO from './model/RelationshipDTO';
import SettingDTO from './model/SettingDTO';
import ValidationProblemDetails from './model/ValidationProblemDetails';
import ActionApi from './api/ActionApi';
import CustomEntitiesApi from './api/CustomEntitiesApi';
import FieldsApi from './api/FieldsApi';
import FormApi from './api/FormApi';
import MetadataApi from './api/MetadataApi';
import OptionSetDefinitionsApi from './api/OptionSetDefinitionsApi';
import RelationshipsApi from './api/RelationshipsApi';
import SettingsApi from './api/SettingsApi';

/**
* Object.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var EndearingAppweb = require('index'); // See note below*.
* var xxxSvc = new EndearingAppweb.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new EndearingAppweb.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new EndearingAppweb.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new EndearingAppweb.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 1.0
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The CustomeEntityDTO model constructor.
     * @property {module:model/CustomeEntityDTO}
     */
    CustomeEntityDTO,

    /**
     * The EdmContainerElementKind model constructor.
     * @property {module:model/EdmContainerElementKind}
     */
    EdmContainerElementKind,

    /**
     * The EdmExpressionKind model constructor.
     * @property {module:model/EdmExpressionKind}
     */
    EdmExpressionKind,

    /**
     * The EdmSchemaElementKind model constructor.
     * @property {module:model/EdmSchemaElementKind}
     */
    EdmSchemaElementKind,

    /**
     * The EdmTypeKind model constructor.
     * @property {module:model/EdmTypeKind}
     */
    EdmTypeKind,

    /**
     * The FieldDto model constructor.
     * @property {module:model/FieldDto}
     */
    FieldDto,

    /**
     * The FormDTO model constructor.
     * @property {module:model/FormDTO}
     */
    FormDTO,

    /**
     * The IEdmDirectValueAnnotationsManager model constructor.
     * @property {module:model/IEdmDirectValueAnnotationsManager}
     */
    IEdmDirectValueAnnotationsManager,

    /**
     * The IEdmEntityContainer model constructor.
     * @property {module:model/IEdmEntityContainer}
     */
    IEdmEntityContainer,

    /**
     * The IEdmEntityContainerElement model constructor.
     * @property {module:model/IEdmEntityContainerElement}
     */
    IEdmEntityContainerElement,

    /**
     * The IEdmExpression model constructor.
     * @property {module:model/IEdmExpression}
     */
    IEdmExpression,

    /**
     * The IEdmModel model constructor.
     * @property {module:model/IEdmModel}
     */
    IEdmModel,

    /**
     * The IEdmSchemaElement model constructor.
     * @property {module:model/IEdmSchemaElement}
     */
    IEdmSchemaElement,

    /**
     * The IEdmTerm model constructor.
     * @property {module:model/IEdmTerm}
     */
    IEdmTerm,

    /**
     * The IEdmType model constructor.
     * @property {module:model/IEdmType}
     */
    IEdmType,

    /**
     * The IEdmTypeReference model constructor.
     * @property {module:model/IEdmTypeReference}
     */
    IEdmTypeReference,

    /**
     * The IEdmVocabularyAnnotatable model constructor.
     * @property {module:model/IEdmVocabularyAnnotatable}
     */
    IEdmVocabularyAnnotatable,

    /**
     * The IEdmVocabularyAnnotation model constructor.
     * @property {module:model/IEdmVocabularyAnnotation}
     */
    IEdmVocabularyAnnotation,

    /**
     * The ODataEntitySetInfo model constructor.
     * @property {module:model/ODataEntitySetInfo}
     */
    ODataEntitySetInfo,

    /**
     * The ODataFunctionImportInfo model constructor.
     * @property {module:model/ODataFunctionImportInfo}
     */
    ODataFunctionImportInfo,

    /**
     * The ODataServiceDocument model constructor.
     * @property {module:model/ODataServiceDocument}
     */
    ODataServiceDocument,

    /**
     * The ODataSingletonInfo model constructor.
     * @property {module:model/ODataSingletonInfo}
     */
    ODataSingletonInfo,

    /**
     * The ODataTypeAnnotation model constructor.
     * @property {module:model/ODataTypeAnnotation}
     */
    ODataTypeAnnotation,

    /**
     * The OptionDTO model constructor.
     * @property {module:model/OptionDTO}
     */
    OptionDTO,

    /**
     * The OptionSetDefinitionDTO model constructor.
     * @property {module:model/OptionSetDefinitionDTO}
     */
    OptionSetDefinitionDTO,

    /**
     * The ProblemDetails model constructor.
     * @property {module:model/ProblemDetails}
     */
    ProblemDetails,

    /**
     * The RelationshipDTO model constructor.
     * @property {module:model/RelationshipDTO}
     */
    RelationshipDTO,

    /**
     * The SettingDTO model constructor.
     * @property {module:model/SettingDTO}
     */
    SettingDTO,

    /**
     * The ValidationProblemDetails model constructor.
     * @property {module:model/ValidationProblemDetails}
     */
    ValidationProblemDetails,

    /**
    * The ActionApi service constructor.
    * @property {module:api/ActionApi}
    */
    ActionApi,

    /**
    * The CustomEntitiesApi service constructor.
    * @property {module:api/CustomEntitiesApi}
    */
    CustomEntitiesApi,

    /**
    * The FieldsApi service constructor.
    * @property {module:api/FieldsApi}
    */
    FieldsApi,

    /**
    * The FormApi service constructor.
    * @property {module:api/FormApi}
    */
    FormApi,

    /**
    * The MetadataApi service constructor.
    * @property {module:api/MetadataApi}
    */
    MetadataApi,

    /**
    * The OptionSetDefinitionsApi service constructor.
    * @property {module:api/OptionSetDefinitionsApi}
    */
    OptionSetDefinitionsApi,

    /**
    * The RelationshipsApi service constructor.
    * @property {module:api/RelationshipsApi}
    */
    RelationshipsApi,

    /**
    * The SettingsApi service constructor.
    * @property {module:api/SettingsApi}
    */
    SettingsApi
};
