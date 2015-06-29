'use strict';

angular.module('aaindianaApp')
    .controller('TasksAllCtrl', ['$scope', '$log', 'growl', 'TaskRegistry', 'Preferences', function ($scope, $log, growl, TaskRegistry, Preferences) {
        $scope.alltasks = {};
        $scope.tasks = {};
        $scope.translatePrefix = 'tasks.all';

        $scope.init = function () {
            growl.info('global.notifications.async.start');

            TaskRegistry.getAll()
                .then(function (result) {
                    $scope.alltasks = result;
                    $scope.tasks = $scope.alltasks;
                    growl.success('global.notifications.async.finish');
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.toggleFavouriteTask = function (task) {
            Preferences.getFavouriteTasks();

            if (Preferences.isFavouriteTask(task.id)) {
                Preferences.removeFavouriteTask(task);
            } else {
                Preferences.addFavouriteTask(task);
            }
        };

        $scope.init();
    }]);