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

var imagemin = require('gulp-imagemin');

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

/**
 * CLEAR FILES PUBLIC
 * Limpar arquivos gerados pela tarefas buiding do gulp
 */
gulp.task('build-del', function (call) {
	del.sync(['assets/index.html', 'assets/.htaccess', 'assets/files/**', 'assets/fonts/**', 'assets/images/**', 'assets/js/**', 'assets/stylesheets/**', 'assets/views/**']);
	return call();
});

/**
 * Função para copiar hub biblioteca cross-storage
 * Neceária para realizar integração dos  sistemas
 */
gulp.task('copy-hub', function (call) {

	if (is_production()) {
		return gulp.src('node_modules/cross-storage/dist/hub*.js')
			.pipe(gulp.dest('assets/js/'));
	}

	return call();
});

/**
 * Gerar arquivos INDEX Principal 
 * 	- Em ambiente development verifica e copia arquivo
 * 	- Em ambiente production replace e minifica arquivos
 * 
 * 	Origem ./src/index.html
 *  destino ./assets/index.html
 */
gulp.task('build-index', function () {
	var data = new Date();
	var script = '<!--[if IE 9]><script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script><script src="//cdn.rawgit.com/jpillora/xdomain/0.7.4/dist/xdomain.min.js"></script><![endif]--><script defer src="https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.find,String.prototype.repeat,modernizr:es5array|always"></script><script defer src="https://d335luupugsy2.cloudfront.net/js/integration/stable/rd-js-integration.min.js"></script><script type="text/javascript" async src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/94236ac1-9fff-43fd-a2f0-329a83ce47a7-loader.js"></script>';
	var html = '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TZLSCG7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><script type="text/javascript" src="https://a.opmnstr.com/app/js/api.min.js" data-account="24" data-user="28741" async></script>';

	if (is_production()) {
		return gulp.src('src/index.html')
			.pipe(replace(/(<!--BEGIN:SCRPIT-->)(\n+\s+|\s+\n+|\n+|\s+)?(.+)?(\n+\s+|\s+\n+|\n+|\s+)?(<!--END:SCRPIT-->)/gi, '$1\n\t ' + script + ' \n\t$5'))
			.pipe(replace(/(<!--BEGIN:HTML-->)(\n+\s+|\s+\n+|\n+|\s+)?(.+)?(\n+\s+|\s+\n+|\n+|\s+)?(<!--END:HTML-->)/gi, '$1\n\t ' + html + ' \n\t$5'))
			.pipe(replace(/(<!--BEGIN:SCRPIT-INJECT-->)(\n+\s+|\s+\n+|\n+|\s+)?(.+)?(\n+\s+|\s+\n+|\n+|\s+)?(<!--END:SCRPIT-INJECT-->)/gi, '$1\n\t<script defer async src="js/injectScripts.js?vs=' + data.toISOString() + '"></script>\n\t$5'))
			.pipe(replace(/version-qi-build=(.+)">/gi, 'version-qi-build=' + data.toISOString() + '">'))
			.pipe(htmlmin({ collapseWhitespace: true }))
			.pipe(gulp.dest('assets/'));
	} else {
		return gulp.src('src/index.html')
			.pipe(htmlhint({ "doctype-first": false }))
			.pipe(htmlhint.reporter())
			.pipe(replace(/version-qi-build=(.+)">/gi, 'version-qi-build=' + data.toISOString() + '">'))
			.pipe(gulp.dest('assets/'));
	}
});

/**
 * Compilar arquivos JS
 * 	- Em ambiente development compila e copia arquivos
 * 	- Em ambiente production compila, copia e minifica arquivos
 * 
 * 	Origem ./src/js/index.js
 *  destino ./assets/js/build.js
 */
gulp.task('bundle-js', function () {
	var presets = (is_production()) ? ['@babel/preset-env'] : ['env'];

	return browserify({
		extensions: ['.js', '.jsx'],
		entries: 'src/js/index.js',
		insertGlobals: true,
		debug: (is_production() == false),
		souremapComment: true,
		standalone: 'interact',
		transform: [['babelify', { global: true }]]

	})
		.transform(babelify.configure({
			presets: [
				[
					'@babel/preset-env',
					{
						"targets": {
							"browsers": [
								"last 2 versions"
							]
						}
					}
				]
			],
			ignore: [/(bower_components)|(node_modules)/]
		}))
		.bundle()
		.on("error", function (err) { console.log("Error : " + err.message); })
		.pipe(source('build.js'))
		.pipe(buffer())
		.pipe(gulpif(is_production(), uglify()))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('assets/js'));
});

/**
 * Copiar arquivos IMAGENS
 * 	- Em ambiente development copia arquivos
 * 	- Em ambiente production compila, reduz os arquivos
 * 
 * 	Origem ./src/images
 *  destino ./assets/images
 */
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
		.pipe(gulpif(is_production(), imagemin({ verbose: true })))
		.pipe(gulp.dest('assets/images/'));
});

/**
 * Função para otimizar imagem gerada pelo compass - qi-sprite
 * 
 * 	Origem .assets/images/qi-sprite*.png
 *  Destino ./assets/images
 */
gulp.task('build-sprite', function () {
	return gulp.src('assets/images/qi-sprite*.png')
		.pipe(gulpif(is_production(), imagemin([imagemin.optipng({ optimizationLevel: 5 })], { verbose: true })))
		.pipe(gulp.dest('assets/images/'));
});

/**
 * Compilar arquivo Estilo
 * 	- Em ambiente development compila e debuga arquivos
 * 	- Em ambiente production compila e minifica os arquivos
 * 
 * 	Origem ./src/scss
 *  destino ./assets/stylesheets
 */
gulp.task('build-sass', function () {
	return gulp.src(['src/scss/**/*.scss'])
		.pipe(compass({
			config_file: 'config.rb',
			css: 'assets/stylesheets',
			sass: 'src/scss',
			debug: (is_production() == false)
		}))
		.pipe(gulp.dest('assets/stylesheets'));
});

/**
 * Copiar arquivo config .htaccess do apache
 * 	- Em ambiente development copia arquivo src/dev.htaccess e renomeia
 * 	- Em ambiente production copia arquivo src/prod.htaccess e renomeia
 * 
 * 	Origem ./src/dev.htaccess or src/prod.htaccess
 *  Destino ./assets/.htaccess
 */
gulp.task('build-htaccess', function () {
	var file = (is_production()) ? 'src/prod.htaccess' : 'src/dev.htaccess';

	return gulp.src(file)
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest('assets/'));
});

/**
 * Observar pasta dos arquivos Javascript
 */
gulp.task('watch-js', function () {
	return watch(['src/js/**/*'], gulp.parallel('jshint', 'bundle-js', 'build-index'));
});

/**
 * Observar pasta dos arquivos Imagens
 */
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
	], gulp.parallel('build-img', 'build-sass', 'build-sprite', 'build-index'));
});

/**
 * Observar pasta dos arquivos HTML
 */
gulp.task('watch-html', function () {
	return watch(['src/views/**/*.html', 'src/index.html'], gulp.series('build-html'));
});

/**
 * Observar pasta dos arquivos para downloads do site
 */
gulp.task('watch-files', function () {
	return watch(['src/files/**/*'], gulp.series('copy-files'));
});

/**
 * Observar pasta dos arquivos Favicon
 */
gulp.task('watch-favicon', function () {
	return watch(['src/images/favicon/**/*'], gulp.series('copy-favicon'));
});

/**
 * Observar pasta dos arquivos Fonts
 */
gulp.task('watch-fonts', function () {
	return watch(['src/fonts/**/*'], gulp.series('copy-fonts'));
});

/**
 * Observar file src/views/map.xml
 */
gulp.task('watch-map', function () {
	return watch(['src/views/map.xml'], gulp.series('copy-map'));
});


/**
 * Observar pasta dos arquivos de Estilos
 */
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
		'!src/images/qi-sprite/**/*'], gulp.parallel('build-sass', 'build-sprite', 'build-index'));
});

/**
 * Função para copiar arquivos 
 *  
 * 	Origem ./src/files
 *  Destino ./assets/files
 */
gulp.task('copy-files', function () {
	return gulp.src(['src/files/**/*'])
		.pipe(gulp.dest('assets/files/'));
});

/**
 * Função para copiar Fontes 
 *  
 * 	Origem ./src/fonts
 *  Destino ./assets/fonts
 */
gulp.task('copy-fonts', function () {
	return gulp.src(['src/fonts/**/*'])
		.pipe(gulp.dest('assets/fonts/'));
});

/**
 * Função para copiar File map.xml
 *  
 * 	Origem ./src/views/map.xml
 *  Destino ./assets/views
 */
gulp.task('copy-map', function () {
	return gulp.src(['src/views/map.xml'])
		.pipe(gulp.dest('assets/views/'));
});

/**
 * Função para copiar favicon 
 *  
 * 	Origem ./src/images/favicon
 *  Destino ./assets/images/favicon
 */
gulp.task('copy-favicon', function () {
	return gulp.src(['src/images/favicon/**/*'])
		.pipe(gulp.dest('assets/images/favicon/'));
});

/**
 * Função para copiar Javascript - Script será injectado no asses/index.html de production
 *  
 * 	Origem ./src/js
 *  Destino ./assets/js
 */
gulp.task('copy-script-inject', function () {
	return gulp.src(['src/js/injectScripts.js'])
		.pipe(gulpif(is_production(), uglify()))
		.pipe(gulp.dest('assets/js/'));
});

/**
 * Função para validar arquivos Javascript
 */
gulp.task('jshint', function () {
	return gulp.src(['src/js/**/*', '!src/js/libs', '!src/js/libs/*', '!src/js/libs/**/*', '!src/js/injectScripts.js'])
		.pipe(jshint({
			esversion: 6,
			asi: true,
			browser: true,
		}))
		.pipe(jshint.reporter('default', { verbose: true }));
});

/**
 * Função para minificar arquivos HTML
 * 
 * 	Origem ./src/views
 *  Destino ./assets/views
 */
gulp.task('htmlmin', function () {
	return gulp.src(['src/views/*.html'])
		.pipe(htmlmin({ removeComments: true, collapseInlineTagWhitespace: true }))
		.pipe(gulp.dest('assets/views/'));
});

/**
 * Função para validar arquivos HTML
 * 
 * 	Origem ./src/views
 *  Destino ./assets/views
 */
gulp.task('htmlhint', function () {
	return gulp.src('src/views/*.html')
		.pipe(htmlhint({ "doctype-first": false }))
		.pipe(htmlhint.reporter())
		.pipe(gulp.dest('assets/views/'));
});

/**
 * Gerar arquivos HTML 
 * 	- Em ambiente development verificar arquivos
 * 	- Em ambiente production minifica arquivos
 * 
 * 	Origem ./src/views
 *  destino ./assets/views
 */
function buildHtml() {
	if (is_production()) {
		return gulp.series('htmlmin');
	} else {
		return gulp.series('htmlhint');
	}
}

/**
 * Gerar arquivos Javascript 
 * 	- Em ambiente development verifica e compila arquivos
 * 	- Em ambiente production compila e minifica arquivos
 * 
 * 	Origem ./src/js
 *  destino ./assets/js
 */

function buildJS() {
	if (is_production()) {
		return gulp.series(['bundle-js']);
	} else {
		return gulp.parallel(['jshint', 'bundle-js']);
	}
}

gulp.task('build-js', buildJS());
gulp.task('build-html', buildHtml());
gulp.task('watch-files-all', gulp.parallel('watch-files', 'watch-fonts', 'watch-map', 'watch-favicon'));
gulp.task('build-files', gulp.parallel('copy-files', 'copy-fonts', 'copy-map', 'copy-favicon', 'copy-script-inject', 'copy-hub', 'build-htaccess'));
gulp.task('build', gulp.parallel('build-js', 'build-files', 'build-sass', 'build-img', 'build-sprite', 'build-html', 'build-index'));
gulp.task('default', gulp.parallel('build', 'watch-files-all', 'watch-js', 'watch-html', 'watch-sass', 'watch-img'));

/*
#### EXTRA ####

gulp.task('prod-img', function () {
	return gulp.src('src/images/upload/**//*')
.pipe(imagemin())
.pipe(gulp.dest('assets/images/upload/'));
});

gulp.task('instrutors-resize', function () {
return gulp.src('assets/images/upload/instrutor/**//*')
	.pipe(imageResize({
		width: 174,
		height: 174,
		crop: true,
		upscale: true
	}))
	.pipe(gulp.dest('assets/images/upload/instrutors/'));
});

gulp.task('build-img-prod', gulp.series('prod-img', 'instrutors-resize'));

#### EXTRA ####
*/