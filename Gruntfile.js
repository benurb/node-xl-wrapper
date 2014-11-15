module.exports = function(grunt) {
    // Load tasks
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
        }
    });

    // Tasks
    grunt.registerTask('test', 'mochaTest');
};
