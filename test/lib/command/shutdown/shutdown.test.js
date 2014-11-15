var testConfig = require('../../../config'),
    expect = require('chai').expect,
    path = require('path'),
    XL = require('../../../../lib');

describe('shutdown', function () {
    'use strict';

    var xl;

    before(function () {
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock.js'));
        xl = new XL(testConfig);
    });

    var successCallback = function (done) {
        return function (err, data) {
            if (err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql('Shutting down domain 5');
            done();
        };
    };

    it('should be successful when called with name property', function (done) {
        xl.shutdown({
            'name': 'test-domU'
        }, successCallback(done));
    });

    it('should be successful when called with domName property', function (done) {
        xl.shutdown({
            'domName': 'test-domU'
        }, successCallback(done));
    });

    it('should be successful when called with domainName property', function (done) {
        xl.shutdown({
            'domainName': 'test-domU'
        }, successCallback(done));
    });

    it('should be successful when called with id property', function (done) {
        xl.shutdown({
            'id': '5'
        }, successCallback(done));
    });

    it('should be successful when called with domId property', function (done) {
        xl.shutdown({
            'domId': '5'
        }, successCallback(done));
    });

    it('should be successful when called with domainId property', function (done) {
        xl.shutdown({
            'domainId': '5'
        }, successCallback(done));
    });
});
