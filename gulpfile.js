// gulpfile.js
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('assets/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

// process CSS files and return the stream.
gulp.task('css', function () {
    return gulp.src('assets/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

// Serve and watch for changes
gulp.task('serve', gulp.series('css', 'js', function() {
    browserSync.init({
        proxy: "https://rarepepes.loc",
        https: true // add this line to enable SSL
    });

    gulp.watch('assets/*.css', gulp.series('css'));
    gulp.watch('assets/*.js', gulp.series('js')).on('change', browserSync.reload);
    gulp.watch("**/*.php").on('change', browserSync.reload);
}));
