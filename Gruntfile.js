var matchdep = require('matchdep');

function nameFor(path) {
  var result,  match;
  if (match = path.match(/^(?:lib|test|test\/tests)\/(.*?)(?:\.js)?$/)) {
    result = match[1];
  } else {
    result = path;
  }

  return path;
}
module.exports = function(grunt){

  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('tasks');

  grunt.initConfig({
    pkg: require('./package.json'),
    clean: {
      main: [ 'tmp/**/*' ]
    },
    transpile: {
      amd: {
        type: 'amd',
        moduleName: nameFor,
        files: [{
          expand: true,
          cwd: 'packages/',
          src: [ '**/lib/**/*.js', ],
          dest: 'tmp',
          ext: '.amd.js'
        }]
      }
    },
    concat: {
      amd: {
        src: [ 'tmp/**/*.amd.js' ],
        dest: 'tmp/ember-data.amd.js'
      },
      globals: {
        src: [ 'vendor/loader.js', 'tmp/**/*.amd.js' ],
        dest: 'tmp/ember-data.browser1.js'
      },
      tests: {
        src: [ 'packages/**/tests/**/*.js' ],
        dest: 'tmp/tests.js',
        options: {
          separator: ';\n',
          process: function(src, filepath){
            return "(function(){\n" + src + "\n})()";
          }
        }
      }
    },

    browser: {
      dist: {
        src: 'tmp/ember-data.browser1.js',
        dest: 'dist/ember-data.js'
      }
    }
  });

  grunt.registerTask('default', [ 'clean', 'transpile:amd', 'concat:globals', 'browser:dist', 'concat:tests' ]);
};
