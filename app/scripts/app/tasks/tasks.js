'use strict';

angular.module('aaindianaApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks', {
                parent: 'site',
                abstract: true
            });
    });