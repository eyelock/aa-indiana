'use strict';

angular.module('aaindianaApp')
    .service('TaskRegistry', ['$q', '$http', '$log', 'ENV', 'CacheService', 'Preferences', function ($q, $http, $log, ENV, CacheService, Preferences) {
        var registryUrl = ENV.registryUrl,
            customTasksCacheName = 'CustomTasks',
            customTasksCacheSettings,
            customTasks,
            useCached = false,
            processRegistryTasks,
            processTaskTags,
            taskRegistry = {},
            tagRegistry = {},
            predefinedLoaded = false,
            customLoaded = false;

        //we don't want custom task store to ever empty
        customTasksCacheSettings = CacheService.getSettingsCopy(['maxAge']);
        customTasks = CacheService.getOrInit(customTasksCacheName, customTasksCacheSettings);

        processTaskTags = function (task) {
            var tags, t, tag, tagSpecifcRegistry, y, yFound;

            if (!task.hasOwnProperty('tags')) {
                $log.warn('task "' + task.id + '" has no tags property to add to the tag registory');
            } else {
                tags = task.tags.split(',');

                for (t = 0; t < tags.length; t++) {
                    tag = tags[t].trim();

                    if (!tagRegistry.hasOwnProperty(tag)) {
                        $log.debug('initializing tag registry value for "' + tag + '"');
                        tagRegistry[tag] = [];
                    }

                    tagSpecifcRegistry = tagRegistry[tag];
                    yFound = false;

                    for (y = 0; y < tagSpecifcRegistry.length; y++) {
                        if (tagSpecifcRegistry[y].id === task.id) {
                            yFound = true;
                            break;
                        }
                    }

                    if (!yFound) {
                        $log.debug('adding task "' + task.id + '" to the tag registry value "' + tag + '"');
                        tagSpecifcRegistry.push(task);
                    }
                }
            }
        };

        processRegistryTasks = function (tasks) {
            var i, task;

            for (i = 0; i < tasks.length; i++) {
                task = tasks[i];

                if (!task.hasOwnProperty('id')) {
                    $log.warn('no property "id" found for task, cannot add to registry');
                    $log.debug(task);
                } else {
                    if (taskRegistry.hasOwnProperty(task.id)) {
                        $log.warn('overwriting an existing task in the registry due to having same id" ' + task.id);
                        $log.debug(taskRegistry[task.id]);
                        $log.debug(task);
                    }

                    taskRegistry[task.id] = task;
                    $log.debug('added task with "id=' + task.id + '" to the task registry');
                    processTaskTags(task);
                }
            }
        };

        Object.defineProperty(this, 'loaded', {
            get: function() { return customLoaded && predefinedLoaded; },
            enumerable: true,
            configurable: false
        });

        this.reset = function () {
            taskRegistry = {};
            tagRegistry = {};
            customLoaded = false;
            predefinedLoaded = false;
        };

        this.getAll = function (clearCache) {
            var deferred = $q.defer(),
                getPrefined,
                getCustom,
                keyName,
                allItems = [];

            if (clearCache) {
                $log.debug('clearing task registry cache');
                this.reset();
            }

            if (this.loaded && !clearCache) {
                for (keyName in taskRegistry) {
                    allItems.push(taskRegistry[keyName]);
                }

                deferred.resolve(allItems);
            } else {
                getPrefined = this.loadPredefined();
                getPrefined.then(function (result) {
                    processRegistryTasks(result);
                });

                getCustom = this.loadCustom();
                getCustom.then(function (result) {
                    processRegistryTasks(result);
                });

                $q.all([getPrefined, getCustom])
                    .then(function () {
                        //load the favourite tasks
                        Preferences.getFavouriteTasks();

                        for (keyName in taskRegistry) {
                            //set a transient property if it's a favourite task
                            if (Preferences.isFavouriteTask(keyName)) {
                                Preferences.setFavouriteTask(taskRegistry[keyName], true);
                            } else {
                                Preferences.setFavouriteTask(taskRegistry[keyName], false);
                            }

                            allItems.push(taskRegistry[keyName]);
                        }
                        deferred.resolve(allItems);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
        };

        this.loadCustom = function () {
            var deferred = $q.defer(),
                keys,
                k,
                tasks = [];

            keys = customTasks.keys();
            for (k = 0; k < keys.length; k++) {
                tasks.push(customTasks.get(keys[k]));
            }

            customLoaded = true;
            deferred.resolve(tasks);

            return deferred.promise;
        };

        this.updateCustom = function (task) {
            var deferred = $q.defer();

            task.isCustom = true;
            customTasks.put(task.id, task);
            customLoaded = false;

            deferred.resolve(task);

            return deferred.promise;
        };

        this.deleteCustom = function (id) {
            var deferred = $q.defer();

            customTasks.remove(id);
            customLoaded = false;

            deferred.resolve(id);

            return deferred.promise;
        };

        this.loadPredefined = function () {
            var deferred = $q.defer();

            //never cache it...
            $http.get(registryUrl, { cache: useCached })
                .then(function (result) {
                    processRegistryTasks(result.data.tasks);
                    predefinedLoaded = true;
                    deferred.resolve(result);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        this.getTags = function () {
            var deferred = $q.defer();

            //test if we have it loaded already, task registry will be non empty
            if (this.loaded) {
                if (tagRegistry) {
                    deferred.resolve(Object.keys(tagRegistry));
                }
            } else {
                //fall back to trying to load them, this will create the registry
                this.getAll()
                    .then(function () {
                        deferred.resolve(Object.keys(tagRegistry));
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
        };

        this.getByTag = function (tag) {
            var deferred = $q.defer();

            //test if we have it loaded already, task registry will be non empty
            if (this.loaded) {
                if (tagRegistry) {
                    deferred.resolve(tagRegistry[tag]);
                }
            } else {
                //fall back to trying to load them, this will create the registry
                this.getAll()
                    .then(function () {
                        deferred.resolve(tagRegistry[tag]);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
        };


        this.getById = function (id) {
            var deferred = $q.defer();

            //test if we have it loaded already, task registry will be non empty
            if (this.loaded) {
                if (taskRegistry.hasOwnProperty(id)) {
                    $log.debug('found task in registry, returning from registry: ' + id);
                    deferred.resolve(taskRegistry[id]);
                }
            } else {
                //fall back to trying to load them, this will create the registry
                this.getAll()
                    .then(function () {
                        if (taskRegistry.hasOwnProperty(id)) {
                            deferred.resolve(taskRegistry[id]);
                        } else {
                            deferred.reject(new TypeError('registry does not have tasks property'));
                        }
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
        };

        this.loadConfigByUrl = function (url) {
            var deferred = $q.defer();

            $http.get(url, { cache: useCached })
                .then(function (result) {
                    deferred.resolve(result.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);
