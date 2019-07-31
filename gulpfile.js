/* jshint node: true */
/* global plugins: true */
"use strict"

const { series, src, dest, watch } = require( 'gulp' );

/** @type {Object} Loader of Gulp plugins from `package.json` */
var plugins = require( 'gulp-load-plugins' )();

/** @type {Array} JS source files to concatenate and uglify */
var js = [
	/** Modernizr */
	'src/js/lib/modernizr.js',
	/** Conditionizr */
	'src/js/lib/conditionizr-4.3.0.min.js',
	/** jQuery */
	'node_modules/jquery/dist/jquery.js',
	/** jQuery */
	'src/js/scripts.js'
];
/** @type {Object of Array} CSS source files to concatenate and minify */
var css = {
	development: [
		/** The banner of `style.css` */
		'src/css/banner.css',
		/** Theme style */
		'src/css/style.css'
	], 
	production: [
		/** The banner of `style.css` */
		'src/css/banner.css',
		/** Normalize */
		'node_modules/normalize.css/normalize.css',
		/** Theme style */
		'src/css/style.css'
	]
};

var clean_target = [
	'.tmp',
	'dist'
];
/** @type {String} Used inside task for set the mode to 'development' or 'production' */
var env = (function() {
	/** @type {String} Default value of env */
	env = "development";
	/** Test if there was a different value from CLI to env
		Example: gulp styles --env=production
		When ES6 will be default. `find` will replace `some`  */	
	process.argv.some(function( key ) {
		var matches = key.match( /^\-{2}env\=([A-Za-z]+)$/ );

		if ( matches && matches.length === 2 ) {
			env = matches[1];
			return true;
		}
	});

	return env;

} ());


/** Clean **/
function clean() {

	var del = require( 'del' );
	return del(clean_target);
}


/** Copy **/
function copy() {

	return src([
		'src/*.{php,png,css}',
		'src/modules/*.php',
		'src/img/**/*.{jpg,png,svg,gif,webp,ico}',
		'src/fonts/*.{woff,woff2,ttf,otf,eot,svg}',
		'src/languages/*.{po,mo,pot}'
	], {
		base: 'src'
	})
		.pipe( dest( 'dist' ) );
}


/** CSS Preprocessors - SASS **/
function sass() {

	return src( 'src/css/sass/style.scss' )
		.pipe( plugins.sourcemaps.init() )
		.pipe( plugins.sass() )
		.pipe( plugins.sourcemaps.write( '.' ) )
		.on( 'error' , function( error ) {
			console.error( error );
		})
		.pipe( dest( 'src/css') );
}


/** Styles **/
function stylesTask() {
	console.log( '`styles` task run in `' + env + '` environment.' );

	var stream = src( css[env] )
		.pipe( plugins.concat( 'style.css' ) )
		.pipe( plugins.autoprefixer( 'last 2 version' ) );

	if ( env == 'production' ) {
		stream.pipe( plugins.csso() );
	}

	return stream.on( 'error', function( error ) {
		console.error( error );
	})
		.pipe( dest( 'src' ) );
}


/** JSHint **/
function jshint() {
	/** Test all `js` files excluding those in the `lib` folder */
	return src( 'src/js/{!(lib)/*.js,*.js}' )
		.pipe( plugins.jshint() )
		.pipe( plugins.jshint.reporter( 'jshint-stylish' ) )
		.pipe( plugins.jshint.reporter( 'fail' ));
}


/** Template **/
function template() {
	console.log( '`template` task run in `' + env + '` environment.' );

	var is_debug = (env === 'development' ? 'true' : 'false');

	return src( 'src/dev-templates/is-debug.php' )
		.pipe( plugins.template({ is_debug: is_debug }) )
		.pipe( dest( 'src/modules' ) );
}


/** Modernizr **/
function modernizr( callback ) {
	// console.log( 'modernizr' );
	var modernizr = require( 'modernizr' ),
		config = require( './node_modules/modernizr/lib/config-all' ),
		fs = require( 'fs' );

	modernizr.build( config, function( code ) {
		fs.writeFileSync( './src/js/lib/modernizr.js', code );
	});

	callback();
}


/** Uglify **/
function uglify() {
	
	return src( js )
		.pipe( plugins.concat( 'scripts.min.js' ) )
		.pipe( plugins.uglify() )
		.pipe( dest( 'dist/js' ) );
}


/** jQuery **/
function jquery() {
	
	return src( 'node_modules/jquery/dist/jquery.js' )
		.pipe( plugins.sourcemaps.init() )
		.pipe( plugins.sourcemaps.write() )
		.pipe( dest( 'src/js/lib' ) );
}


/** Normalize **/
function normalize() {
	
	return src( 'node_modules/normalize.css/normalize.css' )
		.pipe( dest( 'src/css/lib' ) );
}


/** `env` to 'production' */
function envProduction( callback ) {
	env = 'production';

	callback();
}


/** Livereload - Watchs **/
function watchTask() {
	console.log('watchTask');
	plugins.livereload.listen();

	/** Watch for livereoad */
	watch([
		'src/js/**/*.js',
		'src/*.php',
		'src/*.css'
	], { events: 'all' })
		.on( 'change', function( path ) {
			console.log( path );
		});

	/** Watch for autoprefix */
	watch([
		'src/css/*.css',
		'src/css/sass/**/*.scss'
	], stylesTask);

	/** Watch for JSHint */
	watch( 'src/js/{!(lib)/*.js,*.js}', jshint );
}


/** Build **/
function buildTask( callback ){
	callback(console.log('Build complete.'));
}


exports.clean = clean;
exports.copy = copy;
exports.sass = sass;
exports.styles = series( sass, stylesTask );
exports.jshint = jshint;
exports.template = template;
exports.modernizr = modernizr;
exports.uglify = uglify;
exports.jquery = jquery;
exports.normalize = normalize;
exports.envProduction = envProduction;
exports.watch = series( template, exports.styles, jshint, modernizr, jquery, normalize, watchTask );
exports.build = series( envProduction, clean, template, exports.styles, modernizr, jshint, copy, uglify, buildTask );
exports.default = series( exports.watch );
