var testConfig = require('../../../config'),
    expect = require('chai').expect,
    path = require('path'),
    XL = require('../../../../lib');

describe('list', function () {
    'use strict';

    it('should use filter on results', function (done) {
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock.js'));
        var xl = new XL(testConfig);

        xl.list({}, function (err, data) {
            if (err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql([{
                'domid': 2,
                'config': {
                    'c_info': {
                        'name': 'test-accessible'
                    }
                }
            }]);
            done();
        });
    });

    it('should allow callback on first parameter', function (done) {
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock.js'));
        var xl = new XL(testConfig);

        xl.list(function (err, data) {
            if (err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql([{
                'domid': 2,
                'config': {
                    'c_info': {
                        'name': 'test-accessible'
                    }
                }
            }]);
            done();
        });
    });

    it('should fail if command returns an error code', function (done) {
        // Remove mock
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock-error.js'));
        var xl = new XL(testConfig);

        xl.list({}, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not found');
            expect(data).to.be.undefined;

            done();
        });
    });

    it('should fail if command execution fails', function (done) {
        // Remove mock
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock-fail.js'));
        var xl = new XL(testConfig);

        xl.list({}, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not connect');
            expect(data).to.be.undefined;

            done();
        });
    });
});
