'use strict';

angular.module('aaTaskScheduler')
    .controller('ValueCheckerPluginCtrl', ['$scope', '$stateParams', 'TaskScheduler', function ($scope, $stateParams, TaskScheduler) {
        $scope.task = TaskScheduler.getTask($stateParams.taskId);
        $scope.job = $scope.task.jobs.current();
        $scope.plugin = $scope.job.plugin;
        $scope.result = $scope.plugin.checkedData;

        $scope.getRowClass = function (row) {
            var clazz = '';

            if (row.meta.isHeader) {
                clazz += 'header ';
            }

            if (row.meta.isComparison) {
                clazz += 'comparison ';
            }

            if (!row.meta.isEqual) {
                clazz += 'danger ';
            }

            return clazz;
        };

        $scope.getColClass = function (col) {
            var clazz = '';

            if (col.meta.isHeader) {
                clazz += 'header ';
            }

            if (col.meta.isComparison) {
                clazz += 'comparison ';
            }

            if (col.meta.isPrimary) {
                clazz += 'primary ';
            }

            if (!col.meta.isEqual) {
                clazz += 'danger ';
            }

            return clazz;
        };
    }]);