# JavaScript

## typeof 返回的类型

~~~js
// typeof 只能区分值类型的详细类型,和引用类型中的函数
typeof undefined //undefined
typeof 'abc' //string
typeof 123 //number
typeof true //boolean
typeof {}/[]/null //Object
typeof console.log //function
~~~

## JS变量中按照存储方式区分为哪些类型,并描述其特点

~~~js
//值类型
var a = 10;
var b = a;
a = 11;
console.log(b); //10
//引用类型
var obj1 = {x:100};
var obj2 = obj1;
obj1.x = 200;
console.log(obj2.x); //200
~~~

## JS中有哪些内置函数

+ Object
+ Array
+ Bollean
+ Number
+ String
+ Function
+ Date
+ RegExp
+ Error

## 如何理解JSON

~~~js
JSON.stringify({a:10, b:20}); //把对象变成字符串
JSON.parse('{"a":10, "b":20}'); //把字符串变成对象
~~~

## 如何准确判断一个变量是数组类型

~~~js
//除了数组,其余都可以用typeof来判断

var arr = [];

arr instanceof Array;

Array.isArray(arr);

Array.prototype.isPrototypeOf(arr);
~~~

## 何时使用===何时使用==

      '=='值相等就成立,'==='值和类型都相等才成立(===会发生类型转换)

      '==='再浏览器中解析更快

      推荐使用'==='

~~~js
//查看一个对象的属性是否存在

if(obj.a == null) {
  //这里相当于obj.a === null || obj.a === undefined的简写形式
  //这是jQuery源码中推荐的写法
};

//在一个函数里查看a的参数是否存在
function(a, b) {
  if(a == null) {
    //这里相当于b === null || b === undefined的简写形式
  }
};
~~~

      PS. 运用if判空必须加上等号,因为if(arr && obj)条件下,当数组或对象为空时,条件也会执行

## 描述new一个对象的过程

    创建一个新对象
    this指向这个新对象
    执行代码,即对this赋值
    返回this

## 创建一个构造函数

      构造函数有利于new对象的复用

~~~js
function P(name, age) {
  this.name = name;
  this.age = age;
};
P.prototype.sayHi = function() {
  console.log('Hi!');
};

let person = P('Mike', 22);
console.log(person);    {name: "Mike", age: 22}
console.log(person.sayHi());    //Hi!
~~~

## call与apply

### 基本用法

      给函数传入参数

~~~js
function add(a,b){
  return a+b;  
};
function sub(a,b){
  return a-b;  
};
// apply的用法
var a1 = add.apply(sub,[4,2]);　　//sub调用add的方法,执行加法
var a2 = sub.apply(add,[4,2]);   //add调用sub的方法
// call的用法
var a1 = add.call(sub,4,2);

//call与apply区别在于apply只接受两个参数,call接收多个
~~~

### 实现继承

~~~js
function animal(name) {
  this.name = name;
  this.eat = function() {
    console.log(`${this.name} eatting`);
  };
};
function monster(name) {
  this.name = name;
  this.bark = function() {
    console.log(`${this.name} barking`);
  };
};
function dog(name) {
  animal.call(this, name);    //animal.apply(this, [name]);
  monster.call(this, name);   //monster.apply(this, [name]);
}
var hashiqi = new dog("dude");
hashiqi.eat();
hashiqi.bark();
~~~

### 一些巧妙的用法

~~~js
//求数组中的最值
var maxNum = Math.max.apply(null, array); //array为一个数组
//合并两个数组
arr1.concat(arr2);    //返回合并后的数组,原数组不变
Array.prototype.push.apply(arr1, arr2);   //返回合并数组长度,原数组变为合并后数组成员
~~~

## this的使用

### this要在执行时才能确认值,定义时无法确认

~~~js
var a = {
  name:'A',
  fn: function() {
    console.log(this.name);
  }
}
a.fn(); //this === a
a.fn.call({name:'B'}); //this === {name:'B'}
var fn1 = a.fn;
fn1(); //this === window,此时this.name为undefined
~~~

### 作为构造函数执行this指代new出的对象

~~~js
function Foo(name) {
  //this = {};
  this.name = name;
  //return this;
}
~~~

### 作为对象属性执行this指代上级对象

~~~js
var obj = {
  name:'A',
  printName: function() {
    console.log(this.name);   //在此对象中this.name = 'A'
  }
}
~~~

### 作为普通函数执行this指代全局对象

~~~js
function fn() {
  console.log(this); //this === window
}
fn();

//call apply bind
function fn1(name, age) {
  alert(name);
  console.log(this); //this === window
}

//call,apply第一个参数就是函数运行时指定的this值

fn1.call({x: 100}, 'zhangsan', 20);
fn1.apply({x:100}, ['zhangsan', 20]);
var fn2 = function(name, age) {
  alert(name);
  console.log(this); //this === {x: 100}
}.bind({x: 100}) //bind只能用函数表达式,函数声明不可用,会报错
fn2('zhangsan', 200);
~~~

## 作用域

~~~js
// 不断向父级元素去寻找自由变量的值
var a = 100;
function fn() {
  var b = 200;
  //当前作用域没有定义的变量,即"自由变量"
  console.log(a);
  console.log(b);
}
fn();

var a = 100;
function F1() {
  var b = 200;
function F2() {
  var c = 300;
  console.log(a); //a是自由变量
  console.log(b); //b是自由变量
  console.log(c);
}
F2();
}
F1();
~~~

## 闭包

~~~js
//执行时变量值在声明的父作用域中去找

//函数作为返回值:

function F1() {
  var a = 100;
  return function() {
    console.log(a); //自由变量,父作用域中寻找
  }
}
var f1 = F1();
var a = 200; //两个a毫无关系
f1(); //a=100

//函数作为参数传递:

function F1() {
  var a = 100;
  return function() {
    console.log(a); //自由变量,父作用域中寻找
  }
}
var f1 = F1();
function F2(fn) {
  var a = 200;
  fn();
}
F2(f1);
~~~

## 实际开发中闭包的应用

~~~js
//实际开发中闭包主要用于封装变量,收敛权限
function isFirstLoad() {
  var _list = [];
  return function(id) {
    if(_list.indexOf(id) >=0 ) {
      return false;
    }
    else {
      _list.push(id);
      return true;
    };
  };
};
//使用
var firstLoad = isFirstLoad();
firstLoad(10);    //true
firstLoad(10);    //false
firstLoad(20);    //true
//在isFirstload函数外面根本不可能修改_list的值
~~~

## 前端使用异步场景

定时任务:setTimeout,setInverval
网络请求:ajax请求,动态img加载
事件绑定

~~~js
//ajax请求代码示例
console.log('star');
$.get('./data1.json', function(data1) {
  console.log(data1);
});
console.log('end');
//先执行start,再执行end,最后打印data1

//img加载示例
console.log('start');
var img = document.creatElement('img');
img.onload = function() {
  console.log('loaded');
};
img.src = '/xxx.png';
console.log('end');
//先执行start,再执行end,最后加载图片

//事件绑定示例
console.log('start');
var btn1 = document.getElementById('btn1');
document.addEventListener('click', function() {
  console.log('clicked');
});
console.log('end');
//点击时才会执行clicked
~~~

## 同步和异步的区别是什么？请分别举例一个同步和异步的例子

同步会阻塞代码执行,异步不会
alert是同步,setTimeout是异步

## 一个关于setTimeout的笔试题

~~~js
console.log(1)；
setTimeout(function() {
  console.log(2);
}, 0)
console.log(3);
setTimeout(function() {
  console.log(4);
}, 1000)
console.log(5);
//1352一秒之后打印4
~~~

## 数组API

### forEach

      遍历数组

~~~js
var arr = [1, 2, 3];
arr.forEach(function(item, index) {
  console.log(index, item);
})
~~~

### every

      判断所有元素是否都符合条件

~~~js
var arr = [1, 2, 3];
var result = arr.every(function(item, index) {
  if(item < 4){
    return true;
  }
})
console.log(result);

//some 判断是否至少一个元素符合条件
var arr = [1, 2, 3];
var result = arr.some(function(item, index){
  //判断所有数组元素,只有一个满足条件即可
  if(item < 2) {
    return true;
  }
})
console.log(result);

//数组添加删除元素
var arr = [1, 2, 3, 5];
arr.pop(); //末尾删除
arr.shift(); //开头删除
arr.push(0); //末尾添加
arr.unshift(0); //开头添加
var arr1 = arr.slice(1, 3); //返回指定区间数组
var arr2 = arr.splice(1,2,3); //从指定位置开始,删除几个元素,添加什么元素

//sort 排序
var arr = [1, 4, 2, 3, 5];
var arr2 = arr.sort(function(a, b) {
  //从小到大排序
  return a - b;
  //从大到小排序
  //return b - a;
})
console.log(arr2);

//实现数组随机排序,排序之后原数组被改变
function randomSort(a, b) {
  return Math.random() >.5 ? -1:1;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.sort(randomSort);

//map 对元素重新组装,生成新数组
var arr = [1, 2, 3, 4];
var arr2 = arr.map(function(item, index) {
  //将元素重新组装并返回
  return '< b >' + item + '< /b >';
})
console.log(arr2);

//filter 过滤符合条件的元素
var arr = [1, 2, 3];
var arr2 = arr.filter(function(item, index) {
  //通过某一个条件过滤数组
  if(item >= 2) {
    return true;
  }
})
console.log(arr2);

//有一个数组对象,进行升序降序,优先级age>sex>id
var urls = [
  {id:1, sex:1, age:25},
  {id:3, sex:1, age:25},
  {id:2, sex:0, age:26},
  {id:5, sex:0, age:26},
  {id:4, sex:1, age:27},
  {id:6, sex:1, age:27},
  {id:8, sex:0, age:29},
  {id:7, sex:0, age:20},
];
urls.sort((a, b) => {
  let updown = 1;
  if(updown === 1) {
    if(a.age === b.age) {
      if(a.sex === b.sex) {
        return a.id - b.id;
      }
      return a.sex - b.sex;
    }
    return a.age - b.age;
  }
  if(updown === -1) {
    if(a.age === b.age) {
      if(a.sex === b.sex) {
        return b.id - a.id;
      }
      return b.sex - a.sex;
    }
    return b.age - a.age;
  }
})
consoe.log(urls);
~~~

## 对象API

~~~js
var obj = {
  x: 100,
  y: 200,
  z: 300
}
var key;
for(key in obj) {
  //注意这里的hasOwnProperty,原型链知识
  if(obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}
~~~

## 获取2017-06-10格式的日期

~~~js
function formaDate(dt) {
  if(!dt) { //判断如果没有参数,保证不报错
    dt = new Date();
  }
  var year = dt.getFullYear();
  var month = dt.getMonth();
  var date = dt.getDate();
  if(month < 10) {
    //强制类型转换
    month = '0' + month;
  }
  if(date < 10) {
    date = '0' + date;
  }
  return year + '-' + month + '-' date;
}
var dt = new Date();
var formaDate = formaDate(dt);
console.log(formaDate);
~~~

## 获取随机数组,要求是长度一致的字符串格式

~~~js
var rabdom = Math.random();
random = random + '0000000000';
random = random.slice(0, 10); //从数组截取选定的起始位置到结束位置
console.log(random);
~~~

## DOM节点操作

~~~js
//获取DOM节点
var div1 = document.getElementById('div1'); //元素
var divList = document.getElementByTagName('div'); //集合
console.log(divList.length);
console.log(divList[0]);
var containerList = document.getElementByClassName('.container'); //一个container的class
var pList = document.querySelectorAll('p'); //所有P元素

//prototype
var pList = document.querySelectorAll('p');
var p = pList[0];
console.log(p.style.width); //获取样式
p.style.width = '100px'; //修改样式
console.log(p.className); //获取class
p.className = 'p1'; //修改class
//获取nodeName和nodeType
console.log(p.nodeName);
console.log(p.nodeType);

//Attribute
var pList = document.querySelectorAll('p');
var p = pList[0];
p.getAttribute('data-name'); //找到对应
p.setAttribute('data-name', 'imooc'); //修改
p.getAttribute('style');
p.setAttribute('style', 'font-size:30px');
~~~

## DOM结构操作

~~~js
//新增节点
var div1 = document.getElementById('div1');
var p1 = document.createElement('p'); //添加新节点
p1.innerHTML = 'this is p1'; //给标签赋值
div1.appendChild(p1); //添加新创建的元素
var p2 = document.getElementById('p2');
div1.appendChild(p2);//移动已有的节点

//获取父元素和子元素
var div1 = document.getElementById('div1');
var parent = div1.parentElement;
var child = div1.childNodes;

//删除节点
var div1 = document.getElementById('div1');
var child = div1.childNodes;
div1.removeChild(child[0]);
~~~

## BOM操作

全称:Browser Object Model

~~~js
//navigator
var ua = navigator.userAgent;
var isChrome = ua.indexOf('Chrome');
console.log(isChrome);

//screen
console.log('screen.width');
console.log(screen.height);

//location
console.log(location.href);
console.log(location.protocol); //'http:' 'https:'
console.log(location.pathname); //'/learn/199'
console.log(location.search);
console.log(location.hash);

//history
history.back();
history.forward();
~~~

## DOM是哪种基本的数据结构

    是一种树形的基本数据结构

## DOM操作的常用API有哪些

    获取DOM节点,以及节点的property和Attribute；获取父节点,获取子节点；新增节点,删除节点

## DOM节点的attr和property有什么区别

    property只是一个JS对象的属性的修改；Attribute是对html便签属性的修改

## 如何检测浏览器的类型

    可以通过检测navigator.userAgent,在通过不同浏览器的不同来检测
    eg.检测是否为Chrome浏览器
    var ua = navigator.userAgent;
    var isChrome = ua.indexOf('Chrome');
    console.log(isChrome);

## 拆解url各部分

    使用location里面的location.href,location.protocol,location.pathname,location.search,location.hash来获取各种参数
    console.log(location.href); //整个域名
    console.log(location.protocol); //'http:' 'https:' 协议
    console.log(location.pathname); //'/learn/199' 网址
    console.log(location.search); //？之后的参数
    console.log(location.hash); //-之后的哈希值

## 通用事件绑定

~~~js
function bindEvent(elem, type, selector, fn) { //selector为使用代理时的选择器
  if(fn == null) {
    fn = selector;
    selector = null;
  }
  elem.addEventListener(type, function(e) {
    var target;
    if(selector) {
      target = e.target;
      if(target.matches(selector)) {
        fn.call(target, e);
      }
    }
    else {
      fn(e);
    }
  })
}
//使用代理
var div1 = document.getElementById('div1');
bindEvent(div1, 'click', 'a', function(e) {
  console.log(this.innerHTML);
})
//不使用代理
var a = document.getElementById('a1');
bindEvent(div1, 'click', function(e) { //不适用直接不传参数selector
  console.log(a.innerHTML);
})
~~~

## 事件冒泡,在body中有div1和div2,1中有id为p1-p4的四个p标签,分别为激活,取消,取消,取消:2中有id为p5-p6的两个取消标签

~~~js
function bindEvent(elem, type, fn) {
  elem.addEventListener(type, fn);
}
var p1 = document.getElementById('p1');
var body = document.body;
bindEvent(p1, 'click', function(e) {
  e.stopPropagation(e); //阻止事件冒泡
  alett("激活");
})
bindEvent(body, 'click', function(e) {
  alert("取消");
})
~~~

## 代理(代码简介,减少浏览器内存占用)html中有若干a1-an的a标签在div1中

~~~js
function bindEvent(elem, type, selector, fn) { //selector为使用代理时的选择器
  if(fn == null) {
    fn = selector;
    selector = null;
  }
  elem.addEventListener(type, function(e) {
    var target;
    if(selector) {
      target = e.target;
      if(target.matches(selector)) {
        fn.call(target, e);
      }
    }
    else {
      fn(e);
    }
  })
}
//使用代理
var div1 = document.getElementById('div1');
bindEvent(div1, 'click', 'a', function(e) {
  console.log(this.innerHTML);
})
//不使用代理
var a = document.getElementById('a1');
bindEvent(div1, 'click', function(e) { //不适用直接不传参数selector
  console.log(a.innerHTML);
})
var div1 = document.getElementById('div1');
div1.addEventListener('click', function(e) {
  var target = e.target;
  if(target.nodeName ==== 'A') { //判断节点是不是a标签
    alert(target.innerHTML);
  }
})
~~~

## JS模块化

    CommonJS
    nodejs模块化规范,现在被大量用于前端因为:
    前端依赖的插件和库,都可以从npm中获取
    构建工具的豪赌自动化,使得使用npm的成本非常低
    CommonJS不会异步加载JS,而是同步一次性加载出来

~~~js
//使用CommonJS
module.exports = {
  getFormaDate: function(data, type) {
    if(type === 1) {
      return '2018-09-04';
    }
    if(type === 2) {
      return '2018年09月04日';
    }
  }
}
//a-util.js
var util = require('util.js');
module.exports = {
  aGetFormaDate: function(data) {
    return util.getFormaDate(data, 2);
  }
}
~~~

    使用场景:需要异步加载JS使用AMD,使用了npm之后建议使用CoomonJS

## 打包工具

    压缩合并JS代码:
    以webpack为例,在module.exports中添加
    plugins:[
      new webpack.optomize.UglifyJsPlugin();
    ],

## 上线回滚的流程

    上线
    将测试完成的代码提交到git版本库的master分支
    将当前服务器的代码全部打包并记录版本号,备份
    将master分支的代码提交覆盖到线上服务器,生成新的版本号
    回滚
    将当前服务器的代码打包并记录版本号,备份
    将备份的上一个版本号解压,覆盖到线上服务器,生成新的版本号

    linux基本命令
    服务器使用linux居多,server版,只有命令行
    测试环境要匹配线上环境,因此也是linux
    经常需要登录测试机来自己配置并获取数据

## 页面加载过程

    加载资源的形式
    输入url(或跳转页面)加载html
    加载html中的静态资源（css或js文件）

    加载一个资源的过程
    浏览器根据DNS服务器得到域名的IP地址
    向这个IP的机器发送http请求
    服务器收到,处理并返回这个请求
    浏览器得到返回的内容
    浏览器渲染页面的过程
    根据HTML生成DOM树
    根据CSS生成CSSOM
    将DOM和CSSOM整合形成RenderTree（渲染树）
    根据RenderTree开始渲染和展示
    遇到script时,会执行并阻塞渲染

## 性能优化

    原则:多使用内存,缓存或其他方法；减少CPU计算,较少网阔
    从哪入手:加载页面和静态资源；页面渲染

    加载资源优化:
    静态资源的合并与压缩
    静态资源缓存
    使用CDN让资源加载更快
    使用SSR获得渲染,数据直接输出到HTML中（vue,react提出；jsp,php,asp属于后端渲染）

    渲染优化:
    CSS放前面,JS放后面
    懒加载（图片懒加载,下拉加载更多）
    减少DOM查询,对DOM查询做缓存
    减少DOM操作,多个操作尽量合并在一起执行
    事件节流
    尽早执行操作（如DOMContentLoaded）

## 安全性

    XSS跨站请求攻击
    比如在新浪写一篇文章,同时插入一段script进去；
    别人查看一次文章script执行一次,会获取察看者的cookie发送到自己的服务器；
    解决:
    前端替换关键字:如 < 替换为 &lt; > 替换为 &gt;

    XSRF跨站请求伪造
    如登陆了一个购物网站,网站付费接口是xxx.com/pay?id=100,但是没有任何验证
    然后你收到了一封邮件,隐藏着img标签=上面的接口地址
    当你查看邮件的时候就已经付费了
    解决:
    增加验证流程,如输入指纹,密码,短信验证（后端操作,前端配合）

## 从输入url到得到html的详细过程

    加载资源的形式
    输入url(或跳转页面)加载html
    加载html中的静态资源（css或js文件）

    加载一个资源的过程
    浏览器根据DNS服务器得到域名的IP地址
    向这个IP的机器发送http请求
    服务器收到,处理并返回这个请求
    浏览器得到返回的内容

    浏览器渲染页面的过程
    根据HTML生成DOM树
    根据CSS生成CSSOM
    将DOM和CSSOM整合形成RenderTree（渲染树）
    根据RenderTree开始渲染和展示
    遇到script时,会执行并阻塞渲染

## window.onload和DOMContentLoaded的区别

    都是在JS原生开发时用到的,比如需要对页面DOM进行动态处理；DOMContentLoaded在dom构建完成之后就会执行,如果在页面中需要加载其他资源,比如图片、flash等,必须这些资源全部加在完毕后才会执行 window.onload,所以DOMContentLoaded是在window.onload之前执行

## 函数调用时加括号与不加括号的区别

    函数只要是要调用它进行执行的,都必须加括号。此时,函数实际上等于函数的返回值或者执行效果,当然,有些没有返回值,但已经执行了函数体内的行为,就是说,加括号的,就代表将会执行函数体代码。
    不加括号的,都是把函数名称作为函数的指针,一个函数的名称就是这个函数的指针,此时不是得到函数的结果,因为不会运行函数体代码。它只是传递了函数体所在的地址位置,在需要的时候好找到函数体去执行。
    PS.加上两个括号相当于直接调用其中的嵌套函数,前提条件时在函数之内必须返回嵌套的函数!

## 题

### JS压缩字符串

~~~js
const zip = arr => {
  let strList;
  let arrStr = '';
  let count = 1;

  if(Array.isArray(arr)) strList = arr;
  else if(typeof arr === 'string') strList = arr.split('');
  else throw new Error('Wrong type!!!');

  for(let i = 0; i < strList.length; i++) {
    if(strList[i+1] === strList[i]) {
      count++;
    }
    else{
      if(count === 1) arrStr += `${strList[i]}`;
      else arrStr += count + `${strList[i]}`;
      count = 1;
    }
  }
  return arrStr;
}

var arr = "aaa1ccbvvvv'''mmmmm";
console.log(zip(arr));
~~~

### 截取url中的键值对

~~~JS
var url = 'http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e';

const getValue = url => {
  if(!/\?/.test(url)) {
    console.log('No value!!!');
  }
  else{
    let arr = url.split('?')[1].split('&');
    var o = {};
    for(let i = 0; i < arr.length; i++) {
      let newArr = arr[i].split('=');
      o[newArr[0]] = newArr[1];
    }
  }
  return o;
}

console.log(getValue(url));
~~~

### 用JS创建10个a标签,点击的时候弹出来对应的序号(作用域闭包理解)

~~~js
var i;
for(i = 0; i < 10; i++) {
  (function(i) { //自执行函数,不用调用,只要定义完成,立即执行
    var a = document.creatElement('a');
    a.innerHTML = i + '< br >';
    a.addEventListener('click', function(e) {
      e.prevevtDefault();
      alert(i);
    });
    document.body.appendChild(a);
  })(i);
}
~~~

### 排他

~~~html
<input type="button" value="狗" />>
<input type="button" value="狗" />>
<input type="button" value="狗" />>
<input type="button" value="狗" />>
<input type="button" value="狗" />>

<script>
  var btnGrp = document.getElementsByTagName('input');
  for(var i=0; i<btnGrp.length; i++) {
    btnGrp[i].addEventListener('click', function() {
      for(var j=0; j<btnGrp.length; j++) {
        btnGrp[j].value = "猫";
      }
      this.value = "狗";
    });
  };
</script>
~~~

### 编写一个通用的事件监听函数

~~~js
var EventUtil = {
// 添加DOM事件
addEvent: function(element, type, handler) {
  if(element.addEventListener) { //DOM2级
    element.addEventListener(type, handler, false);
  }else if(element.attachEvent) {  //IE
    element.attachEvent("on"+ type, handler);
  }else {
    element["on" + type] = handler;
  }
},
// 移除DOM事件
removeEvent: function(element, type, handler) {
  if(element.removeEventListener) { //DOM2级
    element.removeEventListener(type, handler, false);
  }else if(element.detachEvent) {  //IE
    element.detachEvent("on"+ type, handler);
  }else {
    element["on" + type] = null;
  }
},
// 阻止事件冒泡
stopPropagation: function(ev) {
  if(ev.stopPropagation) {
    ev.stopPropagation();
  }else {
    ev.cancelBubble = true;
  }
},
// 阻止默认事件
preventDefault: function(ev) {
  if(ev.preventDefault) {
    ev.preventDefaule();
  }else {
    ev.returnValue = false;
  }
},
// 获取事件源对象
getTarget: function(ev) {
  return event.target || event.srcElement;
},
// 获取事件对象
getEvent: function(e) {
  var ev = e || window.event;
  if(!ev) {
    var c = this.getEvent.caller;
    while(c) {
      ev = c.arguments[0];
      if(ev && Event == ev.constructor) {
        break;
      }
      c = c.caller;
    }
  }
  return ev;
}
~~~

### 给同一个元素添加不同事件指向同一个事件处理函数

~~~js
var btnObj = document.createElement('input');
btnObj.type = 'button';
btnObj.id = 'btn';
btnObj.value = 'click';
document.body.appendChild(btnObj);
btnObj.onclick = change;
btnObj.onmouseover = change;
btnObj.onmouseout = change;
function change(e) {
  switch(e.type) {
    case 'click': this.style.backgroundColor = "red";
    break;
    case 'mouseover': this.style.backgroundColor = "green";
    break;
    case 'mouseout': this.style.backgroundColor = "yellow";
    break;
  };
};
~~~

### 写一个能遍历对象和数组的通用forEach函数

~~~js
function forEach(obj, fn) {
  var key;
  if(obj instanceof Array) {
    //准确判断是不是数组
    obj.forEach(function(item, index) {
      fn(index, item);
    })
  }
  else {
    //不是数组就是对象
    for(key in obj) {
      fn(key, obj[key]);
    }
  }
}
var arr = [1, 2, 3];
//注意这里的参数顺序换了,为了和对象的遍历格式一致
forEach(arr, function(index, item) {
  console.log(index, item);
})
var obj = {x: 100, y: 200};
forEach(obj, function(key, value) {
  console.log(key, value);
})
~~~

### 写一个原型链继承的例子

~~~js
//样例1
function Animal() {
  this.eat = function() {
    console.log("animal eat");
  }
}
function Dog() {
  this.bark = function() {
    console.log("dog bark");
  }
}
Dog.prototype = new Animal();
var hashiqi = new Dog();
//样例2
function Elem(id) {
  this.elem = document.getElementById(id);
}
Elem.prototype.html = function(val) {
  var elem = this.elem;
  if(val) {
    elem.innerHTML = val;
    return this; //链式操作
  }
  else {
    return elem.innerHTML;
  }
}
Elem.prototype.on = function(type, fn) {
  var elem = this.elem;
  elem.addEventListener(type, fn);
  return this;
}
var elem = new Elem('div1');
elem.html('<p>hello word</p>').on('click', function() {
  alert('clicked')
}).html('<p>javascript</p>');
~~~
