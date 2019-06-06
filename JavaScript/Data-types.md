# JS 数据类型

## JS 基础类型

- String

- Number

- Boolean

- Object（JS 中唯一复杂类型，其余是基本类型）。

  JS 中的对象可以看作一组属性的集合。这些属性还可以被增减；属性的值可以是任意类型，包括具有复杂数据结构的对象。属性使用键来标识，它的键值可以是一个字符串或者符号值（Symbol）

- Undefined

- Null

  Null 本意并不是对象，`typeof null === 'object'`是 JS 第一版中就存在的 bug。

- Symbol（ES2015 新增）

除 Object 外所有类型都是不可变的（值本身不能改变）。

基本类型和复杂类型的区别：基本类型存储的是值，复杂类型存储的是地址（指针）。

```js
//值类型
var a = 10;
var b = a;
a = 11;
console.log(b); //10
//引用类型
var obj1 = { x: 100 };
var obj2 = obj1;
obj1.x = 200;
console.log(obj2.x); //200
```

## typeof 返回的类型

typeof 只能区分值类型的详细类型，以及引用类型中的函数。

```js
typeof undefined; //undefined
typeof "abc"; //string
typeof 123; //number
typeof true; //boolean
typeof {} / [] / null; //Object
typeof console.log; //function
```

除了数组，其余所有类型都可以用 typeof 来判断。

```js
var arr = [];

arr instanceof Array;
Array.isArray(arr);
Array.prototype.isPrototypeOf(arr);
```
