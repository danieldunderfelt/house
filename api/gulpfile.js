var gulp = require('gulp');
var traceur = require('gulp-traceur');

gulp.task('es6', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(traceur())
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['es6']);
});

gulp.task('default', ['es6', 'watch']);