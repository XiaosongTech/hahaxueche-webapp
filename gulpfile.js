
//=============================================
//               DEPENDENCIES
//=============================================

var del = require('del'),
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    bower = require('gulp-bower'),
    jshint = require('gulp-jshint'),
    ngdocs = require('gulp-ngdocs'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    karmaServer = require('karma').Server,
    runSequence = require('run-sequence');

//=============================================
//            DECLARE PATHS
//=============================================

var paths = {
    /**
     * The 'gulpfile' file is where our run tasks are hold.
     */
    gulpfile:   'gulpfile.js',
    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `public/`). These file paths are used in the configuration of
     * build tasks.
     *
     * - 'styles'       contains all project css styles
     * - 'images'       contains all project images
     * - 'fonts'        contains all project fonts
     * - 'scripts'      contains all project javascript except unit test files
     * - 'html'         contains main html files
     * - 'templates'    contains all project html templates
     */
    app: {
        basePath:       'public/',
        fonts:          ['public/**/*.{eot,svg,ttf,woff}', 'jspm_packages/**/*.{eot,svg,ttf,woff}'],
        styles:         ['public/styles/**/*.scss','public/modules/**/*.scss'],
        images:         ['public/**/*.{png,gif,jpg,jpeg}'],
        scripts:        ['public/app.js',
                         'public/app-controller.js',
                         'public/modules/**/*.js',
                         '!public/modules/**/bower_components/**/*.js',
                         '!public/**/*.spec.js'],
        html:           ['public/index.html'],
        templates:      ['templates/*.html', 'public/*.html']
    },
    /**
     * The 'tmp' folder is where our html templates are compiled to JavaScript during
     * the build process and then they are concatenating with all other js files and
     * copy to 'dist' folder.
     */
    tmp: {
        basePath:       '.tmp/',
        styles:         '.tmp/styles/',
        scripts:        '.tmp/scripts/'
    },
    /**
     * The 'dist' folder is where our app and its documentation
     * resides once they're completely built.
     *
     * - 'app'         application distribution source code
     * - 'docs'         application documentation
     */
    build: {
        dist:           'dist/',
        docs:           'docs/'
    }
};

//=============================================
//             TASKS
//=============================================

gulp.task('watch:scripts', function(){
    gulp.watch(paths.app.scripts, ['jshint', 'docs']);
});

gulp.task('watch:styles', function(){
    gulp.watch(paths.app.styles, ['sass']);
});

gulp.task('sass', function(cb){
    return gulp.src(paths.app.styles)
        .pipe(sass({
          includePaths: ['./public/bower_components/',  './public/modules/*/bower_components/']
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.app.basePath + 'styles'));
});

gulp.task('jshint', function(cb){
    return gulp.src(paths.app.scripts)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('docs', function(cb){
    return gulp.src(paths.app.scripts)
        .pipe(ngdocs.process({
            html5Mode: false,
            startPage: '/api'
        }))
        .pipe(gulp.dest(paths.build.docs));
});

// See https://github.com/karma-runner/gulp-karma
gulp.task('test', function (cb) {
    var karma = new karmaServer({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    });
    karma.start();
});

// Clean dist
gulp.task('clean:dist', function (cb) {
    del.sync(['./dist']);
    cb();
});

// Update runtime deps
gulp.task('deps', function(cb){
    // main bower.json
    bower();
    return gulp.src(paths.app.basePath, {read:false})
               .pipe(shell(['jspm install']));
});

// Depencency cache for SPDY
gulp.task('depcache', function(){
    return gulp.src(paths.app.basePath, {read:false})
        .pipe(shell([
            'jspm depcache main'
        ]));
});

// Create a minified bundle.js (and map) and inject it into config.js
// so System knows which modules should be loaded from it, and copy these
// files into dist/app.
// NOTE: ideally you'd operate directly on the files in dist/app *after* the
// 'files' task, but JSPM currently (6/2015) doesn't have a way to do this,
// hence the need to do all this in public/ and copy the result to dist/app
// and then unbundle the stuff in public/.
gulp.task('bundle', ['depcache'], function () {
    return gulp.src(paths.app.basePath)
        .pipe(shell([
            'jspm bundle main ' + paths.app.basePath + 'bundle.js --inject --minify' +
            '&& mv ' + paths.app.basePath + 'bundle* ' + paths.build.dist + '/public' +
            '&& cp ' + paths.app.basePath + 'config.js ' + paths.build.dist + '/public' +
            '&& jspm unbundle'
        ]));
});

// Copy production files from public/ to dist/app/
gulp.task('files', function () {
    gulp.src([
        // copy public/
        '' + paths.app.basePath + '**/*',
        // except tests and stylesheets from modules/
        '!' + paths.app.basePath + 'test/',
        '!' + paths.app.basePath + 'test/**',
        '!' + paths.app.basePath + 'modules/**/test/',
        '!' + paths.app.basePath + 'modules/**/test/**',
        '!' + paths.app.basePath + 'modules/**/styles/',
        '!' + paths.app.basePath + 'modules/**/styles/**'
    ])
    .pipe(gulp.dest('./dist/public'));

    // Copy node/express stuff
    gulp.src(['./app.js', './package.json'])
        .pipe(gulp.dest('./dist')) ;

});

// Server for convenience. You can accomplish the same thing by
// typing 'nodemon' (assuming you have it installed globally)
gulp.task('server', function () {
  nodemon({
    script: 'app.js',
    watch: 'public'
  });
});

//=============================================
//             PUBLIC TASKS
//=============================================

// Create a distribution:
// 1) Run unit tests and create dist/coverage/
// 2) Compile any Sass to CSS (if it hasn't already been done)
// 3) Create a documentation website at /dist/docs/
// 4) Create a distribution version of the application
// 4) Add a bundled dependency file to the distribution version of the application
gulp.task('dist', function(){
  runSequence('clean:dist', 'deps', 'sass', 'docs', 'files', 'bundle');
});

// Start a web server, load the app at public/, watch scripts and styles
// for updates. Use this to on the app itself.
gulp.task('default', ['sass', 'server', 'watch:scripts', 'watch:styles']);
