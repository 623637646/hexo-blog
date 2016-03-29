---
title: JS的懒加载
tags:
  - JS Github 开源
  - JS
date: 2015-11-21 08:00:00
---

推荐几款开源代码，用于页面图片（甚至iframe）的懒加载

## [**jquery_lazyload**](https://github.com/tuupola/jquery_lazyload)

jquery的插件，依赖jquery。用于对img标签的懒加载

### 引用：

	<script src="jquery.js"></script>
	<script src="jquery.lazyload.js"></script>

### img的src写到data-original里，并给它一个lazy的class：

	<img class="lazy" data-original="img/example.jpg" width="640" height="480">

### 最后：

	$(document).ready(function(){
		$(function() {
	    	$("img.lazy").lazyload();
		});
	});

### 好的，大功告成！

## [**layzr.js**](https://github.com/callmecavs/layzr.js)