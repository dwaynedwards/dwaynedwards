import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import prefixer from 'gulp-autoprefixer';
import uglifycss from 'gulp-uglifycss';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
const bs = browserSync.create();

const htmlPaths = {
  src: 'src/*.html',
  dest: 'public',
  build: 'build',
  watch: 'src/*.html'
};

gulp.task('html', () =>
  gulp
    .src(`${htmlPaths.src}`)
    .pipe(gulp.dest(`${htmlPaths.dest}`))
    .pipe(bs.stream())
);

gulp.task('html:build', () =>
  gulp
    .src(`${htmlPaths.src}`)
    .pipe(gulp.dest(`${htmlPaths.build}`))
    .pipe(bs.stream())
);

const stylePaths = {
  src: 'src/sass/style.scss',
  dest: 'public/css',
  build: 'build/css',
  watch: 'src/sass/**/*.scss'
};

gulp.task('styles', () =>
  gulp
    .src(`${stylePaths.src}`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
      })
    )
    .on('error', sass.logError)
    .pipe(
      prefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(uglifycss())
    .pipe(
      rename({
        basename: 'style',
        extname: '.min.css'
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${stylePaths.dest}`))
    .pipe(bs.stream())
);

gulp.task('styles:build', () =>
  gulp
    .src(`${stylePaths.src}`)
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
      })
    )
    .on('error', sass.logError)
    .pipe(
      prefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(uglifycss())
    .pipe(
      rename({
        basename: 'style',
        extname: '.min.css'
      })
    )
    .pipe(gulp.dest(`${stylePaths.build}`))
    .pipe(bs.stream())
);

const imagePaths = {
  src: 'src/img/**/*',
  dest: 'public/img',
  build: 'build/img',
  watch: 'src/img/**/*'
};

gulp.task('images', () =>
  gulp
    .src(`${imagePaths.src}`)
    .pipe(gulp.dest(`${imagePaths.dest}`))
    .pipe(bs.stream())
);

gulp.task('images:build', () =>
  gulp
    .src(`${imagePaths.src}`)
    .pipe(gulp.dest(`${imagePaths.build}`))
    .pipe(bs.stream())
);

gulp.task('browserSync', () => {
  bs.init({
    server: `./${htmlPaths.dest}`
  });
});

gulp.task('watch', ['browserSync', 'html', 'styles', 'images'], () => {
  gulp.watch(`${htmlPaths.watch}`, ['html', bs.reload]);
  gulp.watch(`${stylePaths.watch}`, ['styles']);
  gulp.watch(`${imagePaths.watch}`, ['images']);
});

gulp.task('build', ['html:build', 'styles:build', 'images:build']);

gulp.task('default', ['watch']);
