var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
    browserify('src/client/index.js', { debug: true })
        .transform('babelify')
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('megastores-client.js'))
        .pipe(gulp.dest('lib'));
});

gulp.task('default', ['build']);
