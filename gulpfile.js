import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import del from 'del';
import csso from 'postcss-csso';

//styles
export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    /*.pipe(rename('style.min.css'))*/
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//html

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
  }

//Script

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }

// img

const optimizeImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.png'])
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// webp

const createWebp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.png'])
    .pipe(squoosh({
        webp: {}
      })
    )
    .pipe(gulp.dest('build/img'))
}

// SVG

const svg = () =>
gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
.pipe(svgo())
.pipe(gulp.dest('build/img'));

const sprite = () => {
return gulp.src('source/img/icons/*.svg')
.pipe(svgo())
.pipe(svgstore({
inlineSvg: true
}))
.pipe(rename('sprite-lib.svg'))
.pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/*.webmanifest',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
}

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/j**/*.less', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
  }

//build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  )
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
  styles,
  html,
  scripts,
  svg,
  sprite,
  createWebp
  ),
  gulp.series(
  server,
  watcher
  ));
