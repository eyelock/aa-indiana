'use strict';

angular.module('aaindianaApp')
    .controller('ToolsReportSuitesGroupsModalCtrl', [
    '$scope', '$element', '$log', 'growl', 'ApiHelper', 'reportSuite', 'close',
    function ($scope, $element, $log, growl, ApiHelper, reportSuite, close) {
        $scope.reportSuite = reportSuite;
        $scope.groups = [];

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };

        $scope.init = function () {
            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'Permissions',
                method: 'GetReportSuiteGroups',
                args: {rsid: $scope.reportSuite.rsid}
            })
                .then(function (result) {
                    growl.success('global.notifications.async.finish');
                    $scope.groups = result.data.groups;
                })
                .catch(function (error) {
                    growl.error('global.notifications.async.error');
                    $log.error(error);
                });
        };

        $scope.init();
    }]);