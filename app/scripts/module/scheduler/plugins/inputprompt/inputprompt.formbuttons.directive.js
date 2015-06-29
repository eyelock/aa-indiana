'use strict';

angular.module('aaTaskScheduler')
    .directive('inputPromptFormButtons', function () {
        return {
            restrict: 'A',
            scope: {
                formInstance: '=form',
                onReset: '&reset',
                onSubmit: '&submit',
                currentJob: '='

            },
            templateUrl: 'scripts/module/scheduler/plugins/inputprompt/inputprompt.formbuttons.html'
        };
    });
