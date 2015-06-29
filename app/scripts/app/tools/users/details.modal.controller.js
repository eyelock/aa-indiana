/* jshint -W106 */
'use strict';

angular.module('aaindianaApp')
    .controller('ToolsUsersDetailsModalCtrl', [
    '$scope', '$element', '$log', 'growl', 'ApiHelper', 'login', 'close',
    function ($scope, $element, $log, growl, ApiHelper, login, close) {
        $scope.login = login;
        $scope.details = [];
        $scope.groups = [];

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };

        $scope.init = function () {
            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'Permissions',
                method: 'GetLogin',
                args: {login: $scope.login.login}
            })
                .then(function (result) {
                    growl.success('global.notifications.async.finish');
                    $scope.details = result.data;

                    //having issues using 'track by $index' when duplicates in group
                    //brute force removal of dups
                    $scope.groups = $scope.details.group_names.filter(function(item, pos, self) {
                        return self.indexOf(item) === pos;
                    });

                    delete $scope.details.group_names;
                })
                .catch(function (error) {
                    growl.error('global.notifications.async.error');
                    $log.error(error);
                });
        };

        $scope.init();
    }]);