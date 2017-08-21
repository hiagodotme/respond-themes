var gulp = require('gulp');
var prettify = require('gulp-prettify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
const zip = require('gulp-zip');

// all themes
var themes = ['energy', 'persistence', 'perspective', 'executive', 'serene', 'sidebar', 'stark', 'highrise', 'market', 'aspire', 'base']

// list themes
var bootstrap = ['energy', 'persistence', 'perspective', 'executive', 'serene', 'sidebar', 'stark', 'highrise', 'market', 'aspire'];

// five-pack #1
var five1 = ['energy', 'persistence', 'perspective', 'executive', 'serene'];

// five-pack #2
var five2 = ['stark', 'highrise', 'market', 'sidebar', 'aspire'];

// foundation framework overrides
var foundation = [];

// mdl framework overrides
var mdl = [];

var release = '6.2-final';

// copy shared/base files to all themes
gulp.task('bootstrap', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<bootstrap.length; x++) {

    // copy shared directory to themes
    gulp.src(['shared/bootstrap/**/*']).pipe(gulp.dest(bootstrap[x]));

  }

  done();

});

// copy shared/foundation files to all themes
gulp.task('foundation', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<foundation.length; x++) {

    // copy shared directory to themes
    gulp.src(['shared/foundation/**/*']).pipe(gulp.dest(foundation[x]));

  }

  done();

});

// copy shared/mdl files to all themes
gulp.task('mdl', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<mdl.length; x++) {

    // copy shared directory to themes
    gulp.src(['shared/mdl/**/*']).pipe(gulp.dest(mdl[x]));

  }

  done();

});

// cleanup files
gulp.task('cleanup', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<themes.length; x++) {

    console.log(themes[x]);

    // concat css
    gulp.src([themes[x] + '/css/libs.min.css', themes[x] + '/css/plugins.css', themes[x] + '/css/site.css'])
      .pipe(concat('site.all.css'))
      .pipe(minifyCss())
      .pipe(rename('site.min.css'))
      .pipe(gulp.dest(themes[x] + '/css'));


    // concat js
    gulp.src([themes[x] + '/js/libs.min.js', themes[x] + '/js/plugins.js',  themes[x] + '/js/site.js'])
      .pipe(concat('site.all.js'))
      .pipe(gulp.dest(themes[x] + '/js'));

  }

  done();

});

// package the theme for distribution
gulp.task('package', function(done) {

  var x;

  // package individual themes
  for(x=0; x<themes.length; x++) {

    gulp.src(themes[x] + '/**/*', {base: './', follow: true})
  		.pipe(zip(themes[x] + '-' + release + '.zip'))
  		.pipe(gulp.dest('./dist/' + release));

  }

  done();

});

gulp.task('package-all', function(done) {

  var x;

  // package all themes
  var bundlePaths = [];

  // walk through the themes
  for(x=0; x<themes.length; x++) {
    bundlePaths.push('./' + themes[x] + '/**/*');
  }

  // setup package
  return gulp.src(bundlePaths, {base: './', follow: true})
		.pipe(zip('all-themes-' + release + '.zip'))
		.pipe(gulp.dest('./dist/' + release));

});

gulp.task('package-five1', function() {

  var x;

  // package all themes
  var bundlePaths = [];

  // walk through the themes
  for(x=0; x<five1.length; x++) {
    bundlePaths.push('./' + five1[x] + '/**/*');
  }

  // setup package
  return gulp.src(bundlePaths, {base: './', follow: true})
		.pipe(zip('five-pack-1-' + release + '.zip'))
		.pipe(gulp.dest('./dist/' + release));

});

gulp.task('package-five2', function() {

  var x;

  // package all themes
  var bundlePaths = [];

  // walk through the themes
  for(x=0; x<five2.length; x++) {
    bundlePaths.push('./' + five2[x] + '/**/*');
  }

  // setup package
  return gulp.src(bundlePaths, {base: './', follow: true})
		.pipe(zip('five-pack-2-' + release + '.zip'))
		.pipe(gulp.dest('./dist/' + release));

});

// package the theme for distribution
gulp.task('screenshots', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<themes.length; x++) {

    gulp.src(themes[x] + '/screenshot.png', {base: './'})
  		.pipe(rename(themes[x] + '.png'))
      .pipe(gulp.dest('./dist/' + release + '/screenshots/'));
  }

  done();

});


// prettify html (as needed)
gulp.task('prettify', function() {

  return gulp.src('temp/**/*.html')
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest(themes[x]));

});

// run tasks
gulp.task('default', ['bootstrap', 'foundation', 'mdl', 'cleanup', 'package', 'package-all', 'package-five1', 'package-five2', 'screenshots']);