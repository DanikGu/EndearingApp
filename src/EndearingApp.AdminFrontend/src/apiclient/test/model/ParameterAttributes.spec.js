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
    describe('ParameterAttributes', function() {
      beforeEach(function() {
        instance = EndearingAppweb.ParameterAttributes;
      });

      it('should create an instance of ParameterAttributes', function() {
        // TODO: update the code to test ParameterAttributes
        expect(instance).to.be.a('object');
      });

      it('should have the property _0', function() {
        expect(instance).to.have.property('_0');
        expect(instance._0).to.be(0);
      });

      it('should have the property _1', function() {
        expect(instance).to.have.property('_1');
        expect(instance._1).to.be(1);
      });

      it('should have the property _2', function() {
        expect(instance).to.have.property('_2');
        expect(instance._2).to.be(2);
      });

      it('should have the property _4', function() {
        expect(instance).to.have.property('_4');
        expect(instance._4).to.be(4);
      });

      it('should have the property _8', function() {
        expect(instance).to.have.property('_8');
        expect(instance._8).to.be(8);
      });

      it('should have the property _16', function() {
        expect(instance).to.have.property('_16');
        expect(instance._16).to.be(16);
      });

      it('should have the property _4096', function() {
        expect(instance).to.have.property('_4096');
        expect(instance._4096).to.be(4096);
      });

      it('should have the property _8192', function() {
        expect(instance).to.have.property('_8192');
        expect(instance._8192).to.be(8192);
      });

      it('should have the property _16384', function() {
        expect(instance).to.have.property('_16384');
        expect(instance._16384).to.be(16384);
      });

      it('should have the property _32768', function() {
        expect(instance).to.have.property('_32768');
        expect(instance._32768).to.be(32768);
      });

      it('should have the property _61440', function() {
        expect(instance).to.have.property('_61440');
        expect(instance._61440).to.be(61440);
      });

    });
  });

}));
