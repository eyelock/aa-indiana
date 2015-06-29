'use strict';

angular.module('aaindianaApp')
    .controller('TasksRunCtrl', ['$scope', '$stateParams', '$log', 'growl', 'TaskRegistry', 'TaskScheduler', function ($scope, $stateParams, $log, growl, TaskRegistry, TaskScheduler) {
        var id = $stateParams.id,
            getTaskConfig,
            processTaskConfig,
            processError,
            taskPromise;

        $scope.taskDetails = {};
        $scope.taskConfig = {};
        $scope.taskConfigString = '';
        $scope.task = null;
        $scope.taskNotifcations = [];

        processError = function (error) {
            $log.error(error);
            growl.error('global.notifications.async.error');
        };

        processTaskConfig = function (result) {
            $scope.taskConfig = result;
            growl.success('global.notifications.async.finish');

            var task,
                taskId = $scope.taskConfig.id;

            if (TaskScheduler.hasTask(taskId)) {
                task = TaskScheduler.getTask(taskId);
            } else {
                task = TaskScheduler.createTask(taskId);
                task.configure($scope.taskConfig);
            }

            $scope.task = task;
        };

        getTaskConfig = function(result) {
            $scope.taskDetails =  result;

            if ($scope.taskDetails.url) {
                TaskRegistry.loadConfigByUrl($scope.taskDetails.url)
                    .then(processTaskConfig)
                    .catch(processError);
            } else if ($scope.taskDetails.config) {
                processTaskConfig(JSON.parse($scope.taskDetails.config));
            } else {
                $log.error('could not get config of task');
            }
        };

        $scope.runTask = function () {
            if ($scope.task.running) {
                $scope.task.execute();
            } else {
                taskPromise = $scope.task.start();
                taskPromise.finally(null, function (notification) {
                    $scope.taskNotifcations.push(notification);
                });
            }
        };

        $scope.init = function () {
            growl.info('global.notifications.async.start');

            TaskRegistry.getById(id)
                .then(getTaskConfig)
                .catch(processError);
        };

        $scope.init();
    }]);