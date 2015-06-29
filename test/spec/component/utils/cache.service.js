'use strict';

describe('Service: CacheService', function () {

  // load the service's module
  beforeEach(module('aaindianaApp'));

  // instantiate service
  var CacheService;
  beforeEach(inject(function (_CacheService_) {
    CacheService = _CacheService_;
  }));

  it('should do something', function () {
    expect(!!CacheService).toBe(true);
  });

});
