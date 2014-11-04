var gulp = require('gulp'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('scripts', function() {
  gulp.src(['./freccia/touch_point.js', './freccia/touch_path.js', './freccia/manager.js'])
    .pipe(concat('freccia.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  gulp.watch('./freccia/*.js', ['scripts']);
});

gulp.task('default', ['serve', 'watch', 'scripts']);

