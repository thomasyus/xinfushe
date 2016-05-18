var gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sftp = require('gulp-sftp'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    cssSprite = require('gulp-css-spritesmith'),
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
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildDest.js))
        .pipe(browserSync.stream())
        .pipe(notify("Javascript编译完成！"));
});
gulp.task('scss', function() {
    gulp.src(buildSrc.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildDest.css))
        .pipe(browserSync.stream())
        .pipe(notify("Sass编译完成！"));
});
gulp.task('css', function() {
    gulp.src(buildSrc.css)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildDest.css))
        .pipe(browserSync.stream())
        .pipe(notify("css编译完成！"));
    gulp.src(buildSrc.fonts).pipe(gulp.dest(buildDest.fonts));
});
// 自动雪碧图
// autoSprite, with media query
gulp.task('autoSprite', function() {
    gulp.src(buildSrc.css).pipe(cssSprite({
        // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
        imagepath: '.assets-src/css/i/slice/',
        // 映射CSS中背景路径，支持函数和数组，默认为 null
        imagepath_map: null,
        // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
        spritedest: buildSrc.img[1]+'/sprites/',
        // 替换后的背景路径，默认 ../images/
        spritepath: './i/sprites/',
        // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
        padding: 2,
        // 是否使用 image-set 作为2x图片实现，默认不使用
        useimageset: false,
        // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
        newsprite: false,
        // 给雪碧图追加时间戳，默认不追加
        spritestamp: true,
        // 在CSS文件末尾追加时间戳，默认不追加
        cssstamp: true
    }))
    .pipe(gulp.dest(buildDest.css));
});


gulp.task('images', function() {
    gulp.src(buildSrc.img[0])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(buildDest.img[0]))
        .pipe(browserSync.stream())
        .pipe(notify("图片压缩完成！"));
    gulp.src(buildSrc.img[1])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(buildDest.img[1]))
        .pipe(browserSync.stream())
        .pipe(notify("图片压缩完成！"));
});
gulp.task('html', function() {

});
gulp.task('clean', function() {
    gulp.src(buildDest.all).pipe(clean()).pipe(notify('清空静态资源目录'));
});
gulp.task('default', gulpSequence('scss', 'css', 'images', 'javascript', 'server'));

gulp.task('server', function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch(buildSrc.sass, ['scss']);
    gulp.watch(buildSrc.css, ['css']);
    gulp.watch(buildSrc.img, ['images']);
    gulp.watch(buildSrc.js, ['javascript']);
    // gulp.watch(buildSrc.html, ['html']);
    gulp.watch(buildSrc.html).on('change', function() {
        browserSync.reload;
    });
});



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
