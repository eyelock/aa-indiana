'use strict';

angular.module('aaindianaApp')
    .constant('ENV', {
        'name': 'dev',
        'registryUrl': 'data/tasks/task-registry.json'
    })
    .constant('CACHE_SETTINGS', {
        'storagePrefix': 'indiana',
        'storageMode': 'localStorage',
        'maxAge': 60 * 60 * 1000,
        'deleteOnExpire': 'aggressive',
        'unlimited': 1.7976931348623157e+308
    })
    .constant('APP_CONTACT', {
        'email': 'support+dmaapilexplorer@eyelock.net',
        'web': 'https://bitbucket.org/eyelock/aaindiana',
        'code': 'https://bitbucket.org/eyelock/aaindiana'
    })
    .constant('APP_TECHNOLOGIES', [
        {
            'name': 'AngularJS',
            'link': 'https://angularjs.org/'
        },
        {
            'name': 'Bootstrap',
            'link': 'http://getbootstrap.com/'
        },
        {
            'name': 'jHipster',
            'link': 'https://jhipster.github.io/'
        },
        {
            'name': 'angular-ui-router',
            'link': 'http://angular-ui.github.io/'
        },
        {
            'name': 'angular-translate',
            'link': 'http://angular-translate.github.io/'
        },
        {
            'name': 'angular-cache',
            'link': 'http://jmdobry.github.io/angular-cache/'
        },
        {
            'name': 'ui-bootstrap',
            'link': 'https://angular-ui.github.io/bootstrap/'
        },
        {
            'name': 'angular-growl-v2',
            'link': 'http://janstevens.github.io/angular-growl-2/'
        },
        {
            'name': 'angular-ladda',
            'link': 'http://blog.remotty.com/angular-ladda/'
        },
        {
            'name': 'ladda',
            'link': 'http://lab.hakim.se/ladda/'
        },
        {
            'name': 'angular-dynamic-locale',
            'link': 'http://lgalfaso.github.io/angular-dynamic-locale/'
        },
        {
            'name': 'jsonFormatter',
            'link': 'https://github.com/mohsen1/json-formatter'
        }
    ]);