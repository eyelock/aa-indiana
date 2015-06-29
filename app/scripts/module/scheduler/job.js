'use strict';

angular.module('aaTaskScheduler')
    .factory('JobFactory', ['$q', '$injector', '$log', '$state', function ($q, $injector, $log, $state) {
        var Job,
            getPlugin;

        // private
        getPlugin = function (pluginFactoryName, job) {
            var pluginFactory = $injector.get(pluginFactoryName, 'Job'),
                plugin = pluginFactory.getInstance();

            if (!plugin) {
                return null;
            }

            plugin.job = job;

            return plugin;
        };

        // Job object
        Job = function () {
            var pl,
                cfg,
                jobDeferred,
                hasResult,
                result,
                hasExecuted,
                hasError,
                error,
                task,
                startTime,
                endTime,
                internalReset;

            internalReset = function () {
                jobDeferred = $q.defer();
                hasResult = false;
                hasExecuted = false;
                hasError = false;
                error = null;

                return jobDeferred.promise;
            };

            this.reset = internalReset;

            //initialise the needed variables
            this.reset();

            // Job properties
            Object.defineProperty(this, 'config', {
                get: function() { return cfg; },
                enumerable: true,
                configurable: false
            });

            // Job properties
            Object.defineProperty(this, 'plugin', {
                get: function() {
                    return pl;
                },
                enumerable: true,
                configurable: false
            });

            // Job properties
            Object.defineProperty(this, 'task', {
                get: function() { return task; },
                set: function(t) { task = t; },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(this, 'id', {
                get: function() { return cfg.id || 'N/a'; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'name', {
                get: function() { return cfg.name || 'N/a'; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'description', {
                get: function() { return cfg.description || 'N/a'; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'autoProgress', {
                get: function() { return cfg.autoProgress || true; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'hasState', {
                get: function() { return angular.isDefined(cfg.pluginConfig.state); },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'state', {
                get: function() { return cfg.pluginConfig.state; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'hasExecuted', {
                get: function() { return hasExecuted; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'hasError', {
                get: function() { return hasError; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'error', {
                get: function() { return error; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'hasResult', {
                get: function() { return hasResult; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'result', {
                get: function() { return result; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'startTime', {
                get: function() { return startTime; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'endTime', {
                get: function() { return endTime; },
                enumerable: true,
                configurable: false
            });

            this.getPluginParam = function(name) {
                if (cfg.pluginConfig.hasOwnProperty(name)) {
                    return cfg.pluginConfig[name];
                }

                $log.debug('Requested plugin parameter and could not be found: ' + name);

                return null;
            };

            this.loadState = function(stateParams) {
                if (!this.hasState) {
                    $log.warn('not changing state as job does not have a state');
                    return;
                }

                var currentState = $state.current.name,
                    toState = this.state;

                $state.go(this.state, stateParams);

                if (currentState === toState) {
                    $state.forceReload();
                }
            };

            this.configure = function (jobConfig) {
                if (!angular.isDefined(jobConfig.pluginConfig.factory)) {
                    $log.error('The configuration for the job is incorrect: ' + jobConfig);
                    throw new TypeError('Cannot configure plugin with config, missing \jobConfig.factory\' property.');
                }

                var plugin = getPlugin(jobConfig.pluginConfig.factory, this);
                cfg = jobConfig;

                //check the config is for this plugin
                if (!plugin) {
                    $log.error('Could not find plugin for type ' + jobConfig.pluginConfig.factory);
                    throw new TypeError('Cannot configure plugin with config, as it is not correct type');
                }

                plugin.configure(cfg.pluginConfig);
                pl = plugin;
            };

            this.execute = function (lastResult) {
                hasExecuted = true;
                startTime = new Date();
                $log.debug('Executing job with id ' + cfg.id );

                pl.execute(lastResult)
                    .then(this.resolve)
                    .catch(this.reject)
                    .finally(null, this.notify);

                return jobDeferred.promise;
            };

            this.resolve = function (res) {
                $log.debug('Result returned from job with ' + cfg.id );
                $log.debug(res);

                endTime = new Date();
                hasResult = true;
                result = res;
                jobDeferred.resolve(res);
            };

            this.reject = function (err) {
                $log.error('Error returned from job with ' + cfg.id );
                endTime = new Date();
                hasError = true;
                error = err;
                jobDeferred.reject(err);
            };

            this.notify = function (not) {
                jobDeferred.notify(not);
            };
        };

        return {
            getInstance: function () {
                return new Job();
            }
        };
    }]);