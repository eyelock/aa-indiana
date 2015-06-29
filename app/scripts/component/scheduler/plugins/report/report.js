'use strict';

angular.module('aaTaskScheduler')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scheduler.plugins.reportqueueprompt', {
                parent: 'scheduler.plugins',
                params: {
                    taskId: null
                },
                data: {
                    pageTitle: 'scheduler.plugins.reportqueuelist.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/component/scheduler/plugins/report/report.queue.prompt.html',
                        controller: 'InputPromptPluginCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('scheduler-module');
                        $translatePartialLoader.addPart('scheduler-custom');
                        return $translate.refresh();
                    }]
                }
            })
            .state('scheduler.plugins.reportqueuelist', {
                parent: 'scheduler.plugins',
                params: {
                    taskId: null
                },
                data: {
                    pageTitle: 'scheduler.plugins.reportqueuelist.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/component/scheduler/plugins/report/report.queue.list.html',
                        controller: 'ResultsDisplayPluginCtrl'
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