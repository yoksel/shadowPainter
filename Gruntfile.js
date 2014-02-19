'use strict';
/**
 * Grunt module
 */
module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Project info
     */
    project: {
      css_src: [
        '_src/css'
      ],
      css_res: [
        'assets/css'
      ],
      img_src: [
        '_src/img'
      ],
      img_res: [
        'assets/img'
      ],
      js_src: [
        '_src/js/*.js'
      ],
      js_res: [
        'assets/js/*.js'
      ]
    },

    /**
     * Project banner
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * Name: <%= pkg.name %>\n' +
              ' * Project: <%= pkg.description %>\n' +
              ' * Author: <%= pkg.author %>\n' +
              ' * Version: <%= pkg.version %>\n' +
              ' */\n'
    },

    /**
     * https://npmjs.org/package/grunt-contrib-sass
     */
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.css_src %>/style.unprefixed.css': '<%= project.css_src %>/style.scss'
        }
      },
      dist: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.css_src %>/style.unprefixed.css': '<%= project.css_src %>/style.scss'
        }
      }
    },

    /**
     * https://npmjs.org/package/grunt-autoprefixer
     */
    autoprefixer: {
      dev: {
        options: {},
        src: '<%= project.css_src %>/style.unprefixed.css',
        dest: '<%= project.css_res %>/style.css'
      },
      dist: {
        options: {},
        src: '<%= project.css_src %>/style.unprefixed.css',
        dest: '<%= project.css_src %>/style.prefixed.css'
      },
    },

    /**
     * Clean files and folders
     * https://github.com/gruntjs/grunt-contrib-clean
     * Remove generated files for clean deploy
     */
    clean: {
      dev: [
        '_src/css/style.prefixed.css',
        '_src/css/style.unprefixed.css'
      ],
      build: [
        '_site/Gemfile',
        '_site/Gemfile.lock',
        '_site/Gruntfile.js',
        '_site/package.json',
        '_site/node_modules',
        '_src/css/style.prefixed.css',
        '_src/css/style.unprefixed.css'
      ]
    },
    svgmin: {                        
        options: {                   
            plugins: [{
                removeViewBox: false
            }]
        },
        // dist: {                      
        //     files: {                 
        //         '_src/img/star2.svg': '_src/img/star.svg'        // 'destination': 'source'
        //     }
        // }
        dist: {                        // Target
            files: [{                // Dictionary of files
                expand: true,        // Enable dynamic expansion.
                cwd: '_src/img',        // Src matches are relative to this path.
                src: ['**/*.svg'],    // Actual pattern(s) to match.
                dest: 'assets/img',        // Destination path prefix.
                ext: '.svg'        // Dest filepaths will have this extension.
                // ie: optimise img/src/branding/logo.svg and store it in img/branding/logo.min.svg
            }]
        }
    },  
    imagemin: {
      dynamic: {   
        files: [{
          expand: true,
          cwd: '_src/img',                   
          src: ['**/*.{png,jpg,gif}'],   
          dest: 'assets/img'             
        }]
      }
    },  
    /**
     * https://npmjs.org/package/grunt-contrib-watch
     * Now with livereload
     */
    watch: {
      css: {
        files: '<%= project.css_src %>{,*/}*.{scss,sass}',
        tasks: ['sass:dev', 'autoprefixer', 'clean:dev'],
        options: {
          livereload: 35740,
        },
      },
      js: {
        files: '<%= project.js_res %>{,*/}*.{js}',
        options: {
          livereload: 35740,
        },
      },
    },

    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },
    open : {
      dev : {
        path: 'http://localhost:9001/',
        // app: 'Firefox'
      },
      // file : {
      //   path : '/etc/hosts',
      //   app: 'Sublime Text 2'
      // }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'svgmin',
    // 'imagemin',
    'connect',
    'open',
    'watch'
    ]);

  grunt.registerTask('build', [
    'sass:dist',
    'autoprefixer:dist',
    'clean:build'
    ]);


};
