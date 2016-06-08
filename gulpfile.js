var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    // imagemin = require('gulp-imagemin'),
    image = require('gulp-image'),
    // pngquant = require('imagemin-pngquant'),
    // imageminOptipng = require('imagemin-optipng')
    // sftp = require('gulp-sftp'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    revReplace = require("gulp-rev-replace"),
    replace = require('gulp-replace'),

    buildSrc = {
        'js': './assets-src/js/**/*.js',
        'css': './assets-src/css/**/*.css',
        'fonts': './assets-src/**/fonts/*',
        'scss': './assets-src/css/**/*.scss',
        'img': ['./assets-src/img/**/*.{png,jpg,jpeg}', './assets-src/css/i/**/*.{png,jpg,jpeg}']
    },
    buildDest = {
        'all': './assets',
        'js': './assets/js',
        'css': './assets/css',
        'fonts': './assets',
        'img': ['./assets/img', './assets/css/i']
    };

gulp.task('javascript', function() {
    gulp.src(buildSrc.js)
    .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: false
        }))
        .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest.js))
        /*
                .pipe(browserSync.stream())
                .pipe(notify("Javascript编译完成！"));*/
});
gulp.task('scss', function() {
    gulp.src(buildSrc.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest.css))
        .pipe(browserSync.stream())
        .pipe(notify("Sass编译完成！"));
});
gulp.task('css', function() {
    gulp.src(buildSrc.css)
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest.css))
        .pipe(browserSync.stream())
        .pipe(notify("css编译完成！"));
    gulp.src(buildSrc.fonts).pipe(gulp.dest(buildDest.fonts));
});

gulp.task('images', function() {
    gulp.src(buildSrc.img[0])
        /*.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))*/
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            advpng: true,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true
        }))
        .pipe(gulp.dest(buildDest.img[0]))
        .pipe(browserSync.stream());
    gulp.src(buildSrc.img[1])
        /*.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))*/
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            advpng: true,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true
        }))
        .pipe(gulp.dest(buildDest.img[1]))
        .pipe(browserSync.stream())
        .pipe(notify("图片压缩完成！"));
});

gulp.task('clean', function() {
    gulp.src(buildDest.all).pipe(clean());
});
gulp.task('default', ['clean'], function() {
    gulp.run(['scss', 'css', 'images', 'javascript', 'server']);
});

gulp.task('server', function() {
    browserSync.init({
        server: "./",
        directory: true
    });

    gulp.watch(buildSrc.scss, ['scss']);
    gulp.watch(buildSrc.css, ['css']);
    gulp.watch([buildSrc.img[0], buildSrc.img[1]], ['images']);
    gulp.watch(buildSrc.js, ['javascript']);
    // gulp.watch(buildSrc.html, ['html']);
    gulp.watch('./*.html').on('change', function() {
        browserSync.reload();
    });
});

gulp.task('hash', function() {
    gulp.src([buildDest.all + '/**/*.css', buildDest.all + '/**/*.js'])
        .pipe(rev())
        .pipe(gulp.dest(buildDest.all))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildDest.all));
});
gulp.task('rev', ['hash'], function() {
    var manifest = gulp.src(buildDest.all + "/rev-manifest.json")
    gulp.src(['./*.jsp', './*.html'])
        .pipe(revReplace({ manifest: manifest }))
        /*.pipe( minifyHTML({
                empty:true,
                spare:true
            }) )*/
        .pipe(gulp.dest('./assets-src/htmlDist'));
});

gulp.task('dev', function() {
    gulp.src(['*.{html,jsp,css,js}', '!gulpfile.js'])
        .pipe(replace('assets/', 'assets-src/'))
        .pipe(gulp.dest('./'));
});
//
gulp.task('release', function() {
        gulp.src(['*.{html,jsp,css,js}', '!gulpfile.js'])
            .pipe(replace('assets-src/', 'assets/'))
            .pipe(gulp.dest('./'));
    })
    //打包主体build 文件夹并按照时间重命名
    // gulp.task('zip', function(){
    //       function checkTime(i) {
    //           if (i < 10) {
    //               i = "0" + i
    //           }
    //           return i
    //       }

//       var d=new Date();
//       var year=d.getFullYear();
//       var month=checkTime(d.getMonth() + 1);
//       var day=checkTime(d.getDate());
//       var hour=checkTime(d.getHours());
//       var minute=checkTime(d.getMinutes());

//   return gulp.src('buildDest.all')
//         .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
//         .pipe(gulp.dest('./'));
// });

// //上传到远程服务器任务
// gulp.task('upload', function () {
//     return gulp.src(buildDest.all)
//         .pipe(sftp({
//             host: config.sftp.host,
//             user: config.sftp.user,
//             port: config.sftp.port,
//             key: config.sftp.key,
//             remotePath: config.sftp.remotePath
//         }));
// });
