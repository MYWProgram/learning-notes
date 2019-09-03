# BFC 与 IFC

## BFC 特性以及需要了解的外边距

### 创建 BFC 的条件

块格式化上下文（Block Formatting Context），是 Web 页面可视化 CSS 渲染的一部分，是块级元素盒模型布局过程发生的区域，同时也是浮动元素和其他元素交互的区域。

下列方式会创建块格式化上下文：

1. 根元素（`html`）。
2. 浮动元素（ `float` 属性值不为 none）。
3. 绝对定位元素（ `position: absolute || fixed;` ）。
4. 行内块级元素（ `display: inline-block;` ）。
5. overflow（ `overflow` 属性值不为 visible）。
6. `display: flow-root;` 的元素。
7. `conatain: layout || content || paint;` 。
8. flex、grid 布局。
9. 元素的 `column-count、column-width` 属性值不为 auto。
10. `column-span` 属性值为 all 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中。
11. 表格中的单元格、表格标题、匿名表格单元格元素（ `display: table-cell;` 、 `display: table-caption;` 、 `display: table || table-row || table-row-group || table-header-group || table-footer-group || inline-table` ，或者对应的 HTML 中的表格单元格、表格标题、匿名表格单元格元素）。

### BFC 的特性

有以下特性：

1. 内部块级盒子垂直方向排列。
2. 盒子垂直距离由 `margin` 决定，同一个 BFC 内部的外边距（ `margin-top、margin-bottom` ）会合并。
3. BFC 是一个隔离容器，内部子元素不会影响到外部元素。
4. BFC 区域不会与 float box 叠加。
5. 每个元素的 `margin-left` ，与包含块 `border-left` 相接触（对于从左至右的格式化，从右至左则相反）；即使有浮动也是如此。

### 外边距合并

上面提到了外边距合并的问题，所谓外边距合并其实就是 `margin` 合并：块元素的 `margin-top、margin-bottom` 有时会合并为单个外边距，合并后的大小是合并前两者的最大值。

分为以下两种情况：

第一种情况：相邻兄弟元素。下面的代码中我们定义上面盒子 `margin-bottom: 100px;` ，下面盒子 `margin-top: 100px;` ；常理应该是两个盒子上下间距为 200px。

```html
<div class="wrapper-up">上面的盒子</div>
<div class="wrapper-down">下面的盒子</div>
```

```js
.wrapper-up {
  width: 100px;
  height: 100px;
  margin-bottom: 100px;
  border: 1px solid lightgreen;
}
.wrapper-down {
  width: 100px;
  height: 100px;
  margin-top: 100px;
  border: 1px solid lightblue;
}
```

>上面代码效果如下图所示：

![相邻兄弟元素边距合并.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6lkla55iej20at095web.jpg)

解决问题的方式就是在下面的盒子添加： `display: inline-block;` 来触发 BFC。

第二种情况：父子元素，如果块级父元素中不存在上边框、上内补、行内元素、清除浮动这四条；那么这个块级父元素和它的第一个子元素的上边距就合并了。下面代码子元素的 `margin-top: 100px;` 失效了，并且父元素有了这个效果。

```html
<div class="wrapper-parent">
  <div class="wrapper-child">第一个子元素</div>
</div>
```

```js
.wrapper-parent {
  width: 100px;
  height: 200px;
  background-color: lightgreen;
}
.wrapper-child {
  width: 50px;
  height: 50px;
  margin-top: 100px;
  border: 1px solid red;
}
```

>上面代码效果如下图所示：

![父子元素边距合并.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6lkw0lrz7j209d0c4t8l.jpg)

解决问题的方式就是在 parent 上添加 `overflow: hidden;` 来触发 BFC。

## 使用 BFC 解决上面的问题

使用 BFC 我们需要先了解以下他的用处。

### BFC 的用处

常规有以下三个作用：

1. 解决外边距合并问题。
2. 解决浮动导致高度塌陷问题。
3. 解决侵占浮动元素问题。

前面已经使用 BFC 解决了外边距合并的问题，下面来看看使用 BFC 清除浮动以解决一些布局问题。

第一个例子：因为浮动导致父元素高度无法被撑开的高度塌陷问题。

```html
<div class="wrapper">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```

```css
.wrapper {
  width: 550px;
  border: 5px solid red;
  overflow: auto;
}
.item {
  width: 100px;
  height: 100px;
  float: left;
  background-color: silver;
  margin: 5px;
}
```

上面的代码我们本来想要得到的效果是像下面第一张图一样：

![解决浮动导致的高度问题.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6m2ouvergj20gc0440m2.jpg)

但是因为浮动元素脱离文档流，wrapper 的高度无法被撑开，得到的效果是下图这样：

![浮动导致的父元素高度问题.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6m2tp9747j20gh0470l5.jpg)

解决问题的方法就是给父元素添加一个触发 BFC 的属性： `overflow: auto;` 。

第二个例子：左右兄弟元素高度不一致，左边浮动布局，导致右边侵占浮动元素的问题。

```html
<div class="aside">侧边栏</div>
<div class="main">主要内容</div>
```

```css
.aside {
  float: left;
  width: 100px;
  height: 200px;
  background-color: lightgreen;
}
.main {
  height: 250px;
  background-color: lightblue;
}
```

上面代码我们本来想要的效果是左右两栏独立的布局，就像这样：

![触发 BFC 解决浮动后的左右布局.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6m37bykyej20nr07pdfn.jpg)

但是因为浮动没有清除导致这个 BFC 内部（此时为 HTML 根元素创建的 BFC）影响到其他元素的布局，出现下面的效果：

![浮动影响兄弟元素布局.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6m3bmm1yxj20nr07jdfn.jpg)

解决问题的方法还是触发 BFC，注意是给受到影响的兄弟元素添加属性： `overflow: auto;` 。

注意：**上面两个例子都是因为浮动对当前环境布局造成了影响，清除浮动的方法很多，但是使用触发 BFC 的方式来清除的话；我们应该对代码加上注释以避免以后维护的尴尬，因为 `overflow: auto` 可能会产生滚动条。**

## IFC

意为内联格式化上下文，IFC 的 line box（线框）高度由其包含的行内元素中最高的实际高度计算而来，并不会受到竖直方向的 `padding、margin` 影响。

IFC 有一些简单的规则：

1. IFC 中的元素会在一行中从左至右排列（设置从右至左布局则相反）。
2. 其中在一行的所有元素会在该区域形成一个行框。
3. IFC 区域的高度为其中最高行内元素的高度。
4. 浮动的元素会脱离 IFC 的区域，并且浮动元素会压缩 IFC 区域的宽度。
5. IFC 区域因为宽度容纳不下子元素时，子元素会换行显示，并且产生新的行框。
6. IFC 区域内部可使用 `text-align、vertical-align` 。

### IFC 的简单应用

水平居中：设置一个元素 `display: inline-block` 会在这个元素的父元素产生 IFC，此时这个元素可以使用 `text-align: center` 来进行居中布局。

垂直居中：创建一个 IFC，且 IFC 区域下有多个子元素；用其中一个最大高度来撑开父元素，然后设置所有子元素 `vertical-align: middle` 其他子元素会垂直居中布局。

下面看看创建 IFC 之后垂直居中的例子。

```html
<div class="wrapper">
  <span class="item"></span>
  <span class="special-item"></span>
  <span class="item"></span>
</div>
```

```css
.wrapper {
  width: 200px;
  height: 200px;
  border: 1px solid black;
}
.special-item {
  display: inline-block;
  height: 100%;
  width: 50px;
  vertical-align: middle;
  border: 1px solid blue;
}
.item {
  display: inline-block;
  height: 50px;
  width: 50px;
  border: 1px solid red;
  vertical-align: middle;
}
```

>效果图如下：

![IFC 区域中的垂直居中.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g6m4vjtpbsj206906b0n3.jpg)
