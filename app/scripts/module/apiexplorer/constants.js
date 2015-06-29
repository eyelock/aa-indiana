'use strict';

angular.module('aaApi')
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
    })
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
    ]);