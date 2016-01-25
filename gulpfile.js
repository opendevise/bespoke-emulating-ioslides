'use strict';

var pkg = require('./package.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('gulp-browserify'),
  chmod = require('gulp-chmod'),
  connect = require('gulp-connect'),
  csso = require('gulp-csso'),
  del = require('del'),
  exec = require('gulp-exec'),
  ghpages = require('gh-pages'),
  path = require('path'),
  plumber = require('gulp-plumber'), // plumber prevents pipe breaking caused by errors thrown by plugins
  rename = require('gulp-rename'),
  stylus = require('gulp-stylus'),
  through = require('through'),
  uglify = require('gulp-uglify'),
  isDist = process.argv.indexOf('deploy') >= 0;

gulp.task('js', ['clean:js'], function() {
  return gulp.src('src/scripts/main.js')
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ transform: ['debowerify'] }))
    //.pipe(isDist ? uglify() : through())
    .pipe(uglify())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function(done) {
  return gulp.src('')
    .pipe(isDist ? through() : plumber())
    // using stdin here would cause loss of context
    .pipe(exec('asciidoctor-bespoke -o - src/index.adoc', { pipeStdout: true }))
    .pipe(exec.reporter({ stdout: false }))
    .pipe(rename('index.html'))
    .pipe(chmod(644))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({
      // Allow CSS to be imported from node_modules and bower_components
      'include css': true,
      paths: ['./node_modules', './bower_components']
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('clean', function(done) {
  del('dist', done);
});

gulp.task('clean:html', function(done) {
  del('dist/index.html', done);
});

gulp.task('clean:js', function(done) {
  del('dist/build/build.js', done);
});

gulp.task('clean:css', function(done) {
  del('dist/build/build.css', done);
});

gulp.task('clean:images', function(done) {
  del('dist/images', done);
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
});

gulp.task('open', ['connect'], function (done) {
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.adoc', ['html']);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch([
    'src/scripts/**/*.js',
    'bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js']);
});

gulp.task('deploy', ['build'], function(done) {
  ghpages.publish(path.join(__dirname, 'dist'), { logger: gutil.log }, done);
});

gulp.task('build', ['js', 'html', 'css', 'images']);

gulp.task('serve', ['open', 'watch']);

gulp.task('default', ['build']);