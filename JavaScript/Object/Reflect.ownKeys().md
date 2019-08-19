# 完全遍历对象 Reflect.wonKeys()

返回目标对象自身的属性键组成的数组，包含自身的可枚举、不可枚举属性、继承的和 Symbol。返回值等同于 `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。

```js
console.log(Reflect.ownKeys({z: 3, y: 2, x: 1})); // Output --> ["z", "y", "x"]
console.log(Reflect.ownKeys([])); // Output --> ["length"]
// 遍历 Symbol。
let sym = Symbol.for("comet");
let sym2 = Symbol.for("metor");
let obj = {[sym]: 0, "str": 0, "773": 0, "0": 0, [sym2]: 0, "-1": 0, "8": 0, "second str": 0};
console.log(Reflect.ownKeys(obj)); // Output --> ["0", "8", "773", "str", "-1", "second str", [object Symbol] { ... }, [object Symbol] { ... }]
```
