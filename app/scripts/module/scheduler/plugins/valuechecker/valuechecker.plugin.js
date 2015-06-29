'use strict';

angular.module('aaTaskScheduler')
    .factory('ValueCheckerPluginFactory', ['$q', '$state', '$filter', '$log', function ($q, $state, $filter, $log) {
        var ValueCheckerPlugin;

        ValueCheckerPlugin = function () {
            var id = 'ValueCheckerPlugin',
                cfg,
                job,
                lastDeferred,
                isDefined = angular.isDefined,
                checkedData;

            // properties
            Object.defineProperty(this, 'id', {
                get: function() { return id; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'job', {
                get: function() { return job; },
                set: function(j) { job = j; },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(this, 'config', {
                get: function() { return cfg; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'checkedData', {
                get: function() { return checkedData; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'isInverse', {
                get: function() {
                    var inverseIsDefined = isDefined(cfg) && isDefined(cfg.options) && isDefined(cfg.options.display) && isDefined(cfg.options.display.inverse);
                    return inverseIsDefined ? cfg.options.display.inverse : false;
                },
                enumerable: true,
                configurable: false
            });

            this.configure = function (config) {
                cfg = config;
            };

            this.execute = function () {
                var filteredValue,
                    options;

                lastDeferred = $q.defer();
                options = angular.copy(cfg.options);

                //retrieve the values
                options.data.objects = job.task.getConfigValue(options.data.objects);

                //primary could be a reference, or if anything else leave as is
                if (angular.isString(options.data.primary)) {
                    filteredValue = job.task.getConfigValue(options.data.primary);

                    if (filteredValue) {
                        options.data.primary = filteredValue;
                    }
                }

                //the options values could be references
                options.headerProps = job.task.getConfigValue(options.headerProps);
                options.checkProps = job.task.getConfigValue(options.checkProps);

                //filter the data so we get it in the correct structure
                checkedData = $filter('valueCheckerDataFilter')(options);

                //move state
                if (job.hasState) {
                    job.loadState({taskId: job.task.id});
                }

                lastDeferred.resolve(checkedData);

                $log.debug('Plugin executed: ' + id);

                //this is likely never used, but required by API contract
                return lastDeferred.promise;
            };
        };

        return {
            getInstance: function () {
                return new ValueCheckerPlugin();
            }
        };
    }]);