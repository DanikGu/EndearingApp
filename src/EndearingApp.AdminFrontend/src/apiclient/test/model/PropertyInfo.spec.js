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
    describe('PropertyInfo', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.PropertyInfo();
      });

      it('should create an instance of PropertyInfo', function() {
        // TODO: update the code to test PropertyInfo
        expect(instance).to.be.a(EndearingAppweb.PropertyInfo);
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

      it('should have the property memberType (base name: "memberType")', function() {
        // TODO: update the code to test the property memberType
        expect(instance).to.have.property('memberType');
        // expect(instance.memberType).to.be(expectedValueLiteral);
      });

      it('should have the property propertyType (base name: "propertyType")', function() {
        // TODO: update the code to test the property propertyType
        expect(instance).to.have.property('propertyType');
        // expect(instance.propertyType).to.be(expectedValueLiteral);
      });

      it('should have the property attributes (base name: "attributes")', function() {
        // TODO: update the code to test the property attributes
        expect(instance).to.have.property('attributes');
        // expect(instance.attributes).to.be(expectedValueLiteral);
      });

      it('should have the property isSpecialName (base name: "isSpecialName")', function() {
        // TODO: update the code to test the property isSpecialName
        expect(instance).to.have.property('isSpecialName');
        // expect(instance.isSpecialName).to.be(expectedValueLiteral);
      });

      it('should have the property canRead (base name: "canRead")', function() {
        // TODO: update the code to test the property canRead
        expect(instance).to.have.property('canRead');
        // expect(instance.canRead).to.be(expectedValueLiteral);
      });

      it('should have the property canWrite (base name: "canWrite")', function() {
        // TODO: update the code to test the property canWrite
        expect(instance).to.have.property('canWrite');
        // expect(instance.canWrite).to.be(expectedValueLiteral);
      });

      it('should have the property getMethod (base name: "getMethod")', function() {
        // TODO: update the code to test the property getMethod
        expect(instance).to.have.property('getMethod');
        // expect(instance.getMethod).to.be(expectedValueLiteral);
      });

      it('should have the property setMethod (base name: "setMethod")', function() {
        // TODO: update the code to test the property setMethod
        expect(instance).to.have.property('setMethod');
        // expect(instance.setMethod).to.be(expectedValueLiteral);
      });

    });
  });

}));