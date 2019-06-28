var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlhint = require("gulp-htmlhint");
var watch = require('gulp-watch');
var compass = require('gulp-compass');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var sourcemaps = require('gulp-sourcemaps');

var image = require('gulp-image');
var imageResize = require('gulp-image-resize');

var config = require('./config.json');
var gulpif = require('gulp-if');

var is_production = function () {
	return (config.environment == 'production') ? true : false;
}

// environment variables
process.env.NODE_ENV = config.environment;

gulp.task('bundle-js', function () {
	console.log('build js');
	return browserify({
		extensions: ['.js', '.jsx'],
		entries: 'src/js/index.js',
		insertGlobals: true,
		debug: (is_production === false),
		souremapComment: true,
		standalone: 'interact',
		transform: [['babelify', {}]]

	})
		.transform(babelify.configure({
			presets: ['env'],
			ignore: [/(bower_components)|(node_modules)/]
		}))
		.bundle()
		.on("error", function (err) { console.log("Error : " + err.message); })
		.pipe(source('build.js'))
		.pipe(buffer())
		.pipe(gulpif(is_production, uglify()))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('assets/js'));
});

gulp.task('build-img', function () {
	return gulp.src([
		'src/images/**/*',
		'!src/images/edited',
		'!src/images/favicon',
		'!src/images/svg',
		'!src/images/qi-sprite',
		'!src/images/edited/*',
		'!src/images/favicon/*',
		'!src/images/svg/*',
		'!src/images/qi-sprite/**/*'
	])
		.pipe(gulpif(is_production, image()))
		.pipe(gulp.dest('assets/images/'));
});

// teste de código com o jshint
gulp.task('jshint', function () {
	// obs.: return para assíncrona
	return gulp.src(['src/js/**/*', '!src/js/libs', '!src/js/libs/*', '!src/js/libs/**/*', '!src/js/injectScripts.js'])
		.pipe(jshint({ esversion: 6, "asi": true }))
		.pipe(jshint.reporter('default', { verbose: true }));
});

// html
gulp.task('htmlmin', function () {
	return gulp.src(['src/views/*.html', 'src/views/map.xml'])
		// .pipe(gulpif(is_production == false, gulp.series('htmlhint')))
		// .pipe(removeEmptyLines({ removeSpaces: true }))
		.pipe(htmlmin({ removeComments: true, collapseInlineTagWhitespace: true }))
		.pipe(gulp.dest('assets/views'));
});

gulp.task('htmlhint', function () {
	return gulp.src("views/*.html")
		.pipe(htmlhint({ "doctype-first": false }))
		.pipe(htmlhint.reporter());
});

gulp.task('build-sass', function () {
	return gulp.src(['src/scss/**/*.scss'])
		.pipe(compass({
			config_file: 'config.rb',
			css: 'assets/stylesheets',
			sass: 'src/scss',
			debug: true
		}))
		.pipe(gulp.dest('assets/stylesheets'));
});

gulp.task('watch-js', function () {
	return watch(['src/js/**/*'], gulp.parallel('jshint', 'bundle-js'));
});

gulp.task('watch-img', function () {
	return watch([
		'src/images/**/*',
		'!src/images/edited',
		'!src/images/favicon',
		'!src/images/svg',
		'!src/images/qi-sprite',
		'!src/images/edited/*',
		'!src/images/favicon/*',
		'!src/images/svg/*',
		'!src/images/qi-sprite/**/*'
	], gulp.parallel('build-img', 'build-sass'));
});

gulp.task('watch-html', function () {
	return watch(['src/views/**/*.html'], gulp.parallel('htmlhint', 'htmlmin'));
});

gulp.task('watch-sass', function () {
	return watch(['src/scss/**/*.scss',
		'src/images/**/*',
		'!src/images/edited',
		'!src/images/favicon',
		'!src/images/svg',
		'!src/images/qi-sprite',
		'!src/images/edited/*',
		'!src/images/favicon/*',
		'!src/images/svg/*',
		'!src/images/qi-sprite/**/*'], gulp.parallel('build-sass'));
});

gulp.task('build-js', gulp.parallel('jshint', 'bundle-js'));
gulp.task('build-html', gulp.parallel('htmlhint', 'htmlmin'));
gulp.task('build', gulp.parallel('build-js', 'build-sass', 'build-img', 'build-html'));
gulp.task('default', gulp.parallel('build', 'watch-js', 'watch-html', 'watch-sass', 'watch-img'));


/*

#### EXTRA ####

// limpa pasta - deleta arquivos
gulp.task('clean-css', function () {
	return gulp.src(['assets/stylesheets/*', 'assets/views/*', 'assets/images/**\/*'])
		.pipe(clean());
});

gulp.task('image-resize', function () {
	return gulp.src('src/images/instrutors/**\/*')
	.pipe(imageResize({
		width: 174,
		height: 174,
		crop: true,
		upscale: true
	}))
	.pipe(image())
	.pipe(gulp.dest('assets/images/'));
});
*/