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
    describe('ValidationError', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.ValidationError();
      });

      it('should create an instance of ValidationError', function() {
        // TODO: update the code to test ValidationError
        expect(instance).to.be.a(EndearingAppweb.ValidationError);
      });

      it('should have the property identifier (base name: "identifier")', function() {
        // TODO: update the code to test the property identifier
        expect(instance).to.have.property('identifier');
        // expect(instance.identifier).to.be(expectedValueLiteral);
      });

      it('should have the property errorMessage (base name: "errorMessage")', function() {
        // TODO: update the code to test the property errorMessage
        expect(instance).to.have.property('errorMessage');
        // expect(instance.errorMessage).to.be(expectedValueLiteral);
      });

      it('should have the property errorCode (base name: "errorCode")', function() {
        // TODO: update the code to test the property errorCode
        expect(instance).to.have.property('errorCode');
        // expect(instance.errorCode).to.be(expectedValueLiteral);
      });

      it('should have the property severity (base name: "severity")', function() {
        // TODO: update the code to test the property severity
        expect(instance).to.have.property('severity');
        // expect(instance.severity).to.be(expectedValueLiteral);
      });

    });
  });

}));
