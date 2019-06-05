# Flex 布局

[Flex布局实例](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## 设置 Flex

任何一个容器都可以指定为 Flex 布局`display: flex;`,行内元素`display: inline-flex;`,Webkit 内核的浏览器需加上`display: -webkit-flex;`;设置为 Flex 布局之后,子元素的 float、clear、vertical-align 属性将失效

PS. **设定Flex之后默认存在两根轴(水平的主轴和垂直的交叉轴),项目默认沿主轴排列**

## 属性和意义

### 容器的属性

- flex-direction 决定主轴方向,即项目排列方向;依次为左起水平方向(此为默认值),右起水平方向,上起垂直方向,下起垂直方向

```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- flex-wrap 定义如何换行;依次为不换行(默认),换行第一行在上,换行第一行在下

```css
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

- justify-content属性定义了项目在主轴上的对齐方式;依次为左对齐(默认值),右对齐,剧中对齐,两端对齐且项目之间间距相等,在前者基础上两侧项目与边框间距相等,项目之间的间隔比项目与边框的间隔大一倍

```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

- align-items属性定义项目在交叉轴上如何对齐;依次为起点对齐,终点对齐,中点对齐,项目内第一行文字基线对齐,项目未设置高度或设置auto将占满整个容器高度

```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

- align-content属性定义了多根轴线的对齐方式,如果项目只有一根轴线,该属性不起作用;space-between与交叉轴两端对齐,轴线之间的间隔平均分布;space-around每根轴线两侧的间隔都相等,所以,轴线之间的间隔比轴线与边框的间隔大一倍

```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```

### 项目的属性

- order属性定义项目的排列顺序;数值越小,排列越靠前,默认为0

```css
.item {
  order: 1;
}
```

- flex-grow属性定义项目的放大比例,默认为0,即如果存在剩余空间,也不放大;如果所有项目的flex-grow属性都为1,则它们将等分剩余空间;如果一个项目的flex-grow属性为2,其他项目都为1,则前者占据的剩余空间将比其他项多一倍

```css
.item {
  flex-grow: 0; /* default 0 */
}
```

- flex-shrink属性定义了项目的缩小比例,默认为1,即如果空间不足,该项目将缩小;如果所有项目的flex-shrink属性都为1,当空间不足时,都将等比例缩小;如果一个项目的flex-shrink属性为0,其他项目都为1,则空间不足时,前者不缩小,负值对该属性无效

```css
.item {
  flex-shrink: 1; /* default 1 */
}
```

- align-self属性允许单个项目与其他项目有不一样的对其方式,可覆盖align-items属性;默认值为auto,表示继承父元素的align-items属性值,如果没有父元素显示stretch

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

- 项目属性设置`flex: 1;`，子元素会自动占满父元素的内容区域
