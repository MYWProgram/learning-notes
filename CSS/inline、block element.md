# 块级元素和行内元素

## 标签举例

### 块级元素

HTML： `div、p、h1~h6、ul、ol、dl、li、dd、table、hr、blockquote、address、menu、pre` 。

H5: `header、section、aside、footer` 。

### 行内元素

`span、a、label、abbr、em、big、i、textarea、select、strong` 。

`button` （默认 `display: inline-block;` ）。

### 行内块状元素

`img、input、td` 。

## 具体表现

在标准文档流中。

- 块级元素：总是在新的一行开始占据一整行；高度、行高以及外边距和内边距都可控制；宽度始终与浏览器一样，和内容无关；可以容纳内联元素和其他块元素。

- 行内元素：和其他行内元素都在一行上；高、行高以及外边距和内边距不可改；宽度只与内容有关；只能容纳文本图片或其他行内元素；不可以设置宽高，其宽度随着内容增加，高度随字体大小而改变，行内元素可以设置外边界，但是外边界不对上下起作用，只能对左右起作用，也可以设置内边界，但是内边界在 ie6 中不对上下起作用，只能对左右起作用。

行内元素和块级元素可以互相转换：块级元素通过设置 CSS 属性 `display: inline;` 转为行内元素；行内元素通过设置 CSS 属性 `display: block;` 转为块级元素。
