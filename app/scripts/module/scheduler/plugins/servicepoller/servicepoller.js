'use strict';

angular.module('aaTaskScheduler')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scheduler.plugins.servicepoller', {
                parent: 'scheduler.plugins',
                params: {
                    taskId: null
                },
                data: {
                    pageTitle: 'scheduler.plugins.servicepoller.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/module/scheduler/plugins/servicepoller/servicepoller.html',
                        controller: 'ServicePollerPluginCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('scheduler-module');
                        $translatePartialLoader.addPart('scheduler-custom');
                        return $translate.refresh();
                    }]
                }
            });
    });