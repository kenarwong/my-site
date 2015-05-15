module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['public/build/', 'dev/js/min/'],
        concat: {
            js: {
                src: [
                    'dev/js/libs/jquery.min.js',
                    'dev/js/libs/bootstrap.min.js',
                    'dev/js/libs/react.min.js',
                    'dev/js/min/*.js'  // My files
                    ],
                dest: 'public/build/prod.js',
            },
            css: {
                src: [
                    'dev/css/reset.css',
                    'dev/css/bootstrap.min.css',
                    'dev/css/style.css'
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
          }
        },
        react: {
          jsx: {
            files: [
              {
                expand: true,
                cwd: 'dev/jsx',
                src: [ '**/*' ],
                dest: 'dev/js',
                ext: '.js'
              }
            ]
          }
        },
        uglify: {
          target: {
            options: {
              //sourceMap: true,
              //sourceMapName: 'public/build/sourcemap.map'
            },
            files: [{
              expand: true,
              cwd: 'dev/js',
              src: '*.js',
              dest: 'dev/js/min'
            }]
          }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['clean','concat','copy:jquerymap']);
    grunt.registerTask('reset', ['clean']);
    grunt.registerTask('prod', ['clean','react','uglify','concat','copy:jquerymap','copy:fonts']);
    grunt.registerTask('dev', ['clean','react','copy:devfiles']);

};
