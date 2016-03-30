---
title: iOS面试必备
categories:
  - iOS
tags:
  - iOS
  - 面试
date: 2015-11-28 08:00:00
---

## __常用框架，ios架构问题__

- AFNetworking	http请求
- ReactiveCocoa	响应式编程
- MagicalRecor	数据持久化
- 其他开源库的使用：CocoaPods，CocoaLumberjack，Masonry，TMCache，pop，SDWebImage，GPUImage，FLEX

## __多线程__
- GCD基于硬件的多核编程，抽象度低，接口简单，用于简单的多线程
- NSOperation（任务） 与 NSOperationQueue（线程池）。NSOperation 重写main方法，两个衍生： NSInvocationOperation 和 NSBlockOperation。高度抽象，用于复杂的多线程
- NSThread。通过初始化方法指定object和selector来执行。

## __ios delegate（委托，代理），protocol（协议）区别__
Delegate ，又称为 委托或代理， 把一个类自己需要做的一部分事情，让另一个类（也可以就是自己本身）来完成，而实际做事的类为delegate  
如：A对象持有B对象的弱引用，则B对象可以实现A对象的某些行为。A对象负责调用就可以。
类似于UITableView。  
protocol主要目标是提供接口给遵守协议的类使用。类似于java的接口。  
delegate通过protocol来实现

## __iOS类别(Category)与类扩展(Extension)__
- Category：不用继承对类添加方法 ， 不能添加变量
- Extension：没有命名的类别Category。 放在.m文件中@implementation的上方。可添加方法和变量。 私有属性写到类扩展

## __retain， assign， copy， weak ，strong，\_\_block，\_\_weak等关键字意思__
- assign： 简单赋值，不更改索引计数
- copy： 建立一个索引计数为1的对象，然后释放旧对象
- retain：释放旧的对象，将旧对象的值赋予输入对象，再提高输入对象的索引计数为1
- strong：强引用，引用计数+1。一旦最后一个strong型指针离去 ，这个对象将被释放，所有剩余的weak型指针都将被清除。
- weak：弱引用，不更改引用计数
- \_\_block不管是ARC还是MRC模式下都可以使用，可以修饰对象，还可以修饰基本数据类型。
- \_\_weak只能在ARC模式下使用，也只能修饰对象（NSString），不能修饰基本数据类型（int）。
- \_\_block对象可以在block中被重新赋值, \_\_weak不可以。
- \_\_weak 和assign 的区别在于，对象销毁 ，\_\_weak置为nil，而assign为野指针，\_\_weak更安全

## __iOS layer__
CALayer(层)是屏幕上的一个矩形区域，在每一个UIView中都包含一个根CALayer，在UIView上的所有视觉效果都是在这个Layer上进行的。  
他和UIView的区别是，只管绘制渲染。UIView是它的容器，UIView负责监听事件。 形象的比喻view是画板，layer是画布

## __app生命周期__
- willFinishLaunch     将要启动
- didFinishLaunch     启动完成
- DidBecomeActive     进入活动状态
- WillResignActive     将要进入非活动状态，在此期间，应用程序不接收消息或事件，比如来电话了
- DidEnterBackground     进入后台
- WillEnterForeground     将要回到前台
- WillTerminate     退出，销毁

- 启动程序  
1. willFinishLaunchingWithOptions
2. didFinishLaunchingWithOptions
3. applicationDidBecomeActive
- 按下home键  
1. applicationWillResignActive
2. applicationDidEnterBackground
- 双击home键，再打开程序  
1. applicationWillEnterForeground
2. applicationDidBecomeActive

## __内存问题解决方案__
- analyze 静态编译分析
- instruments 动态运行统计

## __线程间通信与进程间通信（IPC）__
- 线程间通信：performSelector
- 进程间通信： URL Schema就是iOS内的应用调用协议，应用A可以声明自定义的调用协议，就如http/https那样，当另一个应用B打算在应用内打开应用A时，可以打开使用A自定义的协议开头的URL来打开A，除了协议头，URL中还可以附加其他参数

## __runtime概念__
object-c的动态性，运行时修改对象的方法和特性。原理是oc的消息机制

## __runloop概念__
特殊的一个无限循环的线程， 它管理了其需要处理的事件和消息。

## __block，闭包的概念__
Block是对C语言的扩展，用来实现匿名函数的特性。相当于JavaScript的闭包。是一种代码块，将一段代码看做一个对象  
闭包就是能够读取其它函数内部变量的函数

## __viewcontroller 生命周期__
- viewDidLoad     视图加载完成
- viewWillAppear     视图即将可见
- viewDidAppear     视图可见
- viewWillDisappear     视图即将消失
- viewDidDisappear     视图消失

## __frame和 bounds 的 区别__
- frame：描述当前视图在其父视图中的位置和大小。
- bounds：描述当前视图在其自身坐标系统中的位置和大小。

## __数据结构__
- array（NSArray ）：数组集合
- dictionary（NSDictionary）：键值对
- set（ NSSet） ：无序列表
- 衍生的数据结构：可变array（ NSMutableArray），可变dictionary（ NSMutableDictionary）

## __ios内存异常，野指针__
对已经释放的对象进行操作会出现野指针，导致系统崩溃。xcode无法确定异常的代码位置。需要设置xcode，使得变量推迟释放，当出现野指针，会打印出log提示

## __id和NSObject的区别__
两个类型都含有Class isa，但NSObject同时包含了一些其它的方法，并需要实现NSObject协议。
所以NSObject\*可以用id来表示。但id不能用NSObject\*来表示。  
id就是一个指针，它可以指向的类型不仅限于NSObject。  
NSObject\*就是 NSObject类型的指针了，它范围较小。  
id<NSObject>是指针，它要求它指向的类型要实现NSObject protocol。

## __nil、Nil、NULL、NSNull的区别__
- nil：指向一个对象的空指针
- Nil：指向一个类的空指针
- NULL：指向其他类型（如：基本类型、C类型）的空指针
- NSNull：通常表示集合中的空值

## __NSString什么时候用copy，什么时候用strong__
对源头是NSMutableString的字符串，retain仅仅是指针引用，增加了引用计数器，这样源头改变的时候，用这种retain方式声明的变量（无论被赋值的变量是可变的还是不可变的），它也会跟着改变;而copy声明的变量，它不会跟着源头改变，它实际上是深拷贝。  
对源头是NSString的字符串，无论是retain声明的变量还是copy声明的变量，当第二次源头的字符串重新指向其它的地方的时候，它还是指向原来的最初的那个位置，也就是说其实二者都是指针引用，也就是浅拷贝。  
大部分的时候NSString的属性都是copy

## __响应者链(Responder Chain)__
UIWindow实例对象会首先在它的内容视图上调用hitTest:withEvent:，此方法会在其视图层级结构中的每个视图上调用pointInside:withEvent:（该方法用来判断点击事件发生的位置是否处于当前视图范围内，以确定用户是不是点击了当前视图），如果pointInside:withEvent:返回YES，则继续逐级调用，直到找到touch操作发生的位置，这个视图也就是要找的hit-test view。  
hitTest:withEvent:方法的处理流程如下:

1. 首先调用当前视图的pointInside:withEvent:方法判断触摸点是否在当前视图内；
2. 若返回NO,则hitTest:withEvent:返回nil;
3. 若返回YES,则向当前视图的所有子视图(subviews)发送hitTest:withEvent:消息，所有子视图的遍历顺序是从最顶层视图一直到到最底层视图，即从subviews数组的末尾向前遍历，直到有子视图返回非空对象或者全部子视图遍历完毕；
4. 若第一次有子视图返回非空对象，则hitTest:withEvent:方法返回此对象，处理结束；
5. 如所有子视图都返回非，则hitTest:withEvent:方法返回自身(self)。

具体教程：http://www.cnblogs.com/snake-hand/p/3178070.html

## __arc原理__
编译环境 自动在代码中加入了retain/release。

## __NSProxy概念__
Objective-C不支持多重继承，但是我们可以使用NSProxy的消息转发机制，来转发可由其它类的对象处理的任务，达成同样的目的。它是object-c实现代理模式的途径。AOP面向切面编程的解决方案。

## __aop概念__
面向切面编程，类似于ssh中的拦截器。降低了代码的耦合。

## __开发工具__
- gitlab                    git协作开发平台
- sourceTree            git图形用户界面
- teambition            团队协作工具

## __tcp/ip和socket__
- socket为底层套接字（数据链路层）
- ip是一种网络地址（网络层）
- tcp是基于ip的可靠地链接（运输层）
- udp是基于ip的快速不可靠连接（运输层）

## __rest api__
get put post delete。

- GET用来获取资源
- POST用来新建资源（也可以用于更新资源）
- PUT用来更新资源
- DELETE用来删除资源

## __开发流程__
需求分析，架构设计，编码，测试，维护

## __你需要问面试官的问题__
- 公司iOS人员架构
- 公司文化，加班文化
- 此次面试不足
- 薪水，其他福利，五险一金怎么缴纳