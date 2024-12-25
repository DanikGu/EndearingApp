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
    describe('Module', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.Module();
      });

      it('should create an instance of Module', function() {
        // TODO: update the code to test Module
        expect(instance).to.be.a(EndearingAppweb.Module);
      });

      it('should have the property assembly (base name: "assembly")', function() {
        // TODO: update the code to test the property assembly
        expect(instance).to.have.property('assembly');
        // expect(instance.assembly).to.be(expectedValueLiteral);
      });

      it('should have the property fullyQualifiedName (base name: "fullyQualifiedName")', function() {
        // TODO: update the code to test the property fullyQualifiedName
        expect(instance).to.have.property('fullyQualifiedName');
        // expect(instance.fullyQualifiedName).to.be(expectedValueLiteral);
      });

      it('should have the property name (base name: "name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

      it('should have the property mdStreamVersion (base name: "mdStreamVersion")', function() {
        // TODO: update the code to test the property mdStreamVersion
        expect(instance).to.have.property('mdStreamVersion');
        // expect(instance.mdStreamVersion).to.be(expectedValueLiteral);
      });

      it('should have the property moduleVersionId (base name: "moduleVersionId")', function() {
        // TODO: update the code to test the property moduleVersionId
        expect(instance).to.have.property('moduleVersionId');
        // expect(instance.moduleVersionId).to.be(expectedValueLiteral);
      });

      it('should have the property scopeName (base name: "scopeName")', function() {
        // TODO: update the code to test the property scopeName
        expect(instance).to.have.property('scopeName');
        // expect(instance.scopeName).to.be(expectedValueLiteral);
      });

      it('should have the property moduleHandle (base name: "moduleHandle")', function() {
        // TODO: update the code to test the property moduleHandle
        expect(instance).to.have.property('moduleHandle');
        // expect(instance.moduleHandle).to.be(expectedValueLiteral);
      });

      it('should have the property customAttributes (base name: "customAttributes")', function() {
        // TODO: update the code to test the property customAttributes
        expect(instance).to.have.property('customAttributes');
        // expect(instance.customAttributes).to.be(expectedValueLiteral);
      });

      it('should have the property metadataToken (base name: "metadataToken")', function() {
        // TODO: update the code to test the property metadataToken
        expect(instance).to.have.property('metadataToken');
        // expect(instance.metadataToken).to.be(expectedValueLiteral);
      });

    });
  });

}));
