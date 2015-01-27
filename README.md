#cordova打包app的环境准备、软件安装


##配置开发环境准备
首先下载Node,后续的一些插件/库，需要通过它来安装。 windows用户还要下载git bash，官方描述：“Git for Windows provides a BASH emulation used to run Git from the command line.” 因为后续安装cordova插件要用到。

*注：以下给出的参考教程仅供参考，如一一列出，则篇幅会显得累赘，读者可根据自己下载的版本自行搜索教程,不便之处敬请原谅。*

###安装git
下载地址 ：https://msysgit.github.io/<br>
安装教程可参考：http://jingyan.baidu.com/article/90895e0fb3495f64ed6b0b50.html

###安装node.js
 * 1.下载地址:http://nodejs.org/download/<br>
以windows，下载msi版本为例<br>
![download](Image.png)
 * 2.安装,双击运行，即可在程序的引导下完成安装。
 * 3.测试安装结果命令(git bash或cmd):<br>
`node -v`<br>
出现版本号就对了。

nodejs 默认安装在 C:\Program Files\nodejs ，如果是 64 位的系统，可能在 C:\Program Files (x86)\nodejs 。npm 默认全局安装的模块保存在 C:\Users\UserName\AppData\Roaming\npm 目录下，一般来说，安装完之后用户变量PATH值会多了一项C:\Users\UserName\AppData\Roaming\npm，如果没有，可以手动加上。


##Android开发环境的准备：JDK，ANT，SDK

###JDK
 * 1.下载地址：http://www.oracle.com/technetwork/cn/java/javase/downloads/jdk8-downloads-2133151-zhs.html<br>
安装：可以直接默认安装

 * 2.配置环境变量：我的电脑----属性-----高级----环境变量<br>
在系统变量新建：`JAVA_HOME`<br>
值是:`C:\Program Files\Java\jdk1.8.0_31`<br>
然后在用户变量PATH里加入：`;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin`

![](Image4.png)

![](Image5.png)

*注：这里只是给出一个例子，具体的安装路径和jdk版本读者可根据自己的实际情况作相应的修改。*

###ANT
 * 1.下载地址：http://ant.apache.org/bindownload.cgi<br>
解压可用

 * 2.配置环境变量：我的电脑----属性-----高级----环境变量<br>
首先在系统变量新建：`ANT_HOME`<br>
值是你解压的路径，如：`D:/apache-ant-1.9.4-bin`<br>
然后在用户变量PATH里加入：`;%ANT_HOME%\bin`

 * 3.检查是否安装成功
打开cmd命令窗口,输入:<br>
 `ant -version`<br>
如果显示如下,则说明安装成功了(不同的版本号可能显示不同)<br>
`Apache Ant(TM) version 1.9.4 compiled on April 29 2014`


###SDK
 * 1.官网下载地址：http://developer.android.com/sdk/installing/index.html
 * 2.安装教程可参考：http://www.androidcentral.com/installing-android-sdk-windows-mac-and-linux-tutorial

如果你对于2013年Google I/O 大会首次发布了Android Studio IDE（Android平台集成开发环境）无感，你可以在下面的地址下载<br>
http://www.cnblogs.com/bjzhanghao/archive/2012/11/14/android-platform-sdk-download-mirror.html
![adt](Image3.png)
解压即可用，把环境路径配上就好。<br>
在系统变量新建：`ANDROID_HOME`,值是`D:\adt-bundle-windows-x86_64-20140321\sdk`<br>
然后在用户变量PATH里加入：`;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools`

安装教程可参考:http://jingyan.baidu.com/article/d621e8da0999062865913f3b.html

*注：修改了PATH后需要重启cmd才可以生效。如果还不行，可以再重启电脑。如果还不行，认真按着步骤排查一下哪里出错。*

##开发工具准备
###开发编辑工具 -- **sublime**
下载地址：http://www.sublimetext.com/3<br>
可以安装一些插件，参考：http://dearb.me/archive/2013-10-29/sublime-text-packages-for-front-end-development/

###推荐浏览器 -- **chrome**
下载地址：http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html


##使用网页代码制作APP
可以按照以下步骤，也可以参照cordova官方链接：
http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface
###1、安装移动应用开发框架cordova
安装命令：<br>
`npm install -g cordova`<br>
ok，测试安装结果命令：<br>
`cordova -v`
###2、创建app
这里创建一个命名为HelloWorld，id为com.example.hello的app，放在hello文件夹下：<br>
`cordova create hello com.example.hello HelloWorld`

###3、添加/删除平台
**添加**android平台<br>
`cordova platform add android`<br>
回车后，会开始下载安卓的相关库，等等吧。。。<br>

创建完之后可以用下面这条命令来**查看**已添加以及可支持添加的平台：<br>
`cordova platforms ls`<br>

**删除**某个平台的话，可以这样：<br>
`cordova platform rm amazon-fireos`<br>
`cordova platform remove android`<br>

添加之后会./hello/platforms下的目录，增加一个相应平台的目录，而删除平台的话，也会将这个目录删除。**慎重**

###4、添加/删除插件(可选，看项目需要，不需要可以跳过)
官方提供的plugin API:<br>
http://cordova.apache.org/docs/en/4.0.0/cordova_plugins_pluginapis.md.html#Plugin%20APIs<br>
以camera为例<br>
**添加**<br>
`cordova plugin add org.apache.cordova.camera`<br>
**删除**<br>
`cordova plugin rm org.apache.cordova.camera`<br>

###5、将已有的网页代码整合到新建的cordova项目中
刚刚第2步只是创建了一个简单的helloworld工程，如果是已有一个网页代码项目，可以这样：

#####1). 将hello/www/下的所有文件删除，把你的网页代码项目拷贝进去。
#####2). 修改配置文件hello/config.xml,将src的路径改为你网页代码项目的入口文件的路径。
![config](Image2.png)

###6、编译app
`cordova build`<br>
这条命令将编译./hello/platforms下所有的平台，如果只想单独编译其中的平台的话，只需要在build上增加该平台名即可。<br>
`cordova build　android`<br>
貌似头一回编译时都比较慢。。。<br>
编译的过程中，会输出一堆东西。。最后如果看到build successful,就可以了。<br>
实际上，build命令是prepare 以及compile两条命令的缩写。上面这条命令相当于：<br>
 `cordova prepare android`<br>
 `cordova compile android`<br>

###7、运行app
#####1). 模拟器上运行：输入下面命令：
`cordova emulate android`<br>
但是，查资料说Windows下convert命令冲突，直接“cordova emulate android”会报Error: spawn ENOENT，需要先启动模拟器。
#####2). 浏览器上运行：输入下面命令：
`cordova serve android`<br>
然后在浏览器中输入http://localhost:80　即可看到支行情况。<br>
*注:可以打开多个cmd运行同一个app，但是端口会8000开始+1；*
#####3). 设备上运行：插入usb，输入下面命令：
`cordova run android`<br>
当然以上只是运行。当要调试时，推荐weinre

##远程调试工具--weinre
#####1). 安装：打开git bash或cmd,输入命令
`npm install -g weinre` 

#####2). `ipconfig`查看pc ip 
![ip](Image1.png)
手机或平板要和pc处于同一个局域网，即手机和电脑连同一个网（绑定上）,或者手机连电脑发出来的WiFi（绑定下）。

#####3). 绑定的ip为pc的ip地址
如 `weinre --httpPort 80 --boundHost 192.168.51.1`<br>
端口这里可以随意定，我这里习惯绑定80.运行了这行命令之后，要一直开着这个窗口。
如若要输入其他命令，可另外再开一个窗口。

确保pc和手机可以访问weinre<br>
手机浏览器打开访问192.168.51.1<br>
可以访问到weinre sever home就行了<br>

#####4). 把`<script src="http://192.168.51.1:80/target/target-script-min.js#anonymous"></script>`添加在要测试的html文件上

#####5).把项目安装在手机，点击浏览，pc浏览器打开可以查看对应代码。<br>
http://192.168.51.1:80/client/#anonymous
