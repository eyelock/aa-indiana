'use strict';

/**
 * @ngdoc service
 * @module aaTaskScheduler
 * @name TaskFactory
 *
 * @requires $q
 * @requires $log
 * @requires JobManagerFactory
 * @requires JobFactory
 *
 * @description
 *
 * Provides a Factory to create {@link Task} object instances.
 */
angular.module('aaTaskScheduler')
    .factory('TaskFactory', ['$q', '$log', 'JobManagerFactory', 'JobFactory', function ($q, $log, JobManagerFactory, JobFactory) {
        var createJob,
            Task;

        // private
        createJob = function (jobConfig) {
            var job = JobFactory.getInstance();
            job.configure(jobConfig);

            return job;
        };

        /**
         * @ngdoc object
         * @module aaTaskScheduler
         * @name Task
         * @constructor
         *
         * @description
         *
         * A Task is a collection of {@link Job}s.  The Task's main responsiblity is to
         * provide execution flow between each of the {@link Job}s.  It is responsible for
         * reading in the configuration of the {@link Job}s and creating them in the right order.
         *
         * Another key responsibility is to provide access for each {@link Job} to reach into the
         * other {@link Job}s and access the results.
         *
         * It includes a property 'jobs' of type {@link JobManager} to provde the iterative qualities
         * to access the objects in a quick and ordered fashion.
         *
         */
        Task = function () {
            var taskDeferred = $q.defer(),
                config,
                id,
                name,
                jobManager = JobManagerFactory.getInstance(this),
                isRunning = false,
                that = this,
                isLoading = false,
                lastError = {},
                resolveCurrentJob,
                rejectCurrentJob,
                notifyCurrentJob;

            /**
             * @name Task#id
             * @property {String}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * The id that this task has been assigned.
             */
            Object.defineProperty(this, 'id', {
                get: function() { return id; },
                enumerable: true,
                configurable: false
            });

            /**
             * @name Task#name
             * @property {String}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * The name that this task has been assigned.
             */
            Object.defineProperty(this, 'name', {
                get: function() { return name; },
                enumerable: true,
                configurable: false
            });

            /**
             * @name Task#running
             * @property {Boolean}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * Returns whether this {@link Task} is considered to be still running,
             * in that the workflow has not finished or existed in error.
             */
            Object.defineProperty(this, 'running', {
                get: function() { return isRunning; },
                enumerable: true,
                configurable: false
            });

            /**
             * @name Task#jobs
             * @property {JobManager}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * Returns the helper object {@link JobManager}.
             */
            Object.defineProperty(this, 'jobs', {
                get: function() { return jobManager; },
                enumerable: true,
                configurable: false
            });

            /**
             * @name Task#config
             * @property {Object}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * The raw JSON object that makes up the configuration of this task.
             */
            Object.defineProperty(this, 'config', {
                get: function() { return config; },
                enumerable: true,
                configurable: false
            });

           /**
             * @name Task#loading
             * @property {Boolean}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * If a {@link Job} is performing an async action, it can set the
             * loading property of it's parent {@link Task} to propigate that the
             * Task is waiting on an external process returning.
             */
            Object.defineProperty(this, 'loading', {
                get: function() { return isLoading; },
                set: function(l) {
                    isLoading = l;
                },
                enumerable: true,
                configurable: true
            });

           /**
             * @name Task#lastError
             * @property {Object}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * A {@link Job} will return an error and this property provides a convenient
             * way to access the lastError recieved by a {@link Job} running within this
             * {@link Task} workflow.
             *
             * Note: this value existing and being non-empty does not indicate that the
             * {@link Task} is currently in an error state.
             */
            Object.defineProperty(this, 'lastError', {
                get: function() { return lastError; },
                enumerable: true,
                configurable: false
            });

           /**
             * @name Task#lastResult
             * @property {Object}
             * @memberOf! Task
             * @readonly
             *
             * @description
             *
             * Returns the result of the previous {@link Job} result.  It uses the {@link JobManager}
             * to access the previous result.   If no previous {@link Job} exists then null is returned.
             */
            Object.defineProperty(this, 'lastResult', {
                get: function() {
                    if (jobManager.hasPrevious() && jobManager.previousStep.hasResult) {
                        return jobManager.previousStep.result;
                    }

                    return null;
                },
                enumerable: false,
                configurable: false
            });

            /**
             * @ngdoc method
             * @name Task#configure
             *
             * @returns void
             *
             * @description
             *
             * After a {@link Task} is created, it must be configured with a JSON object that
             * represents the {@link Job}s that make it up.
             *
             * {@link Job}s must have unique Ids associated with them, and if a Job with the
             * same Id is found, then it is **not** added to the {@link Task}.
             */
            this.configure = function(taskConfig) {
                var i,
                    job;

                config = taskConfig;
                $log.debug('Configuring task with config.');
                $log.debug(taskConfig);

                id = config.id;
                name = config.name;

                for (i = 0; i < config.jobs.length; i++) {
                    job = createJob(config.jobs[i]);
                    job.task = this;

                    //warn if one already exists
                    if (jobManager.exists(job)) {
                        $log.warn('Warning: cannot add job as already exists: ' + job.id);
                    } else {
                       jobManager.push(job);
                        $log.debug('Created Job for Task.  Job=' + job.id);
                    }
                }
            };

            /**
             * @ngdoc method
             * @name Task#start
             *
             * @returns {Promise} The Promise returned is specific to the {@link Task}.
             *
             * @description
             *
             * Begins the {@link Task} by executing the first {@link Job} in it's queue.
             * Updates the internal state of the {@link Task} to record that it is now running.
             *
             * You must start a {@link Task} by calling this method, as opposed to executing the
             * {@link Job} directly.
             */
            this.start = function () {
                isRunning = true;
                that.execute();
                return taskDeferred.promise;
            };

            /**
             * @ngdoc method
             * @name Task#finish
             *
             * @returns {void}
             *
             * @description
             *
             * Called to finish the task automatically when the last {@link Job} finishes it's
             * execution.  Will then resolve() the internal {@link Task} promise with the last result.
             *
             * The internal state of the {@link Task} is then set to not running.
             */
            this.finish = function () {
                isRunning = false;
                taskDeferred.resolve(this.lastResult);
            };

            /**
             * @ngdoc method
             * @name Task#execute
             *
             * @returns {void}
             *
             * @description
             *
             * The main API method for the progression of the {@link Task} through it's {@link Job}s.
             *
             * If you call execute() on the {@link Task} when it has no more {@link Job}s, then the
             * internal {@link Task} Promise will have reject() called.
             *
             * The mechanism for execute is to get the next {@link Job} via the {@link JobManager}.  A
             * check is made at that point to ensure that the {@link Job} returned has not executed and
             * also has not an error.   If it does have, {@link Job#reset} is called on the job.
             *
             * All going well, the {@link Job#execute} nethod is called to execute the logic of the
             * {@link Job} and it's associated plugin.   Communication from the {@link Job} to the
             * {@link Task} takes place via the returned Promise from a {@link Job}'s {@link Job#execute}
             * method.
             *
             * You can subscribe to notifications from {@link Job}'s by listening to the notify method of
             * the {@link Task}'s returned Promise.
             */
            this.execute = function (lastResult) {
                lastError = {};

                if (!jobManager.hasNext()) {
                    $log.debug('Called execute on a task that has no more jobs.');
                    $log.debug(this);
                    taskDeferred.reject('The task has no more jobs to execute');
                }

                var currentJob = jobManager.next();

                //sometimes the job has errored, and since a promise cannot be resolved/rejected
                //twice, we need to reset the job
                if (currentJob.hasExecuted && currentJob.hasError) {
                    $log.debug('resetting job due to having error and being executed: ' + currentJob.id);
                    currentJob.reset();
                } else if (currentJob.hasExecuted) {
                    $log.warn('this job has already executed, there will not be any notification of promises from it: ' + currentJob.id);
                }

                currentJob.execute(lastResult)
                    .then(resolveCurrentJob)
                    .catch(rejectCurrentJob)
                    .finally(null, notifyCurrentJob);
            };

            /**
             * @ngdoc method
             * @name Task#resolveCurrentJob
             * @internal
             *
             * @returns {void}
             *
             * @description
             *
             * This method is called when a {@link Job#execute} Promise is resolved.
             *
             * The method notifies any listeners to the {@link Task}'s Promise, and will
             * automatically call {@link Task#finish} on the {@link Task} if there are no more
             * {@link Job}'s to execute.
             *
             * If there is another {@link Job} to execute, the the property {@link Job#autoProgress} is
             * checked to ensure that the configuration is to move onto the next step.  If this returns
             * true, then {@link Task#execute} is called again.
             */
            resolveCurrentJob = function (result) {
                that.loading = false;

                taskDeferred.notify(result);
                $log.debug('Received and notified promise of succesful execution of current job: ' + jobManager.currentStep.id);

                if (!jobManager.hasNext()) {
                    $log.debug('No more jobs to process, calling finish() on task');
                    that.finish();
                } else {
                    if (jobManager.currentStep.autoProgress) {
                        $log.debug('Auto progressing to the next task from Job=' + jobManager.currentStep.id);
                        that.execute();
                    }
                }
            };

            /**
             * @ngdoc method
             * @name Task#rejectCurrentJob
             * @internal
             *
             * @returns {void}
             *
             * @description
             *
             * This method is called when a {@link Job#execute} Promise is rejected.
             *
             * This results in the {@link Task#lastError} being set, but also the {@link Task}
             * manages the reset of a {@link Job} via the {@link Job#reset} method.  This allows
             * for a {@link Job} to contain an error, but for the workflow not to stall.
             *
             * The {@link Task} is watching the {@link Job} Promise, and this is reset due to the
             * API contract of a Promise being that it can only be rejected/resolved once.
             */
            rejectCurrentJob = function (error) {
                that.loading = false;
                lastError = error;
                $log.error('Error recieved for Job=' + jobManager.currentStep.id);
                $log.error(error);
                taskDeferred.reject(error);

                //reset current job
                jobManager.currentStep.reset();

                //we also want to step back, to allow the job to execute again
                //and set up new returns from the renewed promise
                jobManager.previous();
                jobManager.currentStep.reset()
                    .then(resolveCurrentJob)
                    .catch(rejectCurrentJob)
                    .finally(null, notifyCurrentJob);
            };

            /**
             * @ngdoc method
             * @name Task#notifyCurrentJob
             * @internal
             *
             * @returns {void}
             *
             * @description
             *
             * Listening by the {@link Task} to the currently executing {@link Job}'s notifications,
             * this method provides passthrough of these notifciations to the listeners to the
             * {@link Task} Promise.
             */
            notifyCurrentJob = function (notification) {
                taskDeferred.notify(notification);
            };

            /**
             * @ngdoc method
             * @name Task#transformConfigValues
             *
             * @param {Object} retObj A new object to populate the transformed values
             * @param {Object} argsObj The original object containing the original values
             *
             * @returns {Object} The new object with the transformed values.
             *
             * @description
             *
             * The {@link Task} {@link Job} configurations allow for string values that
             * indicate references to other {@link Job} steps.   This effectively allows for
             * dynamic referencing of results in argument of other {@link Job}'s.  See
             * {@link Job#getResult} for more documentation on how these work.
             *
             * This method takes the param argsObj which is the complete Object that needs to
             * be transformed and performs deep introspection of the object to walk through
             * and ensure all values that are required to be transformed are.   It builds up
             * a new object to return.
             */
            this.transformConfigValues = function (retObj, argsObj) {
                var key, configValue;

                if (Object.keys(argsObj).length === 0) {
                    return retObj;
                }

                for (key in argsObj) {
                    configValue = this.getConfigValue(argsObj[key]);

                    if (angular.isString(configValue) || angular.isNumber(configValue)) {
                        retObj[key] = configValue;
                    } else if (angular.isDate(configValue)) {
                        retObj[key] = configValue.toISOString();
                    } else if (angular.isObject(configValue)) {
                        retObj[key] = this.transformConfigValues({}, configValue);
                    } else {
                        retObj[key] = configValue;
                    }
                }

                return retObj;
            };

            /**
             * @ngdoc method
             * @name Task#getConfigValue
             *
             * @param {Object} param The value string that should be checked for references
             *
             * @returns {Object} The transformed value, or the original value if it is not a transformation.
             *
             * @description
             *
             * Uses {@link Job#getResult} to take a reference value and return the actual value
             * associated with the Job result.
             */
            this.getConfigValue = function (param) {
                var returnValue;

                if (angular.isString(param)) {
                    if (param.indexOf('@') > -1) {
                        //is a referene type value
                        returnValue = jobManager.getResult(param);
                    }
                }

                //if nothing is set, then do pass through
                if (!returnValue) {
                    returnValue = param;
                }

                return returnValue;
            };
        };

        return {
            getInstance: function () {
                return new Task();
            }
        };
    }]);