'use strict';

angular.module('aaTaskScheduler')
    .controller('InputPromptConfirmModalCtrl', [
    '$scope', '$element', 'labels', 'formModel', 'close',
    function ($scope, $element, labels, formModel, close) {
        $scope.labels = labels;
        $scope.formModel = formModel;

        $scope.confirm = function () {
            $element.modal('hide');
            close(true, 500);
        };

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };
    }]);