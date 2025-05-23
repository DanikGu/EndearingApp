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
    instance = new EndearingAppweb.RelationshipsApi();
  });

  describe('(package)', function() {
    describe('RelationshipsApi', function() {
      describe('apiRelationshipsGet', function() {
        it('should call apiRelationshipsGet successfully', function(done) {
          // TODO: uncomment apiRelationshipsGet call and complete the assertions
          /*

          instance.apiRelationshipsGet(function(error, data, response) {
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
              expect(data).to.be.a(EndearingAppweb.RelationshipDTO);
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiRelationshipsIdDelete', function() {
        it('should call apiRelationshipsIdDelete successfully', function(done) {
          // TODO: uncomment, update parameter values for apiRelationshipsIdDelete call
          /*

          instance.apiRelationshipsIdDelete(id, function(error, data, response) {
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
      describe('apiRelationshipsIdGet', function() {
        it('should call apiRelationshipsIdGet successfully', function(done) {
          // TODO: uncomment, update parameter values for apiRelationshipsIdGet call and complete the assertions
          /*

          instance.apiRelationshipsIdGet(id, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.RelationshipDTO);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiRelationshipsIdPut', function() {
        it('should call apiRelationshipsIdPut successfully', function(done) {
          // TODO: uncomment, update parameter values for apiRelationshipsIdPut call and complete the assertions
          /*
          var opts = {};

          instance.apiRelationshipsIdPut(id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.RelationshipDTO);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('apiRelationshipsPost', function() {
        it('should call apiRelationshipsPost successfully', function(done) {
          // TODO: uncomment, update parameter values for apiRelationshipsPost call and complete the assertions
          /*
          var opts = {};

          instance.apiRelationshipsPost(opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(EndearingAppweb.RelationshipDTO);

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
