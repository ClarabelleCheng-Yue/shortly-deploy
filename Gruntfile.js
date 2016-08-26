module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        sourceMap: true
      },
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js',
      },
    },
    
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        sourceMapIn: 'public/dist/<%= pkg.name %>.js.map'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/dist/<%= pkg.name %>.min.js'
      },
      target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['client/**/*.js']
        }
      }
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

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    eslint: {
      options: {
        quiet: false
      },
      target: [
        // Add list of files to lint here
        'public/client/**/*.js'
      ]
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    gitadd: {
      task: {
        options: {
          force: true
        },
        files: {
          src: ['.']
        }
      }
    },

    gitcommit: {
      yourTarget: {
        options: {
        // Target-specific options go here.
          description: true
        },
        files: {
          // Specify the files you want to commit
          
        }
      }
    },

    gitpush: {
      yourTarget: {
        options: {
           // Target-specific options go here.
          remote: 'live',
          branch: 'master'
        }
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
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', ['eslint', 'mochaTest']);

  grunt.registerTask('build', [ 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['gitpush']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['test', 'build', 'upload'
    // add your deploy tasks here
  ]);
};