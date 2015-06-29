'use strict';

angular.module('aaTaskScheduler')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scheduler.plugins.resultsdisplay', {
                parent: 'scheduler.plugins',
                params: {
                    taskId: null
                },
                data: {
                    pageTitle: 'scheduler.plugins.resultsdisplay.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/module/scheduler/plugins/resultsdisplay/resultsdisplay.html',
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