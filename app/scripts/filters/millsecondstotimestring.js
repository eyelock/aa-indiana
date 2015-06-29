'use strict';

/**
 * @ngdoc filter
 * @name aaindianaApp.filter:millSecondsToTimeString
 * @function
 * @description http://stackoverflow.com/questions/20196113/angularjs-how-do-you-convert-milliseconds-to-xhours-and-ymins
 * # millSecondsToTimeString
 * Filter in the aaindianaApp.
 */
angular.module('aaindianaApp')
    .filter('millSecondsToTimeString', function () {
        return function (millseconds) {
            var seconds = Math.floor(millseconds / 1000),
                days = Math.floor(seconds / 86400),
                hours = Math.floor((seconds % 86400) / 3600),
                minutes = Math.floor(((seconds % 86400) % 3600) / 60),
                timeString = '';

            if (days > 0) { timeString += (days > 1) ? (days + " days ") : (days + " day "); }
            if (hours > 0) { timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour "); }
            if (minutes > 0) { timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute "); }
            
            return timeString;
        };
    });
