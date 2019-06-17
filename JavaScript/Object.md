# 对象 API

## 遍历对象的 API

- for(let/var key in Object)

循环遍历对象自身的和继承的可枚举的属性（不包含 Symbol 属性）。

```js
let obj = {
  x: 100,
  y: 200,
  z: 300
};
for(let key in obj) {
  if(obj.hasOwnProperty(key)) {
    console.log(key: obj[key]); // "x" 100 "y" 200 "z" 300
  }
};
```

- Object.keys(Object)

返回一个由自身对象可枚举属性（不包含继承的和 Symbol）组成的字符串数组，对象无法遍历时将返回由键组成的数组。

```js
/**
 * 纯数组
*/
let arr = [1, 2, 3];
console.log(Object.keys(arr)); // ["1", "2", "3"]
/**
 * 类数组：返回的数组由键组成，并且按 Number 大小排序。
*/
let arr = [0: "a", 100: "b", 2: "c"];
console.log(Object.keys(arr)); // ["0", "2", "100"]
/**
 * 遍历对象：此时返回的不再是数组，但是还是字符串形式的属性。
*/
let obj = {
  0: "a",
  1: "b",
  2: "c"
};
Object.keys(obj).forEach(function(key) {
  console.log(key, obj[key]); // "0" "a" "1" "b" "2" "c"
});
```

- Object.getOwnPropertyNames(Object)

返回对象自身的所有属性组成的字符串数组，包括不可枚举的属性（不包括 Symbol）。该方法不会获取到原型链上的属性。

```js
/**
 * 遍历对象时和上面的类似
*/
/**
 * 遍历不可枚举属性
*/
let obj = Object.create({}, {
  getFoo: {
    function() { return this.foo; },
    // 对象中的方法，设置其为不可枚举。
    enumerable: false
  }
});
obj.foo = 1;
console.log(Object.getOwnPropertyNames(obj).sort()); // ["foo", "getFoo"]
```

- Reflect.ownKeys(target)

返回目标对象自身的属性键组成的数组，包含自身的可枚举、不可枚举属性、继承的和 Symbol。返回值等同于 `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。

```js
console.log(Reflect.ownKeys({z: 3, y: 2, x: 1})); // ["z", "y", "x"]
console.log(Reflect.ownKeys([])); // ["length"]
/**
 * 遍历 Symbol
*/
let sym = Symbol.for("comet");
let sym2 = Symbol.for("metor");
let obj = {[sym]: 0, "str": 0, "773": 0, "0": 0, [sym2]: 0, "-1": 0, "8": 0, "second str": 0};
console.log(Reflect.ownKeys(obj));
// ["0", "8", "773", "str", "-1", "second str", [object Symbol] { ... }, [object Symbol] { ... }]
```
