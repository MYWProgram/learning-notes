# JS 中的 this

this 在定义的时候是没有值的，只有在调用的时候才可以确定值，并且每次调用值可能不一样；ES2009 引入了 bind 来设置 this 的值，就不用再考虑函数是如何让被调用的。ES2015 引入了支持 this 词法解析的箭头函数（在闭合执行环境内设置 this 的值）。

## 全局环境

无论是否在严格模式下，在全局环境下（任何函数体外部）this 都指向全局对象。

```js
/**
 * 在浏览器中，window 对象同时也是全局对象。
*/
console.log(this === window); // true

/**
 * 下面代码证明浏览器全局环境下，this 指向 window。
*/
this.a = "hello";
console.log(window.a); // hello 等价于 console.log(a);
```

## 函数环境

在函数内部，this 的值取决于函数被调用的方式。

- 简单调用

```js
/**
 * 下面的代码不是严格模式下，且 this 的值不是由该调用设置的，所以 this 默认指向全局对象。
*/
function f1() {
  return this;
};
console.log(this === window); // true 浏览器中
console.log(this === global); // true Node中

/**
 * 严格模式下，this 将将保持它进入执行环境的值。
*/
function f2() {
  'use strict';
  return this;
};
console.log(f2() === undefined); // true
console.log(window.f2() === window); // true
// 所以在严格模式下，如果 this 没有被执行环境定义，它将保持为 undefined。

/**
 * 想要把 this 的值从一个环境传到另一个，需要使用 call 或 apply 方法。
*/
let obj = {a: "Custom"};
let a = "Global";
function whatsThis(arg) {
  // 这里 this 的值取决于函数的调用方式
  return this.a;
};
whatsThis(); // Global
whatsThis.call(obj); // Custom
whatsThis.apply(obj); // Custom

/**
 * 当一个函数在其主体中使用 this 关键字时，可以通过使用函数继承自 Function.prototype 的 call、apply 方法 将 this 绑定到调用中的
 * 特定对象。
*/
const add = (c, d) => {
  return this.a + this.b + c + d;
};
let o = {a: 1, b: 2};
console.log(add.call(o, 3, 4)); // 10
console.log(add.apply(o, [3, 4])); // 10

/**
 * 使用 call、apply 时，如果传递给 this 的值不是一个对象，JS内部会使用 ToObject 将其转换为对象。
*/
function bar() {
  console.log(Object.prototype.toString.call(this));
};
// 原始值 7 被隐式转换为对象
bar.call(7); // [object Number]
```
