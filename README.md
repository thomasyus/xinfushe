# xinfushe
薪福社项目前端脚手架
### 如何使用

1. #### 安装

   1. 需要安装[nodejs](http://www.nodejs.org)，按照官网要求下载nodejs安装文件，进行安装操作，安装完毕之后，启动终端 （windows系统为cmd），在当前窗口输入`npm -v`，显示出正确的版本号即为安装成功。
   2. 从github上download[项目脚手架](https://github.com/thomasyus/xinfushe/)；
   3. 重命名脚手架为自己当前项目，并且在终端命令行下cd 进入到此项目目录；
   4. 输入`npm install`，等待安装完成；
   5. 安装完成后，输入`gulp`，回车运行，开始愉快的编码吧~

2. #### 其他任务命令介绍

   1. `gulp scss`    将`assets-src/css`目录下的*.scss文件编译成css文件并生成到`assets/css`目录
   2. `gulp javascript`  将`assets-src/js`目录下的*.js文件压缩生成到 `assets/js`目录
   3. `gulp css`  将`assets-src/css`目录下的*.css文件压缩并生成到`assets/css`目录
   4. `gulp images`   将`assets-src/images` 目录下的所有图片文件进行压缩并生成到 `assets/images` 目录
   5. `gulp server`  建立本地预览站点，并开启文件修改监测，文件修改自动刷新显示最新效果。
   6. `gulp clean`  删除`assets/`目录；
