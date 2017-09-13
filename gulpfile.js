var gulp = require('gulp');
var prettify = require('gulp-prettify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var zip = require('gulp-zip');
var staticI18nHtml = require('gulp-static-i18n-html');

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

var release = '6.4.1-final';

// copy shared/base files to all themes
gulp.task('bootstrap', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<bootstrap.length; x++) {

    // copy shared directory to themes
    gulp.src(['src/shared/bootstrap/**/*']).pipe(gulp.dest('src/' + bootstrap[x]));

  }

  done();

});

// cleanup files
gulp.task('cleanup', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<themes.length; x++) {

    // concat css
    gulp.src(['src/' + themes[x] + '/css/libs.min.css', 'src/' + themes[x] + '/css/plugins.css', 'src/' + themes[x] + '/css/site.css', 'src/' + themes[x] + '/css/utilities.css'])
      .pipe(concat('site.all.css'))
      .pipe(minifyCss())
      .pipe(rename('site.min.css'))
      .pipe(gulp.dest('src/' + themes[x] + '/css'));

    // concat js
    gulp.src(['src/' + themes[x] + '/js/libs.min.js', 'src/' + themes[x] + '/js/plugins.js',  'src/' + themes[x] + '/js/site.js'])
      .pipe(concat('site.all.js'))
      .pipe(gulp.dest('src/' + themes[x] + '/js'));

  }

  done();

});

// package the theme for distribution
gulp.task('package', function(done) {

  var x;

  // package individual themes
  for(x=0; x<themes.length; x++) {

    gulp.src('src/' + themes[x] + '/**/*', {base: './src/', follow: true})
  		.pipe(zip('src/' + themes[x] + '-' + release + '.zip'))
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
    bundlePaths.push('./src/' + themes[x] + '/**/*');
  }

  // setup package
  return gulp.src(bundlePaths, {base: './', follow: true})
		.pipe(zip('all-themes-' + release + '.zip'))
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

// localize themes
gulp.task('i18n', function() {
  return gulp.src('src/**/*.html')
    .pipe(staticI18nHtml({
      locales: ['en', 'fr']
    }))

    .pipe(gulp.dest('./dist'));
});

// run tasks
gulp.task('default', ['bootstrap', 'cleanup', 'package', 'package-all', 'screenshots']);