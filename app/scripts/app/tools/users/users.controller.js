'use strict';

angular.module('aaindianaApp')
    .controller('ToolsUsersCtrl', [
    '$scope', 'growl', '$log', 'ModalService', 'ApiHelper',
    function ($scope, growl, $log, ModalService, ApiHelper) {
        $scope.logins = [];
        $scope.cacheDetails = null;

        $scope.loadAll = function () {
            $scope.logins = [];
            $scope.cacheDetails = null;

            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'Permissions',
                method: 'GetLogins',
                args: {}
            })
                .then(function (result) {
                    if (result.hasOwnProperty('cache')) {
                        growl.warning('global.notifications.async.cached');
                        $scope.cacheDetails = result.cache;
                    } else {
                        growl.success('global.notifications.async.finish');
                    }

                    $scope.logins = result.data;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.showDetails = function (login) {
            ModalService.showModal({
                templateUrl: 'scripts/app/tools/users/details.modal.html',
                controller: 'ToolsUsersDetailsModalCtrl',
                inputs: {
                    login: login
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                });
        };

        $scope.loadAll();
    }]);