'use strict';

angular.module('aaindianaApp')
    .service('TransformUtils', ['$log', function TransformUtils($log) {
        this.getCompany = function (username) {
            return username.split(':')[1];
        };

        this.getLogin = function (username) {
            return username.split(':')[0];
        };

        /**
          * @module aaindianaApp
          * @memberOf TransformUtils
          * @name TransformUtils#dateMaths
          *
          * @param {Object} args The arguments in the format:
          * Object properterties
          * - args.from = Date or String date, or special keyworkd 'now'
          * - args.part = 'days', 'hours', 'minutes'
          * - args.value = The numeric value to add to the args.from with args.value
          *
          * @throws {TypeError} If an argument is deemed invalid
          *
          * @description
          *
          * Performs simple date maths given the arguments.
          */
        this.dateMaths = function (args) {
            var valid = {}, returnDate;
            valid.parts = ['days', 'hours', 'minutes'];

            if (!(args.part && valid.parts.indexOf(args.part) > -1)) {
                $log.error('The argument property \'args.part\' was invalid');
                $log.debug(args.part);
                $log.debug(valid.parts);
                throw new TypeError('InvalidArgument');
            }

            if (angular.isString(args.value)) {
                try {
                    args.value = parseFloat(args.value);
                }
                catch (e) {
                    $log.error('The argument property \'args.value\' was not a parsable number using parseFloat()');
                    $log.debug(args.value);
                    throw new TypeError('InvalidArgument');
                }
            }

            if (!angular.isNumber(args.value)) {
                $log.error('The argument property \'args.part\' was not a number');
                $log.debug(args.value);
                throw new TypeError('InvalidArgument');
            }

            if (!args.from) {
                $log.error('The argument property \'args.from\' is required');
                throw new TypeError('InvalidArgument');
            }

            if (args.from === 'now') {
                returnDate = new Date();
            } else if (angular.isString(args.from)) {
                try {
                    returnDate = Date.parse(args.from);
                }
                catch (e) {
                    $log.error('The argument property \'args.from\' was not a parsable string date using Date.parse()');
                    $log.debug(args.from);
                    throw new TypeError('InvalidArgument');
                }
            }

            switch (args.part) {
                case 'days': {
                    returnDate.setDate(returnDate.getDate() + args.value);
                    break;
                }

                case 'hours': {
                    returnDate.setHours(returnDate.getHours() + args.value);
                    break;
                }

                case 'minutes': {
                    returnDate.setMinutes(returnDate.getMinutes() + args.value);
                    break;
                }

                default: {
                    $log.warn('date part not found but passed validation: ' + args.part);
                    break;
                }
            }

            return returnDate;
        };
    }]);