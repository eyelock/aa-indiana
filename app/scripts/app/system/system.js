'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('system', {
                parent: 'site',
                abstract: true
            });
    });