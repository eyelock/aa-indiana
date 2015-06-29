'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('system.auth', {
                parent: 'system',
                url: '/system/auth',
                data: {
                    pageTitle: 'system.auth.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/system/auth/auth.html',
                        controller: 'SystemAuthCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('system');
                        return $translate.refresh();
                    }]
                }
            });
    });