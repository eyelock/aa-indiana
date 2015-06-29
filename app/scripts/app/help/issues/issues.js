'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('help.issues', {
                parent: 'help',
                url: '/help/issues',
                data: {
                    pageTitle: 'help.issues.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/help/issues/issues.html',
                        controller: 'HelpIssuesCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help');
                        return $translate.refresh();
                    }]
                }
            });
    });