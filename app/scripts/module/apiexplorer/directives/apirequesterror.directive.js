'use strict';

angular.module('aaApi')
    .directive('apiRequestError', function () {
        return {
            restrict: 'A',
            scope: {
                apiRequestError: '='
            },
            link: function($scope) {
                $scope.$watch('apiRequestError', function(){
                    if (!angular.equals({}, $scope.apiRequestError)) {
                        $scope.err = $scope.apiRequestError ? $scope.apiRequestError.data : null;
                    }
                });
            },
            templateUrl: 'scripts/module/apiexplorer/directives/apirequesterror.html'
        };
    });