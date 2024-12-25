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
import Assembly from './Assembly';
import ConstructorInfo from './ConstructorInfo';
import CustomAttributeData from './CustomAttributeData';
import EventInfo from './EventInfo';
import FieldInfo from './FieldInfo';
import GenericParameterAttributes from './GenericParameterAttributes';
import MemberInfo from './MemberInfo';
import MemberTypes from './MemberTypes';
import MethodBase from './MethodBase';
import MethodInfo from './MethodInfo';
import Module from './Module';
import PropertyInfo from './PropertyInfo';
import RuntimeTypeHandle from './RuntimeTypeHandle';
import StructLayoutAttribute from './StructLayoutAttribute';
import Type from './Type';
import TypeAttributes from './TypeAttributes';

/**
 * The TypeInfo model module.
 * @module model/TypeInfo
 * @version 1.0
 */
export default class TypeInfo {
  /**
   * Constructs a new <code>TypeInfo</code>.
   * @alias module:model/TypeInfo
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>TypeInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TypeInfo} obj Optional instance to populate.
   * @return {module:model/TypeInfo} The populated <code>TypeInfo</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new TypeInfo();
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('customAttributes'))
        obj.customAttributes = ApiClient.convertToType(data['customAttributes'], [CustomAttributeData]);
      if (data.hasOwnProperty('isCollectible'))
        obj.isCollectible = ApiClient.convertToType(data['isCollectible'], 'Boolean');
      if (data.hasOwnProperty('metadataToken'))
        obj.metadataToken = ApiClient.convertToType(data['metadataToken'], 'Number');
      if (data.hasOwnProperty('isInterface'))
        obj.isInterface = ApiClient.convertToType(data['isInterface'], 'Boolean');
      if (data.hasOwnProperty('memberType'))
        obj.memberType = MemberTypes.constructFromObject(data['memberType']);
      if (data.hasOwnProperty('namespace'))
        obj.namespace = ApiClient.convertToType(data['namespace'], 'String');
      if (data.hasOwnProperty('assemblyQualifiedName'))
        obj.assemblyQualifiedName = ApiClient.convertToType(data['assemblyQualifiedName'], 'String');
      if (data.hasOwnProperty('fullName'))
        obj.fullName = ApiClient.convertToType(data['fullName'], 'String');
      if (data.hasOwnProperty('assembly'))
        obj.assembly = Assembly.constructFromObject(data['assembly']);
      if (data.hasOwnProperty('module'))
        obj.module = Module.constructFromObject(data['module']);
      if (data.hasOwnProperty('isNested'))
        obj.isNested = ApiClient.convertToType(data['isNested'], 'Boolean');
      if (data.hasOwnProperty('declaringType'))
        obj.declaringType = Type.constructFromObject(data['declaringType']);
      if (data.hasOwnProperty('declaringMethod'))
        obj.declaringMethod = MethodBase.constructFromObject(data['declaringMethod']);
      if (data.hasOwnProperty('reflectedType'))
        obj.reflectedType = Type.constructFromObject(data['reflectedType']);
      if (data.hasOwnProperty('underlyingSystemType'))
        obj.underlyingSystemType = Type.constructFromObject(data['underlyingSystemType']);
      if (data.hasOwnProperty('isTypeDefinition'))
        obj.isTypeDefinition = ApiClient.convertToType(data['isTypeDefinition'], 'Boolean');
      if (data.hasOwnProperty('isArray'))
        obj.isArray = ApiClient.convertToType(data['isArray'], 'Boolean');
      if (data.hasOwnProperty('isByRef'))
        obj.isByRef = ApiClient.convertToType(data['isByRef'], 'Boolean');
      if (data.hasOwnProperty('isPointer'))
        obj.isPointer = ApiClient.convertToType(data['isPointer'], 'Boolean');
      if (data.hasOwnProperty('isConstructedGenericType'))
        obj.isConstructedGenericType = ApiClient.convertToType(data['isConstructedGenericType'], 'Boolean');
      if (data.hasOwnProperty('isGenericParameter'))
        obj.isGenericParameter = ApiClient.convertToType(data['isGenericParameter'], 'Boolean');
      if (data.hasOwnProperty('isGenericTypeParameter'))
        obj.isGenericTypeParameter = ApiClient.convertToType(data['isGenericTypeParameter'], 'Boolean');
      if (data.hasOwnProperty('isGenericMethodParameter'))
        obj.isGenericMethodParameter = ApiClient.convertToType(data['isGenericMethodParameter'], 'Boolean');
      if (data.hasOwnProperty('isGenericType'))
        obj.isGenericType = ApiClient.convertToType(data['isGenericType'], 'Boolean');
      if (data.hasOwnProperty('isGenericTypeDefinition'))
        obj.isGenericTypeDefinition = ApiClient.convertToType(data['isGenericTypeDefinition'], 'Boolean');
      if (data.hasOwnProperty('isSZArray'))
        obj.isSZArray = ApiClient.convertToType(data['isSZArray'], 'Boolean');
      if (data.hasOwnProperty('isVariableBoundArray'))
        obj.isVariableBoundArray = ApiClient.convertToType(data['isVariableBoundArray'], 'Boolean');
      if (data.hasOwnProperty('isByRefLike'))
        obj.isByRefLike = ApiClient.convertToType(data['isByRefLike'], 'Boolean');
      if (data.hasOwnProperty('isFunctionPointer'))
        obj.isFunctionPointer = ApiClient.convertToType(data['isFunctionPointer'], 'Boolean');
      if (data.hasOwnProperty('isUnmanagedFunctionPointer'))
        obj.isUnmanagedFunctionPointer = ApiClient.convertToType(data['isUnmanagedFunctionPointer'], 'Boolean');
      if (data.hasOwnProperty('hasElementType'))
        obj.hasElementType = ApiClient.convertToType(data['hasElementType'], 'Boolean');
      if (data.hasOwnProperty('genericTypeArguments'))
        obj.genericTypeArguments = ApiClient.convertToType(data['genericTypeArguments'], [Type]);
      if (data.hasOwnProperty('genericParameterPosition'))
        obj.genericParameterPosition = ApiClient.convertToType(data['genericParameterPosition'], 'Number');
      if (data.hasOwnProperty('genericParameterAttributes'))
        obj.genericParameterAttributes = GenericParameterAttributes.constructFromObject(data['genericParameterAttributes']);
      if (data.hasOwnProperty('attributes'))
        obj.attributes = TypeAttributes.constructFromObject(data['attributes']);
      if (data.hasOwnProperty('isAbstract'))
        obj.isAbstract = ApiClient.convertToType(data['isAbstract'], 'Boolean');
      if (data.hasOwnProperty('isImport'))
        obj.isImport = ApiClient.convertToType(data['isImport'], 'Boolean');
      if (data.hasOwnProperty('isSealed'))
        obj.isSealed = ApiClient.convertToType(data['isSealed'], 'Boolean');
      if (data.hasOwnProperty('isSpecialName'))
        obj.isSpecialName = ApiClient.convertToType(data['isSpecialName'], 'Boolean');
      if (data.hasOwnProperty('isClass'))
        obj.isClass = ApiClient.convertToType(data['isClass'], 'Boolean');
      if (data.hasOwnProperty('isNestedAssembly'))
        obj.isNestedAssembly = ApiClient.convertToType(data['isNestedAssembly'], 'Boolean');
      if (data.hasOwnProperty('isNestedFamANDAssem'))
        obj.isNestedFamANDAssem = ApiClient.convertToType(data['isNestedFamANDAssem'], 'Boolean');
      if (data.hasOwnProperty('isNestedFamily'))
        obj.isNestedFamily = ApiClient.convertToType(data['isNestedFamily'], 'Boolean');
      if (data.hasOwnProperty('isNestedFamORAssem'))
        obj.isNestedFamORAssem = ApiClient.convertToType(data['isNestedFamORAssem'], 'Boolean');
      if (data.hasOwnProperty('isNestedPrivate'))
        obj.isNestedPrivate = ApiClient.convertToType(data['isNestedPrivate'], 'Boolean');
      if (data.hasOwnProperty('isNestedPublic'))
        obj.isNestedPublic = ApiClient.convertToType(data['isNestedPublic'], 'Boolean');
      if (data.hasOwnProperty('isNotPublic'))
        obj.isNotPublic = ApiClient.convertToType(data['isNotPublic'], 'Boolean');
      if (data.hasOwnProperty('isPublic'))
        obj.isPublic = ApiClient.convertToType(data['isPublic'], 'Boolean');
      if (data.hasOwnProperty('isAutoLayout'))
        obj.isAutoLayout = ApiClient.convertToType(data['isAutoLayout'], 'Boolean');
      if (data.hasOwnProperty('isExplicitLayout'))
        obj.isExplicitLayout = ApiClient.convertToType(data['isExplicitLayout'], 'Boolean');
      if (data.hasOwnProperty('isLayoutSequential'))
        obj.isLayoutSequential = ApiClient.convertToType(data['isLayoutSequential'], 'Boolean');
      if (data.hasOwnProperty('isAnsiClass'))
        obj.isAnsiClass = ApiClient.convertToType(data['isAnsiClass'], 'Boolean');
      if (data.hasOwnProperty('isAutoClass'))
        obj.isAutoClass = ApiClient.convertToType(data['isAutoClass'], 'Boolean');
      if (data.hasOwnProperty('isUnicodeClass'))
        obj.isUnicodeClass = ApiClient.convertToType(data['isUnicodeClass'], 'Boolean');
      if (data.hasOwnProperty('isCOMObject'))
        obj.isCOMObject = ApiClient.convertToType(data['isCOMObject'], 'Boolean');
      if (data.hasOwnProperty('isContextful'))
        obj.isContextful = ApiClient.convertToType(data['isContextful'], 'Boolean');
      if (data.hasOwnProperty('isEnum'))
        obj.isEnum = ApiClient.convertToType(data['isEnum'], 'Boolean');
      if (data.hasOwnProperty('isMarshalByRef'))
        obj.isMarshalByRef = ApiClient.convertToType(data['isMarshalByRef'], 'Boolean');
      if (data.hasOwnProperty('isPrimitive'))
        obj.isPrimitive = ApiClient.convertToType(data['isPrimitive'], 'Boolean');
      if (data.hasOwnProperty('isValueType'))
        obj.isValueType = ApiClient.convertToType(data['isValueType'], 'Boolean');
      if (data.hasOwnProperty('isSignatureType'))
        obj.isSignatureType = ApiClient.convertToType(data['isSignatureType'], 'Boolean');
      if (data.hasOwnProperty('isSecurityCritical'))
        obj.isSecurityCritical = ApiClient.convertToType(data['isSecurityCritical'], 'Boolean');
      if (data.hasOwnProperty('isSecuritySafeCritical'))
        obj.isSecuritySafeCritical = ApiClient.convertToType(data['isSecuritySafeCritical'], 'Boolean');
      if (data.hasOwnProperty('isSecurityTransparent'))
        obj.isSecurityTransparent = ApiClient.convertToType(data['isSecurityTransparent'], 'Boolean');
      if (data.hasOwnProperty('structLayoutAttribute'))
        obj.structLayoutAttribute = StructLayoutAttribute.constructFromObject(data['structLayoutAttribute']);
      if (data.hasOwnProperty('typeInitializer'))
        obj.typeInitializer = ConstructorInfo.constructFromObject(data['typeInitializer']);
      if (data.hasOwnProperty('typeHandle'))
        obj.typeHandle = RuntimeTypeHandle.constructFromObject(data['typeHandle']);
      if (data.hasOwnProperty('guid'))
        obj.guid = ApiClient.convertToType(data['guid'], 'String');
      if (data.hasOwnProperty('baseType'))
        obj.baseType = Type.constructFromObject(data['baseType']);
      if (data.hasOwnProperty('isSerializable'))
        obj.isSerializable = ApiClient.convertToType(data['isSerializable'], 'Boolean');
      if (data.hasOwnProperty('containsGenericParameters'))
        obj.containsGenericParameters = ApiClient.convertToType(data['containsGenericParameters'], 'Boolean');
      if (data.hasOwnProperty('isVisible'))
        obj.isVisible = ApiClient.convertToType(data['isVisible'], 'Boolean');
      if (data.hasOwnProperty('genericTypeParameters'))
        obj.genericTypeParameters = ApiClient.convertToType(data['genericTypeParameters'], [Type]);
      if (data.hasOwnProperty('declaredConstructors'))
        obj.declaredConstructors = ApiClient.convertToType(data['declaredConstructors'], [ConstructorInfo]);
      if (data.hasOwnProperty('declaredEvents'))
        obj.declaredEvents = ApiClient.convertToType(data['declaredEvents'], [EventInfo]);
      if (data.hasOwnProperty('declaredFields'))
        obj.declaredFields = ApiClient.convertToType(data['declaredFields'], [FieldInfo]);
      if (data.hasOwnProperty('declaredMembers'))
        obj.declaredMembers = ApiClient.convertToType(data['declaredMembers'], [MemberInfo]);
      if (data.hasOwnProperty('declaredMethods'))
        obj.declaredMethods = ApiClient.convertToType(data['declaredMethods'], [MethodInfo]);
      if (data.hasOwnProperty('declaredNestedTypes'))
        obj.declaredNestedTypes = ApiClient.convertToType(data['declaredNestedTypes'], [TypeInfo]);
      if (data.hasOwnProperty('declaredProperties'))
        obj.declaredProperties = ApiClient.convertToType(data['declaredProperties'], [PropertyInfo]);
      if (data.hasOwnProperty('implementedInterfaces'))
        obj.implementedInterfaces = ApiClient.convertToType(data['implementedInterfaces'], [Type]);
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
TypeInfo.prototype.name = undefined;

/**
 * @member {Array.<module:model/CustomAttributeData>} customAttributes
 */
TypeInfo.prototype.customAttributes = undefined;

/**
 * @member {Boolean} isCollectible
 */
TypeInfo.prototype.isCollectible = undefined;

/**
 * @member {Number} metadataToken
 */
TypeInfo.prototype.metadataToken = undefined;

/**
 * @member {Boolean} isInterface
 */
TypeInfo.prototype.isInterface = undefined;

/**
 * @member {module:model/MemberTypes} memberType
 */
TypeInfo.prototype.memberType = undefined;

/**
 * @member {String} namespace
 */
TypeInfo.prototype.namespace = undefined;

/**
 * @member {String} assemblyQualifiedName
 */
TypeInfo.prototype.assemblyQualifiedName = undefined;

/**
 * @member {String} fullName
 */
TypeInfo.prototype.fullName = undefined;

/**
 * @member {module:model/Assembly} assembly
 */
TypeInfo.prototype.assembly = undefined;

/**
 * @member {module:model/Module} module
 */
TypeInfo.prototype.module = undefined;

/**
 * @member {Boolean} isNested
 */
TypeInfo.prototype.isNested = undefined;

/**
 * @member {module:model/Type} declaringType
 */
TypeInfo.prototype.declaringType = undefined;

/**
 * @member {module:model/MethodBase} declaringMethod
 */
TypeInfo.prototype.declaringMethod = undefined;

/**
 * @member {module:model/Type} reflectedType
 */
TypeInfo.prototype.reflectedType = undefined;

/**
 * @member {module:model/Type} underlyingSystemType
 */
TypeInfo.prototype.underlyingSystemType = undefined;

/**
 * @member {Boolean} isTypeDefinition
 */
TypeInfo.prototype.isTypeDefinition = undefined;

/**
 * @member {Boolean} isArray
 */
TypeInfo.prototype.isArray = undefined;

/**
 * @member {Boolean} isByRef
 */
TypeInfo.prototype.isByRef = undefined;

/**
 * @member {Boolean} isPointer
 */
TypeInfo.prototype.isPointer = undefined;

/**
 * @member {Boolean} isConstructedGenericType
 */
TypeInfo.prototype.isConstructedGenericType = undefined;

/**
 * @member {Boolean} isGenericParameter
 */
TypeInfo.prototype.isGenericParameter = undefined;

/**
 * @member {Boolean} isGenericTypeParameter
 */
TypeInfo.prototype.isGenericTypeParameter = undefined;

/**
 * @member {Boolean} isGenericMethodParameter
 */
TypeInfo.prototype.isGenericMethodParameter = undefined;

/**
 * @member {Boolean} isGenericType
 */
TypeInfo.prototype.isGenericType = undefined;

/**
 * @member {Boolean} isGenericTypeDefinition
 */
TypeInfo.prototype.isGenericTypeDefinition = undefined;

/**
 * @member {Boolean} isSZArray
 */
TypeInfo.prototype.isSZArray = undefined;

/**
 * @member {Boolean} isVariableBoundArray
 */
TypeInfo.prototype.isVariableBoundArray = undefined;

/**
 * @member {Boolean} isByRefLike
 */
TypeInfo.prototype.isByRefLike = undefined;

/**
 * @member {Boolean} isFunctionPointer
 */
TypeInfo.prototype.isFunctionPointer = undefined;

/**
 * @member {Boolean} isUnmanagedFunctionPointer
 */
TypeInfo.prototype.isUnmanagedFunctionPointer = undefined;

/**
 * @member {Boolean} hasElementType
 */
TypeInfo.prototype.hasElementType = undefined;

/**
 * @member {Array.<module:model/Type>} genericTypeArguments
 */
TypeInfo.prototype.genericTypeArguments = undefined;

/**
 * @member {Number} genericParameterPosition
 */
TypeInfo.prototype.genericParameterPosition = undefined;

/**
 * @member {module:model/GenericParameterAttributes} genericParameterAttributes
 */
TypeInfo.prototype.genericParameterAttributes = undefined;

/**
 * @member {module:model/TypeAttributes} attributes
 */
TypeInfo.prototype.attributes = undefined;

/**
 * @member {Boolean} isAbstract
 */
TypeInfo.prototype.isAbstract = undefined;

/**
 * @member {Boolean} isImport
 */
TypeInfo.prototype.isImport = undefined;

/**
 * @member {Boolean} isSealed
 */
TypeInfo.prototype.isSealed = undefined;

/**
 * @member {Boolean} isSpecialName
 */
TypeInfo.prototype.isSpecialName = undefined;

/**
 * @member {Boolean} isClass
 */
TypeInfo.prototype.isClass = undefined;

/**
 * @member {Boolean} isNestedAssembly
 */
TypeInfo.prototype.isNestedAssembly = undefined;

/**
 * @member {Boolean} isNestedFamANDAssem
 */
TypeInfo.prototype.isNestedFamANDAssem = undefined;

/**
 * @member {Boolean} isNestedFamily
 */
TypeInfo.prototype.isNestedFamily = undefined;

/**
 * @member {Boolean} isNestedFamORAssem
 */
TypeInfo.prototype.isNestedFamORAssem = undefined;

/**
 * @member {Boolean} isNestedPrivate
 */
TypeInfo.prototype.isNestedPrivate = undefined;

/**
 * @member {Boolean} isNestedPublic
 */
TypeInfo.prototype.isNestedPublic = undefined;

/**
 * @member {Boolean} isNotPublic
 */
TypeInfo.prototype.isNotPublic = undefined;

/**
 * @member {Boolean} isPublic
 */
TypeInfo.prototype.isPublic = undefined;

/**
 * @member {Boolean} isAutoLayout
 */
TypeInfo.prototype.isAutoLayout = undefined;

/**
 * @member {Boolean} isExplicitLayout
 */
TypeInfo.prototype.isExplicitLayout = undefined;

/**
 * @member {Boolean} isLayoutSequential
 */
TypeInfo.prototype.isLayoutSequential = undefined;

/**
 * @member {Boolean} isAnsiClass
 */
TypeInfo.prototype.isAnsiClass = undefined;

/**
 * @member {Boolean} isAutoClass
 */
TypeInfo.prototype.isAutoClass = undefined;

/**
 * @member {Boolean} isUnicodeClass
 */
TypeInfo.prototype.isUnicodeClass = undefined;

/**
 * @member {Boolean} isCOMObject
 */
TypeInfo.prototype.isCOMObject = undefined;

/**
 * @member {Boolean} isContextful
 */
TypeInfo.prototype.isContextful = undefined;

/**
 * @member {Boolean} isEnum
 */
TypeInfo.prototype.isEnum = undefined;

/**
 * @member {Boolean} isMarshalByRef
 */
TypeInfo.prototype.isMarshalByRef = undefined;

/**
 * @member {Boolean} isPrimitive
 */
TypeInfo.prototype.isPrimitive = undefined;

/**
 * @member {Boolean} isValueType
 */
TypeInfo.prototype.isValueType = undefined;

/**
 * @member {Boolean} isSignatureType
 */
TypeInfo.prototype.isSignatureType = undefined;

/**
 * @member {Boolean} isSecurityCritical
 */
TypeInfo.prototype.isSecurityCritical = undefined;

/**
 * @member {Boolean} isSecuritySafeCritical
 */
TypeInfo.prototype.isSecuritySafeCritical = undefined;

/**
 * @member {Boolean} isSecurityTransparent
 */
TypeInfo.prototype.isSecurityTransparent = undefined;

/**
 * @member {module:model/StructLayoutAttribute} structLayoutAttribute
 */
TypeInfo.prototype.structLayoutAttribute = undefined;

/**
 * @member {module:model/ConstructorInfo} typeInitializer
 */
TypeInfo.prototype.typeInitializer = undefined;

/**
 * @member {module:model/RuntimeTypeHandle} typeHandle
 */
TypeInfo.prototype.typeHandle = undefined;

/**
 * @member {String} guid
 */
TypeInfo.prototype.guid = undefined;

/**
 * @member {module:model/Type} baseType
 */
TypeInfo.prototype.baseType = undefined;

/**
 * @member {Boolean} isSerializable
 */
TypeInfo.prototype.isSerializable = undefined;

/**
 * @member {Boolean} containsGenericParameters
 */
TypeInfo.prototype.containsGenericParameters = undefined;

/**
 * @member {Boolean} isVisible
 */
TypeInfo.prototype.isVisible = undefined;

/**
 * @member {Array.<module:model/Type>} genericTypeParameters
 */
TypeInfo.prototype.genericTypeParameters = undefined;

/**
 * @member {Array.<module:model/ConstructorInfo>} declaredConstructors
 */
TypeInfo.prototype.declaredConstructors = undefined;

/**
 * @member {Array.<module:model/EventInfo>} declaredEvents
 */
TypeInfo.prototype.declaredEvents = undefined;

/**
 * @member {Array.<module:model/FieldInfo>} declaredFields
 */
TypeInfo.prototype.declaredFields = undefined;

/**
 * @member {Array.<module:model/MemberInfo>} declaredMembers
 */
TypeInfo.prototype.declaredMembers = undefined;

/**
 * @member {Array.<module:model/MethodInfo>} declaredMethods
 */
TypeInfo.prototype.declaredMethods = undefined;

/**
 * @member {Array.<module:model/TypeInfo>} declaredNestedTypes
 */
TypeInfo.prototype.declaredNestedTypes = undefined;

/**
 * @member {Array.<module:model/PropertyInfo>} declaredProperties
 */
TypeInfo.prototype.declaredProperties = undefined;

/**
 * @member {Array.<module:model/Type>} implementedInterfaces
 */
TypeInfo.prototype.implementedInterfaces = undefined;
