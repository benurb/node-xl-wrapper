var testConfig = require('../../config'),
    expect = require('chai').expect,
    path = require('path'),
    XL = require('../../../lib');

describe('domid', function() {
    'use strict';

    var xl;

    before(function() {
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock.js'));
        xl = new XL(testConfig);
    });

    it('should return domid on valid request', function(done) {
        xl.domid({
            'name': 'test-domU'
        }, function(err, data) {
            if(err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql(5);
            done();
        });
    });

    it('should return domid on valid request and property domName', function(done) {
        xl.domid({
            'domName': 'test-domU'
        }, function(err, data) {
            if(err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql(5);
            done();
        });
    });

    it('should return domid on valid request and property domainName', function(done) {
        xl.domid({
            'domainName': 'test-domU'
        }, function(err, data) {
            if(err) {
                return done(err);
            }

            expect(err).to.be.null();
            expect(data).to.eql(5);
            done();
        });
    });

    it('should fail when no access', function(done) {
        xl.domid({
            'name': 'forbidden-domU'
        }, function(err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not exist');
            expect(data).to.be.undefined();
            done();
        });
    });

    it('should fail when not found', function(done) {
        xl.domid({
            'name': 'test-domU-notexists'
        }, function(err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('not exist');
            expect(data).to.be.undefined();
            done();
        });
    });

    it('should fail when missing required property', function(done) {
        xl.domid({}, function(err, data) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain('required property');
            expect(data).to.be.undefined();
            done();
        });
    });
});
