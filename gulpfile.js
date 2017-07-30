const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const clean = require('gulp-clean')

const files = {
	config: path.resolve(__dirname, 'config/*.js'),
	gulpfile: path.resolve(__dirname, 'gulpfile.js'),
	src: `${path.resolve(__dirname, 'src')}/**/*.js`,
	dist: path.resolve(__dirname, 'dist')
}

gulp.task('dist:clean', () => {
	return gulp.src(files.dist, { read: false })
	.pipe(clean())
})

gulp.task('dist:build', () => {
	return gulp.src(files.src)
	.pipe(babel())
	.pipe(gulp.dest(files.dist))
})

gulp.task('watch:dist:build', () => {
	gulp.watch(files.src, ['dist:build'])
})

gulp.task('default', ['dist:build', 'watch:dist:build'])
