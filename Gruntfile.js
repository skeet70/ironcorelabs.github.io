'use strict';

module.exports = function(grunt) {
  var glob = require('glob');
  var production_url = "https://ironcorelabs.com";
  var localhost = require("os").hostname();
  var dev_url = "http://"+localhost+":4000";

  //grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-check-pages');
  grunt.loadNpmTasks('grunt-htmllint');
  grunt.loadNpmTasks('grunt-w3c-html-validation');
  grunt.loadNpmTasks('grunt-grunticon');






  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  //require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    validation: {
      options: {
//        reset: grunt.option('reset') || false,
        relaxerror: ['Attribute “markdown” not allowed on element “div” at this point.'],
        stoponerror: true
      },
      files: {
        src: ['_site/**/*.html']
      }
    },
    htmllint: {
      dev: {
        options: {
          force: false,
          htmllintrc: true,
          plugins: []
        },
        src: [ '_site/**/*.html' ]
      },
      dist: {
        options: {
          force: false,
          htmllintrc: true,
          plugins: []
        },
        src: [
          '_site/**/*.html'
        ]
      }
    },
    checkPages: {
      dev: {
        options: {
          pageUrls: glob.sync('_site/**/*.html').map(function(file, idx, arr) {
            return dev_url + file.replace('_site', '');
          }).filter(function(v) {
            return !/\.md\//.test(v);
          }),
          checkLinks: true,
          queryHashes: false,
          noRedirects: false,
          noLocalLinks: true,
          noEmptyFragments: true,
          onlySameDomain: true,
          checkCaching: false,
          checkCompression: false,
          maxResponseTime: 500,
          summary: true,
          linksToIgnore: [
          ]
        }
      },
      production: {
        options: {
          pageUrls: glob.sync('_site/**/*.html').map(function(file, idx, arr) {
            return production_url + file.replace('_site', '');
          }).filter(function(v) {
            return !/\.md\//.test(v);
          }),
          checkLinks: true,
          queryHashes: false,
          noRedirects: true,
          noLocalLinks: true,
          noEmptyFragments: true,
          checkCaching: false,
          checkCompression: true,
          maxResponseTime: 800,
          summary: true
        }
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    clean: [
      "_site",
      "w3cErrors",
      "**/*.bak",
      "js/**/*.map",
      "js/min/all.min.js",
      "js/all.ts.js",
      "css/**/*.map",
      "css/styles.css",
      "_sass/output",
      ".sass-cache",
      ".DS_Store",
      ".codekit-cache",
      ".tscache",
      "validation-*.json"
    ],
    jekyll: {
      options: {
        bundleExec: true,
        safe: true
      },
      dev: {
        options: {
          drafts: true,
          future: true,
          incremental: true,
          config: '_config.yml,_config-dev.yml'
        }
      },
      dist: {
        options: {
          drafts: false,
          future: false,
          config: '_config.yml'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      configFiles: {
        files: [ 'Gruntfile.js' ],
        options: {
          reload: true
        }
      },
      jekyll: {
        files: [
          '_posts/*',
          '_layouts/*',
          '_includes/**',
          '_drafts/*',
          'img/**/*.{jpg,png,svg}',
          '*.{html,yml,md}',
          '**/*.{html,yml,md}',
          '**/index.{html,md}',
          '*.xml',
          '!_site/**/*', // not anything in the output dir
          '!TODO.md' // don't rebuild when the TODO file changes
        ],
        tasks: ['jekyll:dev']  //, 'validation', 'htmllint:dev']
      },
      grunticon: {
        files: ['*.svg'],
        tasks: ['grunticon']
      },
      compass: {
        files: [
          '_sass/**/*.scss'
        ],
        tasks: ['compass:dev', 'jekyll:dev']
      },
      typescript: {
        files: [
          'ts/*.ts',
          'js/plugins.js',
          "!node_modules/**/*.ts"
        ],
        tasks: ['typescript:dev', 'uglify:dev', 'jekyll:dev']
      }
    },
    typescript: {
      dev: {
        src: [
          "ts/*.ts",
          "!node_modules/**/*.ts"
        ],
        dest: 'js/all.ts.js',
        options: {
          target: 'es5',
          sourceMap: true,
          declaration: true,
          references: [
            'core', 'dom'
          ]
        }
      },
      dist: {
        src: [
          "ts/*.ts",
          "!node_modules/**/*.ts"
        ],
        dest: 'js/all.ts.js',
        options: {
          target: 'es5',
          sourceMap: false,
          declaration: true,
          references: [
            'core', 'dom'
          ]
        }
      }
    },
    compass: {
      options: {
        config: 'config.rb'
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true
        }
      },
      dev: {
        options: {
          environment: 'development',
          outputStyle: 'expanded',
          noLineComments: false
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: '_site/',
          hostname: '0.0.0.0',
          keepalive: false
        }
      },
      keepalive: {
        options: {
          port: 4000,
          base: '_site/',
          hostname: '0.0.0.0',
          keepalive: true
        }
      }
    },
    grunticon: {
        myIcons: {
            files: [{
                expand: true,
                // cwd: 'example/source',
                src: ['img/home/*.svg', 'img/logos/*.svg', 'img/about/*.svg', 'img/tech/*.svg', 'img/products/*.svg'], //, 'img/icons/*.svg'],
                dest: "_sass/output"
            }],
            options: {
              cssprefix: ".img-",
              inheritviewbox: true,
              template: '_sass/svgtemplate.hbs',
              datasvgcss: '_images.scss',
            }
        },
    },
    uglify: {
      options: {
        mangle: false,
        compress: true
      },
      dev: {
        options: {
          sourceMapIncludeSources: true,
          sourceMap: true
        },
        files: {
          'js/min/slides.min.js': [
            'js/vendor/svg4everybody.js',
            'js/vendor/slidesv2.3/plugins.js',
            'js/vendor/slidesv2.3/slides.js',
            'bower_components/twitter-fetcher/js/twitterFetcher.js',
            'js/all.ts.js'
          ],
          'js/min/all.min.js': [
            'js/plugins.js',
            'js/all.ts.js',
            'bower_components/Stickyfill/src/stickyfill.js',
//            'bower_components/immutable/dist/immutable.js',
//            'bower_components/underscore/underscore.js',
//            'js/bootstrap/carousel.js',
            'js/bootstrap/collapse.js',
            'js/bootstrap/transition.js',
            'js/bootstrap/tab.js',
            'js/bootstrap/dropdown.js',
            'js/bootstrap/button.js'
          ]
        }
      },
      dist: {
        options: {
          sourceMapIncludeSources: false,
          sourceMap: false
        },
        files: {
          'js/min/slides.min.js': [
            'js/vendor/svg4everybody.js',
            'js/vendor/slidesv2.3/plugins.js',
            'js/vendor/slidesv2.3/slides.js',
            'bower_components/twitter-fetcher/js/twitterFetcher.js',
            'js/all.ts.js'
          ],
          'js/min/all.min.js': [
            'js/plugins.js',
            'js/all.ts.js',
            'bower_components/Stickyfill/src/stickyfill.js',
//            'bower_components/immutable/dist/immutable.js',
//            'bower_components/underscore/underscore.js',
//            'js/bootstrap/carousel.js',
            'js/bootstrap/collapse.js',
            'js/bootstrap/transition.js',
            'js/bootstrap/tab.js',
            'js/bootstrap/dropdown.js',
            'js/bootstrap/button.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('dev', function(target) {
    grunt.task.run([
      'typescript:dev',
      'grunticon',
      'uglify:dev',
      'compass:dev',
      'jekyll:dev',
//      'validation',
//      'htmllint:dev',
      'connect:server',
      'checkPages:dev',
      'watch'
    ]);
  });
  grunt.registerTask('build', function(target) {
    grunt.task.run([
      'clean',
      'typescript:dist',
      'uglify:dist',
      'grunticon',
      'compass:dist',
      'jekyll:dist',
      'validation',
      'htmllint:dist'
//      'checkPages:dev'
    ]);
  });
  grunt.registerTask('dist', function(target) {
    // dist is an alias for build
    grunt.task.run(['build']);
  });

}
