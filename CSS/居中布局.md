# 居中布局

## 水平居中

### 1. `margin: 0 auto;`

在子元素上设定，适用于块级元素。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  border: 1px solid red;
}
.item {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background-color: black;
}
```

### 2. `position: relative; margin: auto; left: 0; right: 0;`

在子元素上设定，适用于块级元素。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
```

```css
.item {
  width: 100px;
  height: 100px;
  position: relative;
  margin: auto;
  left: 0;
  right: 0;
  background-color: black;
}
```

### 3. `text-align: center;`

在父元素上设定，其子元素中所有行内内容（如文字）居中，但不控制块元素的居中；当块元素中为行内内容，并且没有定位和宽高等影响属性，块元素中文本也会居中。

```html
<div class="wrapper">
  <span>纯span标签</span>
  <p>纯p标签</p>
  <p class="text-block">有class的p标签</p>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  text-align: center;
  border: 1px solid red;
}
.text-block {
  position: absolute;
}
```

> 效果如下图：

![text-align居中效果图](https://ws1.sinaimg.cn/large/ecbd3051gy1g66gqo18raj20bd0bdmx1.jpg)

### 4. `display: flex; justify-content: center;`

在父元素上设定，行内元素会被转为块级元素。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  border: 1px solid red;
}
.item {
  width: 100px;
  height: 100px;
  background-color: black;
}
```

### 5. `display: grid; grid-template-columns: ; grid-template-rows: ; justify-items: center;`

在父元素上设定，行内元素会被转为块级元素。 `justify-items: center;` 只会设定的整个表格相对于父元素水平居中。

```html
<div class="wrapper">
  <div class="item-first"></div>
  <div class="item-second"></div>
  <div class="item-third"></div>
  <div class="item-fourth"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-template-rows: repeat(2, 100px);
  justify-content: center;
  border: 1px solid red;
}
.item-first {
  background-color: red;
}
.item-second {
  background-color: yellow;
}
.item-third {
  background-color: blue;
}
.item-fourth {
  background-color: green;
}
```

> 效果如下图：

![grid/justify-items居中效果图](https://ws1.sinaimg.cn/large/ecbd3051gy1g66gs8fgzzj20bd0bggld.jpg)

## 垂直居中

### 1. `height` 与 `line-height` 属性值相等

在父元素上设定两个属性值相等，适用于单行的行内元素： `inline` 和 `inline-block` ，多行会有行高问题。当需要居中的 `inline-block` 元素有高度，就会出现问题。

> inline 元素的情况

```html
<div class="wrapper">
  <span class="text">text</span>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  line-height: 400px;
  border: 1px solid red;
}
.text {
  color: black;
}
```

> inline-block 元素的情况

关键属性值为父元素中的 `font-size: 0px;` ，此时的 `line-height` 值为父元素和子元素的高度和。

因为 `inline-block` 元素的对准基线变为了子元素的底部，并且 `font-size` 会影响并且撑开这个对准基线。

```html
<div class="wrapper">
  <span class="item"></span>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  line-height: 500px;
  font-size: 0px;
  border: 1px solid red;
}
.item {
  width: 100px;
  height: 100px;
  display: inline-block;
  background-color: black;
}
```

### 2. 添加伪元素

首先解释一下 `vertical-align: center;` 这个属性值，虽然是设置元素的垂直居中，但是当元素内部有多个元素的时候，是互相的垂直居中。就如下面的代码：

```html
<div class="wrapper">
  <div class="item-first"></div>
  <div class="item-second"></div>
  <div class="item-third"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  text-align: center;
  border: 1px solid red;
}
.item-first {
  width: 100px;
  height: 100px;
  display: inline-block;
  vertical-align: middle;
  background-color: red;
}
.item-second {
  width: 100px;
  height: 150px;
  display: inline-block;
  vertical-align: middle;
  background-color: yellow;
}
.item-third {
  width: 100px;
  height: 120px;
  display: inline-block;
  vertical-align: middle;
  background-color: blue;
}
```

> 效果如下图：

![height = line-height](https://ws1.sinaimg.cn/large/ecbd3051gy1g66gs8nlo8j20be0bc08o.jpg)

> 上图中 3 个 div 的间距可以通过修改 HTML 结构为一行或者在父元素中添加 font-size: 0px; 来消除，当然还有很多方法，可以参见我的另外一篇文章：消除 inline-block 元素间隙。

修改类名为 `item-second` 的 `height: 100%;` 时候，此时左右两个元素都垂直居中了。

> 效果如下图：

![height = line-height](https://ws1.sinaimg.cn/large/ecbd3051gy1g66gs8tgsuj20bf0bhgld.jpg)

也就是说 `wrapper` 中要有一个占满父元素高度的子元素，其他才会居中；那么可以通过设置伪元素 `::before` 或 `::after` 来添加一个看不见的 100% 父元素高度的子元素。但是使用 `vertical-align` 来设置垂直居中，子元素必须要是 `inline-block` 。添加伪类样式：

```css
.wrapper::before {
  width: 0;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
  content: "";
}
```

> 效果如下图：

![height = line-height](https://ws1.sinaimg.cn/large/ecbd3051gy1g66gs919qrj20bg0bjgld.jpg)

### 3. calc 计算

使用 calc 将 `top` 属性设置为父元素的一半减去子元素的一半。

```html
<div class="wrapper">
  <div class="item-first"></div>
  <div class="item-second"></div>
  <div class="item-third"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  border: 1px solid red;
}
.item-first {
  position: relative;
  width: 100px;
  height: 100px;
  float: left;
  top: calc(50% - 50px);
  background-color: red;
}
.item-second {
  position: relative;
  width: 100px;
  height: 150px;
  float: left;
  top: calc(50% - 75px);
  background-color: yellow;
}
.item-third {
  position: relative;
  width: 100px;
  height: 120px;
  float: left;
  top: calc(50% - 60px);
  background-color: blue;
}
```

> 效果如下图：

![calc 计算](https://ws1.sinaimg.cn/large/ecbd3051gy1g66gs97hqgj20be0begld.jpg)

### 4. 借用表格

table -> `display: table;` td -> `display: table-cell;` ；除了直接使用表格进行布局，也可以将一个 `div` 设置 `display: table-cell;` 属性。

```html
<table>
  <tr>
    <td>
      <div>表格垂直居中</div>
    </td>
  </tr>
</table>

<div class="like-table">
  <div>假的表格垂直居中</div>
</div>
```

```css
.like-table {
  display: table-cell;
}
td,
.like-table {
  width: 150px;
  height: 100px;
  border: 1px solid #000;
  vertical-align: middle;
}
td div,
.like-table div {
  width: 100px;
  height: 50px;
  margin: 0 auto;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
  text-align: center;
  background: #c00;
}
.like-table div {
  background: #069;
}
```

### 5. transform

使用 CSS3 新属性 `transform` ，主要用于元素的变形、旋转、位移，其中的 `translateY` （改变垂直的位移，如果使用百分比为单位，则是以元素本身的长宽为基准）；子元素必须加上 `position: relative;` 。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  border: 1px solid red;
}
.item {
  position: relative;
  width: 100px;
  height: 100px;
  top: 50%;
  transform: translateY(-50%);
  background: black;
}
```

### 6. Flex

在父元素上设定，行内元素会被转为块级元素。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  border: 1px solid red;
}
.item {
  width: 100px;
  height: 100px;
  background-color: black;
}
```

### 7. Grid

在父元素上设定，行内元素会被转为块级元素。 `align-content: center;` 只会设定的整个表格相对于父元素水平居中。

```html
<div class="wrapper">
  <div class="item-first"></div>
  <div class="item-second"></div>
  <div class="item-third"></div>
  <div class="item-fourth"></div>
</div>
```

```css
.wrapper {
  width: 400px;
  height: 400px;
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-template-rows: repeat(2, 100px);
  align-content: center;
  border: 1px solid red;
}
.item-first {
  background-color: red;
}
.item-second {
  background-color: yellow;
}
.item-third {
  background-color: blue;
}
.item-fourth {
  background-color: green;
}
```
