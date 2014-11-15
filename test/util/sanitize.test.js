var expect = require('chai').expect
    sanitize = require('../../util/sanitize');

describe('sanitize', function () {
    describe('domName', function () {
        it('should not change a valid name', function () {
            var name = 'thisismyname12345';
            expect(sanitize.domName(name)).to.eql(name);
        });

        it('should escape dashes', function () {
            expect(sanitize.domName('-this-is-my-name-12345')).to.eql('\\-this\\-is\\-my\\-name\\-12345');
        });

        it('should escape quotation marks', function () {
            expect(sanitize.domName('this"is\'my"name\'12345')).to.eql('this\\"is\\\'my\\"name\\\'12345');
        });

        it('should escape dollar sign', function () {
            expect(sanitize.domName('this$sign')).to.eql('this\\$sign');
        });
    });

    describe('domId', function() {
        it('should accept an id as number', function () {
            expect(sanitize.domId(100)).to.eql(100);
        });

        it('should accept an id as string', function () {
            expect(sanitize.domId('100')).to.eql(100);
        });

        it('should accept an id as floating point number', function () {
            expect(sanitize.domId(100.4)).to.eql(100);
        });

        it('should accept an edge case string starting with a number and letters as suffix', function () {
            expect(sanitize.domId('100asdf')).to.eql(100);
        });

        it('should accept an edge case array with a number at the top', function () {
            expect(sanitize.domId([100])).to.eql(100);
        });

        it('should reject a string with letters', function () {
            expect(sanitize.domId('a100a')).to.eql('');
        });

        it('should reject a boolean', function () {
            expect(sanitize.domId(true)).to.eql('');
        });

        it('should reject an object', function () {
            expect(sanitize.domId({'a': 100})).to.eql('');
        });

        it('should reject an array with a string on top', function () {
            expect(sanitize.domId(['asdf'])).to.eql('');
        });
    });
});
