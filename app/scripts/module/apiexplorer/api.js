/* jshint -W106 */
'use strict';

/**
 * @ngdoc service
 * @module aaApi
 * @name ApiFactory
 *
 * @requires $http
 * @requires $log
 * @requires $q
 * @requires WSSE
 *
 * @description Factory for creating Api instances.
 */
angular.module('aaApi')
    .factory('ApiFactory', ['$http', '$log', '$q', 'WSSE', function ApiFactory($http, $log, $q, WSSE) {
        var throwError,
            Api,
            ApiMethod,
            getAuthHeader,
            configured = false,
            config,
            token,
            explorer;

        // private methods
        throwError = function (type, message) {
            $log.error(type + ': ' + message);
            throw new TypeError(type + ': ' + message);
        };

        getAuthHeader = function (credentials) {
            return WSSE.getHeader(credentials.username, credentials.secret);
        };

        // Method object
        ApiMethod = function () {
            var type,
                code,
                name,
                defaultArgs;

            /**
             * @property {Object}
             * @name ApiMethod#defaultArgs
             *
             * @description
             *
             * See {@link ApiExplorerProvider#urls}
             */
            Object.defineProperty(this, 'defaultArgs', {
                get: function() { return defaultArgs; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'code', {
                get: function() { return code; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'type', {
                get: function() { return type; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'name', {
                get: function() { return name; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'url', {
                get: function() { return type.getUrl(code); },
                enumerable: true,
                configurable: false
            });

            this.configure = function(apiType, methodCode, methodName, methodDefaultArgs) {
                type = apiType;
                code = methodCode;
                name = methodName;
                defaultArgs = methodDefaultArgs;
            };

            this.execute = function (args) {
                var deferred = $q.defer(),
                    req = {
                    'method': 'POST',
                    'url': this.url,
                    'headers': {
                        'X-WSSE': getAuthHeader(type.token.credentials),
                        'Content-Type': undefined
                    },
                    'data': args
                };

                $log.debug('executing http request');
                $log.debug(req);

                $http(req)
                    .then(function (result) {
                        //sometimes an error masqerates as a 200
                        if (result.data.error) {
                            $log.debug('error returned as 200, converting to an error');
                            $log.debug(result);

                            //also the 200 error message is data.message, but server is data.error_message
                            if (result.data.message && !result.data.error_description) {
                                result.data.error_description = result.data.message;
                            }

                            deferred.reject(result);
                        } else {
                            $log.debug('result successfully recieved from api call');
                            $log.debug(result);
                            deferred.resolve(result);
                        }
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            };
        };

        // API object
        Api = function () {
            var mthds = {};

            Object.defineProperty(this, 'code', {
                get: function() {
                    if (!configured) { throwError('configuration', 'ApiType not configured, call configure first'); }
                    return config.name;
                },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'configured', {
                get: function() { return configured; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'explorer', {
                get: function() { return explorer; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'token', {
                get: function() { return token; },
                enumerable: true,
                configurable: false
            });

            Object.defineProperty(this, 'methods', {
                get: function() { return mthds; },
                enumerable: true,
                configurable: false
            });

            this.configure = function (args) {
                var mType, mCode;

                config = args.config;
                token = args.token;
                explorer = args.explorer;

                $log.debug('configuring API: ' + config.name);

                //create public properties for each method
                for (mCode in config.methods) {
                    mType = new ApiMethod();
                    mType.configure(this, mCode, config.methods[mCode], config.defaultArgs[mCode]);
                    mthds[mType.name] = mType;
                    $log.debug('configured API method: ' + mType.name);
                }

                configured = true;
            };

            this.getUrl = function (method) {
                if (!configured) { throwError('configuration', 'ApiType not configured, call configure first: ' + method); }
                var versionTypePath = '/' + explorer.version + '/' + explorer.type + '/',
                    finalUrl,
                    absoluteUrl;

                //If we are working with an authenticated user, we already have full endpoint
                if (token.endpoint.indexOf(versionTypePath) === -1) {
                    finalUrl = token.endpoint + versionTypePath;
                } else {
                    finalUrl = token.endpoint;
                }

                absoluteUrl = finalUrl + '?method=' + method;
                $log.debug('url constructed: ' + absoluteUrl);

                return absoluteUrl;
            };

            this.getMethods = function () {
                if (!configured) { throwError('configuration', 'ApiType not configured, call configure first'); }
                return config.methods;
            };

            this.getMethodDefaultArgs = function (methodCode) {
                return config.defaultArgs[methodCode];
            };
        };

        return {
            getInstance: function () {
                return new Api();
            }
        };
    }]);