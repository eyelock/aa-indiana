'use strict';

describe('Service: TaskScheduler - Scheduler', function () {

    // load the service's module
    beforeEach(module('taskScheduler'));

    // instantiate service
    var TaskScheduler,
        TaskFactory;

    beforeEach(module(function ($provide) {
        $provide.value('TaskFactory', {
            thumbnailUrl: function (id) {
                var url = id;
            }
        });
    }));

    beforeEach(inject(function (_TaskFactory_) {
        TaskFactory = _TaskFactory_;
    }));

    beforeEach(inject(function (_TaskScheduler_) {
        TaskScheduler = _TaskScheduler_;
    }));

    it('should have a registerJobPlugin() method', function () {
        expect(TaskScheduler.registerJobPlugin).toBeDefined();
    });

    it('registerJobPlugin() should should return false if registering a job plugin that hasnt been registered before', function () {

    });

    it('registerJobPlugin() should should return true if registering a job plugin that has been registered before', function () {

    });

    it('should have a hasJobPlugin() method', function () {
        expect(TaskScheduler.hasJobPlugin).toBeDefined();
    });

    it('hasJobPlugin() should should return true if a job plugin exists', function () {

    });

    it('hasJobPlugin() should should return false if a job plugin does not exist', function () {

    });

    it('should have a getJobPlugin() method', function () {
        expect(TaskScheduler.getJobPlugin).toBeDefined();
    });

    it('getJobPlugin() should should return null if a plugin does not exist', function () {

    });

    it('getJobPlugin() should should return a job plugin with same id if a plugin does exist', function () {

    });

});
