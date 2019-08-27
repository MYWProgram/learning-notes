# 伪类和伪元素

## 伪类

是一个以冒号（:）作为前缀，被添加到一个选择器末尾的关键字；当需要在特定状态下才呈现指定状态时就可以为选择器添加伪类，下面是一些常见的伪类。

- :link -> 会选中所有未被访问的链接，包括那些已经给定了其他伪类选择器的链接，如: `:hover、:active、:visited` ；为了可以正确渲染链接元素的样式，需要遵循以下顺序 -> `:link -> :visited -> :hover -> :active` ； `:focus` 伴随在 `:link` 左右。
- :visited -> 选中用户已访问过的链接。
- :active -> 匹配被用户激活的元素。应用在鼠标交互时是点下按键和抬起按键之间的时间。
- :hover -> 匹配用户虚指（未被激活）的元素。
- :focus -> 匹配获得焦点的元素。
- :first-child -> 一组兄弟元素中的第一个元素。
- :nth-child(an + b) -> 首先找到选择器的所有兄弟元素，然后从 1 开始按照先后顺序排序；其中 a，b 是具体的数字，n 从 0 开始计数。
- :nth-last-child(an + b) -> 匹配文档树中在其之后具有 an+b-1 个兄弟节点的元素；从结尾处反序开始计数，其他的和前者一致。
- :nth-of-type(an + b) -> 匹配机制和 nth-child 一致，但是只会匹配选择器中相同兄弟节点的元素。
- :first-of-type -> 一组兄弟元素中出现的第一个。
- :last-of-type -> 一组兄弟元素中出现的最后一个。
- :empty -> 代表没有子元素的元素，这里的子元素可以是元素节点或文本（空格也算文本），但不包括注释或处理指令。
- :target -> 代表一个唯一的页面元素（目标元素），其 id 和当前 URL 片段匹配。例如有一个 URL 片段指向一个 ID 为 section2 的页面元素： `http://www.example.com/index.html#section2` ，若当前浏览器 URL 等于上面这个 URL，可以使用下面的选择器来选中： `<section id="section2">Example</section>` 。
- :checked -> 表示任何处于选中状态的 `radio` 和 `checkbox`，还有 select 选中的 option。
- :enabled -> 匹配被启用的元素。
- :disable -> 匹配未被启用的元素。

下面是一个关于 `:target` 伪类的例子：

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
  You can target <i>this paragraph</i> using a URL fragment. Click on the link
  above to try out!
</p>
<p id="p2">
  This is <i>another paragraph</i>, also accessible from the links above. Isn't
  that delightful?
</p>
```

```css
p:target {
  color: red;
}

p:target i {
  font-size: 20px;
}
```

## 伪元素

伪元素是一个附加至选择器末的关键词，允许你对被选择元素的特定部分修改样式。伪元素应该以双冒号（::）开头，并且紧跟语句中的简单选择器/基础选择器之后。

- ::after -> 用来创建一个伪元素，作为已选中元素的最后一个子元素。通常会配合 content 属性来为该元素添加装饰内容。这个虚拟元素默认是行内元素。
- ::before -> 创建一个伪元素，其将成为匹配选中的元素的第一个子元素。常通过 content 属性来为一个元素添加修饰性的内容。此元素默认为行内元素。
- ::first-letter -> 选中块级元素第一行的第一个字母，最前面为图片和内联的表格时会干扰选择。
- ::first-line -> 选中块级元素中第一行。
- ::selection -> 选中被用户高亮选择的部分。

### ::after 和::before

要使用这两个伪元素，需要选择器是可以插入内容的，也就是说需要这个选择器是一个容器；而 `<img>、<input>、<iframe>` 这三个标签都不能包含其他元素，所以不支持使用。

- 利用 `after` 伪元素清除浮动

  给浮动元素的容器添加一个 class 名为 clearfix，然后给这个 class 添加一个伪元素`::after`来实现清除浮动。

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

/* 兼容适配IE：触发hasLayout */
.clearfix {
  zoom: 1;
}
```

- 伪元素制作雪碧图

  在按钮中设置一个伪元素，将伪元素的高宽设置为原本 icon 的大小，再利用绝对定位定位到需要的地方，这样无论雪碧图每个 icon 的边距是多少，都能够完美适应。

- 伪元素实现换行

  行内元素不会像块级元素一样自动换行，添加 `<br>` 标签不符合规范；

```css
.inline-element::after {
  /* Unicode字符实现换行 */
  content: "\A";
  /* 保留元素后面的空白符和换行符 */
  white-space: pre;
}
```

- 伪元素实现首行缩进

  实现首行缩进使用 `&nbsp;` 会出现缩进不到位等 bug，使用 `text-indent` 当字体大小改变缩进不会改变。下面是将 `&nbsp;` 转换为 Unicode 编码。

```css
.p::before {
  content: "\2003\2003";
}
```
