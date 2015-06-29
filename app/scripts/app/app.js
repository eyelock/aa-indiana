/* jshint -W064 */
/* jshint -W084 */
/* jshint -W098 */
'use strict';

/*
Wholly taken from jHipster
*/
angular
    .module('aaindianaApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'pascalprecht.translate',
        'tmh.dynamicLocale',
        'ui.bootstrap',
        'LocalStorageModule',
        'jsonFormatter',
        'angular-ladda',
        'angular-cache',
        'angular-growl',
        'JSONedit',
        'aaApi',
        'aaTaskScheduler',
        'angulartics',
        'angulartics.adobe.analytics',
        'angularUtils.directives.dirPagination',
        'angularModalService'
    ])
    .run([
        '$rootScope',
        '$location',
        '$window',
        '$http',
        '$state',
        '$translate',
        'Auth',
        'Principal',
        'Language',
        'CacheFactory',
        'CACHE_SETTINGS',
        function ($rootScope, $location, $window, $http, $state, $translate, Auth, Principal, Language, CacheFactory, CACHE_SETTINGS) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                if (Principal.isIdentityResolved()) {
                    Auth.authorize();
                }

                // Update the language
                Language.getCurrent().then(function (language) {
                    $translate.use(language);
                });
            });

            $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
                var titleKey = 'global.title';

                $rootScope.previousStateName = fromState.name;
                $rootScope.previousStateParams = fromParams;

                // Set the page title key to the one configured in state or use default one
                if (toState.data.pageTitle) {
                    titleKey = toState.data.pageTitle;
                }

                $translate(titleKey).then(function (title) {
                    // Change window title with translated one
                    $window.document.title = title;
                });
            });

            $rootScope.$on('$stateChangeError',  function (event, toState, toParams, fromState, fromParams, error) {
                console.log('$stateChangeError: ' + error.message);
            });

            $rootScope.$on('$stateNotFound',  function (event, unfoundState, fromState, fromParams) {
                console.log('$stateNotFound: ' + unfoundState);
            });

            $rootScope.back = function () {
                // If previous state is 'activate' or do not exist go to 'home'
                if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                    $state.go('home');
                } else {
                    $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
                }
            };

            //we only want to cache HTTP requests per app load
            var httpRequestCache = CacheFactory('HttpRequestCache', CACHE_SETTINGS);
            httpRequestCache.removeAll();
            $http.defaults.cache = httpRequestCache;
        }])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        '$locationProvider',
        '$translateProvider',
        'tmhDynamicLocaleProvider',
        'showErrorsConfigProvider',
        'growlProvider',
        '$logProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, showErrorsConfigProvider, growlProvider, $logProvider) {
            //configure debug messages
            $logProvider.debugEnabled(true);

            $urlRouterProvider.otherwise('/');

            //syntatic sugar for getting a prop from a string
            // http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
            Object.prop = function(obj, prop, val){
                var props = prop.split('.'),
                    final = props.pop(),
                    p;

                while(p = props.shift()){
                    if (typeof obj[p] === 'undefined') {
                        return undefined;
                    }
                    obj = obj[p];
                }
                return val ? (obj[final] = val) : obj[final];
            };

            //set up the page structure
            $stateProvider.state('site', {
                'abstract': true,
                'views': {
                    'navbar@': {
                        templateUrl: 'scripts/component/navbar/navbar.html',
                        controller: 'NavbarCtrl'
                    },
                    'footer@': {
                        templateUrl: 'scripts/component/footer/footer.html',
                        controller: 'FooterCtrl'
                    }
                },
                'resolve': {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('language');
                        return $translate.refresh();
                    }]
                }
            });

            // Initialize angular-translate
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: 'i18n/{lang}/{part}.json'
            });

            $translateProvider.preferredLanguage('en');
            $translateProvider.useCookieStorage();

            tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
            tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');

            //show errors directive config
            showErrorsConfigProvider.showSuccess(true);

            //growl notification config
            growlProvider.onlyUniqueMessages(true);
            growlProvider.globalTimeToLive(2000);
            growlProvider.globalDisableCountDown(true);
            growlProvider.globalReversedOrder(false);
        }]);