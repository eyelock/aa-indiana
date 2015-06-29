/* jshint -W106 */
'use strict';

angular.module('aaindianaApp')
    .service('ApiHelper', ['$q', '$log', 'ApiExplorer', 'Auth', function ($q, $log, ApiExplorer, Auth) {
        var that = this;

        //construct the error message similar to what the api returns
        this.constructApiError = function (api, method, message) {
            return {
                data: {
                    error: api + ':' + method,
                    error_description: message
                }
            };
        };

        this.getApis = function () {
            var deferred = $q.defer();
            deferred.resolve(ApiExplorer.apis);
            return deferred.promise;
        };

        this.getApi = function (args) {
            var deferred = $q.defer(),
                apiPromise = ApiExplorer.getApi({
                    code: args.code,
                    token: Auth.getToken()
                });

            apiPromise
                .catch(function (error) {
                    $log.error(error);
                    deferred.reject(error);
                })
                .then(function (result) {
                    deferred.resolve(result);
                });

            return deferred.promise;
        };

        this.getMethods = function (args) {
            var deferred = $q.defer(),
                apiPromise = that.getApi(args);

            apiPromise
                .catch(function (error) {
                    $log.error(error);
                    deferred.reject(error);
                })
                .then(function (result) {
                    deferred.resolve(result.getMethods());
                });

            return deferred.promise;
        };

        this.getMethod = function (args) {
            var deferred = $q.defer(),
                apiPromise = that.getApi(args),
                error;

            apiPromise
                .catch(function (error) {
                    $log.error(error);
                    deferred.reject(error);
                })
                .then(function (result) {
                    if (result.methods[args.method]) {
                        deferred.resolve(result.methods[args.method]);
                    } else {
                        error = that.constructApiError(args.code, args.method, 'Cannot find API Method');
                        $log.error(error);
                        deferred.reject(error);
                    }
                });

            return deferred.promise;
        };

        this.getArguments = function (args) {
            var deferred = $q.defer(),
                error;

            that.getMethod(args)
                .catch(function (error) {
                    $log.error(error);
                    deferred.reject(error);
                })
                .then(function (result) {
                    if (result.defaultArgs) {
                        deferred.resolve(result.defaultArgs);
                    } else {
                        error = that.constructApiError(args.code, args.method, 'Cannot find API Method defaultArgs property');
                        $log.error(error);
                        deferred.reject(error);
                    }
                });

            return deferred.promise;
        };

        this.executeMethod = function (args) {
            var deferred = $q.defer(),
                error,
                methodPromise;

            that.getMethod(args)
                .catch(function (error) {
                    $log.error(error);
                    deferred.reject(error);
                })
                .then(function (result) {
                    if (result) {
                        methodPromise = result.execute.apply(result, [args.args]);
                        methodPromise
                            .catch(function (error) {
                                $log.error(error);
                                deferred.reject(error);
                            })
                            .then(function (result) {
                                deferred.resolve(result);
                            });
                    } else {
                        error = that.constructApiError(args.code, args.method, 'Cannot find API Method');
                        $log.error(error);
                        deferred.reject(error);
                    }
                });

            return deferred.promise;
        };
    }]);