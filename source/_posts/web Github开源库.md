---
title: web Github开源库
categories:
  - web
tags:
  - web
  - github
  - 开源
date: 2015-11-28 00:00:00

data_github: [
	{
		keywords: [bootstrap,UI层],
		projects: [
			{
				user: "twbs",
				repo: "bootstrap",
				description: "bootstrap中文网
				<br/>
				http://www.bootcss.com/
				",
			},
			{
				user: "FezVrasta",
				repo: "bootstrap-material-design",
				description: "bootstrap主题",
				imgs: [
					"https://github.com/FezVrasta/bootstrap-material-design/raw/master/demo/imgs/banner.jpg",
				]
			},
			{
				user: "designmodo",
				repo: "Flat-UI",
				description: "扁平化ui，bootstrap主题",
			},
			{
				user: "FortAwesome",
				repo: "Font-Awesome",
				description: "一套绝佳的图标字体库和CSS框架",
			},
		]
	},
	{
		keywords: [懒加载],
		projects: [
			{
				user: "tuupola",
				repo: "jquery_lazyload",
				description: "jQuery插件，依赖jQuery，只针对&lt;img&gt;的懒加载，有throttle功能",
			},
			{
				user: "callmecavs",
				repo: "layzr.js",
				description: "没有throttle功能！支持&lt;img&gt;",
			},
			{
				user: "aFarkas",
				repo: "lazysizes",
				description: "支持 img 和 iframe",
			},
		]
	},
	{
		keywords: [其他],
		projects: [
			{
				user: "mdo",
				repo: "github-buttons",
				description: "github按钮，可显示关注数量",
			},
			{
				user: "bower",
				repo: "bower",
				description: "包,代码管理工具",
				imgs: [
					"https://camo.githubusercontent.com/8a2024183152023c85dc7124365c1afb721450a4/687474703a2f2f626f7765722e696f2f696d672f626f7765722d6c6f676f2e706e67",
				]
			},
			{
				user: "i5ting",
				repo: "i5ting_ztree_toc",
				description: "markdown toc,markdown自动生成导航条",
				imgs: [
					"https://github.com/i5ting/i5ting_ztree_toc/raw/master/demo/3.png",
				]
			},
		]
	},
]
---
<script src="//cdn.bootcss.com/lazysizes/1.4.0/lazysizes.min.js"></script>
{% for data_item in data_github %}
	<h2 id="{{ data_item.keywords }}" style="text-align: center;">{{ data_item.keywords }}</h2>
	{% for project in data_item.projects %}
		<h3 id="{{ project.repo }}">
		<a href="//github.com/{{ project.user }}/{{ project.repo }}" target="_blank">{{ project.repo }}</a>
		<iframe data-src="https://ghbtns.com/github-btn.html?user={{ project.user }}&repo={{ project.repo }}&type=star&count=true" frameborder="0" scrolling="0" width="120px" height="20px" class="lazyload"></iframe>
		</h3>
		{{ project.description }}
		{% for img in project.imgs %}
			<img data-src="{{ img }}" class="lazyload" />
		{% endfor %}
		<!-- more -->
		<div class="post-eof"></div>
	{% endfor %}
{% endfor %}