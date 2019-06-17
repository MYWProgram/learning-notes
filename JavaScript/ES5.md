# JavaScript

## 如何理解 JSON

```js
JSON.stringify({ a: 10, b: 20 }); //把对象变成字符串
JSON.parse('{"a":10, "b":20}'); //把字符串变成对象
```

## 描述 new 一个对象的过程

1. 创建一个新对象
2. this 指向这个新对象
3. 执行代码,即对 this 赋值
4. 返回 this

## 创建一个构造函数

构造函数有利于 new 对象的复用

```js
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
```

## 作用域

```js
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
```

## 闭包

```js
//执行时变量值在声明的父作用域中去找

//函数作为返回值:

function F1() {
  var a = 100;
  return function() {
    console.log(a); //自由变量,父作用域中寻找
  };
}
var f1 = F1();
var a = 200; //两个a毫无关系
f1(); //a=100

//函数作为参数传递:

function F1() {
  var a = 100;
  return function() {
    console.log(a); //自由变量,父作用域中寻找
  };
}
var f1 = F1();
function F2(fn) {
  var a = 200;
  fn();
}
F2(f1);
```

## 实际开发中闭包的应用

```js
//实际开发中闭包主要用于封装变量,收敛权限
function isFirstLoad() {
  var _list = [];
  return function(id) {
    if (_list.indexOf(id) >= 0) {
      return false;
    } else {
      _list.push(id);
      return true;
    }
  };
}
//使用
var firstLoad = isFirstLoad();
firstLoad(10); //true
firstLoad(10); //false
firstLoad(20); //true
//在isFirstload函数外面根本不可能修改_list的值
```

## 前端使用异步场景

1. 定时任务:setTimeout,setInverval
2. 网络请求:ajax 请求,动态 img 加载
3. 事件绑定

```js
//ajax请求代码示例
console.log("star");
$.get("./data1.json", function(data1) {
  console.log(data1);
});
console.log("end");
//先执行start,再执行end,最后打印data1

//img加载示例
console.log("start");
var img = document.creatElement("img");
img.onload = function() {
  console.log("loaded");
};
img.src = "/xxx.png";
console.log("end");
//先执行start,再执行end,最后加载图片

//事件绑定示例
console.log("start");
var btn1 = document.getElementById("btn1");
document.addEventListener("click", function() {
  console.log("clicked");
});
console.log("end");
//点击时才会执行clicked
```

## 同步和异步的区别是什么？请分别举例一个同步和异步的例子

同步会阻塞代码执行,异步不会(alert 是同步,setTimeout 是异步)
