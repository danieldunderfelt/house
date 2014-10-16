var gulp = require('gulp');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var transform = require('vinyl-transform');
var notify = require("gulp-notify");


var handleErrors = function() {

  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  this.emit('end');
};

gulp.task('browser-sync', function() {
	browserSync({
		proxy: "house.dev",
		open: false,
		notify: false,
		ghostMode: false
	});
});

gulp.task('browserify', function(){
	var browserified = transform(function(filename) {
		return browserify(filename)
		.bundle()
	}).on('error', handleErrors);
	return gulp.src(['./src/js/index.js'])
		.pipe(browserified)
		.on('error', handleErrors)
		.pipe(gulp.dest('./build/js'))
		.on('error', handleErrors)
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function () {
	return gulp.src('src/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

// Default task to be run with `gulp`
gulp.task('default', ['browser-sync'], function () {
	gulp.watch("src/js/**/*.js", ['browserify']);
	gulp.watch("src/scss/**/*.scss", ['sass']);
	gulp.watch("build/*.html", ['bs-reload']);
});