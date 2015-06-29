'use strict';

angular.module('aaindianaApp')
    .controller('NavbarCtrl', ['$scope', '$state', 'Principal', function ($scope, $state, Principal) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isInRole = Principal.isInRole;
        $scope.$state = $state;
    }]);