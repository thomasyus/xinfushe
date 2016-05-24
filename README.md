# 薪福社项目前端脚手架

### 目录结构规范

```javascript
├─────xinfushe 
|        ├──assets         //静态资源发布目录
|               ├── css //css文件夹
|               |   └── i //样式调用的图片文件夹
|               |   └── bootstrap //bootstrap框架样式
|               |   └── fonts //iconfont图标字体
|               ├── js //js文件夹
|               |   └── bootstrap //bootstrap框架JS
|               ├── img //数据图片文件夹 
|        ├──assets-src     //静态资源开发目录  纳入SVN管理，但上线时不发布此文件夹
|               ├── css //css及scss文件夹
|               |   └── i //样式调用的图片文件夹
|               |   └── bootstrap //bootstrap框架样式
|               ├── js //js文件夹
|               |   └── bootstrap //bootstrap框架JS
|               ├── img //数据图片文件夹 
|        ├──*.html||*.jsp  //html文件
|        ├──node_modules  //node依赖工具包  不纳入SVN管理，不发布此文件夹
|        ├──package.json  //node依赖声明    不纳入SVN管理，不发布此文件
|        ├──gulpfile.js  //html文件	      不纳入SVN管理，不发布此文件
|        └──doc //项目文档,项目介绍           纳入SVN管理，不发布此文件
```

- 目录说明

  - xinfushe/ 为当前项目的svn根目录，除特别声明外，此文件夹下所有文件纳入SVN管理

  - xinfushe/assets/   为当前项目的静态资源目录，里面的静态资源将会被压缩编译

  - xinfushe/assets-src/ 为静态资源开发目录，里面的静态资源都是源代码  

    > 此文件夹内容纳入SVN管理，但上线时不发布此文件夹

  - xinfushe/assets/css 为静态文件CSS目录

  - xinfushe/assets/css/i 为静态文件CSS引用图片目录

  - xinfushe/assets/js 为静态文件js目录

  - xinfushe/assets/img 为页面html调用的数据图片目录

  - xinfushe/node_modules 为前端工具依赖文件包

    > 此文件夹内容不纳入SVN管理

  - xinfushe/gulpfile.js 为前端工具声明文件

    > 此文件夹内容不纳入SVN管理

  - xinfushe/doc 为项目文档文件夹

    > 此文件夹内容纳入SVN管理，但上线时不发布此文件夹

## 

### 如何使用

1. #### 安装

   1. 需要安装[nodejs](http://www.nodejs.org)，按照官网要求下载nodejs安装文件，进行安装操作，安装完毕之后，启动终端 （windows系统为cmd），在当前窗口输入`npm -v`，显示出正确的版本号即为安装成功。
   2. 从github上download[项目脚手架](https://github.com/thomasyus/xinfushe/)；
   3. 重命名脚手架为自己当前项目，并且在终端命令行下cd 进入到此项目目录；
   4. 第一次安装依赖，需要先配置`cnpm`，然后输入`cnpm install -g`，等待安装完成；
   5. 输入`cnpm link .`关联所有依赖，到当前目录；
   6. 安装完成后，输入`gulp`，回车运行，开始愉快的编码吧~

2. #### 其他任务命令介绍

   1. `gulp scss`    将`assets-src/css`目录下的*.scss文件编译成css文件并生成到`assets/css`目录
   2. `gulp javascript`  将`assets-src/js`目录下的*.js文件压缩生成到 `assets/js`目录
   3. `gulp css`  将`assets-src/css`目录下的*.css文件压缩并生成到`assets/css`目录
   4. `gulp images`   将`assets-src/images` 目录下的所有图片文件进行压缩并生成到 `assets/images` 目录
   5. `gulp server`  建立本地预览站点，并开启文件修改监测，文件修改自动刷新显示最新效果。
   6. `gulp clean`  删除`assets/`目录；
