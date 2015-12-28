var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var del          = require('del');
var less         = require('gulp-less');
var runSequence  = require('run-sequence');
var open         = require('gulp-open');
var livereload   = require('gulp-livereload');

gulp.task('reload-extension', function() {
  gulp.src(__filename)
  .pipe(open({ uri: 'http://reload.extensions' }));
});

gulp.task('reload-tab', function() {
  livereload.changed('js/contentScript.js');
});

gulp.task('style', function() {
  return gulp.src('less/*.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(livereload());
});

gulp.task('clean', function(cb) {
  return del(['./dist'], cb);
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('less/**/*.less', ['reload-extension', 'style', 'reload-tab']);
  //gulp.watch('js/contentScript.js', ['reload-extension']);
});

gulp.task('build', ['clean', 'less'], function() {
  gulp.src('./assets/**/*')
    .pipe(gulp.dest('build/assets'));
  gulp.src('./extension/**/*')
    .pipe(gulp.dest('build/extension'));
  gulp.src(['icon.png', 'config.json', 'manifest.json', 'package.json', 'license.txt'])
    .pipe(gulp.dest('build/'));
});

gulp.task('default', function() {
  return runSequence('clean', 'style', 'watch');
});