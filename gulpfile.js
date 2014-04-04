var gulp       = require('gulp'),
    changed    = require('gulp-changed'),
    clean      = require('gulp-clean'),
    concat     = require('gulp-concat'),
    rename     = require('gulp-rename'),
    header     = require('gulp-header'),
    less       = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    csso       = require('gulp-csso'),
    template   = require('gulp-template-compile'),
    wrap       = require('gulp-wrap-amd'),
    jshint     = require('gulp-jshint'),
    uglify     = require('gulp-uglify'),
    stylish    = require('jshint-stylish'),
    http       = require('http'),
    connect    = require('connect');

// package config
var pkg = require('./package.json');

// banner
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

// paths
var dirs = {
    src: './src',
    dist: './dist',
    bower: './bower_components'
};

var paths = {
    scripts: [dirs.src + '/js/**/*.js'],
    templates: [dirs.src + '/js/templates/**/*.jst'],
    less: [dirs.src + '/less/bokland.less'],
    assets: [
        dirs.src + '/**/*.{png,jpg,ico}',
        dirs.src + '/**/*.json',
        dirs.src + '/**/*.html'
    ],

    cleanup: [
        dirs.dist + '/**/*.*',
        '!' + dirs.dist + '/vendors/**/*.*'
    ]
};


// cleanup task
gulp.task('cleanup', function() {
    gulp.src(paths.cleanup, {read: false})
        .pipe(clean({force: true}));
});

// lint task
gulp.task('lint', function() {
    gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// concatenate and minify js
gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(header(banner, {pkg : pkg}))
        // .pipe(uglify({
        //     preserveComments: 'some',
        //     outSourceMap: false
        // }))
        .pipe(gulp.dest(dirs.dist + '/js'));
});

// compile templates
gulp.task('templates', function() {
    gulp.src(paths.templates)
        .pipe(template({
            namespace: 'JST',
            name: function(file) {
                var matches = file.relative.match(/(.+)\.jst$/i);
                return matches ? matches[1] : file.relative;
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(wrap({
            deps: ['underscore'],       // dependency array
            params: ['_'],              // params for callback
            exports: 'window.JST',      // variable to return
            moduleRoot: 'src/js'        // include a module name in the define() call, relative to moduleRoot
        }))
        .pipe(header(banner, {pkg : pkg}))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(dirs.dist + '/js/templates'));
});

// compile less
gulp.task('less', function() {
    gulp.src(paths.less)
        .pipe(changed(dirs.dist + '/css', {extension: '.css'}))
        .pipe(less({
            path: [dirs.src + '/less']
        }))
        .pipe(autoprefix('last 2 versions', 'ie >= 9'))
        // .pipe(gulp.dest(dirs.dist + '/css'))
        // .pipe(rename(function(path) {
        //     path.basename += '.min';
        // }))
        // .pipe(csso())
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest(dirs.dist + '/css'));
});

// copy all static assets
gulp.task('assets', function() {
    gulp.src(paths.assets)
        .pipe(changed(dirs.dist))
        .pipe(gulp.dest(dirs.dist));
});

// source code tests
gulp.task('test', function() {
    // TODO
});

// watch files for changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['lint', 'scripts']);
    gulp.watch(paths.templates, ['templates']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.assets, ['assets']);
});


// static file server
gulp.task('server', function() {
    var port = 8888,
        server;

    server = connect()
        .use(connect.timeout())
        .use(connect.logger('dev'))
        .use(connect.static(__dirname + '/' + dirs.dist));

    http.createServer(server).listen(port, function() {
        console.log('Static server listening on port %d', port);
    });
});


// composite tasks
gulp.task('default', ['cleanup'], function() {
    gulp.start('lint', 'scripts', 'templates', 'less', 'assets', 'watch');
});

gulp.task('build', ['cleanup'], function() {
    gulp.start('lint', 'scripts', 'templates', 'less', 'assets');
});