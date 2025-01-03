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
    describe('IEdmType', function() {
      beforeEach(function() {
        instance = new EndearingAppweb.IEdmType();
      });

      it('should create an instance of IEdmType', function() {
        // TODO: update the code to test IEdmType
        expect(instance).to.be.a(EndearingAppweb.IEdmType);
      });

      it('should have the property typeKind (base name: "typeKind")', function() {
        // TODO: update the code to test the property typeKind
        expect(instance).to.have.property('typeKind');
        // expect(instance.typeKind).to.be(expectedValueLiteral);
      });

    });
  });

}));
