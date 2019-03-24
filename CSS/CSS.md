# CSS疑难杂症

## 目录

1. [消除inline-block元素间隙](#消除inline-block元素间隙)
2. [前端单位](#前端单位)
3. [块级元素与行内元素](#块级元素与行内元素)
4. [CSS百分比参照问题](#CSS百分比参照问题)
5. [CSS浏览器兼容问题](#CSS浏览器兼容问题)
6. [布局问题](#布局问题)
7. [响应式布局](#响应式布局)
8. [垂直居中定位方法](#垂直居中定位方法)
9. [display的一些属性及作用](#display的一些属性及作用)

## 消除inline-block元素间隙

[返回目录](#目录)

~~~html
<div class="space">
  <a href="#">XXX</a>
  <a href="#">XXX</a>
  <a href="#">XXX</a>
</div>
<!-- 物理方法移除 -->

<!--1-->
<div>
  <a href="#">XXX</a
  ><a href="#">XXX</a
  ><a href="#">XXX</a>
</div>

<!--2-->
<div>
  <a href="#">XXX</a><!--
  --><a href="#">XXX</a><!--
  --><a href="#">XXX</a>
</div>
~~~

~~~css
/* 使用margin负值,这个方法不适合大规模使用 */
.space a{
  display: inline-block;
  margin-right: -3px;
}
~~~

~~~html
<!-- IE向下兼容可在末尾加上</a> -->
<div>
  <a href="#">XXX
  <a href="#">XXX
  <a href="#">XXX
</div>
~~~

~~~css
/* 通过设置父元素的字体为0,这个方法可以解决大多数浏览器;是移动端最好的解决方式 */
.space{
  font-size: 0;
  -webkit-text-size-adjust:none; /* chrome中加上这句消除字体大小限制 */
}
.space a{
  font-size: 12px;
}
~~~

~~~css
/* 通过设置字符间距,该方法可以解决所有浏览器 */
.space{
  letter-spacing: -3px;
}
.space a{
  letter-spacing: 0;
}
~~~

~~~css
/* 通过设置单词间距 */
.space{
  display: inline-block;/* chrome中需要加上这句 */
  word-spacing: -6px;
}
.space a{
  word-spacing: 0;
}
~~~

## 前端单位

[返回目录](#目录)

- px

相对于显示器屏幕分辨率而言的,没有弹性,不适用于响应式的设计;

- em

相对父元素的`font-size`;大小并不是固定的,会继承父元素的字体大小,由于这个特性可以用于响应式的设计;所有未经调整的浏览器中`1em = 16px`;在css body选择器中声明`font-size: 62.5%`,那么在这个`html`页面中,`1em = 10px`

- rem

是相对于根元素`html`,只需要在根元素确定一个参考值,如在`css`中`html {font-size: 10px; | font-size: 62.5%;}`,那么`1rem = 10px`;只需要设置根目录大小就可以把整个页面成比例的设置好;也可用于设计响应式

- %

百分比单位,参考物有三种情况:

1. 对于普通定位元素就是我们理解的父元素
2. 对于position: absolute;的元素是相对于已定位的父元素
3. 对于position: fixed;的元素是相对于ViewPort（可视窗口）

### vw,vh,vmin,vmax

百分比单位,相对于可视区域,可用于设计响应式;其中`vh`为相对于可视高度,`vw`是相对于可视宽度,`vmin`是相对于两者较小的,`vmax`是相对于两者较大的

例如可视高度为`1080px`,那么`100vw = 1080px`; `1vw = 10.8px`

## 块级元素与行内元素

[返回目录](#目录)

- 块级元素：div,p,h1~h6,ul,ol,dl,li,dd,table,hr,blockquote,address,menu,pre/header,section,aside,fotter(后面为H5新增)

- 行内元素：span,a,lable,abbr,em,big,cite(引用),i,q(短引用),textarea,select,strong,u(下划线),button(默认display: inline-block)

- 行内块状元素：img,input,td

在标准文档流里：

- 块级元素:总是在新的一行开始占据一整行；高度,行高以及外边距和内边距都可控制；宽度始终与浏览器一样,和内容无关；可以容纳内联元素和其他块元素

- 行内元素:和其他行内元素都在一行上；高,行高以及外边距和内边距不可改；宽度只与内容有关；只能容纳文本图片或其他行内元素；不可以设置宽高,其宽度随着内容增加,高度随字体大小而改变,内联元素可以设置外边界,但是外边界不对上下起作用,只能对左右起作用,也可以设置内边界,但是内边界在ie6中不对上下起作用,只能对左右起作用

二者可以互相转换:

- 通过设置display属性,转为行内display: inline;转为块级display: block

## CSS百分比参照问题

[返回目录](#目录)

- 参照父元素宽度元素: padding margin width text-indent

- 参照父元素高度元素: height

- 参照父元素属性: font-size line-height

- 特殊: 相对定位top(bottom)left(right)参照父元素的内容区域高度与宽度;绝对定位时参照最近的定位元素包含padding的高度与宽度

## CSS浏览器兼容问题

[返回目录](#目录)

- 不同浏览器的标签默认的外补丁和内补丁不同,随便写几个标签,不加样式控制的情况下,各自的margin和padding差异较大

  解决方案: css里*{margin:0;padding:0;}

- 块级元素标签float后,又有横行的margin情况下,在ie6显示margin比设置的大;ie6中后面的一块被顶到下一行

  解决方案:在float的标签样式控制中加入display:inline;将其转化为行内属性

- 设置较小高度标签(一般小于10px),在ie6,7遨游中高度超出自己设置高度

  解决方案:给超出高度的标签设置overflow:hidden;或者设置行高line-height小于你设置的高度

- 要在n栏的float div后面做一个统一的背景;要将page的背景设置成蓝色,以达到所有三栏的背景颜色是蓝色的目的,但是我们会发现随着left centerright的向下拉长,而page居然保存高度不变,问题来了,原因在于page  不是float属性,而我们的page由于要居中,不能设置成float,所以我们应该这样解决:再嵌入一个float left而宽度是100%的DIV解决之

  eg.

~~~html
<!-- 解决前 -->
<div id=”page”>
<div id=”left”>＜/div>
<div id=”center”>＜/div>
<div id=”right”>＜/div>
</div>
<!-- 解决后 -->
<div id=”page”>
<div id=”bg” style=”float:left;width:100%”>
<div id=”left”>＜/div>
<div id=”center”>＜/div>
<div id=”right”>＜/div>
</div>
</div>
~~~

- 表单元素行高不一致

  解决方案:给表单元素添加`float:left`(左浮动);或者是`vertical-align:middle`;(垂直对齐方式:居中)

- 设置较小高度的容器(小于10px),在IE6下不识别小于10px的高度

  解决方案:给容器添加`overflow:hidden`;

- 当在a标签中嵌套img标签时,在某些浏览器中img会有蓝色边框

  解决方案:给`img`添加`border:0`;或者是`border:none`;

## 布局问题

[返回目录](#目录)

position定位:

- static:元素框正常生成;块级元素生成一个矩形框,作为文档流的一部分,行内元素则会创建一个或多个行框,置于其父元素中
- relative:元素框偏移某个距离;元素仍保持其未定位前的形状,它原本所占的空间仍保留;移动元素会导致它覆盖其他框
- absolute:元素框从文档流完全删除,并相对于其包含块定位;包含块可能是文档中的另一个元素或者是初始包含块;元素原先在正常文档流中所占的空间会关闭,就好像元素原来不存在一样;元素定位后生成一个块级框,而不论原来它在正常流中生成何种类型的框
- fixed:元素框的表现类似于将position设置为absolute,不过其包含块是视窗本身
- float:浮动的框可以向左或向右移动,直到它的外边缘碰到包含框或另一个浮动框的边框为止;由于浮动框不在文档的普通流中,所以文档的普通流中的块框表现得就像浮动框不存在一样;浮动格式可以用clear来清除

- flex(弹性)布局: [Flex教程链接](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)

任何一个容器都可以指定为`flex`布局`(display: flex;)`,行内元素``(display: inline-flex;)``;设置为`flex`布局之后,子元素的`float clear vertical-align`属性将失效

设定`flex`之后默认存在两根轴(水平的主轴和垂直的交叉轴),项目默认沿主轴排列

~~~css
/* 容器的属性 */

/* flex-direction决定主轴方向,即项目排列方向;依次为左起水平方向(此为默认值),右起水平方向,上起垂直方向,下起垂直方向 */
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
/* flex-wrap定义如何换行;依次为不换行(默认),换行第一行在上,换行第一行在下 */
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
/* justify-content属性定义了项目在主轴上的对齐方式;依次为左对齐(默认值),右对齐,剧中对齐,两端对齐且项目之间间距相等,在前者基础上两侧项目与边框间距相等,项目之间的间隔比项目与边框的间隔大一倍 */
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
/* align-items属性定义项目在交叉轴上如何对齐;依次为起点对齐,终点对齐,中点对齐,项目内第一行文字基线对齐,项目未设置高度或设置auto将占满整个容器高度 */
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
/* align-content属性定义了多根轴线的对齐方式,如果项目只有一根轴线,该属性不起作用;space-between与交叉轴两端对齐,轴线之间的间隔平均分布;space-around每根轴线两侧的间隔都相等,所以,轴线之间的间隔比轴线与边框的间隔大一倍 */
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}

/* 项目的属性 */

/* order属性定义项目的排列顺序;数值越小,排列越靠前,默认为0 */
.item {
  order: 1;
}
/* flex-grow属性定义项目的放大比例,默认为0,即如果存在剩余空间,也不放大;如果所有项目的flex-grow属性都为1,则它们将等分剩余空间;如果一个项目的flex-grow属性为2,其他项目都为1,则前者占据的剩余空间将比其他项多一倍 */
.item {
  flex-grow: 0; /* default 0 */
}
/* flex-shrink属性定义了项目的缩小比例,默认为1,即如果空间不足,该项目将缩小;如果所有项目的flex-shrink属性都为1,当空间不足时,都将等比例缩小;如果一个项目的flex-shrink属性为0,其他项目都为1,则空间不足时,前者不缩小,负值对该属性无效 */
.item {
  flex-shrink: 1; /* default 1 */
}
/* align-self属性允许单个项目与其他项目有不一样的对其方式,可覆盖align-items属性;默认值为auto,表示继承父元素的align-items属性值,如果没有父元素显示stretch */
.item {
    align-self: auto | flex-start | flex-end | center | baseline | stretch
}

~~~

## 响应式布局

[返回目录](#目录)

- 原生:

~~~html
<!-- 设置meta标签 -->
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="HandheldFriendly" content="true">
<!-- user-scalable解决ipad切换横屏之后触摸才能回到具体尺寸的问题;同时也设置禁止用户自己缩放 -->
~~~

~~~css
/* 通过媒体查询来设置样式media query */
/* 假如一个终端的分辨率小于980px,那么可以这样写 */
@media screen and (max-width:980px){
  #head { … }
  #content { … }
  #footer { … }
/* 要兼容ipad和iphone视图,我们可以这样设置 */
/**ipad**/
@media only screen and (min-width:768px)and(max-width:1024px){}
/**iphone**/
@media only screen and (width:320px)and (width:768px){}
/* 响应式字体 */
html{font-size:100%;}
@media (min-width:640px){body{font-size:1rem;}} /* 用于设置元素的最小宽度 */
@media (min-width:960px){body{font-size:1.2rem;}}
@media (min-width:1200px){body{font-size:1.5rem;}}
/* 响应式需要注意的问题;宽度不固定,可以使用百分比 */
#head{width:100%;}
#content{width:50%;}
/* 响应式图片处理 */
/* img为标签的图片 */
/* 如此设置后ID为wrap内的图片会根据wrap的宽度改变已达到等宽扩充,height为auto的设置是为了保证图片原始的高宽比例,以至于图片不会失真 */
#wrap img{
  max-width:100%;
  height:auto;
}
/* logo为背景的图片 */
/* background-size用于设置背景图片的大小,有两个可选值,第一个值用于指定背景图的width,第2个值用于指定背景图的height,如果只指定一个值,那么另一个值默认为auto */
/* background-size:cover;等比扩展图片来填满元素 background-size:contain;等比缩小图片来适应元素的尺寸 */
#log a{display:block;
  width:100%;
  height:40px;
  text-indent:55rem; /* 文本快中首行文本缩进 */
  background-img:url(logo.png);
  background-repeat:no-repeat;
  background-size:100% 100%;
}
~~~

- bootstrap:

栅格系统:

栅格系统分为12列,即每行最多可容纳12列;一个`.row`内包含的列(column)大于12个(即,一行中的栅格单元超过12个单元),则会自动排版

- 移动设备:.col-sm-列数 (>=576px)
- 平板:.col-md-列数 (>=768px)
- 桌面:.col-lg-列数 (>=992px)
- 超大桌面:.col-xl-列数 (>=1200px)

~~~html
<!-- head部分处理 -->
 <head>
  <meta charset="UTF-8">
  <title>Document</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <!-- IE8需要如下处理兼容性 -->
  <!-- [if lt IE 9]>
      <script  src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif] -->
</head>

<!-- 一行中左右sm各6列,md8+4 -->
<div class="row">
  <div class="col-xs-12 col-md-8">.col-xs-12 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
~~~

## 垂直居中定位方法

[返回目录](#目录)

水平居中:

- 直接设置div块的样式: width:?px; margin: 0 auto;
- 父元素样式设置:text-align: center;(仅针对于行内元素有效,对块级元素无效)
- 设置div样式:position: relative;(这是相对于父元素) margin: auto; left: 0; right: 0;
- 运用flex,父元素div设置:justify-content: center; display: -webkit-flex;

垂直居中:

- 父元素中设置height与line-height值相等(仅用于行内元素,对块级元素无效)
- 父元素设置:display: table-cell; vertical-align: middle;
- 运用flex,父元素设置:align-items: center; display: -webkit-flex;

垂直居中特例(可运用上面两种方法组合,视情况而定)

- position: relative; top: 50%; left: 50%; margin: -150px 0 0 -250px;(已知h:500px w:300px)
- position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
- flex父元素设置: display: flex; align-items: center; justify-content: center;

~~~html
<!-- 基础html -->
<div class='out-box align-center'>
  <div class='box'></div>
</div>
~~~

~~~css
/* 基础css */
.out-box {
  background: #27AE60;
  height: 200px;
  border: 1px solid #555;
  margin-bottom: 20px;
}
.box {
  width: 300px;
  height: 100px;
  background: #555;
}
~~~

~~~css
/* 利用relative和absolute进行定位,设置子元素为父元素负值的一半 */
/* 适合用于长宽固定的情况,但长和宽一旦改变需要重置marginleft和margin-top */
.align-center {
  position: relative;
}
.align-center .box {
  position: absolute;
  margin-left: -150px;
  margin-top: -50px;
  left: 50%;
  top: 50%;
}

/* css3中transform与定位 */
/* 对盒子长宽没有要求,属于百分比布局;但transform属于css3属性,低版本ie不支持 */
.align-center {
  position: relative;
}
.align-center .box {
  position: relative;
  transform: translate(-50%,-50%);
  left: 50%;
  top: 50%;
}
~~~

## display的一些属性及作用

[返回目录](#目录)

- block: 块类型;默认宽度为父元素宽度,可设置宽高,会在新的一行显示
- none: 缺省值;像行内元素类型一样显示
- inline: 行内元素;默认宽度为内容宽度,不可设置宽高,与行类元素同行显示
- inline-block: 默认宽度为内容宽度,可以设置宽高,同行显示
- list-item: 象块类型元素一样显示,并添加样式列表标记
- table: 此元素会作为块级表格来显示
- inherit: 规定应该从父元素继承 display 属性的值
