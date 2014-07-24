"use strict";

// gulp dependencies
var gulp = require('gulp');
var todo = require('gulp-todo');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

var VERSION = require('./package.json').version;
var DEP_FILES = './libJs/**/*.js';
var MAIN_FILE = './gameSrc/main.js';
var HTML_FILES = './gameSrc/html/*';
var GAME_FILES = './gameSrc/**/*.js';
var DESTINATION_FOLDER = './build/' + VERSION;
var DEPENDENCIES_FILE_NAME = 'deps.js';

var buildIt = function (debugMode) {

  // build dependencies
  gulp.src(DEP_FILES)
    .pipe(concat(DEPENDENCIES_FILE_NAME))
    .pipe(gulpif(!debugMode, uglify()))
    .pipe(gulp.dest(DESTINATION_FOLDER));

  // build modularized game file with source maps
  gulp.src(MAIN_FILE)
    .pipe(browserify({
      insertGlobals: true,
      builtins: {},
      debug: debugMode
    }))
    .pipe(gulpif(!debugMode, uglify()))
    .pipe(gulp.dest(DESTINATION_FOLDER));

  // copy html
  gulp.src(HTML_FILES)
    .pipe(gulp.dest(DESTINATION_FOLDER));
};

// ------------------------------------------------------------

gulp.task('clean', function () {
  return gulp.src(DESTINATION_FOLDER, {read: false})
    .pipe(clean());
});

gulp.task('docs', function () {
  // docco ../gameSrc/*js -t doc.jst -c doc.css -o ../docs
});

gulp.task('todo', function () {
  gulp.src(GAME_FILES)
    .pipe(todo())
    .pipe(gulp.dest(DESTINATION_FOLDER));
});

gulp.task('live', ['clean'], function () {
  buildIt(false);
});

gulp.task('dev', ['clean'], function () {
  buildIt(true);
});

gulp.task('watch', function () {
  gulp.watch(GAME_FILES, ['dev']);
});

gulp.task('default', [ 'dev', 'todo', 'docs']);
