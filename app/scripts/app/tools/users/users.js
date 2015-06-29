'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools.users', {
                parent: 'tools',
                url: '/tools/users',
                data: {
                    pageTitle: 'tools.users.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tools/users/users.html',
                        controller: 'ToolsUsersCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('tools');
                        return $translate.refresh();
                    }]
                }
            });
    });