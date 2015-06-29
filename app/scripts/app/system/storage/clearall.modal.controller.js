'use strict';

angular.module('aaindianaApp')
    .controller('SystemStorageClearAllModalCtrl', [
    '$scope', '$element', 'close',
    function ($scope, $element, close) {
        $scope.clear = function () {
            $element.modal('hide');
            close(true, 500);
        };

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };
    }]);