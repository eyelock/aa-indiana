'use strict';

describe('Filter: millSecondsToTimeString', function () {

    // load the filter's module
    beforeEach(module('aaindianaApp'));

    // initialize a new instance of the filter before each test
    var millSecondsToTimeString,
        testMillisecondsValue = 1429988861,
        testMillisecondsConverted = '16 days 13 hours 13 minutes ';

    beforeEach(inject(function ($filter) {
        millSecondsToTimeString = $filter('millSecondsToTimeString');
    }));

    it('should return the input converted to the display time format "X days Y hours Z minutes"', function () {
        expect(millSecondsToTimeString(testMillisecondsValue)).toBe(testMillisecondsConverted);
    });

});
