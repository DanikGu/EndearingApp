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
    describe('EventAttributes', function() {
      beforeEach(function() {
        instance = EndearingAppweb.EventAttributes;
      });

      it('should create an instance of EventAttributes', function() {
        // TODO: update the code to test EventAttributes
        expect(instance).to.be.a('object');
      });

      it('should have the property _0', function() {
        expect(instance).to.have.property('_0');
        expect(instance._0).to.be(0);
      });

      it('should have the property _512', function() {
        expect(instance).to.have.property('_512');
        expect(instance._512).to.be(512);
      });

      it('should have the property _1024', function() {
        expect(instance).to.have.property('_1024');
        expect(instance._1024).to.be(1024);
      });

    });
  });

}));
