# instanceof

用于测试构造函数的 `prototype` 属性是否出现在对象的原型链中的任何位置；通常用来判断一个实例是否属于某种类型。

接收两个参数：

1. 要检测的对象。
2. 某个构造函数。

返回值：检测结果的布尔值。

要测试对象是否不是某特定构造函数的实例，需要注意代码的书写。

```js
// 正确的写法。
if(!(mycar instanceof Car)) {
  // ...
}
// 下面代码永远为 false，所以不会执行 if 代码块中的东西。
if(!mycar instanceof Car) {
  // ...
}
```

## 使用场景

判断一个实例是否属于某种类型。

```js
const Person = function() {}
const person = new Person();
console.log(person instanceof Person); // output --> true
```

判断一个实例是否是其父类型或祖先类型的实例。

```js
const GrandPa = function() {}
const Father = function() {}
Father.prototype = new GrandPa();
const son = new Father();
console.log(son instanceof Father); // Output --> true
console.log(son instanceof GrandPa); // Output --> true
```

## Polyfill

其实 `instanceof` 主要的实现原理就是只要右边变量的 `prototype` 在左边变量的原型链上即可。

```js
function instanceofSimulation(left, right) {
  // 获取当前要判断类型的原型。
  let prototype =  right.prototype;
  // 获取当前要判断对象的原型。
  left = left.__proto__;
  while(true) {
    // 考虑基础类型以及原型链顶层的情况。
    if(left === null) {
      return false;
    }
    else if(prototype === left) {
      return true;
    }
    else {
      left = left.__proto__;
    }
  }
}
// 测试。
let arr = [1, 2, 3];
console.log(instanceofSimulation(arr, Array)); // Output --> true
let obj = {
  0: 1,
  1: 2,
  2: 3
}
console.log(instanceofSimulation(obj, Object)); // Output --> true
```
