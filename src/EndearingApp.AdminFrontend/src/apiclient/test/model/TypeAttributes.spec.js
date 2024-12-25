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
    describe('TypeAttributes', function() {
      beforeEach(function() {
        instance = EndearingAppweb.TypeAttributes;
      });

      it('should create an instance of TypeAttributes', function() {
        // TODO: update the code to test TypeAttributes
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

      it('should have the property _3', function() {
        expect(instance).to.have.property('_3');
        expect(instance._3).to.be(3);
      });

      it('should have the property _4', function() {
        expect(instance).to.have.property('_4');
        expect(instance._4).to.be(4);
      });

      it('should have the property _5', function() {
        expect(instance).to.have.property('_5');
        expect(instance._5).to.be(5);
      });

      it('should have the property _6', function() {
        expect(instance).to.have.property('_6');
        expect(instance._6).to.be(6);
      });

      it('should have the property _7', function() {
        expect(instance).to.have.property('_7');
        expect(instance._7).to.be(7);
      });

      it('should have the property _8', function() {
        expect(instance).to.have.property('_8');
        expect(instance._8).to.be(8);
      });

      it('should have the property _16', function() {
        expect(instance).to.have.property('_16');
        expect(instance._16).to.be(16);
      });

      it('should have the property _24', function() {
        expect(instance).to.have.property('_24');
        expect(instance._24).to.be(24);
      });

      it('should have the property _32', function() {
        expect(instance).to.have.property('_32');
        expect(instance._32).to.be(32);
      });

      it('should have the property _128', function() {
        expect(instance).to.have.property('_128');
        expect(instance._128).to.be(128);
      });

      it('should have the property _256', function() {
        expect(instance).to.have.property('_256');
        expect(instance._256).to.be(256);
      });

      it('should have the property _1024', function() {
        expect(instance).to.have.property('_1024');
        expect(instance._1024).to.be(1024);
      });

      it('should have the property _2048', function() {
        expect(instance).to.have.property('_2048');
        expect(instance._2048).to.be(2048);
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

      it('should have the property _65536', function() {
        expect(instance).to.have.property('_65536');
        expect(instance._65536).to.be(65536);
      });

      it('should have the property _131072', function() {
        expect(instance).to.have.property('_131072');
        expect(instance._131072).to.be(131072);
      });

      it('should have the property _196608', function() {
        expect(instance).to.have.property('_196608');
        expect(instance._196608).to.be(196608);
      });

      it('should have the property _262144', function() {
        expect(instance).to.have.property('_262144');
        expect(instance._262144).to.be(262144);
      });

      it('should have the property _264192', function() {
        expect(instance).to.have.property('_264192');
        expect(instance._264192).to.be(264192);
      });

      it('should have the property _1048576', function() {
        expect(instance).to.have.property('_1048576');
        expect(instance._1048576).to.be(1048576);
      });

      it('should have the property _12582912', function() {
        expect(instance).to.have.property('_12582912');
        expect(instance._12582912).to.be(12582912);
      });

    });
  });

}));
