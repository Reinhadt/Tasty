var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync').create();
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var precss = require('precss');
var font_magician = require('postcss-font-magician');
var lost = require('lost');

gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: '../../index.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

gulp.task('browser-sync', ['css'], function(){
    bs.init(null,{
        proxy:"http://localhost:3000",
        port:7000,
        browser:"google chrome"
    })
})

gulp.task('css',['nodemon'], function () {
  var processors = [
      autoprefixer,
      cssnano,
      precss,
      font_magician,
      lost
  ];
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'))
    .pipe(bs.reload({stream: true}));
});

gulp.task('watch', ['browser-sync'], function(){
    gulp.watch('./src/*.css', ['css']);
    gulp.watch('../*.html').on('change', bs.reload);
    gulp.watch('../templates/*.html').on('change', bs.reload);
});