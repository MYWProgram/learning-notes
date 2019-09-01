# JS 中的 this

`this` 在定义的时候是没有值的，只有在调用的时候才可以确定值，并且每次调用值可能不一样；ES2009 引入了 bind 来设置 this 的值，就不用再考虑函数是如何被调用的。ES2015 引入了支持 this 词法解析的箭头函数（在闭合执行环境内设置 this 的值）。

## 全局环境

无论是否在严格模式下，在全局环境下（任何函数体外部）`this` 都指向全局对象。

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

在函数内部，`this` 的值取决于函数被调用的方式。

### 简单调用

下面的代码不是严格模式下，且 `this` 的值不是由该调用设置的，所以 `this` 默认指向全局对象。

```js
function f1() {
  return this;
};
// 浏览器中
console.log(this === window); // Output --> true
// Node.js
console.log(this === global); // true
```

严格模式下， `this` 将保持它进入执行环境的值；所以在严格模式下，如果 `this` 没有被执行环境定义，它将保持为 undefined。

```js
function f2() {
  'use strict';
  return this;
};
console.log(f2() === undefined); // Output --> true
console.log(window.f2() === window); // Output --> true
```

想要把 `this` 的值从一个环境传到另一个，需要使用 `call()` 或 `apply()` 方法。

```js
let obj = {a: "Custom"};
let a = "Global";
function whatsThis(arg) {
  // 这里 this 的值取决于函数的调用方式。
  return this.a;
};
whatsThis(); // Output --> Global
whatsThis.call(obj); // Output --> Custom
whatsThis.apply(obj); // Output --> Custom
```

当一个函数在其主体中使用 `this` 关键字时，可以通过使用函数继承自 `Function.prototype` 的 `call()、apply()` 方法 将 `this` 绑定到调用中的特定对象。

```js
function add(c, d) {
  return this.a + this.b + c + d;
};
let o = {a: 1, b: 2};
console.log(add.call(o, 3, 4)); // 10
console.log(add.apply(o, [3, 4])); // 10
```

使用 `call()、apply()` 时，如果传递给 `this` 的值不是一个对象，JS 内部会使用 ToObject 将其转换为对象。

```js
function bar() {
  console.log(Object.prototype.toString.call(this));
};
// 原始值 7 被隐式转换为对象。
bar.call(7); // [object Number]
```

### bind 方法

调用 `f.bind(someObject)` 会创建一个与 f 具有相同函数体和作用域的函数，但是在这个新函数中， `this` 将被永远绑定到 `bind`  的第一个参数，无论这个函数是怎么被调用的。

```js
function f() {
  return this.a;
};
let g = f.bind({ a: "absolute" });
console.log(g()); // Output --> absolute
let h = g.bind({ a: "fixed" }); // 这段代码 bind 只生效一次
console.log(h()); // Output --> absolute
let o = {a: 37, f: f, g: g, h: h};
console.log(o.f(), o.g(), o.h()); // Output --> 37, absolute, absolute
```

### 箭头函数

箭头函数会默认帮我们绑定外层 `this` 的值。同时不能使用 `call()、apply()、bind()` 修改箭头函数中 `this` 的值。

```js
let globalObject = this;
let foo = () => {
  // 默认绑定外层 this 的值
  return this;
};
console.log(foo() === globalObject); // true
const obj = {foo: foo};
// 使用 call 修改 this 绑定，无效；此时 this 还是指向外层。
console.log(foo.call(obj) === globalObject); // true
// 使用 bind 修改this 绑定，无效。
foo = foo.bind(obj);
console.log(foo() === globalObject); // true
```

### 作为对象的方法

当函数作为对象里的方法被调用时，此时的 `this` 是调用该函数的对象。这种方法不会受函数定义方式或者位置的影响。

分为以下三种方式：

普通的对象方式。

```js
let o = { prop: 37 };
// 函数 i 不论是定义在对象内或外都是一样的
function i() {
  return this.prop;
};
o.f = i;
// 此时函数返回的 prop 来自于对象 o
console.log(o.f()); // 37
```

原型链中的方式。

```js
let o = {
  f: function() {
    return this.a + this.b;
  }
};
let p = Object.create(o);
p.a = 1, p.b = 2;
console.log(p.f()); // Output --> 3
```

`getter` 与 `setter` 中的方式。

```js
function sum() {
  return this.a + this.b + this.c;
};
let o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  }
};
Object.defineProperty(o, 'sum', {
  get: sum, enumerable: true, configurable: true
});
console.log(o.average, o.sum); // Output -->  2, 6
```

### 作为构造函数

当一个函数用作构造函数时（使用 `new` 关键字），它的 `this` 被绑定到正在构造的新对象上。

```js
function C() {
  this.a = 37;
};
let o = new C();
console.log(o.a); // Output -->  37
```

### 作为一个 DOM 事件处理函数

当函数被用作事件处理函数时，它的 `this` 指向触发事件的元素。

```js
function turnBlue(e) {
  console.log(this === e.currentTarget); // 总是为 true
  console.log(this === e.target); // 当 target 和 currentTarget 是同一个对象时为 true
  this.style.backgroundColor = 'blue';
};
let elements = document.getElementByTagName('*');
for(let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', turnBlue, false);
};
```

### 作为一个内联事件处理函数

当代码被内联 on-event 处理函数调用时，它的 `this` 指向监听器所在的 DOM 元素。

```html
<!-- 下面的代码弹出 button，但是只有外层代码中的 this 是这样设置的。 -->
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>

<!-- 下面的代码弹出 window 指向全局，因为没有设置内部函数的 this。 -->
<button onclick="alert((function(){return this})();)">
  Show inner this
</button>
```
