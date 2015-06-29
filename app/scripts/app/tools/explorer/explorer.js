'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools.explorer', {
                parent: 'tools',
                url: '/tools/explorer',
                data: {
                    pageTitle: 'tools.explorer.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tools/explorer/explorer.html',
                        controller: 'ToolsExplorerCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('tools');
                        $translatePartialLoader.addPart('system');
                        return $translate.refresh();
                    }]
                }
            });
    });