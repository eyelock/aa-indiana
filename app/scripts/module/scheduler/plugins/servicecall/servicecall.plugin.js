/* jshint -W098 */
/* jshint -W083 */
'use strict';

angular.module('aaTaskScheduler')
    .factory('ServiceCallPluginFactory', ['$q', '$injector', '$log', function ($q, $injector, $log) {
        var ServiceCallPlugin;

        ServiceCallPlugin = function () {
            var id = 'ServiceCallPlugin',
                cfg,
                service,
                lastDeferred,
                isValid = true,
                job,
                executeOneMethod,
                executeManyMethod,
                splitArgsManyMethod,
                that = this;

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

            Object.defineProperty(this, 'executeMany', {
                get: function() { return cfg.options && cfg.options.executeMany; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'splitArgs', {
                get: function() { return cfg.options && cfg.options.splitArgs; },
                enumerable: true,
                configurable: false
            });

            this.configure = function (config) {
                cfg = config;
                service = $injector.get(cfg.serviceName, this);

                if (!service) {
                    $log.error('The service name was not found to be injected: ' + cfg.serviceName);
                    isValid = false;
                } else {
                    if (typeof service[cfg.methodName] !== 'function') {
                        $log.error('The service was found but did not have the correct method available: ' + cfg.methodName);
                        isValid = false;
                    }
                }

                $log.debug('Plugin Configured: ' + id);
            };

            this.execute = function (lastResult) {
                var promises = [];
                lastDeferred = $q.defer();

                if (!isValid) {
                    $log.error('Plugin was not correctly configured, see previous debug messages for more information: Plugin Id=' + id);
                    lastDeferred.reject(new TypeError('The plugin was not configured correctly, and cannot be ran.'));
                } else {
                    var func = service[cfg.methodName],
                        methodArgs = job.task.transformConfigValues({}, cfg.methodArgs),
                        task = job.task;

                    task.loading = true;

                    if (!this.executeMany) {
                        $log.debug('executing as executeOne');

                        promises.push(
                            executeOneMethod.apply(this, [func, methodArgs])
                        );

                    } else {
                        $log.debug('executing as executeMany');
                        //TODO
                        promises = executeManyMethod.apply(this, [func, methodArgs, this.executeArgs]);
                    }
                }

                //wait for all the promises to return
                $q.all(promises)
                    .then(function (result) {
                        task.loading = false;

                        $log.debug('Plugin result returned: PluginId=' + id);
                        $log.debug(result);

                        if (!that.executeMany) {
                            //if only one execution, then return the first result
                            if (angular.isArray(result)) {
                                lastDeferred.resolve(result[0]);
                            } else {
                                lastDeferred.resolve(result);
                            }
                        } else {
                            lastDeferred.resolve(result);
                        }
                    })
                    .catch(function (error) {
                        task.loading = false;

                        $log.debug('Plugin error encountered: PluginId=' + id);
                        $log.debug(error);

                        if (!that.executeMany) {
                            //if only one execution, then return the first error
                            if (angular.isArray(error)) {
                                lastDeferred.reject(error[0]);
                            } else {
                                lastDeferred.reject(error);
                            }
                        } else {
                            lastDeferred.reject(error);
                        }
                    });

                $log.debug('Plugin executed: ' + id);

                return lastDeferred.promise;
            };

            splitArgsManyMethod = function (args) {
                var key,
                    value,
                    valueLengths = {},
                    lastLength,
                    transformedArgsArray = [],
                    i;

                //check that each passed argument key is an object or an array
                for (key in args) {
                    value = args[key];

                    //NOTE arrays are being converted to objects somewhere in the stack, ideally would just check for array
                    if (angular.isObject(value)) {
                        value = Object.keys(value).map(function (key) { return value[key]; });
                    }

                    if (!angular.isArray(value)) {
                        throw new TypeError('cannot executeMany without args that are an array or objects');
                    }

                    valueLengths[key] = value.length;
                }

                //check that they are same length
                for (key in valueLengths) {
                    if (lastLength && (lastLength !== valueLengths[key])) {
                        throw new TypeError('cannot executeMany without args that are all the same length');
                    }

                    lastLength = valueLengths[key];
                }

                //transform the args into usaable
                for (i = 0; i < lastLength; i++) {
                    transformedArgsArray[i] = {};
                    for (key in args) {
                        transformedArgsArray[i][key] = args[key][i];
                    }
                }

                return transformedArgsArray;
            };

            executeManyMethod = function (func, args) {
                var transformedArgsArray = [],
                    promisesArray = [],
                    i,
                    splitArgs = this.splitArgs,
                    initialSplitObj,
                    tempSplitArgsArray,
                    tempSplitArgsObj;

                if (!splitArgs) {
                    //split the ones passed, easy
                    transformedArgsArray = splitArgsManyMethod(args);
                } else {
                    //Harder, we have a "template", and we need to split and recreate the real method args
                    //NOTE Limitation is currently only works with one level of nesting
                    if (!args.hasOwnProperty(splitArgs)) {
                        $log.error('the split args only works with one level of nesting currently.  attempted to split on following but failed: ' + splitArgs);
                        $log.debug(args);
                        throw new TypeError('split args only available on one level and existing property');
                    }

                    $log.debug('starting to try and split args on ' + splitArgs);
                    $log.debug(args);

                    transformedArgsArray = splitArgsManyMethod(args[splitArgs]);

                    //Now we have our splits, we need to create a copy of the initial object and delete our args
                    initialSplitObj = angular.copy(args);
                    delete initialSplitObj[splitArgs];

                    //next loop over the split of the args, and create a copy of our initial object then reassign the split ones
                    tempSplitArgsArray = [];
                    for (i = 0; i < transformedArgsArray.length; i++) {
                        tempSplitArgsObj = angular.copy(initialSplitObj);
                        tempSplitArgsObj[splitArgs] = transformedArgsArray[i];
                        tempSplitArgsArray.push(tempSplitArgsObj);
                    }

                    //set back to transformmed
                    transformedArgsArray = tempSplitArgsArray;
                }

                //now we can loop over and execute one by one
                for (i = 0; i < transformedArgsArray.length; i++) {
                    promisesArray[i] = executeOneMethod(func, transformedArgsArray[i]);
                }

                return promisesArray;
            };

            executeOneMethod = function (func, args) {
                return func.apply(func, [args]);
            };
        };

        return {
            getInstance: function () {
                return new ServiceCallPlugin();
            }
        };
    }]);