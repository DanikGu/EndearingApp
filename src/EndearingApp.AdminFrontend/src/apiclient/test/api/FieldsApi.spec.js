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

  beforeEach(function() {
    instance = new EndearingAppweb.FieldsApi();
  });

  describe('(package)', function() {
    describe('FieldsApi', function() {
      describe('apiFieldsGet', function() {
        it('should call apiFieldsGet successfully', function(done) {
          // TODO: uncomment apiFieldsGet call and complete the assertions
          /*

          instance.apiFieldsGet(function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            let dataCtr = data;
            expect(dataCtr).to.be.an(Array);
            expect(dataCtr).to.not.be.empty();
            for (let p in dataCtr) {
              let data = dataCtr[p];
              expect(data).to.be.a(EndearingAppweb.FieldDto);
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiFieldsIdDelete', function() {
        it('should call apiFieldsIdDelete successfully', function(done) {
          // TODO: uncomment, update parameter values for apiFieldsIdDelete call
          /*

          instance.apiFieldsIdDelete(id, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiFieldsIdGet', function() {
        it('should call apiFieldsIdGet successfully', function(done) {
          // TODO: uncomment, update parameter values for apiFieldsIdGet call and complete the assertions
          /*

          instance.apiFieldsIdGet(id, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.FieldDto);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiFieldsIdPut', function() {
        it('should call apiFieldsIdPut successfully', function(done) {
          // TODO: uncomment, update parameter values for apiFieldsIdPut call and complete the assertions
          /*
          var opts = {};

          instance.apiFieldsIdPut(id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.FieldDto);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiFieldsPatch', function() {
        it('should call apiFieldsPatch successfully', function(done) {
          // TODO: uncomment, update parameter values for apiFieldsPatch call and complete the assertions
          /*
          var opts = {};

          instance.apiFieldsPatch(opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.FieldDto);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiFieldsPost', function() {
        it('should call apiFieldsPost successfully', function(done) {
          // TODO: uncomment, update parameter values for apiFieldsPost call and complete the assertions
          /*
          var opts = {};

          instance.apiFieldsPost(opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.FieldDto);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
    });
  });

}));
