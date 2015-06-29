'use strict';

angular.module('aaTaskScheduler')
    .directive('jobHeader', function () {
        return {
            restrict: 'A',
            scope: {
                jobHeader: '='
            },
            link: function($scope) {
                $scope.job = $scope.jobHeader;
                $scope.task = $scope.job.task;
                $scope.jobs = $scope.task.jobs;
                $scope.progressBarType = $scope.jobs.currentStep !== $scope.jobs.length ? 'info' : 'success';
            },
            templateUrl: 'scripts/module/scheduler/directives/job.header.html'
        };
    });
