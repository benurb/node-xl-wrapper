module.exports = function(grunt) {
    'use strict';

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Config
    grunt.initConfig({
        'mochaTest': {
            'test': {
                'options': {
                    'reporter': 'spec'
                },
                'src': ['test/**/*.test.js']
            }
        },
        'jshint': {
            'options': {
                'jshintrc': true
            },
            'all': {
                'src': ['lib/**/*.js', 'test/**/*.js', 'util/**/*.js', '*.js']
            }
        }
    });

    // Tasks
    grunt.registerTask('test', 'mochaTest');
};
