'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('help', {
                parent: 'site',
                abstract: true
            });
    });