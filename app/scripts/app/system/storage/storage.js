'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('system.storage', {
                parent: 'system',
                url: '/system/storage',
                data: {
                    pageTitle: 'system.storage.title',
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/system/storage/storage.html',
                        controller: 'SystemStorageCtrl'
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