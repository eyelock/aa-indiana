'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks.run', {
                parent: 'tasks',
                url: '/tasks/run/:id',
                data: {
                    pageTitle: 'tasks.run.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tasks/run/run.html',
                        controller: 'TasksRunCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('tasks');
                        $translatePartialLoader.addPart('scheduler-module');
                        $translatePartialLoader.addPart('scheduler-custom');
                        return $translate.refresh();
                    }]
                }
            });
    });