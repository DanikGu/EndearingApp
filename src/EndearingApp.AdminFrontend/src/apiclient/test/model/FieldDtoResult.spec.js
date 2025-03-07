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
    describe('FieldDtoResult', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.FieldDtoResult();
      });

      it('should create an instance of FieldDtoResult', function() {
        // TODO: update the code to test FieldDtoResult
        expect(instance).to.be.a(EndearingAppweb.FieldDtoResult);
      });

      it('should have the property value (base name: "value")', function() {
        // TODO: update the code to test the property value
        expect(instance).to.have.property('value');
        // expect(instance.value).to.be(expectedValueLiteral);
      });

      it('should have the property status (base name: "status")', function() {
        // TODO: update the code to test the property status
        expect(instance).to.have.property('status');
        // expect(instance.status).to.be(expectedValueLiteral);
      });

      it('should have the property isSuccess (base name: "isSuccess")', function() {
        // TODO: update the code to test the property isSuccess
        expect(instance).to.have.property('isSuccess');
        // expect(instance.isSuccess).to.be(expectedValueLiteral);
      });

      it('should have the property successMessage (base name: "successMessage")', function() {
        // TODO: update the code to test the property successMessage
        expect(instance).to.have.property('successMessage');
        // expect(instance.successMessage).to.be(expectedValueLiteral);
      });

      it('should have the property correlationId (base name: "correlationId")', function() {
        // TODO: update the code to test the property correlationId
        expect(instance).to.have.property('correlationId');
        // expect(instance.correlationId).to.be(expectedValueLiteral);
      });

      it('should have the property location (base name: "location")', function() {
        // TODO: update the code to test the property location
        expect(instance).to.have.property('location');
        // expect(instance.location).to.be(expectedValueLiteral);
      });

      it('should have the property errors (base name: "errors")', function() {
        // TODO: update the code to test the property errors
        expect(instance).to.have.property('errors');
        // expect(instance.errors).to.be(expectedValueLiteral);
      });

      it('should have the property validationErrors (base name: "validationErrors")', function() {
        // TODO: update the code to test the property validationErrors
        expect(instance).to.have.property('validationErrors');
        // expect(instance.validationErrors).to.be(expectedValueLiteral);
      });

    });
  });

}));
