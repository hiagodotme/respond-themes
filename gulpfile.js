var gulp = require('gulp');
var prettify = require('gulp-prettify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minify = require('gulp-minify');


gulp.task('energy', function() {

  // prettify html
  gulp.src('energy/**/*.html')
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest('energy'))
  
  // concat css  
  gulp.src(['energy/css/libs.min.css', 'energy/css/plugins.css', 'energy/css/site.css'])
    .pipe(concat('site-all.css'))
    .pipe(minifyCss())
    .pipe(rename('site-min.css'))
    .pipe(gulp.dest('energy/css'));
    
});

gulp.task('default', ['energy']);