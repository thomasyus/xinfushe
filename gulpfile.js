/*薪福社前端自动化工具配置文件*/
/*----------------------------------------------------------------------------------------------------------------*/
/*
 *   npm                                        node package manager 包管理器
 *
 *   gulp                                        已经全局安装
 *   gulp-sass                                 对sass文件进行编译
 *   gulp-autoprefixer                    实现css兼容属性前缀补全
 *   gulp-sourcemaps                     信息文件，储存编译前位置信息以方便开发调试错误
 *   gulp-notify                              显示报错信息和报错后不终止当前gulp任务
 *   gulp-uglify                               js压缩
 *   gulp-cached                            只对发生更改的 文件进行检测
 *   gulp-clean-css                         压缩css文件
 *   gulp-clean                               文件清理功能
 *   gulp-imagemin                        图片压缩
 *   gulp-plumber                           处理所有错误的通用方法，任务错误中断自动重传
 *   gulp-rev                                   添加版本号
 *   gulp-rev-collector                    与gulp-rev配合使用，可指定文件添加版本号
 *   gulp-rev-replace                      与gulp-rev配合使用，替换文件名
 *   gulp-replace                             替换
 *   browser-sync                           浏览器同步测试工具
 *   imagemin-pngquant                深度压缩png图片工具
 *   gulp-jshint                                js语法检查
 *   gulp-watch                               监听
 *   run-sequence                           按顺序逐个同步地运行 Gulp 任务
 *
 *   介绍一个好用的插件
 *    gulp-load-plugins                   这个插件能自动帮你加载package.json文件里的gulp插件,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。前提是我们装包的时候要这么装，，npm install moduleNames --save-dev 
 */


/*导入插件*/
/*----------------------------------------------------------------------------------------------------------------*/

var
    gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    cache = require('gulp-cached'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    revReplace = require("gulp-rev-replace"),
    replace = require('gulp-replace'),
    browserSync = require('browser-sync'),
    pngquant = require('imagemin-pngquant'),
    jshint = require('gulp-jshint');
    watch = require('gulp-watch');
    runSequence = require('run-sequence').use(gulp);;
// image = require('gulp-image'),
// imageminOptipng = require('imagemin-optipng')
// sftp = require('gulp-sftp'),

/*定义源路径和目标路径*/
/*----------------------------------------------------------------------------------------------------------------*/

var  
    buildSrc = {
        'js': './assets-src/**/*.js',
        'css': './assets-src/**/*.css',
        'copy': './assets-src/**/*.{svg,woff,woff2,eot,ttf,mp3}',
        'scss': './assets-src/**/*.scss',
        'img': './assets-src/**/*.{jpg,png,jpeg,gif,bmp}'
    },
    buildDest = './assets'

/*以下是各种任务块*/
/*
    gulp method{
        src：执行任务源地址
        dest：执行完毕后输出地址
        pipe：管道工具，接收输入流又以输出流出(这就是gulp的精华所在，，同学们可以看看nodejs里面的实现，，writestream，readstream)
    }
    其他插件方法使用和配置请看node_modules/readme，或者官网：https://www.npmjs.com/
*/
/*----------------------------------------------------------------------------------------------------------------*/

gulp.task('javascript', function() {
    gulp.src(buildSrc.js)
        // .pipe(changedInPlace(true))
        .pipe(watch(buildSrc.js))
        .pipe(cache('linting'))
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: {
                except: ['$', 'require', 'exports', 'module']
            }
        }))
        // .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest))
        .pipe(browserSync.stream())
        .pipe(notify("Javascript编译完成！"));
});
gulp.task('jshint',function(){
    gulp.src([buildSrc.js,"!assets-src/js/**/*.js","!assets-src/lib/**/*.js","!assets-src/widget/**/*.js"])
        .pipe(watch([buildSrc.js,"!assets-src/js/**/*.js","!assets-src/lib/**/*.js","!assets-src/widget/**/*.js"]))
        .pipe(cache('linting'))
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))//对代码进行报错提示
        .pipe(uglify({
            mangle: {
                except: ['$', 'require', 'exports', 'module']
            }
        }))
        // .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest))
        .pipe(browserSync.stream())
        .pipe(notify("Javascript语法检查完成！"));
});
gulp.task('scss', function() {
    gulp.src(buildSrc.scss) // .pipe(changedInPlace(true))
        .pipe(watch(buildSrc.scss))
        .pipe(cache('linting'))
        // .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest))
        .pipe(browserSync.stream())
        .pipe(notify("Sass编译完成！"));
});

gulp.task('copy', function() {
    gulp.src(buildSrc.copy).pipe(gulp.dest(buildDest));
})

gulp.task('css', function() {
    gulp.src(buildSrc.css) // .pipe(changedInPlace(true))
        .pipe(watch(buildSrc.css))
        .pipe(cache('linting'))
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        // .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        // .pipe(sourcemaps.write('./assets/maps'))
        .pipe(gulp.dest(buildDest))
        .pipe(browserSync.stream())
        .pipe(notify("css编译完成！"));
});

gulp.task('images', function() {
    gulp.src(buildSrc.img)
        .pipe(watch(buildSrc.img))
        .pipe(cache('linting'))
        .pipe(imagemin({
            progressive: true,//渐进式扫描,类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()],//使用pngquant深度压缩png图片的imagemin插件
            optimizationLevel: 5 ,//类型：Number  默认：3  取值范围：0-7（优化等级）
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(buildDest))
        .pipe(browserSync.stream())
        .pipe(notify("图片压缩完成！"));
});

gulp.task('clean', function() {
    return gulp.src(buildDest).pipe(clean());
});

gulp.task('server', function() {
    browserSync.init({
        server: "./",
        directory: true
    });
    // gulp.run('watchTask');
});
gulp.task('watchTask', function () {
    return watch(['./assets-src/**/*.{css,scss,js,jpg,png,jpeg,gif,bmp}','./**/*.html','!gulpfile.js'],function (event) {
        browserSync.reload();
        console.log('已更改的文件：File ' + event.path + '  was , running tasks...');
    });
});

gulp.task('default',function() {
    runSequence('clean',['scss', 'css', 'images', 'javascript', 'copy', 'jshint' , 'server'],'watchTask',function(){
        console.log("Waiting...");
    });
});
// gulp.task('default',function() {
//     runSequence(['scss', 'css','javascript', 'copy', 'jshint' , 'server'],'watchTask',function(){
//         console.log("Waiting...");
//     });
// });
// gulp.task('default', ['clean'], function() {
//     gulp.run(['scss', 'css', 'images', 'javascript', 'copy', 'jshint' , 'server'])
// });

/*以下哈希，版本，测试 ，发布任务还未作为默认任务执行*/
/*----------------------------------------------------------------------------------------------------------------*/
gulp.task('hash', function() {
    return gulp.src([buildDest + '/**/*.css', buildDest + '/**/*.js'])
        .pipe(rev())
        .pipe(gulp.dest(buildDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildDest));
});
gulp.task('rev', ['hash'], function() {
    var manifest = gulp.src(buildDest + "/rev-manifest.json")
    gulp.src(['./*.jsp', './*.html'])
        .pipe(revReplace({ manifest: manifest }))
        /*.pipe( minifyHTML({
                empty:true,
                spare:true
            }) )*/
        .pipe(gulp.dest('./assets-src/htmlDist'));
});

gulp.task('dev', function() {
    gulp.src(['**/*.{html,jsp,css,js}', '!gulpfile.js'])
        .pipe(replace('assets/', 'assets-src/'))
        .pipe(gulp.dest('./'));
});
//
gulp.task('release', function() {
    gulp.src(['**/*.{html,jsp,css,scss,js}', '!gulpfile.js'])
        .pipe(replace('assets-src/', 'assets/'))
        .pipe(gulp.dest('./'));
})

/*已注释任务*/
/*----------------------------------------------------------------------------------------------------------------*/
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
/*弃用自带watch*/
/*----------------------------------------------------------------------------------------------------------------*/
// gulp.task('watchTask', function() {
//     gulp.watch(buildSrc.js, ['jshint']);
//     gulp.watch(buildSrc.scss, ['scss']).on('change', function(event) {
//         console.log('已操作--File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
//     gulp.watch(buildSrc.css, ['css']).on('change', function(event) {
//         console.log('已操作--File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
//     gulp.watch(buildSrc.img, ['images']);
//     gulp.watch(buildSrc.copy, ['copy']);
//     gulp.watch(buildSrc.js, ['javascript']).on('change', function(event) {
//         console.log('已操作--File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
//     // gulp.watch(buildSrc.html, ['html']);
//     gulp.watch('./*.html').on('change', function() {
//         browserSync.reload();
//     });
// })