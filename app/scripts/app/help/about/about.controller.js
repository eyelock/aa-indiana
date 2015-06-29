'use strict';

angular.module('aaindianaApp')
    .controller('HelpAboutCtrl', ['$scope', 'growl', 'APP_CONTACT', 'APP_TECHNOLOGIES', function ($scope, growl, APP_CONTACT, APP_TECHNOLOGIES) {
        $scope.APP_CONTACT = APP_CONTACT;
        $scope.technologies = APP_TECHNOLOGIES;
    }]);