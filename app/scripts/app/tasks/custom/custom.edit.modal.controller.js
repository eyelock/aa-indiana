'use strict';

angular.module('aaindianaApp')
    .controller('TasksCustomEditModalCtrl', [
    '$scope', '$element', 'task', 'close',
    function ($scope, $element, task, close) {
        $scope.task = task;
        $scope.isCreate = angular.equals({}, task);

        $scope.confirm = function () {
            $element.modal('hide');
            close($scope.task, 500);
        };

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };
    }]);