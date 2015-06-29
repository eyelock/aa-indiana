'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools.reportsuites', {
                parent: 'tools',
                url: '/tools/reportsuites',
                data: {
                    pageTitle: 'tools.reportsuites.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/tools/reportsuites/reportsuites.html',
                        controller: 'ToolsReportSuitesCtrl'
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