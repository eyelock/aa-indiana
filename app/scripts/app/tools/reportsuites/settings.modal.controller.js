/* jshint -W106 */
'use strict';

angular.module('aaindianaApp')
    .controller('ToolsReportSuitesSettingsModalCtrl', [
    '$scope', '$element', '$log', 'growl', 'ApiHelper', 'reportSuite', 'close',
    function ($scope, $element, $log, growl, ApiHelper, reportSuite, close) {
        $scope.reportSuite = reportSuite;
        $scope.settings = {};
        $scope.classifications = [];
        $scope.elements = [];
        $scope.segments = [];
        $scope.properties = [];
        $scope.mobilebreakdowns = [];
        $scope.metrics = [];
        $scope.videosettings = [];

        $scope.generalProps = [
            'rsid',
            'site_title',
            'ecommerce_level',
            'ecommerce_visits',
            'ecommerce_visitors',
            'activation',
            'base_currency',
            'base_url',
            'calendar_type',
            'default_page',
            'discover_enabled',
            'ip_obfuscation',
            'localization',
            'time_zone',
            'template',
            'unique_visitor_variable'
        ];

        $scope.propProps = [
            'id',
            'name',
            'enabled',
            'description',
            'pathing_enabled',
            'list_enabled',
            'participation_enabled'
        ];

        $scope.segmentProps = [
            'id',
            'name',
            'folder',
            'class',
            'suite_enabled',
            'read_only'
        ];

        $scope.elementProps = [
            'id',
            'name',
            'correlation',
            'subrelation'
        ];

        $scope.metricsProps = [
            'id',
            'name',
            'type',
            'formula',
            'decimals'
        ];

        //TODO   video_settings   metrics

        $scope.cancel = function () {
            $element.modal('hide');
            close(false, 500);
        };

        $scope.init = function () {
            growl.info('global.notifications.async.start');

            ApiHelper.executeMethod({
                code: 'ReportSuite',
                method: 'GetSettings',
                args: {rsid_list: [$scope.reportSuite.rsid]}
            })
                .then(function (result) {
                    growl.success('global.notifications.async.finish');
                    $scope.settings = result.data[0];
                    $scope.classifications = result.data[0].element_classifications;
                    $scope.elements = result.data[0].elements;
                    $scope.segments = result.data[0].segments;
                    $scope.properties = result.data[0].props;
                    $scope.mobilebreakdowns = result.data[0].mobile_breakdowns;
                    $scope.metrics = result.data[0].metrics;
                    $scope.videosettings = result.data[0].video_settings;
                })
                .catch(function (error) {
                    growl.error('global.notifications.async.error');
                    $log.error(error);
                });
        };

        $scope.init();
    }]);