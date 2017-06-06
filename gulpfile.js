'use strict'

const autoprefixer = require('autoprefixer')
const babel = require('rollup-plugin-babel')
const concat = require('gulp-concat')
const connect = require('gulp-connect')
const cssnano = require('cssnano')
const gulp = require('gulp')
const panini = require('panini')
const postcss = require('gulp-postcss')
const resolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup').rollup
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('rollup-plugin-uglify')

gulp.task('html', () => {
  const paniniOptions = {
    root: 'src/pages/',
    layouts: 'src/layouts/',
    partials: 'src/partials/',
    helpers: 'src/helpers/',
    data: 'src/data/'
  }

  gulp.src('src/pages/**/*.html')
    .pipe(panini(paniniOptions))
    .pipe(gulp.dest('build'))
})

gulp.task('js', () => {
  return rollup({
    entry: 'assets/js/index.js',
    plugins: [
      resolve({
        browser: true,
        jsnext: true,
        module: true
      }),
      babel({
        exclude: 'node_modules'
      }),
      uglify()
    ]
  }).then(bundle => {
    return bundle.write({
      format: 'iife',
      dest: 'build/js/main.js',
      sourceMap: true
    })
  })
})

gulp.task('css', () => {
  const plugins = [
    autoprefixer(),
    cssnano()
  ]

  return gulp.src(['assets/css/reset.css', 'assets/css/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
})

gulp.task('assets', ['js', 'css'])

gulp.task('default', ['html', 'assets'])

gulp.task('watch', ['default'], () => {
  connect.server({
    root: 'build',
    port: 8888
  })

  gulp.watch(['assets/js/**/*.js'], ['js'])
  gulp.watch(['assets/css/**/*.css'], ['css'])
  gulp.watch([
    'src/pages/**/*',
    'src/partials/**/*',
    'src/helpers/**/*',
    'src/data/**/*',
    'src/layouts/**/*'
  ], ['html'])
})
