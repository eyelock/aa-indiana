'use strict';

angular.module('aaindianaApp')
    .controller('TasksExportCtrl', ['$scope', '$log', 'growl', 'TaskRegistry', function ($scope, $log, growl, TaskRegistry) {
        $scope.tasks = [];
        $scope.hasLoaded = false;

        $scope.init = function () {
            $scope.tasks = [];
            $scope.hasLoaded = false;
        };

        $scope.loadForExport = function () {
            $scope.init();

            TaskRegistry.loadCustom()
                .then(function (result) {
                    $scope.tasks = result;
                    $scope.hasLoaded = true;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.init();
    }]);