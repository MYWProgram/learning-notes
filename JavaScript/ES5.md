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

## call 与 apply

### 基本用法

给函数传入参数

```js
function add(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
}
// apply的用法
var a1 = add.apply(sub, [4, 2]); //sub调用add的方法,执行加法
var a2 = sub.apply(add, [4, 2]); //add调用sub的方法
// call的用法
var a1 = add.call(sub, 4, 2);

//call与apply区别在于apply只接受两个参数,call接收多个
```

### 实现继承

```js
function animal(name) {
  this.name = name;
  this.eat = function() {
    console.log(`${this.name} eatting`);
  };
}
function monster(name) {
  this.name = name;
  this.bark = function() {
    console.log(`${this.name} barking`);
  };
}
function dog(name) {
  animal.call(this, name); //animal.apply(this, [name]);
  monster.call(this, name); //monster.apply(this, [name]);
}
var hashiqi = new dog("dude");
hashiqi.eat();
hashiqi.bark();
```

### 一些巧妙的用法

```js
//求数组中的最值
var maxNum = Math.max.apply(null, array); //array为一个数组
//合并两个数组
arr1.concat(arr2); //返回合并后的数组,原数组不变
Array.prototype.push.apply(arr1, arr2); //返回合并数组长度,原数组变为合并后数组成员
```

## this 的使用

### this 要在执行时才能确认值,定义时无法确认

```js
var a = {
  name: "A",
  fn: function() {
    console.log(this.name);
  }
};
a.fn(); //this === a
a.fn.call({ name: "B" }); //this === {name:'B'}
var fn1 = a.fn;
fn1(); //this === window,此时this.name为undefined
```

### 作为构造函数执行 this 指代 new 出的对象

```js
function Foo(name) {
  //this = {};
  this.name = name;
  //return this;
}
```

### 作为对象属性执行 this 指代上级对象

```js
var obj = {
  name: "A",
  printName: function() {
    console.log(this.name); //在此对象中this.name = 'A'
  }
};
```

### 作为普通函数执行 this 指代全局对象

```js
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

fn1.call({ x: 100 }, "zhangsan", 20);
fn1.apply({ x: 100 }, ["zhangsan", 20]);
var fn2 = function(name, age) {
  alert(name);
  console.log(this); //this === {x: 100}
}.bind({ x: 100 }); //bind只能用函数表达式,函数声明不可用,会报错
fn2("zhangsan", 200);
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

## 数组 API

### forEach

遍历数组

接收两个参数:

1. 回调函数(又包含数组中正处理的当前元素,当前元素索引(可选),正在操作的数组(可选))
2. 执行回调函数时用作 this 的值(可选)

```js
var arr = [1, 2, 3];
arr.forEach(function(item, index) {
  console.log(index, item);
});
```

### every

判断所有元素是否都符合条件

```js
var arr = [1, 2, 3];
var result = arr.every(function(item, index) {
  if (item < 4) {
    return true;
  }
});
console.log(result);
```

### some

判断是否至少一个元素符合条件

```js
var arr = [1, 2, 3];
var result = arr.some(function(item, index) {
  if (item < 2) {
    return true;
  }
});
console.log(result);
```

### 数组元素的添加与删除

```js
var arr = [1, 2, 3, 5];

//以下操作会改变原数组

arr.pop(); //末尾删除
arr.shift(); //开头删除
arr.push(0); //末尾添加
arr.unshift(0); //开头添加
```

### slice 与 splice

slice: 接收两个参数,开始索引与结束索引(负值表示从倒数开始);返回两个索引之间的新数组

splice: 接收三个参数,开始索引,要移除的元素个数,要添加的元素;直接对原数组进行修改

```js
var arr1 = arr.slice(0, 2); //返回指定区间数组
arr.splice(1, 2, 3); //从指定位置开始,删除几个元素,添加什么元素
```

### sort

排序

接收一个回调函数为参数(又包括两个用于比较的元素)

```js
var arr = [1, 4, 2, 3, 5];
arr.sort(function(a, b) {
  //从小到大排序
  return a - b;
  //从大到小排序
  //return b - a;
});
console.log(arr);

//实现数组随机排序,排序之后原数组被改变

function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.sort(randomSort);
console.log(arr);

//有一个数组对象,进行升序降序,优先级age>sex>id

var urls = [
  { id: 1, sex: 1, age: 25 },
  { id: 3, sex: 1, age: 25 },
  { id: 2, sex: 0, age: 26 },
  { id: 5, sex: 0, age: 26 },
  { id: 4, sex: 1, age: 27 },
  { id: 6, sex: 1, age: 27 },
  { id: 8, sex: 0, age: 29 },
  { id: 7, sex: 0, age: 20 }
];
urls.sort(function(a, b) {
  var updown = 1;
  if (a.age === b.age) {
    if (a.sex === b.sex) {
      return updown * (a.id - b.id);
    }
    return updown * (a.sex - b.sex);
  }
  return updown * (a.age - b.age);
});
consoe.log(urls);
```

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
