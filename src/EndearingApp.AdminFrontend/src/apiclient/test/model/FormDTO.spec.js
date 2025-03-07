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
    describe('FormDTO', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.FormDTO();
      });

      it('should create an instance of FormDTO', function() {
        // TODO: update the code to test FormDTO
        expect(instance).to.be.a(EndearingAppweb.FormDTO);
      });

      it('should have the property name (base name: "name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

      it('should have the property description (base name: "description")', function() {
        // TODO: update the code to test the property description
        expect(instance).to.have.property('description');
        // expect(instance.description).to.be(expectedValueLiteral);
      });

      it('should have the property jsonSchema (base name: "jsonSchema")', function() {
        // TODO: update the code to test the property jsonSchema
        expect(instance).to.have.property('jsonSchema');
        // expect(instance.jsonSchema).to.be(expectedValueLiteral);
      });

      it('should have the property customEntityId (base name: "customEntityId")', function() {
        // TODO: update the code to test the property customEntityId
        expect(instance).to.have.property('customEntityId');
        // expect(instance.customEntityId).to.be(expectedValueLiteral);
      });

    });
  });

}));
