'use strict';

angular.module('aaTaskScheduler')
    .config(function ($stateProvider) {
        $stateProvider
            .state('scheduler.plugins.inputprompt', {
                parent: 'scheduler.plugins',
                params: {
                    taskId: null
                },
                data: {
                    pageTitle: 'scheduler.plugins.inputprompt.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/module/scheduler/plugins/inputprompt/inputprompt.html',
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
            });
    });