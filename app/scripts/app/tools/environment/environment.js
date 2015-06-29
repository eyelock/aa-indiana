'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools.environment', {
                parent: 'tools',
                url: '/tools/environment',
                data: {
                    pageTitle: 'tools.environment.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tools/environment/environment.html',
                        controller: 'ToolsEnvironmentCtrl'
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