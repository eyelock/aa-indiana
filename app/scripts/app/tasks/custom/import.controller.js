'use strict';

angular.module('aaindianaApp')
    .controller('TasksImportCtrl', ['$scope', '$log', '$filter', 'growl', 'TaskRegistry', function ($scope, $log, $filter, growl, TaskRegistry) {
        $scope.tasks = [];
        $scope.loading = false;
        $scope.alerts = [];
        $scope.model = {};
        $scope.hasImported = false;

        $scope.init = function () {
            $scope.tasks = [];
            $scope.alerts = [];
            $scope.model = {};
            $scope.loading = true;
            $scope.hasImported = false;

            TaskRegistry.loadCustom()
                .then(function (result) {
                    $scope.loading = false;
                    $scope.tasks = result;
                })
                .catch(function (error) {
                    $scope.loading = false;
                    $log.error(error);
                    growl.error('global.notifications.async.error');
                });
        };

        $scope.importJson = function () {
            $scope.alerts = [];
            var json, i, e, imported, existing, addImported, foundExisting,
                countImported = 0,
                overwrite = $scope.model.overwrite || false;

            try {
                json = JSON.parse($scope.model.importString);
            }
            catch (e) {
                $scope.alerts.push({
                    message: $filter('translate')('tasks.import.importjson.parseerror'),
                    type: 'danger'
                });
                return;
            }

            if (!angular.isArray(json)) {
                $scope.alerts.push({
                    message: $filter('translate')('tasks.import.importjson.notarray'),
                    type: 'danger'
                });
                return;
            }

            if (json.length === 0) {
                $scope.alerts.push({
                    message: $filter('translate')('tasks.import.importjson.noelements'),
                    type: 'danger'
                });
                return;
            }

            for (i = 0; i < json.length; i++) {
                imported = json[i];
                addImported = false;
                foundExisting = false;

                for (e = 0; e < $scope.tasks.length; e++) {
                    existing = $scope.tasks[e];

                    if (existing.id === imported.id) {
                        foundExisting = existing;
                        break;
                    }
                }

                if (foundExisting && !overwrite) {
                    $log.warn('found existing custom task with same id, not overwriting');
                    $log.debug(foundExisting);
                    $log.debug(imported);

                    $scope.alerts.push({
                        message: $filter('translate')('tasks.import.importjson.warnexisting') + ': ' + imported.id,
                        type: 'warning'
                    });
                } else {
                    TaskRegistry.updateCustom(imported);
                    countImported++;

                    if (!foundExisting) {
                        $log.debug('added imported task to registry: ' + imported.id);
                        $log.debug(imported);
                   } else {
                       $log.debug('overwriting imported task to registry: ' + imported.id);
                       $log.debug(foundExisting);
                       $log.debug(imported);
                   }
                }
            }

            $scope.alerts.push({
                message: $filter('translate')('tasks.import.importjson.importsuccessful') + ': ' + countImported + '/'+ json.length,
                type: 'success'
            });
            $scope.hasImported = true;
            $log.debug('completed import task of ' + countImported + ' custom tasks');
        };

        $scope.init();
    }]);