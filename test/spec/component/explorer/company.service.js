'use strict';

describe('Service: Company', function () {

  // load the service's module
  beforeEach(module('aaindianaApp'));

  // instantiate service
  var CompanyApi;
  beforeEach(inject(function (_CompanyApi_) {
    CompanyApi = _CompanyApi_;
  }));

  it('should do something', function () {
    expect(!!CompanyApi).toBe(true);
  });

});
