# HTML5

## 目录

1. [语义化标签](#语义化标签)
1. [data-](#data-)
1. [浏览器自带的存储工具](#浏览器自带的存储工具)
1. [canvas画布小bug](#canvas画布小bug)

## 语义化标签

[返回目录](#目录)

优点:

1. 方便爬虫抓取更多有效信息,也就更容易从搜索引擎获得有效的消息;因为爬虫是依赖于标签来确定上下文和各个关键字的权重
2. 在没有CSS的情况下也能呈现较好的内容结构与代码结构
3. 良好的用户体验(例如title,alt用于解释名词或者解释图片),label标签的活用(bootstrap输入邮箱的label for)
4. 方便其他设备解析(如屏幕阅读器,盲人阅读器,移动设备)以意义的方式来渲染网页
5. 便于团队开发和维护,语义化更具可读性,是下一步吧网页的重要动向,遵循W3C标准的团队都遵循这个标准,可以减少差异化

~~~html
<!-- 新增的语义化标签 -->

<section></section>
<!-- 定义文档中的主体部分的一节或一段 -->

<article></article>
<!-- 一个特殊的section标签,比section有更明确的语义;定义来自外部的一个独立的,完整的内容块,例如什么论坛的文章,博客的文本 -->

<aside></aside>
<!-- 用来装载页面中非正文的内容,独立于其他模块;例如广告,成组的链接,侧边栏 -->

<header></header>
<!-- 定义文档页面的页眉,通常是一些引导和导航信息,不局限于整个页面头部,也可以用在内容里 -->

<footer></footer>
<!-- 定义了文档页面的页脚,和header类似 -->

<nav></nav>
<!-- 定义了一个链接组组成的导航部分,其中的链接可以链接到其他网页或者当前页面的其他部分 -->

<hgroup></hgroup>
<!-- 用于对网页或区段(section)的标题元素(h1~h6)进行组合 -->

<figure></figure>
<!-- 用于对元素进行组合 -->

<figcaption></figcaption>
<!-- 为figure元素加标题;一般放在figure第一个子元素或者最后一个 -->

<details></details>
<!-- 定义元素的细节,用于可以点击查看或隐藏 -->

<summary></summary>
<!-- 和details连用,用来定义details标题 -->

<canvas></canvas>
<!-- 进行canvas绘图 -->

<audio></audio>
<!-- 定义音频 -->

<video></video>
<!-- 定义视频 -->

<embed src="">
<!-- 用来插入各种多媒体或插件 -->

<datalist></datalist>
<!-- 定义可选数据的列表,与input配合使用可制作输入值的下拉列表 -->

<mark></mark>
<!-- 视觉上向用户展现出那些想要突出的文字,比如搜索结果中向用户高亮显示搜索关键词 -->

<meter [min/max/low/high/optimum/value]></meter>
<!-- 度量衡,用红黄绿表示出一个数值所在范围 -->

<progress></progress>
<!-- 进度条 -->

<output></output>
<!-- 定义不同的输出类型,样式与span一样 -->

<time></time>
<!-- 定义日期时间 -->
~~~

## data-

[返回目录](#目录)

用于存储页面或应用程序的私有自定义数据,能在所有`HTML`元素上嵌入自定义`data`属性;这些存储的数据能被`Javascript`使用,不会进行`Ajax`调用或服务端数据库查询;用户代理会忽略前缀为`data-`的自定义属性

`dataset`属性存取`data-`属性值(dataset是H5中JS API的一部分,用来返回一个包含选择元素的所有data-属性的DOMStringMap对象;使用dataset时,只写data-后面的属性值;如果data-后面包含了连字符,需要用驼峰命名法)

~~~html
<input id='username' data-age='23'>
~~~

~~~js
//setAttribute getAttribute
var username = document.getElementById('username');
username.setAttribute ('blog', 'http://blog.csdn.net/zhouziyu2011');
alert(username.getAttribute('age'));
alert(username.getAttribute('blog'));
//dataset
var username = document.getElementById('username');
username.dataset.dataOfBirth = '1993-12-06';
alert(username.dataset.dateOfBirth);
//jQuery属性选择器
$("input[data-age]").css("background","red");
//css属性选择器
input[data-age] {
  background:red;
}
~~~

## 浏览器自带的存储工具

[返回目录](#目录)

- webStorage是H5引入的一个重要的功能,在前端开发的过程中会经常用到,它可以在客户端本地存储数据,类似cookie,但其功能却比cookie强大的多
- cookie的大小只有4Kb左右(浏览器不同,大小也不同)
- webStorage的大小有5MB;其API提供的方法有以下几种:

1. setItem (key, value) ——  保存数据,以键值对的方式储存信息
2. getItem (key) ——  获取数据,将键值传入,即可获取到对应的value值
3. removeItem (key) ——  删除单个数据,根据键值移除对应的信息
4. clear () ——  删除所有的数据
5. key (index) —— 获取某个索引的key

- localStorage的生命周期是永久性的;假若使用localStorage存储数据,即使关闭浏览器,也不会让数据消失,除非主动的去删除数据;localStorage有length属性,可以查看其有多少条记录的数据

  使用方法如下:

~~~js
var storage = null;  
  if(window.localStorage){              //判断浏览器是否支持localStorage  
    storage = window.localStorage;
    storage.setItem("name", "Rick");    //调用setItem方法,存储数据  
    alert(storage.getItem("name"));     //调用getItem方法,弹框显示 name 为 Rick  
    storage.removeItem("name");     //调用removeItem方法,移除数据  
    alert(storage.getItem("name"));   //调用getItem方法,弹框显示 name 为 null  
}
~~~

- sessionStorage的生命周期是在浏览器关闭前;sessionStorage也有length属性,其基本的判断和使用方法和localStorage的使用是一致的

  有以下特点:

  页面刷新不会消除数据;只有在当前页面打开的链接才可以访问`sessionStorage`的数据;使用`window.open`打开页面和改变`localtion.href`方式都可以获取到`sessionStorage`内部的数据

## canvas画布小bug

[返回目录](#目录)

`canvas`画布在页面中有`display:none`属性值时,某些`canvas`的相应`JS`不会加载

例如页面中含有导航栏时,每个导航栏下都有canvas需要加载,但是只会加载fade in active的导航栏,其余页面的canvas不会进行加载

以下为解决方法

~~~html
<div>
  <ul id="myTab" class="nav nav-tabs">
      <li class="active" id="tab111">
        <a href="#tab_1" data-toggle="tab">按年级统计</a>
      </li>
      <li>
        <a href="#tab_2" data-toggle="tab">所在地分布统计</a>
      </li>
      <li>
        <a href="#tab_3" data-toggle="tab">按学生属性统计</a>
      </li>
  </ul>
</div>
~~~

~~~js
$('tab111').siblings().eq(0).on('click', function() {
  // 选中id为tab111的导航栏,并且选中他的第一个兄弟节点,也就是上面的#tab_2
  if(!this.abc) {
    this.abc = this.abc || true;
    setTimeout(function() {
      chart3Handler();  
      // 此处为canvas的初始化加载函数
    }, 500)
  }
})
$('tab111').siblings().eq(1).on('click', function() {
  if(!this.abcd) {
    this.abcd = this.abcd || true;
    setTimeout(function () {
      chart3oneHandler();
      chart3twoHandler();
      chart3thrHandler();
      chart3fouHandler();
      chart3fivHandler();
      chart3sixHandler();
    }, 500)
  }
})
~~~