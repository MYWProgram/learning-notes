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

#### repeat()

当时用同一个单位多次定义行高或者列宽时候使用这个函数，第一个参数是定义的次数，第二个参数是宽高。

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 50px);
}
```

同样也可用于重复一种模式。

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(1, 100px 50px 10px);
  grid-template-rows: repeat(3, 100px);
}
```

#### auto-fill

当希望每一行或者每一列尽可能多的容纳更多的项目，使用这个属性和 `repeat()` 搭配使用。

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(3, 100px);
}
```

#### fr

可用于设置响应式的行高或者列宽，也可和固定值搭配使用。

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(1, 1fr 100px 2fr);
  grid-template-rows: repeat(3, 100px);
}
```

#### minmax()

接收一个最大和最小值参数，表示行高和列宽在这个范围内。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 100px minmax(100px, 1fr);
  grid-template-rows: 100px 100px 100px;
}
```

#### auto

由浏览器自己设置指定项的行高和列宽。当设置 `auto` 之后，列宽基本等于该列单元格的最大宽度。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px auto minmax(100px, 1fr);
  grid-template-rows: 100px 100px 100px;
}
```

#### 网格线的名称

`grid-template-columns` `grid-template-rows` 属性内使用方括号指定每一根网格线的名字，一根网格线可以有多个名字。下面代码定义一个 3 \* 3 网格，所以有行和列都有 4 根。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```

### grid-auto-flow

容器存放项目的默认顺序是先行（row）后列（column），这个属性用于改换默认存放的顺序，对容器设置 `grid-auto-flow: column;` 之后会先填完一列。

```css
.wrapper {
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-auto-flow: column;
}
```

当项目中设置一个单元格所占的起止位置，可以使用 `grid-auto-flow: row dense;` `grid-auto-flow: column dense;` 来设置默认先填满列还是行，但是这样可能会留下因为大小不一致的间距。

### grid-auto-columns || grid-auto-rows

当定义一些项目显示的行列网格线超出容器区域，这些表格会显示在容器的外部，此时容器自动创建了一些新的网格；这两个属性就是用来定义自动生成网格的行高和列宽。

## 项目上的属性

### grid-area

当对容器指定了区域并命名，可以对项目使用这个属性进行网格定位。也可用于上面四个行列的起始位置的简写形式。
