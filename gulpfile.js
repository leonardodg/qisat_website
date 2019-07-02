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
var del = require('del');
var replace = require('gulp-replace');
var rename = require("gulp-rename");

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
		.pipe(removeEmptyLines({ removeSpaces: true }))
		.pipe(htmlmin({ removeComments: true, collapseInlineTagWhitespace: true }))
		.pipe(gulp.dest('assets/views'));
});

gulp.task('htmlhint', function () {
	return gulp.src("src/views/*.html")
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

gulp.task('watch-files', function () {
	return watch(['src/files/**/*', 'src/fonts/**/*', 'src/favicon/**/*'], gulp.parallel('copy-files', 'copy-fonts', 'copy-favicon'));
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

gulp.task('build-index', function (call) {
	var data = new Date();

	var script = '<!--[if IE 9]><script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script><script src="//cdn.rawgit.com/jpillora/xdomain/0.7.4/dist/xdomain.min.js"></script><![endif]--><script defer src="https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.find,String.prototype.repeat,modernizr:es5array|always"></script><script defer src="https://d335luupugsy2.cloudfront.net/js/integration/stable/rd-js-integration.min.js"></script><script type="text/javascript" async src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/94236ac1-9fff-43fd-a2f0-329a83ce47a7-loader.js"></script>';

	if (is_production() == false) {
		return gulp.src('src/index.html')
			.pipe(replace(/(<!--BEGIN:SCRPIT-->)(\n+\s+|\s+\n+|\n+|\s+)?(.+)?(\n+\s+|\s+\n+|\n+|\s+)?(<!--END:SCRPIT-->)/gi, '$1\n\t ' + script + ' \n\t$5'))
			.pipe(replace(/(<!--BEGIN:SCRPIT-INJECT-->)(\n+\s+|\s+\n+|\n+|\s+)?(.+)?(\n+\s+|\s+\n+|\n+|\s+)?(<!--END:SCRPIT-INJECT-->)/gi, '$1\n\t<script defer async src="js/injectScripts.js?vs=' + data.toISOString() + '"></script>\n\t$5'))
			.pipe(replace(/version=(.+)">/gi, 'version=' + data.toISOString() + '">'))
			.pipe(htmlmin({ collapseWhitespace: true }))
			.pipe(gulp.dest('assets/'));
	} else {
		return gulp.src('src/index.html')
			.pipe(htmlhint({ "doctype-first": false }))
			.pipe(htmlhint.reporter())
			.pipe(replace(/version=(.+)">/gi, 'version=' + data.toISOString() + '">'))
			.pipe(gulp.dest('assets/'));
	}
});

gulp.task('build-htaccess', function () {
	var file = (is_production() == true) ? 'src/prod.htaccess' : 'src/dev.htaccess';

	return gulp.src(file)
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest('assets/'));
});

gulp.task('build-del', function (call) {
	del.sync(['assets/files/**', 'assets/fonts/**', 'assets/images/**', 'assets/js/**', 'assets/stylesheets/**', 'assets/views/**']);
	return call();
});

gulp.task('copy-files', function () {
	return gulp.src(['src/files/**/*'])
		.pipe(gulp.dest('assets/files/'));
});

gulp.task('copy-fonts', function () {
	return gulp.src(['src/fonts/**/*'])
		.pipe(gulp.dest('assets/fonts/'));
});

gulp.task('copy-favicon', function () {
	return gulp.src(['src/images/favicon/**/*'])
		.pipe(gulp.dest('assets/images/favicon/'));
});

gulp.task('copy-script-inject', function () {
	return gulp.src(['src/js/injectScripts.js'])
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('build-files', gulp.parallel('copy-files', 'copy-fonts', 'copy-favicon', 'copy-script-inject'));
gulp.task('build-js', gulp.parallel('jshint', 'bundle-js'));
gulp.task('build-html', gulp.parallel('htmlhint', 'htmlmin'));
gulp.task('build', gulp.parallel('build-js', 'build-files', 'build-sass', 'build-img', 'build-html'));
gulp.task('default', gulp.parallel('build', 'watch-js', 'watch-files', 'watch-html', 'watch-sass', 'watch-img'));

/*
#### EXTRA ####
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
#### EXTRA ####
*/