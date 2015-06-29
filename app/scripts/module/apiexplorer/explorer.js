'use strict';
/**
 * @ngdoc module
 * @name aaApi
 *
 * @requires ENV Describes the environment varialbes to configure the APIs. An
 * example of this is:
 *
 *```js
    .constant('ENV', {
        'name': 'dev',
        'apiDefaults': {
            'version': '1.4',
            'type': 'rest'
        },
        'urls': {
            'methods': 'data/api',
			'requestArguments': 'data/api',
			'docs': 'https://marketing.adobe.com/developer/api-method-documentation'
        },
        'datacentres': [
            {
                'code': 'sjo',
                'name': 'San Jose (Production)',
                'url': 'https://api.omniture.com/admin'
            },
            {
                'code': 'dal',
                'name': 'Dallas (Production)',
                'url': 'https://api2.omniture.com/admin'
            },
            {
                'code': 'lon',
                'name': 'London (Production)',
                'url': 'https://api3.omniture.com/admin'
            },
            {
                'code': 'sin',
                'name': 'Singapore (Production)',
                'url': 'https://api4.omniture.com/admin'
            },
            {
                'code': 'pnw',
                'name': 'Portland (Production)',
                'url': 'https://api5.omniture.com/admin'
            }
        ]
 *```
 *
 * @requires APIS Describes the API tpes varialbes to configure the APIs. An
 * example of this is:
 *
 *```js
    .constant('APIS', [
        'Bookmarks',
        'Classifications',
        'Company',
        'DataFeed',
        'DataSources',
        'Permissions',
        'Report',
        'ReportSuite',
        'Scheduling',
        'Segments',
        'Social'
    ])
 *```
 *
 * @description
 *
 * aaApi is a utitlity for accessing the Adobe Anlytics API.   It uses a series of
 * JSON files to rovide the configuration for each API in terms of it's methods, but
 * also it's default arguments.
 */
angular.module('aaApi', [])
    .config(['ApiExplorerProvider', 'ENV', 'APIS', function (ApiExplorerProvider, ENV, APIS) {
        ApiExplorerProvider.urls = ENV.urls;
		ApiExplorerProvider.version = ENV.apiDefaults.version;
		ApiExplorerProvider.type = ENV.apiDefaults.type;
        ApiExplorerProvider.apis = APIS;
        ApiExplorerProvider.datacentres = ENV.datacentres;
    }]);


/**
 * @ngdoc provider
 * @module aaApi
 * @name ApiExplorerProvider
 *
 * @description
 *
 * ApiExplorerProvider is the singleton instance provider that provides you access to
 * load the configuration for each API and get an instance of a helper object
 * that allows you to query the methods associated with the particular API.
 */
angular.module('aaApi')
    .provider('ApiExplorer', [function ApiExplorerProvider() {
        var urls, version, type, apis, datacentres;

        /**
         * @property {Object}
         * @memberOf ApiExplorerProvider
         * @name ApiExplorerProvider#urls
         *
         * @description
         *
         * This propery is the configuration parameters for the {@link ApiExplorer} to
         * load the configuration of each of the APIs that Adobe Analytics provides.
         *
         * Since the API is available in REST and SOAP along with version, these are
         * set internally so these URLs should be the link to the JSON files that
         * detail the methods and default arguments of each of the APIs.
         *
         * ```js
         *  'urls': {
         *       'methods': 'data/api',
         *        'requestArguments': 'data/api',
         *        'docs': 'https://marketing.adobe.com/developer/api-method-documentation'
         *    },
         * ```
         */
        Object.defineProperty(this, 'urls', {
            get: function() { return urls; },
            set: function(v) { urls = v; },
            enumerable: true,
            configurable: true
        });

        /**
         * @property {Object}
         * @memberOf ApiExplorerProvider
         * @name ApiExplorerProvider#datacentres
         *
         * @description
         *
         * Adobe Analytics has various datacentres that a Report Suite belongs to.  This
         * configuration parameter allows for setting of the main URL endpoint and description
         * of each of the datacentres that could be accessed.
         *
         * For a particular access point of a Report Suite, you can use the API Company.getEndpoint
         * to find the one that should be used.
         *
         * ```js
         *'datacentres': [
         *    {
         *        'code': 'sjo',
         *        'name': 'San Jose (Production)',
         *        'url': 'https://api.omniture.com/admin'
         *    },
         *    {
         *        'code': 'dal',
         *        'name': 'Dallas (Production)',
         *        'url': 'https://api2.omniture.com/admin'
         *    },
         *    {
         *        'code': 'lon',
         *        'name': 'London (Production)',
         *        'url': 'https://api3.omniture.com/admin'
         *    },
         *    {
         *        'code': 'sin',
         *        'name': 'Singapore (Production)',
         *        'url': 'https://api4.omniture.com/admin'
         *    },
         *    {
         *        'code': 'pnw',
         *        'name': 'Portland (Production)',
         *        'url': 'https://api5.omniture.com/admin'
         *    }
         * ]
         *```
         */
        Object.defineProperty(this, 'datacentres', {
            get: function() { return datacentres; },
            set: function(v) { datacentres = v; },
            enumerable: true,
            configurable: true
        });

        /**
         * @property {String}
         * @memberOf ApiExplorerProvider
         * @name ApiExplorerProvider#version
         *
         * @description
         *
         * Denotes the version of the API to use.
         *
         * See {@link ApiExplorer#getApiConfig} on how this influences how the configuration
         * file is loaded.
         *
         * Remember that this should correspond
         * to configuration files (as denoted by {@link ApiExplorer#urls} that can be loaded
         * by the {@link ApiExploer} to configure itself with the required objects to allow
         * easy access to the APIs that are made available.
         */
        Object.defineProperty(this, 'version', {
            get: function() { return version; },
            set: function(v) { version = v; },
            enumerable: true,
            configurable: true
        });

        /**
         * @property {String}
         * @memberOf ApiExplorerProvider
         * @name ApiExplorerProvider#type
         *
         * @description
         *
         * This is the type of access to the API.  Currently the API is available via REST and
         * SOAP.
         *
         * See {@link ApiExplorer#getApiConfig} on how this influences how the configuration
         * file is loaded.
         *
         * Remember that this should correspond
         * to configuration files (as denoted by {@link ApiExplorer#urls} that can be loaded
         * by the {@link ApiExploer} to configure itself with the required objects to allow
         * easy access to the APIs that are made available.
         */
        Object.defineProperty(this, 'type', {
            get: function() { return type; },
            set: function(v) { type = v; },
            enumerable: true,
            configurable: true
        });

        /**
         * @property {Array}
         * @memberOf ApiExplorerProvider
         * @name ApiExplorerProvider#apis
         *
         * @description
         *
         * This is the available API list.
         *
         * NOTE Currently this is hardcoded to being the available list for the 1.4 version
         * of the APIs.
         *
         *```js
            [
                'Bookmarks',
                'Classifications',
                'Company',
                'DataFeed',
                'DataSources',
                'Permissions',
                'Report',
                'ReportSuite',
                'Scheduling',
                'Segments',
                'Social'
            ]
         *```
         */
        Object.defineProperty(this, 'apis', {
            get: function() { return apis; },
            set: function(v) { apis = v; },
            enumerable: true,
            configurable: true
        });

        this.$get = ['$http', '$q', '$log', 'ApiFactory', function ($http, $q, $log, ApiFactory) {
            /**
             * @ngdoc service
             * @module aaApi
             * @constructor
             * @name ApiExplorer
             *
             * @requires $http
             * @requires $log
             * @requires $q
             * @requires ApiFactory
             *
             * @description
             *
             * #ApiExplorer
             *
             * ApiExplorer is an instance of the helper methods associated with accessing the
             * various types of Adobe Analytics APIs.
             */
            var ApiExplorer = function () {
                var thisApiExploer = this,
                    apiCache = {};

                /**
                 * @name ApiExplorer#urls
                 * @property {Object}
                 * @memberOf! ApiExplorer
                 *
                 * @description
                 *
                 * This propery is the configuration parameters for the {@link ApiExplorer} to
                 * load the configuration of each of the APIs that Adobe Analytics provides.
                 *
                 * Since the API is available in REST and SOAP along with version, these are
                 * set internally so these URLs should be the link to the JSON files that
                 * detail the methods and default arguments of each of the APIs.
                 *
                 * ```js
                 *  'urls': {
                 *       'methods': 'data/api',
                 *        'requestArguments': 'data/api',
                 *        'docs': 'https://marketing.adobe.com/developer/api-method-documentation'
                 *    },
                 * ```
                 */
                Object.defineProperty(this, 'urls', {
                    get: function() { return urls; },
                    enumerable: true,
                    configurable: false
                });

                /**
                 * @property {Object}
                 * @name ApiExplorer#datacentres
                 *
                 * @description
                 *
                 * See {@link ApiExplorerProvider#datacentres}
                 */
                Object.defineProperty(this, 'datacentres', {
                    get: function() { return datacentres; },
                    enumerable: true,
                    configurable: false
                });

                /**
                 * @property {String}
                 * @name ApiExplorer#version
                 *
                 * @description
                 *
                 * See {@link ApiExplorerProvider#version}
                 */
                Object.defineProperty(this, 'version', {
                    get: function() { return version; },
                    enumerable: true,
                    configurable: false
                });

                /**
                 * @property {String}
                 * @name ApiExplorer#type
                 *
                 * @description
                 *
                 * See {@link ApiExplorerProvider#type}
                 */
                Object.defineProperty(this, 'type', {
                    get: function() { return type; },
                    enumerable: true,
                    configurable: false
                });

                /**
                 * @property {Array}
                 * @name ApiExplorer#apis
                 *
                 * @apis
                 *
                 * See {@link ApiExplorerProvider#apis}
                 */
                Object.defineProperty(this, 'apis', {
                    get: function() { return apis; },
                    enumerable: true,
                    configurable: false
                });

                /**
                 * @ngdoc method
                 * @name ApiExplorer#reset
                 *
                 * @returns void
                 *
                 * @description
                 *
                 * reset() clears the cache of APIs that have been previously loaded
                 * by {@link ApiExplorer}
                 */
                this.reset = function () {
                    apiCache = {};
                    $log.debug('successfully reset api cache');
                };

                /**
                 * @ngdoc method
                 * @name ApiExplorer#getApiConfig
                 *
                 * @param {String} code The code that the API relates to as detailed
                 * via the {@link ApiExplorerProvider#apis} configuration parameter.
                 *
                 * @returns {Promise} The promise will resolve to the JSON oejct that describes
                 * the API configuration.   This includes the methods, and the default arguments.
                 *
                 * An example is given below:
                 *
                 *```js
                    {
                        "name": "Company",
                        "methods": {"Company.GetEndpoint":"GetEndpoint","Company.GetLoginKey":"GetLoginKey","Company.GetReportSuites":"GetReportSuites","Company.GetTrackingServer":"GetTrackingServer","Company.GetVersionAccess":"GetVersionAccess"},
                        "defaultArgs": {
                            "Company.GetEndpoint": {
                                "company":"(string)"
                            },
                            "Company.GetLoginKey": {
                                "company":"(string)",
                                "login":"(string)",
                                "password":"(string)"
                            },
                            "Company.GetReportSuites": {
                                "search":"(string)",
                                "types":[
                                    "(string)"
                                ]
                            },
                            "Company.GetTrackingServer": {
                                "rsid":"(string)"
                            },
                            "Company.GetVersionAccess": [

                            ]
                        }
                    }
                 *```
                 *
                 * @description
                 *
                 * Depending on what {@link ApiExplorerProvider#type} and {@link ApiExplorerProvider#version}
                 * is set on the provider depens on which configuration file is loaded.
                 *
                 * @example
                 *
                 * If type=rest and version=1.4 and the {@link ApiExplorerProvider#urls} has the property
                 * methods=data/api, then the URL loaded would be data/api/rest/1.4/{code}.json
                 */
                this.getApiConfig = function (code) {
                    var req = {
                        'method': 'GET',
                        'url': urls.methods + '/' + version + '/' + code.toLowerCase() + '.json'
                    };

                    $log.debug('ApiExplorer: retrieve API config');
                    $log.debug(req);

                    return $http(req);
                };

                /**
                 * @ngdoc method
                 * @name ApiExplorer#isApi
                 *
                 * @param {String} code The code that the API relates to as detailed
                 * via the {@link ApiExplorerProvider#apis} configuration parameter.
                 *
                 ** @returns {Boolean} true if the API exists, false if not.
                 *
                 * @description
                 *
                 * Checks that the code passed is a valid API that is configured via the
                 * {@link ApiExplorerProvider#apis} variable.
                 */
                this.isApi = function (code) {
                    var isApi = false,
                        i,
                        api;

                    for (i = 0; i < apis.length; i++) {
                        api = apis[i];
                        if (api.hasOwnProperty('code') && api.code === code) {
                            isApi = true;
                            $log.debug('ApiExplorer: found api with code: ' + code);
                            break;
                        }
                    }

                    if (!isApi) {
                        $log.debug('ApiExplorer: could not find api with code: ' + code);
                    }

                    return isApi;
                };

                /**
                 * @ngdoc method
                 * @name ApiExplorer#getApi
                 *
                 * @param {Object} args The args variable should contain both the code of
                 * the API but also a token variable.   The args.code is required, but eh
                 * api.token can be null.   An example of a JSON object for args is:
                 *
                 *```js
                    {
                    //TODO - add the JSON object
                    }
                 *```
                 *
                 * @returns {Promise} Returns a promise which when resolved contains the
                 * result containing the object {@link Api} object containing properties
                 * and methods assciated with that particualr API.
                 *
                 * @description
                 *
                 * Checks that the code passed is a valid API that is configured via the
                 * {@link ApiExplorerProvider#apis} variable.
                 */
                this.getApi = function (args) {
                    var deferred = $q.defer();

                    if (apiCache.hasOwnProperty(args.code)) {
                        $log.debug('return api object from cache: ' + args.code);
                        deferred.resolve(apiCache[args.code]);
                        return deferred.promise;
                    }

                    $log.debug('ApiExplorer: creating API with code');
                    $log.debug(args);

                    this.getApiConfig(args.code)
                        .success(function (result) {
                            var api = ApiFactory.getInstance(),
                                apiConfig = {
                                    explorer: thisApiExploer,
                                    config: result,
                                    token: args.token
                                };

                            $log.debug('ApiExplorer: configuring API');
                            $log.debug(apiConfig);

                            api.configure(apiConfig);
                            apiCache[args.code] = api;
                            deferred.resolve(api);
                        })
                        .error(function (error) {
                            $log.error(error);
                            deferred.reject(error);
                        });

                    return deferred.promise;
                };
            };

            return new ApiExplorer();
        }];
    }]);