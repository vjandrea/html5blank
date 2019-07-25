"use strict"

const { series, src, dest } = require( 'gulp' );

var plugins = require( 'gulp-load-plugins' )();

/** source files for uglify **/
var js = [
	'src/js/lib/modernizr.js',
	'src/js/lib/conditionizr-4.3.0.min.js',
	'node_modules/jquery/dist/jquery.js',
	'src/js/scripts.js'
];

var css_dev = [
	'src/css/banner.css',
	'src/css/style.css'
];

var css_prod = [
	'src/css/banner.css',
	'node_modules/normalize.css/normalize.css',
	'src/css/style.css'
];

var clean_target = [
	'.tmp',
	'dist'
];


/** Clean **/
function clean(callback) {
	// console.log( 'clean' );
	var del = require( 'del' );
	return del(clean_target);

	callback();
}


/** Copy **/
function copy(callback) {
	// console.log( 'copy' );
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
		
	callback();
}


/** SASS **/
function sass(callback) {
	// console.log( 'sass' );
	callback();
}


/** styles **/
function styles(callback) {
	// console.log( 'styles' );
	callback();
}


/** JSHint **/
function jshint(callback) {
	// console.log( 'jshint' );
	callback();
}


/** Template **/
function template(callback) {
	// console.log( 'template' );
	callback();
}


/** Modernizr **/
function modernizr(callback) {
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
function uglify(callback) {
	// console.log('uglify');
	callback();
}


/** jQuery **/
function jquery(callback) {
	// console.log('jquery');
	callback();
}


/** Normalize **/
function normalize(callback) {
	// console.log('normalize');
	callback();
}


/** envProduction **/
function envProduction(callback) {
	// console.log('envProduction');
	callback();
}


/** watch **/
function watch(callback) {
	// console.log('watch');
	series(template, styles);
	callback();
}


/** Build **/
function build(callback){
	// console.log('buildTask');
	callback();
}


exports.clean = clean;
exports.copy = copy;
exports.sass = sass;
exports.styles = series( sass );
exports.jshint = jshint;
exports.template = template;
exports.modernizr = modernizr;
exports.uglify = uglify;
exports.jquery = jquery;
exports.normalize = normalize;
exports.envProduction = envProduction;
exports.watch = series( template, exports.styles, jshint, modernizr, jquery, normalize );
exports.build = series( envProduction, clean, template, exports.styles, modernizr, jshint, copy, uglify );
exports.default = series( exports.watch );

/*
[07:31:29] Tasks for ~/dev/GitHub/html5blank-vjandrea/gulpfile.old
[07:31:29] ├── clean
[07:31:29] ├── copy
[07:31:29] ├── sass
[07:31:29] ├─┬ styles
[07:31:29] │ └─┬ <series>
[07:31:29] │   └── sass
[07:31:29] ├── jshint
[07:31:29] ├── template
[07:31:29] ├── modernizr
[07:31:29] ├── uglify
[07:31:29] ├── jquery
[07:31:29] ├── normalize
[07:31:29] ├── envProduction
[07:31:29] ├─┬ watch
[07:31:29] │ └─┬ <series>
[07:31:29] │   ├── template
[07:31:29] │   ├─┬ styles
[07:31:29] │   │ └─┬ <series>
[07:31:29] │   │   └── sass
[07:31:29] │   ├── jshint
[07:31:29] │   ├── modernizr
[07:31:29] │   ├── jquery
[07:31:29] │   └── normalize
[07:31:29] ├─┬ build
[07:31:29] │ └─┬ <series>
[07:31:29] │   ├── envProduction
[07:31:29] │   ├── clean
[07:31:29] │   ├── template
[07:31:29] │   ├─┬ styles
[07:31:29] │   │ └─┬ <series>
[07:31:29] │   │   └── sass
[07:31:29] │   ├── modernizr
[07:31:29] │   ├── jshint
[07:31:29] │   ├── copy
[07:31:29] │   └── uglify
[07:31:29] └─┬ default
[07:31:29]   └─┬ <series>
[07:31:29]     └─┬ watch
[07:31:29]       └─┬ <series>
[07:31:29]         ├── template
[07:31:29]         ├─┬ styles
[07:31:29]         │ └─┬ <series>
[07:31:29]         │   └── sass
[07:31:29]         ├── jshint
[07:31:29]         ├── modernizr
[07:31:29]         ├── jquery
[07:31:29]         └── normalize

*/