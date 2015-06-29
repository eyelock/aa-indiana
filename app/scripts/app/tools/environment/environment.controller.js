'use strict';

angular.module('aaindianaApp')
    .controller('ToolsEnvironmentCtrl', function ($scope, Environment) {
        $scope.environments = Environment.query();
    });