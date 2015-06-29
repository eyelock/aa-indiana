'use strict';

/*
Wholly taken from jHipster
*/
angular.module('aaindianaApp')
    .factory('Principal', ['$q', 'AuthServiceProvider', function Principal($q, AuthServiceProvider) {
        var _identity,
            _authenticated = false;

        return {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!_authenticated || !_identity || !_identity.roles) {
                    return false;
                }

                return _identity.roles.indexOf(role) !== -1;
            },
            isInAnyRole: function (roles) {
                var i;
                
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                for (i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }

                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;
            },
            identity: function (force) {
                var deferred = $q.defer(),
                    token;
                
                if (force === true) {
                    _identity = undefined;
                }

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }

                // the app has identity only stored locally
                token = AuthServiceProvider.getToken();
                if (angular.isDefined(token)) {
                    _identity = token;
                    _authenticated = true;
                    deferred.resolve(_identity);
                } else {
                    _identity = null;
                    _authenticated = false;
                    deferred.resolve(_identity);
                }
                
                return deferred.promise;
            }
        };
    }]);
