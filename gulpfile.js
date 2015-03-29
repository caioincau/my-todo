var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();


gulp.task('css', function() {
var cssPath = {cssSrc:['./public/stylesheets/*.css', '!*.min.css', '!/**/*.min.css'], cssDest:'public'};
  return gulp.src(cssPath.cssSrc)
    .pipe(plugins.concat('styles.css'))
    .pipe(plugins.autoprefixer('last 2 versions'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(cssPath.cssDest));
});
gulp.task('js', function() {
	var jsPath = {jsSrc:['./public/javascripts/**/*.js'], jsDest:'public'};
	 return gulp.src(jsPath.jsSrc)
	    .pipe(plugins.concat('scripts.js'))
	    .pipe(plugins.stripDebug())
	    .pipe(plugins.uglify())
    	.pipe(plugins.rename({ suffix: '.min' }))
    	.pipe(gulp.dest(jsPath.jsDest));
});

gulp.task('default', ['css', 'js'], function() {
  // watch for JS changes
  gulp.watch('.public/javascripts/**/*.js', ['js']);
  // watch for CSS changes
  gulp.watch('./public/stylesheets/*.css', ['css']);
});