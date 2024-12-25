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
import CallingConventions from './CallingConventions';
import CustomAttributeData from './CustomAttributeData';
import ICustomAttributeProvider from './ICustomAttributeProvider';
import MemberTypes from './MemberTypes';
import MethodAttributes from './MethodAttributes';
import MethodImplAttributes from './MethodImplAttributes';
import Module from './Module';
import ParameterInfo from './ParameterInfo';
import RuntimeMethodHandle from './RuntimeMethodHandle';
import Type from './Type';

/**
 * The MethodInfo model module.
 * @module model/MethodInfo
 * @version 1.0
 */
export default class MethodInfo {
  /**
   * Constructs a new <code>MethodInfo</code>.
   * @alias module:model/MethodInfo
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>MethodInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MethodInfo} obj Optional instance to populate.
   * @return {module:model/MethodInfo} The populated <code>MethodInfo</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new MethodInfo();
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
      if (data.hasOwnProperty('attributes'))
        obj.attributes = MethodAttributes.constructFromObject(data['attributes']);
      if (data.hasOwnProperty('methodImplementationFlags'))
        obj.methodImplementationFlags = MethodImplAttributes.constructFromObject(data['methodImplementationFlags']);
      if (data.hasOwnProperty('callingConvention'))
        obj.callingConvention = CallingConventions.constructFromObject(data['callingConvention']);
      if (data.hasOwnProperty('isAbstract'))
        obj.isAbstract = ApiClient.convertToType(data['isAbstract'], 'Boolean');
      if (data.hasOwnProperty('isConstructor'))
        obj.isConstructor = ApiClient.convertToType(data['isConstructor'], 'Boolean');
      if (data.hasOwnProperty('isFinal'))
        obj.isFinal = ApiClient.convertToType(data['isFinal'], 'Boolean');
      if (data.hasOwnProperty('isHideBySig'))
        obj.isHideBySig = ApiClient.convertToType(data['isHideBySig'], 'Boolean');
      if (data.hasOwnProperty('isSpecialName'))
        obj.isSpecialName = ApiClient.convertToType(data['isSpecialName'], 'Boolean');
      if (data.hasOwnProperty('isStatic'))
        obj.isStatic = ApiClient.convertToType(data['isStatic'], 'Boolean');
      if (data.hasOwnProperty('isVirtual'))
        obj.isVirtual = ApiClient.convertToType(data['isVirtual'], 'Boolean');
      if (data.hasOwnProperty('isAssembly'))
        obj.isAssembly = ApiClient.convertToType(data['isAssembly'], 'Boolean');
      if (data.hasOwnProperty('isFamily'))
        obj.isFamily = ApiClient.convertToType(data['isFamily'], 'Boolean');
      if (data.hasOwnProperty('isFamilyAndAssembly'))
        obj.isFamilyAndAssembly = ApiClient.convertToType(data['isFamilyAndAssembly'], 'Boolean');
      if (data.hasOwnProperty('isFamilyOrAssembly'))
        obj.isFamilyOrAssembly = ApiClient.convertToType(data['isFamilyOrAssembly'], 'Boolean');
      if (data.hasOwnProperty('isPrivate'))
        obj.isPrivate = ApiClient.convertToType(data['isPrivate'], 'Boolean');
      if (data.hasOwnProperty('isPublic'))
        obj.isPublic = ApiClient.convertToType(data['isPublic'], 'Boolean');
      if (data.hasOwnProperty('isConstructedGenericMethod'))
        obj.isConstructedGenericMethod = ApiClient.convertToType(data['isConstructedGenericMethod'], 'Boolean');
      if (data.hasOwnProperty('isGenericMethod'))
        obj.isGenericMethod = ApiClient.convertToType(data['isGenericMethod'], 'Boolean');
      if (data.hasOwnProperty('isGenericMethodDefinition'))
        obj.isGenericMethodDefinition = ApiClient.convertToType(data['isGenericMethodDefinition'], 'Boolean');
      if (data.hasOwnProperty('containsGenericParameters'))
        obj.containsGenericParameters = ApiClient.convertToType(data['containsGenericParameters'], 'Boolean');
      if (data.hasOwnProperty('methodHandle'))
        obj.methodHandle = RuntimeMethodHandle.constructFromObject(data['methodHandle']);
      if (data.hasOwnProperty('isSecurityCritical'))
        obj.isSecurityCritical = ApiClient.convertToType(data['isSecurityCritical'], 'Boolean');
      if (data.hasOwnProperty('isSecuritySafeCritical'))
        obj.isSecuritySafeCritical = ApiClient.convertToType(data['isSecuritySafeCritical'], 'Boolean');
      if (data.hasOwnProperty('isSecurityTransparent'))
        obj.isSecurityTransparent = ApiClient.convertToType(data['isSecurityTransparent'], 'Boolean');
      if (data.hasOwnProperty('memberType'))
        obj.memberType = MemberTypes.constructFromObject(data['memberType']);
      if (data.hasOwnProperty('returnParameter'))
        obj.returnParameter = ParameterInfo.constructFromObject(data['returnParameter']);
      if (data.hasOwnProperty('returnType'))
        obj.returnType = Type.constructFromObject(data['returnType']);
      if (data.hasOwnProperty('returnTypeCustomAttributes'))
        obj.returnTypeCustomAttributes = ICustomAttributeProvider.constructFromObject(data['returnTypeCustomAttributes']);
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
MethodInfo.prototype.name = undefined;

/**
 * @member {module:model/Type} declaringType
 */
MethodInfo.prototype.declaringType = undefined;

/**
 * @member {module:model/Type} reflectedType
 */
MethodInfo.prototype.reflectedType = undefined;

/**
 * @member {module:model/Module} module
 */
MethodInfo.prototype.module = undefined;

/**
 * @member {Array.<module:model/CustomAttributeData>} customAttributes
 */
MethodInfo.prototype.customAttributes = undefined;

/**
 * @member {Boolean} isCollectible
 */
MethodInfo.prototype.isCollectible = undefined;

/**
 * @member {Number} metadataToken
 */
MethodInfo.prototype.metadataToken = undefined;

/**
 * @member {module:model/MethodAttributes} attributes
 */
MethodInfo.prototype.attributes = undefined;

/**
 * @member {module:model/MethodImplAttributes} methodImplementationFlags
 */
MethodInfo.prototype.methodImplementationFlags = undefined;

/**
 * @member {module:model/CallingConventions} callingConvention
 */
MethodInfo.prototype.callingConvention = undefined;

/**
 * @member {Boolean} isAbstract
 */
MethodInfo.prototype.isAbstract = undefined;

/**
 * @member {Boolean} isConstructor
 */
MethodInfo.prototype.isConstructor = undefined;

/**
 * @member {Boolean} isFinal
 */
MethodInfo.prototype.isFinal = undefined;

/**
 * @member {Boolean} isHideBySig
 */
MethodInfo.prototype.isHideBySig = undefined;

/**
 * @member {Boolean} isSpecialName
 */
MethodInfo.prototype.isSpecialName = undefined;

/**
 * @member {Boolean} isStatic
 */
MethodInfo.prototype.isStatic = undefined;

/**
 * @member {Boolean} isVirtual
 */
MethodInfo.prototype.isVirtual = undefined;

/**
 * @member {Boolean} isAssembly
 */
MethodInfo.prototype.isAssembly = undefined;

/**
 * @member {Boolean} isFamily
 */
MethodInfo.prototype.isFamily = undefined;

/**
 * @member {Boolean} isFamilyAndAssembly
 */
MethodInfo.prototype.isFamilyAndAssembly = undefined;

/**
 * @member {Boolean} isFamilyOrAssembly
 */
MethodInfo.prototype.isFamilyOrAssembly = undefined;

/**
 * @member {Boolean} isPrivate
 */
MethodInfo.prototype.isPrivate = undefined;

/**
 * @member {Boolean} isPublic
 */
MethodInfo.prototype.isPublic = undefined;

/**
 * @member {Boolean} isConstructedGenericMethod
 */
MethodInfo.prototype.isConstructedGenericMethod = undefined;

/**
 * @member {Boolean} isGenericMethod
 */
MethodInfo.prototype.isGenericMethod = undefined;

/**
 * @member {Boolean} isGenericMethodDefinition
 */
MethodInfo.prototype.isGenericMethodDefinition = undefined;

/**
 * @member {Boolean} containsGenericParameters
 */
MethodInfo.prototype.containsGenericParameters = undefined;

/**
 * @member {module:model/RuntimeMethodHandle} methodHandle
 */
MethodInfo.prototype.methodHandle = undefined;

/**
 * @member {Boolean} isSecurityCritical
 */
MethodInfo.prototype.isSecurityCritical = undefined;

/**
 * @member {Boolean} isSecuritySafeCritical
 */
MethodInfo.prototype.isSecuritySafeCritical = undefined;

/**
 * @member {Boolean} isSecurityTransparent
 */
MethodInfo.prototype.isSecurityTransparent = undefined;

/**
 * @member {module:model/MemberTypes} memberType
 */
MethodInfo.prototype.memberType = undefined;

/**
 * @member {module:model/ParameterInfo} returnParameter
 */
MethodInfo.prototype.returnParameter = undefined;

/**
 * @member {module:model/Type} returnType
 */
MethodInfo.prototype.returnType = undefined;

/**
 * @member {module:model/ICustomAttributeProvider} returnTypeCustomAttributes
 */
MethodInfo.prototype.returnTypeCustomAttributes = undefined;
