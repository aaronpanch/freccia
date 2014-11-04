var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  gulp.src(['./freccia/touch_point.js', './freccia/touch_path.js', './freccia/manager.js'])
    .pipe(concat('freccia.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  gulp.watch('./freccia/*.js', ['scripts']);
});

gulp.task('default', ['watch', 'scripts']);

