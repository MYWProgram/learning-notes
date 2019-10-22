# Grid 布局

## 概念

row line：行线。

column line：列线。

track：网格轨道，即行线和行线之间，列线和列线之间形成的可使用区域；用来摆放子元素。

gap：网格间距，即行线和行线之间，列线和列线之间形成的不可使用区域；用来分隔元素。

cell：网格单元格，由行线和列线分隔出来的区域，用来摆放子元素。

area：网格区域，由单个或多个网格单元格组成，用来摆放子元素。

上述概念参考下图：

![Grid-1.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85xe333t0j20gh0g0gm1.jpg)

## 父元素

### 定框架

布局首先需要的就是定框架，先设置父元素的 `display` 属性。

#### grid || inline-grid

`display: grid || inline-grid;` 默认情况下容器是块级元素，也可以设置成行内元素。当设置为 Grid 布局之后，容器子元素（项目）的 `float、display: inline-block || table-cell、vertical-align、column-*` 都将失效。

### 画线

接下来就需要画线，即设置所需网格的行列个数。

### grid-template-columns || grid-template-rows || grid-template

第一个指定一列某个单元格的宽，第二个指定一行某个单元格的高，第三个是简写。

```html
<div class="wrapper">
  <div class="item1">1</div>
  <div class="item2">2</div>
  <div class="item3">3</div>
  <div class="item4">4</div>
  <div class="item5">5</div>
  <div class="item6">6</div>
  <div class="item7">7</div>
  <div class="item8">8</div>
  <div class="item9">9</div>
</div>

<style>
.wrapper {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  /* 上述 track（轨道） 的定义可以简写为以下形式：先行后列，用 / 分隔。 */
  grid-template: 100px 100px 100px / 100px 100px 100px;
}
</style>
```

### 分区域

接下来就可以对网格的区域进行命名，后续我们可以直接使用区域的名字对子元素进行定位。

### grid-template-areas

一个区域由一个或多个单元格组成。当不需要用到某单元格或者单元格不属于这个区域，可以用点 . 代替区域内的名称。

```css
.wrapper {
  display: grid;
  grid-template-columns: 101px 102px 103px;
  grid-template-rows: 104px 105px 106px;
  grid-template-areas: "a a b"
                       "c d e"
                       "c d .";
  /* 上述对于 track（轨道）和 areas（区域）的定义可以如下简写：对应单独 track 设置可以看出前三个代表 col 后三个代表 row 。 */
  grid-template: "a a b" 101px
                 "c d e" 102px
                 "c d ." 103px / 104px 105px 105px;
}
```

效果图如下：

![Grid-2.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85xxe2khnj209h096q2u.jpg)

### 设间距

完成这些设置之后，我们需要设置子元素之间的间距，可以分横向和纵向两个维度。

#### gap

`column-gap` 设置列间距 `row-gap` 设置行间距 `gap` 结合二者设置列间距和行间距。如果 gap 只有一个值，会默认第二个值等于第一个。

```css
.wrapper {
  display: grid;
  grid-template: 100px 100px 100px / 100px 100px 100px;
  column-gap: 10px;
  row-gap: 10px;
  /* gap: 10px; */
}
```

### 父元素找对齐

对齐方式可以分为两种，一种是内部的一种是外部的（前者是针对每个网格区域的子元素而言，而后者是相对于网格区域本身）。另外在行和列（更专业的术语是main axis和cross axis)上又各自有两个维度，这就构成了4种设置对齐的方式。

先来处理一下每个子元素相对网格区域内部的对齐方式：

#### align-items || justify-items || place-items

第一个属性设置单元格内容的垂直位置；第二个设置单元格内容的水平位置；第三个结合二者，接收两个参数，省略第二个参数时默认和第一个相等。取值为下面四个属性值：

- start：对齐单元格的起始边缘。
- end：对齐单元格的结束边缘。
- center：单元格内部居中。
- stretch：拉伸，占满单元格的整个宽度（默认值）。

如下例子设置：

```css
.wrapper {
  display: grid;
  grid-template: 100px 100px 100px / 100px 100px 100px;
  grid-gap: 10px 10px;
  justify-items: center;
  align-items: center;
}
```

效果图如下：

![Grid-3.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85yrxv06dj207q07smwz.jpg)

有时候我们设置的网格不足以覆盖整个父容器的大小时，比如在上述的例子中整个父容器有 `500px*500px` 的大小，而我们只设置了 `300px*300px` 的网格区域，这时候就需要指定多出来空间的处理规则。这时就是另外一种情况：

#### align-content || justify-content || place-content

第一个属性定义整个内容区域在容器里的垂直位置；第二个属性定义整个内容在容器里的水平位置；第三个属性结合前面两个，省略第二个参数默认等于第一个。取值为下面几个属性：

- start：对齐容器的起始边框。
- end：对齐容器的结束边框。
- center：容器内部居中。
- stretch：未指定大小时占满整个网格容器。
- space-around：每个项目两侧的间隔相等。因此项目之间的间隔比项目与容器边框的间隔大一倍。
- space-between：项目与项目之间的间隔相等，项目与容器边框间没有间距。
- space-evenly：项目与项目之间的间隔相等，项目与容器边框的间隔也相等。

如下例子设置：

```css
.wrapper {
  display: grid;
  width: 500px;
  height: 500px;
  grid-template: 100px 100px 100px / 100px 100px 100px;
  grid-gap: 10px 10px;
  justify-content: space-between;
  align-content: center;
}
```

效果图如下：

![Grid-4.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85zc8eyymj20cm0cy0sy.jpg)

## 子元素

完成上面父元素的设置之后，基本可以满足大部分的布局要求；但是如果针对不同的单个网格子元素需要自定义一些样式的话，我们还需要对下面的设置进行深入了解；进行子元素上的摆位置与找对齐。

### 子元素摆位置

给子元素摆放具体位置，一般有两种方式：一种是直接设置起始行列和结束行列，另一种是指定摆放的区域名称。

#### grid-column-start || grid-column-end || grid-column 与 grid-row-start || grid-row-end || grid-row

对应标题：左边框所在的垂直网格线 || 右边框所在的垂直网格线 || 结合写法 与 上边框所在的水平网格线 || 下边框所在的水平网格线 || 结合写法；需要注意 3*3 一共 9 个网格的容器，有水平和垂直各自的 4 根网格线。当四个属性产生项目重叠，使用 index 来控制优先级。取值：

- 行和列的网格线对应序号。
- span：加上数字，表示可以跨越几个网格。

看下面的例子：

```css
/* 指定起始行，结束行，起始列，结束列。 */
.child:first-child {
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 3;
  background: red;
}
/* 使用缩写形式。 */
.child:nth-child(2) {
  grid-row: 2/3;
  grid-column: 2/4;
  background: yellow;
}
/* 直接指定区域名。 */
.child:nth-child(3) {
  grid-area: i;
  background: green;
}
```

当然如果我们使用 span 的话，上面的第三个元素还可以如下设置：

```css
.child:nth-child(3) {
  grid-row: 2/3;
  grid-column: span 2;
}
```

效果图如下：

![Grid-5.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85zmxqdrwj209q09mt8m.jpg)

### 子元素找对齐

在父元素上找对齐，所有子元素相对于网格单元的对齐方式都是一致的；如果需要对单个子元素进行网格区域内对齐方式的自定义设置，可以如下按行列分别设置。

#### justify-self || align-self || place-self

取值和前面作用于父元素的几个属性一样，只是这个适用于容器内每个子元素本身。

看下面的例子：

```css
/* 列对齐 */
.child:nth-child(1) {
  align-self: end;
}
/* 行对齐 */
.child:nth-child(2) {
  justify-self: end;
}
/* 采用缩写形式 */
.child:nth-child(3) {
  place-self: center center;
}
```

效果图如下：

![Grid-6.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g85zuhmoiqj207p07uq2q.jpg)

### 隐式网格

当我们在网格定义的区域外放置子元素时，或因子元素数量过多而需要更多的网格线时，布局算法就会自动生成隐式网格。默认的这些隐式网格的大小会根据网格内内容的大小变化而变化，当然我们也可以使用下面的属性来控制。

#### grid-auto-columns || grid-auto-rows

这两个属性就是用来定义自动生成网格的行高和列宽。

看下面的例子：

```html
<div class="parent">
  <div class="child" style="background: red"></div>
  <div class="child" style="background: yellow"></div>
  <div class="child" style="background: green"></div>
</div>

<style>
  .wrapper {
    display: grid;
    grid-auto-rows: 100px;
    grid-auto-columns: 100px;
  }
</style>
```

效果图如下：

![Grid-7.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86qol1uy4j202p07n0qy.jpg)

从上图我们可以看到，在没有定义明确的网格而定义隐式网格的情况下，对子元素进行了自动排列。

这时如果子元素引用了不存在的行号和列号，父容器会自动生成隐式网格来容纳所有元素。

```css
.child:first-child {
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 3;
  background: red;
}
```

效果如下：

![Grid-8.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86qvz22ilj20530570d8.jpg)

控制了隐式网格的大小，我们还需要控制网格的位置。就需要用到下面的属性：

#### grid-auto-flow

容器存放项目的默认顺序是先行（row）后列（column），这个属性用于改换默认存放的顺序，对容器设置 `grid-auto-flow: column;` 之后会先填完一列。

当项目中设置一个单元格所占的起止位置，可以使用 `grid-auto-flow: row dense;` `grid-auto-flow: column dense;` 来设置默认先填满列还是行，但是这样可能会造成大小不一致而产生间距的问题。

看下面这个例子：

```html
<div class="wrapper">
  <div class="child" style="background-color: lightgreen;">1</div>
  <div class="child" style="background-color: orange;">2</div>
  <div class="child" style="background-color: yellow;">3</div>
  <div class="child" style="background-color: green;">4</div>
  <div class="child" style="background-color: lightblue;">5</div>
</div>
<style>
  .wrapper {
    width: 500px;
    height: 300px;
    display: grid;
    gap: 10px;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
    /*   grid-auto-flow: column dense; */
  }
  .child:first-child {
    grid-row-start: 3;
  }
  .child:nth-child(4) {
    grid-column-start: 2;
  }
</style>
```

上面的例子，我们注释掉 `grid-auto-flow: column dense;` 时，效果图如下：

![Grid-17.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g8757hwe3kj20h10b674e.jpg)

当我们解开注释，效果图如下：

![Grid-18.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g8759w2drbj20gz0b33ym.jpg)

从上面的例子可以看出，当我们设置 dense 属性之后，没有规定区域的网格会被自动分配去占据之前空出来的网格区域。

## 值的策略

### 大小

网格布局中引入了一种新的类似于百分比的大小单位 fr ，是 fraction 的缩写，意思是容器内剩余空间的分数比。

#### fr

可用于设置响应式的行高或者列宽，也可和固定值搭配使用。

下面是一个两边固定宽度，中间自适应的例子：

```css
.parent {
  height: 100px;
  display: grid;
  grid-template-columns: 100px 1fr 100px;
}
```

效果图：

![Grid-9.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86ugwnouoj20cr02pdfl.jpg)

当然也可以完全按照比例来设置网格的宽高：

```css
.wrapper {
  width: 400px;
  height: 100px;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-areas: "a b c"
}
```

我们可以看到三个区域的比例关系就是 1:1:2 ，效果图：

![Grid-10.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86x840cccj20a202oa9t.jpg)

除了使用 fr 自适应单位以外，网格布局还可以使用相对子元素自身尺寸进行计算的属性；这种比例大小就像我们设置盒子的宽度 width ，他是相对于父元素的大小进行比例参照，而接下来介绍的这个属性是网格布局中相对于子元素的宽度进行大小设置：

#### min-content || max-content

前者是根据子元素内容来设置最小宽度大小，后者是根据子元素内容来设置最大宽度大小。

先看第一个例子：

```css
.wrapper {
  display: grid;
  grid-template-columns: auto min-content auto;
}
```

效果图：

![Grid-11.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86xg5cleaj20eg0343yb.jpg)

从上面这个例子可以看出最小宽度的定义，英文中就是最初长的那个单词，而中文就是一个字。

再看第二个例子：

```css
.wrapper {
  display: grid;
  grid-template-columns: auto max-content auto;
}
```

效果图：

![Grid-12.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86xixhshmj20ec011t8i.jpg)

第二个例子可以看出，所谓最大宽度就是尽可能在一行显示最多的内容。

### 函数

网格布局提供了一些函数来帮助我们更好的设置响应式布局，主要有以下几个：

#### minmax()

接收一个最大和最小值参数，表示行高和列宽在这个范围内。

```css
.wrapper {
  display: grid;
  /* 一般情况下只设置列宽不设置行高。 */
  grid-template-columns: 100px minmax(100px, 200px) 100px;
  /* 最常用的情况是只设置最小，不设置最大值。 */
  grid-template-columns: 100px minmax(100px, auto) 100px;
}
```

#### fit-content

它实际上是 `min(maximum size, max(minimum size, argument))` 的简写，表示将元素的宽度收缩到内容的宽度，设置之后该元素会尽量不占用多余的空间。

如果内容的宽度小于 `fit-content` 中设置的宽度，那么实际子元素宽度是内容宽度。如果内容宽度超出了 `fit-content` 中设置的长度，那么实际子元素宽度就是设置的那个长度。

看下面这个例子：

```css
.wrapper {
  display: grid;
  grid-template-columns: auto fit-content(200px) auto;
}
```

设置不同长度的内容的效果图：

![Grid-13.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86y2p7g40j20e301r3yd.jpg)

![Grid-14.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86y2v0zd2j20e900wmwy.jpg)

从上面的第一张图可以看出，设置的内容已经超过了 `fit-content` 中的 200px ，但是中间网格还是 200px 的宽度；第二张图内容没有达到 200px ，中间网格的宽度就是内容的宽度。

最后就是一个重复函数：

#### repeat()

当使用同一个单位多次定义行高或者列宽时候使用这个函数，第一个参数是定义的次数，第二个参数是宽高的值。

```css
.wrapper {
  display: grid;
  grid-template-rows: 100px 100px 100px;
  grid-template-columns: 100px 100px 100px;
}
/* 利用 repeat 函数改写。 */
.wrapper {
  display: grid;
  grid-template-rows: repeat(3, 100px);
  grid-template-columns: repeat(3, 100px);
}
```

第一个参数除了定义的次数之外，也可以是 `auto-fit` 和 `auto-fill` 两个关键字；这两个关键字效果差不多，区别就是剩余空间的分配。

当我们搭配 `minmax()` 可以看出区别，看下面这个例子：

```css
.parent {
  display: grid;
  width: 500px;
  height: 100px;
  grid-gap: 10px;
  /* 这里我们分别使用上面两个不同的关键字进行设置。 */
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
```

两种不同效果：

![Grid-15.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86yb0ei7tj20eg03g3ya.jpg)

![Grid-16.png](http://ww1.sinaimg.cn/large/ecbd3051gy1g86yb5iwbnj20eb035q2q.jpg)

从上面的例子可以看出：`auto-fit` 会自动分配所有剩余空间，而 `auto-fill` 会创建空白。

### 命名

#### 网格线的名称

`grid-template-columns` `grid-template-rows` 属性内使用方括号指定每一根网格线的名字，一根网格线可以有多个名字。下面代码定义一个 3 \* 3 网格，所以行和列都有 4 根网格线。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```
