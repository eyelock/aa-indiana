'use strict';

/* http://stackoverflow.com/questions/21714655/angular-js-angular-ui-router-reloading-current-state-refresh-data */

angular.module('aaindianaApp')
.config(function($provide) {
    $provide.decorator('$state', ['$delegate', '$stateParams', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    }]);
});