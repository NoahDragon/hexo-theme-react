'use strict';

/*
 Including Gulp and plugins
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var pug = require('gulp-pug');
var beautify = require('gulp-jsbeautifier');
var nano = require('gulp-cssnano');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

/*
 Directory variables
 */
var sassSrcDir = './source/sass/';
var pugSrcDir = './layout/';
var assetsDir = './source/assets/';
var compiledStylesDir = assetsDir + 'css/';
var libsDir = './source/libs/';

/*
 Compiling sass, using sourcemaps
 */
gulp.task('sass', function () {
    gulp.src([
        sassSrcDir + 'react.scss',
        sassSrcDir + 'linea/linea.scss'
    ])
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(compiledStylesDir));
});

/*
 Creating a styles build file consisted of all files specified in gulp.src
 */
gulp.task('build:css', function () {
    return gulp.src([
        libsDir + 'materialize/materialize.min.css',
        libsDir + 'owl/owl.carousel.css',
        compiledStylesDir + 'linea.css',
        compiledStylesDir + 'react.css'
    ])
        .pipe(concat('build.css'))
        .pipe(postcss([mqpacker]))
        .pipe(nano({
            safe: true
        }))
        .pipe(rename('build.min.css'))
        .pipe(gulp.dest(assetsDir + 'build'));
});

/*
 Building compile pug, beautifying the output
 */
gulp.task('pug', function () {
    gulp.src(
        [
            pugSrcDir + 'ring-green.pug',
            pugSrcDir + 'ring-blue.pug',
            pugSrcDir + 'tunnel.pug',
            pugSrcDir + 'waves-light-blue.pug',
            pugSrcDir + 'waves-deep-purple.pug',
            pugSrcDir + 'fuzzy-hue.pug',
            pugSrcDir + 'fuzzy-saturation.pug',
            pugSrcDir + 'combustion-purple.pug',
            pugSrcDir + 'combustion-yellow.pug'
        ]
    )
        .pipe(pug())
        .pipe(beautify({
            html: {
                indent_char: ' ',
                indent_size: 4,
                selector_separator_newline: true,
                preserveNewlines: false,
                indent_inner_html: true,
                unformatted: ['span'],
                extra_liners: ['section', 'footer'],
                wrap_line_length: 0
            }
        }))
        .pipe(gulp.dest('./'));
});

/*
 Watching src files changes and running appropriate commands to compile them
 */
gulp.task('watch', function () {
    gulp.watch([
        sassSrcDir + '*.scss',
        sassSrcDir + 'skins/*.scss'
    ], ['sass']);
    gulp.watch([
        pugSrcDir + '*.pug',
        pugSrcDir + '**/*.pug'
    ], ['pug']);
});

/*
 Creating a JavaScript build consisted of all the files specified in gulp.src
 */
gulp.task('build:scripts', function () {
    return gulp.src([
        libsDir + 'jquery-2.1.1.min.js',
        libsDir + 'materialize/materialize.min.js',
        libsDir + 'masonry/masonry.pkgd.min.js',
        libsDir + 'owl/owl.carousel.min.js',
        libsDir + 'ajaxchimp/jquery.ajaxchimp.min.js',
        assetsDir + 'config/config.js',
        assetsDir + 'js/app.js'
    ])
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(assetsDir + 'build'));
});

/*
 Creating minified versions of skin specific scripts, placed in assets/js/skins/min/ dir
 */
gulp.task('minify-skin-scripts', function () {
    return gulp.src(assetsDir + 'js/skins/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(assetsDir + 'js/skins/min'));
});

/*
 Optimising the images
 */
gulp.task('imagemin', function () {
    return gulp.src('./assets/images/**/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./assets/images'));
});

/*
 Building a zip for Themeforest. Feel free to remove this
 */
var zip = require('gulp-zip');
var replace = require('gulp-replace');
var tfDir = 'themeforest/';

gulp.task('themeforest:build', function () {
    return gulp.src([
        '**',
        '!bower_components/**',
        '!bower_components',
        '!node_modules/**',
        '!node_modules',
        '!' + tfDir + '**',
        '!' + tfDir,
        '!mailer/config.php'
    ])
        .pipe(gulp.dest(tfDir + 'build'));
});

gulp.task('themeforest:pixelate', function () {
    return gulp.src(tfDir + 'pixelated-images/**/*')
        .pipe(gulp.dest(tfDir + '/build/assets/images'));
});

gulp.task('themeforest:mailconfig', function () {
    return gulp.src(['mailer/config.php'])
        .pipe(replace(/(\$my_email = )'(.+)';/, '$1\'my@email.com\';'))
        .pipe(replace(/('username' => )'(.+)'/, '$1\'user@gmail.com\''))
        .pipe(replace(/('password' => )'(.+)'/, '$1\'password12345\''))
        .pipe(gulp.dest(tfDir + 'build/mailer'));
});

gulp.task('themeforest', ['themeforest:build'], function () {
    gulp.start(['themeforest:pixelate', 'themeforest:mailconfig']);
});

gulp.task('themeforest:zip', function () {
    return gulp.src(tfDir + '/build/**/*')
        .pipe(zip('react.build.zip'))
        .pipe(rename('react.build.' + Date.now() + '.zip'))
        .pipe(gulp.dest(tfDir));
});
