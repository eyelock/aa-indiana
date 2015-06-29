'use strict';

angular.module('aaindianaApp')
    .controller('TasksCustomDeleteModalCtrl', [
    '$scope', '$element', 'task', 'close',
    function ($scope, $element, task, close) {
        $scope.task = task;

        $scope.confirm = function () {
            $element.modal('hide');
            close(true, 500);
        };

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };
    }]);