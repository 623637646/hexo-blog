---
title: react-native之路
categories:
  - iOS
tags:
  - react-native
  - iOS
  - android
  - js
date: 2016-05-31 00:00:00
---

今天开始，踏上** [react-native](https://github.com/facebook/react-native#getting-started) **这条不归路。

# react-native 是啥？

facebook出品，必属精品。搞定了它，你就搞定了iOS+android。牛逼不牛逼。
将来，一定是**react-native**的天下。努力吧骚年。

# Examples

先运行官方的Examples看看效果嘛

## 下载

* `git clone https://github.com/facebook/react-native.git`
* `cd react-native && npm install`

我是连上VPN才clone完成的，好大的项目...

## 在iOS上运行

目录底下有**Examples**文件夹，挨个运行试试吧~
注意：当运行demo的时候，在电脑上会开启一个终端，它其实是个小型的服务器，模拟正常生产环境后台。
如果你用模拟器运行，没问题，如果使用真机运行。它会提示找不到服务器（见下图）。
{% asset_img 1.png %}
这时候，你只需要修改Example的源码，找到**AppDelegate.m**文件，在**didFinishLaunchingWithOptions**方法下找到
{% codeblock lang:objc %}
[NSURL URLWithString:@"http://localhost:8081/Examples/2048/Game2048.bundle?platform=ios&dev=true"];
{% endcodeblock %}
把`localhost`修改成你电脑的IP地址就好啦。

## 结束

至此，Examples应该可以跑通了吧。如果不行，去官网瞅瞅：** [react-native](https://github.com/facebook/react-native#getting-started) **

# 教程

[官方文档](http://facebook.github.io/react-native/docs/getting-started.html)

[中文官方文档](http://reactnative.cn/docs/0.26/getting-started.html)，如果英文好，还是看原版英文的吧。这个中文文档更新慢，错误多。。。

[react-native-guide](https://github.com/reactnativecn/react-native-guide)，大杂烩~~~

# 开发环境

google搜索“react native IDE”第一个就是他：[Deco](https://www.decosoftware.com/)，别问我为什么不用百度。
目前Deco还没有正式版本，并且功能比较少，不过我没见过比他还好的IDE了，谁让react-native太年轻了呢。很看好它。
具体安装和使用教程，点[这里](https://www.decosoftware.com/docs/getting-started)

------

持续更新中