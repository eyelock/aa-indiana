'use strict';

angular.module('aaTaskScheduler')
    .directive('servicePollerInfo', function () {
        return {
            restrict: 'A',
            scope: {
                servicePollerInfo: '='
            },
            templateUrl: 'scripts/module/scheduler/plugins/servicepoller/servicepoller.info.html'
        };
    });