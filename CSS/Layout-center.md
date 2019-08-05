# 普通布局方法

## 居中布局

### 水平居中

- `margin: 0 auto;`，在子元素上设定，适用于块级元素。
- `position: relative; margin: auto; left: 0; right: 0;`，在子元素上设定，适用于块级元素。
- `text-align: center;`，在父元素上设定，其子元素中所有行内内容（如文字）居中，并不控制块元素的居中（当块元素中为行内内容，并且没有定位和宽高等影响属性，也会居中）。
- `display: flex; justify-content: center;`，在父元素上设定，行内会转为块级。
- `display: grid; grid-template-columns: repeat(3, 100px); grid-template-rows: repeat(3, 100px); justify-items: center;`，在父元素上设定，行内会转为块级。

### 垂直居中

- `height` 与 `line-height` 属性值相等，在父元素上设定（适用于单行的行内元素：`inline` `inline-block`；多行会有行高问题）。
- `display: table-cell; vertical-align: middle;`，在父元素上设定。
- `display: flex; align-items: center;`，在父元素上设定，行内会转为块级。
- `display: grid; grid-template-columns: repeat(3, 100px); grid-template-rows: repeat(3, 100px); align-items: center;`，在父元素上设定，行内会转为块级。
- calc 计算

```css

```

### 水平垂直居中

- position: relative; top: 50%; left: 50%; margin: -150px 0 0 -250px;（已知 h:500px w:300px）
- position: absolute; top: 50%; left: 50%; transform: translate（-50%, -50%）;
