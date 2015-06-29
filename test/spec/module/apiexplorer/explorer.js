'use strict';

describe('Service: APIEXLORER - explorer', function () {

    // load the service's module
    beforeEach(module('aaApi'));

    // instantiate service
    var explorer;

    beforeEach(inject(function (_ApiExplorer_) {
        explorer = _ApiExplorer_;
    }));

    describe('provider methods', function () {
        describe('setUrls()', function () {
            it('should have a setUrls() method', function () {
                expect(explorer.setUrls).toBeDefined();
            });

            it('should should allow setting of an object then getting it', function () {
                var mySetObject = { 'id': 'testId' };
                explorer.setUrls(mySetObject);
                expect(explorer.getUrls()).toEqual(mySetObject);
            });
        });

        describe('setDataCentres()', function () {
            it('should have a setDataCentres() method', function () {
                expect(explorer.setDataCentres).toBeDefined();
            });
        });

        describe('getDataCentres()', function () {
            it('should have a getDataCentres() method', function () {
                expect(explorer.getDataCentres).toBeDefined();
            });
        });

        describe('setVersion()', function () {
            it('should have a setVersion() method', function () {
                expect(explorer.setVersion).toBeDefined();
            });

            it('should should allow setting of an object then getting it', function () {
                var mySetObject = { 'id': 'testId' };
                explorer.setDataCentres(mySetObject);
                expect(explorer.getDataCentres()).toEqual(mySetObject);
            });
        });

        describe('getVersion()', function () {
            it('should have a getVersion() method', function () {
                expect(explorer.getVersion).toBeDefined();
            });
        });

        describe('setType()', function () {
            it('should have a setType() method', function () {
                expect(explorer.setType).toBeDefined();
            });

            it('should should allow setting of an object then getting it', function () {
                var mySetObject = { 'id': 'testId' };
                explorer.setType(mySetObject);
                expect(explorer.getType()).toEqual(mySetObject);
            });
        });

        describe('getType()', function () {
            it('should have a getType() method', function () {
                expect(explorer.getType).toBeDefined();
            });
        });

        describe('setApis()', function () {
            it('should have a setApis() method', function () {
                expect(explorer.setApis).toBeDefined();
            });

            it('should should allow setting of an object then getting it', function () {
                var mySetObject = { 'id': 'testId' };
                explorer.setApis(mySetObject);
                expect(explorer.getApis()).toEqual(mySetObject);
            });
        });

        describe('getApis()', function () {
            it('should have a getApis() method', function () {
                expect(explorer.getApis).toBeDefined();
            });
        });
    });
});
