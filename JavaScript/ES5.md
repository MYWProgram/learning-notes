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

## 对象 API

```js
var obj = {
  x: 100,
  y: 200,
  z: 300
};
for (var key in obj) {
  //注意这里的hasOwnProperty,原型链知识
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}
```

## 获取 2017-06-10 格式的日期

```js
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
```

## 获取随机数组,要求是长度一致的字符串格式

```js
var random = Math.random();
random = random + "0000000000";
random = random.slice(0, 10); //从数组截取选定的起始位置到结束位置
console.log(random);
```

## 如何检测浏览器的类型

可以通过检测 navigator.userAgent,在通过不同浏览器的不同来检测

eg.检测是否为 Chrome 浏览器

```js
var ua = navigator.userAgent;
var isChrome = ua.indexOf("Chrome");
console.log(isChrome);
```

## 题

### JS 压缩字符串

```js
const zip = arg => {
  let strList;
  let newStr = "";
  let count = 1;

  if (Array.isArray(arg)) strList = arg;
  else if (typeof arg === "string") strList = arg.split("");
  else throw new Error("Wrong type!!!");

  for (let i = 0; i < strList.length; i++) {
    if (strList[i + 1] === strList[i]) {
      count++;
    } else {
      if (count === 1) newStr += `${strList[i]} `;
      else newStr += count + `${strList[i]} `;
      count = 1;
    }
  }
  return newStr;
};

var str = "aaa1ccbvvvv'''mmmmm";
console.log(zip(str));
```

### 截取 url 中的键值对

```JS
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
```

### 用 JS 创建 10 个 a 标签,点击的时候弹出来对应的序号(作用域闭包理解)

```js
var i;
for (i = 0; i < 10; i++) {
  (function(i) {
    //自执行函数,不用调用,只要定义完成,立即执行
    var a = document.creatElement("a");
    a.innerHTML = i + "< br >";
    a.addEventListener("click", function(e) {
      e.prevevtDefault();
      alert(i);
    });
    document.body.appendChild(a);
  })(i);
}
```

### 排他

```html
<input type="button" value="狗" />> <input type="button" value="狗" />>
<input type="button" value="狗" />> <input type="button" value="狗" />>
<input type="button" value="狗" />>

<script>
  var btnGrp = document.getElementsByTagName("input");
  for (var i = 0; i < btnGrp.length; i++) {
    btnGrp[i].addEventListener("click", function() {
      for (var j = 0; j < btnGrp.length; j++) {
        btnGrp[j].value = "猫";
      }
      this.value = "狗";
    });
  }
</script>
```

### 将对象中的某一个属性对应到以另外一个属性值为键的数组中

```js
// 有下面这样的类数组,要求输出: [ [ 'D', 'B' ], [ 'D', 'C' ], [ 'A', 'A' ] ]
var data = [
  { belong: 2, answer: "A" },
  { belong: 1, answer: "D" },
  { belong: 0, answer: "D" },
  { belong: 1, answer: "C" },
  { belong: 0, answer: "B" },
  { belong: 2, answer: "A" }
];

let arr = [];
data.map(item => {
  if (arr[item.belong] === undefined) {
    arr[item.belong] = [];
  }
  arr[item.belong].push(item.answer);
});
console.log(arr);
```

### 给同一个元素添加不同事件指向同一个事件处理函数

```js
var btnObj = document.createElement("input");
btnObj.type = "button";
btnObj.id = "btn";
btnObj.value = "click";
document.body.appendChild(btnObj);
btnObj.onclick = change;
btnObj.onmouseover = change;
btnObj.onmouseout = change;
function change(e) {
  switch (e.type) {
    case "click":
      this.style.backgroundColor = "red";
      break;
    case "mouseover":
      this.style.backgroundColor = "green";
      break;
    case "mouseout":
      this.style.backgroundColor = "yellow";
      break;
  }
}
```

### 写一个能遍历对象和数组的通用 forEach 函数

```js
function forEach(obj, fn) {
  var key;
  if (obj instanceof Array) {
    //准确判断是不是数组
    obj.forEach(function(item, index) {
      fn(index, item);
    });
  } else {
    //不是数组就是对象
    for (key in obj) {
      fn(key, obj[key]);
    }
  }
}
var arr = [1, 2, 3];
//注意这里的参数顺序换了,为了和对象的遍历格式一致
forEach(arr, function(index, item) {
  console.log(index, item);
});
var obj = { x: 100, y: 200 };
forEach(obj, function(key, value) {
  console.log(key, value);
});
```

### 写一个原型链继承的例子

```js
//样例1
function Animal() {
  this.eat = function() {
    console.log("animal eat");
  };
}
function Dog() {
  this.bark = function() {
    console.log("dog bark");
  };
}
Dog.prototype = new Animal();
var hashiqi = new Dog();
//样例2
function Elem(id) {
  this.elem = document.getElementById(id);
}
Elem.prototype.html = function(val) {
  var elem = this.elem;
  if (val) {
    elem.innerHTML = val;
    return this; //链式操作
  } else {
    return elem.innerHTML;
  }
};
Elem.prototype.on = function(type, fn) {
  var elem = this.elem;
  elem.addEventListener(type, fn);
  return this;
};
var elem = new Elem("div1");
elem
  .html("<p>hello word</p>")
  .on("click", function() {
    alert("clicked");
  })
  .html("<p>javascript</p>");
```
