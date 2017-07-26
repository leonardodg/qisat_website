var gulp = require('gulp'),
	clean = require('gulp-clean'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	cleanCSS = require('gulp-clean-css'),
	rename = require("gulp-rename"),
	removeEmptyLines = require('gulp-remove-empty-lines');

var htmlhint = require("gulp-htmlhint"),
	watch = require('gulp-watch');


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
  return gulp.src(['views/*.html', 'views/map.xml'])
  			 .pipe(removeEmptyLines({ removeSpaces: true }))
		     .pipe(htmlmin({ collapseWhitespace: true, removeComments : true, collapseInlineTagWhitespace: true }))
		     .pipe(gulp.dest('assets/views'));
});

// styles
gulp.task('clean-css', function() {
  return gulp.src('stylesheets/*.css')
		     .pipe(cleanCSS())
		     .pipe(gulp.dest('public/css'));
});

// styles
gulp.task('htmlhint', function() {
		  return gulp.src("views/*.html")
				    .pipe(htmlhint({ "doctype-first": false}))
				    .pipe(htmlhint.reporter());
});


gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event 
    return watch('views/*.html', function () {
        return gulp.src(['views/*.html', 'views/map.xml'])
		  			 .pipe(removeEmptyLines({ removeSpaces: true }))
				     .pipe(htmlmin({ collapseWhitespace: true, removeComments : true, collapseInlineTagWhitespace: true }))
				     .pipe(gulp.dest('assets/views'));
    });
});



gulp.task('default', ['callback']);