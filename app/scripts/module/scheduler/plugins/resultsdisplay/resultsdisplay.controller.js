'use strict';

angular.module('aaTaskScheduler')
    .controller('ResultsDisplayPluginCtrl', ['$scope', '$stateParams', 'TaskScheduler', function ($scope, $stateParams, TaskScheduler) {
        $scope.task = TaskScheduler.getTask($stateParams.taskId);
        $scope.job = $scope.task.jobs.current();
        $scope.plugin = $scope.job.plugin;
        $scope.lastResult = $scope.task.lastResult;

        //check if not multiple results and put it in an arary
        if (!$scope.plugin.multipleResults) {
            $scope.lastResult = [$scope.lastResult];
        }

        //sometimes the JSON returned can overwhelm the editor, provide mechanism to hide it
        $scope.jsonData = {};
        $scope.disableJsonEditor = $scope.plugin.disableJsonEditor;
        if (!$scope.disableJsonEditor) {
            $scope.jsonData = $scope.lastResult;
        }
    }]);