'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tools', {
                parent: 'site',
                abstract: true
            });
    });