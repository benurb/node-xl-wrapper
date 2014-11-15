var expect = require('chai').expect,
    XL = require('../../lib');

describe('XL', function () {
    'use strict';

    it('should succeed if executorName is defined, but not executorOptions', function () {
        var xl = new XL({
            'executorName': 'dummy'
        });

        expect(xl).to.be.an.instanceof(XL);
    });

    it('should not filter if no filter is defined', function () {
        var xl = new XL({
            'executorName': 'dummy'
        });

        expect(xl).to.be.an.instanceof(XL);
        expect(xl.filter('myvm')).to.eql(true);
        expect(xl.filter('MyVM')).to.eql(true);
        expect(xl.filter('yourvm')).to.eql(true);
    });

    it('should apply string filter correctly', function () {
        var xl = new XL({
            'executorName': 'dummy',
            'filter': 'myvm'
        });

        expect(xl).to.be.an.instanceof(XL);
        expect(xl.filter('myvm')).to.eql(true);
        expect(xl.filter('MyVM')).to.eql(true);
        expect(xl.filter('yourvm')).to.eql(false);
    });

    it('should use configFileTemplate if defined', function () {
        var tpl = '/etc/tpl/{{name}}.cfg';
        var xl = new XL({
            'executorName': 'dummy',
            'configFileTemplate': tpl
        });

        expect(xl).to.be.an.instanceof(XL);
        expect(xl.configFileTemplate).to.eql(tpl);
    });

    it('should fail if options are missing', function () {
        expect(function () {
            var xl = new XL();
            // Prevent jshint warnings
            xl = xl;
        }).to.throw('without executor');
    });

    it('should fail if executorName property is missing in options', function () {
        expect(function () {
            var xl = new XL({
                'name': 'dummy'
            });
            // Prevent jshint warnings
            xl = xl;
        }).to.throw('without executor');
    });

    it('should fail if executor does not exist', function () {
        expect(function () {
            var xl = new XL({
                'executorName': 'dummy-fail'
            });
            // Prevent jshint warnings
            xl = xl;
        }).to.throw('Cannot find executor');
    });
});
