var gulp = require('gulp'),
	clean = require('gulp-clean'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	cleanCSS = require('gulp-clean-css'),
	rename = require("gulp-rename");

// limpa pasta - deleta arquivos
gulp.task('clean', function() {
  return gulp.src('public/')
    		 .pipe(clean());
});


// teste de código com o jshint
gulp.task('jshint', function() {
  // obs.: return para assíncrona
  return gulp.src([ 'assets/js/config/*.js', 'assets/js/controllers/*.js', 'assets/js/directive/*.js', 'assets/js/routes/*.js', 'assets/js/services/*.js', 'assets/js/*.js' ])
		     .pipe(jshint({esversion:6, "asi": true }))
		     .pipe(jshint.reporter('default'));
});

// minificar JS
gulp.task('uglify', ['clean'], function() {
  return gulp.src([ 'assets/js/config/*.js', 'assets/js/controllers/*.js', 'assets/js/directive/*.js', 'assets/js/routes/*.js', 'assets/js/services/*.js', 'assets/js/*.js' ])
    		 .pipe(concat('scripts.js'))
    		 .pipe(uglify())
    		 .pipe(gulp.dest('public/js'));
});

// html
gulp.task('htmlmin', function() {
  return gulp.src(['page/*.html', 'views/*.html'])
		     .pipe(htmlmin({collapseWhitespace: true}))
		     .pipe(gulp.dest('public/views'));
});

// styles
gulp.task('clean-css', function() {
  return gulp.src('stylesheets/*.css')
		     .pipe(cleanCSS())
		     .pipe(gulp.dest('public/css'));
});


gulp.task('default', ['uglify', 'htmlmin']);