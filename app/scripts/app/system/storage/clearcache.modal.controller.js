'use strict';

angular.module('aaindianaApp')
    .controller('SystemStorageClearCacheModalCtrl', [
    '$scope', '$element', 'cacheId', 'close',
    function ($scope, $element, cacheId, close) {
        $scope.cacheId = cacheId;

        $scope.clear = function () {
            $element.modal('hide');
            close(cacheId, 500);
        };

        $scope.cancel = function () {
            $element.modal('hide');
            close(null, 500);
        };
    }]);