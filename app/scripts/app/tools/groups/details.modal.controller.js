/* jshint -W106 */
'use strict';

angular.module('aaindianaApp')
    .controller('ToolsGroupsDetailsModalCtrl', [
    '$scope', '$element', '$log', 'growl', 'ApiHelper', 'group', 'close',
    function ($scope, $element, $log, growl, ApiHelper, group, close) {
        $scope.group = group;
        $scope.details = {};

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };

        $scope.init = function () {
            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'Permissions',
                method: 'GetGroup',
                args: {group_name: $scope.group.group_name}
            })
                .then(function (result) {
                    growl.success('global.notifications.async.finish');
                    $scope.details = result.data;
                })
                .catch(function (error) {
                    growl.error('global.notifications.async.error');
                    $log.error(error);
                });
        };

        $scope.init();
    }]);