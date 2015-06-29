'use strict';

angular.module('aaTaskScheduler')
    .controller('ServicePollerPluginCtrl', ['$scope', '$stateParams', 'TaskScheduler', function ($scope, $stateParams, TaskScheduler) {
        $scope.task = TaskScheduler.getTask($stateParams.taskId);
        $scope.job = $scope.task.jobs.current();
        $scope.plugin = $scope.job.plugin;
        $scope.servicePromise = $scope.plugin.lastPoll.promise;
        $scope.lastNotification = {};
        $scope.lastResult = $scope.task.lastResult;
        $scope.lastPoll = $scope.plugin.lastPoll;

        $scope.init = function () {
            $scope.servicePromise
                .finally(null, function(notification) {
                    $scope.lastNotification = notification;
                    $scope.lastPoll = notification.polling;
                });
        };

        $scope.init();
    }]);