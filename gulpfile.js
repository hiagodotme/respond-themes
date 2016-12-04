var gulp = require('gulp');
var prettify = require('gulp-prettify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
const zip = require('gulp-zip');

// all themes
var themes = ['energy', 'persistence', 'perspective', 'bootstrap', 'material', 'foundation', 'executive', 'serene', 'sidebar', 'blank']

// list themes
var bootstrap = ['energy', 'persistence', 'perspective', 'bootstrap', 'executive', 'serene', 'sidebar', 'blank'];

// five-pack #1
var five1 = ['energy', 'persistence', 'perspective', 'executive', 'serene'];

// foundation framework overrides
var foundation = ['foundation'];

// mdl framework overrides
var mdl = ['material'];

var release = 'rc2';

// copy shared/base files to all themes
gulp.task('bootstrap', function() {

  var x;

  // walk through the themes
  for(x=0; x<bootstrap.length; x++) {

    // copy shared directory to themes
    gulp.src(['shared/bootstrap/**/*']).pipe(gulp.dest(bootstrap[x]));

  }

  return;


});

// copy shared/foundation files to all themes
gulp.task('foundation', function() {

  var x;

  // walk through the themes
  for(x=0; x<foundation.length; x++) {

    // copy shared directory to themes
    gulp.src(['shared/foundation/**/*']).pipe(gulp.dest(foundation[x]));

  }

  return;


});

// copy shared/mdl files to all themes
gulp.task('mdl', function() {

  var x;

  // walk through the themes
  for(x=0; x<mdl.length; x++) {

    // copy shared directory to themes
    gulp.src(['shared/mdl/**/*']).pipe(gulp.dest(mdl[x]));

  }

  return;


});

// cleanup files
gulp.task('cleanup', function() {

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

  return;

});

// package the theme for distribution
gulp.task('package', function() {

  var x;

  // package individual themes
  for(x=0; x<themes.length; x++) {

    gulp.src(themes[x] + '/**/*', {base: './', follow: true})
  		.pipe(zip(themes[x] + '-' + release + '.zip'))
  		.pipe(gulp.dest('./dist/' + release));

  }

  return;

});

gulp.task('package-all', function() {

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

  return;

});

gulp.task('package-five1', function() {

  var x;

  // package all themes
  var bundlePaths = [];

  // walk through the themes
  for(x=0; x<themes.length; x++) {
    bundlePaths.push('./' + themes[x] + '/**/*');
  }

  // setup package
  return gulp.src(bundlePaths, {base: './', follow: true})
		.pipe(zip('five-pack-1-' + release + '.zip'))
		.pipe(gulp.dest('./dist/' + release));

  return;

});

// package the theme for distribution
gulp.task('screenshots', function() {

  var x;

  // walk through the themes
  for(x=0; x<themes.length; x++) {

    gulp.src(themes[x] + '/screenshot.png', {base: './'})
  		.pipe(rename(themes[x] + '.png'))
      .pipe(gulp.dest('./dist/' + release + '/screenshots/'));
  }

  return;

});


// prettify html (as needed)
gulp.task('prettify', function() {

  gulp.src('temp/**/*.html')
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest(themes[x]));

});

// run tasks
gulp.task('default', ['bootstrap', 'foundation', 'mdl', 'cleanup', 'package', 'package-all', 'package-five1', 'screenshots']);