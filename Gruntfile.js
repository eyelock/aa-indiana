/* jshint -W106 */
// Generated on 2015-04-15 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-taskregistry');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-slack-hook');
  grunt.loadNpmTasks('grunt-dgeni');

  // Define the configuration for all the tasks
  grunt.initConfig({
    //read in the AWS keys
    aws: grunt.file.readJSON('config/aws_s3.json'),
    slackConfig: grunt.file.readJSON('config/slack.json'),

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'build/app'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*',
            'docs'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= yeoman.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'scripts/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    ngtemplates: {
        dist: {
            cwd: 'app',
            src: ['scripts/**/*.html'],
            dest: '.tmp/templates/templates.js',
            options: {
                module: 'aaindianaApp',
                usemin: 'scripts/scripts.js',
                htmlmin:  {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true
                }
            }
        }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'scripts/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'data/**',
            'i18n/**',
            'bower_components/bootstrap/dist/fonts/*.*',
            'bower_components/angular-i18n/angular-locale*.js'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },

        devDist: {
            files: [{
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>',
              dest: '<%= yeoman.dist %>',
              src: [
              ]
            }]
          },

      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
      ],
      test: [
      ],
      dist: [
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false
      },
      watch: {
        configFile: 'karma.conf.js',
        singleRun: false,
        autoWatch: true
      }
    },

    // Configuration to be run (and then tested).
    taskregistry: {
        build: {
            options: {
                webroot: 'app'
            },

            files: {
              'app/data/tasks/task-registry.json': ['app/data/tasks/**/*.json']
            }
        }
    },

    i18nrequired: {
        options: {
            defaultLang: 'en',
            basedir: './'
        },

        files: {
          src: ['app/i18n/**/*.json'],
          dest: 'build/i18n'
        }
    },

    slack: {
        options: {
            endpoint: '<%= slackConfig.enabled ? slackConfig.endpoint : "" %>',
            channel: '<%= slackConfig.channel %>',
            username: '<%= slackConfig.username %>',
            icon_url: '<%= slackConfig.icon_url %>'
        },
        deploy_staging_start: {
            text: 'deploy_staging: start: to <%= aws.StagingBucket %>'
        },
        deploy_staging_complete: {
            text: 'deploy_staging: complete:  to <%= aws.StagingBucket %>'
        },
        deploy_production_start: {
            text: 'deploy_production: start: to <%= aws.ProductionBucket %>'
        },
        deploy_production_complete: {
            text: 'deploy_production: complete: to <%= aws.ProductionBucket %>'
        }
    },

    dgeni: {
        options: {
            // Base directory of the JavaScript file to be read
            basePath: 'app'
        },
        // JavaScript file to be read
        src: [
            'scripts/**/*.js'
        ],
        // Directory to output the document
        dest: 'build/docs'
    },

    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
        secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
        region: '<%= aws.BucketRegion %>',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      staging: {
        options: {
          bucket: '<%= aws.StagingBucket %>',
          differential: true, // Only uploads the files that have changed
          gzipRename: 'ext' // when uploading a gz file, keep the original extension
        },
        files: [
          {expand: true, cwd: '<%= yeoman.app %>', src: ['**'], dest: '/'}
        ]
      },
      production: {
        options: {
          bucket: '<%= aws.ProductionBucket %>'
        },
        files: [
          {expand: true, cwd: '<%= yeoman.dist %>', src: ['**'], dest: '/'}
        ]
      },
      clean_staging: {
        options: {
          bucket: '<%= aws.StagingBucket %>',
          debug: false // Doesn't actually delete but shows log
        },
        files: [
          {dest: '/', exclude: ['bower_components/**'], action: 'delete'}
        ]
      },
      download_staging: {
        options: {
          bucket: '<%= aws.StagingBucket %>'
        },
        files: [
          {dest: '/', cwd: 'build/s3backup/staging/', exclude: ['bower_components/**'], action: 'download'}
        ]
      },
      clean_production: {
        options: {
          bucket: '<%= aws.ProductionBucket %>',
          debug: false // Doesn't actually delete but shows log
        },
        files: [
          {dest: '/', action: 'delete'}
        ]
      },
      download_production: {
        options: {
          bucket: '<%= aws.ProductionBucket %>'
        },
        files: [
          {dest: '/', cwd: 'build/s3backup/production/', action: 'download'}
        ]
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'ngtemplates',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deployStaging', [
    'slack:deploy_staging_start',
    'aws_s3:download_staging',
    'aws_s3:clean_staging',
    'aws_s3:staging',
    'slack:deploy_staging_complete'
  ]);

  grunt.registerTask('deployProduction', [
    'slack:deploy_production_start',
    'build',
    'aws_s3:download_production',
    'aws_s3:clean_production',
    'aws_s3:production',
    'slack:deploy_production_complete'
  ]);

  grunt.registerTask('deploy', [
    'deployStaging',
    'deployProduction'
  ]);
};