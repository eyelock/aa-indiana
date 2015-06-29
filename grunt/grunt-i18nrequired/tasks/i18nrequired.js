/*
 * grunt-i18nrequired
 *
 *
 * Copyright (c) 2015 David Collie
 * Licensed under the MIT license.
 *
 *     // Configuration to be run (and then tested).
    i18nrequired: {
        options: {
            defaultLang: 'en',

        },

        files: {
          src: ['app/i18n/**\/*json'],
          dest: 'build/i18n'
        }
    },
 *
 *
 *
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('i18nrequired', 'Plugin to scan translation docs and create files that translators can easily translate.  Provide an extract and import method to roundtrip the process.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            seperator: "/",
            defaultLang: 'en'
        });

        grunt.log.ok('Starting task');


        if (options.basedir) {
            grunt.file.setBase(options.basedir);
            grunt.log.writeln('Set basedir to : ' + options.basedir);
        }

        var getLangFolder = function (path) {
            var split = path.split(options.seperator);
            return split[split.length -2];
        };

        var getLangFile = function (path) {
            var split = path.split(options.seperator),
                file = split.pop().split('.'),
                fileName = file.splice(file.length-2, 1).concat();
            return fileName;
        };

        var getTargetValue = function (obj, key) {
            var targValue;

            if (typeof obj !== "undefined" && typeof obj[key] !== "undefined") {
                targValue = obj[key];
            } else {
                targValue = undefined;
            }

            return targValue;
        };

        var constructDestObject = function (srcObject, targObj, destObj, logSpacing) {
            var key,
                targValue,
                defaultPostfix = "-default",
                spacing = logSpacing || '  ';

            //the assumption is that _everything is an object or a string...
            for (key in srcObject) {
                grunt.log.debug(logSpacing + 'Processing Key:' + key);

                if (typeof srcObject[key] === "object") {
                    grunt.log.debug(spacing + 'Object Found:' + key);
                    destObj[key] = {};
                    targValue = getTargetValue(targObj, key);
                    grunt.log.debug(spacing + 'Target Value:' + targValue);
                    constructDestObject(srcObject[key], targValue, destObj[key], spacing+spacing);
                } else {
                    grunt.log.debug(logSpacing + 'String Found:' + key);
                    targValue = getTargetValue(targObj, key);
                    grunt.log.debug(spacing + 'Target Value:' + targValue);
                    grunt.log.debug(spacing + 'Src Value:' + srcObject[key]);
                    destObj[key+defaultPostfix] = srcObject[key];
                    destObj[key] = targValue || '';
                }
            }

            return destObj;
        };


        //CONTROL STRUCTURES
        var data = {};
        data.langFiles = {};
        data.langProcessedFiles = {};


        //LOGIC FLOW
        //make up the data structure with all the files
        this.files.forEach(function(f) {
            data.destPath = f.dest;

            f.src.filter(function (path) {
                grunt.log.debug('Found file to process ' + path);

                var langFolder = getLangFolder(path),
                    langFile = getLangFile(path);

                if (!data.langFiles.hasOwnProperty(langFolder)) {
                    data.langFiles[langFolder] = {};
                    data.langProcessedFiles[langFolder] = {};
                    grunt.log.debug('Creating langFolder object: ' + langFolder);
                }

                if (data.langFiles[langFolder].hasOwnProperty(langFile)) {
                    grunt.log.warn('Skipping file as one with its name already exists.  i18n filenames must all be unique: ' + langFile);
                } else {
                    data.langFiles[langFolder][langFile] = {
                        fileName: langFile,
                        filePath: path
                    };
                    data.langProcessedFiles[langFolder][langFile] = {};
                    grunt.log.debug('Creating langFile object for: [' + langFolder + '][' + langFile + '] with path ' + path);
                }
            });
        });

        grunt.log.ok('Found ' + Object.keys(data.langFiles).length + ' languages');

        //check we have existance of the default language
        if (!data.langFiles.hasOwnProperty(options.defaultLang)) {
            grunt.log.debug('Files where not found for the configured default language (' + options.defaultLang + ')');
            return;
        }

        grunt.log.ok('Found default language ' + options.defaultLang);

        //remove the default from the langFiles to be processed
        data.defaultLang = data.langFiles[options.defaultLang];
        delete data.langFiles[options.defaultLang];

        //loop over the associated i18n files and check against the other langs
        for (var srcKey in data.defaultLang) {
            grunt.log.debug('Processing in default language: ' + srcKey);

            for (var targLang in data.langFiles) {
                if (!data.langFiles[targLang].hasOwnProperty(srcKey)) {
                     grunt.log.warn('i18n file for ' + targLang + ' does not exist: ' + srcKey + ')');
                    //TODO
                } else {
                    var srcObj = grunt.file.readJSON(data.defaultLang[srcKey].filePath);
                    var targObj = grunt.file.readJSON(data.langFiles[targLang][srcKey].filePath);

                    grunt.log.ok('Beginning to process language "' + targLang + '" for file "' + srcKey + '"');

                    data.langProcessedFiles[targLang][srcKey] = constructDestObject(srcObj, targObj, {});

                    grunt.log.ok('Completed process of language "' + targLang + '" for file "' + srcKey + '"');
                }
            }
        }

        //now write out the files to the temp directory
        grunt.log.debug('Completed processing of the language files.  Now writing them out');

        for (var lang in data.langProcessedFiles) {
            for (var file in data.langProcessedFiles[lang]) {
                var filePath = data.destPath + options.seperator + lang + options.seperator + file + '.json';
                grunt.log.debug('Writing out to: ' + filePath);

                grunt.file.write(filePath, JSON.stringify(data.langProcessedFiles[lang][file], null, '    '));

                grunt.log.debug('Wrote out file for "' + lang + '" for file "' + file + '"');
            }
        }

        grunt.log.ok('Completed writing all files out to: ' + data.destPath);
    });
};
