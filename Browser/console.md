# console

## 语义化、分类、分组的打印信息

打印不同种类的信息：

- console.log()：普通信息
- console.info()：提示类信息
- console.warn()：错误信息
- console.error()：警示信息

使用如下两个 console 包裹上面的 console 进行打印的分组：

- console.group("属于什么分类的信息")
- console.groupEnd()

## 打印表格

- console.table()

```js
let data = [{'品名': '印度飞饼', '数量': 4}, {'品名': '巴西薄饼', '数量': 3}];
console.table(data);
```

## 条件判断打印信息

- console.assert()：接收不定参数，逗号分隔；第一个可传 Boolean，第二个为需要打印的信息。只有表达式为假时才输出相应信息到控制台。

```js
let flag = false;
console.assert(flag, "开发中的 log 日志..."); // Assertion failed: 开发中的 log 日志...
```

## 计数打印

```js
function foo(){
  console.count('foo 被执行的次数：');
}
foo();
foo();
foo();
// foo 被执行的次数：1
// foo 被执行的次数：2
// foo 被执行的次数：3
```

## 对象化标签节点信息

- console.dir()：将 DOM 结点以 JavaScript 对象的形式输出到控制台

  console.log 是直接以DOM树的结构进行输出

## 打印代码执行时间

用下面的两个 console 包裹一段代码，可以打印出代码执行的时间；接收参数可以填写信息。

- console.time()
- console.timeEnd()

```js
// 官方提供的时间会准一点
console.time("Array initialize");
var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
  array[i] = new Object();
};
console.timeEnd("Array initialize");

// PloyFill
var start=new Date().getTime();
var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
    array[i] = new Object();
};
console.log(new Date().getTime()-start);
```

# key & values

前者返回传入对象所有属性名组成的数组，后者返回所有属性值组成的数组。

```js
var table = {name: "Mike", gender: "Man", hobby: "opposite to the gender"};
keys(table);
values(table);
```

# monitor & unmonitor

二者都接收一个函数名作为参数，打印出函数的名称及执行时传入的参数。前者开始监听打印，后者停止。

```js
function sayHello(name){
    alert('Hello,'+name);
}
monitor(sayHello);
sayHello('Mike');
unmonitor(sayHello);
sayHello('Mike');
```

# debug & undebug

同样也是接收一个函数名作为参数；当该函数执行时自动断下来以供调试，类似于在该函数的入口处打了个断点；也类似于在代码中写 debugger。后者是解除这个断点。
