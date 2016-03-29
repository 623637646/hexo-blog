---
title: JS的懒加载
tags:
  - JS Github 开源
  - JS
date: 2015-11-21 08:00:00
---

### 推荐几款开源代码，用于页面图片（甚至iframe）的懒加载

## [**jquery_lazyload**](https://github.com/tuupola/jquery_lazyload)

jquery的插件，依赖jquery。用于对img标签的懒加载

### 引用：

<div class="highlighter-rouge">

    &lt;script src="jquery.js"&gt;&lt;/script&gt;
    &lt;script src="jquery.lazyload.js"&gt;&lt;/script&gt;
    `</pre>
    </div>

    ### img的src写到data-original里，并给它一个lazy的class：

    <div class="highlighter-rouge"><pre class="highlight">`&lt;img class="lazy" data-original="img/example.jpg" width="640" height="480"&gt;
    `</pre>
    </div>

    ### 最后：

    <div class="highlighter-rouge"><pre class="highlight">`$(document).ready(function(){
    	$(function() {
        	$("img.lazy").lazyload();
    	});
    });

</div>

### 好的，大功告成！

## [**layzr.js**](https://github.com/callmecavs/layzr.js)