'use strict';

angular.module('aaindianaApp')
    .controller('SystemAuthCtrl', [
    '$scope', '$state', '$window', 'growl', 'ModalService', 'AuthServiceProvider', 'Auth', 'CacheService',
    function ($scope, $state, $window, growl, ModalService, AuthServiceProvider, Auth, CacheService) {
        $scope.username = '';
        $scope.secret = '';
        $scope.alerts = [];
        $scope.loading = false;
        $scope.authenticatedUser = false;

        $scope.init = function () {
            $scope.username = '';
            $scope.secret = '';

            //test and see if we have the auth credentials first
            var token = AuthServiceProvider.getToken();
            if (angular.isDefined(token)) {
                $scope.username = token.credentials.username;
                $scope.secret = token.credentials.secret;
                $scope.authenticatedUser = true;
            }
        };

        $scope.confirmLogout = function () {
            ModalService.showModal({
                templateUrl: 'scripts/app/system/auth/auth.modal.html',
                controller: 'SystemAuthModalCtrl'
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.logout();
                        }
                    });
                });
        };

        $scope.logout = function () {
            CacheService.clearAll();
            $scope.alerts = [];

            $scope.authenticatedUser = false;

            $scope.alerts = [];
            $scope.alerts.push({
                type: 'success',
                msg: 'You were successfuly logged out.' //TODO This needs translated
            });

            $state.go('system.auth');
            $window.location.reload();
        };

        $scope.login = function () {
            $scope.alerts = [];

            $scope.$broadcast('show-errors-check-validity');
            if ($scope.editForm.$invalid) { return; }

            Auth.logout();

            $scope.loading = true;
            growl.info('global.notifications.async.start');

            Auth.login({
                username: $scope.username,
                secret: $scope.secret
            })
                .then(function () {
                    $scope.loading = false;
                    growl.success('global.notifications.async.finish');
                    $scope.authenticatedUser = true;

                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Your credentials were successfully verified and saved.' //TODO This needs translated
                    });
                })
                .catch(function (error) {
                    $scope.loading = false;
                    growl.info('global.notifications.async.error');
                    $scope.alerts.push({
                        type: 'danger',
                        msg: error.status + ' - ' + error.data
                    });
                });
        };

        $scope.init();
    }]);