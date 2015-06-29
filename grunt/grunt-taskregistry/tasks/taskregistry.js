/*
 * grunt-taskregistry
 *
 *
 * Copyright (c) 2015 David Collie
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('taskregistry', 'Builds and maintains the task-registry.json file for the aaIndiana project.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    var createTaskRegistry,
        createTask,
        taskRegistry;

    createTaskRegistry = function () {
        return {
            "id": "root",
            "name": "Root",
            "description": "Collection of Predefined tasks",
            "tasks": []
        };
    };

    createTask = function (json, url) {
        return {
            "id": json.id,
            "name": json.name,
            "description": json.description,
            "tags": json.tags,
            "url": url
        };
    };

    //TODO TEMP TESTING
    if (options.basedir) {
        grunt.file.setBase(options.basedir);
        grunt.log.writeln('Set basedir to : ' + options.basedir);
    }

    //set up the registry
    taskRegistry = createTaskRegistry();

    grunt.log.writeln('TaskRegistry created: ' + JSON.stringify(taskRegistry));

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
        // Concat specified files.
        var src = f.src.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Source file "' + filepath + '" not found.');
                return false;
            } else if (filepath === f.dest) {
                grunt.log.warn('Found existing target file, not processing: ' + f.dest);
                return false;
            } else {
                grunt.log.warn('Found file, processing: ' + filepath);
                return true;
            }
        }).map(function(filepath) {
            var fJson = grunt.file.readJSON(filepath);
            var taskObject = createTask(fJson, filepath.replace(options.webroot, ''));
            taskRegistry.tasks.push(taskObject);
        });

        // Write the destination file.
        grunt.file.write(f.dest, JSON.stringify(taskRegistry, null, '    '));

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};
