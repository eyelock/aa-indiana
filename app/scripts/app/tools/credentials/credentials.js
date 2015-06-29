'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools.credentials', {
                parent: 'tools',
                url: '/tools/credentials',
                data: {
                    pageTitle: 'tools.credentials.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tools/credentials/credentials.html',
                        controller: 'ToolsCredentialsCtrl'
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