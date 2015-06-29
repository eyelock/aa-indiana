/* jshint -W098 */
'use strict';

angular.module('aaTaskScheduler')
    .factory('PollerTaskPluginFactory', ['$q', '$state', '$log', '$injector', '$interval', function ($q, $state, $log, $injector, $interval) {
        var PollerTaskPlugin,
            isContinue;

        isContinue = function(opt, obj) {
            return Object.prop(obj, opt.continueCheck.property) === opt.continueCheck.value;
        };

        PollerTaskPlugin = function () {
            var cfg,
                job,
                service,
                method,
                intervalPromise,
                that = this,
                lastDeferred,
                updatePollingProperty,
                createPollingProperty,
                lastPoll,
                counterPoll = 0;

            createPollingProperty = function (promise, interval) {
                lastPoll.promise = promise;
                lastPoll.startTime = job.startTime;
                lastPoll.endTime = job.endTime;
                lastPoll.counter = counterPoll;
                lastPoll.interval = interval;
                lastPoll.currentTime = new Date();
                lastPoll.counter = counterPoll;
            };

            updatePollingProperty = function () {
                lastPoll.endTime = job.endTime;
                lastPoll.currentTime = new Date();
                lastPoll.counter = counterPoll;
            };

            // properties
            Object.defineProperty(this, 'id', {
                get: function() { return cfg.id; },
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

            Object.defineProperty(this, 'lastPoll', {
                get: function() { return lastPoll; },
                enumerable: false,
                configurable: false
            });

            this.configure = function (config) {
                var serviceCfg = config.options.service;
                cfg = config;
                service = $injector.get(serviceCfg.serviceName);

                if (!service) {
                    $log.error('could not find service with the name: ' + serviceCfg.serviceName);
                    throw new TypeError('service name not found');
                }

                if (!service[serviceCfg.methodName]) {
                    $log.error('found service "' + serviceCfg.serviceName + '" but method did not exist: ' + serviceCfg.methodName);
                    throw new TypeError('service method not found');
                }

                method = service[serviceCfg.methodName];
            };

            this.execute = function (lastResult) {
                var deferred = $q.defer(),
                    serviceCfg,
                    opt,
                    interval;

                lastDeferred = deferred;
                opt = job.task.transformConfigValues({}, cfg.options);
                serviceCfg = opt.service;
                counterPoll = 0;
                lastPoll = {};
                interval = opt.interval * 1000;
                createPollingProperty(lastDeferred.promise, interval);

                //move state
                if (job.hasState) {
                    job.loadState({taskId: job.task.id});
                }

                //set up a time out to call the service
                intervalPromise = $interval(function () {
                    counterPoll++;
                    updatePollingProperty();
                    job.task.loading = true;

                    method.apply(method, [serviceCfg.methodArgs])
                        .then(that.resolve)
                        .catch(that.reject);

                    $log.debug('method called from loop, next call in milliseconds: ' + interval);
                }, interval);

                $log.debug('Plugin executed: ' + cfg.id);

                return lastDeferred.promise;
            };

            this.resolve = function(result) {
                job.task.loading = false;
                result.polling = lastPoll;

                if (isContinue(cfg.options, result)) {
                    lastDeferred.notify(result);
                    $log.debug('service call executed from interval invocation');
                    $log.debug(result);
                } else {
                    $interval.cancel(intervalPromise);
                    $log.debug('successful return from polling service');
                    $log.debug(result);
                    lastDeferred.notify(result);
                    lastDeferred.resolve(result);
                }
            };

            this.reject = function(error) {
                job.task.loading = false;
                error.polling = lastPoll;

                if (isContinue(cfg.options, error)) {
                    lastDeferred.notify(error);
                    $log.debug('service call executed from interval invocation');
                    $log.debug(error);
                } else {
                    $interval.cancel(intervalPromise);
                    $log.error('error when executing service method');
                    $log.debug(error);
                    lastDeferred.reject(error);
                }
            };
        };

        return {
            getInstance: function () {
                return new PollerTaskPlugin();
            }
        };
    }]);