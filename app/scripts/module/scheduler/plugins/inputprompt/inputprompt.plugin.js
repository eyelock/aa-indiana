/* jshint -W061 */
'use strict';

angular.module('aaTaskScheduler')
    .factory('InputPromptPluginFactory', ['$q', '$state', '$log', function ($q, $state, $log) {
        var InputPromptPlugin;

        InputPromptPlugin = function () {
            var id = 'InputPromptPlugin',
                job,
                cfg,
                lastDeferred,
                previousResult;

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

            Object.defineProperty(this, 'prompts', {
                get: function() { return cfg.prompts; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'hasConfirm', {
                get: function() { return cfg.options && cfg.options.confirm && cfg.options.confirm.enabled; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'confirm', {
                get: function() { return cfg.options.confirm; },
                enumerable: true,
                configurable: false
            });

            this.configure = function (config) {
                cfg = config;

                $log.debug('Plugin Configured: ' + id);
            };

            this.execute = function (lastResult) {
                lastDeferred = $q.defer();
                previousResult = lastResult;

                //move state
                if (job.hasState) {
                    job.loadState({taskId: job.task.id});
                }

                $log.debug('Plugin executed: ' + id);

                //this is likely never used, but required by API contract
                return lastDeferred.promise;
            };

            this.createFormModel = function () {
                var model = {},
                    i,
                    prompt;

                for (i = 0; i < cfg.prompts.length; i++) {
                    prompt = cfg.prompts[i];

                    switch (prompt.type) {
                        case 'selectmulti': {
                            model[prompt.name] = [];
                            break;
                        }

                        case 'selectone': {
                            model[prompt.name] = {};
                            break;
                        }

                        case 'text': {
                            model[prompt.name] = '';
                            break;
                        }

                        case 'textarea': {
                            model[prompt.name] = '';
                            break;
                        }

                        case 'checkbox': {
                            model[prompt.name] = [];
                            break;
                        }

                        case 'date': {
                            model[prompt.name] = '';
                            break;
                        }

                        case 'json': {
                            //for json we bind directly to the model, rather than have values
                            model[prompt.name] = job.task.getConfigValue(prompt.value);
                            break;
                        }

                        case 'noop': {
                            model[prompt.name] = '';
                            break;
                        }

                        default: {
                            $log.warn('Unknown prompt type encountered: ' + prompt.type);
                        }
                    }
                }

                return model;
            };

            this.createFormValues = function () {
                var values = {},
                    i,
                    prompt,
                    tempValue;

                for (i = 0; i < cfg.prompts.length; i++) {
                    prompt = cfg.prompts[i];

                    if (prompt.hasOwnProperty('value')) {
                        tempValue = job.task.getConfigValue(prompt.value);

                        if (tempValue) {
                            values[prompt.name] = tempValue;
                        } else {
                            try {
                                values[prompt.name] = eval(prompt.value);
                            }
                            catch (e) {
                                values[prompt.name] = prompt.value;
                            }
                        }
                    }
                }

                return values;
            };
        };

        return {
            getInstance: function () {
                return new InputPromptPlugin();
            }
        };
    }]);