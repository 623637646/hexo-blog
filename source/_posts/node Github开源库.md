---
title: node Github开源库
categories:
  - node
tags:
  - node
  - github
  - 开源
  - nodejs
  - js
date: 2016-08-25 00:00:00
layout: post_github
data_github: [
	{
		keywords: [node],
		projects: [
			{
				user: "nodejs",
				repo: "node",
				description: "Node.js JavaScript runtime ✨🐢🚀✨ https://nodejs.org",
				wiki: [
					{
						title: "runoob.com",
						link: "http://www.runoob.com/nodejs/nodejs-tutorial.html"
					},
          {
            title: "node-deploy-practice",
            link: "http://i5ting.github.io/node-deploy-practice/#107"
          },
				],
			},
			{
				user: "creationix",
				repo: "nvm",
				description: "node版本控制器",
			},
			{
				user: "socketio",
				repo: "socket.io",
				description: "node实现WebSockets",
			}
		]
	},
	{
		keywords: [框架],
		projects: [
			{
				user: "expressjs",
				repo: "express",
				description: "web framework for node.",
				wiki: [
					{
						title: "中文官网",
						link: "http://www.expressjs.com.cn/"
					},
				],
			},
			{
				user: "sahat",
				repo: "hackathon-starter",
				description: "NodeJS Web开发脚手架",
				wiki: [
					{
						title: "github主页翻译",
						link: "http://idlelife.org/archives/491"
					},
				],
			},
			{
				user: "balderdashy",
				repo: "sails",
				description: "express升级版,Sails is built on Node.js, Connect, Express, and Socket.io.",
				wiki: [
					{
						title: "Node 框架之sails",
						link: "https://cnodejs.org/topic/555c3c82e684c4c8088a0ca1"
					},
					{
						title: "为什么使用Sails？",
						link: "https://cnodejs.org/topic/553c7b4a1a6e36a27780ee65"
					},
					{
						title: "利用Sails.js+MongoDB开发博客系统",
						link: "http://yoyoyohamapi.me/categories/%E5%88%A9%E7%94%A8Sails-js-MongoDB%E5%BC%80%E5%8F%91%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F/"
					},
					{
						title: "Demo",
						link: "https://github.com/irlnathan/activityoverlord20"
					},
				],
			},
      {
        user: "meteor",
        repo: "meteor",
        description: "Meteor 是一个构建在 Node.js 之上的平台，用来开发实时网页程序。Meteor 位于程序数据库和用户界面之间，保持二者之间的数据同步更新。",
        wiki: [
          {
            title: "为什么是Meteor",
            link: "http://tchen.me/posts/2012-12-16-why-meteor.html"
          },
          {
            title: "Meteor基础入门",
            link: "http://tchen.me/posts/2012-12-21-meteor-basics.html"
          },
          {
            title: "Meteor.js 是什么？",
            link: "https://www.zhihu.com/question/20296322"
          },
          {
            title: "Discover Meteor 中文版",
            link: "http://zh.discovermeteor.com/"
          },
          {
            title: "Meteor 中文文档",
            link: "http://docs.meteorhub.org/"
          },
          {
            title: "M1 Meteor Hybrid Development - iOS",
            link: "https://zhuanlan.zhihu.com/p/20441825?columnSlug=computercoil"
          },
          {
            title: "M2 Meteor Hybrid Development - iOS - 2",
            link: "https://zhuanlan.zhihu.com/p/20447236"
          },
        ],
      },
		]
	},
	{
		keywords: [服务器],
		projects: [
			{
				user: "Unitech",
				repo: "pm2",
				description: "node的负载均衡部署，pm2是Node.js下的生产环境进程管理工具，就是我们常说的进程守护工具。 可以用来在生产环境中进行自动重启、日志记录、错误预警等等",
				wiki: [
					{
						title: "使用PM2将Node.js的集群变得更加容易",
						link: "http://www.cnblogs.com/jaxu/p/5193643.html"
					},
          {
            title: "使用pm2管理Node.js应用",
            link: "http://harttle.com/2016/09/07/pm2-express.html"
          },
				],
			},
      {
        user: "foreverjs",
        repo: "forever",
        description: "forever可以看做是一个nodejs的守护进程，能够启动，停止，重启我们的app应用。(建议使用PM2)",
        wiki: [
          {
            title: "node js 进程守护神forever",
            link: "http://blog.csdn.net/jbboy/article/details/35281225"
          },
        ],
      },
			{
				user: "remy",
				repo: "nodemon",
				description: "代码改动时自动重启Node.js服务",
			},
		]
	},
	{
		keywords: [debug],
		projects: [
			{
				user: "node-inspector",
				repo: "node-inspector",
				description: "基于Chrome开发者工具的Node.js调试器",
			},
		]
	},
  {
    keywords: [工具],
    projects: [
      {
        user: "bower",
        repo: "bower",
        description: "包,代码管理工具",
        imgs: [
          "https://camo.githubusercontent.com/8a2024183152023c85dc7124365c1afb721450a4/687474703a2f2f626f7765722e696f2f696d672f626f7765722d6c6f676f2e706e67",
        ]
      },
      {
        user: "gruntjs",
        repo: "grunt",
        description: "一句话：自动化。对于需要反复重复的任务，例如压缩（minification）、编译、单元测试、linting等，自动化工具可以减轻你的劳动，简化你的工作。当你在 Gruntfile 文件正确配置好了任务，任务运行器就会自动帮你或你的小组完成大部分无聊的工作。",
        imgs: [
          "https://camo.githubusercontent.com/39242419c60a53e1f3cecdeecb2460acce47366f/687474703a2f2f6772756e746a732e636f6d2f696d672f6772756e742d6c6f676f2d6e6f2d776f72646d61726b2e737667",
        ],
        wiki: [
          {
            title: "中文官网",
            link: "http://www.gruntjs.net/"
          }
        ],
      },
      {
        user: "webpack",
        repo: "webpack",
        description: "WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用。",
        imgs: [
          "https://camo.githubusercontent.com/ebc085019011ababb0d35024824304831c7dc72a/68747470733a2f2f7765627061636b2e6769746875622e696f2f6173736574732f6c6f676f2e706e67",
        ],
        wiki: [
          {
            title: "入门Webpack，看这篇就够了",
            link: "http://www.jianshu.com/p/42e11515c10f#"
          },
          {
            title: "一小时包教会 —— webpack 入门指南",
            link: "http://www.w2bc.com/Article/50764"
          },
        ],
      }
    ]
  },
  {
    keywords: [桌面应用],
    projects: [
      {
        user: "nwjs",
        repo: "nw.js",
        description: "使用Node.js开发桌面级跨平台应用",
      },
      {
        user: "electron",
        repo: "electron",
        description: "搭建跨平台桌面应用，仅仅使用JavaScript,HTML以及CSS",
      },
    ]
  },
	{
		keywords: [其他],
		projects: [
			{
				user: "bluesmoon",
				repo: "node-geoip",
				description: "根据IP地址库的地理位置定位",
			}
		]
	}
]
---