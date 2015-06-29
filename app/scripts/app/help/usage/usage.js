'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('help.usage', {
                parent: 'help',
                url: '/help/usage',
                data: {
                    pageTitle: 'help.useage.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/help/usage/usage.html',
                        controller: 'HelpUsageCtrl'
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