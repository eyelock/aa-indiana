'use strict';

angular.module('aaindianaApp')
    .service('CacheService', ['$log', 'CACHE_SETTINGS', 'CacheFactory', function ($log, CACHE_SETTINGS, CacheFactory) {
        var defaultSettings = angular.copy(CACHE_SETTINGS);

        defaultSettings.onExpire = function(key, value) {
            $log.debug('removing key from cache: ' + key);
            $log.debug(value);
        }

        this.getOrInit = function (name, settings) {
            var cache = CacheFactory.get(name);
            settings = settings || defaultSettings;

            if (!cache) {
                cache = CacheFactory.createCache(name, settings);
            }

            return cache;
        };

        this.getSettingsCopy = function (removeArray) {
            var copy = angular.copy(defaultSettings);

            if (angular.isArray(removeArray)) {
                removeArray.map(function (item, index) {
                    if (copy.hasOwnProperty(item)) {
                        delete copy[item];
                    }
                });
            }

            return copy;
        };

        this.clearAll = function () {
            CacheFactory.clearAll();
        };

        this.setInfo = function (cache, key, toObject) {
            if (toObject.hasOwnProperty('cache')) {
                $log.debug('cannot set cacheInfo on object as key "cache" already exists: ' + JSON.stringify(toObject));
                return;
            }

            toObject.cache = {};
            toObject.cache.info = cache.info(key);
            toObject.cache.store = cache.info();
            toObject.cache.key = key;
        };

        this.remove = function (cacheInfo) {
            var cache = CacheFactory.get(cacheInfo.store.id);
            if (cache) {
                cache.remove(cacheInfo.key);
            } else {
                $log.warn('could not remove item from cache.  enable debug for more info.');
                $log.debug(cacheInfo);
            }
        }
    }]);
