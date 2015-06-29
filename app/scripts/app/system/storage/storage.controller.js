'use strict';

angular.module('aaindianaApp')
    .controller('SystemStorageCtrl', [
    '$scope', '$state', 'growl', 'ModalService', 'CacheFactory', 'CACHE_SETTINGS',
    function ($scope, $state, growl, ModalService, CacheFactory, CACHE_SETTINGS) {
        $scope.caches = [];
        $scope.unlimitedValue = CACHE_SETTINGS.unlimited;

        $scope.init = function () {
            $scope.caches = CacheFactory.info().caches;
        };

        $scope.isUnlimited = function (value) {
            return value === CACHE_SETTINGS.unlimited;
        };

        $scope.confirmClearAll = function () {
            ModalService.showModal({
                templateUrl: 'scripts/app/system/storage/clearall.modal.html',
                controller: 'SystemStorageClearAllModalCtrl'
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.clearAll();
                        }
                    });
                });
        };

        $scope.clearAll = function () {
            CacheFactory.clearAll();
            $state.go('system.auth');
        };

        $scope.confirmClearCache = function (id) {
            ModalService.showModal({
                templateUrl: 'scripts/app/system/storage/clearcache.modal.html',
                controller: 'SystemStorageClearCacheModalCtrl',
                inputs: {
                    cacheId: id
                }
            })
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            $scope.clearCache(result);
                        }
                    });
                });
        };

        $scope.clearCache = function (cacheId) {
            CacheFactory.destroy(cacheId);
            $scope.init();
        };

        $scope.init();
    }]);