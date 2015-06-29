/* jshint -W106 */
'use strict';

angular.module('aaindianaApp')
    .controller('ToolsCredentialsCtrl', [
    '$scope', '$q', '$log', 'growl', 'ApiHelper', 'Principal', 'TransformUtils',
    function ($scope, $q, $log, growl, ApiHelper, Principal, TransformUtils) {
        $scope.groups = [];
        $scope.versionAccess = [];
        $scope.endpoint = '';
        $scope.loginDetails = [];

        var token, loginPromise, versionAccessPromise, endpointPromise;

        $scope.loadAll = function () {
            $scope.groups = [];
            $scope.loginDetails = [];
            $scope.cacheDetails = null;

            loginPromise = ApiHelper.executeMethod({
                code: 'Permissions',
                method: 'GetLogin',
                args: {
                    login: TransformUtils.getLogin(token.credentials.username)
                }
            })
                .then(function (result) {
                    $scope.loginDetails = result.data;
                    $scope.groups = $scope.loginDetails.group_names;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });

            versionAccessPromise = ApiHelper.executeMethod({
                code: 'Company',
                method: 'GetVersionAccess',
                args: {}
            })
                .then(function (result) {
                    $scope.versionAccess = result.data;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });

            endpointPromise = ApiHelper.executeMethod({
                code: 'Company',
                method: 'GetEndpoint',
                args: {}
            })
                .then(function (result) {
                    $scope.endpoint = result.data;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });

            //show success when all of them have finished
            $q.all([loginPromise, versionAccessPromise, endpointPromise])
                .then(function () {
                    growl.success('global.notifications.async.finish');
                });
        };

        growl.info('global.notifications.async.start');

        Principal.identity()
            .then(function (result) {
                token = result;
                $scope.loadAll();
            })
            .catch(function (error) {
                $log.error(error);
                growl.error('global.notifications.async.error');
            });
    }]);