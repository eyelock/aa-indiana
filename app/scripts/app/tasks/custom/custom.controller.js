'use strict';

angular.module('aaindianaApp')
    .controller('TasksCustomCtrl', [
    '$scope', 'growl', '$log', 'ModalService', 'TaskRegistry',
    function ($scope, growl, $log, ModalService, TaskRegistry) {
        $scope.tasks = [];

        $scope.init = function () {
            $scope.task = {};
            $scope.tasks = [];

            TaskRegistry.loadCustom()
                .then(function (result) {
                    $scope.tasks = result;
                })
                .catch(function (error) {
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.create = function () {
            ModalService.showModal({
                templateUrl: 'scripts/app/tasks/custom/custom.edit.modal.html',
                controller: 'TasksCustomEditModalCtrl',
                inputs: {
                    task: {}
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.save(result);
                        }
                    });
                });
        };

        $scope.update = function (task) {
            ModalService.showModal({
                templateUrl: 'scripts/app/tasks/custom/custom.edit.modal.html',
                controller: 'TasksCustomEditModalCtrl',
                inputs: {
                    task: task
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.save(result);
                        }
                    });
                });
        };

        $scope.save = function (task) {
            TaskRegistry.updateCustom(task)
                .then(function () {
                    $scope.init();
                    TaskRegistry.reset();
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        $scope.confirmDelete = function (task) {
            ModalService.showModal({
                templateUrl: 'scripts/app/tasks/custom/custom.delete.modal.html',
                controller: 'TasksCustomDeleteModalCtrl',
                inputs: {
                    task: task
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.delete(task);
                        }
                    });
                });
        };

        $scope.delete = function (task) {
            TaskRegistry.deleteCustom(task)
                .then(function () {
                    $scope.clear();
                    $scope.init();
                    TaskRegistry.reset();
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        $scope.init();
    }]);