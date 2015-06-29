'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks.all', {
                parent: 'tasks',
                url: '/tasks/all',
                data: {
                    pageTitle: 'tasks.predefined.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tasks/list/list.html',
                        controller: 'TasksAllCtrl'
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
            })
            .state('tasks.favourites', {
                parent: 'tasks',
                url: '/tasks/favourites',
                data: {
                    pageTitle: 'tasks.favourites.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tasks/list/list.html',
                        controller: 'TasksFavouritesCtrl'
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