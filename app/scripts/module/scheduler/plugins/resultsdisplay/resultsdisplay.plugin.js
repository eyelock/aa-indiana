'use strict';

angular.module('aaTaskScheduler')
    .factory('ResultsDisplayPluginFactory', ['$q', '$state', '$log', function ($q, $state, $log) {
        var ResultsDisplayPlugin;

        ResultsDisplayPlugin = function () {
            var id = 'ResultsDisplayPlugin',
                cfg,
                job,
                lastDeferred;

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

            Object.defineProperty(this, 'multipleResults', {
                get: function() { return cfg.options && cfg.options.multipleResults; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'multipleTitle', {
                get: function() { return cfg.options && cfg.options.multipleTitle; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'splitArgs', {
                get: function() { return cfg.options && cfg.options.splitArgs; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'disableJsonEditor', {
                get: function() { return cfg.options ? cfg.options.disableJsonEditor : false; },
                enumerable: true,
                configurable: false
            });

            this.configure = function (config) {
                cfg = config;
            };

            this.execute = function (lastResult) {
                lastDeferred = $q.defer();

                //move state
                if (job.hasState) {
                    job.loadState({taskId: job.task.id});
                }

                lastDeferred.resolve(lastResult);

                $log.debug('Plugin executed: ' + id);

                //this is likely never used, but required by API contract
                return lastDeferred.promise;
            };

            this.getResultTitle = function (results, index) {
                if (!this.multipleResults) {
                    return null;
                }

                var result,
                    property,
                    title;

                if (!angular.isArray(results) && (results.length < index + 1)) {
                    return null;
                }

                result = results[index];
                property = this.multipleTitle;
                title = Object.prop(result, property);

                return title;

            };
        };

        return {
            getInstance: function () {
                return new ResultsDisplayPlugin();
            }
        };
    }]);