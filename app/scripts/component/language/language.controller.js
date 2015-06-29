'use strict';

angular.module('aaindianaApp')
    .controller('LanguageCtrl', ['$scope', '$translate', 'Language', function ($scope, $translate, Language) {
        $scope.languages = [];
    
        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };

        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });
    }]);
