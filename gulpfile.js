var gulp = require('gulp');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var es6ify = require('es6ify');
var transform = require('vinyl-transform');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./build"
		},
		open: false,
		notify: false
	});
});

gulp.task('browserify', function(){
	var browserified = transform(function(filename) {
		return browserify(filename)
		.bundle();
	});
	return gulp.src(['./src/js/index.js'])
		.pipe(browserified)
		.pipe(gulp.dest('./build/js'))
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