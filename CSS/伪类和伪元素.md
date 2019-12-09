# 伪类和伪元素

## 伪类

以单冒号（:）开头，需要注意的是伪类始终指代所依附的元素而不是后代元素；下面是一些常见的伪类：

### 结构伪类

#### 选择根元素

`:root` -> 选择文档的根元素。

在 HTML 中根元素就是 HTML ，只有在 XML 语言中会有所不同。

需要注意的是 `:root` 权重高于 HTML 选择器。

![Pseudo classes（elements）-1.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g82gb1039lj20gw06cmxl.jpg)

#### 选择空元素

`:empty` -> 选择没有任何子代的元素，甚至连文本节点也没有（元素内有空格或者回车例外）。

通常用于判断用于判断子元素为组件模块是否有效。如果本元素样式含有 `margin` `padding` 等影响页面布局的样式，如果组件无效为空，作为组件的盒子样式可以通过这个伪类使它变得无效。

就像下面的例子一样，如果 templates 组件无效的时候，那么就相当于外层 div 没有了子代，这时通过 `:empty` 选中之后就可以完全隐藏这个影响页面样式的 div 。

```html
<div class="empty" style="margin-top:20px;padding:20px;border:20px green solid;background:red">
  <templates v-if="false">组件</templates>
</div>

<style>
.empty:empty{
  display:none;
}
</style>
```

#### 选择唯一子元素

`:only-child` 与 `:only-of-type` ，二者都是选中元素中的唯一元素；前者选中的是唯一的子元素，也就是说父元素中没有其他子元素了；后者是如果父节点中没有相同类型的其他子节点，那么会被选中。

参考下面得例子详细了解：

```html
<div class="only">
  <p>样式一</p>
  <div>样式二</div>
</div>

<style>
  .only p:only-child{
    color:red;
  }
  .only div:only-of-type{
    color:green;
  }
</style>
```

![Pseudo classes（elements）- 2.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85l1s3fglj205603wjrb.jpg)

#### 选择第一个和最后一个子元素

选择第一个子元素：`:first-child` 和 `:first-of-type` 。

选择最后一个子元素：`:last-child` 和 `:last-of-type` 。

PS. `:only-child` 和 `:only-of-type` 可以借助上面两个来实现：

```css
:only-child {
  style
}
/* 等同于 */
:first-child:last-child {
  style
}

:only-of-type {
  style
}
/* 等同于 */
:first-of-type:last-of-type {
  style
}
```

#### 选择第 n 个子元素或者某种子元素

`:nth-child(an+b)` 和 `nth-of-type(an+b)` ，首先查找当前所有匹配的兄弟元素，而 `nth-last-child(an+b)` 和 `nth-last-of-type(an+b)` 用法与前两个一致，不过查找是倒叙开始的。

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
  <li>6</li>
  <li>7</li>
  <li>8</li>
</ul>

<style>
  li:nth-child(4n + 1) {
    color: orange;
  }
  li:nth-of-type(4n + 2) {
    color: red;
  }
  li:nth-last-child(4n + 1) {
    color: green;
  }
  li:nth-last-of-type(4n + 2) {
    color: blue;
  }
</style>
```

![Pseudo classes（elements）- 3.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85m5vya2ij206605ma9u.jpg)

### 否定伪类

#### 选择不匹配的元素

`:not()` 不能嵌套（后面的括号中不能再写一个 `:not()`），可以串联使用。

利用这个伪类，可以简写一些代码；如下面选择列表中最后一项没有样式：

```html
<ul>
  <li>首页</li>
  <li>新闻</li>
  <li>关于</li>
  <li>分享</li>
  <li>联系</li>
</ul>

<style>
  li{
    border-bottom:1px solid blue
  }
  li:last-child{
    border-bottom:0;
  }
  /* 等同于 */
  li:not(:last-child){
    border-bottom:1px solid blue
  }
</style>
```

### 其他伪类

#### 修饰链接或可交互元素的样式

下面五个伪类通常需要遵循以下顺序：`:link -> :visited -> :hover -> :active` ；而 `:focus` 伴随 `:link` 出现。

`:link` -> 会选中所有未被访问的链接，包括那些已经给定了其他伪类选择器的链接，如: `:hover、:active、:visited` 。

`:visited` -> 选中用户已访问过的链接。

`:hover` -> 匹配用户虚指（未被激活）的元素，也就是鼠标指上去但是没有点击的。

`:active` -> 匹配被用户激活的元素；鼠标交互时点下按键和抬起按键之间的时间。

`:focus` -> 匹配获得焦点的元素。

#### 启用或选中状态的伪类

`:checked` -> 表示任何处于选中状态的 `radio` 和 `checkbox`，还有 select 选中的 option 。

`:enabled` -> 匹配被启用的元素。

`:disable` -> 匹配未被启用的元素。

#### 表单验证的伪类

`:valid` 和 `invalid` 匹配是否通过 pattern 验证的元素。

pattern 是 H5 中 `input` 的新属性，是一段用于检验输入值的正则表达式；下面的例子效果是当通过输入验证之后才会显示提交按钮：

```html
<div class="form-css">
    <input type="text" name="tel" placeholder="输入手机号码" pattern="^1[3456789]\d{9}$" required><br>
    <input type="text" name="smscode" placeholder="输入验证码" pattern="\d{4}" required><br>
    <input type="submit">
</div>

<style>
  input[type="text"]:invalid ~ input[type="submit"] {
    display: none;
  }
</style>
```

#### 选中唯一的目标元素

`:target` ，其 id 和当前 URL 片段匹配。例如有一个 URL 片段指向一个 ID 为 section2 的页面元素： `http://www.example.com/index.html#section2` ，若当前浏览器 URL 等于上面这个 URL，可以使用下面的选择器来选中： `<section id="section2">Example</section>` 。

下面是一个关于 `:target` 伪类的例子，点击链接之后，id 相互匹配的 p 元素因为 `:target` 选出来之后会改变样式：

```html
<h3>Table of Contents</h3>
<ol>
  <li><a href="#p1">Jump to the first paragraph!</a></li>
  <li><a href="#p2">Jump to the second paragraph!</a></li>
  <li>
    <a href="#nowhere"
      >This link goes nowhere, because the target doesn't exist.</a
    >
  </li>
</ol>

<h3>My Fun Article</h3>
<p id="p1">
  You can target <i>this paragraph</i> using a URL fragment. Click on the link above to try out!
</p>
<p id="p2">
  This is <i>another paragraph</i>, also accessible from the links above. Isn't that delightful?
</p>

<style>
  p:target {
    color: red;
  }
  p:target i {
    font-size: 20px;
  }
</style>
```

## 伪元素

以双冒号（::）开头，本质上是创建了一个虚拟容器（元素），可以在其中添加内容或样式。

### 常用的 ::before 和 ::after

要使用这两个伪元素，需要选择器是可以插入内容的，也就是说需要这个选择器是一个容器；而 `<img>、<input>、<iframe>` 这三个标签都不能包含其他元素，所以不支持使用。

下面是一些常用的场景：

利用 `after` 伪元素清除浮动：给浮动元素的容器添加一个 class 名为 clearfix，然后给这个 class 添加一个伪元素 `::after` 内容来实现清除浮动。

```html
<div class="news clearfix">
  <h1>some text</h1>
  <p>the other text</p>
</div>
```

```css
.news {
  background-color: gray;
  border: 1px solid black;
}
.news h1 {
  float: left;
}
.news p {
  float: right;
}
.clearfix::after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
/* 兼容适配IE：触发 hasLayout */
.clearfix {
  zoom: 1;
}
```

伪元素制作雪碧图

在按钮中设置一个伪元素，将伪元素的高宽设置为原本 icon 的大小，再利用绝对定位定位到需要的地方，这样无论雪碧图每个 icon 的边距是多少，都能够完美适应。

伪元素实现文本换行

行内元素不会像块级元素一样自动换行，添加 `<br>` 标签不符合规范。使用如下代码进行换行：

```css
.inline-element::after {
  /* Unicode字符实现换行 */
  content: "\A";
  /* 保留元素后面的空白符和换行符 */
  white-space: pre;
}
```

伪元素实现文本首行缩进

实现首行缩进使用 `&nbsp;` 会出现缩进不到位等 bug，使用 `text-indent` 当字体大小改变缩进不会改变。下面是将 `&nbsp;` 转换为 Unicode 编码。

```css
.p::before {
  content: "\2003\2003";
}
```

### 不常见的伪元素

#### ::first-letter

选中块级元素第一行的第一个字母，最前面为图片或内联的表格时会干扰选择。

#### ::first-line

选中块级元素中第一行。

#### ::selection

选中被用户高亮选择的部分；可以不配合其他元素使用，只有一小部分的 CSS 属性可用于此选择器：

`color` `background-color` `cursor` `caret-color`（input 插入光标的颜色） `outline` `text-decoration` `text-shadow` 。
