'use strict';

angular.module('aaTaskScheduler')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scheduler.plugins.datafeedlist', {
                parent: 'scheduler.plugins',
                params: {
                    taskId: null
                },
                data: {
                    pageTitle: 'scheduler.plugins.datafeedlist.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/component/scheduler/plugins/datafeed/datafeed.list.results.html',
                        controller: 'DataFeedListResultsCtrl'
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