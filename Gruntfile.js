module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: { 
        separator: ';', 
        sourceMap: true
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        // sourceMapIn: 'public/dist/<%= pkg.name %>.js.map'
      },
      target: {
        files: { 
          'public/dist/<%= pkg.name %>.min.js': ['public/client/**/*.js']
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'client/**/*.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'release/css',
          src: ['*.css', '!*.min.css'],
          dest: 'release/css',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },

    gitpush: {
      yourTarget: {
        options: {
          remote: 'live',
          branch: 'master'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify'); //done
  grunt.loadNpmTasks('grunt-contrib-watch'); //don
  grunt.loadNpmTasks('grunt-contrib-concat'); //don
  grunt.loadNpmTasks('grunt-contrib-cssmin'); //don
  grunt.loadNpmTasks('grunt-eslint'); //don
  grunt.loadNpmTasks('grunt-mocha-test'); //don
  grunt.loadNpmTasks('grunt-shell'); 
  grunt.loadNpmTasks('grunt-nodemon'); //don
  grunt.loadNpmTasks('grunt-git'); //don

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [ 'concat', 'uglify'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
    if (!grunt.eslint.options.quiet) {
      //fail the linter, stop everything! 
      grunt.fail.warn('You failed the linter, make your code better and try again, buddy');
    }
  });

  grunt.registerTask('deploy', [ 'mochaTest', 'eslint', 'cssmin'
    // add your deploy tasks here
  ]);

  grunt.registerTask('prod', ['gitpush']);

};
// var prod = grunt.option('prod');
// grunt.registerTask('gitpush');
