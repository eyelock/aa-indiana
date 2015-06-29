/* jshint -W117 */
/* jshint -W106 */
'use strict';

angular.module('aaTaskScheduler')
    .controller('DataFeedListResultsCtrl', [
    '$scope', '$stateParams', 'ModalService', 'TaskScheduler',
    function ($scope, $stateParams, ModalService, TaskScheduler) {
        $scope.task = TaskScheduler.getTask($stateParams.taskId);
        $scope.job = $scope.task.jobs.current();
        $scope.plugin = $scope.job.plugin;
        $scope.lastResult = $scope.task.lastResult;
        $scope.dataFeeds = $scope.task.lastResult.data.data_feeds;

        var setFailureProperty = function (datafeeds) {
            //loop over the data feed activities and set the failure
            var i, j, datafeed, activities, activityHasFailed;
            for (i = 0; i < datafeeds.length; i++) {
                datafeed = datafeeds[i];

                activities = datafeed.activity;
                activityHasFailed = false;

                for (j = 0; j < activities.length; j++) {
                    if (activities[j].status !== 'delivered') {
                        activityHasFailed = true;
                        break;
                    }
                }

                datafeed.activityFailure = activityHasFailed;
            }
        };

        $scope.showActivityModal = function (selectedDataFeed) {
            ModalService.showModal({
                templateUrl: 'scripts/component/scheduler/plugins/datafeed/datafeed.activity.modal.html',
                controller: 'DataFeedActivityModalCtrl',
                inputs: {
                    datafeed: selectedDataFeed
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                });
        };

        $scope.init = function () {
            setFailureProperty($scope.dataFeeds);
        };

        $scope.init();
    }]);