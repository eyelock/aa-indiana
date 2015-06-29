'use strict';

angular.module('aaindianaApp')
    .controller('SystemPreferencesCtrl', ['$scope', '$log', 'Preferences', 'TaskRegistry', function ($scope, $log, Preferences, TaskRegistry) {
        $scope.favtasks = {};
        $scope.alerts = [];

        $scope.initFavTasks = function () {
            $scope.favtasks = {};
            $scope.favtasks.alltasks = [];
            $scope.favtasks.favourites = Preferences.getFavouriteTasks();

            TaskRegistry.getAll()
                .then(function (result) {
                    $scope.favtasks.alltasks = result;

                    //then match them up with favs
                    $scope.favtasks.alltasks.forEach(function (task) {
                        if ($scope.favtasks.favourites.hasOwnProperty(task.id)) {
                            //replace the actual value with the task
                            $scope.favtasks.favourites[task.id] = task;
                        }
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        $scope.init = function () {
            $scope.alerts = [];
            $scope.initFavTasks();
        };

        $scope.init();
    }]);