var testConfig = require('../../../config'),
    expect = require('chai').expect,
    path = require('path'),
    XL = require('../../../../lib');

describe('domid', function () {
    'use strict';

    var xl;

    before(function () {
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock.js'));
        xl = new XL(testConfig);
    });

    it('should return domid on valid request', function (done) {
        xl.domname({
            'id': 5
        }, function (err, data) {
            if (err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql('test-domU');
            done();
        });
    });

    it('should return domid on valid request and property domId', function (done) {
        xl.domname({
            'domId': 5
        }, function (err, data) {
            if (err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql('test-domU');
            done();
        });
    });

    it('should return domid on valid request and property domainId', function (done) {
        xl.domname({
            'domainId': 5
        }, function (err, data) {
            if (err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql('test-domU');
            done();
        });
    });

    it('should fail when no access', function (done) {
        xl.domname({
            'id': '6'
        }, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not exist');
            expect(data).to.be.undefined();
            done();
        });
    });

    it('should fail when not found', function (done) {
        xl.domname({
            'id': '7'
        }, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not exist');
            expect(data).to.be.undefined();
            done();
        });
    });

    it('should fail when missing required property', function (done) {
        xl.domname({}, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('required property');
            expect(data).to.be.undefined();
            done();
        });
    });

    it('should fail when invoking without options', function (done) {
        xl.domname(null, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('required property');
            expect(data).to.be.undefined();
            done();
        });
    });

    it('should throw error when invoking without callback', function () {
        expect(function () {
            xl.domname({});
        }).to.throw('without callback');
    });

    it('should fail if command execution fails', function (done) {
        xl.domname({
            'id': '8'
        }, function (err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not connect');
            expect(data).to.be.undefined();

            done();
        });
    });
});
