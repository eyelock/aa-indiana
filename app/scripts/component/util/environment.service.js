'use strict';

angular.module('aaindianaApp')
    .service('Environment', ['ApiExplorer', function (ApiExplorer) {
        var datacentres = ApiExplorer.datacentres;

        this.query = function () {
            return datacentres;
        };

        this.get = function (code) {
            var i, env, found = null;

            for (i = 0; i < datacentres.length; i++) {
                env = datacentres[i];

                if (env.hasOwnProperty('code')) {
                    if (env.code === code) {
                        found = env;
                        break;
                    }
                }
            }

            return found;
        };

        this.getFromEndpoint = function (endpoint) {
            var i, env, found = null;

            for (i = 0; i < datacentres.length; i++) {
                env = datacentres[i];

                if (env.hasOwnProperty('url')) {
                    if (endpoint.indexOf(env.url) !== -1) {
                        found = env;
                        break;
                    }
                }
            }

            return found;
        };
    }]);