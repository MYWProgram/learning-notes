# CSS 小知识

## 消除 inline-block 元素间隙

[返回目录](#目录)

```html
<div class="space">
  <a href="#">XXX</a>
  <a href="#">XXX</a>
  <a href="#">XXX</a>
</div>
<!-- 物理方法移除 -->

<!--1-->
<div><a href="#">XXX</a><a href="#">XXX</a><a href="#">XXX</a></div>

<!--2-->
<div>
  <a href="#">XXX</a
  ><!--
  --><a href="#">XXX</a
  ><!--
  --><a href="#">XXX</a>
</div>
```

```css
/* 使用margin负值,这个方法不适合大规模使用 */
.space a {
  display: inline-block;
  margin-right: -3px;
}
```

```html
<!-- IE向下兼容可在末尾加上</a> -->
<div>
  <a href="#">XXX
  <a href="#">XXX
  <a href="#">XXX
</div>
```

```css
/* 通过设置父元素的字体为0,这个方法可以解决大多数浏览器;是移动端最好的解决方式 */
.space {
  font-size: 0;
  -webkit-text-size-adjust: none; /* chrome中加上这句消除字体大小限制 */
}
.space a {
  font-size: 12px;
}
```

```css
/* 通过设置字符间距,该方法可以解决所有浏览器 */
.space {
  letter-spacing: -3px;
}
.space a {
  letter-spacing: 0;
}
```

```css
/* 通过设置单词间距 */
.space {
  display: inline-block; /* chrome中需要加上这句 */
  word-spacing: -6px;
}
.space a {
  word-spacing: 0;
}
```

## 块级元素与行内元素

- 块级元素：div,p,h1~h6,ul,ol,dl,li,dd,table,hr,blockquote,address,menu,pre/header,section,aside,fotter(后面为 H5 新增)

- 行内元素：span,a,lable,abbr,em,big,cite(引用),i,q(短引用),textarea,select,strong,u(下划线),button(默认 display: inline-block)

- 行内块状元素：img,input,td

在标准文档流里：

- 块级元素:总是在新的一行开始占据一整行；高度,行高以及外边距和内边距都可控制；宽度始终与浏览器一样,和内容无关；可以容纳内联元素和其他块元素

- 行内元素:和其他行内元素都在一行上；高,行高以及外边距和内边距不可改；宽度只与内容有关；只能容纳文本图片或其他行内元素；不可以设置宽高,其宽度随着内容增加,高度随字体大小而改变,内联元素可以设置外边界,但是外边界不对上下起作用,只能对左右起作用,也可以设置内边界,但是内边界在 ie6 中不对上下起作用,只能对左右起作用

二者可以互相转换:

- 通过设置 display 属性,转为行内 display: inline;转为块级 display: block

## CSS 百分比参照问题

- 参照父元素宽度元素: padding margin width text-indent
- 参照父元素高度元素: height
- 参照父元素属性: font-size line-height
- 特殊: 相对定位 top(bottom)left(right)参照父元素的内容区域高度与宽度;绝对定位时参照最近的定位元素包含 padding 的高度与宽度

## 定位

position 定位:

- static:元素框正常生成;块级元素生成一个矩形框,作为文档流的一部分,行内元素则会创建一个或多个行框,置于其父元素中
- relative:元素框偏移某个距离;元素仍保持其未定位前的形状,它原本所占的空间仍保留;移动元素会导致它覆盖其他框
- absolute:元素框从文档流完全删除,并相对于其包含块定位;包含块可能是文档中的另一个元素或者是初始包含块;元素原先在正常文档流中所占的空间会关闭,就好像元素原来不存在一样;元素定位后生成一个块级框,而不论原来它在正常流中生成何种类型的框
- fixed:元素框的表现类似于将 position 设置为 absolute,不过其包含块是视窗本身
- float:浮动的框可以向左或向右移动,直到它的外边缘碰到包含框或另一个浮动框的边框为止;由于浮动框不在文档的普通流中,所以文档的普通流中的块框表现得就像浮动框不存在一样;浮动格式可以用 clear 来清除

## display 的一些属性及作用

[返回目录](#目录)

- block: 块类型;默认宽度为父元素宽度,可设置宽高,会在新的一行显示
- none: 缺省值;像行内元素类型一样显示
- inline: 行内元素;默认宽度为内容宽度,不可设置宽高,与行类元素同行显示
- inline-block: 默认宽度为内容宽度,可以设置宽高,同行显示
- list-item: 象块类型元素一样显示,并添加样式列表标记
- table: 此元素会作为块级表格来显示
- inherit: 规定应该从父元素继承 display 属性的值
