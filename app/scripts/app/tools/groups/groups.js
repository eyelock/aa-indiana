'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools.groups', {
                parent: 'tools',
                url: '/tools/groups',
                data: {
                    pageTitle: 'tools.groups.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tools/groups/groups.html',
                        controller: 'ToolsGroupsCtrl'
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