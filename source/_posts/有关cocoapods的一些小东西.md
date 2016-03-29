---
title: 有关cocoapods的一些小东西
tags:
  - cocoapods
  - iOS
date: 2016-03-28 08:00:00
---

[Cocoapods](http://guides.cocoapods.org/ "Title")是一个负责管理iOS项目中第三方开源代码及其依赖的工具。Cocoapos的出现可以节省设置与更新第三方开源库的时间。支持svn/git/http/mercurial四种版本管理协议。

## 安装

Mac下因为自带Ruby，所以可以省略其中的Ruby安装，具体步骤如下

*   更新Gem

    `sudo gem update`

*   如果使用淘宝的Ruby镜像源可以加速安装

    `sudo gem sources -a https://ruby.taobao.org/ ##添加淘宝源地址`

    `sudo gem sources -l ###查看源列表`

    `sudo gem sources --remove https://rubygems.org/ #移除默认的源地址`

*   安装cocoapods

    `sudo gem install cocoapods`

*   设置pod, 通过执行setup可以缓存pod的spec库到~/.cocoapods/中

    `pod setup`

如果遇到ruby版本问题，需要修改Gemfile中的ruby对应版本号

如果遇到Gem中更新的问题，还可以尝试`sudo gem update --system`

目前遇到很多升级到0.35版本就会无法更新的问题，如果想到pod进行版本降级，可执行以下操作

`sudo gem uninstall cocoapods`

然后再指定安装版本

`sudo gem install cocoapods -v 0.33.1`

升级至cocoapods版本大于0.35以后，可以使用很多额外的插件来提升开发体验

*   [cocoapods-appledoc](https://github.com/CocoaPods/cocoapods-appledoc) – 为pod自动化生成相关文档，注释语法需要符合appledoc或headerdoc语法

*   [cocoapods-deintegrate](https://github.com/kylef/cocoapods-deintegrate) – 移除Pod集成工程、pod脚本以及资源为目标工程的引用

*   [cocoapods-clean](https://github.com/BendingSpoons/cocoapods-clean) – 除了cocoapods-deintegrate的功能，还会将Pods目录以及Podfile.lock都移除

*   [cocoapods-dependencies](https://github.com/segiddins/cocoapods-dependencies) – 可以显示出某个pod的模块依赖关系树，前提是pod的spec有通过spec lint 检查并注明了相关依赖

*   [cocoapods-browser](https://github.com/dealforest/cocoapods-browser) – 如果spec按照规范填写homepage，那么可以通过这个命令直接打开目标pod的网站，可以省去不少查找文档的时间.当然前提是有人好好的写了ReadMe与目标网站的链接

*   [cocoapods-check_latest](https://github.com/yujinakayama/cocoapods-check_latest) – 检查指定的pod 是否有最新的版本可以用于更新

*   [cocoapods-try](https://github.com/CocoaPods/cocoapods-try) – 快速创建一个pod的demo工程

*   [cocoapods-watch](https://github.com/supermarin/cocoapods-watch) – 监控Podfile的变更来决定是否执行pod install

*   [cocoapods-packager](https://github.com/CocoaPods/cocoapods-packager) – 能根据spec的生成framework或静态库，但前提是能通过spec lint检查，其次依赖路径中包含framework时的编译处理上还存在符号表命名空间冲突的问题。实际测试，目前适用于开源库或依赖关系比较简单的framework化。对于减少工程中稳定代码的编译量很有帮助，能很好的提升处理速度

*   [cocoapods-superdeintegrate](https://github.com/ashfurrow/cocoapods-superde%E8%BF%87integrate) – 除了cocoapods-clean的功能，还能清除相关derived Data。

## 版本号命名规则

CocoaPods 使用语义版本控制 – [Semantic Versioning](http://semver.org/) 命名约定来解决对版本的依赖。由于冲突解决系统建立在非重大变更的补丁版本之间，这使得解决依赖关系变得容易很多。例如，两个不同的 pods 依赖于 CocoaLumberjack 的两个版本，假设一个依赖于2.3.1，另一个依赖于 2.3.3，此时冲突解决系统可以使用最新的版本 2.3.3，因为这个可以向后与 2.3.1 兼容。 但这并不总是有效。有许多第三方库并不使用这样的约定，这让解决方案变得非常复杂。 当然，总会有一些冲突需要手动解决。如果一个库依赖于 CocoaLumberjack 的 1.2.5，另外一个库则依赖于 2.3.1，那么只有最终用户通过明确指定使用某个版本来解决冲突。

## Podfile.lock

在使用CocoaPods，执行完pod install之后，会生成一个Podfile.lock文件。这个文件看起来跟我们关系不大，实际上绝对不应该忽略它。 该文件用于保存已经安装的Pods依赖库的版本，通过CocoaPods安装了SBJson、AFNetworking、Reachability三个POds依赖库以后对应的Podfile.lock文件内容为：

<div class="highlighter-rouge">

    PODS:
    – AFNetworking (2.1.0):
    – AFNetworking/NSURLConnection
    – AFNetworking/NSURLSession
    – AFNetworking/Reachability
    – AFNetworking/Security
    – AFNetworking/Serialization
    – AFNetworking/UIKit
    – AFNetworking/NSURLConnection (2.1.0):
    – AFNetworking/Reachability
    – AFNetworking/Security
    – AFNetworking/Serialization
    – AFNetworking/NSURLSession (2.1.0):
    – AFNetworking/NSURLConnection
    – AFNetworking/Reachability (2.1.0)
    – AFNetworking/Security (2.1.0)
    – AFNetworking/Serialization (2.1.0)
    – AFNetworking/UIKit (2.1.0):
    – AFNetworking/NSURLConnection
    – Reachability (3.0.0)
    – SBJson (4.0.0)
    DEPENDENCIES:
    – AFNetworking (~&gt; 2.0)
    – Reachability (~&gt; 3.0.0)
    – SBJson (~&gt; 4.0.0)
    SPEC CHECKSUMS:
    AFNetworking: c7d7901a83f631414c7eda1737261f696101a5cd
    Reachability: 500bd76bf6cd8ff2c6fb715fc5f44ef6e4c024f2
    SBJson: f3c686806e8e36ab89e020189ac582ba26ec4220
    `</pre>
    </div>

    Podfile.lock文件最大得用处在于多人开发。当团队中的某个人执行完pod install命令后，生成的Podfile.lock文件就记录下了当时最新Pods依赖库的版本，这时团队中的其它人check下来这份包含Podfile.lock文件的工程以后，再去执行pod install命令时，获取下来的Pods依赖库的版本就和最开始用户获取到的版本一致。如果没有Podfile.lock文件，后续所有用户执行pod install命令都会获取最新版本的SBJson，这就有可能造成同一个团队使用的依赖库版本不一致，这对团队协作来说绝对是个灾难！

    在这种情况下，如果团队想使用当前最新版本的SBJson依赖库，有两种方案：

*   更改Podfile，使其指向最新版本的SBJson依赖库；
*   执行pod update命令；

    鉴于Podfile.lock文件对团队协作如此重要，我们需要将它添加到版本管理中。

    如果 Pods 文件夹和里面的所有内容都在版本控制之中，那么你不需要做什么特别的工作，就能够持续集成。我们只需要给 .xcworkspace 选择一个正确的 scheme 即可。

    如果你的 Pods 文件夹不受版本控制，那么你需要做一些额外的步骤来保证持续集成的顺利进行。最起码，Podfile 文件要放入版本控制之中。另外强烈建议将生成的 .xcworkspace 和 Podfile.lock 文件纳入版本控制，这样不仅简单方便，也能保证所使用 Pod 的版本是正确的。

    ## Manifest.lock

    这是每次运行 pod install 命令时创建的 Podfile.lock 文件的副本。如果你遇见过这样的错误 沙盒文件与 Podfile.lock 文件不同步 (The sandbox is not in sync with the Podfile.lock)，这是因为 Manifest.lock 文件和 Podfile.lock 文件不一致所引起。由于 Pods 所在的目录并不总在版本控制之下，这样可以保证开发者运行 app 之前都能更新他们的 pods，否则 app 可能会 crash，或者在一些不太明显的地方编译失败。

    ## podfile编写

    podfile是用于描述工程中依赖关系的文件，可以通过在.xcodeproj文件所在目录执行`pod init`生成，也可以自己手动编写.编写的基本规则可以参考[podfile语法](http://guides.cocoapods.org/syntax/podfile.html)，同时也提供了几个基本[样例](http://guides.cocoapods.org/using/the-podfile.html)

    在官方样例的基础上，结合实际的工程使用情况，我们还总结了几个样例给大家参考

*   ###### 基本用法 工程中存在名为TestA的workspace，TestA包含TestB与TestC两个工程，TestB与TestC又依赖TestD的静态库工程.TestA工程中存在一个iphone的目标，TestB中存在一个ipad的目标，TestD中存在一个Common的目标
        <div class="highlighter-rouge"><pre class="highlight">`source 'git@gitlab.alibaba-inc.com:alipods/specs.git'
    source 'git@gitlab.alibaba-inc.com:wireless/tbmainclientspecs.git'    source 'git@gitlab.alibaba-inc.com:tmallwireless/tmallspec.git'
    source 'git@gitlab.alibaba-inc.com:wx-ios/wxpodsspecs.git'
    workspace 'TestA.xcworkspace'    xcodeproj 'project/TestB.xcodeproj'    xcodeproj 'project/TestB.xcodeproj'    xcodeproj 'project/TestC.xcodeproj'    xcodeproj 'project/TestD.xcodeproj'    target 'iphone' do        platform :ios, '5.0'        pod 'Appirater'        xcodeproj 'project/TestB.xcodeproj'    end    target 'ipad' do
        platform :ios, '5.0'        pod 'Appirater'        xcodeproj 'project/TestC.xcodeproj'        end     target 'common' do        platform :ios, '5.0'        pod 'SBJson'        xcodeproj 'project/TestD.xcodeproj'     end    `</pre>
        </div>

    Cocoapods 0.35 增加source语法的声明，为了保持正确性以及0.37以后版本的兼容性，最好增加该语法声明

*   ###### 多个target中使用相同的Pods依赖库

    比如，名称为CocoaPodsTest的target和Second的target都需要使用Reachability、SBJson、AFNetworking三个Pods依赖库，可以使用link_with关键字来实现，将Podfile写成如下方式：

    <div class="highlighter-rouge"><pre class="highlight">`    link_with ‘CocoaPodsTest’, ‘Second’
        platform :ios
        pod ‘Reachability’,  ‘~&gt; 3.0.0′
        pod ‘SBJson’, ‘~&gt; 4.0.0′
        platform :ios, ‘7.0’
        pod ‘AFNetworking’, ‘~&gt; 2.0′
    `</pre>
    </div>

    这种写法就实现了CocoaPodsTest和Second两个target共用相同的Pods依赖库。

*   ###### 不同的target使用完全不同的Pods依赖库 CocoaPodsTest这个target使用的是Reachability、SBJson、AFNetworking三个依赖库，但Second这个target只需要使用OpenUDID这一个依赖库，这时可以使用target关键字，Podfile的描述方式如下：
        <div class="highlighter-rouge"><pre class="highlight">`target :’CocoaPodsTest’ do
    platform :ios
    pod ‘Reachability’,  ‘~&gt; 3.0.0′
    pod ‘SBJson’, ‘~&gt; 4.0.0′
    platform :ios, ‘7.0’
    pod ‘AFNetworking’, ‘~&gt; 2.0′
    end
    target :’Second’ do
    pod ‘OpenUDID’, ‘~&gt; 1.0.0′
    end
    `</pre>
        </div>
    其中，do/end作为开始和结束标识符。

    ## 常用用法

*   编写好Podfile后，在文件所在的目录下执行:

    `pod install`

    如果想详细查看安装记录，可以执行：

    `pod --verbose install`

    同时还可以不更新repo，来加速安装依赖库的过程，当然前提是之前已经更新过repo:

    `pod --verbose --no-repo-update install`

*   如何查找最新spec的路径

    `pod spec which AFNetworking`

*   如何检查某个spec符合规范以及编译依赖正确
    `pod spec lint --verbose xxx.spec`
*   cocoapods 0.33以后都用json作为spec的描述方式，更容易用于数据共享，转换普通的spec文件为json格式
    `pod ipc spec xxx.spec`
*   如何检查某个spec库所有的spec是否符合规范以及依赖是否正确
    `pod lib lint --verbose`
*   如何移除pod工程 (需要安装cocoapods-deintegrate)
    `pod deintegrate`
*   如何清除pod工程、Podfile.lock (需要安装cocoapods-clean)
    `pod clean`
*   如何清除pod工程、Podfile.lock以及derived data (需要安装cocoapods-superdeintegrate)
    `pod superdeintegrate`

    ## 添加新Spec

*   如果没有对应源地址，可以在[gitlab](http://gitlab.alibaba-inc.com/)创建源代码管理地址, 点击[创建](http://gitlab.alibaba-inc.com/projects/new)将开始创建一个新项目
*   有了对应的源地址，可以开始编写spec文件.spec文件可以通过`pod spec create NAME`创建名为NAME的podspec文件，也可以自己手动编写. [spec语法参考](http://guides.cocoapods.org/syntax/podspec.html)
*   编写完以后，可以用`pod spec lint NAME`来检查spec文件正确性以及是否存在编译问题

    样例： 例1： 对EGOTableViewPullRefresh开源代码作了修改变更，先在[gitlab](http://gitlab.alibaba-inc.com/)上创建源代码[TmallEGOTableViewPullRefresh](http://gitlab.alibaba-inc.com/shijie.qinsj/tmallegotableviewpullrefresh)，然后在[aliPods](http://gitlab.alibaba-inc.com/alipods/specs)中添加源代码及其资源文件

    <div class="highlighter-rouge"><pre class="highlight">`  Pod::Spec.new do |s|
      s.name         = "TmallEGOTableViewPullRefresh"
      s.version      = "1.0.0"
      s.summary      = "天猫客户端基于EGOTableViewPullRefresh作了改造"

      s.description  = &lt;&lt;-DESC
                        天猫客户端基于EGOTableViewPullRefresh作了改造
                       DESC

      s.homepage     = "http://gitlab.alibaba-inc.com/shijie.qinsj/tmallegotableviewpullrefresh"

      s.license       = { :type =&gt; 'Apache License, Version 2.0', :file =&gt; 'LICENSE.txt' }

      s.author       = { "shijie.qinsj" =&gt; "shijie.qinsj@aliyun-inc.com" }

      s.platform     = :ios
      s.ios.deployment_target = '5.0'

      s.source       = {:git=&gt;"git@gitlab.alibaba-inc.com:shijie.qinsj/tmallegotableviewpullrefresh.git", :tag =&gt; "#{s.version}" }

      s.source_files = 'EGOTableViewPullRefresh/Classes/View/*.{h,m}'

      s.resources    = 'EGOTableViewPullRefresh/Resources/*.png'

      s.framework    = 'QuartzCore'

    end
    `</pre>
    </div>

    如果在执行`pod spec lint NAME`遇到无法通过检查, 可以增加参数`--verbose`来查看详细的执行过程日志

    <div class="highlighter-rouge"><pre class="highlight">` -&gt; EGOTableViewPullRefresh (0.1.0)
        - WARN  | Git sources should specify a tag.
        - WARN  | [iOS] Unable to find a license file

    Analyzed 1 podspec.
    `</pre>
    </div>

    以上错误是因为有git获取的时候不是以tag的方式获取代码，第二错误是因为没有在源中找到许可证文件，这两个错误只是开源规范性的问题，你可以提交一个License.txt文件到根目录下就能够正常通过检测了

    提交完成spec，在本地执行`pod repo update`更新本地spec库

    <div class="highlighter-rouge"><pre class="highlight">`    dolphinuxtekiMacBook-Pro:1.0.0 dolphinux$ pod repo update
    Updating spec repo `alibaba`
    Updating 3a0fa5d..53ee557

    Fast-forward

     README.md                                          | 15 +++++++++---

     .../1.0.0/TmallEGOTableViewPullRefresh.podspec     | 28 ++++++++++++++++++++++

     2 files changed, 40 insertions(+), 3 deletions(-)

     create mode 100644 TmallEGOTableViewPullRefresh/1.0.0/TmallEGOTableViewPullRefresh.podspec
    From http://gitlab.alibaba-inc.com/alipods/specs

       3a0fa5d..53ee557  master     -&gt; origin/master
    Updating spec repo `master`
    Updating d15f77b..311b919

    Fast-forward

     EMSideMenu/1.0.0/EMSideMenu.podspec                | 18 ++++++++

     EPChecker/1.0.0/EPChecker.podspec                  | 11 +++++

     FXLabel/1.5.5/FXLabel.podspec                      | 12 +++++

     FXLabel/1.5.6/FXLabel.podspec                      | 12 +++++

     Firebase/1.1.0/Firebase.podspec                    | 15 +++++++

     .../1.0.1/JCKeyPathValidator.podspec               | 15 +++++++

     .../1.4.5/JDStatusBarNotification.podspec          | 20 +++++++++

     LDScrollViewForm/0.2.0/LDScrollViewForm.podspec    | 14 ++++++

     LLARateLimiter/0.1.0/LLARateLimiter.podspec        | 13 ++++++

     LayoutKit/0.2.1/LayoutKit.podspec                  | 27 +++++++++++

     MDRadialProgress/1.0.1/MDRadialProgress.podspec    | 14 ++++++

     MHDismissModalView/1.3/MHDismissModalView.podspec  | 18 ++++++++

     MKFoundationKit/0.4.0/MKFoundationKit.podspec      | 26 +++++++++++

     MSWeakTimer/1.1.0/MSWeakTimer.podspec              |  4 +-

     OpenTokSDK-WebRTC/2.1.7/OpenTokSDK-WebRTC.podspec  | 28 ++++++++++++

     PNChart/0.2.2/PNChart.podspec                      | 20 +++++++++

     PayPalMPL/2.1.0/PayPalMPL.podspec                  | 25 +++++++++++

     QBPopupMenu/2.0/QBPopupMenu.podspec                | 13 ++++++

     QuickDialog/0.9.1/QuickDialog.podspec              | 25 +++++++++++

     SQAESDE/0.1/SQAESDE.podspec                        |  1 +

     .../1.0.0/SQKPieProgressView.podspec               | 22 +++++++++

     SnappySlider/0.0.1/SnappySlider.podspec            | 29 ++++++++++++

     .../1.0.0/TMPTaskCompletionManager.podspec         | 12 +++++

     .../0.1.0/TSValidatedTextField.podspec             | 15 +++++++

     .../0.1.0/UIFontWDCustomLoader.podspec             | 20 +++++++++

     UITextSubClass/0.0.4/UITextSubClass.podspec        | 52 ++++++++++++++++++++++

     .../UzysCircularProgressPullToRefresh.podspec      | 18 ++++++++

     .../1.0.2/WTAZoomNavigationController.podspec      | 12 +++++

     ZKSforce/29/ZKSforce.podspec                       | 16 +++++++

     nanopb/0.2.4/nanopb.podspec                        | 36 +++++++++++++++

     30 files changed, 561 insertions(+), 2 deletions(-)

     create mode 100644 EMSideMenu/1.0.0/EMSideMenu.podspec

     create mode 100644 EPChecker/1.0.0/EPChecker.podspec

     create mode 100644 FXLabel/1.5.5/FXLabel.podspec

     create mode 100644 FXLabel/1.5.6/FXLabel.podspec

     create mode 100644 Firebase/1.1.0/Firebase.podspec

     create mode 100644 JCKeyPathValidator/1.0.1/JCKeyPathValidator.podspec

     create mode 100644 JDStatusBarNotification/1.4.5/JDStatusBarNotification.podspec

     create mode 100644 LDScrollViewForm/0.2.0/LDScrollViewForm.podspec

     create mode 100644 LLARateLimiter/0.1.0/LLARateLimiter.podspec

     create mode 100644 LayoutKit/0.2.1/LayoutKit.podspec

     create mode 100644 MDRadialProgress/1.0.1/MDRadialProgress.podspec

     create mode 100644 MHDismissModalView/1.3/MHDismissModalView.podspec

     create mode 100644 MKFoundationKit/0.4.0/MKFoundationKit.podspec

     create mode 100644 OpenTokSDK-WebRTC/2.1.7/OpenTokSDK-WebRTC.podspec

     create mode 100644 PNChart/0.2.2/PNChart.podspec

     create mode 100644 PayPalMPL/2.1.0/PayPalMPL.podspec

     create mode 100644 QBPopupMenu/2.0/QBPopupMenu.podspec

     create mode 100644 QuickDialog/0.9.1/QuickDialog.podspec

     create mode 100644 SQKPieProgressView/1.0.0/SQKPieProgressView.podspec

     create mode 100644 SnappySlider/0.0.1/SnappySlider.podspec

     create mode 100644 TMPTaskCompletionManager/1.0.0/TMPTaskCompletionManager.podspec

     create mode 100644 TSValidatedTextField/0.1.0/TSValidatedTextField.podspec

     create mode 100644 UIFontWDCustomLoader/0.1.0/UIFontWDCustomLoader.podspec

     create mode 100644 UITextSubClass/0.0.4/UITextSubClass.podspec

     create mode 100644 UzysCircularProgressPullToRefresh/1.0.3/UzysCircularProgressPullToRefresh.podspec

     create mode 100644 WTAZoomNavigationController/1.0.2/WTAZoomNavigationController.podspec

     create mode 100644 ZKSforce/29/ZKSforce.podspec

     create mode 100644 nanopb/0.2.4/nanopb.podspec
    From https://github.com/CocoaPods/Specs
        d15f77b..311b919  master     -&gt; origin/master
    `</pre>
    </div>

    更新完成就可以通过`pod search TmallEGOTableViewPullRefresh`搜索到本地库，TmallEGOTableViewPullRefresh就可以在工程中引用了

    <div class="highlighter-rouge"><pre class="highlight">`dolphinuxtekiMacBook-Pro:1.0.0 dolphinux$ pod search TmallEGOTableViewPullRefresh

    -&gt; TmallEGOTableViewPullRefresh (1.0.0)
       天猫客户端基于EGOTableViewPullRefresh作了改造
       pod 'TmallEGOTableViewPullRefresh', '~&gt; 1.0.0'
       - Homepage: http://gitlab.alibaba-inc.com/shijie.qinsj/tmallegotableviewpullrefresh
       - Source:   git@gitlab.alibaba-inc.com:shijie.qinsj/tmallegotableviewpullrefresh.git
       - Versions: 1.0.0 [alibaba repo]
    `</pre>
    </div>

    例2： 接入第三方静态库, 以新浪weibo为例

    <div class="highlighter-rouge"><pre class="highlight">`Pod::Spec.new do |s|
      s.name = 'sinaweibosdk'
      s.version = '2.4.0'
      s.summary = 'Sina Weibo Sdk.'
      s.description = 'Sina Weibo Official Sdk '
      s.homepage = 'https://github.com/sinaweibosdk/weibo_ios_sdk'
      s.license = {
        :type =&gt; 'Copyright',
        :text =&gt; &lt;&lt;-LICENSE
            Sina copyright
        LICENSE
      }
      s.author = '.'

      s.source = { :git=&gt;'https://github.com/sinaweibosdk/weibo_ios_sdk.git',:tag=&gt;'2.4.0'}
      s.platform = :ios
      s.source_files  = "libWeiboSDK/*.{h,m}"
      s.resource_bundle    = { "Weibo" =&gt; "libWeiboSDK/WeiboSDK.bundle" }
      s.vendored_libraries = "libWeiboSDK/libWeiboSDK.a"
    end
    `</pre>
    </div>

    例3：接入来往SDK

    <div class="highlighter-rouge"><pre class="highlight">`Pod::Spec.new do |s|
      s.name = 'LaiWangSDK'
      s.version = '1.0.0'
      s.summary = '阿里巴巴集团来往客户端SDK官方源'
      s.description = '来往客户端SDK集成了分享、授权验证等功能'
      s.homepage = 'http://gitlab.alibaba-inc.com/shijie.qinsj/laiwangsdk'
      s.license = {
        :type =&gt; 'Copyright',
        :text =&gt; &lt;&lt;-LICENSE
               Alibaba-INC copyright
        LICENSE
      }
      s.author = 'shijie.qinsj@aliyun-inc.com'

      s.platform = :ios

      s.source = {
                    :git=&gt;"git@gitlab.alibaba-inc.com:shijie.qinsj/laiwangsdk.git",
                    :tag =&gt; "#{s.version}"
                    }

      s.source_files  = "*.{h,m}"
      s.vendored_libraries = "libLWApiSDK.a"
    end
    `</pre>
    </div>

    例4:火眼Framework接入，依赖OpenCV与TBSCanLib，并且有一个Bundle资源

    <div class="highlighter-rouge"><pre class="highlight">`  Pod::Spec.new do |s|
      s.name = 'HuoYanSDK'
      s.version = '1.1.0'
      s.summary = '淘宝火眼SDK'
      s.description = '淘宝火眼集成扫码、条码分享等功能'
      s.homepage = 'http://gitlab.alibaba-inc.com/shijie.qinsj/alipaysdk'
      s.license = {
        :type =&gt; 'Copyright',
        :text =&gt; &lt;&lt;-LICENSE
                  Tencent copyright
        LICENSE
      }
      s.author = 'shijie.qinsj@aliyun-inc.com'

      s.platform = :ios

      framework_path = 'HuoYan/huoyan.framework'
      bundle_path = "HuoYan"
      s.source = {
                    :git=&gt;"git@gitlab.alibaba-inc.com:shijie.qinsj/alipaysdk.git",
                    :tag =&gt; "#{s.version}"
                    }

      s.source_files = "#{framework_path}/Versions/A/Headers/*.h"
      s.resource = "#{bundle_path}/huoyan.bundle"  

      s.preserve_paths = framework_path

      s.header_dir = 'HuoYan'

      s.frameworks = "huoyan"

      s.dependency  "OpenCV"
      s.dependency "TBScanLib"
      s.xcconfig = { 'FRAMEWORK_SEARCH_PATHS' =&gt; '$(PODS_ROOT)/HuoYanSDK/HuoYan/' }

    end

</div>