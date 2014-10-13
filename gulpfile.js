var gulp = require('gulp');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var to5 = require('gulp-6to5');
var transform = require('vinyl-transform');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        notify: false,
    });
});

gulp.task('browserify', function(){
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        return b.bundle();
    });
    return gulp.src(['./src/js/index.js'])
        .pipe(browserified)
        .pipe(to5())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'))
        .pipe(reload({stream: true}));
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