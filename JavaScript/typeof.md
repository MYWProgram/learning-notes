# typeof

## 基本信息

操作符返回一个字符串，表示未经计算的操作数的类型。

`typeof` 一般用来判断一个变量的类型，例如 `Number、String、Object、Boolean、Function、Undefined、Symbol` ；但是在判断一个 `Object` 时不能准确告诉我们到底是哪一种 `Object` ，所以这种情况下需要使用 `instanceof` 。

```js
let s = new String('123');
console.log(typeof s === 'object'); // Output --> true
console.log(s instanceof String); // Output --> true
```

注意：**不能用于判断数组。**

## 工作原理

首先需要了解 JS 在底层存储变量的时候，会在变量的机器码的低位 1-3 位存储类型信息。 `typeof` 就是读取这三位的低位机器码来进行类型判断。

1. 000：对象。
2. 010：浮点数。
3. 100：字符串。
4. 110：布尔值。
5. 1：整数。
6. null：所有机器码都为 0.
7. undefined：用 -2^30 整数来表示。

也就是因为 `null` 和对象之间的这个冲突，导致了 `typeof` 在判断 `null` 时会返回 `Object` 。

## 其他判断内置类型的方法

`Object.prototype.toString.call()` 。

注意：**判断内置类型。**

```js
Object.prototype.toString.call(1); // Output --> "[object Number]"
Object.prototype.toString.call('hi'); // Output --> "[object String]"
Object.prototype.toString.call({a:'hi'}); // Output --> "[object Object]"
Object.prototype.toString.call([1,'a']); // Output --> "[object Array]"
Object.prototype.toString.call(true); // Output --> "[object Boolean]"
Object.prototype.toString.call(() => {}); // Output --> "[object Function]"
Object.prototype.toString.call(null); // Output --> "[object Null]"
Object.prototype.toString.call(undefined); // Output --> "[object Undefined]"
Object.prototype.toString.call(Symbol(1)); // Output --> "[object Symbol]"
```
