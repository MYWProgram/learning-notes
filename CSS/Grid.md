# Grid 布局

## 概念

容器与项目：采用网格布局的区域称为容器，容器内的顶层子元素成为项目；Grid 布局只对项目生效。

网格线：正常情况下，n 行有 n+1 根水平网格线；m 列有 m+1 根竖直网格线。

## 容器上的属性

### grid || inline-grid

`display: grid || inline-grid;` 默认情况下容器是块级元素，也可以设置成行内元素。当设置为 Grid 布局之后，容器子元素（项目）的`float` `display: inline-block || table-cell;` `vertical-align` `column-*` 都将失效。

### grid-template-columns || grid-template-rows

前者定义每一列的列宽，后者指定每一行的行高。

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
```

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
}
```

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

由浏览器自己设置指定项的行高和列宽。当设置 auto 之后，列宽基本等于该列单元格的最大宽度。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px auto minmax(100px, 1fr);
  grid-template-rows: 100px 100px 100px;
}
```

#### 网格线的名称

`grid-template-columns` `grid-template-rows` 属性内使用方括号指定每一根网格线的名字，一根网格线可以有多个名字。下面代码定义一个 3\*3 网格，所以有行和列都有 4 根。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```

### gap

包括`column-gap` 设置列间距 `row-gap` 设置行间距 `gap` 结合二者设置列间距和行间距。如果 gap 只有一个值，会默认第二个值等于第一个。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  /* column-gap: 10px;
      row-gap: 10px; */
  gap: 10px 10px;
}
```

### grid-template-areas

用于定义区域，一个区域由一个或多个单元格组成。当不需要用到某单元格或者单元格不属于这个区域，可以用点（.）代替区域名称。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas:
    "a b c"
    "d e f"
    "g h i";
}
```

### grid-auto-flow

容器存放项目的默认顺序是先行（row）后列（column），这个属性用于改换默认存放的顺序，设置 column 之后会先填完一列。

```css
.wrapper {
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-auto-flow: column;
}
```

当项目中设置一个单元格所占的起止位置，可以使用 `grid-auto-flow: row dense;` `grid-auto-flow: column dense;` 来设置默认先填满列还是行，但是这样可能会留下因为大小不一致的间距。

### align-items || justify-content || place-items

第一个属性设置单元格内容的垂直位置；第二个设置单元格内容的水平位置；第三个结合二者，接收两个参数，省略第二个参数时默认和第一个相等。

- start：对齐单元格的起始边缘。
- end：对齐单元格的结束边缘。
- center：单元格内部居中。
- stretch：拉伸，占满单元格的整个宽度（默认值）。
