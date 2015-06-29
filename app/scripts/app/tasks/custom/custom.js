'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks.custom', {
                parent: 'tasks',
                url: '/tasks/custom',
                data: {
                    pageTitle: 'tasks.custom.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tasks/custom/custom.html',
                        controller: 'TasksCustomCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('tasks');
                        return $translate.refresh();
                    }]
                }
            })
            .state('tasks.export', {
                parent: 'tasks',
                url: '/tasks/export',
                data: {
                    pageTitle: 'tasks.export.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tasks/custom/export.html',
                        controller: 'TasksExportCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('tasks');
                        return $translate.refresh();
                    }]
                }
            })
            .state('tasks.import', {
                parent: 'tasks',
                url: '/tasks/import',
                data: {
                    pageTitle: 'tasks.import.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tasks/custom/import.html',
                        controller: 'TasksImportCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('tasks');
                        return $translate.refresh();
                    }]
                }
            });
    });