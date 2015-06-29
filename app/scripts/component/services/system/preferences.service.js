'use strict';

angular.module('aaindianaApp')
    .constant('PreferencesContants', {
        cacheName: 'UserPreferences',
        favouriteTasksKey: 'FavouriteTasks'
    })
    .service('Preferences', ['$q', '$log', 'PreferencesContants', 'CacheService', function ($q, $log, PreferencesContants, CacheService) {
        var preferencesCacheSettings,
            preferencesCache,
            preferencesTransient = {};

        //we don't want custom task store to ever empty
        preferencesCacheSettings = CacheService.getSettingsCopy(['maxAge']);
        preferencesCache = CacheService.getOrInit(PreferencesContants.cacheName, preferencesCacheSettings);

        this.getFavouriteTasks = function () {
            var favTasks = preferencesCache.get(PreferencesContants.favouriteTasksKey) || [];
            preferencesTransient = {};

            favTasks.forEach(function (item) {
                 preferencesTransient[item] = false;
            });

            return preferencesTransient;
        };

        this.isFavouriteTask = function (id) {
            if (angular.equals({}, preferencesTransient)) {
                this.getFavouriteTasks();
            }

            return preferencesTransient.hasOwnProperty(id);
        };

        this.addFavouriteTask = function (task) {
            if (!this.isFavouriteTask(task.id)) {
                preferencesTransient[task.id] = false;
                this.setFavouriteTask(task, true);
                preferencesCache.put(PreferencesContants.favouriteTasksKey, Object.keys(preferencesTransient));
            }
        };

        this.removeFavouriteTask = function (task) {
            if (angular.equals({}, preferencesTransient)) {
                this.getFavouriteTasks();
            }

            if (this.isFavouriteTask(task.id)) {
                delete preferencesTransient[task.id];
                this.setFavouriteTask(task, false);
                preferencesCache.put(PreferencesContants.favouriteTasksKey, Object.keys(preferencesTransient));
            }
        };

        this.setFavouriteTask = function (task, value) {
            task.isFavourite = value;
        };
    }]);
