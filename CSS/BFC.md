# BFC

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

## 使用 BFC 解决问题

### BFC 的用处

常规有以下三个作用：

1. 清除浮动。
2. 解决外边距合并问题。
3. 布局。
