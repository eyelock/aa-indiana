'use strict';

/*
Wholly taken from jHipster

The token is the retrieved endpoint for the particular username/secret combination.
A valid token is a stored endpoint.

The credentials object should be of following format:

var credentials = {
    username: '<USERNAME>',
    secret: '<SECRET>'
}
*/
angular.module('aaindianaApp')
    .constant('AuthServiceConstants', {
        cacheName: 'LoginToken',
        tokenKey: 'token'
    })
    .factory('AuthServiceProvider', ['$q', 'AuthServiceConstants', 'CacheService', 'ApiExplorer', function loginService($q, AuthServiceConstants, CacheService, ApiExplorer) {
        var cache = CacheService.getOrInit(AuthServiceConstants.cacheName, CacheService.getSettingsCopy(['maxAge']));

        return {
            login: function (credentials) {
                var deferred = $q.defer();

                ApiExplorer.getApi({
                    code: 'Company',
                    token: {
                        credentials: credentials,
                        endpoint: ApiExplorer.datacentres[0].url
                    }
                })
                    .then(function (result) {
                        var endpointMethod = result.methods.GetEndpoint;
                        endpointMethod.execute()
                            .then(function (result) {
                                var token = {
                                    credentials: credentials,
                                    endpoint: result.data,
                                    roles: ['ROLE_USER']
                                };

                                cache.put(AuthServiceConstants.tokenKey, token);

                                //return the endpoint
                                deferred.resolve(token);
                            })
                            .catch(function (error) {
                                deferred.reject(error);
                            });
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            logout: function () {
                //Stateless API : No server logout
                cache.remove(AuthServiceConstants.tokenKey);
            },
            getToken: function () {
                return cache.get(AuthServiceConstants.tokenKey);
            },
            hasValidToken: function () {
                var token = this.getToken();
                return angular.isDefined(token);
            }
        };
    }]);