'use strict';

angular.module('aaApi')
    .directive('jsonInput', function () {
        return {
            restrict: 'A',
            templateUrl: 'scripts/directives/jsoninput.html',
            replace: true,
            scope: {
                ngModel: '=',
                editorDefault: '=?editorDefault',
                editorDisabled: '=?editorDisabled',
                editorCollapsed: '=?editorCollapsed'
            },
            link: function(scope, elem, attrs, ngModel) {
                scope.editorDefault = scope.editorDefault || false;
                scope.editorDisabled = scope.editorDisabled || false;
                scope.editorCollapsed = scope.editorCollapsed || false;

                scope.isEditor = scope.disableEditor ? false : scope.editorDefault;

                //copy some of the element values to the scope
                scope.name = elem[0].name;
                scope.className = elem[0].className;
                scope.required = elem[0].disabled;
                scope.disabled = elem[0].required;

                scope.toggle = function () {
                    if (scope.disableEditor) {
                        return;
                    }

                    scope.isEditor = !scope.isEditor;
                };
            }
        };
    });