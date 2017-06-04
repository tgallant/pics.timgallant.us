const babel = require('rollup-plugin-babel')
const connect = require('gulp-connect')
const gulp = require('gulp')
const panini = require('panini')
const resolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup').rollup

gulp.task('html', () => {
  const paniniOptions = {
    root: './pages/',
    layouts: './layouts/',
    partials: './partials/',
    helpers: './helpers/',
    data: './data/'
  }

  gulp.src('./pages/**/*.html')
    .pipe(panini(paniniOptions))
    .pipe(gulp.dest('./build'))
})

gulp.task('js', () => {
  return rollup({
    entry: './js/index.js',
    plugins: [
      resolve({
        browser: true,
        jsnext: true,
        module: true
      }),
      babel({
        exclude: './node_modules'
      })
    ]
  }).then(bundle => {
    return bundle.write({
      format: 'iife',
      dest: './build/js/main.js'
    })
  })
})

gulp.task('css', () => {
  return gulp.src('./css/**/*.css', { base: '.' })
    .pipe(gulp.dest('build'))
})

gulp.task('assets', ['js', 'css'])

gulp.task('default', ['html', 'assets'])

gulp.task('watch', ['default'], () => {
  connect.server({
    root: 'build',
    port: 8888
  })

  gulp.watch(['js/**/*.js'], ['js'])
  gulp.watch(['css/**/*.css'], ['css'])
  gulp.watch([
    'pages/**/*',
    'partials/**/*',
    'helpers/**/*',
    'data/**/*',
    'layouts/**/*'
  ], ['html'])
})
