# CSS方式清除浮动的方法

## 使用带clear属性的空元素

在浮动元素后使用一个空元素`<div class="clear"></div>`，并且在CSS中赋予`.clear {clear: both}`即可；或者直接添加`<br class="clear">`或`<hr class="clear">`；这种方法代码少、浏览器兼容性也好，但是不符合html语义化，后期也不容易维护。

~~~html
<div class="news">
  <h1>some text</h1>
  <p>the other text</p>
  <div class="clear"></div>
</div>
~~~

~~~css
.news {
  background-color: gray;
  border: solid 1px black;
}

.news h1 {
  float: left;
}

.news p {
  float: right;
}

.clear {
  clear: both;
}
~~~

## 使用CSS的overflow属性

给浮动元素的容器添加`overflow: hidden;`或`overflow: auto;`兼容IE浏览器还需要出发hasLayout，例如给父元素设置容器高度或设置`zoom: 1;`。

~~~html
<div class="news">
  <h1>some text</h1>
  <p>the other text</p>
</div>
~~~

~~~css
.news {
  background-color: gray;
  border: solid 1px black;
  overflow: hidden;
  *zoom: 1;
}

.news h1 {
  float: left;
}

.news p {
  float: right;
}
~~~

## 给浮动元素的容器添加浮动

给浮动元素的容器也添加上浮动属性即可清除内部浮动，但是这样会使其整体浮动，影响布局，不推荐使用。

## 使用邻接元素处理

给浮动元素后面的元素添加clear属性即可，但是浮动元素后的元素必须有内容。

~~~html
<div class="news">
  <h1>some text</h1>
  <p>the other text</p>
  <div class="content">***</div>
</div>
~~~

~~~css
.news {
  background-color: gray;
  border: solid 1px black;
}

.news img {
  float: left;
}

.news p {
  float: right;
}

.content{
  clear:both;
}
~~~

## 使用伪元素处理

给浮动元素的容器添加一个clearfix的class，然后给这个class添加一个::after伪元素实现元素末尾添加一个看不见的块元素清理浮动。

~~~html
<div class="news clearfix">
  <h1>some text</h1>
  <p>the other text</p>
</div>
~~~

~~~css
.news {
  background-color: gray;
  border: solid 1px black;
}

.news img {
  float: left;
}

.news p {
  float: right;
}

.clearfix:after{
  content: "020"; 
  display: block; 
  height: 0; 
  clear: both; 
  visibility: hidden;  
}

.clearfix {
  /* 兼容IE */
  zoom: 1;
}
~~~