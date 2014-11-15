var expect = require('chai').expect
    altproperty = require('../../util/altproperty');

describe('altproperty', function () {
    var obj;

    beforeEach(function() {
        obj = {
            'name': 'n',
            'domName': 'dN',
            'domainName': 'domainN'
        };
    });

    it('should not change anything if destination property is already present', function () {
        expect(altproperty(obj, 'name', ['domainName', 'domName'])).to.eql(obj);
    });

    it('should use the first alt name if destination property does not exist', function () {
        var destObj = {
            'name': 'n',
            'name2': 'domainN',
            'domName': 'dN',
            'domainName': 'domainN'
        };

        expect(altproperty(obj, 'name2', ['domainName', 'domName'])).to.eql(obj);
    });

    it('should not use alt names that do not exist', function () {
        var destObj = {
            'name': 'n',
            'name2': 'domainN',
            'domName': 'dN',
            'domainName': 'domainN'
        };

        expect(altproperty(obj, 'name2', ['dName', 'doName', 'domainName', 'domName'])).to.eql(obj);
    });

    it('should fail if missing all parameters', function () {
        expect(altproperty()).to.be.undefined;
    });

    it('should fail if missing destination property and alt names', function () {
        expect(altproperty({'a': 1})).to.eql({'a': 1});
    });

    it('should fail if missing alt names', function () {
        expect(altproperty({'a': 1}, 'b')).to.eql({'a': 1});
    });

    it('should fail if alt names is not an array', function () {
        expect(altproperty({'a': 1}, 'b', 'c')).to.eql({'a': 1});
    });
});
