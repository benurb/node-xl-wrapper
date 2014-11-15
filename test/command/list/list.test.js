var testConfig = require('../../config'),
    expect = require('chai').expect,
    path = require('path'),
    XL = require('../../../lib');

describe('list', function () {
    'use strict';

    var xl;

    before(function () {
        testConfig.executorOptions.mock = require(path.join(__dirname, 'mock.js'));
        xl = new XL(testConfig);
    });

    it('should use filter on results', function (done) {
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
});
