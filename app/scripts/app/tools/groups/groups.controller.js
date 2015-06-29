'use strict';

angular.module('aaindianaApp')
    .controller('ToolsGroupsCtrl', [
    '$scope', 'growl', '$log', 'ModalService', 'ApiHelper',
    function ($scope, growl, $log, ModalService, ApiHelper) {
        $scope.groups = [];

        $scope.init = function () {
            $scope.logins = [];
            $scope.cacheDetails = null;

            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'Permissions',
                method: 'GetGroups',
                args: {}
            })
                .then(function (result) {
                    $scope.groups = result.data;
                    growl.success('global.notifications.async.finish');
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.showDetails = function (group) {
            ModalService.showModal({
                templateUrl: 'scripts/app/tools/groups/details.modal.html',
                controller: 'ToolsGroupsDetailsModalCtrl',
                inputs: {
                    group: group
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                });
        };

        $scope.init();
    }]);