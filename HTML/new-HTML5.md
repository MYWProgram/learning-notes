# H5 新特性

## 语义化标签

优点:

1. 方便爬虫抓取更多有效信息，也就更容易从搜索引擎获得有效的消息；因为爬虫是依赖于标签来确定上下文和各个关键字的权重
2. 在没有 CSS 的情况下也能呈现较好的内容结构与代码结构
3. 良好的用户体验(例如 title，alt 用于解释名词或者解释图片)，label 标签的活用(bootstrap 输入邮箱的 label for)
4. 方便其他设备解析(如屏幕阅读器，盲人阅读器，移动设备)以意义的方式来渲染网页
5. 便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化

```html
<!-- 新增的语义化标签 -->

<section></section>
<!-- 定义文档中的主体部分的一节或一段 -->

<article></article>
<!-- 一个特殊的section标签，比section有更明确的语义；定义来自外部的一个独立的，完整的内容块，例如什么论坛的文章，博客的文本 -->

<aside></aside>
<!-- 用来装载页面中非正文的内容，独立于其他模块；例如广告，成组的链接，侧边栏 -->

<header></header>
<!-- 定义文档页面的页眉，通常是一些引导和导航信息，不局限于整个页面头部，也可以用在内容里 -->

<footer></footer>
<!-- 定义了文档页面的页脚，和header类似 -->

<nav></nav>
<!-- 定义了一个链接组组成的导航部分，其中的链接可以链接到其他网页或者当前页面的其他部分 -->

<hgroup></hgroup>
<!-- 用于对网页或区段(section)的标题元素(h1~h6)进行组合 -->

<figure></figure>
<!-- 用于对元素进行组合 -->

<figcaption></figcaption>
<!-- 为figure元素加标题；一般放在figure第一个子元素或者最后一个 -->

<details></details>
<!-- 定义元素的细节，用于可以点击查看或隐藏 -->

<summary></summary>
<!-- 和details连用，用来定义details标题 -->

<canvas></canvas>
<!-- 进行canvas绘图 -->

<audio></audio>
<!-- 定义音频 -->

<video></video>
<!-- 定义视频 -->

<embed src="">
<!-- 用来插入各种多媒体或插件 -->

<datalist></datalist>
<!-- 定义可选数据的列表，与input配合使用可制作输入值的下拉列表 -->

<mark></mark>
<!-- 视觉上向用户展现出那些想要突出的文字，比如搜索结果中向用户高亮显示搜索关键词 -->

<meter [min/max/low/high/optimum/value]></meter>
<!-- 度量衡，用红黄绿表示出一个数值所在范围 -->

<progress></progress>
<!-- 进度条 -->

<output></output>
<!-- 定义不同的输出类型，样式与span一样 -->

<time></time>
<!-- 定义日期时间 -->
```

## data-

用于存储页面或应用程序的私有自定义数据，能在所有 HTML 元素上嵌入自定义 data 属性；这些存储的数据能被 Javascript 使用，不会进行 Ajax 调用或服务端数据库查询；用户代理会忽略前缀为`data-`的自定义属性

dataset 属性存取`data-`属性值(dataset 是 H5 中 JS API 的一部分，用来返回一个包含选择元素的所有 data-属性的 DOMStringMap 对象；使用 dataset 时，只写 data-后面的属性值；如果 data-后面包含了连字符，需要用驼峰命名法)

```html
<input id="username" data-age="23" />
```

```js
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
```

## 浏览器自带的存储工具

- webStorage 是 H5 引入的一个重要的功能，在前端开发的过程中会经常用到，它可以在客户端本地存储数据，类似 cookie，但其功能却比 cookie 强大的多
- cookie 的大小只有 4Kb 左右(浏览器不同，大小也不同)
- webStorage 的大小有 5MB；其 API 提供的方法有以下几种:

1. setItem (key， value) —— 保存数据，以键值对的方式储存信息
2. getItem (key) —— 获取数据，将键值传入，即可获取到对应的 value 值
3. removeItem (key) —— 删除单个数据，根据键值移除对应的信息
4. clear () —— 删除所有的数据
5. key (index) —— 获取某个索引的 key

- localStorage 的生命周期是永久性的；假若使用 localStorage 存储数据，即使关闭浏览器，也不会让数据消失，除非主动的去删除数据；localStorage 有 length 属性，可以查看其有多少条记录的数据

  使用方法如下:

```js
var storage = null;
if (window.localStorage) {
  //判断浏览器是否支持localStorage
  storage = window.localStorage;
  storage.setItem("name", "Rick"); //调用setItem方法，存储数据
  alert(storage.getItem("name")); //调用getItem方法，弹框显示 name 为 Rick
  storage.removeItem("name"); //调用removeItem方法，移除数据
  alert(storage.getItem("name")); //调用getItem方法，弹框显示 name 为 null
}
```

- sessionStorage 的生命周期是在浏览器关闭前；sessionStorage 也有 length 属性，其基本的判断和使用方法和 localStorage 的使用是一致的

  有以下特点:

  页面刷新不会消除数据；只有在当前页面打开的链接才可以访问 sessionStorage 的数据；使用`window.open`打开页面和改变`localtion.href`方式都可以获取到 sessionStorage 内部的数据
