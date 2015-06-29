/* jshint -W083 */
'use strict';

angular
    .module('aaTaskScheduler')
    .factory('JobManagerFactory', ['$log', function ($log) {
        var JobManager;

        // helper for jobs traversal
        JobManager = function (task) {
            var _task = task,
                _queue = [],
                _mapIndex = {},
                _currentIndex = -1;

            Object.defineProperty(this, 'task', {
                get: function() { return _task; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'currentIndex', {
                get: function() { return _currentIndex; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'currentStep', {
                get: function() { return this.current() || null; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'nextStep', {
                get: function() { return this.hasNext() ? _queue[_currentIndex + 1] : null; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'previousStep', {
                get: function() { return this.hasPrevious() ? _queue[_currentIndex - 1] : null; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'length', {
                get: function() { return _queue.length; },
                enumerable: true,
                configurable: false
            });

            this.exists = function(job) {
                if (!job.hasOwnProperty('id')) {
                    $log.debug('the job argument does not have an id property');
                    $log.debug(job);
                    throw new TypeError('Job object must have an id property');
                }

                return _mapIndex.hasOwnProperty(job.id);
            };

            this.remove = function(job) {
                if (!this.exists(job)) {
                    $log.debug('the job argument does not exist in this manager');
                    $log.debug(job);
                    $log.debug(_mapIndex);
                    throw new TypeError('Job object must exist');
                }

                _queue.splice(_mapIndex[job.id], 1);
                delete _mapIndex[job.id];
            };

            this.push = function (job) {
                if (this.exists(job)) {
                    $log.debug('the job argument does not have a unique id');
                    $log.debug(job);
                    $log.debug(_mapIndex);
                    throw new TypeError('Job object must have a unique id property');
                }

                _queue.push(job);
                _mapIndex[job.id] = _queue.length - 1;
            };

            this.get = function (value) {
                if (angular.isNumber(value)) {
                    return _queue[value] || null;
                } else if (angular.isString(value)) {
                    return _queue[_mapIndex[value]] || null;
                }

                $log.debug('Attempted to get job with value but was not found' + value);
                return null;
            };

            this.current = function () {
                return _queue[_currentIndex] || null;
            };

            this.next = function () {
                if (!this.hasNext()) {
                    $log.debug('next(): _currentIndex = ' + _currentIndex);
                    $log.debug(_queue);
                    throw new TypeError('iterator:next(): at end');
                }

                _currentIndex++;
                return this.current();
            };

            this.hasNext = function () {
                return (_currentIndex + 1) < _queue.length;
            };

            this.previous = function () {
                if (!this.hasPrevious()) {
                    $log.debug('previous(): _currentIndex = ' + _currentIndex);
                    $log.debug(_queue);
                    throw new TypeError('iterator:previous(): at start');
                }

                _currentIndex--;
                return this.current();
            };

            this.hasPrevious = function () {
                return (_currentIndex + 1) > 0;
            };

            this.getResult = function (param) {
                if (param.indexOf('@') < 0) {
                    $log.debug('not checking for job result as param string did not start with @: ' + param);
                    return null;
                }

                var params = param.split('.'),
                    referenceJobName = params.shift(),
                    jobName = referenceJobName.replace('@', ''),
                    job = this.get(jobName),
                    lastValue,
                    propName,
                    flattenName,
                    tempValue,
                    i,
                    j;

                if (!job) {
                    $log.error('cannot get job result as no job exists with id: ' + jobName);
                    return null;
                }

                $log.debug('retrieved results for job: ' + jobName);
                lastValue = job.result;

                for (i = 0; i < params.length; i++) {
                    propName = params[i];
                    flattenName = null;

                    //check if we have a special char
                    if (propName.indexOf(':') > -1) {
                        flattenName = propName.split(':')[1];
                        propName = propName.split(':')[0];
                    }

                    if (!lastValue.hasOwnProperty(propName)) {
                        $log.debug('the result object does not have the propName so cannot proceed: ' + propName);
                        break;
                    } else {
                        lastValue = lastValue[propName];

                        //check if we need to flatten the object
                        if (flattenName) {
                            tempValue = [];
                            for (j = 0; j < lastValue.length; j++) {
                                tempValue.push(lastValue[j][flattenName]);
                            }

                            lastValue = tempValue;
                        }
                    }
                }

                return lastValue;
            };
        };


        return {
            getInstance: function (task) {
                return new JobManager(task);
            }
        };
    }]);