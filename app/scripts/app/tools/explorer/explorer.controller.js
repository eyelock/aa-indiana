'use strict';

angular.module('aaindianaApp')
    .controller('ToolsExplorerCtrl', ['$scope', '$q', '$filter', '$log', 'growl', 'Environment', 'ApiExplorer', 'Auth', function ($scope, $q, $filter, $log, growl, Environment, ApiExplorer, Auth) {
        $scope.loading = false;
        $scope.credentials = {};
        $scope.environment = {};
        $scope.environments = Environment.query();
        $scope.apis = ApiExplorer.apis;

        var token = Auth.getToken();

        if (angular.isDefined(token)) {
            $scope.credentials = token.credentials;
            $scope.environment = Environment.getFromEndpoint(token.endpoint);
        }

        $scope.initRequest = function () {
            $scope.apiMethods = [];
            $scope.apiMethodName = '';
            $scope.apiMethod = null;
            $scope.apiArgs = {};
        };

        $scope.initResponse = function () {
            $scope.requestError = null;
            $scope.apiResponse = null;
        };

        $scope.initExplorer = function () {
            $scope.apiName = '';
            $scope.api = {};

            $scope.initRequest();
            $scope.initResponse();
        };

        $scope.setApi = function () {
            var api =  ApiExplorer.getApi({
                code: $scope.apiName,
                token: {
                    credentials: $scope.credentials,
                    endpoint: $scope.environment.url
                }
            });

            api
                .then(function (result) {
                    $scope.initRequest();

                    $scope.api = result;
                    $scope.apiMethods = $scope.api.getMethods();
                })
                .catch(function (error) {
                    growl.error('global.notifications.async.error');
                    $log.error(error);
                });
        };

        $scope.setApiMethod = function () {
            $scope.initResponse();
            $scope.apiMethod = $scope.api.methods[$scope.apiMethodName];
            $scope.apiArgs = $scope.apiMethod.defaultArgs;
        };

        $scope.runApiRequest = function () {
            var promise;

            $scope.initResponse();

            $scope.$broadcast('show-errors-check-validity');
            if ($scope.editForm.$invalid) { return; }

            $scope.loading = true;
            growl.info('global.notifications.async.start');

            promise = $scope.apiMethod.execute($scope.apiArgs);
            promise.
                then(function (result) {
                    $scope.loading = false;
                    growl.success('global.notifications.async.finish');
                    $scope.apiResponse = result;
                })
                .catch(function (error) {
                    $scope.loading = false;
                    growl.error('global.notifications.async.error');
                    $scope.requestError = error;
                });
        };

        //set up the args for explorer config
        $scope.initExplorer();
    }]);