/* jshint -W106 */
'use strict';

angular.module('aaindianaApp')
    .controller('ToolsReportSuitesCtrl', [
    '$scope', '$log', 'growl', 'ModalService', 'ApiHelper',
    function ($scope, $log, growl, ModalService, ApiHelper) {
        $scope.reportSuites = [];
        $scope.cacheDetails = null;

        $scope.loadAll = function () {
            $scope.cacheDetails = null;
            $scope.reportSuites = [];

            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'Company',
                method: 'GetReportSuites',
                args: {}
            })
                .then(function (result) {
                    if (result.hasOwnProperty('cache')) {
                        $scope.cacheDetails = result.cache;
                        growl.warning('global.notifications.async.cached');
                    } else {
                        growl.success('global.notifications.async.finish');
                    }

                    $scope.reportSuites = result.data.report_suites;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.showGroups = function (rs) {
            ModalService.showModal({
                templateUrl: 'scripts/app/tools/reportsuites/groups.modal.html',
                controller: 'ToolsReportSuitesGroupsModalCtrl',
                inputs: {
                    reportSuite: rs
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                });
        };

        $scope.showSettings = function (rs) {
            ModalService.showModal({
                templateUrl: 'scripts/app/tools/reportsuites/settings.modal.html',
                controller: 'ToolsReportSuitesSettingsModalCtrl',
                inputs: {
                    reportSuite: rs
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                });
        };

        $scope.loadAll();
    }]);