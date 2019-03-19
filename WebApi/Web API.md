# Web API

## Web API介绍

### API的概念

API(Application Programming Interface,应用程序编程接口)是一些预先定义的函数,目的是提供应用程序与开发人员基于某软件或硬件问一组例程的能力,而又无需访问源码,或理解内部工作机制的细节

1. 任何开发语言都有自己的API
2. API的特征输入和输出(I/O)
3. API的使用方法(console.log())

## BOM - 浏览器对象模型

### BOM的概念

一套操作浏览器功能的API

通过BOM可以操作浏览器窗口,比如: 弹出框,控制浏览器跳转,获取分辨率等

浏览器对象模型提供了独立于内容的,可以与浏览器窗口进行互动的对象结构;BOM由多个对象组成,其中代表浏览器窗口的Window对象是BOM的顶层对象,其他对象都是该对象的子对象

我们在浏览器中的一些操作都可以使用BOM的方式进行编程处理,比如: 刷新浏览器,后退,前进,在浏览器中输入URL等

### BOM的顶级对象window

window是浏览器的顶级对象,当调用window下的属性和方法时,可以省略window

PS. **window下一个特殊的属性 window.name**

### 对话框

- alert()
- prompt()
- confirm()

### 页面加载事件

- onload

~~~js
window.onload = function () {
  // 当页面加载完成执行
  // 当页面完全加载所有内容（包括图像,脚本文件,CSS 文件等）执行
};
~~~

- onunload-onbeforeunload

~~~js
window.onunload = function () {
  // 关闭页面后执行
};

window.onbeforeunload = function() {
  // 关闭之前执行
};
~~~

### 定时器

#### setTimeout()和clearTimeout()

在指定的毫秒数到达之后执行指定的函数,只执行一次;不清除会一直存在页面中占空间

~~~js
// 创建一个定时器,1000毫秒后执行,返回定时器的标示
var timerId = setTimeout(function () {
  console.log('Hello World');
}, 1000);

// 取消定时器的执行
clearTimeout(timerId);
~~~

#### setInterval()和clearInterval()

定时调用的函数,可以按照给定的时间(单位毫秒)周期调用函数

~~~javascript
// 创建一个定时器,每隔1秒调用一次
var timerId = setInterval(function () {
  var date = new Date();
  console.log(date.toLocaleTimeString());
}, 1000);

// 取消定时器的执行
clearInterval(timerId);
~~~

### location对象

location对象是window对象下的一个属性,时候的时候可以省略window对象

location可以获取或者设置浏览器地址栏的URL

#### URL

统一资源定位符(Uniform Resource Locator)

- URL的组成

scheme://host:port/path?query#fragment

- scheme: 通信协议;常用的http,ftp,maito等
- host: 主机;服务器(计算机)域名系统 (DNS) 主机名或 IP 地址
- port: 端口号
整数,可选,省略时使用方案的默认端口,如http的默认端口为80
- path: 路径;由零或多个'/'符号隔开的字符串,一般用来表示主机上的一个目录或文件地址
- query: 查询;可选,用于给动态网页传递参数,可有多个参数,用'&'符号隔开,每个参数的名和值用'='符号隔开;例如:name=zs
- fragment: 信息片断;字符串,锚点

#### 案例

解析URL中的query,并返回对象的形式

~~~js
function getQuery(queryStr) {
  var query = {};
  if (queryStr.indexOf('?') > -1) {
    var index = queryStr.indexOf('?');
    queryStr = queryStr.substr(index + 1);
    var array = queryStr.split('&');
    for (var i = 0; i < array.length; i++) {
      var tmpArr = array[i].split('=');
      if (tmpArr.length === 2) {
        query[tmpArr[0]] = tmpArr[1];
      }
    }
  }
  return query;
}
console.log(getQuery(location.search));
console.log(getQuery(location.href));
~~~

### history对象

- back()
- forward()
- go()

### navigator对象

- userAgent

通过userAgent可以判断用户浏览器的类型

- platform

通过platform可以判断浏览器所在的系统平台类型.

## DOM - 文档对象模型

### DOM的概念

一套操作页面元素的API

DOM可以把HTML看做是文档树,通过DOM提供的API可以对树上的节点进行操作

在网页上,组织页面(或文档)的对象被组织在一个树形结构中,用来表示文档中对象的标准模型就称为DOM

DOM又称为文档树模型

- 文档: 一个网页可以称为文档
- 节点: 网页中的所有内容都是节点（标签,属性,文本,注释等）
- 元素: 网页中的标签
- 属性: 标签的属性

### 模拟文档树结构

~~~js
function Element(option) {
  this.id = option.id || '';
  this.nodeName = option.nodeName || '';
  this.nodeValue = option.nodeValue || '';
  this.nodeType = 1;
  this.children = option.children || [];
};

var doc = new Element({
  nodeName: 'html'
});
var head = new Element({
  nodeName: 'head'
});
var body = new Element({
  nodeName: 'body'
});
doc.children.push(head);
doc.children.push(body);

var div = new Element({
  nodeName: 'div',
  nodeValue: 'haha',
});

var p = new Element({
  nodeName: 'p',
  nodeValue: '段落'
});
body.children.push(div);
body.children.push(p);

function getChildren(ele) {
  for(var i = 0; i < ele.children.length; i++) {
    var child = ele.children[i];
    console.log(child.nodeName);
    getChildren(child);
  };
};
getChildren(doc);
~~~

### DOM经常进行的操作

- 获取元素
- 动态创建元素
- 对元素进行操作(设置其属性或调用其方法)
- 事件(什么时机做相应的操作)

## 获取页面元素

### 根据id获取元素

~~~js
var div = document.getElementById('main');
console.log(div);

// 获取到的数据类型 HTMLDivElement,对象都是有类型的
// HTMLDivElement <-- HTMLElement <-- Element  <-- Node  <-- EventTarget
~~~

PS. **由于id名具有唯一性,部分浏览器支持直接使用id名访问元素,但不是标准方式,不推荐使用**

### 根据标签名获取元素

~~~js
var divs = document.getElementsByTagName('div');
for (var i = 0; i < divs.length; i++) {
  var div = divs[i];
  console.log(div);
};
~~~

### 根据name获取元素

~~~javascript
var inputs = document.getElementsByName('hobby');
for (var i = 0; i < inputs.length; i++) {
  var input = inputs[i];
  console.log(input);
};
~~~

### 根据类名获取元素

~~~javascript
var mains = document.getElementsByClassName('main');
for (var i = 0; i < mains.length; i++) {
  var main = mains[i];
  console.log(main);
};
~~~

### 根据选择器获取元素

~~~javascript
var text = document.querySelector('#text');
console.log(text);

var boxes = document.querySelectorAll('.box');
for (var i = 0; i < boxes.length; i++) {
  var box = boxes[i];
  console.log(box);
};
~~~

总结

~~~javascript
//掌握

getElementById();
getElementsByTagName();

//特殊

document.body// 获取body元素
document.title// 获取title的值
document.documentElement// 获取html元素

//了解

getElementsByName();
getElementsByClassName();
querySelector();
querySelectorAll();
~~~

## 事件

事件: 触发-响应机制

Event接口表示在DOM中发生的任何事件,一些是用户生成的(例如鼠标或键盘事件),而其他由API生成

### 事件三要素

- 事件源: 触发(被)事件的元素
- 事件类型: 事件的触发方式(例如鼠标点击或键盘点击)
- 事件处理程序: 事件触发后要执行的代码(函数形式)

### 事件的基本使用

~~~js
var box = document.getElementById('box');
box.onclick = function() {
  console.log('代码会在box被点击后执行');  
};
~~~

## 属性操作

### 非表单元素的属性

href,title,id,src,className

~~~js
var link = document.getElementById('link');
console.log(link.href);
console.log(link.title);

var pic = document.getElementById('pic');
console.log(pic.src);
~~~

- innerHTML和innerText

~~~javascript
var box = document.getElementById('box');
box.innerHTML = '我是文本<p>我会生成为标签</p>';
console.log(box.innerHTML);
box.innerText = '我是文本<p>我不会生成为标签</p>';
console.log(box.innerText);
~~~

- HTML转义符

~~~js
": &quot;
‘: &apos;
&: &amp;
<: &lt;    //less than  小于
>: &gt;   // greater than  大于
空格: &nbsp;
©: &copy;
~~~

- innerHTML和innerText的区别

  innerHTML指的是从对象的起始位置到终止位置的全部内容,包括Html标签
  innerText指的是从起始位置到终止位置的内容,但它去除Html标签

- innerText的兼容性处理

~~~js
var div = document.getElementById("content");
function getInnerText(element) {
    return (typeof element.textContent == "string") ? element.textContent : element.innerText;
};
function setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    }
    else {
        element.innerText = text;
    };
};
setInnerText(div, "Hello world!");
alert(getInnerText(div)); //"Hello world!"
~~~

### 表单元素属性

- value: 用于大部分表单元素的内容获取(option除外)
- type: 可以获取input标签的类型(输入框或复选框等)
- disabled: 禁用属性
- checked: 复选框选中属性
- selected: 下拉菜单选中属性

### 自定义属性操作

- getAttribute(): 获取标签行内属性
- setAttribute(): 设置标签行内属性
- removeAttribute(): 移除标签行内属性
- 与element.属性的区别: 上述三个方法用于获取任意的行内属性

### 样式操作

使用style方式设置的样式显示在标签行内

~~~js
var box = document.getElementById('box');
box.style.width = '100px';
box.style.height = '100px';
box.style.backgroundColor = 'red';
~~~

PS. **通过样式属性设置宽高,位置的属性类型是字符串,需要加上px**

### 类名操作

修改标签的className属性相当于直接修改标签的类名

~~~js
var box = document.getElementById('box');
box.className = 'clearfix';
~~~

## 创建元素的三种方式

### document.write()

~~~javascript
document.write('新设置的内容<p>标签也可以生成</p>');
~~~

### innerHTML

~~~javascript
var box = document.getElementById('box');
box.innerHTML = '新内容<p>新标签</p>';
~~~

### document.createElement()

~~~javascript
var div = document.createElement('div');
document.body.appendChild(div);
~~~

### 性能问题

- innerHTML方法由于会对字符串进行解析,需要避免在循环内多次使用;
- 可以借助字符串或数组的方式进行替换,再设置给innerHTML
- 优化后与document.createElement性能相近

## 节点操作

~~~javascript
var body = document.body;
var div = document.createElement('div');
body.appendChild(div);

var firstEle = body.children[0];
body.insertBefore(div,firstEle);

body.removeChild(firstEle);

var text = document.createElement('p');
body.replaceChild(text, div);
~~~

### 节点层级

~~~js
var box = document.getElementById('box');
console.log(box.parentNode);
console.log(box.childNodes);
console.log(box.children);
console.log(box.nextSibling);
console.log(box.previousSibling);
console.log(box.firstChild);
console.log(box.lastChild);
~~~

- 注意

  childNodes和children的区别,childNodes获取的是子节点(标签,文本,属性;回车换行也是文本),children获取的是子元素

  nextSibling和previousSibling获取的是节点,获取元素对应的属性是nextElementSibling和previousElementSibling获取的是元素

  ​nextElementSibling和previousElementSibling有兼容性问题,IE9以后才支持

- 总结

~~~js
// 节点操作,方法

appendChild();    // 之后追加
insertBefore();   // 之前添加;newChild,refChild,第一个是添加的参数,第二个是参照的参数
removeChild();    // 移除元素
replaceChild();   // 替换元素;newChild,refChild,第一个是替换后的,第二个是参照

// 节点层次,属性

parentNode
childNodes
children
nextSibling/previousSibling
firstChild/lastChild
~~~

## 事件详解

### 注册/移除事件的三种方式

~~~js
var box = document.getElementById('box');
box.onclick = function () {
  console.log('点击后执行');
};
box.onclick = null;
// 事件监听器第三个参数Boolean,false为事件冒泡,true为事件捕获
box.addEventListener('click', eventCode, false);
box.removeEventListener('click', eventCode, false);

box.attachEvent('onclick', eventCode);
box.detachEvent('onclick', eventCode);

function eventCode() {
  console.log('点击后执行');
};
~~~

### 兼容代码

~~~js
function addEventListener(element, type, fn) {
  if (element.addEventListener) {
    element.addEventListener(type, fn, false);
  }
  else if (element.attachEvent){
    element.attachEvent('on' + type,fn);
  }
  else {
    element['on'+type] = fn;
  };
};

function removeEventListener(element, type, fn) {
  if (element.removeEventListener) {
    element.removeEventListener(type, fn, false);
  }
  else if (element.detachEvent) {
    element.detachEvent('on' + type, fn);
  }
  else {
    element['on'+type] = null;
  };
};
~~~

### 事件的三个阶段

1. 捕获阶段(从外向里)
2. 当前目标阶段
3. 冒泡阶段(从里向外)

事件对象.eventPhase属性可以查看事件触发时所处的阶段(对应值为1 2 3)

### 事件对象的属性和方法

- event.type 获取事件类型
- clientX/clientY     所有浏览器都支持,窗口位置
- pageX/pageY       IE8以前不支持,页面位置
- event.target || event.srcElement 用于获取触发事件的元素
- event.preventDefault() 取消默认行为

### 阻止事件冒泡的方式

- 标准方式: event.stopPropagation();
- IE低版本:event.cancelBubble = true; 标准中已废弃

### 常用的鼠标和键盘事件

- onmouseup 鼠标按键放开时触发
- onmousedown 鼠标按键按下触发
- onmousemove 鼠标移动触发
- onkeyup 键盘按键按下触发
- onkeydown 键盘按键抬起触发

## 特效

### 偏移量

- offsetParent: 用于获取定位的父级元素
- offsetParent和parentNode的区别

~~~js
// 1.(没有脱离文档流)会受到父级元素的margin+padding+border以及自己的margin的影响 2.(自己脱离文档流)不会受到父元素的影响,只有自己的margin和left/top会影响
var box = document.getElementById('box');
console.log(box.offsetParent);
console.log(box.offsetLeft);
console.log(box.offsetTop);
console.log(box.offsetWidth);
console.log(box.offsetHeight);
~~~

### 客户区大小

~~~js
// 可视区域
var box = document.getElementById('box');
console.log(box.clientLeft); // 左边边框的宽度
console.log(box.clientTop); // 上边边框的宽度
console.log(box.clientWidth); // 不包含边框,边框内部的宽度
console.log(box.clientHeight); // 不包含边框
~~~

### 滚动偏移

~~~js
// 显示元素中内容的实际量,没有内容就是元素的实际量
var box = document.getElementById('box');
console.log(box.scrollLeft);    // 元素向左卷曲的实际量
console.log(box.scrollTop);   //元素向上卷曲的实际高度
console.log(box.scrollWidth);
console.log(box.scrollHeight);
~~~