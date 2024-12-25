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
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.EndearingAppweb);
  }
}(this, function(expect, EndearingAppweb) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('ConstructorInfo', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.ConstructorInfo();
      });

      it('should create an instance of ConstructorInfo', function() {
        // TODO: update the code to test ConstructorInfo
        expect(instance).to.be.a(EndearingAppweb.ConstructorInfo);
      });

      it('should have the property name (base name: "name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

      it('should have the property declaringType (base name: "declaringType")', function() {
        // TODO: update the code to test the property declaringType
        expect(instance).to.have.property('declaringType');
        // expect(instance.declaringType).to.be(expectedValueLiteral);
      });

      it('should have the property reflectedType (base name: "reflectedType")', function() {
        // TODO: update the code to test the property reflectedType
        expect(instance).to.have.property('reflectedType');
        // expect(instance.reflectedType).to.be(expectedValueLiteral);
      });

      it('should have the property module (base name: "module")', function() {
        // TODO: update the code to test the property module
        expect(instance).to.have.property('module');
        // expect(instance.module).to.be(expectedValueLiteral);
      });

      it('should have the property customAttributes (base name: "customAttributes")', function() {
        // TODO: update the code to test the property customAttributes
        expect(instance).to.have.property('customAttributes');
        // expect(instance.customAttributes).to.be(expectedValueLiteral);
      });

      it('should have the property isCollectible (base name: "isCollectible")', function() {
        // TODO: update the code to test the property isCollectible
        expect(instance).to.have.property('isCollectible');
        // expect(instance.isCollectible).to.be(expectedValueLiteral);
      });

      it('should have the property metadataToken (base name: "metadataToken")', function() {
        // TODO: update the code to test the property metadataToken
        expect(instance).to.have.property('metadataToken');
        // expect(instance.metadataToken).to.be(expectedValueLiteral);
      });

      it('should have the property attributes (base name: "attributes")', function() {
        // TODO: update the code to test the property attributes
        expect(instance).to.have.property('attributes');
        // expect(instance.attributes).to.be(expectedValueLiteral);
      });

      it('should have the property methodImplementationFlags (base name: "methodImplementationFlags")', function() {
        // TODO: update the code to test the property methodImplementationFlags
        expect(instance).to.have.property('methodImplementationFlags');
        // expect(instance.methodImplementationFlags).to.be(expectedValueLiteral);
      });

      it('should have the property callingConvention (base name: "callingConvention")', function() {
        // TODO: update the code to test the property callingConvention
        expect(instance).to.have.property('callingConvention');
        // expect(instance.callingConvention).to.be(expectedValueLiteral);
      });

      it('should have the property isAbstract (base name: "isAbstract")', function() {
        // TODO: update the code to test the property isAbstract
        expect(instance).to.have.property('isAbstract');
        // expect(instance.isAbstract).to.be(expectedValueLiteral);
      });

      it('should have the property isConstructor (base name: "isConstructor")', function() {
        // TODO: update the code to test the property isConstructor
        expect(instance).to.have.property('isConstructor');
        // expect(instance.isConstructor).to.be(expectedValueLiteral);
      });

      it('should have the property isFinal (base name: "isFinal")', function() {
        // TODO: update the code to test the property isFinal
        expect(instance).to.have.property('isFinal');
        // expect(instance.isFinal).to.be(expectedValueLiteral);
      });

      it('should have the property isHideBySig (base name: "isHideBySig")', function() {
        // TODO: update the code to test the property isHideBySig
        expect(instance).to.have.property('isHideBySig');
        // expect(instance.isHideBySig).to.be(expectedValueLiteral);
      });

      it('should have the property isSpecialName (base name: "isSpecialName")', function() {
        // TODO: update the code to test the property isSpecialName
        expect(instance).to.have.property('isSpecialName');
        // expect(instance.isSpecialName).to.be(expectedValueLiteral);
      });

      it('should have the property isStatic (base name: "isStatic")', function() {
        // TODO: update the code to test the property isStatic
        expect(instance).to.have.property('isStatic');
        // expect(instance.isStatic).to.be(expectedValueLiteral);
      });

      it('should have the property isVirtual (base name: "isVirtual")', function() {
        // TODO: update the code to test the property isVirtual
        expect(instance).to.have.property('isVirtual');
        // expect(instance.isVirtual).to.be(expectedValueLiteral);
      });

      it('should have the property isAssembly (base name: "isAssembly")', function() {
        // TODO: update the code to test the property isAssembly
        expect(instance).to.have.property('isAssembly');
        // expect(instance.isAssembly).to.be(expectedValueLiteral);
      });

      it('should have the property isFamily (base name: "isFamily")', function() {
        // TODO: update the code to test the property isFamily
        expect(instance).to.have.property('isFamily');
        // expect(instance.isFamily).to.be(expectedValueLiteral);
      });

      it('should have the property isFamilyAndAssembly (base name: "isFamilyAndAssembly")', function() {
        // TODO: update the code to test the property isFamilyAndAssembly
        expect(instance).to.have.property('isFamilyAndAssembly');
        // expect(instance.isFamilyAndAssembly).to.be(expectedValueLiteral);
      });

      it('should have the property isFamilyOrAssembly (base name: "isFamilyOrAssembly")', function() {
        // TODO: update the code to test the property isFamilyOrAssembly
        expect(instance).to.have.property('isFamilyOrAssembly');
        // expect(instance.isFamilyOrAssembly).to.be(expectedValueLiteral);
      });

      it('should have the property isPrivate (base name: "isPrivate")', function() {
        // TODO: update the code to test the property isPrivate
        expect(instance).to.have.property('isPrivate');
        // expect(instance.isPrivate).to.be(expectedValueLiteral);
      });

      it('should have the property isPublic (base name: "isPublic")', function() {
        // TODO: update the code to test the property isPublic
        expect(instance).to.have.property('isPublic');
        // expect(instance.isPublic).to.be(expectedValueLiteral);
      });

      it('should have the property isConstructedGenericMethod (base name: "isConstructedGenericMethod")', function() {
        // TODO: update the code to test the property isConstructedGenericMethod
        expect(instance).to.have.property('isConstructedGenericMethod');
        // expect(instance.isConstructedGenericMethod).to.be(expectedValueLiteral);
      });

      it('should have the property isGenericMethod (base name: "isGenericMethod")', function() {
        // TODO: update the code to test the property isGenericMethod
        expect(instance).to.have.property('isGenericMethod');
        // expect(instance.isGenericMethod).to.be(expectedValueLiteral);
      });

      it('should have the property isGenericMethodDefinition (base name: "isGenericMethodDefinition")', function() {
        // TODO: update the code to test the property isGenericMethodDefinition
        expect(instance).to.have.property('isGenericMethodDefinition');
        // expect(instance.isGenericMethodDefinition).to.be(expectedValueLiteral);
      });

      it('should have the property containsGenericParameters (base name: "containsGenericParameters")', function() {
        // TODO: update the code to test the property containsGenericParameters
        expect(instance).to.have.property('containsGenericParameters');
        // expect(instance.containsGenericParameters).to.be(expectedValueLiteral);
      });

      it('should have the property methodHandle (base name: "methodHandle")', function() {
        // TODO: update the code to test the property methodHandle
        expect(instance).to.have.property('methodHandle');
        // expect(instance.methodHandle).to.be(expectedValueLiteral);
      });

      it('should have the property isSecurityCritical (base name: "isSecurityCritical")', function() {
        // TODO: update the code to test the property isSecurityCritical
        expect(instance).to.have.property('isSecurityCritical');
        // expect(instance.isSecurityCritical).to.be(expectedValueLiteral);
      });

      it('should have the property isSecuritySafeCritical (base name: "isSecuritySafeCritical")', function() {
        // TODO: update the code to test the property isSecuritySafeCritical
        expect(instance).to.have.property('isSecuritySafeCritical');
        // expect(instance.isSecuritySafeCritical).to.be(expectedValueLiteral);
      });

      it('should have the property isSecurityTransparent (base name: "isSecurityTransparent")', function() {
        // TODO: update the code to test the property isSecurityTransparent
        expect(instance).to.have.property('isSecurityTransparent');
        // expect(instance.isSecurityTransparent).to.be(expectedValueLiteral);
      });

      it('should have the property memberType (base name: "memberType")', function() {
        // TODO: update the code to test the property memberType
        expect(instance).to.have.property('memberType');
        // expect(instance.memberType).to.be(expectedValueLiteral);
      });

    });
  });

}));
