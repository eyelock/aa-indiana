'use strict';

describe('Service: WSSE - APIEXPLORER', function () {

    // load the service's module
    beforeEach(module('aaApi'));

    // instantiate service
    var WSSE,
        testUsername = '',
        testPassword = '',
        testNonce = '',
        testCreated = '',
        testDigest = '',
        testResult = '';

    beforeEach(inject(function (_WSSE_) {
        WSSE = _WSSE_;
    }));

    describe('getHeader()', function () {
        it('should have a getHeader() method', function () {
            expect(WSSE.getHeader()).toBeDefined();
        });

        it('should return expected result for test parameters', function () {
            expect(WSSE.getHeader(testUsername, testPassword, testNonce, testCreated)).not.toBeNull(testResult);
        });
    });

    describe('generateNonce()', function () {
        it('should have a generateNonce() method', function () {
            expect(WSSE.generateNonce).toBeDefined();
        });

        it('should not return null', function () {
            expect(WSSE.generateNonce()).not.toBeNull();
        });

        it('should be of length 24 characters', function () {
            expect(WSSE.generateNonce().length).toEqual(24);
        });
    });

    describe('generateCreated()', function () {
        it('should have a generateCreated() method', function () {
            expect(WSSE.generateCreated).toBeDefined();
        });

        it('should not return null', function () {
            expect(WSSE.generateCreated()).not.toBeNull();
        });

        it('should return a date string that can be cast as date', function () {
            var returnDate = WSSE.generateCreated(),
                parsedDate = new Date(returnDate);
            expect(parsedDate).not.toBeNull();
        });
    });

    describe('parse()', function () {
        it('should have a parse() method', function () {
            expect(WSSE.parse).toBeDefined();
        });

        it('should throw an error with an invalid regexp object', function () {
            var testInvalidRegExp = 'invalidregexp';
            expect(function () { WSSE.parse(testResult, testInvalidRegExp); }).toThrowError('regexp argument must be of type instance RegExp');
        });

        it('should throw an error with an zero length string to match against', function () {
            var testValidRegExp = /Username="(.*)"/;
            expect(function () { WSSE.parse('', testValidRegExp); }).toThrowError('string argument must be of non zero length after being trimmed');
        });

        it('should throw an error with an string to match against that can be trim() to zero length', function () {
            var testValidRegExp = /Username="(.*)"/;
            expect(function () { WSSE.parse('    ', testValidRegExp); }).toThrowError('string argument must be of non zero length after being trimmed');
        });

        /* TODO isn't capturing the error return when testing for a matched parathensis
        it('should throw an error when the regexp has no sub parenthisis matching', function () {
            var testValidRegExp = /Username=".*"/;
            expect(function () { WSSE.parse(testResult, testValidRegExp); }).toThrowError('regexp paramter did not contain parenthized match');
        });
        */

        it('should throw an error when the regexp doesnt match anything', function () {
            var testValidRegExp = /IAmNotGoingToMatchAnything="(.*)"/;
            expect(function () { return WSSE.parse(testResult, testValidRegExp); }).toThrowError('regexp paramter did not contain parenthized match');
        });

        /* TODO isn't capturing the error return when testing for a matched parathensis
        it('should return a match for sub parenthisis', function () {
            var testValidRegExp = /Nonce="(.*)", Created=/;
            expect(function () { return WSSE.parse(testResult, testValidRegExp); }).not.toBeNull();
            expect(function () { return WSSE.parse(testResult, testValidRegExp).length; }).toEqual(24);
        });
        */
    });

    describe('parseNonce()', function () {
        it('should have a parseNonce() method', function () {
            expect(WSSE.parseNonce).toBeDefined();
        });

        it('should return the correct result', function () {
            expect(WSSE.parseNonce(testResult)).toEqual(testNonce);
        });
    });

    describe('parseCreated()', function () {
        it('should have a parseCreated() method', function () {
            expect(WSSE.parseCreated).toBeDefined();
        });

        it('should return the correct result', function () {
            expect(WSSE.parseCreated(testResult)).toEqual(testCreated);
        });
    });

    describe('parseUsername()', function () {
        it('should have a parseUsername() method', function () {
            expect(WSSE.parseUsername).toBeDefined();
        });

        it('should return the correct result', function () {
            expect(WSSE.parseUsername(testResult)).toEqual(testUsername);
        });
    });

    describe('parseDigest()', function () {
        it('should have a parseDigest() method', function () {
            expect(WSSE.parseDigest).toBeDefined();
        });

        it('should return the correct result', function () {
            expect(WSSE.parseDigest(testResult)).toEqual(testDigest);
        });
    });
});
