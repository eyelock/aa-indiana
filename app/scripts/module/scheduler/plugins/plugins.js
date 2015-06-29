'use strict';

angular.module('aaTaskScheduler')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scheduler.plugins', {
                abstract: true,
                parent: 'scheduler'
            });
    });