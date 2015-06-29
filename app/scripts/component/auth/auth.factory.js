'use strict';

/*
Wholly taken from jHipster
*/
angular.module('aaindianaApp')
    .factory('Auth', ['$rootScope', '$state', '$q', '$translate', 'Principal', 'AuthServiceProvider', 'WSSE', function Auth($rootScope, $state, $q, $translate, Principal, AuthServiceProvider, WSSE) {
        return {
            getToken: function () {
                return AuthServiceProvider.getToken();
            },          
            
            login: function (credentials) {
                var deferred = $q.defer(),
                    that = this;

                AuthServiceProvider.login(credentials)
                    .then(function (token) {
                        // retrieve the logged account information
                        Principal.identity(true)
                            .then(function (result) {
                                //After login actions
                            });
                    
                        deferred.resolve(token);
                    })
                    .catch(function (err) {
                        that.logout();
                        deferred.reject(err);
                    });

                return deferred.promise;
            },

            logout: function () {
                AuthServiceProvider.logout();
                Principal.authenticate(null);
            },

            authorize: function (force) {
                return Principal.identity(force)
                    .then(function () {
                        var isAuthenticated = Principal.isAuthenticated();

                        if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                            if (isAuthenticated) {
                                // user is signed in but not authorized for desired state
                                $state.go('accessdenied');
                            } else {
                                // user is not authenticated. stow the state they wanted before you
                                // send them to the signin state, so you can return them when you're done
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;

                                // now, send them to the signin state so they can log in
                                $state.go('accessdenied');
                            }
                        }
                    });
            }
        };
    }]);
