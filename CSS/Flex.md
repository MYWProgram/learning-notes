# Flex 布局

[阮一峰 Flex 布局实例](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## 设置 Flex

任何一个容器都可以指定为 Flex 布局 `display: flex;` ，行内元素 `display: inline-flex;` ，Webkit 内核的浏览器需加上 `display: -webkit-flex;` 可以兼容 webkit 内核的浏览器；设置为 Flex 布局之后,子元素的 `float、clear、vertical-align` 属性将失效。

注意：**设定Flex之后默认存在两根轴（水平的主轴和垂直的交叉轴），项目默认沿主轴排列。**

## 属性和意义

### 容器的属性

`flex-direction` 决定主轴方向，即项目排列方向；依次为左起水平方向（默认），右起水平方向，上起垂直方向，下起垂直方向。

```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

`flex-wrap` 定义如何换行；依次为不换行（默认），换行且第一行在上，换行且第一行在下。

```css
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

`justify-content` 属性定义了项目在主轴上的对齐方式；依次为左对齐（默认），右对齐，剧中对齐，两端对齐且项目之间间距相等，在前者基础上两侧项目与边框间距相等，项目之间的间隔比项目与边框的间隔大一倍。

```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

`align-items` 属性定义项目在交叉轴上如何对齐；依次为起点对齐，终点对齐，居中对齐，项目内第一行文字基线对齐，项目未设置高度或设置 `auto` 将占满整个容器高度。

```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

`align-content` 属性定义了多根轴线的对齐方式，如果项目只有一根轴线，该属性不生效； `space-between` 与交叉轴两端对齐，轴线之间的间隔平均分布； `space-around` 每根轴线两侧的间隔都相等；因此，轴线之间的间隔比轴线与边框的间隔大一倍。

```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```

### 项目的属性

`order` 属性定义项目的排列顺序；数值越小，排列越靠前，默认为 0。

```css
.item {
  order: 1;
}
```

`flex-grow` 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大；如果所有项目的 `flex-grow` 属性都为 1，则它们将等分剩余空间；如果一个项目的 `flex-grow` 属性为 2，其他项目都为 1，则前者占据的空间将比其他项多一倍。

注意：**当为所有项目都设置 0.1 ，只能等分部分剩余空间，而不是全部。**

```css
.item {
  flex-grow: 0; /* default 0 */
}
```

`flex-shrink` 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小；如果所有项目的 `flex-shrink` 属性都为 1，当空间不足时，都将等比例缩小；如果一个项目的 `flex-shrink` 属性 为0，其他项目都为 1，则空间不足时，前者不缩小，其他缩小；负值对该属性无效。

```css
.item {
  flex-shrink: 1; /* default 1 */
}
```

`align-self` 属性允许单个项目与其他项目有不一样的对其方式，可覆盖 `align-items` 属性；默认值为 `auto` ，表示继承父元素的 `align-items` 属性值，如果没有父元素显示 `stretch` 属性的效果。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

项目属性设置 `flex: 1;` ，子元素会自动占满父元素的内容区域。

## Flex 不为人知的秘密

### margin: auto

让 flex 布局中有 float 的效果。

看下面这个例子：

```html
<section class="flex-wrapper">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</section>

<style>
  .flex-wrapper {
    display: flex;
    width: 500px;
    margin: 100px auto;
    border: 2px dashed gold;
  }
  div {
    width: 30px;
    height: 30px;
    border: 1px solid silver;
    background-color: skyblue;
  }
  div:first-child {
    margin-right: auto;
  }
</style>
```

效果图：

![Flex-1.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g8af3poyw3j20jw05iwec.jpg)

从上面的例子我们可以看到，需要哪些 div 有向左或者向右的浮动，只需要在其前面一个或者后面一个设置 `margin-left: auto;` 或者 `margin-right: auto;` 即可。

对第三个 div 添加 `div:nth-child(3) {margin: auto;}` ；效果图如下：

![Flex-2.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g8af7y84r9j20hl03nq2r.jpg)
