'use strict';

angular.module('aaindianaApp')
    .controller('SystemAuthModalCtrl', [
    '$scope', '$element', 'close',
    function ($scope, $element, close) {
        $scope.logout = function () {
            $element.modal('hide');
            close(true, 500);
        };

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };
    }]);