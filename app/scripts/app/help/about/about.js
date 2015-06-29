'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('help.about', {
                parent: 'help',
                url: '/help/about',
                data: {
                    pageTitle: 'help.about.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/help/about/about.html',
                        controller: 'HelpAboutCtrl'
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