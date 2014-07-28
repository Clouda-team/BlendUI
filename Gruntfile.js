module.exports = function (grunt) {

    
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        requirejs: {
            hybrid: {
                options: {
                    baseUrl: "./",
                    name : 'third_party/almond',
                    include : [
                      'src/hybrid/main'
                    ],
                    out: 'dist/BlendHybridUI-<%= pkg.version %>.js',
                    optimize : 'none',
                    wrap : true
                }
            },
            web: {
                options: {
                    baseUrl: "./",
                    name : 'third_party/almond',
                    include : [
                      'src/web/main'
                    ],
                    out: 'dist/BlendWebUI.js',
                    optimize : 'none',
                    wrap : true
                }
            }
        },
        jshint : {
            files: ['Gruntfile.js','src/web/**/*.js'],
            options: {
                '-W061' : true,
                '-W030' :true,
                globals: {
                    '$': true,
                    console: true,
                    module: true,
                    document: true
                }
            }
            
        },
        uglify : {
            hybrid: {
                src : 'dist/BlendHybridUI-<%= pkg.version %>.js',
                dest :'dist/BlendHybridUI-<%= pkg.version %>.min.js'
            },
            web: {
                src : ['dist/BlendWebUI.js'],
                dest : 'dist/BlendWebUI.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('hybrid', [
        'requirejs:hybrid',
        'uglify:hybrid'
    ]);
    grunt.registerTask('web', [
        'jshint',
        'requirejs:web',
        'uglify:web'
    ]);
};
