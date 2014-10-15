var gulp = require('gulp');
var traceur = require('gulp-traceur');
var server = require('gulp-express');

gulp.task('es6', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(traceur())
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['es6']);
});

gulp.task('server', function () {

    server.run({
        file: 'build/index.js'
    });

    gulp.watch(['build/**/*.js'], [server.run]);
});

// The default task (called when you run `gulp` from cli)
gulp.task('compile', ['watch', 'es6']);