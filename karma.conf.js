// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',

        'app/bower_components/jquery/dist/jquery.js',
        'app/bower_components/angular-ui-router/release/angular-ui-router.js',
        'app/bower_components/angular-translate/angular-translate.js',
        'app/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
        'app/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
        'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'app/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        'app/bower_components/angular-local-storage/dist/angular-local-storage.js',
        'app/bower_components/json-formatter/dist/json-formatter.js',
        'app/bower_components/spin.js/spin.js',
        'app/bower_components/ladda/dist/ladda.min.js',
        'app/bower_components/angular-ladda/dist/angular-ladda.min.js',
        'app/bower_components/angular-cache/dist/angular-cache.js',
        'app/bower_components/angular-growl-v2/build/angular-growl.js',
        'app/bower_components/jquery-ui/jquery-ui.js',
        'app/bower_components/angular-ui-sortable/sortable.js',
        'app/bower_components/bootstrap/dist/js/bootstrap.js',
        'app/bower_components/json-edit/js/directives.js',

        //Need to load the module definitions explicity first
        'app/scripts/app/app.js',
        'app/scripts/module/apiexplorer/explorer.js',
        'app/scripts/module/scheduler/scheduler.js',

        //Glob rest of scripts
        'app/scripts/*.js',
        'app/scripts/**/*.js',
        //'test/mock/**/*.js',
        //'test/spec/**/*.js'
        'test/spec/filters/*.js',
        'test/spec/module/apiexplorer/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
