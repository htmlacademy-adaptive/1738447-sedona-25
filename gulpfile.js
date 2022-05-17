import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser, { reload } from 'browser-sync';
import htmlmin from 'gulp-html-minifier';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import cssmin from 'gulp-css-minify';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML
export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
}

//CSS
export const cssMinify = () => {
  return gulp.src('source/css/*.css')
  .pipe(cssmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css'));
}


//Script

export const scripts = () => {
  return gulp.src ('source/js/*.js')
  .pipe(terser())
  .pipe(gilp.dest('build/JS'));
}

//Pictures webp

export const picture = () => {
  return gulp.src('source/img/*jpg')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

export const picturemin = () => {
  return gulp.src('source/img/*jpg')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}

//svg

export const svg = () => {
  gulp.src(['source/img/*.svg' , '!source/img/icons/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

export const svgsprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'))
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/**/*.js', gulp.series(scripts));
  gulp.watch('source/*.html'),  gulp.series(html, reload);
}


//default
export default gulp.series(
  html, scripts, styles, server, watcher
);

