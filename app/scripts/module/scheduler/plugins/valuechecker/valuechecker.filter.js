'use strict';

angular.module('aaTaskScheduler')
    .filter('valueCheckerDataFilter', ['$log', function ($log) {
        var getObject, compareProperties;

        getObject = function (objects, idprop, id) {
            var i,
                foundObject;

            for (i = 0; i < objects.length; i++) {
                if (objects[i][idprop] === id) {
                    foundObject = objects[i];
                    break;
                }
            }

            return foundObject;
        };

        //http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
        compareProperties = function (x, y) {
            if (angular.isUndefined(x) && angular.isDefined(y)) { return false; }

            if ( x === y ) { return true; }
            // if both x and y are null or undefined and exactly the same

            if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) { return false; }
            // if they are not strictly equal, they both need to be Objects

            if ( x.constructor !== y.constructor ) { return false; }
            // they must have the exact same prototype chain, the closest we can do is
            // test there constructor.

            if (JSON.stringify(x) === JSON.stringify(y)) {
                return true;
            }
            //try and prove true fast, order of properties needs to be same here

            for ( var p in x ) {
                if ( ! x.hasOwnProperty( p ) ) { continue; }
                  // other properties were tested using x.constructor === y.constructor

                if ( ! y.hasOwnProperty( p ) ) { return false; }
                  // allows to compare x[ p ] and y[ p ] when set to undefined

                if ( x[ p ] === y[ p ] ) { continue; }
                  // if they have the same strict value or identity then they are equal

                if ( typeof( x[ p ] ) !== 'object' ) { return false; }
                  // Numbers, Strings, Functions, Booleans must be strictly equal

                if ( ! compareProperties( x[ p ],  y[ p ] ) ) { return false; }
                  // Objects and Arrays must be tested recursively
            }

            for ( p in y ) {
                if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {return false; }
                  // allows x[ p ] to be set to undefined
            }

            return true;
        };

        return function (options) {
                var data,
                    objectsAll,
                    objectMain,
                    objectsOthers,
                    r = 0,
                    c = 0,
                    rowMainValue,
                    rowOtherValue,
                    row,
                    column;

                objectsAll = options.data.objects;

                //getting main object is tricky
                if (angular.isString(options.data.primary)) {
                    //assumed that it is a reference to an object in the all bucket
                    objectMain = getObject(objectsAll, options.data.idProp, options.data.primary);
                } else if (angular.isObject(options.data.primary)) {
                    //assumed it is a static control object passed
                    objectMain = options.data.primary;
                } else {
                    $log.debug(options.data.primary);
                    throw new TypeError('Could not determine what the main object was');
                }

                //make an array with the other objects
                objectsOthers = [];
                for (r = 0; r < objectsAll.length; r++) {
                    if (objectsAll[r][options.data.idProp] !== objectMain[options.data.idProp]) {
                        objectsOthers.push(objectsAll[r]);
                    }
                }

                //make up the returned object structure
                data = {};
                data.rows = [];
                data.meta = {
                    isEqual: true,
                    noCols: 1 + objectsAll.length,
                    noRows: options.headerProps.length + options.checkProps.length,
                    primaryObject: objectMain,
                    comparedObjects: objectsOthers,
                    headerProps: options.headerProps,
                    checkProps: options.checkProps,
                    idProp: options.data.idProp
                };

                for (r = 0; r < data.meta.noRows; r++) {
                    data.rows[r] = row = {};
                    row.columns = [];
                    row.meta = {
                        isEqual: true,
                        isHeader: false,
                        isComparison: true,
                        propName: ''
                    };

                    rowMainValue = '';
                    rowOtherValue = '';

                    //for this row work out if header and also set the propName
                    if (r < data.meta.headerProps.length) {
                        row.meta.isHeader = true;
                        row.meta.isComparison = false;
                        row.meta.propName = data.meta.headerProps[r];
                    } else {
                        row.meta.propName = data.meta.checkProps[r - data.meta.headerProps.length];
                    }

                    for (c = 0; c < data.meta.noCols; c++) {
                        row.columns[c] = column = {};
                        column.data = '';
                        column.meta = {
                            isHeader: false,
                            isPrimary: false,
                            isComparison: false,
                            isEqual: true,
                        };

                        //work out the column meta values
                        if (r < data.meta.headerProps.length) {
                            column.meta.isHeader = true;
                            column.meta.isPrimary = (c === 1);
                        } else {
                            column.meta.isPrimary = (c === 1);
                            column.meta.isComparison = (c > 1);
                        }

                        //work out the column data value
                        if (c === 0) {
                            //the first column is property names, and always a header
                            column.meta.isHeader = true;

                            if (r < data.meta.headerProps.length) {
                                column.data = data.meta.headerProps[r];
                            } else {
                                column.data = data.meta.checkProps[r - data.meta.headerProps.length];
                            }
                        } else if (c === 1) {
                            //the next column is the 'primary' object
                            rowMainValue = objectMain[row.meta.propName];
                            column.data = rowMainValue;
                        } else {
                            //this is a comparison object
                            rowOtherValue = objectsOthers[c - 2][row.meta.propName];
                            column.data = rowOtherValue;

                            //set the row check value to false if doesn't equate, as long as not a header
                            if (!row.meta.isHeader && !compareProperties(rowMainValue, rowOtherValue)) {
                                row.meta.isEqual = false;
                                column.meta.isEqual = false;
                                data.meta.isEqual = false;
                            }
                        }
                    }
                }

                return data;
            };
    }]);