module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['public/build/', 'dev/js/min/', 'dev/css/rewrite'],
        concat: {
            lib: {
                src: [
                    'dev/js/libs/jquery.min.js',
                    //'dev/js/libs/bootstrap.min.js',
                    'dev/js/libs/react.min.js',
                    'dev/js/libs/modernizr-2.8.3-respond-1.4.2.min.js',
                    'dev/js/libs/date.format.min.js',
                    //'dev/js/min/*.js'  // My files
                    ],
                dest: 'public/build/lib.js',
            },
            main: {
                src: [
                    'dev/js/min/*.js',
                    'dev/js/min/partials/*.js'
                    ],
                dest: 'public/build/main.js',
            },
            css: {
                src: [
                    //'dev/css/reset.css',
                    //'dev/css/bootstrap.min.css',
                    //'dev/css/normalize.min.css',
                    //'dev/css/main.css',
                    'dev/css/style.css',
                    'dev/css/normalize.css',
                    'dev/css/rewrite/fontello.css'
                ],
                dest: 'public/build/prod.css',
            }
        },
        copy: {
          jquerymap: {
            src: 'dev/js/libs/jquery.min.map',
            dest: 'public/build/jquery.min.map'
          },
          fonts: {
            cwd: 'dev/',
            src: 'fonts/*',
            dest: 'public/build/',
            expand: true
          },
          devfiles: {
            cwd: 'dev/',
            src: ['**/*','!**/jsx/**'],
            dest: 'public/build/',
            expand: true
          },
          imgs: {
            cwd: 'dev/',
            src: 'img/*',
            dest: 'public/build/',
            expand: true
          },
          files: {
            cwd: 'dev/',
            src: 'files/*',
            dest: 'public/build/',
            expand: true
          }
        },
        //react: {
        //  jsx: {
        //    files: [
        //      {
        //        expand: true,
        //        cwd: 'dev/jsx',
        //        src: [ '**/*' ],
        //        dest: 'dev/js',
        //        ext: '.js'
        //      },
        //      {
        //        expand: true,
        //        cwd: 'react-partials/',
        //        src: [ '**/*' ],
        //        dest: 'partials/',
        //        ext: '.js'
        //      }
        //    ]
        //  }
        //},
        uglify: {
          target: {
            options: {
              //sourceMap: true,
              //sourceMapName: 'public/build/sourcemap.map'
            },
            files: [{
              expand: true,
              cwd: 'dev/js',
              src: ['**/*.js','!dev.js'], // Exclude dev.js
              dest: 'dev/js/min'
            }]
          }
        },
        cssUrlRewrite: {
            dist: {
                src: 'dev/css/fontello.css',
                dest: 'dev/css/rewrite/fontello.css',
                options: {
                    skipExternal: true,
                    rewriteUrl: function(url, options, dataURI) {
                        console.log(url);
                        var path = url.replace('dev/', './');
                        console.log(path);
                        return path;
                    }
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css-url-rewrite');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['clean','concat','copy:jquerymap']);
    grunt.registerTask('reset', ['clean']);
    grunt.registerTask('prod', ['clean','uglify','cssUrlRewrite','concat','copy:jquerymap','copy:fonts','copy:imgs','copy:files']);
    grunt.registerTask('dev', ['clean','copy:devfiles']);

};
