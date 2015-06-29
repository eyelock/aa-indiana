'use strict';

angular.module('aaindianaApp')
    .controller('DataFeedActivityModalCtrl', [
    '$scope', '$element', 'datafeed', 'close',
    function ($scope, $element, datafeed, close) {
        $scope.datafeed = datafeed;

        $scope.cancel = function () {
            $element.modal('hide');
            close(null, 500);
        };
    }]);