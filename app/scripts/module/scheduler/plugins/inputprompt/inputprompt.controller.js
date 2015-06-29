'use strict';

angular.module('aaTaskScheduler')
    .controller('InputPromptPluginCtrl', [
    '$scope', '$stateParams', '$log', 'ModalService', 'TaskScheduler',
    function ($scope, $stateParams, $log, ModalService, TaskScheduler) {
        $scope.task = TaskScheduler.getTask($stateParams.taskId);
        $scope.job = $scope.task.jobs.current();
        $scope.plugin = $scope.job.plugin;
        $scope.lastResult = $scope.task.lastResult;
        $scope.modal = {};

        var updateCheckboxOptions = function () {
            var name;
            $scope.formModel[name] = [];

            for (name in $scope.formCheckboxElement) {
                var i, selectedOptionArray = [];

                for (i in $scope.formCheckboxElement[name]) {
                    if ($scope.formCheckboxElement[name][i]) {
                        selectedOptionArray.push(i);
                    }
                }

                $scope.formModel[name] = selectedOptionArray;
            }
        };

        $scope.modalOpen = function () {
            ModalService.showModal({
                templateUrl: 'scripts/module/scheduler/plugins/inputprompt/confirm.modal.html',
                controller: 'InputPromptConfirmModalCtrl',
                inputs: {
                    formModel: $scope.formModel,
                    labels: {
                        title: $scope.plugin.confirm.title || 'global.form.action.confirm',
                        description:  $scope.plugin.confirm.description || '',
                        cancelButton:  $scope.plugin.confirm.cancelButton || 'global.form.action.cancel',
                        confirmButton:  $scope.plugin.confirm.confirmButton || 'global.form.action.confirm'
                    }

                }
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.submitJob();
                        }
                    });
                });
        };

        $scope.submitValues = function () {
            updateCheckboxOptions();

            if (!$scope.plugin.hasConfirm) {
                $scope.submitJob();
            } else {
                $scope.modalOpen();
            }
        };

        $scope.submitJob = function () {
            $scope.job.resolve($scope.formModel);
        };

        $scope.openDatePicker = function ($event, name) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.formDatePickerOpen[name] = true;
        };

        $scope.init = function () {
            $scope.formElements = $scope.plugin.prompts;
            $scope.formModel = $scope.plugin.createFormModel();
            $scope.formValues = $scope.plugin.createFormValues();
            $scope.formDatePickerOpen = {};
            $scope.formCheckboxElement = {};
        };


        $scope.init();
    }]);