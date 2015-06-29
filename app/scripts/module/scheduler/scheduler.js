'use strict';

/**
 * @ngdoc module
 * @name aaTaskScheduler
 *
 * @requires ui.router
 * @requires ui.bootstrap
 * @requires pascalprecht.translate
 * @requires tmh.dynamicLocale
 * @requires isteven-multi-select
 * @requires JSONedit
 * @requires angular-ladda
 *
 * @description
 *
 * Provides a simple workflow engine to execute a series of {@link Job} that
 * make up a {@link Task}.  The {@link Task} is executed linearly and the
 * {@link TaskScheduler} provides a singleton manager for {@link Task}s.
 *
 * The engine provides mechanisms for passing the lastResult of a job but also
 * accessing any {@link Job}s result.
 **/
angular
    .module('aaTaskScheduler', [
        'ui.router',
        'ui.bootstrap',
        'pascalprecht.translate',
        'tmh.dynamicLocale',
        'isteven-multi-select',
        'JSONedit',
        'angular-ladda',
        'angularModalService'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('scheduler', {
                abstract: true,
                parent: 'site'
            });
    }]);

/**
 * @ngdoc service
 * @module aaTaskScheduler
 * @name TaskScheduler
 *
 * @requires TaskFactory
 *
 * @description
 *
 * The TaskScheduler provides a mechanism for creating a {@link Task} and keeps it in memory
 * to enable state between the Jobs.
 */
angular
    .module('aaTaskScheduler')
    .service('TaskScheduler', ['TaskFactory', function (TaskFactory) {
        var tasks = {};

        /**
         * @ngdoc function
         * @module aaTaskScheduler
         * @name TaskScheduler#createTask
         *
         * @param {String} id The unique Id of the task.  Note that the {@link TaskScheduler} keeps
         * and internal cache of the running {@link Task}s therefore every one needs a unique id.
         *
         * @throws {TypeError} If the Id already exists in the cache.  Use {link hasTask} to check.
         *
         * @returns {Task} The newly created {@link Task}
         *
         * @description
         *
         * Uses {@link TaskFactory} to create an instance of a {@link Task}.  Checks the internal
         * cache of the {@link TaskScheduler} to ensure that it doesn't exist first.
         */
        this.createTask = function (id) {
            var task = TaskFactory.getInstance();

            if (tasks.hasOwnProperty(id)) {
                throw new TypeError('A task with the id already exists and cannot be overwritten.  Either give a unique id, or remove the task. (id: ' + id + ')');
            }

            tasks[id] = task;

            return task;
        };

        /**
         * @ngdoc function
         * @module aaTaskScheduler
         * @name TaskScheduler#getTask
         *
         * @param {String} id The unique Id of the task.  Note that the {@link TaskScheduler} keeps
         * and internal cache of the running {@link Task}s therefore every one needs a unique id.
         *
         * @returns {Task} Returns the task with the given id, or returns null.
         *
         * @description
         *
         * Returns the {@link Task} identified by the Id from the internal cache.
         */
        this.getTask = function (id) {
            return tasks[id] || null;
        };

        /**
         * @ngdoc function
         * @module aaTaskScheduler
         * @name TaskScheduler#hasTask
         *
         * @param {String} id The unique Id of the task.  Note that the {@link TaskScheduler} keeps
         * and internal cache of the running {@link Task}s therefore every one needs a unique id.
         *
         * @returns {Boolean} True if the task with id exists, false if not.
         *
         * @description
         *
         * Identifies if a {@link Task} with the given Id currently exists.
         */
        this.hasTask = function (id) {
            return tasks.hasOwnProperty(id);
        };

        /**
         * @ngdoc function
         * @module aaTaskScheduler
         * @name TaskScheduler#removeTask
         *
         * @param {String} id The unique Id of the task.  Note that the {@link TaskScheduler} keeps
         * and internal cache of the running {@link Task}s therefore every one needs a unique id.
         *
         * @throws {TypeError} If the Id already exists in the cache.  Use {link hasTask} to check.
         *
         * @returns {void}
         *
         * @description
         *
         * Checks that the {@link Task} with the given id exists first, or throws a TypeError.  If the
         * {@link Task} exists, then {@link Task#destroy} is called and the {@link Task} is deleted
         * from the cache.
         */
        this.removeTask = function (id) {
            if (!this.hasTask(id)) {
                throw new TypeError('No task exists for that id. (id: ' + id + ')');
            }

            var task = this.getTask(id);
            task.destroy();
            delete tasks[id];
        };
    }]);